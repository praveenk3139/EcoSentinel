import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { ResponseTeam, EnvironmentalIssue } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Phone, 
  ShieldCheck, 
  AlertOctagon, 
  Check, 
  X, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const TeamsAssignmentView: React.FC = () => {
  const { 
    teams, 
    issues, 
    selectedIssueId, 
    setSelectedIssueId, 
    assignTeamToIssue, 
    setActiveTab, 
    currentUser,
    addToast 
  } = useApp();

  const [activeIssueId, setActiveIssueId] = useState<string>(selectedIssueId || 'ENV-104');
  const targetIssue = issues.find(i => i.id === activeIssueId) || issues[0];

  // Recommended team (Field Team 03 for ENV-104 or best match)
  const recommendedTeam = teams.find(t => t.id === targetIssue.recommendedTeamId) || teams[0];

  const handleApproveRecommendation = () => {
    assignTeamToIssue(targetIssue.id, recommendedTeam.id, recommendedTeam.leadName);
    addToast({
      type: 'success',
      title: 'AI Recommendation Approved',
      message: `Supervisor ${currentUser.name} officially dispatched ${recommendedTeam.name} to ${targetIssue.id}.`,
    });
  };

  const handleManualAssign = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    assignTeamToIssue(targetIssue.id, team.id, team.leadName);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>FIELD LOGISTICS & HUMAN-IN-THE-LOOP DISPATCH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Smart Personnel Assignment & Supervisor Approval
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-criteria routing algorithm ranking field teams by distance, required certifications, and live task load
          </p>
        </div>

        {/* Issue Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Select Incident:</span>
          <select
            value={activeIssueId}
            onChange={(e) => {
              setActiveIssueId(e.target.value);
              setSelectedIssueId(e.target.value);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {issues.map((i) => (
              <option key={i.id} value={i.id} className="bg-slate-900">
                {i.id} - {i.title.substring(0, 35)}... ({i.severity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. TARGET ISSUE SPOTLIGHT BAR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400">INCIDENT #{targetIssue.id}</span>
              <RiskBadge level={targetIssue.severity} size="sm" />
              <StatusBadge status={targetIssue.status} size="sm" />
            </div>
            <h2 className="text-base font-bold text-white mt-1">{targetIssue.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{targetIssue.locationDetails} • {targetIssue.areaName}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">CATEGORY</span>
              <strong className="text-slate-200">{targetIssue.categoryLabel}</strong>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-[10px] text-slate-400 block">PRIORITY</span>
              <strong className="text-amber-400">{targetIssue.priorityScore}/100</strong>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-[10px] text-slate-400 block">CURRENT ASSIGNED</span>
              <strong className="text-cyan-400">{targetIssue.assignedTeamName || 'Pending Assignment'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI RECOMMENDED TEAM SPOTLIGHT (Prompt Requirement 18) */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  TOP AI RECOMMENDED RESPONSE UNIT
                </span>
                <span className="text-xs font-mono text-slate-400">Node #FT-03</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {recommendedTeam.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {targetIssue.assignmentRecommendationReason || 'Closest specialized team with certified air-quality instrumentation. Low active queue ensures immediate dispatch.'}
              </p>

              {/* Specs Pills */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                <span className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-300">
                  Lead: <strong className="text-white">{recommendedTeam.leadName}</strong>
                </span>
                <span className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-300">
                  Distance: <strong className="text-emerald-400">{recommendedTeam.distanceKm} km</strong>
                </span>
                <span className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-300">
                  ETA: <strong className="text-cyan-400">{recommendedTeam.etaMinutes} mins</strong>
                </span>
                <span className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-300">
                  Status: <strong className="text-emerald-400">{recommendedTeam.status}</strong>
                </span>
                <span className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-300">
                  Current Tasks: <strong className="text-amber-400">{recommendedTeam.currentTasksCount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Supervisor Action Box (Prompt: AI only recommends, Authorized personnel must confirm) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 shrink-0 flex flex-col gap-2.5 min-w-[240px]">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Supervisor Action:
            </span>
            <button
              onClick={handleApproveRecommendation}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Check className="h-4 w-4" />
              <span>Approve & Dispatch Team</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center leading-tight">
              Confirmation creates official dispatch log under {currentUser.name}.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ALL AVAILABLE RESPONSE TEAMS DIRECTORY */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide mb-4">
          All Municipal & Regional Response Units ({teams.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{team.code}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    team.status === 'AVAILABLE' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                  }`}>
                    {team.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100">{team.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Lead: {team.leadName} • {team.phone}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">Base: {team.homeBaseZone}</p>

                {/* Skills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {team.skills.map((skill, idx) => (
                    <span key={idx} className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  <span>{team.distanceKm} km away</span> • <span>ETA {team.etaMinutes}m</span> • <span>{team.currentTasksCount} Tasks Active</span>
                </div>

                <button
                  onClick={() => handleManualAssign(team.id)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Manually Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
