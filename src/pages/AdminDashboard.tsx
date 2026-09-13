import React, { useState, useEffect } from 'react';
import {
  Users,
  Layers,
  Database,
  RefreshCw,
  CheckCircle,
  BarChart3,
  Shield,
  MessageCircle,
  Clock,
  Sparkles,
  FileText,
  ArrowRight,
  Download
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

  // Keep internal subTab synchronized with global routing
  useEffect(() => {
    setSubTab(activeSubTab);
  }, [activeSubTab]);

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

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menyinkronkan ulang database ke dataset master sekolah?')) {
      db.resetToDefaults();
      handleRefresh();
      setResetMessage('Database berhasil disinkronkan ke dataset master sekolah.');
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
            title="Unduh seluruh data pengguna (108 Siswa, 10 Guru BK, 3 Wali Kelas, 2 Admin) lengkap dengan username & kata sandi"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </a>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Sinkronisasi Master Data</span>
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{resetMessage}</span>
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
