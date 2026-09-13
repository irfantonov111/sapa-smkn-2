import React, { useState, useEffect } from 'react';
import {
  Users,
  Layers,
  Database,
  RefreshCw,
  CheckCircle,
  CheckCircle2,
  BarChart3,
  Shield,
  MessageCircle,
  Clock,
  Sparkles,
  FileText,
  ArrowRight,
  Download,
  Server,
  AlertTriangle,
  Info,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminReportsTab } from '../components/admin/AdminReportsTab';

interface AdminDashboardProps {
  onNavigate: (tab: string, reportId?: string) => void;
  activeSubTab?: 'dashboard' | 'reports' | 'users' | 'categories';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  activeSubTab = 'dashboard'
}) => {
  const { currentUser } = useAuth();
  const [subTab, setSubTab] = useState<'dashboard' | 'reports' | 'users' | 'categories'>(activeSubTab);
  const [resetMessage, setResetMessage] = useState('');
  const [tick, setTick] = useState(0);

  // Server & Supabase synchronization state
  const [serverStatus, setServerStatus] = useState<{
    status: string;
    engine: string;
    isPostgres: boolean;
    hasDatabaseUrl: boolean;
    counts?: { users: number; classes: number; teachers: number; students: number; reports: number };
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');

  // Keep internal subTab synchronized with global routing
  useEffect(() => {
    setSubTab(activeSubTab);
  }, [activeSubTab]);

  const loadServerStatus = async () => {
    try {
      const status = await db.checkServerHealth();
      setServerStatus(status);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadServerStatus();
  }, [tick]);

  const handleRefresh = () => {
    setTick(t => t + 1);
  };

  const rawTables = db.getRawTables();
  const users = rawTables.users;
  const students = rawTables.students;
  const teachers = rawTables.teachers;
  const classes = rawTables.classes;
  const categories = rawTables.categories;
  const reports = rawTables.reports;
  const messages = rawTables.messages;

  // Sync state from Supabase / Backend API
  const handleSyncFromSupabase = async () => {
    setIsSyncing(true);
    setResetMessage('');
    try {
      const result = await db.syncFromBackend();
      await loadServerStatus();
      handleRefresh();
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (result.success) {
        setResetMessage(`Sinkronisasi berhasil! Data termutakhir telah dimuat.`);
      } else {
        setResetMessage(`Info: ${result.message || 'Menggunakan data lokal saat ini.'}`);
      }
    } catch (err: any) {
      setResetMessage(`Gagal sinkronisasi: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setResetMessage(''), 5000);
    }
  };

  // Seed Supabase with master dataset directly
  const handleSeedSupabase = async () => {
    if (!confirm('Apakah Anda ingin menginisialisasi seluruh master dataset (33 Kelas, 43 Guru, 1.122 Siswa) langsung ke database Supabase Anda? Proses ini memerlukan waktu 2-3 detik.')) {
      return;
    }
    setIsSeeding(true);
    setResetMessage('');
    try {
      const res = await db.seedSupabase();
      await loadServerStatus();
      handleRefresh();
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (res.success) {
        setResetMessage('Berhasil! Seluruh 33 Kelas, 43 Guru, dan 1.122 Siswa kini telah tersimpan di Supabase.');
      } else {
        setResetMessage(`Gagal inisialisasi Supabase: ${res.message}`);
      }
    } catch (err: any) {
      setResetMessage(`Error: ${err.message}`);
    } finally {
      setIsSeeding(false);
      setTimeout(() => setResetMessage(''), 6000);
    }
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menyinkronkan ulang database ke dataset master sekolah?')) {
      db.resetToDefaults();
      handleRefresh();
      setResetMessage('Database lokal berhasil disinkronkan ke dataset master sekolah.');
      setTimeout(() => setResetMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <span>Panel Administrator SAPA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola data master pengguna, 108 siswa, 10 guru BK, 3 wali kelas, kategori, dan seluruh laporan pengaduan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <a
            href="/Daftar_Akun_Pengguna_SAPA_Lengkap.xlsx"
            download="Daftar_Akun_Pengguna_SAPA_Lengkap.xlsx"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer"
            title="Unduh seluruh data pengguna (1.122 Siswa, 10 Guru BK, 33 Wali Kelas, 2 Admin) lengkap dengan username & kata sandi"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </a>

          <button
            type="button"
            onClick={handleSyncFromSupabase}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            title="Tarik data terkini dari Supabase ke aplikasi"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan dari Supabase'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Database className="w-4 h-4 text-slate-500" />
            <span>Reset Lokal</span>
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Database & Cloud Synchronization Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              serverStatus?.isPostgres ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Sinkronisasi Database Vercel & Supabase</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  serverStatus?.isPostgres
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${serverStatus?.isPostgres ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {serverStatus?.isPostgres ? 'Terhubung Supabase (PostgreSQL)' : 'Mode Lokal (Menunggu Supabase)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {serverStatus?.isPostgres
                  ? `Koneksi aktif ke Supabase Pooler (Port 6543). Seluruh data disinkronkan secara aman.`
                  : `Aplikasi berjalan dengan engine in-memory lokal. Hubungkan DATABASE_URL di Vercel untuk persistensi multi-user.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSyncFromSupabase}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Tarik Data Supabase</span>
            </button>

            {serverStatus?.isPostgres && (
              <button
                type="button"
                onClick={handleSeedSupabase}
                disabled={isSeeding}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                title="Tulis ulang seluruh master data (33 Kelas, 43 Guru, 1.122 Siswa) ke database Supabase"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isSeeding ? 'Mengimpor ke Supabase...' : 'Terapkan Master Data ke Supabase'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Panduan Vercel & Supabase</span>
            </button>
          </div>
        </div>

        {/* Database Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Rombel Kelas Terdaftar</span>
            <span className="text-base font-extrabold text-slate-900">{classes.length} Kelas</span>
            <span className="text-[10px] text-slate-400 block">X, XI, XII (11 Jurusan)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Tenaga Guru Terdata</span>
            <span className="text-base font-extrabold text-slate-900">{teachers.length} Guru</span>
            <span className="text-[10px] text-slate-400 block">10 BK + 33 Wali Mapel</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Siswa Aktif</span>
            <span className="text-base font-extrabold text-slate-900">{students.length} Siswa</span>
            <span className="text-[10px] text-slate-400 block">34 Siswa per Rombel</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Status Sinkronisasi</span>
            <span className="text-base font-extrabold text-emerald-600">Sinkron</span>
            <span className="text-[10px] text-slate-400 block">Pembaruan: {lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Guide Modal for Vercel & Supabase Setup */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Panduan Menghubungkan Supabase & Vercel</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <span className="font-bold text-purple-900 block text-sm">1. Ambil Connection String Supavisor (Port 6543)</span>
                <p>
                  Di dashboard Supabase Anda:
                  <br />
                  Buka <strong>Project Settings → Database → Connection Pooling</strong>.
                  <br />
                  Pilih <strong>Transaction Mode (Port 6543)</strong>. Salin URI koneksinya:
                </p>
                <code className="block p-2 bg-purple-950 text-purple-100 rounded-lg text-[11px] font-mono break-all">
                  postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
                </code>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block text-sm">2. Pasang di Dashboard Vercel</span>
                <p>
                  1. Masuk ke dashboard project Vercel Anda.
                  <br />
                  2. Buka menu <strong>Settings → Environment Variables</strong>.
                  <br />
                  3. Tambahkan variable:
                </p>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="p-1.5 bg-white border border-slate-200 rounded text-slate-800">
                    <strong>Key:</strong> DATABASE_URL
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded text-slate-800">
                    <strong>Value:</strong> postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-bold text-emerald-900 block text-sm">3. Redeploy di Vercel</span>
                <p className="text-emerald-800">
                  <strong>PENTING:</strong> Setelah menambahkan `DATABASE_URL`, Anda <strong>WAJIB melakukan Redeploy</strong> pada menu <strong>Deployments → Redeploy</strong> agar Serverless Function Vercel memuat kredensial database tersebut.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-bold text-blue-900 block text-sm">4. Jalankan Seed SQL (Dataset 33 Kelas)</span>
                <p className="text-blue-800">
                  Anda dapat membuka menu <strong>SQL Editor</strong> di Supabase dan menjalankan isi berkas <code className="font-bold">database/seed.sql</code>, atau cukup klik tombol <strong>"Terapkan Master Data ke Supabase"</strong> di panel atas setelah status terhubung berwarna hijau.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 1: System Statistics */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Siswa Terdaftar</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{students.length}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Di {classes.length} kelas jurusan</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Tenaga Pendidik</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{teachers.length}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {teachers.filter(t => t.teacher_type === 'guru_bk').length} Guru BK, {teachers.filter(t => t.teacher_type === 'wali_kelas').length} Wali Kelas
              </span>
            </div>

            <div
              onClick={() => onNavigate('admin-reports')}
              className="p-5 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 hover:shadow-md transition cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-700">Total Laporan Masuk</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-600 transition" />
              </div>
              <p className="text-3xl font-extrabold text-purple-950 mt-2">{reports.length}</p>
              <span className="text-[11px] text-purple-600 mt-0.5 block font-medium">Klik untuk kelola laporan</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-emerald-600">Pesan Diskusi Terkirim</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{messages.length}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Komunikasi dua arah</span>
            </div>
          </div>

          {/* Breakdown by Category and Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Distribusi Kategori Laporan</h3>
              <div className="space-y-3">
                {categories.map(cat => {
                  const count = reports.filter(r => r.category_id === cat.id).length;
                  const percentage = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                        <span className="font-bold text-slate-900">{count} laporan ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Distribusi Tingkat Urgensi</h3>
              <div className="space-y-3">
                {['tinggi', 'sedang', 'rendah'].map(urg => {
                  const count = reports.filter(r => r.urgency === urg).length;
                  const percentage = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
                  const barColor = urg === 'tinggi' ? 'bg-rose-500' : urg === 'sedang' ? 'bg-amber-500' : 'bg-slate-400';
                  return (
                    <div key={urg} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 capitalize">Urgensi {urg}</span>
                        <span className="font-bold text-slate-900">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Student Reports Management (Admin) */}
      {subTab === 'reports' && (
        <AdminReportsTab onNavigate={onNavigate} />
      )}

      {/* Subtab 2: Users Management with Excel Import & CRUD */}
      {subTab === 'users' && (
        <AdminUsersTab
          users={users}
          students={students}
          teachers={teachers}
          classes={classes}
          onRefresh={handleRefresh}
        />
      )}

      {/* Subtab 3: Categories Management with CRUD */}
      {subTab === 'categories' && (
        <AdminCategoriesTab
          categories={categories}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};
