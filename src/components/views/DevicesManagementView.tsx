import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { Device, SensorType, DeviceStatus, RiskLevel, DeviceActuators } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Radio, 
  Battery, 
  Wifi, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Trash2,
  RotateCcw,
  Sun,
  ShieldCheck,
  Cpu,
  Clock,
  ArrowRight,
  MapPin,
  Zap,
  Activity,
  Sliders,
  Droplet,
  Flame,
  Wind,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Send,
  X,
  Crosshair
} from 'lucide-react';

export const DevicesManagementView: React.FC = () => {
  const { 
    devices, 
    areas,
    addDevice,
    deleteDevice, 
    clearAllDevices, 
    resetDevices, 
    toggleDeviceActuator, 
    simulateDeviceAnomaly,
    selectedDeviceId,
    setSelectedDeviceId, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedSensorFilter, setSelectedSensorFilter] = useState<string>('ALL');
  const [activeDeviceForControl, setActiveDeviceForControl] = useState<Device | null>(
    devices.find(d => d.id === (selectedDeviceId || 'AQ-014')) || devices[0] || null
  );

  // Modal State for Adding New Device
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newAreaId, setNewAreaId] = useState(areas[0]?.id || 'zone-01');
  const [newLat, setNewLat] = useState('28.6250');
  const [newLng, setNewLng] = useState('77.2150');
  const [newSensorType, setNewSensorType] = useState<SensorType>('PM2_5_PM10_OPTICAL');
  const [newHardware, setNewHardware] = useState('ESP32-S3 Rev 2 Mesh');
  const [newBattery, setNewBattery] = useState(98);
  const [newSolar, setNewSolar] = useState(true);

  // Simulation Sliders for Prediction-to-Response Station
  const [simPm25, setSimPm25] = useState(115);
  const [simWaterPh, setSimWaterPh] = useState(4.8);
  const [simAqi, setSimAqi] = useState(185);

  const activeDevice = devices.find(d => d.id === (activeDeviceForControl?.id || selectedDeviceId)) || devices[0] || null;

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(search.toLowerCase()) || 
                          d.name.toLowerCase().includes(search.toLowerCase()) ||
                          d.areaName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'MAINTENANCE' && !d.maintenanceRecommended && d.batteryPercentage >= 25) return false;
    if (filterType === 'OFFLINE' && d.status !== 'OFFLINE') return false;
    if (filterType === 'CRITICAL' && d.riskLevel !== 'CRITICAL') return false;
    if (selectedSensorFilter !== 'ALL' && d.sensorType !== selectedSensorFilter) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    const nextNum = Math.floor(10 + Math.random() * 90);
    setNewDeviceId(`AQ-0${nextNum}`);
    setNewDeviceName(`City Sector ${nextNum} Node`);
    if (areas.length > 0) {
      setNewAreaId(areas[0].id);
      setNewLat(areas[0].coordinates[0].toString());
      setNewLng(areas[0].coordinates[1].toString());
    }
    setIsAddModalOpen(true);
  };

  const handleAreaChangeInModal = (areaId: string) => {
    setNewAreaId(areaId);
    const selectedArea = areas.find(a => a.id === areaId);
    if (selectedArea) {
      // Add slight random offset to scatter markers naturally in that zone
      const latOffset = (Math.random() - 0.5) * 0.015;
      const lngOffset = (Math.random() - 0.5) * 0.015;
      setNewLat((selectedArea.coordinates[0] + latOffset).toFixed(4));
      setNewLng((selectedArea.coordinates[1] + lngOffset).toFixed(4));
    }
  };

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const area = areas.find(a => a.id === newAreaId) || areas[0];
    const lat = parseFloat(newLat) || 28.6250;
    const lng = parseFloat(newLng) || 77.2150;

    let sensorLabel = 'Laser Particulate Matter';
    let defaultTelemetry = {
      temperature: 28.4,
      humidity: 56,
      pm25: 38,
      pm10: 64,
      aqi: 72,
      no2: 24,
      co: 0.8
    };

    if (newSensorType === 'WATER_QUALITY_PH_TURB_TDS') {
      sensorLabel = 'Submersible Water Sonde (pH/TDS/Turb)';
      defaultTelemetry = {
        temperature: 24.2,
        humidity: 78,
        waterPh: 7.4,
        waterTurbidity: 8.5,
        waterTds: 240,
        waterLevelMeters: 2.1,
      } as any;
    } else if (newSensorType === 'GAS_MQ_CO_NO2_SO2') {
      sensorLabel = 'Multi-Gas Electrochemical Array';
      defaultTelemetry = {
        temperature: 30.1,
        humidity: 48,
        co: 1.2,
        no2: 32,
        so2: 12,
        aqi: 88,
      } as any;
    } else if (newSensorType === 'ACOUSTIC_NOISE_DB') {
      sensorLabel = 'Precision Acoustic Decibel Sentry';
      defaultTelemetry = {
        temperature: 27.5,
        humidity: 52,
        noiseDb: 64,
      } as any;
    }

    addDevice({
      id: newDeviceId.trim() || `DEV-${Math.floor(100+Math.random()*900)}`,
      name: newDeviceName.trim() || 'New City Sensor Node',
      areaId: area.id,
      areaName: area.name,
      coordinates: [lat, lng],
      sensorType: newSensorType,
      sensorLabel,
      status: 'ONLINE',
      batteryPercentage: newBattery,
      isSolarPowered: newSolar,
      signalStrengthDbm: -65,
      hardwareVersion: newHardware,
      telemetry: defaultTelemetry,
      riskLevel: 'NORMAL',
      maintenanceRecommended: false,
      actuators: {
        mistCannon: false,
        sluicePump: false,
        smogGun: false,
        soundBarrier: false,
        warningBeacon: false,
        ventilationFan: false,
      }
    });

    setIsAddModalOpen(false);
  };

  const handleSimulateSpike = (deviceId: string) => {
    simulateDeviceAnomaly(deviceId, {
      pm25: simPm25,
      pm10: Math.round(simPm25 * 1.5),
      aqi: simAqi,
      waterPh: simWaterPh,
      waterTurbidity: 78.4,
    }, 'CRITICAL');
  };

  const handleCreateMaintenanceTask = (deviceId: string) => {
    addToast({
      type: 'success',
      title: 'Technician Work Order Generated',
      message: `Work order MT-${Math.floor(1000 + Math.random()*9000)} created for Node #${deviceId}. Dispatched to Hardware Maintenance Team.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span>CITY-WIDE SENSOR NETWORK & PREDICTION-TO-RESPONSE CONTROL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            City Device Placements & AI Automated Response Grid
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage physical IoT placements, test telemetry anomaly predictions, and control automated municipal edge actuators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/20 transition-all font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>Add City Device (With Location)</span>
          </button>

          <button
            onClick={() => setActiveTab('live-map')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors font-mono"
          >
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span>Full GIS Map</span>
          </button>

          <button
            onClick={resetDevices}
            title="Reset to default baseline sensors"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore Baseline</span>
          </button>

          <button
            onClick={clearAllDevices}
            title="Clear all device data"
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/50 px-3 py-2.5 text-xs font-bold text-rose-400 transition-colors font-mono"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Devices</span>
          </button>
        </div>
      </div>

      {/* 2. SENSOR STATS & CITY DISTRIBUTION BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 font-mono">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Total Placed Nodes</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{devices.length}</span>
            <span className="text-[10px] text-cyan-400">across {areas.length} zones</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Online & Telemetry Sync</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">
              {devices.filter(d => d.status === 'ONLINE').length}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {devices.length > 0 ? Math.round((devices.filter(d => d.status === 'ONLINE').length / devices.length) * 100) : 0}% mesh
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Critical Risk Anomalies</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">
              {devices.filter(d => d.riskLevel === 'CRITICAL' || d.riskLevel === 'HIGH').length}
            </span>
            <span className="text-[10px] text-rose-400">triggering AI response</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Off-Grid Solar Nodes</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300">
              {devices.filter(d => d.isSolarPowered).length}
            </span>
            <span className="text-[10px] text-slate-400">LiFePO4 Packs</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Active IoT Actuators</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-300">
              {devices.reduce((acc, d) => acc + (d.actuators?.mistCannon ? 1 : 0) + (d.actuators?.sluicePump ? 1 : 0) + (d.actuators?.smogGun ? 1 : 0), 0)}
            </span>
            <span className="text-[10px] text-cyan-400">Engaged Online</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE PREDICTION-TO-RESPONSE PIPELINE STATION */}
      {activeDevice ? (
        <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/70 px-2.5 py-0.5 rounded-md border border-cyan-500/40">
                    PREDICTION-TO-RESPONSE STATION
                  </span>
                  <span className="text-xs font-mono text-slate-400">Node #{activeDevice.id}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
                  {activeDevice.name} — [{activeDevice.coordinates[0].toFixed(4)}, {activeDevice.coordinates[1].toFixed(4)}] in {activeDevice.areaName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RiskBadge level={activeDevice.riskLevel} size="md" />
              <button
                onClick={() => {
                  setSelectedDeviceId(activeDevice.id);
                  setActiveTab('live-map');
                }}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-colors font-mono"
              >
                <Crosshair className="h-3.5 w-3.5" />
                <span>Locate on Map</span>
              </button>
            </div>
          </div>

          {/* 3-Stage Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
            {/* STAGE 1: TELEMETRY INGESTION */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5" />
                  <span>1. Sensor Telemetry Ingest</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">ONLINE • 24ms</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">PM2.5 / PM10 Dust:</span>
                  <span className="font-bold text-white">{activeDevice.telemetry.pm25 ?? '--'} / {activeDevice.telemetry.pm10 ?? '--'} µg/m³</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Water pH / Turbidity:</span>
                  <span className="font-bold text-white">{activeDevice.telemetry.waterPh ?? '--'} pH / {activeDevice.telemetry.waterTurbidity ?? '--'} NTU</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Temperature & Humidity:</span>
                  <span className="font-bold text-white">{activeDevice.telemetry.temperature}°C / {activeDevice.telemetry.humidity}% RH</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Calculated AQI Score:</span>
                  <span className={`font-bold ${(activeDevice.telemetry.aqi || 0) > 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeDevice.telemetry.aqi ?? 'Nominal'}
                  </span>
                </div>
              </div>

              {/* Anomaly Simulator Controls */}
              <div className="pt-2 border-t border-slate-850">
                <span className="text-[11px] font-mono font-bold text-slate-300 block mb-1.5">
                  🧪 Inject Anomaly to Test Model:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateSpike(activeDevice.id)}
                    className="flex-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-2 text-[11px] font-mono transition-colors shadow-md"
                  >
                    Spike PM2.5 (115 µg/m³)
                  </button>
                  <button
                    onClick={() => simulateDeviceAnomaly(activeDevice.id, { pm25: 32, pm10: 55, aqi: 58, waterPh: 7.2 }, 'NORMAL')}
                    className="rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-1.5 px-2 text-[11px] font-mono transition-colors"
                  >
                    Clear Spike
                  </button>
                </div>
              </div>
            </div>

            {/* STAGE 2: AI PREDICTION INFERENCE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>2. AI Prediction Model</span>
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                  XGBoost + LSTM
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Predicted Hazard:</span>
                  <span className="font-bold text-white font-mono text-right">
                    {activeDevice.predictionDetails?.hazardType || 'Localized Particulate Drift'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Model Confidence:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {activeDevice.predictionDetails?.confidence || 92}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Incident Probability:</span>
                  <span className={`font-bold font-mono ${activeDevice.riskLevel === 'CRITICAL' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {activeDevice.riskLevel === 'CRITICAL' ? '98.4% (Critical Breach)' : '12.1% (Low)'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-950/20 text-xs text-purple-200">
                <strong className="block text-[11px] font-mono text-purple-300 mb-0.5">Automated AI Decision:</strong>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {activeDevice.predictionDetails?.triggerAction || 'Sentry model continuously cross-validates optical scattering with wind vectors.'}
                </p>
              </div>
            </div>

            {/* STAGE 3: AUTOMATED RESPONSE & IOT ACTUATORS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>3. Municipal Response & Actuators</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">EDGE CONTROLS</span>
              </div>

              {/* Edge Actuator Controls */}
              <div className="space-y-2 text-xs font-mono">
                {/* Mist Cannon */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-cyan-400" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Anti-Smog Mist Cannon</span>
                      <span className="text-[9px] text-slate-400">Peripheral Dust Suppression</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDeviceActuator(activeDevice.id, 'mistCannon')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeDevice.actuators?.mistCannon 
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {activeDevice.actuators?.mistCannon ? 'ACTIVE ON' : 'STANDBY OFF'}
                  </button>
                </div>

                {/* Sluice Pump */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Canal Sluice Pump</span>
                      <span className="text-[9px] text-slate-400">Automated Runoff Diversion</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDeviceActuator(activeDevice.id, 'sluicePump')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeDevice.actuators?.sluicePump 
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {activeDevice.actuators?.sluicePump ? 'ACTIVE ON' : 'STANDBY OFF'}
                  </button>
                </div>

                {/* Warning Siren */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Audio-Visual Sentry Beacon</span>
                      <span className="text-[9px] text-slate-400">Public Warning Siren</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDeviceActuator(activeDevice.id, 'warningBeacon')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeDevice.actuators?.warningBeacon 
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {activeDevice.actuators?.warningBeacon ? 'ACTIVE ON' : 'STANDBY OFF'}
                  </button>
                </div>
              </div>

              {/* Recommended Team Dispatch */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">Target Response Unit:</span>
                <span className="text-cyan-300 font-bold">{activeDevice.predictionDetails?.targetTeamRecommendation || 'Field Team 03 Rapid Response'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
            <Radio className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">No City Sensor Nodes Configured</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
            All device data has been cleared. Add new physical or virtual sensor nodes with exact GPS coordinates across municipal zones to start live telemetry stream and automated AI actuator responses.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/20 transition-all font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>Deploy First City Device</span>
          </button>
        </div>
      )}

      {/* 4. CITY SENSOR HARDWARE LIST & PLACEMENT TABLE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
        {/* Table Filter Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by Node ID, Name, Zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-750 bg-slate-950 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <select
              value={selectedSensorFilter}
              onChange={(e) => setSelectedSensorFilter(e.target.value)}
              className="rounded-xl border border-slate-750 bg-slate-950 py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="ALL">All Sensor Types ({devices.length})</option>
              <option value="PM2_5_PM10_OPTICAL">Laser PM2.5 / PM10 Dust</option>
              <option value="WATER_QUALITY_PH_TURB_TDS">Water pH / Turbidity / TDS</option>
              <option value="GAS_MQ_CO_NO2_SO2">Electrochemical Gas Array</option>
              <option value="ACOUSTIC_NOISE_DB">Acoustic Noise dB</option>
              <option value="ULTRASONIC_WATER_LEVEL">Ultrasonic Water Level</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${filterType === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              All ({devices.length})
            </button>
            <button
              onClick={() => setFilterType('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${filterType === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Critical ({devices.filter(d => d.riskLevel === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setFilterType('MAINTENANCE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${filterType === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Service Needed ({devices.filter(d => d.maintenanceRecommended).length})
            </button>
            <button
              onClick={() => setFilterType('OFFLINE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${filterType === 'OFFLINE' ? 'bg-slate-800 text-slate-300' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Offline ({devices.filter(d => d.status === 'OFFLINE').length})
            </button>
          </div>
        </div>

        {/* Responsive Devices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Device Node ID</th>
                <th className="py-3.5 px-4">City Placement & Coordinates</th>
                <th className="py-3.5 px-4">Sensor Interface</th>
                <th className="py-3.5 px-4">Live Telemetry</th>
                <th className="py-3.5 px-4">Status & Power</th>
                <th className="py-3.5 px-4">AI Risk Prediction</th>
                <th className="py-3.5 px-4">Edge Actuators</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    No sensor nodes found matching the criteria. Click "+ Add City Device" to deploy a new one.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const isSelected = activeDevice?.id === device.id;

                  return (
                    <tr 
                      key={device.id} 
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${isSelected ? 'bg-cyan-950/25 border-l-4 border-l-cyan-400' : ''}`}
                      onClick={() => setActiveDeviceForControl(device)}
                    >
                      {/* Node ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        <div className="flex items-center gap-1.5">
                          <Radio className={`h-3.5 w-3.5 ${device.status === 'ONLINE' ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
                          <span>#{device.id}</span>
                        </div>
                      </td>

                      {/* City Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                          <span>{device.areaName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {device.coordinates[0].toFixed(4)}, {device.coordinates[1].toFixed(4)}
                        </div>
                      </td>

                      {/* Sensor Spec */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-200 block">{device.sensorLabel}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{device.hardwareVersion}</span>
                      </td>

                      {/* Live Telemetry */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {device.telemetry.pm25 !== undefined && (
                          <span className={`font-bold ${device.telemetry.pm25 > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                            PM2.5: {device.telemetry.pm25} µg/m³
                          </span>
                        )}
                        {device.telemetry.waterPh !== undefined && (
                          <span className={`font-bold block ${(device.telemetry.waterPh < 6.5 || device.telemetry.waterPh > 8.5) ? 'text-rose-400' : 'text-slate-200'}`}>
                            pH: {device.telemetry.waterPh}
                          </span>
                        )}
                        {device.telemetry.co !== undefined && (
                          <span className="text-slate-300 block">CO: {device.telemetry.co} ppm</span>
                        )}
                        {device.telemetry.noiseDb !== undefined && (
                          <span className="text-slate-300 block">{device.telemetry.noiseDb} dB</span>
                        )}
                      </td>

                      {/* Status & Power */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={device.status} size="sm" />
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Battery className={`h-3 w-3 ${device.batteryPercentage < 25 ? 'text-rose-400' : 'text-emerald-400'}`} />
                            <span>{device.batteryPercentage}%</span>
                            {device.isSolarPowered && <span title="Solar Powered"><Sun className="h-3 w-3 text-amber-400" /></span>}
                          </div>
                        </div>
                      </td>

                      {/* AI Risk Prediction */}
                      <td className="py-3.5 px-4">
                        <RiskBadge level={device.riskLevel} size="sm" />
                      </td>

                      {/* Actuators */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          {device.actuators?.mistCannon && (
                            <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                              MIST ON
                            </span>
                          )}
                          {device.actuators?.sluicePump && (
                            <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                              PUMP ON
                            </span>
                          )}
                          {!device.actuators?.mistCannon && !device.actuators?.sluicePump && (
                            <span className="text-[10px] text-slate-500 font-mono">Standby</span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedDeviceId(device.id);
                              setActiveTab('live-map');
                            }}
                            title="Locate on Map"
                            className="rounded-lg border border-slate-750 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 transition-colors"
                          >
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                          </button>

                          <button
                            onClick={() => deleteDevice(device.id)}
                            title="Delete Sensor Node"
                            className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-1.5 text-rose-400 hover:bg-rose-900/50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD CITY DEVICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Deploy New City Sensor Node</h3>
                  <p className="text-[11px] text-slate-400">Enter spatial coordinates & hardware sensor payload</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddDeviceSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                {/* Node ID */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">Node ID</label>
                  <input
                    type="text"
                    required
                    value={newDeviceId}
                    onChange={(e) => setNewDeviceId(e.target.value)}
                    placeholder="e.g. AQ-024"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Node Name */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">Device Name</label>
                  <input
                    type="text"
                    required
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g. Metro Station Sentry"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* City Zone */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-mono">City Zone / Ward Placement</label>
                <select
                  value={newAreaId}
                  onChange={(e) => handleAreaChangeInModal(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">Latitude (GPS)</label>
                  <input
                    type="text"
                    required
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    placeholder="28.6250"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">Longitude (GPS)</label>
                  <input
                    type="text"
                    required
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    placeholder="77.2150"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sensor Type */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-mono">Sensor Payload</label>
                <select
                  value={newSensorType}
                  onChange={(e) => setNewSensorType(e.target.value as SensorType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="PM2_5_PM10_OPTICAL">Laser PM2.5 / PM10 Optical Dust Sensor</option>
                  <option value="WATER_QUALITY_PH_TURB_TDS">Submersible Water Sonde (pH / Turbidity / TDS)</option>
                  <option value="GAS_MQ_CO_NO2_SO2">Electrochemical Multi-Gas Array (CO, NO2, SO2)</option>
                  <option value="ACOUSTIC_NOISE_DB">Precision Acoustic Decibel (dB) Sound Array</option>
                  <option value="ULTRASONIC_WATER_LEVEL">Ultrasonic Water Level / Flood Sentry</option>
                  <option value="MET_TEMP_HUMIDITY">Meteorological Precision Temp & Humidity</option>
                </select>
              </div>

              {/* Hardware & Power Options */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">Hardware Module</label>
                  <input
                    type="text"
                    value={newHardware}
                    onChange={(e) => setNewHardware(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="solarCheck"
                    checked={newSolar}
                    onChange={(e) => setNewSolar(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="solarCheck" className="text-xs text-slate-300 font-mono cursor-pointer flex items-center gap-1">
                    <Sun className="h-3.5 w-3.5 text-amber-400" /> Solar LiFePO4
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/25 transition-all font-mono"
                >
                  <Plus className="h-4 w-4" />
                  <span>Deploy Node into Grid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
