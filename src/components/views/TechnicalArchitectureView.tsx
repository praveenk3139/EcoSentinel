import React from 'react';
import { 
  Cpu, 
  Layers, 
  Database, 
  Radio, 
  BrainCircuit, 
  Server, 
  Monitor, 
  ShieldCheck, 
  CloudSun, 
  Wifi, 
  Smartphone,
  ExternalLink
} from 'lucide-react';

export const TechnicalArchitectureView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>ENTERPRISE SPECIFICATION & SYSTEM DESIGN</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
          Technical Architecture & Multi-Tier Technology Stack
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          End-to-end telemetry pipeline from low-power ESP32 edge sensors to deep recurrent spatio-temporal neural networks
        </p>
      </div>

      {/* 1. INTERACTIVE 5-TIER ARCHITECTURE FLOWCHART (Prompt Requirement 26) */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>1. Architectural Layer Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* TIER 1: PHYSICAL LAYER */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
                <Radio className="h-4 w-4" />
                <span>TIER 1: PHYSICAL EDGE</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">IoT Sensor Hardware</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • ESP32 Dual-Core 240MHz Microcontroller
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Laser Optical PM2.5 / PM10 (Plantower PMS5003)
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • MQ-135 / MQ-7 Electrochemical Gas Sensors
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Submersible pH & Nephelometric Turbidity Sondes
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • 10W Monocrystalline PV + 18650 LiFePO4 BMS
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-cyan-400">
              Output: MQTT / LoRaWAN Payloads
            </div>
          </div>

          {/* TIER 2: INGESTION & NETWORK */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 mb-2">
                <Wifi className="h-4 w-4" />
                <span>TIER 2: INGESTION</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Streaming Message Bus</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • High-throughput EMQX / Mosquitto MQTT Broker
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Bi-directional WebSockets (250ms Telemetry Stream)
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • TLS 1.3 Payload Encryption & CRC32 Validation
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • CPCB / IMD Open-Data API Polling Workers
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-blue-400">
              Throughput: 12,000 msg/sec
            </div>
          </div>

          {/* TIER 3: DATA PERSISTENCE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 mb-2">
                <Database className="h-4 w-4" />
                <span>TIER 3: PERSISTENCE</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Spatial & Time-Series</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • PostgreSQL 16 + PostGIS Spatial Vector Extension
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • TimescaleDB Hypertables for Sub-Minute Telemetry
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Redis In-Memory Spatial Cache & Lock Manager
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • MinIO / S3 Encrypted Photo Evidence Store
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-purple-400">
              Storage: Compressed Hypertables
            </div>
          </div>

          {/* TIER 4: AI & INFERENCE */}
          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 mb-2">
                <BrainCircuit className="h-4 w-4" />
                <span>TIER 4: AI & ML CORE</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Predictive Engines</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • <strong>XGBoost:</strong> Multi-param acute anomaly detector
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • <strong>LSTM Neural Network:</strong> 12h-24h temporal hotspot forecast
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • <strong>Bayesian Modeling:</strong> Epidemiological risk patterns
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • <strong>SHAP Engine:</strong> Transparent factor attribution
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-cyan-300">
              Inference: Sub-50ms Real-Time
            </div>
          </div>

          {/* TIER 5: COMMAND & CLIENT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-2">
                <Monitor className="h-4 w-4" />
                <span>TIER 5: APPLICATION</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Command Center HUD</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • React 19 + TypeScript Full SPA / HUD
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Leaflet GIS Vector Cartography & Heatmaps
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Field Worker Companion PWA with Offline Cache
                </li>
                <li className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  • Citizen Public Reporting & Token Tracking
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
              Security: Strict RBAC (4 Roles)
            </div>
          </div>
        </div>
      </div>

      {/* 2. TECHNOLOGY STACK DETAILED MATRIX (Prompt Requirement 27) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
          <Server className="h-4 w-4 text-cyan-400" />
          <span>2. Complete Technology Stack Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Frontend */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">FRONTEND ARCHITECTURE</span>
            <h4 className="text-sm font-bold text-white mb-2">React 19, TypeScript & Tailwind CSS</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Single-page application powered by Vite, Leaflet GIS mapping, and Lucide vector iconography. Zero external UI framework bloat.
            </p>
          </div>

          {/* Backend / API */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-1">BACKEND & STREAMING</span>
            <h4 className="text-sm font-bold text-white mb-2">FastAPI & Node.js Microservices</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Asynchronous ASGI handlers for low-latency JSON telemetry ingestion, MQTT subscriptions, and secure JWT-based RBAC token exchange.
            </p>
          </div>

          {/* AI & ML */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-1">AI & MACHINE LEARNING</span>
            <h4 className="text-sm font-bold text-white mb-2">Scikit-learn, XGBoost & LSTM</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Supervised gradient-boosted decision trees for anomaly scoring, deep LSTM sequence neural networks for 24h predictive hotspots, and SHAP explainability.
            </p>
          </div>

          {/* Database */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">SPATIAL & TIME-SERIES DB</span>
            <h4 className="text-sm font-bold text-white mb-2">PostgreSQL + PostGIS & TimescaleDB</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              PostGIS spatial indexing (`ST_DWithin`, spatial joins) powering smart dispatch distance calculations, coupled with Timescale hypertables.
            </p>
          </div>

          {/* Hardware */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">EDGE HARDWARE & SENSORS</span>
            <h4 className="text-sm font-bold text-white mb-2">ESP32 SoC + Multi-Sensor Bus</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Laser optical particulate meters (PM2.5/PM10), electrochemical gas array (CO, NO2, SO2), submersible turbidity/pH, and off-grid solar PV pack.
            </p>
          </div>

          {/* Third-Party APIs */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">EXTERNAL DATA INTEGRATION</span>
            <h4 className="text-sm font-bold text-white mb-2">CPCB & IMD Weather APIs</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Reconciliation against Central Pollution Control Board (CPCB) reference stations and Indian Meteorological Department (IMD) doppler radar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
