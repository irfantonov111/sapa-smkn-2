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
  Announcement,
  AnnouncementAttachment,
  AnnouncementTargetGrade,
  ReportAttachment,
  StudentMoodCheck,
  MoodType,
  SystemSettings
} from '../types/database';

import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_REPORTS,
  INITIAL_MESSAGES,
  INITIAL_STATUS_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MOOD_CHECKS,
  getBkTeacherIdForClass
} from './seedData';
import {
  hashPassword,
  verifyPassword,
  isPasswordEncrypted,
  generateTemporaryPassword,
  encryptNip,
  decryptNip,
  maskNip,
  isNipEncrypted
} from '../utils/crypto';

const STORAGE_PREFIX = 'sapa_db_v7_';
const LEGACY_STORAGE_PREFIX = 'sapa_db_v6_';

interface DatabaseState {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  categories: Category[];
  reports: Report[];
  messages: Message[];
  status_history: ReportStatusHistory[];
  notifications: Notification[];
  announcements: Announcement[];
  mood_checks: StudentMoodCheck[];
  system_settings?: SystemSettings;
}

class DatabaseService {
  private state: DatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadFromStorage();

    // Listen for storage changes across tabs for instant multi-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && (e.key.startsWith('sapa_') || e.key.startsWith('advocare_'))) {
          this.reloadFromStorage();
        }
      });

      // Background auto-sync from server API (PostgreSQL / Supabase)
      setTimeout(() => {
        this.syncFromBackend().catch(() => {});
      }, 500);
    }
  }

  /**
   * Subscribe to real-time database modifications (auto-sync)
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error notifying database subscriber:', err);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sapa_db_updated'));
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
  }

  public reloadFromStorage(): void {
    try {
      this.state = this.loadFromStorage();
      this.notifyListeners();
    } catch (e) {
      console.warn('Error reloading database from storage:', e);
    }
  }

  private loadFromStorage(): DatabaseState {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}state`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          // Synchronize classes
          if (Array.isArray(parsed.classes)) {
            for (const initC of INITIAL_CLASSES) {
              const existingC = parsed.classes.find((c: SchoolClass) => c.id === initC.id);
              if (!existingC) {
                parsed.classes.push(initC);
              }
            }
          }
          // Synchronize teachers
          if (Array.isArray(parsed.teachers)) {
            for (const initT of INITIAL_TEACHERS) {
              const existing = parsed.teachers.find((t: Teacher) => t.id === initT.id);
              if (existing) {
                existing.specialization = initT.specialization;
                existing.room = initT.room;
                existing.bio = initT.bio;
                existing.available_hours = initT.available_hours;
              } else {
                parsed.teachers.push(initT);
              }
            }
          }
          // Synchronize students
          if (Array.isArray(parsed.students)) {
            for (const initS of INITIAL_STUDENTS) {
              const existingS = parsed.students.find((s: Student) => s.id === initS.id);
              if (!existingS) {
                parsed.students.push(initS);
              }
            }
          }
          // Synchronize users and encrypt passwords if needed
          if (Array.isArray(parsed.users)) {
            for (const initU of INITIAL_USERS) {
              const existingU = parsed.users.find((u: User) => u.id === initU.id);
              if (!existingU) {
                parsed.users.push(initU);
              } else {
                if (!existingU.password && initU.password) {
                  existingU.password = initU.password;
                }
                if (typeof existingU.avatar === 'string' && existingU.avatar.includes('images.unsplash.com')) {
                  existingU.avatar = initU.avatar;
                }
              }
            }
            // Enforce encryption for all passwords in parsed storage
            for (const u of parsed.users) {
              if (u.password && !isPasswordEncrypted(u.password)) {
                u.password = hashPassword(u.password);
              }
            }
          }
          if (Array.isArray(parsed.reports)) {
            for (const initR of INITIAL_REPORTS) {
              const existingR = parsed.reports.find((r: Report) => r.id === initR.id);
              if (existingR && !existingR.assigned_teacher_id) {
                existingR.assigned_teacher_id = initR.assigned_teacher_id;
              }
            }
          }
          // Synchronize classes and ensure bk_teacher_id exists
          if (Array.isArray(parsed.classes)) {
            for (const cls of parsed.classes) {
              if (!cls.bk_teacher_id) {
                cls.bk_teacher_id = getBkTeacherIdForClass(cls.id);
              }
            }
          }
          // Synchronize announcements
          if (!Array.isArray(parsed.announcements) || parsed.announcements.length === 0) {
            parsed.announcements = [...INITIAL_ANNOUNCEMENTS];
          }
          // Synchronize mood_checks & ensure sudah_ditinjau mood checks have needs_counseling = false
          if (!Array.isArray(parsed.mood_checks) || parsed.mood_checks.length === 0) {
            parsed.mood_checks = [...INITIAL_MOOD_CHECKS];
          } else {
            parsed.mood_checks.forEach(m => {
              if (m.status === 'sudah_ditinjau') {
                m.needs_counseling = false;
              }
            });
          }
          // Ensure student and teacher users have password_changed flag
          if (Array.isArray(parsed.users)) {
            parsed.users.forEach(u => {
              if (u.role === 'siswa' && u.password_changed === undefined) {
                u.password_changed = false;
              }
              if (u.role === 'guru' && u.password_changed === undefined) {
                u.password_changed = false;
              }
            });
          }
          // Ensure teacher NIPs are encrypted and assigned_class_ids are initialized
          if (Array.isArray(parsed.teachers)) {
            parsed.teachers.forEach((t: Teacher) => {
              if (t.nip && !isNipEncrypted(t.nip)) {
                t.nip = encryptNip(t.nip);
              }
              if (!t.assigned_class_ids) {
                t.assigned_class_ids = [];
              }
            });
          }

          // Bidirectional sync: make sure any class bk_teacher_id is included in teacher.assigned_class_ids
          if (Array.isArray(parsed.classes) && Array.isArray(parsed.teachers)) {
            for (const cls of parsed.classes) {
              if (cls.bk_teacher_id) {
                const teacher = parsed.teachers.find((t: Teacher) => t.id === cls.bk_teacher_id || t.user_id === cls.bk_teacher_id);
                if (teacher) {
                  if (!teacher.assigned_class_ids) teacher.assigned_class_ids = [];
                  if (!teacher.assigned_class_ids.includes(cls.id)) {
                    teacher.assigned_class_ids.push(cls.id);
                  }
                }
              }
            }
          }
          if (!parsed.system_settings) {
            parsed.system_settings = {
              reset_password_email: 'admin@smk.sch.id',
              school_name: 'SMK Negeri 1'
            };
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved database from localStorage, initializing with seed data.', err);
    }

    const defaultState: DatabaseState = {
      users: [...INITIAL_USERS].map(u => ({
        ...u,
        password: u.password && !isPasswordEncrypted(u.password) ? hashPassword(u.password) : u.password
      })),
      students: [...INITIAL_STUDENTS],
      teachers: [...INITIAL_TEACHERS],
      classes: [...INITIAL_CLASSES],
      categories: [...INITIAL_CATEGORIES],
      reports: [...INITIAL_REPORTS],
      messages: [...INITIAL_MESSAGES],
      status_history: [...INITIAL_STATUS_HISTORY],
      notifications: [...INITIAL_NOTIFICATIONS],
      announcements: [...INITIAL_ANNOUNCEMENTS],
      mood_checks: [...INITIAL_MOOD_CHECKS],
      system_settings: {
        reset_password_email: 'admin@smk.sch.id',
        school_name: 'SMK Negeri 1'
      }
    };
    this.saveToStorage(defaultState);
    return defaultState;
  }

  private saveToStorage(stateToSave?: DatabaseState) {
    try {
      const dataStr = JSON.stringify(stateToSave || this.state);
      localStorage.setItem(`${STORAGE_PREFIX}state`, dataStr);
      localStorage.setItem(`${LEGACY_STORAGE_PREFIX}state`, dataStr);
    } catch (err) {
      console.error('Error saving state to localStorage', err);
    }
    this.notifyListeners();
  }

  // Background server synchronizer
  private async syncToServer(endpoint: string, method: string, data?: any) {
    try {
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
      });
    } catch {
      // Graceful offline fallback
    }
  }

  // Check live backend and database status
  public async checkServerHealth(): Promise<{
    status: string;
    engine: string;
    isPostgres: boolean;
    hasDatabaseUrl: boolean;
    provider?: string;
    host?: string;
    port?: string;
    isPooler?: boolean;
    isPrisma?: boolean;
    isSupabaseDirectV6?: boolean;
    pingMs?: number | null;
    lastError?: string | null;
    warnings?: string[];
    recommendations?: string[];
    counts?: { users: number; classes: number; teachers: number; students: number; reports: number };
  }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          const db = data.database || {};
          return {
            status: 'online',
            engine: db.engine || 'Express Server',
            isPostgres: Boolean(db.isPostgres),
            hasDatabaseUrl: Boolean(db.hasDatabaseUrl),
            provider: db.provider,
            host: db.host,
            port: db.port,
            isPooler: Boolean(db.isPooler),
            isPrisma: Boolean(db.isPrisma),
            isSupabaseDirectV6: Boolean(db.isSupabaseDirectV6),
            pingMs: db.pingMs,
            lastError: db.lastError,
            warnings: db.warnings,
            recommendations: db.recommendations,
            counts: db.counts
          };
        }
      }
    } catch {
      // Offline or pure client preview
    }
    return {
      status: 'client_mode',
      engine: 'In-Memory Relational Engine',
      isPostgres: false,
      hasDatabaseUrl: false,
      isPrisma: false,
      counts: {
        users: this.state.users.length,
        classes: this.state.classes.length,
        teachers: this.state.teachers.length,
        students: this.state.students.length,
        reports: this.state.reports.length
      }
    };
  }

  // Actively test database connection from backend to provider (Supabase/Neon/PostgreSQL/Prisma)
  public async testServerDatabase(): Promise<{
    success: boolean;
    provider: string;
    host: string;
    port: string;
    database: string;
    isPooler: boolean;
    isPrisma?: boolean;
    isSupabaseDirectV6?: boolean;
    pingMs?: number;
    error?: string;
    hasDatabaseUrl: boolean;
    timestamp: string;
    warnings?: string[];
    recommendations?: string[];
    counts?: any;
  }> {
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 8500);

    try {
      const res = await fetch('/api/admin/test-db', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutTimer);

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        const isTimeout = res.status === 504 || text.toLowerCase().includes('timeout') || text.includes('FUNCTION_INVOCATION_TIMEOUT');
        const isVercelCrash = res.status === 500 || text.toLowerCase().includes('server error') || text.includes('FUNCTION_INVOCATION_FAILED');

        return {
          success: false,
          provider: 'Vercel Serverless Function',
          host: 'unreachable',
          port: '-',
          database: '-',
          isPooler: false,
          hasDatabaseUrl: false,
          error: isTimeout
            ? 'Batas waktu server habis (Function Timeout). Koneksi ke server database menggantung (freeze) melebihi batas waktu Vercel.'
            : isVercelCrash
            ? 'Serverless Function Vercel mengalami crash atau timeout sebelum dapat mengembalikan JSON.'
            : `Server backend mengembalikan respon non-JSON (HTTP ${res.status}): ${text.slice(0, 150)}`,
          timestamp: new Date().toISOString(),
          warnings: [
            'Serverless backend Vercel tidak mengembalikan data berformat JSON.',
            isTimeout || isVercelCrash
              ? 'Jika menggunakan Supabase, penyebab utama adalah penggunaan port 5432 direct (IPv6). Vercel Serverless hanya mendukung IPv4 sehingga koneksi menggantung (freeze) hingga batas waktu habis.'
              : 'Periksa log serverless function di tab Deployments > Functions Log Vercel.'
          ],
          recommendations: [
            'SOLUSI: Gunakan Supabase Connection Pooler (Port 6543) dengan host aws-0-[region].pooler.supabase.com:6543 di Vercel Settings > Environment Variables.',
            'Buka tab "Deployment" di Vercel, pilih deployment aktif, lalu buka menu "Functions" untuk melihat log detail serverless.'
          ]
        };
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      const isAbort = err.name === 'AbortError';
      return {
        success: false,
        provider: 'Unknown',
        host: 'unreachable',
        port: '-',
        database: '-',
        isPooler: false,
        hasDatabaseUrl: false,
        error: isAbort
          ? 'Koneksi ke backend timeout (melebihi 8.5 detik). Serverless function tidak merespons.'
          : (err.message || 'Gagal menghubungi server API.'),
        timestamp: new Date().toISOString(),
        warnings: isAbort
          ? ['Kemungkinan Vercel Serverless Function menggantung saat membuka socket ke host database yang tidak dapat dijangkau.']
          : undefined,
        recommendations: isAbort
          ? [
              'Pastikan port koneksi Supabase di Vercel adalah 6543 (Connection Pooler), BUKAN 5432 (Direct).',
              'Pastikan nilai variabel DATABASE_URL tidak mengandung tanda kutip ganda atau spasi.'
            ]
          : undefined
      };
    }
  }

  /**
   * Pull and sync full state from Supabase / Backend API
   */
  public async syncFromBackend(): Promise<{
    success: boolean;
    isPostgres: boolean;
    message?: string;
    counts?: { users: number; classes: number; teachers: number; students: number; reports: number };
  }> {
    try {
      const res = await fetch('/api/sync', { headers: { 'Accept': 'application/json' } });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        return {
          success: false,
          isPostgres: false,
          message: `Server backend mengembalikan respon non-JSON (HTTP ${res.status}): ${text.slice(0, 100)}`
        };
      }
      if (!res.ok) {
        return { success: false, isPostgres: false, message: `Server error (${res.status})` };
      }
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        let updated = false;
        if (Array.isArray(d.classes) && d.classes.length > 0) {
          this.state.classes = d.classes;
          updated = true;
        }
        if (Array.isArray(d.users) && d.users.length > 0) {
          this.state.users = d.users;
          updated = true;
        }
        if (Array.isArray(d.students) && d.students.length > 0) {
          this.state.students = d.students;
          updated = true;
        }
        if (Array.isArray(d.teachers) && d.teachers.length > 0) {
          this.state.teachers = d.teachers;
          updated = true;
        }
        if (Array.isArray(d.categories) && d.categories.length > 0) {
          this.state.categories = d.categories;
          updated = true;
        }
        if (Array.isArray(d.reports) && d.reports.length > 0) {
          this.state.reports = d.reports;
          updated = true;
        }
        if (Array.isArray(d.announcements) && d.announcements.length > 0) {
          this.state.announcements = d.announcements;
          updated = true;
        }

        if (updated) {
          this.saveToStorage();
          this.notifyListeners();
        }

        return {
          success: true,
          isPostgres: Boolean(json.database?.isPostgres),
          message: 'Sinkronisasi berhasil dengan database server.',
          counts: json.database?.counts || {
            users: this.state.users.length,
            classes: this.state.classes.length,
            teachers: this.state.teachers.length,
            students: this.state.students.length,
            reports: this.state.reports.length
          }
        };
      }
    } catch (err: any) {
      console.warn('Sync from backend failed:', err);
      return { success: false, isPostgres: false, message: err?.message || 'Gagal terhubung ke API' };
    }
    return { success: false, isPostgres: false, message: 'Tidak ada data dari server' };
  }

  /**
   * Directly seed Supabase database with master dataset (33 Classes, 43 Teachers, 1,122 Students)
   */
  public async seedSupabase(): Promise<{ success: boolean; message: string; database?: any }> {
    try {
      const res = await fetch('/api/admin/seed-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        return {
          success: false,
          message: `Server backend mengembalikan HTTP ${res.status}: ${text.slice(0, 120)}`
        };
      }
      const data = await res.json();
      if (res.ok && data.success) {
        // Automatically sync fresh data into local state
        await this.syncFromBackend();
        return { success: true, message: data.message, database: data.database };
      }
      return { success: false, message: data.error || 'Gagal melakukan seeding ke Supabase.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Koneksi ke endpoint /api/admin/seed-supabase gagal.' };
    }
  }

  public resetToDefaults(): void {
    const defaultState: DatabaseState = {
      users: [...INITIAL_USERS],
      students: [...INITIAL_STUDENTS],
      teachers: [...INITIAL_TEACHERS],
      classes: [...INITIAL_CLASSES],
      categories: [...INITIAL_CATEGORIES],
      reports: [...INITIAL_REPORTS],
      messages: [...INITIAL_MESSAGES],
      status_history: [...INITIAL_STATUS_HISTORY],
      notifications: [...INITIAL_NOTIFICATIONS],
      announcements: [...INITIAL_ANNOUNCEMENTS],
      mood_checks: [...INITIAL_MOOD_CHECKS],
      system_settings: {
        reset_password_email: 'admin@smk.sch.id',
        school_name: 'SMK Negeri 1'
      }
    };
    this.state = defaultState;
    this.saveToStorage(defaultState);
    this.syncToServer('/api/reset', 'POST');
  }

  // Raw access for DB Inspector in Admin view
  public getRawTables(): DatabaseState {
    return this.state;
  }

  // --- USERS & AUTH ---
  public getUsers(): User[] {
    return this.state.users;
  }

  public getStudents(): Student[] {
    return this.state.students;
  }

  public getTeachers(): Teacher[] {
    return this.state.teachers;
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    const lower = email.trim().toLowerCase();
    const exact = this.state.users.find(u => u.email.toLowerCase() === lower);
    if (exact) return exact;

    // Support common administrative alias addresses
    if (['admin@sapa.sch.id', 'admin@smk.sch.id', 'admin@advocare.test', 'admin@sapa.test', 'admin'].includes(lower)) {
      return this.state.users.find(u => u.role === 'admin');
    }
    return undefined;
  }

  public getStudentByUserId(userId: string): Student | undefined {
    return this.state.students.find(s => s.user_id === userId);
  }

  public getTeacherByUserId(userId: string): Teacher | undefined {
    return this.state.teachers.find(t => t.user_id === userId);
  }

  public getTeacherById(teacherId: string): Teacher | undefined {
    return this.state.teachers.find(t => t.id === teacherId);
  }

  public getTeacherTodayReportsCount(teacherIdOrUserId: string): number {
    const teacher = this.state.teachers.find(t => t.id === teacherIdOrUserId || t.user_id === teacherIdOrUserId);
    if (!teacher) return 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    return this.state.reports.filter(r => {
      const isAssigned = r.assigned_teacher_id === teacher.id || r.assigned_teacher_id === teacher.user_id;
      const isToday = r.created_at.slice(0, 10) === todayStr;
      return isAssigned && isToday;
    }).length;
  }

  public setTeacherActiveStatus(teacherUserIdOrId: string, isActive: boolean): void {
    const teacher = this.state.teachers.find(t => t.id === teacherUserIdOrId || t.user_id === teacherUserIdOrId);
    if (teacher) {
      teacher.is_active = isActive;
      this.saveToStorage();
    }
  }

  public getBkTeachers(): BkTeacherProfile[] {
    const bkTeachers = this.state.teachers.filter(t => t.teacher_type === 'guru_bk');
    return bkTeachers.map((t, idx) => {
      const u = this.getUserById(t.user_id);
      const statuses: ('tersedia' | 'konseling' | 'istirahat')[] = ['tersedia', 'tersedia', 'tersedia'];
      const todayCount = this.getTeacherTodayReportsCount(t.id);
      const isActive = t.is_active !== false;

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
        status: !isActive ? 'istirahat' : statuses[idx % statuses.length],
        is_active: isActive,
        assigned_class_ids: t.assigned_class_ids || [],
        today_reports_count: todayCount
      };
    });
  }

  public getClassById(classId: string): SchoolClass | undefined {
    return this.state.classes.find(c => c.id === classId);
  }

  public getClasses(): SchoolClass[] {
    return this.state.classes;
  }

  /**
   * Mengambil daftar kelas yang secara spesifik diampu oleh guru (BK atau Wali Kelas).
   * Guru BK: kelas yang ditugaskan melalui bk_teacher_id atau mapping kelas binaan (sesuai jumlah yang ditugaskan admin).
   * Wali Kelas: kelas yang homeroom_teacher_id cocok dengan guru.
   */
  public getClassesForTeacher(teacherUserIdOrId: string): SchoolClass[] {
    const teacher = this.state.teachers.find(t => t.id === teacherUserIdOrId || t.user_id === teacherUserIdOrId);
    if (!teacher) return [];

    if (teacher.teacher_type === 'guru_bk') {
      const assignedIds = new Set(teacher.assigned_class_ids || []);
      const assigned = this.state.classes.filter(
        c => assignedIds.has(c.id) || c.bk_teacher_id === teacher.id || c.bk_teacher_id === teacher.user_id
      );
      if (assigned.length > 0) return assigned;
      return this.state.classes;
    } else {
      return this.state.classes.filter(c => c.homeroom_teacher_id === teacher.id || c.homeroom_teacher_id === teacher.user_id);
    }
  }

  public getCategories(): Category[] {
    return this.state.categories;
  }

  public getCategoryById(id: string): Category | undefined {
    return this.state.categories.find(c => c.id === id);
  }

  // --- REPORT CODE GENERATION (AC-00001 format) ---
  private generateNextReportCode(): string {
    const existingNumbers = this.state.reports.map(r => {
      const match = r.report_code.match(/AC-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = maxNumber + 1;
    return `AC-${nextNumber.toString().padStart(5, '0')}`;
  }

  // --- REPORTS ACCESS & ENRICHMENT (Role-Based RLS) ---
  public getReports(currentUser: User): EnrichedReport[] {
    let rawReports = [...this.state.reports];

    if (currentUser.role === 'siswa') {
      const student = this.getStudentByUserId(currentUser.id);
      if (!student) return [];
      rawReports = rawReports.filter(r => r.student_id === student.id);
    } else if (currentUser.role === 'guru') {
      const teacher = this.getTeacherByUserId(currentUser.id);
      if (!teacher) return [];

      if (teacher.teacher_type === 'guru_bk') {
        // Guru BK can view reports assigned to BK, high urgency cases, reports assigned to this teacher, or reports with no specific teacher assigned yet
        rawReports = rawReports.filter(r =>
          r.assigned_to === 'guru_bk' ||
          r.urgency === 'tinggi' ||
          r.assigned_teacher_id === teacher.id ||
          r.assigned_teacher_id === teacher.user_id ||
          !r.assigned_teacher_id
        );
      } else if (teacher.teacher_type === 'wali_kelas') {
        // Wali Kelas can view reports for students in classes they manage, OR reports assigned directly to them
        const managedClasses = this.state.classes.filter(c => c.homeroom_teacher_id === teacher.id);
        const managedClassIds = managedClasses.map(c => c.id);
        const managedStudentIds = this.state.students
          .filter(s => managedClassIds.includes(s.class_id))
          .map(s => s.id);

        rawReports = rawReports.filter(r =>
          (r.assigned_to === 'wali_kelas' && managedStudentIds.includes(r.student_id)) ||
          r.assigned_teacher_id === teacher.id ||
          r.assigned_teacher_id === teacher.user_id
        );
      }
    }
    // Admin sees all reports

    // Sort newest first
    rawReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return rawReports.map(r => this.enrichReport(r, currentUser));
  }

  public getReportById(id: string, currentUser: User): EnrichedReport | null {
    const report = this.state.reports.find(r => r.id === id || r.report_code === id);
    if (!report) return null;

    // Check permissions
    if (currentUser.role === 'siswa') {
      const student = this.getStudentByUserId(currentUser.id);
      if (!student || report.student_id !== student.id) {
        return null;
      }
    } else if (currentUser.role === 'guru') {
      const teacher = this.getTeacherByUserId(currentUser.id);
      if (!teacher) return null;

      if (teacher.teacher_type === 'wali_kelas') {
        const managedClasses = this.state.classes.filter(c => c.homeroom_teacher_id === teacher.id);
        const managedClassIds = managedClasses.map(c => c.id);
        const student = this.state.students.find(s => s.id === report.student_id);
        const isManagedStudent = student && managedClassIds.includes(student.class_id);
        const isAssignedDirectly = report.assigned_teacher_id === teacher.id || report.assigned_teacher_id === teacher.user_id;
        if (!isManagedStudent && !isAssignedDirectly) {
          return null;
        }
      }
    }

    return this.enrichReport(report, currentUser);
  }

  private enrichReport(report: Report, viewer: User): EnrichedReport {
    const category = this.getCategoryById(report.category_id) || {
      id: report.category_id,
      name: 'Kategori Lain',
      description: '',
      icon: 'HelpCircle',
      color: 'blue',
      active: true
    };

    const studentRecord = this.state.students.find(s => s.id === report.student_id);
    const studentUser = studentRecord ? this.getUserById(studentRecord.user_id) : undefined;
    const schoolClass = studentRecord ? this.getClassById(studentRecord.class_id) : undefined;

    // Anonymity handling:
    // If report is anonymous:
    // - If viewer is the reporting student themselves or admin: show actual details
    // - If viewer is teacher: mask name and NIS to protect student
    const isAnonymous = report.privacy === 'anonim';
    const isOwner = studentUser && studentUser.id === viewer.id;
    const isTeacher = viewer.role === 'guru';

    let studentData = undefined;
    if (studentRecord) {
      if (isAnonymous && isTeacher) {
        studentData = {
          nis: '********',
          name: 'Siswa Anonim (Identitas Dirahasiakan)',
          class_name: schoolClass ? schoolClass.name : 'Kelas Dirahasiakan',
          is_anonymous: true
        };
      } else {
        studentData = {
          nis: studentRecord.nis,
          name: studentUser ? studentUser.name : 'Siswa',
          class_name: schoolClass ? schoolClass.name : '-',
          is_anonymous: isAnonymous
        };
      }
    }

    const messages = this.state.messages.filter(m => m.report_id === report.id);
    const unreadMessages = messages.filter(m => !m.is_read && m.sender_id !== viewer.id);

    const assignedTeacherInfo: {
      name: string;
      role_label: string;
      specific_name?: string;
      avatar?: string;
      room?: string;
      teacher_id?: string;
      user_id?: string;
    } = {
      name: report.assigned_to === 'guru_bk' ? 'Guru Bimbingan Konseling (BK)' : 'Wali Kelas',
      role_label: report.assigned_to === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'
    };

    if (report.assigned_teacher_id) {
      const specificTeacher = this.state.teachers.find(
        t => t.user_id === report.assigned_teacher_id || t.id === report.assigned_teacher_id
      );
      if (specificTeacher) {
        const u = this.getUserById(specificTeacher.user_id);
        if (u) {
          assignedTeacherInfo.specific_name = u.name;
          assignedTeacherInfo.avatar = u.avatar;
          assignedTeacherInfo.room = specificTeacher.room;
          assignedTeacherInfo.teacher_id = specificTeacher.id;
          assignedTeacherInfo.user_id = specificTeacher.user_id;
        }
      }
    }

    return {
      ...report,
      category,
      student: studentData,
      assigned_teacher: assignedTeacherInfo,
      messages_count: messages.length,
      unread_messages_count: unreadMessages.length
    };
  }

  // --- CREATE REPORT ---
  public createReport(
    currentUser: User,
    data: {
      category_id: string;
      assigned_to: AssignedTo;
      assigned_teacher_id?: string | null;
      title: string;
      description: string;
      urgency: ReportUrgency;
      privacy: ReportPrivacy;
      attachments?: ReportAttachment[];
    }
  ): EnrichedReport {
    const student = this.getStudentByUserId(currentUser.id);
    if (!student) {
      throw new Error('Hanya siswa yang dapat membuat laporan.');
    }

    const now = new Date().toISOString();
    const reportCode = this.generateNextReportCode();

    // If assigned to wali_kelas or guru_bk, resolve recipient teacher & check active status
    let resolvedTeacherId = data.assigned_teacher_id || null;
    if (data.assigned_to === 'guru_bk') {
      if (data.assigned_teacher_id) {
        const targetTeacher = this.state.teachers.find(
          t => t.id === data.assigned_teacher_id || t.user_id === data.assigned_teacher_id
        );
        if (!targetTeacher) {
          throw new Error('Guru BK yang dipilih tidak ditemukan.');
        }

        if (targetTeacher.is_active === false) {
          const u = this.getUserById(targetTeacher.user_id);
          throw new Error(
            `${u?.name || 'Guru BK yang dipilih'} saat ini berstatus TIDAK AKTIF (sedang istirahat / dinas luar). Silakan pilih Guru BK lain yang masih aktif atau gunakan pembagian otomatis tim BK.`
          );
        }
        resolvedTeacherId = targetTeacher.id;
      } else {
        // Default: Guru BK Pengampu Kelas Siswa
        const studentClass = this.getClassById(student.class_id);
        const classBkTeacher = studentClass?.bk_teacher_id
          ? this.state.teachers.find(t => t.id === studentClass.bk_teacher_id && t.is_active !== false)
          : undefined;

        if (classBkTeacher) {
          resolvedTeacherId = classBkTeacher.id;
        } else {
          // Fallback jika Guru BK kelas sedang tidak aktif: alokasikan ke Guru BK lain yang aktif
          const activeBkTeachers = this.state.teachers.filter(
            t => t.teacher_type === 'guru_bk' && t.is_active !== false
          );
          if (activeBkTeachers.length === 0) {
            throw new Error(
              'Seluruh Guru BK saat ini berstatus Tidak Aktif (sedang istirahat / dinas luar). Silakan hubungi pihak sekolah atau coba beberapa saat lagi.'
            );
          }

          // Hitung beban penanganan kasus aktif untuk pembagian secara berimbang dan merata
          const teacherLoads = activeBkTeachers.map(t => {
            const activeCases = this.state.reports.filter(r => {
              const isAssigned = r.assigned_teacher_id === t.id || r.assigned_teacher_id === t.user_id;
              const isOngoing = r.status !== 'selesai';
              return isAssigned && isOngoing;
            }).length;
            return { teacher: t, activeCases };
          });

          const minCases = Math.min(...teacherLoads.map(tl => tl.activeCases));
          const candidates = teacherLoads.filter(tl => tl.activeCases === minCases);
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          resolvedTeacherId = chosen.teacher.id;
        }
      }
    } else if (data.assigned_to === 'wali_kelas') {
      const studentClass = this.getClassById(student.class_id);
      if (studentClass?.homeroom_teacher_id) {
        resolvedTeacherId = studentClass.homeroom_teacher_id;
      }
    }

    const newReport: Report = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      report_code: reportCode,
      student_id: student.id,
      category_id: data.category_id,
      assigned_to: data.assigned_to,
      assigned_teacher_id: resolvedTeacherId,
      title: data.title.trim(),
      description: data.description.trim(),
      urgency: data.urgency,
      privacy: data.privacy,
      status: 'terkirim',
      created_at: now,
      updated_at: now,
      closed_at: null,
      attachments: data.attachments || []
    };

    this.state.reports.unshift(newReport);

    // Initial status history
    const historyEntry: ReportStatusHistory = {
      id: `sh-${Date.now()}`,
      report_id: newReport.id,
      status: 'terkirim',
      changed_by: currentUser.id,
      note: 'Laporan berhasil dibuat dan dikirimkan.',
      created_at: now
    };
    this.state.status_history.push(historyEntry);

    // Initial message from description
    const initialMessage: Message = {
      id: `msg-${Date.now()}`,
      report_id: newReport.id,
      sender_id: currentUser.id,
      message: data.description.trim(),
      created_at: now,
      is_read: false
    };
    this.state.messages.push(initialMessage);

    // Notify assigned teachers
    const category = this.getCategoryById(data.category_id);
    const catName = category ? category.name : 'Laporan';
    const studentClass = this.getClassById(student.class_id);

    if (data.assigned_to === 'guru_bk') {
      const bkTeachers = this.state.teachers.filter(t => t.teacher_type === 'guru_bk');
      for (const t of bkTeachers) {
        const tUser = this.getUserById(t.user_id);
        if (tUser) {
          const isDirectlyChosen = data.assigned_teacher_id && (data.assigned_teacher_id === t.user_id || data.assigned_teacher_id === t.id);
          this.state.notifications.unshift({
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            user_id: tUser.id,
            report_id: newReport.id,
            title: isDirectlyChosen ? `Konseling Baru Ditujukan Khusus Kepadamu [${reportCode}]` : `Laporan Baru Masuk [${reportCode}]`,
            message: isDirectlyChosen
              ? `${data.privacy === 'anonim' ? 'Seorang siswa (Anonim)' : currentUser.name} (${studentClass?.name || 'Siswa'}) secara khusus memilihmu untuk konseling kategori ${catName}.`
              : `${data.privacy === 'anonim' ? 'Seorang siswa (Anonim)' : currentUser.name} (${studentClass?.name || 'Siswa'}) mengirimkan laporan kategori ${catName}.`,
            is_read: false,
            created_at: now
          });
        }
      }
    } else if (data.assigned_to === 'wali_kelas') {
      if (studentClass && studentClass.homeroom_teacher_id) {
        const homeroomTeacher = this.state.teachers.find(t => t.id === studentClass.homeroom_teacher_id);
        if (homeroomTeacher) {
          const tUser = this.getUserById(homeroomTeacher.user_id);
          if (tUser) {
            this.state.notifications.unshift({
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              user_id: tUser.id,
              report_id: newReport.id,
              title: `Laporan Baru Masuk [${reportCode}]`,
              message: `Siswa kelas ${studentClass.name} (${data.privacy === 'anonim' ? 'Anonim' : currentUser.name}) mengirimkan laporan.`,
              is_read: false,
              created_at: now
            });
          }
        }
      }
    }

    this.saveToStorage();
    this.syncToServer('/api/reports', 'POST', {
      userId: currentUser.id,
      category_id: data.category_id,
      assigned_to: data.assigned_to,
      title: data.title,
      description: data.description,
      urgency: data.urgency,
      privacy: data.privacy
    });
    return this.enrichReport(newReport, currentUser);
  }

  // --- AUTOMATED STATUS TRANSITION ON READ ---
  public markReportAsReadByTeacher(reportId: string, teacherUser: User): void {
    const reportIndex = this.state.reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) return;

    const report = this.state.reports[reportIndex];
    if (report.status === 'terkirim') {
      const now = new Date().toISOString();
      report.status = 'dibaca';
      report.updated_at = now;

      // Log status history
      this.state.status_history.push({
        id: `sh-${Date.now()}`,
        report_id: report.id,
        status: 'dibaca',
        changed_by: teacherUser.id,
        note: `Laporan telah dibuka dan dibaca oleh ${teacherUser.name}.`,
        created_at: now
      });

      // Notify student
      const student = this.state.students.find(s => s.id === report.student_id);
      if (student) {
        this.state.notifications.unshift({
          id: `notif-${Date.now()}`,
          user_id: student.user_id,
          report_id: report.id,
          title: 'Laporan Telah Dibaca',
          message: `Laporanmu #${report.report_code} telah dibuka dan dibaca oleh pihak guru.`,
          is_read: false,
          created_at: now
        });
      }

      this.saveToStorage();
    }
  }

  // --- STATUS CHANGE (DITINDAKLANJUTI / SELESAI / ETC) ---
  public updateReportStatus(
    reportId: string,
    newStatus: ReportStatus,
    changerUser: User,
    note?: string
  ): void {
    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) throw new Error('Laporan tidak ditemukan.');

    const now = new Date().toISOString();
    report.status = newStatus;
    report.updated_at = now;
    if (newStatus === 'selesai') {
      report.closed_at = now;
    }

    this.state.status_history.push({
      id: `sh-${Date.now()}`,
      report_id: report.id,
      status: newStatus,
      changed_by: changerUser.id,
      note: note || `Status diperbarui menjadi ${newStatus.toUpperCase()}`,
      created_at: now
    });

    // Notify student
    const student = this.state.students.find(s => s.id === report.student_id);
    if (student) {
      let statusLabel = newStatus.toUpperCase();
      if (newStatus === 'ditindaklanjuti') statusLabel = 'Sedang Ditindaklanjuti';
      if (newStatus === 'selesai') statusLabel = 'Telah Selesai';

      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: student.user_id,
        report_id: report.id,
        title: `Pembaruan Status: ${statusLabel}`,
        message: note
          ? `Laporanmu #${report.report_code}: "${note}"`
          : `Laporanmu #${report.report_code} statusnya telah diubah menjadi ${statusLabel}.`,
        is_read: false,
        created_at: now
      });
    }

    this.saveToStorage();
    this.syncToServer(`/api/reports/${reportId}/status`, 'PATCH', {
      status: newStatus,
      changedByUserId: changerUser.id,
      note
    });
  }

  // --- DELETE REPORT (GURU BK, WALI KELAS, ADMIN) ---
  public deleteReport(reportId: string, currentUser: User): boolean {
    if (currentUser.role !== 'guru' && currentUser.role !== 'admin') {
      throw new Error('Hanya Guru BK, Wali Kelas, atau Admin yang memiliki kewenangan menghapus laporan siswa.');
    }

    const reportIndex = this.state.reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      throw new Error('Laporan tidak ditemukan.');
    }

    const report = this.state.reports[reportIndex];

    // For Wali Kelas, verify they manage this student's class
    if (currentUser.role === 'guru') {
      const teacher = this.getTeacherByUserId(currentUser.id);
      if (teacher && teacher.teacher_type === 'wali_kelas') {
        const managedClasses = this.state.classes.filter(c => c.homeroom_teacher_id === teacher.id);
        const managedClassIds = managedClasses.map(c => c.id);
        const student = this.state.students.find(s => s.id === report.student_id);
        if (!student || !managedClassIds.includes(student.class_id)) {
          throw new Error('Wali kelas hanya dapat menghapus laporan siswa di kelas perwaliannya.');
        }
      }
    }

    // Remove report
    this.state.reports.splice(reportIndex, 1);

    // Clean up related messages, status history, and notifications
    this.state.messages = this.state.messages.filter(m => m.report_id !== reportId);
    this.state.status_history = this.state.status_history.filter(sh => sh.report_id !== reportId);
    this.state.notifications = this.state.notifications.filter(n => n.report_id !== reportId);

    this.saveToStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
    this.syncToServer(`/api/reports/${reportId}`, 'DELETE', { userId: currentUser.id });
    return true;
  }

  // --- BULK DELETE REPORTS (GURU BK, WALI KELAS, ADMIN) ---
  public deleteReportsBulk(reportIds: string[], currentUser: User): { successCount: number; errors: string[] } {
    if (currentUser.role !== 'guru' && currentUser.role !== 'admin') {
      throw new Error('Hanya Guru BK, Wali Kelas, atau Admin yang memiliki kewenangan menghapus laporan siswa.');
    }

    const errors: string[] = [];
    let successCount = 0;

    for (const reportId of reportIds) {
      try {
        const ok = this.deleteReport(reportId, currentUser);
        if (ok) successCount++;
      } catch (err: any) {
        errors.push(`Laporan ${reportId}: ${err.message || 'Gagal menghapus'}`);
      }
    }

    return { successCount, errors };
  }

  // --- ADMIN UPDATE REPORT STATUS ---
  public adminUpdateReportStatus(
    reportId: string,
    newStatus: ReportStatus,
    note: string,
    adminUser: User
  ): Report {
    if (adminUser.role !== 'admin') {
      throw new Error('Hanya Administrator yang dapat menggunakan fitur manajemen status admin.');
    }

    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) {
      throw new Error('Laporan tidak ditemukan.');
    }

    const prevStatus = report.status;
    report.status = newStatus;
    report.updated_at = new Date().toISOString();
    if (newStatus === 'selesai' && !report.closed_at) {
      report.closed_at = new Date().toISOString();
    } else if (newStatus !== 'selesai') {
      report.closed_at = null;
    }

    const historyEntry: ReportStatusHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      report_id: reportId,
      status: newStatus,
      note: note.trim() || `Status laporan diubah menjadi ${newStatus} oleh Administrator`,
      changed_by: adminUser.id,
      created_at: new Date().toISOString()
    };
    this.state.status_history.push(historyEntry);

    // Notify student
    const student = this.state.students.find(s => s.id === report.student_id);
    if (student) {
      this.state.notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        user_id: student.user_id,
        title: 'Status Laporan Diperbarui Administrator',
        message: `Status laporan #${report.report_code} telah diubah menjadi "${newStatus}".`,
        report_id: report.id,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    this.saveToStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
    this.syncToServer(`/api/reports/${reportId}/status`, 'PATCH', { status: newStatus, note, userId: adminUser.id });
    return report;
  }

  // --- ADMIN REASSIGN REPORT ---
  public adminReassignReport(
    reportId: string,
    assignedTo: 'guru_bk' | 'wali_kelas',
    assignedTeacherId: string,
    adminUser: User,
    customNote?: string
  ): Report {
    if (adminUser.role !== 'admin') {
      throw new Error('Hanya Administrator yang dapat mendisposisikan laporan.');
    }

    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) {
      throw new Error('Laporan tidak ditemukan.');
    }

    report.assigned_to = assignedTo;
    report.assigned_teacher_id = assignedTeacherId;
    report.updated_at = new Date().toISOString();

    const teacher = this.state.teachers.find(t => t.id === assignedTeacherId);
    const teacherUser = teacher ? this.state.users.find(u => u.id === teacher.user_id) : null;

    const historyNote = customNote && customNote.trim()
      ? customNote.trim()
      : `Laporan dialihkan penanganannya ke ${assignedTo === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'}: ${teacherUser?.name || assignedTeacherId}`;

    this.state.status_history.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      report_id: reportId,
      status: report.status,
      note: historyNote,
      changed_by: adminUser.id,
      created_at: new Date().toISOString()
    });

    if (teacherUser) {
      this.state.notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        user_id: teacherUser.id,
        title: 'Disposisi Laporan Baru dari Admin',
        message: `Administrator mendisposisikan penanganan laporan #${report.report_code} "${report.title}" kepada Anda.`,
        report_id: report.id,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    this.saveToStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
    this.syncToServer(`/api/reports/${reportId}/reassign`, 'POST', {
      assigned_to: assignedTo,
      assigned_teacher_id: assignedTeacherId,
      customNote
    });
    return report;
  }

  // --- MESSAGES & CHAT PER REPORT ---
  public getMessagesByReportId(reportId: string, currentUser: User): Message[] {
    const messages = this.state.messages.filter(m => m.report_id === reportId);
    // Mark messages sent by others as read
    let hasChanges = false;
    for (const msg of messages) {
      if (msg.sender_id !== currentUser.id && !msg.is_read) {
        msg.is_read = true;
        hasChanges = true;
      }
    }
    if (hasChanges) {
      this.saveToStorage();
    }
    return messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public sendMessage(reportId: string, senderUser: User, text: string): Message {
    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) throw new Error('Laporan tidak ditemukan.');

    // If sender is teacher, ensure only the assigned BK teacher can reply
    if (senderUser.role === 'guru') {
      const teacher = this.getTeacherByUserId(senderUser.id);
      if (!teacher) {
        throw new Error('Data profil guru tidak ditemukan.');
      }

      // If report was assigned to a specific BK teacher chosen by the student:
      if (report.assigned_to === 'guru_bk' && report.assigned_teacher_id) {
        const isSelectedTeacher =
          report.assigned_teacher_id === teacher.id ||
          report.assigned_teacher_id === teacher.user_id;

        if (!isSelectedTeacher) {
          throw new Error('Hanya Guru BK yang dipilih oleh siswa yang berhak membalas pesan pada laporan ini.');
        }
      }
    }

    // If sender is student, verify teacher hasn't already changed status
    if (senderUser.role === 'siswa') {
      const isStatusChangedByTeacher =
        report.status === 'direspons' ||
        report.status === 'ditindaklanjuti' ||
        report.status === 'selesai' ||
        this.state.status_history.some(
          sh => sh.report_id === reportId && (sh.status === 'direspons' || sh.status === 'ditindaklanjuti' || sh.status === 'selesai')
        );

      if (isStatusChangedByTeacher) {
        throw new Error('Siswa tidak dapat mengirim pesan karena status laporan telah diubah oleh guru.');
      }
    }

    const now = new Date().toISOString();
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      report_id: reportId,
      sender_id: senderUser.id,
      message: text.trim(),
      created_at: now,
      is_read: false
    };

    this.state.messages.push(newMessage);
    report.updated_at = now;

    // Automatic status upgrade to DIRESPONS if teacher replied while status was dibaca or terkirim
    if (senderUser.role === 'guru' && (report.status === 'terkirim' || report.status === 'dibaca')) {
      report.status = 'direspons';
      this.state.status_history.push({
        id: `sh-${Date.now()}`,
        report_id: report.id,
        status: 'direspons',
        changed_by: senderUser.id,
        note: `Guru memberikan respons pesan tanggapan pertama.`,
        created_at: now
      });
    }

    // Notifications
    const student = this.state.students.find(s => s.id === report.student_id);
    if (senderUser.role === 'guru') {
      // Notify student
      if (student) {
        this.state.notifications.unshift({
          id: `notif-${Date.now()}`,
          user_id: student.user_id,
          report_id: report.id,
          title: 'Respons Baru dari Guru',
          message: `${senderUser.name} membalas laporan #${report.report_code}: "${text.slice(0, 75)}${text.length > 75 ? '...' : ''}"`,
          is_read: false,
          created_at: now
        });
      }
    } else {
      // Student replied -> notify assigned teacher or previous repliers
      const recentTeacherMessages = this.state.messages
        .filter(m => m.report_id === report.id && m.sender_id !== senderUser.id);
      const recipientTeacherId = recentTeacherMessages.length > 0
        ? recentTeacherMessages[recentTeacherMessages.length - 1].sender_id
        : null;

      if (recipientTeacherId) {
        this.state.notifications.unshift({
          id: `notif-${Date.now()}`,
          user_id: recipientTeacherId,
          report_id: report.id,
          title: 'Balasan Pesan dari Siswa',
          message: `Siswa membalas laporan #${report.report_code}: "${text.slice(0, 75)}${text.length > 75 ? '...' : ''}"`,
          is_read: false,
          created_at: now
        });
      }
    }

    this.saveToStorage();
    this.syncToServer(`/api/reports/${reportId}/messages`, 'POST', {
      senderId: senderUser.id,
      message: text.trim()
    });
    return newMessage;
  }

  // --- REPORT STATUS HISTORY ---
  public getStatusHistory(reportId: string): (ReportStatusHistory & { changer_name: string })[] {
    const history = this.state.status_history.filter(h => h.report_id === reportId);
    return history
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map(h => {
        const changer = this.getUserById(h.changed_by);
        return {
          ...h,
          changer_name: changer ? changer.name : 'Sistem'
        };
      });
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): Notification[] {
    return this.state.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getUnreadNotificationCount(userId: string): number {
    return this.state.notifications.filter(n => n.user_id === userId && !n.is_read).length;
  }

  public markNotificationAsRead(notifId: string): void {
    const notif = this.state.notifications.find(n => n.id === notifId);
    if (notif) {
      notif.is_read = true;
      this.saveToStorage();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('advocare_notif_change'));
      }
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    for (const notif of this.state.notifications) {
      if (notif.user_id === userId) {
        notif.is_read = true;
      }
    }
    this.saveToStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
  }

  public clearAllNotifications(userId: string): void {
    this.state.notifications = this.state.notifications.filter(n => n.user_id !== userId);
    this.saveToStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
  }

  public deleteNotification(notifId: string): void {
    this.state.notifications = this.state.notifications.filter(n => n.id !== notifId);
    this.saveToStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('advocare_notif_change'));
    }
  }

  public updateUserAvatar(userId: string, avatarUrl: string): void {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      // Database optimization: If user is a student, prevent storing heavy base64 uploads
      if (user.role === 'siswa' && avatarUrl.startsWith('data:image/')) {
        // Allow the lightweight SVG data URIs, but forbid heavy base64 raster uploads (jpeg/png/webp)
        if (avatarUrl.includes('image/jpeg') || avatarUrl.includes('image/png') || avatarUrl.includes('image/webp')) {
          throw new Error('Untuk optimalisasi database, siswa hanya diperbolehkan memilih avatar 2D resmi sekolah.');
        }
      }
      user.avatar = avatarUrl;
      this.saveToStorage();
    }
  }

  // --- ADMIN MANAGEMENT API ---
  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      ...cat
    };
    this.state.categories.push(newCat);
    this.saveToStorage();
    this.notifyListeners();
    // Sync to backend Supabase/PostgreSQL
    this.syncToServer('/api/categories', 'POST', {
      name: newCat.name,
      description: newCat.description,
      icon: newCat.icon,
      color: newCat.color
    });
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): void {
    const cat = this.state.categories.find(c => c.id === id);
    if (cat) {
      Object.assign(cat, updates);
      this.saveToStorage();
      this.notifyListeners();
      // Sync to backend Supabase/PostgreSQL
      this.syncToServer(`/api/categories/${id}`, 'PUT', updates);
    }
  }

  public deleteCategory(id: string): { success: boolean; message?: string } {
    // Check if any report uses this category
    const usedInReports = this.state.reports.filter(r => r.category_id === id);
    if (usedInReports.length > 0) {
      // Reassign to general category if available or first category
      const fallback = this.state.categories.find(c => c.id !== id);
      if (fallback) {
        usedInReports.forEach(r => {
          r.category_id = fallback.id;
        });
      }
    }
    this.state.categories = this.state.categories.filter(c => c.id !== id);
    this.saveToStorage();
    this.notifyListeners();
    // Sync to backend Supabase/PostgreSQL
    this.syncToServer(`/api/categories/${id}`, 'DELETE');
    return { success: true };
  }

  public addClass(cls: Omit<SchoolClass, 'id'>): SchoolClass {
    const newClass: SchoolClass = {
      id: `cls-${Date.now()}`,
      ...cls
    };
    this.state.classes.push(newClass);

    // If assigned to a BK teacher, update teacher's assigned_class_ids
    if (newClass.bk_teacher_id) {
      const bkTeacher = this.state.teachers.find(
        t => t.id === newClass.bk_teacher_id || t.user_id === newClass.bk_teacher_id
      );
      if (bkTeacher) {
        if (!bkTeacher.assigned_class_ids) bkTeacher.assigned_class_ids = [];
        if (!bkTeacher.assigned_class_ids.includes(newClass.id)) {
          bkTeacher.assigned_class_ids.push(newClass.id);
        }
      }
    }

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer('/api/classes', 'POST', {
      name: newClass.name,
      grade: newClass.grade,
      major: newClass.major,
      homeroom_teacher_id: newClass.homeroom_teacher_id,
      bk_teacher_id: newClass.bk_teacher_id
    });

    return newClass;
  }

  public updateClass(classId: string, updates: Partial<SchoolClass>): void {
    const cls = this.state.classes.find(c => c.id === classId);
    if (!cls) return;

    const oldBkTeacherId = cls.bk_teacher_id;
    Object.assign(cls, updates);

    // If BK teacher assignment changed
    if (updates.bk_teacher_id !== undefined && updates.bk_teacher_id !== oldBkTeacherId) {
      if (oldBkTeacherId) {
        const oldT = this.state.teachers.find(t => t.id === oldBkTeacherId || t.user_id === oldBkTeacherId);
        if (oldT?.assigned_class_ids) {
          oldT.assigned_class_ids = oldT.assigned_class_ids.filter(id => id !== classId);
        }
      }
      if (updates.bk_teacher_id) {
        const newT = this.state.teachers.find(t => t.id === updates.bk_teacher_id || t.user_id === updates.bk_teacher_id);
        if (newT) {
          if (!newT.assigned_class_ids) newT.assigned_class_ids = [];
          if (!newT.assigned_class_ids.includes(classId)) {
            newT.assigned_class_ids.push(classId);
          }
        }
      }
    }

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer(`/api/classes/${classId}`, 'PUT', updates);
  }

  public deleteClass(classId: string): { success: boolean; message?: string } {
    const studentsInClass = this.state.students.filter(s => s.class_id === classId);
    if (studentsInClass.length > 0) {
      return {
        success: false,
        message: `Kelas tidak dapat dihapus karena masih ada ${studentsInClass.length} siswa terdaftar. Pindahkan siswa terlebih dahulu.`
      };
    }
    // Remove from teacher assignments
    this.state.teachers.forEach(t => {
      if (t.assigned_class_ids?.includes(classId)) {
        t.assigned_class_ids = t.assigned_class_ids.filter(id => id !== classId);
      }
    });
    this.state.classes = this.state.classes.filter(c => c.id !== classId);
    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer(`/api/classes/${classId}`, 'DELETE');

    return { success: true };
  }

  /**
   * Mengatur kelas binaan yang diampu oleh Guru BK.
   * Jumlah kelas yang diampu sepenuhnya fleksibel sesuai penugasan dari admin (misal: 3 kelas, 4 kelas, dsb).
   */
  public assignBkClasses(teacherIdOrUserId: string, classIds: string[]): { success: boolean; message?: string } {
    const teacher = this.state.teachers.find(t => t.id === teacherIdOrUserId || t.user_id === teacherIdOrUserId);
    if (!teacher) {
      return { success: false, message: 'Data Guru BK tidak ditemukan.' };
    }
    if (teacher.teacher_type !== 'guru_bk') {
      return { success: false, message: 'Hanya Guru BK yang dapat diatur kelas binaannya.' };
    }

    const selectedSet = new Set(classIds);
    teacher.assigned_class_ids = [...classIds];

    // Update bk_teacher_id in classes
    this.state.classes.forEach(c => {
      if (selectedSet.has(c.id)) {
        c.bk_teacher_id = teacher.id;
      } else if (c.bk_teacher_id === teacher.id || c.bk_teacher_id === teacher.user_id) {
        c.bk_teacher_id = undefined;
      }
    });

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer('/api/classes/assign-bk', 'POST', {
      teacherId: teacher.id,
      classIds
    });

    return { success: true };
  }

  public updateUser(id: string, updates: Partial<User>): void {
    const user = this.state.users.find(u => u.id === id);
    if (user) {
      if (updates.password && updates.password.trim()) {
        updates.password = hashPassword(updates.password.trim());
      }
      Object.assign(user, updates);
      this.saveToStorage();
      this.notifyListeners();

      // Sync to backend Supabase/PostgreSQL
      this.syncToServer(`/api/users/${id}`, 'PUT', updates);
    }
  }

  public resetUserPassword(userId: string, newPassword?: string): { success: boolean; plainPassword: string; message: string } {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan dalam sistem.');
    }
    const plain = newPassword && newPassword.trim() ? newPassword.trim() : generateTemporaryPassword(user.role);
    user.password = hashPassword(plain);
    if (user.role === 'siswa' || user.role === 'guru') {
      // Mengharuskan pengguna mengganti kata sandi mandiri saat pertama kali login
      user.password_changed = false;
    }
    this.saveToStorage();
    this.notifyListeners();

    // Sinkronisasi kata sandi baru ke server backend
    this.syncToServer(`/api/users/${userId}/reset-password`, 'POST', {
      password: plain,
      hashedPassword: user.password,
      password_changed: false
    });

    return {
      success: true,
      plainPassword: plain,
      message: `Kata sandi akun ${user.name} berhasil direset dan dienkripsi.`
    };
  }

  public changeStudentDefaultPassword(userId: string, newPasswordPlain: string): { success: boolean; message: string } {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'Pengguna tidak ditemukan dalam sistem.' };
    }
    const resetEmail = this.getSystemSettings().reset_password_email;
    if (user.password_changed) {
      return {
        success: false,
        message: `Kesempatan ganti sandi mandiri telah digunakan (hanya diberikan 1 kali). Jika ingin mengganti atau lupa sandi, silakan hubungi Admin Sistem melalui email: ${resetEmail}`
      };
    }
    const trimmed = newPasswordPlain.trim();
    if (!trimmed || trimmed.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }
    if (user.role === 'guru' && trimmed === 'guru123') {
      return { success: false, message: 'Kata sandi baru tidak boleh sama dengan kata sandi bawaan default (guru123).' };
    }
    if (user.role === 'siswa') {
      const student = this.state.students.find(s => s.user_id === userId);
      if (student && trimmed === `siswa${student.nis.slice(-4)}`) {
        return { success: false, message: 'Kata sandi baru tidak boleh sama dengan kata sandi bawaan default siswa.' };
      }
    }
    user.password = hashPassword(trimmed);
    user.password_changed = true;
    this.saveToStorage();
    this.notifyListeners();

    // Sinkronisasi ke server backend
    this.syncToServer(`/api/users/${userId}/change-password`, 'POST', {
      password: trimmed,
      hashedPassword: user.password
    });

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui! Gunakan kata sandi baru ini untuk login berikutnya.'
    };
  }

  public changeFirstTimePassword(userId: string, newPasswordPlain: string): { success: boolean; message: string } {
    return this.changeStudentDefaultPassword(userId, newPasswordPlain);
  }

  public getSystemSettings(): SystemSettings {
    if (!this.state.system_settings) {
      this.state.system_settings = {
        reset_password_email: 'admin@smk.sch.id',
        school_name: 'SMK Negeri 1'
      };
      this.saveToStorage();
    }
    return { ...this.state.system_settings };
  }

  public updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
    const current = this.getSystemSettings();
    const updated: SystemSettings = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.state.system_settings = updated;
    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend server
    this.syncToServer('/api/settings', 'POST', updated);

    return updated;
  }

  public updateStudent(studentId: string, updates: Partial<Student>): void {
    const student = this.state.students.find(s => s.id === studentId);
    if (student) {
      Object.assign(student, updates);
      this.saveToStorage();
      this.notifyListeners();
      if (student.user_id) {
        this.syncToServer(`/api/users/${student.user_id}/details`, 'PUT', updates);
      }
    }
  }

  public updateTeacher(teacherId: string, updates: Partial<Teacher>): void {
    const teacher = this.state.teachers.find(t => t.id === teacherId);
    if (teacher) {
      if (updates.nip && updates.nip.trim()) {
        updates.nip = encryptNip(updates.nip.trim());
      }
      Object.assign(teacher, updates);
      this.saveToStorage();
      this.notifyListeners();
      if (teacher.user_id) {
        this.syncToServer(`/api/users/${teacher.user_id}/details`, 'PUT', updates);
      }
    }
  }

  public updateClassHomeroom(classId: string, homeroomTeacherId: string | null): void {
    const cls = this.state.classes.find(c => c.id === classId);
    if (cls) {
      cls.homeroom_teacher_id = homeroomTeacherId;
      this.saveToStorage();
      this.notifyListeners();
      this.syncToServer(`/api/classes/${classId}`, 'PUT', { homeroom_teacher_id: homeroomTeacherId });
    }
  }

  public updateStudentComplete(data: {
    userId: string;
    studentId: string;
    name: string;
    email: string;
    nis: string;
    class_id: string;
    password?: string;
    homeroom_teacher_id?: string;
  }): void {
    const user = this.state.users.find(u => u.id === data.userId);
    if (user) {
      user.name = data.name.trim();
      user.email = data.email.trim();
      if (data.password && data.password.trim()) {
        user.password = hashPassword(data.password.trim());
        user.password_changed = false; // Memberikan kesempatan reset mandiri 1x lagi untuk siswa
      }
    }

    const student = this.state.students.find(s => s.id === data.studentId);
    if (student) {
      student.nis = data.nis.trim();
      student.class_id = data.class_id;
    }

    if (data.class_id && data.homeroom_teacher_id !== undefined) {
      const cls = this.state.classes.find(c => c.id === data.class_id);
      if (cls) {
        cls.homeroom_teacher_id = data.homeroom_teacher_id || null;
      }
    }

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer(`/api/users/${data.userId}/details`, 'PUT', {
      name: data.name.trim(),
      email: data.email.trim(),
      nis: data.nis.trim(),
      class_id: data.class_id,
      password: data.password ? data.password.trim() : undefined,
      homeroom_teacher_id: data.homeroom_teacher_id
    });
  }

  public getUserByIdentifier(identifier: string): User | null {
    const trimmed = identifier.trim();
    if (!trimmed) return null;

    const lower = trimmed.toLowerCase();

    // 0. Admin aliases (admin, admin@sapa.sch.id, admin@smk.sch.id, etc.)
    if (['admin', 'admin@sapa.sch.id', 'admin@smk.sch.id', 'admin@advocare.test', 'admin@sapa.test', 'administrator'].includes(lower)) {
      const adminUser = this.state.users.find(u => u.role === 'admin');
      if (adminUser) return adminUser;
    }

    // 1. Direct email match
    const byEmail = this.getUserByEmail(trimmed);
    if (byEmail) return byEmail;

    // 2. Student NIS
    const student = this.state.students.find(s => s.nis.toLowerCase() === trimmed.toLowerCase());
    if (student) {
      const user = this.getUserById(student.user_id);
      if (user) return user;
    }

    // 3. Teacher NIP (support decrypted and encrypted match)
    const cleanInput = trimmed.replace(/\s+/g, '');
    const teacher = this.state.teachers.find(t => {
      const plainNip = decryptNip(t.nip || '').replace(/\s+/g, '');
      const rawNip = (t.nip || '').replace(/\s+/g, '');
      return plainNip === cleanInput || rawNip === cleanInput;
    });
    if (teacher) {
      const user = this.getUserById(teacher.user_id);
      if (user) return user;
    }

    // 4. User ID
    const byId = this.getUserById(trimmed);
    if (byId) return byId;

    // 5. Name match
    const byName = this.state.users.find(u => u.name.toLowerCase() === trimmed.toLowerCase());
    if (byName) return byName;

    return null;
  }

  public deleteUser(userId: string): { success: boolean } {
    // 1. If student, delete student record
    this.state.students = this.state.students.filter(s => s.user_id !== userId);
    
    // 2. If teacher, delete teacher record and unlink classes
    const teacher = this.state.teachers.find(t => t.user_id === userId);
    if (teacher) {
      this.state.classes.forEach(c => {
        if (c.homeroom_teacher_id === teacher.id) {
          c.homeroom_teacher_id = null;
        }
        if (c.bk_teacher_id === teacher.id || c.bk_teacher_id === teacher.user_id) {
          c.bk_teacher_id = undefined;
        }
      });
      this.state.teachers = this.state.teachers.filter(t => t.id !== teacher.id);
    }

    // 3. Delete user
    this.state.users = this.state.users.filter(u => u.id !== userId);

    // 4. Clean notifications
    this.state.notifications = this.state.notifications.filter(n => n.user_id !== userId);

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer(`/api/users/${userId}`, 'DELETE');

    return { success: true };
  }

  public bulkDeleteUsers(userIds: string[]): { success: boolean; count: number } {
    if (!userIds || userIds.length === 0) return { success: true, count: 0 };
    const idSet = new Set(userIds);

    // 1. Delete student records
    this.state.students = this.state.students.filter(s => !idSet.has(s.user_id));

    // 2. Identify teachers to delete and unlink classes
    const teachersToDelete = this.state.teachers.filter(t => idSet.has(t.user_id) || idSet.has(t.id));
    const teacherIdSet = new Set(teachersToDelete.map(t => t.id));
    this.state.classes.forEach(c => {
      if (c.homeroom_teacher_id && teacherIdSet.has(c.homeroom_teacher_id)) {
        c.homeroom_teacher_id = null;
      }
      if (c.bk_teacher_id && (teacherIdSet.has(c.bk_teacher_id) || idSet.has(c.bk_teacher_id))) {
        c.bk_teacher_id = undefined;
      }
    });
    this.state.teachers = this.state.teachers.filter(t => !teacherIdSet.has(t.id) && !idSet.has(t.user_id));

    // 3. Delete users
    const initialLength = this.state.users.length;
    this.state.users = this.state.users.filter(u => !idSet.has(u.id));
    const deletedCount = initialLength - this.state.users.length;

    // 4. Clean notifications
    this.state.notifications = this.state.notifications.filter(n => !idSet.has(n.user_id));

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer('/api/users/bulk-delete', 'POST', { userIds });

    return { success: true, count: deletedCount };
  }

  public addStudent(data: { name: string; email: string; nis: string; class_id: string }): void {
    const now = new Date().toISOString();
    const defaultPass = `siswa${data.nis.slice(-4)}`;
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newUser: User = {
      id: `usr-std-${Date.now()}-${randomSuffix}`,
      name: data.name,
      email: data.email,
      role: 'siswa',
      password: hashPassword(defaultPass),
      password_changed: false,
      created_at: now
    };
    const newStudent: Student = {
      id: `std-${Date.now()}-${randomSuffix}`,
      user_id: newUser.id,
      nis: data.nis,
      class_id: data.class_id,
      created_at: now
    };
    this.state.users.push(newUser);
    this.state.students.push(newStudent);
    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer('/api/users/student', 'POST', {
      name: data.name,
      email: data.email,
      nis: data.nis,
      class_id: data.class_id,
      password: defaultPass
    });
  }

  public addTeacher(data: {
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
  }): { user: User; teacher: Teacher } {
    const now = new Date().toISOString();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newUser: User = {
      id: `usr-tch-${Date.now()}-${randomSuffix}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'guru',
      password: hashPassword('guru123'),
      password_changed: false, // Memerlukan ganti sandi pada login pertama
      phone: data.phone?.trim() || '',
      created_at: now
    };
    const newTeacher: Teacher = {
      id: `tch-${Date.now()}-${randomSuffix}`,
      user_id: newUser.id,
      nip: encryptNip(data.nip.trim()),
      teacher_type: data.teacher_type,
      specialization: data.specialization?.trim() || (data.teacher_type === 'guru_bk' ? 'Bimbingan Konseling Umum' : 'Wali Kelas'),
      room: data.room?.trim() || (data.teacher_type === 'guru_bk' ? 'Ruang BK' : 'Ruang Guru'),
      bio: data.bio?.trim() || (data.teacher_type === 'guru_bk' ? 'Mendampingi siswa dengan aman, suportif, dan menjaga privasi penuh.' : 'Mendampingi perkembangan akademik dan karakter kelas binaan.'),
      available_hours: data.available_hours?.trim() || 'Senin - Jumat (07.30 - 15.00 WIB)',
      assigned_class_ids: [],
      created_at: now
    };
    this.state.users.push(newUser);
    this.state.teachers.push(newTeacher);

    if (data.teacher_type === 'wali_kelas' && data.managed_class_id) {
      const cls = this.state.classes.find(c => c.id === data.managed_class_id);
      if (cls) {
        cls.homeroom_teacher_id = newTeacher.id;
      }
    }

    this.saveToStorage();
    this.notifyListeners();

    // Sync to backend Supabase/PostgreSQL
    this.syncToServer('/api/users/teacher', 'POST', {
      name: data.name.trim(),
      email: data.email.trim(),
      nip: data.nip.trim(),
      teacher_type: data.teacher_type,
      phone: data.phone?.trim() || '',
      specialization: data.specialization?.trim(),
      room: data.room?.trim(),
      bio: data.bio?.trim(),
      available_hours: data.available_hours?.trim(),
      managed_class_id: data.managed_class_id
    });

    return { user: newUser, teacher: newTeacher };
  }

  // --- CLASS BK TEACHER HELPERS ---
  public getClassBkTeacher(classId: string): Teacher | undefined {
    const cls = this.getClassById(classId);
    if (!cls?.bk_teacher_id) return undefined;
    return this.state.teachers.find(t => t.id === cls.bk_teacher_id || t.user_id === cls.bk_teacher_id);
  }

  public getBkTeacherForStudent(studentUserId: string): { teacher: Teacher; user: User } | undefined {
    const student = this.getStudentByUserId(studentUserId);
    if (!student) return undefined;
    const teacher = this.getClassBkTeacher(student.class_id);
    if (!teacher) return undefined;
    const user = this.getUserById(teacher.user_id);
    if (!user) return undefined;
    return { teacher, user };
  }

  // --- ANNOUNCEMENT (PENGUMUMAN SISWA) METHODS ---
  public getAnnouncements(user?: User | null): Announcement[] {
    const all = this.state.announcements || [];
    // Ensure read_by and read_by_user_ids are synchronized
    all.forEach(a => {
      if (!a.read_by_user_ids && a.read_by) {
        a.read_by_user_ids = [...a.read_by];
      } else if (!a.read_by && a.read_by_user_ids) {
        a.read_by = [...a.read_by_user_ids];
      }
      if (!a.author_user_id && a.author_id) {
        a.author_user_id = a.author_id;
      }
    });

    if (!user || user.role === 'admin' || user.role === 'guru') {
      return [...all].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Siswa: Filter by their grade or 'all', or matching student's class
    const student = this.getStudentByUserId(user.id);
    const studentClass = student ? this.getClassById(student.class_id) : undefined;
    const studentGrade = studentClass?.grade || '';
    const studentClassId = studentClass?.id || '';

    return all
      .filter(a => {
        if (a.target_class_id) {
          return a.target_class_id === studentClassId;
        }
        if (a.target_grade === 'all') return true;
        // Normalize grade comparison: 'X' <-> '10', 'XI' <-> '11', 'XII' <-> '12'
        const gradeMap: Record<string, string[]> = {
          '10': ['10', 'X'],
          'X': ['10', 'X'],
          '11': ['11', 'XI'],
          'XI': ['11', 'XI'],
          '12': ['12', 'XII'],
          'XII': ['12', 'XII']
        };
        const acceptableGrades = gradeMap[a.target_grade] || [a.target_grade];
        if (studentGrade && acceptableGrades.includes(studentGrade)) return true;
        return false;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getUnreadAnnouncementsCount(studentUser: User): number {
    if (studentUser.role !== 'siswa') return 0;
    const announcements = this.getAnnouncements(studentUser);
    return announcements.filter(a => {
      const readIds = a.read_by_user_ids || a.read_by || [];
      return !readIds.includes(studentUser.id);
    }).length;
  }

  public markAnnouncementAsRead(announcementId: string, userId: string, markRead: boolean = true): void {
    if (!this.state.announcements) return;
    const anc = this.state.announcements.find(a => a.id === announcementId);
    if (anc) {
      if (!anc.read_by) anc.read_by = [];
      if (!anc.read_by_user_ids) anc.read_by_user_ids = [...anc.read_by];

      if (markRead) {
        if (!anc.read_by.includes(userId)) anc.read_by.push(userId);
        if (!anc.read_by_user_ids.includes(userId)) anc.read_by_user_ids.push(userId);
      } else {
        anc.read_by = anc.read_by.filter(id => id !== userId);
        anc.read_by_user_ids = anc.read_by_user_ids.filter(id => id !== userId);
      }
      this.saveToStorage();
    }
  }

  public createAnnouncement(
    param1: User | {
      title: string;
      content: string;
      author_user_id?: string;
      author_id?: string;
      author_name?: string;
      author_role?: string;
      author_avatar?: string;
      target_grade: AnnouncementTargetGrade;
      target_class_id?: string;
      target_class_name?: string;
      category?: string;
      link_url?: string;
      link_title?: string;
      image_url?: string;
      video_url?: string;
      attachments?: AnnouncementAttachment[];
    },
    param2?: {
      title: string;
      content: string;
      target_grade: AnnouncementTargetGrade;
      target_class_id?: string;
      target_class_name?: string;
      category?: string;
      link_url?: string;
      link_title?: string;
      image_url?: string;
      video_url?: string;
      attachments?: AnnouncementAttachment[];
    }
  ): Announcement {
    let authorId = '';
    let authorName = '';
    let authorRole = '';
    let authorAvatar: string | undefined = undefined;
    let data: {
      title: string;
      content: string;
      target_grade: AnnouncementTargetGrade;
      target_class_id?: string;
      target_class_name?: string;
      category?: string;
      link_url?: string;
      link_title?: string;
      image_url?: string;
      video_url?: string;
      attachments?: AnnouncementAttachment[];
    };

    if (param2) {
      // Called as createAnnouncement(user, data)
      const authorUser = param1 as User;
      const teacher = this.getTeacherByUserId(authorUser.id);
      authorId = authorUser.id;
      authorName = authorUser.name;
      authorRole = authorUser.role === 'admin' ? 'Admin Sekolah' : (teacher?.teacher_type === 'guru_bk' ? 'Guru BK' : 'Wali Kelas');
      authorAvatar = authorUser.avatar;
      data = param2;
    } else {
      // Called as createAnnouncement(dataWithAuthor)
      const d = param1 as {
        title: string;
        content: string;
        author_user_id?: string;
        author_id?: string;
        author_name?: string;
        author_role?: string;
        author_avatar?: string;
        target_grade: AnnouncementTargetGrade;
        target_class_id?: string;
        target_class_name?: string;
        category?: string;
        link_url?: string;
        link_title?: string;
        image_url?: string;
        video_url?: string;
        attachments?: AnnouncementAttachment[];
      };
      authorId = d.author_user_id || d.author_id || 'system';
      authorName = d.author_name || 'Bimbingan Konseling';
      authorRole = d.author_role || 'Guru BK';
      authorAvatar = d.author_avatar;
      data = d;
    }

    const newAnc: Announcement = {
      id: `anc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: data.title.trim(),
      content: data.content.trim(),
      author_id: authorId,
      author_user_id: authorId,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar,
      target_grade: data.target_grade,
      target_class_id: data.target_class_id,
      target_class_name: data.target_class_name,
      category: data.category || 'Bimbingan Konseling',
      link_url: data.link_url,
      link_title: data.link_title,
      image_url: data.image_url,
      video_url: data.video_url,
      attachments: data.attachments || [],
      read_by: [],
      read_by_user_ids: [],
      created_at: new Date().toISOString()
    };

    if (!this.state.announcements) {
      this.state.announcements = [];
    }
    this.state.announcements.unshift(newAnc);
    this.saveToStorage();

    // Create notifications for targeted students
    try {
      const targetStudents = this.state.students.filter(s => {
        const cls = this.getClassById(s.class_id);
        if (data.target_class_id) return s.class_id === data.target_class_id;
        if (data.target_grade === 'all') return true;
        const gradeMap: Record<string, string[]> = {
          '10': ['10', 'X'],
          'X': ['10', 'X'],
          '11': ['11', 'XI'],
          'XI': ['11', 'XI'],
          '12': ['12', 'XII'],
          'XII': ['12', 'XII']
        };
        const acceptableGrades = gradeMap[data.target_grade] || [data.target_grade];
        return cls?.grade && acceptableGrades.includes(cls.grade);
      });

      for (const std of targetStudents) {
        this.state.notifications.unshift({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          user_id: std.user_id,
          report_id: '',
          title: `Pengumuman: ${data.title.trim()}`,
          message: `${authorName} (${authorRole}) mengunggah pengumuman baru untuk siswa.`,
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
      this.saveToStorage();
    } catch {
      // Non-blocking notification creation
    }

    return newAnc;
  }

  public deleteAnnouncement(announcementId: string): boolean {
    if (!this.state.announcements) return false;
    const initialLen = this.state.announcements.length;
    this.state.announcements = this.state.announcements.filter(a => a.id !== announcementId);
    if (this.state.announcements.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public updateAnnouncement(announcementId: string, data: Partial<Announcement>): Announcement | null {
    if (!this.state.announcements) return null;
    const anc = this.state.announcements.find(a => a.id === announcementId);
    if (!anc) return null;
    Object.assign(anc, data, { updated_at: new Date().toISOString() });
    this.saveToStorage();
    return anc;
  }

  // ==========================================
  // --- FITUR ABSENSI MOOD CHECK SISWA ---
  // ==========================================

  public getMoodChecks(): StudentMoodCheck[] {
    if (!Array.isArray(this.state.mood_checks)) {
      this.state.mood_checks = [...INITIAL_MOOD_CHECKS];
    }
    return [...this.state.mood_checks];
  }

  public getMoodCheckByStudentToday(studentId: string, targetDate?: string): StudentMoodCheck | undefined {
    const checks = this.getMoodChecks();
    const today = targetDate || new Date().toISOString().split('T')[0];
    return checks.find(m => (m.student_id === studentId || m.student_user_id === studentId) && m.date === today);
  }

  public getMoodChecksByStudent(studentId: string): StudentMoodCheck[] {
    const checks = this.getMoodChecks();
    return checks
      .filter(m => m.student_id === studentId || m.student_user_id === studentId)
      .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime());
  }

  /**
   * Mengambil rekapan mood check siswa untuk Guru BK atau Wali Kelas
   * Sesuai kelas binaan / rombel yang diampu secara spesifik.
   * Guru hanya dapat melihat mood check siswa dari kelas yang diampunya.
   */
  public getMoodChecksForTeacher(teacherUserIdOrId: string, classFilter = 'all', dateFilter = 'all'): StudentMoodCheck[] {
    const allChecks = this.getMoodChecks();
    const teacher = this.state.teachers.find(t => t.id === teacherUserIdOrId || t.user_id === teacherUserIdOrId);

    if (!teacher) {
      return [];
    }

    // Tentukan kelas yang diampu secara ketat sesuai penugasan guru
    const managedClasses = this.getClassesForTeacher(teacher.id);
    const managedClassIds = managedClasses.map(c => c.id);

    // Jika guru belum/tidak mengampu kelas manapun, tidak menampilkan data kelas lain
    if (managedClassIds.length === 0) {
      return [];
    }

    // Filter HANYA berdasarkan kelas yang diampu guru
    let filtered = allChecks.filter(m => managedClassIds.includes(m.class_id));

    // Filter spesifik kelas jika dipilih oleh guru
    if (classFilter && classFilter !== 'all') {
      filtered = filtered.filter(m => m.class_id === classFilter);
    }

    // Filter tanggal
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateFilter === 'today') {
      filtered = filtered.filter(m => m.date === todayStr);
    } else if (dateFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];
      filtered = filtered.filter(m => m.date >= sevenDaysStr);
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysStr = thirtyDaysAgo.toISOString().split('T')[0];
      filtered = filtered.filter(m => m.date >= thirtyDaysStr);
    } else if (dateFilter && dateFilter.startsWith('month:')) {
      const yearMonth = dateFilter.replace('month:', '');
      filtered = filtered.filter(m => m.date.startsWith(yearMonth));
    } else if (dateFilter && dateFilter.startsWith('date:')) {
      const targetDate = dateFilter.replace('date:', '');
      filtered = filtered.filter(m => m.date === targetDate);
    } else if (dateFilter && dateFilter !== 'all') {
      // Tanggal spesifik YYYY-MM-DD
      filtered = filtered.filter(m => m.date === dateFilter);
    }

    return filtered.sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime());
  }

  /**
   * Mengambil daftar siswa dalam kelas tertentu beserta data profil user
   */
  public getStudentsByClassId(classId: string): Array<{
    id: string;
    nis: string;
    name: string;
    user_id: string;
    avatar?: string;
    class_id: string;
    class_name: string;
  }> {
    const sClass = this.getClassById(classId);
    return this.state.students
      .filter(s => s.class_id === classId)
      .map(s => {
        const u = this.getUserById(s.user_id);
        return {
          id: s.id,
          nis: s.nis,
          name: u?.name || 'Siswa',
          user_id: s.user_id,
          avatar: u?.avatar,
          class_id: s.class_id,
          class_name: sClass?.name || 'Kelas'
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Mengambil linimasa mood siswa yang dapat disortir per bulan (format 'YYYY-MM')
   */
  public getStudentMoodTimeline(studentId: string, monthStr?: string): StudentMoodCheck[] {
    let list = this.getMoodChecksByStudent(studentId);
    if (monthStr && monthStr !== 'all') {
      list = list.filter(m => m.date.startsWith(monthStr));
    }
    return list.sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime());
  }

  public submitMoodCheck(params: {
    student_id: string;
    mood: MoodType;
    emotions: string[];
    trigger?: string;
    note?: string;
    needs_counseling: boolean;
  }): { success: boolean; data: StudentMoodCheck } {
    const student = this.state.students.find(s => s.id === params.student_id || s.user_id === params.student_id);
    if (!student) {
      throw new Error('Data siswa tidak ditemukan.');
    }

    const user = this.state.users.find(u => u.id === student.user_id);
    const sClass = this.state.classes.find(c => c.id === student.class_id);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Hitung bobot skor mood
    const scoreMap: Record<MoodType, number> = {
      sangat_senang: 5,
      senang: 4,
      netral: 3,
      sedih: 2,
      cemas: 1,
      marah: 1
    };

    const moodScore = scoreMap[params.mood] || 3;

    if (!Array.isArray(this.state.mood_checks)) {
      this.state.mood_checks = [];
    }

    // Cek apakah sudah absen hari ini
    const existingIndex = this.state.mood_checks.findIndex(
      m => m.student_id === student.id && m.date === todayStr
    );

    let savedRecord: StudentMoodCheck;

    if (existingIndex >= 0) {
      // Perbarui absen mood hari ini
      const prev = this.state.mood_checks[existingIndex];
      savedRecord = {
        ...prev,
        time: timeStr,
        mood: params.mood,
        mood_score: moodScore,
        emotions: params.emotions,
        trigger: params.trigger || prev.trigger,
        note: params.note !== undefined ? params.note : prev.note,
        needs_counseling: params.needs_counseling,
        status: params.needs_counseling ? 'belum_ditinjau' : prev.status
      };
      this.state.mood_checks[existingIndex] = savedRecord;
    } else {
      // Buat baru
      savedRecord = {
        id: `mood-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        student_id: student.id,
        student_user_id: student.user_id,
        student_name: user?.name || 'Siswa',
        student_nis: student.nis,
        student_avatar: user?.avatar,
        class_id: student.class_id,
        class_name: sClass?.name || 'Kelas',
        date: todayStr,
        time: timeStr,
        mood: params.mood,
        mood_score: moodScore,
        emotions: params.emotions,
        trigger: params.trigger,
        note: params.note,
        needs_counseling: params.needs_counseling,
        status: 'belum_ditinjau',
        created_at: now.toISOString()
      };
      this.state.mood_checks.unshift(savedRecord);
    }

    // Jika siswa meminta konseling, kirim notifikasi ke Guru BK kelas
    if (params.needs_counseling) {
      const bkTeacherId = sClass?.bk_teacher_id || getBkTeacherIdForClass(student.class_id);
      const bkTeacher = this.state.teachers.find(t => t.id === bkTeacherId);
      if (bkTeacher) {
        this.state.notifications.unshift({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          user_id: bkTeacher.user_id,
          title: `Permintaan Konseling: ${user?.name || 'Siswa'} (${sClass?.name || ''})`,
          message: `Siswa mencatat kondisi mood [${params.mood.replace('_', ' ').toUpperCase()}] dan mengharapkan bimbingan/bicara dengan Guru BK.`,
          report_id: '',
          is_read: false,
          created_at: now.toISOString()
        });
      }
    }

    this.saveToStorage();
    this.notifyListeners();
    return { success: true, data: savedRecord };
  }

  public reviewMoodCheck(
    moodCheckId: string,
    teacherIdOrUserId: string,
    teacherNotes?: string,
    newStatus: 'sudah_ditinjau' | 'dalam_tindak_lanjut' = 'sudah_ditinjau'
  ): { success: boolean } {
    const item = this.state.mood_checks.find(m => m.id === moodCheckId);
    if (!item) {
      return { success: false };
    }

    const teacher = this.state.teachers.find(t => t.id === teacherIdOrUserId || t.user_id === teacherIdOrUserId);
    const teacherUser = teacher ? this.state.users.find(u => u.id === teacher.user_id) : null;

    item.status = newStatus;
    // Jika guru bk kelas sudah mengubah status tindak lanjut menjadi 'sudah_ditinjau' (Sudah Ditinjau & Terpantau Baik),
    // maka status butuh konseling pada rekap mood siswa akan menghilang.
    if (newStatus === 'sudah_ditinjau') {
      item.needs_counseling = false;
    }
    item.reviewed_by_teacher_id = teacher?.id || teacherIdOrUserId;
    item.reviewed_by_teacher_name = teacherUser?.name || 'Guru BK';
    item.reviewed_at = new Date().toISOString();
    if (teacherNotes !== undefined) {
      item.teacher_notes = teacherNotes;
    }

    this.saveToStorage();
    this.notifyListeners();
    return { success: true };
  }

  public deleteMoodCheck(moodCheckId: string): boolean {
    if (!this.state.mood_checks) return false;
    const initialLen = this.state.mood_checks.length;
    this.state.mood_checks = this.state.mood_checks.filter(m => m.id !== moodCheckId);
    if (this.state.mood_checks.length !== initialLen) {
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }
}

export const db = new DatabaseService();
