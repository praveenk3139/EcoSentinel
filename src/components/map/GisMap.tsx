import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../services/appState';
import { Device, MonitoringArea, RiskLevel } from '../../types';
import { AreaOverviewDrawer } from './AreaOverviewDrawer';
import { 
  Layers, 
  Filter, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Eye, 
  Activity, 
  Radio, 
  Droplet, 
  CloudSun, 
  AlertTriangle,
  Flame
} from 'lucide-react';

interface GisMapProps {
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showControls?: boolean;
  selectedDeviceFocusId?: string | null;
}

export const GisMap: React.FC<GisMapProps> = ({
  height = '100%',
  initialCenter = [28.6180, 77.2150],
  initialZoom = 12,
  showControls = true,
  selectedDeviceFocusId,
}) => {
  const { 
    devices, 
    areas, 
    issues, 
    healthRisks, 
    setSelectedDeviceId, 
    setSelectedIssueId, 
    setActiveTab 
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const areasLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const issuesLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeAreaDrawer, setActiveAreaDrawer] = useState<MonitoringArea | null>(null);
  const [deviceFilter, setDeviceFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE' | 'CRITICAL' | 'HIGH_RISK'>('ALL');
  const [sensorTypeFilter, setSensorTypeFilter] = useState<string>('ALL');
  const [activeLayers, setActiveLayers] = useState({
    devices: true,
    environmentalRisk: true,
    activeIssues: true,
    hotspots: true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedPopupDevice, setSelectedPopupDevice] = useState<Device | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles for modern command center aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomleft', prefix: 'EcoSentinel GIS Core • OSM & CARTO' }).addTo(map);

      // Initialize layer groups
      areasLayerRef.current = L.layerGroup().addTo(map);
      heatLayerRef.current = L.layerGroup().addTo(map);
      issuesLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers and Layers when data or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !areasLayerRef.current || !heatLayerRef.current || !issuesLayerRef.current) {
      return;
    }

    // 1. Clear previous layers
    markersLayerRef.current.clearLayers();
    areasLayerRef.current.clearLayers();
    heatLayerRef.current.clearLayers();
    issuesLayerRef.current.clearLayers();

    // 2. Render Monitoring Areas (Polygons / Circles)
    if (activeLayers.environmentalRisk) {
      areas.forEach((area) => {
        let fillColor = '#10b981'; // Green
        let borderColor = '#059669';

        if (area.currentRisk === 'CRITICAL') {
          fillColor = '#f43f5e';
          borderColor = '#e11d48';
        } else if (area.currentRisk === 'HIGH') {
          fillColor = '#ef4444';
          borderColor = '#dc2626';
        } else if (area.currentRisk === 'ELEVATED') {
          fillColor = '#f59e0b';
          borderColor = '#d97706';
        } else if (area.currentRisk === 'MODERATE') {
          fillColor = '#eab308';
          borderColor = '#ca8a04';
        }

        const areaCircle = L.circle(area.coordinates, {
          radius: 1800,
          color: borderColor,
          weight: 1.5,
          opacity: 0.7,
          fillColor: fillColor,
          fillOpacity: 0.12,
          dashArray: '4, 4',
        });

        areaCircle.on('click', () => {
          setActiveAreaDrawer(area);
        });

        areaCircle.bindTooltip(
          `<div class="text-[11px] font-mono font-bold text-white px-1">
            <strong>${area.code}</strong>: ${area.currentRisk} (AQI ${area.averageAqi})
          </div>`,
          { permanent: false, direction: 'top', className: 'bg-slate-900 border border-slate-700' }
        );

        areasLayerRef.current?.addLayer(areaCircle);
      });
    }

    // 3. Render Active Issues Pulsing Indicators
    if (activeLayers.activeIssues) {
      issues.filter(i => i.status !== 'RESOLVED').forEach((issue) => {
        const isCritical = issue.severity === 'CRITICAL';
        const color = isCritical ? '#f43f5e' : '#f59e0b';

        const issueMarker = L.circleMarker(issue.coordinates, {
          radius: 14,
          color: color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.35,
          className: isCritical ? 'marker-pulse' : '',
        });

        issueMarker.bindTooltip(
          `<div class="p-1 text-xs">
            <span class="font-bold text-rose-300 font-mono">${issue.id}</span> [${issue.severity}]
            <div class="text-[10px] text-slate-300">${issue.categoryLabel}</div>
          </div>`,
          { direction: 'top', className: 'bg-slate-900/90 border border-rose-500/40 text-white rounded-lg' }
        );

        issueMarker.on('click', () => {
          setSelectedIssueId(issue.id);
          setActiveTab('issues');
        });

        issuesLayerRef.current?.addLayer(issueMarker);
      });
    }

    // 4. Render IoT Devices
    if (activeLayers.devices) {
      // Filter devices
      const filteredDevices = devices.filter((device) => {
        if (deviceFilter === 'ONLINE' && device.status !== 'ONLINE') return false;
        if (deviceFilter === 'OFFLINE' && device.status !== 'OFFLINE') return false;
        if (deviceFilter === 'CRITICAL' && device.riskLevel !== 'CRITICAL') return false;
        if (deviceFilter === 'HIGH_RISK' && device.riskLevel !== 'HIGH' && device.riskLevel !== 'CRITICAL' && device.riskLevel !== 'ELEVATED') return false;

        if (sensorTypeFilter !== 'ALL') {
          if (sensorTypeFilter === 'AIR' && !device.sensorType.includes('PM') && !device.sensorType.includes('GAS') && !device.sensorType.includes('STATION')) return false;
          if (sensorTypeFilter === 'WATER' && !device.sensorType.includes('WATER')) return false;
          if (sensorTypeFilter === 'MET' && !device.sensorType.includes('MET')) return false;
          if (sensorTypeFilter === 'SOIL' && !device.sensorType.includes('SOIL')) return false;
          if (sensorTypeFilter === 'NOISE' && !device.sensorType.includes('NOISE')) return false;
        }

        return true;
      });

      filteredDevices.forEach((device) => {
        // Color mapping
        // GREEN = Normal, YELLOW = Warning/Moderate, ORANGE = Elevated, RED = Critical/High, GRAY = Offline
        let markerColor = '#10b981'; // Green (Normal)
        let ringClass = '';

        if (device.status === 'OFFLINE') {
          markerColor = '#64748b'; // Gray (Offline)
        } else if (device.riskLevel === 'CRITICAL') {
          markerColor = '#f43f5e'; // Red
          ringClass = 'marker-pulse';
        } else if (device.riskLevel === 'HIGH') {
          markerColor = '#ef4444'; // Red-Orange
          ringClass = 'marker-pulse';
        } else if (device.riskLevel === 'ELEVATED') {
          markerColor = '#f97316'; // Orange
        } else if (device.riskLevel === 'MODERATE') {
          markerColor = '#eab308'; // Yellow
        }

        // Custom Leaflet DivIcon with glowing dot & device label
        const customIcon = L.divIcon({
          className: 'custom-device-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              ${ringClass ? `<div class="absolute w-8 h-8 rounded-full border border-[${markerColor}] ${ringClass} opacity-75"></div>` : ''}
              <div style="background-color: ${markerColor};" class="w-4 h-4 rounded-full border-2 border-slate-950 shadow-md flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <div class="absolute -bottom-4 whitespace-nowrap px-1 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[9px] font-mono font-bold text-slate-200 pointer-events-none">
                ${device.id}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(device.coordinates, { icon: customIcon });

        // Build popup HTML exactly according to prompt specification
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3.5 w-72 text-slate-200 font-sans';
        
        const areaHealth = healthRisks[device.areaId];
        const aqiVal = device.telemetry.aqi ?? (device.telemetry.pm25 ? Math.round(device.telemetry.pm25 * 1.8) : 50);

        popupContent.innerHTML = `
          <div class="border-b border-slate-800 pb-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-cyan-400">DEVICE #${device.id}</span>
              <span class="flex items-center gap-1 text-[10px] font-semibold ${device.status === 'ONLINE' ? 'text-emerald-400' : 'text-slate-400'}">
                <span class="w-1.5 h-1.5 rounded-full ${device.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-slate-500'}"></span>
                ${device.status === 'ONLINE' ? 'Online' : 'Offline'}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 font-medium">${device.name} (${device.areaName})</div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 text-[11px] mb-2 font-mono">
            <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800">
              <span class="text-slate-400 text-[9px] block">Temperature</span>
              <strong class="text-slate-100">${device.telemetry.temperature}°C</strong>
            </div>
            <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800">
              <span class="text-slate-400 text-[9px] block">Humidity</span>
              <strong class="text-slate-100">${device.telemetry.humidity}%</strong>
            </div>
            ${device.telemetry.pm25 !== undefined ? `
              <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                <span class="text-slate-400 text-[9px] block">PM2.5</span>
                <strong class="${device.telemetry.pm25 > 60 ? 'text-amber-400' : 'text-slate-100'}">${device.telemetry.pm25} µg/m³</strong>
              </div>
            ` : ''}
            ${device.telemetry.pm10 !== undefined ? `
              <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                <span class="text-slate-400 text-[9px] block">PM10</span>
                <strong class="text-slate-100">${device.telemetry.pm10} µg/m³</strong>
              </div>
            ` : ''}
            ${device.telemetry.waterPh !== undefined ? `
              <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                <span class="text-slate-400 text-[9px] block">pH Level</span>
                <strong class="${device.telemetry.waterPh < 6.0 ? 'text-rose-400' : 'text-slate-100'}">${device.telemetry.waterPh} pH</strong>
              </div>
            ` : ''}
            <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800">
              <span class="text-slate-400 text-[9px] block">AQI</span>
              <strong class="${aqiVal > 100 ? 'text-amber-400 font-bold' : 'text-emerald-400'}">${aqiVal}</strong>
            </div>
          </div>

          <div class="bg-slate-950/90 rounded p-2 border border-slate-800/90 text-[11px] mb-2.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] uppercase font-mono text-slate-400">AI Environmental Risk:</span>
              <span class="font-bold uppercase text-[10px] ${
                device.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                device.riskLevel === 'HIGH' ? 'text-red-400' :
                device.riskLevel === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'
              }">${device.riskLevel}</span>
            </div>

            <div class="text-[10px] text-slate-400 space-y-0.5 border-t border-slate-800 pt-1">
              <div class="font-semibold text-slate-300">Estimated Health-Risk Patterns:</div>
              <div>• Respiratory: <span class="text-amber-300">${areaHealth ? areaHealth.riskPatterns.respiratory : 'Moderate'}</span></div>
              <div>• Vector-borne: <span class="text-cyan-300">${areaHealth ? areaHealth.riskPatterns.mosquitoVectorBorne : 'Moderate'}</span></div>
              <div>• Water-borne: <span class="text-emerald-300">${areaHealth ? areaHealth.riskPatterns.waterBorne : 'Low'}</span></div>
            </div>

            ${device.activeIssueId ? `
              <div class="mt-2 border-t border-slate-800 pt-1 flex items-center justify-between text-[10px]">
                <span>Active Issue: <strong class="text-rose-400">${device.activeIssueId}</strong></span>
                <span class="text-slate-400">${device.assignedTeam || 'Triage in progress'}</span>
              </div>
            ` : ''}
          </div>

          <div class="grid grid-cols-3 gap-1 pt-1">
            <button id="btn-view-details" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold py-1 px-1.5 rounded border border-slate-700 text-center">
              View Details
            </button>
            <button id="btn-view-issue" class="bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-[10px] font-semibold py-1 px-1.5 rounded border border-rose-500/40 text-center">
              View Issue
            </button>
            <button id="btn-track-response" class="bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-[10px] font-semibold py-1 px-1.5 rounded border border-cyan-500/40 text-center">
              Track Response
            </button>
          </div>
        `;

        // Attach button event handlers after popup is bound
        marker.bindPopup(popupContent, { maxWidth: 320 });

        marker.on('popupopen', () => {
          setSelectedPopupDevice(device);
          setSelectedDeviceId(device.id);

          const btnDetails = popupContent.querySelector('#btn-view-details');
          const btnIssue = popupContent.querySelector('#btn-view-issue');
          const btnResponse = popupContent.querySelector('#btn-track-response');

          if (btnDetails) {
            btnDetails.addEventListener('click', () => {
              setSelectedDeviceId(device.id);
              setActiveTab('devices');
            });
          }

          if (btnIssue) {
            btnIssue.addEventListener('click', () => {
              if (device.activeIssueId) {
                setSelectedIssueId(device.activeIssueId);
              }
              setActiveTab('issues');
            });
          }

          if (btnResponse) {
            btnResponse.addEventListener('click', () => {
              if (device.activeIssueId) {
                setSelectedIssueId(device.activeIssueId);
              }
              setActiveTab('verification');
            });
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [devices, areas, issues, healthRisks, deviceFilter, sensorTypeFilter, activeLayers]);

  // Focus on selected device if prop changes
  useEffect(() => {
    if (!selectedDeviceFocusId || !mapInstanceRef.current) return;
    const target = devices.find(d => d.id === selectedDeviceFocusId);
    if (target) {
      mapInstanceRef.current.flyTo(target.coordinates, 14, { duration: 1.2 });
    }
  }, [selectedDeviceFocusId, devices]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  const resetMapView = () => {
    mapInstanceRef.current?.flyTo(initialCenter, initialZoom, { duration: 1 });
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${isFullScreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''}`} style={{ height: isFullScreen ? '100vh' : height }}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Top Map Controls Bar */}
      {showControls && (
        <div className="absolute left-3 top-3 z-[1000] flex flex-wrap items-center gap-2">
          {/* Status Quick Filters */}
          <div className="flex items-center rounded-lg border border-slate-700/90 bg-slate-900/90 p-1 shadow-lg backdrop-blur-md">
            {(['ALL', 'ONLINE', 'OFFLINE', 'CRITICAL', 'HIGH_RISK'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setDeviceFilter(filterKey)}
                className={`rounded px-2.5 py-1 text-[10px] font-bold font-mono transition-colors ${
                  deviceFilter === filterKey
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filterKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Sensor Category Filter */}
          <div className="hidden sm:flex items-center rounded-lg border border-slate-700/90 bg-slate-900/90 px-2 py-1 shadow-lg backdrop-blur-md">
            <Filter className="h-3 w-3 text-slate-400 mr-1.5" />
            <select
              value={sensorTypeFilter}
              onChange={(e) => setSensorTypeFilter(e.target.value)}
              className="bg-transparent text-[10px] font-mono font-semibold text-slate-300 focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Sensor Types</option>
              <option value="AIR" className="bg-slate-900">Air Quality & Gas</option>
              <option value="WATER" className="bg-slate-900">Water Quality & Level</option>
              <option value="MET" className="bg-slate-900">Weather & Meteorology</option>
              <option value="SOIL" className="bg-slate-900">Soil Moisture</option>
              <option value="NOISE" className="bg-slate-900">Noise Acoustic</option>
            </select>
          </div>

          {/* Layer Visibility Toggles */}
          <div className="hidden md:flex items-center gap-1 rounded-lg border border-slate-700/90 bg-slate-900/90 p-1 shadow-lg backdrop-blur-md text-[10px] font-mono">
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, devices: !prev.devices }))}
              className={`rounded px-2 py-0.5 font-bold transition-colors ${activeLayers.devices ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
            >
              ● Devices
            </button>
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, environmentalRisk: !prev.environmentalRisk }))}
              className={`rounded px-2 py-0.5 font-bold transition-colors ${activeLayers.environmentalRisk ? 'bg-slate-800 text-amber-400' : 'text-slate-500'}`}
            >
              ◓ Area Risk
            </button>
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, activeIssues: !prev.activeIssues }))}
              className={`rounded px-2 py-0.5 font-bold transition-colors ${activeLayers.activeIssues ? 'bg-slate-800 text-rose-400' : 'text-slate-500'}`}
            >
              ▲ Active Issues
            </button>
          </div>
        </div>
      )}

      {/* Map Action Buttons (Right top) */}
      <div className="absolute right-3 top-3 z-[1000] flex items-center gap-1.5">
        <button
          onClick={resetMapView}
          title="Reset Map Center"
          className="rounded-lg border border-slate-700/90 bg-slate-900/90 p-2 text-slate-300 hover:bg-slate-800 hover:text-white shadow-lg backdrop-blur-md"
        >
          <Compass className="h-4 w-4" />
        </button>
        <button
          onClick={toggleFullScreen}
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Map'}
          className="rounded-lg border border-slate-700/90 bg-slate-900/90 p-2 text-slate-300 hover:bg-slate-800 hover:text-white shadow-lg backdrop-blur-md"
        >
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Legend Badge (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-3 rounded-lg border border-slate-800/90 bg-slate-900/90 px-3 py-1.5 shadow-lg backdrop-blur-md text-[10px] font-mono text-slate-300">
        <span className="font-bold text-slate-400">STATUS:</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Normal</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400"></span> Warning</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Elevated</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Critical</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-500"></span> Offline</span>
      </div>

      {/* Area Overview Drawer if clicked */}
      <AreaOverviewDrawer
        area={activeAreaDrawer}
        onClose={() => setActiveAreaDrawer(null)}
      />
    </div>
  );
};
