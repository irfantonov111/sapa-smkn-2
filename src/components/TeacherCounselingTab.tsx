import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Check,
  RotateCcw,
  X,
  MapPin,
  CalendarCheck,
  CalendarClock,
  Inbox,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import {
  CounselingAppointment,
  CounselingAppointmentStatus,
  CounselingType
} from '../types/database';

export const TeacherCounselingTab: React.FC = () => {
  const { currentUser, teacherProfile } = useAuth();
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'jadwal_terdekat'>('terbaru');

  // Modals
  const [acceptModalApt, setAcceptModalApt] = useState<CounselingAppointment | null>(null);
  const [acceptNotes, setAcceptNotes] = useState('');

  const [rescheduleModalApt, setRescheduleModalApt] = useState<CounselingAppointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const [completeModalApt, setCompleteModalApt] = useState<CounselingAppointment | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const teacherRecord = currentUser ? db.getTeacherByUserId(currentUser.id) : null;
  const currentTeacherId = teacherProfile?.id || teacherRecord?.id;
  const currentUserId = currentUser?.id || teacherProfile?.user_id || teacherRecord?.user_id;

  const isAssignedToMe = (apt: CounselingAppointment) => {
    if (!currentTeacherId && !currentUserId) return false;
    return (
      (currentTeacherId && apt.teacher_id === currentTeacherId) ||
      (currentUserId && apt.teacher_user_id === currentUserId) ||
      (currentTeacherId && apt.teacher_id === currentUserId) ||
      (currentUser?.name && apt.teacher_name && apt.teacher_name.toLowerCase() === currentUser.name.toLowerCase())
    );
  };

  const loadData = () => {
    const list = db.getCounselingAppointments({
      teacher_id: currentTeacherId,
      teacher_user_id: currentUserId
    });
    // Strict privacy boundary: only appointments assigned to this logged-in teacher
    setAppointments(list.filter(isAssignedToMe));
  };

  useEffect(() => {
    loadData();
    db.fetchCounselingAppointments().then(() => loadData());
    const unsub = db.subscribe(() => {
      loadData();
      setRefreshTick(t => t + 1);
    });
    return () => unsub();
  }, [currentTeacherId, currentUserId]);

  // Metrics (strictly for this teacher's appointments)
  const pendingCount = appointments.filter(a => a.status === 'menunggu').length;
  const approvedCount = appointments.filter(a => a.status === 'disetujui' || a.status === 'dijadwalkan_ulang').length;
  const completedCount = appointments.filter(a => a.status === 'selesai').length;
  const totalCount = appointments.length;

  const filteredAppointments = useMemo(() => {
    const list = appointments.filter(apt => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchStudent = apt.student_name.toLowerCase().includes(q);
        const matchClass = (apt.student_class_name || '').toLowerCase().includes(q);
        const matchTopic = apt.topic.toLowerCase().includes(q);
        if (!matchStudent && !matchClass && !matchTopic) return false;
      }

      return true;
    });

    const getScheduledTimestamp = (apt: CounselingAppointment) => {
      const d = apt.confirmed_date || apt.requested_date;
      const t = apt.confirmed_time || apt.requested_time || '00:00';
      const parsed = new Date(`${d}T${t}:00`).getTime();
      return isNaN(parsed) ? 0 : parsed;
    };

    if (sortBy === 'terbaru') {
      // Diajukan terbaru (created_at descending)
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'terlama') {
      // Diajukan terlama (created_at ascending)
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'jadwal_terdekat') {
      // Jadwal paling dekat ke waktu sekarang
      const now = Date.now();
      list.sort((a, b) => {
        const timeA = getScheduledTimestamp(a);
        const timeB = getScheduledTimestamp(b);
        const isUpcomingA = timeA >= now - 1000 * 60 * 60 * 24;
        const isUpcomingB = timeB >= now - 1000 * 60 * 60 * 24;

        if (isUpcomingA && !isUpcomingB) return -1;
        if (!isUpcomingA && isUpcomingB) return 1;
        if (isUpcomingA && isUpcomingB) return timeA - timeB;
        return timeB - timeA;
      });
    }

    return list;
  }, [appointments, statusFilter, searchQuery, sortBy]);

  // Handlers
  const handleOpenAccept = (apt: CounselingAppointment) => {
    setAcceptModalApt(apt);
    setAcceptNotes(
      apt.counseling_type === 'tatap_muka'
        ? 'Disetujui. Silakan hadir di Ruang BK sesuai jadwal yang disepakati.'
        : 'Disetujui. Sesi konseling daring akan dibuka pada jam tersebut.'
    );
  };

  const handleConfirmAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptModalApt || !currentUser) return;
    setIsProcessing(true);
    try {
      db.acceptCounselingAppointment(acceptModalApt.id, currentUser, acceptNotes.trim() || undefined);
      setFeedback({
        type: 'success',
        message: `Janji konseling dengan ${acceptModalApt.student_name} berhasil disetujui.`
      });
      setAcceptModalApt(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Gagal menyetujui janji konseling.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleOpenReschedule = (apt: CounselingAppointment) => {
    setRescheduleModalApt(apt);
    setNewDate(apt.requested_date);
    setNewTime(apt.requested_time);
    setRescheduleReason('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt || !currentUser) return;
    if (!newDate || !newTime || !rescheduleReason.trim()) {
      alert('Mohon lengkapi tanggal baru, jam baru, dan alasan penyesuaian jadwal.');
      return;
    }

    setIsProcessing(true);
    try {
      db.rescheduleCounselingAppointment(
        rescheduleModalApt.id,
        currentUser,
        newDate,
        newTime,
        rescheduleReason.trim()
      );
      setFeedback({
        type: 'success',
        message: `Jadwal konseling ${rescheduleModalApt.student_name} disesuaikan ke ${newDate} jam ${newTime}. Notifikasi telah dikirimkan ke siswa.`
      });
      setRescheduleModalApt(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Gagal menjadwalkan ulang konseling.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleOpenComplete = (apt: CounselingAppointment) => {
    setCompleteModalApt(apt);
    setCompletionNotes('');
  };

  const handleConfirmComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeModalApt || !currentUser) return;
    setIsProcessing(true);
    try {
      db.completeCounselingAppointment(completeModalApt.id, currentUser, completionNotes.trim() || undefined);
      setFeedback({
        type: 'success',
        message: `Sesi konseling bersama ${completeModalApt.student_name} telah ditandai selesai.`
      });
      setCompleteModalApt(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Gagal menyelesaikan janji konseling.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const getStatusBadge = (status: CounselingAppointmentStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Persetujuan
          </span>
        );
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Jadwal Disetujui
          </span>
        );
      case 'dijadwalkan_ulang':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CalendarClock className="w-3 h-3 text-blue-600" />
            Dijadwalkan Ulang
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Check className="w-3 h-3 text-slate-500" />
            Selesai Dilaksanakan
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'menunggu' ? 'all' : 'menunggu')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'menunggu'
              ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Menunggu Persetujuan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{pendingCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Perlu konfirmasi Guru BK</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'disetujui' ? 'all' : 'disetujui')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'disetujui'
              ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Jadwal Disetujui</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{approvedCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Sesi aktif terjadwal</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'selesai' ? 'all' : 'selesai')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'selesai'
              ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">Telah Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{completedCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Sesi konseling tuntas</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-50 border-slate-300 ring-2 ring-slate-400'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Semua Permohonan</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Total rekapitulasi</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Sorting Filters */}
          <div className="flex items-center flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-500 px-2 py-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Urutkan:</span>
            </span>

            <button
              type="button"
              onClick={() => setSortBy('terbaru')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                sortBy === 'terbaru'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Terbaru</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy('terlama')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                sortBy === 'terlama'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Terlama</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy('jadwal_terdekat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                sortBy === 'jadwal_terdekat'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Jadwal Paling Dekat</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, kelas, atau topik..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* List of Appointments */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Tidak ada jadwal konseling</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Tidak ada permohonan konseling yang sesuai dengan filter pencarian aktif.'
                : 'Belum ada siswa yang mengajukan jadwal konseling bimbingan.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((apt) => {
              const assignedToMe = isAssignedToMe(apt);

              return (
                <div
                  key={apt.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 ${
                    assignedToMe
                      ? 'bg-indigo-50/20 border-indigo-200 hover:border-indigo-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                        {apt.student_name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {apt.student_name}
                          </h4>
                          {apt.student_class_name && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {apt.student_class_name}
                            </span>
                          )}
                          {assignedToMe && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                              Ditujukan ke Anda
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            {apt.status === 'dijadwalkan_ulang' && apt.rescheduled_date
                              ? `Jadwal Baru: ${apt.rescheduled_date}`
                              : apt.requested_date}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            {apt.status === 'dijadwalkan_ulang' && apt.rescheduled_time
                              ? `Jam ${apt.rescheduled_time} WIB`
                              : `Jam ${apt.requested_time} WIB`}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {apt.counseling_type === 'tatap_muka' ? '🏛️ Tatap Muka Ruang BK' : '💬 Daring / Online'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>

                  {/* Topic and Notes */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        Topik Konseling yang Diajukan:
                      </span>
                      <p className="text-slate-800 mt-0.5">{apt.topic}</p>
                    </div>

                    {apt.reschedule_reason && (
                      <div className="pt-2 border-t border-slate-100 text-blue-900 bg-blue-50/50 p-2 rounded-lg">
                        <strong className="block font-bold text-[11px]">Alasan Penyesuaian Jadwal:</strong>
                        <p className="mt-0.5 text-slate-700">{apt.reschedule_reason}</p>
                      </div>
                    )}

                    {apt.notes && (
                      <div className="pt-2 border-t border-slate-100 text-emerald-900 bg-emerald-50/50 p-2 rounded-lg">
                        <strong className="block font-bold text-[11px]">Catatan Tindak Lanjut Guru BK:</strong>
                        <p className="mt-0.5 text-slate-700">{apt.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400">
                      Guru BK Tujuan: <strong>{apt.teacher_name || 'Guru BK'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {apt.status === 'menunggu' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenAccept(apt)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setujui Jadwal</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReschedule(apt)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>Jadwalkan Ulang</span>
                          </button>
                        </>
                      )}

                      {(apt.status === 'disetujui' || apt.status === 'dijadwalkan_ulang') && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenComplete(apt)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Tandai Selesai</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReschedule(apt)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CalendarClock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Ubah Jadwal</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Setujui Janji Konseling */}
      {acceptModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Konfirmasi Jadwal Konseling</h3>
                  <p className="text-[11px] text-slate-500">Siswa: {acceptModalApt.student_name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAcceptModalApt(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAccept} className="p-5 space-y-4">
              <div className="text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <p>
                  <strong>Waktu:</strong> {acceptModalApt.requested_date} • Jam {acceptModalApt.requested_time} WIB
                </p>
                <p>
                  <strong>Bentuk:</strong> {acceptModalApt.counseling_type === 'tatap_muka' ? 'Tatap Muka di Ruang BK' : 'Konseling Daring'}
                </p>
                <p className="text-slate-600 italic mt-1">"{acceptModalApt.topic}"</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Arahan untuk Siswa (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={acceptNotes}
                  onChange={(e) => setAcceptNotes(e.target.value)}
                  placeholder="Contoh: Ditunggu tepat waktu di Ruang BK Lantai 2..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAcceptModalApt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  {isProcessing ? 'Menyimpan...' : 'Setujui & Kirim Notifikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Jadwalkan Ulang Konseling */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Jadwalkan Ulang Konseling</h3>
                  <p className="text-[11px] text-slate-500">Siswa: {rescheduleModalApt.student_name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleModalApt(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Baru:
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Baru:
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Contoh: 10:15 WIB"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Penyesuaian Jadwal (Wajib):
                </label>
                <textarea
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Contoh: Ada rapat dinas pada jam tersebut, dimajukan ke jam istirahat pertama..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20"
                >
                  {isProcessing ? 'Menyimpan...' : 'Perbarui Jadwal & Kabari Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tandai Selesai Konseling */}
      {completeModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Selesaikan Sesi Konseling</h3>
                  <p className="text-[11px] text-slate-500">Siswa: {completeModalApt.student_name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompleteModalApt(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmComplete} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Konseling / Solusi yang Disepakati (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Contoh: Siswa telah diberikan pemahaman terkait manajemen waktu dan disepakati evaluasi 2 minggu ke depan..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCompleteModalApt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-700/20"
                >
                  {isProcessing ? 'Menyimpan...' : 'Tandai Selesai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
