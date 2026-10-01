import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
  Printer,
  Eye,
  X,
  CalendarDays,
  Search,
  UserCheck,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import {
  CounselingAppointment,
  CounselingAppointmentStatus,
  CounselingType,
  BkTeacherProfile
} from '../types/database';
import { PrintCounselingModal } from '../components/PrintCounselingModal';

interface StudentCounselingPageProps {
  onNavigate?: (tab: string, id?: string) => void;
}

export const StudentCounselingPage: React.FC<StudentCounselingPageProps> = () => {
  const { currentUser, studentProfile } = useAuth();
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [bkTeachers, setBkTeachers] = useState<BkTeacherProfile[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [detailAppointment, setDetailAppointment] = useState<CounselingAppointment | null>(null);
  const [printingAppointment, setPrintingAppointment] = useState<CounselingAppointment | null>(null);

  // Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [requestedDate, setRequestedDate] = useState<string>('');
  const [requestedTime, setRequestedTime] = useState<string>('10:15');
  const [counselingType, setCounselingType] = useState<CounselingType>('tatap_muka');
  const [topic, setTopic] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const list = db.getCounselingAppointments({ student_user_id: currentUser.id });
    setAppointments(list);
    const teachers = db.getBkTeachers().filter(t => t.is_active !== false);
    setBkTeachers(teachers);

    const classBkId = studentProfile?.class_info?.bk_teacher_id;
    if (classBkId && !selectedTeacherId) {
      setSelectedTeacherId(classBkId);
    } else if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].teacher_id);
    }
  };

  useEffect(() => {
    loadData();
    db.syncFromBackend().then(loadData);

    const unsub = db.subscribe(() => {
      loadData();
    });

    const interval = setInterval(async () => {
      await db.syncFromBackend();
      loadData();
    }, 4000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [currentUser, studentProfile]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setRequestedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Keep detail modal synced if data updates
  useEffect(() => {
    if (detailAppointment) {
      const updated = appointments.find(a => a.id === detailAppointment.id);
      if (updated) setDetailAppointment(updated);
    }
  }, [appointments]);

  if (!currentUser || currentUser.role !== 'siswa') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      setFormError('Silakan pilih Guru BK tujuan.');
      return;
    }
    if (!requestedDate) {
      setFormError('Silakan tentukan tanggal sesi konseling.');
      return;
    }
    if (!requestedTime) {
      setFormError('Silakan pilih perkiraan jam konseling.');
      return;
    }
    if (!topic.trim()) {
      setFormError('Mohon tuliskan topik atau hal yang ingin kamu konsultasikan.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      db.createCounselingAppointment(currentUser, {
        teacher_id: selectedTeacherId,
        requested_date: requestedDate,
        requested_time: requestedTime,
        topic: topic.trim(),
        counseling_type: counselingType
      });

      setSubmitSuccess('Pengajuan jadwal konseling berhasil dikirimkan ke Guru BK!');
      setTopic('');
      loadData();
      setTimeout(() => {
        setSubmitSuccess(null);
        setShowCreateModal(false);
      }, 1200);
    } catch (err: any) {
      setFormError(err?.message || 'Gagal mengajukan janji konseling.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: CounselingAppointmentStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Konfirmasi
          </span>
        );
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Jadwal Disetujui
          </span>
        );
      case 'dijadwalkan_ulang':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
            <Calendar className="w-3 h-3 text-blue-600" />
            Dijadwalkan Ulang
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Selesai Dilaksanakan
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateIndo = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'active') {
      if (apt.status !== 'menunggu' && apt.status !== 'disetujui' && apt.status !== 'dijadwalkan_ulang') return false;
    } else if (filterStatus !== 'all' && apt.status !== filterStatus) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTeacher = (apt.teacher_name || '').toLowerCase().includes(q);
      const matchTopic = (apt.topic || '').toLowerCase().includes(q);
      const matchDate = (apt.requested_date || '').toLowerCase().includes(q) || (apt.rescheduled_date || '').toLowerCase().includes(q);
      return matchTeacher || matchTopic || matchDate;
    }

    return true;
  });

  const pendingCount = appointments.filter(a => a.status === 'menunggu').length;
  const approvedCount = appointments.filter(a => a.status === 'disetujui' || a.status === 'dijadwalkan_ulang').length;
  const completedCount = appointments.filter(a => a.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">
                  Layanan Bimbingan Konseling • {studentProfile?.class_info?.name || 'Siswa'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white uppercase">
                  Privasi Terjaga
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Jadwal & Pengajuan Konseling BK
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-2xl">
                Ajukan jadwal pertemuan tatap muka di Ruang BK atau sesi konsultasi daring bersama Guru BK, serta pantau status jadwal konselingmu pada tabel di bawah ini.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setSubmitSuccess(null);
              setShowCreateModal(true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <span>Ajukan Jadwal Konseling</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Jadwal</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{appointments.length}</p>
          <span className="text-[11px] text-slate-400">Semua jadwal konseling</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-600">Menunggu Konfirmasi</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Sedang ditinjau Guru BK</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600">Jadwal Terkonfirmasi</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-slate-400">Disetujui / Dijadwalkan ulang</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Selesai Konseling</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{completedCount}</p>
          <span className="text-[11px] text-slate-400">Telah terlaksana</span>
        </div>
      </div>

      {/* Tabel Daftar Jadwal Konseling Siswa */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter & Search Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Tabel Daftar Jadwal Konseling Saya
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {filteredAppointments.length} Jadwal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik tombol <strong>Lihat Detail</strong> pada baris tabel untuk melihat informasi lengkap jadwal dan catatan Guru BK
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'active', label: 'Aktif' },
                { id: 'menunggu', label: 'Menunggu' },
                { id: 'disetujui', label: 'Disetujui' },
                { id: 'selesai', label: 'Selesai' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama Guru BK, topik konseling, atau tanggal..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Table Content */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/40">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Belum Ada Data Jadwal Konseling</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Kamu belum memiliki jadwal konseling pada filter ini. Klik tombol di bawah untuk mengajukan jadwal baru.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Jadwal Konseling Baru</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Tanggal & Jam Sesi</th>
                  <th className="py-3.5 px-4">Guru Pembimbing BK</th>
                  <th className="py-3.5 px-4">Metode Konseling</th>
                  <th className="py-3.5 px-4">Topik Konseling</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAppointments.map((apt, index) => {
                  const effectiveDate =
                    apt.status === 'dijadwalkan_ulang' && apt.rescheduled_date
                      ? apt.rescheduled_date
                      : apt.requested_date;
                  const effectiveTime =
                    apt.status === 'dijadwalkan_ulang' && apt.rescheduled_time
                      ? apt.rescheduled_time
                      : apt.requested_time;

                  return (
                    <tr
                      key={apt.id}
                      onClick={() => setDetailAppointment(apt)}
                      className="hover:bg-indigo-50/40 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{formatDateIndo(effectiveDate)}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Pukul {effectiveTime} WIB</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {apt.teacher_name || 'Guru BK'}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Guru Bimbingan Konseling
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {apt.counseling_type === 'tatap_muka' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px]">
                            🏛️ Tatap Muka (Ruang BK)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px]">
                            💬 Konseling Daring
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-800 font-medium line-clamp-2" title={apt.topic}>
                          {apt.topic}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>

                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailAppointment(apt)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 font-bold text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Detail</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPrintingAppointment(apt)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                            title="Cetak Bukti Jadwal Konseling"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Detail Data Jadwal Konseling */}
      {detailAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Detail Jadwal Janji Konseling
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Diajukan pada {new Date(detailAppointment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailAppointment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">Status Pengajuan Saat Ini:</span>
                  <div className="mt-1">{getStatusBadge(detailAppointment.status)}</div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[11px] text-slate-500 font-semibold block">Metode Konseling:</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block">
                    {detailAppointment.counseling_type === 'tatap_muka'
                      ? '🏛️ Tatap Muka di Ruang BK'
                      : '💬 Konseling Daring / Online'}
                  </span>
                </div>
              </div>

              {/* Informasi Siswa & Guru BK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Data Siswa
                  </span>
                  <p className="text-sm font-extrabold text-slate-900">
                    {detailAppointment.student_name || currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kelas: <strong>{detailAppointment.class_name || studentProfile?.class_info?.name || '-'}</strong> • NIS: <span className="font-mono">{detailAppointment.student_nis || studentProfile?.nis || '-'}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Guru Pembimbing BK
                  </span>
                  <p className="text-sm font-extrabold text-indigo-900">
                    {detailAppointment.teacher_name || 'Guru BK'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Unit Layanan Bimbingan Konseling
                  </p>
                </div>
              </div>

              {/* Informasi Waktu Pelaksanaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    Jadwal Pengajuan Awal
                  </span>
                  <p className="text-xs font-extrabold text-slate-900">
                    {formatDateIndo(detailAppointment.requested_date)}
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Pukul {detailAppointment.requested_time} WIB
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Jadwal Pelaksanaan Efektif
                  </span>
                  <p className="text-xs font-extrabold text-slate-900">
                    {detailAppointment.status === 'dijadwalkan_ulang' && detailAppointment.rescheduled_date
                      ? formatDateIndo(detailAppointment.rescheduled_date)
                      : formatDateIndo(detailAppointment.requested_date)}
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Pukul{' '}
                    {detailAppointment.status === 'dijadwalkan_ulang' && detailAppointment.rescheduled_time
                      ? detailAppointment.rescheduled_time
                      : detailAppointment.requested_time}{' '}
                    WIB
                  </p>
                </div>
              </div>

              {/* Topik Konseling */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Topik / Hal yang Dikonsultasikan</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  "{detailAppointment.topic}"
                </p>
              </div>

              {/* Alasan Penjadwalan Ulang (Jika Ada) */}
              {detailAppointment.reschedule_reason && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block">
                    Alasan Penyesuaian Jadwal dari Guru BK:
                  </span>
                  <p className="text-xs leading-relaxed">{detailAppointment.reschedule_reason}</p>
                </div>
              )}

              {/* Catatan / Tindak Lanjut Guru BK */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Catatan / Arahan Guru BK:</span>
                </span>
                {detailAppointment.notes ? (
                  <p className="text-xs leading-relaxed font-medium">{detailAppointment.notes}</p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Belum ada catatan tambahan dari Guru BK.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = detailAppointment;
                  setDetailAppointment(null);
                  setPrintingAppointment(target);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Bukti Jadwal</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailAppointment(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ajukan Jadwal Konseling Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Ajukan Jadwal Konseling BK
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Isi jadwal dan pilih Guru BK yang ingin kamu temui
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Pilih Guru BK */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Pilih Guru Pembimbing BK:
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                  {bkTeachers.map((teacher) => {
                    const isSelected = selectedTeacherId === teacher.teacher_id;
                    const isClassBk = studentProfile?.class_info?.bk_teacher_id === teacher.teacher_id;

                    return (
                      <div
                        key={teacher.teacher_id}
                        onClick={() => setSelectedTeacherId(teacher.teacher_id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-bold text-slate-900 truncate">{teacher.name}</p>
                              {isClassBk && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                  BK Kelasmu
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {teacher.room || 'Ruang BK'} • {teacher.specialization || 'Bimbingan Konseling'}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Tanggal Konseling:
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Pilihan Jam:
                  </label>
                  <select
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="08:30">08:30 WIB (Pagi)</option>
                    <option value="09:30">09:30 WIB (Sesi 1)</option>
                    <option value="10:15">10:15 WIB (Jam Istirahat 1)</option>
                    <option value="11:30">11:30 WIB (Siang)</option>
                    <option value="13:00">13:00 WIB (Jam Istirahat 2)</option>
                    <option value="14:30">14:30 WIB (Pulang Sekolah)</option>
                  </select>
                </div>
              </div>

              {/* Bentuk Sesi Konseling */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Bentuk Sesi Konseling:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition ${
                      counselingType === 'tatap_muka'
                        ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="modalCounselingType"
                      value="tatap_muka"
                      checked={counselingType === 'tatap_muka'}
                      onChange={() => setCounselingType('tatap_muka')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Tatap Muka (Ruang BK)</span>
                      <span className="text-[11px] text-slate-500">
                        Pertemuan langsung secara privat di Ruang BK.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition ${
                      counselingType === 'online_chat'
                        ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="modalCounselingType"
                      value="online_chat"
                      checked={counselingType === 'online_chat'}
                      onChange={() => setCounselingType('online_chat')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Konseling Daring</span>
                      <span className="text-[11px] text-slate-500">
                        Konsultasi terarah secara daring bersama Guru BK.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Topik Konseling */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. Topik / Hal yang Ingin Dikonsultasikan:
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ceritakan singkat topik yang ingin kamu bahas bersama Guru BK..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  required
                />
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-2 text-blue-900 text-[11px]">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Jadwal yang diajukan bersifat rahasia antara kamu dan Guru BK terpilih.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Pengajuan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cetak Bukti Jadwal Konseling */}
      {printingAppointment && (
        <PrintCounselingModal
          isOpen={!!printingAppointment}
          onClose={() => setPrintingAppointment(null)}
          appointment={printingAppointment}
        />
      )}
    </div>
  );
};
