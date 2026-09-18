import React from 'react';
import { useApp } from '../../services/appState';
import { MonitoringArea } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { X, MapPin, Users, Radio, AlertTriangle, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface AreaOverviewDrawerProps {
  area: MonitoringArea | null;
  onClose: () => void;
}

export const AreaOverviewDrawer: React.FC<AreaOverviewDrawerProps> = ({ area, onClose }) => {
  const { setActiveTab, setSelectedAreaId, issues, teams, healthRisks } = useApp();

  if (!area) return null;

  const areaIssues = issues.filter(i => i.areaId === area.id && i.status !== 'RESOLVED');
  const areaTeams = teams.filter(t => t.homeBaseZone.toLowerCase().includes(area.code.toLowerCase()) || t.distanceKm < 5.0);
  const healthRisk = healthRisks[area.id];

  return (
    <div className="absolute right-4 top-4 z-[1000] w-80 sm:w-96 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-4 duration-200">
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
            Spatial Area Overview
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">{area.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">{area.description}</p>

      {/* Grid Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Environmental Risk</span>
          <div className="mt-1">
            <RiskBadge level={area.currentRisk} size="sm" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Average AQI</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-slate-100">{area.averageAqi}</span>
            <span className="text-[10px] text-amber-400 font-semibold">+18% 24h</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Active Devices</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-base font-mono font-bold text-emerald-400">{area.onlineDevices}</span>
            <span className="text-[10px] text-slate-400">of {area.totalDevices} Online</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Active Issues</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-base font-mono font-bold text-rose-400">{areaIssues.length}</span>
            <span className="text-[10px] text-slate-400">In Triage</span>
          </div>
        </div>
      </div>

      {/* Modeled Health Risk snippet */}
      {healthRisk && (
        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2.5 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300">
            <span>Estimated Health Risk: {healthRisk.overallRisk}</span>
            <span className="font-mono text-[10px]">Confidence: {healthRisk.modelConfidence}%</span>
          </div>
          <div className="mt-1.5 flex gap-2 text-[10px] text-slate-400">
            <span>Resp: <strong className="text-amber-300">{healthRisk.riskPatterns.respiratory}</strong></span>
            <span>Vector: <strong className="text-cyan-300">{healthRisk.riskPatterns.mosquitoVectorBorne}</strong></span>
            <span>Water: <strong className="text-emerald-300">{healthRisk.riskPatterns.waterBorne}</strong></span>
          </div>
        </div>
      )}

      {/* Sensitive Receptors */}
      <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
        <span>Sensitive Sites:</span>
        <span className="font-mono text-slate-300">
          {area.sensitiveSites.schools} Schools • {area.sensitiveSites.hospitals} Hospitals
        </span>
      </div>

      {/* Prompt-mandated navigation buttons: [View Area] [View Devices] [View Risks] [View Issues] */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => {
            setSelectedAreaId(area.id);
            setActiveTab('environment');
          }}
          className="rounded-lg border border-slate-700 bg-slate-800/80 py-1.5 text-slate-200 hover:bg-slate-700 transition-colors font-medium text-center"
        >
          View Area
        </button>
        <button
          onClick={() => {
            setSelectedAreaId(area.id);
            setActiveTab('devices');
          }}
          className="rounded-lg border border-slate-700 bg-slate-800/80 py-1.5 text-slate-200 hover:bg-slate-700 transition-colors font-medium text-center"
        >
          View Devices
        </button>
        <button
          onClick={() => {
            setSelectedAreaId(area.id);
            setActiveTab('disease-risk');
          }}
          className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 py-1.5 text-cyan-300 hover:bg-cyan-900/40 transition-colors font-semibold text-center"
        >
          View Risks
        </button>
        <button
          onClick={() => {
            setSelectedAreaId(area.id);
            setActiveTab('issues');
          }}
          className="rounded-lg border border-rose-500/30 bg-rose-950/40 py-1.5 text-rose-300 hover:bg-rose-900/40 transition-colors font-semibold text-center"
        >
          View Issues ({areaIssues.length})
        </button>
      </div>
    </div>
  );
};
