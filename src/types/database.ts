export type UserRole = 'siswa' | 'guru' | 'admin';
export type TeacherType = 'guru_bk' | 'wali_kelas';
export type ReportUrgency = 'rendah' | 'sedang' | 'tinggi';
export type ReportPrivacy = 'terbuka' | 'terbatas' | 'anonim';
export type ReportStatus = 'terkirim' | 'dibaca' | 'direspons' | 'ditindaklanjuti' | 'selesai';
export type AssignedTo = 'guru_bk' | 'wali_kelas';
export type Gender = 'L' | 'P';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  gender?: Gender;
  avatar?: string;
  phone?: string;
  created_at: string;
  password_changed?: boolean; // false jika siswa atau guru masih menggunakan sandi bawaan (kesempatan/kewajiban 1x ubah sandi pada login pertama)
}

export type MoodType = 'sangat_senang' | 'senang' | 'netral' | 'sedih' | 'cemas' | 'marah';

export interface StudentMoodCheck {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_nis: string;
  student_avatar?: string;
  class_id: string;
  class_name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: MoodType;
  mood_score: number; // 1 (marah/cemas), 2 (sedih), 3 (netral), 4 (senang), 5 (sangat senang)
  emotions: string[];
  trigger?: string;
  note?: string;
  needs_counseling: boolean;
  status: 'belum_ditinjau' | 'sudah_ditinjau' | 'dalam_tindak_lanjut';
  reviewed_by_teacher_id?: string;
  reviewed_by_teacher_name?: string;
  reviewed_at?: string;
  teacher_notes?: string;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  nis: string;
  gender?: Gender;
  class_id: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  nip: string;
  teacher_type: TeacherType;
  gender?: Gender;
  specialization?: string;
  room?: string;
  bio?: string;
  available_hours?: string;
  is_active?: boolean;
  assigned_class_ids?: string[];
  created_at: string;
}

export interface BkTeacherProfile {
  teacher_id: string;
  user_id: string;
  name: string;
  nip: string;
  email: string;
  gender?: Gender;
  avatar?: string;
  phone?: string;
  specialization: string;
  room: string;
  bio: string;
  available_hours: string;
  status: 'tersedia' | 'konseling' | 'istirahat';
  is_active?: boolean;
  assigned_class_ids?: string[];
  today_reports_count?: number;
  daily_limit?: number;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  major: string;
  homeroom_teacher_id: string | null;
  bk_teacher_id?: string;
}

export type AnnouncementTargetGrade = 'all' | 'X' | 'XI' | 'XII' | '10' | '11' | '12';

export interface AnnouncementAttachment {
  id: string;
  type: 'link' | 'video' | 'image' | 'document';
  url: string;
  file_url?: string;
  title?: string;
  file_name?: string;
  file_size?: number | string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  author_user_id?: string;
  author_name: string;
  author_role: 'guru_bk' | 'wali_kelas' | 'admin' | string;
  author_avatar?: string;
  target_grade: AnnouncementTargetGrade;
  target_class_id?: string;
  target_class_name?: string;
  category?: string;
  attachments?: AnnouncementAttachment[];
  link_url?: string;
  link_title?: string;
  image_url?: string;
  video_url?: string;
  read_by?: string[]; // Array of user_id who have viewed/read
  read_by_user_ids?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  active: boolean;
}

export interface ReportAttachment {
  id: string;
  type: 'image' | 'document' | 'file';
  name: string;
  size?: number | string;
  url: string; // Base64 data URL or external URL
  mime_type?: string;
  uploaded_at?: string;
}

export interface Report {
  id: string;
  report_code: string; // e.g. AC-00001
  student_id: string;
  category_id: string;
  assigned_to: AssignedTo;
  assigned_teacher_id?: string | null;
  title: string;
  description: string;
  urgency: ReportUrgency;
  privacy: ReportPrivacy;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  attachments?: ReportAttachment[];
}

export interface Message {
  id: string;
  report_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: 'image' | 'file';
  attachment_size?: string | number;
}

export interface ReportStatusHistory {
  id: string;
  report_id: string;
  status: ReportStatus;
  changed_by: string; // user_id
  note?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  report_id?: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Joined rich report view for UI
export interface EnrichedReport extends Report {
  category: Category;
  student?: {
    nis: string;
    name: string;
    class_name: string;
    is_anonymous: boolean;
  };
  assigned_teacher?: {
    name: string;
    role_label: string;
    specific_name?: string;
    avatar?: string;
    room?: string;
    teacher_id?: string;
    user_id?: string;
  };
  messages_count: number;
  unread_messages_count: number;
}

export interface SystemSettings {
  reset_password_email: string;
  school_name: string;
  support_phone?: string;
  updated_at?: string;
}

export type CounselingAppointmentStatus =
  | 'menunggu'
  | 'disetujui'
  | 'dijadwalkan_ulang'
  | 'selesai'
  | 'dibatalkan';

export type CounselingType = 'tatap_muka' | 'online_chat';

export interface CounselingAppointment {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class_name?: string;
  teacher_id: string;
  teacher_user_id: string;
  teacher_name: string;
  requested_date: string;       // YYYY-MM-DD
  requested_time: string;       // e.g. "09:30"
  confirmed_date?: string;      // Tanggal definitif / reschedule jika diubah guru
  confirmed_time?: string;      // Jam definitif / reschedule jika diubah guru
  topic: string;                // Keperluan / topik bimbingan
  counseling_type: CounselingType;
  status: CounselingAppointmentStatus;
  reschedule_reason?: string;   // Alasan perubahan waktu jika guru berhalangan
  notes?: string;               // Catatan konseling guru BK
  created_at: string;
  updated_at: string;
}

export interface DatabaseState {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  categories: Category[];
  reports: Report[];
  messages: Message[];
  status_history: ReportStatusHistory[];
  notifications: Notification[];
  announcements: Announcement[];
  mood_checks: StudentMoodCheck[];
  counseling_appointments?: CounselingAppointment[];
  system_settings: SystemSettings;
}
