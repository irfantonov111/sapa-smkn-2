import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  X,
  Layers,
  Tags,
  Check,
  FolderPlus,
  Info
} from 'lucide-react';
import { db } from '../../services/db';
import { Category } from '../../types/database';
import { CategoryIcon } from '../StatusBadges';

interface AdminCategoriesTabProps {
  categories: Category[];
  onRefresh: () => void;
}

const AVAILABLE_ICONS = [
  'Heart',
  'Users',
  'BookOpen',
  'GraduationCap',
  'Briefcase',
  'ShieldAlert',
  'HeartPulse',
  'Building2',
  'AlertTriangle',
  'MessageCircle',
  'Smile',
  'Flame',
  'Lightbulb'
];

const AVAILABLE_COLORS = [
  { label: 'Ungu (Pribadi)', value: 'purple' },
  { label: 'Merah / Mawar (Sosial)', value: 'rose' },
  { label: 'Biru (Belajar)', value: 'blue' },
  { label: 'Hijau / Emerald (Karier)', value: 'emerald' },
  { label: 'Kuning / Amber', value: 'amber' },
  { label: 'Oranye', value: 'orange' },
  { label: 'Indigo', value: 'indigo' },
  { label: 'Abu-abu', value: 'slate' }
];

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({ categories, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Subcategory management modal state
  const [managingCategory, setManagingCategory] = useState<Category | null>(null);
  const [newSubcategoryText, setNewSubcategoryText] = useState('');
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState<number | null>(null);
  const [editSubcategoryValue, setEditSubcategoryValue] = useState('');

  // Quick inline add state per card: categoryId -> text
  const [quickSubcategoryInputs, setQuickSubcategoryInputs] = useState<Record<string, string>>({});

  // Category Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Heart',
    color: 'purple',
    subcategories: [] as string[]
  });
  const [modalSubcategoryInput, setModalSubcategoryInput] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      showFeedback('Nama dan deskripsi bidang kategori wajib diisi.', 'error');
      return;
    }

    db.addCategory({
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
      subcategories: formData.subcategories.filter(s => s.trim().length > 0),
      active: true
    });

    setShowAddModal(false);
    setFormData({ name: '', description: '', icon: 'Heart', color: 'purple', subcategories: [] });
    setModalSubcategoryInput('');
    onRefresh();
    showFeedback(`Kategori bidang "${formData.name}" berhasil ditambahkan.`);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      subcategories: Array.isArray(cat.subcategories) ? [...cat.subcategories] : []
    });
    setModalSubcategoryInput('');
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!formData.name.trim() || !formData.description.trim()) {
      showFeedback('Nama dan deskripsi bidang kategori wajib diisi.', 'error');
      return;
    }

    db.updateCategory(editingCategory.id, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
      subcategories: formData.subcategories.filter(s => s.trim().length > 0)
    });

    setShowEditModal(false);
    setEditingCategory(null);
    onRefresh();
    showFeedback(`Kategori "${formData.name}" berhasil diperbarui.`);
  };

  const handleDelete = (cat: Category) => {
    if (categories.length <= 1) {
      alert('Tidak dapat menghapus. Minimal harus ada 1 kategori di sistem.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${cat.name}"? Laporan yang terkait kategori ini akan dialihkan ke kategori lain.`)) {
      db.deleteCategory(cat.id);
      onRefresh();
      showFeedback(`Kategori "${cat.name}" telah dihapus.`);
    }
  };

  // --- Subcategory Management Handlers ---
  const handleOpenManageSubcategories = (cat: Category) => {
    setManagingCategory(cat);
    setNewSubcategoryText('');
    setEditingSubcategoryIndex(null);
    setEditSubcategoryValue('');
  };

  const handleAddSubcategoryToModal = () => {
    if (!newSubcategoryText.trim() || !managingCategory) return;
    const success = db.addSubcategory(managingCategory.id, newSubcategoryText.trim());
    if (success) {
      const updatedCat = db.getCategoryById(managingCategory.id);
      if (updatedCat) setManagingCategory(updatedCat);
      setNewSubcategoryText('');
      onRefresh();
      showFeedback(`Subkategori berhasil ditambahkan ke bidang ${managingCategory.name}.`);
    } else {
      showFeedback('Subkategori sudah ada atau tidak valid.', 'error');
    }
  };

  const handleSaveEditSubcategory = (index: number) => {
    if (!managingCategory || !editSubcategoryValue.trim()) return;
    const oldName = managingCategory.subcategories?.[index];
    if (!oldName) return;

    const success = db.updateSubcategory(managingCategory.id, oldName, editSubcategoryValue.trim());
    if (success) {
      const updatedCat = db.getCategoryById(managingCategory.id);
      if (updatedCat) setManagingCategory(updatedCat);
      setEditingSubcategoryIndex(null);
      setEditSubcategoryValue('');
      onRefresh();
      showFeedback('Subkategori berhasil diperbarui.');
    } else {
      showFeedback('Gagal memperbarui subkategori.', 'error');
    }
  };

  const handleDeleteSubcategory = (subName: string) => {
    if (!managingCategory) return;
    if (confirm(`Hapus subkategori "${subName}" dari bidang ${managingCategory.name}?`)) {
      db.deleteSubcategory(managingCategory.id, subName);
      const updatedCat = db.getCategoryById(managingCategory.id);
      if (updatedCat) setManagingCategory(updatedCat);
      onRefresh();
      showFeedback(`Subkategori "${subName}" telah dihapus.`);
    }
  };

  // Quick inline add on card
  const handleQuickAddSubcategory = (cat: Category) => {
    const text = (quickSubcategoryInputs[cat.id] || '').trim();
    if (!text) return;
    const success = db.addSubcategory(cat.id, text);
    if (success) {
      setQuickSubcategoryInputs(prev => ({ ...prev, [cat.id]: '' }));
      onRefresh();
      showFeedback(`Subkategori "${text}" berhasil ditambahkan.`);
    } else {
      showFeedback('Subkategori sudah ada atau tidak valid.', 'error');
    }
  };

  const handleQuickDeleteSubcategory = (cat: Category, subName: string) => {
    if (confirm(`Hapus subkategori "${subName}" dari bidang ${cat.name}?`)) {
      db.deleteSubcategory(cat.id, subName);
      onRefresh();
      showFeedback(`Subkategori "${subName}" telah dihapus.`);
    }
  };

  const rawTables = db.getRawTables();
  const reports = rawTables.reports;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>Kategori & Sub Kategori Layanan BK</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola klasifikasi bidang layanan bimbingan konseling (Pribadi, Sosial, Belajar, Karier) dan sub-sub topik pengaduan siswa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({ name: '', description: '', icon: 'Heart', color: 'purple', subcategories: [] });
            setModalSubcategoryInput('');
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Tambah Bidang Kategori Baru</span>
        </button>
      </div>

      {/* 4 Main Guidance & Counseling Service Banner */}
      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs text-purple-950 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-purple-900">
            Empat (4) Bidang Pokok Layanan Bimbingan dan Konseling Sekolah
          </h4>
          <p className="text-purple-800 leading-relaxed">
            Sistem pengaduan siswa dikelompokkan ke dalam 4 bidang utama: <strong>Pribadi</strong>, <strong>Sosial</strong>, <strong>Belajar</strong>, dan <strong>Karier</strong>. Anda dapat mengedit judul, deskripsi, warna, serta <strong>menambah, mengubah, atau menghapus sub kategori</strong> di masing-masing bidang sesuai kurikulum dan kebutuhan sekolah.
          </p>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((c) => {
          const reportCount = reports.filter((r) => r.category_id === c.id).length;
          const subList = Array.isArray(c.subcategories) ? c.subcategories : [];

          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Header Card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryIcon iconName={c.icon} color={c.color} className="w-5 h-5" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>{c.name}</span>
                        {['pribadi', 'sosial', 'belajar', 'karier'].includes(c.name.toLowerCase()) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                            Bidang Utama BK
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {subList.length} Sub Kategori Terdaftar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      {reportCount} Laporan
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Aktif
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-100">
                  {c.description}
                </p>

                {/* Subcategories Section */}
                <div className="space-y-2 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tags className="w-3.5 h-3.5 text-purple-600" />
                      <span>Sub Kategori yang Dapat Dipilih Siswa:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenManageSubcategories(c)}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Kelola Sub Kategori</span>
                    </button>
                  </div>

                  {/* Badges of subcategories */}
                  <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {subList.length > 0 ? (
                      subList.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs group/chip hover:border-purple-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickDeleteSubcategory(c, sub);
                            }}
                            title={`Hapus subkategori "${sub}"`}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-rose-50 cursor-pointer transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Belum ada subkategori. Klik kelola untuk menambahkan.
                      </span>
                    )}
                  </div>

                  {/* Quick Add Subcategory Form */}
                  <div className="pt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={quickSubcategoryInputs[c.id] || ''}
                      onChange={(e) =>
                        setQuickSubcategoryInputs({ ...quickSubcategoryInputs, [c.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickAddSubcategory(c);
                        }
                      }}
                      placeholder={`+ Tambah subkategori baru untuk ${c.name}...`}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuickAddSubcategory(c)}
                      className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => handleOpenManageSubcategories(c)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 border border-purple-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Tags className="w-3.5 h-3.5 text-purple-600" />
                  <span>Kelola Sub Kategori ({subList.length})</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Bidang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Manage Subcategories */}
      {managingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Tags className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Kelola Sub Kategori: {managingCategory.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tambah, edit nama, atau hapus sub-sub pilihan yang dapat dipilih siswa pada bidang ini.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingCategory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Subcategory Form */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <label className="block text-xs font-bold text-purple-950">
                + Tambah Sub Kategori Baru
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubcategoryText}
                  onChange={(e) => setNewSubcategoryText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcategoryToModal();
                    }
                  }}
                  placeholder="Contoh: Kesulitan Memahami Materi Pembelajaran"
                  className="flex-1 px-3.5 py-2 bg-white border border-purple-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubcategoryToModal}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambahkan</span>
                </button>
              </div>
            </div>

            {/* List of Existing Subcategories */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Sub Kategori Saat Ini ({managingCategory.subcategories?.length || 0}):
              </label>

              {managingCategory.subcategories && managingCategory.subcategories.length > 0 ? (
                managingCategory.subcategories.map((sub, idx) => {
                  const isEditingThis = editingSubcategoryIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-3 shadow-2xs transition"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editSubcategoryValue}
                            onChange={(e) => setEditSubcategoryValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveEditSubcategory(idx);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 border border-purple-400 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-800 truncate" title={sub}>
                            {sub}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditingThis ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveEditSubcategory(idx)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                            >
                              <Check className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSubcategoryIndex(null);
                                setEditSubcategoryValue('');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSubcategoryIndex(idx);
                                setEditSubcategoryValue(sub);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Edit subkategori"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubcategory(sub)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus subkategori"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  Belum ada subkategori pada bidang ini. Silakan tambahkan pada formulir di atas.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setManagingCategory(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Category */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-900">Tambah Bidang Kategori Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bidang Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Bimbingan Sosial Mandiri"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan fokus bimbingan konseling untuk kategori ini..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Ikon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Warna Tema</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {AVAILABLE_COLORS.map((col) => (
                      <option key={col.value} value={col.value}>{col.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategories in Add Modal */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Sub Kategori Awal (Opsional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={modalSubcategoryInput}
                    onChange={(e) => setModalSubcategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (modalSubcategoryInput.trim() && !formData.subcategories.includes(modalSubcategoryInput.trim())) {
                          setFormData({ ...formData, subcategories: [...formData.subcategories, modalSubcategoryInput.trim()] });
                          setModalSubcategoryInput('');
                        }
                      }
                    }}
                    placeholder="Tulis subkategori lalu klik Tambah..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (modalSubcategoryInput.trim() && !formData.subcategories.includes(modalSubcategoryInput.trim())) {
                        setFormData({ ...formData, subcategories: [...formData.subcategories, modalSubcategoryInput.trim()] });
                        setModalSubcategoryInput('');
                      }
                    }}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                  {formData.subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subcategories: formData.subcategories.filter((_, i) => i !== idx)
                          })
                        }
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Bidang Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Category */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Edit Bidang Layanan BK</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bidang Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Ikon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Warna Tema</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {AVAILABLE_COLORS.map((col) => (
                      <option key={col.value} value={col.value}>{col.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategories Management in Edit Modal */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Daftar Sub Kategori ({formData.subcategories.length})
                  </label>
                  <span className="text-[11px] text-slate-400">Tekan Enter atau klik Tambah</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={modalSubcategoryInput}
                    onChange={(e) => setModalSubcategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (modalSubcategoryInput.trim() && !formData.subcategories.includes(modalSubcategoryInput.trim())) {
                          setFormData({ ...formData, subcategories: [...formData.subcategories, modalSubcategoryInput.trim()] });
                          setModalSubcategoryInput('');
                        }
                      }
                    }}
                    placeholder="Tulis nama subkategori baru..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (modalSubcategoryInput.trim() && !formData.subcategories.includes(modalSubcategoryInput.trim())) {
                        setFormData({ ...formData, subcategories: [...formData.subcategories, modalSubcategoryInput.trim()] });
                        setModalSubcategoryInput('');
                      }
                    }}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                  {formData.subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subcategories: formData.subcategories.filter((_, i) => i !== idx)
                          })
                        }
                        className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                        title="Hapus subkategori"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
