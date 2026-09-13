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

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    "id": "cls-x-tkj-1",
    "name": "X TKJ 1",
    "grade": "10",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-01",
    "bk_teacher_id": "tch-bk-1"
  },
  {
    "id": "cls-x-tkj-2",
    "name": "X TKJ 2",
    "grade": "10",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-02",
    "bk_teacher_id": "tch-bk-2"
  },
  {
    "id": "cls-x-tkj-3",
    "name": "X TKJ 3",
    "grade": "10",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-03",
    "bk_teacher_id": "tch-bk-3"
  },
  {
    "id": "cls-x-tkp-1",
    "name": "X TKP 1",
    "grade": "10",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-04",
    "bk_teacher_id": "tch-bk-4"
  },
  {
    "id": "cls-x-tkp-2",
    "name": "X TKP 2",
    "grade": "10",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-05",
    "bk_teacher_id": "tch-bk-5"
  },
  {
    "id": "cls-x-to-1",
    "name": "X TO 1",
    "grade": "10",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-06",
    "bk_teacher_id": "tch-bk-6"
  },
  {
    "id": "cls-x-to-2",
    "name": "X TO 2",
    "grade": "10",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-07",
    "bk_teacher_id": "tch-bk-7"
  },
  {
    "id": "cls-x-to-3",
    "name": "X TO 3",
    "grade": "10",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-08",
    "bk_teacher_id": "tch-bk-8"
  },
  {
    "id": "cls-x-dkv-1",
    "name": "X DKV 1",
    "grade": "10",
    "major": "Desain Komunikasi Visual (DKV)",
    "homeroom_teacher_id": "tch-wali-09",
    "bk_teacher_id": "tch-bk-9"
  },
  {
    "id": "cls-x-dkv-2",
    "name": "X DKV 2",
    "grade": "10",
    "major": "Desain Komunikasi Visual (DKV)",
    "homeroom_teacher_id": "tch-wali-10",
    "bk_teacher_id": "tch-bk-10"
  },
  {
    "id": "cls-x-akl-1",
    "name": "X AKL",
    "grade": "10",
    "major": "Akuntansi dan Keuangan Lembaga (AKL)",
    "homeroom_teacher_id": "tch-wali-11",
    "bk_teacher_id": "tch-bk-1"
  },
  {
    "id": "cls-xi-tkj-1",
    "name": "XI TKJ 1",
    "grade": "11",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-12",
    "bk_teacher_id": "tch-bk-2"
  },
  {
    "id": "cls-xi-tkj-2",
    "name": "XI TKJ 2",
    "grade": "11",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-13",
    "bk_teacher_id": "tch-bk-3"
  },
  {
    "id": "cls-xi-tkj-3",
    "name": "XI TKJ 3",
    "grade": "11",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-14",
    "bk_teacher_id": "tch-bk-4"
  },
  {
    "id": "cls-xi-tkp-1",
    "name": "XI TKP 1",
    "grade": "11",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-15",
    "bk_teacher_id": "tch-bk-5"
  },
  {
    "id": "cls-xi-tkp-2",
    "name": "XI TKP 2",
    "grade": "11",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-16",
    "bk_teacher_id": "tch-bk-6"
  },
  {
    "id": "cls-xi-to-1",
    "name": "XI TO 1",
    "grade": "11",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-17",
    "bk_teacher_id": "tch-bk-7"
  },
  {
    "id": "cls-xi-to-2",
    "name": "XI TO 2",
    "grade": "11",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-18",
    "bk_teacher_id": "tch-bk-8"
  },
  {
    "id": "cls-xi-to-3",
    "name": "XI TO 3",
    "grade": "11",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-19",
    "bk_teacher_id": "tch-bk-9"
  },
  {
    "id": "cls-xi-dkv-1",
    "name": "XI DKV 1",
    "grade": "11",
    "major": "Desain Komunikasi Visual (DKV)",
    "homeroom_teacher_id": "tch-wali-20",
    "bk_teacher_id": "tch-bk-10"
  },
  {
    "id": "cls-xi-dkv-2",
    "name": "XI DKV 2",
    "grade": "11",
    "major": "Desain Komunikasi Visual (DKV)",
    "homeroom_teacher_id": "tch-wali-21",
    "bk_teacher_id": "tch-bk-1"
  },
  {
    "id": "cls-xi-akl-1",
    "name": "XI AKL",
    "grade": "11",
    "major": "Akuntansi dan Keuangan Lembaga (AKL)",
    "homeroom_teacher_id": "tch-wali-22",
    "bk_teacher_id": "tch-bk-2"
  },
  {
    "id": "cls-xii-tkj-1",
    "name": "XII TKJ 1",
    "grade": "12",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-23",
    "bk_teacher_id": "tch-bk-3"
  },
  {
    "id": "cls-xii-tkj-2",
    "name": "XII TKJ 2",
    "grade": "12",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-24",
    "bk_teacher_id": "tch-bk-4"
  },
  {
    "id": "cls-xii-tkj-3",
    "name": "XII TKJ 3",
    "grade": "12",
    "major": "Teknik Komputer dan Jaringan (TKJ)",
    "homeroom_teacher_id": "tch-wali-25",
    "bk_teacher_id": "tch-bk-5"
  },
  {
    "id": "cls-xii-tkp-1",
    "name": "XII TKP 1",
    "grade": "12",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-26",
    "bk_teacher_id": "tch-bk-6"
  },
  {
    "id": "cls-xii-tkp-2",
    "name": "XII TKP 2",
    "grade": "12",
    "major": "Teknik Konstruksi dan Perumahan (TKP)",
    "homeroom_teacher_id": "tch-wali-27",
    "bk_teacher_id": "tch-bk-7"
  },
  {
    "id": "cls-xii-to-1",
    "name": "XII TO 1",
    "grade": "12",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-28",
    "bk_teacher_id": "tch-bk-8"
  },
  {
    "id": "cls-xii-to-2",
    "name": "XII TO 2",
    "grade": "12",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-29",
    "bk_teacher_id": "tch-bk-9"
  },
  {
    "id": "cls-xii-to-3",
    "name": "XII TO 3",
    "grade": "12",
    "major": "Teknik Otomotif / Bodi Kendaraan (TO)",
    "homeroom_teacher_id": "tch-wali-30",
    "bk_teacher_id": "tch-bk-10"
  },
  {
    "id": "cls-xii-dkv-1",
    "name": "XII DKV 1",
    "grade": "12",
    "major": "Desain Komunikasi Visual (DKV)",
    "homeroom_teacher_id": "tch-wali-31",
    "bk_teacher_id": "tch-bk-1"
  },
  {
    "id": "cls-xii-dkv-2",
    "name": "XII DKV 2",
    "grade": "12",
    "major": "Desain Komunikasi Visual (DKV)",
    "homeroom_teacher_id": "tch-wali-32",
    "bk_teacher_id": "tch-bk-2"
  },
  {
    "id": "cls-xii-akl-1",
    "name": "XII AKL",
    "grade": "12",
    "major": "Akuntansi dan Keuangan Lembaga (AKL)",
    "homeroom_teacher_id": "tch-wali-33",
    "bk_teacher_id": "tch-bk-3"
  }
];

export const INITIAL_USERS: User[] = [
  {
    "id": "usr-admin-1",
    "name": "Administrator SAPA",
    "email": "admin@smk.sch.id",
    "password": "$sapa$v1$dda614892f4b44ea0a5d912e2ef1cdfc0c49dc858d6da08cc9c64a257e1c458d",
    "role": "admin",
    "avatar": null,
    "phone": "081234567800",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": true
  },
  {
    "id": "usr-admin-2",
    "name": "Admin SAPA Sistem",
    "email": "admin@sapa.sch.id",
    "password": "$sapa$v1$dda614892f4b44ea0a5d912e2ef1cdfc0c49dc858d6da08cc9c64a257e1c458d",
    "role": "admin",
    "avatar": null,
    "phone": "081234567801",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": true
  },
  {
    "id": "usr-bk-1",
    "name": "Dra. Hj. Sri Wahyuni, M.Psi, Kons.",
    "email": "sri.wahyuni@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567811",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-2",
    "name": "Ahmad Fauzi, S.Pd., Kons.",
    "email": "ahmad.fauzi@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567812",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-3",
    "name": "Ratna Kusuma Dewi, S.Psi.",
    "email": "ratna.kusuma@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567813",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-4",
    "name": "Drs. Bambang Sudarmono, M.Pd.",
    "email": "bambang.sudarmono@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567814",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-5",
    "name": "Siti Nurhaliza, S.Pd., Kons.",
    "email": "siti.nurhaliza@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567815",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-6",
    "name": "Eko Prasetyo, S.Psi.",
    "email": "eko.prasetyo@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567816",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-7",
    "name": "Nurul Hidayati, S.Pd., M.Si.",
    "email": "nurul.hidayati@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567817",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-8",
    "name": "Dedi Kurniawan, S.Pd., Kons.",
    "email": "dedi.kurniawan@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567818",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-9",
    "name": "Tri Wahyuningsih, S.Psi.",
    "email": "tri.wahyuningsih@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567819",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-bk-10",
    "name": "Agus Setiawan, S.Pd., Kons.",
    "email": "agus.setiawan@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234567820",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-01",
    "name": "Drs. H. Ahmad Dahlan, M.Pd.I",
    "email": "h.ahmad.dahlan.guru01@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568001",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-02",
    "name": "Siti Aminah, S.Pd., M.H.",
    "email": "siti.aminah.guru02@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568002",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-03",
    "name": "Dewi Sartika, S.Pd., M.Pd.",
    "email": "dewi.sartika.guru03@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568003",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-04",
    "name": "Bambang Hermawan, S.Si., M.Pd.",
    "email": "bambang.hermawan.guru04@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568004",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-05",
    "name": "Stephanie Wong, S.Pd., M.Ed.",
    "email": "stephanie.wong.guru05@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568005",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-06",
    "name": "Drs. Irfan Hakim, M.Hum.",
    "email": "irfan.hakim.guru06@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568006",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-07",
    "name": "Hendra Gunawan, S.Pd.",
    "email": "hendra.gunawan.guru07@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568007",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-08",
    "name": "Maya Indrawati, S.Sn., M.Sn.",
    "email": "maya.indrawati.guru08@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568008",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-09",
    "name": "Budi Hartono, S.T., M.Kom.",
    "email": "budi.hartono.guru09@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568009",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-10",
    "name": "Dr. Eni Sulistiyowati, M.Si.",
    "email": "eni.sulistiyowati.guru10@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568010",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-11",
    "name": "Ir. Dian Permana, M.T.",
    "email": "dian.permana.guru11@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568011",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-12",
    "name": "Ir. Hendra Saputra, S.Pd.",
    "email": "hendra.saputra.guru12@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568012",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-13",
    "name": "Drs. H. Mulyadi, M.Pd.",
    "email": "h.mulyadi.guru13@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568013",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-14",
    "name": "Rahmat Hidayat, S.Ds., M.Sn.",
    "email": "rahmat.hidayat.guru14@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568014",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-15",
    "name": "Sri Mulyani Indrawati, S.E., M.Ak.",
    "email": "sri.mulyani.indrawati.guru15@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568015",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-16",
    "name": "Dwi Lestari, S.Pd., M.Hum.",
    "email": "dwi.lestari.guru16@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568016",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-17",
    "name": "Robert Simanjuntak, S.Pd., M.A.",
    "email": "robert.simanjuntak.guru17@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568017",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-18",
    "name": "Agung Nugroho, S.Si., M.Sc.",
    "email": "agung.nugroho.guru18@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568018",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-19",
    "name": "Fikri Alamsyah, S.Kom., M.T.",
    "email": "fikri.alamsyah.guru19@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568019",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-20",
    "name": "Anita Wijaya, S.T., M.Eng.",
    "email": "anita.wijaya.guru20@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568020",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-21",
    "name": "Joko Priyono, S.T., M.Pd.",
    "email": "joko.priyono.guru21@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568021",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-22",
    "name": "Cindy Claudia, S.Sn.",
    "email": "cindy.claudia.guru22@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568022",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-23",
    "name": "Hadi Purnomo, S.E., Ak., CA",
    "email": "hadi.purnomo.guru23@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568023",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-24",
    "name": "Rina Marlina, S.E., M.M.",
    "email": "rina.marlina.guru24@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568024",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-25",
    "name": "Daniel Kristianto, S.Th., M.Pd.K.",
    "email": "daniel.kristianto.guru25@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568025",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-26",
    "name": "Drs. Surya Kencana, M.Si.",
    "email": "surya.kencana.guru26@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568026",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-27",
    "name": "Ki Ageng Supriyadi, S.Pd.",
    "email": "supriyadi.guru27@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568027",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-28",
    "name": "Wahyu Hidayat, S.Kom., M.Cs.",
    "email": "wahyu.hidayat.guru28@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568028",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-29",
    "name": "Ir. Agus Prasetyo, M.T.",
    "email": "agus.prasetyo.guru29@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568029",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-30",
    "name": "Edi Sutrisno, S.T.",
    "email": "edi.sutrisno.guru30@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568030",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-31",
    "name": "Bayu Wisesa, S.Sn., M.Sn.",
    "email": "bayu.wisesa.guru31@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568031",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-32",
    "name": "Nurul Fajriah, S.E.I., M.E.",
    "email": "nurul.fajriah.guru32@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568032",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-wali-33",
    "name": "Dr. Wibowo Santoso, M.Pd.",
    "email": "wibowo.santoso.guru33@smk.sch.id",
    "password": "$sapa$v1$01bcc7776c3c3be5d627882d29b0db4c6f1782ff0311374e90fa31b9a80e46b6",
    "role": "guru",
    "avatar": null,
    "phone": "081234568033",
    "created_at": "2026-01-10T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-01",
    "name": "Desta Wahyuni",
    "email": "desta.wahyuni.24250101@siswa.belajar.id",
    "password": "$sapa$v1$560d59bb022bdb33212b726bde650c50152b710aa74bab1b2172965f4b817964",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-02",
    "name": "Keisha Haikal",
    "email": "keisha.haikal.24250102@siswa.belajar.id",
    "password": "$sapa$v1$4037da52050878b02f8a31257e61beb1f944c617b0f04d4cd9ca77603e01d483",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-03",
    "name": "Tegar Santoso",
    "email": "tegar.santoso.24250103@siswa.belajar.id",
    "password": "$sapa$v1$d8558bd21a65a1b8e1446fa4a83a9bd1b0b18cf2788a32e11290b3ce962aa41f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-04",
    "name": "Alifa Sudrajat",
    "email": "alifa.sudrajat.24250104@siswa.belajar.id",
    "password": "$sapa$v1$2289b2ae6f121c66dbf319201057e05440570f2819511e15eb245605e31e39ca",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-05",
    "name": "Fadhil Wijaya",
    "email": "fadhil.wijaya.24250105@siswa.belajar.id",
    "password": "$sapa$v1$9388167c2ef7a5e53b4c5053a8426dc279bcc8af4c1384b12d663ab58e4c7641",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-06",
    "name": "Laras Pangestu",
    "email": "laras.pangestu.24250106@siswa.belajar.id",
    "password": "$sapa$v1$cc144cc37163bfcb192623b2f8a44bd8ce8f1522b3fd78322e143f6288fc9cad",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-07",
    "name": "Wawan Kuncoro",
    "email": "wawan.kuncoro.24250107@siswa.belajar.id",
    "password": "$sapa$v1$78c1546ea8e12c695d4bd2025c8f7d815833bc5845a03bcc92a17a526d949beb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-08",
    "name": "Anindya Rahmawati",
    "email": "anindya.rahmawati.24250108@siswa.belajar.id",
    "password": "$sapa$v1$e5472b1ec8f297a9bc969b579cea820b25f6e107481856f760cbf0cadbba7f92",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-09",
    "name": "Farhan Nugraha",
    "email": "farhan.nugraha.24250109@siswa.belajar.id",
    "password": "$sapa$v1$ca99294efa0b24534b9807a7d8c242e275fabb4b10fe07e9f2536d9f136350b3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-10",
    "name": "Maulida Hidayat",
    "email": "maulida.hidayat.24250110@siswa.belajar.id",
    "password": "$sapa$v1$a88ce82190ffee6036ad6b1f1fa9c894d3ae4dfd9764c228437c08d035fa3ea1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-11",
    "name": "Yusuf Wibowo",
    "email": "yusuf.wibowo.24250111@siswa.belajar.id",
    "password": "$sapa$v1$7eee96ae38910462293458c65790dbf3e6a177acb318ac699876872a1950e457",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-12",
    "name": "Annisa Ramadhan",
    "email": "annisa.ramadhan.24250112@siswa.belajar.id",
    "password": "$sapa$v1$46ce5f81b07687516d636a2f6fa09d8de779dae72e2c7d139eb8c5061f2e54fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-13",
    "name": "Galih Firmansyah",
    "email": "galih.firmansyah.24250113@siswa.belajar.id",
    "password": "$sapa$v1$ee17d9895d7ca0140fb2a4bf71d2f887363fcc452ad134b5b2041732778a940d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-14",
    "name": "Nadira Hakim",
    "email": "nadira.hakim.24250114@siswa.belajar.id",
    "password": "$sapa$v1$26cc0e0c6d3eb7b6c6b19eb02e0cce5997816570d795633af4f1fe8f8e245480",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-15",
    "name": "Zidan Anggraini",
    "email": "zidan.anggraini.24250115@siswa.belajar.id",
    "password": "$sapa$v1$47428c7db3a0e83b0fd3a7a8448e3ab3ce949e9e147d3d0a66150956ca92ec6e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-16",
    "name": "Aurelia Wardhana",
    "email": "aurelia.wardhana.24250116@siswa.belajar.id",
    "password": "$sapa$v1$965a26e94bbeda29977379984a1add88f391f79e0aed093e888b1da869d6850d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-17",
    "name": "Hafiz Utomo",
    "email": "hafiz.utomo.24250117@siswa.belajar.id",
    "password": "$sapa$v1$5cc1b58ce8d6ce134348211bcf272d8557ae1bd8815c16d08945729b4b828a1c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-18",
    "name": "Nayra Kuswanto",
    "email": "nayra.kuswanto.24250118@siswa.belajar.id",
    "password": "$sapa$v1$87e107b4648ec268073567080d9d621c5a17b7f20361c18e57fb33a6388f864f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-19",
    "name": "Bintang Kusuma",
    "email": "bintang.kusuma.24250119@siswa.belajar.id",
    "password": "$sapa$v1$cb4b4ec2a3200d69feb1d47770fb29cb527783626d852fe28b71a7ca1a796c8b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-20",
    "name": "Chelsea Mahendra",
    "email": "chelsea.mahendra.24250120@siswa.belajar.id",
    "password": "$sapa$v1$b843180404dbe6c6592240a52ef9062cc65ecf967618280282ed0d449b5538af",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-21",
    "name": "Indra Baskara",
    "email": "indra.baskara.24250121@siswa.belajar.id",
    "password": "$sapa$v1$cc5107c8e05274758d11f0566d3d19dfd489fe943fa68b69e9ed52b97e5100d4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-22",
    "name": "Nurul Permatasari",
    "email": "nurul.permatasari.24250122@siswa.belajar.id",
    "password": "$sapa$v1$ac36e39256e167587e70601cff933a6db8ab381fd146537dd8df65e0d8dc070d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-23",
    "name": "Dwi Maulana",
    "email": "dwi.maulana.24250123@siswa.belajar.id",
    "password": "$sapa$v1$a325da5f06c21368d84afc041cad0df0d76da167bdf25f47823a35b30997196b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-24",
    "name": "Clarissa Setiawan",
    "email": "clarissa.setiawan.24250124@siswa.belajar.id",
    "password": "$sapa$v1$5f83a8a3e172a0ad64ce8dbc7ebace37c877d1a134fc740b0aa8e58cfc19a4c1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-25",
    "name": "Kevin Suhendra",
    "email": "kevin.suhendra.24250125@siswa.belajar.id",
    "password": "$sapa$v1$1614d610376aff38cffa14c39f81a7b3f4673145c1f04c76d83aa70f6d447eb3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-26",
    "name": "Raisa Putra",
    "email": "raisa.putra.24250126@siswa.belajar.id",
    "password": "$sapa$v1$b196c952531929aa622b60ec4eaa925ea7da37c6d1439e6631139f01815e406b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-27",
    "name": "Aditya Kurnia",
    "email": "aditya.kurnia.24250127@siswa.belajar.id",
    "password": "$sapa$v1$9091641e713d561407c284b5c9bbfc44f6bd9304cd5db5adb649acf026cb709d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-28",
    "name": "Devi Pramudya",
    "email": "devi.pramudya.24250128@siswa.belajar.id",
    "password": "$sapa$v1$690c3f531aadffa3d187be599008635ff697e5e531dfb1137e12847c2f9c3361",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-29",
    "name": "M. Rizky Lestari",
    "email": "m.rizky.lestari.24250129@siswa.belajar.id",
    "password": "$sapa$v1$2b09e38ad49fd170ca0a12c1ef66b197f724c81bd94ba6f2fed3c58db4fca099",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-30",
    "name": "Salma Syahputra",
    "email": "salma.syahputra.24250130@siswa.belajar.id",
    "password": "$sapa$v1$c076ea1951ec8ed0cccc399e130cc417312224fda1691a558fe540ea49232886",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-31",
    "name": "Alif Wicaksono",
    "email": "alif.wicaksono.24250131@siswa.belajar.id",
    "password": "$sapa$v1$0317605e3376dbc1ef910f886764628df15c286b51258441fd672df2a7de7868",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-32",
    "name": "Dinda Purnomo",
    "email": "dinda.purnomo.24250132@siswa.belajar.id",
    "password": "$sapa$v1$9451fd25cd9f482c31743222c4643cd4e7679465ad9fa0c2fd9ec7335f850ce4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-33",
    "name": "M. Zidan Saputra",
    "email": "m.zidan.saputra.24250133@siswa.belajar.id",
    "password": "$sapa$v1$6b42e72660dd4ecb77ced5a78732b9d79a4e7ef25685300d4966b1b75b62a3c0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-1-34",
    "name": "Shifa Safitri",
    "email": "shifa.safitri.24250134@siswa.belajar.id",
    "password": "$sapa$v1$6fb923b4031c2e9c22910f0fa2db9439e7613bc8b4d694337830e7286826ee3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824010034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-01",
    "name": "Gilang Pangestu",
    "email": "gilang.pangestu.24250201@siswa.belajar.id",
    "password": "$sapa$v1$ce5a6a6654a2582f610ce252f0b7715f6ad7b8e352fcdbfe0146a1b1fbf7c735",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-02",
    "name": "Nafisa Kuncoro",
    "email": "nafisa.kuncoro.24250202@siswa.belajar.id",
    "password": "$sapa$v1$71a19addef929a81b51b86c935ccb7327f81d678670461d17f74afaadc269c4c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-03",
    "name": "Zulfikar Rahmawati",
    "email": "zulfikar.rahmawati.24250203@siswa.belajar.id",
    "password": "$sapa$v1$56020f5fcecdf65c1d569056565f89d91c7252203bc96e7d83f83b88294a07aa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-04",
    "name": "Cantika Nugraha",
    "email": "cantika.nugraha.24250204@siswa.belajar.id",
    "password": "$sapa$v1$c3b536284839ab1b4139fff9491e2a2d23133c4da1f4fd2a14c4faccdac36c1b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-05",
    "name": "Ilham Hidayat",
    "email": "ilham.hidayat.24250205@siswa.belajar.id",
    "password": "$sapa$v1$7088c7fa4cc30c3b76b4a912bc044b8387e2547955c5b23f3d7091245531988e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-06",
    "name": "Novalita Wibowo",
    "email": "novalita.wibowo.24250206@siswa.belajar.id",
    "password": "$sapa$v1$cc45dbbd8e2f4bc1875a404b409546afbb8267c9357c4b92cd993e912dbda7de",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-07",
    "name": "Candra Ramadhan",
    "email": "candra.ramadhan.24250207@siswa.belajar.id",
    "password": "$sapa$v1$4c32e3f233c1a0be66e62a2f8978f162eee85577abb9222c06b2163dc7a761cc",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-08",
    "name": "Citra Firmansyah",
    "email": "citra.firmansyah.24250208@siswa.belajar.id",
    "password": "$sapa$v1$ce836a8575aae7f09630a731d88731a6c5c606099b8c6eb22aa1988e4f8101ae",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-09",
    "name": "Irfan Hakim",
    "email": "irfan.hakim.24250209@siswa.belajar.id",
    "password": "$sapa$v1$385ba2b9e67ec77ec7e5e746990c6750cb37942aef228302755e2bef7773b915",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-10",
    "name": "Putri Anggraini",
    "email": "putri.anggraini.24250210@siswa.belajar.id",
    "password": "$sapa$v1$078cb3a12b7e04ff91096ea8fa53c9eb42f8e220aa3cf3e242fd9f11e4c723bb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-11",
    "name": "Ahmad Wardhana",
    "email": "ahmad.wardhana.24250211@siswa.belajar.id",
    "password": "$sapa$v1$2fd5cd9eab961c860c54a5781e931c8ce5912bb80c9601babeddf6e97840f068",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-12",
    "name": "Delfina Utomo",
    "email": "delfina.utomo.24250212@siswa.belajar.id",
    "password": "$sapa$v1$d5034cf47e5487620700407f7cc3c1ce66cf27343cc3243f100b25965f2e49f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-13",
    "name": "Lucky Kuswanto",
    "email": "lucky.kuswanto.24250213@siswa.belajar.id",
    "password": "$sapa$v1$87178377e3d43a6475faea5cf4d3f3a405acbaec356dcaf6fe7a9b291ecb5234",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-14",
    "name": "Rania Kusuma",
    "email": "rania.kusuma.24250214@siswa.belajar.id",
    "password": "$sapa$v1$ed32be44185d4885a86955e0b539cdd3a30820c619fd01715d29707e20bd1539",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-15",
    "name": "Aldiansyah Mahendra",
    "email": "aldiansyah.mahendra.24250215@siswa.belajar.id",
    "password": "$sapa$v1$013e56428b0c15d7cebf96e281317fe84be65bb287966809bbdbd3a90b9c8695",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-16",
    "name": "Dian Baskara",
    "email": "dian.baskara.24250216@siswa.belajar.id",
    "password": "$sapa$v1$83483c614bf0e2feb82c42ed6ff15f313ad801b98611b3dee33c87fca7374daa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-17",
    "name": "M. Fikri Permatasari",
    "email": "m.fikri.permatasari.24250217@siswa.belajar.id",
    "password": "$sapa$v1$211be457cbb200494d063da170134dd75566445be5931264350620f7297111a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-18",
    "name": "Salsabila Maulana",
    "email": "salsabila.maulana.24250218@siswa.belajar.id",
    "password": "$sapa$v1$18d1ebbd79ac773c2b81a06a055e61412226aae8c6c4cfc6ed9692c833eb1dac",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-19",
    "name": "Andika Setiawan",
    "email": "andika.setiawan.24250219@siswa.belajar.id",
    "password": "$sapa$v1$a08b382d4c08b2a8985e96277359b75a535d79a82fe3f77538dc8f39e018145a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-20",
    "name": "Elsa Suhendra",
    "email": "elsa.suhendra.24250220@siswa.belajar.id",
    "password": "$sapa$v1$ccbd59a7d278d8c6cdf6edbe854a6f839d668b05d54877d2efa083b6a1f4470d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-21",
    "name": "Naufal Putra",
    "email": "naufal.putra.24250221@siswa.belajar.id",
    "password": "$sapa$v1$6d9d4fed9464e3a51c72cf230e63ef722933d49852cc1071d556bda67e83130c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-22",
    "name": "Siti Kurnia",
    "email": "siti.kurnia.24250222@siswa.belajar.id",
    "password": "$sapa$v1$325ac7fa01ffabfc5acc451e9f7f245fe3aaa1506a0c89da5455a2767a86195c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-23",
    "name": "Arya Pramudya",
    "email": "arya.pramudya.24250223@siswa.belajar.id",
    "password": "$sapa$v1$0a92f7c33208793465cd3a8401a69ae3884c66190ce4fcfcb32e43d41b8fb771",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-24",
    "name": "Fitri Lestari",
    "email": "fitri.lestari.24250224@siswa.belajar.id",
    "password": "$sapa$v1$37db24143bb6b92281242075007b6aa437742f9b566e394608f1ffa894eb796b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-25",
    "name": "Raditya Syahputra",
    "email": "raditya.syahputra.24250225@siswa.belajar.id",
    "password": "$sapa$v1$392f138990fdbef19b618c2753a3721e347ce559039a6027ed49bae0d883c232",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-26",
    "name": "Tania Wicaksono",
    "email": "tania.wicaksono.24250226@siswa.belajar.id",
    "password": "$sapa$v1$202a307302a403335febdbc6435a3e2d4e3b124c1b2df7a22349f91c426c0a37",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-27",
    "name": "Bayu Purnomo",
    "email": "bayu.purnomo.24250227@siswa.belajar.id",
    "password": "$sapa$v1$caaa6eb787c6faa925046b505408d673f350166c3630291345a8c1124221fb62",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-28",
    "name": "Hana Saputra",
    "email": "hana.saputra.24250228@siswa.belajar.id",
    "password": "$sapa$v1$dd2d7303f43921a475ad777cee25272a93f5eb6f461c0dce53670a1fd890f36a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-29",
    "name": "Rangga Safitri",
    "email": "rangga.safitri.24250229@siswa.belajar.id",
    "password": "$sapa$v1$6483ebc222e19309f242b985153b75e64457801040ac0cb8ce233ac6076d4681",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-30",
    "name": "Vania Mahardika",
    "email": "vania.mahardika.24250230@siswa.belajar.id",
    "password": "$sapa$v1$26c1206aba5daa822b67a5ea64f38dd8f88f27746491a56ea2b7fc7a5683f5ad",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-31",
    "name": "Danendra Gunawan",
    "email": "danendra.gunawan.24250231@siswa.belajar.id",
    "password": "$sapa$v1$e7474926e441eb82bf4421a7ed66c18a04664cbf08512f42292be0b25db3c895",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-32",
    "name": "Intan Sujatmiko",
    "email": "intan.sujatmiko.24250232@siswa.belajar.id",
    "password": "$sapa$v1$64c722efd7fb23b65aefaee73cbb1926b1f2d6a79034d92d07d3d8f273a7bd57",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-33",
    "name": "Revan Nugroho",
    "email": "revan.nugroho.24250233@siswa.belajar.id",
    "password": "$sapa$v1$ad154d2851cb70dad0397b6528c11a5b88fa77c231e054419656f639dac53e4f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-2-34",
    "name": "Zaskia Suryanto",
    "email": "zaskia.suryanto.24250234@siswa.belajar.id",
    "password": "$sapa$v1$ebef9a9e6a0ab2969435155ce8257d2419c3ae85be062f328a0636a9af273960",
    "role": "siswa",
    "avatar": null,
    "phone": "0824020034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-01",
    "name": "M. Rizky Wibowo",
    "email": "m.rizky.wibowo.24250301@siswa.belajar.id",
    "password": "$sapa$v1$c1b82b1b82533c92b0b70ae3267eca2b0d471d3997c51d5bef733e655a0796dc",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-02",
    "name": "Salma Ramadhan",
    "email": "salma.ramadhan.24250302@siswa.belajar.id",
    "password": "$sapa$v1$fc6cefe13c40b1f0e1b2b590422843b549ef5d59fe1c99b9698f75998ebd7371",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-03",
    "name": "Alif Firmansyah",
    "email": "alif.firmansyah.24250303@siswa.belajar.id",
    "password": "$sapa$v1$b5b0859669563558e53510f6bb7ec1e0a113b68b90b3d9d15dc1da21c58b25c6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-04",
    "name": "Dinda Hakim",
    "email": "dinda.hakim.24250304@siswa.belajar.id",
    "password": "$sapa$v1$304f72f9458a833dbe96bdf4389fffd9a79f81edcc672916cb81ff1cd66be670",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-05",
    "name": "M. Zidan Anggraini",
    "email": "m.zidan.anggraini.24250305@siswa.belajar.id",
    "password": "$sapa$v1$bde6c43bdc3875676b2ad84486d62c79b7f7d047e65eecc840446809bd62f4f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-06",
    "name": "Shifa Wardhana",
    "email": "shifa.wardhana.24250306@siswa.belajar.id",
    "password": "$sapa$v1$931507316a282f1a93eab55ff0e74cc0480445c1928bcd2231fa9076b19b9d93",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-07",
    "name": "Ardi Utomo",
    "email": "ardi.utomo.24250307@siswa.belajar.id",
    "password": "$sapa$v1$df11d2f0a2f637ff6efd57d9147ea9c2e0fcd020b9478f990868dd2fec5e15fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-08",
    "name": "Febriana Kuswanto",
    "email": "febriana.kuswanto.24250308@siswa.belajar.id",
    "password": "$sapa$v1$7b47c447164b70f43745d8e1884856141a2b756563f0a86a488809dffe9e6632",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-09",
    "name": "Pratama Kusuma",
    "email": "pratama.kusuma.24250309@siswa.belajar.id",
    "password": "$sapa$v1$6cf9ca9ed17712ac498b3ce0cc0c6a6309ce77c4d7c727c9d968d3859ce1f37a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-10",
    "name": "Syifa Mahendra",
    "email": "syifa.mahendra.24250310@siswa.belajar.id",
    "password": "$sapa$v1$e65d462d0624711347b49bf619b3d4364ecbd9afcbd32a567fbe240f8bfc477c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-11",
    "name": "Bagas Baskara",
    "email": "bagas.baskara.24250311@siswa.belajar.id",
    "password": "$sapa$v1$3454f0d794f71b3eeb13656a82f4e1c36271d5827286312925628988618ea300",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-12",
    "name": "Gita Permatasari",
    "email": "gita.permatasari.24250312@siswa.belajar.id",
    "password": "$sapa$v1$e0c364b5929d8f43f1e5ff9d9a57512a4d7865d2b03f3e23dbe7fec0b40fc07f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-13",
    "name": "Rafi Maulana",
    "email": "rafi.maulana.24250313@siswa.belajar.id",
    "password": "$sapa$v1$44c22920ba2a7aa584bcd2b81a01b5b69fd531e84c91b1094498aef2d397aefb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-14",
    "name": "Tiara Setiawan",
    "email": "tiara.setiawan.24250314@siswa.belajar.id",
    "password": "$sapa$v1$f85515492ffa01fe1d56d279fa7654f85efd32c67f45705395145e265c6b6202",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-15",
    "name": "Bima Suhendra",
    "email": "bima.suhendra.24250315@siswa.belajar.id",
    "password": "$sapa$v1$26924e3a6009544320b0eba0c40e170a19a3dd9259c73e2b3cb72a04f1d61a80",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-16",
    "name": "Indah Putra",
    "email": "indah.putra.24250316@siswa.belajar.id",
    "password": "$sapa$v1$06cb747c1bcbd768c51e09f9c78070ae6f848e454d83cb45c6a7e92bcae7b535",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-17",
    "name": "Rendi Kurnia",
    "email": "rendi.kurnia.24250317@siswa.belajar.id",
    "password": "$sapa$v1$3e9b920678eb63b990c3dc94fc627a8a071bdd0615f8d2123e762bf642a9a4b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-18",
    "name": "Zahra Pramudya",
    "email": "zahra.pramudya.24250318@siswa.belajar.id",
    "password": "$sapa$v1$438d24a7d15e67dea55a477e087ae2b46849b3071b93954fb4254434a6fa08b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-19",
    "name": "Daffa Lestari",
    "email": "daffa.lestari.24250319@siswa.belajar.id",
    "password": "$sapa$v1$ffe020f81f9f272688e0b277611cba9e590dd43fd3f815a6b2dfb5d2c4b46ef1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-20",
    "name": "Jessica Syahputra",
    "email": "jessica.syahputra.24250320@siswa.belajar.id",
    "password": "$sapa$v1$08b59cc84e4470323b9470f9d61c0ef1018f4479cb59e69fa5ff296c1131fcde",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-21",
    "name": "Rian Wicaksono",
    "email": "rian.wicaksono.24250321@siswa.belajar.id",
    "password": "$sapa$v1$94f66169dd38d9e377e3b74ee95161f6f243de733da947a2b987f0cd9ff0abb6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-22",
    "name": "Adinda Purnomo",
    "email": "adinda.purnomo.24250322@siswa.belajar.id",
    "password": "$sapa$v1$def30bc654b97a382c322a7fe2fbfb50c9ad94d68689f25218189405e77699f8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-23",
    "name": "Desta Saputra",
    "email": "desta.saputra.24250323@siswa.belajar.id",
    "password": "$sapa$v1$03e360fc826bd021fddf8ffaae6ad369b31d11a20875b677d51d755e721d7940",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-24",
    "name": "Keisha Safitri",
    "email": "keisha.safitri.24250324@siswa.belajar.id",
    "password": "$sapa$v1$ae8a4868f6a1a1096284fdb18cc8df76f8fb19ce4f72167a7ff4f7e12a0fd429",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-25",
    "name": "Tegar Mahardika",
    "email": "tegar.mahardika.24250325@siswa.belajar.id",
    "password": "$sapa$v1$ec67f9a6a215fdd4487f0baa5d8f965f8dcdc952552b361977fd08a60dfbd7b1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-26",
    "name": "Alifa Gunawan",
    "email": "alifa.gunawan.24250326@siswa.belajar.id",
    "password": "$sapa$v1$3cafa72bec5e5d1685a222d3615585867c9589d9e6cf9ad40fad5c461be11825",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-27",
    "name": "Fadhil Sujatmiko",
    "email": "fadhil.sujatmiko.24250327@siswa.belajar.id",
    "password": "$sapa$v1$874213051a15f252da1a612c37833836a263602d8f06e44b614c2ddd458b05d0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-28",
    "name": "Laras Nugroho",
    "email": "laras.nugroho.24250328@siswa.belajar.id",
    "password": "$sapa$v1$36b0bc0cb76eec6a6f52b48e2df566339e78466595c32da71d5c4bdb541943ea",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-29",
    "name": "Wawan Suryanto",
    "email": "wawan.suryanto.24250329@siswa.belajar.id",
    "password": "$sapa$v1$fe95753d1d9d2972b612e3ddd1024ca54ef6ab789a38067d0b79cc42f08f2362",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-30",
    "name": "Anindya Pratama",
    "email": "anindya.pratama.24250330@siswa.belajar.id",
    "password": "$sapa$v1$ca99f45d6d2562d8f3a4f5f79f776c6e45c8b7bd8de2d2665dd7900c46046ad6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-31",
    "name": "Farhan Wahyuni",
    "email": "farhan.wahyuni.24250331@siswa.belajar.id",
    "password": "$sapa$v1$3bd563cd70427d629ef79533b05771cc80fbec9e8f6bd4fc59b8ce46bca28619",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-32",
    "name": "Maulida Haikal",
    "email": "maulida.haikal.24250332@siswa.belajar.id",
    "password": "$sapa$v1$68f6bb2b8377a72891255c037aecce9d89f1476f8c645da34cf2e39d7ecd448a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-33",
    "name": "Yusuf Santoso",
    "email": "yusuf.santoso.24250333@siswa.belajar.id",
    "password": "$sapa$v1$c6f401a2fb37f1172f4101ef2a1ea4eeb2187478d881e76d65913a4004156f32",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkj-3-34",
    "name": "Annisa Sudrajat",
    "email": "annisa.sudrajat.24250334@siswa.belajar.id",
    "password": "$sapa$v1$797fdf68872719e60062e3c73108ff852817bc01b0d67e1c9f498b9d67b54dc0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824030034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-01",
    "name": "Rangga Wardhana",
    "email": "rangga.wardhana.24250401@siswa.belajar.id",
    "password": "$sapa$v1$b08ad3af4060efdfb12f508994d505f7b26c55394e156518aadb80ee58d855b6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-02",
    "name": "Vania Utomo",
    "email": "vania.utomo.24250402@siswa.belajar.id",
    "password": "$sapa$v1$37469f24043ed96424ad4260668b9fce7be18a8b249c260cf9f85a37d36b6084",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-03",
    "name": "Danendra Kuswanto",
    "email": "danendra.kuswanto.24250403@siswa.belajar.id",
    "password": "$sapa$v1$14802e531b0c762dcfa9987166491e9963e0a093b8ad8c800638be1f6638c077",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-04",
    "name": "Intan Kusuma",
    "email": "intan.kusuma.24250404@siswa.belajar.id",
    "password": "$sapa$v1$9d861ab50294e3a0a793df8c3da2fb1c373c1cef3ebd9831816fb1a5e3899639",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-05",
    "name": "Revan Mahendra",
    "email": "revan.mahendra.24250405@siswa.belajar.id",
    "password": "$sapa$v1$c108c2796093b1e9c12ea0ff04f2b76b256c9961e025ea86d312c5131e1eb1e1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-06",
    "name": "Zaskia Baskara",
    "email": "zaskia.baskara.24250406@siswa.belajar.id",
    "password": "$sapa$v1$26e03aa91918aa9152e4f234ef2d3be6dee482b2117cd8fcf4086f193bc84cde",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-07",
    "name": "Dennis Permatasari",
    "email": "dennis.permatasari.24250407@siswa.belajar.id",
    "password": "$sapa$v1$dc7c020d609e1c5322f96fb2d48e07ec606d8b6c05db5be2422aae897fdbe224",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-08",
    "name": "Kayla Maulana",
    "email": "kayla.maulana.24250408@siswa.belajar.id",
    "password": "$sapa$v1$721cf6a2c48b8913ddf59d1d0406a11133f859e5e8a7c946da44e36dccb33648",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-09",
    "name": "Satria Setiawan",
    "email": "satria.setiawan.24250409@siswa.belajar.id",
    "password": "$sapa$v1$f3da618426ffb96d6f239ed250ef0d3235adea1298252ab3f672c3fb652e1b3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-10",
    "name": "Aisyah Suhendra",
    "email": "aisyah.suhendra.24250410@siswa.belajar.id",
    "password": "$sapa$v1$cc900ccf695ba977fff6e28ad0be08bebfd4154ee18c1d8b481c2f4a76d0d3b8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-11",
    "name": "Dimas Putra",
    "email": "dimas.putra.24250411@siswa.belajar.id",
    "password": "$sapa$v1$c9c1e33bd921e893b0aa0d7a435e7f83062af083d088f21aeda4e6f94fcc9f71",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-12",
    "name": "Laila Kurnia",
    "email": "laila.kurnia.24250412@siswa.belajar.id",
    "password": "$sapa$v1$c0c94561d235ed84994ef77da50b8b976a4cc0a6db53d04d9c41d44a55f231a3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-13",
    "name": "Wahyu Pramudya",
    "email": "wahyu.pramudya.24250413@siswa.belajar.id",
    "password": "$sapa$v1$d77f9b6896a795de27578a722f2d310f02bfeb0dba35781551a348783369ec96",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-14",
    "name": "Amanda Lestari",
    "email": "amanda.lestari.24250414@siswa.belajar.id",
    "password": "$sapa$v1$aa122150077070c39c62ab937ded17cd6b9475d814aec087b95484f3530a3666",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-15",
    "name": "Fajar Syahputra",
    "email": "fajar.syahputra.24250415@siswa.belajar.id",
    "password": "$sapa$v1$940e5f39ffb544c550de3c2a778c4b96bb9591e28740c000f76f42b94c8d5a47",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-16",
    "name": "Marsha Wicaksono",
    "email": "marsha.wicaksono.24250416@siswa.belajar.id",
    "password": "$sapa$v1$e4da1c22b8f0c6062561ca37b179654ea776801b06f37a965c374755d450d7e8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-17",
    "name": "Yoga Purnomo",
    "email": "yoga.purnomo.24250417@siswa.belajar.id",
    "password": "$sapa$v1$4a62e51fb0d778af878ec0a3773917ba364d1f10541044eeb5573770bf9829e1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-18",
    "name": "Anisa Saputra",
    "email": "anisa.saputra.24250418@siswa.belajar.id",
    "password": "$sapa$v1$d87998e66127a918dc6fffb67d13b856df4057bd48eba53412b1b7b4ccec247a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-19",
    "name": "Fathir Safitri",
    "email": "fathir.safitri.24250419@siswa.belajar.id",
    "password": "$sapa$v1$cc616a27579bbe1ec1d7f03b121587f81567786688f0b7d318c5318d0f5ceada",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-20",
    "name": "Nabila Mahardika",
    "email": "nabila.mahardika.24250420@siswa.belajar.id",
    "password": "$sapa$v1$6fad5dbc53ab2b9bd482d55d9af65c3d5b592fb2b9ec730dfc8ac301776e7767",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-21",
    "name": "Zack Gunawan",
    "email": "zack.gunawan.24250421@siswa.belajar.id",
    "password": "$sapa$v1$2f89715c2d902425cdd80bbbfe58796b93c024d7a43afd31dce455ce715cb1c1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-22",
    "name": "Aqila Sujatmiko",
    "email": "aqila.sujatmiko.24250422@siswa.belajar.id",
    "password": "$sapa$v1$46b8cb8606a225ed6203f8c30ee057278c38d5643692d20a33e1e2dde3426976",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-23",
    "name": "Gilang Nugroho",
    "email": "gilang.nugroho.24250423@siswa.belajar.id",
    "password": "$sapa$v1$9bb2d569887a2f95e74329e46ee1a175ebc2050ca17b1d8ed3d82f42ba91330d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-24",
    "name": "Nafisa Suryanto",
    "email": "nafisa.suryanto.24250424@siswa.belajar.id",
    "password": "$sapa$v1$f4da41d30b84f5bc5ad94eade32b43289196870b93042f95a75fe7f0353b314c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-25",
    "name": "Zulfikar Pratama",
    "email": "zulfikar.pratama.24250425@siswa.belajar.id",
    "password": "$sapa$v1$33326e8299552dc86df63ed3d55ecc7b1e3b14b527388f935d6461bc8b0e2b0f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-26",
    "name": "Cantika Wahyuni",
    "email": "cantika.wahyuni.24250426@siswa.belajar.id",
    "password": "$sapa$v1$3eca87b36a188d7a2457e99d9d67e91eb1c2fd6363f59c3a36ef37e62f67ecfb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-27",
    "name": "Ilham Haikal",
    "email": "ilham.haikal.24250427@siswa.belajar.id",
    "password": "$sapa$v1$06bfb3241e240c6c16e35d63b2d9f7ef32f6202f374aac6b3d607b5ebe684bc5",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-28",
    "name": "Novalita Santoso",
    "email": "novalita.santoso.24250428@siswa.belajar.id",
    "password": "$sapa$v1$b0246cccd79f936364bc64a1566849e0c6cbc3e284730019180ee44d64987ec2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-29",
    "name": "Candra Sudrajat",
    "email": "candra.sudrajat.24250429@siswa.belajar.id",
    "password": "$sapa$v1$c7685cd3d15287dfaea166dbb558ac27f0b10eaff258956972e6c02ffd07d6a8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-30",
    "name": "Citra Wijaya",
    "email": "citra.wijaya.24250430@siswa.belajar.id",
    "password": "$sapa$v1$761f54ad832612699b5a4232f07d15d1c5730cad72a27709f46839b757fd0c30",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-31",
    "name": "Irfan Pangestu",
    "email": "irfan.pangestu.24250431@siswa.belajar.id",
    "password": "$sapa$v1$34abd7a36a7a516536c3d867e5e9c3460d5a8f167d30238e8e3ae455be9178f9",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-32",
    "name": "Putri Kuncoro",
    "email": "putri.kuncoro.24250432@siswa.belajar.id",
    "password": "$sapa$v1$3672d81016280e34d0d24459ae918618ea97fd1484dd9aee895e061afe7f660a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-33",
    "name": "Ahmad Rahmawati",
    "email": "ahmad.rahmawati.24250433@siswa.belajar.id",
    "password": "$sapa$v1$2e349bf8b96d40665f2f22f82dc433ec4146bcb972781f1085408b324a0b50b5",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-1-34",
    "name": "Delfina Nugraha",
    "email": "delfina.nugraha.24250434@siswa.belajar.id",
    "password": "$sapa$v1$40805df5e6b97a66e5e74c0d1729f91c39978b89750791beaade6bdba7bcfe3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824040034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-01",
    "name": "Wawan Baskara",
    "email": "wawan.baskara.24250501@siswa.belajar.id",
    "password": "$sapa$v1$11d66122ac80c6159ff2e017a8c4c06abea64a2e255532f592c554b581afefd3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-02",
    "name": "Anindya Permatasari",
    "email": "anindya.permatasari.24250502@siswa.belajar.id",
    "password": "$sapa$v1$361847ff32e48ce9b14d801e20caadca0254f3b2b620284b4cfda6cde30d185a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-03",
    "name": "Farhan Maulana",
    "email": "farhan.maulana.24250503@siswa.belajar.id",
    "password": "$sapa$v1$6780ab322e6cbef2d61f80f3c6b9a333624080d1d055c284bfc5ac6d10e01e48",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-04",
    "name": "Maulida Setiawan",
    "email": "maulida.setiawan.24250504@siswa.belajar.id",
    "password": "$sapa$v1$88f2ceb86bbc89cf3e385a7dc7944975b4d95023ec4bed0919ebd8b4ab23e56e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-05",
    "name": "Yusuf Suhendra",
    "email": "yusuf.suhendra.24250505@siswa.belajar.id",
    "password": "$sapa$v1$9c0931631785a0425e52b41e133e4039de7e4ecb664061ad63384dfae9e71955",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-06",
    "name": "Annisa Putra",
    "email": "annisa.putra.24250506@siswa.belajar.id",
    "password": "$sapa$v1$975fe7522f9e7086067cc074a174255f04df945e01b26ea761b2e33e82c0d380",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-07",
    "name": "Galih Kurnia",
    "email": "galih.kurnia.24250507@siswa.belajar.id",
    "password": "$sapa$v1$31e4521aae55e93138a5cf596daee52b173705de93080eded2ee51246810f916",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-08",
    "name": "Nadira Pramudya",
    "email": "nadira.pramudya.24250508@siswa.belajar.id",
    "password": "$sapa$v1$bc775778f2ba89eac17a052f6c8e658603f21c41fbd912e984171f94ade18b72",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-09",
    "name": "Zidan Lestari",
    "email": "zidan.lestari.24250509@siswa.belajar.id",
    "password": "$sapa$v1$84b138ada2ba770cf94407b8a945d5a1629710b75171ebe82714be25771d0d33",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-10",
    "name": "Aurelia Syahputra",
    "email": "aurelia.syahputra.24250510@siswa.belajar.id",
    "password": "$sapa$v1$215d300c6f4a5767708e5a43a95c71138cf5a54fe7eb82d836e809665bd444f4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-11",
    "name": "Hafiz Wicaksono",
    "email": "hafiz.wicaksono.24250511@siswa.belajar.id",
    "password": "$sapa$v1$f9c87319cdd9641d74e52ea1ef352bfd28766aca19f043605a2440222980c14a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-12",
    "name": "Nayra Purnomo",
    "email": "nayra.purnomo.24250512@siswa.belajar.id",
    "password": "$sapa$v1$7fee41191289fc2ca9a5358dc083adce6b0570f64cc8d1ece7699b0ab112586f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-13",
    "name": "Bintang Saputra",
    "email": "bintang.saputra.24250513@siswa.belajar.id",
    "password": "$sapa$v1$d892b81a4e0a7b0093f51f6df43d356cb70bdd61f205b24183d02e006d21a5ec",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-14",
    "name": "Chelsea Safitri",
    "email": "chelsea.safitri.24250514@siswa.belajar.id",
    "password": "$sapa$v1$01d55069dcab759bdd703b11f5fac429dd8c44927df9d3a18ecaef3da2c85c04",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-15",
    "name": "Indra Mahardika",
    "email": "indra.mahardika.24250515@siswa.belajar.id",
    "password": "$sapa$v1$7083e2546cb974c41eb61f6d8873fb7653252086776b36dbd25ece1482a43f89",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-16",
    "name": "Nurul Gunawan",
    "email": "nurul.gunawan.24250516@siswa.belajar.id",
    "password": "$sapa$v1$0dd5c6ce98f042f9fee5fda8dee13d3429f209978c9f5706854ddbb30cf4ca6c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-17",
    "name": "Dwi Sujatmiko",
    "email": "dwi.sujatmiko.24250517@siswa.belajar.id",
    "password": "$sapa$v1$a6c656706196b0e50228973bc6d53d407d6c10bb2f679ccb96a27fd4622ae9ec",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-18",
    "name": "Clarissa Nugroho",
    "email": "clarissa.nugroho.24250518@siswa.belajar.id",
    "password": "$sapa$v1$456e8ddf3a785343aebf9a6c36615d0cd89d800ebe4edc3947299284232b193c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-19",
    "name": "Kevin Suryanto",
    "email": "kevin.suryanto.24250519@siswa.belajar.id",
    "password": "$sapa$v1$d6a18cd8290f1991b5e4dcf30de208adc0f4c1516e6e4ef6976648cb19c7e98b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-20",
    "name": "Raisa Pratama",
    "email": "raisa.pratama.24250520@siswa.belajar.id",
    "password": "$sapa$v1$7b7594c1b17d0f47d1dd809fbefed67eba4346e390d1103c3512c2a2a0c6d5fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-21",
    "name": "Aditya Wahyuni",
    "email": "aditya.wahyuni.24250521@siswa.belajar.id",
    "password": "$sapa$v1$cc4870a0da52dffc70fa3067de1587e0ddcf4c0467f6d6e9516c67ba263b389c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-22",
    "name": "Devi Haikal",
    "email": "devi.haikal.24250522@siswa.belajar.id",
    "password": "$sapa$v1$d4023302124f6e5b8a0bf9097f33b70fc038347b8facd48255f8cae058a8072b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-23",
    "name": "M. Rizky Santoso",
    "email": "m.rizky.santoso.24250523@siswa.belajar.id",
    "password": "$sapa$v1$28aebf8277cf465ebd8251b015a440bfb5a4b8570921ec3a01aef72be2b9dc5e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-24",
    "name": "Salma Sudrajat",
    "email": "salma.sudrajat.24250524@siswa.belajar.id",
    "password": "$sapa$v1$a132f543b6afe93e86b235a6a5726e19f270b31ee57ba8b71dd40208c1604a64",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-25",
    "name": "Alif Wijaya",
    "email": "alif.wijaya.24250525@siswa.belajar.id",
    "password": "$sapa$v1$b9f4fa27f83e281e7e17adac498bd06071f6dc57215ed4c0ae8866e72a92b509",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-26",
    "name": "Dinda Pangestu",
    "email": "dinda.pangestu.24250526@siswa.belajar.id",
    "password": "$sapa$v1$f0296a3f9101dda550f6eb25ec22da0748f84a610b1482f303f05bd74ea05a76",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-27",
    "name": "M. Zidan Kuncoro",
    "email": "m.zidan.kuncoro.24250527@siswa.belajar.id",
    "password": "$sapa$v1$ac716956eb5428a0ce9aacaf0f7c4e89a011f20bfa53f5d600aeb8bfa4b07c3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-28",
    "name": "Shifa Rahmawati",
    "email": "shifa.rahmawati.24250528@siswa.belajar.id",
    "password": "$sapa$v1$2368cd812063dbf5a0201fca45ab45747fb0ff00322e27772817d09bc5e9d1eb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-29",
    "name": "Ardi Nugraha",
    "email": "ardi.nugraha.24250529@siswa.belajar.id",
    "password": "$sapa$v1$44f2f2d141547861c1fce61a9f56dee1fd74e7d6670f199fdcf65ac1673e66a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-30",
    "name": "Febriana Hidayat",
    "email": "febriana.hidayat.24250530@siswa.belajar.id",
    "password": "$sapa$v1$8fe1e996e7c7c9a58f7aadf477615d40889219f93ce16528dcc537bd0f6d615e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-31",
    "name": "Pratama Wibowo",
    "email": "pratama.wibowo.24250531@siswa.belajar.id",
    "password": "$sapa$v1$87d2fed17da67e2e00c2cb36cd2245c39d2e080bc8e23a7dee2cc5be66440c55",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-32",
    "name": "Syifa Ramadhan",
    "email": "syifa.ramadhan.24250532@siswa.belajar.id",
    "password": "$sapa$v1$b198847732b3df4cb921dbbcbd03dc265b01dfe0a8a6ff969a7c67b90498b848",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-33",
    "name": "Bagas Firmansyah",
    "email": "bagas.firmansyah.24250533@siswa.belajar.id",
    "password": "$sapa$v1$3c9ae82f4fb853e13c2174fbebd5784babea621b0831be5fe2c2d62ef1eeb248",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-tkp-2-34",
    "name": "Gita Hakim",
    "email": "gita.hakim.24250534@siswa.belajar.id",
    "password": "$sapa$v1$2719fd72dfb6224a8665216dde66f4a3d36f491edd3bdbff3ae860aceb326c79",
    "role": "siswa",
    "avatar": null,
    "phone": "0824050034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-01",
    "name": "Candra Putra",
    "email": "candra.putra.24250601@siswa.belajar.id",
    "password": "$sapa$v1$7e1ad775f3c7383785b2789e1a6fb7b48ce379ac360a9c128f6f789e87434c0e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-02",
    "name": "Citra Kurnia",
    "email": "citra.kurnia.24250602@siswa.belajar.id",
    "password": "$sapa$v1$87f2facef5db795f9799867375b52317630f60970679157222f2221d052b1f32",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-03",
    "name": "Irfan Pramudya",
    "email": "irfan.pramudya.24250603@siswa.belajar.id",
    "password": "$sapa$v1$9043d6447292073258282ce14c12b6b2117ddd750200fa281a9e2456cbc2814d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-04",
    "name": "Putri Lestari",
    "email": "putri.lestari.24250604@siswa.belajar.id",
    "password": "$sapa$v1$6ebbaf9b20f283d03f625c1022d6eb44fbabad933b7195f3b45fd82b3d931ff6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-05",
    "name": "Ahmad Syahputra",
    "email": "ahmad.syahputra.24250605@siswa.belajar.id",
    "password": "$sapa$v1$9a15b8a4bb33cecfd8d1c878a1c55bc8b4040163e2cc22ffbd010b6fa70ca500",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-06",
    "name": "Delfina Wicaksono",
    "email": "delfina.wicaksono.24250606@siswa.belajar.id",
    "password": "$sapa$v1$51c45c02275111564ddc0c759b96eae2e1ec9d2dcfd3d89a42d5c774d6fd83f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-07",
    "name": "Lucky Purnomo",
    "email": "lucky.purnomo.24250607@siswa.belajar.id",
    "password": "$sapa$v1$1368ee03ef5384824417575d44b585645d06383666110cdcbbc18a4c6b7a5a47",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-08",
    "name": "Rania Saputra",
    "email": "rania.saputra.24250608@siswa.belajar.id",
    "password": "$sapa$v1$86ea87b4809c607e9efc7a0c581d7f1d3d339da8cd32d1212e45033aa45e100f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-09",
    "name": "Aldiansyah Safitri",
    "email": "aldiansyah.safitri.24250609@siswa.belajar.id",
    "password": "$sapa$v1$0ef5fbb58e91350188b870d644c441fc024f38c3097ad5e368a110a3b72d2096",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-10",
    "name": "Dian Mahardika",
    "email": "dian.mahardika.24250610@siswa.belajar.id",
    "password": "$sapa$v1$4babfe1493a82fc4fc8cfacb44e3827590e8c28df130adb999cb886ebb25dfed",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-11",
    "name": "M. Fikri Gunawan",
    "email": "m.fikri.gunawan.24250611@siswa.belajar.id",
    "password": "$sapa$v1$5fdd8aa56d691ad83435d21acfe317ed6bb0531e83952c52e0c0785d580efe45",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-12",
    "name": "Salsabila Sujatmiko",
    "email": "salsabila.sujatmiko.24250612@siswa.belajar.id",
    "password": "$sapa$v1$6f7c02ecf97e76bfbac472e0969ad5bb31fa35c8d4e4ad76dc2fcfa0c7f6f302",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-13",
    "name": "Andika Nugroho",
    "email": "andika.nugroho.24250613@siswa.belajar.id",
    "password": "$sapa$v1$010d9f6a5350a8a53939e5f80a86c86b8630e72e8f063962e0496ccbf962111c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-14",
    "name": "Elsa Suryanto",
    "email": "elsa.suryanto.24250614@siswa.belajar.id",
    "password": "$sapa$v1$fb4567abd5d1e9c8b5b3d75632254ec6ac7b27c3d222b0d664d47940a1cdec04",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-15",
    "name": "Naufal Pratama",
    "email": "naufal.pratama.24250615@siswa.belajar.id",
    "password": "$sapa$v1$865bd23bf80db80c8626d05872c1a22748f7f9d8b08d3df96803e62ed3f8fe4b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-16",
    "name": "Siti Wahyuni",
    "email": "siti.wahyuni.24250616@siswa.belajar.id",
    "password": "$sapa$v1$937c5ab020d90ecbfef788026566b0dc52c9fa144579bdcd3c27596289fbfd3c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-17",
    "name": "Arya Haikal",
    "email": "arya.haikal.24250617@siswa.belajar.id",
    "password": "$sapa$v1$545c71c68241463c1d293c9bf701d4fdc1524f3016f66957c9ee47b0fec19a4e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-18",
    "name": "Fitri Santoso",
    "email": "fitri.santoso.24250618@siswa.belajar.id",
    "password": "$sapa$v1$5c9ba6e492f138cadca5679a1d19c5af82a4a97e28acf7aa979a0b3b81a549b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-19",
    "name": "Raditya Sudrajat",
    "email": "raditya.sudrajat.24250619@siswa.belajar.id",
    "password": "$sapa$v1$3bb95f501939c6ef334244d4771e6c2c5d5fec55ac51c326a83ab9cf70a40a82",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-20",
    "name": "Tania Wijaya",
    "email": "tania.wijaya.24250620@siswa.belajar.id",
    "password": "$sapa$v1$28812e7e8eda5d0fad98936e2b9abc83729b6bde43fec1b3f346447cd88c3593",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-21",
    "name": "Bayu Pangestu",
    "email": "bayu.pangestu.24250621@siswa.belajar.id",
    "password": "$sapa$v1$34ee0a5703bb1e325102d8fcddc58516781c55be4216dccb11a2cc3e8aecbb97",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-22",
    "name": "Hana Kuncoro",
    "email": "hana.kuncoro.24250622@siswa.belajar.id",
    "password": "$sapa$v1$3f891d5222ed7c4aa23cfd655a73b1e449c91bff2c75a14ca99a17bb7383c148",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-23",
    "name": "Rangga Rahmawati",
    "email": "rangga.rahmawati.24250623@siswa.belajar.id",
    "password": "$sapa$v1$34f1cb7627f0c8261faf0926be83d46f5303bdf5ced3178fb35bc300c2c08c80",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-24",
    "name": "Vania Nugraha",
    "email": "vania.nugraha.24250624@siswa.belajar.id",
    "password": "$sapa$v1$2576dda82d4dafd5c81b69f78f482cbf906faa8791b1fbd3b747a3c856d0521e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-25",
    "name": "Danendra Hidayat",
    "email": "danendra.hidayat.24250625@siswa.belajar.id",
    "password": "$sapa$v1$e914e27b256f95156ea5d655b7c6d937091bbcfb512eeb6a47c7b0695fe4d96b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-26",
    "name": "Intan Wibowo",
    "email": "intan.wibowo.24250626@siswa.belajar.id",
    "password": "$sapa$v1$f2c7055bf32488630d1dddd33d20220e3c80f8561ad26898e30976ccd71ebe8f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-27",
    "name": "Revan Ramadhan",
    "email": "revan.ramadhan.24250627@siswa.belajar.id",
    "password": "$sapa$v1$8d94aa242f45864dd961d376eba6f029fa4e016728c2b9fd35db68671da66b58",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-28",
    "name": "Zaskia Firmansyah",
    "email": "zaskia.firmansyah.24250628@siswa.belajar.id",
    "password": "$sapa$v1$de6188f8f0776f9a66ffdf7bd51ca2765aae83171d838bb75f7f2401896da9a6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-29",
    "name": "Dennis Hakim",
    "email": "dennis.hakim.24250629@siswa.belajar.id",
    "password": "$sapa$v1$4c3ad35566072d5f4d83981e6c466372f987924c1632d0dcfb7be1b4db61c125",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-30",
    "name": "Kayla Anggraini",
    "email": "kayla.anggraini.24250630@siswa.belajar.id",
    "password": "$sapa$v1$9cf14741619cc7efc88ac528b418897820da59c03363f651fa7de8d832c4a759",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-31",
    "name": "Satria Wardhana",
    "email": "satria.wardhana.24250631@siswa.belajar.id",
    "password": "$sapa$v1$1dfae3c7813f7937ce57e8c2d03c014c47ddd5ea9b4c5ce873281e37e1ae12b0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-32",
    "name": "Aisyah Utomo",
    "email": "aisyah.utomo.24250632@siswa.belajar.id",
    "password": "$sapa$v1$ab8e102227deb8abe5ec7160df5b0d26602348cef0e8de48b351b028198f10e4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-33",
    "name": "Dimas Kuswanto",
    "email": "dimas.kuswanto.24250633@siswa.belajar.id",
    "password": "$sapa$v1$62f51ec3a7abbab03e55e695c1dea299f29677682cda099831d11f26ca57da11",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-1-34",
    "name": "Laila Kusuma",
    "email": "laila.kusuma.24250634@siswa.belajar.id",
    "password": "$sapa$v1$3832538da3ad489720aa4372e1507a1f725431ff60837eb054cec0604d8aec52",
    "role": "siswa",
    "avatar": null,
    "phone": "0824060034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-01",
    "name": "Ardi Wicaksono",
    "email": "ardi.wicaksono.24250701@siswa.belajar.id",
    "password": "$sapa$v1$f01b78175832128074aa472dc9847f59416a51244f8b37a860108b6d223ef305",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-02",
    "name": "Febriana Purnomo",
    "email": "febriana.purnomo.24250702@siswa.belajar.id",
    "password": "$sapa$v1$c5f2e5f24615adcd8c521bfc9d1bd74ebf64cd3d3958d1744463a4368bb38228",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-03",
    "name": "Pratama Saputra",
    "email": "pratama.saputra.24250703@siswa.belajar.id",
    "password": "$sapa$v1$417e7aad6ea2827dd82c7da457cdb0615317f18ac5a3be39bd4bc57231b71ada",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-04",
    "name": "Syifa Safitri",
    "email": "syifa.safitri.24250704@siswa.belajar.id",
    "password": "$sapa$v1$2f9afdf07d0a7d16642e6cd62b79ca0337fcfa4af94ae7d24fe093caada7eeb4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-05",
    "name": "Bagas Mahardika",
    "email": "bagas.mahardika.24250705@siswa.belajar.id",
    "password": "$sapa$v1$c7319b84d4478a0c7679bcddbd3bfb01d8a9ececad51ea274fb9e545224ff617",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-06",
    "name": "Gita Gunawan",
    "email": "gita.gunawan.24250706@siswa.belajar.id",
    "password": "$sapa$v1$940c52e73573e0ccfe842abe7bc3907a3f2e61cc255a74d1c4dc7db1d1465992",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-07",
    "name": "Rafi Sujatmiko",
    "email": "rafi.sujatmiko.24250707@siswa.belajar.id",
    "password": "$sapa$v1$6cda12a71463f3133c0e988fd5cef071be7971a0078f3ddcbcc86f3b42788266",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-08",
    "name": "Tiara Nugroho",
    "email": "tiara.nugroho.24250708@siswa.belajar.id",
    "password": "$sapa$v1$1da35a3d21df5c797a9216143896cb91bb84f9a6301f840a5ace5e92d85aedba",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-09",
    "name": "Bima Suryanto",
    "email": "bima.suryanto.24250709@siswa.belajar.id",
    "password": "$sapa$v1$9c9d48e1e83d18a4c14c851eb2075de72af8883aa06fdbefa541945e40a3fad0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-10",
    "name": "Indah Pratama",
    "email": "indah.pratama.24250710@siswa.belajar.id",
    "password": "$sapa$v1$edd057259710bec434c139493ddfd18f4a245f083d0f75c7010da45c60daadf0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-11",
    "name": "Rendi Wahyuni",
    "email": "rendi.wahyuni.24250711@siswa.belajar.id",
    "password": "$sapa$v1$0ba470e756422d31702461460e445fe96b1a95063d1b25feb821f15f4b69e043",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-12",
    "name": "Zahra Haikal",
    "email": "zahra.haikal.24250712@siswa.belajar.id",
    "password": "$sapa$v1$69273c70853f97591e89f77c73ade224d8f8cf55717f44c598f7bf5b3570477d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-13",
    "name": "Daffa Santoso",
    "email": "daffa.santoso.24250713@siswa.belajar.id",
    "password": "$sapa$v1$c7aa7d7ee6d6eb9b65e640505d510e34d29438c1995dc5295b4e629e077e75f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-14",
    "name": "Jessica Sudrajat",
    "email": "jessica.sudrajat.24250714@siswa.belajar.id",
    "password": "$sapa$v1$b805fc9811d7c7a36eedfdee54e095a69ea9e5df78397365c3feabcf6f960f57",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-15",
    "name": "Rian Wijaya",
    "email": "rian.wijaya.24250715@siswa.belajar.id",
    "password": "$sapa$v1$5780c08dd69613cc0393144a039f3fd586c6e7044b0c7a32dccbc34489600923",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-16",
    "name": "Adinda Pangestu",
    "email": "adinda.pangestu.24250716@siswa.belajar.id",
    "password": "$sapa$v1$f555654a4ff572486261129978632c8e7f891fd9bbe48b96a7784c95410e3459",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-17",
    "name": "Desta Kuncoro",
    "email": "desta.kuncoro.24250717@siswa.belajar.id",
    "password": "$sapa$v1$fd96485a98571e0343b92b79f8e280237e82359969f7b32c16d756ed58acd632",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-18",
    "name": "Keisha Rahmawati",
    "email": "keisha.rahmawati.24250718@siswa.belajar.id",
    "password": "$sapa$v1$46cdb635d385da35d2fd42e761709e9bf5595ec345890bc906c0632759a19b46",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-19",
    "name": "Tegar Nugraha",
    "email": "tegar.nugraha.24250719@siswa.belajar.id",
    "password": "$sapa$v1$5615ab16bb0b5d16ca5fd60d681107975b7658ed25837940cb07bbe46f5dee33",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-20",
    "name": "Alifa Hidayat",
    "email": "alifa.hidayat.24250720@siswa.belajar.id",
    "password": "$sapa$v1$661b587677effb0fe8f772683af6201e4fb92352df60ec1cb46b569a63d0d8d2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-21",
    "name": "Fadhil Wibowo",
    "email": "fadhil.wibowo.24250721@siswa.belajar.id",
    "password": "$sapa$v1$c8547a323aa0e792bdbcfa1b7b0d4679956318f62b97d0cc6a926076ab21ab62",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-22",
    "name": "Laras Ramadhan",
    "email": "laras.ramadhan.24250722@siswa.belajar.id",
    "password": "$sapa$v1$589107117fdc87ce6afbaff456636f677b9e8a6bb4922064a2c1578f7dfb36a9",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-23",
    "name": "Wawan Firmansyah",
    "email": "wawan.firmansyah.24250723@siswa.belajar.id",
    "password": "$sapa$v1$a30d8c7d0a38dea462bf733434e7aefbcc1e0c2a2aa73dd28137f95c21b59dbc",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-24",
    "name": "Anindya Hakim",
    "email": "anindya.hakim.24250724@siswa.belajar.id",
    "password": "$sapa$v1$c54f0e3ba5d0cfd54d012cba5d061e7e9a8ba6caed1e17c00e39784c9940ee52",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-25",
    "name": "Farhan Anggraini",
    "email": "farhan.anggraini.24250725@siswa.belajar.id",
    "password": "$sapa$v1$c5f7ac86178f8bc14eb02cea4aed050646d38ec9c4df2b62aca6340a1e695ed1",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-26",
    "name": "Maulida Wardhana",
    "email": "maulida.wardhana.24250726@siswa.belajar.id",
    "password": "$sapa$v1$7eba646b5deea1d72a6a769ead4e9a5b4c72128632ceb17c5dc7af7c30a78527",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-27",
    "name": "Yusuf Utomo",
    "email": "yusuf.utomo.24250727@siswa.belajar.id",
    "password": "$sapa$v1$03b98c96325b9128c86699344832db0f701b9ae222ca4935aa35bdfae5d2a17a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-28",
    "name": "Annisa Kuswanto",
    "email": "annisa.kuswanto.24250728@siswa.belajar.id",
    "password": "$sapa$v1$4324abeca3140a45001b2a775b83888e9edf03b1a6418ea450eef0d2f9a7d48b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-29",
    "name": "Galih Kusuma",
    "email": "galih.kusuma.24250729@siswa.belajar.id",
    "password": "$sapa$v1$a2b941b3d8ca2c2e78e34ae835497edba4a636ed6c2ea0c2261a8675fe113f3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-30",
    "name": "Nadira Mahendra",
    "email": "nadira.mahendra.24250730@siswa.belajar.id",
    "password": "$sapa$v1$66c71c1a4d15cfbe02f383a7441cd83d0fd7bb6b5242b29cdc30ce8239a6c6c3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-31",
    "name": "Zidan Baskara",
    "email": "zidan.baskara.24250731@siswa.belajar.id",
    "password": "$sapa$v1$d2f9a29fc302ff75edc0b27b62a3f7f8594a710e20bad04b352bdf53b9730722",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-32",
    "name": "Aurelia Permatasari",
    "email": "aurelia.permatasari.24250732@siswa.belajar.id",
    "password": "$sapa$v1$640c7df980fd7fc37352fdedb26900ba3aee74ee596a8565b13486ffc208a02b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-33",
    "name": "Hafiz Maulana",
    "email": "hafiz.maulana.24250733@siswa.belajar.id",
    "password": "$sapa$v1$698a2f626c5ae16a671ba036b6d38858011bef25496bae73e8f4525d1438f048",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-2-34",
    "name": "Nayra Setiawan",
    "email": "nayra.setiawan.24250734@siswa.belajar.id",
    "password": "$sapa$v1$02830f5e4eeefb60df49384ed6e81c7af43f08ed04951019e0904fd83c01dbdc",
    "role": "siswa",
    "avatar": null,
    "phone": "0824070034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-01",
    "name": "Dennis Gunawan",
    "email": "dennis.gunawan.24250801@siswa.belajar.id",
    "password": "$sapa$v1$1ba33d5539659c5311642dc2b8154dd8b747b9bdc3d2be18b773cb8d4c534c06",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-02",
    "name": "Kayla Sujatmiko",
    "email": "kayla.sujatmiko.24250802@siswa.belajar.id",
    "password": "$sapa$v1$5595431c60864257264f7c5264cb7b82569cb33822a149d817c014fff2283e92",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-03",
    "name": "Satria Nugroho",
    "email": "satria.nugroho.24250803@siswa.belajar.id",
    "password": "$sapa$v1$2e0276f4a12ac29a6da50c5083fbcac1d373c5dd81b0997bf0e68d0ce9e8dbb8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-04",
    "name": "Aisyah Suryanto",
    "email": "aisyah.suryanto.24250804@siswa.belajar.id",
    "password": "$sapa$v1$0f7f7c296fc10800d403ca9f07a9c11b65d6e438b3c2a84aad379c5b0078fb4e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-05",
    "name": "Dimas Pratama",
    "email": "dimas.pratama.24250805@siswa.belajar.id",
    "password": "$sapa$v1$901f025483d9a19827c93ea10925ce9c173ec82bbc3783fafa603bf8c17c9bed",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-06",
    "name": "Laila Wahyuni",
    "email": "laila.wahyuni.24250806@siswa.belajar.id",
    "password": "$sapa$v1$c72b1c6d4d9ea4d1c375720a0287914b9de6bf58261284da1603680ac2cf45cc",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-07",
    "name": "Wahyu Haikal",
    "email": "wahyu.haikal.24250807@siswa.belajar.id",
    "password": "$sapa$v1$ac7730df066cf7809c37c3b4ecedd7af21565ed071456ef5b00f1f1d1ee1b268",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-08",
    "name": "Amanda Santoso",
    "email": "amanda.santoso.24250808@siswa.belajar.id",
    "password": "$sapa$v1$7198716007fd4fe0de9e77d2b7c1b7356ad50e54f31fafc7321d0b0ecef121ab",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-09",
    "name": "Fajar Sudrajat",
    "email": "fajar.sudrajat.24250809@siswa.belajar.id",
    "password": "$sapa$v1$a116147abe0c7e5cbcd593353da1829527cf2e70eed75bfc7c4744570b767b3b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-10",
    "name": "Marsha Wijaya",
    "email": "marsha.wijaya.24250810@siswa.belajar.id",
    "password": "$sapa$v1$a85a68d919a2a758fdba590bbfb700fff227b1b9511e82e3bd84580bb603b443",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-11",
    "name": "Yoga Pangestu",
    "email": "yoga.pangestu.24250811@siswa.belajar.id",
    "password": "$sapa$v1$71d673876a8278af5848790bc27292fb673284d07ff5ff45586ee69a1eb3c369",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-12",
    "name": "Anisa Kuncoro",
    "email": "anisa.kuncoro.24250812@siswa.belajar.id",
    "password": "$sapa$v1$7562af8e1079d682f536dca79dc08dd74992f2d0015a2dfdcb4e2f8eeabf4c1f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-13",
    "name": "Fathir Rahmawati",
    "email": "fathir.rahmawati.24250813@siswa.belajar.id",
    "password": "$sapa$v1$fb010197a234afb19ee429e5883ead50e281af70a39f78d638e47060765f6bd7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-14",
    "name": "Nabila Nugraha",
    "email": "nabila.nugraha.24250814@siswa.belajar.id",
    "password": "$sapa$v1$6b581af560cfcdae723edc90613436097657a88d816a3e4a88786a76ef929cb3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-15",
    "name": "Zack Hidayat",
    "email": "zack.hidayat.24250815@siswa.belajar.id",
    "password": "$sapa$v1$5f482c6dba76795624bdb4bd23d3f9ab03b0ff070099243ea7748201bd953856",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-16",
    "name": "Aqila Wibowo",
    "email": "aqila.wibowo.24250816@siswa.belajar.id",
    "password": "$sapa$v1$445d4013aee2cca2f928801c97a127b0076bad5381fc7af25fc120f81428cf00",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-17",
    "name": "Gilang Ramadhan",
    "email": "gilang.ramadhan.24250817@siswa.belajar.id",
    "password": "$sapa$v1$c2fb8946c1f32dd32d218d866671f4c1b7d6ac455e20e99407825335829edd2d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-18",
    "name": "Nafisa Firmansyah",
    "email": "nafisa.firmansyah.24250818@siswa.belajar.id",
    "password": "$sapa$v1$62d0ed94ff0f005fbff2281be2c80881e7fbe6b080f051603daba9240f9baf9d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-19",
    "name": "Zulfikar Hakim",
    "email": "zulfikar.hakim.24250819@siswa.belajar.id",
    "password": "$sapa$v1$7cd6cb45af39ed58d59f1b588ca4170f7a15eabda6bb25db929e37b0a347ce61",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-20",
    "name": "Cantika Anggraini",
    "email": "cantika.anggraini.24250820@siswa.belajar.id",
    "password": "$sapa$v1$4d4001a46cf6093af413b99d1622bbc4d59d0a563a25cd8707d55bc8eb1d12cb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-21",
    "name": "Ilham Wardhana",
    "email": "ilham.wardhana.24250821@siswa.belajar.id",
    "password": "$sapa$v1$894b5bbb05264be056870389769b792f7e3b53d3ae6f7362eedc1bb2be178274",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-22",
    "name": "Novalita Utomo",
    "email": "novalita.utomo.24250822@siswa.belajar.id",
    "password": "$sapa$v1$d16aaa319a26b2b7b47b468cbff38331ab78d2648abed738eb12b1a078157568",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-23",
    "name": "Candra Kuswanto",
    "email": "candra.kuswanto.24250823@siswa.belajar.id",
    "password": "$sapa$v1$0e2cbfc85bec93212a422d8c8e5a20a5d4dc573963fbcda311a8da7136944d2c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-24",
    "name": "Citra Kusuma",
    "email": "citra.kusuma.24250824@siswa.belajar.id",
    "password": "$sapa$v1$d6d92306fddac2cd4bc83f5ee809e56848fff13af8f3cc685162dc2475ba00b3",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-25",
    "name": "Irfan Mahendra",
    "email": "irfan.mahendra.24250825@siswa.belajar.id",
    "password": "$sapa$v1$8c4100c43a01b4f367ee123b7b6382195a9fcd04880761ea60e77c5ad5791d93",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-26",
    "name": "Putri Baskara",
    "email": "putri.baskara.24250826@siswa.belajar.id",
    "password": "$sapa$v1$a79dcba2ca6e5e181fc165b6bb02219b6168b94eaf14d8c05ff47664cc7eda51",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-27",
    "name": "Ahmad Permatasari",
    "email": "ahmad.permatasari.24250827@siswa.belajar.id",
    "password": "$sapa$v1$816c3167998bb5e05f0250e37980a2a067574f45705ee8b8f7a67a11ffc4411a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-28",
    "name": "Delfina Maulana",
    "email": "delfina.maulana.24250828@siswa.belajar.id",
    "password": "$sapa$v1$b8fd12e6c2ee644f92d510673011caa05bac05580e34e548b6b832ebd29b7d8d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-29",
    "name": "Lucky Setiawan",
    "email": "lucky.setiawan.24250829@siswa.belajar.id",
    "password": "$sapa$v1$3adc26cd1dbe4f40b1b225aa5a98295c255d2b1d163786d885b05ba3b5bb1330",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-30",
    "name": "Rania Suhendra",
    "email": "rania.suhendra.24250830@siswa.belajar.id",
    "password": "$sapa$v1$b2b9253e7f4c89a13d59a099e86125fd2e8f3ca7464f142dba4b944868c65044",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-31",
    "name": "Aldiansyah Putra",
    "email": "aldiansyah.putra.24250831@siswa.belajar.id",
    "password": "$sapa$v1$a3ff17d3155b5dcd70116e4123295abeb23615aa87bf265ab85ddca260d96741",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-32",
    "name": "Dian Kurnia",
    "email": "dian.kurnia.24250832@siswa.belajar.id",
    "password": "$sapa$v1$93b3c678f116173cc15036dd9dfcfb1a2fa59b5d5a8e106f7e2e601645cbda82",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-33",
    "name": "M. Fikri Pramudya",
    "email": "m.fikri.pramudya.24250833@siswa.belajar.id",
    "password": "$sapa$v1$1861cc90ce45792ecef5d300ee662c2a636a12c6c76e296245a62e62c84dc6a6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-to-3-34",
    "name": "Salsabila Lestari",
    "email": "salsabila.lestari.24250834@siswa.belajar.id",
    "password": "$sapa$v1$690194d1e5adad62ee79aa97f2b739bae2c63aa0ee6163235be46470d6fec03a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824080034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-01",
    "name": "Galih Wahyuni",
    "email": "galih.wahyuni.24250901@siswa.belajar.id",
    "password": "$sapa$v1$f029bc07f24ff7ba67a896599264b1785cab5d5b99a878c57a5fb3daa79e9e06",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-02",
    "name": "Nadira Haikal",
    "email": "nadira.haikal.24250902@siswa.belajar.id",
    "password": "$sapa$v1$bf74d0139e228c81c398e58ff98eb2f63c909550fbc3438a9c6c256631abc3eb",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-03",
    "name": "Zidan Santoso",
    "email": "zidan.santoso.24250903@siswa.belajar.id",
    "password": "$sapa$v1$bf3cce275704588c5d896decfbea355a36ab1d444f29ee6d71cda823e18a7213",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-04",
    "name": "Aurelia Sudrajat",
    "email": "aurelia.sudrajat.24250904@siswa.belajar.id",
    "password": "$sapa$v1$40656d669275619dbcf41d4ccfc0cc33310f7dc3affff8dc57f5ab79fdd7a5b2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-05",
    "name": "Hafiz Wijaya",
    "email": "hafiz.wijaya.24250905@siswa.belajar.id",
    "password": "$sapa$v1$816f16ef1fd8537ec70925d2173a94a6736ed38e0bf75f2055e4ff75737b340d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-06",
    "name": "Nayra Pangestu",
    "email": "nayra.pangestu.24250906@siswa.belajar.id",
    "password": "$sapa$v1$23674e2d8c87ef974ec262fdb1002bc88f3cca793aacfb004a1770f41cb444a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-07",
    "name": "Bintang Kuncoro",
    "email": "bintang.kuncoro.24250907@siswa.belajar.id",
    "password": "$sapa$v1$2af6838b9813fcd35d3cf3559667c9afe0944d3143494158a94dd10c0ed7ca0d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-08",
    "name": "Chelsea Rahmawati",
    "email": "chelsea.rahmawati.24250908@siswa.belajar.id",
    "password": "$sapa$v1$54491a655a6e1ce137b0242bc1d0522f02e45eddd5cb61a28b011a121caa3adf",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-09",
    "name": "Indra Nugraha",
    "email": "indra.nugraha.24250909@siswa.belajar.id",
    "password": "$sapa$v1$94dd2cffc64609575aebe77e0bb428869e93cedb18b190369934a10eca076c0d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-10",
    "name": "Nurul Hidayat",
    "email": "nurul.hidayat.24250910@siswa.belajar.id",
    "password": "$sapa$v1$ddb869518d19dc859ccb349914447cf4422414a35660bb5dce912b99dd549767",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-11",
    "name": "Dwi Wibowo",
    "email": "dwi.wibowo.24250911@siswa.belajar.id",
    "password": "$sapa$v1$dc7dc4710ae3986d93ae0236150979173777c9b3ada6eb55d396148a03132e77",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-12",
    "name": "Clarissa Ramadhan",
    "email": "clarissa.ramadhan.24250912@siswa.belajar.id",
    "password": "$sapa$v1$91dc3670d8cfd77e5c393c6a59db21c40482f3fb46c72235f4953bf68f3e900c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-13",
    "name": "Kevin Firmansyah",
    "email": "kevin.firmansyah.24250913@siswa.belajar.id",
    "password": "$sapa$v1$a0e39ffa94caadab6d858977064dc467562bff52698420cd01ed70409c2c9625",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-14",
    "name": "Raisa Hakim",
    "email": "raisa.hakim.24250914@siswa.belajar.id",
    "password": "$sapa$v1$22757206d08d598ae79083547ebb31d315cda686a831d50660199d0e855786fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-15",
    "name": "Aditya Anggraini",
    "email": "aditya.anggraini.24250915@siswa.belajar.id",
    "password": "$sapa$v1$7b0b8220bfe491a757fb24fae47e07c84dc3af9d051ca8aebb7011d387d6b590",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-16",
    "name": "Devi Wardhana",
    "email": "devi.wardhana.24250916@siswa.belajar.id",
    "password": "$sapa$v1$ab066812e3b16a389e4053a0ff919a23bc031840c45768d910a165d9a3f2f6b4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-17",
    "name": "M. Rizky Utomo",
    "email": "m.rizky.utomo.24250917@siswa.belajar.id",
    "password": "$sapa$v1$4c31501acb8ceadf3c1981626361addaa6e826c5713d6751ca0146bd0207ddc6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-18",
    "name": "Salma Kuswanto",
    "email": "salma.kuswanto.24250918@siswa.belajar.id",
    "password": "$sapa$v1$3252454f03638f1b4b794d5433742b4f5346dba176bdae0e11244b043b704ebf",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-19",
    "name": "Alif Kusuma",
    "email": "alif.kusuma.24250919@siswa.belajar.id",
    "password": "$sapa$v1$97bd6fe86f1617da3ced72255b4922b85e313bd0b3d808b8ece94814f1c4794c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-20",
    "name": "Dinda Mahendra",
    "email": "dinda.mahendra.24250920@siswa.belajar.id",
    "password": "$sapa$v1$6c73289106fa3cb7021033cfec568aca9648536f61f7d682a98147a305959db5",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-21",
    "name": "M. Zidan Baskara",
    "email": "m.zidan.baskara.24250921@siswa.belajar.id",
    "password": "$sapa$v1$5a24ddf7c7d4eeb14be9294efc90d66820c356f316b3a51e12072bd5b636fbed",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-22",
    "name": "Shifa Permatasari",
    "email": "shifa.permatasari.24250922@siswa.belajar.id",
    "password": "$sapa$v1$0f23eda9d1c68a3c6418d799af351a8aa6aa5c86bf7b3cfd5fcdb8e593c9c714",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-23",
    "name": "Ardi Maulana",
    "email": "ardi.maulana.24250923@siswa.belajar.id",
    "password": "$sapa$v1$2a108d941bc0115cc9156d17a7ec4f5f1242a6068b75ac281aacaffc84f0ab3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-24",
    "name": "Febriana Setiawan",
    "email": "febriana.setiawan.24250924@siswa.belajar.id",
    "password": "$sapa$v1$d90ba908168a1d3efc47be5cfca88ca971f37a8ad40f4b153784dbdb584793da",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-25",
    "name": "Pratama Suhendra",
    "email": "pratama.suhendra.24250925@siswa.belajar.id",
    "password": "$sapa$v1$979263c25f0d6c7e0cb79e6db540a63f01fda3c47c96d2af4abf231584e1f47c",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-26",
    "name": "Syifa Putra",
    "email": "syifa.putra.24250926@siswa.belajar.id",
    "password": "$sapa$v1$e45290af081f4aa58dd30f9930ab8842a4359a59ab1958b6e3c86bcb848ff995",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-27",
    "name": "Bagas Kurnia",
    "email": "bagas.kurnia.24250927@siswa.belajar.id",
    "password": "$sapa$v1$eb38c5e1fee70018abdfc1ddffb233ad88cca46cebc52c0ea290a8b3096cd6e6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-28",
    "name": "Gita Pramudya",
    "email": "gita.pramudya.24250928@siswa.belajar.id",
    "password": "$sapa$v1$56d67aaf9214ba0f604a48be4c62de91006501d7c0145c429e8c8dd54f2ee170",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-29",
    "name": "Rafi Lestari",
    "email": "rafi.lestari.24250929@siswa.belajar.id",
    "password": "$sapa$v1$2a7939ce056001f325ecce9c8126468824eb54f07c4771242bd6cd58b251bb69",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-30",
    "name": "Tiara Syahputra",
    "email": "tiara.syahputra.24250930@siswa.belajar.id",
    "password": "$sapa$v1$d04fa0eae785803c08cb06c9a9ec165c9260551f03e65983ec6e5215cdc48411",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-31",
    "name": "Bima Wicaksono",
    "email": "bima.wicaksono.24250931@siswa.belajar.id",
    "password": "$sapa$v1$4f2481893ff4a424ea15e1380c08bb41a8de54c76440cd32e1948628a673b8c4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-32",
    "name": "Indah Purnomo",
    "email": "indah.purnomo.24250932@siswa.belajar.id",
    "password": "$sapa$v1$0367001bc1c260c3370102d44169324d7c581962e27a53ff172dd27b8873f825",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-33",
    "name": "Rendi Saputra",
    "email": "rendi.saputra.24250933@siswa.belajar.id",
    "password": "$sapa$v1$6789da0296624b4506de1bbf018972347a92273148d2e7a99904c1a53d0f6efa",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-1-34",
    "name": "Zahra Safitri",
    "email": "zahra.safitri.24250934@siswa.belajar.id",
    "password": "$sapa$v1$00ae97a3db0e65e3628f13113528c9345f215fcaeaefb8d62a3f1447c22152a9",
    "role": "siswa",
    "avatar": null,
    "phone": "0824090034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-01",
    "name": "Lucky Pangestu",
    "email": "lucky.pangestu.24251001@siswa.belajar.id",
    "password": "$sapa$v1$6c74702b1d102c8a9af936b990d6d2c2553ae3858926cb67cbb58d556348a35e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-02",
    "name": "Rania Kuncoro",
    "email": "rania.kuncoro.24251002@siswa.belajar.id",
    "password": "$sapa$v1$e8409d007c8dc75a32dc81e2531188941a9d8e571cf61ee364455731d51ee644",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-03",
    "name": "Aldiansyah Rahmawati",
    "email": "aldiansyah.rahmawati.24251003@siswa.belajar.id",
    "password": "$sapa$v1$fb05f7e42cdc2af1ed9324b1e7d2ae75a616a8f93f7c4b9ecf596bc6b578bd62",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-04",
    "name": "Dian Nugraha",
    "email": "dian.nugraha.24251004@siswa.belajar.id",
    "password": "$sapa$v1$9ebb3820ec1758b626028a69623a4b70d84b0d02fdb55c748db8dd8716626f38",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-05",
    "name": "M. Fikri Hidayat",
    "email": "m.fikri.hidayat.24251005@siswa.belajar.id",
    "password": "$sapa$v1$9c7a886fd5681edb0ffdbee916316d67baae84fe5d78d7f0de36ef1aee3d3c0f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-06",
    "name": "Salsabila Wibowo",
    "email": "salsabila.wibowo.24251006@siswa.belajar.id",
    "password": "$sapa$v1$a1a21a223e395f2a6c2137008a65722d86dfa60d74a06a30cb11265feb50eef2",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-07",
    "name": "Andika Ramadhan",
    "email": "andika.ramadhan.24251007@siswa.belajar.id",
    "password": "$sapa$v1$02706b4d8fe94094ce93c6b404361878de0aec926ce6f2e9e7a2bce6ec67cb83",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-08",
    "name": "Elsa Firmansyah",
    "email": "elsa.firmansyah.24251008@siswa.belajar.id",
    "password": "$sapa$v1$fb81c00286ae71d36a8e5e71b115cf09990d45859da6608da1f9f354bb7b35a7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-09",
    "name": "Naufal Hakim",
    "email": "naufal.hakim.24251009@siswa.belajar.id",
    "password": "$sapa$v1$439e36d21c2a675c0f7c4d8e3906c2de2741d925bfe2370906d340da574e3055",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-10",
    "name": "Siti Anggraini",
    "email": "siti.anggraini.24251010@siswa.belajar.id",
    "password": "$sapa$v1$8907052d4b133a93513f258a17359e643fd17003b0a4d8d9c969f3cd3f1c7422",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-11",
    "name": "Arya Wardhana",
    "email": "arya.wardhana.24251011@siswa.belajar.id",
    "password": "$sapa$v1$83289a0116e660305941450cbe1687840bd1c87c3a8084dedbe55fffac47cd60",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-12",
    "name": "Fitri Utomo",
    "email": "fitri.utomo.24251012@siswa.belajar.id",
    "password": "$sapa$v1$6819c50b0fcc8b2e51b9ba917ee666d89a5012b31472e7bb4aa04d4d8d2d7735",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-13",
    "name": "Raditya Kuswanto",
    "email": "raditya.kuswanto.24251013@siswa.belajar.id",
    "password": "$sapa$v1$ddd983f0d8f5cc35baf7f80110432b0df3aace64e5a9199157ed62dcf5580e6d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-14",
    "name": "Tania Kusuma",
    "email": "tania.kusuma.24251014@siswa.belajar.id",
    "password": "$sapa$v1$7998c59458e86fe761e24bd9acc841eee782ff6f89bcb41b757a9e11c438fd94",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-15",
    "name": "Bayu Mahendra",
    "email": "bayu.mahendra.24251015@siswa.belajar.id",
    "password": "$sapa$v1$4aa46b327ee45371ba16cd44ed3f7a07b0f5234f856ddc331f2bdf4ca0bb2c5d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-16",
    "name": "Hana Baskara",
    "email": "hana.baskara.24251016@siswa.belajar.id",
    "password": "$sapa$v1$cc90856dc0ae72a37609f06329e379db18899c76761aaacf2482cf4700453067",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-17",
    "name": "Rangga Permatasari",
    "email": "rangga.permatasari.24251017@siswa.belajar.id",
    "password": "$sapa$v1$89b310aa7ca7d475f0c2c8a7ab4afc9445f12c348bae00a359a34e4e38d99972",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-18",
    "name": "Vania Maulana",
    "email": "vania.maulana.24251018@siswa.belajar.id",
    "password": "$sapa$v1$f492c9fc796b5d041fd3c32718289341ea1e3e749a2b4da5d620117592b8b7f0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-19",
    "name": "Danendra Setiawan",
    "email": "danendra.setiawan.24251019@siswa.belajar.id",
    "password": "$sapa$v1$754e04a93105c807d0e7fe656e8d3090bca64911022c2eadf681d53875b14c83",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-20",
    "name": "Intan Suhendra",
    "email": "intan.suhendra.24251020@siswa.belajar.id",
    "password": "$sapa$v1$9848ad47c4f70eaad2e6d056425eba6f4edbe01114dcc7bbfb56b04f4cbb9790",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-21",
    "name": "Revan Putra",
    "email": "revan.putra.24251021@siswa.belajar.id",
    "password": "$sapa$v1$cf312eaf2ae1cc2201bbe65e50a6f90dc1b8123cab44eacea3e52dd701504183",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-22",
    "name": "Zaskia Kurnia",
    "email": "zaskia.kurnia.24251022@siswa.belajar.id",
    "password": "$sapa$v1$e5b3cfad316ac5c59fbf21951869e28191f182c3f4f5c40993426c905faf8758",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-23",
    "name": "Dennis Pramudya",
    "email": "dennis.pramudya.24251023@siswa.belajar.id",
    "password": "$sapa$v1$8693ce444b73bac445c8a94ed2c062429c60d707e6a28ef2806f091062c58bac",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-24",
    "name": "Kayla Lestari",
    "email": "kayla.lestari.24251024@siswa.belajar.id",
    "password": "$sapa$v1$20675edd077f48cf6624c1321acbef84592e05d79e9d631bfa4693ca391c5a3b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-25",
    "name": "Satria Syahputra",
    "email": "satria.syahputra.24251025@siswa.belajar.id",
    "password": "$sapa$v1$6d81ab58f631102236e17efcd5af8dc234be1000e1311a66b56202bf4b8f7951",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-26",
    "name": "Aisyah Wicaksono",
    "email": "aisyah.wicaksono.24251026@siswa.belajar.id",
    "password": "$sapa$v1$649d08a52085eb83d214f1eeae6152cde4b9fa4e477827d233d577b0293b7ff6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-27",
    "name": "Dimas Purnomo",
    "email": "dimas.purnomo.24251027@siswa.belajar.id",
    "password": "$sapa$v1$00bf4dd94142b878c97d40c85a86e5dfbfa2c25ad3a464a139bb6b0090d6c37b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-28",
    "name": "Laila Saputra",
    "email": "laila.saputra.24251028@siswa.belajar.id",
    "password": "$sapa$v1$150d7ddf0dde016bdd497690c3f2d52d2030567e80acfb6fb6642c76a0c8cb7b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-29",
    "name": "Wahyu Safitri",
    "email": "wahyu.safitri.24251029@siswa.belajar.id",
    "password": "$sapa$v1$41e037025a454c05c52df35ca737e005d5f76b5d971d8868d909863a1f7cd14f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-30",
    "name": "Amanda Mahardika",
    "email": "amanda.mahardika.24251030@siswa.belajar.id",
    "password": "$sapa$v1$94f1cdbbc8d32ebc84bdbf37b9ba881af03cdd759a9e95e0a24eedd9d9babd83",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-31",
    "name": "Fajar Gunawan",
    "email": "fajar.gunawan.24251031@siswa.belajar.id",
    "password": "$sapa$v1$9f4a5ae87ec41c3162230bf6baf397db0d990e629e59b9b569a1b99f350ab220",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-32",
    "name": "Marsha Sujatmiko",
    "email": "marsha.sujatmiko.24251032@siswa.belajar.id",
    "password": "$sapa$v1$38fec6f6e29c57688d4e505d98754e79a29d06212108d9f06807b7beb29d45f6",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-33",
    "name": "Yoga Nugroho",
    "email": "yoga.nugroho.24251033@siswa.belajar.id",
    "password": "$sapa$v1$4b30838b15286f0cc7812957d2d75d6b6c0d7a24e8d6a96d01626408ca4ec097",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-dkv-2-34",
    "name": "Anisa Suryanto",
    "email": "anisa.suryanto.24251034@siswa.belajar.id",
    "password": "$sapa$v1$3b8ad3c3fc8b5b42d2059f150d72ee42768536e6a09c5ca33766d20bf973352f",
    "role": "siswa",
    "avatar": null,
    "phone": "0824100034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-01",
    "name": "Rafi Wibowo",
    "email": "rafi.wibowo.24251101@siswa.belajar.id",
    "password": "$sapa$v1$e67f6c84ed9ba880adeb16b4b8b77f2bf1ef912da6f02a8521993c813c86baef",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-02",
    "name": "Tiara Ramadhan",
    "email": "tiara.ramadhan.24251102@siswa.belajar.id",
    "password": "$sapa$v1$b1e9650b553601b50b4bc440155afc3c26ee153b8573072e21ffa36adaa38845",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-03",
    "name": "Bima Firmansyah",
    "email": "bima.firmansyah.24251103@siswa.belajar.id",
    "password": "$sapa$v1$79780e99e10a9a64ebeeb6a6846688c81c5f9b0dbe868016bf13e53fcbb0c879",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-04",
    "name": "Indah Hakim",
    "email": "indah.hakim.24251104@siswa.belajar.id",
    "password": "$sapa$v1$207d587d3af8728f8392c094975211807dd31193a13a8637876bf79be77f9a44",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-05",
    "name": "Rendi Anggraini",
    "email": "rendi.anggraini.24251105@siswa.belajar.id",
    "password": "$sapa$v1$f8fb425d358d224f07557f454e11803fb5c4a40ab8b457f576013480f6219c23",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-06",
    "name": "Zahra Wardhana",
    "email": "zahra.wardhana.24251106@siswa.belajar.id",
    "password": "$sapa$v1$5e158c6700bb2f80be1e8c9fccbf92271b27ed74b99600009ad4d205cb3a66a0",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-07",
    "name": "Daffa Utomo",
    "email": "daffa.utomo.24251107@siswa.belajar.id",
    "password": "$sapa$v1$d5f0256e1c474881bca2ba930955111401248195a1da39f259e808c65ef758b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-08",
    "name": "Jessica Kuswanto",
    "email": "jessica.kuswanto.24251108@siswa.belajar.id",
    "password": "$sapa$v1$006e507bb5a1237d64a21fc436974791e5f625a2c3087a2b5cb40a858429f270",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-09",
    "name": "Rian Kusuma",
    "email": "rian.kusuma.24251109@siswa.belajar.id",
    "password": "$sapa$v1$43ef1d31c9fa606c09114b7a1e69c7d8e9399a4e16c35b15c9b626fa07b88775",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-10",
    "name": "Adinda Mahendra",
    "email": "adinda.mahendra.24251110@siswa.belajar.id",
    "password": "$sapa$v1$26b9c3046a33ef72e71c246909254343c145ce745d6a2b7451c433a6b331a02a",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-11",
    "name": "Desta Baskara",
    "email": "desta.baskara.24251111@siswa.belajar.id",
    "password": "$sapa$v1$0cf820be5c7a818a6a4e448905c7b5a554013fc36c3badbe34804c38c0281ec8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-12",
    "name": "Keisha Permatasari",
    "email": "keisha.permatasari.24251112@siswa.belajar.id",
    "password": "$sapa$v1$0c1dc70b0d1c6b58a33467c9c089eef9d548f364d08cb7def084be7d31f59e9d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-13",
    "name": "Tegar Maulana",
    "email": "tegar.maulana.24251113@siswa.belajar.id",
    "password": "$sapa$v1$76ee3b370fcaa1032ab547134f63fe883092cde4c0c979b4c22e497e765b88f7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-14",
    "name": "Alifa Setiawan",
    "email": "alifa.setiawan.24251114@siswa.belajar.id",
    "password": "$sapa$v1$f99fdf717e947d0fb2208e2951daf1f10c3ffb2e0292daddb7894897fd53c028",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-15",
    "name": "Fadhil Suhendra",
    "email": "fadhil.suhendra.24251115@siswa.belajar.id",
    "password": "$sapa$v1$99d119a050ac0ba84b4e75281307e4a6008e46042d1196184530bcf455c6cd48",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-16",
    "name": "Laras Putra",
    "email": "laras.putra.24251116@siswa.belajar.id",
    "password": "$sapa$v1$34ec2d0e99aaa6e4db76fe4d589bffdb25597a919ec38ee8b181938f04b12615",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-17",
    "name": "Wawan Kurnia",
    "email": "wawan.kurnia.24251117@siswa.belajar.id",
    "password": "$sapa$v1$67b18556110a27f81e2be04e74fef6fff52fa31e2252eb6330b80feb29e67943",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-18",
    "name": "Anindya Pramudya",
    "email": "anindya.pramudya.24251118@siswa.belajar.id",
    "password": "$sapa$v1$5bfc8de6f58a35c0a1e0d0ad27f7384e44d3c56a08413c87e69030c257c3fc64",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-19",
    "name": "Farhan Lestari",
    "email": "farhan.lestari.24251119@siswa.belajar.id",
    "password": "$sapa$v1$2119319d355c9234b5aade7cf7b9ce66dbc3fa07ae856090f51912ec10049d85",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-20",
    "name": "Maulida Syahputra",
    "email": "maulida.syahputra.24251120@siswa.belajar.id",
    "password": "$sapa$v1$8b3970772d1f105f66cc0d4a37a4e6ff7d29c37e25fcb1b87e1498d82892f987",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-21",
    "name": "Yusuf Wicaksono",
    "email": "yusuf.wicaksono.24251121@siswa.belajar.id",
    "password": "$sapa$v1$d9794d678872e9c5cfb2dc705ad85309627eb4562dfd91b3f4c6085a8e98b3c7",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-22",
    "name": "Annisa Purnomo",
    "email": "annisa.purnomo.24251122@siswa.belajar.id",
    "password": "$sapa$v1$56ed7113d69d502f631434df219661c3e953faecfbe9e30b70a1a53429d53526",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-23",
    "name": "Galih Saputra",
    "email": "galih.saputra.24251123@siswa.belajar.id",
    "password": "$sapa$v1$d152b5583b59ca010bddfa11b3e2a422ed28c0a4a71b2f029347e2f41ad04482",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-24",
    "name": "Nadira Safitri",
    "email": "nadira.safitri.24251124@siswa.belajar.id",
    "password": "$sapa$v1$b75717adcd61f7562bdc0b4d7b6f4eae017a5dce44701caa6d33ef7dbb3e80ed",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-25",
    "name": "Zidan Mahardika",
    "email": "zidan.mahardika.24251125@siswa.belajar.id",
    "password": "$sapa$v1$54565421841ee1e1151032796c29063c4e8a7e70490c7beba6838f2a6ad33c05",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-26",
    "name": "Aurelia Gunawan",
    "email": "aurelia.gunawan.24251126@siswa.belajar.id",
    "password": "$sapa$v1$b71e1968bc7a540a50f67e9658fcd3b1f234e6f3de03a8f7f55b44a45c194712",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-27",
    "name": "Hafiz Sujatmiko",
    "email": "hafiz.sujatmiko.24251127@siswa.belajar.id",
    "password": "$sapa$v1$ec8ec316c9e74497d717078ec759ef1a8305c594ff0fadaa12967e03836fea32",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-28",
    "name": "Nayra Nugroho",
    "email": "nayra.nugroho.24251128@siswa.belajar.id",
    "password": "$sapa$v1$a7dba611a6f1926fb3858ff0a062d7ce9241c26ed795224756c476cad41029c8",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-29",
    "name": "Bintang Suryanto",
    "email": "bintang.suryanto.24251129@siswa.belajar.id",
    "password": "$sapa$v1$861768ad4aa1eb02363912ff75ac014dfd8f3398e02f3632e1e45639eefcf0f4",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-30",
    "name": "Chelsea Pratama",
    "email": "chelsea.pratama.24251130@siswa.belajar.id",
    "password": "$sapa$v1$57063cc8ad5c4594821381b5d33e53a07022258495e7937cd2d3ba44c584e862",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-31",
    "name": "Indra Wahyuni",
    "email": "indra.wahyuni.24251131@siswa.belajar.id",
    "password": "$sapa$v1$8797574fec644fe8186f9dc4a4cf3e4d6e43a4997c9cdc324fa1d8c0fbb23f2e",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-32",
    "name": "Nurul Haikal",
    "email": "nurul.haikal.24251132@siswa.belajar.id",
    "password": "$sapa$v1$83fed26079f96ccf0f35be83f41bbc7c8f6efb0396f3f546545d1889119c675b",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-33",
    "name": "Dwi Santoso",
    "email": "dwi.santoso.24251133@siswa.belajar.id",
    "password": "$sapa$v1$ed0e95ffd87fa245e557e5c9f6084dc0d7abd04aca21212fd91a87ff872d1b79",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-x-akl-1-34",
    "name": "Clarissa Sudrajat",
    "email": "clarissa.sudrajat.24251134@siswa.belajar.id",
    "password": "$sapa$v1$c1042279a9b20a7f39315d755aa8156ca5e82e605ba4eb19d57db2550d257d7d",
    "role": "siswa",
    "avatar": null,
    "phone": "0824110034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-01",
    "name": "Wahyu Wardhana",
    "email": "wahyu.wardhana.23240101@siswa.belajar.id",
    "password": "$sapa$v1$560d59bb022bdb33212b726bde650c50152b710aa74bab1b2172965f4b817964",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-02",
    "name": "Amanda Utomo",
    "email": "amanda.utomo.23240102@siswa.belajar.id",
    "password": "$sapa$v1$4037da52050878b02f8a31257e61beb1f944c617b0f04d4cd9ca77603e01d483",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-03",
    "name": "Fajar Kuswanto",
    "email": "fajar.kuswanto.23240103@siswa.belajar.id",
    "password": "$sapa$v1$d8558bd21a65a1b8e1446fa4a83a9bd1b0b18cf2788a32e11290b3ce962aa41f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-04",
    "name": "Marsha Kusuma",
    "email": "marsha.kusuma.23240104@siswa.belajar.id",
    "password": "$sapa$v1$2289b2ae6f121c66dbf319201057e05440570f2819511e15eb245605e31e39ca",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-05",
    "name": "Yoga Mahendra",
    "email": "yoga.mahendra.23240105@siswa.belajar.id",
    "password": "$sapa$v1$9388167c2ef7a5e53b4c5053a8426dc279bcc8af4c1384b12d663ab58e4c7641",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-06",
    "name": "Anisa Baskara",
    "email": "anisa.baskara.23240106@siswa.belajar.id",
    "password": "$sapa$v1$cc144cc37163bfcb192623b2f8a44bd8ce8f1522b3fd78322e143f6288fc9cad",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-07",
    "name": "Fathir Permatasari",
    "email": "fathir.permatasari.23240107@siswa.belajar.id",
    "password": "$sapa$v1$78c1546ea8e12c695d4bd2025c8f7d815833bc5845a03bcc92a17a526d949beb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-08",
    "name": "Nabila Maulana",
    "email": "nabila.maulana.23240108@siswa.belajar.id",
    "password": "$sapa$v1$e5472b1ec8f297a9bc969b579cea820b25f6e107481856f760cbf0cadbba7f92",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-09",
    "name": "Zack Setiawan",
    "email": "zack.setiawan.23240109@siswa.belajar.id",
    "password": "$sapa$v1$ca99294efa0b24534b9807a7d8c242e275fabb4b10fe07e9f2536d9f136350b3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-10",
    "name": "Aqila Suhendra",
    "email": "aqila.suhendra.23240110@siswa.belajar.id",
    "password": "$sapa$v1$a88ce82190ffee6036ad6b1f1fa9c894d3ae4dfd9764c228437c08d035fa3ea1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-11",
    "name": "Gilang Putra",
    "email": "gilang.putra.23240111@siswa.belajar.id",
    "password": "$sapa$v1$7eee96ae38910462293458c65790dbf3e6a177acb318ac699876872a1950e457",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-12",
    "name": "Nafisa Kurnia",
    "email": "nafisa.kurnia.23240112@siswa.belajar.id",
    "password": "$sapa$v1$46ce5f81b07687516d636a2f6fa09d8de779dae72e2c7d139eb8c5061f2e54fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-13",
    "name": "Zulfikar Pramudya",
    "email": "zulfikar.pramudya.23240113@siswa.belajar.id",
    "password": "$sapa$v1$ee17d9895d7ca0140fb2a4bf71d2f887363fcc452ad134b5b2041732778a940d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-14",
    "name": "Cantika Lestari",
    "email": "cantika.lestari.23240114@siswa.belajar.id",
    "password": "$sapa$v1$26cc0e0c6d3eb7b6c6b19eb02e0cce5997816570d795633af4f1fe8f8e245480",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-15",
    "name": "Ilham Syahputra",
    "email": "ilham.syahputra.23240115@siswa.belajar.id",
    "password": "$sapa$v1$47428c7db3a0e83b0fd3a7a8448e3ab3ce949e9e147d3d0a66150956ca92ec6e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-16",
    "name": "Novalita Wicaksono",
    "email": "novalita.wicaksono.23240116@siswa.belajar.id",
    "password": "$sapa$v1$965a26e94bbeda29977379984a1add88f391f79e0aed093e888b1da869d6850d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-17",
    "name": "Candra Purnomo",
    "email": "candra.purnomo.23240117@siswa.belajar.id",
    "password": "$sapa$v1$5cc1b58ce8d6ce134348211bcf272d8557ae1bd8815c16d08945729b4b828a1c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-18",
    "name": "Citra Saputra",
    "email": "citra.saputra.23240118@siswa.belajar.id",
    "password": "$sapa$v1$87e107b4648ec268073567080d9d621c5a17b7f20361c18e57fb33a6388f864f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-19",
    "name": "Irfan Safitri",
    "email": "irfan.safitri.23240119@siswa.belajar.id",
    "password": "$sapa$v1$cb4b4ec2a3200d69feb1d47770fb29cb527783626d852fe28b71a7ca1a796c8b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-20",
    "name": "Putri Mahardika",
    "email": "putri.mahardika.23240120@siswa.belajar.id",
    "password": "$sapa$v1$b843180404dbe6c6592240a52ef9062cc65ecf967618280282ed0d449b5538af",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-21",
    "name": "Ahmad Gunawan",
    "email": "ahmad.gunawan.23240121@siswa.belajar.id",
    "password": "$sapa$v1$cc5107c8e05274758d11f0566d3d19dfd489fe943fa68b69e9ed52b97e5100d4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-22",
    "name": "Delfina Sujatmiko",
    "email": "delfina.sujatmiko.23240122@siswa.belajar.id",
    "password": "$sapa$v1$ac36e39256e167587e70601cff933a6db8ab381fd146537dd8df65e0d8dc070d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-23",
    "name": "Lucky Nugroho",
    "email": "lucky.nugroho.23240123@siswa.belajar.id",
    "password": "$sapa$v1$a325da5f06c21368d84afc041cad0df0d76da167bdf25f47823a35b30997196b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-24",
    "name": "Rania Suryanto",
    "email": "rania.suryanto.23240124@siswa.belajar.id",
    "password": "$sapa$v1$5f83a8a3e172a0ad64ce8dbc7ebace37c877d1a134fc740b0aa8e58cfc19a4c1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-25",
    "name": "Aldiansyah Pratama",
    "email": "aldiansyah.pratama.23240125@siswa.belajar.id",
    "password": "$sapa$v1$1614d610376aff38cffa14c39f81a7b3f4673145c1f04c76d83aa70f6d447eb3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-26",
    "name": "Dian Wahyuni",
    "email": "dian.wahyuni.23240126@siswa.belajar.id",
    "password": "$sapa$v1$b196c952531929aa622b60ec4eaa925ea7da37c6d1439e6631139f01815e406b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-27",
    "name": "M. Fikri Haikal",
    "email": "m.fikri.haikal.23240127@siswa.belajar.id",
    "password": "$sapa$v1$9091641e713d561407c284b5c9bbfc44f6bd9304cd5db5adb649acf026cb709d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-28",
    "name": "Salsabila Santoso",
    "email": "salsabila.santoso.23240128@siswa.belajar.id",
    "password": "$sapa$v1$690c3f531aadffa3d187be599008635ff697e5e531dfb1137e12847c2f9c3361",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-29",
    "name": "Andika Sudrajat",
    "email": "andika.sudrajat.23240129@siswa.belajar.id",
    "password": "$sapa$v1$2b09e38ad49fd170ca0a12c1ef66b197f724c81bd94ba6f2fed3c58db4fca099",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-30",
    "name": "Elsa Wijaya",
    "email": "elsa.wijaya.23240130@siswa.belajar.id",
    "password": "$sapa$v1$c076ea1951ec8ed0cccc399e130cc417312224fda1691a558fe540ea49232886",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-31",
    "name": "Naufal Pangestu",
    "email": "naufal.pangestu.23240131@siswa.belajar.id",
    "password": "$sapa$v1$0317605e3376dbc1ef910f886764628df15c286b51258441fd672df2a7de7868",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-32",
    "name": "Siti Kuncoro",
    "email": "siti.kuncoro.23240132@siswa.belajar.id",
    "password": "$sapa$v1$9451fd25cd9f482c31743222c4643cd4e7679465ad9fa0c2fd9ec7335f850ce4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-33",
    "name": "Arya Rahmawati",
    "email": "arya.rahmawati.23240133@siswa.belajar.id",
    "password": "$sapa$v1$6b42e72660dd4ecb77ced5a78732b9d79a4e7ef25685300d4966b1b75b62a3c0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-1-34",
    "name": "Fitri Nugraha",
    "email": "fitri.nugraha.23240134@siswa.belajar.id",
    "password": "$sapa$v1$6fb923b4031c2e9c22910f0fa2db9439e7613bc8b4d694337830e7286826ee3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823120034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-01",
    "name": "Bintang Baskara",
    "email": "bintang.baskara.23240201@siswa.belajar.id",
    "password": "$sapa$v1$ce5a6a6654a2582f610ce252f0b7715f6ad7b8e352fcdbfe0146a1b1fbf7c735",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-02",
    "name": "Chelsea Permatasari",
    "email": "chelsea.permatasari.23240202@siswa.belajar.id",
    "password": "$sapa$v1$71a19addef929a81b51b86c935ccb7327f81d678670461d17f74afaadc269c4c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-03",
    "name": "Indra Maulana",
    "email": "indra.maulana.23240203@siswa.belajar.id",
    "password": "$sapa$v1$56020f5fcecdf65c1d569056565f89d91c7252203bc96e7d83f83b88294a07aa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-04",
    "name": "Nurul Setiawan",
    "email": "nurul.setiawan.23240204@siswa.belajar.id",
    "password": "$sapa$v1$c3b536284839ab1b4139fff9491e2a2d23133c4da1f4fd2a14c4faccdac36c1b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-05",
    "name": "Dwi Suhendra",
    "email": "dwi.suhendra.23240205@siswa.belajar.id",
    "password": "$sapa$v1$7088c7fa4cc30c3b76b4a912bc044b8387e2547955c5b23f3d7091245531988e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-06",
    "name": "Clarissa Putra",
    "email": "clarissa.putra.23240206@siswa.belajar.id",
    "password": "$sapa$v1$cc45dbbd8e2f4bc1875a404b409546afbb8267c9357c4b92cd993e912dbda7de",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-07",
    "name": "Kevin Kurnia",
    "email": "kevin.kurnia.23240207@siswa.belajar.id",
    "password": "$sapa$v1$4c32e3f233c1a0be66e62a2f8978f162eee85577abb9222c06b2163dc7a761cc",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-08",
    "name": "Raisa Pramudya",
    "email": "raisa.pramudya.23240208@siswa.belajar.id",
    "password": "$sapa$v1$ce836a8575aae7f09630a731d88731a6c5c606099b8c6eb22aa1988e4f8101ae",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-09",
    "name": "Aditya Lestari",
    "email": "aditya.lestari.23240209@siswa.belajar.id",
    "password": "$sapa$v1$385ba2b9e67ec77ec7e5e746990c6750cb37942aef228302755e2bef7773b915",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-10",
    "name": "Devi Syahputra",
    "email": "devi.syahputra.23240210@siswa.belajar.id",
    "password": "$sapa$v1$078cb3a12b7e04ff91096ea8fa53c9eb42f8e220aa3cf3e242fd9f11e4c723bb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-11",
    "name": "M. Rizky Wicaksono",
    "email": "m.rizky.wicaksono.23240211@siswa.belajar.id",
    "password": "$sapa$v1$2fd5cd9eab961c860c54a5781e931c8ce5912bb80c9601babeddf6e97840f068",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-12",
    "name": "Salma Purnomo",
    "email": "salma.purnomo.23240212@siswa.belajar.id",
    "password": "$sapa$v1$d5034cf47e5487620700407f7cc3c1ce66cf27343cc3243f100b25965f2e49f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-13",
    "name": "Alif Saputra",
    "email": "alif.saputra.23240213@siswa.belajar.id",
    "password": "$sapa$v1$87178377e3d43a6475faea5cf4d3f3a405acbaec356dcaf6fe7a9b291ecb5234",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-14",
    "name": "Dinda Safitri",
    "email": "dinda.safitri.23240214@siswa.belajar.id",
    "password": "$sapa$v1$ed32be44185d4885a86955e0b539cdd3a30820c619fd01715d29707e20bd1539",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-15",
    "name": "M. Zidan Mahardika",
    "email": "m.zidan.mahardika.23240215@siswa.belajar.id",
    "password": "$sapa$v1$013e56428b0c15d7cebf96e281317fe84be65bb287966809bbdbd3a90b9c8695",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-16",
    "name": "Shifa Gunawan",
    "email": "shifa.gunawan.23240216@siswa.belajar.id",
    "password": "$sapa$v1$83483c614bf0e2feb82c42ed6ff15f313ad801b98611b3dee33c87fca7374daa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-17",
    "name": "Ardi Sujatmiko",
    "email": "ardi.sujatmiko.23240217@siswa.belajar.id",
    "password": "$sapa$v1$211be457cbb200494d063da170134dd75566445be5931264350620f7297111a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-18",
    "name": "Febriana Nugroho",
    "email": "febriana.nugroho.23240218@siswa.belajar.id",
    "password": "$sapa$v1$18d1ebbd79ac773c2b81a06a055e61412226aae8c6c4cfc6ed9692c833eb1dac",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-19",
    "name": "Pratama Suryanto",
    "email": "pratama.suryanto.23240219@siswa.belajar.id",
    "password": "$sapa$v1$a08b382d4c08b2a8985e96277359b75a535d79a82fe3f77538dc8f39e018145a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-20",
    "name": "Syifa Pratama",
    "email": "syifa.pratama.23240220@siswa.belajar.id",
    "password": "$sapa$v1$ccbd59a7d278d8c6cdf6edbe854a6f839d668b05d54877d2efa083b6a1f4470d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-21",
    "name": "Bagas Wahyuni",
    "email": "bagas.wahyuni.23240221@siswa.belajar.id",
    "password": "$sapa$v1$6d9d4fed9464e3a51c72cf230e63ef722933d49852cc1071d556bda67e83130c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-22",
    "name": "Gita Haikal",
    "email": "gita.haikal.23240222@siswa.belajar.id",
    "password": "$sapa$v1$325ac7fa01ffabfc5acc451e9f7f245fe3aaa1506a0c89da5455a2767a86195c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-23",
    "name": "Rafi Santoso",
    "email": "rafi.santoso.23240223@siswa.belajar.id",
    "password": "$sapa$v1$0a92f7c33208793465cd3a8401a69ae3884c66190ce4fcfcb32e43d41b8fb771",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-24",
    "name": "Tiara Sudrajat",
    "email": "tiara.sudrajat.23240224@siswa.belajar.id",
    "password": "$sapa$v1$37db24143bb6b92281242075007b6aa437742f9b566e394608f1ffa894eb796b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-25",
    "name": "Bima Wijaya",
    "email": "bima.wijaya.23240225@siswa.belajar.id",
    "password": "$sapa$v1$392f138990fdbef19b618c2753a3721e347ce559039a6027ed49bae0d883c232",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-26",
    "name": "Indah Pangestu",
    "email": "indah.pangestu.23240226@siswa.belajar.id",
    "password": "$sapa$v1$202a307302a403335febdbc6435a3e2d4e3b124c1b2df7a22349f91c426c0a37",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-27",
    "name": "Rendi Kuncoro",
    "email": "rendi.kuncoro.23240227@siswa.belajar.id",
    "password": "$sapa$v1$caaa6eb787c6faa925046b505408d673f350166c3630291345a8c1124221fb62",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-28",
    "name": "Zahra Rahmawati",
    "email": "zahra.rahmawati.23240228@siswa.belajar.id",
    "password": "$sapa$v1$dd2d7303f43921a475ad777cee25272a93f5eb6f461c0dce53670a1fd890f36a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-29",
    "name": "Daffa Nugraha",
    "email": "daffa.nugraha.23240229@siswa.belajar.id",
    "password": "$sapa$v1$6483ebc222e19309f242b985153b75e64457801040ac0cb8ce233ac6076d4681",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-30",
    "name": "Jessica Hidayat",
    "email": "jessica.hidayat.23240230@siswa.belajar.id",
    "password": "$sapa$v1$26c1206aba5daa822b67a5ea64f38dd8f88f27746491a56ea2b7fc7a5683f5ad",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-31",
    "name": "Rian Wibowo",
    "email": "rian.wibowo.23240231@siswa.belajar.id",
    "password": "$sapa$v1$e7474926e441eb82bf4421a7ed66c18a04664cbf08512f42292be0b25db3c895",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-32",
    "name": "Adinda Ramadhan",
    "email": "adinda.ramadhan.23240232@siswa.belajar.id",
    "password": "$sapa$v1$64c722efd7fb23b65aefaee73cbb1926b1f2d6a79034d92d07d3d8f273a7bd57",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-33",
    "name": "Desta Firmansyah",
    "email": "desta.firmansyah.23240233@siswa.belajar.id",
    "password": "$sapa$v1$ad154d2851cb70dad0397b6528c11a5b88fa77c231e054419656f639dac53e4f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-2-34",
    "name": "Keisha Hakim",
    "email": "keisha.hakim.23240234@siswa.belajar.id",
    "password": "$sapa$v1$ebef9a9e6a0ab2969435155ce8257d2419c3ae85be062f328a0636a9af273960",
    "role": "siswa",
    "avatar": null,
    "phone": "0823130034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-01",
    "name": "Andika Putra",
    "email": "andika.putra.23240301@siswa.belajar.id",
    "password": "$sapa$v1$c1b82b1b82533c92b0b70ae3267eca2b0d471d3997c51d5bef733e655a0796dc",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-02",
    "name": "Elsa Kurnia",
    "email": "elsa.kurnia.23240302@siswa.belajar.id",
    "password": "$sapa$v1$fc6cefe13c40b1f0e1b2b590422843b549ef5d59fe1c99b9698f75998ebd7371",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-03",
    "name": "Naufal Pramudya",
    "email": "naufal.pramudya.23240303@siswa.belajar.id",
    "password": "$sapa$v1$b5b0859669563558e53510f6bb7ec1e0a113b68b90b3d9d15dc1da21c58b25c6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-04",
    "name": "Siti Lestari",
    "email": "siti.lestari.23240304@siswa.belajar.id",
    "password": "$sapa$v1$304f72f9458a833dbe96bdf4389fffd9a79f81edcc672916cb81ff1cd66be670",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-05",
    "name": "Arya Syahputra",
    "email": "arya.syahputra.23240305@siswa.belajar.id",
    "password": "$sapa$v1$bde6c43bdc3875676b2ad84486d62c79b7f7d047e65eecc840446809bd62f4f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-06",
    "name": "Fitri Wicaksono",
    "email": "fitri.wicaksono.23240306@siswa.belajar.id",
    "password": "$sapa$v1$931507316a282f1a93eab55ff0e74cc0480445c1928bcd2231fa9076b19b9d93",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-07",
    "name": "Raditya Purnomo",
    "email": "raditya.purnomo.23240307@siswa.belajar.id",
    "password": "$sapa$v1$df11d2f0a2f637ff6efd57d9147ea9c2e0fcd020b9478f990868dd2fec5e15fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-08",
    "name": "Tania Saputra",
    "email": "tania.saputra.23240308@siswa.belajar.id",
    "password": "$sapa$v1$7b47c447164b70f43745d8e1884856141a2b756563f0a86a488809dffe9e6632",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-09",
    "name": "Bayu Safitri",
    "email": "bayu.safitri.23240309@siswa.belajar.id",
    "password": "$sapa$v1$6cf9ca9ed17712ac498b3ce0cc0c6a6309ce77c4d7c727c9d968d3859ce1f37a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-10",
    "name": "Hana Mahardika",
    "email": "hana.mahardika.23240310@siswa.belajar.id",
    "password": "$sapa$v1$e65d462d0624711347b49bf619b3d4364ecbd9afcbd32a567fbe240f8bfc477c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-11",
    "name": "Rangga Gunawan",
    "email": "rangga.gunawan.23240311@siswa.belajar.id",
    "password": "$sapa$v1$3454f0d794f71b3eeb13656a82f4e1c36271d5827286312925628988618ea300",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-12",
    "name": "Vania Sujatmiko",
    "email": "vania.sujatmiko.23240312@siswa.belajar.id",
    "password": "$sapa$v1$e0c364b5929d8f43f1e5ff9d9a57512a4d7865d2b03f3e23dbe7fec0b40fc07f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-13",
    "name": "Danendra Nugroho",
    "email": "danendra.nugroho.23240313@siswa.belajar.id",
    "password": "$sapa$v1$44c22920ba2a7aa584bcd2b81a01b5b69fd531e84c91b1094498aef2d397aefb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-14",
    "name": "Intan Suryanto",
    "email": "intan.suryanto.23240314@siswa.belajar.id",
    "password": "$sapa$v1$f85515492ffa01fe1d56d279fa7654f85efd32c67f45705395145e265c6b6202",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-15",
    "name": "Revan Pratama",
    "email": "revan.pratama.23240315@siswa.belajar.id",
    "password": "$sapa$v1$26924e3a6009544320b0eba0c40e170a19a3dd9259c73e2b3cb72a04f1d61a80",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-16",
    "name": "Zaskia Wahyuni",
    "email": "zaskia.wahyuni.23240316@siswa.belajar.id",
    "password": "$sapa$v1$06cb747c1bcbd768c51e09f9c78070ae6f848e454d83cb45c6a7e92bcae7b535",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-17",
    "name": "Dennis Haikal",
    "email": "dennis.haikal.23240317@siswa.belajar.id",
    "password": "$sapa$v1$3e9b920678eb63b990c3dc94fc627a8a071bdd0615f8d2123e762bf642a9a4b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-18",
    "name": "Kayla Santoso",
    "email": "kayla.santoso.23240318@siswa.belajar.id",
    "password": "$sapa$v1$438d24a7d15e67dea55a477e087ae2b46849b3071b93954fb4254434a6fa08b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-19",
    "name": "Satria Sudrajat",
    "email": "satria.sudrajat.23240319@siswa.belajar.id",
    "password": "$sapa$v1$ffe020f81f9f272688e0b277611cba9e590dd43fd3f815a6b2dfb5d2c4b46ef1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-20",
    "name": "Aisyah Wijaya",
    "email": "aisyah.wijaya.23240320@siswa.belajar.id",
    "password": "$sapa$v1$08b59cc84e4470323b9470f9d61c0ef1018f4479cb59e69fa5ff296c1131fcde",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-21",
    "name": "Dimas Pangestu",
    "email": "dimas.pangestu.23240321@siswa.belajar.id",
    "password": "$sapa$v1$94f66169dd38d9e377e3b74ee95161f6f243de733da947a2b987f0cd9ff0abb6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-22",
    "name": "Laila Kuncoro",
    "email": "laila.kuncoro.23240322@siswa.belajar.id",
    "password": "$sapa$v1$def30bc654b97a382c322a7fe2fbfb50c9ad94d68689f25218189405e77699f8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-23",
    "name": "Wahyu Rahmawati",
    "email": "wahyu.rahmawati.23240323@siswa.belajar.id",
    "password": "$sapa$v1$03e360fc826bd021fddf8ffaae6ad369b31d11a20875b677d51d755e721d7940",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-24",
    "name": "Amanda Nugraha",
    "email": "amanda.nugraha.23240324@siswa.belajar.id",
    "password": "$sapa$v1$ae8a4868f6a1a1096284fdb18cc8df76f8fb19ce4f72167a7ff4f7e12a0fd429",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-25",
    "name": "Fajar Hidayat",
    "email": "fajar.hidayat.23240325@siswa.belajar.id",
    "password": "$sapa$v1$ec67f9a6a215fdd4487f0baa5d8f965f8dcdc952552b361977fd08a60dfbd7b1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-26",
    "name": "Marsha Wibowo",
    "email": "marsha.wibowo.23240326@siswa.belajar.id",
    "password": "$sapa$v1$3cafa72bec5e5d1685a222d3615585867c9589d9e6cf9ad40fad5c461be11825",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-27",
    "name": "Yoga Ramadhan",
    "email": "yoga.ramadhan.23240327@siswa.belajar.id",
    "password": "$sapa$v1$874213051a15f252da1a612c37833836a263602d8f06e44b614c2ddd458b05d0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-28",
    "name": "Anisa Firmansyah",
    "email": "anisa.firmansyah.23240328@siswa.belajar.id",
    "password": "$sapa$v1$36b0bc0cb76eec6a6f52b48e2df566339e78466595c32da71d5c4bdb541943ea",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-29",
    "name": "Fathir Hakim",
    "email": "fathir.hakim.23240329@siswa.belajar.id",
    "password": "$sapa$v1$fe95753d1d9d2972b612e3ddd1024ca54ef6ab789a38067d0b79cc42f08f2362",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-30",
    "name": "Nabila Anggraini",
    "email": "nabila.anggraini.23240330@siswa.belajar.id",
    "password": "$sapa$v1$ca99f45d6d2562d8f3a4f5f79f776c6e45c8b7bd8de2d2665dd7900c46046ad6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-31",
    "name": "Zack Wardhana",
    "email": "zack.wardhana.23240331@siswa.belajar.id",
    "password": "$sapa$v1$3bd563cd70427d629ef79533b05771cc80fbec9e8f6bd4fc59b8ce46bca28619",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-32",
    "name": "Aqila Utomo",
    "email": "aqila.utomo.23240332@siswa.belajar.id",
    "password": "$sapa$v1$68f6bb2b8377a72891255c037aecce9d89f1476f8c645da34cf2e39d7ecd448a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-33",
    "name": "Gilang Kuswanto",
    "email": "gilang.kuswanto.23240333@siswa.belajar.id",
    "password": "$sapa$v1$c6f401a2fb37f1172f4101ef2a1ea4eeb2187478d881e76d65913a4004156f32",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkj-3-34",
    "name": "Nafisa Kusuma",
    "email": "nafisa.kusuma.23240334@siswa.belajar.id",
    "password": "$sapa$v1$797fdf68872719e60062e3c73108ff852817bc01b0d67e1c9f498b9d67b54dc0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823140034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-01",
    "name": "Daffa Wicaksono",
    "email": "daffa.wicaksono.23240401@siswa.belajar.id",
    "password": "$sapa$v1$b08ad3af4060efdfb12f508994d505f7b26c55394e156518aadb80ee58d855b6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-02",
    "name": "Jessica Purnomo",
    "email": "jessica.purnomo.23240402@siswa.belajar.id",
    "password": "$sapa$v1$37469f24043ed96424ad4260668b9fce7be18a8b249c260cf9f85a37d36b6084",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-03",
    "name": "Rian Saputra",
    "email": "rian.saputra.23240403@siswa.belajar.id",
    "password": "$sapa$v1$14802e531b0c762dcfa9987166491e9963e0a093b8ad8c800638be1f6638c077",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-04",
    "name": "Adinda Safitri",
    "email": "adinda.safitri.23240404@siswa.belajar.id",
    "password": "$sapa$v1$9d861ab50294e3a0a793df8c3da2fb1c373c1cef3ebd9831816fb1a5e3899639",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-05",
    "name": "Desta Mahardika",
    "email": "desta.mahardika.23240405@siswa.belajar.id",
    "password": "$sapa$v1$c108c2796093b1e9c12ea0ff04f2b76b256c9961e025ea86d312c5131e1eb1e1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-06",
    "name": "Keisha Gunawan",
    "email": "keisha.gunawan.23240406@siswa.belajar.id",
    "password": "$sapa$v1$26e03aa91918aa9152e4f234ef2d3be6dee482b2117cd8fcf4086f193bc84cde",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-07",
    "name": "Tegar Sujatmiko",
    "email": "tegar.sujatmiko.23240407@siswa.belajar.id",
    "password": "$sapa$v1$dc7c020d609e1c5322f96fb2d48e07ec606d8b6c05db5be2422aae897fdbe224",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-08",
    "name": "Alifa Nugroho",
    "email": "alifa.nugroho.23240408@siswa.belajar.id",
    "password": "$sapa$v1$721cf6a2c48b8913ddf59d1d0406a11133f859e5e8a7c946da44e36dccb33648",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-09",
    "name": "Fadhil Suryanto",
    "email": "fadhil.suryanto.23240409@siswa.belajar.id",
    "password": "$sapa$v1$f3da618426ffb96d6f239ed250ef0d3235adea1298252ab3f672c3fb652e1b3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-10",
    "name": "Laras Pratama",
    "email": "laras.pratama.23240410@siswa.belajar.id",
    "password": "$sapa$v1$cc900ccf695ba977fff6e28ad0be08bebfd4154ee18c1d8b481c2f4a76d0d3b8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-11",
    "name": "Wawan Wahyuni",
    "email": "wawan.wahyuni.23240411@siswa.belajar.id",
    "password": "$sapa$v1$c9c1e33bd921e893b0aa0d7a435e7f83062af083d088f21aeda4e6f94fcc9f71",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-12",
    "name": "Anindya Haikal",
    "email": "anindya.haikal.23240412@siswa.belajar.id",
    "password": "$sapa$v1$c0c94561d235ed84994ef77da50b8b976a4cc0a6db53d04d9c41d44a55f231a3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-13",
    "name": "Farhan Santoso",
    "email": "farhan.santoso.23240413@siswa.belajar.id",
    "password": "$sapa$v1$d77f9b6896a795de27578a722f2d310f02bfeb0dba35781551a348783369ec96",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-14",
    "name": "Maulida Sudrajat",
    "email": "maulida.sudrajat.23240414@siswa.belajar.id",
    "password": "$sapa$v1$aa122150077070c39c62ab937ded17cd6b9475d814aec087b95484f3530a3666",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-15",
    "name": "Yusuf Wijaya",
    "email": "yusuf.wijaya.23240415@siswa.belajar.id",
    "password": "$sapa$v1$940e5f39ffb544c550de3c2a778c4b96bb9591e28740c000f76f42b94c8d5a47",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-16",
    "name": "Annisa Pangestu",
    "email": "annisa.pangestu.23240416@siswa.belajar.id",
    "password": "$sapa$v1$e4da1c22b8f0c6062561ca37b179654ea776801b06f37a965c374755d450d7e8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-17",
    "name": "Galih Kuncoro",
    "email": "galih.kuncoro.23240417@siswa.belajar.id",
    "password": "$sapa$v1$4a62e51fb0d778af878ec0a3773917ba364d1f10541044eeb5573770bf9829e1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-18",
    "name": "Nadira Rahmawati",
    "email": "nadira.rahmawati.23240418@siswa.belajar.id",
    "password": "$sapa$v1$d87998e66127a918dc6fffb67d13b856df4057bd48eba53412b1b7b4ccec247a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-19",
    "name": "Zidan Nugraha",
    "email": "zidan.nugraha.23240419@siswa.belajar.id",
    "password": "$sapa$v1$cc616a27579bbe1ec1d7f03b121587f81567786688f0b7d318c5318d0f5ceada",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-20",
    "name": "Aurelia Hidayat",
    "email": "aurelia.hidayat.23240420@siswa.belajar.id",
    "password": "$sapa$v1$6fad5dbc53ab2b9bd482d55d9af65c3d5b592fb2b9ec730dfc8ac301776e7767",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-21",
    "name": "Hafiz Wibowo",
    "email": "hafiz.wibowo.23240421@siswa.belajar.id",
    "password": "$sapa$v1$2f89715c2d902425cdd80bbbfe58796b93c024d7a43afd31dce455ce715cb1c1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-22",
    "name": "Nayra Ramadhan",
    "email": "nayra.ramadhan.23240422@siswa.belajar.id",
    "password": "$sapa$v1$46b8cb8606a225ed6203f8c30ee057278c38d5643692d20a33e1e2dde3426976",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-23",
    "name": "Bintang Firmansyah",
    "email": "bintang.firmansyah.23240423@siswa.belajar.id",
    "password": "$sapa$v1$9bb2d569887a2f95e74329e46ee1a175ebc2050ca17b1d8ed3d82f42ba91330d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-24",
    "name": "Chelsea Hakim",
    "email": "chelsea.hakim.23240424@siswa.belajar.id",
    "password": "$sapa$v1$f4da41d30b84f5bc5ad94eade32b43289196870b93042f95a75fe7f0353b314c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-25",
    "name": "Indra Anggraini",
    "email": "indra.anggraini.23240425@siswa.belajar.id",
    "password": "$sapa$v1$33326e8299552dc86df63ed3d55ecc7b1e3b14b527388f935d6461bc8b0e2b0f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-26",
    "name": "Nurul Wardhana",
    "email": "nurul.wardhana.23240426@siswa.belajar.id",
    "password": "$sapa$v1$3eca87b36a188d7a2457e99d9d67e91eb1c2fd6363f59c3a36ef37e62f67ecfb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-27",
    "name": "Dwi Utomo",
    "email": "dwi.utomo.23240427@siswa.belajar.id",
    "password": "$sapa$v1$06bfb3241e240c6c16e35d63b2d9f7ef32f6202f374aac6b3d607b5ebe684bc5",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-28",
    "name": "Clarissa Kuswanto",
    "email": "clarissa.kuswanto.23240428@siswa.belajar.id",
    "password": "$sapa$v1$b0246cccd79f936364bc64a1566849e0c6cbc3e284730019180ee44d64987ec2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-29",
    "name": "Kevin Kusuma",
    "email": "kevin.kusuma.23240429@siswa.belajar.id",
    "password": "$sapa$v1$c7685cd3d15287dfaea166dbb558ac27f0b10eaff258956972e6c02ffd07d6a8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-30",
    "name": "Raisa Mahendra",
    "email": "raisa.mahendra.23240430@siswa.belajar.id",
    "password": "$sapa$v1$761f54ad832612699b5a4232f07d15d1c5730cad72a27709f46839b757fd0c30",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-31",
    "name": "Aditya Baskara",
    "email": "aditya.baskara.23240431@siswa.belajar.id",
    "password": "$sapa$v1$34abd7a36a7a516536c3d867e5e9c3460d5a8f167d30238e8e3ae455be9178f9",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-32",
    "name": "Devi Permatasari",
    "email": "devi.permatasari.23240432@siswa.belajar.id",
    "password": "$sapa$v1$3672d81016280e34d0d24459ae918618ea97fd1484dd9aee895e061afe7f660a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-33",
    "name": "M. Rizky Maulana",
    "email": "m.rizky.maulana.23240433@siswa.belajar.id",
    "password": "$sapa$v1$2e349bf8b96d40665f2f22f82dc433ec4146bcb972781f1085408b324a0b50b5",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-1-34",
    "name": "Salma Setiawan",
    "email": "salma.setiawan.23240434@siswa.belajar.id",
    "password": "$sapa$v1$40805df5e6b97a66e5e74c0d1729f91c39978b89750791beaade6bdba7bcfe3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823150034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-01",
    "name": "Fathir Gunawan",
    "email": "fathir.gunawan.23240501@siswa.belajar.id",
    "password": "$sapa$v1$11d66122ac80c6159ff2e017a8c4c06abea64a2e255532f592c554b581afefd3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-02",
    "name": "Nabila Sujatmiko",
    "email": "nabila.sujatmiko.23240502@siswa.belajar.id",
    "password": "$sapa$v1$361847ff32e48ce9b14d801e20caadca0254f3b2b620284b4cfda6cde30d185a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-03",
    "name": "Zack Nugroho",
    "email": "zack.nugroho.23240503@siswa.belajar.id",
    "password": "$sapa$v1$6780ab322e6cbef2d61f80f3c6b9a333624080d1d055c284bfc5ac6d10e01e48",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-04",
    "name": "Aqila Suryanto",
    "email": "aqila.suryanto.23240504@siswa.belajar.id",
    "password": "$sapa$v1$88f2ceb86bbc89cf3e385a7dc7944975b4d95023ec4bed0919ebd8b4ab23e56e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-05",
    "name": "Gilang Pratama",
    "email": "gilang.pratama.23240505@siswa.belajar.id",
    "password": "$sapa$v1$9c0931631785a0425e52b41e133e4039de7e4ecb664061ad63384dfae9e71955",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-06",
    "name": "Nafisa Wahyuni",
    "email": "nafisa.wahyuni.23240506@siswa.belajar.id",
    "password": "$sapa$v1$975fe7522f9e7086067cc074a174255f04df945e01b26ea761b2e33e82c0d380",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-07",
    "name": "Zulfikar Haikal",
    "email": "zulfikar.haikal.23240507@siswa.belajar.id",
    "password": "$sapa$v1$31e4521aae55e93138a5cf596daee52b173705de93080eded2ee51246810f916",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-08",
    "name": "Cantika Santoso",
    "email": "cantika.santoso.23240508@siswa.belajar.id",
    "password": "$sapa$v1$bc775778f2ba89eac17a052f6c8e658603f21c41fbd912e984171f94ade18b72",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-09",
    "name": "Ilham Sudrajat",
    "email": "ilham.sudrajat.23240509@siswa.belajar.id",
    "password": "$sapa$v1$84b138ada2ba770cf94407b8a945d5a1629710b75171ebe82714be25771d0d33",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-10",
    "name": "Novalita Wijaya",
    "email": "novalita.wijaya.23240510@siswa.belajar.id",
    "password": "$sapa$v1$215d300c6f4a5767708e5a43a95c71138cf5a54fe7eb82d836e809665bd444f4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-11",
    "name": "Candra Pangestu",
    "email": "candra.pangestu.23240511@siswa.belajar.id",
    "password": "$sapa$v1$f9c87319cdd9641d74e52ea1ef352bfd28766aca19f043605a2440222980c14a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-12",
    "name": "Citra Kuncoro",
    "email": "citra.kuncoro.23240512@siswa.belajar.id",
    "password": "$sapa$v1$7fee41191289fc2ca9a5358dc083adce6b0570f64cc8d1ece7699b0ab112586f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-13",
    "name": "Irfan Rahmawati",
    "email": "irfan.rahmawati.23240513@siswa.belajar.id",
    "password": "$sapa$v1$d892b81a4e0a7b0093f51f6df43d356cb70bdd61f205b24183d02e006d21a5ec",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-14",
    "name": "Putri Nugraha",
    "email": "putri.nugraha.23240514@siswa.belajar.id",
    "password": "$sapa$v1$01d55069dcab759bdd703b11f5fac429dd8c44927df9d3a18ecaef3da2c85c04",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-15",
    "name": "Ahmad Hidayat",
    "email": "ahmad.hidayat.23240515@siswa.belajar.id",
    "password": "$sapa$v1$7083e2546cb974c41eb61f6d8873fb7653252086776b36dbd25ece1482a43f89",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-16",
    "name": "Delfina Wibowo",
    "email": "delfina.wibowo.23240516@siswa.belajar.id",
    "password": "$sapa$v1$0dd5c6ce98f042f9fee5fda8dee13d3429f209978c9f5706854ddbb30cf4ca6c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-17",
    "name": "Lucky Ramadhan",
    "email": "lucky.ramadhan.23240517@siswa.belajar.id",
    "password": "$sapa$v1$a6c656706196b0e50228973bc6d53d407d6c10bb2f679ccb96a27fd4622ae9ec",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-18",
    "name": "Rania Firmansyah",
    "email": "rania.firmansyah.23240518@siswa.belajar.id",
    "password": "$sapa$v1$456e8ddf3a785343aebf9a6c36615d0cd89d800ebe4edc3947299284232b193c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-19",
    "name": "Aldiansyah Hakim",
    "email": "aldiansyah.hakim.23240519@siswa.belajar.id",
    "password": "$sapa$v1$d6a18cd8290f1991b5e4dcf30de208adc0f4c1516e6e4ef6976648cb19c7e98b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-20",
    "name": "Dian Anggraini",
    "email": "dian.anggraini.23240520@siswa.belajar.id",
    "password": "$sapa$v1$7b7594c1b17d0f47d1dd809fbefed67eba4346e390d1103c3512c2a2a0c6d5fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-21",
    "name": "M. Fikri Wardhana",
    "email": "m.fikri.wardhana.23240521@siswa.belajar.id",
    "password": "$sapa$v1$cc4870a0da52dffc70fa3067de1587e0ddcf4c0467f6d6e9516c67ba263b389c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-22",
    "name": "Salsabila Utomo",
    "email": "salsabila.utomo.23240522@siswa.belajar.id",
    "password": "$sapa$v1$d4023302124f6e5b8a0bf9097f33b70fc038347b8facd48255f8cae058a8072b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-23",
    "name": "Andika Kuswanto",
    "email": "andika.kuswanto.23240523@siswa.belajar.id",
    "password": "$sapa$v1$28aebf8277cf465ebd8251b015a440bfb5a4b8570921ec3a01aef72be2b9dc5e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-24",
    "name": "Elsa Kusuma",
    "email": "elsa.kusuma.23240524@siswa.belajar.id",
    "password": "$sapa$v1$a132f543b6afe93e86b235a6a5726e19f270b31ee57ba8b71dd40208c1604a64",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-25",
    "name": "Naufal Mahendra",
    "email": "naufal.mahendra.23240525@siswa.belajar.id",
    "password": "$sapa$v1$b9f4fa27f83e281e7e17adac498bd06071f6dc57215ed4c0ae8866e72a92b509",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-26",
    "name": "Siti Baskara",
    "email": "siti.baskara.23240526@siswa.belajar.id",
    "password": "$sapa$v1$f0296a3f9101dda550f6eb25ec22da0748f84a610b1482f303f05bd74ea05a76",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-27",
    "name": "Arya Permatasari",
    "email": "arya.permatasari.23240527@siswa.belajar.id",
    "password": "$sapa$v1$ac716956eb5428a0ce9aacaf0f7c4e89a011f20bfa53f5d600aeb8bfa4b07c3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-28",
    "name": "Fitri Maulana",
    "email": "fitri.maulana.23240528@siswa.belajar.id",
    "password": "$sapa$v1$2368cd812063dbf5a0201fca45ab45747fb0ff00322e27772817d09bc5e9d1eb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-29",
    "name": "Raditya Setiawan",
    "email": "raditya.setiawan.23240529@siswa.belajar.id",
    "password": "$sapa$v1$44f2f2d141547861c1fce61a9f56dee1fd74e7d6670f199fdcf65ac1673e66a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-30",
    "name": "Tania Suhendra",
    "email": "tania.suhendra.23240530@siswa.belajar.id",
    "password": "$sapa$v1$8fe1e996e7c7c9a58f7aadf477615d40889219f93ce16528dcc537bd0f6d615e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-31",
    "name": "Bayu Putra",
    "email": "bayu.putra.23240531@siswa.belajar.id",
    "password": "$sapa$v1$87d2fed17da67e2e00c2cb36cd2245c39d2e080bc8e23a7dee2cc5be66440c55",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-32",
    "name": "Hana Kurnia",
    "email": "hana.kurnia.23240532@siswa.belajar.id",
    "password": "$sapa$v1$b198847732b3df4cb921dbbcbd03dc265b01dfe0a8a6ff969a7c67b90498b848",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-33",
    "name": "Rangga Pramudya",
    "email": "rangga.pramudya.23240533@siswa.belajar.id",
    "password": "$sapa$v1$3c9ae82f4fb853e13c2174fbebd5784babea621b0831be5fe2c2d62ef1eeb248",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-tkp-2-34",
    "name": "Vania Lestari",
    "email": "vania.lestari.23240534@siswa.belajar.id",
    "password": "$sapa$v1$2719fd72dfb6224a8665216dde66f4a3d36f491edd3bdbff3ae860aceb326c79",
    "role": "siswa",
    "avatar": null,
    "phone": "0823160034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-01",
    "name": "Kevin Wahyuni",
    "email": "kevin.wahyuni.23240601@siswa.belajar.id",
    "password": "$sapa$v1$7e1ad775f3c7383785b2789e1a6fb7b48ce379ac360a9c128f6f789e87434c0e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-02",
    "name": "Raisa Haikal",
    "email": "raisa.haikal.23240602@siswa.belajar.id",
    "password": "$sapa$v1$87f2facef5db795f9799867375b52317630f60970679157222f2221d052b1f32",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-03",
    "name": "Aditya Santoso",
    "email": "aditya.santoso.23240603@siswa.belajar.id",
    "password": "$sapa$v1$9043d6447292073258282ce14c12b6b2117ddd750200fa281a9e2456cbc2814d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-04",
    "name": "Devi Sudrajat",
    "email": "devi.sudrajat.23240604@siswa.belajar.id",
    "password": "$sapa$v1$6ebbaf9b20f283d03f625c1022d6eb44fbabad933b7195f3b45fd82b3d931ff6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-05",
    "name": "M. Rizky Wijaya",
    "email": "m.rizky.wijaya.23240605@siswa.belajar.id",
    "password": "$sapa$v1$9a15b8a4bb33cecfd8d1c878a1c55bc8b4040163e2cc22ffbd010b6fa70ca500",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-06",
    "name": "Salma Pangestu",
    "email": "salma.pangestu.23240606@siswa.belajar.id",
    "password": "$sapa$v1$51c45c02275111564ddc0c759b96eae2e1ec9d2dcfd3d89a42d5c774d6fd83f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-07",
    "name": "Alif Kuncoro",
    "email": "alif.kuncoro.23240607@siswa.belajar.id",
    "password": "$sapa$v1$1368ee03ef5384824417575d44b585645d06383666110cdcbbc18a4c6b7a5a47",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-08",
    "name": "Dinda Rahmawati",
    "email": "dinda.rahmawati.23240608@siswa.belajar.id",
    "password": "$sapa$v1$86ea87b4809c607e9efc7a0c581d7f1d3d339da8cd32d1212e45033aa45e100f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-09",
    "name": "M. Zidan Nugraha",
    "email": "m.zidan.nugraha.23240609@siswa.belajar.id",
    "password": "$sapa$v1$0ef5fbb58e91350188b870d644c441fc024f38c3097ad5e368a110a3b72d2096",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-10",
    "name": "Shifa Hidayat",
    "email": "shifa.hidayat.23240610@siswa.belajar.id",
    "password": "$sapa$v1$4babfe1493a82fc4fc8cfacb44e3827590e8c28df130adb999cb886ebb25dfed",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-11",
    "name": "Ardi Wibowo",
    "email": "ardi.wibowo.23240611@siswa.belajar.id",
    "password": "$sapa$v1$5fdd8aa56d691ad83435d21acfe317ed6bb0531e83952c52e0c0785d580efe45",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-12",
    "name": "Febriana Ramadhan",
    "email": "febriana.ramadhan.23240612@siswa.belajar.id",
    "password": "$sapa$v1$6f7c02ecf97e76bfbac472e0969ad5bb31fa35c8d4e4ad76dc2fcfa0c7f6f302",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-13",
    "name": "Pratama Firmansyah",
    "email": "pratama.firmansyah.23240613@siswa.belajar.id",
    "password": "$sapa$v1$010d9f6a5350a8a53939e5f80a86c86b8630e72e8f063962e0496ccbf962111c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-14",
    "name": "Syifa Hakim",
    "email": "syifa.hakim.23240614@siswa.belajar.id",
    "password": "$sapa$v1$fb4567abd5d1e9c8b5b3d75632254ec6ac7b27c3d222b0d664d47940a1cdec04",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-15",
    "name": "Bagas Anggraini",
    "email": "bagas.anggraini.23240615@siswa.belajar.id",
    "password": "$sapa$v1$865bd23bf80db80c8626d05872c1a22748f7f9d8b08d3df96803e62ed3f8fe4b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-16",
    "name": "Gita Wardhana",
    "email": "gita.wardhana.23240616@siswa.belajar.id",
    "password": "$sapa$v1$937c5ab020d90ecbfef788026566b0dc52c9fa144579bdcd3c27596289fbfd3c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-17",
    "name": "Rafi Utomo",
    "email": "rafi.utomo.23240617@siswa.belajar.id",
    "password": "$sapa$v1$545c71c68241463c1d293c9bf701d4fdc1524f3016f66957c9ee47b0fec19a4e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-18",
    "name": "Tiara Kuswanto",
    "email": "tiara.kuswanto.23240618@siswa.belajar.id",
    "password": "$sapa$v1$5c9ba6e492f138cadca5679a1d19c5af82a4a97e28acf7aa979a0b3b81a549b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-19",
    "name": "Bima Kusuma",
    "email": "bima.kusuma.23240619@siswa.belajar.id",
    "password": "$sapa$v1$3bb95f501939c6ef334244d4771e6c2c5d5fec55ac51c326a83ab9cf70a40a82",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-20",
    "name": "Indah Mahendra",
    "email": "indah.mahendra.23240620@siswa.belajar.id",
    "password": "$sapa$v1$28812e7e8eda5d0fad98936e2b9abc83729b6bde43fec1b3f346447cd88c3593",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-21",
    "name": "Rendi Baskara",
    "email": "rendi.baskara.23240621@siswa.belajar.id",
    "password": "$sapa$v1$34ee0a5703bb1e325102d8fcddc58516781c55be4216dccb11a2cc3e8aecbb97",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-22",
    "name": "Zahra Permatasari",
    "email": "zahra.permatasari.23240622@siswa.belajar.id",
    "password": "$sapa$v1$3f891d5222ed7c4aa23cfd655a73b1e449c91bff2c75a14ca99a17bb7383c148",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-23",
    "name": "Daffa Maulana",
    "email": "daffa.maulana.23240623@siswa.belajar.id",
    "password": "$sapa$v1$34f1cb7627f0c8261faf0926be83d46f5303bdf5ced3178fb35bc300c2c08c80",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-24",
    "name": "Jessica Setiawan",
    "email": "jessica.setiawan.23240624@siswa.belajar.id",
    "password": "$sapa$v1$2576dda82d4dafd5c81b69f78f482cbf906faa8791b1fbd3b747a3c856d0521e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-25",
    "name": "Rian Suhendra",
    "email": "rian.suhendra.23240625@siswa.belajar.id",
    "password": "$sapa$v1$e914e27b256f95156ea5d655b7c6d937091bbcfb512eeb6a47c7b0695fe4d96b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-26",
    "name": "Adinda Putra",
    "email": "adinda.putra.23240626@siswa.belajar.id",
    "password": "$sapa$v1$f2c7055bf32488630d1dddd33d20220e3c80f8561ad26898e30976ccd71ebe8f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-27",
    "name": "Desta Kurnia",
    "email": "desta.kurnia.23240627@siswa.belajar.id",
    "password": "$sapa$v1$8d94aa242f45864dd961d376eba6f029fa4e016728c2b9fd35db68671da66b58",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-28",
    "name": "Keisha Pramudya",
    "email": "keisha.pramudya.23240628@siswa.belajar.id",
    "password": "$sapa$v1$de6188f8f0776f9a66ffdf7bd51ca2765aae83171d838bb75f7f2401896da9a6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-29",
    "name": "Tegar Lestari",
    "email": "tegar.lestari.23240629@siswa.belajar.id",
    "password": "$sapa$v1$4c3ad35566072d5f4d83981e6c466372f987924c1632d0dcfb7be1b4db61c125",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-30",
    "name": "Alifa Syahputra",
    "email": "alifa.syahputra.23240630@siswa.belajar.id",
    "password": "$sapa$v1$9cf14741619cc7efc88ac528b418897820da59c03363f651fa7de8d832c4a759",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-31",
    "name": "Fadhil Wicaksono",
    "email": "fadhil.wicaksono.23240631@siswa.belajar.id",
    "password": "$sapa$v1$1dfae3c7813f7937ce57e8c2d03c014c47ddd5ea9b4c5ce873281e37e1ae12b0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-32",
    "name": "Laras Purnomo",
    "email": "laras.purnomo.23240632@siswa.belajar.id",
    "password": "$sapa$v1$ab8e102227deb8abe5ec7160df5b0d26602348cef0e8de48b351b028198f10e4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-33",
    "name": "Wawan Saputra",
    "email": "wawan.saputra.23240633@siswa.belajar.id",
    "password": "$sapa$v1$62f51ec3a7abbab03e55e695c1dea299f29677682cda099831d11f26ca57da11",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-1-34",
    "name": "Anindya Safitri",
    "email": "anindya.safitri.23240634@siswa.belajar.id",
    "password": "$sapa$v1$3832538da3ad489720aa4372e1507a1f725431ff60837eb054cec0604d8aec52",
    "role": "siswa",
    "avatar": null,
    "phone": "0823170034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-01",
    "name": "Raditya Pangestu",
    "email": "raditya.pangestu.23240701@siswa.belajar.id",
    "password": "$sapa$v1$f01b78175832128074aa472dc9847f59416a51244f8b37a860108b6d223ef305",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-02",
    "name": "Tania Kuncoro",
    "email": "tania.kuncoro.23240702@siswa.belajar.id",
    "password": "$sapa$v1$c5f2e5f24615adcd8c521bfc9d1bd74ebf64cd3d3958d1744463a4368bb38228",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-03",
    "name": "Bayu Rahmawati",
    "email": "bayu.rahmawati.23240703@siswa.belajar.id",
    "password": "$sapa$v1$417e7aad6ea2827dd82c7da457cdb0615317f18ac5a3be39bd4bc57231b71ada",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-04",
    "name": "Hana Nugraha",
    "email": "hana.nugraha.23240704@siswa.belajar.id",
    "password": "$sapa$v1$2f9afdf07d0a7d16642e6cd62b79ca0337fcfa4af94ae7d24fe093caada7eeb4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-05",
    "name": "Rangga Hidayat",
    "email": "rangga.hidayat.23240705@siswa.belajar.id",
    "password": "$sapa$v1$c7319b84d4478a0c7679bcddbd3bfb01d8a9ececad51ea274fb9e545224ff617",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-06",
    "name": "Vania Wibowo",
    "email": "vania.wibowo.23240706@siswa.belajar.id",
    "password": "$sapa$v1$940c52e73573e0ccfe842abe7bc3907a3f2e61cc255a74d1c4dc7db1d1465992",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-07",
    "name": "Danendra Ramadhan",
    "email": "danendra.ramadhan.23240707@siswa.belajar.id",
    "password": "$sapa$v1$6cda12a71463f3133c0e988fd5cef071be7971a0078f3ddcbcc86f3b42788266",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-08",
    "name": "Intan Firmansyah",
    "email": "intan.firmansyah.23240708@siswa.belajar.id",
    "password": "$sapa$v1$1da35a3d21df5c797a9216143896cb91bb84f9a6301f840a5ace5e92d85aedba",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-09",
    "name": "Revan Hakim",
    "email": "revan.hakim.23240709@siswa.belajar.id",
    "password": "$sapa$v1$9c9d48e1e83d18a4c14c851eb2075de72af8883aa06fdbefa541945e40a3fad0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-10",
    "name": "Zaskia Anggraini",
    "email": "zaskia.anggraini.23240710@siswa.belajar.id",
    "password": "$sapa$v1$edd057259710bec434c139493ddfd18f4a245f083d0f75c7010da45c60daadf0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-11",
    "name": "Dennis Wardhana",
    "email": "dennis.wardhana.23240711@siswa.belajar.id",
    "password": "$sapa$v1$0ba470e756422d31702461460e445fe96b1a95063d1b25feb821f15f4b69e043",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-12",
    "name": "Kayla Utomo",
    "email": "kayla.utomo.23240712@siswa.belajar.id",
    "password": "$sapa$v1$69273c70853f97591e89f77c73ade224d8f8cf55717f44c598f7bf5b3570477d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-13",
    "name": "Satria Kuswanto",
    "email": "satria.kuswanto.23240713@siswa.belajar.id",
    "password": "$sapa$v1$c7aa7d7ee6d6eb9b65e640505d510e34d29438c1995dc5295b4e629e077e75f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-14",
    "name": "Aisyah Kusuma",
    "email": "aisyah.kusuma.23240714@siswa.belajar.id",
    "password": "$sapa$v1$b805fc9811d7c7a36eedfdee54e095a69ea9e5df78397365c3feabcf6f960f57",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-15",
    "name": "Dimas Mahendra",
    "email": "dimas.mahendra.23240715@siswa.belajar.id",
    "password": "$sapa$v1$5780c08dd69613cc0393144a039f3fd586c6e7044b0c7a32dccbc34489600923",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-16",
    "name": "Laila Baskara",
    "email": "laila.baskara.23240716@siswa.belajar.id",
    "password": "$sapa$v1$f555654a4ff572486261129978632c8e7f891fd9bbe48b96a7784c95410e3459",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-17",
    "name": "Wahyu Permatasari",
    "email": "wahyu.permatasari.23240717@siswa.belajar.id",
    "password": "$sapa$v1$fd96485a98571e0343b92b79f8e280237e82359969f7b32c16d756ed58acd632",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-18",
    "name": "Amanda Maulana",
    "email": "amanda.maulana.23240718@siswa.belajar.id",
    "password": "$sapa$v1$46cdb635d385da35d2fd42e761709e9bf5595ec345890bc906c0632759a19b46",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-19",
    "name": "Fajar Setiawan",
    "email": "fajar.setiawan.23240719@siswa.belajar.id",
    "password": "$sapa$v1$5615ab16bb0b5d16ca5fd60d681107975b7658ed25837940cb07bbe46f5dee33",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-20",
    "name": "Marsha Suhendra",
    "email": "marsha.suhendra.23240720@siswa.belajar.id",
    "password": "$sapa$v1$661b587677effb0fe8f772683af6201e4fb92352df60ec1cb46b569a63d0d8d2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-21",
    "name": "Yoga Putra",
    "email": "yoga.putra.23240721@siswa.belajar.id",
    "password": "$sapa$v1$c8547a323aa0e792bdbcfa1b7b0d4679956318f62b97d0cc6a926076ab21ab62",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-22",
    "name": "Anisa Kurnia",
    "email": "anisa.kurnia.23240722@siswa.belajar.id",
    "password": "$sapa$v1$589107117fdc87ce6afbaff456636f677b9e8a6bb4922064a2c1578f7dfb36a9",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-23",
    "name": "Fathir Pramudya",
    "email": "fathir.pramudya.23240723@siswa.belajar.id",
    "password": "$sapa$v1$a30d8c7d0a38dea462bf733434e7aefbcc1e0c2a2aa73dd28137f95c21b59dbc",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-24",
    "name": "Nabila Lestari",
    "email": "nabila.lestari.23240724@siswa.belajar.id",
    "password": "$sapa$v1$c54f0e3ba5d0cfd54d012cba5d061e7e9a8ba6caed1e17c00e39784c9940ee52",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-25",
    "name": "Zack Syahputra",
    "email": "zack.syahputra.23240725@siswa.belajar.id",
    "password": "$sapa$v1$c5f7ac86178f8bc14eb02cea4aed050646d38ec9c4df2b62aca6340a1e695ed1",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-26",
    "name": "Aqila Wicaksono",
    "email": "aqila.wicaksono.23240726@siswa.belajar.id",
    "password": "$sapa$v1$7eba646b5deea1d72a6a769ead4e9a5b4c72128632ceb17c5dc7af7c30a78527",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-27",
    "name": "Gilang Purnomo",
    "email": "gilang.purnomo.23240727@siswa.belajar.id",
    "password": "$sapa$v1$03b98c96325b9128c86699344832db0f701b9ae222ca4935aa35bdfae5d2a17a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-28",
    "name": "Nafisa Saputra",
    "email": "nafisa.saputra.23240728@siswa.belajar.id",
    "password": "$sapa$v1$4324abeca3140a45001b2a775b83888e9edf03b1a6418ea450eef0d2f9a7d48b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-29",
    "name": "Zulfikar Safitri",
    "email": "zulfikar.safitri.23240729@siswa.belajar.id",
    "password": "$sapa$v1$a2b941b3d8ca2c2e78e34ae835497edba4a636ed6c2ea0c2261a8675fe113f3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-30",
    "name": "Cantika Mahardika",
    "email": "cantika.mahardika.23240730@siswa.belajar.id",
    "password": "$sapa$v1$66c71c1a4d15cfbe02f383a7441cd83d0fd7bb6b5242b29cdc30ce8239a6c6c3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-31",
    "name": "Ilham Gunawan",
    "email": "ilham.gunawan.23240731@siswa.belajar.id",
    "password": "$sapa$v1$d2f9a29fc302ff75edc0b27b62a3f7f8594a710e20bad04b352bdf53b9730722",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-32",
    "name": "Novalita Sujatmiko",
    "email": "novalita.sujatmiko.23240732@siswa.belajar.id",
    "password": "$sapa$v1$640c7df980fd7fc37352fdedb26900ba3aee74ee596a8565b13486ffc208a02b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-33",
    "name": "Candra Nugroho",
    "email": "candra.nugroho.23240733@siswa.belajar.id",
    "password": "$sapa$v1$698a2f626c5ae16a671ba036b6d38858011bef25496bae73e8f4525d1438f048",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-2-34",
    "name": "Citra Suryanto",
    "email": "citra.suryanto.23240734@siswa.belajar.id",
    "password": "$sapa$v1$02830f5e4eeefb60df49384ed6e81c7af43f08ed04951019e0904fd83c01dbdc",
    "role": "siswa",
    "avatar": null,
    "phone": "0823180034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-01",
    "name": "Tegar Wibowo",
    "email": "tegar.wibowo.23240801@siswa.belajar.id",
    "password": "$sapa$v1$1ba33d5539659c5311642dc2b8154dd8b747b9bdc3d2be18b773cb8d4c534c06",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-02",
    "name": "Alifa Ramadhan",
    "email": "alifa.ramadhan.23240802@siswa.belajar.id",
    "password": "$sapa$v1$5595431c60864257264f7c5264cb7b82569cb33822a149d817c014fff2283e92",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-03",
    "name": "Fadhil Firmansyah",
    "email": "fadhil.firmansyah.23240803@siswa.belajar.id",
    "password": "$sapa$v1$2e0276f4a12ac29a6da50c5083fbcac1d373c5dd81b0997bf0e68d0ce9e8dbb8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-04",
    "name": "Laras Hakim",
    "email": "laras.hakim.23240804@siswa.belajar.id",
    "password": "$sapa$v1$0f7f7c296fc10800d403ca9f07a9c11b65d6e438b3c2a84aad379c5b0078fb4e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-05",
    "name": "Wawan Anggraini",
    "email": "wawan.anggraini.23240805@siswa.belajar.id",
    "password": "$sapa$v1$901f025483d9a19827c93ea10925ce9c173ec82bbc3783fafa603bf8c17c9bed",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-06",
    "name": "Anindya Wardhana",
    "email": "anindya.wardhana.23240806@siswa.belajar.id",
    "password": "$sapa$v1$c72b1c6d4d9ea4d1c375720a0287914b9de6bf58261284da1603680ac2cf45cc",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-07",
    "name": "Farhan Utomo",
    "email": "farhan.utomo.23240807@siswa.belajar.id",
    "password": "$sapa$v1$ac7730df066cf7809c37c3b4ecedd7af21565ed071456ef5b00f1f1d1ee1b268",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-08",
    "name": "Maulida Kuswanto",
    "email": "maulida.kuswanto.23240808@siswa.belajar.id",
    "password": "$sapa$v1$7198716007fd4fe0de9e77d2b7c1b7356ad50e54f31fafc7321d0b0ecef121ab",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-09",
    "name": "Yusuf Kusuma",
    "email": "yusuf.kusuma.23240809@siswa.belajar.id",
    "password": "$sapa$v1$a116147abe0c7e5cbcd593353da1829527cf2e70eed75bfc7c4744570b767b3b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-10",
    "name": "Annisa Mahendra",
    "email": "annisa.mahendra.23240810@siswa.belajar.id",
    "password": "$sapa$v1$a85a68d919a2a758fdba590bbfb700fff227b1b9511e82e3bd84580bb603b443",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-11",
    "name": "Galih Baskara",
    "email": "galih.baskara.23240811@siswa.belajar.id",
    "password": "$sapa$v1$71d673876a8278af5848790bc27292fb673284d07ff5ff45586ee69a1eb3c369",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-12",
    "name": "Nadira Permatasari",
    "email": "nadira.permatasari.23240812@siswa.belajar.id",
    "password": "$sapa$v1$7562af8e1079d682f536dca79dc08dd74992f2d0015a2dfdcb4e2f8eeabf4c1f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-13",
    "name": "Zidan Maulana",
    "email": "zidan.maulana.23240813@siswa.belajar.id",
    "password": "$sapa$v1$fb010197a234afb19ee429e5883ead50e281af70a39f78d638e47060765f6bd7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-14",
    "name": "Aurelia Setiawan",
    "email": "aurelia.setiawan.23240814@siswa.belajar.id",
    "password": "$sapa$v1$6b581af560cfcdae723edc90613436097657a88d816a3e4a88786a76ef929cb3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-15",
    "name": "Hafiz Suhendra",
    "email": "hafiz.suhendra.23240815@siswa.belajar.id",
    "password": "$sapa$v1$5f482c6dba76795624bdb4bd23d3f9ab03b0ff070099243ea7748201bd953856",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-16",
    "name": "Nayra Putra",
    "email": "nayra.putra.23240816@siswa.belajar.id",
    "password": "$sapa$v1$445d4013aee2cca2f928801c97a127b0076bad5381fc7af25fc120f81428cf00",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-17",
    "name": "Bintang Kurnia",
    "email": "bintang.kurnia.23240817@siswa.belajar.id",
    "password": "$sapa$v1$c2fb8946c1f32dd32d218d866671f4c1b7d6ac455e20e99407825335829edd2d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-18",
    "name": "Chelsea Pramudya",
    "email": "chelsea.pramudya.23240818@siswa.belajar.id",
    "password": "$sapa$v1$62d0ed94ff0f005fbff2281be2c80881e7fbe6b080f051603daba9240f9baf9d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-19",
    "name": "Indra Lestari",
    "email": "indra.lestari.23240819@siswa.belajar.id",
    "password": "$sapa$v1$7cd6cb45af39ed58d59f1b588ca4170f7a15eabda6bb25db929e37b0a347ce61",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-20",
    "name": "Nurul Syahputra",
    "email": "nurul.syahputra.23240820@siswa.belajar.id",
    "password": "$sapa$v1$4d4001a46cf6093af413b99d1622bbc4d59d0a563a25cd8707d55bc8eb1d12cb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-21",
    "name": "Dwi Wicaksono",
    "email": "dwi.wicaksono.23240821@siswa.belajar.id",
    "password": "$sapa$v1$894b5bbb05264be056870389769b792f7e3b53d3ae6f7362eedc1bb2be178274",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-22",
    "name": "Clarissa Purnomo",
    "email": "clarissa.purnomo.23240822@siswa.belajar.id",
    "password": "$sapa$v1$d16aaa319a26b2b7b47b468cbff38331ab78d2648abed738eb12b1a078157568",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-23",
    "name": "Kevin Saputra",
    "email": "kevin.saputra.23240823@siswa.belajar.id",
    "password": "$sapa$v1$0e2cbfc85bec93212a422d8c8e5a20a5d4dc573963fbcda311a8da7136944d2c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-24",
    "name": "Raisa Safitri",
    "email": "raisa.safitri.23240824@siswa.belajar.id",
    "password": "$sapa$v1$d6d92306fddac2cd4bc83f5ee809e56848fff13af8f3cc685162dc2475ba00b3",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-25",
    "name": "Aditya Mahardika",
    "email": "aditya.mahardika.23240825@siswa.belajar.id",
    "password": "$sapa$v1$8c4100c43a01b4f367ee123b7b6382195a9fcd04880761ea60e77c5ad5791d93",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-26",
    "name": "Devi Gunawan",
    "email": "devi.gunawan.23240826@siswa.belajar.id",
    "password": "$sapa$v1$a79dcba2ca6e5e181fc165b6bb02219b6168b94eaf14d8c05ff47664cc7eda51",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-27",
    "name": "M. Rizky Sujatmiko",
    "email": "m.rizky.sujatmiko.23240827@siswa.belajar.id",
    "password": "$sapa$v1$816c3167998bb5e05f0250e37980a2a067574f45705ee8b8f7a67a11ffc4411a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-28",
    "name": "Salma Nugroho",
    "email": "salma.nugroho.23240828@siswa.belajar.id",
    "password": "$sapa$v1$b8fd12e6c2ee644f92d510673011caa05bac05580e34e548b6b832ebd29b7d8d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-29",
    "name": "Alif Suryanto",
    "email": "alif.suryanto.23240829@siswa.belajar.id",
    "password": "$sapa$v1$3adc26cd1dbe4f40b1b225aa5a98295c255d2b1d163786d885b05ba3b5bb1330",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-30",
    "name": "Dinda Pratama",
    "email": "dinda.pratama.23240830@siswa.belajar.id",
    "password": "$sapa$v1$b2b9253e7f4c89a13d59a099e86125fd2e8f3ca7464f142dba4b944868c65044",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-31",
    "name": "M. Zidan Wahyuni",
    "email": "m.zidan.wahyuni.23240831@siswa.belajar.id",
    "password": "$sapa$v1$a3ff17d3155b5dcd70116e4123295abeb23615aa87bf265ab85ddca260d96741",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-32",
    "name": "Shifa Haikal",
    "email": "shifa.haikal.23240832@siswa.belajar.id",
    "password": "$sapa$v1$93b3c678f116173cc15036dd9dfcfb1a2fa59b5d5a8e106f7e2e601645cbda82",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-33",
    "name": "Ardi Santoso",
    "email": "ardi.santoso.23240833@siswa.belajar.id",
    "password": "$sapa$v1$1861cc90ce45792ecef5d300ee662c2a636a12c6c76e296245a62e62c84dc6a6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-to-3-34",
    "name": "Febriana Sudrajat",
    "email": "febriana.sudrajat.23240834@siswa.belajar.id",
    "password": "$sapa$v1$690194d1e5adad62ee79aa97f2b739bae2c63aa0ee6163235be46470d6fec03a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823190034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-01",
    "name": "Zulfikar Wardhana",
    "email": "zulfikar.wardhana.23240901@siswa.belajar.id",
    "password": "$sapa$v1$f029bc07f24ff7ba67a896599264b1785cab5d5b99a878c57a5fb3daa79e9e06",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-02",
    "name": "Cantika Utomo",
    "email": "cantika.utomo.23240902@siswa.belajar.id",
    "password": "$sapa$v1$bf74d0139e228c81c398e58ff98eb2f63c909550fbc3438a9c6c256631abc3eb",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-03",
    "name": "Ilham Kuswanto",
    "email": "ilham.kuswanto.23240903@siswa.belajar.id",
    "password": "$sapa$v1$bf3cce275704588c5d896decfbea355a36ab1d444f29ee6d71cda823e18a7213",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-04",
    "name": "Novalita Kusuma",
    "email": "novalita.kusuma.23240904@siswa.belajar.id",
    "password": "$sapa$v1$40656d669275619dbcf41d4ccfc0cc33310f7dc3affff8dc57f5ab79fdd7a5b2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-05",
    "name": "Candra Mahendra",
    "email": "candra.mahendra.23240905@siswa.belajar.id",
    "password": "$sapa$v1$816f16ef1fd8537ec70925d2173a94a6736ed38e0bf75f2055e4ff75737b340d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-06",
    "name": "Citra Baskara",
    "email": "citra.baskara.23240906@siswa.belajar.id",
    "password": "$sapa$v1$23674e2d8c87ef974ec262fdb1002bc88f3cca793aacfb004a1770f41cb444a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-07",
    "name": "Irfan Permatasari",
    "email": "irfan.permatasari.23240907@siswa.belajar.id",
    "password": "$sapa$v1$2af6838b9813fcd35d3cf3559667c9afe0944d3143494158a94dd10c0ed7ca0d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-08",
    "name": "Putri Maulana",
    "email": "putri.maulana.23240908@siswa.belajar.id",
    "password": "$sapa$v1$54491a655a6e1ce137b0242bc1d0522f02e45eddd5cb61a28b011a121caa3adf",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-09",
    "name": "Ahmad Setiawan",
    "email": "ahmad.setiawan.23240909@siswa.belajar.id",
    "password": "$sapa$v1$94dd2cffc64609575aebe77e0bb428869e93cedb18b190369934a10eca076c0d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-10",
    "name": "Delfina Suhendra",
    "email": "delfina.suhendra.23240910@siswa.belajar.id",
    "password": "$sapa$v1$ddb869518d19dc859ccb349914447cf4422414a35660bb5dce912b99dd549767",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-11",
    "name": "Lucky Putra",
    "email": "lucky.putra.23240911@siswa.belajar.id",
    "password": "$sapa$v1$dc7dc4710ae3986d93ae0236150979173777c9b3ada6eb55d396148a03132e77",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-12",
    "name": "Rania Kurnia",
    "email": "rania.kurnia.23240912@siswa.belajar.id",
    "password": "$sapa$v1$91dc3670d8cfd77e5c393c6a59db21c40482f3fb46c72235f4953bf68f3e900c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-13",
    "name": "Aldiansyah Pramudya",
    "email": "aldiansyah.pramudya.23240913@siswa.belajar.id",
    "password": "$sapa$v1$a0e39ffa94caadab6d858977064dc467562bff52698420cd01ed70409c2c9625",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-14",
    "name": "Dian Lestari",
    "email": "dian.lestari.23240914@siswa.belajar.id",
    "password": "$sapa$v1$22757206d08d598ae79083547ebb31d315cda686a831d50660199d0e855786fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-15",
    "name": "M. Fikri Syahputra",
    "email": "m.fikri.syahputra.23240915@siswa.belajar.id",
    "password": "$sapa$v1$7b0b8220bfe491a757fb24fae47e07c84dc3af9d051ca8aebb7011d387d6b590",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-16",
    "name": "Salsabila Wicaksono",
    "email": "salsabila.wicaksono.23240916@siswa.belajar.id",
    "password": "$sapa$v1$ab066812e3b16a389e4053a0ff919a23bc031840c45768d910a165d9a3f2f6b4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-17",
    "name": "Andika Purnomo",
    "email": "andika.purnomo.23240917@siswa.belajar.id",
    "password": "$sapa$v1$4c31501acb8ceadf3c1981626361addaa6e826c5713d6751ca0146bd0207ddc6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-18",
    "name": "Elsa Saputra",
    "email": "elsa.saputra.23240918@siswa.belajar.id",
    "password": "$sapa$v1$3252454f03638f1b4b794d5433742b4f5346dba176bdae0e11244b043b704ebf",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-19",
    "name": "Naufal Safitri",
    "email": "naufal.safitri.23240919@siswa.belajar.id",
    "password": "$sapa$v1$97bd6fe86f1617da3ced72255b4922b85e313bd0b3d808b8ece94814f1c4794c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-20",
    "name": "Siti Mahardika",
    "email": "siti.mahardika.23240920@siswa.belajar.id",
    "password": "$sapa$v1$6c73289106fa3cb7021033cfec568aca9648536f61f7d682a98147a305959db5",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-21",
    "name": "Arya Gunawan",
    "email": "arya.gunawan.23240921@siswa.belajar.id",
    "password": "$sapa$v1$5a24ddf7c7d4eeb14be9294efc90d66820c356f316b3a51e12072bd5b636fbed",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-22",
    "name": "Fitri Sujatmiko",
    "email": "fitri.sujatmiko.23240922@siswa.belajar.id",
    "password": "$sapa$v1$0f23eda9d1c68a3c6418d799af351a8aa6aa5c86bf7b3cfd5fcdb8e593c9c714",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-23",
    "name": "Raditya Nugroho",
    "email": "raditya.nugroho.23240923@siswa.belajar.id",
    "password": "$sapa$v1$2a108d941bc0115cc9156d17a7ec4f5f1242a6068b75ac281aacaffc84f0ab3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-24",
    "name": "Tania Suryanto",
    "email": "tania.suryanto.23240924@siswa.belajar.id",
    "password": "$sapa$v1$d90ba908168a1d3efc47be5cfca88ca971f37a8ad40f4b153784dbdb584793da",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-25",
    "name": "Bayu Pratama",
    "email": "bayu.pratama.23240925@siswa.belajar.id",
    "password": "$sapa$v1$979263c25f0d6c7e0cb79e6db540a63f01fda3c47c96d2af4abf231584e1f47c",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-26",
    "name": "Hana Wahyuni",
    "email": "hana.wahyuni.23240926@siswa.belajar.id",
    "password": "$sapa$v1$e45290af081f4aa58dd30f9930ab8842a4359a59ab1958b6e3c86bcb848ff995",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-27",
    "name": "Rangga Haikal",
    "email": "rangga.haikal.23240927@siswa.belajar.id",
    "password": "$sapa$v1$eb38c5e1fee70018abdfc1ddffb233ad88cca46cebc52c0ea290a8b3096cd6e6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-28",
    "name": "Vania Santoso",
    "email": "vania.santoso.23240928@siswa.belajar.id",
    "password": "$sapa$v1$56d67aaf9214ba0f604a48be4c62de91006501d7c0145c429e8c8dd54f2ee170",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-29",
    "name": "Danendra Sudrajat",
    "email": "danendra.sudrajat.23240929@siswa.belajar.id",
    "password": "$sapa$v1$2a7939ce056001f325ecce9c8126468824eb54f07c4771242bd6cd58b251bb69",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-30",
    "name": "Intan Wijaya",
    "email": "intan.wijaya.23240930@siswa.belajar.id",
    "password": "$sapa$v1$d04fa0eae785803c08cb06c9a9ec165c9260551f03e65983ec6e5215cdc48411",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-31",
    "name": "Revan Pangestu",
    "email": "revan.pangestu.23240931@siswa.belajar.id",
    "password": "$sapa$v1$4f2481893ff4a424ea15e1380c08bb41a8de54c76440cd32e1948628a673b8c4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-32",
    "name": "Zaskia Kuncoro",
    "email": "zaskia.kuncoro.23240932@siswa.belajar.id",
    "password": "$sapa$v1$0367001bc1c260c3370102d44169324d7c581962e27a53ff172dd27b8873f825",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-33",
    "name": "Dennis Rahmawati",
    "email": "dennis.rahmawati.23240933@siswa.belajar.id",
    "password": "$sapa$v1$6789da0296624b4506de1bbf018972347a92273148d2e7a99904c1a53d0f6efa",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-1-34",
    "name": "Kayla Nugraha",
    "email": "kayla.nugraha.23240934@siswa.belajar.id",
    "password": "$sapa$v1$00ae97a3db0e65e3628f13113528c9345f215fcaeaefb8d62a3f1447c22152a9",
    "role": "siswa",
    "avatar": null,
    "phone": "0823200034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-01",
    "name": "Alif Baskara",
    "email": "alif.baskara.23241001@siswa.belajar.id",
    "password": "$sapa$v1$6c74702b1d102c8a9af936b990d6d2c2553ae3858926cb67cbb58d556348a35e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-02",
    "name": "Dinda Permatasari",
    "email": "dinda.permatasari.23241002@siswa.belajar.id",
    "password": "$sapa$v1$e8409d007c8dc75a32dc81e2531188941a9d8e571cf61ee364455731d51ee644",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-03",
    "name": "M. Zidan Maulana",
    "email": "m.zidan.maulana.23241003@siswa.belajar.id",
    "password": "$sapa$v1$fb05f7e42cdc2af1ed9324b1e7d2ae75a616a8f93f7c4b9ecf596bc6b578bd62",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-04",
    "name": "Shifa Setiawan",
    "email": "shifa.setiawan.23241004@siswa.belajar.id",
    "password": "$sapa$v1$9ebb3820ec1758b626028a69623a4b70d84b0d02fdb55c748db8dd8716626f38",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-05",
    "name": "Ardi Suhendra",
    "email": "ardi.suhendra.23241005@siswa.belajar.id",
    "password": "$sapa$v1$9c7a886fd5681edb0ffdbee916316d67baae84fe5d78d7f0de36ef1aee3d3c0f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-06",
    "name": "Febriana Putra",
    "email": "febriana.putra.23241006@siswa.belajar.id",
    "password": "$sapa$v1$a1a21a223e395f2a6c2137008a65722d86dfa60d74a06a30cb11265feb50eef2",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-07",
    "name": "Pratama Kurnia",
    "email": "pratama.kurnia.23241007@siswa.belajar.id",
    "password": "$sapa$v1$02706b4d8fe94094ce93c6b404361878de0aec926ce6f2e9e7a2bce6ec67cb83",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-08",
    "name": "Syifa Pramudya",
    "email": "syifa.pramudya.23241008@siswa.belajar.id",
    "password": "$sapa$v1$fb81c00286ae71d36a8e5e71b115cf09990d45859da6608da1f9f354bb7b35a7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-09",
    "name": "Bagas Lestari",
    "email": "bagas.lestari.23241009@siswa.belajar.id",
    "password": "$sapa$v1$439e36d21c2a675c0f7c4d8e3906c2de2741d925bfe2370906d340da574e3055",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-10",
    "name": "Gita Syahputra",
    "email": "gita.syahputra.23241010@siswa.belajar.id",
    "password": "$sapa$v1$8907052d4b133a93513f258a17359e643fd17003b0a4d8d9c969f3cd3f1c7422",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-11",
    "name": "Rafi Wicaksono",
    "email": "rafi.wicaksono.23241011@siswa.belajar.id",
    "password": "$sapa$v1$83289a0116e660305941450cbe1687840bd1c87c3a8084dedbe55fffac47cd60",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-12",
    "name": "Tiara Purnomo",
    "email": "tiara.purnomo.23241012@siswa.belajar.id",
    "password": "$sapa$v1$6819c50b0fcc8b2e51b9ba917ee666d89a5012b31472e7bb4aa04d4d8d2d7735",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-13",
    "name": "Bima Saputra",
    "email": "bima.saputra.23241013@siswa.belajar.id",
    "password": "$sapa$v1$ddd983f0d8f5cc35baf7f80110432b0df3aace64e5a9199157ed62dcf5580e6d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-14",
    "name": "Indah Safitri",
    "email": "indah.safitri.23241014@siswa.belajar.id",
    "password": "$sapa$v1$7998c59458e86fe761e24bd9acc841eee782ff6f89bcb41b757a9e11c438fd94",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-15",
    "name": "Rendi Mahardika",
    "email": "rendi.mahardika.23241015@siswa.belajar.id",
    "password": "$sapa$v1$4aa46b327ee45371ba16cd44ed3f7a07b0f5234f856ddc331f2bdf4ca0bb2c5d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-16",
    "name": "Zahra Gunawan",
    "email": "zahra.gunawan.23241016@siswa.belajar.id",
    "password": "$sapa$v1$cc90856dc0ae72a37609f06329e379db18899c76761aaacf2482cf4700453067",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-17",
    "name": "Daffa Sujatmiko",
    "email": "daffa.sujatmiko.23241017@siswa.belajar.id",
    "password": "$sapa$v1$89b310aa7ca7d475f0c2c8a7ab4afc9445f12c348bae00a359a34e4e38d99972",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-18",
    "name": "Jessica Nugroho",
    "email": "jessica.nugroho.23241018@siswa.belajar.id",
    "password": "$sapa$v1$f492c9fc796b5d041fd3c32718289341ea1e3e749a2b4da5d620117592b8b7f0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-19",
    "name": "Rian Suryanto",
    "email": "rian.suryanto.23241019@siswa.belajar.id",
    "password": "$sapa$v1$754e04a93105c807d0e7fe656e8d3090bca64911022c2eadf681d53875b14c83",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-20",
    "name": "Adinda Pratama",
    "email": "adinda.pratama.23241020@siswa.belajar.id",
    "password": "$sapa$v1$9848ad47c4f70eaad2e6d056425eba6f4edbe01114dcc7bbfb56b04f4cbb9790",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-21",
    "name": "Desta Wahyuni",
    "email": "desta.wahyuni.23241021@siswa.belajar.id",
    "password": "$sapa$v1$cf312eaf2ae1cc2201bbe65e50a6f90dc1b8123cab44eacea3e52dd701504183",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-22",
    "name": "Keisha Haikal",
    "email": "keisha.haikal.23241022@siswa.belajar.id",
    "password": "$sapa$v1$e5b3cfad316ac5c59fbf21951869e28191f182c3f4f5c40993426c905faf8758",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-23",
    "name": "Tegar Santoso",
    "email": "tegar.santoso.23241023@siswa.belajar.id",
    "password": "$sapa$v1$8693ce444b73bac445c8a94ed2c062429c60d707e6a28ef2806f091062c58bac",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-24",
    "name": "Alifa Sudrajat",
    "email": "alifa.sudrajat.23241024@siswa.belajar.id",
    "password": "$sapa$v1$20675edd077f48cf6624c1321acbef84592e05d79e9d631bfa4693ca391c5a3b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-25",
    "name": "Fadhil Wijaya",
    "email": "fadhil.wijaya.23241025@siswa.belajar.id",
    "password": "$sapa$v1$6d81ab58f631102236e17efcd5af8dc234be1000e1311a66b56202bf4b8f7951",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-26",
    "name": "Laras Pangestu",
    "email": "laras.pangestu.23241026@siswa.belajar.id",
    "password": "$sapa$v1$649d08a52085eb83d214f1eeae6152cde4b9fa4e477827d233d577b0293b7ff6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-27",
    "name": "Wawan Kuncoro",
    "email": "wawan.kuncoro.23241027@siswa.belajar.id",
    "password": "$sapa$v1$00bf4dd94142b878c97d40c85a86e5dfbfa2c25ad3a464a139bb6b0090d6c37b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-28",
    "name": "Anindya Rahmawati",
    "email": "anindya.rahmawati.23241028@siswa.belajar.id",
    "password": "$sapa$v1$150d7ddf0dde016bdd497690c3f2d52d2030567e80acfb6fb6642c76a0c8cb7b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-29",
    "name": "Farhan Nugraha",
    "email": "farhan.nugraha.23241029@siswa.belajar.id",
    "password": "$sapa$v1$41e037025a454c05c52df35ca737e005d5f76b5d971d8868d909863a1f7cd14f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-30",
    "name": "Maulida Hidayat",
    "email": "maulida.hidayat.23241030@siswa.belajar.id",
    "password": "$sapa$v1$94f1cdbbc8d32ebc84bdbf37b9ba881af03cdd759a9e95e0a24eedd9d9babd83",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-31",
    "name": "Yusuf Wibowo",
    "email": "yusuf.wibowo.23241031@siswa.belajar.id",
    "password": "$sapa$v1$9f4a5ae87ec41c3162230bf6baf397db0d990e629e59b9b569a1b99f350ab220",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-32",
    "name": "Annisa Ramadhan",
    "email": "annisa.ramadhan.23241032@siswa.belajar.id",
    "password": "$sapa$v1$38fec6f6e29c57688d4e505d98754e79a29d06212108d9f06807b7beb29d45f6",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-33",
    "name": "Galih Firmansyah",
    "email": "galih.firmansyah.23241033@siswa.belajar.id",
    "password": "$sapa$v1$4b30838b15286f0cc7812957d2d75d6b6c0d7a24e8d6a96d01626408ca4ec097",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-dkv-2-34",
    "name": "Nadira Hakim",
    "email": "nadira.hakim.23241034@siswa.belajar.id",
    "password": "$sapa$v1$3b8ad3c3fc8b5b42d2059f150d72ee42768536e6a09c5ca33766d20bf973352f",
    "role": "siswa",
    "avatar": null,
    "phone": "0823210034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-01",
    "name": "Danendra Putra",
    "email": "danendra.putra.23241101@siswa.belajar.id",
    "password": "$sapa$v1$e67f6c84ed9ba880adeb16b4b8b77f2bf1ef912da6f02a8521993c813c86baef",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-02",
    "name": "Intan Kurnia",
    "email": "intan.kurnia.23241102@siswa.belajar.id",
    "password": "$sapa$v1$b1e9650b553601b50b4bc440155afc3c26ee153b8573072e21ffa36adaa38845",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-03",
    "name": "Revan Pramudya",
    "email": "revan.pramudya.23241103@siswa.belajar.id",
    "password": "$sapa$v1$79780e99e10a9a64ebeeb6a6846688c81c5f9b0dbe868016bf13e53fcbb0c879",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-04",
    "name": "Zaskia Lestari",
    "email": "zaskia.lestari.23241104@siswa.belajar.id",
    "password": "$sapa$v1$207d587d3af8728f8392c094975211807dd31193a13a8637876bf79be77f9a44",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-05",
    "name": "Dennis Syahputra",
    "email": "dennis.syahputra.23241105@siswa.belajar.id",
    "password": "$sapa$v1$f8fb425d358d224f07557f454e11803fb5c4a40ab8b457f576013480f6219c23",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-06",
    "name": "Kayla Wicaksono",
    "email": "kayla.wicaksono.23241106@siswa.belajar.id",
    "password": "$sapa$v1$5e158c6700bb2f80be1e8c9fccbf92271b27ed74b99600009ad4d205cb3a66a0",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-07",
    "name": "Satria Purnomo",
    "email": "satria.purnomo.23241107@siswa.belajar.id",
    "password": "$sapa$v1$d5f0256e1c474881bca2ba930955111401248195a1da39f259e808c65ef758b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-08",
    "name": "Aisyah Saputra",
    "email": "aisyah.saputra.23241108@siswa.belajar.id",
    "password": "$sapa$v1$006e507bb5a1237d64a21fc436974791e5f625a2c3087a2b5cb40a858429f270",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-09",
    "name": "Dimas Safitri",
    "email": "dimas.safitri.23241109@siswa.belajar.id",
    "password": "$sapa$v1$43ef1d31c9fa606c09114b7a1e69c7d8e9399a4e16c35b15c9b626fa07b88775",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-10",
    "name": "Laila Mahardika",
    "email": "laila.mahardika.23241110@siswa.belajar.id",
    "password": "$sapa$v1$26b9c3046a33ef72e71c246909254343c145ce745d6a2b7451c433a6b331a02a",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-11",
    "name": "Wahyu Gunawan",
    "email": "wahyu.gunawan.23241111@siswa.belajar.id",
    "password": "$sapa$v1$0cf820be5c7a818a6a4e448905c7b5a554013fc36c3badbe34804c38c0281ec8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-12",
    "name": "Amanda Sujatmiko",
    "email": "amanda.sujatmiko.23241112@siswa.belajar.id",
    "password": "$sapa$v1$0c1dc70b0d1c6b58a33467c9c089eef9d548f364d08cb7def084be7d31f59e9d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-13",
    "name": "Fajar Nugroho",
    "email": "fajar.nugroho.23241113@siswa.belajar.id",
    "password": "$sapa$v1$76ee3b370fcaa1032ab547134f63fe883092cde4c0c979b4c22e497e765b88f7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-14",
    "name": "Marsha Suryanto",
    "email": "marsha.suryanto.23241114@siswa.belajar.id",
    "password": "$sapa$v1$f99fdf717e947d0fb2208e2951daf1f10c3ffb2e0292daddb7894897fd53c028",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-15",
    "name": "Yoga Pratama",
    "email": "yoga.pratama.23241115@siswa.belajar.id",
    "password": "$sapa$v1$99d119a050ac0ba84b4e75281307e4a6008e46042d1196184530bcf455c6cd48",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-16",
    "name": "Anisa Wahyuni",
    "email": "anisa.wahyuni.23241116@siswa.belajar.id",
    "password": "$sapa$v1$34ec2d0e99aaa6e4db76fe4d589bffdb25597a919ec38ee8b181938f04b12615",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-17",
    "name": "Fathir Haikal",
    "email": "fathir.haikal.23241117@siswa.belajar.id",
    "password": "$sapa$v1$67b18556110a27f81e2be04e74fef6fff52fa31e2252eb6330b80feb29e67943",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-18",
    "name": "Nabila Santoso",
    "email": "nabila.santoso.23241118@siswa.belajar.id",
    "password": "$sapa$v1$5bfc8de6f58a35c0a1e0d0ad27f7384e44d3c56a08413c87e69030c257c3fc64",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-19",
    "name": "Zack Sudrajat",
    "email": "zack.sudrajat.23241119@siswa.belajar.id",
    "password": "$sapa$v1$2119319d355c9234b5aade7cf7b9ce66dbc3fa07ae856090f51912ec10049d85",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-20",
    "name": "Aqila Wijaya",
    "email": "aqila.wijaya.23241120@siswa.belajar.id",
    "password": "$sapa$v1$8b3970772d1f105f66cc0d4a37a4e6ff7d29c37e25fcb1b87e1498d82892f987",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-21",
    "name": "Gilang Pangestu",
    "email": "gilang.pangestu.23241121@siswa.belajar.id",
    "password": "$sapa$v1$d9794d678872e9c5cfb2dc705ad85309627eb4562dfd91b3f4c6085a8e98b3c7",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-22",
    "name": "Nafisa Kuncoro",
    "email": "nafisa.kuncoro.23241122@siswa.belajar.id",
    "password": "$sapa$v1$56ed7113d69d502f631434df219661c3e953faecfbe9e30b70a1a53429d53526",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-23",
    "name": "Zulfikar Rahmawati",
    "email": "zulfikar.rahmawati.23241123@siswa.belajar.id",
    "password": "$sapa$v1$d152b5583b59ca010bddfa11b3e2a422ed28c0a4a71b2f029347e2f41ad04482",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-24",
    "name": "Cantika Nugraha",
    "email": "cantika.nugraha.23241124@siswa.belajar.id",
    "password": "$sapa$v1$b75717adcd61f7562bdc0b4d7b6f4eae017a5dce44701caa6d33ef7dbb3e80ed",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-25",
    "name": "Ilham Hidayat",
    "email": "ilham.hidayat.23241125@siswa.belajar.id",
    "password": "$sapa$v1$54565421841ee1e1151032796c29063c4e8a7e70490c7beba6838f2a6ad33c05",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-26",
    "name": "Novalita Wibowo",
    "email": "novalita.wibowo.23241126@siswa.belajar.id",
    "password": "$sapa$v1$b71e1968bc7a540a50f67e9658fcd3b1f234e6f3de03a8f7f55b44a45c194712",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-27",
    "name": "Candra Ramadhan",
    "email": "candra.ramadhan.23241127@siswa.belajar.id",
    "password": "$sapa$v1$ec8ec316c9e74497d717078ec759ef1a8305c594ff0fadaa12967e03836fea32",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-28",
    "name": "Citra Firmansyah",
    "email": "citra.firmansyah.23241128@siswa.belajar.id",
    "password": "$sapa$v1$a7dba611a6f1926fb3858ff0a062d7ce9241c26ed795224756c476cad41029c8",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-29",
    "name": "Irfan Hakim",
    "email": "irfan.hakim.23241129@siswa.belajar.id",
    "password": "$sapa$v1$861768ad4aa1eb02363912ff75ac014dfd8f3398e02f3632e1e45639eefcf0f4",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-30",
    "name": "Putri Anggraini",
    "email": "putri.anggraini.23241130@siswa.belajar.id",
    "password": "$sapa$v1$57063cc8ad5c4594821381b5d33e53a07022258495e7937cd2d3ba44c584e862",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-31",
    "name": "Ahmad Wardhana",
    "email": "ahmad.wardhana.23241131@siswa.belajar.id",
    "password": "$sapa$v1$8797574fec644fe8186f9dc4a4cf3e4d6e43a4997c9cdc324fa1d8c0fbb23f2e",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-32",
    "name": "Delfina Utomo",
    "email": "delfina.utomo.23241132@siswa.belajar.id",
    "password": "$sapa$v1$83fed26079f96ccf0f35be83f41bbc7c8f6efb0396f3f546545d1889119c675b",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-33",
    "name": "Lucky Kuswanto",
    "email": "lucky.kuswanto.23241133@siswa.belajar.id",
    "password": "$sapa$v1$ed0e95ffd87fa245e557e5c9f6084dc0d7abd04aca21212fd91a87ff872d1b79",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xi-akl-1-34",
    "name": "Rania Kusuma",
    "email": "rania.kusuma.23241134@siswa.belajar.id",
    "password": "$sapa$v1$c1042279a9b20a7f39315d755aa8156ca5e82e605ba4eb19d57db2550d257d7d",
    "role": "siswa",
    "avatar": null,
    "phone": "0823220034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-01",
    "name": "Farhan Wicaksono",
    "email": "farhan.wicaksono.22230101@siswa.belajar.id",
    "password": "$sapa$v1$560d59bb022bdb33212b726bde650c50152b710aa74bab1b2172965f4b817964",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-02",
    "name": "Maulida Purnomo",
    "email": "maulida.purnomo.22230102@siswa.belajar.id",
    "password": "$sapa$v1$4037da52050878b02f8a31257e61beb1f944c617b0f04d4cd9ca77603e01d483",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-03",
    "name": "Yusuf Saputra",
    "email": "yusuf.saputra.22230103@siswa.belajar.id",
    "password": "$sapa$v1$d8558bd21a65a1b8e1446fa4a83a9bd1b0b18cf2788a32e11290b3ce962aa41f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-04",
    "name": "Annisa Safitri",
    "email": "annisa.safitri.22230104@siswa.belajar.id",
    "password": "$sapa$v1$2289b2ae6f121c66dbf319201057e05440570f2819511e15eb245605e31e39ca",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-05",
    "name": "Galih Mahardika",
    "email": "galih.mahardika.22230105@siswa.belajar.id",
    "password": "$sapa$v1$9388167c2ef7a5e53b4c5053a8426dc279bcc8af4c1384b12d663ab58e4c7641",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-06",
    "name": "Nadira Gunawan",
    "email": "nadira.gunawan.22230106@siswa.belajar.id",
    "password": "$sapa$v1$cc144cc37163bfcb192623b2f8a44bd8ce8f1522b3fd78322e143f6288fc9cad",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-07",
    "name": "Zidan Sujatmiko",
    "email": "zidan.sujatmiko.22230107@siswa.belajar.id",
    "password": "$sapa$v1$78c1546ea8e12c695d4bd2025c8f7d815833bc5845a03bcc92a17a526d949beb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-08",
    "name": "Aurelia Nugroho",
    "email": "aurelia.nugroho.22230108@siswa.belajar.id",
    "password": "$sapa$v1$e5472b1ec8f297a9bc969b579cea820b25f6e107481856f760cbf0cadbba7f92",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-09",
    "name": "Hafiz Suryanto",
    "email": "hafiz.suryanto.22230109@siswa.belajar.id",
    "password": "$sapa$v1$ca99294efa0b24534b9807a7d8c242e275fabb4b10fe07e9f2536d9f136350b3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-10",
    "name": "Nayra Pratama",
    "email": "nayra.pratama.22230110@siswa.belajar.id",
    "password": "$sapa$v1$a88ce82190ffee6036ad6b1f1fa9c894d3ae4dfd9764c228437c08d035fa3ea1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-11",
    "name": "Bintang Wahyuni",
    "email": "bintang.wahyuni.22230111@siswa.belajar.id",
    "password": "$sapa$v1$7eee96ae38910462293458c65790dbf3e6a177acb318ac699876872a1950e457",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-12",
    "name": "Chelsea Haikal",
    "email": "chelsea.haikal.22230112@siswa.belajar.id",
    "password": "$sapa$v1$46ce5f81b07687516d636a2f6fa09d8de779dae72e2c7d139eb8c5061f2e54fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-13",
    "name": "Indra Santoso",
    "email": "indra.santoso.22230113@siswa.belajar.id",
    "password": "$sapa$v1$ee17d9895d7ca0140fb2a4bf71d2f887363fcc452ad134b5b2041732778a940d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-14",
    "name": "Nurul Sudrajat",
    "email": "nurul.sudrajat.22230114@siswa.belajar.id",
    "password": "$sapa$v1$26cc0e0c6d3eb7b6c6b19eb02e0cce5997816570d795633af4f1fe8f8e245480",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-15",
    "name": "Dwi Wijaya",
    "email": "dwi.wijaya.22230115@siswa.belajar.id",
    "password": "$sapa$v1$47428c7db3a0e83b0fd3a7a8448e3ab3ce949e9e147d3d0a66150956ca92ec6e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-16",
    "name": "Clarissa Pangestu",
    "email": "clarissa.pangestu.22230116@siswa.belajar.id",
    "password": "$sapa$v1$965a26e94bbeda29977379984a1add88f391f79e0aed093e888b1da869d6850d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-17",
    "name": "Kevin Kuncoro",
    "email": "kevin.kuncoro.22230117@siswa.belajar.id",
    "password": "$sapa$v1$5cc1b58ce8d6ce134348211bcf272d8557ae1bd8815c16d08945729b4b828a1c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-18",
    "name": "Raisa Rahmawati",
    "email": "raisa.rahmawati.22230118@siswa.belajar.id",
    "password": "$sapa$v1$87e107b4648ec268073567080d9d621c5a17b7f20361c18e57fb33a6388f864f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-19",
    "name": "Aditya Nugraha",
    "email": "aditya.nugraha.22230119@siswa.belajar.id",
    "password": "$sapa$v1$cb4b4ec2a3200d69feb1d47770fb29cb527783626d852fe28b71a7ca1a796c8b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-20",
    "name": "Devi Hidayat",
    "email": "devi.hidayat.22230120@siswa.belajar.id",
    "password": "$sapa$v1$b843180404dbe6c6592240a52ef9062cc65ecf967618280282ed0d449b5538af",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-21",
    "name": "M. Rizky Wibowo",
    "email": "m.rizky.wibowo.22230121@siswa.belajar.id",
    "password": "$sapa$v1$cc5107c8e05274758d11f0566d3d19dfd489fe943fa68b69e9ed52b97e5100d4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-22",
    "name": "Salma Ramadhan",
    "email": "salma.ramadhan.22230122@siswa.belajar.id",
    "password": "$sapa$v1$ac36e39256e167587e70601cff933a6db8ab381fd146537dd8df65e0d8dc070d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-23",
    "name": "Alif Firmansyah",
    "email": "alif.firmansyah.22230123@siswa.belajar.id",
    "password": "$sapa$v1$a325da5f06c21368d84afc041cad0df0d76da167bdf25f47823a35b30997196b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-24",
    "name": "Dinda Hakim",
    "email": "dinda.hakim.22230124@siswa.belajar.id",
    "password": "$sapa$v1$5f83a8a3e172a0ad64ce8dbc7ebace37c877d1a134fc740b0aa8e58cfc19a4c1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-25",
    "name": "M. Zidan Anggraini",
    "email": "m.zidan.anggraini.22230125@siswa.belajar.id",
    "password": "$sapa$v1$1614d610376aff38cffa14c39f81a7b3f4673145c1f04c76d83aa70f6d447eb3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-26",
    "name": "Shifa Wardhana",
    "email": "shifa.wardhana.22230126@siswa.belajar.id",
    "password": "$sapa$v1$b196c952531929aa622b60ec4eaa925ea7da37c6d1439e6631139f01815e406b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-27",
    "name": "Ardi Utomo",
    "email": "ardi.utomo.22230127@siswa.belajar.id",
    "password": "$sapa$v1$9091641e713d561407c284b5c9bbfc44f6bd9304cd5db5adb649acf026cb709d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-28",
    "name": "Febriana Kuswanto",
    "email": "febriana.kuswanto.22230128@siswa.belajar.id",
    "password": "$sapa$v1$690c3f531aadffa3d187be599008635ff697e5e531dfb1137e12847c2f9c3361",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-29",
    "name": "Pratama Kusuma",
    "email": "pratama.kusuma.22230129@siswa.belajar.id",
    "password": "$sapa$v1$2b09e38ad49fd170ca0a12c1ef66b197f724c81bd94ba6f2fed3c58db4fca099",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-30",
    "name": "Syifa Mahendra",
    "email": "syifa.mahendra.22230130@siswa.belajar.id",
    "password": "$sapa$v1$c076ea1951ec8ed0cccc399e130cc417312224fda1691a558fe540ea49232886",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-31",
    "name": "Bagas Baskara",
    "email": "bagas.baskara.22230131@siswa.belajar.id",
    "password": "$sapa$v1$0317605e3376dbc1ef910f886764628df15c286b51258441fd672df2a7de7868",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-32",
    "name": "Gita Permatasari",
    "email": "gita.permatasari.22230132@siswa.belajar.id",
    "password": "$sapa$v1$9451fd25cd9f482c31743222c4643cd4e7679465ad9fa0c2fd9ec7335f850ce4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-33",
    "name": "Rafi Maulana",
    "email": "rafi.maulana.22230133@siswa.belajar.id",
    "password": "$sapa$v1$6b42e72660dd4ecb77ced5a78732b9d79a4e7ef25685300d4966b1b75b62a3c0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-1-34",
    "name": "Tiara Setiawan",
    "email": "tiara.setiawan.22230134@siswa.belajar.id",
    "password": "$sapa$v1$6fb923b4031c2e9c22910f0fa2db9439e7613bc8b4d694337830e7286826ee3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822230034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-01",
    "name": "Irfan Gunawan",
    "email": "irfan.gunawan.22230201@siswa.belajar.id",
    "password": "$sapa$v1$ce5a6a6654a2582f610ce252f0b7715f6ad7b8e352fcdbfe0146a1b1fbf7c735",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-02",
    "name": "Putri Sujatmiko",
    "email": "putri.sujatmiko.22230202@siswa.belajar.id",
    "password": "$sapa$v1$71a19addef929a81b51b86c935ccb7327f81d678670461d17f74afaadc269c4c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-03",
    "name": "Ahmad Nugroho",
    "email": "ahmad.nugroho.22230203@siswa.belajar.id",
    "password": "$sapa$v1$56020f5fcecdf65c1d569056565f89d91c7252203bc96e7d83f83b88294a07aa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-04",
    "name": "Delfina Suryanto",
    "email": "delfina.suryanto.22230204@siswa.belajar.id",
    "password": "$sapa$v1$c3b536284839ab1b4139fff9491e2a2d23133c4da1f4fd2a14c4faccdac36c1b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-05",
    "name": "Lucky Pratama",
    "email": "lucky.pratama.22230205@siswa.belajar.id",
    "password": "$sapa$v1$7088c7fa4cc30c3b76b4a912bc044b8387e2547955c5b23f3d7091245531988e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-06",
    "name": "Rania Wahyuni",
    "email": "rania.wahyuni.22230206@siswa.belajar.id",
    "password": "$sapa$v1$cc45dbbd8e2f4bc1875a404b409546afbb8267c9357c4b92cd993e912dbda7de",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-07",
    "name": "Aldiansyah Haikal",
    "email": "aldiansyah.haikal.22230207@siswa.belajar.id",
    "password": "$sapa$v1$4c32e3f233c1a0be66e62a2f8978f162eee85577abb9222c06b2163dc7a761cc",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-08",
    "name": "Dian Santoso",
    "email": "dian.santoso.22230208@siswa.belajar.id",
    "password": "$sapa$v1$ce836a8575aae7f09630a731d88731a6c5c606099b8c6eb22aa1988e4f8101ae",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-09",
    "name": "M. Fikri Sudrajat",
    "email": "m.fikri.sudrajat.22230209@siswa.belajar.id",
    "password": "$sapa$v1$385ba2b9e67ec77ec7e5e746990c6750cb37942aef228302755e2bef7773b915",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-10",
    "name": "Salsabila Wijaya",
    "email": "salsabila.wijaya.22230210@siswa.belajar.id",
    "password": "$sapa$v1$078cb3a12b7e04ff91096ea8fa53c9eb42f8e220aa3cf3e242fd9f11e4c723bb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-11",
    "name": "Andika Pangestu",
    "email": "andika.pangestu.22230211@siswa.belajar.id",
    "password": "$sapa$v1$2fd5cd9eab961c860c54a5781e931c8ce5912bb80c9601babeddf6e97840f068",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-12",
    "name": "Elsa Kuncoro",
    "email": "elsa.kuncoro.22230212@siswa.belajar.id",
    "password": "$sapa$v1$d5034cf47e5487620700407f7cc3c1ce66cf27343cc3243f100b25965f2e49f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-13",
    "name": "Naufal Rahmawati",
    "email": "naufal.rahmawati.22230213@siswa.belajar.id",
    "password": "$sapa$v1$87178377e3d43a6475faea5cf4d3f3a405acbaec356dcaf6fe7a9b291ecb5234",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-14",
    "name": "Siti Nugraha",
    "email": "siti.nugraha.22230214@siswa.belajar.id",
    "password": "$sapa$v1$ed32be44185d4885a86955e0b539cdd3a30820c619fd01715d29707e20bd1539",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-15",
    "name": "Arya Hidayat",
    "email": "arya.hidayat.22230215@siswa.belajar.id",
    "password": "$sapa$v1$013e56428b0c15d7cebf96e281317fe84be65bb287966809bbdbd3a90b9c8695",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-16",
    "name": "Fitri Wibowo",
    "email": "fitri.wibowo.22230216@siswa.belajar.id",
    "password": "$sapa$v1$83483c614bf0e2feb82c42ed6ff15f313ad801b98611b3dee33c87fca7374daa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-17",
    "name": "Raditya Ramadhan",
    "email": "raditya.ramadhan.22230217@siswa.belajar.id",
    "password": "$sapa$v1$211be457cbb200494d063da170134dd75566445be5931264350620f7297111a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-18",
    "name": "Tania Firmansyah",
    "email": "tania.firmansyah.22230218@siswa.belajar.id",
    "password": "$sapa$v1$18d1ebbd79ac773c2b81a06a055e61412226aae8c6c4cfc6ed9692c833eb1dac",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-19",
    "name": "Bayu Hakim",
    "email": "bayu.hakim.22230219@siswa.belajar.id",
    "password": "$sapa$v1$a08b382d4c08b2a8985e96277359b75a535d79a82fe3f77538dc8f39e018145a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-20",
    "name": "Hana Anggraini",
    "email": "hana.anggraini.22230220@siswa.belajar.id",
    "password": "$sapa$v1$ccbd59a7d278d8c6cdf6edbe854a6f839d668b05d54877d2efa083b6a1f4470d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-21",
    "name": "Rangga Wardhana",
    "email": "rangga.wardhana.22230221@siswa.belajar.id",
    "password": "$sapa$v1$6d9d4fed9464e3a51c72cf230e63ef722933d49852cc1071d556bda67e83130c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-22",
    "name": "Vania Utomo",
    "email": "vania.utomo.22230222@siswa.belajar.id",
    "password": "$sapa$v1$325ac7fa01ffabfc5acc451e9f7f245fe3aaa1506a0c89da5455a2767a86195c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-23",
    "name": "Danendra Kuswanto",
    "email": "danendra.kuswanto.22230223@siswa.belajar.id",
    "password": "$sapa$v1$0a92f7c33208793465cd3a8401a69ae3884c66190ce4fcfcb32e43d41b8fb771",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-24",
    "name": "Intan Kusuma",
    "email": "intan.kusuma.22230224@siswa.belajar.id",
    "password": "$sapa$v1$37db24143bb6b92281242075007b6aa437742f9b566e394608f1ffa894eb796b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-25",
    "name": "Revan Mahendra",
    "email": "revan.mahendra.22230225@siswa.belajar.id",
    "password": "$sapa$v1$392f138990fdbef19b618c2753a3721e347ce559039a6027ed49bae0d883c232",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-26",
    "name": "Zaskia Baskara",
    "email": "zaskia.baskara.22230226@siswa.belajar.id",
    "password": "$sapa$v1$202a307302a403335febdbc6435a3e2d4e3b124c1b2df7a22349f91c426c0a37",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-27",
    "name": "Dennis Permatasari",
    "email": "dennis.permatasari.22230227@siswa.belajar.id",
    "password": "$sapa$v1$caaa6eb787c6faa925046b505408d673f350166c3630291345a8c1124221fb62",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-28",
    "name": "Kayla Maulana",
    "email": "kayla.maulana.22230228@siswa.belajar.id",
    "password": "$sapa$v1$dd2d7303f43921a475ad777cee25272a93f5eb6f461c0dce53670a1fd890f36a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-29",
    "name": "Satria Setiawan",
    "email": "satria.setiawan.22230229@siswa.belajar.id",
    "password": "$sapa$v1$6483ebc222e19309f242b985153b75e64457801040ac0cb8ce233ac6076d4681",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-30",
    "name": "Aisyah Suhendra",
    "email": "aisyah.suhendra.22230230@siswa.belajar.id",
    "password": "$sapa$v1$26c1206aba5daa822b67a5ea64f38dd8f88f27746491a56ea2b7fc7a5683f5ad",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-31",
    "name": "Dimas Putra",
    "email": "dimas.putra.22230231@siswa.belajar.id",
    "password": "$sapa$v1$e7474926e441eb82bf4421a7ed66c18a04664cbf08512f42292be0b25db3c895",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-32",
    "name": "Laila Kurnia",
    "email": "laila.kurnia.22230232@siswa.belajar.id",
    "password": "$sapa$v1$64c722efd7fb23b65aefaee73cbb1926b1f2d6a79034d92d07d3d8f273a7bd57",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-33",
    "name": "Wahyu Pramudya",
    "email": "wahyu.pramudya.22230233@siswa.belajar.id",
    "password": "$sapa$v1$ad154d2851cb70dad0397b6528c11a5b88fa77c231e054419656f639dac53e4f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-2-34",
    "name": "Amanda Lestari",
    "email": "amanda.lestari.22230234@siswa.belajar.id",
    "password": "$sapa$v1$ebef9a9e6a0ab2969435155ce8257d2419c3ae85be062f328a0636a9af273960",
    "role": "siswa",
    "avatar": null,
    "phone": "0822240034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-01",
    "name": "Pratama Wahyuni",
    "email": "pratama.wahyuni.22230301@siswa.belajar.id",
    "password": "$sapa$v1$c1b82b1b82533c92b0b70ae3267eca2b0d471d3997c51d5bef733e655a0796dc",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-02",
    "name": "Syifa Haikal",
    "email": "syifa.haikal.22230302@siswa.belajar.id",
    "password": "$sapa$v1$fc6cefe13c40b1f0e1b2b590422843b549ef5d59fe1c99b9698f75998ebd7371",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-03",
    "name": "Bagas Santoso",
    "email": "bagas.santoso.22230303@siswa.belajar.id",
    "password": "$sapa$v1$b5b0859669563558e53510f6bb7ec1e0a113b68b90b3d9d15dc1da21c58b25c6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-04",
    "name": "Gita Sudrajat",
    "email": "gita.sudrajat.22230304@siswa.belajar.id",
    "password": "$sapa$v1$304f72f9458a833dbe96bdf4389fffd9a79f81edcc672916cb81ff1cd66be670",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-05",
    "name": "Rafi Wijaya",
    "email": "rafi.wijaya.22230305@siswa.belajar.id",
    "password": "$sapa$v1$bde6c43bdc3875676b2ad84486d62c79b7f7d047e65eecc840446809bd62f4f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-06",
    "name": "Tiara Pangestu",
    "email": "tiara.pangestu.22230306@siswa.belajar.id",
    "password": "$sapa$v1$931507316a282f1a93eab55ff0e74cc0480445c1928bcd2231fa9076b19b9d93",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-07",
    "name": "Bima Kuncoro",
    "email": "bima.kuncoro.22230307@siswa.belajar.id",
    "password": "$sapa$v1$df11d2f0a2f637ff6efd57d9147ea9c2e0fcd020b9478f990868dd2fec5e15fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-08",
    "name": "Indah Rahmawati",
    "email": "indah.rahmawati.22230308@siswa.belajar.id",
    "password": "$sapa$v1$7b47c447164b70f43745d8e1884856141a2b756563f0a86a488809dffe9e6632",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-09",
    "name": "Rendi Nugraha",
    "email": "rendi.nugraha.22230309@siswa.belajar.id",
    "password": "$sapa$v1$6cf9ca9ed17712ac498b3ce0cc0c6a6309ce77c4d7c727c9d968d3859ce1f37a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-10",
    "name": "Zahra Hidayat",
    "email": "zahra.hidayat.22230310@siswa.belajar.id",
    "password": "$sapa$v1$e65d462d0624711347b49bf619b3d4364ecbd9afcbd32a567fbe240f8bfc477c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-11",
    "name": "Daffa Wibowo",
    "email": "daffa.wibowo.22230311@siswa.belajar.id",
    "password": "$sapa$v1$3454f0d794f71b3eeb13656a82f4e1c36271d5827286312925628988618ea300",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-12",
    "name": "Jessica Ramadhan",
    "email": "jessica.ramadhan.22230312@siswa.belajar.id",
    "password": "$sapa$v1$e0c364b5929d8f43f1e5ff9d9a57512a4d7865d2b03f3e23dbe7fec0b40fc07f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-13",
    "name": "Rian Firmansyah",
    "email": "rian.firmansyah.22230313@siswa.belajar.id",
    "password": "$sapa$v1$44c22920ba2a7aa584bcd2b81a01b5b69fd531e84c91b1094498aef2d397aefb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-14",
    "name": "Adinda Hakim",
    "email": "adinda.hakim.22230314@siswa.belajar.id",
    "password": "$sapa$v1$f85515492ffa01fe1d56d279fa7654f85efd32c67f45705395145e265c6b6202",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-15",
    "name": "Desta Anggraini",
    "email": "desta.anggraini.22230315@siswa.belajar.id",
    "password": "$sapa$v1$26924e3a6009544320b0eba0c40e170a19a3dd9259c73e2b3cb72a04f1d61a80",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-16",
    "name": "Keisha Wardhana",
    "email": "keisha.wardhana.22230316@siswa.belajar.id",
    "password": "$sapa$v1$06cb747c1bcbd768c51e09f9c78070ae6f848e454d83cb45c6a7e92bcae7b535",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-17",
    "name": "Tegar Utomo",
    "email": "tegar.utomo.22230317@siswa.belajar.id",
    "password": "$sapa$v1$3e9b920678eb63b990c3dc94fc627a8a071bdd0615f8d2123e762bf642a9a4b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-18",
    "name": "Alifa Kuswanto",
    "email": "alifa.kuswanto.22230318@siswa.belajar.id",
    "password": "$sapa$v1$438d24a7d15e67dea55a477e087ae2b46849b3071b93954fb4254434a6fa08b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-19",
    "name": "Fadhil Kusuma",
    "email": "fadhil.kusuma.22230319@siswa.belajar.id",
    "password": "$sapa$v1$ffe020f81f9f272688e0b277611cba9e590dd43fd3f815a6b2dfb5d2c4b46ef1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-20",
    "name": "Laras Mahendra",
    "email": "laras.mahendra.22230320@siswa.belajar.id",
    "password": "$sapa$v1$08b59cc84e4470323b9470f9d61c0ef1018f4479cb59e69fa5ff296c1131fcde",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-21",
    "name": "Wawan Baskara",
    "email": "wawan.baskara.22230321@siswa.belajar.id",
    "password": "$sapa$v1$94f66169dd38d9e377e3b74ee95161f6f243de733da947a2b987f0cd9ff0abb6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-22",
    "name": "Anindya Permatasari",
    "email": "anindya.permatasari.22230322@siswa.belajar.id",
    "password": "$sapa$v1$def30bc654b97a382c322a7fe2fbfb50c9ad94d68689f25218189405e77699f8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-23",
    "name": "Farhan Maulana",
    "email": "farhan.maulana.22230323@siswa.belajar.id",
    "password": "$sapa$v1$03e360fc826bd021fddf8ffaae6ad369b31d11a20875b677d51d755e721d7940",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-24",
    "name": "Maulida Setiawan",
    "email": "maulida.setiawan.22230324@siswa.belajar.id",
    "password": "$sapa$v1$ae8a4868f6a1a1096284fdb18cc8df76f8fb19ce4f72167a7ff4f7e12a0fd429",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-25",
    "name": "Yusuf Suhendra",
    "email": "yusuf.suhendra.22230325@siswa.belajar.id",
    "password": "$sapa$v1$ec67f9a6a215fdd4487f0baa5d8f965f8dcdc952552b361977fd08a60dfbd7b1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-26",
    "name": "Annisa Putra",
    "email": "annisa.putra.22230326@siswa.belajar.id",
    "password": "$sapa$v1$3cafa72bec5e5d1685a222d3615585867c9589d9e6cf9ad40fad5c461be11825",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-27",
    "name": "Galih Kurnia",
    "email": "galih.kurnia.22230327@siswa.belajar.id",
    "password": "$sapa$v1$874213051a15f252da1a612c37833836a263602d8f06e44b614c2ddd458b05d0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-28",
    "name": "Nadira Pramudya",
    "email": "nadira.pramudya.22230328@siswa.belajar.id",
    "password": "$sapa$v1$36b0bc0cb76eec6a6f52b48e2df566339e78466595c32da71d5c4bdb541943ea",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-29",
    "name": "Zidan Lestari",
    "email": "zidan.lestari.22230329@siswa.belajar.id",
    "password": "$sapa$v1$fe95753d1d9d2972b612e3ddd1024ca54ef6ab789a38067d0b79cc42f08f2362",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-30",
    "name": "Aurelia Syahputra",
    "email": "aurelia.syahputra.22230330@siswa.belajar.id",
    "password": "$sapa$v1$ca99f45d6d2562d8f3a4f5f79f776c6e45c8b7bd8de2d2665dd7900c46046ad6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-31",
    "name": "Hafiz Wicaksono",
    "email": "hafiz.wicaksono.22230331@siswa.belajar.id",
    "password": "$sapa$v1$3bd563cd70427d629ef79533b05771cc80fbec9e8f6bd4fc59b8ce46bca28619",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-32",
    "name": "Nayra Purnomo",
    "email": "nayra.purnomo.22230332@siswa.belajar.id",
    "password": "$sapa$v1$68f6bb2b8377a72891255c037aecce9d89f1476f8c645da34cf2e39d7ecd448a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-33",
    "name": "Bintang Saputra",
    "email": "bintang.saputra.22230333@siswa.belajar.id",
    "password": "$sapa$v1$c6f401a2fb37f1172f4101ef2a1ea4eeb2187478d881e76d65913a4004156f32",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkj-3-34",
    "name": "Chelsea Safitri",
    "email": "chelsea.safitri.22230334@siswa.belajar.id",
    "password": "$sapa$v1$797fdf68872719e60062e3c73108ff852817bc01b0d67e1c9f498b9d67b54dc0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822250034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-01",
    "name": "Satria Pangestu",
    "email": "satria.pangestu.22230401@siswa.belajar.id",
    "password": "$sapa$v1$b08ad3af4060efdfb12f508994d505f7b26c55394e156518aadb80ee58d855b6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-02",
    "name": "Aisyah Kuncoro",
    "email": "aisyah.kuncoro.22230402@siswa.belajar.id",
    "password": "$sapa$v1$37469f24043ed96424ad4260668b9fce7be18a8b249c260cf9f85a37d36b6084",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-03",
    "name": "Dimas Rahmawati",
    "email": "dimas.rahmawati.22230403@siswa.belajar.id",
    "password": "$sapa$v1$14802e531b0c762dcfa9987166491e9963e0a093b8ad8c800638be1f6638c077",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-04",
    "name": "Laila Nugraha",
    "email": "laila.nugraha.22230404@siswa.belajar.id",
    "password": "$sapa$v1$9d861ab50294e3a0a793df8c3da2fb1c373c1cef3ebd9831816fb1a5e3899639",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-05",
    "name": "Wahyu Hidayat",
    "email": "wahyu.hidayat.22230405@siswa.belajar.id",
    "password": "$sapa$v1$c108c2796093b1e9c12ea0ff04f2b76b256c9961e025ea86d312c5131e1eb1e1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-06",
    "name": "Amanda Wibowo",
    "email": "amanda.wibowo.22230406@siswa.belajar.id",
    "password": "$sapa$v1$26e03aa91918aa9152e4f234ef2d3be6dee482b2117cd8fcf4086f193bc84cde",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-07",
    "name": "Fajar Ramadhan",
    "email": "fajar.ramadhan.22230407@siswa.belajar.id",
    "password": "$sapa$v1$dc7c020d609e1c5322f96fb2d48e07ec606d8b6c05db5be2422aae897fdbe224",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-08",
    "name": "Marsha Firmansyah",
    "email": "marsha.firmansyah.22230408@siswa.belajar.id",
    "password": "$sapa$v1$721cf6a2c48b8913ddf59d1d0406a11133f859e5e8a7c946da44e36dccb33648",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-09",
    "name": "Yoga Hakim",
    "email": "yoga.hakim.22230409@siswa.belajar.id",
    "password": "$sapa$v1$f3da618426ffb96d6f239ed250ef0d3235adea1298252ab3f672c3fb652e1b3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-10",
    "name": "Anisa Anggraini",
    "email": "anisa.anggraini.22230410@siswa.belajar.id",
    "password": "$sapa$v1$cc900ccf695ba977fff6e28ad0be08bebfd4154ee18c1d8b481c2f4a76d0d3b8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-11",
    "name": "Fathir Wardhana",
    "email": "fathir.wardhana.22230411@siswa.belajar.id",
    "password": "$sapa$v1$c9c1e33bd921e893b0aa0d7a435e7f83062af083d088f21aeda4e6f94fcc9f71",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-12",
    "name": "Nabila Utomo",
    "email": "nabila.utomo.22230412@siswa.belajar.id",
    "password": "$sapa$v1$c0c94561d235ed84994ef77da50b8b976a4cc0a6db53d04d9c41d44a55f231a3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-13",
    "name": "Zack Kuswanto",
    "email": "zack.kuswanto.22230413@siswa.belajar.id",
    "password": "$sapa$v1$d77f9b6896a795de27578a722f2d310f02bfeb0dba35781551a348783369ec96",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-14",
    "name": "Aqila Kusuma",
    "email": "aqila.kusuma.22230414@siswa.belajar.id",
    "password": "$sapa$v1$aa122150077070c39c62ab937ded17cd6b9475d814aec087b95484f3530a3666",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-15",
    "name": "Gilang Mahendra",
    "email": "gilang.mahendra.22230415@siswa.belajar.id",
    "password": "$sapa$v1$940e5f39ffb544c550de3c2a778c4b96bb9591e28740c000f76f42b94c8d5a47",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-16",
    "name": "Nafisa Baskara",
    "email": "nafisa.baskara.22230416@siswa.belajar.id",
    "password": "$sapa$v1$e4da1c22b8f0c6062561ca37b179654ea776801b06f37a965c374755d450d7e8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-17",
    "name": "Zulfikar Permatasari",
    "email": "zulfikar.permatasari.22230417@siswa.belajar.id",
    "password": "$sapa$v1$4a62e51fb0d778af878ec0a3773917ba364d1f10541044eeb5573770bf9829e1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-18",
    "name": "Cantika Maulana",
    "email": "cantika.maulana.22230418@siswa.belajar.id",
    "password": "$sapa$v1$d87998e66127a918dc6fffb67d13b856df4057bd48eba53412b1b7b4ccec247a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-19",
    "name": "Ilham Setiawan",
    "email": "ilham.setiawan.22230419@siswa.belajar.id",
    "password": "$sapa$v1$cc616a27579bbe1ec1d7f03b121587f81567786688f0b7d318c5318d0f5ceada",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-20",
    "name": "Novalita Suhendra",
    "email": "novalita.suhendra.22230420@siswa.belajar.id",
    "password": "$sapa$v1$6fad5dbc53ab2b9bd482d55d9af65c3d5b592fb2b9ec730dfc8ac301776e7767",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-21",
    "name": "Candra Putra",
    "email": "candra.putra.22230421@siswa.belajar.id",
    "password": "$sapa$v1$2f89715c2d902425cdd80bbbfe58796b93c024d7a43afd31dce455ce715cb1c1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-22",
    "name": "Citra Kurnia",
    "email": "citra.kurnia.22230422@siswa.belajar.id",
    "password": "$sapa$v1$46b8cb8606a225ed6203f8c30ee057278c38d5643692d20a33e1e2dde3426976",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-23",
    "name": "Irfan Pramudya",
    "email": "irfan.pramudya.22230423@siswa.belajar.id",
    "password": "$sapa$v1$9bb2d569887a2f95e74329e46ee1a175ebc2050ca17b1d8ed3d82f42ba91330d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-24",
    "name": "Putri Lestari",
    "email": "putri.lestari.22230424@siswa.belajar.id",
    "password": "$sapa$v1$f4da41d30b84f5bc5ad94eade32b43289196870b93042f95a75fe7f0353b314c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-25",
    "name": "Ahmad Syahputra",
    "email": "ahmad.syahputra.22230425@siswa.belajar.id",
    "password": "$sapa$v1$33326e8299552dc86df63ed3d55ecc7b1e3b14b527388f935d6461bc8b0e2b0f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-26",
    "name": "Delfina Wicaksono",
    "email": "delfina.wicaksono.22230426@siswa.belajar.id",
    "password": "$sapa$v1$3eca87b36a188d7a2457e99d9d67e91eb1c2fd6363f59c3a36ef37e62f67ecfb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-27",
    "name": "Lucky Purnomo",
    "email": "lucky.purnomo.22230427@siswa.belajar.id",
    "password": "$sapa$v1$06bfb3241e240c6c16e35d63b2d9f7ef32f6202f374aac6b3d607b5ebe684bc5",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-28",
    "name": "Rania Saputra",
    "email": "rania.saputra.22230428@siswa.belajar.id",
    "password": "$sapa$v1$b0246cccd79f936364bc64a1566849e0c6cbc3e284730019180ee44d64987ec2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-29",
    "name": "Aldiansyah Safitri",
    "email": "aldiansyah.safitri.22230429@siswa.belajar.id",
    "password": "$sapa$v1$c7685cd3d15287dfaea166dbb558ac27f0b10eaff258956972e6c02ffd07d6a8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-30",
    "name": "Dian Mahardika",
    "email": "dian.mahardika.22230430@siswa.belajar.id",
    "password": "$sapa$v1$761f54ad832612699b5a4232f07d15d1c5730cad72a27709f46839b757fd0c30",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-31",
    "name": "M. Fikri Gunawan",
    "email": "m.fikri.gunawan.22230431@siswa.belajar.id",
    "password": "$sapa$v1$34abd7a36a7a516536c3d867e5e9c3460d5a8f167d30238e8e3ae455be9178f9",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-32",
    "name": "Salsabila Sujatmiko",
    "email": "salsabila.sujatmiko.22230432@siswa.belajar.id",
    "password": "$sapa$v1$3672d81016280e34d0d24459ae918618ea97fd1484dd9aee895e061afe7f660a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-33",
    "name": "Andika Nugroho",
    "email": "andika.nugroho.22230433@siswa.belajar.id",
    "password": "$sapa$v1$2e349bf8b96d40665f2f22f82dc433ec4146bcb972781f1085408b324a0b50b5",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-1-34",
    "name": "Elsa Suryanto",
    "email": "elsa.suryanto.22230434@siswa.belajar.id",
    "password": "$sapa$v1$40805df5e6b97a66e5e74c0d1729f91c39978b89750791beaade6bdba7bcfe3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822260034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-01",
    "name": "Zidan Wibowo",
    "email": "zidan.wibowo.22230501@siswa.belajar.id",
    "password": "$sapa$v1$11d66122ac80c6159ff2e017a8c4c06abea64a2e255532f592c554b581afefd3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-02",
    "name": "Aurelia Ramadhan",
    "email": "aurelia.ramadhan.22230502@siswa.belajar.id",
    "password": "$sapa$v1$361847ff32e48ce9b14d801e20caadca0254f3b2b620284b4cfda6cde30d185a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-03",
    "name": "Hafiz Firmansyah",
    "email": "hafiz.firmansyah.22230503@siswa.belajar.id",
    "password": "$sapa$v1$6780ab322e6cbef2d61f80f3c6b9a333624080d1d055c284bfc5ac6d10e01e48",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-04",
    "name": "Nayra Hakim",
    "email": "nayra.hakim.22230504@siswa.belajar.id",
    "password": "$sapa$v1$88f2ceb86bbc89cf3e385a7dc7944975b4d95023ec4bed0919ebd8b4ab23e56e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-05",
    "name": "Bintang Anggraini",
    "email": "bintang.anggraini.22230505@siswa.belajar.id",
    "password": "$sapa$v1$9c0931631785a0425e52b41e133e4039de7e4ecb664061ad63384dfae9e71955",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-06",
    "name": "Chelsea Wardhana",
    "email": "chelsea.wardhana.22230506@siswa.belajar.id",
    "password": "$sapa$v1$975fe7522f9e7086067cc074a174255f04df945e01b26ea761b2e33e82c0d380",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-07",
    "name": "Indra Utomo",
    "email": "indra.utomo.22230507@siswa.belajar.id",
    "password": "$sapa$v1$31e4521aae55e93138a5cf596daee52b173705de93080eded2ee51246810f916",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-08",
    "name": "Nurul Kuswanto",
    "email": "nurul.kuswanto.22230508@siswa.belajar.id",
    "password": "$sapa$v1$bc775778f2ba89eac17a052f6c8e658603f21c41fbd912e984171f94ade18b72",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-09",
    "name": "Dwi Kusuma",
    "email": "dwi.kusuma.22230509@siswa.belajar.id",
    "password": "$sapa$v1$84b138ada2ba770cf94407b8a945d5a1629710b75171ebe82714be25771d0d33",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-10",
    "name": "Clarissa Mahendra",
    "email": "clarissa.mahendra.22230510@siswa.belajar.id",
    "password": "$sapa$v1$215d300c6f4a5767708e5a43a95c71138cf5a54fe7eb82d836e809665bd444f4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-11",
    "name": "Kevin Baskara",
    "email": "kevin.baskara.22230511@siswa.belajar.id",
    "password": "$sapa$v1$f9c87319cdd9641d74e52ea1ef352bfd28766aca19f043605a2440222980c14a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-12",
    "name": "Raisa Permatasari",
    "email": "raisa.permatasari.22230512@siswa.belajar.id",
    "password": "$sapa$v1$7fee41191289fc2ca9a5358dc083adce6b0570f64cc8d1ece7699b0ab112586f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-13",
    "name": "Aditya Maulana",
    "email": "aditya.maulana.22230513@siswa.belajar.id",
    "password": "$sapa$v1$d892b81a4e0a7b0093f51f6df43d356cb70bdd61f205b24183d02e006d21a5ec",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-14",
    "name": "Devi Setiawan",
    "email": "devi.setiawan.22230514@siswa.belajar.id",
    "password": "$sapa$v1$01d55069dcab759bdd703b11f5fac429dd8c44927df9d3a18ecaef3da2c85c04",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-15",
    "name": "M. Rizky Suhendra",
    "email": "m.rizky.suhendra.22230515@siswa.belajar.id",
    "password": "$sapa$v1$7083e2546cb974c41eb61f6d8873fb7653252086776b36dbd25ece1482a43f89",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-16",
    "name": "Salma Putra",
    "email": "salma.putra.22230516@siswa.belajar.id",
    "password": "$sapa$v1$0dd5c6ce98f042f9fee5fda8dee13d3429f209978c9f5706854ddbb30cf4ca6c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-17",
    "name": "Alif Kurnia",
    "email": "alif.kurnia.22230517@siswa.belajar.id",
    "password": "$sapa$v1$a6c656706196b0e50228973bc6d53d407d6c10bb2f679ccb96a27fd4622ae9ec",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-18",
    "name": "Dinda Pramudya",
    "email": "dinda.pramudya.22230518@siswa.belajar.id",
    "password": "$sapa$v1$456e8ddf3a785343aebf9a6c36615d0cd89d800ebe4edc3947299284232b193c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-19",
    "name": "M. Zidan Lestari",
    "email": "m.zidan.lestari.22230519@siswa.belajar.id",
    "password": "$sapa$v1$d6a18cd8290f1991b5e4dcf30de208adc0f4c1516e6e4ef6976648cb19c7e98b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-20",
    "name": "Shifa Syahputra",
    "email": "shifa.syahputra.22230520@siswa.belajar.id",
    "password": "$sapa$v1$7b7594c1b17d0f47d1dd809fbefed67eba4346e390d1103c3512c2a2a0c6d5fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-21",
    "name": "Ardi Wicaksono",
    "email": "ardi.wicaksono.22230521@siswa.belajar.id",
    "password": "$sapa$v1$cc4870a0da52dffc70fa3067de1587e0ddcf4c0467f6d6e9516c67ba263b389c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-22",
    "name": "Febriana Purnomo",
    "email": "febriana.purnomo.22230522@siswa.belajar.id",
    "password": "$sapa$v1$d4023302124f6e5b8a0bf9097f33b70fc038347b8facd48255f8cae058a8072b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-23",
    "name": "Pratama Saputra",
    "email": "pratama.saputra.22230523@siswa.belajar.id",
    "password": "$sapa$v1$28aebf8277cf465ebd8251b015a440bfb5a4b8570921ec3a01aef72be2b9dc5e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-24",
    "name": "Syifa Safitri",
    "email": "syifa.safitri.22230524@siswa.belajar.id",
    "password": "$sapa$v1$a132f543b6afe93e86b235a6a5726e19f270b31ee57ba8b71dd40208c1604a64",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-25",
    "name": "Bagas Mahardika",
    "email": "bagas.mahardika.22230525@siswa.belajar.id",
    "password": "$sapa$v1$b9f4fa27f83e281e7e17adac498bd06071f6dc57215ed4c0ae8866e72a92b509",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-26",
    "name": "Gita Gunawan",
    "email": "gita.gunawan.22230526@siswa.belajar.id",
    "password": "$sapa$v1$f0296a3f9101dda550f6eb25ec22da0748f84a610b1482f303f05bd74ea05a76",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-27",
    "name": "Rafi Sujatmiko",
    "email": "rafi.sujatmiko.22230527@siswa.belajar.id",
    "password": "$sapa$v1$ac716956eb5428a0ce9aacaf0f7c4e89a011f20bfa53f5d600aeb8bfa4b07c3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-28",
    "name": "Tiara Nugroho",
    "email": "tiara.nugroho.22230528@siswa.belajar.id",
    "password": "$sapa$v1$2368cd812063dbf5a0201fca45ab45747fb0ff00322e27772817d09bc5e9d1eb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-29",
    "name": "Bima Suryanto",
    "email": "bima.suryanto.22230529@siswa.belajar.id",
    "password": "$sapa$v1$44f2f2d141547861c1fce61a9f56dee1fd74e7d6670f199fdcf65ac1673e66a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-30",
    "name": "Indah Pratama",
    "email": "indah.pratama.22230530@siswa.belajar.id",
    "password": "$sapa$v1$8fe1e996e7c7c9a58f7aadf477615d40889219f93ce16528dcc537bd0f6d615e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-31",
    "name": "Rendi Wahyuni",
    "email": "rendi.wahyuni.22230531@siswa.belajar.id",
    "password": "$sapa$v1$87d2fed17da67e2e00c2cb36cd2245c39d2e080bc8e23a7dee2cc5be66440c55",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-32",
    "name": "Zahra Haikal",
    "email": "zahra.haikal.22230532@siswa.belajar.id",
    "password": "$sapa$v1$b198847732b3df4cb921dbbcbd03dc265b01dfe0a8a6ff969a7c67b90498b848",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-33",
    "name": "Daffa Santoso",
    "email": "daffa.santoso.22230533@siswa.belajar.id",
    "password": "$sapa$v1$3c9ae82f4fb853e13c2174fbebd5784babea621b0831be5fe2c2d62ef1eeb248",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-tkp-2-34",
    "name": "Jessica Sudrajat",
    "email": "jessica.sudrajat.22230534@siswa.belajar.id",
    "password": "$sapa$v1$2719fd72dfb6224a8665216dde66f4a3d36f491edd3bdbff3ae860aceb326c79",
    "role": "siswa",
    "avatar": null,
    "phone": "0822270034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-01",
    "name": "Aldiansyah Wardhana",
    "email": "aldiansyah.wardhana.22230601@siswa.belajar.id",
    "password": "$sapa$v1$7e1ad775f3c7383785b2789e1a6fb7b48ce379ac360a9c128f6f789e87434c0e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-02",
    "name": "Dian Utomo",
    "email": "dian.utomo.22230602@siswa.belajar.id",
    "password": "$sapa$v1$87f2facef5db795f9799867375b52317630f60970679157222f2221d052b1f32",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-03",
    "name": "M. Fikri Kuswanto",
    "email": "m.fikri.kuswanto.22230603@siswa.belajar.id",
    "password": "$sapa$v1$9043d6447292073258282ce14c12b6b2117ddd750200fa281a9e2456cbc2814d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-04",
    "name": "Salsabila Kusuma",
    "email": "salsabila.kusuma.22230604@siswa.belajar.id",
    "password": "$sapa$v1$6ebbaf9b20f283d03f625c1022d6eb44fbabad933b7195f3b45fd82b3d931ff6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-05",
    "name": "Andika Mahendra",
    "email": "andika.mahendra.22230605@siswa.belajar.id",
    "password": "$sapa$v1$9a15b8a4bb33cecfd8d1c878a1c55bc8b4040163e2cc22ffbd010b6fa70ca500",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-06",
    "name": "Elsa Baskara",
    "email": "elsa.baskara.22230606@siswa.belajar.id",
    "password": "$sapa$v1$51c45c02275111564ddc0c759b96eae2e1ec9d2dcfd3d89a42d5c774d6fd83f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-07",
    "name": "Naufal Permatasari",
    "email": "naufal.permatasari.22230607@siswa.belajar.id",
    "password": "$sapa$v1$1368ee03ef5384824417575d44b585645d06383666110cdcbbc18a4c6b7a5a47",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-08",
    "name": "Siti Maulana",
    "email": "siti.maulana.22230608@siswa.belajar.id",
    "password": "$sapa$v1$86ea87b4809c607e9efc7a0c581d7f1d3d339da8cd32d1212e45033aa45e100f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-09",
    "name": "Arya Setiawan",
    "email": "arya.setiawan.22230609@siswa.belajar.id",
    "password": "$sapa$v1$0ef5fbb58e91350188b870d644c441fc024f38c3097ad5e368a110a3b72d2096",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-10",
    "name": "Fitri Suhendra",
    "email": "fitri.suhendra.22230610@siswa.belajar.id",
    "password": "$sapa$v1$4babfe1493a82fc4fc8cfacb44e3827590e8c28df130adb999cb886ebb25dfed",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-11",
    "name": "Raditya Putra",
    "email": "raditya.putra.22230611@siswa.belajar.id",
    "password": "$sapa$v1$5fdd8aa56d691ad83435d21acfe317ed6bb0531e83952c52e0c0785d580efe45",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-12",
    "name": "Tania Kurnia",
    "email": "tania.kurnia.22230612@siswa.belajar.id",
    "password": "$sapa$v1$6f7c02ecf97e76bfbac472e0969ad5bb31fa35c8d4e4ad76dc2fcfa0c7f6f302",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-13",
    "name": "Bayu Pramudya",
    "email": "bayu.pramudya.22230613@siswa.belajar.id",
    "password": "$sapa$v1$010d9f6a5350a8a53939e5f80a86c86b8630e72e8f063962e0496ccbf962111c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-14",
    "name": "Hana Lestari",
    "email": "hana.lestari.22230614@siswa.belajar.id",
    "password": "$sapa$v1$fb4567abd5d1e9c8b5b3d75632254ec6ac7b27c3d222b0d664d47940a1cdec04",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-15",
    "name": "Rangga Syahputra",
    "email": "rangga.syahputra.22230615@siswa.belajar.id",
    "password": "$sapa$v1$865bd23bf80db80c8626d05872c1a22748f7f9d8b08d3df96803e62ed3f8fe4b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-16",
    "name": "Vania Wicaksono",
    "email": "vania.wicaksono.22230616@siswa.belajar.id",
    "password": "$sapa$v1$937c5ab020d90ecbfef788026566b0dc52c9fa144579bdcd3c27596289fbfd3c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-17",
    "name": "Danendra Purnomo",
    "email": "danendra.purnomo.22230617@siswa.belajar.id",
    "password": "$sapa$v1$545c71c68241463c1d293c9bf701d4fdc1524f3016f66957c9ee47b0fec19a4e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-18",
    "name": "Intan Saputra",
    "email": "intan.saputra.22230618@siswa.belajar.id",
    "password": "$sapa$v1$5c9ba6e492f138cadca5679a1d19c5af82a4a97e28acf7aa979a0b3b81a549b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-19",
    "name": "Revan Safitri",
    "email": "revan.safitri.22230619@siswa.belajar.id",
    "password": "$sapa$v1$3bb95f501939c6ef334244d4771e6c2c5d5fec55ac51c326a83ab9cf70a40a82",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-20",
    "name": "Zaskia Mahardika",
    "email": "zaskia.mahardika.22230620@siswa.belajar.id",
    "password": "$sapa$v1$28812e7e8eda5d0fad98936e2b9abc83729b6bde43fec1b3f346447cd88c3593",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-21",
    "name": "Dennis Gunawan",
    "email": "dennis.gunawan.22230621@siswa.belajar.id",
    "password": "$sapa$v1$34ee0a5703bb1e325102d8fcddc58516781c55be4216dccb11a2cc3e8aecbb97",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-22",
    "name": "Kayla Sujatmiko",
    "email": "kayla.sujatmiko.22230622@siswa.belajar.id",
    "password": "$sapa$v1$3f891d5222ed7c4aa23cfd655a73b1e449c91bff2c75a14ca99a17bb7383c148",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-23",
    "name": "Satria Nugroho",
    "email": "satria.nugroho.22230623@siswa.belajar.id",
    "password": "$sapa$v1$34f1cb7627f0c8261faf0926be83d46f5303bdf5ced3178fb35bc300c2c08c80",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-24",
    "name": "Aisyah Suryanto",
    "email": "aisyah.suryanto.22230624@siswa.belajar.id",
    "password": "$sapa$v1$2576dda82d4dafd5c81b69f78f482cbf906faa8791b1fbd3b747a3c856d0521e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-25",
    "name": "Dimas Pratama",
    "email": "dimas.pratama.22230625@siswa.belajar.id",
    "password": "$sapa$v1$e914e27b256f95156ea5d655b7c6d937091bbcfb512eeb6a47c7b0695fe4d96b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-26",
    "name": "Laila Wahyuni",
    "email": "laila.wahyuni.22230626@siswa.belajar.id",
    "password": "$sapa$v1$f2c7055bf32488630d1dddd33d20220e3c80f8561ad26898e30976ccd71ebe8f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-27",
    "name": "Wahyu Haikal",
    "email": "wahyu.haikal.22230627@siswa.belajar.id",
    "password": "$sapa$v1$8d94aa242f45864dd961d376eba6f029fa4e016728c2b9fd35db68671da66b58",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-28",
    "name": "Amanda Santoso",
    "email": "amanda.santoso.22230628@siswa.belajar.id",
    "password": "$sapa$v1$de6188f8f0776f9a66ffdf7bd51ca2765aae83171d838bb75f7f2401896da9a6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-29",
    "name": "Fajar Sudrajat",
    "email": "fajar.sudrajat.22230629@siswa.belajar.id",
    "password": "$sapa$v1$4c3ad35566072d5f4d83981e6c466372f987924c1632d0dcfb7be1b4db61c125",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-30",
    "name": "Marsha Wijaya",
    "email": "marsha.wijaya.22230630@siswa.belajar.id",
    "password": "$sapa$v1$9cf14741619cc7efc88ac528b418897820da59c03363f651fa7de8d832c4a759",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-31",
    "name": "Yoga Pangestu",
    "email": "yoga.pangestu.22230631@siswa.belajar.id",
    "password": "$sapa$v1$1dfae3c7813f7937ce57e8c2d03c014c47ddd5ea9b4c5ce873281e37e1ae12b0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-32",
    "name": "Anisa Kuncoro",
    "email": "anisa.kuncoro.22230632@siswa.belajar.id",
    "password": "$sapa$v1$ab8e102227deb8abe5ec7160df5b0d26602348cef0e8de48b351b028198f10e4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-33",
    "name": "Fathir Rahmawati",
    "email": "fathir.rahmawati.22230633@siswa.belajar.id",
    "password": "$sapa$v1$62f51ec3a7abbab03e55e695c1dea299f29677682cda099831d11f26ca57da11",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-1-34",
    "name": "Nabila Nugraha",
    "email": "nabila.nugraha.22230634@siswa.belajar.id",
    "password": "$sapa$v1$3832538da3ad489720aa4372e1507a1f725431ff60837eb054cec0604d8aec52",
    "role": "siswa",
    "avatar": null,
    "phone": "0822280034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-01",
    "name": "Bima Baskara",
    "email": "bima.baskara.22230701@siswa.belajar.id",
    "password": "$sapa$v1$f01b78175832128074aa472dc9847f59416a51244f8b37a860108b6d223ef305",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-02",
    "name": "Indah Permatasari",
    "email": "indah.permatasari.22230702@siswa.belajar.id",
    "password": "$sapa$v1$c5f2e5f24615adcd8c521bfc9d1bd74ebf64cd3d3958d1744463a4368bb38228",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-03",
    "name": "Rendi Maulana",
    "email": "rendi.maulana.22230703@siswa.belajar.id",
    "password": "$sapa$v1$417e7aad6ea2827dd82c7da457cdb0615317f18ac5a3be39bd4bc57231b71ada",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-04",
    "name": "Zahra Setiawan",
    "email": "zahra.setiawan.22230704@siswa.belajar.id",
    "password": "$sapa$v1$2f9afdf07d0a7d16642e6cd62b79ca0337fcfa4af94ae7d24fe093caada7eeb4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-05",
    "name": "Daffa Suhendra",
    "email": "daffa.suhendra.22230705@siswa.belajar.id",
    "password": "$sapa$v1$c7319b84d4478a0c7679bcddbd3bfb01d8a9ececad51ea274fb9e545224ff617",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-06",
    "name": "Jessica Putra",
    "email": "jessica.putra.22230706@siswa.belajar.id",
    "password": "$sapa$v1$940c52e73573e0ccfe842abe7bc3907a3f2e61cc255a74d1c4dc7db1d1465992",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-07",
    "name": "Rian Kurnia",
    "email": "rian.kurnia.22230707@siswa.belajar.id",
    "password": "$sapa$v1$6cda12a71463f3133c0e988fd5cef071be7971a0078f3ddcbcc86f3b42788266",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-08",
    "name": "Adinda Pramudya",
    "email": "adinda.pramudya.22230708@siswa.belajar.id",
    "password": "$sapa$v1$1da35a3d21df5c797a9216143896cb91bb84f9a6301f840a5ace5e92d85aedba",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-09",
    "name": "Desta Lestari",
    "email": "desta.lestari.22230709@siswa.belajar.id",
    "password": "$sapa$v1$9c9d48e1e83d18a4c14c851eb2075de72af8883aa06fdbefa541945e40a3fad0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-10",
    "name": "Keisha Syahputra",
    "email": "keisha.syahputra.22230710@siswa.belajar.id",
    "password": "$sapa$v1$edd057259710bec434c139493ddfd18f4a245f083d0f75c7010da45c60daadf0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-11",
    "name": "Tegar Wicaksono",
    "email": "tegar.wicaksono.22230711@siswa.belajar.id",
    "password": "$sapa$v1$0ba470e756422d31702461460e445fe96b1a95063d1b25feb821f15f4b69e043",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-12",
    "name": "Alifa Purnomo",
    "email": "alifa.purnomo.22230712@siswa.belajar.id",
    "password": "$sapa$v1$69273c70853f97591e89f77c73ade224d8f8cf55717f44c598f7bf5b3570477d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-13",
    "name": "Fadhil Saputra",
    "email": "fadhil.saputra.22230713@siswa.belajar.id",
    "password": "$sapa$v1$c7aa7d7ee6d6eb9b65e640505d510e34d29438c1995dc5295b4e629e077e75f2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-14",
    "name": "Laras Safitri",
    "email": "laras.safitri.22230714@siswa.belajar.id",
    "password": "$sapa$v1$b805fc9811d7c7a36eedfdee54e095a69ea9e5df78397365c3feabcf6f960f57",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-15",
    "name": "Wawan Mahardika",
    "email": "wawan.mahardika.22230715@siswa.belajar.id",
    "password": "$sapa$v1$5780c08dd69613cc0393144a039f3fd586c6e7044b0c7a32dccbc34489600923",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-16",
    "name": "Anindya Gunawan",
    "email": "anindya.gunawan.22230716@siswa.belajar.id",
    "password": "$sapa$v1$f555654a4ff572486261129978632c8e7f891fd9bbe48b96a7784c95410e3459",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-17",
    "name": "Farhan Sujatmiko",
    "email": "farhan.sujatmiko.22230717@siswa.belajar.id",
    "password": "$sapa$v1$fd96485a98571e0343b92b79f8e280237e82359969f7b32c16d756ed58acd632",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-18",
    "name": "Maulida Nugroho",
    "email": "maulida.nugroho.22230718@siswa.belajar.id",
    "password": "$sapa$v1$46cdb635d385da35d2fd42e761709e9bf5595ec345890bc906c0632759a19b46",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-19",
    "name": "Yusuf Suryanto",
    "email": "yusuf.suryanto.22230719@siswa.belajar.id",
    "password": "$sapa$v1$5615ab16bb0b5d16ca5fd60d681107975b7658ed25837940cb07bbe46f5dee33",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-20",
    "name": "Annisa Pratama",
    "email": "annisa.pratama.22230720@siswa.belajar.id",
    "password": "$sapa$v1$661b587677effb0fe8f772683af6201e4fb92352df60ec1cb46b569a63d0d8d2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-21",
    "name": "Galih Wahyuni",
    "email": "galih.wahyuni.22230721@siswa.belajar.id",
    "password": "$sapa$v1$c8547a323aa0e792bdbcfa1b7b0d4679956318f62b97d0cc6a926076ab21ab62",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-22",
    "name": "Nadira Haikal",
    "email": "nadira.haikal.22230722@siswa.belajar.id",
    "password": "$sapa$v1$589107117fdc87ce6afbaff456636f677b9e8a6bb4922064a2c1578f7dfb36a9",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-23",
    "name": "Zidan Santoso",
    "email": "zidan.santoso.22230723@siswa.belajar.id",
    "password": "$sapa$v1$a30d8c7d0a38dea462bf733434e7aefbcc1e0c2a2aa73dd28137f95c21b59dbc",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-24",
    "name": "Aurelia Sudrajat",
    "email": "aurelia.sudrajat.22230724@siswa.belajar.id",
    "password": "$sapa$v1$c54f0e3ba5d0cfd54d012cba5d061e7e9a8ba6caed1e17c00e39784c9940ee52",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-25",
    "name": "Hafiz Wijaya",
    "email": "hafiz.wijaya.22230725@siswa.belajar.id",
    "password": "$sapa$v1$c5f7ac86178f8bc14eb02cea4aed050646d38ec9c4df2b62aca6340a1e695ed1",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-26",
    "name": "Nayra Pangestu",
    "email": "nayra.pangestu.22230726@siswa.belajar.id",
    "password": "$sapa$v1$7eba646b5deea1d72a6a769ead4e9a5b4c72128632ceb17c5dc7af7c30a78527",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-27",
    "name": "Bintang Kuncoro",
    "email": "bintang.kuncoro.22230727@siswa.belajar.id",
    "password": "$sapa$v1$03b98c96325b9128c86699344832db0f701b9ae222ca4935aa35bdfae5d2a17a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-28",
    "name": "Chelsea Rahmawati",
    "email": "chelsea.rahmawati.22230728@siswa.belajar.id",
    "password": "$sapa$v1$4324abeca3140a45001b2a775b83888e9edf03b1a6418ea450eef0d2f9a7d48b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-29",
    "name": "Indra Nugraha",
    "email": "indra.nugraha.22230729@siswa.belajar.id",
    "password": "$sapa$v1$a2b941b3d8ca2c2e78e34ae835497edba4a636ed6c2ea0c2261a8675fe113f3d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-30",
    "name": "Nurul Hidayat",
    "email": "nurul.hidayat.22230730@siswa.belajar.id",
    "password": "$sapa$v1$66c71c1a4d15cfbe02f383a7441cd83d0fd7bb6b5242b29cdc30ce8239a6c6c3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-31",
    "name": "Dwi Wibowo",
    "email": "dwi.wibowo.22230731@siswa.belajar.id",
    "password": "$sapa$v1$d2f9a29fc302ff75edc0b27b62a3f7f8594a710e20bad04b352bdf53b9730722",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-32",
    "name": "Clarissa Ramadhan",
    "email": "clarissa.ramadhan.22230732@siswa.belajar.id",
    "password": "$sapa$v1$640c7df980fd7fc37352fdedb26900ba3aee74ee596a8565b13486ffc208a02b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-33",
    "name": "Kevin Firmansyah",
    "email": "kevin.firmansyah.22230733@siswa.belajar.id",
    "password": "$sapa$v1$698a2f626c5ae16a671ba036b6d38858011bef25496bae73e8f4525d1438f048",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-2-34",
    "name": "Raisa Hakim",
    "email": "raisa.hakim.22230734@siswa.belajar.id",
    "password": "$sapa$v1$02830f5e4eeefb60df49384ed6e81c7af43f08ed04951019e0904fd83c01dbdc",
    "role": "siswa",
    "avatar": null,
    "phone": "0822290034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-01",
    "name": "Fajar Putra",
    "email": "fajar.putra.22230801@siswa.belajar.id",
    "password": "$sapa$v1$1ba33d5539659c5311642dc2b8154dd8b747b9bdc3d2be18b773cb8d4c534c06",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-02",
    "name": "Marsha Kurnia",
    "email": "marsha.kurnia.22230802@siswa.belajar.id",
    "password": "$sapa$v1$5595431c60864257264f7c5264cb7b82569cb33822a149d817c014fff2283e92",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-03",
    "name": "Yoga Pramudya",
    "email": "yoga.pramudya.22230803@siswa.belajar.id",
    "password": "$sapa$v1$2e0276f4a12ac29a6da50c5083fbcac1d373c5dd81b0997bf0e68d0ce9e8dbb8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-04",
    "name": "Anisa Lestari",
    "email": "anisa.lestari.22230804@siswa.belajar.id",
    "password": "$sapa$v1$0f7f7c296fc10800d403ca9f07a9c11b65d6e438b3c2a84aad379c5b0078fb4e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-05",
    "name": "Fathir Syahputra",
    "email": "fathir.syahputra.22230805@siswa.belajar.id",
    "password": "$sapa$v1$901f025483d9a19827c93ea10925ce9c173ec82bbc3783fafa603bf8c17c9bed",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-06",
    "name": "Nabila Wicaksono",
    "email": "nabila.wicaksono.22230806@siswa.belajar.id",
    "password": "$sapa$v1$c72b1c6d4d9ea4d1c375720a0287914b9de6bf58261284da1603680ac2cf45cc",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-07",
    "name": "Zack Purnomo",
    "email": "zack.purnomo.22230807@siswa.belajar.id",
    "password": "$sapa$v1$ac7730df066cf7809c37c3b4ecedd7af21565ed071456ef5b00f1f1d1ee1b268",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-08",
    "name": "Aqila Saputra",
    "email": "aqila.saputra.22230808@siswa.belajar.id",
    "password": "$sapa$v1$7198716007fd4fe0de9e77d2b7c1b7356ad50e54f31fafc7321d0b0ecef121ab",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-09",
    "name": "Gilang Safitri",
    "email": "gilang.safitri.22230809@siswa.belajar.id",
    "password": "$sapa$v1$a116147abe0c7e5cbcd593353da1829527cf2e70eed75bfc7c4744570b767b3b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-10",
    "name": "Nafisa Mahardika",
    "email": "nafisa.mahardika.22230810@siswa.belajar.id",
    "password": "$sapa$v1$a85a68d919a2a758fdba590bbfb700fff227b1b9511e82e3bd84580bb603b443",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-11",
    "name": "Zulfikar Gunawan",
    "email": "zulfikar.gunawan.22230811@siswa.belajar.id",
    "password": "$sapa$v1$71d673876a8278af5848790bc27292fb673284d07ff5ff45586ee69a1eb3c369",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-12",
    "name": "Cantika Sujatmiko",
    "email": "cantika.sujatmiko.22230812@siswa.belajar.id",
    "password": "$sapa$v1$7562af8e1079d682f536dca79dc08dd74992f2d0015a2dfdcb4e2f8eeabf4c1f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-13",
    "name": "Ilham Nugroho",
    "email": "ilham.nugroho.22230813@siswa.belajar.id",
    "password": "$sapa$v1$fb010197a234afb19ee429e5883ead50e281af70a39f78d638e47060765f6bd7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-14",
    "name": "Novalita Suryanto",
    "email": "novalita.suryanto.22230814@siswa.belajar.id",
    "password": "$sapa$v1$6b581af560cfcdae723edc90613436097657a88d816a3e4a88786a76ef929cb3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-15",
    "name": "Candra Pratama",
    "email": "candra.pratama.22230815@siswa.belajar.id",
    "password": "$sapa$v1$5f482c6dba76795624bdb4bd23d3f9ab03b0ff070099243ea7748201bd953856",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-16",
    "name": "Citra Wahyuni",
    "email": "citra.wahyuni.22230816@siswa.belajar.id",
    "password": "$sapa$v1$445d4013aee2cca2f928801c97a127b0076bad5381fc7af25fc120f81428cf00",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-17",
    "name": "Irfan Haikal",
    "email": "irfan.haikal.22230817@siswa.belajar.id",
    "password": "$sapa$v1$c2fb8946c1f32dd32d218d866671f4c1b7d6ac455e20e99407825335829edd2d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-18",
    "name": "Putri Santoso",
    "email": "putri.santoso.22230818@siswa.belajar.id",
    "password": "$sapa$v1$62d0ed94ff0f005fbff2281be2c80881e7fbe6b080f051603daba9240f9baf9d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-19",
    "name": "Ahmad Sudrajat",
    "email": "ahmad.sudrajat.22230819@siswa.belajar.id",
    "password": "$sapa$v1$7cd6cb45af39ed58d59f1b588ca4170f7a15eabda6bb25db929e37b0a347ce61",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-20",
    "name": "Delfina Wijaya",
    "email": "delfina.wijaya.22230820@siswa.belajar.id",
    "password": "$sapa$v1$4d4001a46cf6093af413b99d1622bbc4d59d0a563a25cd8707d55bc8eb1d12cb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-21",
    "name": "Lucky Pangestu",
    "email": "lucky.pangestu.22230821@siswa.belajar.id",
    "password": "$sapa$v1$894b5bbb05264be056870389769b792f7e3b53d3ae6f7362eedc1bb2be178274",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-22",
    "name": "Rania Kuncoro",
    "email": "rania.kuncoro.22230822@siswa.belajar.id",
    "password": "$sapa$v1$d16aaa319a26b2b7b47b468cbff38331ab78d2648abed738eb12b1a078157568",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-23",
    "name": "Aldiansyah Rahmawati",
    "email": "aldiansyah.rahmawati.22230823@siswa.belajar.id",
    "password": "$sapa$v1$0e2cbfc85bec93212a422d8c8e5a20a5d4dc573963fbcda311a8da7136944d2c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-24",
    "name": "Dian Nugraha",
    "email": "dian.nugraha.22230824@siswa.belajar.id",
    "password": "$sapa$v1$d6d92306fddac2cd4bc83f5ee809e56848fff13af8f3cc685162dc2475ba00b3",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-25",
    "name": "M. Fikri Hidayat",
    "email": "m.fikri.hidayat.22230825@siswa.belajar.id",
    "password": "$sapa$v1$8c4100c43a01b4f367ee123b7b6382195a9fcd04880761ea60e77c5ad5791d93",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-26",
    "name": "Salsabila Wibowo",
    "email": "salsabila.wibowo.22230826@siswa.belajar.id",
    "password": "$sapa$v1$a79dcba2ca6e5e181fc165b6bb02219b6168b94eaf14d8c05ff47664cc7eda51",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-27",
    "name": "Andika Ramadhan",
    "email": "andika.ramadhan.22230827@siswa.belajar.id",
    "password": "$sapa$v1$816c3167998bb5e05f0250e37980a2a067574f45705ee8b8f7a67a11ffc4411a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-28",
    "name": "Elsa Firmansyah",
    "email": "elsa.firmansyah.22230828@siswa.belajar.id",
    "password": "$sapa$v1$b8fd12e6c2ee644f92d510673011caa05bac05580e34e548b6b832ebd29b7d8d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-29",
    "name": "Naufal Hakim",
    "email": "naufal.hakim.22230829@siswa.belajar.id",
    "password": "$sapa$v1$3adc26cd1dbe4f40b1b225aa5a98295c255d2b1d163786d885b05ba3b5bb1330",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-30",
    "name": "Siti Anggraini",
    "email": "siti.anggraini.22230830@siswa.belajar.id",
    "password": "$sapa$v1$b2b9253e7f4c89a13d59a099e86125fd2e8f3ca7464f142dba4b944868c65044",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-31",
    "name": "Arya Wardhana",
    "email": "arya.wardhana.22230831@siswa.belajar.id",
    "password": "$sapa$v1$a3ff17d3155b5dcd70116e4123295abeb23615aa87bf265ab85ddca260d96741",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-32",
    "name": "Fitri Utomo",
    "email": "fitri.utomo.22230832@siswa.belajar.id",
    "password": "$sapa$v1$93b3c678f116173cc15036dd9dfcfb1a2fa59b5d5a8e106f7e2e601645cbda82",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-33",
    "name": "Raditya Kuswanto",
    "email": "raditya.kuswanto.22230833@siswa.belajar.id",
    "password": "$sapa$v1$1861cc90ce45792ecef5d300ee662c2a636a12c6c76e296245a62e62c84dc6a6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-to-3-34",
    "name": "Tania Kusuma",
    "email": "tania.kusuma.22230834@siswa.belajar.id",
    "password": "$sapa$v1$690194d1e5adad62ee79aa97f2b739bae2c63aa0ee6163235be46470d6fec03a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822300034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-01",
    "name": "Indra Wicaksono",
    "email": "indra.wicaksono.22230901@siswa.belajar.id",
    "password": "$sapa$v1$f029bc07f24ff7ba67a896599264b1785cab5d5b99a878c57a5fb3daa79e9e06",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-02",
    "name": "Nurul Purnomo",
    "email": "nurul.purnomo.22230902@siswa.belajar.id",
    "password": "$sapa$v1$bf74d0139e228c81c398e58ff98eb2f63c909550fbc3438a9c6c256631abc3eb",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-03",
    "name": "Dwi Saputra",
    "email": "dwi.saputra.22230903@siswa.belajar.id",
    "password": "$sapa$v1$bf3cce275704588c5d896decfbea355a36ab1d444f29ee6d71cda823e18a7213",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-04",
    "name": "Clarissa Safitri",
    "email": "clarissa.safitri.22230904@siswa.belajar.id",
    "password": "$sapa$v1$40656d669275619dbcf41d4ccfc0cc33310f7dc3affff8dc57f5ab79fdd7a5b2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-05",
    "name": "Kevin Mahardika",
    "email": "kevin.mahardika.22230905@siswa.belajar.id",
    "password": "$sapa$v1$816f16ef1fd8537ec70925d2173a94a6736ed38e0bf75f2055e4ff75737b340d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-06",
    "name": "Raisa Gunawan",
    "email": "raisa.gunawan.22230906@siswa.belajar.id",
    "password": "$sapa$v1$23674e2d8c87ef974ec262fdb1002bc88f3cca793aacfb004a1770f41cb444a4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-07",
    "name": "Aditya Sujatmiko",
    "email": "aditya.sujatmiko.22230907@siswa.belajar.id",
    "password": "$sapa$v1$2af6838b9813fcd35d3cf3559667c9afe0944d3143494158a94dd10c0ed7ca0d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-08",
    "name": "Devi Nugroho",
    "email": "devi.nugroho.22230908@siswa.belajar.id",
    "password": "$sapa$v1$54491a655a6e1ce137b0242bc1d0522f02e45eddd5cb61a28b011a121caa3adf",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-09",
    "name": "M. Rizky Suryanto",
    "email": "m.rizky.suryanto.22230909@siswa.belajar.id",
    "password": "$sapa$v1$94dd2cffc64609575aebe77e0bb428869e93cedb18b190369934a10eca076c0d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-10",
    "name": "Salma Pratama",
    "email": "salma.pratama.22230910@siswa.belajar.id",
    "password": "$sapa$v1$ddb869518d19dc859ccb349914447cf4422414a35660bb5dce912b99dd549767",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-11",
    "name": "Alif Wahyuni",
    "email": "alif.wahyuni.22230911@siswa.belajar.id",
    "password": "$sapa$v1$dc7dc4710ae3986d93ae0236150979173777c9b3ada6eb55d396148a03132e77",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-12",
    "name": "Dinda Haikal",
    "email": "dinda.haikal.22230912@siswa.belajar.id",
    "password": "$sapa$v1$91dc3670d8cfd77e5c393c6a59db21c40482f3fb46c72235f4953bf68f3e900c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-13",
    "name": "M. Zidan Santoso",
    "email": "m.zidan.santoso.22230913@siswa.belajar.id",
    "password": "$sapa$v1$a0e39ffa94caadab6d858977064dc467562bff52698420cd01ed70409c2c9625",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-14",
    "name": "Shifa Sudrajat",
    "email": "shifa.sudrajat.22230914@siswa.belajar.id",
    "password": "$sapa$v1$22757206d08d598ae79083547ebb31d315cda686a831d50660199d0e855786fa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-15",
    "name": "Ardi Wijaya",
    "email": "ardi.wijaya.22230915@siswa.belajar.id",
    "password": "$sapa$v1$7b0b8220bfe491a757fb24fae47e07c84dc3af9d051ca8aebb7011d387d6b590",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-16",
    "name": "Febriana Pangestu",
    "email": "febriana.pangestu.22230916@siswa.belajar.id",
    "password": "$sapa$v1$ab066812e3b16a389e4053a0ff919a23bc031840c45768d910a165d9a3f2f6b4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-17",
    "name": "Pratama Kuncoro",
    "email": "pratama.kuncoro.22230917@siswa.belajar.id",
    "password": "$sapa$v1$4c31501acb8ceadf3c1981626361addaa6e826c5713d6751ca0146bd0207ddc6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-18",
    "name": "Syifa Rahmawati",
    "email": "syifa.rahmawati.22230918@siswa.belajar.id",
    "password": "$sapa$v1$3252454f03638f1b4b794d5433742b4f5346dba176bdae0e11244b043b704ebf",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-19",
    "name": "Bagas Nugraha",
    "email": "bagas.nugraha.22230919@siswa.belajar.id",
    "password": "$sapa$v1$97bd6fe86f1617da3ced72255b4922b85e313bd0b3d808b8ece94814f1c4794c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-20",
    "name": "Gita Hidayat",
    "email": "gita.hidayat.22230920@siswa.belajar.id",
    "password": "$sapa$v1$6c73289106fa3cb7021033cfec568aca9648536f61f7d682a98147a305959db5",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-21",
    "name": "Rafi Wibowo",
    "email": "rafi.wibowo.22230921@siswa.belajar.id",
    "password": "$sapa$v1$5a24ddf7c7d4eeb14be9294efc90d66820c356f316b3a51e12072bd5b636fbed",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-22",
    "name": "Tiara Ramadhan",
    "email": "tiara.ramadhan.22230922@siswa.belajar.id",
    "password": "$sapa$v1$0f23eda9d1c68a3c6418d799af351a8aa6aa5c86bf7b3cfd5fcdb8e593c9c714",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-23",
    "name": "Bima Firmansyah",
    "email": "bima.firmansyah.22230923@siswa.belajar.id",
    "password": "$sapa$v1$2a108d941bc0115cc9156d17a7ec4f5f1242a6068b75ac281aacaffc84f0ab3e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-24",
    "name": "Indah Hakim",
    "email": "indah.hakim.22230924@siswa.belajar.id",
    "password": "$sapa$v1$d90ba908168a1d3efc47be5cfca88ca971f37a8ad40f4b153784dbdb584793da",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-25",
    "name": "Rendi Anggraini",
    "email": "rendi.anggraini.22230925@siswa.belajar.id",
    "password": "$sapa$v1$979263c25f0d6c7e0cb79e6db540a63f01fda3c47c96d2af4abf231584e1f47c",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-26",
    "name": "Zahra Wardhana",
    "email": "zahra.wardhana.22230926@siswa.belajar.id",
    "password": "$sapa$v1$e45290af081f4aa58dd30f9930ab8842a4359a59ab1958b6e3c86bcb848ff995",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-27",
    "name": "Daffa Utomo",
    "email": "daffa.utomo.22230927@siswa.belajar.id",
    "password": "$sapa$v1$eb38c5e1fee70018abdfc1ddffb233ad88cca46cebc52c0ea290a8b3096cd6e6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-28",
    "name": "Jessica Kuswanto",
    "email": "jessica.kuswanto.22230928@siswa.belajar.id",
    "password": "$sapa$v1$56d67aaf9214ba0f604a48be4c62de91006501d7c0145c429e8c8dd54f2ee170",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-29",
    "name": "Rian Kusuma",
    "email": "rian.kusuma.22230929@siswa.belajar.id",
    "password": "$sapa$v1$2a7939ce056001f325ecce9c8126468824eb54f07c4771242bd6cd58b251bb69",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-30",
    "name": "Adinda Mahendra",
    "email": "adinda.mahendra.22230930@siswa.belajar.id",
    "password": "$sapa$v1$d04fa0eae785803c08cb06c9a9ec165c9260551f03e65983ec6e5215cdc48411",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-31",
    "name": "Desta Baskara",
    "email": "desta.baskara.22230931@siswa.belajar.id",
    "password": "$sapa$v1$4f2481893ff4a424ea15e1380c08bb41a8de54c76440cd32e1948628a673b8c4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-32",
    "name": "Keisha Permatasari",
    "email": "keisha.permatasari.22230932@siswa.belajar.id",
    "password": "$sapa$v1$0367001bc1c260c3370102d44169324d7c581962e27a53ff172dd27b8873f825",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-33",
    "name": "Tegar Maulana",
    "email": "tegar.maulana.22230933@siswa.belajar.id",
    "password": "$sapa$v1$6789da0296624b4506de1bbf018972347a92273148d2e7a99904c1a53d0f6efa",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-1-34",
    "name": "Alifa Setiawan",
    "email": "alifa.setiawan.22230934@siswa.belajar.id",
    "password": "$sapa$v1$00ae97a3db0e65e3628f13113528c9345f215fcaeaefb8d62a3f1447c22152a9",
    "role": "siswa",
    "avatar": null,
    "phone": "0822310034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-01",
    "name": "Naufal Gunawan",
    "email": "naufal.gunawan.22231001@siswa.belajar.id",
    "password": "$sapa$v1$6c74702b1d102c8a9af936b990d6d2c2553ae3858926cb67cbb58d556348a35e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-02",
    "name": "Siti Sujatmiko",
    "email": "siti.sujatmiko.22231002@siswa.belajar.id",
    "password": "$sapa$v1$e8409d007c8dc75a32dc81e2531188941a9d8e571cf61ee364455731d51ee644",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-03",
    "name": "Arya Nugroho",
    "email": "arya.nugroho.22231003@siswa.belajar.id",
    "password": "$sapa$v1$fb05f7e42cdc2af1ed9324b1e7d2ae75a616a8f93f7c4b9ecf596bc6b578bd62",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-04",
    "name": "Fitri Suryanto",
    "email": "fitri.suryanto.22231004@siswa.belajar.id",
    "password": "$sapa$v1$9ebb3820ec1758b626028a69623a4b70d84b0d02fdb55c748db8dd8716626f38",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-05",
    "name": "Raditya Pratama",
    "email": "raditya.pratama.22231005@siswa.belajar.id",
    "password": "$sapa$v1$9c7a886fd5681edb0ffdbee916316d67baae84fe5d78d7f0de36ef1aee3d3c0f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-06",
    "name": "Tania Wahyuni",
    "email": "tania.wahyuni.22231006@siswa.belajar.id",
    "password": "$sapa$v1$a1a21a223e395f2a6c2137008a65722d86dfa60d74a06a30cb11265feb50eef2",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-07",
    "name": "Bayu Haikal",
    "email": "bayu.haikal.22231007@siswa.belajar.id",
    "password": "$sapa$v1$02706b4d8fe94094ce93c6b404361878de0aec926ce6f2e9e7a2bce6ec67cb83",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-08",
    "name": "Hana Santoso",
    "email": "hana.santoso.22231008@siswa.belajar.id",
    "password": "$sapa$v1$fb81c00286ae71d36a8e5e71b115cf09990d45859da6608da1f9f354bb7b35a7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-09",
    "name": "Rangga Sudrajat",
    "email": "rangga.sudrajat.22231009@siswa.belajar.id",
    "password": "$sapa$v1$439e36d21c2a675c0f7c4d8e3906c2de2741d925bfe2370906d340da574e3055",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-10",
    "name": "Vania Wijaya",
    "email": "vania.wijaya.22231010@siswa.belajar.id",
    "password": "$sapa$v1$8907052d4b133a93513f258a17359e643fd17003b0a4d8d9c969f3cd3f1c7422",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-11",
    "name": "Danendra Pangestu",
    "email": "danendra.pangestu.22231011@siswa.belajar.id",
    "password": "$sapa$v1$83289a0116e660305941450cbe1687840bd1c87c3a8084dedbe55fffac47cd60",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-12",
    "name": "Intan Kuncoro",
    "email": "intan.kuncoro.22231012@siswa.belajar.id",
    "password": "$sapa$v1$6819c50b0fcc8b2e51b9ba917ee666d89a5012b31472e7bb4aa04d4d8d2d7735",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-13",
    "name": "Revan Rahmawati",
    "email": "revan.rahmawati.22231013@siswa.belajar.id",
    "password": "$sapa$v1$ddd983f0d8f5cc35baf7f80110432b0df3aace64e5a9199157ed62dcf5580e6d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-14",
    "name": "Zaskia Nugraha",
    "email": "zaskia.nugraha.22231014@siswa.belajar.id",
    "password": "$sapa$v1$7998c59458e86fe761e24bd9acc841eee782ff6f89bcb41b757a9e11c438fd94",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-15",
    "name": "Dennis Hidayat",
    "email": "dennis.hidayat.22231015@siswa.belajar.id",
    "password": "$sapa$v1$4aa46b327ee45371ba16cd44ed3f7a07b0f5234f856ddc331f2bdf4ca0bb2c5d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-16",
    "name": "Kayla Wibowo",
    "email": "kayla.wibowo.22231016@siswa.belajar.id",
    "password": "$sapa$v1$cc90856dc0ae72a37609f06329e379db18899c76761aaacf2482cf4700453067",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-17",
    "name": "Satria Ramadhan",
    "email": "satria.ramadhan.22231017@siswa.belajar.id",
    "password": "$sapa$v1$89b310aa7ca7d475f0c2c8a7ab4afc9445f12c348bae00a359a34e4e38d99972",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-18",
    "name": "Aisyah Firmansyah",
    "email": "aisyah.firmansyah.22231018@siswa.belajar.id",
    "password": "$sapa$v1$f492c9fc796b5d041fd3c32718289341ea1e3e749a2b4da5d620117592b8b7f0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-19",
    "name": "Dimas Hakim",
    "email": "dimas.hakim.22231019@siswa.belajar.id",
    "password": "$sapa$v1$754e04a93105c807d0e7fe656e8d3090bca64911022c2eadf681d53875b14c83",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-20",
    "name": "Laila Anggraini",
    "email": "laila.anggraini.22231020@siswa.belajar.id",
    "password": "$sapa$v1$9848ad47c4f70eaad2e6d056425eba6f4edbe01114dcc7bbfb56b04f4cbb9790",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-21",
    "name": "Wahyu Wardhana",
    "email": "wahyu.wardhana.22231021@siswa.belajar.id",
    "password": "$sapa$v1$cf312eaf2ae1cc2201bbe65e50a6f90dc1b8123cab44eacea3e52dd701504183",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-22",
    "name": "Amanda Utomo",
    "email": "amanda.utomo.22231022@siswa.belajar.id",
    "password": "$sapa$v1$e5b3cfad316ac5c59fbf21951869e28191f182c3f4f5c40993426c905faf8758",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-23",
    "name": "Fajar Kuswanto",
    "email": "fajar.kuswanto.22231023@siswa.belajar.id",
    "password": "$sapa$v1$8693ce444b73bac445c8a94ed2c062429c60d707e6a28ef2806f091062c58bac",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-24",
    "name": "Marsha Kusuma",
    "email": "marsha.kusuma.22231024@siswa.belajar.id",
    "password": "$sapa$v1$20675edd077f48cf6624c1321acbef84592e05d79e9d631bfa4693ca391c5a3b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-25",
    "name": "Yoga Mahendra",
    "email": "yoga.mahendra.22231025@siswa.belajar.id",
    "password": "$sapa$v1$6d81ab58f631102236e17efcd5af8dc234be1000e1311a66b56202bf4b8f7951",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-26",
    "name": "Anisa Baskara",
    "email": "anisa.baskara.22231026@siswa.belajar.id",
    "password": "$sapa$v1$649d08a52085eb83d214f1eeae6152cde4b9fa4e477827d233d577b0293b7ff6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-27",
    "name": "Fathir Permatasari",
    "email": "fathir.permatasari.22231027@siswa.belajar.id",
    "password": "$sapa$v1$00bf4dd94142b878c97d40c85a86e5dfbfa2c25ad3a464a139bb6b0090d6c37b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-28",
    "name": "Nabila Maulana",
    "email": "nabila.maulana.22231028@siswa.belajar.id",
    "password": "$sapa$v1$150d7ddf0dde016bdd497690c3f2d52d2030567e80acfb6fb6642c76a0c8cb7b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-29",
    "name": "Zack Setiawan",
    "email": "zack.setiawan.22231029@siswa.belajar.id",
    "password": "$sapa$v1$41e037025a454c05c52df35ca737e005d5f76b5d971d8868d909863a1f7cd14f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-30",
    "name": "Aqila Suhendra",
    "email": "aqila.suhendra.22231030@siswa.belajar.id",
    "password": "$sapa$v1$94f1cdbbc8d32ebc84bdbf37b9ba881af03cdd759a9e95e0a24eedd9d9babd83",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-31",
    "name": "Gilang Putra",
    "email": "gilang.putra.22231031@siswa.belajar.id",
    "password": "$sapa$v1$9f4a5ae87ec41c3162230bf6baf397db0d990e629e59b9b569a1b99f350ab220",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-32",
    "name": "Nafisa Kurnia",
    "email": "nafisa.kurnia.22231032@siswa.belajar.id",
    "password": "$sapa$v1$38fec6f6e29c57688d4e505d98754e79a29d06212108d9f06807b7beb29d45f6",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-33",
    "name": "Zulfikar Pramudya",
    "email": "zulfikar.pramudya.22231033@siswa.belajar.id",
    "password": "$sapa$v1$4b30838b15286f0cc7812957d2d75d6b6c0d7a24e8d6a96d01626408ca4ec097",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-dkv-2-34",
    "name": "Cantika Lestari",
    "email": "cantika.lestari.22231034@siswa.belajar.id",
    "password": "$sapa$v1$3b8ad3c3fc8b5b42d2059f150d72ee42768536e6a09c5ca33766d20bf973352f",
    "role": "siswa",
    "avatar": null,
    "phone": "0822320034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-01",
    "name": "Rian Wahyuni",
    "email": "rian.wahyuni.22231101@siswa.belajar.id",
    "password": "$sapa$v1$e67f6c84ed9ba880adeb16b4b8b77f2bf1ef912da6f02a8521993c813c86baef",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330001",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-02",
    "name": "Adinda Haikal",
    "email": "adinda.haikal.22231102@siswa.belajar.id",
    "password": "$sapa$v1$b1e9650b553601b50b4bc440155afc3c26ee153b8573072e21ffa36adaa38845",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330002",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-03",
    "name": "Desta Santoso",
    "email": "desta.santoso.22231103@siswa.belajar.id",
    "password": "$sapa$v1$79780e99e10a9a64ebeeb6a6846688c81c5f9b0dbe868016bf13e53fcbb0c879",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330003",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-04",
    "name": "Keisha Sudrajat",
    "email": "keisha.sudrajat.22231104@siswa.belajar.id",
    "password": "$sapa$v1$207d587d3af8728f8392c094975211807dd31193a13a8637876bf79be77f9a44",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330004",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-05",
    "name": "Tegar Wijaya",
    "email": "tegar.wijaya.22231105@siswa.belajar.id",
    "password": "$sapa$v1$f8fb425d358d224f07557f454e11803fb5c4a40ab8b457f576013480f6219c23",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330005",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-06",
    "name": "Alifa Pangestu",
    "email": "alifa.pangestu.22231106@siswa.belajar.id",
    "password": "$sapa$v1$5e158c6700bb2f80be1e8c9fccbf92271b27ed74b99600009ad4d205cb3a66a0",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330006",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-07",
    "name": "Fadhil Kuncoro",
    "email": "fadhil.kuncoro.22231107@siswa.belajar.id",
    "password": "$sapa$v1$d5f0256e1c474881bca2ba930955111401248195a1da39f259e808c65ef758b7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330007",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-08",
    "name": "Laras Rahmawati",
    "email": "laras.rahmawati.22231108@siswa.belajar.id",
    "password": "$sapa$v1$006e507bb5a1237d64a21fc436974791e5f625a2c3087a2b5cb40a858429f270",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330008",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-09",
    "name": "Wawan Nugraha",
    "email": "wawan.nugraha.22231109@siswa.belajar.id",
    "password": "$sapa$v1$43ef1d31c9fa606c09114b7a1e69c7d8e9399a4e16c35b15c9b626fa07b88775",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330009",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-10",
    "name": "Anindya Hidayat",
    "email": "anindya.hidayat.22231110@siswa.belajar.id",
    "password": "$sapa$v1$26b9c3046a33ef72e71c246909254343c145ce745d6a2b7451c433a6b331a02a",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330010",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-11",
    "name": "Farhan Wibowo",
    "email": "farhan.wibowo.22231111@siswa.belajar.id",
    "password": "$sapa$v1$0cf820be5c7a818a6a4e448905c7b5a554013fc36c3badbe34804c38c0281ec8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330011",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-12",
    "name": "Maulida Ramadhan",
    "email": "maulida.ramadhan.22231112@siswa.belajar.id",
    "password": "$sapa$v1$0c1dc70b0d1c6b58a33467c9c089eef9d548f364d08cb7def084be7d31f59e9d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330012",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-13",
    "name": "Yusuf Firmansyah",
    "email": "yusuf.firmansyah.22231113@siswa.belajar.id",
    "password": "$sapa$v1$76ee3b370fcaa1032ab547134f63fe883092cde4c0c979b4c22e497e765b88f7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330013",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-14",
    "name": "Annisa Hakim",
    "email": "annisa.hakim.22231114@siswa.belajar.id",
    "password": "$sapa$v1$f99fdf717e947d0fb2208e2951daf1f10c3ffb2e0292daddb7894897fd53c028",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330014",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-15",
    "name": "Galih Anggraini",
    "email": "galih.anggraini.22231115@siswa.belajar.id",
    "password": "$sapa$v1$99d119a050ac0ba84b4e75281307e4a6008e46042d1196184530bcf455c6cd48",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330015",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-16",
    "name": "Nadira Wardhana",
    "email": "nadira.wardhana.22231116@siswa.belajar.id",
    "password": "$sapa$v1$34ec2d0e99aaa6e4db76fe4d589bffdb25597a919ec38ee8b181938f04b12615",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330016",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-17",
    "name": "Zidan Utomo",
    "email": "zidan.utomo.22231117@siswa.belajar.id",
    "password": "$sapa$v1$67b18556110a27f81e2be04e74fef6fff52fa31e2252eb6330b80feb29e67943",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330017",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-18",
    "name": "Aurelia Kuswanto",
    "email": "aurelia.kuswanto.22231118@siswa.belajar.id",
    "password": "$sapa$v1$5bfc8de6f58a35c0a1e0d0ad27f7384e44d3c56a08413c87e69030c257c3fc64",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330018",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-19",
    "name": "Hafiz Kusuma",
    "email": "hafiz.kusuma.22231119@siswa.belajar.id",
    "password": "$sapa$v1$2119319d355c9234b5aade7cf7b9ce66dbc3fa07ae856090f51912ec10049d85",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330019",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-20",
    "name": "Nayra Mahendra",
    "email": "nayra.mahendra.22231120@siswa.belajar.id",
    "password": "$sapa$v1$8b3970772d1f105f66cc0d4a37a4e6ff7d29c37e25fcb1b87e1498d82892f987",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330020",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-21",
    "name": "Bintang Baskara",
    "email": "bintang.baskara.22231121@siswa.belajar.id",
    "password": "$sapa$v1$d9794d678872e9c5cfb2dc705ad85309627eb4562dfd91b3f4c6085a8e98b3c7",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330021",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-22",
    "name": "Chelsea Permatasari",
    "email": "chelsea.permatasari.22231122@siswa.belajar.id",
    "password": "$sapa$v1$56ed7113d69d502f631434df219661c3e953faecfbe9e30b70a1a53429d53526",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330022",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-23",
    "name": "Indra Maulana",
    "email": "indra.maulana.22231123@siswa.belajar.id",
    "password": "$sapa$v1$d152b5583b59ca010bddfa11b3e2a422ed28c0a4a71b2f029347e2f41ad04482",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330023",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-24",
    "name": "Nurul Setiawan",
    "email": "nurul.setiawan.22231124@siswa.belajar.id",
    "password": "$sapa$v1$b75717adcd61f7562bdc0b4d7b6f4eae017a5dce44701caa6d33ef7dbb3e80ed",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330024",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-25",
    "name": "Dwi Suhendra",
    "email": "dwi.suhendra.22231125@siswa.belajar.id",
    "password": "$sapa$v1$54565421841ee1e1151032796c29063c4e8a7e70490c7beba6838f2a6ad33c05",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330025",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-26",
    "name": "Clarissa Putra",
    "email": "clarissa.putra.22231126@siswa.belajar.id",
    "password": "$sapa$v1$b71e1968bc7a540a50f67e9658fcd3b1f234e6f3de03a8f7f55b44a45c194712",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330026",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-27",
    "name": "Kevin Kurnia",
    "email": "kevin.kurnia.22231127@siswa.belajar.id",
    "password": "$sapa$v1$ec8ec316c9e74497d717078ec759ef1a8305c594ff0fadaa12967e03836fea32",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330027",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-28",
    "name": "Raisa Pramudya",
    "email": "raisa.pramudya.22231128@siswa.belajar.id",
    "password": "$sapa$v1$a7dba611a6f1926fb3858ff0a062d7ce9241c26ed795224756c476cad41029c8",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330028",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-29",
    "name": "Aditya Lestari",
    "email": "aditya.lestari.22231129@siswa.belajar.id",
    "password": "$sapa$v1$861768ad4aa1eb02363912ff75ac014dfd8f3398e02f3632e1e45639eefcf0f4",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330029",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-30",
    "name": "Devi Syahputra",
    "email": "devi.syahputra.22231130@siswa.belajar.id",
    "password": "$sapa$v1$57063cc8ad5c4594821381b5d33e53a07022258495e7937cd2d3ba44c584e862",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330030",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-31",
    "name": "M. Rizky Wicaksono",
    "email": "m.rizky.wicaksono.22231131@siswa.belajar.id",
    "password": "$sapa$v1$8797574fec644fe8186f9dc4a4cf3e4d6e43a4997c9cdc324fa1d8c0fbb23f2e",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330031",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-32",
    "name": "Salma Purnomo",
    "email": "salma.purnomo.22231132@siswa.belajar.id",
    "password": "$sapa$v1$83fed26079f96ccf0f35be83f41bbc7c8f6efb0396f3f546545d1889119c675b",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330032",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-33",
    "name": "Alif Saputra",
    "email": "alif.saputra.22231133@siswa.belajar.id",
    "password": "$sapa$v1$ed0e95ffd87fa245e557e5c9f6084dc0d7abd04aca21212fd91a87ff872d1b79",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330033",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  },
  {
    "id": "usr-std-xii-akl-1-34",
    "name": "Dinda Safitri",
    "email": "dinda.safitri.22231134@siswa.belajar.id",
    "password": "$sapa$v1$c1042279a9b20a7f39315d755aa8156ca5e82e605ba4eb19d57db2550d257d7d",
    "role": "siswa",
    "avatar": null,
    "phone": "0822330034",
    "created_at": "2026-01-15T08:00:00Z",
    "password_changed": false
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    "id": "tch-bk-1",
    "user_id": "usr-bk-1",
    "nip": "$sapa$nip$v1$425847546f5d58456e5a50495856406f5b54",
    "teacher_type": "guru_bk",
    "specialization": "Koordinator BK - Konseling Pribadi & Sosial",
    "room": "Ruang BK Utama (Lantai 2 Gedung A)",
    "bio": "Koordinator Bimbingan Konseling Sekolah. Pendampingan kesehatan mental, trauma perundungan, dan resiliensi sosial siswa.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-tkj-1",
      "cls-x-akl-1",
      "cls-xi-dkv-2",
      "cls-xii-dkv-1"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-2",
    "user_id": "usr-bk-2",
    "nip": "$sapa$nip$v1$425848516f5658426d5359455854436f5b51",
    "teacher_type": "guru_bk",
    "specialization": "Konseling Karir & Kesiapan Kerja Industri",
    "room": "Ruang Konseling Karir BK",
    "bio": "Konselor bimbingan karir, magang industri, dan minat bakat kejuruan siswa SMK.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-tkj-2",
      "cls-xi-tkj-1",
      "cls-xi-akl-1",
      "cls-xii-dkv-2"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-3",
    "user_id": "usr-bk-3",
    "nip": "$sapa$nip$v1$425848556e5f5b406d5359485854406f5b53",
    "teacher_type": "guru_bk",
    "specialization": "Pendampingan Regulasi Emosi & Anti-Perundungan",
    "room": "Ruang Konseling Individual 1",
    "bio": "Konselor pendampingan emosi, manajemen stress belajar, dan mediasi konflik antarsiswa.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-tkj-3",
      "cls-xi-tkj-2",
      "cls-xii-tkj-1",
      "cls-xii-akl-1"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-4",
    "user_id": "usr-bk-4",
    "nip": "$sapa$nip$v1$425847506f5a5b456e5a50475856436f5b57",
    "teacher_type": "guru_bk",
    "specialization": "Konseling Kedisiplinan & Motivasi Berprestasi",
    "room": "Ruang Konseling 2",
    "bio": "Pendampingan ketertiban belajar, pembiasaan positif, dan motivasi berprestasi siswa.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-tkp-1",
      "cls-xi-tkj-3",
      "cls-xii-tkj-2"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-5",
    "user_id": "usr-bk-5",
    "nip": "$sapa$nip$v1$425848596f5958446d5358415854406f5b50",
    "teacher_type": "guru_bk",
    "specialization": "Konseling Komunikasi Interpersonal & Relasi Sosial",
    "room": "Ruang Konseling Individual 3",
    "bio": "Konselor bimbingan kelompok dan interaksi sosial ramah anak di lingkungan sekolah.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-tkp-2",
      "cls-xi-tkp-1",
      "cls-xii-tkj-3"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-6",
    "user_id": "usr-bk-6",
    "nip": "$sapa$nip$v1$425848576f5c5b486d5358405854436f5b5d",
    "teacher_type": "guru_bk",
    "specialization": "Konseling Krisis & Penanganan Masalah Perilaku",
    "room": "Ruang Konseling Khusus BK",
    "bio": "Pendampingan psikologis siswa pada situasi darurat dan pemulihan trauma.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-to-1",
      "cls-xi-tkp-2",
      "cls-xii-tkp-1"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-7",
    "user_id": "usr-bk-7",
    "nip": "$sapa$nip$v1$425848536f5759456d5359465851406f5b52",
    "teacher_type": "guru_bk",
    "specialization": "Konseling Keluarga & Hubungan Orang Tua-Siswa",
    "room": "Ruang Diskusi BK & Orang Tua",
    "bio": "Pendampingan keterlibatan orang tua dan keharmonisan keluarga siswa.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-to-2",
      "cls-xi-to-1",
      "cls-xii-tkp-2"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-8",
    "user_id": "usr-bk-8",
    "nip": "$sapa$nip$v1$425848566f5f58496d5358445857436f5b56",
    "teacher_type": "guru_bk",
    "specialization": "Pengembangan Minat, Bakat & Karakter Vokasi",
    "room": "Ruang Konseling 4",
    "bio": "Eksplorasi potensi diri, kepercayaan diri, dan kepemimpinan siswa vokasi.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-to-3",
      "cls-xi-to-2",
      "cls-xii-to-1"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-9",
    "user_id": "usr-bk-9",
    "nip": "$sapa$nip$v1$425849516f5d58406d5358455856406f5b57",
    "teacher_type": "guru_bk",
    "specialization": "Manajemen Kecemasan Akademik & Ujian",
    "room": "Ruang Konseling Individual 5",
    "bio": "Konseling teknik relaksasi, mindfulness belajar, dan self-compassion siswa.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-dkv-1",
      "cls-xi-to-3",
      "cls-xii-to-2"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-bk-10",
    "user_id": "usr-bk-10",
    "nip": "$sapa$nip$v1$425849536f5b58426d5358495856436f5b53",
    "teacher_type": "guru_bk",
    "specialization": "Literasi Digital Sehat & Anti Cyber-Bullying",
    "room": "Ruang Konseling Digital BK",
    "bio": "Edukasi etika siber, keamanan digital, dan pendampingan korban perundungan daring.",
    "available_hours": "Senin - Jumat (07.30 - 15.00 WIB)",
    "is_active": true,
    "assigned_class_ids": [
      "cls-x-dkv-2",
      "cls-xi-dkv-1",
      "cls-xii-to-3"
    ],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-01",
    "user_id": "usr-wali-01",
    "nip": "$sapa$nip$v1$425847576f5b58426d5359435957436f5b57",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Pendidikan Agama Islam dan Budi Pekerti & Wali Kelas X TKJ 1",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Pendidikan Agama Islam dan Budi Pekerti pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TKJ 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-02",
    "user_id": "usr-wali-02",
    "nip": "$sapa$nip$v1$425848506f5758456d5359465851406f5b5d",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Pendidikan Pancasila (PPKn) & Wali Kelas X TKJ 2",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Pendidikan Pancasila (PPKn) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TKJ 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-03",
    "user_id": "usr-wali-03",
    "nip": "$sapa$nip$v1$425848526f5a5b406d5359485854406f5a50",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Bahasa Indonesia (Fase E) & Wali Kelas X TKJ 3",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Bahasa Indonesia (Fase E) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TKJ 3.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-04",
    "user_id": "usr-wali-04",
    "nip": "$sapa$nip$v1$425847586f5c58486d5359455854436f5b53",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Matematika Terapan (Fase E) & Wali Kelas X TKP 1",
    "room": "Ruang Guru & Laboratorium TKP",
    "bio": "Mengampu mata pelajaran Matematika Terapan (Fase E) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TKP 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-05",
    "user_id": "usr-wali-05",
    "nip": "$sapa$nip$v1$425848546e5f5b446d5358405854406f5954",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Bahasa Inggris Vokasi & Wali Kelas X TKP 2",
    "room": "Ruang Guru & Laboratorium TKP",
    "bio": "Mengampu mata pelajaran Bahasa Inggris Vokasi pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TKP 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-06",
    "user_id": "usr-wali-06",
    "nip": "$sapa$nip$v1$425847556f5658406e5a50495856436f5b51",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Sejarah Indonesia & Wali Kelas X TO 1",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Sejarah Indonesia pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TO 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-07",
    "user_id": "usr-wali-07",
    "nip": "$sapa$nip$v1$425848536f5958496d5359465851436f5b5c",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: PJOK (Pendidikan Jasmani, Olahraga & Kesehatan) & Wali Kelas X TO 2",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran PJOK (Pendidikan Jasmani, Olahraga & Kesehatan) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TO 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-08",
    "user_id": "usr-wali-08",
    "nip": "$sapa$nip$v1$425848576e5e59456d5358415854406f5a5d",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Seni Budaya & Kriya Vokasi & Wali Kelas X TO 3",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Seni Budaya & Kriya Vokasi pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X TO 3.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-09",
    "user_id": "usr-wali-09",
    "nip": "$sapa$nip$v1$425848506f5c58446d5359465851436f5b57",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Informatika & Literasi Digital (Fase E) & Wali Kelas X DKV 1",
    "room": "Ruang Guru & Laboratorium DKV",
    "bio": "Mengampu mata pelajaran Informatika & Literasi Digital (Fase E) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X DKV 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-10",
    "user_id": "usr-wali-10",
    "nip": "$sapa$nip$v1$425847566f5d5b416d5359425957406f5b56",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Projek IPAS (Ilmu Pengetahuan Alam dan Sosial) & Wali Kelas X DKV 2",
    "room": "Ruang Guru & Laboratorium DKV",
    "bio": "Mengampu mata pelajaran Projek IPAS (Ilmu Pengetahuan Alam dan Sosial) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X DKV 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-11",
    "user_id": "usr-wali-11",
    "nip": "$sapa$nip$v1$425848516f5858456d5359455854436f5b52",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Dasar-dasar Keahlian TKJ & Telekomunikasi & Wali Kelas X AKL",
    "room": "Ruang Guru & Laboratorium AKL",
    "bio": "Mengampu mata pelajaran Dasar-dasar Keahlian TKJ & Telekomunikasi pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa X AKL.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-12",
    "user_id": "usr-wali-12",
    "nip": "$sapa$nip$v1$425847586f5858486d5359455854436f5b56",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Dasar Gambar Konstruksi & BIM (TKP) & Wali Kelas XI TKJ 1",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Dasar Gambar Konstruksi & BIM (TKP) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TKJ 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-13",
    "user_id": "usr-wali-13",
    "nip": "$sapa$nip$v1$425847526f5b58406e5a50485857436f5b54",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Pemeliharaan Kelistrikan & Mesin Otomotif & Wali Kelas XI TKJ 2",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Pemeliharaan Kelistrikan & Mesin Otomotif pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TKJ 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-14",
    "user_id": "usr-wali-14",
    "nip": "$sapa$nip$v1$425848566f5658426d5358425854436f5b50",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Desain Grafis Komunikasi & Motion Design (DKV) & Wali Kelas XI TKJ 3",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Desain Grafis Komunikasi & Motion Design (DKV) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TKJ 3.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-15",
    "user_id": "usr-wali-15",
    "nip": "$sapa$nip$v1$425848556f5f5a406d5359485854406f5a57",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Praktikum Komputer Akuntansi Spreadsheet & MYOB & Wali Kelas XI TKP 1",
    "room": "Ruang Guru & Laboratorium TKP",
    "bio": "Mengampu mata pelajaran Praktikum Komputer Akuntansi Spreadsheet & MYOB pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TKP 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-16",
    "user_id": "usr-wali-16",
    "nip": "$sapa$nip$v1$425848576f5d58476d5358405854406f5950",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Bahasa Indonesia Komunikasi Bisnis & Laporan Kerja & Wali Kelas XI TKP 2",
    "room": "Ruang Guru & Laboratorium TKP",
    "bio": "Mengampu mata pelajaran Bahasa Indonesia Komunikasi Bisnis & Laporan Kerja pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TKP 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-17",
    "user_id": "usr-wali-17",
    "nip": "$sapa$nip$v1$425848536e5c59456d5359495857436f5b56",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Bahasa Inggris Percakapan & Wawancara Industri & Wali Kelas XI TO 1",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Bahasa Inggris Percakapan & Wawancara Industri pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TO 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-18",
    "user_id": "usr-wali-18",
    "nip": "$sapa$nip$v1$425848546f5b58446d5358405854436f5a51",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Matematika Vokasi Lanjutan & Analisis Data & Wali Kelas XI TO 2",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Matematika Vokasi Lanjutan & Analisis Data pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TO 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-19",
    "user_id": "usr-wali-19",
    "nip": "$sapa$nip$v1$425848596f575b426d5358445857436f5b51",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Jaringan Nirkabel, Fiber Optic & Cyber Security (TKJ) & Wali Kelas XI TO 3",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Jaringan Nirkabel, Fiber Optic & Cyber Security (TKJ) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI TO 3.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-20",
    "user_id": "usr-wali-20",
    "nip": "$sapa$nip$v1$425848566f5a58466d5358415854406f5a5c",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Estimasi Biaya & Struktur Konstruksi Bangunan (TKP) & Wali Kelas XI DKV 1",
    "room": "Ruang Guru & Laboratorium DKV",
    "bio": "Mengampu mata pelajaran Estimasi Biaya & Struktur Konstruksi Bangunan (TKP) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI DKV 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-21",
    "user_id": "usr-wali-21",
    "nip": "$sapa$nip$v1$425848516f5f5b486d5359465851436f5a54",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Sistem Chasis, Transmisi & Bodi Kendaraan Ringan (TO) & Wali Kelas XI DKV 2",
    "room": "Ruang Guru & Laboratorium DKV",
    "bio": "Mengampu mata pelajaran Sistem Chasis, Transmisi & Bodi Kendaraan Ringan (TO) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI DKV 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-22",
    "user_id": "usr-wali-22",
    "nip": "$sapa$nip$v1$425849506f5a59486d5358455856406f5b52",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: UI/UX Interactive & Pembuatan Aset Visual Digital (DKV) & Wali Kelas XI AKL",
    "room": "Ruang Guru & Laboratorium AKL",
    "bio": "Mengampu mata pelajaran UI/UX Interactive & Pembuatan Aset Visual Digital (DKV) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XI AKL.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-23",
    "user_id": "usr-wali-23",
    "nip": "$sapa$nip$v1$425847596f595b456d5359435957436f5b51",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Perpajakan Perusahaan & Auditing Akuntansi (AKL) & Wali Kelas XII TKJ 1",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Perpajakan Perusahaan & Auditing Akuntansi (AKL) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TKJ 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-24",
    "user_id": "usr-wali-24",
    "nip": "$sapa$nip$v1$425848526f5658496d5359485854406f5a52",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Projek Kreatif dan Kewirausahaan Vokasi (PKK) & Wali Kelas XII TKJ 2",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Projek Kreatif dan Kewirausahaan Vokasi (PKK) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TKJ 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-25",
    "user_id": "usr-wali-25",
    "nip": "$sapa$nip$v1$425848516f5a58416d5359465851436f5a50",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Pendidikan Agama Kristen dan Budi Pekerti & Wali Kelas XII TKJ 3",
    "room": "Ruang Guru & Laboratorium TKJ",
    "bio": "Mengampu mata pelajaran Pendidikan Agama Kristen dan Budi Pekerti pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TKJ 3.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-26",
    "user_id": "usr-wali-26",
    "nip": "$sapa$nip$v1$425847536f5d58446e5a50475857436f5b57",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Pendidikan Pancasila & Hukum Ketenagakerjaan & Wali Kelas XII TKP 1",
    "room": "Ruang Guru & Laboratorium TKP",
    "bio": "Mengampu mata pelajaran Pendidikan Pancasila & Hukum Ketenagakerjaan pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TKP 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-27",
    "user_id": "usr-wali-27",
    "nip": "$sapa$nip$v1$425847546f575b406d5359405856436f5b56",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Muatan Lokal: Bahasa & Kebudayaan Daerah & Wali Kelas XII TKP 2",
    "room": "Ruang Guru & Laboratorium TKP",
    "bio": "Mengampu mata pelajaran Muatan Lokal: Bahasa & Kebudayaan Daerah pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TKP 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-28",
    "user_id": "usr-wali-28",
    "nip": "$sapa$nip$v1$425848576f5958486d5358405854436f5a53",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Cloud Computing, Server Linux & IoT (TKJ) & Wali Kelas XII TO 1",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Cloud Computing, Server Linux & IoT (TKJ) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TO 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-29",
    "user_id": "usr-wali-29",
    "nip": "$sapa$nip$v1$425847556e5f5b496d5359415957436f5b57",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Teknik Konstruksi Baja, Beton Bertulang & K3 (TKP) & Wali Kelas XII TO 2",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Teknik Konstruksi Baja, Beton Bertulang & K3 (TKP) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TO 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-30",
    "user_id": "usr-wali-30",
    "nip": "$sapa$nip$v1$425848506f5659446d5359475854436f5a56",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Teknologi Kendaraan Listrik & Pengecatan Otomotif (TO) & Wali Kelas XII TO 3",
    "room": "Ruang Guru & Laboratorium TO",
    "bio": "Mengampu mata pelajaran Teknologi Kendaraan Listrik & Pengecatan Otomotif (TO) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII TO 3.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-31",
    "user_id": "usr-wali-31",
    "nip": "$sapa$nip$v1$425848586f5c58416d5358445857436f5b5d",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Produksi Film Dokumenter, Iklan & Animasi 3D (DKV) & Wali Kelas XII DKV 1",
    "room": "Ruang Guru & Laboratorium DKV",
    "bio": "Mengampu mata pelajaran Produksi Film Dokumenter, Iklan & Animasi 3D (DKV) pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII DKV 1.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-32",
    "user_id": "usr-wali-32",
    "nip": "$sapa$nip$v1$425848596f5b5b466d5358425854406f5a51",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Akuntansi Keuangan Lembaga & Perbankan Syariah & Wali Kelas XII DKV 2",
    "room": "Ruang Guru & Laboratorium DKV",
    "bio": "Mengampu mata pelajaran Akuntansi Keuangan Lembaga & Perbankan Syariah pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII DKV 2.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "tch-wali-33",
    "user_id": "usr-wali-33",
    "nip": "$sapa$nip$v1$425847576f5658446d5359425957436f5b54",
    "teacher_type": "wali_kelas",
    "specialization": "Guru Mapel: Manajemen Portofolio Vokasi & Kesiapan PKL Industri & Wali Kelas XII AKL",
    "room": "Ruang Guru & Laboratorium AKL",
    "bio": "Mengampu mata pelajaran Manajemen Portofolio Vokasi & Kesiapan PKL Industri pada Kurikulum Merdeka dan bertugas mendampingi perkembangan akademik, etika, dan karakter siswa XII AKL.",
    "available_hours": "Senin - Jumat (07.30 - 15.30 WIB)",
    "is_active": true,
    "assigned_class_ids": [],
    "created_at": "2026-01-10T08:00:00Z"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    "id": "std-x-tkj-1-01",
    "user_id": "usr-std-x-tkj-1-01",
    "nis": "24250101",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-02",
    "user_id": "usr-std-x-tkj-1-02",
    "nis": "24250102",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-03",
    "user_id": "usr-std-x-tkj-1-03",
    "nis": "24250103",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-04",
    "user_id": "usr-std-x-tkj-1-04",
    "nis": "24250104",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-05",
    "user_id": "usr-std-x-tkj-1-05",
    "nis": "24250105",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-06",
    "user_id": "usr-std-x-tkj-1-06",
    "nis": "24250106",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-07",
    "user_id": "usr-std-x-tkj-1-07",
    "nis": "24250107",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-08",
    "user_id": "usr-std-x-tkj-1-08",
    "nis": "24250108",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-09",
    "user_id": "usr-std-x-tkj-1-09",
    "nis": "24250109",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-10",
    "user_id": "usr-std-x-tkj-1-10",
    "nis": "24250110",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-11",
    "user_id": "usr-std-x-tkj-1-11",
    "nis": "24250111",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-12",
    "user_id": "usr-std-x-tkj-1-12",
    "nis": "24250112",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-13",
    "user_id": "usr-std-x-tkj-1-13",
    "nis": "24250113",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-14",
    "user_id": "usr-std-x-tkj-1-14",
    "nis": "24250114",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-15",
    "user_id": "usr-std-x-tkj-1-15",
    "nis": "24250115",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-16",
    "user_id": "usr-std-x-tkj-1-16",
    "nis": "24250116",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-17",
    "user_id": "usr-std-x-tkj-1-17",
    "nis": "24250117",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-18",
    "user_id": "usr-std-x-tkj-1-18",
    "nis": "24250118",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-19",
    "user_id": "usr-std-x-tkj-1-19",
    "nis": "24250119",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-20",
    "user_id": "usr-std-x-tkj-1-20",
    "nis": "24250120",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-21",
    "user_id": "usr-std-x-tkj-1-21",
    "nis": "24250121",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-22",
    "user_id": "usr-std-x-tkj-1-22",
    "nis": "24250122",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-23",
    "user_id": "usr-std-x-tkj-1-23",
    "nis": "24250123",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-24",
    "user_id": "usr-std-x-tkj-1-24",
    "nis": "24250124",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-25",
    "user_id": "usr-std-x-tkj-1-25",
    "nis": "24250125",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-26",
    "user_id": "usr-std-x-tkj-1-26",
    "nis": "24250126",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-27",
    "user_id": "usr-std-x-tkj-1-27",
    "nis": "24250127",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-28",
    "user_id": "usr-std-x-tkj-1-28",
    "nis": "24250128",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-29",
    "user_id": "usr-std-x-tkj-1-29",
    "nis": "24250129",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-30",
    "user_id": "usr-std-x-tkj-1-30",
    "nis": "24250130",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-31",
    "user_id": "usr-std-x-tkj-1-31",
    "nis": "24250131",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-32",
    "user_id": "usr-std-x-tkj-1-32",
    "nis": "24250132",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-33",
    "user_id": "usr-std-x-tkj-1-33",
    "nis": "24250133",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-1-34",
    "user_id": "usr-std-x-tkj-1-34",
    "nis": "24250134",
    "class_id": "cls-x-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-01",
    "user_id": "usr-std-x-tkj-2-01",
    "nis": "24250201",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-02",
    "user_id": "usr-std-x-tkj-2-02",
    "nis": "24250202",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-03",
    "user_id": "usr-std-x-tkj-2-03",
    "nis": "24250203",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-04",
    "user_id": "usr-std-x-tkj-2-04",
    "nis": "24250204",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-05",
    "user_id": "usr-std-x-tkj-2-05",
    "nis": "24250205",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-06",
    "user_id": "usr-std-x-tkj-2-06",
    "nis": "24250206",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-07",
    "user_id": "usr-std-x-tkj-2-07",
    "nis": "24250207",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-08",
    "user_id": "usr-std-x-tkj-2-08",
    "nis": "24250208",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-09",
    "user_id": "usr-std-x-tkj-2-09",
    "nis": "24250209",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-10",
    "user_id": "usr-std-x-tkj-2-10",
    "nis": "24250210",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-11",
    "user_id": "usr-std-x-tkj-2-11",
    "nis": "24250211",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-12",
    "user_id": "usr-std-x-tkj-2-12",
    "nis": "24250212",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-13",
    "user_id": "usr-std-x-tkj-2-13",
    "nis": "24250213",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-14",
    "user_id": "usr-std-x-tkj-2-14",
    "nis": "24250214",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-15",
    "user_id": "usr-std-x-tkj-2-15",
    "nis": "24250215",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-16",
    "user_id": "usr-std-x-tkj-2-16",
    "nis": "24250216",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-17",
    "user_id": "usr-std-x-tkj-2-17",
    "nis": "24250217",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-18",
    "user_id": "usr-std-x-tkj-2-18",
    "nis": "24250218",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-19",
    "user_id": "usr-std-x-tkj-2-19",
    "nis": "24250219",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-20",
    "user_id": "usr-std-x-tkj-2-20",
    "nis": "24250220",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-21",
    "user_id": "usr-std-x-tkj-2-21",
    "nis": "24250221",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-22",
    "user_id": "usr-std-x-tkj-2-22",
    "nis": "24250222",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-23",
    "user_id": "usr-std-x-tkj-2-23",
    "nis": "24250223",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-24",
    "user_id": "usr-std-x-tkj-2-24",
    "nis": "24250224",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-25",
    "user_id": "usr-std-x-tkj-2-25",
    "nis": "24250225",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-26",
    "user_id": "usr-std-x-tkj-2-26",
    "nis": "24250226",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-27",
    "user_id": "usr-std-x-tkj-2-27",
    "nis": "24250227",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-28",
    "user_id": "usr-std-x-tkj-2-28",
    "nis": "24250228",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-29",
    "user_id": "usr-std-x-tkj-2-29",
    "nis": "24250229",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-30",
    "user_id": "usr-std-x-tkj-2-30",
    "nis": "24250230",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-31",
    "user_id": "usr-std-x-tkj-2-31",
    "nis": "24250231",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-32",
    "user_id": "usr-std-x-tkj-2-32",
    "nis": "24250232",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-33",
    "user_id": "usr-std-x-tkj-2-33",
    "nis": "24250233",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-2-34",
    "user_id": "usr-std-x-tkj-2-34",
    "nis": "24250234",
    "class_id": "cls-x-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-01",
    "user_id": "usr-std-x-tkj-3-01",
    "nis": "24250301",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-02",
    "user_id": "usr-std-x-tkj-3-02",
    "nis": "24250302",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-03",
    "user_id": "usr-std-x-tkj-3-03",
    "nis": "24250303",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-04",
    "user_id": "usr-std-x-tkj-3-04",
    "nis": "24250304",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-05",
    "user_id": "usr-std-x-tkj-3-05",
    "nis": "24250305",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-06",
    "user_id": "usr-std-x-tkj-3-06",
    "nis": "24250306",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-07",
    "user_id": "usr-std-x-tkj-3-07",
    "nis": "24250307",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-08",
    "user_id": "usr-std-x-tkj-3-08",
    "nis": "24250308",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-09",
    "user_id": "usr-std-x-tkj-3-09",
    "nis": "24250309",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-10",
    "user_id": "usr-std-x-tkj-3-10",
    "nis": "24250310",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-11",
    "user_id": "usr-std-x-tkj-3-11",
    "nis": "24250311",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-12",
    "user_id": "usr-std-x-tkj-3-12",
    "nis": "24250312",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-13",
    "user_id": "usr-std-x-tkj-3-13",
    "nis": "24250313",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-14",
    "user_id": "usr-std-x-tkj-3-14",
    "nis": "24250314",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-15",
    "user_id": "usr-std-x-tkj-3-15",
    "nis": "24250315",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-16",
    "user_id": "usr-std-x-tkj-3-16",
    "nis": "24250316",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-17",
    "user_id": "usr-std-x-tkj-3-17",
    "nis": "24250317",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-18",
    "user_id": "usr-std-x-tkj-3-18",
    "nis": "24250318",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-19",
    "user_id": "usr-std-x-tkj-3-19",
    "nis": "24250319",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-20",
    "user_id": "usr-std-x-tkj-3-20",
    "nis": "24250320",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-21",
    "user_id": "usr-std-x-tkj-3-21",
    "nis": "24250321",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-22",
    "user_id": "usr-std-x-tkj-3-22",
    "nis": "24250322",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-23",
    "user_id": "usr-std-x-tkj-3-23",
    "nis": "24250323",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-24",
    "user_id": "usr-std-x-tkj-3-24",
    "nis": "24250324",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-25",
    "user_id": "usr-std-x-tkj-3-25",
    "nis": "24250325",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-26",
    "user_id": "usr-std-x-tkj-3-26",
    "nis": "24250326",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-27",
    "user_id": "usr-std-x-tkj-3-27",
    "nis": "24250327",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-28",
    "user_id": "usr-std-x-tkj-3-28",
    "nis": "24250328",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-29",
    "user_id": "usr-std-x-tkj-3-29",
    "nis": "24250329",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-30",
    "user_id": "usr-std-x-tkj-3-30",
    "nis": "24250330",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-31",
    "user_id": "usr-std-x-tkj-3-31",
    "nis": "24250331",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-32",
    "user_id": "usr-std-x-tkj-3-32",
    "nis": "24250332",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-33",
    "user_id": "usr-std-x-tkj-3-33",
    "nis": "24250333",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkj-3-34",
    "user_id": "usr-std-x-tkj-3-34",
    "nis": "24250334",
    "class_id": "cls-x-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-01",
    "user_id": "usr-std-x-tkp-1-01",
    "nis": "24250401",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-02",
    "user_id": "usr-std-x-tkp-1-02",
    "nis": "24250402",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-03",
    "user_id": "usr-std-x-tkp-1-03",
    "nis": "24250403",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-04",
    "user_id": "usr-std-x-tkp-1-04",
    "nis": "24250404",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-05",
    "user_id": "usr-std-x-tkp-1-05",
    "nis": "24250405",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-06",
    "user_id": "usr-std-x-tkp-1-06",
    "nis": "24250406",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-07",
    "user_id": "usr-std-x-tkp-1-07",
    "nis": "24250407",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-08",
    "user_id": "usr-std-x-tkp-1-08",
    "nis": "24250408",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-09",
    "user_id": "usr-std-x-tkp-1-09",
    "nis": "24250409",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-10",
    "user_id": "usr-std-x-tkp-1-10",
    "nis": "24250410",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-11",
    "user_id": "usr-std-x-tkp-1-11",
    "nis": "24250411",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-12",
    "user_id": "usr-std-x-tkp-1-12",
    "nis": "24250412",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-13",
    "user_id": "usr-std-x-tkp-1-13",
    "nis": "24250413",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-14",
    "user_id": "usr-std-x-tkp-1-14",
    "nis": "24250414",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-15",
    "user_id": "usr-std-x-tkp-1-15",
    "nis": "24250415",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-16",
    "user_id": "usr-std-x-tkp-1-16",
    "nis": "24250416",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-17",
    "user_id": "usr-std-x-tkp-1-17",
    "nis": "24250417",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-18",
    "user_id": "usr-std-x-tkp-1-18",
    "nis": "24250418",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-19",
    "user_id": "usr-std-x-tkp-1-19",
    "nis": "24250419",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-20",
    "user_id": "usr-std-x-tkp-1-20",
    "nis": "24250420",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-21",
    "user_id": "usr-std-x-tkp-1-21",
    "nis": "24250421",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-22",
    "user_id": "usr-std-x-tkp-1-22",
    "nis": "24250422",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-23",
    "user_id": "usr-std-x-tkp-1-23",
    "nis": "24250423",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-24",
    "user_id": "usr-std-x-tkp-1-24",
    "nis": "24250424",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-25",
    "user_id": "usr-std-x-tkp-1-25",
    "nis": "24250425",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-26",
    "user_id": "usr-std-x-tkp-1-26",
    "nis": "24250426",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-27",
    "user_id": "usr-std-x-tkp-1-27",
    "nis": "24250427",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-28",
    "user_id": "usr-std-x-tkp-1-28",
    "nis": "24250428",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-29",
    "user_id": "usr-std-x-tkp-1-29",
    "nis": "24250429",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-30",
    "user_id": "usr-std-x-tkp-1-30",
    "nis": "24250430",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-31",
    "user_id": "usr-std-x-tkp-1-31",
    "nis": "24250431",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-32",
    "user_id": "usr-std-x-tkp-1-32",
    "nis": "24250432",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-33",
    "user_id": "usr-std-x-tkp-1-33",
    "nis": "24250433",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-1-34",
    "user_id": "usr-std-x-tkp-1-34",
    "nis": "24250434",
    "class_id": "cls-x-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-01",
    "user_id": "usr-std-x-tkp-2-01",
    "nis": "24250501",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-02",
    "user_id": "usr-std-x-tkp-2-02",
    "nis": "24250502",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-03",
    "user_id": "usr-std-x-tkp-2-03",
    "nis": "24250503",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-04",
    "user_id": "usr-std-x-tkp-2-04",
    "nis": "24250504",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-05",
    "user_id": "usr-std-x-tkp-2-05",
    "nis": "24250505",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-06",
    "user_id": "usr-std-x-tkp-2-06",
    "nis": "24250506",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-07",
    "user_id": "usr-std-x-tkp-2-07",
    "nis": "24250507",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-08",
    "user_id": "usr-std-x-tkp-2-08",
    "nis": "24250508",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-09",
    "user_id": "usr-std-x-tkp-2-09",
    "nis": "24250509",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-10",
    "user_id": "usr-std-x-tkp-2-10",
    "nis": "24250510",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-11",
    "user_id": "usr-std-x-tkp-2-11",
    "nis": "24250511",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-12",
    "user_id": "usr-std-x-tkp-2-12",
    "nis": "24250512",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-13",
    "user_id": "usr-std-x-tkp-2-13",
    "nis": "24250513",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-14",
    "user_id": "usr-std-x-tkp-2-14",
    "nis": "24250514",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-15",
    "user_id": "usr-std-x-tkp-2-15",
    "nis": "24250515",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-16",
    "user_id": "usr-std-x-tkp-2-16",
    "nis": "24250516",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-17",
    "user_id": "usr-std-x-tkp-2-17",
    "nis": "24250517",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-18",
    "user_id": "usr-std-x-tkp-2-18",
    "nis": "24250518",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-19",
    "user_id": "usr-std-x-tkp-2-19",
    "nis": "24250519",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-20",
    "user_id": "usr-std-x-tkp-2-20",
    "nis": "24250520",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-21",
    "user_id": "usr-std-x-tkp-2-21",
    "nis": "24250521",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-22",
    "user_id": "usr-std-x-tkp-2-22",
    "nis": "24250522",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-23",
    "user_id": "usr-std-x-tkp-2-23",
    "nis": "24250523",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-24",
    "user_id": "usr-std-x-tkp-2-24",
    "nis": "24250524",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-25",
    "user_id": "usr-std-x-tkp-2-25",
    "nis": "24250525",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-26",
    "user_id": "usr-std-x-tkp-2-26",
    "nis": "24250526",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-27",
    "user_id": "usr-std-x-tkp-2-27",
    "nis": "24250527",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-28",
    "user_id": "usr-std-x-tkp-2-28",
    "nis": "24250528",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-29",
    "user_id": "usr-std-x-tkp-2-29",
    "nis": "24250529",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-30",
    "user_id": "usr-std-x-tkp-2-30",
    "nis": "24250530",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-31",
    "user_id": "usr-std-x-tkp-2-31",
    "nis": "24250531",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-32",
    "user_id": "usr-std-x-tkp-2-32",
    "nis": "24250532",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-33",
    "user_id": "usr-std-x-tkp-2-33",
    "nis": "24250533",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-tkp-2-34",
    "user_id": "usr-std-x-tkp-2-34",
    "nis": "24250534",
    "class_id": "cls-x-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-01",
    "user_id": "usr-std-x-to-1-01",
    "nis": "24250601",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-02",
    "user_id": "usr-std-x-to-1-02",
    "nis": "24250602",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-03",
    "user_id": "usr-std-x-to-1-03",
    "nis": "24250603",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-04",
    "user_id": "usr-std-x-to-1-04",
    "nis": "24250604",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-05",
    "user_id": "usr-std-x-to-1-05",
    "nis": "24250605",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-06",
    "user_id": "usr-std-x-to-1-06",
    "nis": "24250606",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-07",
    "user_id": "usr-std-x-to-1-07",
    "nis": "24250607",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-08",
    "user_id": "usr-std-x-to-1-08",
    "nis": "24250608",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-09",
    "user_id": "usr-std-x-to-1-09",
    "nis": "24250609",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-10",
    "user_id": "usr-std-x-to-1-10",
    "nis": "24250610",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-11",
    "user_id": "usr-std-x-to-1-11",
    "nis": "24250611",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-12",
    "user_id": "usr-std-x-to-1-12",
    "nis": "24250612",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-13",
    "user_id": "usr-std-x-to-1-13",
    "nis": "24250613",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-14",
    "user_id": "usr-std-x-to-1-14",
    "nis": "24250614",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-15",
    "user_id": "usr-std-x-to-1-15",
    "nis": "24250615",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-16",
    "user_id": "usr-std-x-to-1-16",
    "nis": "24250616",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-17",
    "user_id": "usr-std-x-to-1-17",
    "nis": "24250617",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-18",
    "user_id": "usr-std-x-to-1-18",
    "nis": "24250618",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-19",
    "user_id": "usr-std-x-to-1-19",
    "nis": "24250619",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-20",
    "user_id": "usr-std-x-to-1-20",
    "nis": "24250620",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-21",
    "user_id": "usr-std-x-to-1-21",
    "nis": "24250621",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-22",
    "user_id": "usr-std-x-to-1-22",
    "nis": "24250622",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-23",
    "user_id": "usr-std-x-to-1-23",
    "nis": "24250623",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-24",
    "user_id": "usr-std-x-to-1-24",
    "nis": "24250624",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-25",
    "user_id": "usr-std-x-to-1-25",
    "nis": "24250625",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-26",
    "user_id": "usr-std-x-to-1-26",
    "nis": "24250626",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-27",
    "user_id": "usr-std-x-to-1-27",
    "nis": "24250627",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-28",
    "user_id": "usr-std-x-to-1-28",
    "nis": "24250628",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-29",
    "user_id": "usr-std-x-to-1-29",
    "nis": "24250629",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-30",
    "user_id": "usr-std-x-to-1-30",
    "nis": "24250630",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-31",
    "user_id": "usr-std-x-to-1-31",
    "nis": "24250631",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-32",
    "user_id": "usr-std-x-to-1-32",
    "nis": "24250632",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-33",
    "user_id": "usr-std-x-to-1-33",
    "nis": "24250633",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-1-34",
    "user_id": "usr-std-x-to-1-34",
    "nis": "24250634",
    "class_id": "cls-x-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-01",
    "user_id": "usr-std-x-to-2-01",
    "nis": "24250701",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-02",
    "user_id": "usr-std-x-to-2-02",
    "nis": "24250702",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-03",
    "user_id": "usr-std-x-to-2-03",
    "nis": "24250703",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-04",
    "user_id": "usr-std-x-to-2-04",
    "nis": "24250704",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-05",
    "user_id": "usr-std-x-to-2-05",
    "nis": "24250705",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-06",
    "user_id": "usr-std-x-to-2-06",
    "nis": "24250706",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-07",
    "user_id": "usr-std-x-to-2-07",
    "nis": "24250707",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-08",
    "user_id": "usr-std-x-to-2-08",
    "nis": "24250708",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-09",
    "user_id": "usr-std-x-to-2-09",
    "nis": "24250709",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-10",
    "user_id": "usr-std-x-to-2-10",
    "nis": "24250710",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-11",
    "user_id": "usr-std-x-to-2-11",
    "nis": "24250711",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-12",
    "user_id": "usr-std-x-to-2-12",
    "nis": "24250712",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-13",
    "user_id": "usr-std-x-to-2-13",
    "nis": "24250713",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-14",
    "user_id": "usr-std-x-to-2-14",
    "nis": "24250714",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-15",
    "user_id": "usr-std-x-to-2-15",
    "nis": "24250715",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-16",
    "user_id": "usr-std-x-to-2-16",
    "nis": "24250716",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-17",
    "user_id": "usr-std-x-to-2-17",
    "nis": "24250717",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-18",
    "user_id": "usr-std-x-to-2-18",
    "nis": "24250718",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-19",
    "user_id": "usr-std-x-to-2-19",
    "nis": "24250719",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-20",
    "user_id": "usr-std-x-to-2-20",
    "nis": "24250720",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-21",
    "user_id": "usr-std-x-to-2-21",
    "nis": "24250721",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-22",
    "user_id": "usr-std-x-to-2-22",
    "nis": "24250722",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-23",
    "user_id": "usr-std-x-to-2-23",
    "nis": "24250723",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-24",
    "user_id": "usr-std-x-to-2-24",
    "nis": "24250724",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-25",
    "user_id": "usr-std-x-to-2-25",
    "nis": "24250725",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-26",
    "user_id": "usr-std-x-to-2-26",
    "nis": "24250726",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-27",
    "user_id": "usr-std-x-to-2-27",
    "nis": "24250727",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-28",
    "user_id": "usr-std-x-to-2-28",
    "nis": "24250728",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-29",
    "user_id": "usr-std-x-to-2-29",
    "nis": "24250729",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-30",
    "user_id": "usr-std-x-to-2-30",
    "nis": "24250730",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-31",
    "user_id": "usr-std-x-to-2-31",
    "nis": "24250731",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-32",
    "user_id": "usr-std-x-to-2-32",
    "nis": "24250732",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-33",
    "user_id": "usr-std-x-to-2-33",
    "nis": "24250733",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-2-34",
    "user_id": "usr-std-x-to-2-34",
    "nis": "24250734",
    "class_id": "cls-x-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-01",
    "user_id": "usr-std-x-to-3-01",
    "nis": "24250801",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-02",
    "user_id": "usr-std-x-to-3-02",
    "nis": "24250802",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-03",
    "user_id": "usr-std-x-to-3-03",
    "nis": "24250803",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-04",
    "user_id": "usr-std-x-to-3-04",
    "nis": "24250804",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-05",
    "user_id": "usr-std-x-to-3-05",
    "nis": "24250805",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-06",
    "user_id": "usr-std-x-to-3-06",
    "nis": "24250806",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-07",
    "user_id": "usr-std-x-to-3-07",
    "nis": "24250807",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-08",
    "user_id": "usr-std-x-to-3-08",
    "nis": "24250808",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-09",
    "user_id": "usr-std-x-to-3-09",
    "nis": "24250809",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-10",
    "user_id": "usr-std-x-to-3-10",
    "nis": "24250810",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-11",
    "user_id": "usr-std-x-to-3-11",
    "nis": "24250811",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-12",
    "user_id": "usr-std-x-to-3-12",
    "nis": "24250812",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-13",
    "user_id": "usr-std-x-to-3-13",
    "nis": "24250813",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-14",
    "user_id": "usr-std-x-to-3-14",
    "nis": "24250814",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-15",
    "user_id": "usr-std-x-to-3-15",
    "nis": "24250815",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-16",
    "user_id": "usr-std-x-to-3-16",
    "nis": "24250816",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-17",
    "user_id": "usr-std-x-to-3-17",
    "nis": "24250817",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-18",
    "user_id": "usr-std-x-to-3-18",
    "nis": "24250818",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-19",
    "user_id": "usr-std-x-to-3-19",
    "nis": "24250819",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-20",
    "user_id": "usr-std-x-to-3-20",
    "nis": "24250820",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-21",
    "user_id": "usr-std-x-to-3-21",
    "nis": "24250821",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-22",
    "user_id": "usr-std-x-to-3-22",
    "nis": "24250822",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-23",
    "user_id": "usr-std-x-to-3-23",
    "nis": "24250823",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-24",
    "user_id": "usr-std-x-to-3-24",
    "nis": "24250824",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-25",
    "user_id": "usr-std-x-to-3-25",
    "nis": "24250825",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-26",
    "user_id": "usr-std-x-to-3-26",
    "nis": "24250826",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-27",
    "user_id": "usr-std-x-to-3-27",
    "nis": "24250827",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-28",
    "user_id": "usr-std-x-to-3-28",
    "nis": "24250828",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-29",
    "user_id": "usr-std-x-to-3-29",
    "nis": "24250829",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-30",
    "user_id": "usr-std-x-to-3-30",
    "nis": "24250830",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-31",
    "user_id": "usr-std-x-to-3-31",
    "nis": "24250831",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-32",
    "user_id": "usr-std-x-to-3-32",
    "nis": "24250832",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-33",
    "user_id": "usr-std-x-to-3-33",
    "nis": "24250833",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-to-3-34",
    "user_id": "usr-std-x-to-3-34",
    "nis": "24250834",
    "class_id": "cls-x-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-01",
    "user_id": "usr-std-x-dkv-1-01",
    "nis": "24250901",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-02",
    "user_id": "usr-std-x-dkv-1-02",
    "nis": "24250902",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-03",
    "user_id": "usr-std-x-dkv-1-03",
    "nis": "24250903",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-04",
    "user_id": "usr-std-x-dkv-1-04",
    "nis": "24250904",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-05",
    "user_id": "usr-std-x-dkv-1-05",
    "nis": "24250905",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-06",
    "user_id": "usr-std-x-dkv-1-06",
    "nis": "24250906",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-07",
    "user_id": "usr-std-x-dkv-1-07",
    "nis": "24250907",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-08",
    "user_id": "usr-std-x-dkv-1-08",
    "nis": "24250908",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-09",
    "user_id": "usr-std-x-dkv-1-09",
    "nis": "24250909",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-10",
    "user_id": "usr-std-x-dkv-1-10",
    "nis": "24250910",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-11",
    "user_id": "usr-std-x-dkv-1-11",
    "nis": "24250911",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-12",
    "user_id": "usr-std-x-dkv-1-12",
    "nis": "24250912",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-13",
    "user_id": "usr-std-x-dkv-1-13",
    "nis": "24250913",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-14",
    "user_id": "usr-std-x-dkv-1-14",
    "nis": "24250914",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-15",
    "user_id": "usr-std-x-dkv-1-15",
    "nis": "24250915",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-16",
    "user_id": "usr-std-x-dkv-1-16",
    "nis": "24250916",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-17",
    "user_id": "usr-std-x-dkv-1-17",
    "nis": "24250917",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-18",
    "user_id": "usr-std-x-dkv-1-18",
    "nis": "24250918",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-19",
    "user_id": "usr-std-x-dkv-1-19",
    "nis": "24250919",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-20",
    "user_id": "usr-std-x-dkv-1-20",
    "nis": "24250920",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-21",
    "user_id": "usr-std-x-dkv-1-21",
    "nis": "24250921",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-22",
    "user_id": "usr-std-x-dkv-1-22",
    "nis": "24250922",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-23",
    "user_id": "usr-std-x-dkv-1-23",
    "nis": "24250923",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-24",
    "user_id": "usr-std-x-dkv-1-24",
    "nis": "24250924",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-25",
    "user_id": "usr-std-x-dkv-1-25",
    "nis": "24250925",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-26",
    "user_id": "usr-std-x-dkv-1-26",
    "nis": "24250926",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-27",
    "user_id": "usr-std-x-dkv-1-27",
    "nis": "24250927",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-28",
    "user_id": "usr-std-x-dkv-1-28",
    "nis": "24250928",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-29",
    "user_id": "usr-std-x-dkv-1-29",
    "nis": "24250929",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-30",
    "user_id": "usr-std-x-dkv-1-30",
    "nis": "24250930",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-31",
    "user_id": "usr-std-x-dkv-1-31",
    "nis": "24250931",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-32",
    "user_id": "usr-std-x-dkv-1-32",
    "nis": "24250932",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-33",
    "user_id": "usr-std-x-dkv-1-33",
    "nis": "24250933",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-1-34",
    "user_id": "usr-std-x-dkv-1-34",
    "nis": "24250934",
    "class_id": "cls-x-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-01",
    "user_id": "usr-std-x-dkv-2-01",
    "nis": "24251001",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-02",
    "user_id": "usr-std-x-dkv-2-02",
    "nis": "24251002",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-03",
    "user_id": "usr-std-x-dkv-2-03",
    "nis": "24251003",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-04",
    "user_id": "usr-std-x-dkv-2-04",
    "nis": "24251004",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-05",
    "user_id": "usr-std-x-dkv-2-05",
    "nis": "24251005",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-06",
    "user_id": "usr-std-x-dkv-2-06",
    "nis": "24251006",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-07",
    "user_id": "usr-std-x-dkv-2-07",
    "nis": "24251007",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-08",
    "user_id": "usr-std-x-dkv-2-08",
    "nis": "24251008",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-09",
    "user_id": "usr-std-x-dkv-2-09",
    "nis": "24251009",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-10",
    "user_id": "usr-std-x-dkv-2-10",
    "nis": "24251010",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-11",
    "user_id": "usr-std-x-dkv-2-11",
    "nis": "24251011",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-12",
    "user_id": "usr-std-x-dkv-2-12",
    "nis": "24251012",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-13",
    "user_id": "usr-std-x-dkv-2-13",
    "nis": "24251013",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-14",
    "user_id": "usr-std-x-dkv-2-14",
    "nis": "24251014",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-15",
    "user_id": "usr-std-x-dkv-2-15",
    "nis": "24251015",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-16",
    "user_id": "usr-std-x-dkv-2-16",
    "nis": "24251016",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-17",
    "user_id": "usr-std-x-dkv-2-17",
    "nis": "24251017",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-18",
    "user_id": "usr-std-x-dkv-2-18",
    "nis": "24251018",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-19",
    "user_id": "usr-std-x-dkv-2-19",
    "nis": "24251019",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-20",
    "user_id": "usr-std-x-dkv-2-20",
    "nis": "24251020",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-21",
    "user_id": "usr-std-x-dkv-2-21",
    "nis": "24251021",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-22",
    "user_id": "usr-std-x-dkv-2-22",
    "nis": "24251022",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-23",
    "user_id": "usr-std-x-dkv-2-23",
    "nis": "24251023",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-24",
    "user_id": "usr-std-x-dkv-2-24",
    "nis": "24251024",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-25",
    "user_id": "usr-std-x-dkv-2-25",
    "nis": "24251025",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-26",
    "user_id": "usr-std-x-dkv-2-26",
    "nis": "24251026",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-27",
    "user_id": "usr-std-x-dkv-2-27",
    "nis": "24251027",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-28",
    "user_id": "usr-std-x-dkv-2-28",
    "nis": "24251028",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-29",
    "user_id": "usr-std-x-dkv-2-29",
    "nis": "24251029",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-30",
    "user_id": "usr-std-x-dkv-2-30",
    "nis": "24251030",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-31",
    "user_id": "usr-std-x-dkv-2-31",
    "nis": "24251031",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-32",
    "user_id": "usr-std-x-dkv-2-32",
    "nis": "24251032",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-33",
    "user_id": "usr-std-x-dkv-2-33",
    "nis": "24251033",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-dkv-2-34",
    "user_id": "usr-std-x-dkv-2-34",
    "nis": "24251034",
    "class_id": "cls-x-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-01",
    "user_id": "usr-std-x-akl-1-01",
    "nis": "24251101",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-02",
    "user_id": "usr-std-x-akl-1-02",
    "nis": "24251102",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-03",
    "user_id": "usr-std-x-akl-1-03",
    "nis": "24251103",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-04",
    "user_id": "usr-std-x-akl-1-04",
    "nis": "24251104",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-05",
    "user_id": "usr-std-x-akl-1-05",
    "nis": "24251105",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-06",
    "user_id": "usr-std-x-akl-1-06",
    "nis": "24251106",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-07",
    "user_id": "usr-std-x-akl-1-07",
    "nis": "24251107",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-08",
    "user_id": "usr-std-x-akl-1-08",
    "nis": "24251108",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-09",
    "user_id": "usr-std-x-akl-1-09",
    "nis": "24251109",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-10",
    "user_id": "usr-std-x-akl-1-10",
    "nis": "24251110",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-11",
    "user_id": "usr-std-x-akl-1-11",
    "nis": "24251111",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-12",
    "user_id": "usr-std-x-akl-1-12",
    "nis": "24251112",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-13",
    "user_id": "usr-std-x-akl-1-13",
    "nis": "24251113",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-14",
    "user_id": "usr-std-x-akl-1-14",
    "nis": "24251114",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-15",
    "user_id": "usr-std-x-akl-1-15",
    "nis": "24251115",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-16",
    "user_id": "usr-std-x-akl-1-16",
    "nis": "24251116",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-17",
    "user_id": "usr-std-x-akl-1-17",
    "nis": "24251117",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-18",
    "user_id": "usr-std-x-akl-1-18",
    "nis": "24251118",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-19",
    "user_id": "usr-std-x-akl-1-19",
    "nis": "24251119",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-20",
    "user_id": "usr-std-x-akl-1-20",
    "nis": "24251120",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-21",
    "user_id": "usr-std-x-akl-1-21",
    "nis": "24251121",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-22",
    "user_id": "usr-std-x-akl-1-22",
    "nis": "24251122",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-23",
    "user_id": "usr-std-x-akl-1-23",
    "nis": "24251123",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-24",
    "user_id": "usr-std-x-akl-1-24",
    "nis": "24251124",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-25",
    "user_id": "usr-std-x-akl-1-25",
    "nis": "24251125",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-26",
    "user_id": "usr-std-x-akl-1-26",
    "nis": "24251126",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-27",
    "user_id": "usr-std-x-akl-1-27",
    "nis": "24251127",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-28",
    "user_id": "usr-std-x-akl-1-28",
    "nis": "24251128",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-29",
    "user_id": "usr-std-x-akl-1-29",
    "nis": "24251129",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-30",
    "user_id": "usr-std-x-akl-1-30",
    "nis": "24251130",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-31",
    "user_id": "usr-std-x-akl-1-31",
    "nis": "24251131",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-32",
    "user_id": "usr-std-x-akl-1-32",
    "nis": "24251132",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-33",
    "user_id": "usr-std-x-akl-1-33",
    "nis": "24251133",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-x-akl-1-34",
    "user_id": "usr-std-x-akl-1-34",
    "nis": "24251134",
    "class_id": "cls-x-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-01",
    "user_id": "usr-std-xi-tkj-1-01",
    "nis": "23240101",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-02",
    "user_id": "usr-std-xi-tkj-1-02",
    "nis": "23240102",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-03",
    "user_id": "usr-std-xi-tkj-1-03",
    "nis": "23240103",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-04",
    "user_id": "usr-std-xi-tkj-1-04",
    "nis": "23240104",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-05",
    "user_id": "usr-std-xi-tkj-1-05",
    "nis": "23240105",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-06",
    "user_id": "usr-std-xi-tkj-1-06",
    "nis": "23240106",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-07",
    "user_id": "usr-std-xi-tkj-1-07",
    "nis": "23240107",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-08",
    "user_id": "usr-std-xi-tkj-1-08",
    "nis": "23240108",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-09",
    "user_id": "usr-std-xi-tkj-1-09",
    "nis": "23240109",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-10",
    "user_id": "usr-std-xi-tkj-1-10",
    "nis": "23240110",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-11",
    "user_id": "usr-std-xi-tkj-1-11",
    "nis": "23240111",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-12",
    "user_id": "usr-std-xi-tkj-1-12",
    "nis": "23240112",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-13",
    "user_id": "usr-std-xi-tkj-1-13",
    "nis": "23240113",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-14",
    "user_id": "usr-std-xi-tkj-1-14",
    "nis": "23240114",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-15",
    "user_id": "usr-std-xi-tkj-1-15",
    "nis": "23240115",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-16",
    "user_id": "usr-std-xi-tkj-1-16",
    "nis": "23240116",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-17",
    "user_id": "usr-std-xi-tkj-1-17",
    "nis": "23240117",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-18",
    "user_id": "usr-std-xi-tkj-1-18",
    "nis": "23240118",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-19",
    "user_id": "usr-std-xi-tkj-1-19",
    "nis": "23240119",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-20",
    "user_id": "usr-std-xi-tkj-1-20",
    "nis": "23240120",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-21",
    "user_id": "usr-std-xi-tkj-1-21",
    "nis": "23240121",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-22",
    "user_id": "usr-std-xi-tkj-1-22",
    "nis": "23240122",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-23",
    "user_id": "usr-std-xi-tkj-1-23",
    "nis": "23240123",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-24",
    "user_id": "usr-std-xi-tkj-1-24",
    "nis": "23240124",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-25",
    "user_id": "usr-std-xi-tkj-1-25",
    "nis": "23240125",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-26",
    "user_id": "usr-std-xi-tkj-1-26",
    "nis": "23240126",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-27",
    "user_id": "usr-std-xi-tkj-1-27",
    "nis": "23240127",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-28",
    "user_id": "usr-std-xi-tkj-1-28",
    "nis": "23240128",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-29",
    "user_id": "usr-std-xi-tkj-1-29",
    "nis": "23240129",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-30",
    "user_id": "usr-std-xi-tkj-1-30",
    "nis": "23240130",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-31",
    "user_id": "usr-std-xi-tkj-1-31",
    "nis": "23240131",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-32",
    "user_id": "usr-std-xi-tkj-1-32",
    "nis": "23240132",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-33",
    "user_id": "usr-std-xi-tkj-1-33",
    "nis": "23240133",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-1-34",
    "user_id": "usr-std-xi-tkj-1-34",
    "nis": "23240134",
    "class_id": "cls-xi-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-01",
    "user_id": "usr-std-xi-tkj-2-01",
    "nis": "23240201",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-02",
    "user_id": "usr-std-xi-tkj-2-02",
    "nis": "23240202",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-03",
    "user_id": "usr-std-xi-tkj-2-03",
    "nis": "23240203",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-04",
    "user_id": "usr-std-xi-tkj-2-04",
    "nis": "23240204",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-05",
    "user_id": "usr-std-xi-tkj-2-05",
    "nis": "23240205",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-06",
    "user_id": "usr-std-xi-tkj-2-06",
    "nis": "23240206",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-07",
    "user_id": "usr-std-xi-tkj-2-07",
    "nis": "23240207",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-08",
    "user_id": "usr-std-xi-tkj-2-08",
    "nis": "23240208",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-09",
    "user_id": "usr-std-xi-tkj-2-09",
    "nis": "23240209",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-10",
    "user_id": "usr-std-xi-tkj-2-10",
    "nis": "23240210",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-11",
    "user_id": "usr-std-xi-tkj-2-11",
    "nis": "23240211",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-12",
    "user_id": "usr-std-xi-tkj-2-12",
    "nis": "23240212",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-13",
    "user_id": "usr-std-xi-tkj-2-13",
    "nis": "23240213",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-14",
    "user_id": "usr-std-xi-tkj-2-14",
    "nis": "23240214",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-15",
    "user_id": "usr-std-xi-tkj-2-15",
    "nis": "23240215",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-16",
    "user_id": "usr-std-xi-tkj-2-16",
    "nis": "23240216",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-17",
    "user_id": "usr-std-xi-tkj-2-17",
    "nis": "23240217",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-18",
    "user_id": "usr-std-xi-tkj-2-18",
    "nis": "23240218",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-19",
    "user_id": "usr-std-xi-tkj-2-19",
    "nis": "23240219",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-20",
    "user_id": "usr-std-xi-tkj-2-20",
    "nis": "23240220",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-21",
    "user_id": "usr-std-xi-tkj-2-21",
    "nis": "23240221",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-22",
    "user_id": "usr-std-xi-tkj-2-22",
    "nis": "23240222",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-23",
    "user_id": "usr-std-xi-tkj-2-23",
    "nis": "23240223",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-24",
    "user_id": "usr-std-xi-tkj-2-24",
    "nis": "23240224",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-25",
    "user_id": "usr-std-xi-tkj-2-25",
    "nis": "23240225",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-26",
    "user_id": "usr-std-xi-tkj-2-26",
    "nis": "23240226",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-27",
    "user_id": "usr-std-xi-tkj-2-27",
    "nis": "23240227",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-28",
    "user_id": "usr-std-xi-tkj-2-28",
    "nis": "23240228",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-29",
    "user_id": "usr-std-xi-tkj-2-29",
    "nis": "23240229",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-30",
    "user_id": "usr-std-xi-tkj-2-30",
    "nis": "23240230",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-31",
    "user_id": "usr-std-xi-tkj-2-31",
    "nis": "23240231",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-32",
    "user_id": "usr-std-xi-tkj-2-32",
    "nis": "23240232",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-33",
    "user_id": "usr-std-xi-tkj-2-33",
    "nis": "23240233",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-2-34",
    "user_id": "usr-std-xi-tkj-2-34",
    "nis": "23240234",
    "class_id": "cls-xi-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-01",
    "user_id": "usr-std-xi-tkj-3-01",
    "nis": "23240301",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-02",
    "user_id": "usr-std-xi-tkj-3-02",
    "nis": "23240302",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-03",
    "user_id": "usr-std-xi-tkj-3-03",
    "nis": "23240303",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-04",
    "user_id": "usr-std-xi-tkj-3-04",
    "nis": "23240304",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-05",
    "user_id": "usr-std-xi-tkj-3-05",
    "nis": "23240305",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-06",
    "user_id": "usr-std-xi-tkj-3-06",
    "nis": "23240306",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-07",
    "user_id": "usr-std-xi-tkj-3-07",
    "nis": "23240307",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-08",
    "user_id": "usr-std-xi-tkj-3-08",
    "nis": "23240308",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-09",
    "user_id": "usr-std-xi-tkj-3-09",
    "nis": "23240309",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-10",
    "user_id": "usr-std-xi-tkj-3-10",
    "nis": "23240310",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-11",
    "user_id": "usr-std-xi-tkj-3-11",
    "nis": "23240311",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-12",
    "user_id": "usr-std-xi-tkj-3-12",
    "nis": "23240312",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-13",
    "user_id": "usr-std-xi-tkj-3-13",
    "nis": "23240313",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-14",
    "user_id": "usr-std-xi-tkj-3-14",
    "nis": "23240314",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-15",
    "user_id": "usr-std-xi-tkj-3-15",
    "nis": "23240315",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-16",
    "user_id": "usr-std-xi-tkj-3-16",
    "nis": "23240316",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-17",
    "user_id": "usr-std-xi-tkj-3-17",
    "nis": "23240317",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-18",
    "user_id": "usr-std-xi-tkj-3-18",
    "nis": "23240318",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-19",
    "user_id": "usr-std-xi-tkj-3-19",
    "nis": "23240319",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-20",
    "user_id": "usr-std-xi-tkj-3-20",
    "nis": "23240320",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-21",
    "user_id": "usr-std-xi-tkj-3-21",
    "nis": "23240321",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-22",
    "user_id": "usr-std-xi-tkj-3-22",
    "nis": "23240322",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-23",
    "user_id": "usr-std-xi-tkj-3-23",
    "nis": "23240323",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-24",
    "user_id": "usr-std-xi-tkj-3-24",
    "nis": "23240324",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-25",
    "user_id": "usr-std-xi-tkj-3-25",
    "nis": "23240325",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-26",
    "user_id": "usr-std-xi-tkj-3-26",
    "nis": "23240326",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-27",
    "user_id": "usr-std-xi-tkj-3-27",
    "nis": "23240327",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-28",
    "user_id": "usr-std-xi-tkj-3-28",
    "nis": "23240328",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-29",
    "user_id": "usr-std-xi-tkj-3-29",
    "nis": "23240329",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-30",
    "user_id": "usr-std-xi-tkj-3-30",
    "nis": "23240330",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-31",
    "user_id": "usr-std-xi-tkj-3-31",
    "nis": "23240331",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-32",
    "user_id": "usr-std-xi-tkj-3-32",
    "nis": "23240332",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-33",
    "user_id": "usr-std-xi-tkj-3-33",
    "nis": "23240333",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkj-3-34",
    "user_id": "usr-std-xi-tkj-3-34",
    "nis": "23240334",
    "class_id": "cls-xi-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-01",
    "user_id": "usr-std-xi-tkp-1-01",
    "nis": "23240401",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-02",
    "user_id": "usr-std-xi-tkp-1-02",
    "nis": "23240402",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-03",
    "user_id": "usr-std-xi-tkp-1-03",
    "nis": "23240403",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-04",
    "user_id": "usr-std-xi-tkp-1-04",
    "nis": "23240404",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-05",
    "user_id": "usr-std-xi-tkp-1-05",
    "nis": "23240405",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-06",
    "user_id": "usr-std-xi-tkp-1-06",
    "nis": "23240406",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-07",
    "user_id": "usr-std-xi-tkp-1-07",
    "nis": "23240407",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-08",
    "user_id": "usr-std-xi-tkp-1-08",
    "nis": "23240408",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-09",
    "user_id": "usr-std-xi-tkp-1-09",
    "nis": "23240409",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-10",
    "user_id": "usr-std-xi-tkp-1-10",
    "nis": "23240410",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-11",
    "user_id": "usr-std-xi-tkp-1-11",
    "nis": "23240411",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-12",
    "user_id": "usr-std-xi-tkp-1-12",
    "nis": "23240412",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-13",
    "user_id": "usr-std-xi-tkp-1-13",
    "nis": "23240413",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-14",
    "user_id": "usr-std-xi-tkp-1-14",
    "nis": "23240414",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-15",
    "user_id": "usr-std-xi-tkp-1-15",
    "nis": "23240415",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-16",
    "user_id": "usr-std-xi-tkp-1-16",
    "nis": "23240416",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-17",
    "user_id": "usr-std-xi-tkp-1-17",
    "nis": "23240417",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-18",
    "user_id": "usr-std-xi-tkp-1-18",
    "nis": "23240418",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-19",
    "user_id": "usr-std-xi-tkp-1-19",
    "nis": "23240419",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-20",
    "user_id": "usr-std-xi-tkp-1-20",
    "nis": "23240420",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-21",
    "user_id": "usr-std-xi-tkp-1-21",
    "nis": "23240421",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-22",
    "user_id": "usr-std-xi-tkp-1-22",
    "nis": "23240422",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-23",
    "user_id": "usr-std-xi-tkp-1-23",
    "nis": "23240423",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-24",
    "user_id": "usr-std-xi-tkp-1-24",
    "nis": "23240424",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-25",
    "user_id": "usr-std-xi-tkp-1-25",
    "nis": "23240425",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-26",
    "user_id": "usr-std-xi-tkp-1-26",
    "nis": "23240426",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-27",
    "user_id": "usr-std-xi-tkp-1-27",
    "nis": "23240427",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-28",
    "user_id": "usr-std-xi-tkp-1-28",
    "nis": "23240428",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-29",
    "user_id": "usr-std-xi-tkp-1-29",
    "nis": "23240429",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-30",
    "user_id": "usr-std-xi-tkp-1-30",
    "nis": "23240430",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-31",
    "user_id": "usr-std-xi-tkp-1-31",
    "nis": "23240431",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-32",
    "user_id": "usr-std-xi-tkp-1-32",
    "nis": "23240432",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-33",
    "user_id": "usr-std-xi-tkp-1-33",
    "nis": "23240433",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-1-34",
    "user_id": "usr-std-xi-tkp-1-34",
    "nis": "23240434",
    "class_id": "cls-xi-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-01",
    "user_id": "usr-std-xi-tkp-2-01",
    "nis": "23240501",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-02",
    "user_id": "usr-std-xi-tkp-2-02",
    "nis": "23240502",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-03",
    "user_id": "usr-std-xi-tkp-2-03",
    "nis": "23240503",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-04",
    "user_id": "usr-std-xi-tkp-2-04",
    "nis": "23240504",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-05",
    "user_id": "usr-std-xi-tkp-2-05",
    "nis": "23240505",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-06",
    "user_id": "usr-std-xi-tkp-2-06",
    "nis": "23240506",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-07",
    "user_id": "usr-std-xi-tkp-2-07",
    "nis": "23240507",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-08",
    "user_id": "usr-std-xi-tkp-2-08",
    "nis": "23240508",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-09",
    "user_id": "usr-std-xi-tkp-2-09",
    "nis": "23240509",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-10",
    "user_id": "usr-std-xi-tkp-2-10",
    "nis": "23240510",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-11",
    "user_id": "usr-std-xi-tkp-2-11",
    "nis": "23240511",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-12",
    "user_id": "usr-std-xi-tkp-2-12",
    "nis": "23240512",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-13",
    "user_id": "usr-std-xi-tkp-2-13",
    "nis": "23240513",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-14",
    "user_id": "usr-std-xi-tkp-2-14",
    "nis": "23240514",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-15",
    "user_id": "usr-std-xi-tkp-2-15",
    "nis": "23240515",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-16",
    "user_id": "usr-std-xi-tkp-2-16",
    "nis": "23240516",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-17",
    "user_id": "usr-std-xi-tkp-2-17",
    "nis": "23240517",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-18",
    "user_id": "usr-std-xi-tkp-2-18",
    "nis": "23240518",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-19",
    "user_id": "usr-std-xi-tkp-2-19",
    "nis": "23240519",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-20",
    "user_id": "usr-std-xi-tkp-2-20",
    "nis": "23240520",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-21",
    "user_id": "usr-std-xi-tkp-2-21",
    "nis": "23240521",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-22",
    "user_id": "usr-std-xi-tkp-2-22",
    "nis": "23240522",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-23",
    "user_id": "usr-std-xi-tkp-2-23",
    "nis": "23240523",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-24",
    "user_id": "usr-std-xi-tkp-2-24",
    "nis": "23240524",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-25",
    "user_id": "usr-std-xi-tkp-2-25",
    "nis": "23240525",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-26",
    "user_id": "usr-std-xi-tkp-2-26",
    "nis": "23240526",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-27",
    "user_id": "usr-std-xi-tkp-2-27",
    "nis": "23240527",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-28",
    "user_id": "usr-std-xi-tkp-2-28",
    "nis": "23240528",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-29",
    "user_id": "usr-std-xi-tkp-2-29",
    "nis": "23240529",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-30",
    "user_id": "usr-std-xi-tkp-2-30",
    "nis": "23240530",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-31",
    "user_id": "usr-std-xi-tkp-2-31",
    "nis": "23240531",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-32",
    "user_id": "usr-std-xi-tkp-2-32",
    "nis": "23240532",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-33",
    "user_id": "usr-std-xi-tkp-2-33",
    "nis": "23240533",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-tkp-2-34",
    "user_id": "usr-std-xi-tkp-2-34",
    "nis": "23240534",
    "class_id": "cls-xi-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-01",
    "user_id": "usr-std-xi-to-1-01",
    "nis": "23240601",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-02",
    "user_id": "usr-std-xi-to-1-02",
    "nis": "23240602",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-03",
    "user_id": "usr-std-xi-to-1-03",
    "nis": "23240603",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-04",
    "user_id": "usr-std-xi-to-1-04",
    "nis": "23240604",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-05",
    "user_id": "usr-std-xi-to-1-05",
    "nis": "23240605",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-06",
    "user_id": "usr-std-xi-to-1-06",
    "nis": "23240606",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-07",
    "user_id": "usr-std-xi-to-1-07",
    "nis": "23240607",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-08",
    "user_id": "usr-std-xi-to-1-08",
    "nis": "23240608",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-09",
    "user_id": "usr-std-xi-to-1-09",
    "nis": "23240609",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-10",
    "user_id": "usr-std-xi-to-1-10",
    "nis": "23240610",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-11",
    "user_id": "usr-std-xi-to-1-11",
    "nis": "23240611",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-12",
    "user_id": "usr-std-xi-to-1-12",
    "nis": "23240612",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-13",
    "user_id": "usr-std-xi-to-1-13",
    "nis": "23240613",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-14",
    "user_id": "usr-std-xi-to-1-14",
    "nis": "23240614",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-15",
    "user_id": "usr-std-xi-to-1-15",
    "nis": "23240615",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-16",
    "user_id": "usr-std-xi-to-1-16",
    "nis": "23240616",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-17",
    "user_id": "usr-std-xi-to-1-17",
    "nis": "23240617",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-18",
    "user_id": "usr-std-xi-to-1-18",
    "nis": "23240618",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-19",
    "user_id": "usr-std-xi-to-1-19",
    "nis": "23240619",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-20",
    "user_id": "usr-std-xi-to-1-20",
    "nis": "23240620",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-21",
    "user_id": "usr-std-xi-to-1-21",
    "nis": "23240621",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-22",
    "user_id": "usr-std-xi-to-1-22",
    "nis": "23240622",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-23",
    "user_id": "usr-std-xi-to-1-23",
    "nis": "23240623",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-24",
    "user_id": "usr-std-xi-to-1-24",
    "nis": "23240624",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-25",
    "user_id": "usr-std-xi-to-1-25",
    "nis": "23240625",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-26",
    "user_id": "usr-std-xi-to-1-26",
    "nis": "23240626",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-27",
    "user_id": "usr-std-xi-to-1-27",
    "nis": "23240627",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-28",
    "user_id": "usr-std-xi-to-1-28",
    "nis": "23240628",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-29",
    "user_id": "usr-std-xi-to-1-29",
    "nis": "23240629",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-30",
    "user_id": "usr-std-xi-to-1-30",
    "nis": "23240630",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-31",
    "user_id": "usr-std-xi-to-1-31",
    "nis": "23240631",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-32",
    "user_id": "usr-std-xi-to-1-32",
    "nis": "23240632",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-33",
    "user_id": "usr-std-xi-to-1-33",
    "nis": "23240633",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-1-34",
    "user_id": "usr-std-xi-to-1-34",
    "nis": "23240634",
    "class_id": "cls-xi-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-01",
    "user_id": "usr-std-xi-to-2-01",
    "nis": "23240701",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-02",
    "user_id": "usr-std-xi-to-2-02",
    "nis": "23240702",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-03",
    "user_id": "usr-std-xi-to-2-03",
    "nis": "23240703",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-04",
    "user_id": "usr-std-xi-to-2-04",
    "nis": "23240704",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-05",
    "user_id": "usr-std-xi-to-2-05",
    "nis": "23240705",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-06",
    "user_id": "usr-std-xi-to-2-06",
    "nis": "23240706",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-07",
    "user_id": "usr-std-xi-to-2-07",
    "nis": "23240707",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-08",
    "user_id": "usr-std-xi-to-2-08",
    "nis": "23240708",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-09",
    "user_id": "usr-std-xi-to-2-09",
    "nis": "23240709",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-10",
    "user_id": "usr-std-xi-to-2-10",
    "nis": "23240710",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-11",
    "user_id": "usr-std-xi-to-2-11",
    "nis": "23240711",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-12",
    "user_id": "usr-std-xi-to-2-12",
    "nis": "23240712",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-13",
    "user_id": "usr-std-xi-to-2-13",
    "nis": "23240713",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-14",
    "user_id": "usr-std-xi-to-2-14",
    "nis": "23240714",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-15",
    "user_id": "usr-std-xi-to-2-15",
    "nis": "23240715",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-16",
    "user_id": "usr-std-xi-to-2-16",
    "nis": "23240716",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-17",
    "user_id": "usr-std-xi-to-2-17",
    "nis": "23240717",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-18",
    "user_id": "usr-std-xi-to-2-18",
    "nis": "23240718",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-19",
    "user_id": "usr-std-xi-to-2-19",
    "nis": "23240719",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-20",
    "user_id": "usr-std-xi-to-2-20",
    "nis": "23240720",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-21",
    "user_id": "usr-std-xi-to-2-21",
    "nis": "23240721",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-22",
    "user_id": "usr-std-xi-to-2-22",
    "nis": "23240722",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-23",
    "user_id": "usr-std-xi-to-2-23",
    "nis": "23240723",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-24",
    "user_id": "usr-std-xi-to-2-24",
    "nis": "23240724",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-25",
    "user_id": "usr-std-xi-to-2-25",
    "nis": "23240725",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-26",
    "user_id": "usr-std-xi-to-2-26",
    "nis": "23240726",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-27",
    "user_id": "usr-std-xi-to-2-27",
    "nis": "23240727",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-28",
    "user_id": "usr-std-xi-to-2-28",
    "nis": "23240728",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-29",
    "user_id": "usr-std-xi-to-2-29",
    "nis": "23240729",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-30",
    "user_id": "usr-std-xi-to-2-30",
    "nis": "23240730",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-31",
    "user_id": "usr-std-xi-to-2-31",
    "nis": "23240731",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-32",
    "user_id": "usr-std-xi-to-2-32",
    "nis": "23240732",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-33",
    "user_id": "usr-std-xi-to-2-33",
    "nis": "23240733",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-2-34",
    "user_id": "usr-std-xi-to-2-34",
    "nis": "23240734",
    "class_id": "cls-xi-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-01",
    "user_id": "usr-std-xi-to-3-01",
    "nis": "23240801",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-02",
    "user_id": "usr-std-xi-to-3-02",
    "nis": "23240802",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-03",
    "user_id": "usr-std-xi-to-3-03",
    "nis": "23240803",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-04",
    "user_id": "usr-std-xi-to-3-04",
    "nis": "23240804",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-05",
    "user_id": "usr-std-xi-to-3-05",
    "nis": "23240805",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-06",
    "user_id": "usr-std-xi-to-3-06",
    "nis": "23240806",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-07",
    "user_id": "usr-std-xi-to-3-07",
    "nis": "23240807",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-08",
    "user_id": "usr-std-xi-to-3-08",
    "nis": "23240808",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-09",
    "user_id": "usr-std-xi-to-3-09",
    "nis": "23240809",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-10",
    "user_id": "usr-std-xi-to-3-10",
    "nis": "23240810",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-11",
    "user_id": "usr-std-xi-to-3-11",
    "nis": "23240811",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-12",
    "user_id": "usr-std-xi-to-3-12",
    "nis": "23240812",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-13",
    "user_id": "usr-std-xi-to-3-13",
    "nis": "23240813",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-14",
    "user_id": "usr-std-xi-to-3-14",
    "nis": "23240814",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-15",
    "user_id": "usr-std-xi-to-3-15",
    "nis": "23240815",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-16",
    "user_id": "usr-std-xi-to-3-16",
    "nis": "23240816",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-17",
    "user_id": "usr-std-xi-to-3-17",
    "nis": "23240817",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-18",
    "user_id": "usr-std-xi-to-3-18",
    "nis": "23240818",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-19",
    "user_id": "usr-std-xi-to-3-19",
    "nis": "23240819",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-20",
    "user_id": "usr-std-xi-to-3-20",
    "nis": "23240820",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-21",
    "user_id": "usr-std-xi-to-3-21",
    "nis": "23240821",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-22",
    "user_id": "usr-std-xi-to-3-22",
    "nis": "23240822",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-23",
    "user_id": "usr-std-xi-to-3-23",
    "nis": "23240823",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-24",
    "user_id": "usr-std-xi-to-3-24",
    "nis": "23240824",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-25",
    "user_id": "usr-std-xi-to-3-25",
    "nis": "23240825",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-26",
    "user_id": "usr-std-xi-to-3-26",
    "nis": "23240826",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-27",
    "user_id": "usr-std-xi-to-3-27",
    "nis": "23240827",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-28",
    "user_id": "usr-std-xi-to-3-28",
    "nis": "23240828",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-29",
    "user_id": "usr-std-xi-to-3-29",
    "nis": "23240829",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-30",
    "user_id": "usr-std-xi-to-3-30",
    "nis": "23240830",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-31",
    "user_id": "usr-std-xi-to-3-31",
    "nis": "23240831",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-32",
    "user_id": "usr-std-xi-to-3-32",
    "nis": "23240832",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-33",
    "user_id": "usr-std-xi-to-3-33",
    "nis": "23240833",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-to-3-34",
    "user_id": "usr-std-xi-to-3-34",
    "nis": "23240834",
    "class_id": "cls-xi-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-01",
    "user_id": "usr-std-xi-dkv-1-01",
    "nis": "23240901",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-02",
    "user_id": "usr-std-xi-dkv-1-02",
    "nis": "23240902",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-03",
    "user_id": "usr-std-xi-dkv-1-03",
    "nis": "23240903",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-04",
    "user_id": "usr-std-xi-dkv-1-04",
    "nis": "23240904",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-05",
    "user_id": "usr-std-xi-dkv-1-05",
    "nis": "23240905",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-06",
    "user_id": "usr-std-xi-dkv-1-06",
    "nis": "23240906",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-07",
    "user_id": "usr-std-xi-dkv-1-07",
    "nis": "23240907",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-08",
    "user_id": "usr-std-xi-dkv-1-08",
    "nis": "23240908",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-09",
    "user_id": "usr-std-xi-dkv-1-09",
    "nis": "23240909",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-10",
    "user_id": "usr-std-xi-dkv-1-10",
    "nis": "23240910",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-11",
    "user_id": "usr-std-xi-dkv-1-11",
    "nis": "23240911",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-12",
    "user_id": "usr-std-xi-dkv-1-12",
    "nis": "23240912",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-13",
    "user_id": "usr-std-xi-dkv-1-13",
    "nis": "23240913",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-14",
    "user_id": "usr-std-xi-dkv-1-14",
    "nis": "23240914",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-15",
    "user_id": "usr-std-xi-dkv-1-15",
    "nis": "23240915",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-16",
    "user_id": "usr-std-xi-dkv-1-16",
    "nis": "23240916",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-17",
    "user_id": "usr-std-xi-dkv-1-17",
    "nis": "23240917",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-18",
    "user_id": "usr-std-xi-dkv-1-18",
    "nis": "23240918",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-19",
    "user_id": "usr-std-xi-dkv-1-19",
    "nis": "23240919",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-20",
    "user_id": "usr-std-xi-dkv-1-20",
    "nis": "23240920",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-21",
    "user_id": "usr-std-xi-dkv-1-21",
    "nis": "23240921",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-22",
    "user_id": "usr-std-xi-dkv-1-22",
    "nis": "23240922",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-23",
    "user_id": "usr-std-xi-dkv-1-23",
    "nis": "23240923",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-24",
    "user_id": "usr-std-xi-dkv-1-24",
    "nis": "23240924",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-25",
    "user_id": "usr-std-xi-dkv-1-25",
    "nis": "23240925",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-26",
    "user_id": "usr-std-xi-dkv-1-26",
    "nis": "23240926",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-27",
    "user_id": "usr-std-xi-dkv-1-27",
    "nis": "23240927",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-28",
    "user_id": "usr-std-xi-dkv-1-28",
    "nis": "23240928",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-29",
    "user_id": "usr-std-xi-dkv-1-29",
    "nis": "23240929",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-30",
    "user_id": "usr-std-xi-dkv-1-30",
    "nis": "23240930",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-31",
    "user_id": "usr-std-xi-dkv-1-31",
    "nis": "23240931",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-32",
    "user_id": "usr-std-xi-dkv-1-32",
    "nis": "23240932",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-33",
    "user_id": "usr-std-xi-dkv-1-33",
    "nis": "23240933",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-1-34",
    "user_id": "usr-std-xi-dkv-1-34",
    "nis": "23240934",
    "class_id": "cls-xi-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-01",
    "user_id": "usr-std-xi-dkv-2-01",
    "nis": "23241001",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-02",
    "user_id": "usr-std-xi-dkv-2-02",
    "nis": "23241002",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-03",
    "user_id": "usr-std-xi-dkv-2-03",
    "nis": "23241003",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-04",
    "user_id": "usr-std-xi-dkv-2-04",
    "nis": "23241004",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-05",
    "user_id": "usr-std-xi-dkv-2-05",
    "nis": "23241005",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-06",
    "user_id": "usr-std-xi-dkv-2-06",
    "nis": "23241006",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-07",
    "user_id": "usr-std-xi-dkv-2-07",
    "nis": "23241007",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-08",
    "user_id": "usr-std-xi-dkv-2-08",
    "nis": "23241008",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-09",
    "user_id": "usr-std-xi-dkv-2-09",
    "nis": "23241009",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-10",
    "user_id": "usr-std-xi-dkv-2-10",
    "nis": "23241010",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-11",
    "user_id": "usr-std-xi-dkv-2-11",
    "nis": "23241011",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-12",
    "user_id": "usr-std-xi-dkv-2-12",
    "nis": "23241012",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-13",
    "user_id": "usr-std-xi-dkv-2-13",
    "nis": "23241013",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-14",
    "user_id": "usr-std-xi-dkv-2-14",
    "nis": "23241014",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-15",
    "user_id": "usr-std-xi-dkv-2-15",
    "nis": "23241015",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-16",
    "user_id": "usr-std-xi-dkv-2-16",
    "nis": "23241016",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-17",
    "user_id": "usr-std-xi-dkv-2-17",
    "nis": "23241017",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-18",
    "user_id": "usr-std-xi-dkv-2-18",
    "nis": "23241018",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-19",
    "user_id": "usr-std-xi-dkv-2-19",
    "nis": "23241019",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-20",
    "user_id": "usr-std-xi-dkv-2-20",
    "nis": "23241020",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-21",
    "user_id": "usr-std-xi-dkv-2-21",
    "nis": "23241021",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-22",
    "user_id": "usr-std-xi-dkv-2-22",
    "nis": "23241022",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-23",
    "user_id": "usr-std-xi-dkv-2-23",
    "nis": "23241023",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-24",
    "user_id": "usr-std-xi-dkv-2-24",
    "nis": "23241024",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-25",
    "user_id": "usr-std-xi-dkv-2-25",
    "nis": "23241025",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-26",
    "user_id": "usr-std-xi-dkv-2-26",
    "nis": "23241026",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-27",
    "user_id": "usr-std-xi-dkv-2-27",
    "nis": "23241027",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-28",
    "user_id": "usr-std-xi-dkv-2-28",
    "nis": "23241028",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-29",
    "user_id": "usr-std-xi-dkv-2-29",
    "nis": "23241029",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-30",
    "user_id": "usr-std-xi-dkv-2-30",
    "nis": "23241030",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-31",
    "user_id": "usr-std-xi-dkv-2-31",
    "nis": "23241031",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-32",
    "user_id": "usr-std-xi-dkv-2-32",
    "nis": "23241032",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-33",
    "user_id": "usr-std-xi-dkv-2-33",
    "nis": "23241033",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-dkv-2-34",
    "user_id": "usr-std-xi-dkv-2-34",
    "nis": "23241034",
    "class_id": "cls-xi-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-01",
    "user_id": "usr-std-xi-akl-1-01",
    "nis": "23241101",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-02",
    "user_id": "usr-std-xi-akl-1-02",
    "nis": "23241102",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-03",
    "user_id": "usr-std-xi-akl-1-03",
    "nis": "23241103",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-04",
    "user_id": "usr-std-xi-akl-1-04",
    "nis": "23241104",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-05",
    "user_id": "usr-std-xi-akl-1-05",
    "nis": "23241105",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-06",
    "user_id": "usr-std-xi-akl-1-06",
    "nis": "23241106",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-07",
    "user_id": "usr-std-xi-akl-1-07",
    "nis": "23241107",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-08",
    "user_id": "usr-std-xi-akl-1-08",
    "nis": "23241108",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-09",
    "user_id": "usr-std-xi-akl-1-09",
    "nis": "23241109",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-10",
    "user_id": "usr-std-xi-akl-1-10",
    "nis": "23241110",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-11",
    "user_id": "usr-std-xi-akl-1-11",
    "nis": "23241111",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-12",
    "user_id": "usr-std-xi-akl-1-12",
    "nis": "23241112",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-13",
    "user_id": "usr-std-xi-akl-1-13",
    "nis": "23241113",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-14",
    "user_id": "usr-std-xi-akl-1-14",
    "nis": "23241114",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-15",
    "user_id": "usr-std-xi-akl-1-15",
    "nis": "23241115",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-16",
    "user_id": "usr-std-xi-akl-1-16",
    "nis": "23241116",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-17",
    "user_id": "usr-std-xi-akl-1-17",
    "nis": "23241117",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-18",
    "user_id": "usr-std-xi-akl-1-18",
    "nis": "23241118",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-19",
    "user_id": "usr-std-xi-akl-1-19",
    "nis": "23241119",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-20",
    "user_id": "usr-std-xi-akl-1-20",
    "nis": "23241120",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-21",
    "user_id": "usr-std-xi-akl-1-21",
    "nis": "23241121",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-22",
    "user_id": "usr-std-xi-akl-1-22",
    "nis": "23241122",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-23",
    "user_id": "usr-std-xi-akl-1-23",
    "nis": "23241123",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-24",
    "user_id": "usr-std-xi-akl-1-24",
    "nis": "23241124",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-25",
    "user_id": "usr-std-xi-akl-1-25",
    "nis": "23241125",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-26",
    "user_id": "usr-std-xi-akl-1-26",
    "nis": "23241126",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-27",
    "user_id": "usr-std-xi-akl-1-27",
    "nis": "23241127",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-28",
    "user_id": "usr-std-xi-akl-1-28",
    "nis": "23241128",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-29",
    "user_id": "usr-std-xi-akl-1-29",
    "nis": "23241129",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-30",
    "user_id": "usr-std-xi-akl-1-30",
    "nis": "23241130",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-31",
    "user_id": "usr-std-xi-akl-1-31",
    "nis": "23241131",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-32",
    "user_id": "usr-std-xi-akl-1-32",
    "nis": "23241132",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-33",
    "user_id": "usr-std-xi-akl-1-33",
    "nis": "23241133",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xi-akl-1-34",
    "user_id": "usr-std-xi-akl-1-34",
    "nis": "23241134",
    "class_id": "cls-xi-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-01",
    "user_id": "usr-std-xii-tkj-1-01",
    "nis": "22230101",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-02",
    "user_id": "usr-std-xii-tkj-1-02",
    "nis": "22230102",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-03",
    "user_id": "usr-std-xii-tkj-1-03",
    "nis": "22230103",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-04",
    "user_id": "usr-std-xii-tkj-1-04",
    "nis": "22230104",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-05",
    "user_id": "usr-std-xii-tkj-1-05",
    "nis": "22230105",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-06",
    "user_id": "usr-std-xii-tkj-1-06",
    "nis": "22230106",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-07",
    "user_id": "usr-std-xii-tkj-1-07",
    "nis": "22230107",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-08",
    "user_id": "usr-std-xii-tkj-1-08",
    "nis": "22230108",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-09",
    "user_id": "usr-std-xii-tkj-1-09",
    "nis": "22230109",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-10",
    "user_id": "usr-std-xii-tkj-1-10",
    "nis": "22230110",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-11",
    "user_id": "usr-std-xii-tkj-1-11",
    "nis": "22230111",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-12",
    "user_id": "usr-std-xii-tkj-1-12",
    "nis": "22230112",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-13",
    "user_id": "usr-std-xii-tkj-1-13",
    "nis": "22230113",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-14",
    "user_id": "usr-std-xii-tkj-1-14",
    "nis": "22230114",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-15",
    "user_id": "usr-std-xii-tkj-1-15",
    "nis": "22230115",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-16",
    "user_id": "usr-std-xii-tkj-1-16",
    "nis": "22230116",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-17",
    "user_id": "usr-std-xii-tkj-1-17",
    "nis": "22230117",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-18",
    "user_id": "usr-std-xii-tkj-1-18",
    "nis": "22230118",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-19",
    "user_id": "usr-std-xii-tkj-1-19",
    "nis": "22230119",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-20",
    "user_id": "usr-std-xii-tkj-1-20",
    "nis": "22230120",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-21",
    "user_id": "usr-std-xii-tkj-1-21",
    "nis": "22230121",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-22",
    "user_id": "usr-std-xii-tkj-1-22",
    "nis": "22230122",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-23",
    "user_id": "usr-std-xii-tkj-1-23",
    "nis": "22230123",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-24",
    "user_id": "usr-std-xii-tkj-1-24",
    "nis": "22230124",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-25",
    "user_id": "usr-std-xii-tkj-1-25",
    "nis": "22230125",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-26",
    "user_id": "usr-std-xii-tkj-1-26",
    "nis": "22230126",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-27",
    "user_id": "usr-std-xii-tkj-1-27",
    "nis": "22230127",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-28",
    "user_id": "usr-std-xii-tkj-1-28",
    "nis": "22230128",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-29",
    "user_id": "usr-std-xii-tkj-1-29",
    "nis": "22230129",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-30",
    "user_id": "usr-std-xii-tkj-1-30",
    "nis": "22230130",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-31",
    "user_id": "usr-std-xii-tkj-1-31",
    "nis": "22230131",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-32",
    "user_id": "usr-std-xii-tkj-1-32",
    "nis": "22230132",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-33",
    "user_id": "usr-std-xii-tkj-1-33",
    "nis": "22230133",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-1-34",
    "user_id": "usr-std-xii-tkj-1-34",
    "nis": "22230134",
    "class_id": "cls-xii-tkj-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-01",
    "user_id": "usr-std-xii-tkj-2-01",
    "nis": "22230201",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-02",
    "user_id": "usr-std-xii-tkj-2-02",
    "nis": "22230202",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-03",
    "user_id": "usr-std-xii-tkj-2-03",
    "nis": "22230203",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-04",
    "user_id": "usr-std-xii-tkj-2-04",
    "nis": "22230204",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-05",
    "user_id": "usr-std-xii-tkj-2-05",
    "nis": "22230205",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-06",
    "user_id": "usr-std-xii-tkj-2-06",
    "nis": "22230206",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-07",
    "user_id": "usr-std-xii-tkj-2-07",
    "nis": "22230207",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-08",
    "user_id": "usr-std-xii-tkj-2-08",
    "nis": "22230208",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-09",
    "user_id": "usr-std-xii-tkj-2-09",
    "nis": "22230209",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-10",
    "user_id": "usr-std-xii-tkj-2-10",
    "nis": "22230210",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-11",
    "user_id": "usr-std-xii-tkj-2-11",
    "nis": "22230211",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-12",
    "user_id": "usr-std-xii-tkj-2-12",
    "nis": "22230212",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-13",
    "user_id": "usr-std-xii-tkj-2-13",
    "nis": "22230213",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-14",
    "user_id": "usr-std-xii-tkj-2-14",
    "nis": "22230214",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-15",
    "user_id": "usr-std-xii-tkj-2-15",
    "nis": "22230215",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-16",
    "user_id": "usr-std-xii-tkj-2-16",
    "nis": "22230216",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-17",
    "user_id": "usr-std-xii-tkj-2-17",
    "nis": "22230217",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-18",
    "user_id": "usr-std-xii-tkj-2-18",
    "nis": "22230218",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-19",
    "user_id": "usr-std-xii-tkj-2-19",
    "nis": "22230219",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-20",
    "user_id": "usr-std-xii-tkj-2-20",
    "nis": "22230220",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-21",
    "user_id": "usr-std-xii-tkj-2-21",
    "nis": "22230221",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-22",
    "user_id": "usr-std-xii-tkj-2-22",
    "nis": "22230222",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-23",
    "user_id": "usr-std-xii-tkj-2-23",
    "nis": "22230223",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-24",
    "user_id": "usr-std-xii-tkj-2-24",
    "nis": "22230224",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-25",
    "user_id": "usr-std-xii-tkj-2-25",
    "nis": "22230225",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-26",
    "user_id": "usr-std-xii-tkj-2-26",
    "nis": "22230226",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-27",
    "user_id": "usr-std-xii-tkj-2-27",
    "nis": "22230227",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-28",
    "user_id": "usr-std-xii-tkj-2-28",
    "nis": "22230228",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-29",
    "user_id": "usr-std-xii-tkj-2-29",
    "nis": "22230229",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-30",
    "user_id": "usr-std-xii-tkj-2-30",
    "nis": "22230230",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-31",
    "user_id": "usr-std-xii-tkj-2-31",
    "nis": "22230231",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-32",
    "user_id": "usr-std-xii-tkj-2-32",
    "nis": "22230232",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-33",
    "user_id": "usr-std-xii-tkj-2-33",
    "nis": "22230233",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-2-34",
    "user_id": "usr-std-xii-tkj-2-34",
    "nis": "22230234",
    "class_id": "cls-xii-tkj-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-01",
    "user_id": "usr-std-xii-tkj-3-01",
    "nis": "22230301",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-02",
    "user_id": "usr-std-xii-tkj-3-02",
    "nis": "22230302",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-03",
    "user_id": "usr-std-xii-tkj-3-03",
    "nis": "22230303",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-04",
    "user_id": "usr-std-xii-tkj-3-04",
    "nis": "22230304",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-05",
    "user_id": "usr-std-xii-tkj-3-05",
    "nis": "22230305",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-06",
    "user_id": "usr-std-xii-tkj-3-06",
    "nis": "22230306",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-07",
    "user_id": "usr-std-xii-tkj-3-07",
    "nis": "22230307",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-08",
    "user_id": "usr-std-xii-tkj-3-08",
    "nis": "22230308",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-09",
    "user_id": "usr-std-xii-tkj-3-09",
    "nis": "22230309",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-10",
    "user_id": "usr-std-xii-tkj-3-10",
    "nis": "22230310",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-11",
    "user_id": "usr-std-xii-tkj-3-11",
    "nis": "22230311",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-12",
    "user_id": "usr-std-xii-tkj-3-12",
    "nis": "22230312",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-13",
    "user_id": "usr-std-xii-tkj-3-13",
    "nis": "22230313",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-14",
    "user_id": "usr-std-xii-tkj-3-14",
    "nis": "22230314",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-15",
    "user_id": "usr-std-xii-tkj-3-15",
    "nis": "22230315",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-16",
    "user_id": "usr-std-xii-tkj-3-16",
    "nis": "22230316",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-17",
    "user_id": "usr-std-xii-tkj-3-17",
    "nis": "22230317",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-18",
    "user_id": "usr-std-xii-tkj-3-18",
    "nis": "22230318",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-19",
    "user_id": "usr-std-xii-tkj-3-19",
    "nis": "22230319",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-20",
    "user_id": "usr-std-xii-tkj-3-20",
    "nis": "22230320",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-21",
    "user_id": "usr-std-xii-tkj-3-21",
    "nis": "22230321",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-22",
    "user_id": "usr-std-xii-tkj-3-22",
    "nis": "22230322",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-23",
    "user_id": "usr-std-xii-tkj-3-23",
    "nis": "22230323",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-24",
    "user_id": "usr-std-xii-tkj-3-24",
    "nis": "22230324",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-25",
    "user_id": "usr-std-xii-tkj-3-25",
    "nis": "22230325",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-26",
    "user_id": "usr-std-xii-tkj-3-26",
    "nis": "22230326",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-27",
    "user_id": "usr-std-xii-tkj-3-27",
    "nis": "22230327",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-28",
    "user_id": "usr-std-xii-tkj-3-28",
    "nis": "22230328",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-29",
    "user_id": "usr-std-xii-tkj-3-29",
    "nis": "22230329",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-30",
    "user_id": "usr-std-xii-tkj-3-30",
    "nis": "22230330",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-31",
    "user_id": "usr-std-xii-tkj-3-31",
    "nis": "22230331",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-32",
    "user_id": "usr-std-xii-tkj-3-32",
    "nis": "22230332",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-33",
    "user_id": "usr-std-xii-tkj-3-33",
    "nis": "22230333",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkj-3-34",
    "user_id": "usr-std-xii-tkj-3-34",
    "nis": "22230334",
    "class_id": "cls-xii-tkj-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-01",
    "user_id": "usr-std-xii-tkp-1-01",
    "nis": "22230401",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-02",
    "user_id": "usr-std-xii-tkp-1-02",
    "nis": "22230402",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-03",
    "user_id": "usr-std-xii-tkp-1-03",
    "nis": "22230403",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-04",
    "user_id": "usr-std-xii-tkp-1-04",
    "nis": "22230404",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-05",
    "user_id": "usr-std-xii-tkp-1-05",
    "nis": "22230405",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-06",
    "user_id": "usr-std-xii-tkp-1-06",
    "nis": "22230406",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-07",
    "user_id": "usr-std-xii-tkp-1-07",
    "nis": "22230407",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-08",
    "user_id": "usr-std-xii-tkp-1-08",
    "nis": "22230408",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-09",
    "user_id": "usr-std-xii-tkp-1-09",
    "nis": "22230409",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-10",
    "user_id": "usr-std-xii-tkp-1-10",
    "nis": "22230410",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-11",
    "user_id": "usr-std-xii-tkp-1-11",
    "nis": "22230411",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-12",
    "user_id": "usr-std-xii-tkp-1-12",
    "nis": "22230412",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-13",
    "user_id": "usr-std-xii-tkp-1-13",
    "nis": "22230413",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-14",
    "user_id": "usr-std-xii-tkp-1-14",
    "nis": "22230414",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-15",
    "user_id": "usr-std-xii-tkp-1-15",
    "nis": "22230415",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-16",
    "user_id": "usr-std-xii-tkp-1-16",
    "nis": "22230416",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-17",
    "user_id": "usr-std-xii-tkp-1-17",
    "nis": "22230417",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-18",
    "user_id": "usr-std-xii-tkp-1-18",
    "nis": "22230418",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-19",
    "user_id": "usr-std-xii-tkp-1-19",
    "nis": "22230419",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-20",
    "user_id": "usr-std-xii-tkp-1-20",
    "nis": "22230420",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-21",
    "user_id": "usr-std-xii-tkp-1-21",
    "nis": "22230421",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-22",
    "user_id": "usr-std-xii-tkp-1-22",
    "nis": "22230422",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-23",
    "user_id": "usr-std-xii-tkp-1-23",
    "nis": "22230423",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-24",
    "user_id": "usr-std-xii-tkp-1-24",
    "nis": "22230424",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-25",
    "user_id": "usr-std-xii-tkp-1-25",
    "nis": "22230425",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-26",
    "user_id": "usr-std-xii-tkp-1-26",
    "nis": "22230426",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-27",
    "user_id": "usr-std-xii-tkp-1-27",
    "nis": "22230427",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-28",
    "user_id": "usr-std-xii-tkp-1-28",
    "nis": "22230428",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-29",
    "user_id": "usr-std-xii-tkp-1-29",
    "nis": "22230429",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-30",
    "user_id": "usr-std-xii-tkp-1-30",
    "nis": "22230430",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-31",
    "user_id": "usr-std-xii-tkp-1-31",
    "nis": "22230431",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-32",
    "user_id": "usr-std-xii-tkp-1-32",
    "nis": "22230432",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-33",
    "user_id": "usr-std-xii-tkp-1-33",
    "nis": "22230433",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-1-34",
    "user_id": "usr-std-xii-tkp-1-34",
    "nis": "22230434",
    "class_id": "cls-xii-tkp-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-01",
    "user_id": "usr-std-xii-tkp-2-01",
    "nis": "22230501",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-02",
    "user_id": "usr-std-xii-tkp-2-02",
    "nis": "22230502",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-03",
    "user_id": "usr-std-xii-tkp-2-03",
    "nis": "22230503",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-04",
    "user_id": "usr-std-xii-tkp-2-04",
    "nis": "22230504",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-05",
    "user_id": "usr-std-xii-tkp-2-05",
    "nis": "22230505",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-06",
    "user_id": "usr-std-xii-tkp-2-06",
    "nis": "22230506",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-07",
    "user_id": "usr-std-xii-tkp-2-07",
    "nis": "22230507",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-08",
    "user_id": "usr-std-xii-tkp-2-08",
    "nis": "22230508",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-09",
    "user_id": "usr-std-xii-tkp-2-09",
    "nis": "22230509",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-10",
    "user_id": "usr-std-xii-tkp-2-10",
    "nis": "22230510",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-11",
    "user_id": "usr-std-xii-tkp-2-11",
    "nis": "22230511",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-12",
    "user_id": "usr-std-xii-tkp-2-12",
    "nis": "22230512",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-13",
    "user_id": "usr-std-xii-tkp-2-13",
    "nis": "22230513",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-14",
    "user_id": "usr-std-xii-tkp-2-14",
    "nis": "22230514",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-15",
    "user_id": "usr-std-xii-tkp-2-15",
    "nis": "22230515",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-16",
    "user_id": "usr-std-xii-tkp-2-16",
    "nis": "22230516",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-17",
    "user_id": "usr-std-xii-tkp-2-17",
    "nis": "22230517",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-18",
    "user_id": "usr-std-xii-tkp-2-18",
    "nis": "22230518",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-19",
    "user_id": "usr-std-xii-tkp-2-19",
    "nis": "22230519",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-20",
    "user_id": "usr-std-xii-tkp-2-20",
    "nis": "22230520",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-21",
    "user_id": "usr-std-xii-tkp-2-21",
    "nis": "22230521",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-22",
    "user_id": "usr-std-xii-tkp-2-22",
    "nis": "22230522",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-23",
    "user_id": "usr-std-xii-tkp-2-23",
    "nis": "22230523",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-24",
    "user_id": "usr-std-xii-tkp-2-24",
    "nis": "22230524",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-25",
    "user_id": "usr-std-xii-tkp-2-25",
    "nis": "22230525",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-26",
    "user_id": "usr-std-xii-tkp-2-26",
    "nis": "22230526",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-27",
    "user_id": "usr-std-xii-tkp-2-27",
    "nis": "22230527",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-28",
    "user_id": "usr-std-xii-tkp-2-28",
    "nis": "22230528",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-29",
    "user_id": "usr-std-xii-tkp-2-29",
    "nis": "22230529",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-30",
    "user_id": "usr-std-xii-tkp-2-30",
    "nis": "22230530",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-31",
    "user_id": "usr-std-xii-tkp-2-31",
    "nis": "22230531",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-32",
    "user_id": "usr-std-xii-tkp-2-32",
    "nis": "22230532",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-33",
    "user_id": "usr-std-xii-tkp-2-33",
    "nis": "22230533",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-tkp-2-34",
    "user_id": "usr-std-xii-tkp-2-34",
    "nis": "22230534",
    "class_id": "cls-xii-tkp-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-01",
    "user_id": "usr-std-xii-to-1-01",
    "nis": "22230601",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-02",
    "user_id": "usr-std-xii-to-1-02",
    "nis": "22230602",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-03",
    "user_id": "usr-std-xii-to-1-03",
    "nis": "22230603",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-04",
    "user_id": "usr-std-xii-to-1-04",
    "nis": "22230604",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-05",
    "user_id": "usr-std-xii-to-1-05",
    "nis": "22230605",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-06",
    "user_id": "usr-std-xii-to-1-06",
    "nis": "22230606",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-07",
    "user_id": "usr-std-xii-to-1-07",
    "nis": "22230607",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-08",
    "user_id": "usr-std-xii-to-1-08",
    "nis": "22230608",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-09",
    "user_id": "usr-std-xii-to-1-09",
    "nis": "22230609",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-10",
    "user_id": "usr-std-xii-to-1-10",
    "nis": "22230610",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-11",
    "user_id": "usr-std-xii-to-1-11",
    "nis": "22230611",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-12",
    "user_id": "usr-std-xii-to-1-12",
    "nis": "22230612",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-13",
    "user_id": "usr-std-xii-to-1-13",
    "nis": "22230613",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-14",
    "user_id": "usr-std-xii-to-1-14",
    "nis": "22230614",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-15",
    "user_id": "usr-std-xii-to-1-15",
    "nis": "22230615",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-16",
    "user_id": "usr-std-xii-to-1-16",
    "nis": "22230616",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-17",
    "user_id": "usr-std-xii-to-1-17",
    "nis": "22230617",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-18",
    "user_id": "usr-std-xii-to-1-18",
    "nis": "22230618",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-19",
    "user_id": "usr-std-xii-to-1-19",
    "nis": "22230619",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-20",
    "user_id": "usr-std-xii-to-1-20",
    "nis": "22230620",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-21",
    "user_id": "usr-std-xii-to-1-21",
    "nis": "22230621",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-22",
    "user_id": "usr-std-xii-to-1-22",
    "nis": "22230622",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-23",
    "user_id": "usr-std-xii-to-1-23",
    "nis": "22230623",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-24",
    "user_id": "usr-std-xii-to-1-24",
    "nis": "22230624",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-25",
    "user_id": "usr-std-xii-to-1-25",
    "nis": "22230625",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-26",
    "user_id": "usr-std-xii-to-1-26",
    "nis": "22230626",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-27",
    "user_id": "usr-std-xii-to-1-27",
    "nis": "22230627",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-28",
    "user_id": "usr-std-xii-to-1-28",
    "nis": "22230628",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-29",
    "user_id": "usr-std-xii-to-1-29",
    "nis": "22230629",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-30",
    "user_id": "usr-std-xii-to-1-30",
    "nis": "22230630",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-31",
    "user_id": "usr-std-xii-to-1-31",
    "nis": "22230631",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-32",
    "user_id": "usr-std-xii-to-1-32",
    "nis": "22230632",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-33",
    "user_id": "usr-std-xii-to-1-33",
    "nis": "22230633",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-1-34",
    "user_id": "usr-std-xii-to-1-34",
    "nis": "22230634",
    "class_id": "cls-xii-to-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-01",
    "user_id": "usr-std-xii-to-2-01",
    "nis": "22230701",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-02",
    "user_id": "usr-std-xii-to-2-02",
    "nis": "22230702",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-03",
    "user_id": "usr-std-xii-to-2-03",
    "nis": "22230703",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-04",
    "user_id": "usr-std-xii-to-2-04",
    "nis": "22230704",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-05",
    "user_id": "usr-std-xii-to-2-05",
    "nis": "22230705",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-06",
    "user_id": "usr-std-xii-to-2-06",
    "nis": "22230706",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-07",
    "user_id": "usr-std-xii-to-2-07",
    "nis": "22230707",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-08",
    "user_id": "usr-std-xii-to-2-08",
    "nis": "22230708",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-09",
    "user_id": "usr-std-xii-to-2-09",
    "nis": "22230709",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-10",
    "user_id": "usr-std-xii-to-2-10",
    "nis": "22230710",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-11",
    "user_id": "usr-std-xii-to-2-11",
    "nis": "22230711",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-12",
    "user_id": "usr-std-xii-to-2-12",
    "nis": "22230712",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-13",
    "user_id": "usr-std-xii-to-2-13",
    "nis": "22230713",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-14",
    "user_id": "usr-std-xii-to-2-14",
    "nis": "22230714",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-15",
    "user_id": "usr-std-xii-to-2-15",
    "nis": "22230715",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-16",
    "user_id": "usr-std-xii-to-2-16",
    "nis": "22230716",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-17",
    "user_id": "usr-std-xii-to-2-17",
    "nis": "22230717",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-18",
    "user_id": "usr-std-xii-to-2-18",
    "nis": "22230718",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-19",
    "user_id": "usr-std-xii-to-2-19",
    "nis": "22230719",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-20",
    "user_id": "usr-std-xii-to-2-20",
    "nis": "22230720",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-21",
    "user_id": "usr-std-xii-to-2-21",
    "nis": "22230721",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-22",
    "user_id": "usr-std-xii-to-2-22",
    "nis": "22230722",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-23",
    "user_id": "usr-std-xii-to-2-23",
    "nis": "22230723",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-24",
    "user_id": "usr-std-xii-to-2-24",
    "nis": "22230724",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-25",
    "user_id": "usr-std-xii-to-2-25",
    "nis": "22230725",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-26",
    "user_id": "usr-std-xii-to-2-26",
    "nis": "22230726",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-27",
    "user_id": "usr-std-xii-to-2-27",
    "nis": "22230727",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-28",
    "user_id": "usr-std-xii-to-2-28",
    "nis": "22230728",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-29",
    "user_id": "usr-std-xii-to-2-29",
    "nis": "22230729",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-30",
    "user_id": "usr-std-xii-to-2-30",
    "nis": "22230730",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-31",
    "user_id": "usr-std-xii-to-2-31",
    "nis": "22230731",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-32",
    "user_id": "usr-std-xii-to-2-32",
    "nis": "22230732",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-33",
    "user_id": "usr-std-xii-to-2-33",
    "nis": "22230733",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-2-34",
    "user_id": "usr-std-xii-to-2-34",
    "nis": "22230734",
    "class_id": "cls-xii-to-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-01",
    "user_id": "usr-std-xii-to-3-01",
    "nis": "22230801",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-02",
    "user_id": "usr-std-xii-to-3-02",
    "nis": "22230802",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-03",
    "user_id": "usr-std-xii-to-3-03",
    "nis": "22230803",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-04",
    "user_id": "usr-std-xii-to-3-04",
    "nis": "22230804",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-05",
    "user_id": "usr-std-xii-to-3-05",
    "nis": "22230805",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-06",
    "user_id": "usr-std-xii-to-3-06",
    "nis": "22230806",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-07",
    "user_id": "usr-std-xii-to-3-07",
    "nis": "22230807",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-08",
    "user_id": "usr-std-xii-to-3-08",
    "nis": "22230808",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-09",
    "user_id": "usr-std-xii-to-3-09",
    "nis": "22230809",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-10",
    "user_id": "usr-std-xii-to-3-10",
    "nis": "22230810",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-11",
    "user_id": "usr-std-xii-to-3-11",
    "nis": "22230811",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-12",
    "user_id": "usr-std-xii-to-3-12",
    "nis": "22230812",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-13",
    "user_id": "usr-std-xii-to-3-13",
    "nis": "22230813",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-14",
    "user_id": "usr-std-xii-to-3-14",
    "nis": "22230814",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-15",
    "user_id": "usr-std-xii-to-3-15",
    "nis": "22230815",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-16",
    "user_id": "usr-std-xii-to-3-16",
    "nis": "22230816",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-17",
    "user_id": "usr-std-xii-to-3-17",
    "nis": "22230817",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-18",
    "user_id": "usr-std-xii-to-3-18",
    "nis": "22230818",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-19",
    "user_id": "usr-std-xii-to-3-19",
    "nis": "22230819",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-20",
    "user_id": "usr-std-xii-to-3-20",
    "nis": "22230820",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-21",
    "user_id": "usr-std-xii-to-3-21",
    "nis": "22230821",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-22",
    "user_id": "usr-std-xii-to-3-22",
    "nis": "22230822",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-23",
    "user_id": "usr-std-xii-to-3-23",
    "nis": "22230823",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-24",
    "user_id": "usr-std-xii-to-3-24",
    "nis": "22230824",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-25",
    "user_id": "usr-std-xii-to-3-25",
    "nis": "22230825",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-26",
    "user_id": "usr-std-xii-to-3-26",
    "nis": "22230826",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-27",
    "user_id": "usr-std-xii-to-3-27",
    "nis": "22230827",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-28",
    "user_id": "usr-std-xii-to-3-28",
    "nis": "22230828",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-29",
    "user_id": "usr-std-xii-to-3-29",
    "nis": "22230829",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-30",
    "user_id": "usr-std-xii-to-3-30",
    "nis": "22230830",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-31",
    "user_id": "usr-std-xii-to-3-31",
    "nis": "22230831",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-32",
    "user_id": "usr-std-xii-to-3-32",
    "nis": "22230832",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-33",
    "user_id": "usr-std-xii-to-3-33",
    "nis": "22230833",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-to-3-34",
    "user_id": "usr-std-xii-to-3-34",
    "nis": "22230834",
    "class_id": "cls-xii-to-3",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-01",
    "user_id": "usr-std-xii-dkv-1-01",
    "nis": "22230901",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-02",
    "user_id": "usr-std-xii-dkv-1-02",
    "nis": "22230902",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-03",
    "user_id": "usr-std-xii-dkv-1-03",
    "nis": "22230903",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-04",
    "user_id": "usr-std-xii-dkv-1-04",
    "nis": "22230904",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-05",
    "user_id": "usr-std-xii-dkv-1-05",
    "nis": "22230905",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-06",
    "user_id": "usr-std-xii-dkv-1-06",
    "nis": "22230906",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-07",
    "user_id": "usr-std-xii-dkv-1-07",
    "nis": "22230907",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-08",
    "user_id": "usr-std-xii-dkv-1-08",
    "nis": "22230908",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-09",
    "user_id": "usr-std-xii-dkv-1-09",
    "nis": "22230909",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-10",
    "user_id": "usr-std-xii-dkv-1-10",
    "nis": "22230910",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-11",
    "user_id": "usr-std-xii-dkv-1-11",
    "nis": "22230911",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-12",
    "user_id": "usr-std-xii-dkv-1-12",
    "nis": "22230912",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-13",
    "user_id": "usr-std-xii-dkv-1-13",
    "nis": "22230913",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-14",
    "user_id": "usr-std-xii-dkv-1-14",
    "nis": "22230914",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-15",
    "user_id": "usr-std-xii-dkv-1-15",
    "nis": "22230915",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-16",
    "user_id": "usr-std-xii-dkv-1-16",
    "nis": "22230916",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-17",
    "user_id": "usr-std-xii-dkv-1-17",
    "nis": "22230917",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-18",
    "user_id": "usr-std-xii-dkv-1-18",
    "nis": "22230918",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-19",
    "user_id": "usr-std-xii-dkv-1-19",
    "nis": "22230919",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-20",
    "user_id": "usr-std-xii-dkv-1-20",
    "nis": "22230920",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-21",
    "user_id": "usr-std-xii-dkv-1-21",
    "nis": "22230921",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-22",
    "user_id": "usr-std-xii-dkv-1-22",
    "nis": "22230922",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-23",
    "user_id": "usr-std-xii-dkv-1-23",
    "nis": "22230923",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-24",
    "user_id": "usr-std-xii-dkv-1-24",
    "nis": "22230924",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-25",
    "user_id": "usr-std-xii-dkv-1-25",
    "nis": "22230925",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-26",
    "user_id": "usr-std-xii-dkv-1-26",
    "nis": "22230926",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-27",
    "user_id": "usr-std-xii-dkv-1-27",
    "nis": "22230927",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-28",
    "user_id": "usr-std-xii-dkv-1-28",
    "nis": "22230928",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-29",
    "user_id": "usr-std-xii-dkv-1-29",
    "nis": "22230929",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-30",
    "user_id": "usr-std-xii-dkv-1-30",
    "nis": "22230930",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-31",
    "user_id": "usr-std-xii-dkv-1-31",
    "nis": "22230931",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-32",
    "user_id": "usr-std-xii-dkv-1-32",
    "nis": "22230932",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-33",
    "user_id": "usr-std-xii-dkv-1-33",
    "nis": "22230933",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-1-34",
    "user_id": "usr-std-xii-dkv-1-34",
    "nis": "22230934",
    "class_id": "cls-xii-dkv-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-01",
    "user_id": "usr-std-xii-dkv-2-01",
    "nis": "22231001",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-02",
    "user_id": "usr-std-xii-dkv-2-02",
    "nis": "22231002",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-03",
    "user_id": "usr-std-xii-dkv-2-03",
    "nis": "22231003",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-04",
    "user_id": "usr-std-xii-dkv-2-04",
    "nis": "22231004",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-05",
    "user_id": "usr-std-xii-dkv-2-05",
    "nis": "22231005",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-06",
    "user_id": "usr-std-xii-dkv-2-06",
    "nis": "22231006",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-07",
    "user_id": "usr-std-xii-dkv-2-07",
    "nis": "22231007",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-08",
    "user_id": "usr-std-xii-dkv-2-08",
    "nis": "22231008",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-09",
    "user_id": "usr-std-xii-dkv-2-09",
    "nis": "22231009",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-10",
    "user_id": "usr-std-xii-dkv-2-10",
    "nis": "22231010",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-11",
    "user_id": "usr-std-xii-dkv-2-11",
    "nis": "22231011",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-12",
    "user_id": "usr-std-xii-dkv-2-12",
    "nis": "22231012",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-13",
    "user_id": "usr-std-xii-dkv-2-13",
    "nis": "22231013",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-14",
    "user_id": "usr-std-xii-dkv-2-14",
    "nis": "22231014",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-15",
    "user_id": "usr-std-xii-dkv-2-15",
    "nis": "22231015",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-16",
    "user_id": "usr-std-xii-dkv-2-16",
    "nis": "22231016",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-17",
    "user_id": "usr-std-xii-dkv-2-17",
    "nis": "22231017",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-18",
    "user_id": "usr-std-xii-dkv-2-18",
    "nis": "22231018",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-19",
    "user_id": "usr-std-xii-dkv-2-19",
    "nis": "22231019",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-20",
    "user_id": "usr-std-xii-dkv-2-20",
    "nis": "22231020",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-21",
    "user_id": "usr-std-xii-dkv-2-21",
    "nis": "22231021",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-22",
    "user_id": "usr-std-xii-dkv-2-22",
    "nis": "22231022",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-23",
    "user_id": "usr-std-xii-dkv-2-23",
    "nis": "22231023",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-24",
    "user_id": "usr-std-xii-dkv-2-24",
    "nis": "22231024",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-25",
    "user_id": "usr-std-xii-dkv-2-25",
    "nis": "22231025",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-26",
    "user_id": "usr-std-xii-dkv-2-26",
    "nis": "22231026",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-27",
    "user_id": "usr-std-xii-dkv-2-27",
    "nis": "22231027",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-28",
    "user_id": "usr-std-xii-dkv-2-28",
    "nis": "22231028",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-29",
    "user_id": "usr-std-xii-dkv-2-29",
    "nis": "22231029",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-30",
    "user_id": "usr-std-xii-dkv-2-30",
    "nis": "22231030",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-31",
    "user_id": "usr-std-xii-dkv-2-31",
    "nis": "22231031",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-32",
    "user_id": "usr-std-xii-dkv-2-32",
    "nis": "22231032",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-33",
    "user_id": "usr-std-xii-dkv-2-33",
    "nis": "22231033",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-dkv-2-34",
    "user_id": "usr-std-xii-dkv-2-34",
    "nis": "22231034",
    "class_id": "cls-xii-dkv-2",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-01",
    "user_id": "usr-std-xii-akl-1-01",
    "nis": "22231101",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-02",
    "user_id": "usr-std-xii-akl-1-02",
    "nis": "22231102",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-03",
    "user_id": "usr-std-xii-akl-1-03",
    "nis": "22231103",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-04",
    "user_id": "usr-std-xii-akl-1-04",
    "nis": "22231104",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-05",
    "user_id": "usr-std-xii-akl-1-05",
    "nis": "22231105",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-06",
    "user_id": "usr-std-xii-akl-1-06",
    "nis": "22231106",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-07",
    "user_id": "usr-std-xii-akl-1-07",
    "nis": "22231107",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-08",
    "user_id": "usr-std-xii-akl-1-08",
    "nis": "22231108",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-09",
    "user_id": "usr-std-xii-akl-1-09",
    "nis": "22231109",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-10",
    "user_id": "usr-std-xii-akl-1-10",
    "nis": "22231110",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-11",
    "user_id": "usr-std-xii-akl-1-11",
    "nis": "22231111",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-12",
    "user_id": "usr-std-xii-akl-1-12",
    "nis": "22231112",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-13",
    "user_id": "usr-std-xii-akl-1-13",
    "nis": "22231113",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-14",
    "user_id": "usr-std-xii-akl-1-14",
    "nis": "22231114",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-15",
    "user_id": "usr-std-xii-akl-1-15",
    "nis": "22231115",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-16",
    "user_id": "usr-std-xii-akl-1-16",
    "nis": "22231116",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-17",
    "user_id": "usr-std-xii-akl-1-17",
    "nis": "22231117",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-18",
    "user_id": "usr-std-xii-akl-1-18",
    "nis": "22231118",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-19",
    "user_id": "usr-std-xii-akl-1-19",
    "nis": "22231119",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-20",
    "user_id": "usr-std-xii-akl-1-20",
    "nis": "22231120",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-21",
    "user_id": "usr-std-xii-akl-1-21",
    "nis": "22231121",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-22",
    "user_id": "usr-std-xii-akl-1-22",
    "nis": "22231122",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-23",
    "user_id": "usr-std-xii-akl-1-23",
    "nis": "22231123",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-24",
    "user_id": "usr-std-xii-akl-1-24",
    "nis": "22231124",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-25",
    "user_id": "usr-std-xii-akl-1-25",
    "nis": "22231125",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-26",
    "user_id": "usr-std-xii-akl-1-26",
    "nis": "22231126",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-27",
    "user_id": "usr-std-xii-akl-1-27",
    "nis": "22231127",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-28",
    "user_id": "usr-std-xii-akl-1-28",
    "nis": "22231128",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-29",
    "user_id": "usr-std-xii-akl-1-29",
    "nis": "22231129",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-30",
    "user_id": "usr-std-xii-akl-1-30",
    "nis": "22231130",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-31",
    "user_id": "usr-std-xii-akl-1-31",
    "nis": "22231131",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-32",
    "user_id": "usr-std-xii-akl-1-32",
    "nis": "22231132",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-33",
    "user_id": "usr-std-xii-akl-1-33",
    "nis": "22231133",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "std-xii-akl-1-34",
    "user_id": "usr-std-xii-akl-1-34",
    "nis": "22231134",
    "class_id": "cls-xii-akl-1",
    "created_at": "2026-01-15T08:00:00Z"
  }
];

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
  return `tch-bk-${num}`;
}
