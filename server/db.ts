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
  BkTeacherProfile
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
import { decryptNip } from '../src/utils/crypto';

const { Pool } = pg;

// Check if PostgreSQL DATABASE_URL is configured
const connectionString = process.env.DATABASE_URL;

let pool: pg.Pool | null = null;
let isPostgresConnected = false;

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
  mood_checks: JSON.parse(JSON.stringify(INITIAL_MOOD_CHECKS))
};

export async function initDatabase(): Promise<{ isPostgres: boolean; error?: string }> {
  if (!connectionString) {
    console.log('[ADVOCARE DB] No DATABASE_URL found. Running with high-performance In-Memory relational engine.');
    return { isPostgres: false };
  }

  try {
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' || connectionString.includes('supabase') || connectionString.includes('neon')
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    console.log('[ADVOCARE DB] Connected successfully to PostgreSQL / Supabase!');
    isPostgresConnected = true;

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
      ALTER TABLE classes ADD COLUMN IF NOT EXISTS bk_teacher_id VARCHAR(50);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS room VARCHAR(100);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS available_hours VARCHAR(100);
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS assigned_class_ids JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE teachers ALTER COLUMN nip TYPE VARCHAR(255);
      ALTER TABLE reports ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
    `);

    // Check if initial users exist, if not, seed them
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('[ADVOCARE DB] Seeding initial data into PostgreSQL...');
      for (const u of INITIAL_USERS) {
        await client.query(
          'INSERT INTO users (id, name, email, password, password_changed, role, avatar, phone, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
          [u.id, u.name, u.email, u.password || null, Boolean(u.password_changed), u.role, u.avatar || null, u.phone || null, u.created_at]
        );
      }
      for (const c of INITIAL_CLASSES) {
        await client.query(
          'INSERT INTO classes (id, name, grade, major, homeroom_teacher_id, bk_teacher_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
          [c.id, c.name, c.grade, c.major, c.homeroom_teacher_id, c.bk_teacher_id || null]
        );
      }
      for (const t of INITIAL_TEACHERS) {
        await client.query(
          'INSERT INTO teachers (id, user_id, nip, teacher_type, specialization, room, bio, available_hours, is_active, assigned_class_ids, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING',
          [
            t.id,
            t.user_id,
            t.nip,
            t.teacher_type,
            t.specialization || null,
            t.room || null,
            t.bio || null,
            t.available_hours || null,
            t.is_active ?? true,
            JSON.stringify(t.assigned_class_ids || []),
            t.created_at
          ]
        );
      }
      for (const s of INITIAL_STUDENTS) {
        await client.query(
          'INSERT INTO students (id, user_id, nis, class_id, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
          [s.id, s.user_id, s.nis, s.class_id, s.created_at]
        );
      }
      for (const cat of INITIAL_CATEGORIES) {
        await client.query(
          'INSERT INTO categories (id, name, description, icon, color, active) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
          [cat.id, cat.name, cat.description, cat.icon, cat.color, cat.active]
        );
      }
      for (const r of INITIAL_REPORTS) {
        await client.query(
          'INSERT INTO reports (id, report_code, student_id, category_id, assigned_to, assigned_teacher_id, title, description, urgency, privacy, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT DO NOTHING',
          [r.id, r.report_code, r.student_id, r.category_id, r.assigned_to, (r as any).assigned_teacher_id || null, r.title, r.description, r.urgency, r.privacy, r.status, r.created_at, r.updated_at]
        );
      }
      for (const m of INITIAL_MESSAGES) {
        await client.query(
          'INSERT INTO messages (id, report_id, sender_id, message, created_at, is_read) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
          [m.id, m.report_id, m.sender_id, m.message, m.created_at, m.is_read]
        );
      }
      for (const h of INITIAL_STATUS_HISTORY) {
        await client.query(
          'INSERT INTO report_status_history (id, report_id, status, changed_by, note, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
          [h.id, h.report_id, h.status, h.changed_by, h.note || null, h.created_at]
        );
      }
      for (const a of INITIAL_ANNOUNCEMENTS) {
        await client.query(
          'INSERT INTO announcements (id, title, content, author_id, author_name, author_role, author_avatar, target_grade, attachments, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING',
          [a.id, a.title, a.content, a.author_id || null, a.author_name, a.author_role, a.author_avatar || null, a.target_grade, JSON.stringify(a.attachments || []), a.created_at]
        );
      }
      console.log('[ADVOCARE DB] PostgreSQL initial seeding completed!');
    }

    client.release();
    return { isPostgres: true };
  } catch (err: any) {
    console.warn('[ADVOCARE DB] Warning: PostgreSQL connection failed. Falling back to in-memory store:', err.message);
    isPostgresConnected = false;
    return { isPostgres: false, error: err.message };
  }
}

export function getDatabaseStatus() {
  return {
    engine: isPostgresConnected ? 'PostgreSQL' : 'In-Memory Relational Engine',
    connected: true,
    isPostgres: isPostgresConnected,
    hasDatabaseUrl: Boolean(connectionString),
  };
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
  const student = memoryStore.students.find(s => s.nis.toLowerCase() === trimmed.toLowerCase());
  if (student) {
    const user = await getUserById(student.user_id);
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

  return {
    ...report,
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

    reports = rRes.rows;
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
  userId: string;
  category_id: string;
  assigned_to: AssignedTo;
  assigned_teacher_id?: string | null;
  title: string;
  description: string;
  urgency: ReportUrgency;
  privacy: ReportPrivacy;
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
  const reportId = `rep-${Date.now()}`;

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
      `INSERT INTO reports (id, report_code, student_id, category_id, assigned_to, title, description, urgency, privacy, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        newReport.id, newReport.report_code, newReport.student_id, newReport.category_id,
        newReport.assigned_to, newReport.title, newReport.description, newReport.urgency,
        newReport.privacy, newReport.status, newReport.created_at, newReport.updated_at
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

