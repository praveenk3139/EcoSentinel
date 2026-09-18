import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { StatCard } from '../common/StatCard';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  Activity,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { areas, addToast } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<'AQI' | 'WATER' | 'SLA' | 'COMPLIANCE'>('AQI');

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
            <span>EXECUTIVE INTELLIGENCE & LONGITUDINAL KPI SUITE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Environmental Analytics & SLA Performance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cross-zone epidemiological correlations, response duration benchmarks, and air-shed containment velocity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast({ type: 'success', title: 'Analytics Report Exported', message: 'Comprehensive monthly performance PDF queued.' })}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Generate Executive Summary</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Mean Time To Contain"
          value="18.4 min"
          change="-4.2 min"
          isPositiveChange={true}
          variant="success"
          icon={Clock}
        />
        <StatCard
          label="First-Pass Resolution"
          value="94.2%"
          change="+3.1%"
          isPositiveChange={true}
          variant="cyan"
          icon={CheckCircle2}
        />
        <StatCard
          label="Particulate Suppression"
          value="58.7%"
          subtext="Average PM drop after intervention"
          variant="default"
          icon={TrendingUp}
        />
        <StatCard
          label="Telemetry Uptime"
          value="99.4%"
          change="+0.2%"
          isPositiveChange={true}
          variant="success"
          icon={Activity}
        />
      </div>

      {/* Main Charts & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SLA & Response Times by Zone */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Mean Response Time by Monitoring Sector (Minutes)</h3>
              <p className="text-xs text-slate-400">Target SLA threshold is &lt; 30 minutes</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Target &lt; 30m</span>
          </div>

          {/* Custom Horizontal Bar Visualization */}
          <div className="space-y-3 pt-2">
            {[
              { zone: 'Zone 01 (Central Basin)', time: 14, pct: 46, status: 'Optimal' },
              { zone: 'Zone 02 (Sub-Catchment B)', time: 18, pct: 60, status: 'Optimal' },
              { zone: 'Zone 07 (Industrial Corridor)', time: 22, pct: 73, status: 'Good' },
              { zone: 'Zone 08 (Riverfront)', time: 16, pct: 53, status: 'Optimal' },
              { zone: 'Zone 09 (North Urban)', time: 27, pct: 90, status: 'Near SLA' },
              { zone: 'Zone 12 (Logistics Hub)', time: 19, pct: 63, status: 'Optimal' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300">{item.zone}</span>
                  <span className="text-cyan-400 font-bold">{item.time} mins ({item.status})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      item.time > 25 ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Environmental Abatement Breakdown */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono mb-1">
              Remediation Type Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Resolved environmental incidents by intervention modality</p>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Industrial Dust Suppression (Misting Cannons)', count: 84, pct: 42, color: 'bg-cyan-500' },
                { label: 'Stagnant Water Suction & Larvicide', count: 48, pct: 24, color: 'bg-blue-500' },
                { label: 'Biomass Open-Burning Extinguishment', count: 36, pct: 18, color: 'bg-rose-500' },
                { label: 'Drainage Desilting & Clearing', count: 28, pct: 14, color: 'bg-amber-500' },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-200 font-semibold">{m.label}</span>
                    <span className="font-mono text-cyan-400 font-bold">{m.count} ({m.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
            Total 196 incidents successfully validated through closed-loop protocol.
          </div>
        </div>
      </div>
    </div>
  );
};
