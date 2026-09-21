import pg from 'pg';
import {
  User,
  Student,
  Teacher,
  SchoolClass,
  Category,
  Report,
  Message,
  ReportStatusHistory,
  Notification,
  EnrichedReport,
  ReportStatus,
  ReportUrgency,
  ReportPrivacy,
  AssignedTo,
  BkTeacherProfile,
  CounselingAppointment
} from '../src/types/database';

import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_CATEGORIES,
  INITIAL_REPORTS,
  INITIAL_MESSAGES,
  INITIAL_STATUS_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MOOD_CHECKS
} from '../src/services/seedData';
import { decryptNip, hashPassword } from '../src/utils/crypto';
import {
  getPrismaClient,
  testPrismaDatabase,
  getPrismaStatus,
  inspectConnectionString,
  getPrismaConnectionString,
  withPrismaRetry
} from './prisma';

const { Pool } = pg;

// Helper to extract sanitized DATABASE_URL from common environment variable names
export function getConnectionString(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.SUPABASE_DATABASE_URL,
    process.env.NEON_DATABASE_URL,
    process.env.DB_URL
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    let trimmed = raw.trim();
    // Strip accidental wrapping quotes (e.g. "postgresql://..." or 'postgresql://...')
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    if (trimmed.length > 0) return trimmed;
  }
  return undefined;
}

// Extract provider and connection details safely without leaking secrets
export function getMaskedDbInfo(connStr?: string) {
  if (!connStr) {
    return {
      hasUrl: false,
      host: 'none',
      port: '-',
      database: 'none',
      provider: 'In-Memory Relational Engine',
      isPooler: false
    };
  }
  try {
    const url = new URL(connStr);
    let provider = 'PostgreSQL';
    if (url.hostname.includes('supabase')) provider = 'Supabase PostgreSQL';
    else if (url.hostname.includes('neon')) provider = 'Neon PostgreSQL';
    else if (url.hostname.includes('aiven')) provider = 'Aiven PostgreSQL';
    else if (url.hostname.includes('render')) provider = 'Render PostgreSQL';
    else if (url.hostname.includes('railway')) provider = 'Railway PostgreSQL';
    else if (url.hostname.includes('tembo')) provider = 'Tembo PostgreSQL';

    const isPooler = url.port === '6543' || url.hostname.includes('pooler');

    return {
      hasUrl: true,
      host: url.hostname,
      port: url.port || '5432',
      database: url.pathname.replace(/^\//, '') || 'postgres',
      provider,
      isPooler
    };
  } catch {
    return {
      hasUrl: true,
      host: 'valid-uri',
      port: '5432',
      database: 'postgres',
      provider: 'PostgreSQL',
      isPooler: false
    };
  }
}

let pool: pg.Pool | null = null;
let isPostgresConnected = false;
let lastDbError: string | null = null;
let lastDbPingMs: number | null = null;
let lastCheckedAt: string | null = null;
let isInitializing = false;

// Fallback in-memory state when DATABASE_URL is not yet provided
interface MemoryStore {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  categories: Category[];
  reports: Report[];
  messages: Message[];
  status_history: ReportStatusHistory[];
  notifications: Notification[];
  announcements: any[];
  mood_checks: any[];
  counseling_appointments: CounselingAppointment[];
}

const memoryStore: MemoryStore = {
  users: JSON.parse(JSON.stringify(INITIAL_USERS)),
  students: JSON.parse(JSON.stringify(INITIAL_STUDENTS)),
  teachers: JSON.parse(JSON.stringify(INITIAL_TEACHERS)),
  classes: JSON.parse(JSON.stringify(INITIAL_CLASSES)),
  categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
  reports: JSON.parse(JSON.stringify(INITIAL_REPORTS)),
  messages: JSON.parse(JSON.stringify(INITIAL_MESSAGES)),
  status_history: JSON.parse(JSON.stringify(INITIAL_STATUS_HISTORY)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
  announcements: JSON.parse(JSON.stringify(INITIAL_ANNOUNCEMENTS)),
  mood_checks: JSON.parse(JSON.stringify(INITIAL_MOOD_CHECKS)),
  counseling_appointments: []
};

export async function initDatabase(): Promise<{ isPostgres: boolean; error?: string }> {
  const connStr = getConnectionString();
  if (!connStr) {
    lastDbError = 'Variabel lingkungan DATABASE_URL / POSTGRES_URL belum diatur di Vercel.';
    isPostgresConnected = false;
    console.log('[ADVOCARE DB] No DATABASE_URL found. Running with high-performance In-Memory relational engine.');
    return { isPostgres: false, error: lastDbError };
  }

  const dbInfo = getMaskedDbInfo(connStr);

  try {
    let isLocalhost = false;
    try {
      const parsed = new URL(connStr);
      isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    } catch {}

    if (pool) {
      try { await pool.end(); } catch {}
      pool = null;
    }

    pool = new Pool({
      connectionString: connStr,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000,
    });

    // Prevent unhandled error crashes on idle clients (critical for serverless / Supabase)
    pool.on('error', (err) => {
      console.warn('[ADVOCARE DB] PostgreSQL client warning (handled gracefully):', err.message);
      lastDbError = err.message;
    });

    const client = await pool.connect();
    try {
      const pingStart = Date.now();
      await client.query('SELECT 1');
      lastDbPingMs = Date.now() - pingStart;
      lastCheckedAt = new Date().toISOString();
      lastDbError = null;
      isPostgresConnected = true;

      console.log(`[ADVOCARE DB] Connected successfully to PostgreSQL (${dbInfo.provider} @ ${dbInfo.host}:${dbInfo.port}) in ${lastDbPingMs}ms!`);

      // Run automatic migration to create tables if they don't exist
      await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT,
        role VARCHAR(20) NOT NULL,
        avatar TEXT,
        phone VARCHAR(30),
        password_changed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        grade VARCHAR(20) NOT NULL,
        major VARCHAR(100) NOT NULL,
        homeroom_teacher_id VARCHAR(50),
        bk_teacher_id VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        nis VARCHAR(50) UNIQUE NOT NULL,
        class_id VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS teachers (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        nip VARCHAR(255) UNIQUE NOT NULL,
        teacher_type VARCHAR(30) NOT NULL,
        specialization VARCHAR(255),
        room VARCHAR(100),
        bio TEXT,
        available_hours VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        assigned_class_ids JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'MessageCircle',
        color VARCHAR(30) DEFAULT 'blue',
        active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(50) PRIMARY KEY,
        report_code VARCHAR(30) UNIQUE NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        assigned_to VARCHAR(30) NOT NULL,
        assigned_teacher_id VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        urgency VARCHAR(20) NOT NULL,
        privacy VARCHAR(20) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'terkirim',
        attachments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(50) PRIMARY KEY,
        report_id VARCHAR(50) NOT NULL,
        sender_id VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS report_status_history (
        id VARCHAR(50) PRIMARY KEY,
        report_id VARCHAR(50) NOT NULL,
        status VARCHAR(30) NOT NULL,
        changed_by VARCHAR(50) NOT NULL,
        note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        report_id VARCHAR(50),
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_mood_checks (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        student_user_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(150) NOT NULL,
        student_nis VARCHAR(50) NOT NULL,
        student_avatar TEXT,
        class_id VARCHAR(50),
        class_name VARCHAR(100),
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        mood VARCHAR(30) NOT NULL,
        mood_score INT DEFAULT 3,
        emotions JSONB DEFAULT '[]'::jsonb,
        trigger TEXT,
        note TEXT,
        needs_counseling BOOLEAN DEFAULT FALSE,
        status VARCHAR(30) DEFAULT 'belum_ditinjau',
        reviewed_by_teacher_id VARCHAR(50),
        reviewed_by_teacher_name VARCHAR(150),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        teacher_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id VARCHAR(50),
        author_user_id VARCHAR(50),
        author_name VARCHAR(150) NOT NULL,
        author_role VARCHAR(50) NOT NULL,
        author_avatar TEXT,
        target_grade VARCHAR(20) DEFAULT 'all',
        target_class_id VARCHAR(50),
        target_class_name VARCHAR(100),
        category VARCHAR(100),
        attachments JSONB DEFAULT '[]'::jsonb,
        link_url TEXT,
        link_title VARCHAR(255),
        image_url TEXT,
        video_url TEXT,
        read_by JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS counseling_appointments (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        student_user_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(150) NOT NULL,
        student_class_name VARCHAR(100),
        teacher_id VARCHAR(50) NOT NULL,
        teacher_user_id VARCHAR(50) NOT NULL,
        teacher_name VARCHAR(150) NOT NULL,
        requested_date VARCHAR(30) NOT NULL,
        requested_time VARCHAR(20) NOT NULL,
        confirmed_date VARCHAR(30),
        confirmed_time VARCHAR(20),
        topic TEXT NOT NULL,
        counseling_type VARCHAR(30) DEFAULT 'tatap_muka',
        status VARCHAR(30) DEFAULT 'menunggu',
        reschedule_reason TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        id VARCHAR(50) PRIMARY KEY,
        school_name VARCHAR(200) NOT NULL,
        school_tagline TEXT,
        reset_password_email VARCHAR(150),
        contact_email VARCHAR(150),
        contact_phone VARCHAR(50),
        address TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Smoothly add any new columns to existing tables
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
      ALTER TABLE classes ADD COLUMN IF NOT EXISTS bk_teacher_id VARCHAR(50);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS room VARCHAR(100);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS available_hours VARCHAR(100);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS assigned_class_ids JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
      ALTER TABLE teachers ALTER COLUMN nip TYPE VARCHAR(255);
      ALTER TABLE reports ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
    `);

      // Fast check: if users are empty, seed only essential admin & categories in a single fast query (<50ms)
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      if (parseInt(userCount.rows[0].count, 10) === 0) {
        console.log('[ADVOCARE DB] Seeding base administrator into PostgreSQL...');
        await client.query(`
          INSERT INTO users (id, name, email, password, password_changed, role, created_at)
          VALUES 
            ('usr-admin-1', 'Administrator SAPA', 'admin@smk.sch.id', '${hashPassword('admin123')}', false, 'admin', CURRENT_TIMESTAMP)
          ON CONFLICT DO NOTHING;

          INSERT INTO categories (id, name, description, icon, color, active) VALUES
            ('cat-1', 'Kesulitan Belajar', 'Kendala materi pelajaran, pemahaman konsep, tugas, atau metode belajar guru', 'BookOpen', 'blue', true),
            ('cat-2', 'Bullying / Perundungan', 'Tindakan intimidasi fisik, verbal, pengucilan, atau cyberbullying', 'AlertTriangle', 'rose', true),
            ('cat-3', 'Masalah Pertemanan', 'Konflik antarteman, adaptasi sosial di kelas, rasa cemas dikucilkan', 'Users', 'amber', true),
            ('cat-4', 'Masukan & Saran', 'Aspirasi fasilitas sekolah, kebersihan, kegiatan ekstrakurikuler, atau KBM', 'Lightbulb', 'emerald', true),
            ('cat-5', 'Masalah Lainnya', 'Kendala personal, keluarga, motivasi diri, atau hal lain yang ingin diceritakan', 'MessageCircle', 'indigo', true)
          ON CONFLICT DO NOTHING;
        `);
      }
    } finally {
      client.release();
    }
    return { isPostgres: true };
  } catch (err: any) {
    console.warn('[ADVOCARE DB] Warning: PostgreSQL connection failed. Falling back to in-memory store:', err.message);
    lastDbError = err.message;
    lastCheckedAt = new Date().toISOString();
    isPostgresConnected = false;
    if (pool) {
      try { await pool.end(); } catch {}
      pool = null;
    }
    return { isPostgres: false, error: err.message };
  }
}

export async function ensureDbInitialized(forceRetry = false): Promise<{ isPostgres: boolean; error?: string }> {
  if (isPostgresConnected && !forceRetry) return { isPostgres: true };

  if (isInitializing) {
    let waitCount = 0;
    while (isInitializing && waitCount < 30) {
      await new Promise(r => setTimeout(r, 100));
      waitCount++;
    }
    if (isPostgresConnected) return { isPostgres: true };
  }

  isInitializing = true;
  try {
    const res = await initDatabase();
    return res;
  } finally {
    isInitializing = false;
  }
}

export function getPool() {
  return pool;
}

export async function testDirectPgConnection(): Promise<{
  success: boolean;
  provider: string;
  host: string;
  port: string;
  database: string;
  isPooler: boolean;
  pingMs?: number;
  error?: string;
  hasDatabaseUrl: boolean;
  timestamp: string;
  warnings: string[];
  recommendations: string[];
  counts?: any;
}> {
  const connStr = getConnectionString();
  const info = inspectConnectionString(connStr);
  const now = new Date().toISOString();

  if (!connStr) {
    return {
      success: false,
      provider: info.provider,
      host: info.host,
      port: info.port,
      database: info.database,
      isPooler: info.isPooler,
      hasDatabaseUrl: false,
      error: 'Variabel lingkungan DATABASE_URL belum diatur di Vercel.',
      timestamp: now,
      warnings: info.warnings,
      recommendations: info.recommendations
    };
  }

  const client = new pg.Client({
    connectionString: connStr,
    ssl: info.host === 'localhost' || info.host === '127.0.0.1' ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 4000
  });

  try {
    const t0 = Date.now();
    await client.connect();
    await client.query('SELECT 1 as ping');
    const ping = Date.now() - t0;
    await client.end();

    return {
      success: true,
      provider: `${info.provider} (Pure JS Driver)`,
      host: info.host,
      port: info.port,
      database: info.database,
      isPooler: info.isPooler,
      hasDatabaseUrl: true,
      pingMs: ping,
      timestamp: now,
      warnings: info.warnings,
      recommendations: info.recommendations
    };
  } catch (err: any) {
    try { await client.end(); } catch {}
    return {
      success: false,
      provider: info.provider,
      host: info.host,
      port: info.port,
      database: info.database,
      isPooler: info.isPooler,
      hasDatabaseUrl: true,
      error: err.message,
      timestamp: now,
      warnings: info.warnings,
      recommendations: info.recommendations
    };
  }
}

export async function testDatabaseConnection() {
  try {
    const prismaResult = await testPrismaDatabase();
    if (prismaResult.success) {
      return prismaResult;
    }
    // If Prisma failed with binary target or engine error, fallback to pg pure JS driver
    if (prismaResult.error && (
      prismaResult.error.includes('Query engine') ||
      prismaResult.error.includes('binaryTarget') ||
      prismaResult.error.includes('PrismaClient') ||
      prismaResult.error.includes('cannot be found')
    )) {
      console.log('[ADVOCARE DB] Prisma engine unavailable, testing via pure JS pg Client...');
      return await testDirectPgConnection();
    }
    return prismaResult;
  } catch (err: any) {
    console.error('[ADVOCARE DB] testDatabaseConnection top-level error:', err);
    try {
      return await testDirectPgConnection();
    } catch {
      return {
        success: false,
        provider: 'PostgreSQL',
        host: 'unknown',
        port: '5432',
        database: 'postgres',
        isPooler: false,
        hasDatabaseUrl: Boolean(getConnectionString()),
        error: err.message || 'Gagal menguji koneksi database',
        timestamp: new Date().toISOString(),
        warnings: ['Terjadi kesalahan saat menguji koneksi.'],
        recommendations: ['Periksa pengaturan DATABASE_URL di Vercel.']
      };
    }
  }
}

export async function getDatabaseStatus() {
  const connStr = getConnectionString();
  const dbInfo = inspectConnectionString(connStr);
  const prismaStatus = getPrismaStatus();

  let counts = { users: 0, classes: 0, teachers: 0, students: 0, reports: 0 };
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const c = await withPrismaRetry(async (client) => {
        const [u, cl, t, s, r] = await Promise.all([
          client.user.count(),
          client.schoolClass.count(),
          client.teacher.count(),
          client.student.count(),
          client.report.count()
        ]);
        return { users: u, classes: cl, teachers: t, students: s, reports: r };
      });
      counts = c;
    } catch {
      // If tables not ready or fallback
      counts = {
        users: memoryStore.users.length,
        classes: memoryStore.classes.length,
        teachers: memoryStore.teachers.length,
        students: memoryStore.students.length,
        reports: memoryStore.reports.length
      };
    }
  } else if (isPostgresConnected && pool) {
    try {
      const [uRes, cRes, tRes, sRes, rRes] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM classes'),
        pool.query('SELECT COUNT(*) FROM teachers'),
        pool.query('SELECT COUNT(*) FROM students'),
        pool.query('SELECT COUNT(*) FROM reports')
      ]);
      counts = {
        users: parseInt(uRes.rows[0]?.count || '0', 10),
        classes: parseInt(cRes.rows[0]?.count || '0', 10),
        teachers: parseInt(tRes.rows[0]?.count || '0', 10),
        students: parseInt(sRes.rows[0]?.count || '0', 10),
        reports: parseInt(rRes.rows[0]?.count || '0', 10)
      };
    } catch (e: any) {
      console.warn('[ADVOCARE DB] Failed to query table counts from Postgres:', e.message);
    }
  } else {
    counts = {
      users: memoryStore.users.length,
      classes: memoryStore.classes.length,
      teachers: memoryStore.teachers.length,
      students: memoryStore.students.length,
      reports: memoryStore.reports.length
    };
  }

  const isConnected = prismaStatus.connected || isPostgresConnected;

  return {
    engine: isConnected ? `Prisma ORM (${dbInfo.provider})` : 'In-Memory Relational Engine',
    connected: isConnected || true,
    isPostgres: isConnected,
    isPrisma: Boolean(prismaStatus.connected),
    hasDatabaseUrl: Boolean(connStr),
    provider: dbInfo.provider,
    host: dbInfo.host,
    port: dbInfo.port,
    isPooler: dbInfo.isPooler,
    isSupabaseDirectV6: dbInfo.isSupabaseDirectV6,
    pingMs: prismaStatus.pingMs ?? lastDbPingMs,
    lastError: prismaStatus.lastError ?? lastDbError,
    lastCheckedAt: prismaStatus.lastCheckedAt ?? lastCheckedAt,
    warnings: dbInfo.warnings,
    recommendations: dbInfo.recommendations,
    counts
  };
}

export async function updateUserPassword(
  userId: string,
  newHashedPassword: string,
  passwordChanged = true
): Promise<User | null> {
  if (isPostgresConnected && pool) {
    const res = await pool.query(
      'UPDATE users SET password = $1, password_changed = $2 WHERE id = $3 RETURNING *',
      [newHashedPassword, passwordChanged, userId]
    );
    if (res.rows.length > 0) {
      const mUser = memoryStore.users.find(u => u.id === userId);
      if (mUser) {
        mUser.password = newHashedPassword;
        mUser.password_changed = passwordChanged;
      }
      return res.rows[0];
    }
    return null;
  }

  const user = memoryStore.users.find(u => u.id === userId);
  if (!user) return null;
  user.password = newHashedPassword;
  user.password_changed = passwordChanged;
  return user;
}

// ==========================================
// DATA ACCESS METHODS
// ==========================================

export async function getUsers(): Promise<User[]> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
    return res.rows;
  }
  return memoryStore.users;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const lower = email.trim().toLowerCase();
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [lower]);
    if (res.rows[0]) return res.rows[0];
    if (['admin@sapa.sch.id', 'admin@smk.sch.id', 'admin@advocare.test', 'admin@sapa.test', 'admin'].includes(lower)) {
      const adminRes = await pool.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
      if (adminRes.rows[0]) return adminRes.rows[0];
    }
    return null;
  }
  const user = memoryStore.users.find(u => u.email.toLowerCase() === lower);
  if (user) return user;
  if (['admin@sapa.sch.id', 'admin@smk.sch.id', 'admin@advocare.test', 'admin@sapa.test', 'admin'].includes(lower)) {
    const adminUser = memoryStore.users.find(u => u.role === 'admin');
    if (adminUser) return adminUser;
  }
  return null;
}

export async function getUserByIdentifier(identifier: string): Promise<User | null> {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  // 0. Check admin aliases
  if (['admin', 'admin@sapa.sch.id', 'admin@smk.sch.id', 'admin@advocare.test', 'admin@sapa.test', 'administrator'].includes(lower)) {
    if (isPostgresConnected && pool) {
      const adminRes = await pool.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
      if (adminRes.rows[0]) return adminRes.rows[0];
    }
    const adminUser = memoryStore.users.find(u => u.role === 'admin');
    if (adminUser) return adminUser;
  }

  // 1. Check direct email match
  const byEmail = await getUserByEmail(trimmed);
  if (byEmail) return byEmail;

  // 2. Check student NIS
  let studentUserId: string | null = null;
  if (isPostgresConnected && pool) {
    const sRes = await pool.query('SELECT user_id FROM students WHERE LOWER(nis) = LOWER($1) LIMIT 1', [trimmed]);
    if (sRes.rows[0]) studentUserId = sRes.rows[0].user_id;
  } else {
    const s = memoryStore.students.find(s => s.nis.toLowerCase() === trimmed.toLowerCase());
    if (s) studentUserId = s.user_id;
  }
  if (studentUserId) {
    const user = await getUserById(studentUserId);
    if (user) return user;
  }

  // 3. Check teacher NIP (supporting encrypted or plain NIP)
  const cleanInput = trimmed.replace(/\s+/g, '');
  let teacher: Teacher | undefined;
  if (isPostgresConnected && pool) {
    const tRes = await pool.query('SELECT * FROM teachers');
    teacher = tRes.rows.find((t: Teacher) => {
      const plainNip = decryptNip(t.nip || '').replace(/\s+/g, '');
      const rawNip = (t.nip || '').replace(/\s+/g, '');
      return plainNip === cleanInput || rawNip === cleanInput;
    });
  } else {
    teacher = memoryStore.teachers.find(t => {
      const plainNip = decryptNip(t.nip || '').replace(/\s+/g, '');
      const rawNip = (t.nip || '').replace(/\s+/g, '');
      return plainNip === cleanInput || rawNip === cleanInput;
    });
  }
  if (teacher) {
    const user = await getUserById(teacher.user_id);
    if (user) return user;
  }

  // 4. Check user ID
  const byId = await getUserById(trimmed);
  if (byId) return byId;

  // 5. Check user Name (case-insensitive)
  const byName = memoryStore.users.find(u => u.name.toLowerCase() === trimmed.toLowerCase());
  if (byName) return byName;

  return null;
}

export async function getUserById(id: string): Promise<User | null> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  return memoryStore.users.find(u => u.id === id) || null;
}

export async function getStudentByUserId(userId: string): Promise<Student | null> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM students WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  }
  return memoryStore.students.find(s => s.user_id === userId) || null;
}

export async function getTeacherByUserId(userId: string): Promise<Teacher | null> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM teachers WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  }
  return memoryStore.teachers.find(t => t.user_id === userId) || null;
}

export async function getClasses(): Promise<SchoolClass[]> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM classes ORDER BY grade, name ASC');
    return res.rows;
  }
  return memoryStore.classes;
}

export async function getStudents(): Promise<Student[]> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM students ORDER BY nis ASC');
    return res.rows;
  }
  return memoryStore.students;
}

export async function getTeachers(): Promise<Teacher[]> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM teachers ORDER BY id ASC');
    return res.rows.map(r => ({
      ...r,
      assigned_class_ids: Array.isArray(r.assigned_class_ids)
        ? r.assigned_class_ids
        : (typeof r.assigned_class_ids === 'string' ? JSON.parse(r.assigned_class_ids) : [])
    }));
  }
  return memoryStore.teachers;
}

export async function getAnnouncements(): Promise<any[]> {
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
      return res.rows.map(r => ({
        ...r,
        attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments) : (r.attachments || []),
        read_by: typeof r.read_by === 'string' ? JSON.parse(r.read_by) : (r.read_by || [])
      }));
    } catch {
      return [];
    }
  }
  return memoryStore.announcements;
}

export async function createAnnouncement(data: any): Promise<any> {
  const id = data.id || `anc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const now = new Date().toISOString();
  const newAnc = {
    id,
    title: data.title,
    content: data.content,
    author_id: data.author_id || data.author_user_id || 'system',
    author_user_id: data.author_user_id || data.author_id || 'system',
    author_name: data.author_name || 'Bimbingan Konseling',
    author_role: data.author_role || 'Guru BK',
    author_avatar: data.author_avatar || null,
    target_grade: data.target_grade || 'all',
    target_class_id: data.target_class_id || null,
    target_class_name: data.target_class_name || null,
    category: data.category || 'Bimbingan Konseling',
    attachments: data.attachments || [],
    link_url: data.link_url || null,
    link_title: data.link_title || null,
    image_url: data.image_url || null,
    video_url: data.video_url || null,
    read_by: data.read_by || [],
    created_at: data.created_at || now,
    updated_at: data.updated_at || now
  };

  if (isPostgresConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO announcements (
          id, title, content, author_id, author_user_id, author_name, author_role, author_avatar,
          target_grade, target_class_id, target_class_name, category, attachments, link_url, link_title,
          image_url, video_url, read_by, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          target_grade = EXCLUDED.target_grade,
          target_class_id = EXCLUDED.target_class_id,
          target_class_name = EXCLUDED.target_class_name,
          category = EXCLUDED.category,
          attachments = EXCLUDED.attachments,
          link_url = EXCLUDED.link_url,
          link_title = EXCLUDED.link_title,
          image_url = EXCLUDED.image_url,
          video_url = EXCLUDED.video_url,
          updated_at = EXCLUDED.updated_at`,
        [
          newAnc.id, newAnc.title, newAnc.content, newAnc.author_id, newAnc.author_user_id,
          newAnc.author_name, newAnc.author_role, newAnc.author_avatar, newAnc.target_grade,
          newAnc.target_class_id, newAnc.target_class_name, newAnc.category,
          JSON.stringify(newAnc.attachments), newAnc.link_url, newAnc.link_title,
          newAnc.image_url, newAnc.video_url, JSON.stringify(newAnc.read_by),
          newAnc.created_at, newAnc.updated_at
        ]
      );
    } catch (err) {
      console.error('Failed to insert announcement into postgres:', err);
    }
  }

  // Update memory store as well
  const idx = memoryStore.announcements.findIndex((a: any) => a.id === id);
  if (idx !== -1) {
    memoryStore.announcements[idx] = newAnc;
  } else {
    memoryStore.announcements.unshift(newAnc);
  }

  return newAnc;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (isPostgresConnected && pool) {
    try {
      await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    } catch (err) {
      console.error('Failed to delete announcement from postgres:', err);
    }
  }
  memoryStore.announcements = memoryStore.announcements.filter((a: any) => a.id !== id);
  return true;
}

export async function updateAnnouncement(id: string, updates: any): Promise<any> {
  const now = new Date().toISOString();
  if (isPostgresConnected && pool) {
    try {
      if (updates.title || updates.content) {
        await pool.query(
          `UPDATE announcements SET
            title = COALESCE($1, title),
            content = COALESCE($2, content),
            target_grade = COALESCE($3, target_grade),
            target_class_id = COALESCE($4, target_class_id),
            category = COALESCE($5, category),
            link_url = COALESCE($6, link_url),
            link_title = COALESCE($7, link_title),
            image_url = COALESCE($8, image_url),
            video_url = COALESCE($9, video_url),
            attachments = CASE WHEN $10::text IS NOT NULL THEN $10::jsonb ELSE attachments END,
            read_by = CASE WHEN $11::text IS NOT NULL THEN $11::jsonb ELSE read_by END,
            updated_at = $12
          WHERE id = $13`,
          [
            updates.title || null,
            updates.content || null,
            updates.target_grade || null,
            updates.target_class_id || null,
            updates.category || null,
            updates.link_url || null,
            updates.link_title || null,
            updates.image_url || null,
            updates.video_url || null,
            updates.attachments ? JSON.stringify(updates.attachments) : null,
            updates.read_by ? JSON.stringify(updates.read_by) : null,
            now,
            id
          ]
        );
      }
    } catch (err) {
      console.error('Failed to update announcement in postgres:', err);
    }
  }

  const anc = memoryStore.announcements.find((a: any) => a.id === id);
  if (anc) {
    Object.assign(anc, updates, { updated_at: now });
    return anc;
  }
  return null;
}

export async function getAllMessages(): Promise<Message[]> {
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query('SELECT * FROM messages ORDER BY created_at ASC');
      return res.rows;
    } catch {
      return [];
    }
  }
  return memoryStore.messages;
}

export async function getReportMessages(reportId: string): Promise<Message[]> {
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query('SELECT * FROM messages WHERE report_id = $1 ORDER BY created_at ASC', [reportId]);
      return res.rows;
    } catch {
      return [];
    }
  }
  return memoryStore.messages.filter(m => m.report_id === reportId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export async function getMoodChecks(): Promise<any[]> {
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query('SELECT * FROM student_mood_checks ORDER BY created_at DESC');
      return res.rows;
    } catch {
      return [];
    }
  }
  return memoryStore.mood_checks;
}

export async function getFullDatabaseState() {
  const [users, students, teachers, classes, categories, reports, announcements, moodChecks, messages, counselingAppointments] = await Promise.all([
    getUsers(),
    getStudents(),
    getTeachers(),
    getClasses(),
    getCategories(),
    getReports(),
    getAnnouncements(),
    getMoodChecks(),
    getAllMessages(),
    getCounselingAppointments()
  ]);
  return {
    users,
    students,
    teachers,
    classes,
    categories,
    reports,
    announcements,
    messages,
    mood_checks: moodChecks,
    counseling_appointments: counselingAppointments,
    isPostgres: isPostgresConnected
  };
}

export async function getCategories(): Promise<Category[]> {
  if (isPostgresConnected && pool) {
    const res = await pool.query('SELECT * FROM categories WHERE active = TRUE ORDER BY name ASC');
    return res.rows;
  }
  return memoryStore.categories.filter(c => c.active);
}

export async function createCategory(cat: Omit<Category, 'id'>): Promise<Category> {
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    active: true
  };
  if (isPostgresConnected && pool) {
    await pool.query(
      'INSERT INTO categories (id, name, description, icon, color, active) VALUES ($1, $2, $3, $4, $5, $6)',
      [newCat.id, newCat.name, newCat.description, newCat.icon, newCat.color, newCat.active]
    );
    return newCat;
  }
  memoryStore.categories.push(newCat);
  return newCat;
}

// Enrich a report with student info, category, and message counts
export function enrichReport(
  report: Report,
  categories: Category[],
  students: Student[],
  users: User[],
  classes: SchoolClass[],
  messages: Message[],
  teachers: Teacher[]
): EnrichedReport {
  const category = categories.find(c => c.id === report.category_id) || {
    id: 'unknown',
    name: 'Kategori Umum',
    description: '',
    icon: 'MessageCircle',
    color: 'blue',
    active: true
  };

  const student = students.find(s => s.id === report.student_id);
  const studentUser = student ? users.find(u => u.id === student.user_id) : null;
  const studentClass = student ? classes.find(c => c.id === student.class_id) : null;

  const isAnonymous = report.privacy === 'anonim';
  const reportMessages = messages.filter(m => m.report_id === report.id);
  const unreadCount = reportMessages.filter(m => !m.is_read).length;

  let assignedTeacherLabel = report.assigned_to === 'guru_bk' ? 'Guru Bimbingan Konseling' : 'Wali Kelas';
  let specificName: string | undefined = undefined;
  let specificAvatar: string | undefined = undefined;
  let specificRoom: string | undefined = undefined;

  if (report.assigned_teacher_id) {
    const specificT = teachers.find(t => t.user_id === report.assigned_teacher_id || t.id === report.assigned_teacher_id);
    if (specificT) {
      const u = users.find(usr => usr.id === specificT.user_id);
      if (u) {
        specificName = u.name;
        specificAvatar = u.avatar;
        specificRoom = specificT.room;
      }
    }
  }

  const assignedTeacher = teachers.find(t => t.teacher_type === report.assigned_to);
  const assignedTeacherUser = assignedTeacher ? users.find(u => u.id === assignedTeacher.user_id) : null;

  const attachments = typeof report.attachments === 'string'
    ? (() => { try { return JSON.parse(report.attachments); } catch { return []; } })()
    : (report.attachments || []);

  return {
    ...report,
    attachments,
    category,
    student: {
      nis: isAnonymous ? 'RAHASIA' : (student?.nis || '-'),
      name: isAnonymous ? 'Siswa Anonim' : (studentUser?.name || 'Siswa'),
      class_name: studentClass?.name || 'Kelas Terdaftar',
      is_anonymous: isAnonymous
    },
    assigned_teacher: {
      name: specificName || assignedTeacherUser?.name || (report.assigned_to === 'guru_bk' ? 'Tim Guru BK' : 'Wali Kelas'),
      role_label: assignedTeacherLabel,
      specific_name: specificName,
      avatar: specificAvatar,
      room: specificRoom
    },
    messages_count: reportMessages.length,
    unread_messages_count: unreadCount
  };
}

export async function getReports(filter?: {
  userId?: string;
  role?: string;
  teacherType?: string;
  classId?: string;
}): Promise<EnrichedReport[]> {
  let reports: Report[] = [];
  let categories: Category[] = [];
  let students: Student[] = [];
  let users: User[] = [];
  let classes: SchoolClass[] = [];
  let messages: Message[] = [];
  let teachers: Teacher[] = [];

  if (isPostgresConnected && pool) {
    const rRes = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    const cRes = await pool.query('SELECT * FROM categories');
    const sRes = await pool.query('SELECT * FROM students');
    const uRes = await pool.query('SELECT * FROM users');
    const clRes = await pool.query('SELECT * FROM classes');
    const mRes = await pool.query('SELECT * FROM messages');
    const tRes = await pool.query('SELECT * FROM teachers');

    reports = rRes.rows.map(r => ({
      ...r,
      attachments: typeof r.attachments === 'string'
        ? (() => { try { return JSON.parse(r.attachments); } catch { return []; } })()
        : (r.attachments || [])
    }));
    categories = cRes.rows;
    students = sRes.rows;
    users = uRes.rows;
    classes = clRes.rows;
    messages = mRes.rows;
    teachers = tRes.rows;
  } else {
    reports = memoryStore.reports;
    categories = memoryStore.categories;
    students = memoryStore.students;
    users = memoryStore.users;
    classes = memoryStore.classes;
    messages = memoryStore.messages;
    teachers = memoryStore.teachers;
  }

  // Filter based on role permissions
  if (filter?.role === 'siswa' && filter.userId) {
    const student = students.find(s => s.user_id === filter.userId);
    if (student) {
      reports = reports.filter(r => r.student_id === student.id);
    } else {
      reports = [];
    }
  } else if (filter?.role === 'guru') {
    if (filter.teacherType === 'wali_kelas' && filter.classId) {
      const classStudents = students.filter(s => s.class_id === filter.classId).map(s => s.id);
      reports = reports.filter(r =>
        (r.assigned_to === 'wali_kelas' && classStudents.includes(r.student_id)) ||
        (r.urgency === 'tinggi' && classStudents.includes(r.student_id))
      );
    } else if (filter.teacherType === 'guru_bk') {
      reports = reports.filter(r => r.assigned_to === 'guru_bk' || r.urgency === 'tinggi');
    }
  }

  return reports.map(r => enrichReport(r, categories, students, users, classes, messages, teachers));
}

export async function getReportById(id: string): Promise<{
  report: EnrichedReport | null;
  messages: Message[];
  status_history: ReportStatusHistory[];
}> {
  let rawReport: Report | null = null;
  let categories: Category[] = [];
  let students: Student[] = [];
  let users: User[] = [];
  let classes: SchoolClass[] = [];
  let messages: Message[] = [];
  let history: ReportStatusHistory[] = [];
  let teachers: Teacher[] = [];

  if (isPostgresConnected && pool) {
    const rRes = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    rawReport = rRes.rows[0] || null;
    if (rawReport) {
      rawReport.attachments = typeof rawReport.attachments === 'string'
        ? (() => { try { return JSON.parse(rawReport.attachments); } catch { return []; } })()
        : (rawReport.attachments || []);

      const cRes = await pool.query('SELECT * FROM categories');
      const sRes = await pool.query('SELECT * FROM students');
      const uRes = await pool.query('SELECT * FROM users');
      const clRes = await pool.query('SELECT * FROM classes');
      const mRes = await pool.query('SELECT * FROM messages WHERE report_id = $1 ORDER BY created_at ASC', [id]);
      const hRes = await pool.query('SELECT * FROM report_status_history WHERE report_id = $1 ORDER BY created_at ASC', [id]);
      const tRes = await pool.query('SELECT * FROM teachers');

      categories = cRes.rows;
      students = sRes.rows;
      users = uRes.rows;
      classes = clRes.rows;
      messages = mRes.rows;
      history = hRes.rows;
      teachers = tRes.rows;
    }
  } else {
    rawReport = memoryStore.reports.find(r => r.id === id) || null;
    if (rawReport) {
      categories = memoryStore.categories;
      students = memoryStore.students;
      users = memoryStore.users;
      classes = memoryStore.classes;
      messages = memoryStore.messages.filter(m => m.report_id === id);
      history = memoryStore.status_history.filter(h => h.report_id === id);
      teachers = memoryStore.teachers;
    }
  }

  if (!rawReport) {
    return { report: null, messages: [], status_history: [] };
  }

  const enriched = enrichReport(rawReport, categories, students, users, classes, messages, teachers);
  return { report: enriched, messages, status_history: history };
}

export async function createReport(data: {
  id?: string;
  userId: string;
  category_id: string;
  assigned_to: AssignedTo;
  assigned_teacher_id?: string | null;
  title: string;
  description: string;
  urgency: ReportUrgency;
  privacy: ReportPrivacy;
  attachments?: any[];
}): Promise<Report> {
  let studentId = 'std-1';

  if (isPostgresConnected && pool) {
    const sRes = await pool.query('SELECT id FROM students WHERE user_id = $1', [data.userId]);
    if (sRes.rows.length > 0) studentId = sRes.rows[0].id;
  } else {
    const s = memoryStore.students.find(std => std.user_id === data.userId);
    if (s) studentId = s.id;
  }

  const count = isPostgresConnected && pool
    ? (await pool.query('SELECT COUNT(*) FROM reports')).rows[0].count
    : memoryStore.reports.length;

  const reportCode = `AC-${String(parseInt(count, 10) + 1).padStart(5, '0')}`;
  const now = new Date().toISOString();
  const reportId = data.id || `rep-${Date.now()}`;
  const attachments = data.attachments || [];

  const newReport: Report = {
    id: reportId,
    report_code: reportCode,
    student_id: studentId,
    category_id: data.category_id,
    assigned_to: data.assigned_to,
    assigned_teacher_id: data.assigned_teacher_id || null,
    title: data.title,
    description: data.description,
    urgency: data.urgency,
    privacy: data.privacy,
    status: 'terkirim',
    attachments,
    created_at: now,
    updated_at: now
  };

  const initialHistory: ReportStatusHistory = {
    id: `h-${Date.now()}`,
    report_id: reportId,
    status: 'terkirim',
    changed_by: data.userId,
    note: 'Laporan baru diajukan oleh siswa',
    created_at: now
  };

  if (isPostgresConnected && pool) {
    await pool.query(
      `INSERT INTO reports (id, report_code, student_id, category_id, assigned_to, assigned_teacher_id, title, description, urgency, privacy, status, attachments, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        newReport.id, newReport.report_code, newReport.student_id, newReport.category_id,
        newReport.assigned_to, newReport.assigned_teacher_id, newReport.title, newReport.description, newReport.urgency,
        newReport.privacy, newReport.status, JSON.stringify(attachments), newReport.created_at, newReport.updated_at
      ]
    );
    await pool.query(
      `INSERT INTO report_status_history (id, report_id, status, changed_by, note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [initialHistory.id, initialHistory.report_id, initialHistory.status, initialHistory.changed_by, initialHistory.note, initialHistory.created_at]
    );
  } else {
    memoryStore.reports.unshift(newReport);
    memoryStore.status_history.push(initialHistory);
  }

  return newReport;
}

export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  changedByUserId: string,
  note?: string
): Promise<Report | null> {
  const now = new Date().toISOString();
  const historyId = `h-${Date.now()}`;

  if (isPostgresConnected && pool) {
    const updateRes = await pool.query(
      `UPDATE reports
       SET status = $1, updated_at = $2, closed_at = $3
       WHERE id = $4 RETURNING *`,
      [newStatus, now, newStatus === 'selesai' ? now : null, reportId]
    );
    if (updateRes.rows.length === 0) return null;

    await pool.query(
      `INSERT INTO report_status_history (id, report_id, status, changed_by, note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [historyId, reportId, newStatus, changedByUserId, note || `Status diperbarui menjadi ${newStatus}`, now]
    );

    return updateRes.rows[0];
  } else {
    const report = memoryStore.reports.find(r => r.id === reportId);
    if (!report) return null;

    report.status = newStatus;
    report.updated_at = now;
    if (newStatus === 'selesai') report.closed_at = now;

    memoryStore.status_history.push({
      id: historyId,
      report_id: reportId,
      status: newStatus,
      changed_by: changedByUserId,
      note: note || `Status diperbarui menjadi ${newStatus}`,
      created_at: now
    });

    return report;
  }
}

export async function reassignReport(
  reportId: string,
  assignedTo: 'guru_bk' | 'wali_kelas',
  assignedTeacherId: string,
  customNote?: string
): Promise<boolean> {
  const now = new Date().toISOString();
  const historyId = `h-reassign-${Date.now()}`;

  if (isPostgresConnected && pool) {
    const updateRes = await pool.query(
      `UPDATE reports
       SET assigned_to = $1, assigned_teacher_id = $2, updated_at = $3
       WHERE id = $4 RETURNING *`,
      [assignedTo, assignedTeacherId, now, reportId]
    );
    if (updateRes.rows.length === 0) return false;

    await pool.query(
      `INSERT INTO report_status_history (id, report_id, status, changed_by, note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        historyId,
        reportId,
        updateRes.rows[0].status || 'dibaca',
        'admin',
        customNote || `Penanganan laporan dialihkan ke ${assignedTo === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'}`,
        now
      ]
    );
    return true;
  } else {
    const report = memoryStore.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.assigned_to = assignedTo;
    report.assigned_teacher_id = assignedTeacherId;
    report.updated_at = now;

    memoryStore.status_history.push({
      id: historyId,
      report_id: reportId,
      status: report.status,
      changed_by: 'admin',
      note: customNote || `Penanganan laporan dialihkan ke ${assignedTo === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'}`,
      created_at: now
    });
    return true;
  }
}

export async function deleteReport(reportId: string): Promise<boolean> {
  if (isPostgresConnected && pool) {
    await pool.query('DELETE FROM messages WHERE report_id = $1', [reportId]);
    await pool.query('DELETE FROM report_status_history WHERE report_id = $1', [reportId]);
    await pool.query('DELETE FROM notifications WHERE report_id = $1', [reportId]);
    const res = await pool.query('DELETE FROM reports WHERE id = $1', [reportId]);
    return (res.rowCount ?? 0) > 0;
  } else {
    const idx = memoryStore.reports.findIndex(r => r.id === reportId);
    if (idx === -1) return false;
    memoryStore.reports.splice(idx, 1);
    memoryStore.messages = memoryStore.messages.filter(m => m.report_id !== reportId);
    memoryStore.status_history = memoryStore.status_history.filter(sh => sh.report_id !== reportId);
    memoryStore.notifications = memoryStore.notifications.filter(n => n.report_id !== reportId);
    return true;
  }
}

export async function addMessage(
  reportId: string,
  senderId: string,
  messageText: string
): Promise<Message> {
  // Check if sender is student and teacher already changed report status
  let senderRole: string | undefined;
  let reportStatus: string | undefined;

  if (isPostgresConnected && pool) {
    const uRes = await pool.query('SELECT role FROM users WHERE id = $1', [senderId]);
    senderRole = uRes.rows[0]?.role;
    const rRes = await pool.query('SELECT status FROM reports WHERE id = $1', [reportId]);
    reportStatus = rRes.rows[0]?.status;
  } else {
    senderRole = memoryStore.users.find(u => u.id === senderId)?.role;
    reportStatus = memoryStore.reports.find(r => r.id === reportId)?.status;
  }

  if (
    senderRole === 'siswa' &&
    reportStatus &&
    (reportStatus === 'direspons' || reportStatus === 'ditindaklanjuti' || reportStatus === 'selesai')
  ) {
    throw new Error('Siswa tidak dapat mengirim pesan karena status laporan telah diubah oleh guru.');
  }

  const now = new Date().toISOString();
  const messageId = `msg-${Date.now()}`;

  const newMsg: Message = {
    id: messageId,
    report_id: reportId,
    sender_id: senderId,
    message: messageText,
    created_at: now,
    is_read: false
  };

  if (isPostgresConnected && pool) {
    await pool.query(
      `INSERT INTO messages (id, report_id, sender_id, message, created_at, is_read)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newMsg.id, newMsg.report_id, newMsg.sender_id, newMsg.message, newMsg.created_at, newMsg.is_read]
    );
    await pool.query('UPDATE reports SET updated_at = $1 WHERE id = $2', [now, reportId]);
  } else {
    memoryStore.messages.push(newMsg);
    const rep = memoryStore.reports.find(r => r.id === reportId);
    if (rep) rep.updated_at = now;
  }

  return newMsg;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  if (isPostgresConnected && pool) {
    const res = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30',
      [userId]
    );
    return res.rows;
  }
  return memoryStore.notifications.filter(n => n.user_id === userId);
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (isPostgresConnected && pool) {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
    return true;
  }
  const notif = memoryStore.notifications.find(n => n.id === id);
  if (notif) notif.is_read = true;
  return true;
}

export async function getDashboardStats() {
  let reports: Report[] = [];
  let categories: Category[] = [];

  if (isPostgresConnected && pool) {
    const rRes = await pool.query('SELECT * FROM reports');
    const cRes = await pool.query('SELECT * FROM categories');
    reports = rRes.rows;
    categories = cRes.rows;
  } else {
    reports = memoryStore.reports;
    categories = memoryStore.categories;
  }

  const total = reports.length;
  const completed = reports.filter(r => r.status === 'selesai').length;
  const inProgress = reports.filter(r => r.status === 'ditindaklanjuti' || r.status === 'direspons').length;
  const newReports = reports.filter(r => r.status === 'terkirim' || r.status === 'dibaca').length;

  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    color: cat.color,
    count: reports.filter(r => r.category_id === cat.id).length
  }));

  const urgencyCounts = {
    tinggi: reports.filter(r => r.urgency === 'tinggi').length,
    sedang: reports.filter(r => r.urgency === 'sedang').length,
    rendah: reports.filter(r => r.urgency === 'rendah').length
  };

  return {
    total,
    completed,
    inProgress,
    newReports,
    resolutionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    categoryCounts,
    urgencyCounts
  };
}

export async function resetDatabase() {
  if (isPostgresConnected && pool) {
    await pool.query('DELETE FROM student_mood_checks');
    await pool.query('DELETE FROM announcements');
    await pool.query('DELETE FROM notifications');
    await pool.query('DELETE FROM report_status_history');
    await pool.query('DELETE FROM messages');
    await pool.query('DELETE FROM reports');
    await pool.query('DELETE FROM students');
    await pool.query('DELETE FROM teachers');
    await pool.query('DELETE FROM classes');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users');
    console.log('[ADVOCARE DB] PostgreSQL database reset and reseeding...');
    await initDatabase();
  } else {
    memoryStore.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    memoryStore.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    memoryStore.teachers = JSON.parse(JSON.stringify(INITIAL_TEACHERS));
    memoryStore.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
    memoryStore.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    memoryStore.reports = JSON.parse(JSON.stringify(INITIAL_REPORTS));
    memoryStore.messages = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
    memoryStore.status_history = JSON.parse(JSON.stringify(INITIAL_STATUS_HISTORY));
    memoryStore.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    memoryStore.announcements = JSON.parse(JSON.stringify(INITIAL_ANNOUNCEMENTS));
    memoryStore.mood_checks = JSON.parse(JSON.stringify(INITIAL_MOOD_CHECKS));
  }
  return { success: true, message: 'Database reset successfully' };
}

export async function getBkTeachers(): Promise<BkTeacherProfile[]> {
  let teachers: Teacher[] = [];
  let users: User[] = [];

  if (isPostgresConnected && pool) {
    const tRes = await pool.query('SELECT * FROM teachers WHERE teacher_type = $1', ['guru_bk']);
    const uRes = await pool.query('SELECT * FROM users WHERE role = $1', ['guru']);
    teachers = tRes.rows;
    users = uRes.rows;
  } else {
    teachers = memoryStore.teachers.filter(t => t.teacher_type === 'guru_bk');
    users = memoryStore.users;
  }

  return teachers.map((t, idx) => {
    const u = users.find(usr => usr.id === t.user_id);
    const statuses: ('tersedia' | 'konseling' | 'istirahat')[] = ['tersedia', 'tersedia', 'tersedia'];
    return {
      teacher_id: t.id,
      user_id: t.user_id,
      name: u ? u.name : 'Guru BK',
      nip: t.nip,
      email: u ? u.email : '',
      avatar: u?.avatar || '',
      phone: u?.phone || '',
      specialization: t.specialization || 'Konseling Pribadi & Bimbingan Belajar',
      room: t.room || 'Ruang BK',
      bio: t.bio || 'Siap mendengarkan dan mendampingi keluh kesah siswa secara rahasia.',
      available_hours: t.available_hours || 'Senin - Jumat (07.30 - 15.00 WIB)',
      status: statuses[idx % statuses.length],
      assigned_class_ids: t.assigned_class_ids || []
    };
  });
}

// ==========================================
// --- FULL CRUD BACKEND OPERATIONS ---
// ==========================================

export async function createStudent(data: {
  name: string;
  email: string;
  nis: string;
  class_id: string;
  password?: string;
  phone?: string;
}): Promise<{ user: User; student: Student }> {
  const userId = `usr-s-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const studentId = `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const defaultPass = data.password || `siswa${data.nis.slice(-4)}`;
  const hashedPassword = hashPassword(defaultPass);

  const newUser: User = {
    id: userId,
    name: data.name.trim(),
    email: data.email.trim(),
    role: 'siswa',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`,
    phone: data.phone || '',
    password: hashedPassword,
    password_changed: false,
    created_at: new Date().toISOString()
  };

  const newStudent: Student = {
    id: studentId,
    user_id: userId,
    nis: data.nis.trim(),
    class_id: data.class_id,
    created_at: new Date().toISOString()
  };

  if (isPostgresConnected && pool) {
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, password = $4, phone = $7`,
      [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.avatar, newUser.phone, newUser.password_changed]
    );

    await pool.query(
      `INSERT INTO students (id, user_id, nis, class_id, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET nis = $3, class_id = $4`,
      [newStudent.id, newStudent.user_id, newStudent.nis, newStudent.class_id]
    );
  }

  memoryStore.users.push(newUser);
  memoryStore.students.push(newStudent);

  return { user: newUser, student: newStudent };
}

export async function createTeacher(data: {
  name: string;
  email: string;
  nip: string;
  teacher_type: 'guru_bk' | 'wali_kelas';
  phone?: string;
  specialization?: string;
  room?: string;
  bio?: string;
  available_hours?: string;
  managed_class_id?: string;
  assigned_class_ids?: string[];
}): Promise<{ user: User; teacher: Teacher }> {
  const userId = `usr-t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const teacherId = `tch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const hashedPassword = hashPassword('guru123');

  const newUser: User = {
    id: userId,
    name: data.name.trim(),
    email: data.email.trim(),
    role: 'guru',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`,
    phone: data.phone || '',
    password: hashedPassword,
    password_changed: false,
    created_at: new Date().toISOString()
  };

  const newTeacher: Teacher = {
    id: teacherId,
    user_id: userId,
    nip: data.nip.trim(),
    teacher_type: data.teacher_type,
    specialization: data.specialization || (data.teacher_type === 'guru_bk' ? 'Konseling Umum' : 'Wali Kelas'),
    room: data.room || (data.teacher_type === 'guru_bk' ? 'Ruang BK' : 'Ruang Guru'),
    bio: data.bio || 'Pendidik siap mendampingi siswa.',
    available_hours: data.available_hours || 'Senin - Jumat 07.30 - 15.00 WIB',
    is_active: true,
    assigned_class_ids: data.assigned_class_ids || [],
    created_at: new Date().toISOString()
  };

  if (isPostgresConnected && pool) {
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, password = $4, phone = $7`,
      [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.avatar, newUser.phone, newUser.password_changed]
    );

    await pool.query(
      `INSERT INTO teachers (id, user_id, nip, teacher_type, specialization, room, bio, available_hours, is_active, assigned_class_ids, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET nip = $3, teacher_type = $4, specialization = $5, room = $6, bio = $7, available_hours = $8, assigned_class_ids = $10`,
      [
        newTeacher.id,
        newTeacher.user_id,
        newTeacher.nip,
        newTeacher.teacher_type,
        newTeacher.specialization,
        newTeacher.room,
        newTeacher.bio,
        newTeacher.available_hours,
        newTeacher.is_active,
        JSON.stringify(newTeacher.assigned_class_ids)
      ]
    );

    if (data.teacher_type === 'wali_kelas' && data.managed_class_id) {
      await pool.query('UPDATE classes SET homeroom_teacher_id = $1 WHERE id = $2', [newTeacher.id, data.managed_class_id]);
    }
  }

  memoryStore.users.push(newUser);
  memoryStore.teachers.push(newTeacher);

  if (data.teacher_type === 'wali_kelas' && data.managed_class_id) {
    const cls = memoryStore.classes.find(c => c.id === data.managed_class_id);
    if (cls) cls.homeroom_teacher_id = newTeacher.id;
  }

  return { user: newUser, teacher: newTeacher };
}

export async function updateUserDetails(userId: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  nis?: string;
  class_id?: string;
  nip?: string;
  specialization?: string;
  room?: string;
  bio?: string;
  available_hours?: string;
  managed_class_id?: string;
  assigned_class_ids?: string[];
  homeroom_teacher_id?: string;
}): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  const updates: any = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.email !== undefined) updates.email = data.email.trim();
  if (data.phone !== undefined) updates.phone = data.phone.trim();
  if (data.password && data.password.trim()) {
    updates.password = hashPassword(data.password.trim());
    updates.password_changed = false;
  }

  if (isPostgresConnected && pool) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (updates.name !== undefined) { fields.push(`name = $${idx++}`); values.push(updates.name); }
    if (updates.email !== undefined) { fields.push(`email = $${idx++}`); values.push(updates.email); }
    if (updates.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(updates.phone); }
    if (updates.password !== undefined) {
      fields.push(`password = $${idx++}`); values.push(updates.password);
      fields.push(`password_changed = $${idx++}`); values.push(false);
    }

    if (fields.length > 0) {
      values.push(userId);
      await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    }

    // Student updates
    if (user.role === 'siswa') {
      const sFields: string[] = [];
      const sValues: any[] = [];
      let sIdx = 1;

      if (data.nis !== undefined) { sFields.push(`nis = $${sIdx++}`); sValues.push(data.nis.trim()); }
      if (data.class_id !== undefined) { sFields.push(`class_id = $${sIdx++}`); sValues.push(data.class_id); }

      if (sFields.length > 0) {
        sValues.push(userId);
        await pool.query(`UPDATE students SET ${sFields.join(', ')} WHERE user_id = $${sIdx}`, sValues);
      }

      if (data.class_id && data.homeroom_teacher_id !== undefined) {
        await pool.query('UPDATE classes SET homeroom_teacher_id = $1 WHERE id = $2', [data.homeroom_teacher_id || null, data.class_id]);
      }
    }

    // Teacher updates
    if (user.role === 'guru') {
      const tFields: string[] = [];
      const tValues: any[] = [];
      let tIdx = 1;

      if (data.nip !== undefined) { tFields.push(`nip = $${tIdx++}`); tValues.push(data.nip.trim()); }
      if (data.specialization !== undefined) { tFields.push(`specialization = $${tIdx++}`); tValues.push(data.specialization.trim()); }
      if (data.room !== undefined) { tFields.push(`room = $${tIdx++}`); tValues.push(data.room.trim()); }
      if (data.bio !== undefined) { tFields.push(`bio = $${tIdx++}`); tValues.push(data.bio.trim()); }
      if (data.available_hours !== undefined) { tFields.push(`available_hours = $${tIdx++}`); tValues.push(data.available_hours.trim()); }
      if (data.assigned_class_ids !== undefined) {
        tFields.push(`assigned_class_ids = $${tIdx++}`);
        tValues.push(JSON.stringify(data.assigned_class_ids));
      }

      if (tFields.length > 0) {
        tValues.push(userId);
        await pool.query(`UPDATE teachers SET ${tFields.join(', ')} WHERE user_id = $${tIdx}`, tValues);
      }

      // Update managed class if wali_kelas
      const teacherRes = await pool.query('SELECT id, teacher_type FROM teachers WHERE user_id = $1', [userId]);
      const teacher = teacherRes.rows[0];
      if (teacher && teacher.teacher_type === 'wali_kelas' && data.managed_class_id !== undefined) {
        await pool.query('UPDATE classes SET homeroom_teacher_id = NULL WHERE homeroom_teacher_id = $1', [teacher.id]);
        if (data.managed_class_id) {
          await pool.query('UPDATE classes SET homeroom_teacher_id = $1 WHERE id = $2', [teacher.id, data.managed_class_id]);
        }
      }
    }
  }

  // Update in memoryStore as well
  const memUser = memoryStore.users.find(u => u.id === userId);
  if (memUser) {
    if (updates.name !== undefined) memUser.name = updates.name;
    if (updates.email !== undefined) memUser.email = updates.email;
    if (updates.phone !== undefined) memUser.phone = updates.phone;
    if (updates.password !== undefined) {
      memUser.password = updates.password;
      memUser.password_changed = false;
    }
  }

  if (user.role === 'siswa') {
    const memStudent = memoryStore.students.find(s => s.user_id === userId);
    if (memStudent) {
      if (data.nis !== undefined) memStudent.nis = data.nis.trim();
      if (data.class_id !== undefined) memStudent.class_id = data.class_id;
    }
    if (data.class_id && data.homeroom_teacher_id !== undefined) {
      const cls = memoryStore.classes.find(c => c.id === data.class_id);
      if (cls) cls.homeroom_teacher_id = data.homeroom_teacher_id || null;
    }
  }

  if (user.role === 'guru') {
    const memTeacher = memoryStore.teachers.find(t => t.user_id === userId);
    if (memTeacher) {
      if (data.nip !== undefined) memTeacher.nip = data.nip.trim();
      if (data.specialization !== undefined) memTeacher.specialization = data.specialization.trim();
      if (data.room !== undefined) memTeacher.room = data.room.trim();
      if (data.bio !== undefined) memTeacher.bio = data.bio.trim();
      if (data.available_hours !== undefined) memTeacher.available_hours = data.available_hours.trim();
      if (data.assigned_class_ids !== undefined) memTeacher.assigned_class_ids = [...data.assigned_class_ids];

      if (memTeacher.teacher_type === 'wali_kelas' && data.managed_class_id !== undefined) {
        memoryStore.classes.forEach(c => {
          if (c.homeroom_teacher_id === memTeacher.id && c.id !== data.managed_class_id) {
            c.homeroom_teacher_id = null;
          }
        });
        if (data.managed_class_id) {
          const cls = memoryStore.classes.find(c => c.id === data.managed_class_id);
          if (cls) cls.homeroom_teacher_id = memTeacher.id;
        }
      }
    }
  }

  return true;
}

export async function bulkDeleteUsersPermanently(rawIds: string[]): Promise<number> {
  if (!rawIds || rawIds.length === 0) return 0;

  // Clean, trim, and deduplicate
  const cleanIds = Array.from(new Set(rawIds.map(id => String(id || '').trim()).filter(Boolean)));
  if (cleanIds.length === 0) return 0;

  if (isPostgresConnected && pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Resolve all matching users, students, and teachers
      const uRes = await client.query('SELECT id FROM users WHERE id = ANY($1)', [cleanIds]);
      const resolvedUserIds = new Set<string>(uRes.rows.map(r => r.id));

      const sRes = await client.query(
        'SELECT id, user_id FROM students WHERE id = ANY($1) OR user_id = ANY($1)',
        [cleanIds]
      );
      const studentIds: string[] = [];
      for (const row of sRes.rows) {
        studentIds.push(row.id);
        if (row.user_id) resolvedUserIds.add(row.user_id);
      }

      const tRes = await client.query(
        'SELECT id, user_id FROM teachers WHERE id = ANY($1) OR user_id = ANY($1)',
        [cleanIds]
      );
      const teacherIds: string[] = [];
      for (const row of tRes.rows) {
        teacherIds.push(row.id);
        if (row.user_id) resolvedUserIds.add(row.user_id);
      }

      // Also ensure all cleanIds are in the user deletion set
      cleanIds.forEach(id => resolvedUserIds.add(id));
      const allUserIds = Array.from(resolvedUserIds);

      // 2. Unlink teachers from classes
      if (teacherIds.length > 0) {
        await client.query(
          'UPDATE classes SET homeroom_teacher_id = NULL WHERE homeroom_teacher_id = ANY($1)',
          [teacherIds]
        );
        await client.query(
          'UPDATE classes SET bk_teacher_id = NULL WHERE bk_teacher_id = ANY($1)',
          [teacherIds]
        );
      }

      // 3. Remove reports & all their cascading dependencies for these students
      if (studentIds.length > 0) {
        const repRes = await client.query('SELECT id FROM reports WHERE student_id = ANY($1)', [studentIds]);
        const reportIds = repRes.rows.map(r => r.id);
        if (reportIds.length > 0) {
          await client.query('DELETE FROM messages WHERE report_id = ANY($1)', [reportIds]);
          await client.query('DELETE FROM report_status_history WHERE report_id = ANY($1)', [reportIds]);
          await client.query('DELETE FROM notifications WHERE report_id = ANY($1)', [reportIds]);
          await client.query('DELETE FROM reports WHERE id = ANY($1)', [reportIds]);
        }

        // Clean student mood checks
        await client.query('DELETE FROM student_mood_checks WHERE student_id = ANY($1)', [studentIds]);
        // Delete student records
        await client.query('DELETE FROM students WHERE id = ANY($1)', [studentIds]);
      }

      if (allUserIds.length > 0) {
        // Clean any mood checks referencing student_user_id
        await client.query('DELETE FROM student_mood_checks WHERE student_user_id = ANY($1)', [allUserIds]);
        // Delete messages sent by these users
        await client.query('DELETE FROM messages WHERE sender_id = ANY($1)', [allUserIds]);
        // Delete report status history changed by these users
        await client.query('DELETE FROM report_status_history WHERE changed_by = ANY($1)', [allUserIds]);
        // Delete notifications for these users
        await client.query('DELETE FROM notifications WHERE user_id = ANY($1)', [allUserIds]);
        // Delete students referencing user_id if not already deleted
        await client.query('DELETE FROM students WHERE user_id = ANY($1)', [allUserIds]);
        // Delete teachers referencing user_id
        await client.query('DELETE FROM teachers WHERE user_id = ANY($1)', [allUserIds]);
        // Finally, delete the users themselves
        await client.query('DELETE FROM users WHERE id = ANY($1)', [allUserIds]);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[ADVOCARE DB] Error during bulkDeleteUsersPermanently in PostgreSQL:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Update memoryStore
  const memoryUserIds = new Set<string>();
  const memoryStudentIds = new Set<string>();
  const memoryTeacherIds = new Set<string>();

  cleanIds.forEach(id => {
    memoryUserIds.add(id);
    const s = memoryStore.students.find(st => st.id === id || st.user_id === id);
    if (s) {
      memoryStudentIds.add(s.id);
      memoryUserIds.add(s.user_id);
    }
    const t = memoryStore.teachers.find(tc => tc.id === id || tc.user_id === id);
    if (t) {
      memoryTeacherIds.add(t.id);
      memoryUserIds.add(t.user_id);
    }
  });

  if (memoryTeacherIds.size > 0) {
    memoryStore.classes.forEach(c => {
      if (c.homeroom_teacher_id && memoryTeacherIds.has(c.homeroom_teacher_id)) {
        c.homeroom_teacher_id = null;
      }
      if (c.bk_teacher_id && (memoryTeacherIds.has(c.bk_teacher_id) || memoryUserIds.has(c.bk_teacher_id))) {
        c.bk_teacher_id = undefined;
      }
    });
    memoryStore.teachers = memoryStore.teachers.filter(
      t => !memoryTeacherIds.has(t.id) && !memoryUserIds.has(t.user_id)
    );
  }

  if (memoryStudentIds.size > 0) {
    memoryStore.students = memoryStore.students.filter(
      s => !memoryStudentIds.has(s.id) && !memoryUserIds.has(s.user_id)
    );
    if (memoryStore.mood_checks) {
      memoryStore.mood_checks = memoryStore.mood_checks.filter(
        (mc: any) => !memoryStudentIds.has(mc.student_id) && !memoryUserIds.has(mc.student_user_id)
      );
    }
  }

  memoryStore.users = memoryStore.users.filter(u => !memoryUserIds.has(u.id));
  memoryStore.notifications = memoryStore.notifications.filter(n => !memoryUserIds.has(n.user_id));

  return cleanIds.length;
}

export async function deleteUserPermanently(userId: string): Promise<boolean> {
  const count = await bulkDeleteUsersPermanently([userId]);
  return count > 0;
}

// --- CLASS CRUD ---
export async function createClass(data: {
  name: string;
  grade: string;
  major: string;
  homeroom_teacher_id?: string | null;
  bk_teacher_id?: string;
}): Promise<SchoolClass> {
  const newClass: SchoolClass = {
    id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    grade: data.grade,
    major: data.major.trim() || 'Umum',
    homeroom_teacher_id: data.homeroom_teacher_id || null,
    bk_teacher_id: data.bk_teacher_id || undefined
  };

  if (isPostgresConnected && pool) {
    await pool.query(
      `INSERT INTO classes (id, name, grade, major, homeroom_teacher_id, bk_teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newClass.id, newClass.name, newClass.grade, newClass.major, newClass.homeroom_teacher_id, newClass.bk_teacher_id]
    );

    if (newClass.bk_teacher_id) {
      const tRes = await pool.query('SELECT assigned_class_ids FROM teachers WHERE id = $1 OR user_id = $1', [newClass.bk_teacher_id]);
      if (tRes.rows[0]) {
        let assigned = tRes.rows[0].assigned_class_ids;
        if (typeof assigned === 'string') assigned = JSON.parse(assigned);
        if (!Array.isArray(assigned)) assigned = [];
        if (!assigned.includes(newClass.id)) {
          assigned.push(newClass.id);
          await pool.query('UPDATE teachers SET assigned_class_ids = $1 WHERE id = $2 OR user_id = $2', [JSON.stringify(assigned), newClass.bk_teacher_id]);
        }
      }
    }
  }

  memoryStore.classes.push(newClass);
  return newClass;
}

export async function updateClassDetails(classId: string, data: Partial<SchoolClass>): Promise<boolean> {
  if (isPostgresConnected && pool) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name.trim()); }
    if (data.grade !== undefined) { fields.push(`grade = $${idx++}`); values.push(data.grade); }
    if (data.major !== undefined) { fields.push(`major = $${idx++}`); values.push(data.major.trim()); }
    if (data.homeroom_teacher_id !== undefined) { fields.push(`homeroom_teacher_id = $${idx++}`); values.push(data.homeroom_teacher_id || null); }
    if (data.bk_teacher_id !== undefined) { fields.push(`bk_teacher_id = $${idx++}`); values.push(data.bk_teacher_id || null); }

    if (fields.length > 0) {
      values.push(classId);
      await pool.query(`UPDATE classes SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    }
  }

  const cls = memoryStore.classes.find(c => c.id === classId);
  if (cls) {
    Object.assign(cls, data);
  }
  return true;
}

export async function deleteClassPermanently(classId: string): Promise<boolean> {
  if (isPostgresConnected && pool) {
    await pool.query('DELETE FROM classes WHERE id = $1', [classId]);
  }
  memoryStore.classes = memoryStore.classes.filter(c => c.id !== classId);
  return true;
}

// --- CATEGORY CRUD ---
export async function updateCategoryDetails(categoryId: string, data: Partial<Category>): Promise<boolean> {
  if (isPostgresConnected && pool) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name.trim()); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description.trim()); }
    if (data.icon !== undefined) { fields.push(`icon = $${idx++}`); values.push(data.icon); }
    if (data.color !== undefined) { fields.push(`color = $${idx++}`); values.push(data.color); }
    if (data.active !== undefined) { fields.push(`active = $${idx++}`); values.push(data.active); }

    if (fields.length > 0) {
      values.push(categoryId);
      await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    }
  }

  const cat = memoryStore.categories.find(c => c.id === categoryId);
  if (cat) {
    Object.assign(cat, data);
  }
  return true;
}

export async function deleteCategoryPermanently(categoryId: string): Promise<boolean> {
  if (isPostgresConnected && pool) {
    await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);
  }
  memoryStore.categories = memoryStore.categories.filter(c => c.id !== categoryId);
  return true;
}

// --- COUNSELING APPOINTMENTS ---
export async function getCounselingAppointments(filters?: { studentId?: string; teacherId?: string; userId?: string }): Promise<CounselingAppointment[]> {
  if (isPostgresConnected && pool) {
    try {
      let query = 'SELECT * FROM counseling_appointments WHERE 1=1';
      const params: any[] = [];
      let idx = 1;

      if (filters?.studentId) {
        query += ` AND student_id = $${idx++}`;
        params.push(filters.studentId);
      }
      if (filters?.teacherId) {
        query += ` AND teacher_id = $${idx++}`;
        params.push(filters.teacherId);
      }
      if (filters?.userId) {
        query += ` AND (student_user_id = $${idx} OR teacher_user_id = $${idx})`;
        params.push(filters.userId);
        idx++;
      }

      query += ' ORDER BY requested_date ASC, requested_time ASC';
      const res = await pool.query(query, params);
      return res.rows;
    } catch (e) {
      console.warn('Postgres getCounselingAppointments failed, falling back to memoryStore:', e);
    }
  }

  let list = memoryStore.counseling_appointments || [];
  if (filters?.studentId) {
    list = list.filter(a => a.student_id === filters.studentId);
  }
  if (filters?.teacherId) {
    list = list.filter(a => a.teacher_id === filters.teacherId);
  }
  if (filters?.userId) {
    list = list.filter(a => a.student_user_id === filters.userId || a.teacher_user_id === filters.userId);
  }
  return list.sort((a, b) => (a.requested_date + a.requested_time).localeCompare(b.requested_date + b.requested_time));
}

export async function createCounselingAppointment(data: Partial<CounselingAppointment>): Promise<CounselingAppointment> {
  const newAppointment: CounselingAppointment = {
    id: data.id || `apt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    student_id: data.student_id || '',
    student_user_id: data.student_user_id || '',
    student_name: data.student_name || '',
    student_class_name: data.student_class_name || '',
    teacher_id: data.teacher_id || '',
    teacher_user_id: data.teacher_user_id || '',
    teacher_name: data.teacher_name || '',
    requested_date: data.requested_date || '',
    requested_time: data.requested_time || '',
    confirmed_date: data.confirmed_date,
    confirmed_time: data.confirmed_time,
    topic: data.topic || '',
    counseling_type: data.counseling_type || 'tatap_muka',
    status: data.status || 'menunggu',
    reschedule_reason: data.reschedule_reason,
    notes: data.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isPostgresConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO counseling_appointments (
          id, student_id, student_user_id, student_name, student_class_name,
          teacher_id, teacher_user_id, teacher_name, requested_date, requested_time,
          confirmed_date, confirmed_time, topic, counseling_type, status,
          reschedule_reason, notes, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          newAppointment.id,
          newAppointment.student_id,
          newAppointment.student_user_id,
          newAppointment.student_name,
          newAppointment.student_class_name,
          newAppointment.teacher_id,
          newAppointment.teacher_user_id,
          newAppointment.teacher_name,
          newAppointment.requested_date,
          newAppointment.requested_time,
          newAppointment.confirmed_date || null,
          newAppointment.confirmed_time || null,
          newAppointment.topic,
          newAppointment.counseling_type,
          newAppointment.status,
          newAppointment.reschedule_reason || null,
          newAppointment.notes || null,
          newAppointment.created_at,
          newAppointment.updated_at
        ]
      );
    } catch (e) {
      console.warn('Postgres createCounselingAppointment failed:', e);
    }
  }

  if (!memoryStore.counseling_appointments) {
    memoryStore.counseling_appointments = [];
  }
  const idx = memoryStore.counseling_appointments.findIndex(a => a.id === newAppointment.id);
  if (idx >= 0) {
    memoryStore.counseling_appointments[idx] = newAppointment;
  } else {
    memoryStore.counseling_appointments.push(newAppointment);
  }

  return newAppointment;
}

export async function acceptCounselingAppointment(id: string, notes?: string): Promise<CounselingAppointment | null> {
  const now = new Date().toISOString();
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(
        `UPDATE counseling_appointments
         SET status = 'disetujui', notes = COALESCE($1, notes), updated_at = $2
         WHERE id = $3
         RETURNING *`,
        [notes || null, now, id]
      );
      if (res.rows[0]) return res.rows[0];
    } catch (e) {
      console.warn('Postgres acceptCounselingAppointment failed:', e);
    }
  }

  const apt = memoryStore.counseling_appointments?.find(a => a.id === id);
  if (apt) {
    apt.status = 'disetujui';
    if (notes) apt.notes = notes;
    apt.updated_at = now;
    return apt;
  }
  return null;
}

export async function rescheduleCounselingAppointment(
  id: string,
  newDate: string,
  newTime: string,
  reason: string
): Promise<CounselingAppointment | null> {
  const now = new Date().toISOString();
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(
        `UPDATE counseling_appointments
         SET status = 'dijadwalkan_ulang', confirmed_date = $1, confirmed_time = $2, reschedule_reason = $3, updated_at = $4
         WHERE id = $5
         RETURNING *`,
        [newDate, newTime, reason, now, id]
      );
      if (res.rows[0]) return res.rows[0];
    } catch (e) {
      console.warn('Postgres rescheduleCounselingAppointment failed:', e);
    }
  }

  const apt = memoryStore.counseling_appointments?.find(a => a.id === id);
  if (apt) {
    apt.status = 'dijadwalkan_ulang';
    apt.confirmed_date = newDate;
    apt.confirmed_time = newTime;
    apt.reschedule_reason = reason;
    apt.updated_at = now;
    return apt;
  }
  return null;
}

export async function completeCounselingAppointment(id: string, notes?: string): Promise<CounselingAppointment | null> {
  const now = new Date().toISOString();
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(
        `UPDATE counseling_appointments
         SET status = 'selesai', notes = COALESCE($1, notes), updated_at = $2
         WHERE id = $3
         RETURNING *`,
        [notes || null, now, id]
      );
      if (res.rows[0]) return res.rows[0];
    } catch (e) {
      console.warn('Postgres completeCounselingAppointment failed:', e);
    }
  }

  const apt = memoryStore.counseling_appointments?.find(a => a.id === id);
  if (apt) {
    apt.status = 'selesai';
    if (notes) apt.notes = notes;
    apt.updated_at = now;
    return apt;
  }
  return null;
}

export async function cancelCounselingAppointment(id: string, reason?: string): Promise<CounselingAppointment | null> {
  const now = new Date().toISOString();
  if (isPostgresConnected && pool) {
    try {
      const res = await pool.query(
        `UPDATE counseling_appointments
         SET status = 'dibatalkan', reschedule_reason = COALESCE($1, reschedule_reason), updated_at = $2
         WHERE id = $3
         RETURNING *`,
        [reason || null, now, id]
      );
      if (res.rows[0]) return res.rows[0];
    } catch (e) {
      console.warn('Postgres cancelCounselingAppointment failed:', e);
    }
  }

  const apt = memoryStore.counseling_appointments?.find(a => a.id === id);
  if (apt) {
    apt.status = 'dibatalkan';
    if (reason) apt.reschedule_reason = reason;
    apt.updated_at = now;
    return apt;
  }
  return null;
}


