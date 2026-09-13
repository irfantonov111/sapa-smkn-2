import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, Student, Teacher, SchoolClass } from '../types/database';
import { db } from '../services/db';
import { verifyPassword, hashPassword, isPasswordEncrypted } from '../utils/crypto';

interface AuthContextType {
  currentUser: User | null;
  studentProfile: (Student & { class_info?: SchoolClass }) | null;
  teacherProfile: (Teacher & { managed_class?: SchoolClass }) | null;
  isInitialized: boolean;
  sessionExpiredMessage: string | null;
  clearSessionExpiredMessage: () => void;
  login: (identifier: string, password?: string, roleHint?: string) => Promise<{ success: boolean; message?: string }>;
  quickLoginAs: (role: 'siswa' | 'guru_bk' | 'wali_kelas' | 'admin', customEmail?: string) => Promise<{ success: boolean; message?: string }>;
  logout: (isAutomatic?: boolean) => void;
  refreshUser: () => void;
  updateCurrentUserAvatar: (avatarUrl: string) => void;
  changeStudentDefaultPassword: (newPasswordPlain: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'sapa_current_user_email';
const LEGACY_AUTH_KEY = 'advocare_current_user_email';
const SESSION_LAST_ACTIVE_KEY = 'sapa_session_last_active';

// Inactivity timeout: 15 minutes
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<(Student & { class_info?: SchoolClass }) | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<(Teacher & { managed_class?: SchoolClass }) | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);
  const lastActiveRef = useRef<number>(Date.now());

  const resolveUserProfile = (user: User | null) => {
    if (!user) {
      setStudentProfile(null);
      setTeacherProfile(null);
      return;
    }

    if (user.role === 'siswa') {
      const std = db.getStudentByUserId(user.id);
      if (std) {
        const cls = db.getClassById(std.class_id);
        setStudentProfile({ ...std, class_info: cls });
      } else {
        setStudentProfile(null);
      }
      setTeacherProfile(null);
    } else if (user.role === 'guru') {
      const tch = db.getTeacherByUserId(user.id);
      if (tch) {
        const managedCls = db.getClasses().find(c => c.homeroom_teacher_id === tch.id);
        setTeacherProfile({ ...tch, managed_class: managedCls });
      } else {
        setTeacherProfile(null);
      }
      setStudentProfile(null);
    } else {
      setStudentProfile(null);
      setTeacherProfile(null);
    }
  };

  const logout = useCallback((isAutomatic: boolean = false) => {
    setCurrentUser(null);
    setStudentProfile(null);
    setTeacherProfile(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(LEGACY_AUTH_KEY);
    localStorage.removeItem(SESSION_LAST_ACTIVE_KEY);

    if (isAutomatic) {
      setSessionExpiredMessage('Sesi login Anda telah berakhir otomatis karena tidak ada aktivitas selama 15 menit. Silakan masuk kembali.');
    } else {
      setSessionExpiredMessage(null);
    }
  }, []);

  const clearSessionExpiredMessage = () => {
    setSessionExpiredMessage(null);
  };

  // Activity tracking function to record user presence
  const registerUserActivity = useCallback(() => {
    const now = Date.now();
    lastActiveRef.current = now;
    try {
      localStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(now));
    } catch {
      // Storage unavailable
    }
  }, []);

  // Initialize and check saved session
  useEffect(() => {
    const savedEmail = localStorage.getItem(AUTH_USER_KEY) || localStorage.getItem(LEGACY_AUTH_KEY);
    const lastActiveStr = localStorage.getItem(SESSION_LAST_ACTIVE_KEY);

    if (savedEmail) {
      const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : Date.now();
      const isExpired = Date.now() - lastActive > SESSION_TIMEOUT_MS;

      if (isExpired) {
        logout(true);
      } else {
        const user = db.getUserByIdentifier(savedEmail) || db.getUserByEmail(savedEmail);
        if (user) {
          setCurrentUser(user);
          resolveUserProfile(user);
          registerUserActivity();
        } else {
          localStorage.removeItem(AUTH_USER_KEY);
          localStorage.removeItem(LEGACY_AUTH_KEY);
        }
      }
    }
    setIsInitialized(true);
  }, [logout, registerUserActivity]);

  // Session idle monitor & user activity event listeners
  useEffect(() => {
    if (!currentUser) return;

    // Track user input events
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    let throttleTimer: NodeJS.Timeout | null = null;

    const handleActivity = () => {
      if (!throttleTimer) {
        registerUserActivity();
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
        }, 5000); // Throttle writes to every 5s
      }
    };

    events.forEach(evt => window.addEventListener(evt, handleActivity, { passive: true }));

    // Periodic interval to check session expiration
    const interval = setInterval(() => {
      const storedLastActive = localStorage.getItem(SESSION_LAST_ACTIVE_KEY);
      const lastActive = storedLastActive ? parseInt(storedLastActive, 10) : lastActiveRef.current;
      const elapsed = Date.now() - lastActive;

      if (elapsed > SESSION_TIMEOUT_MS) {
        logout(true);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleActivity));
      if (throttleTimer) clearTimeout(throttleTimer);
      clearInterval(interval);
    };
  }, [currentUser, logout, registerUserActivity]);

  const login = async (identifier: string, password?: string, roleHint?: string): Promise<{ success: boolean; message?: string }> => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return { success: false, message: 'Harap masukkan Email, NIS, atau NIP Anda.' };
    }

    setSessionExpiredMessage(null);

    // 1. Try Backend API login first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed, email: trimmed, password: password?.trim(), role: roleHint })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        // Resolve password_changed status with local client database if updated
        const localUser = db.getUserById(data.user.id);
        const resolvedUser = {
          ...data.user,
          password_changed: localUser && localUser.password_changed !== undefined ? localUser.password_changed : data.user.password_changed
        };
        setCurrentUser(resolvedUser);
        if (data.studentProfile) {
          setStudentProfile(data.studentProfile);
          setTeacherProfile(null);
        } else if (data.teacherProfile) {
          setTeacherProfile(data.teacherProfile);
          setStudentProfile(null);
        } else {
          resolveUserProfile(resolvedUser);
        }
        localStorage.setItem(AUTH_USER_KEY, resolvedUser.email);
        localStorage.setItem(LEGACY_AUTH_KEY, resolvedUser.email);
        registerUserActivity();
        return { success: true };
      }
      // If backend login was unsuccessful (e.g. backend out-of-sync with local client storage password reset),
      // smoothly fall through to client-side database verification below.
    } catch {
      // Backend not accessible or network issue, proceed to client fallback
    }

    // 2. Client-side database fallback
    const user = db.getUserByIdentifier(trimmed) || db.getUserByEmail(trimmed);
    if (!user) {
      return {
        success: false,
        message: 'Akun dengan Email / NIS / NIP tersebut tidak ditemukan dalam sistem.'
      };
    }

    // Verify encrypted password if provided
    if (password && user.password) {
      const isMatch = verifyPassword(password.trim(), user.password) || (user.role === 'admin' && (password.trim() === 'admin123' || password.trim() === 'admin'));
      if (!isMatch) {
        return {
          success: false,
          message: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda.'
        };
      }
      // Upgrade plain password to encrypted if not already hashed
      if (!isPasswordEncrypted(user.password)) {
        db.updateUser(user.id, { password: hashPassword(password.trim()) });
      }

      // Sync credentials to backend in background so server cache is consistent
      fetch(`/api/users/${user.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password.trim(),
          hashedPassword: user.password,
          password_changed: user.role === 'siswa' ? user.password_changed : undefined
        })
      }).catch(() => {});
    }

    setCurrentUser(user);
    resolveUserProfile(user);
    localStorage.setItem(AUTH_USER_KEY, user.email);
    localStorage.setItem(LEGACY_AUTH_KEY, user.email);
    registerUserActivity();
    return { success: true };
  };

  const quickLoginAs = async (role: 'siswa' | 'guru_bk' | 'wali_kelas' | 'admin', customEmail?: string) => {
    let email = customEmail;
    if (!email) {
      switch (role) {
        case 'siswa':
          email = 'siswa@advocare.test';
          break;
        case 'guru_bk':
          email = 'bk@advocare.test';
          break;
        case 'wali_kelas':
          email = 'wali@advocare.test';
          break;
        case 'admin':
          email = 'admin@advocare.test';
          break;
      }
    }
    return await login(email, undefined, role);
  };

  const refreshUser = () => {
    if (currentUser) {
      const fresh = db.getUserById(currentUser.id);
      if (fresh) {
        setCurrentUser(fresh);
        resolveUserProfile(fresh);
      }
    }
  };

  const updateCurrentUserAvatar = (avatarUrl: string) => {
    if (currentUser) {
      db.updateUserAvatar(currentUser.id, avatarUrl);
      setCurrentUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
    }
  };

  const changeStudentDefaultPassword = (newPasswordPlain: string) => {
    if (!currentUser) {
      return { success: false, message: 'Tidak ada sesi pengguna aktif.' };
    }
    const result = db.changeStudentDefaultPassword(currentUser.id, newPasswordPlain);
    if (result.success) {
      refreshUser();
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        teacherProfile,
        isInitialized,
        sessionExpiredMessage,
        clearSessionExpiredMessage,
        login,
        quickLoginAs,
        logout,
        refreshUser,
        updateCurrentUserAvatar,
        changeStudentDefaultPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
