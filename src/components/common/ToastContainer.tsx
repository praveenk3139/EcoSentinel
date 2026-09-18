import React from 'react';
import { useApp } from '../../services/appState';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
            case 'error':
              return <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
          }
        };

        const getBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/40 bg-slate-900/95';
            case 'warning':
              return 'border-amber-500/40 bg-slate-900/95';
            case 'error':
              return 'border-rose-500/40 bg-slate-900/95';
            default:
              return 'border-cyan-500/40 bg-slate-900/95';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${getBorder()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">{toast.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-300 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
