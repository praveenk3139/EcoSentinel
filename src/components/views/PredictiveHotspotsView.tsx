import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const PredictiveHotspotsView: React.FC = () => {
  const { hotspots, setSelectedAreaId, setActiveTab } = useApp();
  const [horizonFilter, setHorizonFilter] = useState<'ALL' | '12h' | '24h'>('ALL');

  const filteredHotspots = hotspots.filter(h => {
    if (horizonFilter === '12h') return h.timeHorizonHours <= 12;
    if (horizonFilter === '24h') return h.timeHorizonHours <= 24;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>TIME-SERIES SPATIO-TEMPORAL PROJECTIONS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Predictive Hotspot Detection & Risk Trajectories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Recurrent LSTM sequence models forecasting localized environmental hazard spikes before threshold breach
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Forecast Horizon:</span>
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs font-mono">
            {(['ALL', '12h', '24h'] as const).map((hz) => (
              <button
                key={hz}
                onClick={() => setHorizonFilter(hz)}
                className={`rounded px-3 py-1 font-bold transition-colors ${
                  horizonFilter === hz ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                {hz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty Notice Box (Prompt Rule) */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300/90 leading-relaxed flex items-start gap-2.5">
        <HelpCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <strong>Model-Estimated Future Risk Protocol:</strong> Projections represent probability-weighted hazard trajectories conditioned on historical meteorological dispersion patterns. Future forecasts are probabilistic decision aids and not certainties.
        </div>
      </div>

      {/* RISK SHIFT MATRIX GRID (Prompt Requirement 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHotspots.map((hotspot) => {
          const isElevating = hotspot.currentRisk !== hotspot.predictedRisk;

          return (
            <div
              key={hotspot.id}
              className={`rounded-2xl border p-5 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all ${
                hotspot.riskShift === 'ELEVATED_SPIKE'
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : hotspot.riskShift === 'INCREASING'
                  ? 'border-amber-500/30 bg-slate-900/80'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Target Area</span>
                    <h3 className="text-sm font-bold text-white">{hotspot.areaName}</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                    +{hotspot.timeHorizonHours}h Horizon
                  </span>
                </div>

                {/* CURRENT RISK vs PREDICTED RISK (Prompt Requirement 14) */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-3.5 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 uppercase text-[10px]">Current Risk</span>
                    <span className="text-slate-400 uppercase text-[10px]">Predicted Future Risk</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <RiskBadge level={hotspot.currentRisk} size="md" />
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <span className="text-xs">→</span>
                      <TrendingUp className={`h-4 w-4 ${isElevating ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
                    </div>
                    <RiskBadge level={hotspot.predictedRisk} size="md" />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] font-mono">
                    <span className="text-slate-400">Projection Confidence:</span>
                    <span className="font-bold text-cyan-300">{hotspot.confidencePercentage}%</span>
                  </div>
                </div>

                {/* Primary Driver */}
                <div className="space-y-1 text-xs mb-3">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Modeled Atmospheric Driver:
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                    {hotspot.primaryDriver}
                  </p>
                </div>

                {/* Preemptive Action */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Recommended Preemptive Action:
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20 text-[11px]">
                    {hotspot.recommendedPreemptiveAction}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {hotspot.sensitiveReceptorsCount} Sensitive Receptors
                </span>
                <button
                  onClick={() => {
                    setSelectedAreaId(hotspot.areaId);
                    setActiveTab('environment');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Inspect Area</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
