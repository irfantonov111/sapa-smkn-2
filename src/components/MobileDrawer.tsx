import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  Inbox,
  Database,
  Users,
  Layers,
  Megaphone,
  X,
  LogOut,
  ChevronRight,
  Shield,
  Sparkles,
  HeartHandshake,
  CalendarDays,
  School
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { getDefaultAvatarByGender } from '../utils/avatar2d';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: string, reportId?: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
}) => {
  const { currentUser, studentProfile, teacherProfile, logout } = useAuth();

  if (!isOpen || !currentUser) return null;

  const unreadNotifs = db.getUnreadNotificationCount(currentUser.id);
  const unreadAnnouncements = currentUser.role === 'siswa' ? db.getUnreadAnnouncementsCount(currentUser) : 0;
  const totalReports = db.getReports(currentUser).length;

  const getRoleLabel = () => {
    if (currentUser.role === 'admin') return 'Admin Sekolah';
    if (currentUser.role === 'guru') {
      return teacherProfile?.teacher_type === 'guru_bk' ? 'Guru Bimbingan Konseling (BK)' : `Wali Kelas ${teacherProfile?.managed_class?.name || ''}`;
    }
    return studentProfile?.class_info ? `Siswa • ${studentProfile.class_info.name}` : 'Siswa';
  };

  const getRoleBadgeColor = () => {
    if (currentUser.role === 'admin') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (currentUser.role === 'guru') {
      return teacherProfile?.teacher_type === 'guru_bk'
        ? 'bg-blue-100 text-blue-800 border-blue-200'
        : 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const handleItemClick = (tabId: string) => {
    onClose();
    onNavigate(tabId);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200 border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                SAPA <span className="text-blue-600 text-xs font-bold">SMK</span>
              </span>
              <p className="text-[10px] text-slate-500">Semua Menu Aplikasi</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || getDefaultAvatarByGender(currentUser.role, currentUser.gender)}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              <div className="mt-1">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
            Menu Utama
          </p>

          {/* Role: Siswa */}
          {currentUser.role === 'siswa' && (
            <>
              <button
                type="button"
                onClick={() => handleItemClick('dashboard')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Siswa</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('create')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition border ${
                  activeTab === 'create'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Buat Laporan Baru (Lapor)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                  Kirim
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('my-reports')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'my-reports'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Laporan Saya</span>
                </div>
                {totalReports > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'my-reports' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {totalReports}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('announcements')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'announcements'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="w-4 h-4" />
                  <span>Pengumuman Sekolah</span>
                </div>
                {unreadAnnouncements > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadAnnouncements} baru
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('notifications')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'notifications'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi Saya</span>
                </div>
                {unreadNotifs > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Role: Guru (Guru BK & Wali Kelas) */}
          {currentUser.role === 'guru' && (
            <>
              <button
                type="button"
                onClick={() => handleItemClick('dashboard')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Guru</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('inbox')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'inbox'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  <span>Laporan Masuk</span>
                </div>
                {totalReports > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'inbox' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {totalReports}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('counseling')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'counseling'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-indigo-500" />
                  <span>Jadwal Konseling</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'counseling' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('mood-check')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'mood-check'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HeartHandshake className="w-4 h-4 text-pink-500" />
                  <span>Rekap Mood Siswa</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'mood-check' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('announcements')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'announcements'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="w-4 h-4" />
                  <span>Pengumuman Sekolah</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'announcements' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('notifications')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'notifications'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi</span>
                </div>
                {unreadNotifs > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Role: Admin */}
          {currentUser.role === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => handleItemClick('admin')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Admin</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('admin-reports')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'admin-reports'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Kelola Laporan</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'admin-reports' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {totalReports}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('announcements')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'announcements'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="w-4 h-4" />
                  <span>Pengumuman Sekolah</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'announcements' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('admin-users')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'admin-users'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Kelola Pengguna</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'admin-users' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('admin-classes')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'admin-classes'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <School className="w-4 h-4" />
                  <span>Kelola Kelas</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'admin-classes' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('admin-categories')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'admin-categories'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4" />
                  <span>Kategori Pengaduan</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'admin-categories' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('notifications')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'notifications'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi</span>
                </div>
                {unreadNotifs > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('profile')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Profil Admin</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`} />
              </button>
            </>
          )}
        </div>

        {/* Drawer Footer: Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
              onNavigate('landing');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
