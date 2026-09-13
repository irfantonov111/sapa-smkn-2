import React, { useState, useEffect, useRef } from 'react';
import { Send, UserCheck, Sparkles, Clock, CheckCheck, Lock } from 'lucide-react';
import { User, Message, EnrichedReport } from '../types/database';
import { db } from '../services/db';

interface ReportChatProps {
  report: EnrichedReport;
  currentUser: User;
  onMessageSent?: () => void;
}

export const ReportChat: React.FC<ReportChatProps> = ({ report, currentUser, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
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
      // Only update state if count changed or different IDs to avoid jitter
      if (prev.length !== list.length) {
        return list;
      }
      return prev;
    });
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
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

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending || isStudentChatLocked || isTeacherBlocked) return;

    setIsSending(true);
    try {
      db.sendMessage(report.id, currentUser, inputText.trim());
      setInputText('');
      loadMessages();
      if (onMessageSent) onMessageSent();
    } catch (err) {
      console.error('Failed to send message', err);
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
    <div className="flex flex-col h-[520px] bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden">
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
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : isSenderTeacher
                      ? 'bg-emerald-50 text-slate-800 border border-emerald-200/80 rounded-bl-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
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
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-slate-200 flex items-end gap-2"
        >
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentUser.role === 'siswa'
                ? 'Ketik balasan atau pertanyaan lanjutan untuk guru...'
                : 'Tulis tanggapan / saran tindak lanjut untuk siswa...'
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
            disabled={!inputText.trim() || isSending}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
};
