import React from 'react';
import { RiskLevel, IssueSeverity, IssueStatus } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | IssueSeverity;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = true }) => {
  const getStyles = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          dot: 'bg-rose-500 animate-pulse',
          label: 'CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-red-950/70 text-red-300 border-red-500/40',
          dot: 'bg-red-500',
          label: 'HIGH',
        };
      case 'ELEVATED':
        return {
          bg: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'ELEVATED',
        };
      case 'MODERATE':
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/30',
          dot: 'bg-yellow-400',
          label: 'MODERATE',
        };
      case 'LOW':
        return {
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: 'LOW',
        };
      case 'NORMAL':
      default:
        return {
          bg: 'bg-teal-950/50 text-teal-300 border-teal-500/30',
          dot: 'bg-teal-400',
          label: 'NORMAL',
        };
    }
  };

  const { bg, dot, label } = getStyles();
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-semibold tracking-wider',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wider',
    lg: 'text-sm px-3 py-1.5 font-bold tracking-wider',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${sizeClasses} uppercase font-mono shadow-xs`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      <span>{label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: IssueStatus | 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'ONLINE':
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: status === 'ONLINE' ? 'Online' : 'Resolved',
        };
      case 'OFFLINE':
      case 'ESCALATED':
      case 'REOPENED':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          dot: 'bg-rose-500 animate-pulse',
          label: status.replace('_', ' '),
        };
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return {
          bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          dot: 'bg-cyan-400 animate-pulse',
          label: status.replace('_', ' '),
        };
      case 'UNDER_VERIFICATION':
      case 'RESOLUTION_SUBMITTED':
        return {
          bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400',
          label: 'Verification Pending',
        };
      case 'ASSIGNED':
      case 'TRIAGED':
        return {
          bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          label: status,
        };
      case 'MAINTENANCE':
      case 'PENDING':
      default:
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: status,
        };
    }
  };

  const { bg, dot, label } = getStyles();
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${bg} ${sizeClasses} font-medium tracking-wide shadow-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="capitalize">{label}</span>
    </span>
  );
};
