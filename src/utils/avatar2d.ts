// 2D Simple Vector Avatars for Advocare (Admin, Guru BK, Wali Kelas, Siswa)
// Lightweight, scalable SVG data URIs that work 100% offline with zero database bloat

export const AVATAR_2D_STUDENT_MALE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="36" fill="#E0F2FE"/>
  <!-- Hair Back -->
  <path d="M38 48 C36 28, 84 28, 82 48 Z" fill="#1E293B"/>
  <!-- Neck -->
  <rect x="52" y="68" width="16" height="18" rx="4" fill="#FBD38D"/>
  <!-- Clothes / School Uniform -->
  <path d="M26 112 C28 88, 44 80, 60 80 C76 80, 92 88, 94 112 Z" fill="#2563EB"/>
  <path d="M50 80 L60 96 L70 80 Z" fill="#FFFFFF"/>
  <path d="M58 84 L62 84 L60 94 Z" fill="#DC2626"/>
  <!-- Head -->
  <circle cx="60" cy="52" r="22" fill="#FEEBC8"/>
  <!-- Hair Front -->
  <path d="M38 46 C40 32, 54 28, 66 28 C78 28, 84 34, 82 44 C76 38, 70 36, 62 38 C54 40, 48 46, 38 46 Z" fill="#0F172A"/>
  <!-- Ears -->
  <circle cx="38" cy="53" r="4.5" fill="#FBD38D"/>
  <circle cx="82" cy="53" r="4.5" fill="#FBD38D"/>
  <!-- Face: Eyes & Smile -->
  <circle cx="53" cy="51" r="2.5" fill="#1E293B"/>
  <circle cx="67" cy="51" r="2.5" fill="#1E293B"/>
  <circle cx="49" cy="56" r="3" fill="#FCA5A5" opacity="0.6"/>
  <circle cx="71" cy="56" r="3" fill="#FCA5A5" opacity="0.6"/>
  <path d="M56 58 Q60 63, 64 58" stroke="#1E293B" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

export const AVATAR_2D_STUDENT_FEMALE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="36" fill="#FCE7F3"/>
  <!-- Hair Back / Hijab Base -->
  <ellipse cx="60" cy="58" rx="28" ry="32" fill="#0284C7"/>
  <!-- Clothes / Uniform -->
  <path d="M26 112 C28 88, 44 82, 60 82 C76 82, 92 88, 94 112 Z" fill="#FFFFFF"/>
  <path d="M48 90 L60 110 L72 90 Z" fill="#0284C7"/>
  <!-- Face Base (Hijab Opening) -->
  <ellipse cx="60" cy="54" rx="18" ry="21" fill="#FED7AA"/>
  <!-- Hijab Drape -->
  <path d="M42 54 C42 40, 48 35, 60 35 C72 35, 78 40, 78 54 C78 72, 70 78, 60 78 C50 78, 42 72, 42 54 Z" fill="#0284C7"/>
  <ellipse cx="60" cy="55" rx="15" ry="17" fill="#FEEBC8"/>
  <!-- Face: Eyes & Smile -->
  <circle cx="54" cy="53" r="2.5" fill="#1E293B"/>
  <circle cx="66" cy="53" r="2.5" fill="#1E293B"/>
  <!-- Eyelashes -->
  <path d="M52 49 L55 51" stroke="#1E293B" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M68 49 L65 51" stroke="#1E293B" stroke-width="1.2" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="50" cy="58" r="3.2" fill="#FDA4AF" opacity="0.7"/>
  <circle cx="70" cy="58" r="3.2" fill="#FDA4AF" opacity="0.7"/>
  <path d="M56 60 Q60 64, 64 60" stroke="#E11D48" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

// Guru Laki-laki (2D) - Digunakan untuk Admin, Guru BK, dan Wali Kelas Laki-laki
export const AVATAR_2D_TEACHER_MALE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="36" fill="#EEF2FF"/>
  <!-- Hair Back -->
  <path d="M38 46 C36 28, 84 28, 82 46 Z" fill="#1E1B4B"/>
  <!-- Neck -->
  <rect x="52" y="66" width="16" height="16" rx="4" fill="#FBD38D"/>
  <!-- Teacher Clothes (Formal Shirt & Blazer) -->
  <path d="M26 112 C28 88, 44 80, 60 80 C76 80, 92 88, 94 112 Z" fill="#312E81"/>
  <path d="M48 80 L60 98 L72 80 Z" fill="#FFFFFF"/>
  <path d="M58 84 L62 84 L60 98 Z" fill="#4F46E5"/>
  <!-- Head -->
  <circle cx="60" cy="50" r="21" fill="#FEEBC8"/>
  <!-- Hair Front (Neat parted hair) -->
  <path d="M39 42 C42 30, 56 26, 68 28 C78 30, 81 36, 80 44 C74 38, 66 36, 58 37 C48 38, 43 41, 39 42 Z" fill="#1E1B4B"/>
  <!-- Ears -->
  <circle cx="39" cy="51" r="4" fill="#FBD38D"/>
  <circle cx="81" cy="51" r="4" fill="#FBD38D"/>
  <!-- Teacher Glasses -->
  <rect x="47" y="46" width="11" height="8" rx="2" fill="none" stroke="#4338CA" stroke-width="1.8"/>
  <rect x="62" y="46" width="11" height="8" rx="2" fill="none" stroke="#4338CA" stroke-width="1.8"/>
  <line x1="58" y1="50" x2="62" y2="50" stroke="#4338CA" stroke-width="1.8"/>
  <!-- Eyes -->
  <circle cx="52.5" cy="50" r="2" fill="#1E293B"/>
  <circle cx="67.5" cy="50" r="2" fill="#1E293B"/>
  <!-- Warm Friendly Smile -->
  <path d="M56 57 Q60 61, 64 57" stroke="#312E81" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <!-- Teacher ID Card / Lanyard -->
  <path d="M48 80 L55 106 L65 106 L72 80" stroke="#818CF8" stroke-width="2" fill="none"/>
  <rect x="55" y="103" width="10" height="9" rx="1.5" fill="#4338CA"/>
</svg>
`)}`;

// Guru Perempuan (2D) - Digunakan untuk Admin, Guru BK, dan Wali Kelas Perempuan
export const AVATAR_2D_TEACHER_FEMALE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="36" fill="#FDF2F8"/>
  <!-- Hijab Base -->
  <ellipse cx="60" cy="58" rx="28" ry="32" fill="#831843"/>
  <!-- Teacher Blouse / Suit -->
  <path d="M26 112 C28 88, 44 82, 60 82 C76 82, 92 88, 94 112 Z" fill="#9D174D"/>
  <path d="M48 90 L60 110 L72 90 Z" fill="#FCE7F3"/>
  <!-- Face Base (Hijab Opening) -->
  <ellipse cx="60" cy="54" rx="17" ry="20" fill="#FED7AA"/>
  <path d="M43 54 C43 41, 49 35, 60 35 C71 35, 77 41, 77 54 C77 71, 69 77, 60 77 C51 77, 43 71, 43 54 Z" fill="#831843"/>
  <ellipse cx="60" cy="55" rx="14" ry="16" fill="#FEEBC8"/>
  <!-- Glasses -->
  <rect x="48" y="49" width="10" height="7.5" rx="2" fill="none" stroke="#BE185D" stroke-width="1.6"/>
  <rect x="62" y="49" width="10" height="7.5" rx="2" fill="none" stroke="#BE185D" stroke-width="1.6"/>
  <line x1="58" y1="52.5" x2="62" y2="52.5" stroke="#BE185D" stroke-width="1.6"/>
  <!-- Eyes -->
  <circle cx="53" cy="52.5" r="2" fill="#1E293B"/>
  <circle cx="67" cy="52.5" r="2" fill="#1E293B"/>
  <!-- Cheeks & Gentle Smile -->
  <circle cx="49" cy="57" r="2.8" fill="#F472B6" opacity="0.6"/>
  <circle cx="71" cy="57" r="2.8" fill="#F472B6" opacity="0.6"/>
  <path d="M56 59 Q60 63, 64 59" stroke="#9D174D" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <!-- Teacher ID Lanyard -->
  <path d="M48 82 L55 104 L65 104 L72 82" stroke="#F472B6" stroke-width="1.8" fill="none"/>
  <rect x="55" y="101" width="10" height="11" rx="1.5" fill="#831843"/>
</svg>
`)}`;

// Backward-compatible aliases
export const AVATAR_2D_GURU_BK_MALE = AVATAR_2D_TEACHER_MALE;
export const AVATAR_2D_GURU_BK_FEMALE = AVATAR_2D_TEACHER_FEMALE;
export const AVATAR_2D_WALI_MALE = AVATAR_2D_TEACHER_MALE;
export const AVATAR_2D_WALI_FEMALE = AVATAR_2D_TEACHER_FEMALE;
export const AVATAR_2D_ADMIN = AVATAR_2D_TEACHER_MALE;

export interface AvatarOption {
  id: string;
  gender: 'Laki-laki' | 'Perempuan';
  label: string;
  category: 'siswa' | 'guru' | 'admin';
  url: string;
}

// Student options (2 Pilihan: Laki-laki & Perempuan)
export const STUDENT_AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'std-male',
    gender: 'Laki-laki',
    label: 'Siswa Laki-laki (2D)',
    category: 'siswa',
    url: AVATAR_2D_STUDENT_MALE
  },
  {
    id: 'std-female',
    gender: 'Perempuan',
    label: 'Siswi Perempuan (2D)',
    category: 'siswa',
    url: AVATAR_2D_STUDENT_FEMALE
  }
];

// Khusus Admin, Guru BK, dan Wali Kelas: HANYA DUA PILIHAN (Guru Laki-laki & Guru Perempuan)
export const TEACHER_ADMIN_AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'guru-male',
    gender: 'Laki-laki',
    label: 'Guru Laki-laki (2D)',
    category: 'guru',
    url: AVATAR_2D_TEACHER_MALE
  },
  {
    id: 'guru-female',
    gender: 'Perempuan',
    label: 'Guru Perempuan (2D)',
    category: 'guru',
    url: AVATAR_2D_TEACHER_FEMALE
  }
];
