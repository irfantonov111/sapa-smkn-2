import React, { useState } from 'react';
import {
  X,
  School,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Users,
  Shield,
  UserCheck,
  Check,
  GraduationCap
} from 'lucide-react';
import { SchoolClass, Teacher, User, Student } from '../../types/database';
import { db } from '../../services/db';
import { decryptNip, maskNip } from '../../utils/nipCrypto';

interface AdminClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: SchoolClass[];
  teachers: Teacher[];
  users: User[];
  students: Student[];
  onRefresh: () => void;
}

export const AdminClassesModal: React.FC<AdminClassesModalProps> = ({
  isOpen,
  onClose,
  classes,
  teachers,
  users,
  students,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'bk_assignment'>('classes');

  // Add Class Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('10');
  const [newClassMajor, setNewClassMajor] = useState('Teknik Komputer & Jaringan (TKJ)');
  const [newClassHomeroom, setNewClassHomeroom] = useState('');
  const [newClassBkTeacher, setNewClassBkTeacher] = useState('');

  // Edit Class State
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassGrade, setEditClassGrade] = useState('10');
  const [editClassMajor, setEditClassMajor] = useState('');
  const [editClassHomeroom, setEditClassHomeroom] = useState('');
  const [editClassBkTeacher, setEditClassBkTeacher] = useState('');

  // BK Assignment State: mapping of teacherId -> string[] (class IDs)
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedClassIdsForTeacher, setSelectedClassIdsForTeacher] = useState<string[]>([]);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const bkTeachers = teachers.filter(t => t.teacher_type === 'guru_bk');
  const homeroomTeachers = teachers.filter(t => t.teacher_type === 'wali_kelas');

  // Handle Add Class
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClassName.trim();
    if (!trimmed) {
      showNotification('Nama kelas wajib diisi.', 'error');
      return;
    }

    // Check duplicate
    const exists = classes.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showNotification(`Kelas dengan nama "${trimmed}" sudah ada.`, 'error');
      return;
    }

    db.addClass({
      name: trimmed,
      grade: newClassGrade,
      major: newClassMajor.trim() || 'Umum',
      homeroom_teacher_id: newClassHomeroom || null,
      bk_teacher_id: newClassBkTeacher || undefined
    });

    onRefresh();
    showNotification(`Kelas ${trimmed} berhasil ditambahkan ke sistem.`);
    setNewClassName('');
    setNewClassHomeroom('');
    setNewClassBkTeacher('');
    setShowAddForm(false);
  };

  // Start Edit Class
  const handleStartEditClass = (cls: SchoolClass) => {
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditClassGrade(cls.grade);
    setEditClassMajor(cls.major);
    setEditClassHomeroom(cls.homeroom_teacher_id || '');
    setEditClassBkTeacher(cls.bk_teacher_id || '');
  };

  // Save Edit Class
  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    const trimmed = editClassName.trim();
    if (!trimmed) {
      showNotification('Nama kelas tidak boleh kosong.', 'error');
      return;
    }

    db.updateClass(editingClass.id, {
      name: trimmed,
      grade: editClassGrade,
      major: editClassMajor.trim(),
      homeroom_teacher_id: editClassHomeroom || null,
      bk_teacher_id: editClassBkTeacher || undefined
    });

    onRefresh();
    showNotification(`Perubahan pada kelas ${trimmed} berhasil disimpan.`);
    setEditingClass(null);
  };

  // Delete Class
  const handleDeleteClass = (cls: SchoolClass) => {
    const studentCount = students.filter(s => s.class_id === cls.id).length;
    if (studentCount > 0) {
      showNotification(
        `Kelas "${cls.name}" tidak dapat dihapus karena masih ada ${studentCount} siswa terdaftar. Pindahkan siswa terlebih dahulu.`,
        'error'
      );
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${cls.name}" dari sistem?`)) {
      const res = db.deleteClass(cls.id);
      if (res.success) {
        onRefresh();
        showNotification(`Kelas "${cls.name}" berhasil dihapus.`);
      } else {
        showNotification(res.message || 'Gagal menghapus kelas.', 'error');
      }
    }
  };

  // Handle selecting a Guru BK to configure assigned classes
  const handleOpenBkAssignment = (teacher: Teacher) => {
    setSelectedTeacherId(teacher.id);
    const existingAssignments = teacher.assigned_class_ids || [];
    setSelectedClassIdsForTeacher([...existingAssignments]);
  };

  // Toggle class selection for BK teacher (flexible according to admin assignment)
  const handleToggleClassForTeacher = (classId: string) => {
    if (selectedClassIdsForTeacher.includes(classId)) {
      setSelectedClassIdsForTeacher(prev => prev.filter(id => id !== classId));
    } else {
      setSelectedClassIdsForTeacher(prev => [...prev, classId]);
    }
  };

  // Save BK Class Assignment
  const handleSaveBkAssignment = () => {
    if (!selectedTeacherId) return;

    const res = db.assignBkClasses(selectedTeacherId, selectedClassIdsForTeacher);
    if (res.success) {
      onRefresh();
      const teacherUser = users.find(u => {
        const t = teachers.find(tech => tech.id === selectedTeacherId);
        return u.id === t?.user_id;
      });
      showNotification(
        `Penugasan ${selectedClassIdsForTeacher.length} kelas untuk ${teacherUser?.name || 'Guru BK'} berhasil disimpan.`
      );
      setSelectedTeacherId('');
    } else {
      showNotification(res.message || 'Gagal menyimpan penugasan kelas.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>Manajemen Kelas & Guru BK</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                  {classes.length} Kelas
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tambah kelas baru dan atur penugasan rombel kelas yang diampu oleh setiap Guru BK
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('classes')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'classes'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Daftar Kelas ({classes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bk_assignment')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'bk_assignment'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Penugasan Guru BK</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-3 rounded-2xl text-xs flex items-center gap-2 shrink-0 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'classes' && (
            <div className="space-y-6">
              {/* Add Class Accordion / Button */}
              {!showAddForm ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Tambah Kelas Baru</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tambahkan rombel kelas baru (misal: 10 TKJ A, 10 TKJ B, 11 TKJ A) ke dalam sistem SAPA
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Kelas</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleAddClass}
                  className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                    <h3 className="font-bold text-purple-950 text-xs sm:text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-purple-600" />
                      <span>Form Tambah Kelas Baru</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Nama Kelas <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 10 TKJ A / 11 TKP"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Tingkat / Tingkatan
                      </label>
                      <select
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="10">Kelas 10 (Sepuluh)</option>
                        <option value="11">Kelas 11 (Sebelas)</option>
                        <option value="12">Kelas 12 (Dua Belas)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Jurusan (Konsentrasi Keahlian)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Teknik Komputer & Jaringan"
                        value={newClassMajor}
                        onChange={(e) => setNewClassMajor(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Wali Kelas (Opsional)
                      </label>
                      <select
                        value={newClassHomeroom}
                        onChange={(e) => setNewClassHomeroom(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">-- Belum Ditentukan --</option>
                        {homeroomTeachers.map(t => {
                          const u = users.find(usr => usr.id === t.user_id);
                          return (
                            <option key={t.id} value={t.id}>
                              {u?.name || 'Wali Kelas'} (NIP: {decryptNip(t.nip)})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Guru BK Pengampu (Opsional)
                      </label>
                      <select
                        value={newClassBkTeacher}
                        onChange={(e) => setNewClassBkTeacher(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">-- Belum Ditentukan --</option>
                        {bkTeachers.map(t => {
                          const u = users.find(usr => usr.id === t.user_id);
                          const currentCount = t.assigned_class_ids?.length || 0;
                          return (
                            <option key={t.id} value={t.id}>
                              {u?.name || 'Guru BK'} - Mengampu {currentCount} kelas
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                    >
                      Simpan Kelas
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Class Modal / Inline Form */}
              {editingClass && (
                <form
                  onSubmit={handleSaveEditClass}
                  className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <h3 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-amber-600" />
                      <span>Edit Rombel Kelas: {editingClass.name}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingClass(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Nama Kelas <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editClassName}
                        onChange={(e) => setEditClassName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Tingkat
                      </label>
                      <select
                        value={editClassGrade}
                        onChange={(e) => setEditClassGrade(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="10">Kelas 10</option>
                        <option value="11">Kelas 11</option>
                        <option value="12">Kelas 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Jurusan
                      </label>
                      <input
                        type="text"
                        value={editClassMajor}
                        onChange={(e) => setEditClassMajor(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Wali Kelas
                      </label>
                      <select
                        value={editClassHomeroom}
                        onChange={(e) => setEditClassHomeroom(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">-- Belum Ada Wali Kelas --</option>
                        {homeroomTeachers.map(t => {
                          const u = users.find(usr => usr.id === t.user_id);
                          return (
                            <option key={t.id} value={t.id}>
                              {u?.name || 'Wali Kelas'} (NIP: {decryptNip(t.nip)})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Guru BK Pengampu
                      </label>
                      <select
                        value={editClassBkTeacher}
                        onChange={(e) => setEditClassBkTeacher(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">-- Belum Ada Guru BK --</option>
                        {bkTeachers.map(t => {
                          const u = users.find(usr => usr.id === t.user_id);
                          const currentAssigned = t.assigned_class_ids || [];
                          const count = currentAssigned.length;
                          return (
                            <option
                              key={t.id}
                              value={t.id}
                            >
                              {u?.name || 'Guru BK'} (Mengampu {count} kelas)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingClass(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              )}

              {/* Class List Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                      <th className="p-3.5">Nama Kelas</th>
                      <th className="p-3.5">Tingkat & Jurusan</th>
                      <th className="p-3.5">Wali Kelas</th>
                      <th className="p-3.5">Guru BK Pengampu</th>
                      <th className="p-3.5 text-center">Jumlah Siswa</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {classes.map((cls) => {
                      const studentCount = students.filter(s => s.class_id === cls.id).length;
                      const homeroom = homeroomTeachers.find(
                        t => t.id === cls.homeroom_teacher_id || t.user_id === cls.homeroom_teacher_id
                      );
                      const homeroomUser = homeroom ? users.find(u => u.id === homeroom.user_id) : undefined;

                      const bkTeacher = bkTeachers.find(
                        t => t.id === cls.bk_teacher_id || t.user_id === cls.bk_teacher_id || t.assigned_class_ids?.includes(cls.id)
                      );
                      const bkUser = bkTeacher ? users.find(u => u.id === bkTeacher.user_id) : undefined;

                      return (
                        <tr key={cls.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>{cls.name}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800">Kelas {cls.grade}</span>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">{cls.major}</p>
                          </td>

                          <td className="p-3.5">
                            {homeroomUser ? (
                              <div className="flex items-center gap-1.5 text-teal-800">
                                <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                <span className="font-semibold">{homeroomUser.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Belum ditentukan</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            {bkUser ? (
                              <div className="flex items-center gap-1.5 text-purple-800">
                                <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                <span className="font-semibold">{bkUser.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Belum ditentukan</span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-xs inline-flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-blue-600" />
                              <span>{studentCount} Siswa</span>
                            </span>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartEditClass(cls)}
                                title="Edit Rombel Kelas"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClass(cls)}
                                title="Hapus Kelas"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bk_assignment' && (
            <div className="space-y-6">
              {/* Instructions banner */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-900 leading-relaxed">
                  <p className="font-bold text-purple-950">Aturan Penugasan Guru BK:</p>
                  <p className="mt-0.5">
                    Jumlah kelas yang diampu oleh Guru BK sepenuhnya fleksibel tergantung dari jumlah kelas yang ditambahkan dan ditugaskan oleh admin (misal: 3 kelas, 4 kelas, atau berapapun sesuai kebutuhan sekolah).
                    Laporan pengaduan dan rekap mood siswa dari kelas-kelas binaan ini akan diprioritaskan masuk ke portal Guru BK bersangkutan.
                  </p>
                </div>
              </div>

              {/* Assignment Form Modal / Inline when a teacher is selected */}
              {selectedTeacherId && (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-200/80">
                    <div>
                      {(() => {
                        const targetTeacher = teachers.find(t => t.id === selectedTeacherId);
                        const targetUser = users.find(u => u.id === targetTeacher?.user_id);
                        return (
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                              <span>Atur Kelas Binaan untuk:</span>
                              <span className="text-purple-700">{targetUser?.name}</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Pilih rombel kelas yang diampu oleh Guru BK ini.
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-200/80 text-purple-900 font-extrabold text-xs">
                        {selectedClassIdsForTeacher.length} Kelas Terpilih
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedTeacherId('')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Class Selection Chips/Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {classes.map(cls => {
                      const isSelected = selectedClassIdsForTeacher.includes(cls.id);

                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => handleToggleClassForTeacher(cls.id)}
                          className={`p-3 rounded-2xl text-left border transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-xs">{cls.name}</p>
                            <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                              {cls.major}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ml-2 border ${
                              isSelected
                                ? 'bg-white text-purple-600 border-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTeacherId('')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBkAssignment}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                    >
                      Simpan Kelas Binaan
                    </button>
                  </div>
                </div>
              )}

              {/* List of 10 Guru BK with their assigned classes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bkTeachers.map(teacher => {
                  const teacherUser = users.find(u => u.id === teacher.user_id);
                  const assignedIds = teacher.assigned_class_ids || [];
                  const assignedClasses = classes.filter(c => assignedIds.includes(c.id));
                  const isEditingThis = selectedTeacherId === teacher.id;

                  return (
                    <div
                      key={teacher.id}
                      className={`p-5 rounded-3xl border transition space-y-3 bg-white shadow-xs ${
                        isEditingThis
                          ? 'ring-2 ring-purple-600 border-purple-300'
                          : 'border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              teacherUser?.avatar ||
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
                            }
                            alt={teacherUser?.name || 'Guru BK'}
                            className="w-10 h-10 rounded-2xl object-cover border border-purple-100"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                              {teacherUser?.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              NIP: {decryptNip(teacher.nip)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBkAssignment(teacher)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Ubah Kelas</span>
                        </button>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Kelas yang Diampu:</span>
                          <span className="font-bold text-purple-800 text-[11px]">
                            {assignedClasses.length} Kelas Diampu
                          </span>
                        </div>

                        {assignedClasses.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">
                            Belum ada kelas yang ditugaskan. Klik "Ubah Kelas" untuk menambahkan.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {assignedClasses.map(c => (
                              <span
                                key={c.id}
                                className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-900 text-xs font-bold shadow-2xs flex items-center gap-1"
                              >
                                <School className="w-3 h-3 text-purple-500" />
                                <span>{c.name}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {teacher.specialization || 'Konseling Siswa & Bimbingan Karir'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Sistem Layanan Bimbingan Konseling & Pengaduan Siswa (SAPA)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
