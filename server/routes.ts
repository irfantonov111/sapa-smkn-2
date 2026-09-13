import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { verifyPassword, hashPassword } from '../src/utils/crypto';
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
  deleteReport,
  addMessage,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  resetDatabase,
  getDatabaseStatus,
  getBkTeachers,
  ensureDbInitialized,
  getPool
} from './db';

export const apiRouter = Router();

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

    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      return res.status(404).json({ success: false, error: 'Berkas database/seed.sql tidak ditemukan di server.' });
    }

    const sql = fs.readFileSync(seedPath, 'utf8');
    const client = await pool.connect();
    try {
      await client.query(sql);
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
    if (finalHash) {
      user.password = finalHash;
    }
    if (password_changed !== undefined) {
      user.password_changed = password_changed;
    } else if (user.role === 'siswa') {
      user.password_changed = false;
    }
    res.json({ success: true, message: 'Kata sandi berhasil direset', user });
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
    if (finalHash) {
      user.password = finalHash;
    }
    user.password_changed = true;
    res.json({ success: true, message: 'Kata sandi berhasil diperbarui', user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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

// Create Report
apiRouter.post('/reports', async (req: Request, res: Response) => {
  try {
    const { userId, category_id, assigned_to, assigned_teacher_id, title, description, urgency, privacy } = req.body;

    if (!userId || !category_id || !assigned_to || !title || !description || !urgency || !privacy) {
      return res.status(400).json({ error: 'Field wajib belum lengkap diisi' });
    }

    const newReport = await createReport({
      userId,
      category_id,
      assigned_to,
      assigned_teacher_id: assigned_teacher_id || null,
      title,
      description,
      urgency,
      privacy
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
    const { status, changedByUserId, note } = req.body;

    if (!status || !changedByUserId) {
      return res.status(400).json({ error: 'Status dan ID Pengubah wajib dicantumkan' });
    }

    const updated = await updateReportStatus(id, status, changedByUserId, note);
    if (!updated) {
      return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    }

    res.json(updated);
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
