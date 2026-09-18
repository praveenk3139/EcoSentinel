import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { GisMap } from '../map/GisMap';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Radio, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Eye, 
  Layers, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Battery,
  Wifi,
  Sparkles
} from 'lucide-react';

export const LiveMonitoringView: React.FC = () => {
  const { devices, areas, issues, selectedDeviceId, setSelectedDeviceId, setActiveTab, setSelectedIssueId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'ALL' | 'CRITICAL' | 'AIR' | 'WATER'>('ALL');

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.areaName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTabSub === 'CRITICAL') return d.riskLevel === 'CRITICAL' || d.riskLevel === 'HIGH';
    if (activeTabSub === 'AIR') return d.sensorType.includes('PM') || d.sensorType.includes('GAS') || d.sensorType.includes('STATION');
    if (activeTabSub === 'WATER') return d.sensorType.includes('WATER');
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row overflow-hidden bg-slate-950">
      {/* LEFT: Full Interactive GIS Map */}
      <div className="flex-1 h-full relative p-3">
        <GisMap
          height="100%"
          selectedDeviceFocusId={selectedDeviceId}
        />
      </div>

      {/* RIGHT: Floating/Docked Telemetry & Device Directory Panel */}
      <div className="w-full lg:w-96 shrink-0 border-l border-slate-800 bg-slate-900/90 flex flex-col h-full overflow-hidden">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Live Device Fleet</h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              {devices.filter(d => d.status === 'ONLINE').length} Online
            </span>
          </div>

          <div className="relative mb-2.5">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID, Area, Sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-750 bg-slate-950/80 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono">
            {(['ALL', 'CRITICAL', 'AIR', 'WATER'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTabSub(tab)}
                className={`flex-1 py-1 rounded font-bold transition-colors ${
                  activeTabSub === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Device Telemetry Spotlight Card */}
        {selectedDevice && (
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-cyan-400">NODE #{selectedDevice.id}</span>
              <RiskBadge level={selectedDevice.riskLevel} size="sm" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">{selectedDevice.name}</h3>
            <p className="text-[10px] text-slate-400 mb-3">{selectedDevice.areaName} • {selectedDevice.sensorLabel}</p>

            {/* Micro telemetry grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px] mb-3">
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5">
                <span className="text-[9px] text-slate-400 block">TEMP</span>
                <strong className="text-slate-200">{selectedDevice.telemetry.temperature}°C</strong>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5">
                <span className="text-[9px] text-slate-400 block">HUMIDITY</span>
                <strong className="text-slate-200">{selectedDevice.telemetry.humidity}%</strong>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5">
                <span className="text-[9px] text-slate-400 block">AQI</span>
                <strong className={selectedDevice.telemetry.aqi && selectedDevice.telemetry.aqi > 100 ? 'text-amber-400' : 'text-emerald-400'}>
                  {selectedDevice.telemetry.aqi || 48}
                </strong>
              </div>
            </div>

            {selectedDevice.activeIssueId && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-2 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold">Active Linked Issue</span>
                  <span className="text-xs text-white font-semibold">{selectedDevice.activeIssueId}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedIssueId(selectedDevice.activeIssueId!);
                    setActiveTab('issues');
                  }}
                  className="rounded bg-rose-500/20 px-2 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-500/30"
                >
                  View Issue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Device List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredDevices.length === 0 ? (
            <div className="text-center py-10 px-4 text-xs font-mono text-slate-500">
              <Radio className="h-8 w-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p>No sensor nodes online.</p>
              <button
                onClick={() => setActiveTab('devices')}
                className="mt-3 text-cyan-400 hover:underline text-[11px] block mx-auto"
              >
                + Deploy New City Device
              </button>
            </div>
          ) : (
            filteredDevices.map((device) => {
              const isSelected = selectedDeviceId === device.id;
              return (
                <div
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500/50 bg-cyan-950/20 shadow-md'
                      : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{device.id}</span>
                      <span className="text-[10px] text-slate-400">{device.areaName}</span>
                    </div>
                    <RiskBadge level={device.riskLevel} size="sm" />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 truncate">{device.name}</h4>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span className="flex items-center gap-1">
                      <Battery className="h-3 w-3 text-slate-400" />
                      {device.batteryPercentage}%
                    </span>
                    <span>{device.lastUpdate}</span>
                    <StatusBadge status={device.status} size="sm" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
