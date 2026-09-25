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
  Server,
  AlertTriangle,
  Info,
  ExternalLink,
  HelpCircle,
  Activity,
  Wifi,
  WifiOff,
  Copy,
  X,
  Terminal,
  Code2
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
    provider?: string;
    host?: string;
    port?: string;
    isPooler?: boolean;
    isPrisma?: boolean;
    isSupabaseDirectV6?: boolean;
    pingMs?: number | null;
    lastError?: string | null;
    warnings?: string[];
    recommendations?: string[];
    counts?: { users: number; classes: number; teachers: number; students: number; reports: number };
  } | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider: string;
    host: string;
    port: string;
    database: string;
    isPooler: boolean;
    isPrisma?: boolean;
    isSupabaseDirectV6?: boolean;
    pingMs?: number;
    error?: string;
    hasDatabaseUrl: boolean;
    timestamp: string;
    warnings?: string[];
    recommendations?: string[];
    counts?: any;
  } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configModalTab, setConfigModalTab] = useState<'vercel' | 'prisma' | 'troubleshoot'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

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
    db.syncFromBackend().then(() => {
      loadServerStatus();
      setTick(t => t + 1);
    });
    const unsub = db.subscribe(() => {
      setTick(t => t + 1);
    });
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    await db.syncFromBackend();
    await loadServerStatus();
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

  // Real-time synchronization counts from live database (Supabase/PostgreSQL) or current store
  const displayStudentCount = serverStatus?.counts?.students !== undefined ? serverStatus.counts.students : students.length;
  const displayClassCount = serverStatus?.counts?.classes !== undefined ? serverStatus.counts.classes : classes.length;
  const displayTeacherCount = serverStatus?.counts?.teachers !== undefined ? serverStatus.counts.teachers : teachers.length;
  const displayReportCount = serverStatus?.counts?.reports !== undefined ? serverStatus.counts.reports : reports.length;

  // Actively test live connection between backend (Vercel) and database provider (Supabase)
  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    setResetMessage('');
    try {
      const res = await db.testServerDatabase();
      setTestResult(res);
      await loadServerStatus();
      handleRefresh();
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (res.success) {
        setResetMessage(`Koneksi Database Berhasil! Terhubung ke ${res.provider} (${res.host}:${res.port}) dengan latensi ${res.pingMs}ms.`);
      } else {
        setResetMessage(`Koneksi Database Belum Tersambung: ${res.error || 'Periksa konfigurasi DATABASE_URL'}`);
      }
    } catch (err: any) {
      setResetMessage(`Error saat menguji koneksi: ${err.message}`);
    } finally {
      setIsTestingDb(false);
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
            Database tersambung langsung ke Supabase. Seluruh perubahan akun pengguna, kelas, guru, dan pengaduan langsung tersimpan di cloud.
          </p>
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              serverStatus?.isPostgres ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {serverStatus?.isPostgres ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Koneksi Database (Vercel ➔ Prisma ORM)</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  (testResult?.success || serverStatus?.isPostgres)
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${(testResult?.success || serverStatus?.isPostgres) ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {(testResult?.success || serverStatus?.isPostgres)
                    ? `Terhubung: ${serverStatus?.provider || testResult?.provider || 'PostgreSQL'} (${testResult?.pingMs ?? serverStatus?.pingMs ?? '<50'}ms)`
                    : 'Mode Fallback Lokal (Belum Terhubung DB)'}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Code2 className="w-3 h-3" />
                  <span>Prisma ORM v6</span>
                </span>

                {(testResult?.isPooler || serverStatus?.isPooler) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    <span>Pooler Port 6543 Aktif</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {(testResult?.success || serverStatus?.isPostgres)
                  ? `Koneksi aktif ke ${serverStatus?.host || testResult?.host}:${serverStatus?.port || testResult?.port} via Prisma Client. Data tersimpan persisten di cloud.`
                  : `Backend berjalan dalam fallback in-memory. Masukkan DATABASE_URL di Vercel Settings > Environment Variables.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Real-time DB Test Button */}
            <button
              type="button"
              onClick={handleTestDatabase}
              disabled={isTestingDb}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs cursor-pointer"
              title="Uji koneksi langsung dari backend ke database via Prisma"
            >
              <Activity className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
              <span>{isTestingDb ? 'Menguji Koneksi...' : 'Uji Koneksi Database'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Panduan Setup & Prisma</span>
            </button>
          </div>
        </div>

        {/* Live Diagnostics Card (Appears if test performed or error detected) */}
        {(testResult || serverStatus?.lastError || (serverStatus?.warnings && serverStatus.warnings.length > 0)) && (
          <div className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
            (testResult?.success || (serverStatus?.isPostgres && !serverStatus?.lastError))
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                {(testResult?.success || (serverStatus?.isPostgres && !serverStatus?.lastError)) ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Diagnostik: Backend Vercel Berhasil Terkoneksi ke Database via Prisma ORM</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Diagnostik: Database Belum Terkoneksi ke Backend Vercel</span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {testResult?.timestamp ? new Date(testResult.timestamp).toLocaleTimeString('id-ID') : 'Status Terbaru'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
              <div className="p-2 bg-white/80 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 block text-[10px]">ORM & ENGINE</span>
                <span className="font-bold text-indigo-700">Prisma Client (PostgreSQL)</span>
              </div>
              <div className="p-2 bg-white/80 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 block text-[10px]">DATABASE PROVIDER</span>
                <span className="font-bold text-slate-800">{testResult?.provider || serverStatus?.provider || 'Unknown / Not Configured'}</span>
              </div>
              <div className="p-2 bg-white/80 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 block text-[10px]">HOST & PORT</span>
                <span className="font-bold text-slate-800">
                  {testResult?.host || serverStatus?.host || 'belum diatur'} : {testResult?.port || serverStatus?.port || '-'}
                </span>
              </div>
              <div className="p-2 bg-white/80 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 block text-[10px]">STATUS KONEKSI</span>
                <span className={`font-bold ${
                  (testResult?.success || serverStatus?.isPostgres) ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {(testResult?.success || serverStatus?.isPostgres)
                    ? `Aktif (Latensi ${testResult?.pingMs ?? serverStatus?.pingMs ?? 0}ms)`
                    : 'Gagal / In-Memory'}
                </span>
              </div>
            </div>

            {/* Warnings Alert Box */}
            {((testResult?.warnings && testResult.warnings.length > 0) || (serverStatus?.warnings && serverStatus.warnings.length > 0)) && (
              <div className="p-3 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Peringatan Konfigurasi Koneksi:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-800 pl-1">
                  {(testResult?.warnings || serverStatus?.warnings || []).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error detail and guided solution if failed */}
            {(!testResult?.success && (testResult?.error || serverStatus?.lastError)) && (
              <div className="p-3 bg-white rounded-xl border border-amber-300/70 text-slate-700 space-y-2 mt-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900 block font-semibold text-xs">Pesan Teknis Error:</strong>
                    <code className="text-[11px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-mono break-all block mt-1">
                      {testResult?.error || serverStatus?.lastError}
                    </code>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
                  <strong className="text-slate-900 block font-semibold">Langkah Perbaikan Cepat:</strong>
                  
                  {(!testResult?.hasDatabaseUrl && !serverStatus?.hasDatabaseUrl) ? (
                    <div className="text-slate-600 space-y-1">
                      <p>1. Buka <strong>Vercel Project → Settings → Environment Variables</strong>.</p>
                      <p>2. Tambahkan variable <code>DATABASE_URL</code> dengan string Supabase Pooler (Port 6543).</p>
                      <p>3. Klik <strong>Deployments → titik tiga (...) → Redeploy</strong> agar Vercel memuat env baru.</p>
                    </div>
                  ) : (testResult?.port === '5432' || testResult?.isSupabaseDirectV6 || serverStatus?.isSupabaseDirectV6) ? (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                      <p className="text-rose-800 font-semibold">
                        Penyebab Utama Timeout: Supabase Port 5432 menggunakan IPv6 yang diblokir oleh Vercel Serverless Function!
                      </p>
                      <p className="text-slate-700">
                        Ganti connection string di Vercel ke <strong>Supabase Connection Pooler (Port 6543)</strong>:
                      </p>
                      <div className="flex items-center gap-2 bg-slate-900 text-emerald-300 p-2 rounded-lg font-mono text-[11px] overflow-x-auto">
                        <span className="flex-1">postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true', 'pooler_quick')}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans"
                        >
                          {copiedKey === 'pooler_quick' ? 'Tersalin!' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  ) : (testResult?.error?.includes('password') || serverStatus?.lastError?.includes('password') || JSON.stringify(testResult?.warnings || []).includes('YOUR-PASSWORD') || JSON.stringify(testResult?.warnings || []).includes('kurung siku')) ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                      <p className="text-amber-900 font-semibold">
                        Periksa Kata Sandi Database:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li><strong>Hapus kurung siku [ ]:</strong> Pastikan teks <code>[YOUR-PASSWORD]</code> diganti langsung dengan password database asli Anda tanpa tanda <code>[</code> dan <code>]</code>.</li>
                        <li><strong>Karakter Khusus:</strong> Jika password Anda mengandung simbol seperti <code>@</code>, <code>#</code>, <code>$</code>, atau <code>%</code>, ubah menjadi URL-encode (misal <code>@</code> menjadi <code>%40</code>, <code>#</code> menjadi <code>%23</code>).</li>
                        <li><strong>Wajib Redeploy:</strong> Setelah memperbarui nilai di Vercel Settings, buka menu <strong>Deployments &rarr; titik tiga (...) &rarr; Redeploy</strong>.</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-slate-600">
                      Pastikan format DATABASE_URL sesuai: <code>postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require</code> dan lakukan <strong>Redeploy</strong> di Vercel setelah mengubah Environment Variables.
                    </p>
                  )}

                  {/* Recommendations */}
                  {((testResult?.recommendations && testResult.recommendations.length > 0) || (serverStatus?.recommendations && serverStatus.recommendations.length > 0)) && (
                    <div className="pt-1.5">
                      <span className="text-[11px] font-semibold text-indigo-700 block mb-1">Rekomendasi Tambahan:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                        {(testResult?.recommendations || serverStatus?.recommendations || []).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Database Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Rombel Kelas Terdaftar</span>
            <span className="text-base font-extrabold text-slate-900">{displayClassCount} Kelas</span>
            <span className="text-[10px] text-slate-400 block">
              {displayClassCount === 0 ? 'Belum ada rombel' : 'X, XI, XII (11 Jurusan)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Tenaga Guru Terdata</span>
            <span className="text-base font-extrabold text-slate-900">{displayTeacherCount} Guru</span>
            <span className="text-[10px] text-slate-400 block">
              {displayTeacherCount === 0
                ? 'Belum ada guru terdata'
                : `${teachers.filter(t => t.teacher_type === 'guru_bk').length} BK + ${teachers.filter(t => t.teacher_type === 'wali_kelas').length} Wali Mapel`}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Siswa Aktif</span>
            <span className="text-base font-extrabold text-slate-900">{displayStudentCount} Siswa</span>
            <span className="text-[10px] text-slate-400 block">
              {displayStudentCount === 0 ? 'Data siswa di database kosong' : `${displayStudentCount} Siswa terdaftar`}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium block">Status Sinkronisasi</span>
            <span className={`text-base font-extrabold ${serverStatus?.isPostgres ? 'text-emerald-600' : 'text-blue-600'}`}>
              {serverStatus?.isPostgres ? 'Sinkron Cloud' : 'Lokal'}
            </span>
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
                <span className="font-bold text-blue-900 block text-sm">4. Jalankan Seed SQL (Data Admin)</span>
                <p className="text-blue-800">
                  Anda dapat membuka menu <strong>SQL Editor</strong> di Supabase dan menjalankan isi berkas <code className="font-bold">database/seed.sql</code> untuk menginisialisasi akun administrator dan kategori dasar.
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
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{displayStudentCount}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {displayStudentCount === 0 ? 'Data siswa di database kosong' : `Di ${displayClassCount} kelas jurusan`}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Tenaga Pendidik</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{displayTeacherCount}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {displayTeacherCount === 0
                  ? 'Belum ada guru terdata'
                  : `${teachers.filter(t => t.teacher_type === 'guru_bk').length} Guru BK, ${teachers.filter(t => t.teacher_type === 'wali_kelas').length} Wali Kelas`}
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
              <p className="text-3xl font-extrabold text-purple-950 mt-2">{displayReportCount}</p>
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

      {/* Database & Prisma Setup Guide Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Panduan Setup Database & Prisma ORM</h3>
                  <p className="text-xs text-slate-500">Solusi koneksi Vercel Serverless ke Database Supabase / Neon</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setConfigModalTab('vercel')}
                className={`py-3 px-3 border-b-2 transition cursor-pointer ${
                  configModalTab === 'vercel'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Solusi Koneksi Vercel ➔ Supabase
              </button>
              <button
                type="button"
                onClick={() => setConfigModalTab('prisma')}
                className={`py-3 px-3 border-b-2 transition cursor-pointer ${
                  configModalTab === 'prisma'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Skema & Perintah Prisma ORM
              </button>
              <button
                type="button"
                onClick={() => setConfigModalTab('troubleshoot')}
                className={`py-3 px-3 border-b-2 transition cursor-pointer ${
                  configModalTab === 'troubleshoot'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Alternatif (Neon DB)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              {configModalTab === 'vercel' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-1">
                    <strong className="block font-bold">Mengapa Vercel Gagal Konek ke Supabase Port 5432?</strong>
                    <p className="text-[11px] leading-normal text-rose-800">
                      Supabase Direct Connection (port 5432) menggunakan jaringan IPv6 murni. Vercel Serverless Function seringkali tidak mendukung rute IPv6, sehingga memicu <code>connection timeout / ETIMEDOUT</code>. Selain itu, fungsi serverless Vercel membuka koneksi baru setiap pemanggilan sehingga kehabisan slot koneksi database.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <strong className="block font-bold text-slate-900 text-sm">Solusi Resmi: Gunakan Supavisor Connection Pooler (Port 6543)</strong>
                    <p>
                      Buka dashboard Supabase Anda di <strong>Project Settings → Database → Connection String</strong>, lalu pilih mode <strong>Transaction (Pooler, Port 6543)</strong>.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-800">Format DATABASE_URL untuk Vercel:</span>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
                      <span className="text-emerald-400">postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require', 'url_pooler')}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] shrink-0 font-sans cursor-pointer"
                      >
                        {copiedKey === 'url_pooler' ? 'Tersalin!' : 'Salin Format'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900">
                    <strong className="block font-semibold">Penting: Encoding Password Simbol</strong>
                    <p className="text-[11px]">
                      Jika password Anda mengandung simbol seperti <code>@</code>, gantikan dengan <code>%40</code>. Contoh: jika password adalah <code>Rahasia@123</code>, tulis sebagai <code>Rahasia%40123</code>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <strong className="block font-semibold text-slate-900">Langkah Memasukkan ke Vercel:</strong>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                      <li>Buka <strong>vercel.com</strong> → Pilih Project Anda.</li>
                      <li>Masuk ke tab <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
                      <li>Tambahkan Key: <code>DATABASE_URL</code> dengan value connection string pooler di atas.</li>
                      <li>Masuk ke tab <strong>Deployments</strong> → Klik titik tiga (...) pada deployment terbaru → Pilih <strong>Redeploy</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}

              {configModalTab === 'prisma' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-950 space-y-1">
                    <strong className="block font-bold">Rancangan Prisma ORM Telah Diintegrasikan</strong>
                    <p className="text-[11px] leading-normal text-indigo-800">
                      Seluruh skema database telah dipetakan ke <code>prisma/schema.prisma</code> dengan 11 model relasional: <code>User</code>, <code>Student</code>, <code>Teacher</code>, <code>SchoolClass</code>, <code>Category</code>, <code>Report</code>, <code>Message</code>, <code>ReportStatusHistory</code>, <code>Notification</code>, <code>Announcement</code>, <code>MoodCheck</code>.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-800">Konfigurasi Dual Connection String di Prisma:</span>
                    <p className="text-[11px] text-slate-600">
                      Di <code>prisma/schema.prisma</code>, kami menggunakan <code>DATABASE_URL</code> (pooler) untuk kueri runtime aplikasi, dan <code>DIRECT_URL</code> (direct connection port 5432) untuk migrasi DDL.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-slate-800">Perintah CLI Prisma yang Tersedia di Proyek:</span>
                    <div className="space-y-2">
                      <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-slate-400 block text-[10px]"># Menghasilkan Prisma Client TypeScript</span>
                          <span className="text-emerald-400">npx prisma generate</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('npx prisma generate', 'cmd_gen')}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans"
                        >
                          {copiedKey === 'cmd_gen' ? 'Tersalin!' : 'Salin'}
                        </button>
                      </div>

                      <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-slate-400 block text-[10px]"># Sinkronkan skema prisma langsung ke database cloud</span>
                          <span className="text-emerald-400">npx prisma db push</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('npx prisma db push', 'cmd_push')}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans"
                        >
                          {copiedKey === 'cmd_push' ? 'Tersalin!' : 'Salin'}
                        </button>
                      </div>

                      <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-slate-400 block text-[10px]"># Buka GUI Visual Database Prisma Studio</span>
                          <span className="text-emerald-400">npx prisma studio</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('npx prisma studio', 'cmd_studio')}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans"
                        >
                          {copiedKey === 'cmd_studio' ? 'Tersalin!' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                    <strong className="block font-semibold">Otomatisasi Build di Vercel:</strong>
                    <p className="text-[11px]">
                      Script <code>postinstall</code> di <code>package.json</code> telah diatur untuk menjalankan <code>prisma generate</code> secara otomatis saat Vercel melakukan build deployment.
                    </p>
                  </div>
                </div>
              )}

              {configModalTab === 'troubleshoot' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-teal-950 space-y-1">
                    <strong className="block font-bold">Alternatif Terbaik Selain Supabase: Neon Database</strong>
                    <p className="text-[11px] leading-normal text-teal-800">
                      Neon Serverless Postgres (<strong>neon.tech</strong>) dirancang khusus untuk lingkungan Vercel. Neon memiliki connection pooler bawaan yang bekerja 100% tanpa kendala IPv6 atau timeout.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-800">Format DATABASE_URL Neon:</span>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
                      <span className="text-emerald-400">postgresql://user:password@ep-cool-project.us-east-2.aws.neon.tech/neondb?sslmode=require</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('postgresql://[USER]:[PASSWORD]@[ENDPOINT].us-east-2.aws.neon.tech/neondb?sslmode=require', 'neon_url')}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] shrink-0 font-sans cursor-pointer"
                      >
                        {copiedKey === 'neon_url' ? 'Tersalin!' : 'Salin'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <strong className="block font-semibold text-slate-900">Cara Setup Neon dalam 2 Menit:</strong>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                      <li>Buka <strong>https://neon.tech</strong> dan daftar akun gratis.</li>
                      <li>Buat project baru (misal: <code>sapa-school-db</code>).</li>
                      <li>Salin connection string yang disediakan Neon.</li>
                      <li>Tempel ke variabel <code>DATABASE_URL</code> di Vercel Settings.</li>
                      <li>Jalankan <code>npx prisma db push</code> atau gunakan tombol <strong>Terapkan Master Data</strong> di panel admin ini.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
