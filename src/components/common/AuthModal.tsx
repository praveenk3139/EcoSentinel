import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { UserRole } from '../../types';
import { ShieldCheck, Mail, Lock, User as UserIcon, X, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, currentUser, setCurrentUser, setUserRole, addToast, login } = useApp();
  
  const [tab, setTab] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('praveen@ecosentinel.gov.in');
  const [password, setPassword] = useState('praveen1732@');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('ADMINISTRATOR');
  const [verificationCode, setVerificationCode] = useState('');

  if (!authModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password, role);
    if (result.success) {
      setAuthModalOpen(false);
    } else {
      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: result.message || 'Invalid credentials.',
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setTab('verify');
    addToast({
      type: 'info',
      title: 'Verification Dispatched',
      message: `A 6-digit confirmation code was sent to ${email}.`,
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(role);
    setAuthModalOpen(false);
    addToast({
      type: 'success',
      title: 'Email Verified',
      message: 'Account verified and activated with role credentials.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">EcoSentinel Identity & Access</h3>
          </div>
          <button onClick={() => setAuthModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              tab === 'login' ? 'border-b-2 border-cyan-400 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              tab === 'register' ? 'border-b-2 border-cyan-400 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setTab('forgot')}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              tab === 'forgot' ? 'border-b-2 border-cyan-400 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recovery
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="user@ecosentinel.gov.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Assignment (Demo Mode)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ADMINISTRATOR">Administrator (Full Central Control)</option>
                  <option value="SUPERVISOR">Supervisor (Triaging, Approvals & Verification)</option>
                  <option value="FIELD_WORKER">Field Worker (Mobile Tasks & Evidence)</option>
                  <option value="CITIZEN">Citizen (Public Intake & Alerts)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/20"
                >
                  <span>Authenticate & Launch Session</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. Officer Sunita Rao"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Government / Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="officer@ecosentinel.gov.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="FIELD_WORKER">Field Worker / Rapid Response</option>
                  <option value="SUPERVISOR">District Supervisor</option>
                  <option value="CITIZEN">Citizen Volunteer Sentinel</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500"
                >
                  Send Verification Code
                </button>
              </div>
            </form>
          )}

          {tab === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Verify Email Token</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Enter the 6-digit confirmation PIN sent to <span className="text-cyan-300">{email}</span>
                </p>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="684920"
                className="mx-auto block w-48 rounded-lg border border-cyan-500/50 bg-slate-800 py-2 text-center text-lg tracking-widest font-mono font-bold text-cyan-300 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Verify & Activate Account
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Enter your administrative or field worker email to receive an automated encrypted password reset link.
              </p>
              <input
                type="email"
                placeholder="registered-email@ecosentinel.gov.in"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  setTab('login');
                  addToast({
                    type: 'info',
                    title: 'Reset Link Dispatched',
                    message: 'Password reset link sent to your registered email.',
                  });
                }}
                className="w-full rounded-lg bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
              >
                Send Password Reset Instructions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
