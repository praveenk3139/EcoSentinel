import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { EnvironmentalIssue } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, 
  AlertOctagon, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Camera, 
  Activity, 
  TrendingDown, 
  TrendingUp,
  UserCheck,
  Sparkles,
  Flame
} from 'lucide-react';

export const ResolutionVerificationView: React.FC = () => {
  const { 
    issues, 
    approveResolution, 
    triggerScenario, 
    updateIssueStatus, 
    currentUser, 
    addToast 
  } = useApp();

  // Target verified issue (ENV-104 or first pending verification)
  const [selectedIssueId, setSelectedIssueId] = useState<string>('ENV-104');
  const targetIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  const handleSupervisorApproval = () => {
    approveResolution(targetIssue.id, 'Post-intervention sensor readings and photo evidence validated.');
  };

  const handleSimulateSecondarySpike = () => {
    // Reopen issue demonstration
    updateIssueStatus(
      targetIssue.id,
      'REOPENED',
      'Automated Telemetry Sentry: Secondary PM2.5 spike detected (122 µg/m³) after initial suppression. Reopened issue.'
    );
    addToast({
      type: 'error',
      title: 'Closed-Loop Trigger: Incident Reopened',
      message: `Secondary particulate resurgence detected at ${targetIssue.locationDetails}. Reopened ${targetIssue.id} and alerted Field Team 03.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
            <span>RIGOROUS CLOSED-LOOP VALIDATION & AUDIT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Resolution Verification & Closed-Loop Lifecycle
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconciling before-and-after IoT telemetry, photographic proof, supervisor validation, and secondary spike sentinels
          </p>
        </div>

        {/* Issue Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Incident Target:</span>
          <select
            value={targetIssue.id}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {issues.map((i) => (
              <option key={i.id} value={i.id} className="bg-slate-900">
                {i.id} - {i.title.substring(0, 32)}... ({i.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. CLOSED-LOOP INTERACTIVE LIFECYCLE BAR (Prompt Requirement 22) */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                CLOSED-LOOP VERIFICATION PIPELINE
              </span>
              <span className="text-xs font-mono text-slate-400">Incident #{targetIssue.id}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Deterministic 8-Stage Closed-Loop Architecture
            </h3>
          </div>

          {/* Interactive Simulation Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateSecondarySpike}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 font-bold text-xs py-2 px-3 transition-colors shadow-md"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Simulate Secondary Hazard Spike (Auto-Reopen)</span>
            </button>
          </div>
        </div>

        {/* 8-Stage Visual Sequence */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs font-mono">
          {[
            { num: 1, label: 'Spike Detected', status: 'done', detail: 'PM2.5 @ 118' },
            { num: 2, label: 'Issue Flagged', status: 'done', detail: 'ENV-104 Triaged' },
            { num: 3, label: 'Team Dispatched', status: 'done', detail: 'Team 03 En Route' },
            { num: 4, label: 'Field Misting', status: 'done', detail: 'Containment active' },
            { num: 5, label: 'Telemetry Drop', status: 'done', detail: 'PM2.5 -> 34 µg' },
            { num: 6, label: 'Photos Verified', status: targetIssue.evidence.length > 0 ? 'done' : 'pending', detail: `${targetIssue.evidence.length} photos` },
            { num: 7, label: 'Supervisor Sign', status: targetIssue.status === 'RESOLVED' ? 'done' : 'active', detail: targetIssue.verifiedBy || 'Pending' },
            { num: 8, label: 'Closed / Guarded', status: targetIssue.status === 'RESOLVED' ? 'done' : targetIssue.status === 'REOPENED' ? 'reopened' : 'pending', detail: targetIssue.status === 'REOPENED' ? 'REOPENED SPIKE' : 'Sentry Monitoring' },
          ].map((stage) => (
            <div
              key={stage.num}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                stage.status === 'done'
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : stage.status === 'active'
                  ? 'border-cyan-500/60 bg-cyan-950/50 text-cyan-300 animate-pulse'
                  : stage.status === 'reopened'
                  ? 'border-rose-500/80 bg-rose-950/60 text-rose-300 font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-500'
              }`}
            >
              <span className="text-[10px] text-slate-400 block font-bold">STAGE {stage.num}</span>
              <strong className="text-[11px] block mt-0.5">{stage.label}</strong>
              <span className="text-[9px] text-slate-400 block mt-1 truncate">{stage.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BEFORE VS AFTER SENSOR TELEMETRY COMPARISON (Prompt Requirement 21) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Quantitative Environmental Telemetry: Before vs. After Remediation
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
            <TrendingDown className="h-4 w-4" /> 58.7% Aggregate Hazard Reduction
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PM2.5 Card (Directly matching Prompt Requirement 21) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">PM2.5 Optical Particulate</span>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-400 block">BEFORE</span>
                <span className="text-xl font-bold text-rose-400">92 µg/m³</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600" />
              <div>
                <span className="text-[10px] text-emerald-400 block">AFTER</span>
                <span className="text-xl font-bold text-emerald-400">38 µg/m³</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center justify-between">
              <span>Status: Safe WHO Category</span>
              <span>-58.7% drop</span>
            </div>
          </div>

          {/* PM10 Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">PM10 Coarse Particulate</span>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-400 block">BEFORE</span>
                <span className="text-xl font-bold text-rose-400">148 µg/m³</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600" />
              <div>
                <span className="text-[10px] text-emerald-400 block">AFTER</span>
                <span className="text-xl font-bold text-emerald-400">54 µg/m³</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center justify-between">
              <span>Status: Threshold Restored</span>
              <span>-63.5% drop</span>
            </div>
          </div>

          {/* AQI Index Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Composite Air Quality Index (AQI)</span>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 block">BEFORE</span>
                <span className="text-xl font-bold text-amber-400">188 (Poor)</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600" />
              <div>
                <span className="text-[10px] text-emerald-400 block">AFTER</span>
                <span className="text-xl font-bold text-emerald-400">58 (Moderate)</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center justify-between">
              <span>Status: Continuous 2h Stability</span>
              <span>Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BEFORE AND AFTER PHOTOGRAPHIC EVIDENCE GALLERY */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Field Photographic Evidence: Before vs. After Intervention
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Geo-tagged with tamper-resistant metadata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Before Photo */}
          <div className="rounded-xl border border-rose-500/30 bg-slate-950 overflow-hidden">
            <div className="relative">
              <img
                src={targetIssue.evidence.find(e => e.type === 'BEFORE')?.imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80'}
                alt="Before Remediation"
                className="h-56 w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded bg-rose-600 px-2.5 py-1 text-xs font-bold text-white font-mono">
                BEFORE INTERVENTION
              </span>
            </div>
            <div className="p-4 text-xs">
              <h4 className="font-bold text-white">Uncontained Particulate & Stagnation Source</h4>
              <p className="text-slate-400 mt-1 text-[11px]">
                {targetIssue.evidence.find(e => e.type === 'BEFORE')?.caption || 'Significant particulate release observed from excavation corridor. Optical dust sensors breached 92 µg/m³.'}
              </p>
            </div>
          </div>

          {/* After Photo */}
          <div className="rounded-xl border border-emerald-500/30 bg-slate-950 overflow-hidden">
            <div className="relative">
              <img
                src={targetIssue.evidence.find(e => e.type === 'AFTER')?.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                alt="After Remediation"
                className="h-56 w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white font-mono">
                AFTER REMEDIATION
              </span>
            </div>
            <div className="p-4 text-xs">
              <h4 className="font-bold text-white">Controlled Corridor with Active Dust-Suppression</h4>
              <p className="text-slate-400 mt-1 text-[11px]">
                {targetIssue.evidence.find(e => e.type === 'AFTER')?.caption || 'Water mist cannon deployed. Surface aggregate sealed. Post-treatment readings stabilized at 38 µg/m³.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUPERVISOR VERIFICATION ACTION BOX */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
              MUNICIPAL SUPERVISOR VERIFICATION
            </span>
            <span className="text-xs font-mono text-slate-400">Officer: {currentUser.name}</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            Sign & Officially Close Incident Dossier #{targetIssue.id}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Confirming that sensor readings have satisfied the 2-hour minimum stability requirement and photographic documentation is legally sufficient.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {targetIssue.status === 'RESOLVED' ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 px-4 py-2 text-xs font-mono font-bold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Officially Closed & Verified ({targetIssue.verifiedBy})</span>
            </div>
          ) : (
            <button
              onClick={handleSupervisorApproval}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 px-4 shadow-lg shadow-purple-600/30 transition-all"
            >
              <UserCheck className="h-4 w-4" />
              <span>Approve & Verify Resolution</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
