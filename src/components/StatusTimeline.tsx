import React from 'react';
import { Check, Clock, Eye, MessageSquare, Activity, CheckCircle2 } from 'lucide-react';
import { ReportStatus, ReportStatusHistory } from '../types/database';

interface StatusTimelineProps {
  currentStatus: ReportStatus;
  history?: (ReportStatusHistory & { changer_name?: string })[];
  compact?: boolean;
}

interface StepConfig {
  key: ReportStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    key: 'terkirim',
    label: 'Terkirim',
    description: 'Laporan telah masuk ke sistem',
    icon: Clock
  },
  {
    key: 'dibaca',
    label: 'Dibaca',
    description: 'Laporan dibuka oleh guru',
    icon: Eye
  },
  {
    key: 'direspons',
    label: 'Direspons',
    description: 'Guru memberikan balasan pesan',
    icon: MessageSquare
  },
  {
    key: 'ditindaklanjuti',
    label: 'Ditindaklanjuti',
    description: 'Penanganan bimbingan / solusi',
    icon: Activity
  },
  {
    key: 'selesai',
    label: 'Selesai',
    description: 'Masalah terselesaikan',
    icon: CheckCircle2
  }
];

const STATUS_ORDER: Record<ReportStatus, number> = {
  terkirim: 0,
  dibaca: 1,
  direspons: 2,
  ditindaklanjuti: 3,
  selesai: 4
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  history = [],
  compact = false
}) => {
  const currentIndex = STATUS_ORDER[currentStatus] ?? 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between w-full py-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium ${
                    isCurrent ? 'text-blue-700 font-bold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded ${
                    idx < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Horizontal Progress Flow */}
      <div className="hidden sm:flex items-center justify-between bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center text-center max-w-[100px]">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span
                  className={`text-xs mt-2 font-semibold ${
                    isCurrent ? 'text-blue-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight mt-0.5">{step.description}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Vertical Detailed Timeline with Action Log History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Riwayat & Alur Tindak Lanjut
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            // Find matching history items for this step
            const matchedHistories = history.filter(h => h.status === step.key);

            return (
              <div key={step.key} className="relative group">
                {/* Node icon dot */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-blue-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>

                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded-full">
                        Status Terkini
                      </span>
                    )}

                    {isDone && matchedHistories.length > 0 && (
                      <span className="text-xs text-slate-400">
                        {new Date(matchedHistories[matchedHistories.length - 1].created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>

                  {matchedHistories.length > 0 ? (
                    <div className="mt-1 space-y-1">
                      {matchedHistories.map(h => (
                        <div key={h.id} className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <p className="font-medium text-slate-700">{h.note || step.description}</p>
                          {h.changer_name && (
                            <p className="text-[11px] text-slate-400 mt-0.5">Oleh: {h.changer_name}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs mt-0.5 ${isPending ? 'text-slate-400 italic' : 'text-slate-500'}`}>
                      {isPending ? 'Menunggu tahap ini dilakukan oleh guru/wali.' : step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
