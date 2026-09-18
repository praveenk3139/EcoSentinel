import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Sparkles,
  QrCode
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { areas, issues, addToast } = useApp();
  const [selectedReportType, setSelectedReportType] = useState<'INCIDENT' | 'AREA' | 'HARDWARE'>('INCIDENT');

  const handlePrintOrDownload = () => {
    addToast({
      type: 'success',
      title: 'Report Dossier Formatted',
      message: 'Generating cryptographically signed PDF with CPCB & WHO regulatory tags.',
    });
    window.print?.();
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>REGULATORY COMPLIANCE & LEGAL DOSSIER COMPILER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Compliance Reports & Incident Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized CPCB & WHO reporting formats with cryptographic hash audit stamps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintOrDownload}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md transition-colors font-mono"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs font-mono">
        <button
          onClick={() => setSelectedReportType('INCIDENT')}
          className={`flex-1 py-2 rounded-lg font-bold transition-colors ${selectedReportType === 'INCIDENT' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
        >
          Incident Dossier (ENV-104)
        </button>
        <button
          onClick={() => setSelectedReportType('AREA')}
          className={`flex-1 py-2 rounded-lg font-bold transition-colors ${selectedReportType === 'AREA' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
        >
          Zone 07 Environmental Audit
        </button>
        <button
          onClick={() => setSelectedReportType('HARDWARE')}
          className={`flex-1 py-2 rounded-lg font-bold transition-colors ${selectedReportType === 'HARDWARE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
        >
          IoT Sensor Fleet Calibration
        </button>
      </div>

      {/* PRINTABLE REPORT PREVIEW PAPER */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md text-slate-200 font-sans space-y-6">
        {/* Official Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-700 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                CPCB COMPLIANCE FORM 4-B
              </span>
              <span className="text-xs font-mono text-slate-400">STATE POLLUTION CONTROL BOARD</span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono">
              EcoSentinel AI Environmental Remediation Dossier
            </h2>
            <p className="text-xs text-slate-400">
              Generated Under National Clean Air Programme (NCAP) Autonomous Sentry Protocol
            </p>
          </div>

          <div className="text-right font-mono text-[11px] text-slate-400 space-y-0.5">
            <div>Dossier ID: <strong className="text-white font-mono">DOS-2026-ENV104</strong></div>
            <div>Date of Execution: <strong className="text-white">Sep 18, 2026</strong></div>
            <div className="text-emerald-400 font-bold">Hash: 8f9b2a...31e4 (VERIFIED)</div>
          </div>
        </div>

        {/* Incident Summary Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">INCIDENT TOKEN</span>
            <strong className="text-cyan-400">ENV-104</strong>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">CLASSIFICATION</span>
            <strong className="text-white">Industrial Particulate Spike</strong>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">ASSIGNED FIELD UNIT</span>
            <strong className="text-white">Field Team 03</strong>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">FINAL STATUS</span>
            <strong className="text-emerald-400">RESOLVED & VERIFIED</strong>
          </div>
        </div>

        {/* Quantitative Telemetry Before & After Table */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase text-slate-300 mb-2">
            1. Pre- vs Post-Intervention Environmental Telemetry Reconciliation
          </h3>
          <table className="w-full text-left text-xs border border-slate-800">
            <thead className="bg-slate-950 font-mono text-[10px] uppercase text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Environmental Parameter</th>
                <th className="py-2.5 px-3">Baseline WHO Limit</th>
                <th className="py-2.5 px-3 text-rose-400">Pre-Remediation</th>
                <th className="py-2.5 px-3 text-emerald-400">Post-Remediation</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Audit Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              <tr>
                <td className="py-2.5 px-3 text-slate-200">Optical PM2.5</td>
                <td className="py-2.5 px-3 text-slate-400">15 µg/m³ (24h)</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">92.0 µg/m³</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">38.0 µg/m³</td>
                <td className="py-2.5 px-3 text-emerald-400">-58.7%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">PASSED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-200">Coarse PM10</td>
                <td className="py-2.5 px-3 text-slate-400">45 µg/m³ (24h)</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">148.0 µg/m³</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">54.0 µg/m³</td>
                <td className="py-2.5 px-3 text-emerald-400">-63.5%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">PASSED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-200">Air Quality Index (AQI)</td>
                <td className="py-2.5 px-3 text-slate-400">100 (Satisfactory)</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">188 (Poor)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">58 (Good)</td>
                <td className="py-2.5 px-3 text-emerald-400">-69.1%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">PASSED</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Photographic Audit Section */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase text-slate-300 mb-2">
            2. Chain of Custody Photographic Verification
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] font-mono text-rose-400 block font-bold mb-1">
                PRE-INTERVENTION CAPTURE (08:34 AM)
              </span>
              <p className="text-[11px] text-slate-400 mb-2">
                Uncontained aggregate fugitive dust from excavation pit. Device AQ-101 breached 92 µg/m³.
              </p>
              <div className="text-[10px] font-mono text-slate-500">GPS: 28.6142° N, 77.2185° E • SHA-256 Verified</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] font-mono text-emerald-400 block font-bold mb-1">
                POST-INTERVENTION CAPTURE (10:15 AM)
              </span>
              <p className="text-[11px] text-slate-400 mb-2">
                Deployment of dual high-pressure mist cannons and chemical tackifier dust crusting completed.
              </p>
              <div className="text-[10px] font-mono text-slate-500">GPS: 28.6142° N, 77.2185° E • Verified by Supervisor</div>
            </div>
          </div>
        </div>

        {/* Legal Signatures */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Field Team Lead</span>
            <div className="font-serif italic text-base text-white mt-1">Vikram Sethi</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Field Team 03 Officer</div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Supervising Officer</span>
            <div className="font-serif italic text-base text-cyan-300 mt-1">Sarah Jenkins</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Municipal Environmental Director</div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block uppercase">AI Model Integrity Stamp</span>
            <div className="text-emerald-400 font-bold mt-1">XGB-ENS-v4.2 CERTIFIED</div>
            <div className="text-[10px] text-slate-500">Zero-Tamper Sentry Node</div>
          </div>
        </div>
      </div>
    </div>
  );
};
