import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateReportPage } from './pages/CreateReportPage';
import { ReportsListPage } from './pages/ReportsListPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { TeacherMoodCheckPage } from './pages/TeacherMoodCheckPage';
import { FirstTimePasswordModal } from './components/FirstTimePasswordModal';
import { MobileDrawer } from './components/MobileDrawer';
import { Shield } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [preselectedTeacherId, setPreselectedTeacherId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // If already logged in and on landing/login, default to dashboard
  const handleNavigate = (tab: string, reportId?: string, extraParam?: string) => {
    if (reportId) {
      setSelectedReportId(reportId);
    }
    if (extraParam) {
      setPreselectedTeacherId(extraParam);
    } else if (tab !== 'create') {
      setPreselectedTeacherId(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Automatically synchronize active view when role changes (e.g. from quick switcher)
  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'landing' || activeTab === 'login') {
        setActiveTab('dashboard');
      } else if (currentUser.role !== 'siswa' && activeTab === 'create') {
        setActiveTab('dashboard');
      } else if (currentUser.role === 'siswa' && (activeTab === 'inbox' || activeTab === 'follow-up' || activeTab === 'resolved' || activeTab.startsWith('admin'))) {
        setActiveTab('dashboard');
      } else if (currentUser.role !== 'admin' && activeTab.startsWith('admin')) {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser?.role, currentUser?.email]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Memuat SAPA...</span>
        </div>
      </div>
    );
  }

  // Routing renderer
  const renderContent = () => {
    // 1. Unauthenticated views
    if (!currentUser) {
      if (activeTab === 'login') {
        return <LoginPage onNavigate={handleNavigate} />;
      }
      return <LandingPage onNavigate={handleNavigate} />;
    }

    // 2. Authenticated views
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;

      case 'dashboard':
        if (currentUser.role === 'siswa') {
          return <StudentDashboard onNavigate={handleNavigate} />;
        } else if (currentUser.role === 'guru') {
          return <TeacherDashboard onNavigate={handleNavigate} />;
        } else {
          return <AdminDashboard onNavigate={handleNavigate} />;
        }

      case 'create':
        return <CreateReportPage onNavigate={handleNavigate} preselectedTeacherId={preselectedTeacherId} />;

      case 'my-reports':
      case 'inbox':
        return <ReportsListPage key="inbox" onNavigate={handleNavigate} />;

      case 'follow-up':
        return <ReportsListPage key="follow-up" onNavigate={handleNavigate} statusFilterPreset="ditindaklanjuti" />;

      case 'resolved':
        return <ReportsListPage key="resolved" onNavigate={handleNavigate} statusFilterPreset="selesai" />;

      case 'detail':
        return selectedReportId ? (
          <ReportDetailPage reportId={selectedReportId} onNavigate={handleNavigate} />
        ) : (
          <ReportsListPage key="fallback-list" onNavigate={handleNavigate} />
        );

      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;

      case 'announcements':
        return <AnnouncementsPage onNavigate={handleNavigate} />;

      case 'mood-check':
        return <TeacherMoodCheckPage onNavigate={handleNavigate} />;

      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;

      case 'admin':
        return <AdminDashboard key="admin-dashboard" onNavigate={handleNavigate} activeSubTab="dashboard" />;

      case 'admin-reports':
        return <AdminDashboard key="admin-reports" onNavigate={handleNavigate} activeSubTab="reports" />;

      case 'admin-users':
        return <AdminDashboard key="admin-users" onNavigate={handleNavigate} activeSubTab="users" />;

      case 'admin-categories':
        return <AdminDashboard key="admin-categories" onNavigate={handleNavigate} activeSubTab="categories" />;

      default:
        return currentUser.role === 'siswa' ? (
          <StudentDashboard onNavigate={handleNavigate} />
        ) : (
          <TeacherDashboard onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Global Header */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Primary Navigation Sub-Bar (Full-Width, Centered Tabs for Logged-In Users) */}
      {currentUser && activeTab !== 'landing' && (
        <Navigation
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
      )}

      {/* Mobile Drawer (Accessible from header & bottom nav across all roles) */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area - Full-Width, Balanced & Centered */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {renderContent()}
      </main>

      {/* Modal Pergantian Kata Sandi Default Siswa (1x saat login pertama) */}
      <FirstTimePasswordModal />

      {/* Bottom Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">SAPA</span>
            <span>—</span>
            <span>Sarana Pendampingan dan Asistensi Siswa</span>
          </div>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SAPA (Sarana Pendampingan dan Asistensi Siswa). Platform Layanan Pengaduan & Bimbingan Konseling Siswa.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
