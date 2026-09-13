import React, { useState } from 'react';
import { Bell, CheckCheck, FileText, ChevronRight, Inbox, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

interface NotificationsPageProps {
  onNavigate: (tab: string, reportId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [tick, setTick] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  React.useEffect(() => {
    const handleNotifChange = () => setTick(t => t + 1);
    window.addEventListener('advocare_notif_change', handleNotifChange);
    return () => window.removeEventListener('advocare_notif_change', handleNotifChange);
  }, []);

  if (!currentUser) return null;

  const allNotifs = db.getNotifications(currentUser.id);
  const unreadCount = db.getUnreadNotificationCount(currentUser.id);

  const displayedNotifs = filter === 'unread'
    ? allNotifs.filter(n => !n.is_read)
    : allNotifs;

  const handleOpenNotif = (notifId: string, reportId: string) => {
    db.markNotificationAsRead(notifId);
    setTick(t => t + 1);
    onNavigate('detail', reportId);
  };

  const handleMarkAllRead = () => {
    db.markAllNotificationsAsRead(currentUser.id);
    setTick(t => t + 1);
  };

  const handleExecuteClearAll = () => {
    db.clearAllNotifications(currentUser.id);
    setShowClearConfirm(false);
    setClearedNotice(true);
    setTick(t => t + 1);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  const handleDeleteSingle = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    db.deleteNotification(notifId);
    setTick(t => t + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifikasi Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pemberitahuan resmi terkait perkembangan laporan dan pesan bimbingan
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Tandai Semua Dibaca ({unreadCount})</span>
            </button>
          )}

          {allNotifs.length > 0 && (
            showClearConfirm ? (
              <div className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-300 rounded-xl">
                <span className="text-xs text-rose-800 font-semibold px-2">Hapus semua?</span>
                <button
                  type="button"
                  onClick={handleExecuteClearAll}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
                >
                  Ya, Bersihkan
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-100 transition"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Bersihkan Semua</span>
              </button>
            )
          )}
        </div>
      </div>

      {clearedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Semua riwayat notifikasi Anda telah berhasil dibersihkan.</span>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua ({allNotifs.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'unread'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Belum Dibaca ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {displayedNotifs.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">Tidak Ada Notifikasi</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {filter === 'unread' ? 'Semua notifikasi sudah kamu baca.' : 'Belum ada notifikasi baru untuk akunmu.'}
            </p>
          </div>
        ) : (
          displayedNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleOpenNotif(n.id, n.report_id)}
              className={`p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 hover:bg-slate-50/80 cursor-pointer transition group relative ${
                !n.is_read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  !n.is_read ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h4 className={`text-xs sm:text-sm leading-snug break-words ${!n.is_read ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">
                    {new Date(n.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                  {n.message}
                </p>

                <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-blue-600">
                  <span>Buka detail laporan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Individual delete action */}
              <button
                type="button"
                onClick={(e) => handleDeleteSingle(e, n.id)}
                title="Hapus notifikasi ini"
                className="p-2 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition shrink-0 -mr-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
