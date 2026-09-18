import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  label: string;
  value: string | number;
  change?: string;
  isPositiveChange?: boolean;
  subtext?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'cyan';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  change,
  isPositiveChange,
  subtext,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'critical':
        return {
          border: 'border-rose-500/30 hover:border-rose-500/50',
          glow: 'from-rose-500/10 via-transparent to-transparent',
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          accent: 'text-rose-400',
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/50',
          glow: 'from-amber-500/10 via-transparent to-transparent',
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          accent: 'text-amber-400',
        };
      case 'success':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/50',
          glow: 'from-emerald-500/10 via-transparent to-transparent',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          accent: 'text-emerald-400',
        };
      case 'cyan':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-500/50',
          glow: 'from-cyan-500/10 via-transparent to-transparent',
          iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          accent: 'text-cyan-400',
        };
      default:
        return {
          border: 'border-slate-800 hover:border-slate-700',
          glow: 'from-cyan-500/5 via-transparent to-transparent',
          iconBg: 'bg-slate-800/80 text-cyan-400 border-slate-700/50',
          accent: 'text-slate-100',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-slate-900/80 p-4 backdrop-blur-md transition-all duration-200 ${theme.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 shadow-lg' : ''
      }`}
    >
      <div className={`absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${theme.glow} blur-xl pointer-events-none`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">{label}</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight font-mono ${theme.accent}`}>
              {value}
            </span>
            {change && (
              <span className={`text-xs font-semibold ${isPositiveChange ? 'text-emerald-400' : 'text-rose-400'}`}>
                {change}
              </span>
            )}
          </div>
          {subtext && (
            <p className="mt-1 text-[11px] text-slate-400 truncate max-w-[180px]">{subtext}</p>
          )}
        </div>

        {Icon && (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${theme.iconBg}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};
