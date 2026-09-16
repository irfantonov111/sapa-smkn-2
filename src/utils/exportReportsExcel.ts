import * as XLSX from 'xlsx';
import { EnrichedReport } from '../types/database';

export function exportReportsToExcel(reports: EnrichedReport[], filenamePrefix = 'Data_Laporan_Pengaduan_SAPA') {
  if (!reports || reports.length === 0) {
    throw new Error('Tidak ada data laporan untuk diekspor.');
  }

  const wb = XLSX.utils.book_new();

  // 1. Data Sheet Header
  const headers = [
    'No',
    'Kode Laporan',
    'Tanggal Laporan',
    'Judul Laporan',
    'Kategori',
    'Pelapor',
    'NIS Pelapor',
    'Kelas Siswa',
    'Tingkat Urgensi',
    'Tujuan Penanganan',
    'Guru Pembimbing / Penanggung Jawab',
    'Status Laporan',
    'Jumlah Diskusi',
    'Isi / Kronologi Laporan',
    'Tanggal Selesai'
  ];

  const rows: (string | number)[][] = [headers];

  reports.forEach((r, idx) => {
    const isAnonymous = r.privacy === 'anonim' || r.student?.is_anonymous;
    const studentName = isAnonymous ? 'Anonim (Dirahasiakan)' : (r.student?.name || 'Siswa');
    const studentNis = isAnonymous ? '-' : (r.student?.nis || '-');
    const studentClass = isAnonymous ? '-' : (r.student?.class_name || '-');

    let formattedDate = '-';
    try {
      if (r.created_at) {
        const d = new Date(r.created_at);
        formattedDate = d.toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch {
      formattedDate = r.created_at || '-';
    }

    let closedDate = '-';
    try {
      if (r.closed_at) {
        const d = new Date(r.closed_at);
        closedDate = d.toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch {
      closedDate = r.closed_at || '-';
    }

    // Urgency text
    const urgencyLabel = r.urgency === 'tinggi' ? 'TINGGI' : r.urgency === 'sedang' ? 'SEDANG' : 'RENDAH';

    // Target label
    const targetLabel = r.assigned_to === 'guru_bk' ? 'Guru BK' : 'Wali Kelas';

    // Teacher label
    const teacherName = r.assigned_teacher?.name || (r.assigned_to === 'guru_bk' ? 'Semua Guru BK' : 'Wali Kelas Terkait');

    // Status label formatted
    const statusMap: Record<string, string> = {
      terkirim: 'Terkirim (Menunggu)',
      dibaca: 'Dibaca',
      direspons: 'Direspons',
      ditindaklanjuti: 'Ditindaklanjuti',
      selesai: 'Selesai'
    };
    const statusLabel = statusMap[r.status] || r.status.toUpperCase();

    rows.push([
      idx + 1,
      r.report_code || `AC-${r.id.slice(0, 6)}`,
      formattedDate,
      r.title || '-',
      r.category?.name || 'Umum',
      studentName,
      studentNis,
      studentClass,
      urgencyLabel,
      targetLabel,
      teacherName,
      statusLabel,
      r.messages_count || 0,
      r.description ? r.description.replace(/(\r\n|\n|\r)/gm, ' ') : '-',
      closedDate
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths for optimal reading in Excel
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // Kode Laporan
    { wch: 25 }, // Tanggal Laporan
    { wch: 34 }, // Judul Laporan
    { wch: 24 }, // Kategori
    { wch: 26 }, // Pelapor
    { wch: 14 }, // NIS Pelapor
    { wch: 16 }, // Kelas Siswa
    { wch: 16 }, // Tingkat Urgensi
    { wch: 20 }, // Tujuan Penanganan
    { wch: 30 }, // Guru Pembimbing
    { wch: 24 }, // Status Laporan
    { wch: 15 }, // Jumlah Diskusi
    { wch: 45 }, // Isi Laporan
    { wch: 22 }  // Tanggal Selesai
  ];

  XLSX.utils.book_append_sheet(wb, ws, `Data Laporan (${reports.length})`);

  // 2. Summary Statistics Sheet
  const pendingCount = reports.filter(r => r.status === 'terkirim').length;
  const inProgressCount = reports.filter(r => ['dibaca', 'direspons', 'ditindaklanjuti'].includes(r.status)).length;
  const resolvedCount = reports.filter(r => r.status === 'selesai').length;
  const highUrgencyCount = reports.filter(r => r.urgency === 'tinggi').length;
  const mediumUrgencyCount = reports.filter(r => r.urgency === 'sedang').length;
  const lowUrgencyCount = reports.filter(r => r.urgency === 'rendah').length;

  const summaryRows: (string | number)[][] = [
    ['RINGKASAN STATISTIK LAPORAN PENGADUAN SISWA (SAPA)'],
    ['Tanggal Ekspor', new Date().toLocaleString('id-ID')],
    ['Total Seluruh Laporan', reports.length],
    [],
    ['STATUS LAPORAN', 'JUMLAH'],
    ['Menunggu Tanggapan (Terkirim)', pendingCount],
    ['Sedang Diproses (Dibaca / Direspons / Ditindaklanjuti)', inProgressCount],
    ['Tuntas & Selesai', resolvedCount],
    [],
    ['TINGKAT URGENSI', 'JUMLAH'],
    ['Tinggi', highUrgencyCount],
    ['Sedang', mediumUrgencyCount],
    ['Rendah', lowUrgencyCount]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 35 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Statistik');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filenamePrefix}_${dateStr}.xlsx`);
}
