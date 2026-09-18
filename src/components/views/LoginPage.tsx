import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Radio, 
  Cpu, 
  Sparkles, 
  Activity, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Flame,
  Layers,
  Sun,
  Moon
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActiveTab, theme, toggleTheme } = useApp();

  const [username, setUsername] = useState('praveen');
  const [password, setPassword] = useState('praveen1732@');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMINISTRATOR');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password, selectedRole);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  const handleQuickFill = (userVal: string, passVal: string, roleVal: UserRole) => {
    setUsername(userVal);
    setPassword(passVal);
    setSelectedRole(roleVal);
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto bg-slate-950 px-4 py-8 font-sans text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Animated Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-xl my-auto">
        {/* Top Ticker / Header Status */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider">ECOSENTINEL MESH v2.6 ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              148 Nodes
            </span>
            <span className="text-slate-600">•</span>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1 text-slate-300 hover:text-white transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3 w-3 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3 text-indigo-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          {/* Header Banner */}
          <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-850 to-slate-900/50 p-6 sm:p-8 text-center">
            {/* Top Accent Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                EcoSentinel <span className="text-cyan-400">AI</span>
              </h1>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                OFFICIAL
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Autonomous Environmental Sentry & Predictive Health Intelligence Command System
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Error Message if any */}
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-300 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username / Identifier */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Username or Government ID Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="praveen"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 font-mono">
                    Secure Password
                  </label>
                  <span className="text-[11px] text-cyan-400 font-mono">Default: praveen1732@</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Access Perspective / Clearance Level
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono cursor-pointer transition-all"
                >
                  <option value="ADMINISTRATOR">Administrator (Praveen - Full Command Center & Central Config)</option>
                  <option value="SUPERVISOR">Supervisor (Triaging, Resource Allocation & Verification)</option>
                  <option value="FIELD_WORKER">Field Worker (Mobile Remediation & Before/After Evidence)</option>
                  <option value="CITIZEN">Citizen Sentinel (Public Incident Intake & Alerts)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-600/25 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 transition-all font-mono active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Verifying Cryptographic Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Authenticate & Launch Command Center</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Credentials Autofill */}
            <div className="border-t border-slate-800/90 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Quick Access Profiles (Click to fill)
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">1-Click Login</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Admin Praveen */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('praveen', 'praveen1732@', 'ADMINISTRATOR')}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                    username === 'praveen' 
                      ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/30' 
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white flex items-center gap-1 font-mono">
                      <span>Praveen</span>
                      <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] text-cyan-300">ADMIN</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">Pass: praveen1732@</span>
                  </div>
                </button>

                {/* Supervisor */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('supervisor@ecosentinel.gov.in', 'praveen1732@', 'SUPERVISOR')}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                    username.includes('supervisor') 
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/30' 
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white font-mono">Supervisor Kavita</div>
                    <span className="text-[10px] text-slate-400 block font-mono">District Operations</span>
                  </div>
                </button>

                {/* Field Worker */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('field@ecosentinel.gov.in', 'praveen1732@', 'FIELD_WORKER')}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                    username.includes('field') 
                      ? 'border-amber-500/60 bg-amber-950/40 text-amber-200 ring-1 ring-amber-500/30' 
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white font-mono">Field Worker Vikram</div>
                    <span className="text-[10px] text-slate-400 block font-mono">Team 03 Rapid Mesh</span>
                  </div>
                </button>

                {/* Citizen */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('citizen@ecosentinel.gov.in', 'praveen1732@', 'CITIZEN')}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                    username.includes('citizen') 
                      ? 'border-purple-500/60 bg-purple-950/40 text-purple-200 ring-1 ring-purple-500/30' 
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white font-mono">Citizen Sentinel</div>
                    <span className="text-[10px] text-slate-400 block font-mono">Public Ward 14</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="border-t border-slate-800/80 bg-slate-950/60 px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>TLS 1.3 End-to-End Secure</span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              Admin: <span className="text-cyan-300 font-bold">praveen</span> • Pass: <span className="text-cyan-300 font-bold">praveen1732@</span>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Mission Disclaimer */}
        <div className="mt-4 text-center text-[11px] text-slate-500 font-mono">
          Municipal Directorate of Environmental Intelligence & Early Warning Systems
        </div>
      </div>
    </div>
  );
};
