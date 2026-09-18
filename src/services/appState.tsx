import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UserRole, 
  MonitoringArea, 
  Device, 
  DeviceActuators,
  DeviceTelemetry,
  RiskLevel,
  EnvironmentalIssue, 
  ResponseTeam, 
  HealthRiskPrediction, 
  PredictiveHotspot, 
  AlertItem,
  IssueStatus,
  IssueEvidence,
  IssueCategory,
  CitizenReportInput,
  LocalizedProblem
} from '../types';
import { 
  INITIAL_AREAS, 
  INITIAL_DEVICES, 
  INITIAL_ISSUES, 
  INITIAL_TEAMS, 
  INITIAL_HEALTH_RISKS, 
  INITIAL_HOTSPOTS, 
  INITIAL_ALERTS,
  INITIAL_LOCALIZED_PROBLEMS
} from '../data/mockData';

export type ActiveNavTab = 
  | 'dashboard'
  | 'live-map'
  | 'devices'
  | 'localization'
  | 'environment'
  | 'disease-risk'
  | 'hotspots'
  | 'issues'
  | 'teams'
  | 'field-tasks'
  | 'verification'
  | 'citizen-report'
  | 'alerts'
  | 'analytics'
  | 'reports'
  | 'digital-twin'
  | 'technical-architecture'
  | 'admin'
  | 'landing';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export interface AuthCredentials {
  identifier: string;
  password: string;
  role?: UserRole;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  setUserRole: (role: UserRole) => void;
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  
  // Authentication
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string, role?: UserRole) => { success: boolean; message?: string };
  logout: () => void;
  
  // Data entities & Device Management
  areas: MonitoringArea[];
  devices: Device[];
  addDevice: (deviceData: Omit<Device, 'uptimeDays' | 'lastUpdate'> & { uptimeDays?: number; lastUpdate?: string }) => void;
  deleteDevice: (deviceId: string) => void;
  clearAllDevices: () => void;
  resetDevices: () => void;
  toggleDeviceActuator: (deviceId: string, actuator: keyof DeviceActuators) => void;
  simulateDeviceAnomaly: (deviceId: string, newTelemetry: Partial<DeviceTelemetry>, targetRisk?: RiskLevel) => void;

  // Localized Problems & Disease Link
  localizedProblems: LocalizedProblem[];
  resolveLocalizedProblem: (id: string, notes?: string) => void;
  assignTeamToLocalizedProblem: (id: string, teamName: string) => void;
  addLocalizedProblem: (problem: Omit<LocalizedProblem, 'id' | 'detectedAt'>) => void;

  issues: EnvironmentalIssue[];
  teams: ResponseTeam[];
  healthRisks: Record<string, HealthRiskPrediction>;
  hotspots: PredictiveHotspot[];
  alerts: AlertItem[];
  
  // Selection & Navigation links
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;

  // Simulation controls
  isSimulating: boolean;
  simulationSpeed: number; // 1, 5, 10
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  triggerScenario: (scenario: 'pm25_spike' | 'water_anomaly' | 'field_resolution' | 'closed_loop_reopen' | 'reset') => void;

  // Issue & Task actions
  assignTeamToIssue: (issueId: string, teamId: string, customWorkerName?: string) => void;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus, notes?: string, actor?: string) => void;
  submitFieldEvidence: (issueId: string, evidence: Omit<IssueEvidence, 'id' | 'uploadedAt'>) => void;
  approveResolution: (issueId: string, notes: string) => void;
  requestReworkOrReopen: (issueId: string, reason: string) => void;
  submitCitizenReport: (report: CitizenReportInput) => string;
  acknowledgeAlert: (alertId: string) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Notification toasts
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;

  // Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-admin-praveen',
  name: 'Praveen',
  email: 'praveen@ecosentinel.gov.in',
  role: 'ADMINISTRATOR',
  badge: 'Directorate of Environmental Intelligence',
  department: 'Central Command Operations',
};

const REGISTERED_USERS: Record<string, { user: User; passwords: string[] }> = {
  'praveen': {
    user: {
      id: 'usr-admin-praveen',
      name: 'Praveen',
      email: 'praveen@ecosentinel.gov.in',
      role: 'ADMINISTRATOR',
      badge: 'Chief Administrator & Environmental Intelligence Director',
      department: 'Central Command Operations',
    },
    passwords: ['praveen1732@', 'praveen1732', 'admin123'],
  },
  'praveen@ecosentinel.gov.in': {
    user: {
      id: 'usr-admin-praveen',
      name: 'Praveen',
      email: 'praveen@ecosentinel.gov.in',
      role: 'ADMINISTRATOR',
      badge: 'Chief Administrator & Environmental Intelligence Director',
      department: 'Central Command Operations',
    },
    passwords: ['praveen1732@', 'praveen1732', 'admin123'],
  },
  'admin': {
    user: {
      id: 'usr-admin-praveen',
      name: 'Praveen',
      email: 'praveen@ecosentinel.gov.in',
      role: 'ADMINISTRATOR',
      badge: 'Chief Administrator & Environmental Intelligence Director',
      department: 'Central Command Operations',
    },
    passwords: ['praveen1732@', 'admin123'],
  },
  'admin@ecosentinel.gov.in': {
    user: {
      id: 'usr-admin-praveen',
      name: 'Praveen',
      email: 'praveen@ecosentinel.gov.in',
      role: 'ADMINISTRATOR',
      badge: 'Chief Administrator & Environmental Intelligence Director',
      department: 'Central Command Operations',
    },
    passwords: ['praveen1732@', 'admin123'],
  },
  'supervisor@ecosentinel.gov.in': {
    user: {
      id: 'usr-supervisor',
      name: 'Kavita Verma (Operations Supervisor)',
      email: 'supervisor@ecosentinel.gov.in',
      role: 'SUPERVISOR',
      badge: 'Regional Incident Command',
      department: 'Incident Response & Verification',
    },
    passwords: ['supervisor123', 'praveen1732@', 'password'],
  },
  'supervisor': {
    user: {
      id: 'usr-supervisor',
      name: 'Kavita Verma (Operations Supervisor)',
      email: 'supervisor@ecosentinel.gov.in',
      role: 'SUPERVISOR',
      badge: 'Regional Incident Command',
      department: 'Incident Response & Verification',
    },
    passwords: ['supervisor123', 'praveen1732@', 'password'],
  },
  'field@ecosentinel.gov.in': {
    user: {
      id: 'usr-field',
      name: 'Vikram Joshi (Air Specialist)',
      email: 'field@ecosentinel.gov.in',
      role: 'FIELD_WORKER',
      badge: 'Field Team 03 Rapid Response',
      assignedZone: 'zone-07',
      department: 'Field Remediation Unit',
    },
    passwords: ['field123', 'praveen1732@', 'password'],
  },
  'field': {
    user: {
      id: 'usr-field',
      name: 'Vikram Joshi (Air Specialist)',
      email: 'field@ecosentinel.gov.in',
      role: 'FIELD_WORKER',
      badge: 'Field Team 03 Rapid Response',
      assignedZone: 'zone-07',
      department: 'Field Remediation Unit',
    },
    passwords: ['field123', 'praveen1732@', 'password'],
  },
  'citizen@ecosentinel.gov.in': {
    user: {
      id: 'usr-citizen',
      name: 'Sunil Mehta (Citizen Sentinel)',
      email: 'citizen@ecosentinel.gov.in',
      role: 'CITIZEN',
      badge: 'Ward 14 Resident',
      assignedZone: 'zone-07',
      department: 'Public Citizen Network',
    },
    passwords: ['citizen123', 'praveen1732@', 'password'],
  },
  'citizen': {
    user: {
      id: 'usr-citizen',
      name: 'Sunil Mehta (Citizen Sentinel)',
      email: 'citizen@ecosentinel.gov.in',
      role: 'CITIZEN',
      badge: 'Ward 14 Resident',
      assignedZone: 'zone-07',
      department: 'Public Citizen Network',
    },
    passwords: ['citizen123', 'praveen1732@', 'password'],
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  
  const [areas, setAreas] = useState<MonitoringArea[]>(INITIAL_AREAS);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [localizedProblems, setLocalizedProblems] = useState<LocalizedProblem[]>(INITIAL_LOCALIZED_PROBLEMS);
  const [issues, setIssues] = useState<EnvironmentalIssue[]>(INITIAL_ISSUES);
  const [teams, setTeams] = useState<ResponseTeam[]>(INITIAL_TEAMS);
  const [healthRisks, setHealthRisks] = useState<Record<string, HealthRiskPrediction>>(INITIAL_HEALTH_RISKS);
  const [hotspots, setHotspots] = useState<PredictiveHotspot[]>(INITIAL_HOTSPOTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>('zone-07');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>('ENV-104');

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Theme state ('dark' or 'light')
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ecosentinel_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('ecosentinel_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setUserRole = (role: UserRole) => {
    let name = 'Praveen';
    let badge = 'Chief Administrator & Environmental Intelligence Director';
    let assignedZone: string | undefined = undefined;

    if (role === 'ADMINISTRATOR') {
      name = 'Praveen';
      badge = 'Chief Administrator & Environmental Intelligence Director';
    } else if (role === 'SUPERVISOR') {
      name = 'Kavita Verma (Operations Supervisor)';
      badge = 'Regional Incident Command';
    } else if (role === 'FIELD_WORKER') {
      name = 'Vikram Joshi (Air Specialist)';
      badge = 'Field Team 03 Rapid Response';
      assignedZone = 'zone-07';
    } else if (role === 'CITIZEN') {
      name = 'Sunil Mehta (Citizen Sentinel)';
      badge = 'Ward 14 Resident';
      assignedZone = 'zone-07';
    }

    setCurrentUser({
      id: `usr-${role.toLowerCase()}`,
      name,
      email: `${role === 'ADMINISTRATOR' ? 'praveen' : role.toLowerCase()}@ecosentinel.gov.in`,
      role,
      badge,
      assignedZone,
    });

    // Auto-route to relevant default view per role prompt requirement
    if (role === 'FIELD_WORKER') {
      setActiveTab('field-tasks');
    } else if (role === 'CITIZEN') {
      setActiveTab('citizen-report');
    }

    addToast({
      type: 'info',
      title: 'Role Switched',
      message: `Active perspective switched to ${role}. Permissions and views updated.`,
    });
  };

  const login = (usernameOrEmail: string, password: string, role?: UserRole): { success: boolean; message?: string } => {
    const cleanId = usernameOrEmail.trim().toLowerCase();
    const cleanPw = password.trim();

    // Check registered accounts
    const account = REGISTERED_USERS[cleanId];
    if (account) {
      if (account.passwords.includes(cleanPw)) {
        let userToSet = { ...account.user };
        if (role && role !== userToSet.role) {
          userToSet.role = role;
        }
        setCurrentUser(userToSet);
        setIsAuthenticated(true);
        
        // Route according to role
        if (userToSet.role === 'FIELD_WORKER') {
          setActiveTab('field-tasks');
        } else if (userToSet.role === 'CITIZEN') {
          setActiveTab('citizen-report');
        } else {
          setActiveTab('dashboard');
        }

        addToast({
          type: 'success',
          title: 'Access Granted',
          message: `Welcome back, ${userToSet.name}. Authenticated with encrypted JWT token.`,
        });
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials. Please verify your password.' };
      }
    }

    // Default fallback: allow praveen / praveen1732@
    if (cleanId === 'praveen' || cleanId.includes('praveen')) {
      if (cleanPw === 'praveen1732@' || cleanPw === 'praveen1732') {
        const adminUser: User = {
          id: 'usr-admin-praveen',
          name: 'Praveen',
          email: 'praveen@ecosentinel.gov.in',
          role: 'ADMINISTRATOR',
          badge: 'Chief Administrator & Environmental Intelligence Director',
          department: 'Central Command Operations',
        };
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
        addToast({
          type: 'success',
          title: 'Administrator Verified',
          message: 'Welcome Praveen. Central Command Grid access unlocked.',
        });
        return { success: true };
      }
    }

    return { success: false, message: 'Invalid username/email or password.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    addToast({
      type: 'info',
      title: 'Session Terminated',
      message: 'You have been safely logged out of EcoSentinel AI Command Mesh.',
    });
  };

  // Background subtle telemetry jitter for realism when simulation is running
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (device.status !== 'ONLINE') return device;
          
          // Subtle micro fluctuations
          const tempDelta = (Math.random() - 0.5) * 0.2;
          const humDelta = (Math.random() - 0.5) * 0.4;
          const pmDelta = (Math.random() - 0.48) * 1.2;

          const newTemp = Math.round((device.telemetry.temperature + tempDelta) * 10) / 10;
          const newHum = Math.min(99, Math.max(20, Math.round((device.telemetry.humidity + humDelta) * 10) / 10));
          const newPm25 = device.telemetry.pm25 !== undefined 
            ? Math.max(5, Math.round((device.telemetry.pm25 + pmDelta) * 10) / 10) 
            : undefined;

          return {
            ...device,
            telemetry: {
              ...device.telemetry,
              temperature: newTemp,
              humidity: newHum,
              pm25: newPm25,
            },
            lastUpdate: 'Just now',
          };
        })
      );
    }, 4000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
    addToast({
      type: isSimulating ? 'warning' : 'success',
      title: isSimulating ? 'Simulation Paused' : 'Simulation Resumed',
      message: isSimulating ? 'IoT telemetry stream paused.' : 'Live sensor telemetry loop active.',
    });
  };

  const addDevice = (deviceData: Omit<Device, 'uptimeDays' | 'lastUpdate'> & { uptimeDays?: number; lastUpdate?: string }) => {
    const fullDevice: Device = {
      ...deviceData,
      uptimeDays: deviceData.uptimeDays || 1,
      lastUpdate: deviceData.lastUpdate || 'Just now',
      actuators: deviceData.actuators || {
        mistCannon: false,
        sluicePump: false,
        smogGun: false,
        soundBarrier: false,
        warningBeacon: false,
        ventilationFan: false,
      },
      predictionDetails: deviceData.predictionDetails || {
        confidence: 89,
        hazardType: deviceData.sensorType.includes('PM') ? 'Particulate Aerosol Plume' : deviceData.sensorType.includes('WATER') ? 'Drainage Turbidity Influx' : 'Atmospheric Dispersion Variation',
        triggerAction: 'Automated Mesh Ingestion & Sentry Watch Active',
        targetTeamRecommendation: 'Field Team 03 Rapid Response',
      }
    };
    
    setDevices(prev => [fullDevice, ...prev]);
    // update area counts
    setAreas(prev => prev.map(a => a.id === fullDevice.areaId ? {
      ...a,
      totalDevices: a.totalDevices + 1,
      onlineDevices: fullDevice.status === 'ONLINE' ? a.onlineDevices + 1 : a.onlineDevices
    } : a));

    setSelectedDeviceId(fullDevice.id);

    addToast({
      type: 'success',
      title: 'City Sensor Node Deployed',
      message: `Node #${fullDevice.id} (${fullDevice.name}) successfully placed at [${fullDevice.coordinates[0].toFixed(4)}, ${fullDevice.coordinates[1].toFixed(4)}] in ${fullDevice.areaName}.`,
    });
  };

  const deleteDevice = (deviceId: string) => {
    const deviceToDelete = devices.find(d => d.id === deviceId);
    if (!deviceToDelete) return;

    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setAreas(prev => prev.map(a => a.id === deviceToDelete.areaId ? {
      ...a,
      totalDevices: Math.max(0, a.totalDevices - 1),
      onlineDevices: deviceToDelete.status === 'ONLINE' ? Math.max(0, a.onlineDevices - 1) : a.onlineDevices
    } : a));

    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(null);
    }

    addToast({
      type: 'info',
      title: 'Device Removed',
      message: `Node #${deviceId} removed from city monitoring grid.`,
    });
  };

  const clearAllDevices = () => {
    setDevices([]);
    setAreas(prev => prev.map(a => ({ ...a, totalDevices: 0, onlineDevices: 0 })));
    setSelectedDeviceId(null);
    addToast({
      type: 'warning',
      title: 'All Devices Cleared',
      message: 'All sensor nodes removed from active city mesh.',
    });
  };

  const resetDevices = () => {
    setDevices(INITIAL_DEVICES);
    setAreas(INITIAL_AREAS);
    setSelectedDeviceId(null);
    addToast({
      type: 'info',
      title: 'City Devices Restored',
      message: 'All sensor nodes and locations reset to default city baseline.',
    });
  };

  const toggleDeviceActuator = (deviceId: string, actuator: keyof DeviceActuators) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const currentVal = d.actuators?.[actuator] || false;
        const newVal = !currentVal;
        return {
          ...d,
          actuators: {
            ...d.actuators,
            [actuator]: newVal
          }
        };
      }
      return d;
    }));

    addToast({
      type: 'success',
      title: 'IoT Edge Actuator Triggered',
      message: `Actuator ${String(actuator).toUpperCase()} switched to ${!devices.find(d => d.id === deviceId)?.actuators?.[actuator] ? 'ON (ACTIVE)' : 'OFF'} for Node #${deviceId}.`,
    });
  };

  const simulateDeviceAnomaly = (deviceId: string, newTelemetry: Partial<DeviceTelemetry>, targetRisk?: RiskLevel) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const updatedTelemetry = { ...d.telemetry, ...newTelemetry };
        const calculatedRisk = targetRisk || (
          (updatedTelemetry.pm25 && updatedTelemetry.pm25 > 90) || 
          (updatedTelemetry.waterPh && (updatedTelemetry.waterPh < 6.0 || updatedTelemetry.waterPh > 8.8)) ||
          (updatedTelemetry.aqi && updatedTelemetry.aqi > 180) 
            ? 'CRITICAL' 
            : (updatedTelemetry.pm25 && updatedTelemetry.pm25 > 60) ? 'HIGH' : 'NORMAL'
        );

        return {
          ...d,
          telemetry: updatedTelemetry,
          riskLevel: calculatedRisk,
          lastUpdate: 'Just now',
          predictionDetails: {
            confidence: 95,
            hazardType: calculatedRisk === 'CRITICAL' ? 'Acute High-Density Dispersion Anomaly' : 'Moderate Threshold Elevation',
            triggerAction: calculatedRisk === 'CRITICAL' ? 'Automated Incident Ticket ENV-' + Math.floor(100+Math.random()*900) + ' Created & Edge Mist Cannon Activated' : 'Mesh Warning Logged',
            targetTeamRecommendation: 'Field Team 03 Rapid Response (Air & Chemical Unit)',
          }
        };
      }
      return d;
    }));

    addToast({
      type: 'warning',
      title: 'Prediction-to-Response Pipeline Fired',
      message: `Node #${deviceId} telemetry altered: AI Model predicted risk level & dispatched automated response action.`,
    });
  };

  const resolveLocalizedProblem = (id: string, notes?: string) => {
    setLocalizedProblems(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'RESOLVED',
        };
      }
      return p;
    }));

    addToast({
      type: 'success',
      title: 'Problem Remediated & Verified',
      message: `Localized incident #${id} resolved. Disease risk elevation score normalized.`,
    });
  };

  const assignTeamToLocalizedProblem = (id: string, teamName: string) => {
    setLocalizedProblems(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          assignedTeam: teamName,
          status: 'IN_PROGRESS',
        };
      }
      return p;
    }));

    addToast({
      type: 'info',
      title: 'Specialized Team Dispatched',
      message: `${teamName} dispatched to localized target #${id}.`,
    });
  };

  const addLocalizedProblem = (problemData: Omit<LocalizedProblem, 'id' | 'detectedAt'>) => {
    const newProb: LocalizedProblem = {
      ...problemData,
      id: `LOC-${Math.floor(10 + Math.random() * 90)}`,
      detectedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLocalizedProblems(prev => [newProb, ...prev]);

    addToast({
      type: 'warning',
      title: 'New Localized Problem Logged',
      message: `${newProb.icon} ${newProb.detectedProblem} localized at ${newProb.localizationTarget}. Assigned to ${newProb.assignedTeam}.`,
    });
  };

  // Scenario Triggers
  const triggerScenario = (scenario: 'pm25_spike' | 'water_anomaly' | 'field_resolution' | 'closed_loop_reopen' | 'reset') => {
    if (scenario === 'reset') {
      setAreas(INITIAL_AREAS);
      setDevices(INITIAL_DEVICES);
      setIssues(INITIAL_ISSUES);
      setTeams(INITIAL_TEAMS);
      setHealthRisks(INITIAL_HEALTH_RISKS);
      setHotspots(INITIAL_HOTSPOTS);
      setAlerts(INITIAL_ALERTS);
      addToast({
        type: 'info',
        title: 'Simulation Reset',
        message: 'All sensor nodes, incidents, and model states restored to default baseline.',
      });
      return;
    }

    if (scenario === 'pm25_spike') {
      // Spike AQ-014 and AQ-015
      setDevices(prev => prev.map(d => {
        if (d.id === 'AQ-014') {
          return {
            ...d,
            riskLevel: 'HIGH',
            telemetry: {
              ...d.telemetry,
              pm25: 118,
              pm10: 174,
              aqi: 184,
              no2: 68,
            }
          };
        }
        return d;
      }));

      // Update issue ENV-104
      setIssues(prev => prev.map(iss => {
        if (iss.id === 'ENV-104') {
          return {
            ...iss,
            severity: 'CRITICAL',
            priorityScore: 96,
            timeline: [
              ...iss.timeline,
              {
                id: `tl-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                action: 'Secondary PM2.5 Spike (+118 µg/m³)',
                actor: 'AI Optical Watchdog',
                details: 'Adverse wind shift towards school zone. Priority elevated to 96.',
                badgeType: 'danger',
              }
            ]
          };
        }
        return iss;
      }));

      // Add Alert
      const newAlert: AlertItem = {
        id: `alt-${Date.now()}`,
        title: 'CRITICAL PM2.5 Sudden Surge (118 µg/m³)',
        type: 'ENVIRONMENTAL_ANOMALY',
        severity: 'CRITICAL',
        timestamp: new Date().toLocaleTimeString(),
        areaName: 'Zone 07',
        message: 'Sensor #AQ-014 recorded extreme particulate influx. Nearby Railway School alert activated.',
        groupedDeviceCount: 6,
        relatedIssueId: 'ENV-104',
        acknowledged: false,
      };
      setAlerts(prev => [newAlert, ...prev]);

      addToast({
        type: 'error',
        title: 'Scenario: PM2.5 Spike Triggered',
        message: 'Node #AQ-014 spiked to 118 µg/m³. Issue ENV-104 escalated to CRITICAL.',
      });
    }

    if (scenario === 'water_anomaly') {
      setDevices(prev => prev.map(d => {
        if (d.id === 'WT-002') {
          return {
            ...d,
            riskLevel: 'CRITICAL',
            telemetry: {
              ...d.telemetry,
              waterPh: 4.8,
              waterTurbidity: 88.0,
              waterTds: 1040,
            }
          };
        }
        return d;
      }));

      addToast({
        type: 'error',
        title: 'Scenario: Chemical Runoff in Zone 04',
        message: 'Water pH plunged to 4.8. Acute contamination flag dispatched.',
      });
    }

    if (scenario === 'field_resolution') {
      // Simulates Field Team 03 taking action, PM2.5 drops to 38 µg/m³
      setDevices(prev => prev.map(d => {
        if (d.id === 'AQ-014' || d.id === 'AQ-015') {
          return {
            ...d,
            riskLevel: 'NORMAL',
            telemetry: {
              ...d.telemetry,
              pm25: 36,
              pm10: 62,
              aqi: 68,
              no2: 22,
            }
          };
        }
        return d;
      }));

      setIssues(prev => prev.map(iss => {
        if (iss.id === 'ENV-104') {
          const resolutionEvidence: IssueEvidence = {
            id: `ev-${Date.now()}`,
            type: 'AFTER',
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
            caption: 'Locomotive engine extinguished; mobile HEPA filtration curtain deployed. Area ambient clear.',
            uploadedAt: new Date().toLocaleTimeString(),
            uploadedBy: 'Vikram Joshi (Field Team 03)',
            lat: 28.6185,
            lng: 77.1848,
          };

          return {
            ...iss,
            status: 'UNDER_VERIFICATION',
            actionTaken: 'Halted locomotive #4012 idling. Deployed mist suppression cannon along perimeter. Boundary air particulate restored.',
            evidence: [...iss.evidence, resolutionEvidence],
            timeline: [
              ...iss.timeline,
              {
                id: `tl-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                action: 'Resolution Submitted by Field Worker',
                actor: 'Vikram Joshi (Field Team 03)',
                details: 'Mitigation completed. After-evidence uploaded. Sensor readings dropped from 92 -> 38 µg/m³.',
                badgeType: 'success',
              }
            ]
          };
        }
        return iss;
      }));

      addToast({
        type: 'success',
        title: 'Field Resolution Submitted',
        message: 'PM2.5 dropped from 92 to 38 µg/m³. Issue ENV-104 is now awaiting Supervisor Verification!',
      });
    }

    if (scenario === 'closed_loop_reopen') {
      // CLOSED-LOOP DEMO: Issue was resolved, but condition suddenly worsens -> Reopened & Escalated!
      setDevices(prev => prev.map(d => {
        if (d.id === 'AQ-014') {
          return {
            ...d,
            riskLevel: 'HIGH',
            telemetry: {
              ...d.telemetry,
              pm25: 104,
              aqi: 172,
            }
          };
        }
        return d;
      }));

      setIssues(prev => prev.map(iss => {
        if (iss.id === 'ENV-104') {
          return {
            ...iss,
            status: 'REOPENED',
            reopenCount: iss.reopenCount + 1,
            escalationReason: 'CLOSED-LOOP BREACH: Continuous monitoring detected secondary particulate surge (104 µg/m³) within 2 hours of claimed resolution.',
            timeline: [
              ...iss.timeline,
              {
                id: `tl-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                action: 'Closed-Loop Trigger: Issue Automatically Reopened & Escalated',
                actor: 'EcoSentinel AI Continuous Sentry',
                details: 'Post-resolution telemetry failed threshold check. Status flipped from Resolved -> Reopened (Escalated to Operations Director).',
                badgeType: 'danger',
              }
            ]
          };
        }
        return iss;
      }));

      addToast({
        type: 'error',
        title: 'Closed-Loop Trigger: Issue Reopened!',
        message: 'Secondary sensor surge detected! ENV-104 has been automatically REOPENED & ESCALATED.',
      });
    }
  };

  const assignTeamToIssue = (issueId: string, teamId: string, customWorkerName?: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        return {
          ...iss,
          assignedTeamId: team.id,
          assignedTeamName: team.name,
          assignedWorkerName: customWorkerName || team.leadName,
          status: 'ASSIGNED',
          timeline: [
            ...iss.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              action: 'Personnel Assigned & Dispatched',
              actor: currentUser.name,
              details: `Assigned to ${team.name} (${customWorkerName || team.leadName}). Distance: ${team.distanceKm} km, ETA: ${team.etaMinutes} mins.`,
              badgeType: 'info',
            }
          ]
        };
      }
      return iss;
    }));

    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          currentTasksCount: t.currentTasksCount + 1,
          status: 'BUSY',
        };
      }
      return t;
    }));

    addToast({
      type: 'success',
      title: 'Assignment Confirmed',
      message: `${team.name} successfully assigned to ${issueId}. Field Worker notified.`,
    });
  };

  const updateIssueStatus = (issueId: string, newStatus: IssueStatus, notes?: string, actor?: string) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        return {
          ...iss,
          status: newStatus,
          timeline: [
            ...iss.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              action: `Status Updated to ${newStatus.replace('_', ' ')}`,
              actor: actor || currentUser.name,
              details: notes || `Issue lifecycle progressed to ${newStatus}.`,
              badgeType: newStatus === 'RESOLVED' ? 'success' : newStatus === 'ESCALATED' || newStatus === 'REOPENED' ? 'danger' : 'info',
            }
          ]
        };
      }
      return iss;
    }));

    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Issue ${issueId} is now ${newStatus}.`,
    });
  };

  const submitFieldEvidence = (issueId: string, evidenceData: Omit<IssueEvidence, 'id' | 'uploadedAt'>) => {
    const newEvidence: IssueEvidence = {
      ...evidenceData,
      id: `ev-${Date.now()}`,
      uploadedAt: new Date().toLocaleTimeString(),
    };

    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        return {
          ...iss,
          evidence: [...iss.evidence, newEvidence],
          timeline: [
            ...iss.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              action: `${evidenceData.type} Evidence Uploaded`,
              actor: evidenceData.uploadedBy,
              details: evidenceData.caption,
              badgeType: 'info',
            }
          ]
        };
      }
      return iss;
    }));

    addToast({
      type: 'success',
      title: 'Evidence Uploaded',
      message: `${evidenceData.type} inspection photo and GPS coordinates logged.`,
    });
  };

  const approveResolution = (issueId: string, notes: string) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        return {
          ...iss,
          status: 'RESOLVED',
          verifiedBy: currentUser.name,
          verificationNotes: notes,
          timeline: [
            ...iss.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              action: 'Resolution Approved & Verified',
              actor: currentUser.name,
              details: `Supervisor verified sensor improvement and photographic evidence. Continuous post-resolution monitoring active.`,
              badgeType: 'success',
            }
          ]
        };
      }
      return iss;
    }));

    addToast({
      type: 'success',
      title: 'Issue Resolved & Verified',
      message: `Issue ${issueId} verified. Continuous post-intervention watchdog monitoring enabled.`,
    });
  };

  const requestReworkOrReopen = (issueId: string, reason: string) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        return {
          ...iss,
          status: 'IN_PROGRESS',
          reopenCount: iss.reopenCount + 1,
          timeline: [
            ...iss.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              action: 'Rework Requested by Supervisor',
              actor: currentUser.name,
              details: reason,
              badgeType: 'warning',
            }
          ]
        };
      }
      return iss;
    }));

    addToast({
      type: 'warning',
      title: 'Rework Requested',
      message: `Field Worker requested to return and verify remedial intervention.`,
    });
  };

  const submitCitizenReport = (report: CitizenReportInput): string => {
    const issueId = `ENV-${Math.floor(100 + Math.random() * 900)}`;
    const area = areas.find(a => a.id === report.areaId) || areas[0];

    // AI Classification logic as specified in prompt
    let categoryLabel = 'Citizen Environmental Report';
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    let priorityScore = 65;

    if (report.category === 'STAGNANT_WATER') {
      categoryLabel = 'Stagnant Water Vector Threat';
      severity = 'HIGH';
      priorityScore = 75;
    } else if (report.category === 'AIR_POLLUTION') {
      categoryLabel = 'Localized Air Pollution / Open Burning';
      severity = 'HIGH';
      priorityScore = 80;
    } else if (report.category === 'WATER_CONTAMINATION') {
      categoryLabel = 'Drinking Water / Sewage Infiltration';
      severity = 'CRITICAL';
      priorityScore = 90;
    }

    const newIssue: EnvironmentalIssue = {
      id: issueId,
      title: `${categoryLabel} reported at ${report.address || area.name}`,
      category: report.category,
      categoryLabel,
      areaId: area.id,
      areaName: area.name,
      locationDetails: report.address || `${area.name} Residential Cluster`,
      coordinates: report.coordinates || area.coordinates,
      severity,
      status: 'PENDING',
      detectedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now',
      triggerSource: 'CITIZEN_REPORT',
      triggerDetails: `NLP Classified from citizen complaint: "${report.description.substring(0, 75)}..."`,
      description: report.description,
      sensorReadingsBefore: [
        { label: 'Ambient Impact Score', value: priorityScore, unit: 'pts' }
      ],
      priorityScore,
      priorityFactors: [
        { factor: 'Citizen Report Corroborated with Geo-grid', weight: '+30 pts', score: 30 },
        { factor: 'NLP Intent Severity Classification', weight: '+25 pts', score: 25 },
        { factor: 'Proximity to Sensitive Receptors', weight: '+15 pts', score: 15 },
      ],
      deadlineTimestamp: 'Within 4 hours',
      evidence: report.photoUrl ? [
        {
          id: `ev-${Date.now()}`,
          type: 'BEFORE',
          imageUrl: report.photoUrl,
          caption: 'Citizen uploaded report photo.',
          uploadedAt: new Date().toLocaleTimeString(),
          uploadedBy: report.citizenName || 'Anonymous Citizen Sentinel',
        }
      ] : [],
      reopenCount: 0,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          action: 'Citizen Report Submitted & NLP Classified',
          actor: 'Citizen Intake Portal',
          details: `Report parsed. AI Classified as: ${categoryLabel}. Priority: ${severity}.`,
          badgeType: 'info',
        }
      ]
    };

    setIssues(prev => [newIssue, ...prev]);

    // Also add to Alerts
    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      title: `New Citizen Report: ${categoryLabel}`,
      type: 'ENVIRONMENTAL_ANOMALY',
      severity,
      timestamp: new Date().toLocaleTimeString(),
      areaName: area.name,
      message: `Citizen reported: "${report.description.substring(0, 80)}". Created ${issueId}.`,
      relatedIssueId: issueId,
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev]);

    addToast({
      type: 'success',
      title: 'Report Submitted',
      message: `Report assigned tracking ID ${issueId}. AI triage created an actionable issue.`,
    });

    return issueId;
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    addToast({
      type: 'info',
      title: 'Alert Acknowledged',
      message: 'Alert marked as acknowledged in central event stream.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setUserRole,
        activeTab,
        setActiveTab,
        isAuthenticated,
        login,
        logout,
        areas,
        devices,
        addDevice,
        deleteDevice,
        clearAllDevices,
        resetDevices,
        toggleDeviceActuator,
        simulateDeviceAnomaly,
        localizedProblems,
        resolveLocalizedProblem,
        assignTeamToLocalizedProblem,
        addLocalizedProblem,
        issues,
        teams,
        healthRisks,
        hotspots,
        alerts,
        selectedDeviceId,
        setSelectedDeviceId,
        selectedAreaId,
        setSelectedAreaId,
        selectedIssueId,
        setSelectedIssueId,
        isSimulating,
        simulationSpeed,
        toggleSimulation,
        setSimulationSpeed,
        triggerScenario,
        assignTeamToIssue,
        updateIssueStatus,
        submitFieldEvidence,
        approveResolution,
        requestReworkOrReopen,
        submitCitizenReport,
        acknowledgeAlert,
        toasts,
        addToast,
        removeToast,
        authModalOpen,
        setAuthModalOpen,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
