import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  Inbox,
  Clock,
  CheckCircle2,
  Database,
  Users,
  Layers,
  Megaphone,
  Menu,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

interface NavigationProps {
  currentTab?: string;
  activeTab?: string;
  onNavigate: (tab: string) => void;
  onOpenMobileMenu?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, activeTab, onNavigate, onOpenMobileMenu }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const currentActive = activeTab || currentTab || 'dashboard';
  const unreadNotifs = db.getUnreadNotificationCount(currentUser.id);
  const unreadAnnouncements = currentUser.role === 'siswa' ? db.getUnreadAnnouncementsCount(currentUser) : 0;

  let navItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [];

  if (currentUser.role === 'siswa') {
    // Menu Profil dihilangkan dari tab navigasi siswa karena sudah dapat diakses via profil di samping pojok atas
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'my-reports', label: 'Laporan Saya', icon: FileText },
      { id: 'announcements', label: 'Pengumuman', icon: Megaphone, badge: unreadAnnouncements },
      { id: 'notifications', label: 'Notifikasi', icon: Bell, badge: unreadNotifs }
    ];
  } else if (currentUser.role === 'guru') {
    // Menu profil dihilangkan untuk guru karena sudah dapat diakses melalui menu profil pojok kanan atas
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'inbox', label: 'Laporan Masuk', icon: Inbox },
      { id: 'mood-check', label: 'Rekap Mood Siswa', icon: HeartHandshake },
      { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
      { id: 'notifications', label: 'Notifikasi', icon: Bell, badge: unreadNotifs }
    ];
  } else if (currentUser.role === 'admin') {
    const totalReports = db.getReports(currentUser).length;
    navItems = [
      { id: 'admin', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'admin-reports', label: 'Kelola Laporan', icon: FileText, badge: totalReports },
      { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
      { id: 'admin-users', label: 'Kelola Pengguna', icon: Users },
      { id: 'admin-categories', label: 'Kategori', icon: Layers },
      { id: 'profile', label: 'Profil', icon: User }
    ];
  }

  return (
    <>
      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:block bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;
              const isCreateAction = item.id === 'create';

              // We render create action specifically on the right side
              if (isCreateAction) return null;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap relative ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1.5 py-1 flex items-center justify-around shadow-lg">
        {currentUser.role === 'siswa' ? (
          <>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('my-reports')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'my-reports' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Laporan</span>
            </button>

            {/* Elevated Center Button for Siswa */}
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="flex flex-col items-center justify-center -mt-4 px-1 group"
            >
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 ring-4 ring-white group-active:scale-95 transition">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-blue-700 mt-0.5">Lapor</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('announcements')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'announcements' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Megaphone className="w-5 h-5" />
                {unreadAnnouncements > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                    {unreadAnnouncements}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Info</span>
            </button>

            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="flex-1 py-1.5 flex flex-col items-center justify-center relative transition text-slate-500 hover:text-blue-600"
            >
              <div className="relative">
                <Menu className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
            </button>
          </>
        ) : currentUser.role === 'guru' ? (
          <>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('inbox')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'inbox' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Laporan</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('announcements')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'announcements' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Megaphone className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Pengumuman</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'notifications' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                    {unreadNotifs}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Notifikasi</span>
            </button>

            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="flex-1 py-1.5 flex flex-col items-center justify-center relative transition text-slate-500 hover:text-blue-600"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
            </button>
          </>
        ) : (
          /* Role: Admin */
          <>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'admin' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin-reports')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'admin-reports' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Laporan</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('announcements')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'announcements' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Megaphone className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Pengumuman</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin-users')}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative transition ${
                currentActive === 'admin-users' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">Pengguna</span>
            </button>

            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="flex-1 py-1.5 flex flex-col items-center justify-center relative transition text-slate-500 hover:text-blue-600"
            >
              <div className="relative">
                <Menu className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
