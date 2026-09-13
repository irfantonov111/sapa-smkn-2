import React, { useState, useMemo, useEffect } from 'react';
import {
  Megaphone,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  Video,
  User,
  Trash2,
  AlertCircle,
  X,
  Share2,
  Check,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  UploadCloud,
  FileText,
  Download,
  Paperclip,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Announcement, AnnouncementTargetGrade, AnnouncementAttachment } from '../types/database';

/**
 * Utility to convert Google Drive sharing links to direct image embedding links.
 * Standard Google Drive URLs (drive.google.com/file/d/.../view) return an HTML viewer
 * with security restrictions that prevent <img> tags from rendering them.
 * By using the lh3.googleusercontent.com/d/FILE_ID endpoint, the raw image is directly servable.
 */
export const convertGoogleDriveUrl = (url?: string): { isDrive: boolean; viewableUrl: string } => {
  if (!url) return { isDrive: false, viewableUrl: '' };
  const trimmed = url.trim();
  const drivePatterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/uc\?(?:[^&]+&)*id=([a-zA-Z0-9_-]+)/i,
    /docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  ];

  for (const pattern of drivePatterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        isDrive: true,
        viewableUrl: `https://lh3.googleusercontent.com/d/${fileId}`
      };
    }
  }
  return { isDrive: false, viewableUrl: trimmed };
};

interface AnnouncementsPageProps {
  onNavigate: (tab: string, reportId?: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ onNavigate }) => {
  const { currentUser, studentProfile, teacherProfile } = useAuth();

  const isBK = currentUser?.role === 'guru' && teacherProfile?.teacher_type === 'guru_bk';

  // Helper to identify if an announcement was created by the currently logged-in user / Guru BK
  const isMyAnnouncement = (a: Announcement) => {
    if (!currentUser) return false;
    if (a.author_user_id && a.author_user_id === currentUser.id) return true;
    if (a.author_id && (a.author_id === currentUser.id || (teacherProfile && a.author_id === teacherProfile.id))) return true;
    if (a.author_name && (a.author_name === currentUser.name || (teacherProfile && a.author_name === teacherProfile.name))) return true;
    return false;
  };

  // Filter & Sort States
  // For Guru BK, the default sort is 'my_bk' (sortir berdasarkan guru bk yang bersangkutan)
  const [searchTerm, setSearchTerm] = useState('');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [sortOrder, setSortOrder] = useState<'my_bk' | 'newest' | 'oldest'>(() => {
    return (currentUser?.role === 'guru' && teacherProfile?.teacher_type === 'guru_bk') ? 'my_bk' : 'newest';
  });
  const [targetFilter, setTargetFilter] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Automatically ensure Guru BK has default sort set to their own announcements first
  useEffect(() => {
    if (isBK) {
      setSortOrder('my_bk');
    }
  }, [isBK]);

  // Teacher Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('Bimbingan Konseling');
  const [formTargetGrade, setFormTargetGrade] = useState<AnnouncementTargetGrade>('all');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formLinkTitle, setFormLinkTitle] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<AnnouncementAttachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isGoogleDriveUrl, setIsGoogleDriveUrl] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Delete modal state
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  if (!currentUser) return null;

  const isTeacherOrAdmin = currentUser.role === 'guru' || currentUser.role === 'admin';
  const isStudent = currentUser.role === 'siswa';

  // Get raw announcements list
  const announcements = useMemo(() => {
    return db.getAnnouncements(currentUser);
  }, [currentUser, refreshKey]);

  // Compute stats
  const totalCount = announcements.length;
  const unreadCount = announcements.filter(a => !(a.read_by_user_ids || []).includes(currentUser.id)).length;
  const readCount = totalCount - unreadCount;

  // Filter and sort
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((a) => {
        // Search
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(term);
          const matchContent = a.content.toLowerCase().includes(term);
          const matchAuthor = a.author_name.toLowerCase().includes(term);
          const matchCategory = (a.category || '').toLowerCase().includes(term);
          if (!matchTitle && !matchContent && !matchAuthor && !matchCategory) return false;
        }

        // Read status filter
        if (isStudent) {
          const isRead = (a.read_by_user_ids || []).includes(currentUser.id);
          if (readFilter === 'unread' && isRead) return false;
          if (readFilter === 'read' && !isRead) return false;
        }

        // Target grade filter
        if (targetFilter !== 'all') {
          if (a.target_grade !== targetFilter && a.target_grade !== 'all') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'my_bk') {
          const aMine = isMyAnnouncement(a);
          const bMine = isMyAnnouncement(b);
          if (aMine && !bMine) return -1;
          if (!aMine && bMine) return 1;
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();
          return timeB - timeA;
        }
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [announcements, searchTerm, readFilter, sortOrder, targetFilter, isStudent, currentUser.id, isBK]);

  const handleToggleRead = (announcementId: string, currentRead: boolean) => {
    db.markAnnouncementAsRead(announcementId, currentUser.id, !currentRead);
    setRefreshKey(prev => prev + 1);
  };

  // File Upload Handlers (Local Computer)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      setFormError('Ukuran file maksimal adalah 15 MB.');
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const isImage = file.type.startsWith('image/');
      const newAtt: AnnouncementAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: isImage ? 'image' : 'document',
        url: result,
        file_url: result,
        file_name: file.name,
        file_size: file.size,
        title: file.name
      };
      setUploadedFiles(prev => [...prev, newAtt]);
      setUploadingFile(false);
      e.target.value = '';
    };
    reader.onerror = () => {
      setFormError('Gagal membaca file dari komputer.');
      setUploadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleImageUrlChange = (val: string) => {
    setFormImageUrl(val);
    const checked = convertGoogleDriveUrl(val);
    setIsGoogleDriveUrl(checked.isDrive);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Judul pengumuman wajib diisi.');
      return;
    }
    if (!formContent.trim()) {
      setFormError('Isi pengumuman wajib diisi.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const authorRoleLabel =
        currentUser.role === 'admin'
          ? 'Admin Sekolah'
          : teacherProfile?.teacher_type === 'guru_bk'
          ? 'Guru BK'
          : 'Wali Kelas';

      // Automatically convert Google Drive links if provided
      const convertedImg = convertGoogleDriveUrl(formImageUrl.trim());

      db.createAnnouncement({
        title: formTitle.trim(),
        content: formContent.trim(),
        author_user_id: currentUser.id,
        author_name: currentUser.name,
        author_role: authorRoleLabel,
        author_avatar: currentUser.avatar,
        target_grade: formTargetGrade,
        category: formCategory,
        link_url: formLinkUrl.trim() || undefined,
        link_title: formLinkTitle.trim() || undefined,
        image_url: convertedImg.viewableUrl || undefined,
        video_url: formVideoUrl.trim() || undefined,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      // Reset form
      setFormTitle('');
      setFormContent('');
      setFormCategory('Bimbingan Konseling');
      setFormTargetGrade('all');
      setFormLinkUrl('');
      setFormLinkTitle('');
      setFormImageUrl('');
      setFormVideoUrl('');
      setUploadedFiles([]);
      setIsGoogleDriveUrl(false);
      setIsCreateModalOpen(false);
      setRefreshKey(prev => prev + 1);
      setSuccessToast('Pengumuman berhasil dipublikasikan untuk siswa!');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal mempublikasikan pengumuman');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = () => {
    if (!announcementToDelete) return;
    db.deleteAnnouncement(announcementToDelete.id);
    setAnnouncementToDelete(null);
    setRefreshKey(prev => prev + 1);
    setSuccessToast('Pengumuman berhasil dihapus.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Helper for YouTube embed
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    } catch {
      return null;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-blue-200">
              <Megaphone className="w-4 h-4" />
              <span>Papan Informasi & Pengumuman</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Pengumuman Siswa
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              Informasi resmi bimbingan konseling, agenda pembinaan, sosialisasi karir, dan arahan penting dari Guru BK & Wali Kelas.
            </p>
          </div>

          {isTeacherOrAdmin && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0 group"
            >
              <PlusCircle className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform duration-200" />
              <span>Buat Pengumuman Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls / Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, topik, nama guru, atau isi pengumuman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Target Grade */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <span className="px-2 text-[11px] text-slate-400">Target:</span>
              <button
                type="button"
                onClick={() => setTargetFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  targetFilter === 'all' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTargetFilter('10')}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  targetFilter === '10' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Kelas 10
              </button>
              <button
                type="button"
                onClick={() => setTargetFilter('11')}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  targetFilter === '11' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Kelas 11
              </button>
              <button
                type="button"
                onClick={() => setTargetFilter('12')}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  targetFilter === '12' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Kelas 12
              </button>
            </div>

            {/* Sort Order Dropdown */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 flex-wrap">
              <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1.5 shrink-0" />
              {isBK && (
                <button
                  type="button"
                  onClick={() => setSortOrder('my_bk')}
                  className={`px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 ${
                    sortOrder === 'my_bk' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                  }`}
                  title="Sortir pertama kali berdasarkan Guru BK yang bersangkutan"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Pengumuman Saya (Default)</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSortOrder('newest')}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  sortOrder === 'newest' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Terbaru
              </button>
              <button
                type="button"
                onClick={() => setSortOrder('oldest')}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  sortOrder === 'oldest' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Terlama
              </button>
            </div>
          </div>
        </div>

        {/* Read / Unread Status Filter (Active for Students) */}
        {isStudent && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1">Status Baca:</span>
            <button
              type="button"
              onClick={() => setReadFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                readFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Semua</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {totalCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setReadFilter('unread')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                readFilter === 'unread'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Circle className="w-2.5 h-2.5 fill-current text-sky-400" />
              <span>Belum Dibaca</span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setReadFilter('read')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                readFilter === 'read'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Sudah Dibaca</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600">
                {readCount}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Pengumuman</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || readFilter !== 'all' || targetFilter !== 'all'
                ? 'Tidak ada pengumuman yang sesuai dengan filter atau kata kunci pencarian Anda.'
                : 'Belum ada pengumuman yang dipublikasikan oleh Guru BK atau Wali Kelas saat ini.'}
            </p>
            {(searchTerm || readFilter !== 'all' || targetFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setReadFilter('all');
                  setTargetFilter('all');
                  setSortOrder('newest');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const isRead = (item.read_by_user_ids || []).includes(currentUser.id);
            const isMine = isMyAnnouncement(item);
            const canDelete =
              currentUser.role === 'admin' || item.author_user_id === currentUser.id;
            const embedUrl = getYouTubeEmbedUrl(item.video_url);

            const targetLabel =
              item.target_grade === '10'
                ? 'Khusus Kelas 10 (X)'
                : item.target_grade === '11'
                ? 'Khusus Kelas 11 (XI)'
                : item.target_grade === '12'
                ? 'Khusus Kelas 12 (XII)'
                : 'Semua Siswa (X, XI, XII)';

            return (
              <article
                key={item.id}
                className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 space-y-4 shadow-xs ${
                  isMine && isBK
                    ? 'border-blue-300 ring-2 ring-blue-500/15'
                    : isStudent && !isRead
                    ? 'border-blue-300 ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header: Author & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.author_avatar || `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150`}
                      alt={item.author_name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {item.author_name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {item.author_role}
                        </span>
                        {isMine && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            ★ Pengumuman Anda
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(item.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} WIB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                    {/* Target Grade Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                        item.target_grade === 'all'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {targetLabel}
                    </span>

                    {/* Category */}
                    {item.category && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                    )}

                    {/* Student Read/Unread Badge */}
                    {isStudent && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border ${
                          isRead
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                        }`}
                      >
                        {isRead ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Sudah Dibaca</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-2.5 h-2.5 fill-current text-rose-600" />
                            <span>Belum Dibaca</span>
                          </>
                        )}
                      </span>
                    )}

                    {/* Delete Option for Author or Admin */}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => setAnnouncementToDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Pengumuman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content: Title & Text */}
                <div className="space-y-2.5">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h2>
                  <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {item.content}
                  </div>
                </div>

                {/* Attachments Section */}
                {(item.image_url || item.video_url || item.link_url || (item.attachments && item.attachments.length > 0)) && (
                  <div className="pt-2 space-y-3">
                    {/* Direct Image Attachment (with Google Drive auto-resolver) */}
                    {item.image_url && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-96">
                        <img
                          src={convertGoogleDriveUrl(item.image_url).viewableUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover max-h-96 hover:scale-101 transition-transform duration-200"
                        />
                      </div>
                    )}

                    {/* Uploaded Files & Documents from Computer */}
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="space-y-2">
                        {item.attachments.map((att) => {
                          const isImg = att.type === 'image';
                          if (isImg) {
                            return (
                              <div key={att.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-96">
                                <img
                                  src={att.file_url || att.url}
                                  alt={att.file_name || 'Foto Lampiran'}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-auto object-cover max-h-96 hover:scale-101 transition-transform duration-200"
                                />
                                {att.file_name && (
                                  <div className="p-2 bg-white/90 border-t border-slate-200 flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-700 truncate">{att.file_name}</span>
                                    <a
                                      href={att.file_url || att.url}
                                      download={att.file_name}
                                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 shrink-0 ml-2"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Unduh</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // Document Card (PDF, Word, Excel, etc.)
                          return (
                            <div
                              key={att.id}
                              className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {att.file_name || att.title || 'Dokumen Lampiran'}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {att.file_size ? `${(att.file_size / (1024 * 1024)).toFixed(2)} MB` : 'Dokumen Pelengkap'}
                                  </p>
                                </div>
                              </div>

                              <a
                                href={att.file_url || att.url}
                                download={att.file_name || 'lampiran-dokumen'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0 transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh</span>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Video Attachment (YouTube or HTML5) */}
                    {item.video_url && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video max-w-2xl">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title="Video Pengumuman"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={item.video_url}
                            controls
                            className="w-full h-full object-contain"
                          >
                            Browser Anda tidak mendukung tag video.
                          </video>
                        )}
                      </div>
                    )}

                    {/* Link Attachment */}
                    {item.link_url && (
                      <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition shadow-2xs group"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>{item.link_title || 'Buka Tautan Lampiran'}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Footer Controls: Toggle Read for Students */}
                {isStudent && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Disampaikan oleh {item.author_name} ({item.author_role})
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleRead(item.id, isRead)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                        isRead
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isRead ? (
                        <>
                          <Circle className="w-3 h-3" />
                          <span>Tandai Belum Dibaca</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tandai Sudah Dibaca</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Modal: Create Announcement (For Guru BK & Wali Kelas) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 shrink-0 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Buat Pengumuman Siswa
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kirim pengumuman resmi ke seluruh siswa atau khusus kelas tertentu
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAnnouncement} className="flex flex-col flex-1 overflow-hidden min-h-0">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4 flex-1">
                {formError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Judul */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Pengumuman <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sosialisasi Penjurusan & Karir Siswa Kelas 10"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Target Jenjang & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sasaran / Target Siswa <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formTargetGrade}
                      onChange={(e) => setFormTargetGrade(e.target.value as AnnouncementTargetGrade)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                    >
                      <option value="all">Semua Jenjang (Kelas 10, 11, dan 12)</option>
                      <option value="10">Khusus Kelas 10 (X)</option>
                      <option value="11">Khusus Kelas 11 (XI)</option>
                      <option value="12">Khusus Kelas 12 (XII)</option>
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Pengumuman hanya akan tampil pada siswa dengan tingkatan yang dipilih.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori Pengumuman
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                    >
                      <option value="Bimbingan Konseling">Bimbingan Konseling</option>
                      <option value="Informasi Karir & Kuliah">Informasi Karir & Kuliah</option>
                      <option value="Kedisiplinan & Tata Tertib">Kedisiplinan & Tata Tertib</option>
                      <option value="Akademik & Pembelajaran">Akademik & Pembelajaran</option>
                      <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                      <option value="Sosialisasi Anti Bullying">Sosialisasi Anti Bullying</option>
                    </select>
                  </div>
                </div>

                {/* Isi Teks Pengumuman */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Isi / Deskripsi Pengumuman <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan isi pengumuman secara rinci, instruksi kegiatan, tempat, waktu, atau informasi yang harus diperhatikan siswa..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                  />
                </div>

                {/* Local File Upload Section */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-blue-600" />
                      <span>Unggah File dari Komputer (Gambar / Dokumen)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Maks. 15 MB per file
                    </span>
                  </div>

                  {/* Drag and Drop / Select File Box */}
                  <label className="relative flex flex-col items-center justify-center p-4 sm:p-5 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white rounded-2xl cursor-pointer transition text-center group">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      {uploadingFile ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Paperclip className="w-5 h-5" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {uploadingFile ? 'Membaca file...' : 'Klik untuk memilih file foto, poster, atau dokumen PDF/Word'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung format PNG, JPG, WEBP, PDF, DOCX, XLSX
                    </p>
                  </label>

                  {/* List of uploaded files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        File Terlampir ({uploadedFiles.length}):
                      </span>
                      <div className="space-y-1.5">
                        {uploadedFiles.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {f.type === 'image' ? (
                                <img
                                  src={f.file_url || f.url}
                                  alt="Preview"
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate text-[11px]">
                                  {f.file_name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {f.file_size ? `${(f.file_size / 1024).toFixed(1)} KB` : 'Dokumen'} • {f.type === 'image' ? 'Gambar' : 'Dokumen'}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedFile(f.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0 ml-2"
                              title="Hapus file"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments Section: Link & Web URLs */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lampiran Tautan Web, Foto Online & Video (Opsional):</span>
                  </span>

                  {/* Image URL with Google Drive Support */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      URL Gambar / Link Foto Poster / Google Drive (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://... atau link sharing Google Drive foto/poster"
                      value={formImageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {isGoogleDriveUrl && (
                      <div className="mt-1.5 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Link Google Drive terdeteksi!</strong> Tautan otomatis dikonversi agar gambar dapat tampil langsung pada siswa. Pastikan opsi berbagi Google Drive disetel ke <em>"Siapa saja yang memiliki link"</em> (Anyone with the link).
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Link Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        URL Tautan / Link Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formLinkUrl}
                        onChange={(e) => setFormLinkUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Judul / Label Tombol Link
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Isi Form Pendataan"
                        value={formLinkTitle}
                        onChange={(e) => setFormLinkTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Video */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      URL Video YouTube / Video Edukasi (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... atau link video"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer (Fixed at bottom) */}
              <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-100 bg-slate-50/90 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/80 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <span>Mempublikasikan...</span>
                  ) : (
                    <>
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Publikasikan Pengumuman</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {announcementToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-center text-base">
              Hapus Pengumuman?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Pengumuman "<strong className="text-slate-800">{announcementToDelete.title}</strong>" akan dihapus secara permanen dan tidak akan terlihat lagi oleh siswa.
            </p>

            <div className="flex items-center justify-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setAnnouncementToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAnnouncement}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
              >
                Ya, Hapus Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
