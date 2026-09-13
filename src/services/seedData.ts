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
  Announcement,
  StudentMoodCheck
} from '../types/database';
import { hashPassword, encryptNip } from '../utils/crypto';
import {
  AVATAR_2D_TEACHER_MALE,
  AVATAR_2D_TEACHER_FEMALE,
  AVATAR_2D_STUDENT_MALE,
  AVATAR_2D_STUDENT_FEMALE
} from '../utils/avatar2d';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Kesulitan Belajar',
    description: 'Kendala materi pelajaran, pemahaman konsep, tugas, atau metode belajar guru',
    icon: 'BookOpen',
    color: 'blue',
    active: true
  },
  {
    id: 'cat-2',
    name: 'Bullying / Perundungan',
    description: 'Tindakan intimidasi fisik, verbal, pengucilan, atau cyberbullying',
    icon: 'AlertTriangle',
    color: 'rose',
    active: true
  },
  {
    id: 'cat-3',
    name: 'Masalah Pertemanan',
    description: 'Konflik antarteman, adaptasi sosial di kelas, rasa cemas dikucilkan',
    icon: 'Users',
    color: 'amber',
    active: true
  },
  {
    id: 'cat-4',
    name: 'Masukan & Saran',
    description: 'Aspirasi fasilitas sekolah, kebersihan, kegiatan ekstrakurikuler, atau KBM',
    icon: 'Lightbulb',
    color: 'emerald',
    active: true
  },
  {
    id: 'cat-5',
    name: 'Masalah Lainnya',
    description: 'Kendala personal, keluarga, motivasi diri, atau hal lain yang ingin diceritakan',
    icon: 'MessageCircle',
    color: 'indigo',
    active: true
  }
];

// --- 3 KELAS ROMBEL (TKJ, TKP, TBKR) ---
export const INITIAL_CLASSES: SchoolClass[] = [
  {
    "id": "cls-tkj",
    "name": "X TKJ",
    "grade": "10",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-tkj",
    "bk_teacher_id": "tch-bk-1"
  },
  {
    "id": "cls-tkp",
    "name": "X TKP",
    "grade": "10",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-tkp",
    "bk_teacher_id": "tch-bk-2"
  },
  {
    "id": "cls-tbkr",
    "name": "X TBKR",
    "grade": "10",
    "major": "Teknik Bodi Kendaraan Ringan (TBKR)",
    "homeroom_teacher_id": "tch-wali-tbkr",
    "bk_teacher_id": "tch-bk-3"
  }
];

// --- PENGGUNA BERSIH: 2 ADMIN, 10 GURU BK, 3 WALI KELAS, 108 SISWA ---
export const INITIAL_USERS: User[] = [
  // 1. Admin Utama
  {
    id: 'usr-admin-1',
    name: 'Administrator SAPA',
    email: 'admin@smk.sch.id',
    password: hashPassword('admin123'),
    role: 'admin',
    avatar: AVATAR_2D_TEACHER_MALE,
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
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567801',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: true
  },
  // 2. 10 Guru BK
  {
    id: 'usr-bk-1',
    name: 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.',
    email: 'sri.wahyuni@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_FEMALE,
    phone: '081234567811',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-2',
    name: 'Ahmad Fauzi, S.Pd., Kons.',
    email: 'ahmad.fauzi@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567812',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-3',
    name: 'Ratna Kusuma Dewi, S.Psi.',
    email: 'ratna.kusuma@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_FEMALE,
    phone: '081234567813',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-4',
    name: 'Drs. Bambang Sudarmono, M.Pd.',
    email: 'bambang.sudarmono@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567814',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-5',
    name: 'Siti Nurhaliza, S.Pd., Kons.',
    email: 'siti.nurhaliza@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_FEMALE,
    phone: '081234567815',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-6',
    name: 'Eko Prasetyo, S.Psi.',
    email: 'eko.prasetyo@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567816',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-7',
    name: 'Nurul Hidayati, S.Pd., M.Si.',
    email: 'nurul.hidayati@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_FEMALE,
    phone: '081234567817',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-8',
    name: 'Dedi Kurniawan, S.Pd., Kons.',
    email: 'dedi.kurniawan@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567818',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-9',
    name: 'Tri Wahyuningsih, S.Psi.',
    email: 'tri.wahyuningsih@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_FEMALE,
    phone: '081234567819',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-bk-10',
    name: 'Agus Setiawan, S.Pd., Kons.',
    email: 'agus.setiawan@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567820',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  // 3. 3 Wali Kelas
  {
    id: 'usr-wali-tkj',
    name: 'Budi Hartono, S.T., M.Kom.',
    email: 'budi.hartono@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567821',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-wali-tkp',
    name: 'Ir. Hendra Saputra, S.Pd.',
    email: 'hendra.saputra@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567822',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-wali-tbkr',
    name: 'Drs. H. Mulyadi, M.Pd.',
    email: 'mulyadi.walikelas@smk.sch.id',
    password: hashPassword('guru123'),
    role: 'guru',
    avatar: AVATAR_2D_TEACHER_MALE,
    phone: '081234567823',
    created_at: '2026-01-10T08:00:00Z',
    password_changed: false
  },
  // 4. 108 Siswa
  {
    id: 'usr-std-tkj-01',
    name: 'Ahmad Rizky Pratama',
    email: 'ahmad.rizky.pratama@siswa.belajar.id',
    password: hashPassword('siswa0101'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560101',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-02',
    name: 'Aldiansyah Putra',
    email: 'aldiansyah.putra@siswa.belajar.id',
    password: hashPassword('siswa0102'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560102',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-03',
    name: 'Amanda Putri Kirana',
    email: 'amanda.putri.kirana@siswa.belajar.id',
    password: hashPassword('siswa0103'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560103',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-04',
    name: 'Anisa Rahmawati',
    email: 'anisa.rahmawati@siswa.belajar.id',
    password: hashPassword('siswa0104'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560104',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-05',
    name: 'Bagas Arya Wicaksana',
    email: 'bagas.arya.wicaksana@siswa.belajar.id',
    password: hashPassword('siswa0105'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560105',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-06',
    name: 'Bayu Nugroho',
    email: 'bayu.nugroho@siswa.belajar.id',
    password: hashPassword('siswa0106'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560106',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-07',
    name: 'Cantika Dwi Safitri',
    email: 'cantika.dwi.safitri@siswa.belajar.id',
    password: hashPassword('siswa0107'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560107',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-08',
    name: 'Danendra Rasyid',
    email: 'danendra.rasyid@siswa.belajar.id',
    password: hashPassword('siswa0108'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560108',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-09',
    name: 'Desta Pratama',
    email: 'desta.pratama@siswa.belajar.id',
    password: hashPassword('siswa0109'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560109',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-10',
    name: 'Dimas Anggoro',
    email: 'dimas.anggoro@siswa.belajar.id',
    password: hashPassword('siswa0110'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560110',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-11',
    name: 'Dinda Ayu Lestari',
    email: 'dinda.ayu.lestari@siswa.belajar.id',
    password: hashPassword('siswa0111'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560111',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-12',
    name: 'Fadil Muhammad',
    email: 'fadil.muhammad@siswa.belajar.id',
    password: hashPassword('siswa0112'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560112',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-13',
    name: 'Farhan Alfarizi',
    email: 'farhan.alfarizi@siswa.belajar.id',
    password: hashPassword('siswa0113'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560113',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-14',
    name: 'Fathir Rahman',
    email: 'fathir.rahman@siswa.belajar.id',
    password: hashPassword('siswa0114'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560114',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-15',
    name: 'Galih Saputra',
    email: 'galih.saputra@siswa.belajar.id',
    password: hashPassword('siswa0115'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560115',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-16',
    name: 'Gilang Ramadhan',
    email: 'gilang.ramadhan@siswa.belajar.id',
    password: hashPassword('siswa0116'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560116',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-17',
    name: 'Hafiz Syahputra',
    email: 'hafiz.syahputra@siswa.belajar.id',
    password: hashPassword('siswa0117'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560117',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-18',
    name: 'Ilham Nur Cahyo',
    email: 'ilham.nur.cahyo@siswa.belajar.id',
    password: hashPassword('siswa0118'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560118',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-19',
    name: 'Indah Permatasari',
    email: 'indah.permatasari@siswa.belajar.id',
    password: hashPassword('siswa0119'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560119',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-20',
    name: 'Irfan Hakim',
    email: 'irfan.hakim@siswa.belajar.id',
    password: hashPassword('siswa0120'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560120',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-21',
    name: 'Kevin Julian',
    email: 'kevin.julian@siswa.belajar.id',
    password: hashPassword('siswa0121'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560121',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-22',
    name: 'Laila Safira',
    email: 'laila.safira@siswa.belajar.id',
    password: hashPassword('siswa0122'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560122',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-23',
    name: 'Lucky Wardhana',
    email: 'lucky.wardhana@siswa.belajar.id',
    password: hashPassword('siswa0123'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560123',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-24',
    name: 'M. Aditya Nugraha',
    email: 'm.aditya.nugraha@siswa.belajar.id',
    password: hashPassword('siswa0124'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560124',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-25',
    name: 'M. Fikri Haikal',
    email: 'm.fikri.haikal@siswa.belajar.id',
    password: hashPassword('siswa0125'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560125',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-26',
    name: 'M. Zidan Maulana',
    email: 'm.zidan.maulana@siswa.belajar.id',
    password: hashPassword('siswa0126'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560126',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-27',
    name: 'Nabila Salsabila',
    email: 'nabila.salsabila@siswa.belajar.id',
    password: hashPassword('siswa0127'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560127',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-28',
    name: 'Nadia Fitriani',
    email: 'nadia.fitriani@siswa.belajar.id',
    password: hashPassword('siswa0128'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560128',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-29',
    name: 'Noval Ardiansyah',
    email: 'noval.ardiansyah@siswa.belajar.id',
    password: hashPassword('siswa0129'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560129',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-30',
    name: 'Panji Gumilang',
    email: 'panji.gumilang@siswa.belajar.id',
    password: hashPassword('siswa0130'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560130',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-31',
    name: 'Raditya Pratama',
    email: 'raditya.pratama@siswa.belajar.id',
    password: hashPassword('siswa0131'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560131',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-32',
    name: 'Raihan Surya',
    email: 'raihan.surya@siswa.belajar.id',
    password: hashPassword('siswa0132'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560132',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-33',
    name: 'Rendy Ardiansyah',
    email: 'rendy.ardiansyah@siswa.belajar.id',
    password: hashPassword('siswa0133'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560133',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-34',
    name: 'Rian Hidayat',
    email: 'rian.hidayat@siswa.belajar.id',
    password: hashPassword('siswa0134'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560134',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-35',
    name: 'Rizki Ramadhani',
    email: 'rizki.ramadhani@siswa.belajar.id',
    password: hashPassword('siswa0135'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560135',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkj-36',
    name: 'Yoga Pangestu',
    email: 'yoga.pangestu@siswa.belajar.id',
    password: hashPassword('siswa0136'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560136',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-01',
    name: 'Adam Malik',
    email: 'adam.malik@siswa.belajar.id',
    password: hashPassword('siswa0201'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560201',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-02',
    name: 'Agung Prasetyo',
    email: 'agung.prasetyo@siswa.belajar.id',
    password: hashPassword('siswa0202'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560202',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-03',
    name: 'Aisyah Putri Handayani',
    email: 'aisyah.putri.handayani@siswa.belajar.id',
    password: hashPassword('siswa0203'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560203',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-04',
    name: 'Alif Bahtiar',
    email: 'alif.bahtiar@siswa.belajar.id',
    password: hashPassword('siswa0204'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560204',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-05',
    name: 'Andika Firmansyah',
    email: 'andika.firmansyah@siswa.belajar.id',
    password: hashPassword('siswa0205'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560205',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-06',
    name: 'Angga Saputra',
    email: 'angga.saputra@siswa.belajar.id',
    password: hashPassword('siswa0206'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560206',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-07',
    name: 'Arya Bima Kusuma',
    email: 'arya.bima.kusuma@siswa.belajar.id',
    password: hashPassword('siswa0207'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560207',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-08',
    name: 'Bagus Santoso',
    email: 'bagus.santoso@siswa.belajar.id',
    password: hashPassword('siswa0208'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560208',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-09',
    name: 'Bella Safira',
    email: 'bella.safira@siswa.belajar.id',
    password: hashPassword('siswa0209'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_FEMALE,
    phone: '081234560209',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-10',
    name: 'Bima Sakti',
    email: 'bima.sakti@siswa.belajar.id',
    password: hashPassword('siswa0210'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560210',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-11',
    name: 'Candra Gunawan',
    email: 'candra.gunawan@siswa.belajar.id',
    password: hashPassword('siswa0211'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560211',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-12',
    name: 'Dani Setiawan',
    email: 'dani.setiawan@siswa.belajar.id',
    password: hashPassword('siswa0212'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560212',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-13',
    name: 'Deden Kurnia',
    email: 'deden.kurnia@siswa.belajar.id',
    password: hashPassword('siswa0213'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560213',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-14',
    name: 'Doni Irawan',
    email: 'doni.irawan@siswa.belajar.id',
    password: hashPassword('siswa0214'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560214',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-15',
    name: 'Eka Wahyudi',
    email: 'eka.wahyudi@siswa.belajar.id',
    password: hashPassword('siswa0215'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560215',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-16',
    name: 'Fajar Sidik',
    email: 'fajar.sidik@siswa.belajar.id',
    password: hashPassword('siswa0216'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560216',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-17',
    name: 'Fauzan Adhim',
    email: 'fauzan.adhim@siswa.belajar.id',
    password: hashPassword('siswa0217'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560217',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-18',
    name: 'Firman Utina',
    email: 'firman.utina@siswa.belajar.id',
    password: hashPassword('siswa0218'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560218',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-19',
    name: 'Guntur Triwibowo',
    email: 'guntur.triwibowo@siswa.belajar.id',
    password: hashPassword('siswa0219'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560219',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-20',
    name: 'Haryanto',
    email: 'haryanto@siswa.belajar.id',
    password: hashPassword('siswa0220'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560220',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-21',
    name: 'Hendri Gunawan',
    email: 'hendri.gunawan@siswa.belajar.id',
    password: hashPassword('siswa0221'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560221',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-22',
    name: 'Ihsan Kamil',
    email: 'ihsan.kamil@siswa.belajar.id',
    password: hashPassword('siswa0222'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560222',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-23',
    name: 'Indra Lesmana',
    email: 'indra.lesmana@siswa.belajar.id',
    password: hashPassword('siswa0223'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560223',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-24',
    name: 'Joko Supriyanto',
    email: 'joko.supriyanto@siswa.belajar.id',
    password: hashPassword('siswa0224'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560224',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-25',
    name: 'Maulana Malik Ibrahim',
    email: 'maulana.malik.ibrahim@siswa.belajar.id',
    password: hashPassword('siswa0225'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560225',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-26',
    name: 'Muhammad Iqbal',
    email: 'muhammad.iqbal@siswa.belajar.id',
    password: hashPassword('siswa0226'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560226',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-27',
    name: 'Pandu Dewanata',
    email: 'pandu.dewanata@siswa.belajar.id',
    password: hashPassword('siswa0227'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560227',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-28',
    name: 'Putra Pratama',
    email: 'putra.pratama@siswa.belajar.id',
    password: hashPassword('siswa0228'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560228',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-29',
    name: 'Rahmat Hidayat',
    email: 'rahmat.hidayat@siswa.belajar.id',
    password: hashPassword('siswa0229'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560229',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-30',
    name: 'Restu Fauzi',
    email: 'restu.fauzi@siswa.belajar.id',
    password: hashPassword('siswa0230'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560230',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-31',
    name: 'Rio Febrian',
    email: 'rio.febrian@siswa.belajar.id',
    password: hashPassword('siswa0231'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560231',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-32',
    name: 'Satria Yudha',
    email: 'satria.yudha@siswa.belajar.id',
    password: hashPassword('siswa0232'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560232',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-33',
    name: 'Tegar Prakoso',
    email: 'tegar.prakoso@siswa.belajar.id',
    password: hashPassword('siswa0233'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560233',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-34',
    name: 'Wahyu Ramadhan',
    email: 'wahyu.ramadhan@siswa.belajar.id',
    password: hashPassword('siswa0234'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560234',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-35',
    name: 'Wildan Hakim',
    email: 'wildan.hakim@siswa.belajar.id',
    password: hashPassword('siswa0235'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560235',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tkp-36',
    name: 'Yusuf Maulana',
    email: 'yusuf.maulana@siswa.belajar.id',
    password: hashPassword('siswa0236'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560236',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-01',
    name: 'Adi Nugroho',
    email: 'adi.nugroho@siswa.belajar.id',
    password: hashPassword('siswa0301'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560301',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-02',
    name: 'Aditya Pratama',
    email: 'aditya.pratama@siswa.belajar.id',
    password: hashPassword('siswa0302'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560302',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-03',
    name: 'Aldi Taherian',
    email: 'aldi.taherian@siswa.belajar.id',
    password: hashPassword('siswa0303'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560303',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-04',
    name: 'Andre Setiawan',
    email: 'andre.setiawan@siswa.belajar.id',
    password: hashPassword('siswa0304'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560304',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-05',
    name: 'Anton Wijaya',
    email: 'anton.wijaya@siswa.belajar.id',
    password: hashPassword('siswa0305'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560305',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-06',
    name: 'Ari Wibowo',
    email: 'ari.wibowo@siswa.belajar.id',
    password: hashPassword('siswa0306'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560306',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-07',
    name: 'Asep Saepudin',
    email: 'asep.saepudin@siswa.belajar.id',
    password: hashPassword('siswa0307'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560307',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-08',
    name: 'Bobby Kurniawan',
    email: 'bobby.kurniawan@siswa.belajar.id',
    password: hashPassword('siswa0308'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560308',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-09',
    name: 'Chairul Anam',
    email: 'chairul.anam@siswa.belajar.id',
    password: hashPassword('siswa0309'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560309',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-10',
    name: 'Danu Wijaya',
    email: 'danu.wijaya@siswa.belajar.id',
    password: hashPassword('siswa0310'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560310',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-11',
    name: 'Dede Rusmana',
    email: 'dede.rusmana@siswa.belajar.id',
    password: hashPassword('siswa0311'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560311',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-12',
    name: 'Deni Septian',
    email: 'deni.septian@siswa.belajar.id',
    password: hashPassword('siswa0312'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560312',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-13',
    name: 'Edo Febriansyah',
    email: 'edo.febriansyah@siswa.belajar.id',
    password: hashPassword('siswa0313'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560313',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-14',
    name: 'Erik Estrada',
    email: 'erik.estrada@siswa.belajar.id',
    password: hashPassword('siswa0314'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560314',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-15',
    name: 'Ferdiansyah',
    email: 'ferdiansyah@siswa.belajar.id',
    password: hashPassword('siswa0315'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560315',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-16',
    name: 'Fikri Haikal',
    email: 'fikri.haikal@siswa.belajar.id',
    password: hashPassword('siswa0316'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560316',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-17',
    name: 'Gani Muhammad',
    email: 'gani.muhammad@siswa.belajar.id',
    password: hashPassword('siswa0317'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560317',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-18',
    name: 'Hadi Prabowo',
    email: 'hadi.prabowo@siswa.belajar.id',
    password: hashPassword('siswa0318'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560318',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-19',
    name: 'Heru Susanto',
    email: 'heru.susanto@siswa.belajar.id',
    password: hashPassword('siswa0319'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560319',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-20',
    name: 'Ian Kasela',
    email: 'ian.kasela@siswa.belajar.id',
    password: hashPassword('siswa0320'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560320',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-21',
    name: 'Jafar Shiddiq',
    email: 'jafar.shiddiq@siswa.belajar.id',
    password: hashPassword('siswa0321'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560321',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-22',
    name: 'Krisna Mukti',
    email: 'krisna.mukti@siswa.belajar.id',
    password: hashPassword('siswa0322'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560322',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-23',
    name: 'Lukman Hakim',
    email: 'lukman.hakim@siswa.belajar.id',
    password: hashPassword('siswa0323'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560323',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-24',
    name: 'M. Arifin',
    email: 'm.arifin@siswa.belajar.id',
    password: hashPassword('siswa0324'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560324',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-25',
    name: 'M. Ridwan',
    email: 'm.ridwan@siswa.belajar.id',
    password: hashPassword('siswa0325'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560325',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-26',
    name: 'Nanda Saputra',
    email: 'nanda.saputra@siswa.belajar.id',
    password: hashPassword('siswa0326'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560326',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-27',
    name: 'Oki Setiawan',
    email: 'oki.setiawan@siswa.belajar.id',
    password: hashPassword('siswa0327'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560327',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-28',
    name: 'Pratama Arhan',
    email: 'pratama.arhan@siswa.belajar.id',
    password: hashPassword('siswa0328'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560328',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-29',
    name: 'Rendi Juliansyah',
    email: 'rendi.juliansyah@siswa.belajar.id',
    password: hashPassword('siswa0329'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560329',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-30',
    name: 'Rizal Ramli',
    email: 'rizal.ramli@siswa.belajar.id',
    password: hashPassword('siswa0330'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560330',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-31',
    name: 'Sandi Kurnia',
    email: 'sandi.kurnia@siswa.belajar.id',
    password: hashPassword('siswa0331'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560331',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-32',
    name: 'Surya Kencana',
    email: 'surya.kencana@siswa.belajar.id',
    password: hashPassword('siswa0332'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560332',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-33',
    name: 'Tommy Soeharto',
    email: 'tommy.soeharto@siswa.belajar.id',
    password: hashPassword('siswa0333'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560333',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-34',
    name: 'Vicki Prasetyo',
    email: 'vicki.prasetyo@siswa.belajar.id',
    password: hashPassword('siswa0334'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560334',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-35',
    name: 'Wawan Hermawan',
    email: 'wawan.hermawan@siswa.belajar.id',
    password: hashPassword('siswa0335'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560335',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
  {
    id: 'usr-std-tbkr-36',
    name: 'Zulkifli Hasan',
    email: 'zulkifli.hasan@siswa.belajar.id',
    password: hashPassword('siswa0336'),
    role: 'siswa',
    avatar: AVATAR_2D_STUDENT_MALE,
    phone: '081234560336',
    created_at: '2026-01-15T08:00:00Z',
    password_changed: false
  },
];

// --- 13 GURU (10 GURU BK & 3 WALI KELAS) ---
export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-bk-1',
    user_id: 'usr-bk-1',
    nip: encryptNip('197503151999032001'),
    teacher_type: 'guru_bk',
    specialization: 'Koordinator BK - Konseling Pribadi & Sosial',
    room: 'Ruang BK Utama (Lantai 2 Gedung A)',
    bio: 'Koordinator Bimbingan Konseling Sekolah. Pendampingan kesehatan mental, trauma perundungan, dan resiliensi sosial siswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: ['cls-tkj'],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-2',
    user_id: 'usr-bk-2',
    nip: encryptNip('198008122005011004'),
    teacher_type: 'guru_bk',
    specialization: 'Konseling Karir & Kesiapan Kerja Industri',
    room: 'Ruang Konseling Karir BK',
    bio: 'Konselor bimbingan karir, magang industri, dan minat bakat kejuruan siswa SMK.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: ['cls-tkp'],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-3',
    user_id: 'usr-bk-3',
    nip: encryptNip('198411202008012006'),
    teacher_type: 'guru_bk',
    specialization: 'Pendampingan Regulasi Emosi & Anti-Perundungan',
    room: 'Ruang Konseling Individual 1',
    bio: 'Konselor pendampingan emosi, manajemen stress belajar, dan mediasi konflik antarsiswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: ['cls-tbkr'],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-4',
    user_id: 'usr-bk-4',
    nip: encryptNip('197104251997031002'),
    teacher_type: 'guru_bk',
    specialization: 'Konseling Kedisiplinan & Motivasi Berprestasi',
    room: 'Ruang Konseling 2',
    bio: 'Pendampingan ketertiban belajar, pembiasaan positif, dan motivasi berprestasi siswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-5',
    user_id: 'usr-bk-5',
    nip: encryptNip('198807142011012005'),
    teacher_type: 'guru_bk',
    specialization: 'Konseling Komunikasi Interpersonal & Relasi Sosial',
    room: 'Ruang Konseling Individual 3',
    bio: 'Konselor bimbingan kelompok dan interaksi sosial ramah anak di lingkungan sekolah.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-6',
    user_id: 'usr-bk-6',
    nip: encryptNip('198602282010011008'),
    teacher_type: 'guru_bk',
    specialization: 'Konseling Krisis & Penanganan Masalah Perilaku',
    room: 'Ruang Konseling Khusus BK',
    bio: 'Pendampingan psikologis siswa pada situasi darurat dan pemulihan trauma.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-7',
    user_id: 'usr-bk-7',
    nip: encryptNip('198209052006042007'),
    teacher_type: 'guru_bk',
    specialization: 'Konseling Keluarga & Hubungan Orang Tua-Siswa',
    room: 'Ruang Diskusi BK & Orang Tua',
    bio: 'Pendampingan keterlibatan orang tua dan keharmonisan keluarga siswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-8',
    user_id: 'usr-bk-8',
    nip: encryptNip('198701192014021003'),
    teacher_type: 'guru_bk',
    specialization: 'Pengembangan Minat, Bakat & Karakter Vokasi',
    room: 'Ruang Konseling 4',
    bio: 'Eksplorasi potensi diri, kepercayaan diri, dan kepemimpinan siswa vokasi.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-9',
    user_id: 'usr-bk-9',
    nip: encryptNip('199003102015032002'),
    teacher_type: 'guru_bk',
    specialization: 'Manajemen Kecemasan Akademik & Ujian',
    room: 'Ruang Konseling Individual 5',
    bio: 'Konseling teknik relaksasi, mindfulness belajar, dan self-compassion siswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-bk-10',
    user_id: 'usr-bk-10',
    nip: encryptNip('199205122019031006'),
    teacher_type: 'guru_bk',
    specialization: 'Literasi Digital Sehat & Anti Cyber-Bullying',
    room: 'Ruang Konseling Digital BK',
    bio: 'Edukasi etika siber, keamanan digital, dan pendampingan korban perundungan daring.',
    available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
    is_active: true,
    assigned_class_ids: [],
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-wali-tkj',
    user_id: 'usr-wali-tkj',
    nip: encryptNip('198102142006041002'),
    teacher_type: 'wali_kelas',
    specialization: 'Wali Kelas X TKJ (Keahlian Jaringan Komputer & Siber)',
    room: 'Ruang Guru Lab Komputer TKJ',
    bio: 'Wali Kelas X TKJ mendampingi presensi, akademik vokasi informatika, dan kedisiplinan siswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.30 WIB)',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-wali-tkp',
    user_id: 'usr-wali-tkp',
    nip: encryptNip('197906182005011003'),
    teacher_type: 'wali_kelas',
    specialization: 'Wali Kelas X TKP (Keahlian Gambar Teknik & Konstruksi)',
    room: 'Ruang Guru Gedung Bangunan TKP',
    bio: 'Wali Kelas X TKP pendamping konsistensi belajar, keselamatan kerja bengkel, dan karakter siswa.',
    available_hours: 'Senin - Jumat (07.30 - 15.30 WIB)',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'tch-wali-tbkr',
    user_id: 'usr-wali-tbkr',
    nip: encryptNip('197305101998021001'),
    teacher_type: 'wali_kelas',
    specialization: 'Wali Kelas X TBKR (Keahlian Pengecatan & Bodi Otomotif)',
    room: 'Ruang Guru Otomotif TBKR',
    bio: 'Wali Kelas X TBKR mendampingi keaktifan siswa di bengkel, etika kerja industri, dan capaian akademik.',
    available_hours: 'Senin - Jumat (07.30 - 15.30 WIB)',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z'
  },
];

// --- 108 SISWA AKTIF ---
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-tkj-01',
    user_id: 'usr-std-tkj-01',
    nis: '24250101',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-02',
    user_id: 'usr-std-tkj-02',
    nis: '24250102',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-03',
    user_id: 'usr-std-tkj-03',
    nis: '24250103',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-04',
    user_id: 'usr-std-tkj-04',
    nis: '24250104',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-05',
    user_id: 'usr-std-tkj-05',
    nis: '24250105',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-06',
    user_id: 'usr-std-tkj-06',
    nis: '24250106',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-07',
    user_id: 'usr-std-tkj-07',
    nis: '24250107',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-08',
    user_id: 'usr-std-tkj-08',
    nis: '24250108',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-09',
    user_id: 'usr-std-tkj-09',
    nis: '24250109',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-10',
    user_id: 'usr-std-tkj-10',
    nis: '24250110',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-11',
    user_id: 'usr-std-tkj-11',
    nis: '24250111',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-12',
    user_id: 'usr-std-tkj-12',
    nis: '24250112',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-13',
    user_id: 'usr-std-tkj-13',
    nis: '24250113',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-14',
    user_id: 'usr-std-tkj-14',
    nis: '24250114',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-15',
    user_id: 'usr-std-tkj-15',
    nis: '24250115',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-16',
    user_id: 'usr-std-tkj-16',
    nis: '24250116',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-17',
    user_id: 'usr-std-tkj-17',
    nis: '24250117',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-18',
    user_id: 'usr-std-tkj-18',
    nis: '24250118',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-19',
    user_id: 'usr-std-tkj-19',
    nis: '24250119',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-20',
    user_id: 'usr-std-tkj-20',
    nis: '24250120',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-21',
    user_id: 'usr-std-tkj-21',
    nis: '24250121',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-22',
    user_id: 'usr-std-tkj-22',
    nis: '24250122',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-23',
    user_id: 'usr-std-tkj-23',
    nis: '24250123',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-24',
    user_id: 'usr-std-tkj-24',
    nis: '24250124',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-25',
    user_id: 'usr-std-tkj-25',
    nis: '24250125',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-26',
    user_id: 'usr-std-tkj-26',
    nis: '24250126',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-27',
    user_id: 'usr-std-tkj-27',
    nis: '24250127',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-28',
    user_id: 'usr-std-tkj-28',
    nis: '24250128',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-29',
    user_id: 'usr-std-tkj-29',
    nis: '24250129',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-30',
    user_id: 'usr-std-tkj-30',
    nis: '24250130',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-31',
    user_id: 'usr-std-tkj-31',
    nis: '24250131',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-32',
    user_id: 'usr-std-tkj-32',
    nis: '24250132',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-33',
    user_id: 'usr-std-tkj-33',
    nis: '24250133',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-34',
    user_id: 'usr-std-tkj-34',
    nis: '24250134',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-35',
    user_id: 'usr-std-tkj-35',
    nis: '24250135',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkj-36',
    user_id: 'usr-std-tkj-36',
    nis: '24250136',
    class_id: 'cls-tkj',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-01',
    user_id: 'usr-std-tkp-01',
    nis: '24250201',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-02',
    user_id: 'usr-std-tkp-02',
    nis: '24250202',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-03',
    user_id: 'usr-std-tkp-03',
    nis: '24250203',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-04',
    user_id: 'usr-std-tkp-04',
    nis: '24250204',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-05',
    user_id: 'usr-std-tkp-05',
    nis: '24250205',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-06',
    user_id: 'usr-std-tkp-06',
    nis: '24250206',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-07',
    user_id: 'usr-std-tkp-07',
    nis: '24250207',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-08',
    user_id: 'usr-std-tkp-08',
    nis: '24250208',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-09',
    user_id: 'usr-std-tkp-09',
    nis: '24250209',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-10',
    user_id: 'usr-std-tkp-10',
    nis: '24250210',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-11',
    user_id: 'usr-std-tkp-11',
    nis: '24250211',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-12',
    user_id: 'usr-std-tkp-12',
    nis: '24250212',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-13',
    user_id: 'usr-std-tkp-13',
    nis: '24250213',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-14',
    user_id: 'usr-std-tkp-14',
    nis: '24250214',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-15',
    user_id: 'usr-std-tkp-15',
    nis: '24250215',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-16',
    user_id: 'usr-std-tkp-16',
    nis: '24250216',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-17',
    user_id: 'usr-std-tkp-17',
    nis: '24250217',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-18',
    user_id: 'usr-std-tkp-18',
    nis: '24250218',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-19',
    user_id: 'usr-std-tkp-19',
    nis: '24250219',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-20',
    user_id: 'usr-std-tkp-20',
    nis: '24250220',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-21',
    user_id: 'usr-std-tkp-21',
    nis: '24250221',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-22',
    user_id: 'usr-std-tkp-22',
    nis: '24250222',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-23',
    user_id: 'usr-std-tkp-23',
    nis: '24250223',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-24',
    user_id: 'usr-std-tkp-24',
    nis: '24250224',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-25',
    user_id: 'usr-std-tkp-25',
    nis: '24250225',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-26',
    user_id: 'usr-std-tkp-26',
    nis: '24250226',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-27',
    user_id: 'usr-std-tkp-27',
    nis: '24250227',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-28',
    user_id: 'usr-std-tkp-28',
    nis: '24250228',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-29',
    user_id: 'usr-std-tkp-29',
    nis: '24250229',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-30',
    user_id: 'usr-std-tkp-30',
    nis: '24250230',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-31',
    user_id: 'usr-std-tkp-31',
    nis: '24250231',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-32',
    user_id: 'usr-std-tkp-32',
    nis: '24250232',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-33',
    user_id: 'usr-std-tkp-33',
    nis: '24250233',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-34',
    user_id: 'usr-std-tkp-34',
    nis: '24250234',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-35',
    user_id: 'usr-std-tkp-35',
    nis: '24250235',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tkp-36',
    user_id: 'usr-std-tkp-36',
    nis: '24250236',
    class_id: 'cls-tkp',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-01',
    user_id: 'usr-std-tbkr-01',
    nis: '24250301',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-02',
    user_id: 'usr-std-tbkr-02',
    nis: '24250302',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-03',
    user_id: 'usr-std-tbkr-03',
    nis: '24250303',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-04',
    user_id: 'usr-std-tbkr-04',
    nis: '24250304',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-05',
    user_id: 'usr-std-tbkr-05',
    nis: '24250305',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-06',
    user_id: 'usr-std-tbkr-06',
    nis: '24250306',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-07',
    user_id: 'usr-std-tbkr-07',
    nis: '24250307',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-08',
    user_id: 'usr-std-tbkr-08',
    nis: '24250308',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-09',
    user_id: 'usr-std-tbkr-09',
    nis: '24250309',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-10',
    user_id: 'usr-std-tbkr-10',
    nis: '24250310',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-11',
    user_id: 'usr-std-tbkr-11',
    nis: '24250311',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-12',
    user_id: 'usr-std-tbkr-12',
    nis: '24250312',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-13',
    user_id: 'usr-std-tbkr-13',
    nis: '24250313',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-14',
    user_id: 'usr-std-tbkr-14',
    nis: '24250314',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-15',
    user_id: 'usr-std-tbkr-15',
    nis: '24250315',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-16',
    user_id: 'usr-std-tbkr-16',
    nis: '24250316',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-17',
    user_id: 'usr-std-tbkr-17',
    nis: '24250317',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-18',
    user_id: 'usr-std-tbkr-18',
    nis: '24250318',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-19',
    user_id: 'usr-std-tbkr-19',
    nis: '24250319',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-20',
    user_id: 'usr-std-tbkr-20',
    nis: '24250320',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-21',
    user_id: 'usr-std-tbkr-21',
    nis: '24250321',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-22',
    user_id: 'usr-std-tbkr-22',
    nis: '24250322',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-23',
    user_id: 'usr-std-tbkr-23',
    nis: '24250323',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-24',
    user_id: 'usr-std-tbkr-24',
    nis: '24250324',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-25',
    user_id: 'usr-std-tbkr-25',
    nis: '24250325',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-26',
    user_id: 'usr-std-tbkr-26',
    nis: '24250326',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-27',
    user_id: 'usr-std-tbkr-27',
    nis: '24250327',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-28',
    user_id: 'usr-std-tbkr-28',
    nis: '24250328',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-29',
    user_id: 'usr-std-tbkr-29',
    nis: '24250329',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-30',
    user_id: 'usr-std-tbkr-30',
    nis: '24250330',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-31',
    user_id: 'usr-std-tbkr-31',
    nis: '24250331',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-32',
    user_id: 'usr-std-tbkr-32',
    nis: '24250332',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-33',
    user_id: 'usr-std-tbkr-33',
    nis: '24250333',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-34',
    user_id: 'usr-std-tbkr-34',
    nis: '24250334',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-35',
    user_id: 'usr-std-tbkr-35',
    nis: '24250335',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'std-tbkr-36',
    user_id: 'usr-std-tbkr-36',
    nis: '24250336',
    class_id: 'cls-tbkr',
    created_at: '2026-01-15T08:00:00Z'
  },
];

// Helper to map class to primary BK Teacher
export const getBkTeacherIdForClass = (classId: string): string => {
  if (classId === 'cls-tkj') return 'tch-bk-1';
  if (classId === 'cls-tkp') return 'tch-bk-2';
  if (classId === 'cls-tbkr') return 'tch-bk-3';
  return 'tch-bk-1';
};

// Clean Empty Reports & Interactions (Kosong sesuai permintaan)
export const INITIAL_REPORTS: Report[] = [];
export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_STATUS_HISTORY: ReportStatusHistory[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_MOOD_CHECKS: StudentMoodCheck[] = [];

// 1 Welcome Announcement
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-welcome',
    title: 'Selamat Datang di Portal SAPA (Sarana Pendampingan dan Asistensi Siswa)',
    content: 'Portal SAPA resmi beroperasi untuk layanan bimbingan konseling dan pendampingan siswa secara aman, transparan, dan terpercaya. Siswa dapat berkonsultasi dengan 10 Guru BK dan 3 Wali Kelas dengan jaminan kerahasiaan penuh.',
    author_id: 'usr-bk-1',
    author_name: 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.',
    author_role: 'guru_bk',
    author_avatar: AVATAR_2D_TEACHER_FEMALE,
    target_grade: 'all',
    attachments: [
      {
        id: 'att-welcome-1',
        type: 'link',
        url: 'https://kemdikbud.go.id',
        title: 'Panduan Layanan Ramah Anak & Anti-Perundungan Sekolah'
      }
    ],
    read_by: [],
    created_at: '2026-09-01T08:00:00Z'
  }
];
