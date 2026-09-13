import fs from 'fs';
import path from 'path';
import { hashPassword, encryptNip } from '../src/utils/crypto';

// 1. Data Jurusan dan 33 Kelas
interface ClassDef {
  id: string;
  name: string;
  grade: string;
  major: string;
  waliIndex: number;
  bkIndex: number;
}

const majors = [
  { code: 'tkj', name: 'Teknik Komputer dan Jaringan (TKJ)', count: 3 },
  { code: 'tkp', name: 'Teknik Konstruksi dan Perumahan (TKP)', count: 2 },
  { code: 'to', name: 'Teknik Otomotif / Bodi Kendaraan (TO)', count: 3 },
  { code: 'dkv', name: 'Desain Komunikasi Visual (DKV)', count: 2 },
  { code: 'akl', name: 'Akuntansi dan Keuangan Lembaga (AKL)', count: 1 }
];

const classes: ClassDef[] = [];
let classCounter = 0;

const grades = [
  { grade: '10', label: 'X', nisPrefix: '2425' },
  { grade: '11', label: 'XI', nisPrefix: '2324' },
  { grade: '12', label: 'XII', nisPrefix: '2223' }
];

for (const g of grades) {
  let streamIndex = 1;
  for (const m of majors) {
    for (let c = 1; c <= m.count; c++) {
      classCounter++;
      const id = `cls-${g.label.toLowerCase()}-${m.code}-${c}`;
      const name = `${g.label} ${m.code.toUpperCase()} ${m.count > 1 ? c : ''}`.trim();
      const bkIndex = ((classCounter - 1) % 10) + 1; // Distribute across 10 BK teachers
      classes.push({
        id,
        name,
        grade: g.grade,
        major: m.name,
        waliIndex: classCounter,
        bkIndex
      });
      streamIndex++;
    }
  }
}

console.log(`Generated ${classes.length} classes.`);

// 2. Data 33 Guru Mata Pelajaran (Wali Kelas Kurikulum Merdeka)
const mapelList = [
  // Kelas X (Umum & Kejuruan Dasar Fase E)
  { subject: 'Pendidikan Agama Islam dan Budi Pekerti', name: 'Drs. H. Ahmad Dahlan, M.Pd.I', gender: 'M', nip: '197605122003121002' },
  { subject: 'Pendidikan Pancasila (PPKn)', name: 'Siti Aminah, S.Pd., M.H.', gender: 'F', nip: '198109152006042008' },
  { subject: 'Bahasa Indonesia (Fase E)', name: 'Dewi Sartika, S.Pd., M.Pd.', gender: 'F', nip: '198304202008012015' },
  { subject: 'Matematika Terapan (Fase E)', name: 'Bambang Hermawan, S.Si., M.Pd.', gender: 'M', nip: '197902182005011006' },
  { subject: 'Bahasa Inggris Vokasi', name: 'Stephanie Wong, S.Pd., M.Ed.', gender: 'F', nip: '198511242010012021' },
  { subject: 'Sejarah Indonesia', name: 'Drs. Irfan Hakim, M.Hum.', gender: 'M', nip: '197408101999031004' },
  { subject: 'PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)', name: 'Hendra Gunawan, S.Pd.', gender: 'M', nip: '198207192006041009' },
  { subject: 'Seni Budaya & Kriya Vokasi', name: 'Maya Indrawati, S.Sn., M.Sn.', gender: 'F', nip: '198610052011012018' },
  { subject: 'Informatika & Literasi Digital (Fase E)', name: 'Budi Hartono, S.T., M.Kom.', gender: 'M', nip: '198102142006041002' },
  { subject: 'Projek IPAS (Ilmu Pengetahuan Alam dan Sosial)', name: 'Dr. Eni Sulistiyowati, M.Si.', gender: 'F', nip: '197703212002122003' },
  { subject: 'Dasar-dasar Keahlian TKJ & Telekomunikasi', name: 'Ir. Dian Permana, M.T.', gender: 'M', nip: '198006152005011007' },

  // Kelas XI (Kejuruan Konsentrasi & PKK Fase F)
  { subject: 'Dasar Gambar Konstruksi & BIM (TKP)', name: 'Ir. Hendra Saputra, S.Pd.', gender: 'M', nip: '197906182005011003' },
  { subject: 'Pemeliharaan Kelistrikan & Mesin Otomotif', name: 'Drs. H. Mulyadi, M.Pd.', gender: 'M', nip: '197305101998021001' },
  { subject: 'Desain Grafis Komunikasi & Motion Design (DKV)', name: 'Rahmat Hidayat, S.Ds., M.Sn.', gender: 'M', nip: '198708122012011005' },
  { subject: 'Praktikum Komputer Akuntansi Spreadsheet & MYOB', name: 'Sri Mulyani Indrawati, S.E., M.Ak.', gender: 'F', nip: '198401302008012012' },
  { subject: 'Bahasa Indonesia Komunikasi Bisnis & Laporan Kerja', name: 'Dwi Lestari, S.Pd., M.Hum.', gender: 'F', nip: '198603172010012025' },
  { subject: 'Bahasa Inggris Percakapan & Wawancara Industri', name: 'Robert Simanjuntak, S.Pd., M.A.', gender: 'M', nip: '198212052009021003' },
  { subject: 'Matematika Vokasi Lanjutan & Analisis Data', name: 'Agung Nugroho, S.Si., M.Sc.', gender: 'M', nip: '198505142010011014' },
  { subject: 'Jaringan Nirkabel, Fiber Optic & Cyber Security (TKJ)', name: 'Fikri Alamsyah, S.Kom., M.T.', gender: 'M', nip: '198809222014021004' },
  { subject: 'Estimasi Biaya & Struktur Konstruksi Bangunan (TKP)', name: 'Anita Wijaya, S.T., M.Eng.', gender: 'F', nip: '198704162011012019' },
  { subject: 'Sistem Chasis, Transmisi & Bodi Kendaraan Ringan (TO)', name: 'Joko Priyono, S.T., M.Pd.', gender: 'M', nip: '198001282006041011' },
  { subject: 'UI/UX Interactive & Pembuatan Aset Visual Digital (DKV)', name: 'Cindy Claudia, S.Sn.', gender: 'F', nip: '199104082015032007' },

  // Kelas XII (Konsentrasi Lanjutan, PKK & PKL Industri)
  { subject: 'Perpajakan Perusahaan & Auditing Akuntansi (AKL)', name: 'Hadi Purnomo, S.E., Ak., CA', gender: 'M', nip: '197807252003121004' },
  { subject: 'Projek Kreatif dan Kewirausahaan Vokasi (PKK)', name: 'Rina Marlina, S.E., M.M.', gender: 'F', nip: '198308192008012017' },
  { subject: 'Pendidikan Agama Kristen dan Budi Pekerti', name: 'Daniel Kristianto, S.Th., M.Pd.K.', gender: 'M', nip: '198004112006041015' },
  { subject: 'Pendidikan Pancasila & Hukum Ketenagakerjaan', name: 'Drs. Surya Kencana, M.Si.', gender: 'M', nip: '197203141997021002' },
  { subject: 'Muatan Lokal: Bahasa & Kebudayaan Daerah', name: 'Ki Ageng Supriyadi, S.Pd.', gender: 'M', nip: '197509202000031003' },
  { subject: 'Cloud Computing, Server Linux & IoT (TKJ)', name: 'Wahyu Hidayat, S.Kom., M.Cs.', gender: 'M', nip: '198607182010011016' },
  { subject: 'Teknik Konstruksi Baja, Beton Bertulang & K3 (TKP)', name: 'Ir. Agus Prasetyo, M.T.', gender: 'M', nip: '197411292001121002' },
  { subject: 'Teknologi Kendaraan Listrik & Pengecatan Otomotif (TO)', name: 'Edi Sutrisno, S.T.', gender: 'M', nip: '198108042007011013' },
  { subject: 'Produksi Film Dokumenter, Iklan & Animasi 3D (DKV)', name: 'Bayu Wisesa, S.Sn., M.Sn.', gender: 'M', nip: '198902112014021008' },
  { subject: 'Akuntansi Keuangan Lembaga & Perbankan Syariah', name: 'Nurul Fajriah, S.E.I., M.E.', gender: 'F', nip: '198805262012012014' },
  { subject: 'Manajemen Portofolio Vokasi & Kesiapan PKL Industri', name: 'Dr. Wibowo Santoso, M.Pd.', gender: 'M', nip: '197608142002121001' }
];

console.log(`Configured ${mapelList.length} guru mapel kurikulum merdeka.`);

// 3. 10 Guru BK Resmi
const bkTeachers = [
  { id: 'tch-bk-1', userId: 'usr-bk-1', name: 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.', nip: '197503151999032001', email: 'sri.wahyuni@smk.sch.id', phone: '081234567811', spec: 'Koordinator BK - Konseling Pribadi & Sosial', room: 'Ruang BK Utama (Lantai 2 Gedung A)', bio: 'Koordinator Bimbingan Konseling Sekolah. Pendampingan kesehatan mental, trauma perundungan, dan resiliensi sosial siswa.' },
  { id: 'tch-bk-2', userId: 'usr-bk-2', name: 'Ahmad Fauzi, S.Pd., Kons.', nip: '198008122005011004', email: 'ahmad.fauzi@smk.sch.id', phone: '081234567812', spec: 'Konseling Karir & Kesiapan Kerja Industri', room: 'Ruang Konseling Karir BK', bio: 'Konselor bimbingan karir, magang industri, dan minat bakat kejuruan siswa SMK.' },
  { id: 'tch-bk-3', userId: 'usr-bk-3', name: 'Ratna Kusuma Dewi, S.Psi.', nip: '198411202008012006', email: 'ratna.kusuma@smk.sch.id', phone: '081234567813', spec: 'Pendampingan Regulasi Emosi & Anti-Perundungan', room: 'Ruang Konseling Individual 1', bio: 'Konselor pendampingan emosi, manajemen stress belajar, dan mediasi konflik antarsiswa.' },
  { id: 'tch-bk-4', userId: 'usr-bk-4', name: 'Drs. Bambang Sudarmono, M.Pd.', nip: '197104251997031002', email: 'bambang.sudarmono@smk.sch.id', phone: '081234567814', spec: 'Konseling Kedisiplinan & Motivasi Berprestasi', room: 'Ruang Konseling 2', bio: 'Pendampingan ketertiban belajar, pembiasaan positif, dan motivasi berprestasi siswa.' },
  { id: 'tch-bk-5', userId: 'usr-bk-5', name: 'Siti Nurhaliza, S.Pd., Kons.', nip: '198807142011012005', email: 'siti.nurhaliza@smk.sch.id', phone: '081234567815', spec: 'Konseling Komunikasi Interpersonal & Relasi Sosial', room: 'Ruang Konseling Individual 3', bio: 'Konselor bimbingan kelompok dan interaksi sosial ramah anak di lingkungan sekolah.' },
  { id: 'tch-bk-6', userId: 'usr-bk-6', name: 'Eko Prasetyo, S.Psi.', nip: '198602282010011008', email: 'eko.prasetyo@smk.sch.id', phone: '081234567816', spec: 'Konseling Krisis & Penanganan Masalah Perilaku', room: 'Ruang Konseling Khusus BK', bio: 'Pendampingan psikologis siswa pada situasi darurat dan pemulihan trauma.' },
  { id: 'tch-bk-7', userId: 'usr-bk-7', name: 'Nurul Hidayati, S.Pd., M.Si.', nip: '198209052006042007', email: 'nurul.hidayati@smk.sch.id', phone: '081234567817', spec: 'Konseling Keluarga & Hubungan Orang Tua-Siswa', room: 'Ruang Diskusi BK & Orang Tua', bio: 'Pendampingan keterlibatan orang tua dan keharmonisan keluarga siswa.' },
  { id: 'tch-bk-8', userId: 'usr-bk-8', name: 'Dedi Kurniawan, S.Pd., Kons.', nip: '198701192014021003', email: 'dedi.kurniawan@smk.sch.id', phone: '081234567818', spec: 'Pengembangan Minat, Bakat & Karakter Vokasi', room: 'Ruang Konseling 4', bio: 'Eksplorasi potensi diri, kepercayaan diri, dan kepemimpinan siswa vokasi.' },
  { id: 'tch-bk-9', userId: 'usr-bk-9', name: 'Tri Wahyuningsih, S.Psi.', nip: '199003102015032002', email: 'tri.wahyuningsih@smk.sch.id', phone: '081234567819', spec: 'Manajemen Kecemasan Akademik & Ujian', room: 'Ruang Konseling Individual 5', bio: 'Konseling teknik relaksasi, mindfulness belajar, dan self-compassion siswa.' },
  { id: 'tch-bk-10', userId: 'usr-bk-10', name: 'Agus Setiawan, S.Pd., Kons.', nip: '199205122019031006', email: 'agus.setiawan@smk.sch.id', phone: '081234567820', spec: 'Literasi Digital Sehat & Anti Cyber-Bullying', room: 'Ruang Konseling Digital BK', bio: 'Edukasi etika siber, keamanan digital, dan pendampingan korban perundungan daring.' }
];

// Map assigned_class_ids for each BK teacher
const bkAssignedClasses: { [bkId: string]: string[] } = {};
bkTeachers.forEach(b => { bkAssignedClasses[b.id] = []; });
classes.forEach(c => {
  const bkId = `tch-bk-${c.bkIndex}`;
  bkAssignedClasses[bkId].push(c.id);
});

// 4. Nama-nama Siswa Indonesia yang Realistis
const firstNamesM = [
  'Ahmad', 'Aditya', 'Aldiansyah', 'Alif', 'Andika', 'Ardi', 'Arya', 'Bagas', 'Bayu', 'Bima',
  'Danendra', 'Daffa', 'Dennis', 'Desta', 'Dimas', 'Fadhil', 'Fajar', 'Farhan', 'Fathir', 'Galih',
  'Gilang', 'Hafiz', 'Ilham', 'Indra', 'Irfan', 'Kevin', 'Lucky', 'M. Rizky', 'M. Fikri', 'M. Zidan',
  'Naufal', 'Pratama', 'Raditya', 'Rafi', 'Rangga', 'Rendi', 'Revan', 'Rian', 'Satria', 'Tegar',
  'Wahyu', 'Wawan', 'Yoga', 'Yusuf', 'Zack', 'Zidan', 'Zulfikar', 'Bintang', 'Candra', 'Dwi'
];

const firstNamesF = [
  'Adinda', 'Aisyah', 'Alifa', 'Amanda', 'Anindya', 'Anisa', 'Annisa', 'Aqila', 'Aurelia', 'Cantika',
  'Chelsea', 'Citra', 'Clarissa', 'Delfina', 'Devi', 'Dian', 'Dinda', 'Elsa', 'Febriana', 'Fitri',
  'Gita', 'Hana', 'Indah', 'Intan', 'Jessica', 'Kayla', 'Keisha', 'Laila', 'Laras', 'Marsha',
  'Maulida', 'Nabila', 'Nadira', 'Nafisa', 'Nayra', 'Novalita', 'Nurul', 'Putri', 'Raisa', 'Rania',
  'Salma', 'Salsabila', 'Shifa', 'Siti', 'Syifa', 'Tania', 'Tiara', 'Vania', 'Zahra', 'Zaskia'
];

const lastNames = [
  'Pratama', 'Saputra', 'Putra', 'Kusuma', 'Ramadhan', 'Wijaya', 'Nugroho', 'Wicaksono', 'Setiawan', 'Utomo',
  'Hidayat', 'Santoso', 'Gunawan', 'Lestari', 'Permatasari', 'Anggraini', 'Rahmawati', 'Wahyuni', 'Safitri', 'Kurnia',
  'Mahendra', 'Firmansyah', 'Pangestu', 'Suryanto', 'Purnomo', 'Suhendra', 'Kuswanto', 'Wibowo', 'Sudrajat', 'Sujatmiko',
  'Syahputra', 'Maulana', 'Wardhana', 'Nugraha', 'Haikal', 'Mahardika', 'Pramudya', 'Baskara', 'Hakim', 'Kuncoro'
];

// Generate Seed SQL Content
const chunks: string[] = [];

chunks.push(`-- ==============================================================================
-- SAPA (Sarana Pendampingan dan Asistensi Siswa) Master Database Seed Data
-- 33 Kelas Rombel (11 Kelas X, 11 Kelas XI, 11 Kelas XII)
-- Total 1.122 Siswa (34 Siswa per Kelas)
-- 33 Guru Mata Pelajaran (Wali Kelas Kurikulum Merdeka) + 10 Guru BK Berlisensi
-- Bersih, Terverifikasi, dan Siap Digunakan Langsung di Supabase / PostgreSQL
-- ==============================================================================

BEGIN;

-- 1. Kosongkan data sebelumnya secara berurutan
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE report_status_history CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE student_mood_checks CASCADE;
TRUNCATE TABLE announcements CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE teachers CASCADE;
TRUNCATE TABLE classes CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE system_settings CASCADE;

-- 2. KREDENSIAL PENGGUNA (users)
-- 2.1 Admin Utama
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES 
('usr-admin-1', 'Administrator SAPA', 'admin@smk.sch.id', '${hashPassword('admin123')}', 'admin', NULL, '081234567800', TRUE, '2026-01-10T08:00:00Z'),
('usr-admin-2', 'Admin SAPA Sistem', 'admin@sapa.sch.id', '${hashPassword('admin123')}', 'admin', NULL, '081234567801', TRUE, '2026-01-10T08:00:00Z');
`);

// Guru BK
chunks.push(`-- 2.2 10 Guru Bimbingan Konseling (Guru BK)
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES`);
const bkUserLines = bkTeachers.map((b, idx) => {
  const isLast = idx === bkTeachers.length - 1;
  return `('${b.userId}', '${b.name}', '${b.email}', '${hashPassword('guru123')}', 'guru', NULL, '${b.phone}', FALSE, '2026-01-10T08:00:00Z')${isLast ? ';' : ','}`;
});
chunks.push(bkUserLines.join('\n'));

// Guru Mapel / Wali Kelas
chunks.push(`\n-- 2.3 33 Guru Mata Pelajaran Kurikulum Merdeka (Sekaligus Wali Kelas Rombel)
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES`);
const waliUserLines = mapelList.map((m, idx) => {
  const isLast = idx === mapelList.length - 1;
  const id = `usr-wali-${String(idx + 1).padStart(2, '0')}`;
  const cleanName = m.name
    .replace(/^(Drs\.|Dr\.|Hj\.|H\.|Ir\.|Prof\.|Mayor\.|Ki\s+Ageng)\s+/gi, '')
    .replace(/,\s*.*$/, '')
    .trim();
  const emailSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.');
  const email = `${emailSlug}.guru${String(idx + 1).padStart(2, '0')}@smk.sch.id`;
  const phone = `0812345680${String(idx + 1).padStart(2, '0')}`;
  return `('${id}', '${m.name}', '${email}', '${hashPassword('guru123')}', 'guru', NULL, '${phone}', FALSE, '2026-01-10T08:00:00Z')${isLast ? ';' : ','}`;
});
chunks.push(waliUserLines.join('\n'));

// 3. Kelas Rombel (classes)
chunks.push(`\n-- 3. KELAS ROMBEL (classes: 33 Rombel Terbagi Merata Fase E & F)
INSERT INTO classes (id, name, grade, major, homeroom_teacher_id, bk_teacher_id) VALUES`);
const classLines = classes.map((c, idx) => {
  const isLast = idx === classes.length - 1;
  const waliId = `tch-wali-${String(c.waliIndex).padStart(2, '0')}`;
  const bkId = `tch-bk-${c.bkIndex}`;
  return `('${c.id}', '${c.name}', '${c.grade}', '${c.major}', '${waliId}', '${bkId}')${isLast ? ';' : ','}`;
});
chunks.push(classLines.join('\n'));

// 4. Profil Guru (teachers)
chunks.push(`\n-- 4. PROFIL GURU (teachers: 10 Guru BK & 33 Guru Mapel / Wali Kelas)
-- NIP disimpan dalam format terenkripsi ($sapa$nip$v1$...) untuk keamanan data privasi guru
INSERT INTO teachers (id, user_id, nip, teacher_type, specialization, room, bio, available_hours, is_active, assigned_class_ids, created_at) VALUES`);

const teacherLines: string[] = [];
// BK Teachers
bkTeachers.forEach(b => {
  const assigned = JSON.stringify(bkAssignedClasses[b.id] || []);
  const encryptedNip = encryptNip(b.nip);
  teacherLines.push(`('${b.id}', '${b.userId}', '${encryptedNip}', 'guru_bk', '${b.spec}', '${b.room}', '${b.bio.replace(/'/g, "''")}', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '${assigned}'::jsonb, '2026-01-10T08:00:00Z')`);
});

// Wali Teachers
mapelList.forEach((m, idx) => {
  const tchId = `tch-wali-${String(idx + 1).padStart(2, '0')}`;
  const usrId = `usr-wali-${String(idx + 1).padStart(2, '0')}`;
  const cls = classes[idx];
  const encryptedNip = encryptNip(m.nip);
  const spec = `Guru Mapel: ${m.subject} & Wali Kelas ${cls.name}`;
  const room = `Ruang Guru & Laboratorium ${cls.major.split('(')[1]?.replace(')', '') || 'SMK'}`;
  const bio = `Mengampu mata pelajaran ${m.subject} pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa ${cls.name}.`;
  teacherLines.push(`('${tchId}', '${usrId}', '${encryptedNip}', 'wali_kelas', '${spec}', '${room}', '${bio.replace(/'/g, "''")}', 'Senin - Jumat (07.30 - 15.30 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z')`);
});

chunks.push(teacherLines.map((t, idx) => `${t}${idx === teacherLines.length - 1 ? ';' : ','}`).join('\n'));

// 5. Siswa (1.122 Siswa)
chunks.push(`\n-- 5. KREDENSIAL DAN PROFIL SISWA (1.122 Siswa: 33 Kelas x 34 Siswa)`);

// Prepare students data
interface StudentData {
  usrId: string;
  stdId: string;
  name: string;
  email: string;
  phone: string;
  nis: string;
  clsId: string;
  passwordHash: string;
}

const allStudents: StudentData[] = [];

classes.forEach((c, cIdx) => {
  const gradeDef = grades.find(g => g.grade === c.grade)!;
  for (let s = 1; s <= 34; s++) {
    const isMale = s % 2 === 1;
    const fnList = isMale ? firstNamesM : firstNamesF;
    const fn = fnList[(cIdx * 7 + s * 13) % fnList.length];
    const ln1 = lastNames[(cIdx * 5 + s * 17) % lastNames.length];
    const name = `${fn} ${ln1}`;
    
    // NIS: prefix 4 digits + 2 digits class index + 2 digits student index
    const nis = `${gradeDef.nisPrefix}${String((cIdx % 11) + 1).padStart(2, '0')}${String(s).padStart(2, '0')}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    const email = `${slug}.${nis}@siswa.belajar.id`;
    const phone = `08${gradeDef.nisPrefix.slice(0, 2)}${String(cIdx + 1).padStart(2, '0')}${String(s).padStart(4, '0')}`;
    const usrId = `usr-std-${c.id.replace('cls-', '')}-${String(s).padStart(2, '0')}`;
    const stdId = `std-${c.id.replace('cls-', '')}-${String(s).padStart(2, '0')}`;
    const plainPassword = `siswa${nis.slice(-4)}`;
    const passwordHash = hashPassword(plainPassword);

    allStudents.push({
      usrId,
      stdId,
      name,
      email,
      phone,
      nis,
      clsId: c.id,
      passwordHash
    });
  }
});

console.log(`Total students generated: ${allStudents.length}`);

// Write users for students in batches of 100 to keep SQL statements clean
chunks.push(`-- 5.1 Tabel Users Siswa (Password default: siswa[4 digit terakhir NIS])`);
const batchSize = 100;
for (let i = 0; i < allStudents.length; i += batchSize) {
  const batch = allStudents.slice(i, i + batchSize);
  chunks.push(`INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES`);
  const lines = batch.map((st, idx) => {
    const isLast = idx === batch.length - 1;
    return `('${st.usrId}', '${st.name.replace(/'/g, "''")}', '${st.email}', '${st.passwordHash}', 'siswa', NULL, '${st.phone}', FALSE, '2026-01-15T08:00:00Z')${isLast ? ';' : ','}`;
  });
  chunks.push(lines.join('\n'));
}

// Write students table in batches
chunks.push(`\n-- 5.2 Tabel Students Siswa`);
for (let i = 0; i < allStudents.length; i += batchSize) {
  const batch = allStudents.slice(i, i + batchSize);
  chunks.push(`INSERT INTO students (id, user_id, nis, class_id, created_at) VALUES`);
  const lines = batch.map((st, idx) => {
    const isLast = idx === batch.length - 1;
    return `('${st.stdId}', '${st.usrId}', '${st.nis}', '${st.clsId}', '2026-01-15T08:00:00Z')${isLast ? ';' : ','}`;
  });
  chunks.push(lines.join('\n'));
}

// 6. Categories
chunks.push(`\n-- 6. KATEGORI ADUAN & BIMBINGAN
INSERT INTO categories (id, name, description, icon, color, active) VALUES
('cat-1', 'Kesulitan Belajar & Akademik', 'Kendala materi pelajaran kurikulum, pemahaman konsep, tugas kejuruan, atau metode belajar guru', 'BookOpen', 'blue', TRUE),
('cat-2', 'Bullying / Perundungan', 'Tindakan intimidasi fisik, verbal, pengucilan, atau perundungan siber (cyberbullying)', 'AlertTriangle', 'rose', TRUE),
('cat-3', 'Masalah Pertemanan & Relasi Sosial', 'Konflik antarteman sebaya, adaptasi sosial di kelas, rasa cemas dikucilkan dalam kelompok', 'Users', 'amber', TRUE),
('cat-4', 'Aspirasi & Masukan Fasilitas KBM', 'Aspirasi peralatan bengkel/lab, kebersihan kelas, kegiatan ekstrakurikuler, atau sarana belajar', 'Lightbulb', 'emerald', TRUE),
('cat-5', 'Konseling Karir, Magang & PKL', 'Konsultasi minat bakat industri, persiapan magang kerja vokasi, dan pilihan kelanjutan studi/kerja', 'Briefcase', 'purple', TRUE),
('cat-6', 'Kesehatan Mental & Masalah Personal', 'Kendala kecemasan pribadi, motivasi diri, hubungan keluarga, atau hal lain yang butuh ruang aman', 'Heart', 'indigo', TRUE);
`);

// 7. Announcements
chunks.push(`-- 7. PENGUMUMAN SELAMAT DATANG RESMI
INSERT INTO announcements (id, title, content, author_id, author_user_id, author_name, author_role, author_avatar, target_grade, attachments, read_by, created_at) VALUES
('anc-welcome', 'Selamat Datang di Portal SAPA (Sarana Pendampingan dan Asistensi Siswa)', 'Portal SAPA resmi beroperasi untuk 33 Kelas Rombel dengan dukungan 10 Guru Bimbingan Konseling dan 33 Guru Mata Pelajaran/Wali Kelas. Layanan ini menjamin kerahasiaan 100% untuk mendampingi akademik, karir vokasi, dan kesejahteraan emosional seluruh siswa.', 'tch-bk-1', 'usr-bk-1', 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.', 'guru_bk', NULL, 'all', '[{"id":"att-welcome-1","type":"link","url":"https://kemdikbud.go.id","title":"Panduan Layanan Bimbingan Konseling & Anti-Perundungan SMK Kurikulum Merdeka"}]'::jsonb, '[]'::jsonb, '2026-09-01T08:00:00Z'),
('anc-kurikulum', 'Informasi Pendampingan Belajar Kurikulum Merdeka & Konseling Karir Vokasi', 'Bagi siswa kelas X (Fase E), XI dan XII (Fase F), layanan konsultasi pemilihan konsentrasi kejuruan, projek kreatif kewirausahaan (PKK), serta persiapan Praktik Kerja Lapangan (PKL) industri dapat dijadwalkan secara daring maupun tatap muka langsung di Ruang Bimbingan Konseling.', 'tch-bk-2', 'usr-bk-2', 'Ahmad Fauzi, S.Pd., Kons.', 'guru_bk', NULL, 'all', '[]'::jsonb, '[]'::jsonb, '2026-09-02T08:00:00Z');
`);

// 8. System settings
chunks.push(`-- 8. PENGATURAN SISTEM
INSERT INTO system_settings (id, school_name, school_tagline, reset_password_email, contact_email, contact_phone, address, updated_at) VALUES
('sys-setting-1', 'SMK Negeri 1', 'Sarana Pendampingan dan Asistensi Siswa Vokasi Terpercaya', 'admin@smk.sch.id', 'bimbingan.konseling@smk.sch.id', '081234567800', 'Jl. Pendidikan Vokasi No. 10', '2026-09-01T08:00:00Z');

COMMIT;
`);

const finalSql = chunks.join('\n');
const outPath = path.resolve('database/seed.sql');
fs.writeFileSync(outPath, finalSql, 'utf-8');
console.log(`Successfully generated database/seed.sql (${finalSql.length} bytes, ${finalSql.split('\n').length} lines).`);
