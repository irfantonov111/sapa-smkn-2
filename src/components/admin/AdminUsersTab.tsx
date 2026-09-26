import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  Users,
  GraduationCap,
  Briefcase,
  Shield,
  UserCheck,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowUpDown,
  ExternalLink,
  School,
  CheckSquare,
  Square
} from 'lucide-react';
import { db } from '../../services/db';
import { User, Student, Teacher, SchoolClass, Gender } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { generateTemporaryPassword, isPasswordEncrypted } from '../../utils/crypto';
import { decryptNip, maskNip } from '../../utils/nipCrypto';
import { getDefaultAvatarByGender, detectGenderFromName } from '../../utils/avatar2d';
import { TablePagination, PageSizeOption } from '../common/TablePagination';
import { ResponsiveTableContainer } from '../common/ResponsiveTableContainer';
import { BulkDeleteUsersModal } from './BulkDeleteUsersModal';

interface AdminUsersTabProps {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  onRefresh: () => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  students,
  teachers,
  classes,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState<'all' | 'guru_bk' | 'wali_kelas' | 'siswa' | 'admin'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk deletion multi-select state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState<boolean>(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState<boolean>(false);

  // Modals state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ name: '', email: '', nis: '', class_id: '', gender: 'L' as Gender });

  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState({
    name: '',
    email: '',
    nip: '',
    teacher_type: 'guru_bk' as 'guru_bk' | 'wali_kelas',
    gender: 'L' as Gender,
    phone: '',
    specialization: '',
    room: '',
    bio: '',
    available_hours: '',
    managed_class_id: '',
    assigned_class_ids: [] as string[]
  });

  // Edit user modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    gender: 'L' as Gender,
    phone: '',
    password: '',
    nis: '',
    class_id: '',
    homeroom_teacher_id: '',
    nip: '',
    specialization: '',
    room: '',
    bio: '',
    available_hours: '',
    managed_class_id: '',
    assigned_class_ids: [] as string[]
  });

  // Reset password modal state
  const [resetPasswordTarget, setResetPasswordTarget] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState<string>('');
  const [resetResult, setResetResult] = useState<{ plainPassword: string; userName: string } | null>(null);
  const [hasCopiedPassword, setHasCopiedPassword] = useState<boolean>(false);

  // Import summary modal
  const [importSummary, setImportSummary] = useState<{
    show: boolean;
    siswaCount: number;
    bkCount: number;
    waliCount: number;
    kelasCount?: number;
    message: string;
  } | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Pagination & Sorting state
  const [pageSize, setPageSize] = useState<PageSizeOption>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'created_desc' | 'created_asc' | 'role'>('name_asc');

  // System Reset Password Email configuration
  const [systemEmail, setSystemEmail] = useState<string>(() => db.getSystemSettings().reset_password_email);
  const [isSavingEmail, setIsSavingEmail] = useState<boolean>(false);
  const [emailSaveSuccess, setEmailSaveSuccess] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleSaveSystemEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const trimmed = systemEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setEmailError('Format email tidak valid. Masukkan email resmi yang benar (contoh: admin@smk.sch.id).');
      return;
    }
    setIsSavingEmail(true);
    try {
      db.updateSystemSettings({ reset_password_email: trimmed });
      setEmailSaveSuccess(true);
      showFeedback(`Email reset kata sandi berhasil diperbarui ke: ${trimmed}`);
      setTimeout(() => setEmailSaveSuccess(false), 4000);
    } catch {
      setEmailError('Terjadi kesalahan saat menyimpan pengaturan email.');
    } finally {
      setIsSavingEmail(false);
    }
  };

  // Open dedicated password reset modal
  const handleOpenResetPassword = (u: User) => {
    setResetPasswordTarget(u);
    const defaultVal = u.role === 'siswa' ? 'siswa123' : u.role === 'admin' ? 'admin123' : 'guru123';
    setNewPasswordValue(defaultVal);
    setResetResult(null);
    setHasCopiedPassword(false);
  };

  // Execute password reset
  const handleExecuteResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordTarget) return;
    try {
      const plain = newPasswordValue.trim() || generateTemporaryPassword(resetPasswordTarget.role);
      const res = db.resetUserPassword(resetPasswordTarget.id, plain);
      setResetResult({ plainPassword: res.plainPassword, userName: resetPasswordTarget.name });
      onRefresh();
      showFeedback(`Kata sandi akun ${resetPasswordTarget.name} berhasil direset dan dienkripsi.`);
    } catch (err: any) {
      showFeedback(err.message || 'Gagal mereset kata sandi pengguna.', 'error');
    }
  };

  const handleCopyPassword = () => {
    if (resetResult?.plainPassword) {
      navigator.clipboard.writeText(resetResult.plainPassword);
      setHasCopiedPassword(true);
      setTimeout(() => setHasCopiedPassword(false), 3000);
    }
  };

  // Helper to match teacher by NIP, email, or name
  const findTeacherMatch = (val: string, prefType?: 'guru_bk' | 'wali_kelas'): Teacher | undefined => {
    if (!val || val === '-' || val.trim() === '') return undefined;
    const raw = val.trim().toLowerCase();
    const allTeachers = db.getTeachers();
    const candidates = prefType
      ? [...allTeachers.filter(t => t.teacher_type === prefType), ...allTeachers.filter(t => t.teacher_type !== prefType)]
      : allTeachers;

    // 1. By NIP (exact or contained)
    const byNip = candidates.find(t => {
      const plainNip = decryptNip(t.nip).toLowerCase();
      const rawNip = t.nip.toLowerCase();
      return (plainNip && raw.includes(plainNip)) || (rawNip && raw.includes(rawNip));
    });
    if (byNip) return byNip;

    // 2. By Email
    const byEmail = candidates.find(t => {
      const u = db.getUserById(t.user_id);
      return u && raw.includes(u.email.toLowerCase());
    });
    if (byEmail) return byEmail;

    // 3. By Name
    const byName = candidates.find(t => {
      const u = db.getUserById(t.user_id);
      if (!u) return false;
      const tName = u.name.toLowerCase();
      return raw.includes(tName) || tName.includes(raw);
    });
    if (byName) return byName;

    return undefined;
  };

  // 1. Download Excel Template with comprehensive sheets and guidelines
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Data Kelas (Rombel, Wali Kelas, dan Guru BK)
    const classRows = [
      ['Nama Kelas', 'Tingkat (10/11/12)', 'Jurusan', 'Wali Kelas (Nama / NIP)', 'Guru BK (Nama / NIP)', 'Tahun Ajaran'],
      ['X PPLG 1', '10', 'Pengembangan Perangkat Lunak & Gim', 'Drs. Ahmad Fauzi, M.Kom', 'Dra. Hj. Ratna Dewi, M.Pd', '2024/2025'],
      ['XI TKJ 2', '11', 'Teknik Komputer & Jaringan', 'Rina Kartika, S.Pd', 'Bambang Irawan, S.Pd., Kons.', '2024/2025'],
      ['XII DKV 1', '12', 'Desain Komunikasi Visual', 'Drs. Ahmad Fauzi, M.Kom', 'Dra. Hj. Ratna Dewi, M.Pd', '2024/2025']
    ];
    const wsClass = XLSX.utils.aoa_to_sheet(classRows);
    wsClass['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 34 }, { wch: 32 }, { wch: 32 }, { wch: 16 }];

    // Sheet 2: Siswa
    const studentRows = [
      ['Nama', 'Jenis Kelamin (L/P)', 'NIS', 'Kelas', 'Email', 'No HP'],
      ['Dimas Aditya Pratama', 'L', '24250101', 'X PPLG 1', 'dimas.aditya@siswa.belajar.id', '081234567801'],
      ['Anisa Rahmawati', 'P', '24250102', 'XI TKJ 2', 'anisa.rahma@siswa.belajar.id', '081234567802'],
      ['Bagas Alamsyah', 'L', '24250103', 'XII DKV 1', 'bagas.alamsyah@siswa.belajar.id', '081234567803']
    ];
    const wsStudent = XLSX.utils.aoa_to_sheet(studentRows);
    wsStudent['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 32 }, { wch: 18 }];

    // Sheet 3: Guru BK (Dilengkapi Kolom Kelas Binaan)
    const bkRows = [
      ['Nama', 'Jenis Kelamin (L/P)', 'Email', 'NIP', 'No HP', 'Kelas Binaan', 'Spesialisasi', 'Ruangan'],
      ['Dra. Hj. Ratna Dewi, M.Pd', 'P', 'ratna.dewi@guru.belajar.id', '197508121999032001', '081234567891', 'X PPLG 1, XII DKV 1', 'Konseling Pribadi, Sosial & Bullying', 'Ruang BK 1 (Lt. 2)'],
      ['Bambang Irawan, S.Pd., Kons.', 'L', 'bambang.konseling@guru.belajar.id', '198203142006041002', '081234567892', 'XI TKJ 2', 'Layanan Karir & Konsultasi Belajar', 'Ruang BK 2 (Lt. 2)']
    ];
    const wsBK = XLSX.utils.aoa_to_sheet(bkRows);
    wsBK['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 32 }, { wch: 22 }, { wch: 18 }, { wch: 26 }, { wch: 35 }, { wch: 22 }];

    // Sheet 4: Wali Kelas
    const waliRows = [
      ['Nama', 'Jenis Kelamin (L/P)', 'Email', 'NIP', 'No HP', 'Kelas Binaan'],
      ['Drs. Ahmad Fauzi, M.Kom', 'L', 'ahmad.fauzi@guru.belajar.id', '197805122005011003', '081234567893', 'X PPLG 1'],
      ['Rina Kartika, S.Pd', 'P', 'rina.kartika@guru.belajar.id', '198506202009022004', '081234567894', 'XI TKJ 2']
    ];
    const wsWali = XLSX.utils.aoa_to_sheet(waliRows);
    wsWali['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 32 }, { wch: 22 }, { wch: 18 }, { wch: 18 }];

    // Sheet 5: Petunjuk Pengisian
    const guideRows = [
      ['PANDUAN & PETUNJUK FORMAT EXCEL APLIKASI SAPA'],
      [''],
      ['1. PENGISIAN SHEET DATA KELAS:'],
      ['   - Nama Kelas: Nama rombel resmi kelas (Wajib diisi; contoh: X PPLG 1, XI TKJ 2, XII DKV 1).'],
      ['   - Tingkat (10/11/12): Tingkat jenjang kelas (10, 11, atau 12).'],
      ['   - Jurusan: Kompetensi keahlian kelas (contoh: Pengembangan Perangkat Lunak & Gim).'],
      ['   - Wali Kelas (Nama / NIP): Nama lengkap atau NIP guru yang mengampu sebagai Wali Kelas (otomatis ditautkan oleh sistem).'],
      ['   - Guru BK (Nama / NIP): Nama lengkap atau NIP Guru Bimbingan Konseling yang membina kelas tersebut (otomatis ditautkan oleh sistem).'],
      ['   - Tahun Ajaran: Periode kalender pendidikan aktif (contoh: 2024/2025).'],
      [''],
      ['2. PENGISIAN SHEET SISWA:'],
      ['   - Nama: Nama lengkap peserta didik (Wajib diisi)'],
      ['   - Jenis Kelamin (L/P): Isi "L" untuk Laki-laki atau "P" untuk Perempuan (Wajib diisi; menentukan avatar profil default saat login)'],
      ['   - NIS: Nomor Induk Siswa 8 digit unik (Wajib diisi)'],
      ['   - Kelas: Nama rombel kelas (contoh: X PPLG 1, XI TKJ 2, XII DKV 1). Jika kelas belum ada, sistem akan membuat kelas otomatis.'],
      ['   - Email: Alamat email resmi siswa (Opsional; jika kosong otomatis: [NIS]@siswa.belajar.id)'],
      ['   - No HP: Nomor telepon atau WhatsApp siswa / orang tua'],
      ['   - Kata sandi bawaan siswa: siswa + 4 digit terakhir NIS (contoh: siswa0101).'],
      ['   - Siswa diberikan batas 1x ganti kata sandi pribadi sesuai preferensi pada sesi login pertama.'],
      [''],
      ['3. PENGISIAN SHEET GURU BK:'],
      ['   - Nama: Nama lengkap dan gelar Guru BK (Wajib diisi)'],
      ['   - Jenis Kelamin (L/P): Isi "L" untuk Laki-laki atau "P" untuk Perempuan (Wajib diisi; menentukan avatar profil default)'],
      ['   - Email: Email resmi pendidik (Wajib diisi)'],
      ['   - NIP: 18 digit NIP resmi pendidik (Wajib diisi)'],
      ['   - No HP: Nomor telepon atau WhatsApp'],
      ['   - Kelas Binaan: Nama rombel kelas yang dibina oleh Guru BK. Dapat diisi 1 kelas atau beberapa kelas dipisahkan tanda koma (contoh: X PPLG 1, XII DKV 1)'],
      ['   - Spesialisasi: Bidang fokus layanan konseling'],
      ['   - Ruangan: Lokasi ruang bimbingan konseling di sekolah'],
      ['   - Kata sandi default guru: guru123'],
      [''],
      ['4. PENGISIAN SHEET WALI KELAS:'],
      ['   - Nama: Nama lengkap dan gelar Wali Kelas (Wajib diisi)'],
      ['   - Jenis Kelamin (L/P): Isi "L" untuk Laki-laki atau "P" untuk Perempuan (Wajib diisi; menentukan avatar profil default)'],
      ['   - Email: Email resmi pendidik (Wajib diisi)'],
      ['   - NIP: 18 digit NIP resmi pendidik (Wajib diisi)'],
      ['   - No HP: Nomor telepon atau WhatsApp'],
      ['   - Kelas Binaan: Nama rombel yang diampu oleh Wali Kelas (contoh: X PPLG 1)'],
      ['   - Kata sandi default guru: guru123'],
      [''],
      ['5. KETENTUAN FILE & INTEGRASI INTEROPERABILITAS:'],
      ['   - Berkas hasil export data dari dashboard admin dapat langsung diimpor kembali ke sistem tanpa kendala.'],
      ['   - Simpan berkas dalam format .xlsx atau .xls.'],
      ['   - Jangan ubah nama kolom baris pertama (Header).']
    ];
    const wsGuide = XLSX.utils.aoa_to_sheet(guideRows);

    XLSX.utils.book_append_sheet(wb, wsClass, 'Data Kelas');
    XLSX.utils.book_append_sheet(wb, wsStudent, 'Siswa');
    XLSX.utils.book_append_sheet(wb, wsBK, 'Guru BK');
    XLSX.utils.book_append_sheet(wb, wsWali, 'Wali Kelas');
    XLSX.utils.book_append_sheet(wb, wsGuide, 'Petunjuk Pengisian');

    XLSX.writeFile(wb, 'Format_Import_Data_Pengguna_SAPA.xlsx');
    showFeedback('Template Excel berhasil diunduh. Tersedia sheet Data Kelas (Wali & BK), Siswa, Guru BK, dan Wali Kelas.');
  };

  // Export All Users to Excel with complete credentials (Username, Password, Role, Kelas, NIP/NIS, No HP)
  const handleExportUsersExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // 1. Sheet Data Kelas
      const classRows: (string | number)[][] = [
        ['Nama Kelas', 'Tingkat', 'Jurusan', 'Wali Kelas (Nama / NIP)', 'Guru BK (Nama / NIP)', 'Tahun Ajaran', 'Jumlah Siswa']
      ];
      classes.forEach((c) => {
        const wali = teachers.find(t => t.id === c.homeroom_teacher_id || t.user_id === c.homeroom_teacher_id);
        const bk = teachers.find(t => t.id === c.bk_teacher_id || t.user_id === c.bk_teacher_id || t.assigned_class_ids?.includes(c.id));
        const waliUser = wali ? users.find(u => u.id === wali.user_id) : undefined;
        const bkUser = bk ? users.find(u => u.id === bk.user_id) : undefined;
        const count = students.filter(s => s.class_id === c.id).length;
        const waliText = waliUser && wali ? `${waliUser.name} (${decryptNip(wali.nip)})` : '-';
        const bkText = bkUser && bk ? `${bkUser.name} (${decryptNip(bk.nip)})` : '-';
        classRows.push([
          c.name,
          c.grade || '10',
          c.major || 'Umum',
          waliText,
          bkText,
          '2024/2025',
          count
        ]);
      });
      const wsClass = XLSX.utils.aoa_to_sheet(classRows);
      wsClass['!cols'] = [
        { wch: 18 }, { wch: 12 }, { wch: 32 }, { wch: 32 }, { wch: 32 }, { wch: 16 }, { wch: 14 }
      ];

      // 2. Sheet Siswa
      const studentRows: (string | number)[][] = [
        ['Nama', 'Jenis Kelamin (L/P)', 'NIS', 'Kelas', 'Email', 'No HP', 'Kata Sandi Default', 'Status Akun']
      ];

      // 3. Sheet Guru BK (Dilengkapi Kolom Kelas Binaan)
      const bkRows: (string | number)[][] = [
        ['Nama', 'Jenis Kelamin (L/P)', 'Email', 'NIP', 'No HP', 'Kelas Binaan', 'Spesialisasi', 'Ruangan', 'Kata Sandi Default']
      ];

      // 4. Sheet Wali Kelas
      const waliRows: (string | number)[][] = [
        ['Nama', 'Jenis Kelamin (L/P)', 'Email', 'NIP', 'No HP', 'Kelas Binaan', 'Ruangan', 'Kata Sandi Default']
      ];

      // 5. Sheet Semua Kredensial Pengguna
      const allRows: (string | number)[][] = [
        ['No', 'Kategori Akun', 'Nama Lengkap', 'Jenis Kelamin', 'Username / ID Login', 'Kata Sandi (Password)', 'Email', 'NIS / NIP', 'Kelas / Rombel', 'No. Telepon / WA', 'Status Kata Sandi']
      ];

      // 6. Sheet Admin
      const adminRows: (string | number)[][] = [
        ['No', 'Nama Administrator', 'Jenis Kelamin', 'Username Login (Email / Alias)', 'Kata Sandi Default', 'Email Akun', 'No. Telepon / WA', 'Hak Akses']
      ];

      let numAll = 1;
      let numAdmin = 1;

      users.forEach(u => {
        const studentInfo = students.find(s => s.user_id === u.id);
        const teacherInfo = teachers.find(t => t.user_id === u.id);
        const classInfo = studentInfo ? classes.find(c => c.id === studentInfo.class_id) : undefined;
        const managedClass = teacherInfo ? classes.find(c => c.homeroom_teacher_id === teacherInfo.id || c.homeroom_teacher_id === teacherInfo.user_id || c.id === teacherInfo.managed_class_id) : undefined;

        const effectiveGender: Gender = u.gender || studentInfo?.gender || teacherInfo?.gender || detectGenderFromName(u.name);
        const genderLabel = effectiveGender === 'P' ? 'Perempuan (P)' : 'Laki-laki (L)';
        const genderCode = effectiveGender;

        let roleLabel = 'Pengguna';
        let username = u.email;
        let password = '***';
        let idNumber = '-';
        let className = '-';
        const passwordStatus = u.password_changed ? 'Telah Diubah Mandiri' : 'Sandi Default';

        if (u.role === 'admin') {
          roleLabel = 'Administrator';
          username = `${u.email} (atau: admin)`;
          password = 'admin123';
          adminRows.push([
            numAdmin++,
            u.name,
            genderLabel,
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
          username = nis;
          const defPw = nis !== '-' ? `siswa${nis.slice(-4)}` : 'siswa123';
          password = defPw;
          className = classInfo ? classInfo.name : '-';
          studentRows.push([
            u.name,
            genderCode,
            nis,
            className,
            u.email,
            u.phone || studentInfo?.phone || '-',
            defPw,
            passwordStatus
          ]);
        } else if (teacherInfo?.teacher_type === 'guru_bk') {
          roleLabel = 'Guru BK';
          const plainNip = decryptNip(teacherInfo.nip);
          idNumber = plainNip;
          username = u.email;
          password = 'guru123';
          const bkAssignedClasses = classes.filter(
            c => teacherInfo.assigned_class_ids?.includes(c.id) || c.bk_teacher_id === teacherInfo.id || c.bk_teacher_id === teacherInfo.user_id
          );
          className = bkAssignedClasses.length > 0 ? bkAssignedClasses.map(c => c.name).join(', ') : '-';
          bkRows.push([
            u.name,
            genderCode,
            u.email,
            plainNip,
            u.phone || teacherInfo.phone || '-',
            className,
            teacherInfo.specialization || 'Konseling Pribadi & Sosial',
            teacherInfo.room || 'Ruang BK',
            'guru123'
          ]);
        } else if (teacherInfo?.teacher_type === 'wali_kelas') {
          roleLabel = 'Wali Kelas';
          const plainNip = decryptNip(teacherInfo.nip);
          idNumber = plainNip;
          username = u.email;
          password = 'guru123';
          className = managedClass ? managedClass.name : '-';
          waliRows.push([
            u.name,
            genderCode,
            u.email,
            plainNip,
            u.phone || teacherInfo.phone || '-',
            className,
            teacherInfo.room || 'Ruang Guru',
            'guru123'
          ]);
        }

        allRows.push([
          numAll++,
          roleLabel,
          u.name,
          genderLabel,
          username,
          password,
          u.email,
          idNumber,
          className,
          u.phone || '-',
          passwordStatus
        ]);
      });

      const wsStudent = XLSX.utils.aoa_to_sheet(studentRows);
      const wsBk = XLSX.utils.aoa_to_sheet(bkRows);
      const wsWali = XLSX.utils.aoa_to_sheet(waliRows);
      const wsAll = XLSX.utils.aoa_to_sheet(allRows);
      const wsAdmin = XLSX.utils.aoa_to_sheet(adminRows);

      wsStudent['!cols'] = [
        { wch: 30 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 32 }, { wch: 18 }, { wch: 20 }, { wch: 18 }
      ];
      wsBk['!cols'] = [
        { wch: 32 }, { wch: 20 }, { wch: 32 }, { wch: 24 }, { wch: 18 }, { wch: 26 }, { wch: 35 }, { wch: 22 }, { wch: 18 }
      ];
      wsWali['!cols'] = [
        { wch: 32 }, { wch: 20 }, { wch: 32 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 18 }
      ];
      wsAll['!cols'] = [
        { wch: 5 }, { wch: 16 }, { wch: 30 }, { wch: 18 }, { wch: 26 }, { wch: 18 }, { wch: 32 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 18 }
      ];
      wsAdmin['!cols'] = [
        { wch: 5 }, { wch: 28 }, { wch: 20 }, { wch: 26 }, { wch: 18 }, { wch: 26 }, { wch: 18 }, { wch: 20 }
      ];

      XLSX.utils.book_append_sheet(wb, wsClass, 'Data Kelas');
      XLSX.utils.book_append_sheet(wb, wsStudent, 'Siswa');
      XLSX.utils.book_append_sheet(wb, wsBk, 'Guru BK');
      XLSX.utils.book_append_sheet(wb, wsWali, 'Wali Kelas');
      XLSX.utils.book_append_sheet(wb, wsAll, 'Semua Kredensial Pengguna');
      XLSX.utils.book_append_sheet(wb, wsAdmin, 'Administrator');

      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      XLSX.writeFile(wb, `Data_Pengguna_dan_Kelas_SAPA_${dateStr}.xlsx`);
      showFeedback(`Berhasil mengekspor ${classes.length} kelas dan ${users.length} akun pengguna ke format Excel yang kompatibel diinput ulang.`);
    } catch (err: any) {
      console.error('Gagal mengekspor data pengguna:', err);
      showFeedback('Gagal mengekspor data ke Excel: ' + (err?.message || 'Terjadi kesalahan'));
    }
  };

  // Helper to find or create class by name
  const resolveClassId = (className: string): string => {
    if (!className) return classes[0]?.id || 'cls-1';
    const trimmed = className.trim().toLowerCase();
    const allCls = db.getClasses();
    const existing = allCls.find(c => c.name.toLowerCase() === trimmed || c.id.toLowerCase() === trimmed);
    if (existing) return existing.id;

    // Auto-create class if not found
    const newCls = db.addClass({
      name: className.trim(),
      grade: className.includes('XI') ? '11' : className.includes('XII') ? '12' : '10',
      major: className.toUpperCase().includes('PPLG') || className.toUpperCase().includes('RPL') ? 'PPLG' : className.toUpperCase().includes('TKJ') ? 'TKJ' : 'Umum',
      homeroom_teacher_id: null
    });
    return newCls.id;
  };

  // 2. Import Excel Handler with key normalization and duplicate handling
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        let siswaAdded = 0;
        let bkAdded = 0;
        let waliAdded = 0;
        let kelasAdded = 0;

        const normRow = (raw: Record<string, any>): Record<string, string> => {
          const clean: Record<string, string> = {};
          for (const key of Object.keys(raw)) {
            const cleanKey = key.trim().toLowerCase().replace(/[\s_-]+/g, '');
            clean[cleanKey] = (raw[key] !== null && raw[key] !== undefined ? String(raw[key]).trim() : '');
          }
          return clean;
        };

        // Group sheets to ensure proper order of execution:
        // 1. Teachers (Wali Kelas & Guru BK)
        // 2. Classes (Data Kelas)
        // 3. Students (Siswa)
        // 4. Fallback (Single combined / exported sheet)
        const sheetMap: {
          teachers: string[];
          classes: string[];
          students: string[];
          fallback: string[];
        } = {
          teachers: [],
          classes: [],
          students: [],
          fallback: []
        };

        workbook.SheetNames.forEach((sheetName) => {
          const lower = sheetName.trim().toLowerCase();
          if (lower.includes('petunjuk') || lower.includes('panduan') || lower.includes('guide')) {
            return;
          }
          if (lower.includes('bk') || lower.includes('konseling') || lower.includes('wali')) {
            sheetMap.teachers.push(sheetName);
          } else if ((lower.includes('kelas') || lower.includes('rombel')) && !lower.includes('wali')) {
            sheetMap.classes.push(sheetName);
          } else if (lower.includes('siswa') || lower.includes('student')) {
            sheetMap.students.push(sheetName);
          } else if (lower.includes('semua') || lower.includes('pengguna') || lower.includes('user') || lower.includes('kredensial')) {
            sheetMap.fallback.push(sheetName);
          } else {
            sheetMap.fallback.push(sheetName);
          }
        });

        // Step 0: Pre-create classes from Data Kelas so class IDs and metadata exist before linking teachers
        sheetMap.classes.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

          rawRows.forEach((raw) => {
            const r = normRow(raw);
            const className = r['namakelas'] || r['kelas'] || r['rombel'] || '';
            if (!className) return;

            const grade = r['tingkat'] || r['tingkat101112'] || r['jenjang'] || (className.includes('XI') ? '11' : className.includes('XII') ? '12' : '10');
            const major = r['jurusan'] || r['kompetensikeahlian'] || 'Umum';

            const allCls = db.getClasses();
            const existingCls = allCls.find(c => c.name.toLowerCase() === className.toLowerCase().trim());
            if (existingCls) {
              db.updateClass(existingCls.id, { grade, major });
            } else {
              db.addClass({
                name: className.trim(),
                grade,
                major,
                homeroom_teacher_id: null
              });
              kelasAdded++;
            }
          });
        });

        // Step 1: Process Teachers (Guru BK & Wali Kelas)
        sheetMap.teachers.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);
          const lowerSheet = sheetName.trim().toLowerCase();

          rawRows.forEach((raw) => {
            const r = normRow(raw);
            const name = r['nama'] || r['name'] || r['namaguru'] || r['namalengkap'] || r['namalengkapgelar'] || '';
            if (!name) return;

            const email = r['email'] || r['surel'] || r['emailresmi'] || '';
            const nip = r['nip'] || r['nopegawai'] || '';
            const phone = r['nohp'] || r['hp'] || r['phone'] || r['telepon'] || r['wa'] || r['noteleponwa'] || '';
            const className = r['kelasbinaan'] || r['kelas'] || r['rombel'] || r['kelasdiampu'] || '';
            const rawSpecialization = r['spesialisasi'] || r['bidang'] || r['keahlian'] || r['spesialisasikonseling'] || '';
            const rawRoom = r['ruangan'] || r['ruang'] || r['lokasi'] || '';
            const roleCol = (r['peran'] || r['role'] || r['jabatan'] || r['jenisguru'] || r['kategori'] || r['kategoriakun'] || '').toLowerCase();

            const rawGender = r['jeniskelamin'] || r['gender'] || r['jk'] || r['sex'] || r['jeniskelaminlp'] || '';
            let gender: Gender = 'L';
            if (rawGender) {
              const g = rawGender.trim().toUpperCase();
              gender = (g.startsWith('P') || g === 'WANITA' || g === 'PEREMPUAN') ? 'P' : 'L';
            } else {
              gender = detectGenderFromName(name);
            }

            // Determine accurately whether this row is Guru BK or Wali Kelas
            let isBk = false;
            if (lowerSheet.includes('wali')) {
              isBk = false;
            } else if (lowerSheet.includes('bk') || lowerSheet.includes('konseling')) {
              isBk = true;
            } else if (roleCol.includes('wali')) {
              isBk = false;
            } else if (roleCol.includes('bk') || roleCol.includes('konseling')) {
              isBk = true;
            } else if (
              rawSpecialization.toLowerCase().includes('konseling') ||
              rawSpecialization.toLowerCase().includes('bk') ||
              rawSpecialization.toLowerCase().includes('bimbingan')
            ) {
              isBk = true;
            } else {
              isBk = false;
            }

            const finalNip = nip || (isBk ? `1980${Math.floor(10000000 + Math.random() * 90000000)}` : `1985${Math.floor(10000000 + Math.random() * 90000000)}`);
            const finalEmail = email || (isBk ? `gurubk_${Math.floor(100 + Math.random() * 900)}@guru.belajar.id` : `walikelas_${Math.floor(100 + Math.random() * 900)}@guru.belajar.id`);

            const existingTeacher = db.getTeachers().find(t => {
              const plainNip = decryptNip(t.nip).toLowerCase();
              const tUser = db.getUserById(t.user_id);
              const matchNip = finalNip && (t.nip === finalNip || plainNip === finalNip.toLowerCase());
              const matchEmail = email && tUser && tUser.email.toLowerCase() === email.toLowerCase();
              return Boolean(matchNip || matchEmail);
            });

            if (isBk) {
              const specialization = rawSpecialization || 'Konseling Pribadi, Sosial & Bullying';
              const room = rawRoom || 'Ruang BK';
              // Parse Kelas Binaan for Guru BK (supports comma/semicolon separated list of classes)
              const bkClassNames = className
                .split(/[,;]+/)
                .map(s => s.trim())
                .filter(s => s.length > 0 && s !== '-' && !s.toLowerCase().includes('semua kelas'));
              const bkClassIds = bkClassNames.map(cn => resolveClassId(cn)).filter(Boolean);

              if (existingTeacher) {
                const mergedClassIds = Array.from(new Set([...(existingTeacher.assigned_class_ids || []), ...bkClassIds]));
                db.updateTeacher(existingTeacher.id, {
                  teacher_type: 'guru_bk',
                  gender,
                  specialization: rawSpecialization || existingTeacher.specialization || specialization,
                  room: rawRoom || existingTeacher.room || room,
                  assigned_class_ids: mergedClassIds
                });
                if (bkClassIds.length > 0) {
                  db.assignBkClasses(existingTeacher.id, mergedClassIds);
                }
                db.updateUser(existingTeacher.user_id, {
                  name,
                  gender,
                  phone: phone || undefined
                });
              } else {
                const createdBk = db.addTeacher({
                  name,
                  email: finalEmail,
                  nip: finalNip,
                  gender,
                  phone,
                  teacher_type: 'guru_bk',
                  specialization,
                  room,
                  bio: 'Guru Bimbingan dan Konseling sekolah siap mendampingi siswa.',
                  available_hours: 'Senin - Jumat 07.30 - 15.00 WIB',
                  assigned_class_ids: bkClassIds
                });
                if (bkClassIds.length > 0 && createdBk?.teacher) {
                  db.assignBkClasses(createdBk.teacher.id, bkClassIds);
                }
                bkAdded++;
              }
            } else {
              // Wali Kelas (Guru Wali)
              const firstClassName = className.split(/[,;]+/)[0]?.trim() || '';
              const classId = firstClassName && firstClassName !== '-' ? resolveClassId(firstClassName) : '';
              const specialization = rawSpecialization || `Wali Kelas ${firstClassName || ''}`.trim();
              const room = rawRoom || 'Ruang Guru Utama';

              if (existingTeacher) {
                db.updateTeacher(existingTeacher.id, {
                  teacher_type: 'wali_kelas',
                  gender,
                  specialization,
                  room,
                  managed_class_id: classId || existingTeacher.managed_class_id
                });
                db.updateUser(existingTeacher.user_id, {
                  name,
                  gender,
                  phone: phone || undefined
                });
                if (classId) {
                  db.updateClass(classId, { homeroom_teacher_id: existingTeacher.id });
                }
              } else {
                const newT = db.addTeacher({
                  name,
                  email: finalEmail,
                  nip: finalNip,
                  gender,
                  phone,
                  teacher_type: 'wali_kelas',
                  specialization,
                  room,
                  managed_class_id: classId,
                  bio: 'Wali kelas pendamping perkembangan akademik dan perilaku siswa.',
                  available_hours: 'Senin - Jumat 07.30 - 15.00 WIB'
                });
                if (classId && newT?.teacher) {
                  db.updateClass(classId, { homeroom_teacher_id: newT.teacher.id });
                }
                waliAdded++;
              }
            }
          });
        });

        // Step 2: Link Teachers in Data Kelas (Wali Kelas & Guru BK columns)
        sheetMap.classes.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

          rawRows.forEach((raw) => {
            const r = normRow(raw);
            const className = r['namakelas'] || r['kelas'] || r['rombel'] || '';
            if (!className) return;

            const waliVal = r['walikelas'] || r['walikelasnamanip'] || r['nipwalikelas'] || '';
            const bkVal = r['gurubk'] || r['gurubknamanip'] || r['nipgurubk'] || '';

            const matchedWali = findTeacherMatch(waliVal, 'wali_kelas');
            const matchedBk = findTeacherMatch(bkVal, 'guru_bk');

            const allCls = db.getClasses();
            const existingCls = allCls.find(c => c.name.toLowerCase() === className.toLowerCase().trim());

            if (existingCls) {
              db.updateClass(existingCls.id, {
                homeroom_teacher_id: matchedWali ? matchedWali.id : existingCls.homeroom_teacher_id,
                bk_teacher_id: matchedBk ? matchedBk.id : existingCls.bk_teacher_id
              });
              if (matchedWali) {
                db.updateTeacher(matchedWali.id, { managed_class_id: existingCls.id });
              }
            }
          });
        });

        // Step 3: Process Students (Siswa)
        sheetMap.students.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

          rawRows.forEach((raw) => {
            const r = normRow(raw);
            const name = r['nama'] || r['name'] || r['namasiswa'] || r['namalengkapsiswa'] || '';
            if (!name) return;

            const email = r['email'] || r['surel'] || r['emailsiswa'] || '';
            const nis = r['nis'] || r['noinduk'] || r['nisn'] || r['usernameloginnis'] || '';
            const phone = r['nohp'] || r['hp'] || r['phone'] || r['telepon'] || r['wa'] || r['noteleponwa'] || '';
            const className = r['kelas'] || r['rombel'] || r['class'] || '';

            const rawGender = r['jeniskelamin'] || r['gender'] || r['jk'] || r['sex'] || r['jeniskelaminlp'] || '';
            let gender: Gender = 'L';
            if (rawGender) {
              const g = rawGender.trim().toUpperCase();
              gender = (g.startsWith('P') || g === 'WANITA' || g === 'PEREMPUAN') ? 'P' : 'L';
            } else {
              gender = detectGenderFromName(name);
            }

            const finalNis = nis || `2425${Math.floor(1000 + Math.random() * 9000)}`;
            const finalEmail = email || `${finalNis}@siswa.belajar.id`;
            const classId = resolveClassId(className);

            const allStudents = db.getStudents();
            const allUsers = db.getUsers();
            const existingUser = allUsers.find(u => u.email.toLowerCase() === finalEmail.toLowerCase());
            const existingStudent = allStudents.find(s => s.nis === finalNis);

            if (existingStudent || existingUser) {
              const studentToUpdate = existingStudent || allStudents.find(s => s.user_id === existingUser?.id);
              if (studentToUpdate) {
                db.updateStudent(studentToUpdate.id, { class_id: classId, gender });
                if (phone) {
                  db.updateUser(studentToUpdate.user_id, { phone });
                }
              }
            } else {
              db.addStudent({
                name,
                email: finalEmail,
                nis: finalNis,
                class_id: classId,
                gender,
                phone
              });
              siswaAdded++;
            }
          });
        });

        // Step 4: Fallback for single combined sheet or general export sheet
        if (siswaAdded === 0 && bkAdded === 0 && waliAdded === 0 && sheetMap.fallback.length > 0) {
          sheetMap.fallback.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

            rawRows.forEach((raw) => {
              const r = normRow(raw);
              const name = r['nama'] || r['namalengkap'] || r['name'] || '';
              if (!name) return;

              const role = (r['kategoriakun'] || r['role'] || r['kategori'] || '').toLowerCase();
              const email = r['email'] || r['surel'] || '';
              const nisNip = r['nisnip'] || r['nis'] || r['nip'] || '';
              const className = r['kelas'] || r['kelasrombel'] || r['rombel'] || '';
              const phone = r['noteleponwa'] || r['nohp'] || r['telepon'] || '';

              const rawGender = r['jeniskelamin'] || r['gender'] || '';
              const gender: Gender = (rawGender.toUpperCase().startsWith('P') || rawGender.toUpperCase().includes('PEREMPUAN')) ? 'P' : 'L';

              if (role.includes('siswa') || (!role.includes('guru') && !role.includes('admin') && nisNip.length <= 10)) {
                const finalNis = nisNip || `2425${Math.floor(1000 + Math.random() * 9000)}`;
                const finalEmail = email || `${finalNis}@siswa.belajar.id`;
                const classId = resolveClassId(className);

                const existingStudent = db.getStudents().find(s => s.nis === finalNis);
                if (!existingStudent) {
                  db.addStudent({
                    name,
                    email: finalEmail,
                    nis: finalNis,
                    class_id: classId,
                    gender,
                    phone
                  });
                  siswaAdded++;
                }
              } else if (role.includes('bk')) {
                const finalNip = nisNip || `1980${Math.floor(10000000 + Math.random() * 90000000)}`;
                const bkClassNames = className
                  .split(/[,;]+/)
                  .map(s => s.trim())
                  .filter(s => s.length > 0 && s !== '-' && !s.toLowerCase().includes('semua kelas'));
                const bkClassIds = bkClassNames.map(cn => resolveClassId(cn)).filter(Boolean);
                const existingTeacher = db.getTeachers().find(
                  t => t.nip === finalNip || decryptNip(t.nip).toLowerCase() === finalNip.toLowerCase()
                );
                if (!existingTeacher) {
                  const createdBk = db.addTeacher({
                    name,
                    email: email || `gurubk_${Math.floor(100 + Math.random() * 900)}@guru.belajar.id`,
                    nip: finalNip,
                    gender,
                    phone,
                    teacher_type: 'guru_bk',
                    specialization: 'Konseling Bimbingan',
                    room: 'Ruang BK',
                    bio: 'Guru BK Sekolah',
                    available_hours: 'Senin - Jumat',
                    assigned_class_ids: bkClassIds
                  });
                  if (bkClassIds.length > 0 && createdBk?.teacher) {
                    db.assignBkClasses(createdBk.teacher.id, bkClassIds);
                  }
                  bkAdded++;
                }
              } else if (role.includes('wali')) {
                const finalNip = nisNip || `1985${Math.floor(10000000 + Math.random() * 90000000)}`;
                const firstClassName = className.split(/[,;]+/)[0]?.trim() || '';
                const classId = firstClassName && firstClassName !== '-' ? resolveClassId(firstClassName) : '';
                const existingTeacher = db.getTeachers().find(
                  t => t.nip === finalNip || decryptNip(t.nip).toLowerCase() === finalNip.toLowerCase()
                );
                if (!existingTeacher) {
                  const newT = db.addTeacher({
                    name,
                    email: email || `walikelas_${Math.floor(100 + Math.random() * 900)}@guru.belajar.id`,
                    nip: finalNip,
                    gender,
                    phone,
                    teacher_type: 'wali_kelas',
                    specialization: `Wali Kelas ${firstClassName}`,
                    room: 'Ruang Guru',
                    managed_class_id: classId,
                    bio: 'Wali Kelas Pendamping',
                    available_hours: 'Senin - Jumat'
                  });
                  if (classId && newT?.teacher) {
                    db.updateClass(classId, { homeroom_teacher_id: newT.teacher.id });
                  }
                  waliAdded++;
                }
              }
            });
          });
        }

        onRefresh();
        setImportSummary({
          show: true,
          siswaCount: siswaAdded,
          bkCount: bkAdded,
          waliCount: waliAdded,
          kelasCount: kelasAdded,
          message: `Berhasil memproses berkas Excel. Data yang berhasil disinkronkan: ${kelasAdded} Kelas, ${siswaAdded} Siswa, ${bkAdded} Guru BK, dan ${waliAdded} Wali Kelas.`
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err: any) {
        alert(`Gagal memproses file Excel: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 3. Create Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.email || !newStudentData.nis || !newStudentData.class_id) {
      showFeedback('Harap lengkapi semua isian data siswa.', 'error');
      return;
    }
    db.addStudent(newStudentData);
    setShowAddStudent(false);
    setNewStudentData({ name: '', email: '', nis: '', class_id: '', gender: 'L' });
    onRefresh();
    showFeedback(`Siswa ${newStudentData.name} berhasil didaftarkan.`);
  };

  // 4. Create Teacher (Guru BK / Wali Kelas)
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherData.name || !newTeacherData.email || !newTeacherData.nip) {
      showFeedback('Nama, Email, dan NIP wajib diisi.', 'error');
      return;
    }

    db.addTeacher(newTeacherData);
    setShowAddTeacher(false);
    setNewTeacherData({
      name: '',
      email: '',
      nip: '',
      teacher_type: 'guru_bk',
      gender: 'L',
      phone: '',
      specialization: '',
      room: '',
      bio: '',
      available_hours: '',
      managed_class_id: '',
      assigned_class_ids: []
    });
    onRefresh();
    showFeedback(`Akun ${newTeacherData.teacher_type === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'} berhasil dibuat.`);
  };

  // 5. Open Edit User Modal
  const handleOpenEditUser = (u: User) => {
    const student = students.find(s => s.user_id === u.id);
    const teacher = teachers.find(t => t.user_id === u.id);
    const managedCls = teacher?.teacher_type === 'wali_kelas'
      ? classes.find(c => c.homeroom_teacher_id === teacher.id)
      : undefined;
    const studentCls = student ? classes.find(c => c.id === student.class_id) : undefined;

    setEditingUser(u);
    setShowEditPassword(false);
    const teacherNip = teacher ? decryptNip(teacher.nip) : '';
    const userGender: Gender = u.gender || (student?.gender as Gender) || (teacher?.gender as Gender) || detectGenderFromName(u.name);
    setEditFormData({
      name: u.name,
      email: u.email,
      gender: userGender,
      phone: u.phone || '',
      password: '', // Kept empty for security: admin cannot see encrypted password directly
      nis: student?.nis || '',
      class_id: student?.class_id || '',
      homeroom_teacher_id: studentCls?.homeroom_teacher_id || '',
      nip: teacherNip,
      specialization: teacher?.specialization || '',
      room: teacher?.room || '',
      bio: teacher?.bio || '',
      available_hours: teacher?.available_hours || '',
      managed_class_id: managedCls?.id || '',
      assigned_class_ids: teacher?.assigned_class_ids ? [...teacher.assigned_class_ids] : []
    });
  };

  // 6. Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Update base user
    const userUpdates: Partial<User> = {
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      phone: editFormData.phone.trim(),
      gender: editFormData.gender
    };
    if (editFormData.password.trim()) {
      userUpdates.password = editFormData.password.trim();
    }
    db.updateUser(editingUser.id, userUpdates);

    // Update student if student
    if (editingUser.role === 'siswa') {
      const student = students.find(s => s.user_id === editingUser.id);
      if (student) {
        db.updateStudentComplete({
          userId: editingUser.id,
          studentId: student.id,
          name: editFormData.name,
          email: editFormData.email,
          nis: editFormData.nis.trim(),
          class_id: editFormData.class_id,
          gender: editFormData.gender,
          homeroom_teacher_id: editFormData.homeroom_teacher_id || undefined,
          password: editFormData.password.trim() || undefined
        });
      }
    }

    // Update teacher if teacher
    if (editingUser.role === 'guru') {
      const teacher = teachers.find(t => t.user_id === editingUser.id);
      if (teacher) {
        db.updateTeacher(teacher.id, {
          nip: editFormData.nip.trim(),
          gender: editFormData.gender,
          specialization: editFormData.specialization.trim(),
          room: editFormData.room.trim(),
          bio: editFormData.bio.trim(),
          available_hours: editFormData.available_hours.trim(),
          assigned_class_ids: teacher.teacher_type === 'guru_bk' ? editFormData.assigned_class_ids : undefined
        });

        if (teacher.teacher_type === 'guru_bk') {
          db.assignBkClasses(teacher.id, editFormData.assigned_class_ids);
        }

        // Update managed class if wali_kelas
        if (teacher.teacher_type === 'wali_kelas') {
          classes.forEach(c => {
            if (c.homeroom_teacher_id === teacher.id && c.id !== editFormData.managed_class_id) {
              c.homeroom_teacher_id = '';
            }
          });
          if (editFormData.managed_class_id) {
            const cls = classes.find(c => c.id === editFormData.managed_class_id);
            if (cls) cls.homeroom_teacher_id = teacher.id;
          }
        }
      }
    }

    setEditingUser(null);
    onRefresh();
    showFeedback(`Data pengguna ${editFormData.name} berhasil diperbarui.`);
  };

  // 7. Delete User
  const handleDeleteUser = async (u: User) => {
    if (currentUser?.id === u.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akun "${u.name}" (${u.role})? Seluruh data profil pengguna ini akan dihapus permanen dari database.`)) {
      try {
        const res = await db.deleteUser(u.id);
        onRefresh();
        if (res.error) {
          showFeedback(`Pengguna "${u.name}" dihapus, namun sinkronisasi database melaporkan: ${res.error}`, 'warning');
        } else {
          showFeedback(`Pengguna "${u.name}" berhasil dihapus permanen dari sistem.`);
        }
      } catch (err: any) {
        showFeedback(`Gagal menghapus pengguna: ${err.message}`, 'error');
      }
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const teacher = teachers.find(t => t.user_id === u.id);
    if (roleFilter === 'siswa') return u.role === 'siswa';
    if (roleFilter === 'admin') return u.role === 'admin';
    if (roleFilter === 'guru_bk') return u.role === 'guru' && teacher?.teacher_type === 'guru_bk';
    if (roleFilter === 'wali_kelas') return u.role === 'guru' && teacher?.teacher_type === 'wali_kelas';

    return true;
  }).filter((u) => {
    if (classFilter !== 'all') {
      const student = students.find(s => s.user_id === u.id);
      const teacher = teachers.find(t => t.user_id === u.id);
      const targetClass = classes.find(c => c.id === classFilter);

      if (u.role === 'siswa') {
        if (!student) return false;
        return student.class_id === classFilter || (targetClass && student.class_name?.toLowerCase() === targetClass.name.toLowerCase());
      }
      if (u.role === 'guru') {
        if (!teacher) return false;
        const isHomeroom = teacher.managed_class_id === classFilter ||
          (targetClass && (targetClass.homeroom_teacher_id === teacher.id || targetClass.homeroom_teacher_id === teacher.user_id));
        const isCounselor = (teacher.assigned_class_ids && teacher.assigned_class_ids.includes(classFilter)) ||
          (targetClass && (targetClass.bk_teacher_id === teacher.id || targetClass.bk_teacher_id === teacher.user_id));
        return Boolean(isHomeroom || isCounselor);
      }
      return false; // admin doesn't belong to a class
    }
    return true;
  }).filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const student = students.find(s => s.user_id === u.id);
    const teacher = teachers.find(t => t.user_id === u.id);
    const plainNip = teacher ? decryptNip(teacher.nip).toLowerCase() : '';
    const studentClass = student ? classes.find(c => c.id === student.class_id)?.name.toLowerCase() : '';
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (student && student.nis.toLowerCase().includes(q)) ||
      (teacher && teacher.nip.toLowerCase().includes(q)) ||
      plainNip.includes(q) ||
      (studentClass && studentClass.includes(q)) ||
      (teacher && teacher.specialization?.toLowerCase().includes(q))
    );
  });

  // Sorted list
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'id');
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name, 'id');
      if (sortBy === 'created_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'created_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return 0;
    });
  }, [filteredUsers, sortBy]);

  // Paginated list
  const paginatedUsers = useMemo(() => {
    if (pageSize === 'all') return sortedUsers;
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Bulk Selection Operations
  const eligiblePageUsers = useMemo(() => {
    return paginatedUsers.filter(u => u.id !== currentUser?.id);
  }, [paginatedUsers, currentUser?.id]);

  const eligibleFilteredUsers = useMemo(() => {
    return filteredUsers.filter(u => u.id !== currentUser?.id);
  }, [filteredUsers, currentUser?.id]);

  const isAllPageSelected =
    eligiblePageUsers.length > 0 && eligiblePageUsers.every(u => selectedUserIds.includes(u.id));
  const isSomePageSelected =
    eligiblePageUsers.some(u => selectedUserIds.includes(u.id)) && !isAllPageSelected;

  const handleToggleSelectUser = (userId: string) => {
    if (userId === currentUser?.id) return;
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(eligiblePageUsers.map(u => u.id));
      setSelectedUserIds(prev => prev.filter(id => !pageIds.has(id)));
    } else {
      const newIds = new Set([...selectedUserIds, ...eligiblePageUsers.map(u => u.id)]);
      setSelectedUserIds(Array.from(newIds));
    }
  };

  const handleSelectAllFiltered = () => {
    setSelectedUserIds(eligibleFilteredUsers.map(u => u.id));
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    setIsDeletingBulk(true);
    try {
      const count = selectedUserIds.length;
      const res = await db.bulkDeleteUsers(selectedUserIds);
      setSelectedUserIds([]);
      setShowBulkDeleteModal(false);
      onRefresh();
      if (res.error) {
        showFeedback(`Data ${count} pengguna dihapus lokal, namun backend mengembalikan: ${res.error}`, 'warning');
      } else {
        showFeedback(`Berhasil menghapus ${count} akun pengguna sekaligus secara permanen dari database.`);
      }
    } catch (err: any) {
      showFeedback(`Gagal menghapus pengguna: ${err.message}`, 'error');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Manajemen Pengguna Sistem ({users.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar siswa, guru BK, wali kelas, dan admin dengan dukungan Import Excel otomatis, filter data, dan kontrol paginasi.
          </p>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Excel Template */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            title="Unduh format file Excel (.xlsx) untuk pengisian data massal"
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition border border-slate-300"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Format Excel</span>
          </button>

          {/* Import Excel */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import data siswa, guru BK, dan wali kelas dari file Excel (.xlsx)"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import Excel</span>
          </button>

          {/* Export Excel Data Pengguna Lengkap */}
          <button
            type="button"
            onClick={handleExportUsersExcel}
            title="Ekspor seluruh data akun pengguna (108 Siswa, 10 Guru BK, 3 Wali Kelas, 2 Admin) lengkap dengan username dan kata sandi ke Excel (.xlsx)"
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          {/* Add Guru BK */}
          <button
            type="button"
            onClick={() => {
              setNewTeacherData({
                name: '',
                email: '',
                nip: '',
                teacher_type: 'guru_bk',
                gender: 'L',
                phone: '',
                specialization: 'Konseling Pribadi, Sosial & Penanganan Bullying',
                room: 'Ruang BK',
                bio: 'Mendampingi siswa dengan pendekatan suportif & kerahasiaan penuh.',
                available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
                managed_class_id: '',
                assigned_class_ids: []
              });
              setShowAddTeacher(true);
            }}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>+ Guru BK</span>
          </button>

          {/* Add Wali Kelas */}
          <button
            type="button"
            onClick={() => {
              setNewTeacherData({
                name: '',
                email: '',
                nip: '',
                teacher_type: 'wali_kelas',
                gender: 'L',
                phone: '',
                specialization: 'Wali Kelas & Akademik',
                room: 'Ruang Guru Utama',
                bio: 'Mendampingi kelas binaan dan koordinasi pembelajaran.',
                available_hours: 'Senin - Jumat (07.30 - 15.00 WIB)',
                managed_class_id: classes[0]?.id || '',
                assigned_class_ids: []
              });
              setShowAddTeacher(true);
            }}
            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>+ Wali Kelas</span>
          </button>

          {/* Add Siswa */}
          <button
            type="button"
            onClick={() => {
              setNewStudentData({ name: '', email: '', nis: '', class_id: classes[0]?.id || '', gender: 'L' });
              setShowAddStudent(true);
            }}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>+ Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* SYSTEM RESET PASSWORD EMAIL CONFIGURATION CARD (FEATURE: GANTI EMAIL RESET SANDI SISTEM) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/60 to-purple-50/70 border border-blue-200/80 shadow-xs">
        <form onSubmit={handleSaveSystemEmail} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <span>Pengaturan Email Sistem Permohonan Reset Kata Sandi</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                  Admin Master
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-xl leading-relaxed">
                Alamat email resmi sekolah ini ditampilkan kepada siswa & guru di halaman Login (Lupa Sandi) serta Profil Akun untuk memproses permohonan reset sandi.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <input
                type="email"
                value={systemEmail}
                onChange={(e) => setSystemEmail(e.target.value)}
                placeholder="contoh: admin@smk.sch.id"
                required
                className="w-full sm:w-64 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={isSavingEmail}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSavingEmail ? 'Menyimpan...' : 'Simpan Email'}</span>
            </button>
            <a
              href={`mailto:${systemEmail}?subject=Tes%20Email%20Reset%20Sandi`}
              target="_blank"
              rel="noreferrer"
              title="Coba buka tautan email untuk verifikasi alamat"
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Uji Tautan</span>
            </a>
          </div>
        </form>

        {emailSaveSuccess && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Email reset kata sandi sistem berhasil diperbarui. Halaman Login dan Profil kini telah tersinkronisasi!</span>
          </div>
        )}

        {emailError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{emailError}</span>
          </div>
        )}
      </div>

      {notification && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : notification.type === 'warning'
            ? 'bg-amber-50 border border-amber-200 text-amber-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className={`w-4 h-4 shrink-0 ${notification.type === 'warning' ? 'text-amber-600' : 'text-rose-600'}`} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar with Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setRoleFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              roleFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({users.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleFilter('guru_bk');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              roleFilter === 'guru_bk'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Guru BK ({teachers.filter(t => t.teacher_type === 'guru_bk').length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleFilter('wali_kelas');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              roleFilter === 'wali_kelas'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Wali Kelas ({teachers.filter(t => t.teacher_type === 'wali_kelas').length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleFilter('siswa');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              roleFilter === 'siswa'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Siswa ({students.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleFilter('admin');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              roleFilter === 'admin'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin ({users.filter(u => u.role === 'admin').length})
          </button>
        </div>

        {/* Search Input, Class Filter & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Kelas:</span>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">Semua Kelas ({classes.length})</option>
              {classes.map((cls) => {
                const count = students.filter(s => s.class_id === cls.id).length;
                return (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({count} siswa)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Urut:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="name_asc">Nama (A - Z)</option>
              <option value="name_desc">Nama (Z - A)</option>
              <option value="created_desc">Terdaftar (Terbaru)</option>
              <option value="created_asc">Terdaftar (Terlama)</option>
              <option value="role">Berdasarkan Peran</option>
            </select>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, NIP, NIS, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Active Class Filter Info Banner */}
      {classFilter !== 'all' && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 px-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Menampilkan pengguna terkait kelas <strong>{classes.find(c => c.id === classFilter)?.name}</strong>
              {(() => {
                const targetCls = classes.find(c => c.id === classFilter);
                const wali = teachers.find(t => t.id === targetCls?.homeroom_teacher_id || t.user_id === targetCls?.homeroom_teacher_id);
                const bk = teachers.find(t => t.id === targetCls?.bk_teacher_id || t.user_id === targetCls?.bk_teacher_id || t.assigned_class_ids?.includes(targetCls?.id || ''));
                const studentCount = students.filter(s => s.class_id === classFilter).length;
                return (
                  <span>
                    {' '}({studentCount} Siswa
                    {wali ? ` • Wali: ${wali.name}` : ''}
                    {bk ? ` • BK: ${bk.name}` : ''})
                  </span>
                );
              })()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setClassFilter('all');
              setCurrentPage(1);
            }}
            className="text-blue-700 hover:text-blue-900 font-bold text-xs underline cursor-pointer"
          >
            Reset Filter Kelas
          </button>
        </div>
      )}

      {/* Bulk Selection Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
              {selectedUserIds.length}
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">
                {selectedUserIds.length} Pengguna Telah Ditandai
              </h4>
              <p className="text-[11px] text-purple-200">
                Anda dapat menghapus seluruh akun pengguna yang ditandai ini secara massal.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSelectAllPage}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
            >
              {isAllPageSelected ? 'Batal Pilih Halaman' : `Pilih Halaman (${eligiblePageUsers.length})`}
            </button>

            {eligibleFilteredUsers.length > eligiblePageUsers.length && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
              >
                Pilih Semua Filtered ({eligibleFilteredUsers.length})
              </button>
            )}

            <button
              type="button"
              onClick={handleClearSelection}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => setShowBulkDeleteModal(true)}
              className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus {selectedUserIds.length} Pengguna Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Users Table wrapped in Responsive Container with sticky header */}
      <ResponsiveTableContainer
        tableId="admin-users-table"
        minWidth="840px"
        maxHeight="600px"
        hasData={paginatedUsers.length > 0}
      >
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  title="Pilih semua di halaman ini"
                  checked={isAllPageSelected}
                  ref={el => {
                    if (el) el.indeterminate = isSomePageSelected;
                  }}
                  onChange={handleToggleSelectAllPage}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                />
              </th>
              <th className="p-3.5">Nama & Identitas</th>
              <th className="p-3.5">Peran (Role)</th>
              <th className="p-3.5">Kontak / Email</th>
              <th className="p-3.5">Detail Penugasan / Kelas</th>
              <th className="p-3.5">Terdaftar</th>
              <th className="p-3.5 text-center">Aksi (CRUD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Tidak ada data pengguna yang sesuai dengan filter atau pencarian saat ini.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => {
                const student = students.find(s => s.user_id === u.id);
                const teacher = teachers.find(t => t.user_id === u.id);
                const cls = student ? classes.find(c => c.id === student.class_id) : undefined;
                const managedCls = teacher?.teacher_type === 'wali_kelas'
                  ? classes.find(c => c.homeroom_teacher_id === teacher.id)
                  : undefined;
                const isSelected = selectedUserIds.includes(u.id);

                return (
                  <tr
                    key={u.id}
                    className={`transition ${
                      isSelected
                        ? 'bg-purple-50/70 border-l-4 border-l-purple-600'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        disabled={u.id === currentUser?.id}
                        checked={isSelected}
                        onChange={() => handleToggleSelectUser(u.id)}
                        title={u.id === currentUser?.id ? 'Akun Anda yang sedang aktif' : `Tandai ${u.name}`}
                        className={`w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 ${
                          u.id === currentUser?.id ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || getDefaultAvatarByGender(u.role, u.gender || student?.gender || teacher?.gender)}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm ${
                                (u.gender === 'P' || student?.gender === 'P' || teacher?.gender === 'P')
                                  ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                  : 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}
                              title={
                                (u.gender === 'P' || student?.gender === 'P' || teacher?.gender === 'P')
                                  ? 'Jenis Kelamin: Perempuan (P)'
                                  : 'Jenis Kelamin: Laki-laki (L)'
                              }
                            >
                              {(u.gender === 'P' || student?.gender === 'P' || teacher?.gender === 'P') ? 'P' : 'L'}
                            </span>
                          </div>
                          {student && <span className="text-[11px] text-slate-500 font-mono">NIS: {student.nis}</span>}
                          {teacher && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              NIP: {maskNip(decryptNip(teacher.nip))}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                        teacher?.teacher_type === 'guru_bk'
                          ? 'bg-purple-100 text-purple-800'
                          : teacher?.teacher_type === 'wali_kelas'
                          ? 'bg-teal-100 text-teal-800'
                          : u.role === 'siswa'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {teacher?.teacher_type === 'guru_bk' && <Shield className="w-2.5 h-2.5" />}
                        {teacher?.teacher_type === 'wali_kelas' && <UserCheck className="w-2.5 h-2.5" />}
                        {u.role === 'guru' && teacher
                          ? teacher.teacher_type === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'
                          : u.role === 'siswa' ? 'Siswa' : 'Admin'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="font-mono text-slate-600">{u.email}</p>
                      {u.phone && <p className="text-[11px] text-slate-400 mt-0.5">{u.phone}</p>}
                    </td>

                    <td className="p-3.5">
                      {student && (
                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          Kelas {cls?.name || '-'}
                        </span>
                      )}
                      {teacher && managedCls && (
                        <span className="font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          Wali Kelas {managedCls.name}
                        </span>
                      )}
                      {teacher && teacher.teacher_type === 'guru_bk' && (
                        <div className="space-y-1">
                          <p className="text-slate-600 truncate max-w-xs">{teacher.specialization || 'Guru BK Konseling'}</p>
                          {teacher.assigned_class_ids && teacher.assigned_class_ids.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {teacher.assigned_class_ids.map(cid => {
                                const c = classes.find(clsObj => clsObj.id === cid);
                                return (
                                  <span key={cid} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                                    {c?.name || cid}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Belum ada kelas binaan</span>
                          )}
                        </div>
                      )}
                      {u.role === 'admin' && <span className="text-slate-400">Akses Penuh Sistem</span>}
                    </td>

                    <td className="p-3.5 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenResetPassword(u)}
                          title="Reset Kata Sandi Pengguna"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition border border-transparent hover:border-amber-200 cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          title="Edit Data Pengguna"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            title="Hapus Pengguna"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </ResponsiveTableContainer>

      {/* Pagination Controls with 10, 25, 50, 200, all */}
      <TablePagination
        currentPage={currentPage}
        totalItems={sortedUsers.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        itemName="pengguna"
      />

      {/* Modal Add Student */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Tambah Siswa Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStudent(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newStudentData.name}
                  onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Ilham"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Siswa (untuk Login)</label>
                <input
                  type="email"
                  required
                  value={newStudentData.email}
                  onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                  placeholder="ilham@siswa.belajar.id"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIS (Nomor Induk Siswa)</label>
                <input
                  type="text"
                  required
                  value={newStudentData.nis}
                  onChange={(e) => setNewStudentData({ ...newStudentData, nis: e.target.value })}
                  placeholder="24251011"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Kelas</label>
                <select
                  required
                  value={newStudentData.class_id}
                  onChange={(e) => setNewStudentData({ ...newStudentData, class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin (Gender) <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={newStudentData.gender}
                  onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.target.value as Gender })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Avatar profil 2D siswa saat login pertama kali akan otomatis disesuaikan dengan jenis kelamin yang dipilih.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Teacher (Guru BK & Wali Kelas) */}
      {showAddTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  newTeacherData.teacher_type === 'guru_bk'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  {newTeacherData.teacher_type === 'guru_bk' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {newTeacherData.teacher_type === 'guru_bk'
                      ? 'Tambah Guru BK (Bimbingan Konseling)'
                      : 'Tambah Wali Kelas Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Akun akan langsung aktif dan dapat digunakan login.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeacher(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={newTeacherData.name}
                  onChange={(e) => setNewTeacherData({ ...newTeacherData, name: e.target.value })}
                  placeholder="Contoh: Dra. Hj. Ratna Dewi, M.Pd"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Guru (Login)</label>
                  <input
                    type="email"
                    required
                    value={newTeacherData.email}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, email: e.target.value })}
                    placeholder="ratna@guru.belajar.id"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    required
                    value={newTeacherData.nip}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, nip: e.target.value })}
                    placeholder="197508121999032001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin (Gender) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={newTeacherData.gender}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={newTeacherData.phone}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                {newTeacherData.teacher_type === 'wali_kelas' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Binaan</label>
                    <select
                      value={newTeacherData.managed_class_id}
                      onChange={(e) => setNewTeacherData({ ...newTeacherData, managed_class_id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}

                {newTeacherData.teacher_type === 'guru_bk' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Spesialisasi Konseling</label>
                      <input
                        type="text"
                        value={newTeacherData.specialization}
                        onChange={(e) => setNewTeacherData({ ...newTeacherData, specialization: e.target.value })}
                        placeholder="Konseling Pribadi & Sosial"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-purple-950">
                          Kelas Binaan (Opsional)
                        </label>
                        <span className="text-[11px] font-bold text-purple-700">
                          {newTeacherData.assigned_class_ids.length} Kelas Dipilih
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {classes.map(cls => {
                          const isSelected = newTeacherData.assigned_class_ids.includes(cls.id);
                          return (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => {
                                setNewTeacherData(prev => ({
                                  ...prev,
                                  assigned_class_ids: isSelected
                                    ? prev.assigned_class_ids.filter(id => id !== cls.id)
                                    : [...prev.assigned_class_ids, cls.id]
                                }));
                              }}
                              className={`p-2 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 text-white border-purple-600'
                                  : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                              }`}
                            >
                              <span className="truncate">{cls.name}</span>
                              {isSelected && <Check className="w-3 h-3 shrink-0 stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ruang Layanan</label>
                  <input
                    type="text"
                    value={newTeacherData.room}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, room: e.target.value })}
                    placeholder="Ruang BK 1 / Ruang Guru"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Konsultasi</label>
                  <input
                    type="text"
                    value={newTeacherData.available_hours}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, available_hours: e.target.value })}
                    placeholder="Senin - Jumat 07.30 - 15.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-bold text-xs rounded-xl shadow-xs transition ${
                    newTeacherData.teacher_type === 'guru_bk'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {newTeacherData.teacher_type === 'guru_bk' ? 'Simpan Guru BK' : 'Simpan Wali Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>Edit Data {editingUser.name} ({editingUser.role})</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Student specific fields: Kelas, Wali Kelas, NIS, Password */}
              {editingUser.role === 'siswa' && (
                <div className="space-y-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Kelola Data Lengkap Siswa
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      Role Siswa
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-blue-950 mb-1">
                        NIS (Nomor Induk Siswa) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editFormData.nis}
                        onChange={(e) => setEditFormData({ ...editFormData, nis: e.target.value })}
                        placeholder="Contoh: 24250101"
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-950 mb-1">
                        Kelas Rombel <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={editFormData.class_id}
                        onChange={(e) => {
                          const newClassId = e.target.value;
                          const targetCls = classes.find(c => c.id === newClassId);
                          setEditFormData({
                            ...editFormData,
                            class_id: newClassId,
                            homeroom_teacher_id: targetCls?.homeroom_teacher_id || editFormData.homeroom_teacher_id
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                      >
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.major})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Wali Kelas Assignment */}
                  <div>
                    <label className="block text-xs font-semibold text-blue-950 mb-1 flex items-center justify-between">
                      <span>Wali Kelas (Penanggung Jawab Kelas Siswa)</span>
                      <span className="text-[10px] text-blue-700 font-normal">Tersinkron ke rombel kelas</span>
                    </label>
                    <select
                      value={editFormData.homeroom_teacher_id}
                      onChange={(e) => setEditFormData({ ...editFormData, homeroom_teacher_id: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                    >
                      <option value="">-- Pilih Wali Kelas --</option>
                      {teachers
                        .filter(t => t.teacher_type === 'wali_kelas')
                        .map(t => {
                          const userWali = users.find(u => u.id === t.user_id);
                          return (
                            <option key={t.id} value={t.id}>
                              {userWali?.name || 'Wali Kelas'} (NIP: {decryptNip(t.nip)})
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {/* Password Siswa Field - Encrypted Notice & Reset */}
                  <div className="p-3 bg-blue-100/60 border border-blue-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-700" />
                        Status Kata Sandi (Terenkripsi)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        Terenkripsi SHA-256
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-900/80 leading-relaxed">
                      Kata sandi siswa tersimpan dalam format hash kripto dan tidak dapat dilihat langsung oleh admin demi privasi siswa. Admin hanya dapat mereset kata sandi jika siswa lupa.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="relative flex-1">
                        <input
                          type={showEditPassword ? 'text' : 'password'}
                          value={editFormData.password}
                          onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                          placeholder="Kosongkan jika tidak ingin mereset kata sandi..."
                          className="w-full pl-3 pr-8 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEditPassword(!showEditPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        >
                          {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, password: 'siswa123' })}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shrink-0 transition"
                      >
                        Set "siswa123"
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Password for Non-Student Users (Guru BK, Wali Kelas, Admin) */}
              {editingUser.role !== 'siswa' && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      Status Kata Sandi (Terenkripsi Sistem)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" />
                      Terenkripsi SHA-256
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 leading-relaxed">
                    Admin tidak dapat melihat kata sandi Guru BK / Wali Kelas secara langsung. Admin hanya dapat mereset kata sandi jika akun guru lupa kata sandi.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <input
                        type={showEditPassword ? 'text' : 'password'}
                        value={editFormData.password}
                        onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                        placeholder="Kosongkan jika tidak ingin mengganti kata sandi..."
                        className="w-full pl-3 pr-8 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, password: editingUser.role === 'admin' ? 'admin123' : 'guru123' })}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg shrink-0 transition"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>
              )}

              {/* Teacher specific fields */}
              {editingUser.role === 'guru' && (
                <div className="space-y-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-purple-950 mb-1">NIP</label>
                      <input
                        type="text"
                        required
                        value={editFormData.nip}
                        onChange={(e) => setEditFormData({ ...editFormData, nip: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-950 mb-1">Spesialisasi</label>
                      <input
                        type="text"
                        value={editFormData.specialization}
                        onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-purple-950 mb-1">Ruang Kerja / Konseling</label>
                      <input
                        type="text"
                        value={editFormData.room}
                        onChange={(e) => setEditFormData({ ...editFormData, room: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-950 mb-1">Jam Konsultasi</label>
                      <input
                        type="text"
                        value={editFormData.available_hours}
                        onChange={(e) => setEditFormData({ ...editFormData, available_hours: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {(() => {
                    const teacherObj = teachers.find(t => t.user_id === editingUser.id);
                    if (teacherObj?.teacher_type === 'wali_kelas') {
                      return (
                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1">Kelas Binaan (Wali Kelas)</label>
                          <select
                            value={editFormData.managed_class_id}
                            onChange={(e) => setEditFormData({ ...editFormData, managed_class_id: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          >
                            <option value="">-- Bukan Wali Kelas / Tidak Menjabat --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      );
                    }

                    if (teacherObj?.teacher_type === 'guru_bk') {
                      return (
                        <div className="space-y-2 p-3.5 bg-purple-100/60 rounded-2xl border border-purple-200">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                              <School className="w-4 h-4 text-purple-700" />
                              <span>Kelas yang Diampu (Kelas Binaan)</span>
                            </label>
                            <span className="text-[11px] font-extrabold text-purple-800 px-2.5 py-0.5 rounded-full bg-white border border-purple-200">
                              {editFormData.assigned_class_ids.length} Kelas Terpilih
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-900/80 leading-relaxed">
                            Pilih rombel kelas binaan untuk Guru BK ini (misal: 3 kelas, 4 kelas, atau sesuai pembagian penugasan).
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                            {classes.map(cls => {
                              const isSelected = editFormData.assigned_class_ids.includes(cls.id);
                              return (
                                <button
                                  key={cls.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setEditFormData({
                                        ...editFormData,
                                        assigned_class_ids: editFormData.assigned_class_ids.filter(id => id !== cls.id)
                                      });
                                    } else {
                                      setEditFormData({
                                        ...editFormData,
                                        assigned_class_ids: [...editFormData.assigned_class_ids, cls.id]
                                      });
                                    }
                                  }}
                                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                                      : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                                  }`}
                                >
                                  <span className="truncate">{cls.name}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import Summary */}
      {importSummary && importSummary.show && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Import Data Excel Berhasil!</h3>
                <p className="text-xs text-slate-500">Semua akun telah dibuat dan siap login.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
              <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <p className="text-xl font-black text-indigo-700">{importSummary.kelasCount ?? 0}</p>
                <span className="text-[10px] font-bold text-indigo-900 block mt-0.5">Kelas</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <p className="text-xl font-black text-blue-700">{importSummary.siswaCount}</p>
                <span className="text-[10px] font-bold text-blue-900 block mt-0.5">Siswa</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                <p className="text-xl font-black text-purple-700">{importSummary.bkCount}</p>
                <span className="text-[10px] font-bold text-purple-900 block mt-0.5">Guru BK</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-100 text-center">
                <p className="text-xl font-black text-teal-700">{importSummary.waliCount}</p>
                <span className="text-[10px] font-bold text-teal-900 block mt-0.5">Wali Kelas</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              {importSummary.message} Akun guru dan siswa dapat langsung melakukan login menggunakan email yang didaftarkan.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setImportSummary(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Tutup & Periksa Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dedicated Reset Password */}
      {resetPasswordTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 md:p-6 flex min-h-full items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    Reset Kata Sandi Akun
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Atur ulang kata sandi pengguna lupa sandi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetPasswordTarget(null);
                  setResetResult(null);
                }}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
              {/* User Details Box */}
              <div className="p-3 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={resetPasswordTarget.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={resetPasswordTarget.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {resetPasswordTarget.name}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                      resetPasswordTarget.role === 'guru'
                        ? 'bg-purple-100 text-purple-800'
                        : resetPasswordTarget.role === 'siswa'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {resetPasswordTarget.role === 'siswa' ? 'Siswa' : resetPasswordTarget.role === 'guru' ? 'Guru' : 'Admin'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{resetPasswordTarget.email}</p>
                </div>
              </div>

              {/* Security Explanation */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Privasi & Keamanan Kriptografis</span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                  Kata sandi lama tersimpan dalam bentuk hash terenkripsi dan tidak dapat dilihat oleh siapapun. Masukkan kata sandi baru untuk mengatur ulang akses akun pengguna.
                </p>
                {resetPasswordTarget.role === 'siswa' && (
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/70">
                    💡 <strong>Info Batas Reset Siswa:</strong> Setelah admin mereset kata sandi, batas ubah sandi mandiri siswa otomatis direset menjadi <strong>1 kali</strong> lagi. Siswa dapat login dengan sandi ini lalu mereset sandinya sendiri sesuai preferensi.
                  </p>
                )}
              </div>

              {!resetResult ? (
                <form onSubmit={handleExecuteResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="text"
                      required
                      value={newPasswordValue}
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                      placeholder="Masukkan kata sandi baru..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setNewPasswordValue(resetPasswordTarget.role === 'siswa' ? 'siswa123' : resetPasswordTarget.role === 'admin' ? 'admin123' : 'guru123')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg transition active:scale-95 cursor-pointer"
                      >
                        Default: {resetPasswordTarget.role === 'siswa' ? 'siswa123' : resetPasswordTarget.role === 'admin' ? 'admin123' : 'guru123'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPasswordValue(generateTemporaryPassword(resetPasswordTarget.role))}
                        className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] sm:text-xs font-semibold rounded-lg transition active:scale-95 cursor-pointer"
                      >
                        Acak Aman 8 Karakter
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setResetPasswordTarget(null)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition text-center cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Reset & Enkripsi Sandi</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950">Kata Sandi Berhasil Direset</h4>
                    <p className="text-[11px] sm:text-xs text-emerald-800 leading-relaxed">
                      Kata sandi telah diperbarui dan dienkripsi di database.
                      {resetPasswordTarget.role === 'siswa' && ' Siswa kini dapat login menggunakan kata sandi ini dan batas reset sandi mandiri telah menjadi 1 kali lagi.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1.5">
                      Kata Sandi Baru untuk {resetResult.userName}:
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={resetResult.plainPassword}
                        className="w-full sm:flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        {hasCopiedPassword ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{hasCopiedPassword ? 'Tersalin!' : 'Salin Sandi'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5">
                      Berikan kata sandi baru ini kepada {resetResult.userName} untuk login ke sistem.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setResetPasswordTarget(null);
                        setResetResult(null);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Users Confirmation Modal */}
      <BulkDeleteUsersModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleConfirmBulkDelete}
        selectedUsers={users.filter(u => selectedUserIds.includes(u.id))}
        students={students}
        teachers={teachers}
        isDeleting={isDeletingBulk}
      />
    </div>
  );
};
