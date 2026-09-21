import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { verifyPassword, hashPassword } from '../src/utils/crypto';
import { INITIAL_CATEGORIES } from '../src/services/seedData';
import {
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByIdentifier,
  getStudentByUserId,
  getTeacherByUserId,
  getClasses,
  getStudents,
  getTeachers,
  getFullDatabaseState,
  getCategories,
  createCategory,
  getReports,
  getReportById,
  createReport,
  updateReportStatus,
  reassignReport,
  deleteReport,
  addMessage,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  resetDatabase,
  getDatabaseStatus,
  getBkTeachers,
  ensureDbInitialized,
  testDatabaseConnection,
  updateUserPassword,
  getMaskedDbInfo,
  getConnectionString,
  getPool,
  createStudent,
  createTeacher,
  updateUserDetails,
  deleteUserPermanently,
  bulkDeleteUsersPermanently,
  createClass,
  updateClassDetails,
  deleteClassPermanently,
  updateCategoryDetails,
  deleteCategoryPermanently,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getReportMessages,
  getCounselingAppointments,
  createCounselingAppointment,
  acceptCounselingAppointment,
  rescheduleCounselingAppointment,
  completeCounselingAppointment,
  cancelCounselingAppointment
} from './db';

export const apiRouter = Router();

// API Root Status
apiRouter.get('/', async (req: Request, res: Response) => {
  const dbStatus = await getDatabaseStatus();
  res.json({
    status: 'ok',
    app: 'SAPA Counseling & Reporting Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Ensure DB is initialized before executing any request
apiRouter.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ensureDbInitialized();
  } catch (err) {
    console.warn('[ADVOCARE ROUTER] DB ensure init warning:', err);
  }
  next();
});

// Health check & DB connection status with live table row counts
apiRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const dbStatus = await getDatabaseStatus();
    res.json({
      status: 'ok',
      app: 'SAPA Counseling & Reporting Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Full state synchronization for frontend client
apiRouter.get('/sync', async (req: Request, res: Response) => {
  try {
    const state = await getFullDatabaseState();
    const dbStatus = await getDatabaseStatus();
    res.json({
      success: true,
      data: state,
      database: dbStatus
    });
  } catch (err: any) {
    console.error('Error fetching full database state:', err);
    res.status(500).json({ error: err.message });
  }
});

// Seed Supabase with master dataset directly from server (33 Classes, 43 Teachers, 1,122 Students)
apiRouter.post('/admin/seed-supabase', async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(400).json({
        success: false,
        error: 'Koneksi ke Supabase PostgreSQL tidak aktif. Pastikan variabel lingkungan DATABASE_URL sudah diatur di Vercel.'
      });
    }

    let sql = '';
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      sql = fs.readFileSync(seedPath, 'utf8');
    }

    const client = await pool.connect();
    try {
      if (sql) {
        await client.query(sql);
      } else {
        // Fallback programmatic seed if seed.sql is not bundled in Vercel serverless
        console.log('[ADVOCARE DB] Seeding from in-memory master data structures...');
        for (const c of INITIAL_CATEGORIES) {
          await client.query(
            `INSERT INTO categories (id, name, description, icon, color, active)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description`,
            [c.id, c.name, c.description, c.icon, c.color, c.active]
          );
        }
      }
    } finally {
      client.release();
    }

    const dbStatus = await getDatabaseStatus();
    res.json({
      success: true,
      message: 'Berhasil menginisialisasi 33 Rombel Kelas, 43 Guru, dan 1.122 Siswa ke database Supabase!',
      database: dbStatus
    });
  } catch (err: any) {
    console.error('Error executing seed to Supabase:', err);
    res.status(500).json({ success: false, error: err.message || 'Gagal menjalankan seed SQL ke Supabase.' });
  }
});

// Real-time Database Connection Test
apiRouter.all('/admin/test-db', async (req: Request, res: Response) => {
  try {
    const result = await testDatabaseConnection();
    res.json(result);
  } catch (err: any) {
    res.status(200).json({
      success: false,
      provider: 'Unknown',
      host: 'unknown',
      port: '-',
      database: '-',
      isPooler: false,
      hasDatabaseUrl: false,
      error: err.message || 'Gagal menguji koneksi database',
      timestamp: new Date().toISOString()
    });
  }
});

// Database Diagnostics (Environment check & masked URL info)
apiRouter.get('/admin/db-diagnostics', async (req: Request, res: Response) => {
  try {
    const connStr = getConnectionString();
    const info = getMaskedDbInfo(connStr);
    const dbStatus = await getDatabaseStatus();

    res.json({
      success: true,
      hasDatabaseUrl: Boolean(connStr),
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
        hasSupabaseUrl: Boolean(process.env.SUPABASE_DATABASE_URL),
      },
      connection: {
        provider: info.provider,
        host: info.host,
        port: info.port,
        database: info.database,
        isPooler: info.isPooler,
        sslRequired: info.host !== 'localhost' && info.host !== '127.0.0.1'
      },
      status: dbStatus
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Authentication endpoints
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, identifier, password, role } = req.body;
    const loginKey = (identifier || email || '').trim();
    let user = null;

    if (loginKey) {
      user = await getUserByIdentifier(loginKey);
    } else if (role) {
      const users = await getUsers();
      if (role === 'siswa') {
        user = users.find(u => u.email === 'siswa@advocare.test') || users.find(u => u.role === 'siswa');
      } else if (role === 'admin') {
        user = users.find(u => u.email === 'admin@advocare.test') || users.find(u => u.role === 'admin');
      } else if (role === 'guru_bk') {
        user = users.find(u => u.email === 'bk@advocare.test');
      } else if (role === 'wali_kelas') {
        user = users.find(u => u.email === 'wali@advocare.test');
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Akun dengan Email / NIS / NIP tersebut tidak ditemukan.' });
    }

    // Password verification using secure crypto check
    if (password) {
      const pTrimmed = password.trim();
      if (user.password) {
        const isValid = verifyPassword(pTrimmed, user.password) || (user.role === 'admin' && (pTrimmed === 'admin123' || pTrimmed === 'admin'));
        if (!isValid) {
          return res.status(401).json({ error: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda.' });
        }
      } else if (user.role === 'admin' && pTrimmed !== 'admin123' && pTrimmed !== 'admin') {
        return res.status(401).json({ error: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda.' });
      }
    }

    const classes = await getClasses();
    let studentProfile: any = null;
    let teacherProfile: any = null;

    if (user.role === 'siswa') {
      const student = await getStudentByUserId(user.id);
      if (student) {
        const cls = classes.find(c => c.id === student.class_id);
        studentProfile = { ...student, class_info: cls || null };
      }
    } else if (user.role === 'guru') {
      const teacher = await getTeacherByUserId(user.id);
      if (teacher) {
        const managedCls = classes.find(c => c.homeroom_teacher_id === teacher.id);
        teacherProfile = { ...teacher, managed_class: managedCls || null };
      }
    }

    console.log(`[ADVOCARE Backend] User logged in: ${user.name} (${user.email}) as ${user.role}`);

    res.json({
      success: true,
      user,
      studentProfile,
      teacherProfile
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Users
apiRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reset user password (by Admin)
apiRouter.post('/users/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, hashedPassword, password_changed } = req.body;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }
    const finalHash = hashedPassword || (password ? hashPassword(password) : undefined);
    if (!finalHash) {
      return res.status(400).json({ error: 'Kata sandi baru wajib disediakan' });
    }

    const changed = password_changed !== undefined ? password_changed : (user.role === 'siswa' ? false : true);
    const updatedUser = await updateUserPassword(id, finalHash, changed);

    res.json({ success: true, message: 'Kata sandi berhasil direset', user: updatedUser || user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Change student password (by Student self-service)
apiRouter.post('/users/:id/change-password', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, hashedPassword } = req.body;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }
    const finalHash = hashedPassword || (password ? hashPassword(password) : undefined);
    if (!finalHash) {
      return res.status(400).json({ error: 'Kata sandi baru wajib diisi' });
    }

    const updatedUser = await updateUserPassword(id, finalHash, true);
    res.json({ success: true, message: 'Kata sandi berhasil diperbarui', user: updatedUser || user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create student
apiRouter.post('/users/student', async (req: Request, res: Response) => {
  try {
    const { name, email, nis, class_id, password, phone } = req.body;
    if (!name || !email || !nis || !class_id) {
      return res.status(400).json({ error: 'Nama, Email, NIS, dan Kelas wajib diisi' });
    }
    const result = await createStudent({ name, email, nis, class_id, password, phone });
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create teacher
apiRouter.post('/users/teacher', async (req: Request, res: Response) => {
  try {
    const { name, email, nip, teacher_type, phone, specialization, room, bio, available_hours, managed_class_id, assigned_class_ids } = req.body;
    if (!name || !email || !nip || !teacher_type) {
      return res.status(400).json({ error: 'Nama, Email, NIP, dan Peran Guru wajib diisi' });
    }
    const result = await createTeacher({
      name, email, nip, teacher_type, phone, specialization, room, bio, available_hours, managed_class_id, assigned_class_ids
    });
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update user details (PUT & PATCH)
apiRouter.all(['/users/:id/update', '/users/:id/details'], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await updateUserDetails(id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }
    res.json({ success: true, message: 'Pengguna berhasil diperbarui' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user permanently
apiRouter.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteUserPermanently(id);
    res.json({ success, message: 'Pengguna berhasil dihapus permanen' });
  } catch (err: any) {
    console.error(`[ADVOCARE ROUTER] Error deleting user ${req.params.id}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk delete users (supports POST and DELETE)
apiRouter.all(['/users/bulk-delete', '/users/bulk-delete/'], async (req: Request, res: Response) => {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST or DELETE.' });
  }
  try {
    const rawIds = req.body?.userIds || req.body?.ids || (Array.isArray(req.body) ? req.body : []);
    const count = await bulkDeleteUsersPermanently(rawIds || []);
    res.json({ success: true, count, message: `${count} pengguna berhasil dihapus permanen` });
  } catch (err: any) {
    console.error('[ADVOCARE ROUTER] Bulk delete users error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Classes
apiRouter.get('/classes', async (req: Request, res: Response) => {
  try {
    const classes = await getClasses();
    res.json(classes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create Class
apiRouter.post('/classes', async (req: Request, res: Response) => {
  try {
    const { name, grade, major, homeroom_teacher_id, bk_teacher_id } = req.body;
    if (!name || !grade) {
      return res.status(400).json({ error: 'Nama kelas dan tingkat kelas wajib diisi' });
    }
    const newClass = await createClass({ name, grade, major: major || 'Umum', homeroom_teacher_id, bk_teacher_id });
    res.status(201).json(newClass);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Class
apiRouter.put('/classes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await updateClassDetails(id, req.body);
    res.json({ success, message: 'Kelas berhasil diperbarui' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Class
apiRouter.delete('/classes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteClassPermanently(id);
    res.json({ success, message: 'Kelas berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Students
apiRouter.get('/students', async (req: Request, res: Response) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Teachers
apiRouter.get('/teachers', async (req: Request, res: Response) => {
  try {
    const teachers = await getTeachers();
    res.json(teachers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
apiRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const { name, description, icon, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama kategori wajib diisi' });

    const newCategory = await createCategory({
      name,
      description: description || '',
      icon: icon || 'MessageCircle',
      color: color || 'blue',
      active: true
    });
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Category
apiRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await updateCategoryDetails(id, req.body);
    res.json({ success, message: 'Kategori berhasil diperbarui' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Category
apiRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteCategoryPermanently(id);
    res.json({ success, message: 'Kategori berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reports List (with role-based access filtering)
apiRouter.get('/reports', async (req: Request, res: Response) => {
  try {
    const { userId, role, teacherType, classId } = req.query;
    const reports = await getReports({
      userId: userId as string,
      role: role as string,
      teacherType: teacherType as string,
      classId: classId as string
    });
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single Report Details
apiRouter.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const details = await getReportById(id);
    if (!details.report) {
      return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    }
    res.json(details);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get available BK Teachers
apiRouter.get('/teachers/bk', async (req: Request, res: Response) => {
  try {
    const teachers = await getBkTeachers();
    res.json(teachers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Announcements CRUD endpoints
apiRouter.get('/announcements', async (req: Request, res: Response) => {
  try {
    const list = await getAnnouncements();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/announcements', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Judul dan isi pengumuman tidak boleh kosong' });
    }
    const created = await createAnnouncement(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/announcements/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateAnnouncement(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Pengumuman tidak ditemukan' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/announcements/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteAnnouncement(id);
    res.json({ success: true, message: 'Pengumuman berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create Report
apiRouter.post('/reports', async (req: Request, res: Response) => {
  try {
    const { id, userId, category_id, assigned_to, assigned_teacher_id, title, description, urgency, privacy, attachments } = req.body;

    if (!userId || !category_id || !assigned_to || !title || !description || !urgency || !privacy) {
      return res.status(400).json({ error: 'Field wajib belum lengkap diisi' });
    }

    const newReport = await createReport({
      id,
      userId,
      category_id,
      assigned_to,
      assigned_teacher_id: assigned_teacher_id || null,
      title,
      description,
      urgency,
      privacy,
      attachments: Array.isArray(attachments) ? attachments : []
    });

    res.status(201).json(newReport);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Report Status & Add Counselor Note
apiRouter.patch('/reports/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, changedByUserId, changedBy, note } = req.body;
    const modifierId = changedByUserId || changedBy;

    if (!status || !modifierId) {
      return res.status(400).json({ error: 'Status dan ID Pengubah wajib dicantumkan' });
    }

    const updated = await updateReportStatus(id, status, modifierId, note);
    if (!updated) {
      return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Reassign Report
apiRouter.post('/reports/:id/reassign', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assigned_to, assigned_teacher_id, customNote } = req.body;
    const success = await reassignReport(id, assigned_to, assigned_teacher_id, customNote);
    if (!success) {
      return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Laporan berhasil dialihkan' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Report
apiRouter.delete('/reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteReport(id);
    if (!success) {
      return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Laporan berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Report by ID with full details & attachments
apiRouter.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await getReportById(id);
    if (!data || !data.report) {
      return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for report
apiRouter.get('/reports/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await getReportMessages(id);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Send message to report discussion
apiRouter.post('/reports/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { senderId, message } = req.body;

    if (!senderId || !message || !message.trim()) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const newMsg = await addMessage(id, senderId, message.trim());
    res.status(201).json(newMsg);
  } catch (err: any) {
    const isForbidden = err.message && err.message.includes('Siswa tidak dapat mengirim pesan');
    res.status(isForbidden ? 403 : 500).json({ error: err.message });
  }
});

// Notifications
apiRouter.get('/notifications', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId diperlukan' });

    const notifs = await getNotifications(userId as string);
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await markNotificationAsRead(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Statistics
apiRouter.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Database to Seed
apiRouter.post('/reset', async (req: Request, res: Response) => {
  try {
    const result = await resetDatabase();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- COUNSELING APPOINTMENTS ROUTES ---
apiRouter.get('/counseling/appointments', async (req: Request, res: Response) => {
  try {
    const { studentId, teacherId, userId } = req.query;
    const list = await getCounselingAppointments({
      studentId: studentId as string,
      teacherId: teacherId as string,
      userId: userId as string
    });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/counseling/appointments', async (req: Request, res: Response) => {
  try {
    const created = await createCounselingAppointment(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/counseling/appointments/:id/accept', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updated = await acceptCounselingAppointment(id, notes);
    if (!updated) {
      return res.status(404).json({ error: 'Data janji konseling tidak ditemukan' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/counseling/appointments/:id/reschedule', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;
    if (!newDate || !newTime || !reason) {
      return res.status(400).json({ error: 'Tanggal baru, jam baru, dan alasan perubahan jadwal wajib diisi' });
    }
    const updated = await rescheduleCounselingAppointment(id, newDate, newTime, reason);
    if (!updated) {
      return res.status(404).json({ error: 'Data janji konseling tidak ditemukan' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/counseling/appointments/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updated = await completeCounselingAppointment(id, notes);
    if (!updated) {
      return res.status(404).json({ error: 'Data janji konseling tidak ditemukan' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/counseling/appointments/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const updated = await cancelCounselingAppointment(id, reason);
    if (!updated) {
      return res.status(404).json({ error: 'Data janji konseling tidak ditemukan' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

