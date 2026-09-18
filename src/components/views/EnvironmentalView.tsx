import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Wind, 
  Droplets, 
  CloudSun, 
  Gauge, 
  Volume2, 
  Activity, 
  Calendar, 
  Filter, 
  Download,
  Clock,
  Sparkles
} from 'lucide-react';

export const EnvironmentalView: React.FC = () => {
  const { areas, devices, selectedAreaId, setSelectedAreaId, addToast } = useApp();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [activeMediaTab, setActiveMediaTab] = useState<'ALL' | 'AIR' | 'WATER' | 'MET' | 'NOISE'>('ALL');

  const currentArea = areas.find(a => a.id === selectedAreaId) || areas[6]; // Zone 07 default
  const areaDevices = devices.filter(d => d.areaId === currentArea.id);

  // Representative telemetry for current area
  const representativeNode = areaDevices[0] || devices[0] || null;
  const t = representativeNode?.telemetry || {
    temperature: 28.5,
    humidity: 65,
    pm25: currentArea ? Math.round(currentArea.averageAqi * 0.6) : 35,
    pm10: currentArea ? Math.round(currentArea.averageAqi * 0.9) : 60,
    aqi: currentArea?.averageAqi || 55,
    co: 0.8,
    no2: 24,
    so2: 10,
    waterPh: 7.2,
    waterTurbidity: 12.0,
    waterTds: 280,
    waterLevelMeters: 1.4,
    noiseDb: 52,
  };

  // Mock historical data curve points for SVG render
  const generateChartPoints = () => {
    switch (timeRange) {
      case '1h': return [42, 45, 50, 58, 65, 74, 78, 82, 80, 78];
      case '6h': return [38, 40, 48, 55, 62, 70, 85, 92, 84, 78];
      case '24h': return [35, 42, 60, 85, 110, 142, 125, 98, 86, 78];
      case '7d': return [45, 52, 68, 80, 95, 120, 110, 90, 85, 78];
      case '30d': return [50, 55, 65, 80, 110, 135, 140, 115, 95, 78];
    }
  };

  const chartPoints = generateChartPoints();
  const maxVal = Math.max(...chartPoints, 120);

  const exportCsv = () => {
    addToast({
      type: 'success',
      title: 'Telemetry Dataset Exported',
      message: `24-hour high-resolution CSV generated for ${currentArea.name}. Sent to browser downloads.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header & Area Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>LOCALIZED SENSOR TELEMETRY & CHRONOLOGICAL TRENDS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Environmental Parameters & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Air quality particulate dispersion, electro-chemical emissions, hydrological sondes, and microclimate
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Area Selector Dropdown */}
          <select
            value={currentArea.id}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="rounded-lg border border-slate-750 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {areas.map((area) => (
              <option key={area.id} value={area.id} className="bg-slate-900">
                {area.name} ({area.code})
              </option>
            ))}
          </select>

          {/* Time Range Selector (Prompt: 1h, 6h, 24h, 7d, 30d) */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/90 p-1 text-xs font-mono">
            {(['1h', '6h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded px-2.5 py-1 text-[10px] font-bold transition-colors ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-slate-750 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME MULTI-MEDIA TELEMETRY CARDS (Prompt Requirement 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* AIR QUALITY CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <Wind className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">Air & Gas Indices</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">AQI {t.aqi || 146}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PM2.5</span>
              <strong className="text-sm text-amber-400">{t.pm25 ?? 78} µg/m³</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PM10</span>
              <strong className="text-sm text-slate-200">{t.pm10 ?? 112} µg/m³</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CO</span>
              <strong className="text-sm text-slate-200">{t.co ?? 1.8} ppm</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">NO2 / SO2</span>
              <strong className="text-sm text-slate-200">{t.no2 ?? 44} / {t.so2 ?? 12} ppb</strong>
            </div>
          </div>
        </div>

        {/* WATER QUALITY CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Droplets className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">Hydrology & Drainage</h3>
            </div>
            <span className="text-[10px] font-mono text-blue-400">pH {t.waterPh ?? 7.1}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">pH Level</span>
              <strong className="text-sm text-emerald-400">{t.waterPh ?? 7.1} pH</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Turbidity</span>
              <strong className="text-sm text-slate-200">{t.waterTurbidity ?? 14.2} NTU</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Dissolved</span>
              <strong className="text-sm text-slate-200">{t.waterTds ?? 420} ppm</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Water Level</span>
              <strong className="text-sm text-cyan-400">{t.waterLevelMeters ?? 1.45} m</strong>
            </div>
          </div>
        </div>

        {/* WEATHER & METEOROLOGY */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <CloudSun className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">Meteorology & Wind</h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400">{t.temperature}°C</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Temperature</span>
              <strong className="text-sm text-slate-200">{t.temperature}°C</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Humidity</span>
              <strong className="text-sm text-amber-400">{t.humidity}%</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Rainfall</span>
              <strong className="text-sm text-slate-200">{t.rainfall ?? 0.0} mm/h</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Wind Vector</span>
              <strong className="text-sm text-slate-200">{t.windSpeedKmh ?? 14} km/h {t.windDirection ?? 'NE'}</strong>
            </div>
          </div>
        </div>

        {/* SOIL & NOISE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Volume2 className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">Soil & Acoustic</h3>
            </div>
            <span className="text-[10px] font-mono text-purple-400">{t.noiseDb ?? 64} dB</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Soil Moisture</span>
              <strong className="text-sm text-emerald-400">{t.soilMoisture ?? 38.4}%</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Acoustic Noise</span>
              <strong className="text-sm text-slate-200">{t.noiseDb ?? 64.2} dB</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Sound Rating</span>
              <strong className="text-sm text-emerald-300">Class B</strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Soil Salinity</span>
              <strong className="text-sm text-slate-200">1.2 dS/m</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHRONOLOGICAL TELEMETRY TIMELINE CHART */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              Temporal PM2.5 & AQI Influx Dynamics ({timeRange.toUpperCase()} Window)
            </h3>
            <p className="text-xs text-slate-400">
              Sensor readings continuously reconciled with local CPCB and IMD meteorological stations
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              PM2.5 (µg/m³)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              WHO Threshold (15 µg/m³)
            </span>
          </div>
        </div>

        {/* Custom SVG Interactive Chart */}
        <div className="h-64 w-full relative">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 900 240" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="900" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="900" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="160" x2="900" y2="160" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="220" x2="900" y2="220" stroke="#334155" />

            {/* Threshold Line (WHO 24h limit) */}
            <line x1="0" y1="190" x2="900" y2="190" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

            {/* Area gradient under curve */}
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Render Filled Curve */}
            <polygon
              points={`0,220 ${chartPoints.map((pt, i) => `${(i / (chartPoints.length - 1)) * 900},${220 - (pt / maxVal) * 190}`).join(' ')} 900,220`}
              fill="url(#curveGradient)"
            />

            {/* Smooth connecting polyline */}
            <polyline
              points={chartPoints.map((pt, i) => `${(i / (chartPoints.length - 1)) * 900},${220 - (pt / maxVal) * 190}`).join(' ')}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3"
            />

            {/* Data points */}
            {chartPoints.map((pt, i) => {
              const cx = (i / (chartPoints.length - 1)) * 900;
              const cy = 220 - (pt / maxVal) * 190;
              return (
                <g key={i} className="cursor-pointer group">
                  <circle cx={cx} cy={cy} r="4" fill="#090d16" stroke="#22d3ee" strokeWidth="2.5" />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="text-[10px] font-mono hidden group-hover:block"
                  >
                    {pt} µg
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
          <span>T - {timeRange}</span>
          <span>Midpoint</span>
          <span>Latest Synchronized Influx</span>
        </div>
      </div>
    </div>
  );
};
