export type UserRole = 'ADMINISTRATOR' | 'SUPERVISOR' | 'FIELD_WORKER' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  badge?: string;
  department?: string;
  assignedZone?: string;
}

export type RiskLevel = 'NORMAL' | 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface MonitoringArea {
  id: string;
  name: string;
  code: string;
  description: string;
  coordinates: [number, number]; // [lat, lng] center
  polygon?: [number, number][]; // boundary coordinates
  population: number;
  populationDensity: number; // people per sq km
  sensitiveSites: {
    schools: number;
    hospitals: number;
    elderlyCare: number;
  };
  currentRisk: RiskLevel;
  activeIssuesCount: number;
  onlineDevices: number;
  totalDevices: number;
  averageAqi: number;
  dominantHazard: string;
}

export type SensorType = 
  | 'PM2_5_PM10_OPTICAL'
  | 'GAS_MQ_CO_NO2_SO2'
  | 'WATER_QUALITY_PH_TURB_TDS'
  | 'ULTRASONIC_WATER_LEVEL'
  | 'MET_TEMP_HUMIDITY'
  | 'SOIL_MOISTURE'
  | 'ACOUSTIC_NOISE_DB'
  | 'MULTI_PARAM_STATION';

export interface DeviceTelemetry {
  temperature: number; // °C
  humidity: number; // %
  rainfall?: number; // mm/hr
  pm25?: number; // µg/m³
  pm10?: number; // µg/m³
  aqi?: number;
  co?: number; // ppm
  no2?: number; // ppb
  so2?: number; // ppb
  waterPh?: number;
  waterTurbidity?: number; // NTU
  waterTds?: number; // ppm
  waterLevelMeters?: number; // m
  soilMoisture?: number; // %
  noiseDb?: number; // dB
  windSpeedKmh?: number;
  windDirection?: string;
}

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';

export interface DeviceActuators {
  mistCannon?: boolean;
  sluicePump?: boolean;
  smogGun?: boolean;
  soundBarrier?: boolean;
  warningBeacon?: boolean;
  ventilationFan?: boolean;
}

export interface Device {
  id: string; // e.g. "AQ-014"
  name: string;
  areaId: string;
  areaName: string;
  coordinates: [number, number];
  sensorType: SensorType;
  sensorLabel: string;
  status: DeviceStatus;
  batteryPercentage: number;
  isSolarPowered: boolean;
  signalStrengthDbm: number; // e.g. -68 dBm
  lastUpdate: string; // ISO string or relative time
  uptimeDays: number;
  hardwareVersion: string; // e.g. "ESP32-S3 Rev 2"
  telemetry: DeviceTelemetry;
  riskLevel: RiskLevel;
  activeIssueId?: string;
  assignedTeam?: string;
  maintenanceRecommended: boolean;
  maintenanceReason?: string;
  actuators?: DeviceActuators;
  predictionDetails?: {
    confidence: number;
    hazardType: string;
    triggerAction: string;
    targetTeamRecommendation?: string;
  };
}

export type LocalizationProblemType = 
  | 'TRAFFIC_LIGHT_FAILURE'
  | 'STREETLIGHT_FAILURE'
  | 'DRAINAGE_OVERFLOW'
  | 'WATER_CONTAMINATION'
  | 'WASTE_ACCUMULATION'
  | 'AIR_QUALITY_ANOMALY'
  | 'HEAT_ENVIRONMENTAL_ANOMALY'
  | 'ROAD_OBSTRUCTION'
  | 'EXCESSIVE_NOISE'
  | 'FLOODING_WATER_RISE';

export interface LocalizedProblem {
  id: string;
  type: LocalizationProblemType;
  icon: string;
  title: string;
  detectedProblem: string;
  localizationTarget: string;
  targetType: string;
  assignedTeam: string;
  linkedDeviceId?: string;
  linkedZoneId: string;
  linkedZoneName: string;
  coordinates: [number, number];
  severity: IssueSeverity;
  status: IssueStatus;
  detectedAt: string;
  diseaseRiskCorrelation: {
    diseaseVector: string;
    riskElevationScore: number; // e.g. 78%
    remediationImpact: string;
  };
  sensorReadings: {
    label: string;
    value: string | number;
    unit?: string;
  }[];
}

export type IssueCategory = 
  | 'AIR_POLLUTION'
  | 'WATER_CONTAMINATION'
  | 'WASTE_ACCUMULATION'
  | 'DRAINAGE_OVERFLOW'
  | 'NOISE_POLLUTION'
  | 'STAGNANT_WATER'
  | 'SOIL_CONTAMINATION'
  | 'CHEMICAL_LEAK'
  | 'OPEN_BURNING'
  | 'CHEMICAL_ODOR'
  | 'INDUSTRIAL_DUST'
  | 'DRAIN_BLOCKAGE';

export type EnvironmentalCategory = IssueCategory;

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 
  | 'PENDING'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'RESOLUTION_SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'RESOLVED'
  | 'REOPENED'
  | 'ESCALATED';

export interface IssueEvidence {
  id: string;
  type: 'BEFORE' | 'AFTER';
  imageUrl: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
  lat?: number;
  lng?: number;
}

export interface IssueTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  badgeType?: 'info' | 'warning' | 'success' | 'danger';
}

export interface EnvironmentalIssue {
  id: string; // e.g. "ENV-104"
  title: string;
  category: IssueCategory;
  categoryLabel: string;
  areaId: string;
  areaName: string;
  locationDetails: string;
  coordinates: [number, number];
  severity: IssueSeverity;
  status: IssueStatus;
  detectedAt: string;
  updatedAt: string;
  triggerSource: 'SENSOR_THRESHOLD' | 'AI_ANOMALY' | 'CITIZEN_REPORT' | 'MANUAL_INSPECTION';
  triggerDetails: string;
  description: string;
  
  // Readings comparison for closed-loop verification
  sensorReadingsBefore: {
    label: string;
    value: number;
    unit: string;
  }[];
  sensorReadingsAfter?: {
    label: string;
    value: number;
    unit: string;
  }[];

  // Priority scoring details
  priorityScore: number; // 0-100
  priorityFactors: {
    factor: string;
    weight: string;
    score: number;
  }[];

  // Personnel assignment
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  recommendedTeamId?: string;
  assignmentRecommendationReason?: string;
  deadlineTimestamp: string;
  
  // Field evidence
  evidence: IssueEvidence[];
  fieldNotes?: string;
  actionTaken?: string;

  // Verification & Audit
  verifiedBy?: string;
  verificationNotes?: string;
  reopenCount: number;
  escalationReason?: string;
  timeline: IssueTimelineEvent[];
}

export interface ResponseTeam {
  id: string;
  name: string;
  code: string;
  leadName: string;
  phone: string;
  skills: string[];
  status: 'AVAILABLE' | 'ON_CALL' | 'BUSY' | 'OFF_DUTY';
  currentTasksCount: number;
  distanceKm: number;
  etaMinutes: number;
  homeBaseZone: string;
  currentCoordinates: [number, number];
  vehicleType: string;
  equipment: string[];
}

export interface HealthRiskPrediction {
  areaId: string;
  areaName: string;
  overallRisk: RiskLevel;
  modelConfidence: number; // 0-100%
  lastAnalyzed: string;
  contributingFactors: {
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
    description: string;
  }[];
  riskPatterns: {
    respiratory: RiskLevel;
    mosquitoVectorBorne: RiskLevel;
    waterBorne: RiskLevel;
    heatStress: RiskLevel;
  };
  explanation: string;
  recommendedEnvironmentalAction: string;
  primaryMlModelsUsed: string[]; // e.g. ["XGBoost Ensemble v2.4", "LSTM Temporal Sequence", "Isolation Forest Anomaly"]
}

export interface PredictiveHotspot {
  id: string;
  areaId: string;
  areaName: string;
  coordinates: [number, number];
  currentRisk: RiskLevel;
  predictedRisk: RiskLevel;
  riskShift: 'INCREASING' | 'STABLE' | 'ELEVATED_SPIKE';
  confidencePercentage: number;
  timeHorizonHours: number; // e.g. 12 or 24
  primaryDriver: string;
  sensitiveReceptorsCount: number;
  recommendedPreemptiveAction: string;
}

export interface AlertItem {
  id: string;
  title: string;
  type: 'ENVIRONMENTAL_ANOMALY' | 'DISEASE_RISK_SPIKE' | 'DEVICE_FAILURE' | 'ESCALATION_TIMEOUT' | 'RESOLUTION_VERIFIED';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  areaName: string;
  message: string;
  groupedDeviceCount?: number;
  relatedIssueId?: string;
  acknowledged: boolean;
}

export interface CitizenReportInput {
  category: IssueCategory;
  description: string;
  areaId: string;
  address: string;
  photoUrl?: string;
  citizenName?: string;
  contactPhone?: string;
  coordinates: [number, number];
}
