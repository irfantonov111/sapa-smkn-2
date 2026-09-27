import React, { useState, useEffect } from 'react';
import {
  Settings,
  FileText,
  Calendar,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  RotateCcw,
  Upload,
  Eye,
  Shield,
  Sparkles,
  UserCheck,
  Printer,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { db } from '../../services/db';
import { SystemSettings, EnrichedReport, CounselingAppointment } from '../../types/database';
import { PrintReportModal } from '../PrintReportModal';
import { PrintCounselingModal } from '../PrintCounselingModal';

export const AdminSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => db.getSystemSettings());
  const [activePreviewTab, setActivePreviewTab] = useState<'report' | 'counseling'>('report');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showSampleReportPrint, setShowSampleReportPrint] = useState(false);
  const [showSampleCounselingPrint, setShowSampleCounselingPrint] = useState(false);

  useEffect(() => {
    setSettings(db.getSystemSettings());
    const unsub = db.subscribe(() => {
      setSettings(db.getSystemSettings());
    });
    return () => unsub();
  }, []);

  const handleChange = (field: keyof SystemSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange('logo_url', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      db.updateSystemSettings(settings);
      setSaveMessage('Pengaturan Kop Surat & Dokumen Cetak berhasil disimpan dan diterapkan ke seluruh sistem!');
      setTimeout(() => setSaveMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    const defaultSettings: SystemSettings = {
      reset_password_email: settings.reset_password_email || 'admin@sekolah.sch.id',
      school_name: 'SMK NEGERI 1 SAPA',
      gov_header: 'PEMERINTAH PROVINSI PENDIDIKAN DAN KEBUDAYAAN',
      report_header_subtitle: 'UNIT LAYANAN BIMBINGAN KONSELING & PENGADUAN SISWA (SAPA)',
      counseling_header_subtitle: 'UNIT LAYANAN BIMBINGAN DAN KONSELING (BK)',
      address: 'Jl. Pendidikan Raya No. 10, Kota Pelajar, Indonesia',
      contact_email: 'bk.sapa@sekolah.sch.id',
      contact_phone: '(021) 555-0192',
      website: 'www.smkn1sapa.sch.id',
      logo_url: '',
      report_doc_title: 'LAPORAN PENGADUAN & TINDAK LANJUT BIMBINGAN SISWA',
      counseling_doc_title: 'BUKTI JADWAL & BERITA ACARA JANJI TEMU KONSELING SISWA',
      sign_city: 'Kota Pelajar',
      sign_title_report: 'Koordinator BK / Kepala Sekolah',
      sign_name_report: '',
      sign_nip_report: '',
      sign_title_counseling: 'Koordinator Layanan BK',
      sign_name_counseling: '',
      sign_nip_counseling: '',
      support_phone: settings.support_phone || '0812-3456-7890'
    };
    setSettings(defaultSettings);
    db.updateSystemSettings(defaultSettings);
    setSaveMessage('Pengaturan Kop Surat berhasil dikembalikan ke pengaturan awal (default).');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Sample data for live modal print preview
  const sampleReport: EnrichedReport = {
    id: 'sample-preview',
    report_code: 'SAPA-2025-001',
    student_id: 'sample-student',
    category_id: 'cat-1',
    title: 'Contoh Laporan Konsultasi Akademik & Bimbingan Belajar Siswa',
    description: 'Siswa mengajukan permohonan bimbingan terkait manajemen waktu belajar dan persiapan praktik kerja lapangan.',
    incident_date: new Date().toISOString().slice(0, 10),
    location: 'Ruang Kelas XI RPL 1',
    urgency: 'sedang',
    privacy: 'rahasia',
    assigned_to: 'guru_bk',
    status: 'ditindaklanjuti',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: 'cat-1',
      name: 'Akademik & Belajar',
      icon: 'BookOpen',
      color: 'blue',
      description: 'Masalah belajar dan akademik'
    },
    student: {
      nis: '2025101',
      name: 'Ahmad Fauzi (Contoh Data Siswa)',
      class_name: 'XI RPL 1',
      is_anonymous: false
    },
    assigned_teacher: {
      name: 'Dra. Siti Aminah, M.Pd.',
      role_label: 'Guru Bimbingan Konseling (BK)',
      specific_name: 'Dra. Siti Aminah, M.Pd.'
    },
    messages_count: 2,
    unread_messages_count: 0
  };

  const sampleAppointment: CounselingAppointment = {
    id: 'sample-counseling',
    student_id: 'sample-student',
    student_user_id: 'sample-user',
    student_name: 'Ahmad Fauzi (Contoh Data Siswa)',
    student_nis: '2025101',
    class_name: 'XI RPL 1',
    teacher_id: 'sample-teacher',
    teacher_name: 'Dra. Siti Aminah, M.Pd.',
    requested_date: new Date().toISOString().slice(0, 10),
    requested_time: '10:15',
    topic: 'Konsultasi perencanaan pemilihan minat karier dan persiapan PKL industri.',
    counseling_type: 'tatap_muka',
    status: 'disetujui',
    notes: 'Silakan hadir di Ruang BK Lantai 2 tepat waktu saat jam istirahat pertama.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Pengaturan Kop Surat & Dokumen Cetak
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                Laporan Siswa & Jadwal Konseling
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sesuaikan identitas instansi, nama sekolah, alamat, kontak, logo, hingga pejabat penandatangan pada Kop Surat untuk <strong>Cetak Laporan Siswa</strong> dan <strong>Cetak Jadwal Janji Konseling</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSampleReportPrint(true)}
            className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Tes Cetak Laporan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSampleCounselingPrint(true)}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Tes Cetak Konseling</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Live Interactive Kop Surat Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Pratinjau Langsung (Live Preview) Kop Surat Resmi
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActivePreviewTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activePreviewTab === 'report'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kop Cetak Laporan Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('counseling')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activePreviewTab === 'counseling'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kop Cetak Jadwal Konseling</span>
            </button>
          </div>
        </div>

        {/* Simulated Paper Header */}
        <div className="bg-slate-100/80 p-4 sm:p-6 rounded-2xl border border-slate-200/80 overflow-x-auto">
          <div className="bg-white max-w-3xl mx-auto p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 text-slate-900 font-serif">
            <div className="border-b-4 border-double border-slate-900 pb-3 mb-4 text-center relative">
              <div className="flex items-center justify-center gap-4 mb-1">
                {settings.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt="Logo Instansi"
                    className="w-14 h-14 rounded-lg object-contain shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 font-sans font-black text-lg tracking-tighter">
                    {activePreviewTab === 'report' ? 'SAPA' : 'BK'}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-700">
                    {settings.gov_header || 'PEMERINTAH PROVINSI PENDIDIKAN DAN KEBUDAYAAN'}
                  </p>
                  <h1 className="text-xl sm:text-2xl font-sans font-black uppercase tracking-tight text-slate-900">
                    {settings.school_name || 'SMK NEGERI 1 SAPA'}
                  </h1>
                  <p className="text-xs font-sans font-bold uppercase tracking-wide text-slate-800">
                    {activePreviewTab === 'report'
                      ? (settings.report_header_subtitle || 'UNIT LAYANAN BIMBINGAN KONSELING & PENGADUAN SISWA (SAPA)')
                      : (settings.counseling_header_subtitle || 'UNIT LAYANAN BIMBINGAN DAN KONSELING (BK)')}
                  </p>
                  <p className="text-[10px] font-sans text-slate-600 mt-0.5">
                    {settings.address || 'Jl. Pendidikan Raya No. 10, Kota Pelajar, Indonesia'} • Telp: {settings.contact_phone || '(021) 555-0192'} • Email: {settings.contact_email || 'bk.sapa@sekolah.sch.id'}
                    {settings.website ? ` • Web: ${settings.website}` : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-1">
              <h2 className="text-sm font-sans font-black uppercase underline tracking-wide text-slate-900">
                {activePreviewTab === 'report'
                  ? (settings.report_doc_title || 'LAPORAN PENGADUAN & TINDAK LANJUT BIMBINGAN SISWA')
                  : (settings.counseling_doc_title || 'BUKTI JADWAL & BERITA ACARA JANJI TEMU KONSELING SISWA')}
              </h2>
              <p className="text-[11px] font-sans font-bold text-slate-600 mt-0.5">
                {activePreviewTab === 'report' ? 'Nomor Registrasi: SAPA-2025-001' : 'Nomor Dokumen: BK/KSL/2025/SAMPLE'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Pengaturan Kop Surat */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kolom 1: Identitas Utama Kop Surat & Kontak */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  1. Identitas Instansi & Sekolah (Kop Surat)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Informasi utama yang tampil pada bagian atas cetakan laporan dan jadwal konseling
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Baris Atas Kop Surat (Instansi / Pemerintah / Yayasan)
                </label>
                <input
                  type="text"
                  value={settings.gov_header || ''}
                  onChange={(e) => handleChange('gov_header', e.target.value)}
                  placeholder="PEMERINTAH PROVINSI PENDIDIKAN DAN KEBUDAYAAN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Sekolah / Satuan Pendidikan
                </label>
                <input
                  type="text"
                  value={settings.school_name || ''}
                  onChange={(e) => handleChange('school_name', e.target.value)}
                  placeholder="SMK NEGERI 1 SAPA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Jl. Pendidikan Raya No. 10, Kota Pelajar, Indonesia"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Telepon Sekolah
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      placeholder="(021) 555-0192"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Resmi Sekolah / BK
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={settings.contact_email || ''}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      placeholder="bk.sapa@sekolah.sch.id"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Website Sekolah (Opsional)
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={settings.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.smkn1sapa.sch.id"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Tempat Pengesahan Tanda Tangan
                  </label>
                  <input
                    type="text"
                    value={settings.sign_city || ''}
                    onChange={(e) => handleChange('sign_city', e.target.value)}
                    placeholder="Contoh: Jakarta / Bandung"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Logo Kop Surat */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Logo Sekolah pada Kop Surat (Opsional)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {settings.logo_url ? (
                    <div className="relative w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0">
                      <img src={settings.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-[9px] font-bold">Default</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Gambar Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>

                      {settings.logo_url && (
                        <button
                          type="button"
                          onClick={() => handleChange('logo_url', '')}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Logo</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={settings.logo_url || ''}
                      onChange={(e) => handleChange('logo_url', e.target.value)}
                      placeholder="Atau tempel URL gambar logo sekolah (https://...)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: Spesifik Kop Laporan Siswa & Kop Jadwal Konseling */}
          <div className="space-y-6">
            {/* Pengaturan Khusus Cetak Laporan Siswa */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    2. Kop & Pengesahan Cetak Laporan Siswa
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Digunakan saat mencetak dokumen Laporan Pengaduan Siswa
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sub-Judul Unit pada Kop Cetak Laporan Siswa
                  </label>
                  <input
                    type="text"
                    value={settings.report_header_subtitle || ''}
                    onChange={(e) => handleChange('report_header_subtitle', e.target.value)}
                    placeholder="UNIT LAYANAN BIMBINGAN KONSELING & PENGADUAN SISWA (SAPA)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Dokumen Cetak Laporan Siswa
                  </label>
                  <input
                    type="text"
                    value={settings.report_doc_title || ''}
                    onChange={(e) => handleChange('report_doc_title', e.target.value)}
                    placeholder="LAPORAN PENGADUAN & TINDAK LANJUT BIMBINGAN SISWA"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jabatan Penandatangan (Kiri)
                    </label>
                    <input
                      type="text"
                      value={settings.sign_title_report || ''}
                      onChange={(e) => handleChange('sign_title_report', e.target.value)}
                      placeholder="Koordinator BK / Kepala Sekolah"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pejabat (Opsional)
                    </label>
                    <input
                      type="text"
                      value={settings.sign_name_report || ''}
                      onChange={(e) => handleChange('sign_name_report', e.target.value)}
                      placeholder="Drs. H. Budi Santoso, M.Pd."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      NIP Pejabat (Opsional)
                    </label>
                    <input
                      type="text"
                      value={settings.sign_nip_report || ''}
                      onChange={(e) => handleChange('sign_nip_report', e.target.value)}
                      placeholder="19750412 200012 1 002"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pengaturan Khusus Cetak Jadwal Janji Konseling */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    3. Kop & Pengesahan Cetak Jadwal Janji Konseling
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Digunakan saat mencetak Bukti Jadwal & Berita Acara Janji Temu Konseling
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sub-Judul Unit pada Kop Cetak Jadwal Konseling
                  </label>
                  <input
                    type="text"
                    value={settings.counseling_header_subtitle || ''}
                    onChange={(e) => handleChange('counseling_header_subtitle', e.target.value)}
                    placeholder="UNIT LAYANAN BIMBINGAN DAN KONSELING (BK)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Dokumen Cetak Jadwal Konseling
                  </label>
                  <input
                    type="text"
                    value={settings.counseling_doc_title || ''}
                    onChange={(e) => handleChange('counseling_doc_title', e.target.value)}
                    placeholder="BUKTI JADWAL & BERITA ACARA JANJI TEMU KONSELING SISWA"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jabatan Penandatangan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={settings.sign_title_counseling || ''}
                      onChange={(e) => handleChange('sign_title_counseling', e.target.value)}
                      placeholder="Guru Bimbingan Konseling (BK)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Penandatangan Default
                    </label>
                    <input
                      type="text"
                      value={settings.sign_name_counseling || ''}
                      onChange={(e) => handleChange('sign_name_counseling', e.target.value)}
                      placeholder="Kosongkan jika sesuai nama Guru BK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      NIP Penandatangan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={settings.sign_nip_counseling || ''}
                      onChange={(e) => handleChange('sign_nip_counseling', e.target.value)}
                      placeholder="19820815 200901 2 005"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kembalikan ke Default</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Kop Surat'}</span>
          </button>
        </div>
      </form>

      {/* Modals for Live Print Testing */}
      <PrintReportModal
        isOpen={showSampleReportPrint}
        onClose={() => setShowSampleReportPrint(false)}
        report={sampleReport}
        history={[
          {
            id: 'h1',
            report_id: 'sample-preview',
            status: 'terkirim',
            changed_by: 'sample-student',
            note: 'Laporan dikirim oleh siswa.',
            created_at: new Date().toISOString()
          },
          {
            id: 'h2',
            report_id: 'sample-preview',
            status: 'ditindaklanjuti',
            changed_by: 'sample-teacher',
            note: 'Siswa telah diberikan bimbingan awal oleh Guru BK.',
            created_at: new Date().toISOString()
          }
        ]}
      />

      <PrintCounselingModal
        isOpen={showSampleCounselingPrint}
        onClose={() => setShowSampleCounselingPrint(false)}
        appointment={sampleAppointment}
      />
    </div>
  );
};
