import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  UserCheck,
  Sparkles,
  Clock,
  CheckCheck,
  Lock,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';
import { User, Message, EnrichedReport } from '../types/database';
import { db } from '../services/db';

interface ReportChatProps {
  report: EnrichedReport;
  currentUser: User;
  onMessageSent?: () => void;
}

interface ChatAttachment {
  url: string;
  name: string;
  type: 'image' | 'file';
  size?: string;
  mime_type?: string;
}

export const ReportChat: React.FC<ReportChatProps> = ({ report, currentUser, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  // Check if status has been updated by teacher/admin
  const isStatusChangedByTeacher =
    report.status === 'direspons' ||
    report.status === 'ditindaklanjuti' ||
    report.status === 'selesai';

  const isStudentChatLocked = currentUser.role === 'siswa' && isStatusChangedByTeacher;

  // Check if current user is a teacher who is NOT the selected/assigned teacher
  const currentTeacher = currentUser.role === 'guru' ? db.getTeacherByUserId(currentUser.id) : null;
  const isTeacherBlocked =
    currentUser.role === 'guru' &&
    report.assigned_to === 'guru_bk' &&
    Boolean(report.assigned_teacher_id) &&
    currentTeacher !== null &&
    report.assigned_teacher_id !== currentTeacher.id &&
    report.assigned_teacher_id !== currentTeacher.user_id;

  const loadMessages = () => {
    const list = db.getMessagesByReportId(report.id, currentUser);
    setMessages((prev) => {
      if (prev.length !== list.length || (list.length > 0 && list[list.length - 1].id !== prev[prev.length - 1]?.id)) {
        return list;
      }
      return prev;
    });
  };

  useEffect(() => {
    loadMessages();

    // Initial fetch from server
    db.fetchReportMessages(report.id).then(() => {
      loadMessages();
    });

    // Listen to local database changes
    const unsubscribe = db.subscribe(() => {
      loadMessages();
    });

    // Fast polling (1.5s) to sync new messages between Student and BK teacher in real time
    const interval = setInterval(async () => {
      await db.fetchReportMessages(report.id);
      loadMessages();
    }, 1500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [report.id, currentUser.id]);

  useEffect(() => {
    // Only scroll the internal chat container when messages are added, NEVER scroll the browser window
    if (chatContainerRef.current && messages.length > prevCountRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: prevCountRef.current === 0 ? 'auto' : 'smooth'
      });
      prevCountRef.current = messages.length;
    }
  }, [messages.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, forceType?: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachmentError(null);

    // Limit to 5MB to preserve performance and prevent storage overflow
    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError('Ukuran file maksimal 5 MB');
      e.target.value = '';
      return;
    }

    const isImg = forceType === 'image' || file.type.startsWith('image/');
    const type: 'image' | 'file' = isImg ? 'image' : 'file';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setPendingAttachment({
        url: dataUrl,
        name: file.name,
        type,
        size: formattedSize,
        mime_type: file.type
      });
    };
    reader.onerror = () => {
      setAttachmentError('Gagal membaca berkas. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if ((!textToSend && !pendingAttachment) || isSending || isStudentChatLocked || isTeacherBlocked) return;

    setIsSending(true);
    setAttachmentError(null);
    try {
      db.sendMessage(
        report.id,
        currentUser,
        textToSend,
        pendingAttachment ? {
          url: pendingAttachment.url,
          name: pendingAttachment.name,
          type: pendingAttachment.type,
          size: pendingAttachment.size
        } : undefined
      );
      setInputText('');
      setPendingAttachment(null);
      loadMessages();
      if (onMessageSent) onMessageSent();
      // Also fetch to guarantee server sync
      db.fetchReportMessages(report.id);
    } catch (err: any) {
      console.error('Failed to send message', err);
      setAttachmentError(err?.message || 'Gagal mengirim pesan');
    } finally {
      setIsSending(false);
    }
  };

  // Quick responses templates for teachers to quickly assist students
  const teacherQuickTemplates = [
    'Terima kasih sudah menyampaikan ini. Kami sangat mengapresiasi keberanianmu bercerita.',
    'Bapak/Ibu ingin membantu. Apakah kamu bersedia berdiskusi santai di ruang BK saat jam istirahat?',
    'Laporanmu sudah kami teruskan dan koordinasikan untuk penanganan lebih lanjut ya.',
    'Tetap semangat dan jaga kesehatan. Jika ada perkembangan baru segera kabari kami ya.'
  ];

  return (
    <div className="flex flex-col h-[520px] sm:h-[560px] max-h-[85vh] bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            Percakapan Berbasis Laporan
          </h4>
          <p className="text-xs text-slate-500">
            Komunikasi tertutup dan aman antara siswa dengan {report.assigned_teacher?.role_label || 'Guru'}
          </p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">
          {report.report_code}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Belum ada pesan lanjutan. Mulai percakapan di bawah ini.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === currentUser.id;
            const senderUser = db.getUserById(msg.sender_id);
            const isSenderTeacher = senderUser?.role === 'guru';
            const isFirst = index === 0;

            let senderLabel = senderUser?.name || 'Pengguna';
            if (senderUser?.role === 'siswa') {
              if (report.privacy === 'anonim' && currentUser.role === 'guru') {
                senderLabel = 'Siswa (Anonim)';
              } else {
                senderLabel = `${senderUser.name} (Siswa)`;
              }
            } else if (senderUser?.role === 'guru') {
              const tch = db.getTeacherByUserId(senderUser.id);
              senderLabel = `${senderUser.name} (${tch?.teacher_type === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'})`;
            }

            const hasAttachment = Boolean(msg.attachment_url);
            const isImageAttachment =
              msg.attachment_type === 'image' ||
              (msg.attachment_url && (msg.attachment_url.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(msg.attachment_name || '')));

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-semibold text-slate-600">
                    {isMe ? 'Kamu' : senderLabel}
                  </span>
                  {isFirst && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
                      Deskripsi Awal
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-3.5 text-sm leading-relaxed shadow-xs space-y-2 ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : isSenderTeacher
                      ? 'bg-emerald-50 text-slate-800 border border-emerald-200/80 rounded-bl-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {/* Attachment item in message */}
                  {hasAttachment && msg.attachment_url && (
                    <div className="overflow-hidden rounded-xl">
                      {isImageAttachment ? (
                        <div className="space-y-1.5">
                          <div
                            onClick={() =>
                              setPreviewModalImage({
                                url: msg.attachment_url!,
                                name: msg.attachment_name || 'Foto Lampiran'
                              })
                            }
                            className="relative group cursor-pointer overflow-hidden rounded-xl bg-slate-950/10 border border-black/10"
                          >
                            <img
                              src={msg.attachment_url}
                              alt={msg.attachment_name || 'Lampiran Foto'}
                              className="max-h-60 max-w-full w-auto object-contain rounded-xl transition-transform group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                              <Eye className="w-4 h-4" />
                              <span>Klik untuk memperbesar</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[11px] opacity-90 px-0.5">
                            <span className="truncate max-w-[200px]" title={msg.attachment_name}>
                              {msg.attachment_name || 'Foto'}
                            </span>
                            {msg.attachment_size && (
                              <span className="text-[10px] opacity-75 shrink-0">{msg.attachment_size}</span>
                            )}
                            <a
                              href={msg.attachment_url}
                              download={msg.attachment_name || 'lampiran-foto'}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-1 rounded-lg transition hover:opacity-100 ${
                                isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-700'
                              }`}
                              title="Unduh Gambar"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                            isMe
                              ? 'bg-blue-700/60 border-blue-400/30 text-white'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                isMe ? 'bg-blue-500 text-white' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate max-w-[180px] sm:max-w-[240px]">
                                {msg.attachment_name || 'Berkas Dokumen'}
                              </p>
                              {msg.attachment_size && (
                                <p
                                  className={`text-[10px] ${
                                    isMe ? 'text-blue-200' : 'text-slate-400'
                                  }`}
                                >
                                  {msg.attachment_size}
                                </p>
                              )}
                            </div>
                          </div>

                          <a
                            href={msg.attachment_url}
                            download={msg.attachment_name || 'berkas-lampiran'}
                            target="_blank"
                            rel="noreferrer"
                            className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold shrink-0 transition ${
                              isMe
                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                            title="Unduh Berkas"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Unduh</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message body text */}
                  {msg.message && (
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  )}
                </div>

                {isMe && (
                  <div className="flex items-center gap-1 mt-0.5 px-1 text-[10px] text-slate-400">
                    <CheckCheck className={`w-3 h-3 ${msg.is_read ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span>{msg.is_read ? 'Dibaca' : 'Terkirim'}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Teacher quick responses */}
      {currentUser.role === 'guru' && !isTeacherBlocked && (
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Respons Cepat:
          </span>
          {teacherQuickTemplates.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(tpl)}
              className="text-xs px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-full text-slate-600 transition-colors shrink-0"
            >
              {tpl.slice(0, 32)}...
            </button>
          ))}
        </div>
      )}

      {/* Attachment error banner if any */}
      {attachmentError && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{attachmentError}</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachmentError(null)}
            className="text-rose-600 hover:text-rose-800 font-bold text-xs"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Input box or Locked Notice */}
      {isTeacherBlocked ? (
        <div className="p-4 bg-slate-100/90 border-t border-slate-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900">
              Hak Balas Khusus Guru BK Terpilih
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Laporan ini ditujukan khusus kepada <strong>{report.assigned_teacher_name || 'Guru BK terpilih'}</strong>. Sesuai alur kerja sistem, hanya Guru BK yang dipilih siswa yang dapat membalas pesan siswa pada laporan ini.
            </p>
          </div>
        </div>
      ) : isStudentChatLocked ? (
        <div className="p-4 bg-amber-50/90 border-t border-amber-200/90 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-900">
              Pengiriman Pesan Ditutup untuk Siswa
            </p>
            <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
              Guru telah memperbarui status laporan ini menjadi{' '}
              <strong className="font-bold uppercase tracking-wider">
                {report.status === 'direspons'
                  ? 'Direspons'
                  : report.status === 'ditindaklanjuti'
                  ? 'Ditindaklanjuti'
                  : 'Selesai'}
              </strong>
              . Sesuai alur penanganan resmi, pengiriman pesan obrolan bagi siswa dinonaktifkan setelah status laporan diubah oleh guru.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border-t border-slate-200">
          {/* Pending attachment preview strip */}
          {pendingAttachment && (
            <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {pendingAttachment.type === 'image' ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-blue-200 bg-white shrink-0">
                    <img
                      src={pendingAttachment.url}
                      alt="Pratinjau"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-600 text-white uppercase">
                      {pendingAttachment.type === 'image' ? 'Foto Siap Dikirim' : 'Berkas Siap Dikirim'}
                    </span>
                    <span className="text-[10px] text-slate-400">{pendingAttachment.size}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[320px] mt-0.5">
                    {pendingAttachment.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPendingAttachment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                title="Batalkan Lampiran"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form and toolbar */}
          <form
            onSubmit={handleSend}
            className="p-3 flex items-end gap-2"
          >
            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'image')}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e)}
            />

            {/* Attachment buttons */}
            <div className="flex items-center gap-1 pb-1 shrink-0">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                title="Lampirkan Gambar/Foto (Maks 5MB)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                title="Lampirkan File/Dokumen PDF, Word, dll (Maks 5MB)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                pendingAttachment
                  ? 'Tulis keterangan tambahan (opsional)...'
                  : currentUser.role === 'siswa'
                  ? 'Ketik balasan atau pertanyaan lanjutan...'
                  : 'Tulis tanggapan atau saran untuk siswa...'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !pendingAttachment) || isSending}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 truncate">
                <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-bold truncate">{previewModalImage.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewModalImage.url}
                  download={previewModalImage.name || 'foto-chat'}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalImage(null)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.name}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

