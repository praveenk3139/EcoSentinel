import React from 'react';
import { DeviceStatus, IssueStatus } from '../../types';

interface StatusBadgeProps {
  status: DeviceStatus | IssueStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyle = () => {
    switch (status) {
      case 'ONLINE':
      case 'AVAILABLE':
      case 'RESOLVED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'ACCEPTED':
      case 'IN_PROGRESS':
      case 'UNDER_VERIFICATION':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      case 'ASSIGNED':
      case 'TRIAGED':
      case 'BUSY':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'PENDING':
      case 'OFFLINE':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'CRITICAL':
      case 'REOPENED':
      case 'ESCALATED':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'MAINTENANCE':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getLabel = () => {
    return status.replace(/_/g, ' ');
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono font-bold uppercase tracking-wider ${sizeClass} ${getStyle()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      <span>{getLabel()}</span>
    </span>
  );
};
