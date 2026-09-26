import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
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
  GraduationCap,
  Search,
  Download,
  X,
  ArrowRightLeft,
  UserPlus,
  Filter
} from 'lucide-react';
import { SchoolClass, Teacher, User, Student } from '../../types/database';
import { db } from '../../services/db';
import { decryptNip } from '../../utils/nipCrypto';
import { getDefaultAvatarByGender } from '../../utils/avatar2d';
import { ResponsiveTableContainer } from '../common/ResponsiveTableContainer';

interface AdminClassesTabProps {
  classes: SchoolClass[];
  teachers: Teacher[];
  users: User[];
  students: Student[];
  onRefresh: () => void;
}

export const AdminClassesTab: React.FC<AdminClassesTabProps> = ({
  classes,
  teachers,
  users,
  students,
  onRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'bk_assignment' | 'homeroom_assignment'>('classes');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '10' | '11' | '12'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'no_wali' | 'no_bk'>('all');

  // Add Class Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('10');
  const [newClassMajor, setNewClassMajor] = useState('Pengembangan Perangkat Lunak & Gim (PPLG)');
  const [newClassHomeroom, setNewClassHomeroom] = useState('');
  const [newClassBkTeacher, setNewClassBkTeacher] = useState('');

  // Edit Class State
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassGrade, setEditClassGrade] = useState('10');
  const [editClassMajor, setEditClassMajor] = useState('');
  const [editClassHomeroom, setEditClassHomeroom] = useState('');
  const [editClassBkTeacher, setEditClassBkTeacher] = useState('');

  // Manage Students in Class Modal State
  const [managingStudentsClass, setManagingStudentsClass] = useState<SchoolClass | null>(null);
  const [studentSearchInModal, setStudentSearchInModal] = useState('');
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('');
  const [targetMoveClassId, setTargetMoveClassId] = useState<Record<string, string>>({});

  // BK Assignment State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedClassIdsForTeacher, setSelectedClassIdsForTeacher] = useState<string[]>([]);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  const bkTeachers = useMemo(() => teachers.filter(t => t.teacher_type === 'guru_bk'), [teachers]);
  const homeroomTeachers = useMemo(() => teachers.filter(t => t.teacher_type === 'wali_kelas'), [teachers]);

  // Helper to resolve Wali Kelas and Guru BK for a class
  const getClassTeachers = (cls: SchoolClass) => {
    const homeroom = homeroomTeachers.find(
      t => t.id === cls.homeroom_teacher_id || t.user_id === cls.homeroom_teacher_id || t.managed_class_id === cls.id
    );
    const homeroomUser = homeroom ? users.find(u => u.id === homeroom.user_id) : undefined;

    const bkTeacher = bkTeachers.find(
      t => t.id === cls.bk_teacher_id || t.user_id === cls.bk_teacher_id || t.assigned_class_ids?.includes(cls.id)
    );
    const bkUser = bkTeacher ? users.find(u => u.id === bkTeacher.user_id) : undefined;

    return { homeroom, homeroomUser, bkTeacher, bkUser };
  };

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      if (gradeFilter !== 'all' && cls.grade !== gradeFilter) return false;

      const { homeroom, homeroomUser, bkTeacher, bkUser } = getClassTeachers(cls);

      if (statusFilter === 'complete' && (!homeroom || !bkTeacher)) return false;
      if (statusFilter === 'no_wali' && homeroom) return false;
      if (statusFilter === 'no_bk' && bkTeacher) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = cls.name.toLowerCase().includes(q);
        const matchMajor = (cls.major || '').toLowerCase().includes(q);
        const matchWali = (homeroomUser?.name || '').toLowerCase().includes(q);
        const matchBk = (bkUser?.name || '').toLowerCase().includes(q);
        return matchName || matchMajor || matchWali || matchBk;
      }

      return true;
    });
  }, [classes, gradeFilter, statusFilter, searchQuery, homeroomTeachers, bkTeachers, users]);

  // Summary counts
  const classesWithWaliCount = useMemo(
    () => classes.filter(c => getClassTeachers(c).homeroom !== undefined).length,
    [classes, homeroomTeachers, users]
  );
  const classesWithBkCount = useMemo(
    () => classes.filter(c => getClassTeachers(c).bkTeacher !== undefined).length,
    [classes, bkTeachers, users]
  );

  // Handle Add Class
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClassName.trim();
    if (!trimmed) {
      showNotification('Nama kelas wajib diisi.', 'error');
      return;
    }

    const exists = classes.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showNotification(`Kelas dengan nama "${trimmed}" sudah terdaftar di sistem.`, 'error');
      return;
    }

    const created = db.addClass({
      name: trimmed,
      grade: newClassGrade,
      major: newClassMajor.trim() || 'Umum',
      homeroom_teacher_id: newClassHomeroom || null,
      bk_teacher_id: newClassBkTeacher || undefined
    });

    if (newClassHomeroom) {
      db.updateTeacher(newClassHomeroom, { managed_class_id: created.id });
    }

    onRefresh();
    showNotification(`Kelas ${trimmed} berhasil ditambahkan ke sistem.`);
    setNewClassName('');
    setNewClassHomeroom('');
    setNewClassBkTeacher('');
    setShowAddForm(false);
  };

  // Start Edit Class
  const handleStartEditClass = (cls: SchoolClass) => {
    const { homeroom, bkTeacher } = getClassTeachers(cls);
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditClassGrade(cls.grade || '10');
    setEditClassMajor(cls.major || '');
    setEditClassHomeroom(homeroom?.id || cls.homeroom_teacher_id || '');
    setEditClassBkTeacher(bkTeacher?.id || cls.bk_teacher_id || '');
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

    const duplicate = classes.some(
      c => c.id !== editingClass.id && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      showNotification(`Kelas dengan nama "${trimmed}" sudah digunakan kelas lain.`, 'error');
      return;
    }

    db.updateClass(editingClass.id, {
      name: trimmed,
      grade: editClassGrade,
      major: editClassMajor.trim() || 'Umum',
      homeroom_teacher_id: editClassHomeroom || null,
      bk_teacher_id: editClassBkTeacher || undefined
    });

    if (editClassHomeroom) {
      db.updateTeacher(editClassHomeroom, { managed_class_id: editingClass.id });
    }

    onRefresh();
    showNotification(`Perubahan pada kelas ${trimmed} berhasil disimpan.`);
    setEditingClass(null);
  };

  // Delete Class
  const handleDeleteClass = (cls: SchoolClass) => {
    const studentCount = students.filter(s => s.class_id === cls.id).length;
    if (studentCount > 0) {
      showNotification(
        `Kelas "${cls.name}" masih memiliki ${studentCount} siswa aktif. Pindahkan siswa terlebih dahulu melalui tombol "Kelola Siswa".`,
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

  // Export Classes to Excel
  const handleExportClassesExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows: (string | number)[][] = [
      ['Nama Kelas', 'Tingkat (10/11/12)', 'Jurusan', 'Wali Kelas (Nama / NIP)', 'Guru BK (Nama / NIP)', 'Tahun Ajaran', 'Jumlah Siswa']
    ];

    classes.forEach(cls => {
      const { homeroom, homeroomUser, bkTeacher, bkUser } = getClassTeachers(cls);
      const count = students.filter(s => s.class_id === cls.id).length;
      const waliStr = homeroomUser && homeroom ? `${homeroomUser.name} (${decryptNip(homeroom.nip)})` : '-';
      const bkStr = bkUser && bkTeacher ? `${bkUser.name} (${decryptNip(bkTeacher.nip)})` : '-';
      rows.push([
        cls.name,
        cls.grade || '10',
        cls.major || 'Umum',
        waliStr,
        bkStr,
        '2024/2025',
        count
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 36 },
      { wch: 34 },
      { wch: 34 },
      { wch: 16 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Data Kelas');

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    XLSX.writeFile(wb, `Data_Rombel_Kelas_SAPA_${dateStr}.xlsx`);
    showNotification(`Berhasil mengekspor ${classes.length} data rombel kelas ke format Excel.`);
  };

  // BK Assignment Handlers
  const handleOpenBkAssignment = (teacher: Teacher) => {
    setSelectedTeacherId(teacher.id);
    const assigned = classes
      .filter(c => teacher.assigned_class_ids?.includes(c.id) || c.bk_teacher_id === teacher.id || c.bk_teacher_id === teacher.user_id)
      .map(c => c.id);
    setSelectedClassIdsForTeacher(Array.from(new Set([...(teacher.assigned_class_ids || []), ...assigned])));
  };

  const handleToggleClassForTeacher = (classId: string) => {
    setSelectedClassIdsForTeacher(prev =>
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    );
  };

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
        `Penugasan ${selectedClassIdsForTeacher.length} kelas binaan untuk ${teacherUser?.name || 'Guru BK'} berhasil disimpan.`
      );
      setSelectedTeacherId('');
    } else {
      showNotification(res.message || 'Gagal menyimpan penugasan kelas.', 'error');
    }
  };

  // Homeroom Assignment Handler
  const handleAssignHomeroomToClass = (teacherId: string, newClassId: string) => {
    // Clear previous class assigned to this homeroom teacher
    classes.forEach(c => {
      if (c.homeroom_teacher_id === teacherId && c.id !== newClassId) {
        db.updateClass(c.id, { homeroom_teacher_id: null });
      }
    });

    if (newClassId) {
      db.updateClass(newClassId, { homeroom_teacher_id: teacherId });
      db.updateTeacher(teacherId, { managed_class_id: newClassId });
    } else {
      db.updateTeacher(teacherId, { managed_class_id: '' });
    }

    onRefresh();
    const tObj = teachers.find(t => t.id === teacherId);
    const uObj = tObj ? users.find(u => u.id === tObj.user_id) : undefined;
    const cObj = classes.find(c => c.id === newClassId);
    showNotification(
      newClassId
        ? `${uObj?.name || 'Wali Kelas'} berhasil ditugaskan sebagai Wali Kelas ${cObj?.name || ''}.`
        : `Penugasan kelas untuk ${uObj?.name || 'Wali Kelas'} telah dilepas.`
    );
  };

  // Move Student to another Class
  const handleMoveStudentClass = (studentId: string, destClassId: string) => {
    if (!destClassId) return;
    const st = students.find(s => s.id === studentId);
    const stUser = st ? users.find(u => u.id === st.user_id) : undefined;
    const destCls = classes.find(c => c.id === destClassId);
    if (!st || !destCls) return;

    db.updateStudent(studentId, { class_id: destClassId });
    onRefresh();
    showNotification(`Siswa ${stUser?.name || st.nis} berhasil dipindahkan ke kelas ${destCls.name}.`);
  };

  // Add existing Student to current Class
  const handleAddExistingStudentToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingStudentsClass || !selectedStudentToAdd) return;
    const st = students.find(s => s.id === selectedStudentToAdd);
    const stUser = st ? users.find(u => u.id === st.user_id) : undefined;
    if (!st) return;

    db.updateStudent(st.id, { class_id: managingStudentsClass.id });
    setSelectedStudentToAdd('');
    onRefresh();
    showNotification(`Siswa ${stUser?.name || st.nis} berhasil dimasukkan ke kelas ${managingStudentsClass.name}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Rombel Kelas</span>
            <School className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{classes.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Kelas 10: {classes.filter(c => c.grade === '10').length} • Kelas 11: {classes.filter(c => c.grade === '11').length} • Kelas 12: {classes.filter(c => c.grade === '12').length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Siswa di Kelas</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{students.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Rata-rata {classes.length > 0 ? Math.round(students.length / classes.length) : 0} siswa per kelas
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-700">Wali Kelas Terpasang</span>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {classesWithWaliCount} <span className="text-sm font-semibold text-slate-400">/ {classes.length}</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {classes.length - classesWithWaliCount === 0
              ? 'Semua kelas memiliki Wali Kelas'
              : `${classes.length - classesWithWaliCount} kelas belum ada Wali Kelas`}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Guru BK Terpasang</span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {classesWithBkCount} <span className="text-sm font-semibold text-slate-400">/ {classes.length}</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {classes.length - classesWithBkCount === 0
              ? 'Semua kelas memiliki Guru BK'
              : `${classes.length - classesWithBkCount} kelas belum ada Guru BK`}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
        {/* Header & Primary Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-purple-600" />
              <span>Manajemen Kelas & Penugasan Binaan ({classes.length} Rombel)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola daftar rombongan belajar (rombel), atur Wali Kelas, pembagian kelas binaan Guru BK, serta anggota siswa tiap kelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportClassesExcel}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data Kelas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setActiveSubTab('classes');
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Kelas Baru</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'classes'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Daftar Rombel Kelas ({classes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bk_assignment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'bk_assignment'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Penugasan Kelas Binaan Guru BK ({bkTeachers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('homeroom_assignment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'homeroom_assignment'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pemetaan Wali Kelas ({homeroomTeachers.length})</span>
          </button>
        </div>

        {/* Notification Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
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
            <span className="font-semibold">{feedback.message}</span>
          </div>
        )}

        {/* TAB 1: DAFTAR ROMBEL KELAS */}
        {activeSubTab === 'classes' && (
          <div className="space-y-5">
            {/* Add Class Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddClass}
                className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 shadow-xs animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <h4 className="font-bold text-purple-950 text-xs sm:text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-purple-600" />
                    <span>Form Tambah Rombel Kelas Baru</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Tutup
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
                      placeholder="Contoh: X PPLG 1 / XI TKJ 2"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Tingkat Kelas
                    </label>
                    <select
                      value={newClassGrade}
                      onChange={(e) => setNewClassGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="10">Kelas 10 (X)</option>
                      <option value="11">Kelas 11 (XI)</option>
                      <option value="12">Kelas 12 (XII)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Jurusan / Kompetensi Keahlian
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
                      Wali Kelas Pengampu
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
                      Guru BK Pembina Kelas
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
                            {u?.name || 'Guru BK'} (Mengampu {currentCount} kelas)
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
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Simpan Kelas Baru
                  </button>
                </div>
              </form>
            )}

            {/* Edit Class Inline Form */}
            {editingClass && (
              <form
                onSubmit={handleSaveEditClass}
                className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4 shadow-xs animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <h4 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-amber-600" />
                    <span>Edit Rombel Kelas: {editingClass.name}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingClass(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
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
                      <option value="10">Kelas 10 (X)</option>
                      <option value="11">Kelas 11 (XI)</option>
                      <option value="12">Kelas 12 (XII)</option>
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
                        const count = (t.assigned_class_ids || []).length;
                        return (
                          <option key={t.id} value={t.id}>
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
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* Filters & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Grade Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                {(['all', '10', '11', '12'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeFilter(g)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      gradeFilter === g
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g === 'all' ? `Semua Tingkat (${classes.length})` : `Kelas ${g} (${classes.filter(c => c.grade === g).length})`}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Kelas</option>
                    <option value="complete">Lengkap (Wali & BK)</option>
                    <option value="no_wali">Belum Ada Wali Kelas</option>
                    <option value="no_bk">Belum Ada Guru BK</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari kelas, jurusan, wali, guru BK..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Classes Table */}
            <ResponsiveTableContainer
              tableId="admin-classes-table"
              minWidth="820px"
              maxHeight="600px"
              hasData={filteredClasses.length > 0}
            >
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                    <th className="p-3.5">Nama Kelas</th>
                    <th className="p-3.5">Tingkat & Jurusan</th>
                    <th className="p-3.5">Wali Kelas</th>
                    <th className="p-3.5">Guru BK Pengampu</th>
                    <th className="p-3.5 text-center">Anggota Siswa</th>
                    <th className="p-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Tidak ada data rombel kelas yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map(cls => {
                      const studentCount = students.filter(s => s.class_id === cls.id).length;
                      const { homeroom, homeroomUser, bkTeacher, bkUser } = getClassTeachers(cls);

                      return (
                        <tr key={cls.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                              <span>{cls.name}</span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                              Kelas {cls.grade || '10'}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">{cls.major || 'Umum'}</p>
                          </td>

                          <td className="p-3.5">
                            {homeroomUser && homeroom ? (
                              <div>
                                <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                                  <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                  <span>{homeroomUser.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono block pl-5">
                                  NIP: {decryptNip(homeroom.nip)}
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditClass(cls)}
                                className="text-[11px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer"
                              >
                                + Pilih Wali Kelas
                              </button>
                            )}
                          </td>

                          <td className="p-3.5">
                            {bkUser && bkTeacher ? (
                              <div>
                                <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                                  <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  <span>{bkUser.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono block pl-5">
                                  NIP: {decryptNip(bkTeacher.nip)}
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditClass(cls)}
                                className="text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer"
                              >
                                + Pilih Guru BK
                              </button>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setManagingStudentsClass(cls);
                                setStudentSearchInModal('');
                                setSelectedStudentToAdd('');
                              }}
                              title="Klik untuk melihat dan mengelola daftar siswa di kelas ini"
                              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                              <span>{studentCount} Siswa</span>
                            </button>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setManagingStudentsClass(cls);
                                  setStudentSearchInModal('');
                                  setSelectedStudentToAdd('');
                                }}
                                title="Kelola Anggota Siswa Kelas"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer"
                              >
                                <Users className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEditClass(cls)}
                                title="Edit Rombel Kelas"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition border border-transparent hover:border-amber-200 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClass(cls)}
                                title="Hapus Kelas"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </ResponsiveTableContainer>
          </div>
        )}

        {/* TAB 2: PENUGASAN KELAS BINAAN GURU BK */}
        {activeSubTab === 'bk_assignment' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-900 leading-relaxed">
                <p className="font-bold text-purple-950">Pengaturan Kelas Binaan Guru BK:</p>
                <p className="mt-0.5">
                  Setiap Guru BK dapat mengampu satu atau beberapa kelas binaan sekaligus. Laporan pengaduan, jadwal konseling, dan rekap mood siswa dari kelas-kelas binaan tersebut akan otomatis terhubung ke Guru BK yang bersangkutan.
                </p>
              </div>
            </div>

            {selectedTeacherId && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 space-y-4 shadow-sm animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-purple-200/80">
                  <div>
                    {(() => {
                      const targetTeacher = teachers.find(t => t.id === selectedTeacherId);
                      const targetUser = users.find(u => u.id === targetTeacher?.user_id);
                      return (
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span>Pilih Kelas Binaan untuk:</span>
                            <span className="text-purple-700">{targetUser?.name}</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Klik pada kartu kelas di bawah ini untuk memilih atau membatalkan kelas binaan.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-200/80 text-purple-900 font-extrabold text-xs">
                      {selectedClassIdsForTeacher.length} Kelas Dipilih
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {classes.map(cls => {
                    const isSelected = selectedClassIdsForTeacher.includes(cls.id);
                    const count = students.filter(s => s.class_id === cls.id).length;

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
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-xs truncate">{cls.name}</p>
                          <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                            {count} Siswa • {cls.major}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
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
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Simpan Kelas Binaan
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bkTeachers.map(teacher => {
                const teacherUser = users.find(u => u.id === teacher.user_id);
                const assignedClasses = classes.filter(
                  c => teacher.assigned_class_ids?.includes(c.id) || c.bk_teacher_id === teacher.id || c.bk_teacher_id === teacher.user_id
                );
                const totalStudentsInAssigned = students.filter(s =>
                  assignedClasses.some(c => c.id === s.class_id)
                ).length;
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
                            getDefaultAvatarByGender('guru', teacherUser?.gender || teacher.gender)
                          }
                          alt={teacherUser?.name || 'Guru BK'}
                          className="w-10 h-10 rounded-2xl object-cover border border-purple-100"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {teacherUser?.name || 'Guru BK'}
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
                        <span>Atur Kelas Binaan</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Kelas Binaan Aktif:</span>
                        <span className="font-bold text-purple-800 text-[11px]">
                          {assignedClasses.length} Kelas ({totalStudentsInAssigned} Siswa)
                        </span>
                      </div>

                      {assignedClasses.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">
                          Belum ada kelas binaan yang ditugaskan. Klik "Atur Kelas Binaan" untuk memilih kelas.
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
                      Spesialisasi: {teacher.specialization || 'Konseling Siswa & Bimbingan Karir'} • {teacher.room || 'Ruang BK'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PEMETAAN WALI KELAS */}
        {activeSubTab === 'homeroom_assignment' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-teal-900 leading-relaxed">
                <p className="font-bold text-teal-950">Pemetaan Wali Kelas ke Rombel:</p>
                <p className="mt-0.5">
                  Tetapkan atau ubah kelas perwalian untuk masing-masing Wali Kelas. Perubahan di sini langsung menyinkronkan data kelas dan akses laporan siswa perwalian.
                </p>
              </div>
            </div>

            <ResponsiveTableContainer
              tableId="admin-homeroom-assignment-table"
              minWidth="700px"
              maxHeight="540px"
              hasData={homeroomTeachers.length > 0}
            >
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                    <th className="p-3.5">Nama Wali Kelas</th>
                    <th className="p-3.5">NIP & Kontak</th>
                    <th className="p-3.5">Kelas Binaan Saat Ini</th>
                    <th className="p-3.5">Jumlah Siswa Perwalian</th>
                    <th className="p-3.5">Ubah Kelas Perwalian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {homeroomTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Belum ada data Guru Wali Kelas terdaftar.
                      </td>
                    </tr>
                  ) : (
                    homeroomTeachers.map(teacher => {
                      const u = users.find(usr => usr.id === teacher.user_id);
                      const managedCls = classes.find(
                        c => c.homeroom_teacher_id === teacher.id || c.homeroom_teacher_id === teacher.user_id || c.id === teacher.managed_class_id
                      );
                      const studentCount = managedCls
                        ? students.filter(s => s.class_id === managedCls.id).length
                        : 0;

                      return (
                        <tr key={teacher.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={u?.avatar || getDefaultAvatarByGender('guru', u?.gender || teacher.gender)}
                                alt={u?.name || 'Wali Kelas'}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{u?.name || 'Wali Kelas'}</p>
                                <span className="text-[10px] text-teal-700 font-semibold">Wali Kelas</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <p className="font-mono text-slate-700">NIP: {decryptNip(teacher.nip)}</p>
                            <p className="text-[11px] text-slate-400">{u?.email}</p>
                          </td>

                          <td className="p-3.5">
                            {managedCls ? (
                              <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs inline-flex items-center gap-1.5">
                                <School className="w-3.5 h-3.5 text-teal-600" />
                                <span>{managedCls.name}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Belum mengampu kelas</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-700">{studentCount} Siswa</span>
                          </td>

                          <td className="p-3.5">
                            <select
                              value={managedCls?.id || ''}
                              onChange={(e) => handleAssignHomeroomToClass(teacher.id, e.target.value)}
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                              <option value="">-- Tidak Mengampu Kelas --</option>
                              {classes.map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.major})
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </ResponsiveTableContainer>
          </div>
        )}
      </div>

      {/* Modal Kelola Anggota Siswa di Kelas */}
      {managingStudentsClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>Anggota Siswa Kelas {managingStudentsClass.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      {students.filter(s => s.class_id === managingStudentsClass.id).length} Siswa
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tingkat {managingStudentsClass.grade} • {managingStudentsClass.major}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingStudentsClass(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Add Existing Student to this Class */}
              <form
                onSubmit={handleAddExistingStudentToClass}
                className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950 shrink-0">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Tambahkan Siswa ke {managingStudentsClass.name}:</span>
                </div>
                <select
                  value={selectedStudentToAdd}
                  onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Siswa dari Kelas Lain --</option>
                  {students
                    .filter(s => s.class_id !== managingStudentsClass.id)
                    .map(s => {
                      const u = users.find(usr => usr.id === s.user_id);
                      const curCls = classes.find(c => c.id === s.class_id);
                      return (
                        <option key={s.id} value={s.id}>
                          {u?.name || 'Siswa'} (NIS: {s.nis} — Kelas Asal: {curCls?.name || '-'})
                        </option>
                      );
                    })}
                </select>
                <button
                  type="submit"
                  disabled={!selectedStudentToAdd}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition shrink-0 cursor-pointer"
                >
                  Masukkan ke Kelas
                </button>
              </form>

              {/* Search inside class */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama atau NIS siswa di kelas ini..."
                    value={studentSearchInModal}
                    onChange={(e) => setStudentSearchInModal(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Student List in Class */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NIS</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Pindahkan ke Kelas Lain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(() => {
                      const classStudents = students
                        .filter(s => s.class_id === managingStudentsClass.id)
                        .filter(s => {
                          if (!studentSearchInModal.trim()) return true;
                          const q = studentSearchInModal.toLowerCase();
                          const u = users.find(usr => usr.id === s.user_id);
                          return (
                            (u?.name || '').toLowerCase().includes(q) ||
                            s.nis.toLowerCase().includes(q)
                          );
                        });

                      if (classStudents.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-slate-400">
                              Belum ada siswa terdaftar di kelas {managingStudentsClass.name}.
                            </td>
                          </tr>
                        );
                      }

                      return classStudents.map(st => {
                        const u = users.find(usr => usr.id === st.user_id);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={u?.avatar || getDefaultAvatarByGender('siswa', u?.gender || st.gender)}
                                  alt={u?.name || 'Siswa'}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                                <span>{u?.name || 'Siswa'}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-slate-600">{st.nis}</td>
                            <td className="p-3 font-mono text-slate-500">{u?.email || '-'}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={targetMoveClassId[st.id] || ''}
                                  onChange={(e) =>
                                    setTargetMoveClassId(prev => ({ ...prev, [st.id]: e.target.value }))
                                  }
                                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">-- Pilih Kelas Tujuan --</option>
                                  {classes
                                    .filter(c => c.id !== managingStudentsClass.id)
                                    .map(c => (
                                      <option key={c.id} value={c.id}>
                                        {c.name}
                                      </option>
                                    ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={!targetMoveClassId[st.id]}
                                  onClick={() => {
                                    const dest = targetMoveClassId[st.id];
                                    if (dest) {
                                      handleMoveStudentClass(st.id, dest);
                                      setTargetMoveClassId(prev => ({ ...prev, [st.id]: '' }));
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                                >
                                  <ArrowRightLeft className="w-3 h-3" />
                                  <span>Pindah</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setManagingStudentsClass(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
