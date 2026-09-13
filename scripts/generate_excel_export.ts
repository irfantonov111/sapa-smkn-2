import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Load seed data from src/services/seedData.ts
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES
} from '../src/services/seedData.ts';

const wb = XLSX.utils.book_new();

// 1. Sheet Semua Pengguna
const allRows: (string | number)[][] = [
  ['No', 'Kategori Akun', 'Nama Lengkap', 'Username / ID Login', 'Kata Sandi (Password)', 'Email', 'NIS / NIP', 'Kelas / Rombel', 'No. Telepon / WA', 'Status Kata Sandi']
];

// 2. Sheet Siswa
const studentRows: (string | number)[][] = [
  ['No', 'Nama Lengkap Siswa', 'NIS', 'Kelas', 'Username Login (NIS)', 'Kata Sandi Default', 'Email Siswa', 'No. Telepon / WA', 'Status Akun']
];

// 3. Sheet Guru BK
const bkRows: (string | number)[][] = [
  ['No', 'Nama Lengkap & Gelar', 'NIP', 'Username Login (Email / NIP)', 'Kata Sandi Default', 'Email Resmi', 'Spesialisasi Konseling', 'Ruangan', 'No. Telepon / WA']
];

// 4. Sheet Wali Kelas
const waliRows: (string | number)[][] = [
  ['No', 'Nama Lengkap & Gelar', 'NIP', 'Username Login (Email / NIP)', 'Kata Sandi Default', 'Email Resmi', 'Kelas Binaan', 'Ruangan', 'No. Telepon / WA']
];

// 5. Sheet Admin
const adminRows: (string | number)[][] = [
  ['No', 'Nama Administrator', 'Username Login (Email / Alias)', 'Kata Sandi Default', 'Email Akun', 'No. Telepon / WA', 'Hak Akses']
];

let numAll = 1;
let numStudent = 1;
let numBk = 1;
let numWali = 1;
let numAdmin = 1;

INITIAL_USERS.forEach(u => {
  const studentInfo = INITIAL_STUDENTS.find(s => s.user_id === u.id);
  const teacherInfo = INITIAL_TEACHERS.find(t => t.user_id === u.id);
  const classInfo = studentInfo ? INITIAL_CLASSES.find(c => c.id === studentInfo.class_id) : undefined;
  const managedClass = teacherInfo ? INITIAL_CLASSES.find(c => c.homeroom_teacher_id === teacherInfo.id) : undefined;

  let roleLabel = 'Pengguna';
  let username = u.email;
  let password = '***';
  let idNumber = '-';
  let className = '-';
  let passwordStatus = u.password_changed ? 'Telah Diubah Mandiri' : 'Sandi Default';

  if (u.role === 'admin') {
    roleLabel = 'Administrator';
    username = `${u.email} (atau: admin)`;
    password = 'admin123';
    adminRows.push([
      numAdmin++,
      u.name,
      u.email,
      'admin123',
      u.email,
      u.phone || '-',
      'Full Super Admin'
    ]);
  } else if (u.role === 'siswa') {
    roleLabel = 'Siswa';
    const nis = studentInfo?.nis || '-';
    idNumber = nis;
    username = nis; // Siswa logins with NIS
    const defPw = nis !== '-' ? `siswa${nis.slice(-4)}` : 'siswa123';
    password = defPw;
    className = classInfo ? classInfo.name : '-';
    studentRows.push([
      numStudent++,
      u.name,
      nis,
      className,
      nis,
      defPw,
      u.email,
      u.phone || '-',
      passwordStatus
    ]);
  } else if (teacherInfo?.teacher_type === 'guru_bk') {
    roleLabel = 'Guru BK';
    idNumber = teacherInfo.nip;
    username = u.email;
    password = 'guru123';
    className = 'Semua Kelas (BK Sekolah)';
    bkRows.push([
      numBk++,
      u.name,
      teacherInfo.nip,
      u.email,
      'guru123',
      u.email,
      teacherInfo.specialization || '-',
      teacherInfo.room || '-',
      u.phone || '-'
    ]);
  } else if (teacherInfo?.teacher_type === 'wali_kelas') {
    roleLabel = 'Wali Kelas';
    idNumber = teacherInfo.nip;
    username = u.email;
    password = 'guru123';
    className = managedClass ? managedClass.name : '-';
    waliRows.push([
      numWali++,
      u.name,
      teacherInfo.nip,
      u.email,
      'guru123',
      u.email,
      className,
      teacherInfo.room || '-',
      u.phone || '-'
    ]);
  }

  allRows.push([
    numAll++,
    roleLabel,
    u.name,
    username,
    password,
    u.email,
    idNumber,
    className,
    u.phone || '-',
    passwordStatus
  ]);
});

const wsAll = XLSX.utils.aoa_to_sheet(allRows);
const wsStudent = XLSX.utils.aoa_to_sheet(studentRows);
const wsBk = XLSX.utils.aoa_to_sheet(bkRows);
const wsWali = XLSX.utils.aoa_to_sheet(waliRows);
const wsAdmin = XLSX.utils.aoa_to_sheet(adminRows);

// Set column widths
const defaultCols = [
  { wch: 5 },  // No
  { wch: 16 }, // Kategori
  { wch: 30 }, // Nama
  { wch: 26 }, // Username
  { wch: 18 }, // Password
  { wch: 32 }, // Email
  { wch: 22 }, // NIS / NIP
  { wch: 18 }, // Kelas
  { wch: 18 }, // Telepon
  { wch: 18 }  // Status
];
wsAll['!cols'] = defaultCols;
wsStudent['!cols'] = [
  { wch: 5 }, { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 18 }, { wch: 32 }, { wch: 18 }, { wch: 16 }
];
wsBk['!cols'] = [
  { wch: 5 }, { wch: 32 }, { wch: 22 }, { wch: 26 }, { wch: 18 }, { wch: 28 }, { wch: 35 }, { wch: 25 }, { wch: 18 }
];
wsWali['!cols'] = [
  { wch: 5 }, { wch: 32 }, { wch: 22 }, { wch: 26 }, { wch: 18 }, { wch: 28 }, { wch: 18 }, { wch: 25 }, { wch: 18 }
];
wsAdmin['!cols'] = [
  { wch: 5 }, { wch: 28 }, { wch: 26 }, { wch: 18 }, { wch: 26 }, { wch: 18 }, { wch: 20 }
];

XLSX.utils.book_append_sheet(wb, wsAll, 'Semua Pengguna (123)');
XLSX.utils.book_append_sheet(wb, wsStudent, 'Siswa (108)');
XLSX.utils.book_append_sheet(wb, wsBk, 'Guru BK (10)');
XLSX.utils.book_append_sheet(wb, wsWali, 'Wali Kelas (3)');
XLSX.utils.book_append_sheet(wb, wsAdmin, 'Admin (2)');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

const xlsxPath = path.join(process.cwd(), 'public', 'Daftar_Akun_Pengguna_SAPA_Lengkap.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`Generated Excel: ${xlsxPath}`);

// Also export CSV of all users
const csvContent = XLSX.utils.sheet_to_csv(wsAll);
const csvPath = path.join(process.cwd(), 'public', 'Daftar_Akun_Pengguna_SAPA_Lengkap.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log(`Generated CSV: ${csvPath}`);
