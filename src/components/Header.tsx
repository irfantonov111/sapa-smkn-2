import React, { useState } from 'react';
import {
  Shield,
  Bell,
  User,
  LogOut,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

interface HeaderProps {
  currentTab?: string;
  activeTab?: string;
  onNavigate: (tab: string, reportId?: string) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, activeTab, onNavigate, onOpenMobileMenu }) => {
  const { currentUser, studentProfile, teacherProfile, quickLoginAs, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [, setNotifTick] = useState(0);

  React.useEffect(() => {
    const handleNotifChange = () => setNotifTick(t => t + 1);
    window.addEventListener('advocare_notif_change', handleNotifChange);
    return () => window.removeEventListener('advocare_notif_change', handleNotifChange);
  }, []);

  const notifications = currentUser ? db.getNotifications(currentUser.id) : [];
  const unreadCount = currentUser ? db.getUnreadNotificationCount(currentUser.id) : 0;

  const getRoleLabel = () => {
    if (!currentUser) return 'Tamu';
    if (currentUser.role === 'admin') return 'Admin Sekolah';
    if (currentUser.role === 'guru') {
      return teacherProfile?.teacher_type === 'guru_bk' ? 'Guru BK' : 'Wali Kelas';
    }
    return studentProfile?.class_info ? `Siswa - ${studentProfile.class_info.name}` : 'Siswa';
  };

  const getRoleBadgeColor = () => {
    if (!currentUser) return 'bg-slate-100 text-slate-700';
    if (currentUser.role === 'admin') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (currentUser.role === 'guru') {
      return teacherProfile?.teacher_type === 'guru_bk'
        ? 'bg-blue-100 text-blue-800 border-blue-200'
        : 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                SA<span className="text-blue-600">PA</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                SMK
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
              Sarana Pendampingan dan Asistensi Siswa
            </p>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
                  title="Notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notif Dropdown */}
                {showNotifMenu && (
                  <>
                    {/* Mobile Backdrop */}
                    <div
                      className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs sm:hidden"
                      onClick={() => setShowNotifMenu(false)}
                    />

                    <div className="fixed inset-x-3 top-16 max-h-[82vh] sm:max-h-[32rem] sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl sm:shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 sm:zoom-in-100 duration-150 flex flex-col overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-white">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800">Notifikasi Terkini</h4>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                db.markAllNotificationsAsRead(currentUser.id);
                                setShowNotifMenu(false);
                              }}
                              className="text-[11px] text-blue-600 hover:underline font-semibold"
                            >
                              Tandai dibaca
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                db.clearAllNotifications(currentUser.id);
                                setShowNotifMenu(false);
                              }}
                              className="text-[11px] text-rose-500 hover:underline font-semibold"
                            >
                              Bersihkan
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowNotifMenu(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 sm:hidden"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="overflow-y-auto divide-y divide-slate-50 flex-1 max-h-[60vh] sm:max-h-72">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            Belum ada notifikasi baru.
                          </div>
                        ) : (
                          notifications.slice(0, 8).map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                db.markNotificationAsRead(n.id);
                                setShowNotifMenu(false);
                                onNavigate('detail', n.report_id);
                              }}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex gap-3 ${
                                !n.is_read ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-blue-600" style={{ opacity: n.is_read ? 0.2 : 1 }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 break-words">{n.title}</p>
                                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 break-words">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setShowNotifMenu(false);
                            onNavigate('notifications');
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                        >
                          Lihat Semua Notifikasi ({notifications.length})
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-1">{currentUser.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeColor()}`}>
                      {getRoleLabel()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showRoleMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-slate-900/30 sm:hidden"
                      onClick={() => setShowRoleMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getRoleBadgeColor()}`}>
                            {getRoleLabel()}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowRoleMenu(false);
                            onNavigate('profile');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profil & Pengaturan Akun
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowRoleMenu(false);
                              onNavigate('admin');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-medium"
                          >
                            <ShieldAlert className="w-4 h-4 text-purple-600" />
                            Panel Database & Admin
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowRoleMenu(false);
                            logout();
                            onNavigate('landing');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar (Logout)
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition flex items-center justify-center border border-slate-200 shadow-2xs"
                title="Buka Semua Menu"
                aria-label="Buka Semua Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition cursor-pointer"
              >
                Masuk ke Sistem
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
