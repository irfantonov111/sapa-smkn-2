import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Clock,
  Activity,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { EnrichedReport, BkTeacherProfile, Announcement } from '../types/database';
import { CategoryIcon, StatusBadge, UrgencyBadge, PrivacyBadge } from '../components/StatusBadges';
import { StatusTimeline } from '../components/StatusTimeline';
import { BkTeachersDashboardSection } from '../components/BkTeacherComponents';
import { StudentMoodCheckCard } from '../components/StudentMoodCheckCard';

interface StudentDashboardProps {
  onNavigate: (tab: string, reportId?: string, extraParam?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, studentProfile } = useAuth();
  const [reports, setReports] = useState<EnrichedReport[]>([]);
  const [bkTeachers, setBkTeachers] = useState<BkTeacherProfile[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (currentUser) {
      const list = db.getReports(currentUser);
      setReports(list);
      const teachers = db.getBkTeachers();
      setBkTeachers(teachers);
      const annList = db.getAnnouncements(currentUser);
      setAnnouncements(annList);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const unreadAnnouncementsCount = db.getUnreadAnnouncementsCount(currentUser);
  const latestAnnouncement = announcements[0];

  // Stats calculation
  const totalReports = reports.length;
  const waitingResponse = reports.filter(r => r.status === 'terkirim' || r.status === 'dibaca').length;
  const inProgress = reports.filter(r => r.status === 'direspons' || r.status === 'ditindaklanjuti').length;
  const resolved = reports.filter(r => r.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
              Dashboard Siswa • {studentProfile?.class_info?.name || 'SMK'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Selamat datang, {currentUser.name} 👋
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-xl">
              Jangan ragu untuk menyampaikan hal yang mengganggumu. Guru BK dan Wali Kelas selalu siap mendengarkan dan mendukungmu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition flex items-center gap-2 shrink-0 group"
          >
            <PlusCircle className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform duration-200" />
            <span>Tulis Laporan Baru</span>
          </button>
        </div>
      </div>

      {/* Announcements Quick Banner */}
      {latestAnnouncement && (
        <div
          onClick={() => onNavigate('announcements')}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Megaphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Pengumuman Terbaru
                </span>
                {unreadAnnouncementsCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    {unreadAnnouncementsCount} Belum Dibaca
                  </span>
                )}
                <span className="text-[11px] text-slate-500">
                  oleh {latestAnnouncement.author_name} ({latestAnnouncement.author_role})
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                {latestAnnouncement.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-1">
                {latestAnnouncement.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-800 shrink-0 self-end sm:self-center">
            <span>Buka Pengumuman</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* Absensi Mood Check Siswa Harian */}
      <StudentMoodCheckCard />

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Laporan</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalReports}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Semua laporan yang kamu buat</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">Menunggu Respons</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{waitingResponse}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Terkirim / sedang dibaca guru</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600">Sedang Ditindaklanjuti</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{inProgress}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Direspons & proses bimbingan</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{resolved}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Terselesaikan dengan baik</span>
        </div>
      </div>

      {/* Available BK Teachers Selection Section */}
      <BkTeachersDashboardSection
        teachers={bkTeachers}
        classBkTeacherId={studentProfile?.class_info?.bk_teacher_id}
        className={studentProfile?.class_info?.name}
        onSelectTeacherForReport={(teacherUserId) => {
          onNavigate('create', undefined, teacherUserId);
        }}
      />

      {/* Active Reports List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Laporan Saya</h2>
            <p className="text-xs text-slate-500">Pantau status tindak lanjut laporanmu di sini</p>
          </div>

          {reports.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('my-reports')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Belum Ada Laporan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Kamu belum pernah mengirimkan laporan. Jika menghadapi kendala apapun, kami siap mendengarkanmu.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition"
            >
              + Sampaikan Sesuatu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {reports.slice(0, 5).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onNavigate('detail', rep.id)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <CategoryIcon iconName={rep.category.icon} color={rep.category.color} />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {rep.report_code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {rep.category.name}
                      </span>
                      <UrgencyBadge urgency={rep.urgency} />
                      <PrivacyBadge privacy={rep.privacy} />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rep.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>
                        Ditujukan: <strong className="text-slate-600">{rep.assigned_teacher?.specific_name ? `${rep.assigned_teacher.specific_name} (${rep.assigned_teacher.role_label})` : rep.assigned_teacher?.role_label}</strong>
                      </span>
                      <span>•</span>
                      <span>{new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {rep.messages_count > 1 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <MessageSquare className="w-3 h-3" />
                            {rep.messages_count} pesan
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <StatusBadge status={rep.status} />

                  <button
                    type="button"
                    className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
