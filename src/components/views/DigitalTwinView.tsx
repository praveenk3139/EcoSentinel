import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Box, 
  Layers, 
  Compass, 
  Wind, 
  Droplet, 
  Flame, 
  Radio, 
  Sparkles, 
  Activity,
  Maximize2,
  ExternalLink
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const { areas, devices, setSelectedAreaId, setActiveTab } = useApp();
  const [twinLayer, setTwinLayer] = useState<'AIR' | 'WATER' | 'RISK' | 'POPULATION'>('AIR');
  const [selectedZone, setSelectedZone] = useState(areas[6]); // Zone 07

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>METROPOLITAN DIGITAL TWIN & SPATIAL MICROCLIMATE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Smart City Environmental Digital Twin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Isometric urban topological simulation linking topography, air currents, drain basins, and IoT mesh feeds
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs font-mono">
          {(['AIR', 'WATER', 'RISK', 'POPULATION'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setTwinLayer(layer)}
              className={`rounded px-3 py-1 font-bold transition-colors ${
                twinLayer === layer ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {layer} LAYER
            </button>
          ))}
        </div>
      </div>

      {/* 3D / Isometric Digital Twin Canvas & Control HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Isometric Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 p-6 relative overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between">
          {/* Top overlay badges */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span>ISOMETRIC PROJECTION • 30° AZIMUTH</span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded">
              MESH NODES: 148 SYNCED
            </div>
          </div>

          {/* SVG Isometric Grid City Blocks */}
          <div className="w-full h-96 flex items-center justify-center relative py-6">
            <svg className="w-full h-full max-w-2xl" viewBox="0 0 800 450">
              <defs>
                <linearGradient id="isoGridGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="criticalBuilding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#9f1239" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="elevatedBuilding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Base Isometric Plate */}
              <polygon points="400,50 750,220 400,390 50,220" fill="url(#isoGridGrad)" stroke="#1e293b" strokeWidth="1.5" />

              {/* Grid Lines */}
              <line x1="225" y1="135" x2="575" y2="305" stroke="#334155" strokeDasharray="3 3" opacity="0.6" />
              <line x1="575" y1="135" x2="225" y2="305" stroke="#334155" strokeDasharray="3 3" opacity="0.6" />
              <line x1="400" y1="50" x2="400" y2="390" stroke="#0ea5e9" strokeWidth="1" opacity="0.4" />

              {/* River / Drainage Channel */}
              <path d="M 120,200 Q 300,240 400,210 T 680,240" fill="none" stroke="#0284c7" strokeWidth="12" opacity="0.7" />

              {/* Isometric District Clusters */}
              {/* Zone 01 (Central) */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedZone(areas[0])}>
                {/* 3D Extruded Box */}
                <polygon points="380,180 430,155 430,205 380,230" fill="#0369a1" />
                <polygon points="430,155 480,180 480,230 430,205" fill="#0284c7" />
                <polygon points="380,180 430,155 480,180 430,205" fill="#38bdf8" />
                <text x="430" y="145" textAnchor="middle" fill="#e2e8f0" className="text-[11px] font-mono font-bold">Zone 01</text>
              </g>

              {/* Zone 07 (Industrial - Elevated Hazard Spike) */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedZone(areas[6])}>
                <polygon points="230,230 280,205 280,270 230,295" fill="#9f1239" />
                <polygon points="280,205 330,230 330,295 280,270" fill="#be123c" />
                <polygon points="230,230 280,205 330,230 280,255" fill="url(#criticalBuilding)" />
                {/* Plume animation ring */}
                <circle cx="280" cy="200" r="18" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" />
                <text x="280" y="185" textAnchor="middle" fill="#fda4af" className="text-[11px] font-mono font-bold">Zone 07 (HAZARD)</text>
              </g>

              {/* Zone 03 (Elevated) */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedZone(areas[2])}>
                <polygon points="500,210 540,190 540,240 500,260" fill="#b45309" />
                <polygon points="540,190 580,210 580,260 540,240" fill="#d97706" />
                <polygon points="500,210 540,190 580,210 540,230" fill="url(#elevatedBuilding)" />
                <text x="540" y="180" textAnchor="middle" fill="#fde68a" className="text-[11px] font-mono font-bold">Zone 03</text>
              </g>

              {/* Wind Vector Arrows */}
              <g stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7">
                <path d="M 200,100 Q 300,120 400,110" markerEnd="url(#arrow)" />
                <path d="M 450,115 Q 550,135 650,125" markerEnd="url(#arrow)" />
              </g>
            </svg>
          </div>

          {/* Bottom telemetry overlay */}
          <div className="flex items-center justify-between z-10 text-xs font-mono text-slate-400 border-t border-slate-900 pt-3">
            <span>Atmospheric Plume Vector: 14 km/h North-East</span>
            <span>Terrain Elevation: 216m ASL</span>
          </div>
        </div>

        {/* Selected Zone Digital Twin Inspector */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Inspecting District Mesh</span>
                <h3 className="text-base font-bold text-white">{selectedZone.name} ({selectedZone.code})</h3>
              </div>
              <RiskBadge level={selectedZone.currentRisk} size="md" />
            </div>

            <div className="space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Mean Composite AQI:</span>
                <strong className={selectedZone.averageAqi > 100 ? 'text-amber-400' : 'text-emerald-400'}>
                  {selectedZone.averageAqi}
                </strong>
              </div>
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Online Edge Sensors:</span>
                <strong className="text-cyan-400">{selectedZone.onlineDevices} / {selectedZone.totalDevices} Nodes</strong>
              </div>
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Urban Population Exposure:</span>
                <strong className="text-slate-200">{selectedZone.population.toLocaleString()} ({selectedZone.populationDensity}/km²)</strong>
              </div>
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Dominant Hazard:</span>
                <strong className="text-slate-200">{selectedZone.dominantHazard}</strong>
              </div>
            </div>

            {/* Sensitive Receptors */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 mb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
                Nearby Sensitive Receptors:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 font-mono">
                  {selectedZone.sensitiveSites.schools} Schools
                </span>
                <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 font-mono">
                  {selectedZone.sensitiveSites.hospitals} Hospitals
                </span>
                <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 font-mono">
                  {selectedZone.sensitiveSites.elderlyCare} Elderly Care
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedAreaId(selectedZone.id);
              setActiveTab('environment');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
          >
            <span>Open Dedicated Sensor Sentry</span>
          </button>
        </div>
      </div>

      {/* VIRTUAL IOT HARDWARE STUDIO BRIDGE BANNER */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
              <Radio className="h-6 w-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/40">
                  ESP32 HARDWARE DIGITAL TWIN
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  https://eco-sentinel-device.ai.studio/
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                Connect External IoT Simulator to City Location
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mt-1">
                Run physics-based hardware simulations (MQ-135, PMS5003 laser, ultrasonic level probes) on the companion engineering console and stream telemetry into your spatial twin.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('devices')}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white transition-all font-mono shadow-md shadow-cyan-500/20"
            >
              <Radio className="h-4 w-4" />
              <span>Pair Device with Location</span>
            </button>
            <a
              href="https://eco-sentinel-device.ai.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors font-mono"
            >
              <span>Launch Device Studio</span>
              <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
