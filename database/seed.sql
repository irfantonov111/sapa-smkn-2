-- ==============================================================================
-- SAPA (Sarana Pendampingan dan Asistensi Siswa) PostgreSQL Database Seed Script
-- Khusus Data Administrator Sistem (Clean State / Siap Import Siswa & Guru)
-- Kompatibel dengan Supabase, Neon, Vercel Postgres, atau PostgreSQL Lokal
-- ==============================================================================

BEGIN;

-- Wajib: Arahkan eksekusi secara ketat ke skema public agar tidak bertabrakan dengan skema internal Supabase
SET search_path = public;

-- ==============================================================================
-- 1. PEMBUATAN STRUKTUR TABEL (DDL) JIKA BELUM TERSEDIA
-- ==============================================================================

-- 1.1 Users (Kredensial Pengguna: Siswa, Guru, Admin)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('siswa', 'guru', 'admin')),
    gender VARCHAR(10) CHECK (gender IN ('L', 'P')),
    avatar TEXT,
    phone VARCHAR(30),
    password_changed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 Classes (Rombongan Belajar / Kelas Sekolah)
CREATE TABLE IF NOT EXISTS public.classes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    major VARCHAR(100) NOT NULL,
    homeroom_teacher_id VARCHAR(50),
    bk_teacher_id VARCHAR(50)
);

-- 1.3 Students (Profil Siswa)
CREATE TABLE IF NOT EXISTS public.students (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    nis VARCHAR(50) UNIQUE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('L', 'P')),
    class_id VARCHAR(50) REFERENCES public.classes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.4 Teachers (Profil Guru: Guru BK atau Wali Kelas)
CREATE TABLE IF NOT EXISTS public.teachers (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    nip VARCHAR(255) UNIQUE NOT NULL,
    teacher_type VARCHAR(30) NOT NULL CHECK (teacher_type IN ('guru_bk', 'wali_kelas')),
    gender VARCHAR(10) CHECK (gender IN ('L', 'P')),
    specialization VARCHAR(255),
    room VARCHAR(100),
    bio TEXT,
    available_hours VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    assigned_class_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 Categories (Kategori Aduan & Konseling)
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'MessageCircle',
    color VARCHAR(30) DEFAULT 'blue',
    active BOOLEAN DEFAULT TRUE
);

-- 1.6 Reports (Data Aduan / Konseling Siswa)
CREATE TABLE IF NOT EXISTS public.reports (
    id VARCHAR(50) PRIMARY KEY,
    report_code VARCHAR(30) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    assigned_to VARCHAR(30) NOT NULL CHECK (assigned_to IN ('guru_bk', 'wali_kelas')),
    assigned_teacher_id VARCHAR(50) REFERENCES public.teachers(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('rendah', 'sedang', 'tinggi')),
    privacy VARCHAR(20) NOT NULL CHECK (privacy IN ('terbuka', 'terbatas', 'anonim')),
    status VARCHAR(30) NOT NULL DEFAULT 'terkirim' CHECK (status IN ('terkirim', 'dibaca', 'direspons', 'ditindaklanjuti', 'selesai')),
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- 1.7 Messages (Pesan Interaktif Dua Arah Siswa & Guru)
CREATE TABLE IF NOT EXISTS public.messages (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    sender_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    attachment_type VARCHAR(20),
    attachment_size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- 1.8 Report Status History (Audit Trail Penanganan Laporan)
CREATE TABLE IF NOT EXISTS public.report_status_history (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.9 Notifications (Pemberitahuan Sistem Pengguna)
CREATE TABLE IF NOT EXISTS public.notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    report_id VARCHAR(50) REFERENCES public.reports(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.10 Student Mood Checks (Pencatatan Mood & Kesehatan Emosi Siswa Harian)
CREATE TABLE IF NOT EXISTS public.student_mood_checks (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- 1.11 Announcements (Pengumuman Sekolah & Edukasi Guru BK)
CREATE TABLE IF NOT EXISTS public.announcements (
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

-- 1.12 System Settings (Pengaturan Informasi Sekolah & Kontak)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id VARCHAR(50) PRIMARY KEY,
    school_name VARCHAR(200) NOT NULL,
    school_tagline TEXT,
    reset_password_email VARCHAR(150),
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50),
    address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.13 Counseling Appointments (Jadwal Bimbingan Konseling Tatap Muka / Chat)
CREATE TABLE IF NOT EXISTS public.counseling_appointments (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    student_class_name VARCHAR(100),
    teacher_id VARCHAR(50) NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    teacher_user_id VARCHAR(50) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    teacher_name VARCHAR(150) NOT NULL,
    requested_date VARCHAR(30) NOT NULL,
    requested_time VARCHAR(20) NOT NULL,
    confirmed_date VARCHAR(30),
    confirmed_time VARCHAR(20),
    topic TEXT NOT NULL,
    counseling_type VARCHAR(30) DEFAULT 'tatap_muka' CHECK (counseling_type IN ('tatap_muka', 'online_chat')),
    status VARCHAR(30) DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'dijadwalkan_ulang', 'selesai', 'dibatalkan')),
    reschedule_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. INDEKS KINERJA DATABASE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_students_nis ON public.students(nis);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_teachers_nip ON public.teachers(nip);
CREATE INDEX IF NOT EXISTS idx_teachers_assigned_classes ON public.teachers USING gin (assigned_class_ids);
CREATE INDEX IF NOT EXISTS idx_classes_bk_teacher ON public.classes(bk_teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_homeroom_teacher ON public.classes(homeroom_teacher_id);
CREATE INDEX IF NOT EXISTS idx_reports_student ON public.reports(student_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_assigned ON public.reports(assigned_to);
CREATE INDEX IF NOT EXISTS idx_messages_report ON public.messages(report_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_status_history_report ON public.report_status_history(report_id);
CREATE INDEX IF NOT EXISTS idx_mood_student ON public.student_mood_checks(student_id);
CREATE INDEX IF NOT EXISTS idx_mood_date ON public.student_mood_checks(date);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON public.announcements(target_grade);
CREATE INDEX IF NOT EXISTS idx_counseling_student ON public.counseling_appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_counseling_teacher ON public.counseling_appointments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_counseling_status ON public.counseling_appointments(status);
CREATE INDEX IF NOT EXISTS idx_counseling_date ON public.counseling_appointments(requested_date);

-- ==============================================================================
-- 3. MIGRASI IDEMPOTENT KOLOM TAMBAHAN
-- ==============================================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE public.teachers ALTER COLUMN nip TYPE VARCHAR(255);
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_name TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(20);
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_size VARCHAR(50);
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS bk_teacher_id VARCHAR(50);

-- ==============================================================================
-- 4. KOSONGKAN TABEL (TRUNCATE) SECARA BERSIH
-- ==============================================================================
TRUNCATE TABLE 
    public.counseling_appointments,
    public.messages,
    public.report_status_history,
    public.notifications,
    public.reports,
    public.student_mood_checks,
    public.announcements,
    public.students,
    public.teachers,
    public.classes,
    public.categories,
    public.users,
    public.system_settings
CASCADE;

-- ==============================================================================
-- 5. INSERT DATA SEED: HANYA ADMINISTRATOR & MASTER KATEGORI DASAR
-- Data siswa, guru wali, dan guru bk dapat diisi/diimpor via menu Format & Import Excel
-- ==============================================================================

-- 5.1 Kredensial Administrator SAPA (Kata Sandi Bawaan: admin123)
-- Password hash: $sapa$v1$dda614892f4b44ea0a5d912e2ef1cdfc0c49dc858d6da08cc9c64a257e1c458d
INSERT INTO public.users (id, name, email, password, role, gender, avatar, phone, password_changed, created_at) VALUES 
('usr-admin-1', 'Administrator SAPA', 'admin@smk.sch.id', '$sapa$v1$dda614892f4b44ea0a5d912e2ef1cdfc0c49dc858d6da08cc9c64a257e1c458d', 'admin', 'L', NULL, '081234567800', TRUE, CURRENT_TIMESTAMP),
('usr-admin-2', 'Admin SAPA Sistem', 'admin@sapa.sch.id', '$sapa$v1$dda614892f4b44ea0a5d912e2ef1cdfc0c49dc858d6da08cc9c64a257e1c458d', 'admin', 'L', NULL, '081234567801', TRUE, CURRENT_TIMESTAMP);

-- 5.2 Kategori Pelaporan Bimbingan Konseling & Pengaduan
INSERT INTO public.categories (id, name, description, icon, color, active) VALUES 
('cat-1', 'Kesulitan Belajar & Akademik', 'Kendala materi pelajaran kurikulum, pemahaman konsep, tugas kejuruan, atau metode belajar guru', 'BookOpen', 'blue', TRUE),
('cat-2', 'Bullying / Perundungan', 'Tindakan intimidasi fisik, verbal, pengucilan, atau perundungan siber (cyberbullying)', 'AlertTriangle', 'rose', TRUE),
('cat-3', 'Masalah Pertemanan & Relasi Sosial', 'Konflik antarteman sebaya, adaptasi sosial di kelas, rasa cemas dikucilkan dalam kelompok', 'Users', 'amber', TRUE),
('cat-4', 'Aspirasi & Masukan Fasilitas KBM', 'Aspirasi peralatan bengkel/lab, kebersihan kelas, kegiatan ekstrakurikuler, atau sarana belajar', 'Lightbulb', 'emerald', TRUE),
('cat-5', 'Konseling Karir, Magang & PKL', 'Konsultasi minat bakat industri, persiapan magang kerja vokasi, dan pilihan kelanjutan studi/kerja', 'Briefcase', 'purple', TRUE),
('cat-6', 'Kesehatan Mental & Masalah Personal', 'Kendala kecemasan pribadi, motivasi diri, hubungan keluarga, atau hal lain yang butuh ruang aman', 'Heart', 'indigo', TRUE);

-- 5.3 Informasi Pengaturan Sistem Sekolah
INSERT INTO public.system_settings (id, school_name, school_tagline, reset_password_email, contact_email, contact_phone, address, updated_at) VALUES 
('sys-1', 'SMK Negeri 1', 'Sarana Pendampingan dan Asistensi Siswa', 'admin@smk.sch.id', 'info@smk.sch.id', '021-12345678', 'Jl. Pendidikan No. 1, Kompleks Pendidikan Kejuruan', CURRENT_TIMESTAMP);

COMMIT;
