import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Eye, EyeOff, AlertTriangle, Mail, CheckCircle2, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

export const FirstTimePasswordModal: React.FC = () => {
  const { currentUser, studentProfile, teacherProfile, changeStudentDefaultPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Tampil untuk siswa maupun guru (Guru BK & Wali Kelas) yang belum mengganti sandi default (password_changed === false)
  if (!currentUser || (currentUser.role !== 'siswa' && currentUser.role !== 'guru') || currentUser.password_changed !== false || isDismissed) {
    return null;
  }

  const isTeacher = currentUser.role === 'guru';
  const teacherRoleLabel = teacherProfile?.teacher_type === 'guru_bk' ? 'Guru BK' : teacherProfile?.teacher_type === 'wali_kelas' ? 'Wali Kelas' : 'Guru';
  const nis = studentProfile?.nis || '';
  const defaultPassHint = isTeacher ? 'guru123' : (nis ? `siswa${nis.slice(-4)}` : 'siswa123');

  const isMinLength = newPassword.length >= 6;
  const isMatching = newPassword !== '' && newPassword === confirmPassword;
  const isNotDefault = isTeacher 
    ? (newPassword.toLowerCase() !== 'guru123' && newPassword.toLowerCase() !== 'guru')
    : (newPassword.toLowerCase() !== defaultPassHint.toLowerCase() && newPassword.toLowerCase() !== 'siswa123');
  const canSubmit = isMinLength && isMatching && isNotDefault && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isMinLength) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (!isMatching) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!isNotDefault) {
      setError(`Kata sandi baru tidak boleh sama dengan kata sandi bawaan default (${defaultPassHint}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = changeStudentDefaultPassword(newPassword.trim());
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          // Modal will unmount because currentUser.password_changed is now true
        }, 1200);
      } else {
        setError(res.message);
      }
    } catch {
      setError('Terjadi kesalahan saat memperbarui kata sandi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs p-3 sm:p-4 md:p-6 flex min-h-full items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-md sm:max-w-lg my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className={`px-4 py-3.5 sm:px-6 sm:py-4.5 text-white relative shrink-0 ${isTeacher ? 'bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700' : 'bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center ring-2 ring-white/25 shrink-0">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 text-white inline-block mb-0.5">
                  {isTeacher ? `Aktivasi Akun ${teacherRoleLabel} (1x)` : 'Kesempatan Ubah Sandi Mandiri (1x)'}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                  Atur Sandi Pribadi Baru
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              title="Tutup (dapat diubah nanti di sesi ini)"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4.5 overflow-y-auto flex-1 overscroll-contain">
          <div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Halo, <span className="font-extrabold text-slate-900">{currentUser.name}</span> {isTeacher && `(${teacherRoleLabel})`}!
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {isTeacher
                ? 'Sebagai pendidik dan konselor, demi menjaga kerahasiaan data siswa dan keamanan sistem, Anda diwajibkan mengubah kata sandi awal default (guru123) ke kata sandi baru pribadi Anda.'
                : 'Anda sedang masuk menggunakan kata sandi bawaan atau kata sandi hasil reset admin. Anda diberikan kesempatan 1 kali untuk menetapkan kata sandi baru pribadi sesuai preferensi Anda.'}
            </p>
          </div>

          {/* Ketentuan Keamanan Alert */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 sm:p-3.5 text-amber-900 space-y-2">
            <div className="flex items-start gap-2 sm:gap-2.5">
              <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5 sm:space-y-1">
                <p className="font-bold text-amber-950 text-xs">
                  Ketentuan Keamanan Akun:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800 text-[11px] sm:text-xs">
                  <li>
                    {isTeacher 
                      ? 'Setelah berhasil diubah, gunakan kata sandi baru ini untuk login berikutnya.'
                      : 'Siswa diberikan kesempatan 1 (satu) kali untuk mengatur kata sandi sendiri sesuai preferensi.'}
                  </li>
                  <li>
                    Jika kelak lupa kata sandi, silakan hubungi <span className="font-bold">Admin Sistem</span> untuk proses reset akun.
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
              <span className="text-amber-850 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-750 shrink-0" />
                <span>Email Admin: <strong>{db.getSystemSettings().reset_password_email}</strong></span>
              </span>
              <a
                href={`mailto:${db.getSystemSettings().reset_password_email}?subject=Permohonan%20Bantuan%20Akun%20SAPA`}
                className="text-blue-700 hover:text-blue-800 font-bold underline"
              >
                Kirim Email
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{success}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi Baru Pribadi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru (min. 6 karakter)"
                  required
                  autoFocus
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  required
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checklist Validasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 text-[11px]">
              <div className={`flex items-center gap-1.5 font-medium ${isMinLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${isMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                  ✓
                </div>
                <span className="truncate">Min. 6 karakter</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${isMatching && confirmPassword !== '' ? 'text-emerald-700' : 'text-slate-500'}`}>
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${isMatching && confirmPassword !== '' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                  ✓
                </div>
                <span className="truncate">Konfirmasi cocok</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${isNotDefault && newPassword !== '' ? 'text-emerald-700' : 'text-slate-500'}`}>
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${isNotDefault && newPassword !== '' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                  ✓
                </div>
                <span className="truncate">Beda dari bawaan</span>
              </div>
            </div>

            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer ${isTeacher ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan Kata Sandi...' : 'Simpan & Aktifkan Akun'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
