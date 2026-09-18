import React from 'react';
import { useApp } from '../../services/appState';
import { StatCard } from '../common/StatCard';
import { GisMap } from '../map/GisMap';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Activity, 
  BrainCircuit, 
  MapPin, 
  Users, 
  Wind, 
  Droplet, 
  Flame, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Plus,
  Sliders,
  Send,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { 
    areas, 
    devices, 
    issues, 
    teams, 
    healthRisks, 
    setSelectedIssueId, 
    setSelectedDeviceId,
    setActiveTab 
  } = useApp();

  const totalAreas = areas.length;
  const onlineDevices = devices.filter(d => d.status === 'ONLINE').length;
  const offlineDevices = devices.filter(d => d.status === 'OFFLINE').length;
  const activeIssues = issues.filter(i => i.status !== 'RESOLVED');
  const criticalIssues = issues.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED');

  // Spotlight zone (Zone 07 or first with high risk)
  const spotlightZone = areas.find(a => a.id === 'zone-07') || areas[0];
  const spotlightPrediction = healthRisks[spotlightZone?.id];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1600px] mx-auto font-sans">
      {/* 1. VISUAL 3-STEP GUIDE: HOW THE SYSTEM WORKS */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                <span>EcoSentinel AI Workflow</span>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">AUTOMATED</span>
              </h2>
              <p className="text-xs text-slate-400">
                Simple 3-step closed-loop pipeline from city sensors to automated field response
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('devices')}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-3.5 py-2 text-xs font-bold text-white transition-colors font-mono"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Manage Sensors & Placement</span>
            </button>
            <button
              onClick={() => setActiveTab('citizen-report')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors font-mono"
            >
              <Send className="h-3.5 w-3.5 text-cyan-400" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* 3 Steps Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-bold font-mono text-xs">
              01
            </div>
            <div>
              <strong className="text-xs font-bold text-white block">1. Sensors Ingest Data</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Solar ESP32 nodes capture real-time PM2.5, Water pH, Toxic Gases & Noise across city wards.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 font-bold font-mono text-xs">
              02
            </div>
            <div>
              <strong className="text-xs font-bold text-white block">2. AI Predicts Health Hazard</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Machine learning models forecast acute pollution hotspots and estimated respiratory risk.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-bold font-mono text-xs">
              03
            </div>
            <div>
              <strong className="text-xs font-bold text-white block">3. Automated Response</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Triggers edge mist cannons & alerts field workers to remediate before-after proof.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KEY STATS AT A GLANCE */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 font-mono">
        <StatCard
          label="Total City Wards"
          value={totalAreas}
          subtext="Monitoring Zones"
          icon={MapPin}
          onClick={() => setActiveTab('environment')}
        />
        <StatCard
          label="Placed Sensors"
          value={devices.length}
          subtext="Active in Mesh"
          icon={Radio}
          onClick={() => setActiveTab('devices')}
        />
        <StatCard
          label="Online Nodes"
          value={onlineDevices}
          change={`${devices.length > 0 ? Math.round((onlineDevices/devices.length)*100) : 0}% Uptime`}
          isPositiveChange={true}
          variant="success"
          icon={Activity}
          onClick={() => setActiveTab('devices')}
        />
        <StatCard
          label="Active Issues"
          value={activeIssues.length}
          subtext="Under Action"
          variant="cyan"
          icon={AlertOctagon}
          onClick={() => setActiveTab('issues')}
        />
        <StatCard
          label="Critical Priority"
          value={criticalIssues.length}
          subtext="Immediate Dispatch"
          variant="critical"
          icon={ShieldAlert}
          onClick={() => setActiveTab('issues')}
        />
        <StatCard
          label="Resolution Proof"
          value="94.2%"
          change="Closed-Loop"
          isPositiveChange={true}
          variant="success"
          icon={CheckCircle2}
          onClick={() => setActiveTab('verification')}
        />
      </div>

      {/* 3. MAIN WORKSPACE: INTERACTIVE MAP & AI RISK PANEL */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: Live GIS City Map */}
        <div className="lg:col-span-8 flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">Live City GIS Monitoring Map</h3>
                <p className="text-[11px] text-slate-400">Click any sensor marker to inspect live air/water readings & dispatch teams</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('devices')}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-slate-700 transition-colors font-mono"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Device Location</span>
              </button>
              <button
                onClick={() => setActiveTab('live-map')}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors font-mono"
              >
                <span>Full Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-slate-800">
            <GisMap height="100%" />
          </div>
        </div>

        {/* RIGHT: AI Risk Prediction Spotlight */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-mono">AI Health Hazard Risk</h3>
                  <p className="text-[10px] text-cyan-400 font-mono">XGBoost & Temporal AI Prediction</p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                <Sparkles className="h-3 w-3" /> Live
              </span>
            </div>

            {/* Spotlight Zone Details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">High Risk Area</span>
                <span className="text-xs font-bold text-slate-200">{spotlightZone?.name}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Risk</span>
                  <RiskBadge level={spotlightPrediction?.overallRisk || 'ELEVATED'} size="md" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">AI Confidence</span>
                  <span className="text-base font-mono font-bold text-cyan-400">
                    {spotlightPrediction?.modelConfidence || 88}%
                  </span>
                </div>
              </div>

              {/* Modeled Patterns */}
              <div className="border-t border-slate-800/80 pt-2.5 space-y-1.5">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block">
                  Estimated Risk Patterns:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                    <span className="text-slate-400 block text-[9px]">Respiratory</span>
                    <strong className="text-amber-400">
                      {spotlightPrediction?.riskPatterns.respiratory || 'Elevated'}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                    <span className="text-slate-400 block text-[9px]">Mosquito</span>
                    <strong className="text-cyan-400">
                      {spotlightPrediction?.riskPatterns.mosquitoVectorBorne || 'Moderate'}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                    <span className="text-slate-400 block text-[9px]">Water-Borne</span>
                    <strong className="text-emerald-400">
                      {spotlightPrediction?.riskPatterns.waterBorne || 'Low'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Protocol Note */}
            <div className="mt-3.5 rounded-xl border border-slate-800 bg-slate-950/50 p-2.5 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Operational Note:</strong> AI predicts environmental hazard exposure patterns for municipal remediation.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('disease-risk')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-bold text-white transition-all shadow-md font-mono"
            >
              <span>View Full Health-Risk Intelligence</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE ISSUES & RESPONSE TEAMS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Active Environmental Incidents */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <AlertOctagon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">Active City Incidents</h3>
                <p className="text-[11px] text-slate-400">Requires field team triage and verified remediation</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('issues')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {activeIssues.slice(0, 4).map((issue) => (
              <div
                key={issue.id}
                onClick={() => {
                  setSelectedIssueId(issue.id);
                  setActiveTab('issues');
                }}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold font-mono text-xs ${
                    issue.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {issue.priorityScore}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{issue.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{issue.locationDetails} • {issue.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <RiskBadge level={issue.severity} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Response Teams */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">Rapid Response Teams</h3>
                <p className="text-[11px] text-slate-400">Field personnel ready for immediate deployment</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('teams')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {teams.slice(0, 4).map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{team.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Lead: {team.leadName} • ETA: {team.etaMinutes}m</span>
                </div>

                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold font-mono ${
                  team.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {team.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
