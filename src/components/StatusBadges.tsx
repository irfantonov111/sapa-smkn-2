import React from 'react';
import {
  BookOpen,
  AlertTriangle,
  Users,
  Lightbulb,
  MessageCircle,
  HelpCircle,
  Clock,
  Eye,
  MessageSquare,
  Activity,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  UserX
} from 'lucide-react';
import { ReportStatus, ReportUrgency, ReportPrivacy } from '../types/database';

export const CategoryIcon: React.FC<{
  iconName: string;
  color?: string;
  className?: string;
}> = ({ iconName, color = 'blue', className = 'w-5 h-5' }) => {
  const getIcon = () => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Lightbulb':
        return <Lightbulb className={className} />;
      case 'MessageCircle':
        return <MessageCircle className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'rose':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'amber':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'emerald':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'indigo':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'blue':
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-xl p-2.5 border ${getColorClasses()}`}>
      {getIcon()}
    </div>
  );
};

export const StatusBadge: React.FC<{ status: ReportStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md'
}) => {
  const isSm = size === 'sm';
  const baseClasses = `inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap ${
    isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
  }`;

  switch (status) {
    case 'terkirim':
      return (
        <span className={`${baseClasses} bg-slate-100 text-slate-700 border-slate-300`}>
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Terkirim
        </span>
      );
    case 'dibaca':
      return (
        <span className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-300`}>
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          Dibaca Guru
        </span>
      );
    case 'direspons':
      return (
        <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-300`}>
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          Sudah Direspons
        </span>
      );
    case 'ditindaklanjuti':
      return (
        <span className={`${baseClasses} bg-purple-50 text-purple-700 border-purple-300`}>
          <Activity className="w-3.5 h-3.5 text-purple-600" />
          Ditindaklanjuti
        </span>
      );
    case 'selesai':
      return (
        <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-300`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Selesai
        </span>
      );
    default:
      return <span className={baseClasses}>{status}</span>;
  }
};

export const UrgencyBadge: React.FC<{ urgency: ReportUrgency }> = ({ urgency }) => {
  switch (urgency) {
    case 'tinggi':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
          Urgensi Tinggi
        </span>
      );
    case 'sedang':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Urgensi Sedang
        </span>
      );
    case 'rendah':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Urgensi Rendah
        </span>
      );
  }
};

export const PrivacyBadge: React.FC<{ privacy: ReportPrivacy }> = ({ privacy }) => {
  switch (privacy) {
    case 'anonim':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <UserX className="w-3 h-3" />
          Anonim
        </span>
      );
    case 'terbatas':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <ShieldAlert className="w-3 h-3" />
          Identitas Terbatas
        </span>
      );
    case 'terbuka':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3" />
          Identitas Terbuka
        </span>
      );
  }
};
