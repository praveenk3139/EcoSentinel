import React, { useState, useEffect } from 'react';
import { useApp, ActiveNavTab } from '../../services/appState';
import { UserRole } from '../../types';
import { 
  Bell, 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  UserCheck, 
  Activity, 
  Globe, 
  Radio, 
  CheckCheck,
  ChevronDown,
  Sparkles,
  Layers,
  LogOut
} from 'lucide-react';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentUser, 
    setUserRole, 
    activeTab, 
    setActiveTab,
    isSimulating, 
    toggleSimulation, 
    simulationSpeed, 
    setSimulationSpeed, 
    triggerScenario,
    alerts,
    setAuthModalOpen,
    acknowledgeAlert,
    logout
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
        ' ' + 
        now.toLocaleTimeString('en-GB', { hour12: false }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  const getBreadcrumbTitle = (tab: ActiveNavTab) => {
    switch (tab) {
      case 'dashboard': return 'Command Center / Overview';
      case 'live-map': return 'GIS Monitoring / Spatial IoT Map';
      case 'devices': return 'Sensors & Hardware / Fleet Management';
      case 'localization': return 'Problem Localization & Team Dispatch / Spatial AI';
      case 'environment': return 'Environmental Parameters / Multi-Media Telemetry';
      case 'disease-risk': return 'Health Risk Intelligence / Modeled Patterns';
      case 'hotspots': return 'Predictive Hotspots / Temporal Forecasting';
      case 'issues': return 'Incident Command / Environmental Issues';
      case 'teams': return 'Field Logistics / Smart Personnel Assignment';
      case 'field-tasks': return 'Field Worker Hub / My Active Tasks';
      case 'verification': return 'Closed-Loop / Resolution Verification';
      case 'citizen-report': return 'Public Intake / Citizen Incident Reporting';
      case 'alerts': return 'Incident Alerts / Correlation Stream';
      case 'analytics': return 'Data Analytics / Environmental Trends & SLA';
      case 'reports': return 'Compliance Reporting / PDF Incident Dossiers';
      case 'digital-twin': return 'Spatial 3D / Environmental Digital Twin';
      case 'technical-architecture': return 'Technical Approach / AI & System Architecture';
      case 'admin': return 'System Administration / Config & Audit Logs';
      case 'landing': return 'Public Portal / EcoSentinel Intelligence';
      default: return 'Environmental Command Center';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/85 px-4 backdrop-blur-md lg:px-6">
      {/* Left: Mobile button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            <Layers className="h-5 w-5" />
          </button>
        )}

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider">ECOSENTINEL ENGINE ACTIVE</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{currentTime}</span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-200">
            {getBreadcrumbTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Center: Search & Demo Mode Simulator Controls */}
      <div className="flex items-center gap-3">
        {/* Global Quick Filter / Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search zones, devices, issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>

        {/* DEMO MODE BADGE & CONTROLS */}
        <div className="flex items-center rounded-lg border border-amber-500/30 bg-amber-950/30 px-2 py-1 text-xs text-amber-300">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="hidden sm:inline font-mono font-bold tracking-wider text-[11px] mr-2">DEMO MODE</span>

          {/* Play/Pause */}
          <button
            onClick={toggleSimulation}
            title={isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
            className="rounded p-1 hover:bg-amber-500/20 text-amber-200 transition-colors"
          >
            {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 5 : simulationSpeed === 5 ? 10 : 1)}
            title="Cycle Simulation Speed"
            className="ml-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold hover:bg-amber-500/20 text-amber-200"
          >
            {simulationSpeed}x
          </button>

          {/* Quick Scenario Injector */}
          <div className="relative ml-1">
            <button
              onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
              className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/30 transition-colors"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="hidden md:inline">Test Scenarios</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {scenarioDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Inject Realistic Anomaly Scenarios
                </div>
                
                <button
                  onClick={() => {
                    triggerScenario('pm25_spike');
                    setScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg p-2 text-xs hover:bg-slate-800 transition-colors flex items-start gap-2"
                >
                  <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">1. PM2.5 Spike in Zone 07</span>
                    <p className="text-[10px] text-slate-400">Jump AQ-014 to 118 µg/m³, escalate ENV-104 to Critical.</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    triggerScenario('water_anomaly');
                    setScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg p-2 text-xs hover:bg-slate-800 transition-colors flex items-start gap-2"
                >
                  <Activity className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">2. Water Contamination in Zone 04</span>
                    <p className="text-[10px] text-slate-400">pH plunges to 4.8, turbidity spikes at canal outfall.</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    triggerScenario('field_resolution');
                    setScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg p-2 text-xs hover:bg-slate-800 transition-colors flex items-start gap-2"
                >
                  <CheckCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">3. Field Resolution & Drop</span>
                    <p className="text-[10px] text-slate-400">PM2.5 drops 92 → 38 µg/m³, submit before/after verification.</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    triggerScenario('closed_loop_reopen');
                    setScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg p-2 text-xs hover:bg-slate-800 transition-colors flex items-start gap-2"
                >
                  <RotateCcw className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">4. Closed-Loop Reopen & Escalate</span>
                    <p className="text-[10px] text-slate-400">Secondary spike triggers automated Reopening & Escalation.</p>
                  </div>
                </button>

                <div className="border-t border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    triggerScenario('reset');
                    setScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1 font-mono"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Baseline Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Landing Portal toggle, Notifications, Role Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Landing Portal toggle */}
        <button
          onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'landing' 
              ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300' 
              : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{activeTab === 'landing' ? 'Command Center' : 'Public Landing'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
            className="relative rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {alertsDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Live Incident Alerts</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{unreadAlerts.length} Unacknowledged</span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {alerts.slice(0, 6).map((alt) => (
                  <div
                    key={alt.id}
                    className={`rounded-lg border p-2.5 transition-colors ${
                      alt.acknowledged
                        ? 'border-slate-800/80 bg-slate-950/40 text-slate-400'
                        : 'border-slate-700 bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-200 leading-tight">{alt.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{alt.timestamp}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300 leading-snug">{alt.message}</p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-cyan-400 font-medium">{alt.areaName}</span>
                      {!alt.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alt.id)}
                          className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded px-1.5 py-0.5"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-2 mt-2">
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setAlertsDropdownOpen(false);
                  }}
                  className="w-full text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-1"
                >
                  View All Alerts Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher & Profile */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden text-left xl:block">
              <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.name}</p>
              <span className="text-[10px] font-mono text-cyan-400">{currentUser.role.replace('_', ' ')}</span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="border-b border-slate-800 px-3 py-2">
                <p className="text-xs font-bold text-slate-100">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.badge}</p>
              </div>

              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Switch Role Perspective
              </div>

              {(['ADMINISTRATOR', 'SUPERVISOR', 'FIELD_WORKER', 'CITIZEN'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                    currentUser.role === role 
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{role.replace('_', ' ')}</span>
                  {currentUser.role === role && <CheckCheck className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              ))}

              <div className="border-t border-slate-800 mt-2 pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Account & Authentication</span>
                </button>

                <button
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-400" />
                  <span>Log Out / Lock Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
