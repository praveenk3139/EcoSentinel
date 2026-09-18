import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { RiskBadge } from '../common/RiskBadge';
import { GisMap } from '../map/GisMap';
import { 
  BrainCircuit, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  Layers, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Cpu,
  ArrowRight,
  Info
} from 'lucide-react';

export const DiseaseRiskView: React.FC = () => {
  const { areas, healthRisks, selectedAreaId, setSelectedAreaId, setActiveTab, setSelectedIssueId } = useApp();

  const currentArea = areas.find(a => a.id === selectedAreaId) || areas.find(a => a.id === 'zone-07') || areas[0];
  const prediction = healthRisks[currentArea.id] || healthRisks['zone-07'];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header & Prominent Medical Disclaimer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI DECISION-SUPPORT & PUBLIC HEALTH PRE-EMPTIVE MODELING</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Health Risk Intelligence & Environmental Disease-Risk Patterns
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous Bayesian & Deep Neural modeling linking localized IoT environmental vectors to public health risks
          </p>
        </div>

        {/* Area Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Target Area:</span>
          <select
            value={currentArea.id}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id} className="bg-slate-900">
                {a.name} ({a.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MANDATORY LEGAL & ETHICAL PROTOCOL DISCLAIMER (Prompt Guideline) */}
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-cyan-300 uppercase tracking-wide font-mono">
              Decision Support & Environmental Health Risk Estimation Platform
            </h4>
            <p className="mt-1 text-slate-300 leading-relaxed">
              This system calculates <strong>Estimated Disease Risk</strong> based strictly on localized environmental vectors, meteorological influx, and historical epidemiological correlations. 
              <strong> The AI does not medically diagnose individuals.</strong> Predictions represent modeled risk patterns across geographical catchment areas to guide municipal hygiene, abatement, and preventative intervention.
            </p>
          </div>
        </div>
      </div>

      {/* TOP SECTION: RISK ESTIMATE + MODEL CONFIDENCE + CONTRIBUTING FACTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Risk Score Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Target Monitoring Basin</span>
                <h3 className="text-base font-bold text-white tracking-tight">{currentArea.name}</h3>
              </div>
              <RiskBadge level={prediction.overallRisk} size="md" />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/80 p-4 border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Overall Estimated Risk</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-amber-400">
                  {prediction.overallRisk}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Based on 14 linked environmental nodes
                </span>
              </div>

              <div className="text-right border-l border-slate-800 pl-4">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Model Confidence</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {prediction.modelConfidence}%
                </span>
                <span className="text-[10px] text-emerald-400 block font-mono">High Statistical Validity</span>
              </div>
            </div>

            {/* Disease-Specific Risk Patterns */}
            <div className="mt-5">
              <span className="text-xs font-mono font-bold uppercase text-slate-300 block mb-2.5">
                Estimated Disease-Risk Patterns:
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                    <span className="text-slate-200">Respiratory Disease Vector</span>
                  </div>
                  <RiskBadge level={prediction.riskPatterns.respiratory} size="sm" />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-200">Mosquito / Vector-Borne Threat</span>
                  </div>
                  <RiskBadge level={prediction.riskPatterns.mosquitoVectorBorne} size="sm" />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-200">Water-Borne / Enteric Vector</span>
                  </div>
                  <RiskBadge level={prediction.riskPatterns.waterBorne} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block mb-1">
              Recommended Environmental Action:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              {prediction.recommendedEnvironmentalAction}
            </p>
          </div>
        </div>

        {/* Right: SHAP / Feature Explainability Engine (Prompt Requirement 12) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Explain Prediction (SHAP Feature Attribution)</h3>
                  <p className="text-[11px] text-slate-400">How real-time environmental vectors contribute to the risk score</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Analyzed {prediction.lastAnalyzed}</span>
            </div>

            {/* Natural Language Explanation (No diagnosis statement) */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 text-xs text-cyan-200 leading-relaxed mb-4">
              <strong>Environmental Diagnostic Hypothesis:</strong> {prediction.explanation}
            </div>

            {/* Contributing Factors List */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase text-slate-300 block">
                Primary Contributing Environmental Factors:
              </span>
              {prediction.contributingFactors.map((factor, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{factor.factor}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      factor.impact === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {factor.impact} IMPACT • {factor.trend}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Underpinning ML Models */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
            <span>Ensemble Architecture:</span>
            <div className="flex flex-wrap gap-1.5">
              {prediction.primaryMlModelsUsed.map((m, i) => (
                <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-cyan-300 border border-slate-700">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DISEASE RISK GIS MAP (Prompt Requirement 13) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Spatial Disease-Risk & Pollution Map</h3>
              <p className="text-[11px] text-slate-400">Visualizing environmental health risk patterns across all monitoring zones</p>
            </div>
          </div>
        </div>

        <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-800">
          <GisMap height="100%" />
        </div>
      </div>
    </div>
  );
};
