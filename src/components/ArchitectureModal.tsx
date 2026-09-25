import React, { useState } from 'react';
import {
  X,
  Layers,
  Database,
  Shield,
  GitBranch,
  Terminal,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Server,
  UserCheck,
  AlertTriangle,
  Lock,
  ExternalLink,
  Code,
  Cloud,
  Zap,
  Sparkles
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'details' | 'installation' | 'architecture' | 'deploy';
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'details'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'installation' | 'architecture' | 'deploy'>(defaultTab);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => {
      setCopiedCommand(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dokumentasi & Panduan SAPA
              </h2>
              <p className="text-xs text-slate-500">
                Detail Proyek, Langkah Instalasi Lokal, dan Blueprint Arsitektur Sistem
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'details'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Detail & Visi Proyek</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('installation')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'installation'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>2. Panduan Instalasi Lokal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'architecture'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Arsitektur & ERD</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'deploy'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>4. Hosting Vercel Gratis</span>
          </button>
        </div>

        {/* TAB 1: DETAIL PROYEK */}
        {activeTab === 'details' && (
          <div className="space-y-6 animate-in fade-in duration-150 text-slate-700 text-xs">
            {/* Latar Belakang */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Latar Belakang & Nilai Manfaat
              </h3>
              <p className="leading-relaxed text-slate-700">
                Banyak siswa sekolah enggan melaporkan perundungan (*bullying*), kecemasan akademik, atau masalah keluarga karena rasa malu dan takut dihakimi. <strong>SAPA</strong> ("Sarana Pendampingan dan Asistensi Siswa") dibangun sebagai wadah digital ramah siswa yang menjamin rasa aman, perlindungan privasi anonim, serta koordinasi terstruktur antara Guru Bimbingan Konseling (BK) dan Wali Kelas.
              </p>
            </div>

            {/* Fitur Berdasarkan Peran */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Fitur Utama 4 Peran Pengguna
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <strong className="text-slate-900 font-bold">🎓 Peran Siswa</strong>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Formulir aduan terstruktur 5 kategori dengan opsi anonimitas.</li>
                    <li>Pilihan guru tujuan: Guru BK atau Wali Kelas.</li>
                    <li>Pelacakan linimasa status secara transparan & real-time.</li>
                    <li>Ruang obrolan dua arah dengan guru pendamping.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <strong className="text-slate-900 font-bold">💼 Peran Guru BK</strong>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Antrean prioritas berdasarkan tingkat urgensi & kasus darurat.</li>
                    <li>Perbaruan status aduan ke <em>Ditindaklanjuti</em> & catatan konseling.</li>
                    <li>Penanganan laporan anonim tanpa mengungkap identitas siswa.</li>
                    <li>Penutupan laporan tuntas disertai dokumentasi solusi.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <strong className="text-slate-900 font-bold">📋 Peran Wali Kelas</strong>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Pemantauan aduan khusus siswa dari kelas binaannya (misal: X RPL 1).</li>
                    <li>Koordinasi bimbingan akademik, tugas belajar, & absensi.</li>
                    <li>Dukungan rujukan/eskalasi kasus kritis ke Guru BK.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <strong className="text-slate-900 font-bold">⚙️ Peran Administrator</strong>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Dashboard statistik pengaduan & grafik sebaran kategori.</li>
                    <li>Manajemen data siswa, guru, kelas, & kategori laporan.</li>
                    <li>Manajemen relasional database master, laporan, dan sinkronisasi server.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Perlindungan Privasi & Tingkat Kerahasiaan */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                3 Tingkat Kerahasiaan Siswa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-emerald-700">1. Terbuka</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Nama & NIS terlihat lengkap oleh guru tujuan agar tindak lanjut bimbingan belajar lebih cepat.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-700">2. Terbatas</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hanya guru yang dituju yang dapat mengetahui identitas siswa; terlindungi dari pihak luar.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700">3. Anonim</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Nama & NIS disamarkan menjadi <em>"Siswa Anonim"</em>. Cocok untuk kasus perundungan rawan intimidasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANDUAN INSTALASI LOKAL */}
        {activeTab === 'installation' && (
          <div className="space-y-6 animate-in fade-in duration-150 text-slate-700 text-xs">
            {/* Prasyarat */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                Prasyarat Perangkat Lunak (Prerequisites)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div>• <strong>Node.js</strong>: Versi 18.x atau 20.x LTS (disarankan 20+)</div>
                <div>• <strong>NPM</strong>: Versi 9.x atau 10.x (bawaan Node.js)</div>
                <div>• <strong>Browser</strong>: Google Chrome, Edge, atau Firefox terkini</div>
                <div>• <strong>Editor</strong>: Visual Studio Code (direkomendasikan)</div>
              </div>
            </div>

            {/* Step-by-Step Installation */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                Langkah-Langkah Instalasi di Terminal
              </h3>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                    <strong className="text-slate-900 font-bold">Unduh & Ekstrak Proyek</strong>
                  </div>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Klik menu <strong>Export / Download as ZIP</strong> pada Google AI Studio, lalu ekstrak folder ZIP tersebut ke direktori laptop Anda (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">D:\Projects\advocare</code>).
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                    <strong className="text-slate-900 font-bold">Buka Terminal di Folder Proyek</strong>
                  </div>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Buka VS Code, pilih <em>File &gt; Open Folder</em>, lalu buka terminal terintegrasi (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Ctrl + ~</code>).
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                    <strong className="text-slate-900 font-bold">Pasang Semua Dependensi (npm install)</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('npm install', 'npm-install')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1.5 transition"
                  >
                    {copiedCommand === 'npm-install' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-emerald-400 text-xs flex items-center justify-between">
                  <span>npm install</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Mengunduh React 19, Tailwind CSS v4, Lucide Icons, dan dependensi lainnya.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">4</span>
                    <strong className="text-slate-900 font-bold">Jalankan Server Lokal (npm run dev)</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('npm run dev', 'npm-run-dev')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1.5 transition"
                  >
                    {copiedCommand === 'npm-run-dev' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-emerald-400 text-xs flex items-center justify-between">
                  <span>npm run dev</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Server pengembangan akan aktif di <strong className="text-slate-800 font-mono">http://localhost:3000</strong>.
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <strong className="text-emerald-950 font-bold">Buka di Browser</strong>
                </div>
                <p className="text-emerald-900 text-[11px]">
                  Buka browser lalu kunjungi: <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="underline font-mono font-bold text-emerald-800">http://localhost:3000</a>. Masuk menggunakan akun Siswa, Guru BK, Wali Kelas, atau Administrator Sekolah.
                </p>
              </div>
            </div>

            {/* Panduan Deployment ke Vercel */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Panduan Deploy ke Vercel (Produksi Cloud)</h3>
              </div>
              <p className="text-[11px] text-slate-300">
                Proyek ini telah dikonfigurasi penuh untuk Vercel dengan file <code className="text-emerald-400 font-mono">vercel.json</code>, entrypoint serverless <code className="text-emerald-400 font-mono">api/index.ts</code>, dan dukungan database PostgreSQL.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">1</span>
                    Persiapkan Database PostgreSQL
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Gunakan layanan PostgreSQL terkelola gratis seperti <strong>Neon.tech</strong>, <strong>Supabase</strong>, atau <strong>Vercel Postgres</strong>. Buat database baru lalu salin Connection String URL.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">2</span>
                    Jalankan Migrasi & Data Master Administrator Sistem
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Buka SQL Query Editor di Supabase/Neon, lalu jalankan file <code className="text-emerald-300 font-mono">database/schema.sql</code> diikuti <code className="text-emerald-300 font-mono">database/seed.sql</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">3</span>
                    Push ke GitHub & Impor ke Vercel Dashboard
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Push repositori ke GitHub, lalu klik <strong>Add New Project</strong> di Vercel. Pilih preset <strong>Vite</strong>. Vercel akan otomatis mengenali <code className="text-emerald-300 font-mono">vercel.json</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">4</span>
                    Konfigurasi Environment Variables di Vercel
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tambahkan variable: <code className="text-emerald-300 font-mono">DATABASE_URL</code> (URL Postgres Anda) dan <code className="text-emerald-300 font-mono">NODE_ENV=production</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabel Kredensial Resmi */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">Daftar Kredensial Akun Resmi Sekolah:</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Peran</th>
                      <th className="p-2">Nama Pengguna</th>
                      <th className="p-2">Identifier / Email</th>
                      <th className="p-2">Kata Sandi</th>
                      <th className="p-2">Wewenang & Hak Akses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2 font-bold text-amber-700">🎓 Siswa</td>
                      <td className="p-2">Rian Pratama (X RPL 1)</td>
                      <td className="p-2 font-mono">24250101 (atau siswa@advocare.test)</td>
                      <td className="p-2 font-mono text-slate-500">siswa123</td>
                      <td className="p-2">Buat laporan bimbingan, chat, pantau progres</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-blue-700">💼 Guru BK</td>
                      <td className="p-2">Dra. Hj. Sri Wahyuni, M.Psi</td>
                      <td className="p-2 font-mono">197503151999032001 (atau sri.wahyuni@smk-advocare.sch.id)</td>
                      <td className="p-2 font-mono text-slate-500">bk123</td>
                      <td className="p-2">Tangani kasus, beri tindak lanjut, hapus massal</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-emerald-700">📋 Wali Kelas</td>
                      <td className="p-2">Budi Santoso, S.Kom</td>
                      <td className="p-2 font-mono">197906122005011001 (atau budi.santoso@smk-advocare.sch.id)</td>
                      <td className="p-2 font-mono text-slate-500">wali123</td>
                      <td className="p-2">Pantau kelas binaan, tangani laporan kelas</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-purple-700">⚙️ Admin</td>
                      <td className="p-2">Administrator Sekolah</td>
                      <td className="p-2 font-mono">admin@advocare.test</td>
                      <td className="p-2 font-mono text-slate-500">admin123</td>
                      <td className="p-2">Kelola master data, laporan, & sinkronisasi DB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARSITEKTUR & ERD */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-in fade-in duration-150 text-slate-700 text-xs">
            {/* Section 1: User Flow & Lifecycle */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-600" />
                1. Alur Transisi Status (State Machine Lifecycle)
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
                <p className="font-bold text-blue-700">TERKIRIM ➔ DIBACA ➔ DIRESPONS ➔ DITINDAKLANJUTI ➔ SELESAI</p>
                <p className="text-slate-500">1. Siswa membuat laporan ➔ Status: TERKIRIM (Notifikasi ke Guru tujuan)</p>
                <p className="text-slate-500">2. Guru membuka detail ➔ Otomatis berubah: DIBACA (Notifikasi ke Siswa)</p>
                <p className="text-slate-500">3. Guru membalas pesan ➔ Status meningkat: DIRESPONS</p>
                <p className="text-slate-500">4. Guru memberikan catatan bimbingan ➔ Status: DITINDAKLANJUTI</p>
                <p className="text-slate-500">5. Resolusi disepakati ➔ Status: SELESAI (Laporan ditutup aman)</p>
              </div>
            </div>

            {/* Section 2: ERD & Relational Schema */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" />
                2. Entity Relationship Diagram (PostgreSQL Relational Tables)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">users</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), name, email, role, avatar, phone, created_at</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">students</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), user_id (FK), nis, class_id (FK), created_at</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">teachers</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), user_id (FK), nip, teacher_type ('guru_bk' | 'wali_kelas'), created_at</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">classes</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), name, grade, major, homeroom_teacher_id (FK)</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">categories</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), name, description, icon, color, active</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">reports</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), report_code (AC-00001), student_id (FK), category_id (FK), assigned_to, title, description, urgency, privacy, status, created_at, updated_at, closed_at</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">messages</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), report_id (FK), sender_id (FK), message, created_at, is_read</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-700 font-mono">report_status_history</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), report_id (FK), status, changed_by (FK), note, created_at</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="font-bold text-purple-700 font-mono">notifications</span>
                  <p className="text-[11px] text-slate-500 mt-1">id (PK), user_id (FK), report_id (FK), title, message, is_read, created_at</p>
                </div>
              </div>
            </div>

            {/* Section 3: Role & Permission Matrix */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                3. Matriks Hak Akses (Role-Based Access Control)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <th className="p-2.5">Fitur / Data</th>
                      <th className="p-2.5">Siswa</th>
                      <th className="p-2.5">Guru BK</th>
                      <th className="p-2.5">Wali Kelas</th>
                      <th className="p-2.5">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-medium">Buat Laporan Baru</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                      <td className="p-2.5 text-slate-400">✕ Tidak</td>
                      <td className="p-2.5 text-slate-400">✕ Tidak</td>
                      <td className="p-2.5 text-slate-400">✕ Tidak</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Lihat Laporan Sendiri</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Hanya Milik Sendiri</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Semua</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Lihat Laporan Siswa Lain</td>
                      <td className="p-2.5 text-rose-600 font-bold">✕ Diblokir (RLS)</td>
                      <td className="p-2.5 text-blue-600 font-semibold">Tugas BK & Kasus Berat</td>
                      <td className="p-2.5 text-blue-600 font-semibold">Hanya Siswa Kelas Binaan</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Semua</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Kerahasiaan Laporan Anonim</td>
                      <td className="p-2.5 text-slate-600">Terlihat Identitas Asli</td>
                      <td className="p-2.5 text-purple-700 font-bold">Disamarkan ("Siswa Anonim")</td>
                      <td className="p-2.5 text-purple-700 font-bold">Disamarkan ("Siswa Anonim")</td>
                      <td className="p-2.5 text-slate-600">Audit Trail Aman</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Perbarui Status & Catatan</td>
                      <td className="p-2.5 text-slate-400">✕ Hanya Membaca</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Kirim Pesan dalam Laporan</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Kelola Master Data & DB</td>
                      <td className="p-2.5 text-slate-400">✕ Tidak</td>
                      <td className="p-2.5 text-slate-400">✕ Tidak</td>
                      <td className="p-2.5 text-slate-400">✕ Tidak</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Ya (Penuh)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PANDUAN DEPLOY GRATIS KE VERCEL + DATABASE SUPABASE */}
        {activeTab === 'deploy' && (
          <div className="space-y-6 animate-in fade-in duration-150 text-slate-700 text-xs">
            {/* Banner Vercel & Supabase */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Hosting 100% Gratis: Vercel (Frontend & Serverless API) + Supabase (Database PostgreSQL)</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                SAPA telah dilengkapi arsitektur <strong>Dual-Engine Fullstack</strong>: berjalan sebagai Express + Vite di komputer lokal dan otomatis bertransformasi menjadi <strong>Vercel Serverless Functions (/api/*)</strong> saat dideploy ke Vercel tanpa biaya sepeser pun.
              </p>
            </div>

            {/* Step by step guide */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                Langkah 1: Siapkan Database PostgreSQL Gratis (Supabase / Neon)
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed">
                  <li>
                    Buka dan daftar akun gratis di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> atau <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">neon.tech <ExternalLink className="w-3 h-3" /></a>.
                  </li>
                  <li>
                    Buat <strong>New Project</strong> dengan nama <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">advocare-db</code> dan simpan kata sandi database Anda.
                  </li>
                  <li>
                    Masuk ke menu <strong>SQL Editor</strong> di dashboard Supabase.
                  </li>
                  <li>
                    Jalankan skrip tabel dari file <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">database/schema.sql</code> lalu <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">database/seed.sql</code>.
                  </li>
                  <li>
                    Buka <strong>Project Settings</strong> &rarr; <strong>Database</strong> &rarr; <strong>Connection String</strong> (pilih URI) dan salin URL-nya.
                  </li>
                </ol>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Contoh Format URL:</span>
                    <code className="text-xs font-mono text-emerald-700">postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('postgresql://postgres:your_password@db.xxxx.supabase.co:5432/postgres', 'db_url')}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg shrink-0"
                    title="Salin contoh URI"
                  >
                    {copiedCommand === 'db_url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                Langkah 2: Hubungkan Repositori ke Vercel (1-Click)
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed">
                  <li>
                    Pastikan kode proyek sudah di-push ke repositori <strong>GitHub</strong> Anda.
                  </li>
                  <li>
                    Buka <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">vercel.com <ExternalLink className="w-3 h-3" /></a> dan login dengan GitHub.
                  </li>
                  <li>
                    Klik tombol <strong>"Add New..." &rarr; "Project"</strong>, kemudian pilih repositori proyek ini.
                  </li>
                  <li>
                    Vercel akan otomatis mendeteksi konfigurasi melalui file <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">vercel.json</code> yang sudah disediakan.
                  </li>
                  <li>
                    Buka bagian <strong>Environment Variables</strong> di halaman konfigurasi Vercel:
                    <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-bold">KEY:</span>
                        <span className="text-slate-800">DATABASE_URL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-bold">VALUE:</span>
                        <span className="text-emerald-700 truncate max-w-[280px] sm:max-w-md">postgresql://postgres:password@...</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    Klik tombol <strong>"Deploy"</strong>! Dalam 1-2 menit aplikasi SAPA Anda sudah online dengan domain <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">https://nama-proyek.vercel.app</code>.
                  </li>
                </ol>
              </div>
            </div>

            {/* Fitur Backend yang Sudah Aktif */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <h4 className="font-bold text-blue-950 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                Endpoint Backend REST API yang Siap Beroperasi
              </h4>
              <p className="text-slate-600 text-xs">
                Backend telah mengimplementasikan seluruh endpoint RESTful di bawah <code className="font-mono font-bold text-blue-600">/api/*</code>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-blue-100 text-slate-700">
                  <span className="text-emerald-600 font-bold">GET</span> /api/health <span className="text-slate-400">(Status DB)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 text-slate-700">
                  <span className="text-blue-600 font-bold">POST</span> /api/auth/login <span className="text-slate-400">(Autentikasi)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 text-slate-700">
                  <span className="text-emerald-600 font-bold">GET/POST</span> /api/reports <span className="text-slate-400">(Laporan Aduan)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 text-slate-700">
                  <span className="text-amber-600 font-bold">PATCH</span> /api/reports/:id/status <span className="text-slate-400">(Ubah Status)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 text-slate-700">
                  <span className="text-blue-600 font-bold">POST</span> /api/reports/:id/messages <span className="text-slate-400">(Kirim Chat)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 text-slate-700">
                  <span className="text-emerald-600 font-bold">GET</span> /api/stats <span className="text-slate-400">(Statistik Admin)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Dokumentasi lengkap & skema SQL tersimpan pada <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono font-bold">README.md</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono font-bold">database/schema.sql</code>, dan <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono font-bold">vercel.json</code>.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Tutup Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
};

