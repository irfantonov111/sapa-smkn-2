import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Harap masukkan identitas login (NIS / NIP / Email) dan kata sandi.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await login(identifier.trim(), password);
      if (res.success) {
        onNavigate('dashboard');
      } else {
        setErrorMsg(res.message || 'Gagal masuk. Periksa kembali kredensial Anda.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan saat memproses login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4 space-y-6">
      {/* Back to Home button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
          <Shield className="w-7 h-7 fill-white/20 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Masuk ke Portal SAPA
        </h1>
        <p className="text-xs text-slate-500">
          SAPA: Sarana Pendampingan dan Asistensi Siswa
        </p>
      </div>

      {/* Form Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            Autentikasi Akun
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mendukung login via <strong>NIS Siswa</strong>, <strong>NIP Guru</strong>, atau <strong>Email</strong>.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Identifier (NIS / NIP / Email) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan NIS / NIP / Email..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Siswa gunakan NIS, Guru gunakan NIP, Admin gunakan Email
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-amber-600 hover:text-amber-800 font-medium underline cursor-pointer"
                >
                  Lupa Sandi?
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Petunjuk Format Login & Password Default Siswa */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2.5">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] space-y-1">
            <p className="font-bold text-blue-900">
              Panduan Masuk Akun Siswa:
            </p>
            <p className="text-blue-800">
              • <strong>Username:</strong> NIS Siswa (contoh: <code>24250101</code>)
            </p>
            <p className="text-blue-800">
              • <strong>Sandi Default:</strong> <code>siswa</code> + 4 digit terakhir NIS (contoh: <code>siswa0101</code>)
            </p>
            <p className="text-blue-700 text-[10px] italic">
              *Siswa akan diminta mengganti kata sandi secara mandiri saat pertama kali login (1x kesempatan).
            </p>
          </div>

          <p className="font-semibold text-slate-700">Format Kredensial Lainnya:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
            <li><strong>Admin Sistem:</strong> Email administrator sekolah resmi</li>
            <li><strong>Guru BK / Wali Kelas:</strong> NIP 18-digit atau Email sekolah resmi</li>
          </ul>
        </div>
      </div>

      {/* Modal Lupa Kata Sandi */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Lupa Kata Sandi Akun</h3>
                  <p className="text-[11px] text-slate-500">Bantuan Pemulihan Akses Siswa & Guru</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <p className="font-semibold text-slate-800">
                Siswa yang lupa kata sandi:
              </p>
              <p>
                Siswa diberikan kesempatan 1 kali untuk mengubah kata sandi default saat pertama kali login. Jika Anda lupa kata sandi baru yang telah ditetapkan, silakan hubungi <strong>Admin Sistem Sekolah</strong> melalui email resmi.
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-all font-bold text-blue-700">
                {db.getSystemSettings().reset_password_email}
              </div>
              <p className="text-[11px] text-slate-500">
                Sertakan Nama Lengkap, NIS, dan Kelas pada isi pesan email Anda untuk proses verifikasi identitas.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              <a
                href={`mailto:${db.getSystemSettings().reset_password_email}?subject=Permohonan%20Reset%20Kata%20Sandi%20Siswa&body=Halo%20Admin%20SAPA%20SMK,%0A%0ASaya%20mengajukan%20permohonan%20reset%20kata%20sandi%20akun%20siswa:%0ANama%20Lengkap:%20%0ANIS:%20%0AKelas:%20%0A%0ATerima%20kasih.`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim Email ke Admin</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
