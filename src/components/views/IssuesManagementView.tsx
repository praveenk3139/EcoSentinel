import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { EnvironmentalIssue, IssueStatus, IssueSeverity } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  X,
  FileText,
  Camera,
  History
} from 'lucide-react';

export const IssuesManagementView: React.FC = () => {
  const { 
    issues, 
    selectedIssueId, 
    setSelectedIssueId, 
    teams, 
    assignTeamToIssue, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIssueModal, setSelectedIssueModal] = useState<EnvironmentalIssue | null>(
    issues.find(i => i.id === selectedIssueId) || issues[0] || null
  );

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.id.toLowerCase().includes(search.toLowerCase()) ||
                          issue.title.toLowerCase().includes(search.toLowerCase()) ||
                          issue.areaName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (severityFilter !== 'ALL' && issue.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
            <span>INCIDENT COMMAND & CLOSED-LOOP REMEDIATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Environmental Issues & Smart Priority Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated threshold anomalies, citizen intake triage, weighted exposure scoring, and audit trails
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 text-rose-300 font-bold">
            {issues.filter(i => i.status !== 'RESOLVED').length} Active Incidents
          </span>
          <span className="rounded bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 text-emerald-300 font-bold">
            {issues.filter(i => i.status === 'RESOLVED').length} Resolved
          </span>
        </div>
      </div>

      {/* 1. FILTER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, Title, Area, Trigger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-750 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-slate-750 bg-slate-950 px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-750 bg-slate-950 px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_VERIFICATION">Under Verification</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REOPENED">Reopened</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT: ISSUES LIST (LEFT) & DETAILED INSPECTOR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Issues List (Left) */}
        <div className="lg:col-span-6 space-y-3">
          {filteredIssues.map((issue) => {
            const isSelected = selectedIssueModal?.id === issue.id;

            return (
              <div
                key={issue.id}
                onClick={() => {
                  setSelectedIssueModal(issue);
                  setSelectedIssueId(issue.id);
                }}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-500/50 bg-cyan-950/20 shadow-xl'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{issue.id}</span>
                    <span className="text-xs text-slate-400">• {issue.areaName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={issue.severity} size="sm" />
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-1">{issue.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {issue.triggerDetails}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2.5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{issue.detectedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      Assigned: <strong className="text-slate-200">{issue.assignedTeamName || 'Unassigned'}</strong>
                    </span>
                    <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-300 font-bold">
                      Priority {issue.priorityScore}/100
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Issue Details & Smart Priority Engine Inspector (Right) */}
        {selectedIssueModal && (
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    INCIDENT DOSSIER #{selectedIssueModal.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={selectedIssueModal.severity} size="sm" />
                    <StatusBadge status={selectedIssueModal.status} size="sm" />
                  </div>
                </div>
                <h2 className="text-base font-bold text-white">{selectedIssueModal.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedIssueModal.locationDetails} ({selectedIssueModal.areaName})
                </p>
              </div>

              {/* SMART PRIORITY ENGINE REASONING (Prompt Requirement 17) */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                    <Cpu className="h-4 w-4" />
                    <span>Smart Priority Engine Score: {selectedIssueModal.priorityScore}/100</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Transparent AI Triage</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {selectedIssueModal.priorityFactors.map((pf, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      <span className="text-slate-300">{pf.factor}</span>
                      <span className="font-mono font-bold text-amber-400">{pf.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensor Readings & Telemetry Trigger */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 mb-4 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                  Trigger Sensor Readings Before Remediation:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  {selectedIssueModal.sensorReadingsBefore.map((reading, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-2 rounded">
                      <span className="text-[9px] text-slate-500 block">{reading.label}</span>
                      <strong className="text-slate-200">{reading.value} {reading.unit}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Evidence Photos (if uploaded) */}
              {selectedIssueModal.evidence.length > 0 && (
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                    Field Photographic Evidence:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedIssueModal.evidence.map((ev) => (
                      <div key={ev.id} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
                        <img src={ev.imageUrl} alt={ev.caption} className="h-32 w-full object-cover" />
                        <div className="p-2.5">
                          <span className="font-mono text-[9px] font-bold text-cyan-400 block uppercase">{ev.type} INTERVENTION</span>
                          <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">{ev.caption}</p>
                          <span className="text-[9px] text-slate-500 mt-1 block">{ev.uploadedBy} • {ev.uploadedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incident Audit Timeline */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                  Closed-Loop Incident Timeline:
                </span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs">
                  {selectedIssueModal.timeline.map((event) => (
                    <div key={event.id} className="border-l-2 border-cyan-500/50 pl-3 py-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-slate-200">{event.action}</span>
                        <span className="text-slate-500">{event.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{event.details}</p>
                      <span className="text-[10px] text-cyan-400 font-mono">Actor: {event.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setActiveTab('teams')}
                className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-3 transition-colors shadow-md flex items-center gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Smart Team Dispatch</span>
              </button>

              <button
                onClick={() => setActiveTab('verification')}
                className="rounded-lg border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 font-bold text-xs py-2 px-3 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verify Resolution</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
