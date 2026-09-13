import React, { useState, useRef } from 'react';
import {
  Shield,
  Send,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  Lock,
  Eye,
  UserX,
  Sparkles,
  ArrowLeft,
  Paperclip,
  UploadCloud,
  Image as ImageIcon,
  FileText,
  File as FileGeneric,
  Trash2,
  ZoomIn,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { ReportUrgency, ReportPrivacy, AssignedTo, Category, ReportAttachment } from '../types/database';
import { CategoryIcon } from '../components/StatusBadges';
import { BkTeacherFormSelector } from '../components/BkTeacherComponents';

interface CreateReportPageProps {
  onNavigate: (tab: string, reportId?: string) => void;
  preselectedTeacherId?: string | null;
}

export const CreateReportPage: React.FC<CreateReportPageProps> = ({
  onNavigate,
  preselectedTeacherId
}) => {
  const { currentUser, studentProfile } = useAuth();
  const categories = db.getCategories();
  const bkTeachers = db.getBkTeachers();

  // Homeroom teacher and Class BK Teacher are determined from student class
  const studentClass = studentProfile?.class_info || (studentProfile?.class_id ? db.getClassById(studentProfile.class_id) : undefined);
  const classBkTeacher = studentClass?.bk_teacher_id
    ? db.getTeacherById(studentClass.bk_teacher_id)
    : undefined;
  const defaultBkUserId = classBkTeacher?.user_id || null;

  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'cat-1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<ReportUrgency>('sedang');
  const [assignedTo, setAssignedTo] = useState<AssignedTo>('guru_bk');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(preselectedTeacherId || defaultBkUserId);
  const [privacy, setPrivacy] = useState<ReportPrivacy>('terbuka');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Local File & Photo Attachment State
  const [attachments, setAttachments] = useState<ReportAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes?: number | string): string => {
    if (!bytes) return '';
    const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
    if (isNaN(num)) return String(bytes);
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFiles = (fileList: FileList | File[]) => {
    setUploadError(null);
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const MAX_SIZE = 15 * 1024 * 1024; // 15MB limit per file
    const validFiles: File[] = [];

    for (const f of files) {
      if (f.size > MAX_SIZE) {
        setUploadError(`Berkas "${f.name}" melebihi batas ukuran maksimal 15 MB.`);
        return;
      }
      validFiles.push(f);
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const isImg = file.type.startsWith('image/');
        const newAtt: ReportAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: isImg ? 'image' : 'document',
          name: file.name,
          size: file.size,
          url: dataUrl,
          mime_type: file.type,
          uploaded_at: new Date().toISOString()
        };
        setAttachments(prev => [...prev, newAtt]);
      };
      reader.onerror = () => {
        setUploadError(`Gagal membaca berkas "${file.name}". Silakan coba lagi.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  if (!currentUser || currentUser.role !== 'siswa') {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">
          Hanya akun Siswa yang dapat membuat laporan baru.
        </p>
      </div>
    );
  }

  const selectedCategory = categories.find(c => c.id === categoryId);
  const isSensitiveCategory = selectedCategory?.name.toLowerCase().includes('bullying') ||
                              selectedCategory?.name.toLowerCase().includes('perundungan');

  const homeroomTeacher = studentClass?.homeroom_teacher_id
    ? db.getTeacherById(studentClass.homeroom_teacher_id)
    : undefined;
  const homeroomTeacherUser = homeroomTeacher ? db.getUserById(homeroomTeacher.user_id) : undefined;

  const chosenTeacherProfile = selectedTeacherId
    ? bkTeachers.find(t => t.user_id === selectedTeacherId || t.teacher_id === selectedTeacherId)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Silakan isi judul laporan.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Ceritakan masalahmu agar guru dapat memahami situasinya.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = db.createReport(currentUser, {
        category_id: categoryId,
        assigned_to: assignedTo,
        assigned_teacher_id: assignedTo === 'guru_bk' ? selectedTeacherId : (homeroomTeacher?.id || null),
        title: title.trim(),
        description: description.trim(),
        urgency,
        privacy,
        attachments
      });

      // Navigate to detail page of newly created report
      onNavigate('detail', created.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat mengirim laporan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button & Page title */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Pengirim: <strong className="text-slate-800">{currentUser.name}</strong> ({studentProfile?.class_info?.name || 'Siswa'})
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Formulir Laporan & Aspirasi Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ceritakan apa yang kamu hadapi. Suaramu penting bagi sekolah dan masa depan belajarmu.
          </p>
        </div>

        {/* Sensitive Category Encouragement Notice Banner */}
        {isSensitiveCategory && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-blue-900">
                Terima kasih sudah berani bercerita.
              </p>
              <p className="text-blue-700 mt-0.5">
                Informasi yang kamu sampaikan akan ditangani secara bijak dan sesuai prosedur perlindungan siswa sekolah. Kamu tidak sendirian.
              </p>
            </div>
          </div>
        )}

        {/* Selected BK Teacher Notice Banner */}
        {assignedTo === 'guru_bk' && chosenTeacherProfile && (
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={chosenTeacherProfile.avatar}
                alt={chosenTeacherProfile.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-indigo-200 shrink-0"
              />
              <div className="text-xs min-w-0">
                <p className="font-bold text-indigo-950 truncate">
                  Konseling Terjadwal: {chosenTeacherProfile.name}
                </p>
                <p className="text-indigo-700 truncate text-[11px]">
                  Spesialisasi: {chosenTeacherProfile.specialization} • {chosenTeacherProfile.room}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTeacherId(null)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200 shrink-0 transition"
            >
              Ubah / Otomatis
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Kategori Laporan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <CategoryIcon iconName={cat.icon} color={cat.color} className="w-4 h-4" />
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Judul */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              2. Judul Laporan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Contoh: "Saya kesulitan memahami subnetting dan VLSM"'
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* 3. Ceritakan Masalahmu */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              3. Ceritakan Masalahmu <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan apa yang sedang kamu alami. Kamu tidak harus menggunakan bahasa formal."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tuliskan secara terbuka. Detail waktu, lokasi kejadian (bila ada), atau kesulitan yang dirasakan sangat membantu penanganan.
            </p>
          </div>

          {/* 4. Lampiran Foto atau File Bukti (Opsional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Lampiran Foto atau File Bukti <span className="text-slate-400 font-normal lowercase">(opsional)</span>
              </label>
              {attachments.length > 0 && (
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {attachments.length} berkas terlampir
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Lampirkan bukti foto (tangkapan layar percakapan, foto kejadian/fisik) atau berkas dokumen pendukung (PDF, Word, Excel, Catatan) langsung dari perangkatmu.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-150 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-500/10 scale-[1.008]'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/70 bg-slate-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                  isDragging ? 'bg-blue-600 text-white' : 'bg-blue-100/80 text-blue-600'
                }`}>
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    <span className="text-blue-600 hover:underline">Klik untuk memilih berkas</span> atau tarik & lepaskan ke sini
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mendukung Foto (JPG, PNG, WEBP, GIF) dan Dokumen (PDF, Word, TXT, Excel). Maksimal 15 MB per berkas.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 mt-1 shadow-2xs">
                  <Paperclip className="w-3 h-3 text-slate-400" />
                  <span>Bisa lampirkan lebih dari satu berkas</span>
                </div>
              </div>
            </div>

            {/* Upload Error Banner */}
            {uploadError && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Uploaded Files List / Previews */}
            {attachments.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {attachments.map((att) => {
                    const isImg = att.type === 'image';
                    return (
                      <div
                        key={att.id}
                        className="group relative flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition"
                      >
                        {/* Thumbnail or Document Icon */}
                        {isImg ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage({ url: att.url, name: att.name });
                            }}
                            className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 cursor-pointer relative group/thumb"
                            title="Klik untuk memperbesar foto"
                          >
                            <img
                              src={att.url}
                              alt={att.name}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center">
                              <ZoomIn className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
                            {att.name.toLowerCase().endsWith('.pdf') ? (
                              <FileText className="w-5 h-5 text-rose-600" />
                            ) : (
                              <FileGeneric className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        )}

                        {/* File Details */}
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="text-xs font-bold text-slate-800 truncate" title={att.name}>
                            {att.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">
                              {formatFileSize(att.size)}
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                              {isImg ? 'Foto / Bukti' : (att.name.split('.').pop() || 'Dokumen')}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isImg && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage({ url: att.url, name: att.name });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Lihat Pratinjau Foto"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAttachment(att.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Lampiran Ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. Tingkat Urgensi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              5. Tingkat Urgensi
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div
                onClick={() => setUrgency('rendah')}
                className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition ${
                  urgency === 'rendah'
                    ? 'border-slate-500 bg-slate-100 font-bold text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span className="block text-xs font-bold">Rendah</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Saran umum / santai</span>
              </div>

              <div
                onClick={() => setUrgency('sedang')}
                className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition ${
                  urgency === 'sedang'
                    ? 'border-amber-500 bg-amber-50 font-bold text-amber-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span className="block text-xs font-bold">Sedang</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Butuh diskusi guru</span>
              </div>

              <div
                onClick={() => setUrgency('tinggi')}
                className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition ${
                  urgency === 'tinggi'
                    ? 'border-rose-500 bg-rose-50 font-bold text-rose-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span className="block text-xs font-bold">Tinggi</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Darurat / bullying</span>
              </div>
            </div>
          </div>

          {/* 6. Ditujukan Kepada */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              6. Ditujukan Kepada
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setAssignedTo('guru_bk')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  assignedTo === 'guru_bk'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  assignedTo === 'guru_bk' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Guru BK (Bimbingan Konseling)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Cocok untuk konseling personal, perundungan, kecemasan, bimbingan minat karier, dan masalah pertemanan.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAssignedTo('wali_kelas')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  assignedTo === 'wali_kelas'
                    ? 'border-emerald-600 bg-emerald-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  assignedTo === 'wali_kelas' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Wali Kelas</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Cocok untuk urusan KBM kelas, kendala pelajaran tertentu, kerja kelompok, atau izin tugas sekolah.
                  </p>
                </div>
              </div>
            </div>

            {/* Individual BK Teacher Selector if assignedTo is guru_bk */}
            {assignedTo === 'guru_bk' && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <BkTeacherFormSelector
                  teachers={bkTeachers}
                  selectedTeacherId={selectedTeacherId}
                  onSelectTeacher={setSelectedTeacherId}
                  categoryName={selectedCategory?.name}
                  classBkTeacherId={defaultBkUserId || classBkTeacher?.id}
                  className={studentClass?.name}
                />
              </div>
            )}

            {/* Automatically Assigned Homeroom Teacher if assignedTo is wali_kelas */}
            {assignedTo === 'wali_kelas' && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      Otomatis Terverifikasi
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      1 Siswa = 1 Wali Kelas
                    </span>
                  </div>

                  {homeroomTeacherUser && homeroomTeacher ? (
                    <div className="flex items-start gap-3.5 bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {homeroomTeacherUser.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">
                            {homeroomTeacherUser.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                            Wali Kelas Resmi
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          {studentClass?.name || 'Kelas Anda'} • NIP: {homeroomTeacher.nip}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          Sesuai data kelas Anda ({studentClass?.name || 'Rombel'}), pengaduan ini secara otomatis diteruskan langsung ke wali kelas Anda tanpa perlu pemilihan manual.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-slate-600">
                      Pengaduan akan otomatis dikirimkan ke wali kelas yang bertugas mendampingi kelas <strong>{studentClass?.name || 'Anda'}</strong>.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 7. Tingkat Kerahasiaan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              7. Tingkat Kerahasiaan
            </label>
            <div className="space-y-2.5">
              <div
                onClick={() => setPrivacy('terbuka')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                  privacy === 'terbuka'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Identitas Terbuka</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">Disarankan</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nama dan kelasmu ditampilkan lengkap kepada guru agar penanganan dapat dilakukan secara personal dan cepat.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPrivacy('terbatas')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                  privacy === 'terbatas'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900">Identitas Terbatas</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hanya guru yang menerima langsung laporan ini yang mengetahui identitasmu, tertutup rapat dari pihak lain.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPrivacy('anonim')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                  privacy === 'anonim'
                    ? 'border-purple-500 bg-purple-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <UserX className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900">Anonim (Nama Dirahasiakan)</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nama dan NIS kamu disamarkan sebagai "Siswa Anonim" di layar guru. Kamu tetap dapat memantau status dan bertukar pesan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Laporan'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox / Full Photo Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {previewImage.name}
                </h4>
                <p className="text-[10px] text-slate-400">Pratinjau Foto Lampiran</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-950/95 overflow-auto max-h-[75vh]">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
