import fs from 'fs';
import path from 'path';
import { hashPassword, encryptNip } from '../src/utils/crypto';
import {
  AVATAR_2D_TEACHER_MALE,
  AVATAR_2D_TEACHER_FEMALE,
  AVATAR_2D_STUDENT_MALE,
  AVATAR_2D_STUDENT_FEMALE
} from '../src/utils/avatar2d';

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

const bkAssignedClasses: { [bkId: string]: string[] } = {};
bkTeachers.forEach(b => { bkAssignedClasses[b.id] = []; });
classes.forEach(c => {
  const bkId = `tch-bk-${c.bkIndex}`;
  bkAssignedClasses[bkId].push(c.id);
});

// 4. Names
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

// Build Objects
const users: any[] = [
  {
    id: 'usr-admin-1',
    name: 'Administrator SAPA',
    email: 'admin@smk.sch.id',
    password: hashPassword('admin123'),
    role: 'admin',
    avatar: null,
    phone: '081234567800',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: true
  },
  {
    id: 'usr-admin-2',
    name: 'Admin SAPA Sistem',
    email: 'admin@sapa.sch.id',
    password: hashPassword('admin123'),
    role: 'admin',
    avatar: null,
    phone: '081234567801',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: true
  }
];

const teachers: any[] = [];

// Add BK Users & Teachers
bkTeachers.forEach(b => {
  users.push({
    id: b.userId,
    name: b.name,
    email: b.email,
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: null,
    phone: b.phone,
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  });

  teachers.push({
    id: b.id,
    user_id: b.userId,
    nip: encryptNip(b.nip),
    teacher_type: 'guru_bk',
    specialization: b.spec,
    room: b.room,
    bio: b.bio,
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: bkAssignedClasses[b.id] || [],
    created_at: '2026-01-10T08:00:00Z'
  });
});

// Add Wali Users & Teachers
mapelList.forEach((m, idx) => {
  const tchId = `tch-wali-${String(idx + 1).padStart(2, '0')}`;
  const usrId = `usr-wali-${String(idx + 1).padStart(2, '0')}`;
  const cls = classes[idx];
  const cleanName = m.name
    .replace(/^(Drs\.|Dr\.|Hj\.|H\.|Ir\.|Prof\.|Mayor\.|Ki\s+Ageng)\s+/gi, '')
    .replace(/,\s*.*$/, '')
    .trim();
  const emailSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.');
  const email = `${emailSlug}.guru${String(idx + 1).padStart(2, '0')}@smk.sch.id`;
  const phone = `0812345680${String(idx + 1).padStart(2, '0')}`;

  users.push({
    id: usrId,
    name: m.name,
    email,
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: null,
    phone,
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  });

  teachers.push({
    id: tchId,
    user_id: usrId,
    nip: encryptNip(m.nip),
    teacher_type: 'wali_kelas',
    specialization: `Guru Mapel: ${m.subject} & Wali Kelas ${cls.name}`,
    room: `Ruang Guru & Laboratorium ${cls.major.split('(')[1]?.replace(')', '') || 'SMK'}`,
    bio: `Mengampu mata pelajaran ${m.subject} pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa ${cls.name}.`,
    available_hours: 'Senin - Jumat (07.30 - 15.30 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  });
});

// Add Classes
const formattedClasses = classes.map(c => ({
  id: c.id,
  name: c.name,
  grade: c.grade,
  major: c.major,
  homeroom_teacher_id: `tch-wali-${String(c.waliIndex).padStart(2, '0')}`,
  bk_teacher_id: `tch-bk-${c.bkIndex}`
}));

// Add Students
const students: any[] = [];
classes.forEach((c, cIdx) => {
  const gradeDef = grades.find(g => g.grade === c.grade)!;
  for (let s = 1; s <= 34; s++) {
    const isMale = s % 2 === 1;
    const fnList = isMale ? firstNamesM : firstNamesF;
    const fn = fnList[(cIdx * 7 + s * 13) % fnList.length];
    const ln1 = lastNames[(cIdx * 5 + s * 17) % lastNames.length];
    const name = `${fn} ${ln1}`;
    
    const nis = `${gradeDef.nisPrefix}${String((cIdx % 11) + 1).padStart(2, '0')}${String(s).padStart(2, '0')}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    const email = `${slug}.${nis}@siswa.belajar.id`;
    const phone = `08${gradeDef.nisPrefix.slice(0, 2)}${String(cIdx + 1).padStart(2, '0')}${String(s).padStart(4, '0')}`;
    const usrId = `usr-std-${c.id.replace('cls-', '')}-${String(s).padStart(2, '0')}`;
    const stdId = `std-${c.id.replace('cls-', '')}-${String(s).padStart(2, '0')}`;
    const plainPassword = `siswa${nis.slice(-4)}`;

    users.push({
      id: usrId,
      name,
      email,
      password: hashPassword(plainPassword),
      role: 'siswa',
      avatar: null,
      phone,
      created_at: '2026-01-15T08:00:00Z',
      password_changed: false
    });

    students.push({
      id: stdId,
      user_id: usrId,
      nis,
      class_id: c.id,
      created_at: '2026-01-15T08:00:00Z'
    });
  }
});

// Categories, Reports, Messages, StatusHistory, Announcements, MoodChecks
const fileContent = `import {
  User,
  Student,
  Teacher,
  SchoolClass,
  Category,
  Report,
  Message,
  ReportStatusHistory,
  Notification,
  Announcement,
  StudentMoodCheck
} from '../types/database';
import { hashPassword, encryptNip } from '../utils/crypto';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Kesulitan Belajar & Akademik',
    description: 'Kendala materi pelajaran kurikulum, pemahaman konsep, tugas kejuruan, atau metode belajar guru',
    icon: 'BookOpen',
    color: 'blue',
    active: true
  },
  {
    id: 'cat-2',
    name: 'Bullying / Perundungan',
    description: 'Tindakan intimidasi fisik, verbal, pengucilan, atau perundungan siber (cyberbullying)',
    icon: 'AlertTriangle',
    color: 'rose',
    active: true
  },
  {
    id: 'cat-3',
    name: 'Masalah Pertemanan & Relasi Sosial',
    description: 'Konflik antarteman sebaya, adaptasi sosial di kelas, rasa cemas dikucilkan dalam kelompok',
    icon: 'Users',
    color: 'amber',
    active: true
  },
  {
    id: 'cat-4',
    name: 'Aspirasi & Masukan Fasilitas KBM',
    description: 'Aspirasi peralatan bengkel/lab, kebersihan kelas, kegiatan ekstrakurikuler, atau sarana belajar',
    icon: 'Lightbulb',
    color: 'emerald',
    active: true
  },
  {
    id: 'cat-5',
    name: 'Konseling Karir, Magang & PKL',
    description: 'Konsultasi minat bakat industri, persiapan magang kerja vokasi, dan pilihan kelanjutan studi/kerja',
    icon: 'Briefcase',
    color: 'purple',
    active: true
  },
  {
    id: 'cat-6',
    name: 'Kesehatan Mental & Masalah Personal',
    description: 'Kendala kecemasan pribadi, motivasi diri, hubungan keluarga, atau hal lain yang butuh ruang aman',
    icon: 'Heart',
    color: 'indigo',
    active: true
  }
];

export const INITIAL_CLASSES: SchoolClass[] = ${JSON.stringify(formattedClasses, null, 2)};

export const INITIAL_USERS: User[] = ${JSON.stringify(users, null, 2)};

export const INITIAL_TEACHERS: Teacher[] = ${JSON.stringify(teachers, null, 2)};

export const INITIAL_STUDENTS: Student[] = ${JSON.stringify(students, null, 2)};

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-welcome-demo',
    report_code: 'AC-00001',
    student_id: 'std-x-tkj-1-01',
    category_id: 'cat-1',
    title: 'Konsultasi Belajar & Adaptasi Jurusan TKJ',
    description: 'Ingin berdiskusi mengenai penyesuaian materi kejuruan dasar jaringan di awal semester ini.',
    urgency: 'sedang',
    privacy: 'terbuka',
    status: 'selesai',
    created_at: '2026-02-01T08:30:00Z',
    updated_at: '2026-02-02T10:00:00Z',
    assigned_to: 'guru_bk',
    assigned_teacher_id: 'tch-bk-1'
  }
];

export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_STATUS_HISTORY: ReportStatusHistory[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-welcome',
    title: 'Selamat Datang di Portal SAPA (Sarana Pendampingan dan Asistensi Siswa)',
    content: 'Portal SAPA resmi beroperasi untuk 33 Kelas Rombel dengan dukungan 10 Guru Bimbingan Konseling dan 33 Guru Mata Pelajaran/Wali Kelas. Layanan ini menjamin kerahasiaan 100% untuk mendampingi akademik, karir vokasi, dan kesejahteraan emosional seluruh siswa.',
    author_id: 'tch-bk-1',
    author_user_id: 'usr-bk-1',
    author_name: 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.',
    author_role: 'guru_bk',
    target_grade: 'all',
    attachments: [
      {
        id: 'att-welcome-1',
        type: 'link',
        url: 'https://kemdikbud.go.id',
        title: 'Panduan Layanan Bimbingan Konseling & Anti-Perundungan SMK Kurikulum Merdeka'
      }
    ],
    read_by: [],
    created_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'anc-kurikulum',
    title: 'Informasi Pendampingan Belajar Kurikulum Merdeka & Konseling Karir Vokasi',
    content: 'Bagi siswa kelas X (Fase E), XI dan XII (Fase F), layanan konsultasi pemilihan konsentrasi kejuruan, projek kreatif kewirausahaan (PKK), serta persiapan Praktik Kerja Lapangan (PKL) industri dapat dijadwalkan secara daring maupun tatap muka langsung di Ruang Bimbingan Konseling.',
    author_id: 'tch-bk-2',
    author_user_id: 'usr-bk-2',
    author_name: 'Ahmad Fauzi, S.Pd., Kons.',
    author_role: 'guru_bk',
    target_grade: 'all',
    attachments: [],
    read_by: [],
    created_at: '2026-09-02T08:00:00Z'
  }
];

export const INITIAL_MOOD_CHECKS: StudentMoodCheck[] = [];

export function getBkTeacherIdForClass(classId: string): string {
  const cls = INITIAL_CLASSES.find(c => c.id === classId);
  if (cls && cls.bk_teacher_id) return cls.bk_teacher_id;
  const lastChar = classId.charCodeAt(classId.length - 1) || 1;
  const num = (lastChar % 10) + 1;
  return \`tch-bk-\${num}\`;
}
`;

fs.writeFileSync(path.resolve('src/services/seedData.ts'), fileContent, 'utf-8');
console.log('Successfully updated src/services/seedData.ts with 33 classes, 43 teachers, and 1,122 students!');
