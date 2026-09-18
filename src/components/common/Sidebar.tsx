import React from 'react';
import { useApp, ActiveNavTab } from '../../services/appState';
import { 
  LayoutDashboard, 
  MapPin, 
  Radio, 
  Leaf, 
  BrainCircuit, 
  Flame, 
  AlertOctagon, 
  Users, 
  ClipboardList, 
  Bell, 
  BarChart3, 
  FileText, 
  Box, 
  Cpu, 
  Settings, 
  ShieldCheck, 
  HelpCircle,
  Megaphone,
  CheckCircle,
  X,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  Crosshair
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: ActiveNavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const { activeTab, setActiveTab, issues, alerts, currentUser, logout } = useApp();

  const activeIssuesCount = issues.filter(i => i.status !== 'RESOLVED').length;
  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const navSections: NavSection[] = [
    {
      title: 'City Monitoring & Localization',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'live-map', label: 'Live City Map (GIS)', icon: MapPin },
        { id: 'devices', label: 'Sensor Devices & Placement', icon: Radio },
        { id: 'localization', label: 'Problem Localization', icon: Crosshair, badge: 10, badgeColor: 'bg-cyan-600' },
      ],
    },
    {
      title: 'Action & Response',
      items: [
        { id: 'issues', label: 'City Issues & Incidents', icon: AlertOctagon, badge: activeIssuesCount, badgeColor: 'bg-rose-500' },
        { id: 'teams', label: 'Response Teams', icon: Users },
        { id: 'field-tasks', label: 'Field Worker Tasks', icon: ClipboardList },
        { id: 'verification', label: 'Proof & Verification', icon: CheckCircle },
        { id: 'alerts', label: 'Alert Center', icon: Bell, badge: unreadAlertsCount, badgeColor: 'bg-amber-500' },
      ],
    },
    {
      title: 'AI & Health Prediction',
      items: [
        { id: 'disease-risk', label: 'Health Risk AI', icon: BrainCircuit },
        { id: 'hotspots', label: 'Predictive Hotspots', icon: Flame },
        { id: 'environment', label: 'Air & Water Data', icon: Leaf },
      ],
    },
    {
      title: 'Public & System',
      items: [
        { id: 'citizen-report', label: 'Citizen Incident Report', icon: Megaphone },
        { id: 'analytics', label: 'City Analytics & SLA', icon: BarChart3 },
        { id: 'reports', label: 'PDF Reports & Dossiers', icon: FileText },
        { id: 'digital-twin', label: '3D City Model', icon: Box },
        { id: 'technical-architecture', label: 'AI Architecture', icon: Cpu },
        { id: 'admin', label: 'Settings & Admin', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tabId: ActiveNavTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-slate-950 px-3.5 py-4 text-slate-300 font-sans border-r border-slate-850">
      <div>
        {/* Brand & Logo */}
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white font-mono text-base">EcoSentinel</span>
                <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-extrabold text-cyan-300 font-mono">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">City Environmental Grid</p>
            </div>
          </div>

          {onCloseMobile && (
            <button onClick={onCloseMobile} className="rounded p-1 text-slate-400 hover:text-white lg:hidden">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Signed In</span>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 font-mono">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-100 truncate">{currentUser.name}</p>
        </div>

        {/* Grouped Navigation Links */}
        <div className="space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-2 pb-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs font-semibold'
                        : 'text-slate-400 hover:bg-slate-900/90 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 ? (
                      <span
                        className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white ${
                          item.badgeColor || 'bg-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="h-3.5 w-3.5 text-cyan-400/60 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Logout */}
      <div className="mt-6 border-t border-slate-800/80 pt-3 space-y-2">
        <button
          onClick={logout}
          className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/30 hover:text-rose-300 transition-all font-mono"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Lock & Sign Out</span>
          </div>
          <span className="text-[10px] text-slate-500">ESC</span>
        </button>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-2.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1 text-slate-300 font-semibold mb-0.5">
            <HelpCircle className="h-3 w-3 text-cyan-400 shrink-0" />
            <span>AI Decision Support</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500">
            Assists municipal teams with predictive air & water alerts.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-800/80 bg-slate-950 lg:block sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative flex h-full w-72 flex-col z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
