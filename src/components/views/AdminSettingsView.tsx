import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { 
  Settings, 
  Sliders, 
  ShieldAlert, 
  Cpu, 
  Save, 
  RotateCcw, 
  Radio, 
  Key, 
  Users, 
  Activity,
  CheckCircle2
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { addToast } = useApp();

  const [thresholds, setThresholds] = useState({
    pm25Warning: 60,
    pm25Critical: 90,
    pm10Warning: 100,
    pm10Critical: 150,
    aqiCritical: 200,
    waterPhMin: 6.5,
    waterPhMax: 8.5,
    noiseWarning: 75,
  });

  const [telemetryFrequencySec, setTelemetryFrequencySec] = useState(15);
  const [cpcbSyncEnabled, setCpcbSyncEnabled] = useState(true);
  const [imdSyncEnabled, setImdSyncEnabled] = useState(true);

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'Threshold Calibration Persisted',
      message: 'Updated alerting heuristics deployed to edge mesh and anomaly detection worker.',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Settings className="h-3.5 w-3.5 text-cyan-400" />
            <span>MUNICIPAL SENTRY ADMINISTRATION & CALIBRATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            System Settings & Anomaly Thresholds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure alerting triggers, edge telemetry sampling rate, and external national agency APIs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md transition-colors font-mono"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Threshold Configuration Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span>1. Environmental Anomaly Alert Thresholds</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-slate-400 block font-bold">PM2.5 Warning (µg/m³)</span>
            <input
              type="number"
              value={thresholds.pm25Warning}
              onChange={(e) => setThresholds({ ...thresholds, pm25Warning: Number(e.target.value) })}
              className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
            />
            <span className="text-[10px] text-amber-400 block">Triggers Moderate Alert</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-slate-400 block font-bold">PM2.5 Critical Spike (µg/m³)</span>
            <input
              type="number"
              value={thresholds.pm25Critical}
              onChange={(e) => setThresholds({ ...thresholds, pm25Critical: Number(e.target.value) })}
              className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
            />
            <span className="text-[10px] text-rose-400 block">Triggers Priority Incident</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-slate-400 block font-bold">AQI Critical Limit</span>
            <input
              type="number"
              value={thresholds.aqiCritical}
              onChange={(e) => setThresholds({ ...thresholds, aqiCritical: Number(e.target.value) })}
              className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
            />
            <span className="text-[10px] text-rose-400 block">Severe Health Warning</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-slate-400 block font-bold">Water pH Tolerance (Min - Max)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={thresholds.waterPhMin}
                onChange={(e) => setThresholds({ ...thresholds, waterPhMin: Number(e.target.value) })}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                step="0.1"
                value={thresholds.waterPhMax}
                onChange={(e) => setThresholds({ ...thresholds, waterPhMax: Number(e.target.value) })}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
              />
            </div>
            <span className="text-[10px] text-cyan-400 block">Acidic / Alkaline Warning</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-slate-400 block font-bold">Noise Limit (dB)</span>
            <input
              type="number"
              value={thresholds.noiseWarning}
              onChange={(e) => setThresholds({ ...thresholds, noiseWarning: Number(e.target.value) })}
              className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
            />
            <span className="text-[10px] text-slate-400 block">Residential Zone Cap</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-slate-400 block font-bold">Telemetry Stream Cadence</span>
            <select
              value={telemetryFrequencySec}
              onChange={(e) => setTelemetryFrequencySec(Number(e.target.value))}
              className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white font-bold text-sm"
            >
              <option value={5}>5 Seconds (High Density)</option>
              <option value={15}>15 Seconds (Standard Mesh)</option>
              <option value={30}>30 Seconds (Battery Saver)</option>
              <option value={60}>60 Seconds (Off-Grid Solar)</option>
            </select>
            <span className="text-[10px] text-emerald-400 block">Adaptive Power Mesh</span>
          </div>
        </div>
      </div>

      {/* External Data Feeds Integration */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span>2. Federal & Meteorological Data Integrations</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950">
            <div>
              <span className="font-bold text-white block">CPCB National Continuous Ambient Air Stations</span>
              <span className="text-slate-400 text-[11px]">Real-time calibration baseline sync via OpenData API</span>
            </div>
            <input
              type="checkbox"
              checked={cpcbSyncEnabled}
              onChange={(e) => setCpcbSyncEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950">
            <div>
              <span className="font-bold text-white block">IMD Doppler Radar & Precipitation Grid</span>
              <span className="text-slate-400 text-[11px]">Weather influx prediction vector for mosquito breeding risk</span>
            </div>
            <input
              type="checkbox"
              checked={imdSyncEnabled}
              onChange={(e) => setImdSyncEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
