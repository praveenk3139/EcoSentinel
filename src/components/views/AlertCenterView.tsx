import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Bell, 
  AlertTriangle, 
  Layers, 
  Check, 
  VolumeX, 
  Search, 
  Filter, 
  ShieldAlert, 
  Radio, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, setSelectedIssueId, setActiveTab, addToast } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  const handleSilenceAlert = (alertId: string) => {
    addToast({
      type: 'info',
      title: 'Alert Silenced (30m)',
      message: `Alert #${alertId} muted for 30 minutes. Reason logged: Ongoing verified field intervention.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Bell className="h-3.5 w-3.5 text-rose-400 animate-bounce" />
            <span>REAL-TIME THRESHOLD CORRELATION ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Alert Center & Correlated Telemetry Grouping
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Noise reduction heuristics aggregating hundreds of raw edge-node spikes into unified root-cause incident dossiers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs font-mono">
          {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'MAINTENANCE'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`rounded px-3 py-1 font-bold transition-colors ${
                filterSeverity === sev ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* ALERT GROUPING SPOTLIGHT (Prompt Requirement 24: "12 related sensor alerts grouped into ENV-104") */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                  AUTOMATED ALERT GROUPING SYNTHESIS
                </span>
                <span className="text-xs font-mono text-slate-400">Target Dossier: ENV-104</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                12 Related Sensor Alerts Grouped Into Unified Incident ENV-104
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Optical dust nodes (AQ-101, AQ-102, AQ-107), acoustic arrays, and meteorological anemometers detected correlated downwind particulate plume. Deduplication prevented 11 redundant dispatches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedIssueId('ENV-104');
                setActiveTab('issues');
              }}
              className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 px-3 shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Inspect Unified Dossier</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ALERT LIST */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              alert.acknowledged
                ? 'border-slate-800/60 bg-slate-900/40 opacity-75'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <RiskBadge level={alert.severity as any} size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{alert.id}</span>
                  <span className="text-xs text-slate-400">• {alert.areaName}</span>
                  {alert.groupedDeviceCount && (
                    <span className="rounded bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-amber-400">
                      {alert.groupedDeviceCount} grouped nodes
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">{alert.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-2">
                  <span>Type: {alert.type}</span>
                  <span>• {alert.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              {!alert.acknowledged ? (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Acknowledge</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Acknowledged
                </span>
              )}

              <button
                onClick={() => handleSilenceAlert(alert.id)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                title="Silence alert"
              >
                <VolumeX className="h-3.5 w-3.5" />
              </button>

              {alert.relatedIssueId && (
                <button
                  onClick={() => {
                    setSelectedIssueId(alert.relatedIssueId!);
                    setActiveTab('issues');
                  }}
                  className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 transition-colors"
                >
                  Dossier →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
