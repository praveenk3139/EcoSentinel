import React from 'react';
import { useApp } from '../../services/appState';
import { 
  ShieldCheck, 
  BrainCircuit, 
  MapPin, 
  Radio, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Users, 
  Flame, 
  Clock, 
  Cpu, 
  Camera, 
  Send,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-850">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono font-bold text-cyan-300 backdrop-blur-md shadow-lg">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AUTONOMOUS ENVIRONMENTAL SENTRY & PREDICTIVE MESH</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-mono leading-tight">
            AI-Powered Environmental Intelligence & Public Health Pre-Emption
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A next-generation municipal command center unifying low-power ESP32 edge telemetry, spatio-temporal disease-risk modeling, and deterministic closed-loop remediation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-600/30 transition-all font-mono"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('citizen-report')}
              className="flex items-center gap-2 rounded-xl border border-slate-750 bg-slate-900/90 hover:bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 transition-colors font-mono"
            >
              <Send className="h-4 w-4 text-cyan-400" />
              <span>Citizen Issue Report</span>
            </button>

            <button
              onClick={() => setActiveTab('technical-architecture')}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-400 transition-colors font-mono"
            >
              <Cpu className="h-4 w-4" />
              <span>Technical Specs</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-4xl mx-auto font-mono">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase block">Active IoT Sensors</span>
              <strong className="text-xl text-white">148 Nodes</strong>
              <span className="text-[10px] text-emerald-400 block mt-0.5">99.4% fleet uptime</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase block">Inference Cadence</span>
              <strong className="text-xl text-cyan-400">&lt; 50ms</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">XGBoost & LSTM</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase block">Mean SLA Response</span>
              <strong className="text-xl text-amber-400">18.4 min</strong>
              <span className="text-[10px] text-emerald-400 block mt-0.5">-4.2m vs municipal benchmark</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase block">First-Pass Resolution</span>
              <strong className="text-xl text-emerald-400">94.2%</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Closed-loop verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS: 5-STEP LIFECYCLE (Prompt Requirement 28) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-slate-850">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            OPERATIONAL METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-mono">
            How EcoSentinel AI Governs Municipal Health
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            A deterministic closed-loop pipeline linking real-time physical telemetry to audited field remediation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Mesh Ingestion',
              desc: 'Autonomous solar ESP32 nodes capture optical particulates, toxic gases, water pH, and microclimate.',
              icon: Radio,
            },
            {
              step: '02',
              title: 'AI Risk Inference',
              desc: 'XGBoost & LSTM ensemble detects acute spikes and models disease-risk vectors without diagnostic overreach.',
              icon: BrainCircuit,
            },
            {
              step: '03',
              title: 'Transparent Triage',
              desc: 'Priority Engine scores incidents weighing schools, hospitals, population density, and rate of change.',
              icon: Activity,
            },
            {
              step: '04',
              title: 'Smart Dispatch',
              desc: 'Multi-criteria spatial engine recommends closest certified response team with supervisor sign-off.',
              icon: Users,
            },
            {
              step: '05',
              title: 'Closed-Loop Proof',
              desc: 'Continuous post-treatment sensor reconciliation and geofenced before-after photos seal the dossier.',
              icon: CheckCircle2,
            },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-2">{item.step}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE ARCHITECTURAL PILLARS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">GIS Spatial Command</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dark-themed high-density Leaflet map featuring real-time telemetry markers, dynamic risk catchment zones, and instant click-to-dispatch popups.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Health Risk Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strictly non-diagnostic environmental hazard modeling estimating localized respiratory, mosquito-vector, and enteric exposure patterns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Guarded Closed-Loop</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quantitative comparison of sensor parameters before vs after intervention, with automated sentinel triggers that auto-reopen on secondary spikes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
