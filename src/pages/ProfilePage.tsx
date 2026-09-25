import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  GraduationCap,
  Calendar,
  Lock,
  LogOut,
  Award,
  BookOpen,
  CheckCircle2,
  Camera,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Info,
  Key,
  Copy,
  Check,
  Send,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { decryptNip, maskNip } from '../utils/nipCrypto';
import {
  STUDENT_AVATAR_OPTIONS,
  TEACHER_ADMIN_AVATAR_OPTIONS,
  AVATAR_2D_STUDENT_MALE,
  AVATAR_2D_STUDENT_FEMALE,
  AVATAR_2D_TEACHER_MALE,
  AVATAR_2D_TEACHER_FEMALE,
  getDefaultAvatarByGender
} from '../utils/avatar2d';

interface ProfilePageProps {
  onNavigate: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, studentProfile, teacherProfile, logout, quickLoginAs, updateCurrentUserAvatar, refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [showNip, setShowNip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const isStudent = currentUser.role === 'siswa';
  const canUploadPhoto = currentUser.role === 'guru' || currentUser.role === 'admin';

  const reports = db.getReports(currentUser);
  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'selesai').length;

  const handleFileChange = (file: File) => {
    if (!canUploadPhoto) {
      alert('Untuk optimalisasi database, fitur upload foto profil hanya untuk Guru BK, Wali Kelas, dan Admin.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    // Limit to 3MB for database optimization
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 3MB untuk optimalisasi database.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64 = reader.result as string;
        updateCurrentUserAvatar(base64);
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      } catch (err: any) {
        setIsUploading(false);
        setUploadError(err.message || 'Gagal menyimpan foto profil.');
      }
    };
    reader.onerror = () => {
      alert('Gagal membaca file gambar.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!canUploadPhoto) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const currentGender: 'L' | 'P' =
    (currentUser.gender as 'L' | 'P') ||
    (isStudent ? (studentProfile?.gender as 'L' | 'P') : (teacherProfile?.gender as 'L' | 'P')) ||
    'L';

  const [genderSuccessMessage, setGenderSuccessMessage] = useState<string | null>(null);

  const handleGenderChange = (newGender: 'L' | 'P') => {
    if (newGender === currentGender) return;
    try {
      db.updateUserGender(currentUser.id, newGender);
      refreshUser();
      setGenderSuccessMessage(
        `Jenis kelamin berhasil diubah ke ${newGender === 'L' ? 'Laki-laki' : 'Perempuan'}. Avatar resmi akun Anda otomatis disesuaikan.`
      );
      setTimeout(() => setGenderSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to change gender', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar Display */}
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar || getDefaultAvatarByGender(currentUser.role, currentGender)}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-slate-50 ring-4 ring-blue-50 shadow-md transition"
            />
            {canUploadPhoto && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Ganti atau Upload Foto Profil"
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md transition cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                {currentUser.role === 'siswa'
                  ? 'Siswa'
                  : currentUser.role === 'guru'
                  ? teacherProfile?.teacher_type === 'guru_bk'
                    ? 'Guru BK'
                    : 'Wali Kelas'
                  : 'Administrator'}
              </span>

              {studentProfile?.class_info && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {studentProfile.class_info.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.name}
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser.email}
              </span>

              {studentProfile?.nis && (
                <span className="flex items-center gap-1.5 font-mono">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  NIS: {studentProfile.nis}
                </span>
              )}

              {teacherProfile?.nip && (
                <div className="flex items-center gap-1.5 font-mono bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/60">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-700">
                    NIP: {showNip ? decryptNip(teacherProfile.nip) : maskNip(decryptNip(teacherProfile.nip))}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNip(!showNip)}
                    title={showNip ? 'Sembunyikan NIP (Privasi)' : 'Tampilkan NIP'}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-md transition cursor-pointer"
                  >
                    {showNip ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Avatar Active Indicator */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  {isStudent
                    ? 'Avatar Resmi Siswa (Tersedia 2 pilihan: Laki-laki & Perempuan)'
                    : 'Foto Profil Guru / Admin: Anda dapat mengupload foto sendiri atau memilih ilustrasi formal.'}
                </span>
              </div>
            </div>

            {uploadSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Foto profil berhasil diperbarui!</span>
              </div>
            )}

            {uploadError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Guru & Admin: Upload Foto Profil Pribadi */}
        {canUploadPhoto && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                Upload Foto Profil Guru / Admin
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Format: JPG, PNG, WebP (Maks. 3 MB)
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/60'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-300'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-2xs">
                {isUploading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? 'Mengunggah dan menyimpan foto...' : 'Tarik foto ke sini atau klik untuk memilih file'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Foto akan disimpan langsung sebagai foto profil resmi Anda di portal.
              </p>
            </div>
          </div>
        )}

        {/* Pilihan Jenis Kelamin (Gender Selection with Auto Avatar Switch) */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Pengaturan Jenis Kelamin (Gender):
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Avatar resmi akun akan otomatis disesuaikan dengan jenis kelamin
            </span>
          </div>

          {genderSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{genderSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-xl gap-3">
            <button
              type="button"
              onClick={() => handleGenderChange('L')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer text-left ${
                currentGender === 'L'
                  ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  👦 L
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Laki-laki (L)</p>
                  <span className="text-[11px] text-slate-500">
                    {isStudent ? 'Siswa Laki-laki SMK' : 'Bapak Guru / Staf'}
                  </span>
                </div>
              </div>
              {currentGender === 'L' && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleGenderChange('P')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer text-left ${
                currentGender === 'P'
                  ? 'bg-pink-50/90 border-pink-400 ring-2 ring-pink-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:border-pink-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0">
                  👧 P
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Perempuan (P)</p>
                  <span className="text-[11px] text-slate-500">
                    {isStudent ? 'Siswi Perempuan SMK' : 'Ibu Guru / Staf'}
                  </span>
                </div>
              </div>
              {currentGender === 'P' && (
                <div className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Pilihan Avatar Profil Resmi */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              {isStudent
                ? 'Pilihan Avatar Profil (2 Pilihan: Siswa Laki-laki & Siswi Perempuan):'
                : 'Atau Pilih Avatar Ilustrasi Formal Resmi (2 Pilihan):'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Klik salah satu avatar untuk menggunakan
            </span>
          </div>

          {/* Avatar Cards Grid (Strictly 2 Choices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-xl gap-3">
            {(isStudent ? STUDENT_AVATAR_OPTIONS : TEACHER_ADMIN_AVATAR_OPTIONS).map((opt) => {
              const isSelected = currentUser.avatar === opt.url;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    updateCurrentUserAvatar(opt.url);
                    setUploadSuccess(true);
                    setTimeout(() => setUploadSuccess(false), 3000);
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition text-left relative cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white'
                  }`}
                >
                  <img
                    src={opt.url}
                    alt={opt.label}
                    className="w-12 h-12 rounded-xl object-contain bg-white ring-2 ring-white shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">{opt.label}</p>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isSelected ? 'Avatar aktif' : 'Gunakan avatar ini'}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User statistics summary */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-2xl font-extrabold text-slate-900">{totalReports}</p>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.role === 'siswa' ? 'Laporan Dibuat' : 'Laporan Diterima'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-center">
            <p className="text-2xl font-extrabold text-emerald-700">{completedReports}</p>
            <span className="text-xs text-emerald-700 font-medium">
              Laporan Selesai & Tuntas
            </span>
          </div>
        </div>
      </div>

      {/* Fitur Reset Kata Sandi Akun Pendidik (Guru BK & Wali Kelas) */}
      {currentUser.role === 'guru' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Reset Kata Sandi Akun Pendidik
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Layanan permohonan pembaruan kata sandi untuk {teacherProfile?.teacher_type === 'guru_bk' ? 'Guru Bimbingan Konseling (BK)' : 'Wali Kelas'}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              Verifikasi Admin Sekolah
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
            <p className="font-semibold leading-relaxed">
              Demi menjaga keamanan akses data konseling dan privasi laporan siswa di SAPA SMK, pengaturan ulang (*reset*) kata sandi akun pendidik dilakukan secara resmi melalui verifikasi Administrator Sistem Sekolah.
            </p>
            <p className="text-amber-800 text-[11px]">
              Silakan kirimkan permohonan reset kata sandi ke email resmi Administrator Sistem di bawah ini dengan menyertakan nama lengkap dan NIP Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Email Administrator Sistem</span>
              <p className="font-mono font-bold text-blue-700 select-all text-sm">{db.getSystemSettings().reset_password_email}</p>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Respon estimasi: 1x24 jam kerja</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Data Akun Terdaftar</span>
              <p className="font-bold text-slate-800 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                <span>
                  NIP: {teacherProfile?.nip ? (showNip ? decryptNip(teacherProfile.nip) : maskNip(decryptNip(teacherProfile.nip))) : '-'} • {currentUser.email}
                </span>
                {teacherProfile?.nip && (
                  <button
                    type="button"
                    onClick={() => setShowNip(!showNip)}
                    title={showNip ? 'Sembunyikan NIP' : 'Tampilkan NIP'}
                    className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showNip ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <a
              href={`mailto:${db.getSystemSettings().reset_password_email}?subject=${encodeURIComponent(
                `Permohonan Reset Kata Sandi - ${currentUser.name} (${teacherProfile?.nip ? `NIP: ${decryptNip(teacherProfile.nip)}` : 'Guru'})`
              )}&body=${encodeURIComponent(
                `Halo Administrator Sistem SAPA SMK,\n\nSaya ingin mengajukan permohonan reset kata sandi akun pendidik saya:\n\n- Nama Lengkap: ${currentUser.name}\n- NIP: ${teacherProfile?.nip ? decryptNip(teacherProfile.nip) : '-'}\n- Peran: ${teacherProfile?.teacher_type === 'guru_bk' ? 'Guru Bimbingan Konseling (BK)' : 'Wali Kelas'}\n- Email Akun: ${currentUser.email}\n\nMohon bantuan untuk menerbitkan kata sandi sementara (temporary password) baru agar saya dapat mengakses kembali sistem.\n\nTerima kasih,\n${currentUser.name}`
              )}`}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Hubungi Admin via Email (Kirim Permohonan)</span>
            </a>

            <button
              type="button"
              onClick={() => {
                const text = `Halo Administrator Sistem SAPA SMK,\n\nSaya ingin mengajukan permohonan reset kata sandi akun pendidik saya:\n- Nama Lengkap: ${currentUser.name}\n- NIP: ${teacherProfile?.nip ? decryptNip(teacherProfile.nip) : '-'}\n- Peran: ${teacherProfile?.teacher_type === 'guru_bk' ? 'Guru Bimbingan Konseling (BK)' : 'Wali Kelas'}\n- Email Akun: ${currentUser.email}\n\nMohon bantuan untuk menerbitkan kata sandi sementara baru.\n\nTerima kasih,\n${currentUser.name}`;
                navigator.clipboard.writeText(text);
                setCopiedTemplate(true);
                setTimeout(() => setCopiedTemplate(false), 3000);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {copiedTemplate ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Format Disalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Salin Format Email Permohonan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Security & Privacy Commitment Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>Komitmen Keamanan & Privasi SAPA</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Aplikasi ini mematuhi standar perlindungan privasi anak dan siswa di lingkungan sekolah. Laporan dengan status anonim disamarkan secara otomatis kepada guru yang bersangkutan. Guru BK dan Wali Kelas hanya dapat mengakses laporan sesuai yurisdiksi dan kewenangan yang ditetapkan.
        </p>
      </div>

      {/* Keluar dari Akun */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Sesi Akun Aktif</h3>
          <p className="text-xs text-slate-500 mt-0.5">Keluar dari portal untuk mengakhiri sesi autentikasi.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate('landing');
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  );
};
