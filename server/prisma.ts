import { PrismaClient } from '@prisma/client';

// Helper to extract sanitized DATABASE_URL from common environment variable names
export function getPrismaConnectionString(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.SUPABASE_DATABASE_URL,
    process.env.NEON_DATABASE_URL,
    process.env.DIRECT_URL,
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

export interface SanitizedDbInfo {
  hasUrl: boolean;
  provider: string;
  host: string;
  port: string;
  database: string;
  isPooler: boolean;
  isSupabaseDirectV6: boolean;
  warnings: string[];
  recommendations: string[];
}

// Inspect database connection string to detect common Vercel-to-database connection pitfalls
export function inspectConnectionString(connStr?: string): SanitizedDbInfo {
  if (!connStr) {
    return {
      hasUrl: false,
      provider: 'In-Memory Relational Engine',
      host: 'none',
      port: '-',
      database: 'none',
      isPooler: false,
      isSupabaseDirectV6: false,
      warnings: ['Variabel lingkungan DATABASE_URL belum diatur di Vercel.'],
      recommendations: [
        'Buka Vercel Project Settings > Environment Variables, lalu tambahkan DATABASE_URL.',
        'Setelah menambahkan variabel di Vercel, lakukan Redeploy agar serverless function memuat env baru.'
      ]
    };
  }

  const warnings: string[] = [];
  const recommendations: string[] = [];
  let host = 'unknown';
  let port = '5432';
  let database = 'postgres';
  let provider = 'PostgreSQL (Prisma)';
  let isPooler = false;
  let isSupabaseDirectV6 = false;

  try {
    const parsed = new URL(connStr);
    host = parsed.hostname;
    port = parsed.port || '5432';
    database = parsed.pathname.replace(/^\//, '') || 'postgres';

    if (host.includes('supabase')) {
      provider = 'Supabase PostgreSQL';
      if (host.includes('pooler') || port === '6543') {
        isPooler = true;
      } else if (host.startsWith('db.') && port === '5432') {
        isSupabaseDirectV6 = true;
        warnings.push('Terdeteksi Direct Connection Supabase (Port 5432). Vercel Serverless Function sering kali gagal/timeout karena Supabase Direct menggunakan IPv6 yang tidak didukung penuh di Vercel.');
        recommendations.push('Gunakan Supabase Connection Pooler (Port 6543 / Session Mode) dengan host: aws-0-[region].pooler.supabase.com:6543');
      }
    } else if (host.includes('neon')) {
      provider = 'Neon PostgreSQL';
      if (host.includes('-pooler')) isPooler = true;
    } else if (host.includes('aiven')) {
      provider = 'Aiven PostgreSQL';
    } else if (host.includes('render')) {
      provider = 'Render PostgreSQL';
    } else if (host.includes('railway')) {
      provider = 'Railway PostgreSQL';
    }

    // Check special characters in password without percent-encoding
    if (parsed.password && (parsed.password.includes('@') || parsed.password.includes('#') || parsed.password.includes('$'))) {
      warnings.push('Kata sandi database mengandung karakter khusus yang mungkin perlu di-encode (misal: @ menjadi %40, # menjadi %23).');
    }

    // Check missing sslmode on cloud providers
    if (host !== 'localhost' && host !== '127.0.0.1' && !connStr.includes('sslmode')) {
      recommendations.push('Disarankan menambahkan ?sslmode=require pada URL koneksi PostgreSQL.');
    }
  } catch (err: any) {
    warnings.push(`Format URL tidak valid: ${err.message}`);
  }

  return {
    hasUrl: true,
    provider,
    host,
    port,
    database,
    isPooler,
    isSupabaseDirectV6,
    warnings,
    recommendations
  };
}

// Prepare connection string for Prisma with optimal serverless pooling parameters
export function getOptimizedPrismaUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    const url = new URL(rawUrl);

    // If host is a pooler (Neon pooler with -pooler, Supabase pooler on port 6543, or PgBouncer), add pgbouncer=true
    const isPooler =
      url.port === '6543' ||
      url.hostname.includes('pooler') ||
      url.hostname.includes('neon') ||
      url.searchParams.has('pgbouncer');

    if (isPooler && !url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }

    // Ensure connection limit for serverless environment to prevent exhausting pool
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '10');
    }

    // Set connection timeout (seconds)
    if (!url.searchParams.has('connect_timeout')) {
      url.searchParams.set('connect_timeout', '15');
    }

    // Set pool timeout (seconds)
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '15');
    }

    // Ensure sslmode=require for non-localhost
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1' && !url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

// Global singleton caching for PrismaClient in Vercel Serverless environment
declare global {
  // eslint-disable-next-line no-var
  var __prismaClientInstance: PrismaClient | undefined;
}

let prismaInstance: PrismaClient | null = null;
let isPrismaConnected = false;
let lastPrismaError: string | null = null;
let lastPrismaPingMs: number | null = null;
let lastCheckedTimestamp: string | null = null;

export async function resetPrismaClient(): Promise<void> {
  if (prismaInstance) {
    try {
      await prismaInstance.$disconnect();
    } catch {}
    prismaInstance = null;
  }
  globalThis.__prismaClientInstance = undefined;
}

export function getPrismaClient(): PrismaClient | null {
  const connStr = getPrismaConnectionString();
  if (!connStr) return null;

  if (globalThis.__prismaClientInstance) {
    return globalThis.__prismaClientInstance;
  }

  if (prismaInstance) return prismaInstance;

  const optimizedUrl = getOptimizedPrismaUrl(connStr);

  try {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: optimizedUrl,
        },
      },
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' }
      ],
    });

    // Handle Prisma engine events gracefully
    (client as any).$on('error', (e: any) => {
      const msg = typeof e === 'string' ? e : e?.message || JSON.stringify(e);
      if (msg.includes('Closed') || msg.includes('kind: Closed') || msg.includes('closed by the remote host')) {
        // Benign background idle socket close by remote pooler/Neon compute suspend
        console.warn('[PRISMA POOL] Idle connection closed by database server (handled gracefully).');
        resetPrismaClient();
      } else {
        console.warn('[PRISMA CLIENT ERROR]:', msg);
        lastPrismaError = msg;
      }
    });

    (client as any).$on('warn', (e: any) => {
      const msg = typeof e === 'string' ? e : e?.message || JSON.stringify(e);
      console.warn('[PRISMA CLIENT WARN]:', msg);
    });

    prismaInstance = client;

    if (process.env.NODE_ENV !== 'production') {
      globalThis.__prismaClientInstance = prismaInstance;
    }

    return prismaInstance;
  } catch (err: any) {
    console.error('[PRISMA INIT ERROR]:', err.message);
    lastPrismaError = err.message;
    return null;
  }
}

// Wrapper with automatic retry and client reconnect for serverless compute wake-up
export async function withPrismaRetry<T>(fn: (prisma: PrismaClient) => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const prisma = getPrismaClient();
    if (!prisma) {
      throw new Error('Prisma Client not available');
    }
    try {
      return await fn(prisma);
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      if (
        msg.includes('Closed') ||
        msg.includes('kind: Closed') ||
        msg.includes('connection was closed') ||
        msg.includes("Can't reach database server") ||
        msg.includes('P1001') ||
        msg.includes('terminating connection')
      ) {
        console.warn(`[PRISMA RETRY] Connection issue (${msg}). Resetting client and retrying (${attempt + 1}/${maxRetries})...`);
        await resetPrismaClient();
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Test Prisma Database Connection End-to-End
export async function testPrismaDatabase(): Promise<{
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
  counts?: {
    users: number;
    classes: number;
    teachers: number;
    students: number;
    reports: number;
  };
}> {
  const rawUrl = getPrismaConnectionString();
  const info = inspectConnectionString(rawUrl);
  const now = new Date().toISOString();
  lastCheckedTimestamp = now;

  if (!rawUrl) {
    isPrismaConnected = false;
    lastPrismaError = 'DATABASE_URL belum diatur di Vercel.';
    return {
      success: false,
      provider: info.provider,
      host: info.host,
      port: info.port,
      database: info.database,
      isPooler: info.isPooler,
      hasDatabaseUrl: false,
      error: 'Variabel lingkungan DATABASE_URL belum diatur di Vercel Settings > Environment Variables.',
      timestamp: now,
      warnings: info.warnings,
      recommendations: info.recommendations
    };
  }

  try {
    const t0 = Date.now();
    // Test basic query via Prisma with retry
    await withPrismaRetry(async (client) => {
      await client.$queryRawUnsafe('SELECT 1 as ping');
    });
    const ping = Date.now() - t0;
    lastPrismaPingMs = ping;
    isPrismaConnected = true;
    lastPrismaError = null;

    // Fetch counts via Prisma models with retry
    let userCount = 0;
    let classCount = 0;
    let teacherCount = 0;
    let studentCount = 0;
    let reportCount = 0;

    try {
      const counts = await withPrismaRetry(async (client) => {
        const [u, c, t, s, r] = await Promise.all([
          client.user.count(),
          client.schoolClass.count(),
          client.teacher.count(),
          client.student.count(),
          client.report.count()
        ]);
        return { u, c, t, s, r };
      });
      userCount = counts.u;
      classCount = counts.c;
      teacherCount = counts.t;
      studentCount = counts.s;
      reportCount = counts.r;
    } catch {
      // If tables do not exist yet in Prisma schema
      info.warnings.push('Tabel belum diinisialisasi di database. Anda dapat menjalankan seed master data atau push schema.');
    }

    return {
      success: true,
      provider: info.provider,
      host: info.host,
      port: info.port,
      database: info.database,
      isPooler: info.isPooler,
      hasDatabaseUrl: true,
      pingMs: ping,
      timestamp: now,
      warnings: info.warnings,
      recommendations: info.recommendations,
      counts: {
        users: userCount,
        classes: classCount,
        teachers: teacherCount,
        students: studentCount,
        reports: reportCount
      }
    };
  } catch (err: any) {
    isPrismaConnected = false;
    lastPrismaError = err.message;
    const warnings = [...info.warnings];
    const recommendations = [...info.recommendations];

    // Analyze specific PostgreSQL / Prisma errors to provide actionable solutions
    const msg = err.message.toLowerCase();
    if (msg.includes('p1001') || msg.includes("can't reach database server") || msg.includes('timeout') || msg.includes('enotfound')) {
      warnings.push('Tidak dapat menjangkau server database (Network Timeout / Host Unreachable).');
      if (info.isSupabaseDirectV6) {
        recommendations.push('SOLUSI UTAMA: Ganti port 5432 dengan port 6543 (Supabase Connection Pooler). Vercel Serverless Function tidak dapat menjangkau direct port 5432 Supabase.');
      } else {
        recommendations.push('Pastikan firewall/allowlist database Anda mengizinkan koneksi dari semua IP (0.0.0.0/0) atau gunakan Connection Pooler.');
      }
    } else if (msg.includes('p1000') || msg.includes('authentication failed') || msg.includes('password')) {
      warnings.push('Otentikasi database gagal. Kata sandi atau nama pengguna salah.');
      recommendations.push('Periksa kembali kata sandi database di Vercel Settings > Environment Variables. Jika kata sandi mengandung simbol seperti @, gunakan persen-encoding (misal: @ -> %40).');
    } else if (msg.includes('does not exist') || msg.includes('relation') || msg.includes('table')) {
      warnings.push('Tabel belum dibuat di database PostgreSQL.');
      recommendations.push('Klik tombol "Terapkan Master Data ke Database" di dashboard Admin atau jalankan script npx prisma db push.');
    }

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
      warnings,
      recommendations
    };
  }
}

export function getPrismaStatus() {
  const rawUrl = getPrismaConnectionString();
  const info = inspectConnectionString(rawUrl);

  return {
    engine: isPrismaConnected ? `Prisma ORM (${info.provider})` : 'In-Memory Relational Engine',
    connected: isPrismaConnected,
    isPrisma: isPrismaConnected,
    isPostgres: isPrismaConnected,
    hasDatabaseUrl: Boolean(rawUrl),
    provider: info.provider,
    host: info.host,
    port: info.port,
    isPooler: info.isPooler,
    isSupabaseDirectV6: info.isSupabaseDirectV6,
    pingMs: lastPrismaPingMs,
    lastError: lastPrismaError,
    lastCheckedAt: lastCheckedTimestamp,
    warnings: info.warnings,
    recommendations: info.recommendations
  };
}
