import React from 'react';
import { Trash2, AlertTriangle, X, Users, Shield, GraduationCap, UserCheck } from 'lucide-react';
import { User, Student, Teacher } from '../../types/database';

interface BulkDeleteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedUsers: User[];
  students: Student[];
  teachers: Teacher[];
  isDeleting?: boolean;
}

export const BulkDeleteUsersModal: React.FC<BulkDeleteUsersModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedUsers,
  students,
  teachers,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  const siswaCount = selectedUsers.filter(u => u.role === 'siswa').length;
  const bkCount = selectedUsers.filter(u => {
    if (u.role !== 'guru') return false;
    const t = teachers.find(tech => tech.user_id === u.id);
    return t?.teacher_type === 'guru_bk';
  }).length;
  const waliCount = selectedUsers.filter(u => {
    if (u.role !== 'guru') return false;
    const t = teachers.find(tech => tech.user_id === u.id);
    return t?.teacher_type === 'wali_kelas';
  }).length;
  const adminCount = selectedUsers.filter(u => u.role === 'admin').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden space-y-4 p-6 my-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Hapus {selectedUsers.length} Pengguna Terpilih?
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus data <strong>{selectedUsers.length} pengguna</strong> ini secara permanen dari sistem SAPA?
          </p>
        </div>

        {/* Breakdown of selected users */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-700 block">Rincian Pengguna yang Dipilih:</span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {siswaCount > 0 && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-blue-50 text-blue-900 font-semibold border border-blue-100">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{siswaCount} Siswa</span>
              </div>
            )}
            {bkCount > 0 && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-50 text-purple-900 font-semibold border border-purple-100">
                <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{bkCount} Guru BK</span>
              </div>
            )}
            {waliCount > 0 && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-teal-50 text-teal-900 font-semibold border border-teal-100">
                <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{waliCount} Wali Kelas</span>
              </div>
            )}
            {adminCount > 0 && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 text-slate-900 font-semibold border border-slate-200">
                <Users className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>{adminCount} Admin</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview of first few users */}
        <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          {selectedUsers.slice(0, 5).map(u => (
            <div key={u.id} className="flex items-center justify-between text-[11px] px-2 py-1 bg-white rounded-lg border border-slate-100">
              <span className="font-bold text-slate-800 truncate max-w-[200px]">{u.name}</span>
              <span className="text-slate-400 font-mono text-[10px] uppercase">{u.role}</span>
            </div>
          ))}
          {selectedUsers.length > 5 && (
            <p className="text-[10px] text-center text-slate-400 pt-1">
              ...dan {selectedUsers.length - 5} pengguna lainnya
            </p>
          )}
        </div>

        {/* Warning alert */}
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-tight">
            Data profil, relasi kelas, dan kredensial pengguna akan dihapus. Laporan pengaduan yang ada tetap tersimpan secara aman.
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Menghapus...' : `Ya, Hapus ${selectedUsers.length} Pengguna`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
