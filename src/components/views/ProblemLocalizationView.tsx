import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { LocalizedProblem, LocalizationProblemType, IssueSeverity } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Crosshair, 
  MapPin, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Search, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  BrainCircuit, 
  Droplet, 
  Flame, 
  Wind, 
  Zap, 
  CheckCheck, 
  RotateCcw,
  X,
  Layers,
  Send
} from 'lucide-react';

export const ProblemLocalizationView: React.FC = () => {
  const { 
    localizedProblems, 
    resolveLocalizedProblem, 
    assignTeamToLocalizedProblem, 
    addLocalizedProblem,
    setSelectedDeviceId,
    setActiveTab,
    areas,
    addToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedProblem, setSelectedProblem] = useState<LocalizedProblem | null>(localizedProblems[0] || null);
  const [isScanRunning, setIsScanRunning] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding New Localized Issue
  const [formType, setFormType] = useState<LocalizationProblemType>('DRAINAGE_OVERFLOW');
  const [formTitle, setFormTitle] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formTargetType, setFormTargetType] = useState('Specific drain/road');
  const [formTeam, setFormTeam] = useState('Drainage team');
  const [formZoneId, setFormZoneId] = useState(areas[0]?.id || 'zone-04');
  const [formLat, setFormLat] = useState('28.5820');
  const [formLng, setFormLng] = useState('77.2470');
  const [formDiseaseVector, setFormDiseaseVector] = useState('Vector-Borne (Aedes/Anopheles Mosquito Breeding)');
  const [formSeverity, setFormSeverity] = useState<IssueSeverity>('HIGH');

  const problemTypeConfig: Record<LocalizationProblemType, { icon: string; name: string; targetType: string; team: string; diseaseVector: string }> = {
    TRAFFIC_LIGHT_FAILURE: {
      icon: '🚦',
      name: 'Traffic light failure',
      targetType: 'Specific junction',
      team: 'Traffic maintenance',
      diseaseVector: 'Vehicular Gridlock & Localized CO Exposure'
    },
    STREETLIGHT_FAILURE: {
      icon: '💡',
      name: 'Streetlight failure',
      targetType: 'Specific street/pole',
      team: 'Electrical team',
      diseaseVector: 'Nocturnal Blindspot & Unmonitored Waste Disposal'
    },
    DRAINAGE_OVERFLOW: {
      icon: '🌊',
      name: 'Drainage overflow',
      targetType: 'Specific drain/road',
      team: 'Drainage team',
      diseaseVector: 'Vector-Borne (Mosquito Dengue/Malaria Breeding)'
    },
    WATER_CONTAMINATION: {
      icon: '💧',
      name: 'Water contamination',
      targetType: 'Specific water point',
      team: 'Water-quality team',
      diseaseVector: 'Enteric Water-Borne Pathogen Surge (Cholera/Diarrhea)'
    },
    WASTE_ACCUMULATION: {
      icon: '🗑️',
      name: 'Waste accumulation',
      targetType: 'Specific area',
      team: 'Sanitation team',
      diseaseVector: 'Rodent & Vector Pathogens (Leptospirosis/Coliform)'
    },
    AIR_QUALITY_ANOMALY: {
      icon: '🌫️',
      name: 'Air-quality anomaly',
      targetType: 'Specific zone',
      team: 'Environmental team',
      diseaseVector: 'Acute Bronchial / Asthma & Respiratory Distress'
    },
    HEAT_ENVIRONMENTAL_ANOMALY: {
      icon: '🔥',
      name: 'Heat/environmental anomaly',
      targetType: 'Specific locality',
      team: 'Field monitoring team',
      diseaseVector: 'Heat Exhaustion & Vulnerable Cardiovascular Strain'
    },
    ROAD_OBSTRUCTION: {
      icon: '🚧',
      name: 'Road obstruction',
      targetType: 'Specific road segment',
      team: 'Road/traffic team',
      diseaseVector: 'Emergency Ambulance Transit Delay & Idling Emissions'
    },
    EXCESSIVE_NOISE: {
      icon: '📢',
      name: 'Excessive noise',
      targetType: 'Specific location',
      team: 'Local enforcement/monitoring team',
      diseaseVector: 'Hospital Patient Sleep Disruption & Hypertensive Stress'
    },
    FLOODING_WATER_RISE: {
      icon: '🌧️',
      name: 'Flooding/water level rise',
      targetType: 'Specific low-lying zone',
      team: 'Emergency response',
      diseaseVector: 'Acute Leptospirosis & Contaminated Sump Inundation'
    },
  };

  const handleTypeSelectInModal = (t: LocalizationProblemType) => {
    setFormType(t);
    const cfg = problemTypeConfig[t];
    setFormTargetType(cfg.targetType);
    setFormTeam(cfg.team);
    setFormDiseaseVector(cfg.diseaseVector);
  };

  const handleRunScan = () => {
    setIsScanRunning(true);
    setTimeout(() => {
      setIsScanRunning(false);
      addToast({
        type: 'success',
        title: 'City Localization Scan Completed',
        message: 'Spatial AI localized 10 active problems with pinpoint junction, drain, pole, and water point coordinates.',
      });
    }, 600);
  };

  const filteredProblems = localizedProblems.filter(p => {
    const matchesSearch = p.detectedProblem.toLowerCase().includes(search.toLowerCase()) ||
                          p.localizationTarget.toLowerCase().includes(search.toLowerCase()) ||
                          p.assignedTeam.toLowerCase().includes(search.toLowerCase()) ||
                          p.linkedZoneName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTypeFilter !== 'ALL' && p.type !== selectedTypeFilter) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zone = areas.find(a => a.id === formZoneId) || areas[0];
    const cfg = problemTypeConfig[formType];

    addLocalizedProblem({
      type: formType,
      icon: cfg.icon,
      title: formTitle || `${cfg.name} at ${formTarget}`,
      detectedProblem: cfg.name,
      localizationTarget: formTarget || `${cfg.targetType} in ${zone.name}`,
      targetType: formTargetType,
      assignedTeam: formTeam,
      linkedZoneId: zone.id,
      linkedZoneName: zone.name,
      coordinates: [parseFloat(formLat) || zone.coordinates[0], parseFloat(formLng) || zone.coordinates[1]],
      severity: formSeverity,
      status: 'ASSIGNED',
      diseaseRiskCorrelation: {
        diseaseVector: formDiseaseVector || cfg.diseaseVector,
        riskElevationScore: formSeverity === 'CRITICAL' ? 95 : formSeverity === 'HIGH' ? 78 : 50,
        remediationImpact: `Rapid deployment of ${formTeam} mitigates localized exposure.`,
      },
      sensorReadings: [
        { label: 'Spatial Influx Level', value: 'Elevated' },
        { label: 'Localized Target Impact', value: 'High' }
      ]
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 font-sans">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Crosshair className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span>AI SPATIAL LOCALIZATION & DISEASE RISK MATRIX</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Problem Localization & Specialized Team Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Pinpoints detected city problems to specific junctions, poles, drains, and water points, linking sensor predictions directly to disease mitigation and team assignment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunScan}
            disabled={isScanRunning}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/20 transition-all font-mono disabled:opacity-50"
          >
            {isScanRunning ? (
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{isScanRunning ? 'Scanning City Mesh...' : 'Run Localization Scan'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors font-mono"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>Add Localized Problem</span>
          </button>
        </div>
      </div>

      {/* 2. LOCALIZATION CAPABILITIES TABLE / REFERENCE MATRIX */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">10 City Problems Your System Localizes</h3>
              <p className="text-[11px] text-slate-400">Autonomous mapping from detected anomaly to exact physical target & assigned specialized response unit</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-lg px-2.5 py-1">
            {localizedProblems.length} Active Targets
          </span>
        </div>

        {/* 10 Problems Reference Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-sans">
          {Object.entries(problemTypeConfig).map(([key, cfg]) => {
            const activeCount = localizedProblems.filter(p => p.type === key && p.status !== 'RESOLVED').length;
            const isSelected = selectedTypeFilter === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedTypeFilter(isSelected ? 'ALL' : key)}
                className={`flex flex-col justify-between p-3 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/30 shadow-md' 
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{cfg.icon}</span>
                    {activeCount > 0 ? (
                      <span className="rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-bold font-mono px-1.5 py-0.2">
                        {activeCount} active
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold font-mono px-1.5 py-0.2">
                        Normal
                      </span>
                    )}
                  </div>
                  <strong className="text-xs font-bold text-slate-100 block">{cfg.name}</strong>
                  <span className="text-[10px] text-slate-400 block font-mono mt-0.5">🎯 {cfg.targetType}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-400 font-mono font-semibold">
                  👷 {cfg.team}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE SPOTLIGHT: LOCALIZED PROBLEM & DISEASE LINK INSPECTOR */}
      {selectedProblem && (
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl border border-cyan-500/30">
                {selectedProblem.icon}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/40">
                    TARGET: {selectedProblem.targetType.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID #{selectedProblem.id}</span>
                  <RiskBadge level={selectedProblem.severity} size="sm" />
                  <StatusBadge status={selectedProblem.status} size="sm" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono mt-1">
                  {selectedProblem.detectedProblem}: {selectedProblem.localizationTarget}
                </h2>
                <p className="text-xs text-slate-400">
                  Located in <strong className="text-slate-200">{selectedProblem.linkedZoneName}</strong> at coordinates [{selectedProblem.coordinates[0].toFixed(4)}, {selectedProblem.coordinates[1].toFixed(4)}]
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {selectedProblem.status !== 'RESOLVED' ? (
                <>
                  <button
                    onClick={() => resolveLocalizedProblem(selectedProblem.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 transition-colors shadow-md"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark Remediated</span>
                  </button>

                  <button
                    onClick={() => assignTeamToLocalizedProblem(selectedProblem.id, selectedProblem.assignedTeam)}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3.5 py-2 transition-colors shadow-md"
                  >
                    <Users className="h-4 w-4" />
                    <span>Dispatch {selectedProblem.assignedTeam}</span>
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-2 text-emerald-300 font-bold">
                  <CheckCheck className="h-4 w-4" />
                  <span>Resolved & Risk Normalized</span>
                </span>
              )}

              <button
                onClick={() => {
                  if (selectedProblem.linkedDeviceId) {
                    setSelectedDeviceId(selectedProblem.linkedDeviceId);
                  }
                  setActiveTab('live-map');
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 transition-colors"
              >
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>Show on GIS Map</span>
              </button>
            </div>
          </div>

          {/* 3 Columns: Location Pinpoint, Disease Prediction Impact, Assigned Team Dispatch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            {/* 1. Exact Physical Pinpoint */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crosshair className="h-3.5 w-3.5" />
                <span>Exact Physical Localization</span>
              </span>

              <div className="space-y-2 font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Localization Target:</span>
                  <strong className="text-slate-100 text-xs">{selectedProblem.localizationTarget}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">GPS Coordinates:</span>
                  <span className="text-cyan-300 font-bold">{selectedProblem.coordinates[0].toFixed(4)}, {selectedProblem.coordinates[1].toFixed(4)}</span>
                </div>

                {selectedProblem.linkedDeviceId && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Linked Sensor Node:</span>
                    <span className="text-emerald-400 font-bold">#{selectedProblem.linkedDeviceId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Disease Prediction Impact & Health Vector */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>Disease Prediction Impact</span>
              </span>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div>
                  <span className="text-[10px] font-mono text-purple-300 uppercase block">Correlated Disease Vector:</span>
                  <strong className="text-xs text-white block mt-0.5">{selectedProblem.diseaseRiskCorrelation.diseaseVector}</strong>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-purple-500/20 font-mono">
                  <span className="text-[10px] text-slate-400">Health Risk Surge:</span>
                  <span className="text-xs font-bold text-rose-400">
                    +{selectedProblem.diseaseRiskCorrelation.riskElevationScore}% Exposure
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug pt-1">
                  💡 {selectedProblem.diseaseRiskCorrelation.remediationImpact}
                </p>
              </div>
            </div>

            {/* 3. Assigned Municipal Team */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>Assigned Specialized Team</span>
              </span>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Assigned Unit:</span>
                  <strong className="text-xs text-emerald-300">{selectedProblem.assignedTeam}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Dispatch Status:</span>
                  <span className="text-xs font-bold text-slate-200">{selectedProblem.status.replace('_', ' ')}</span>
                </div>

                <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                  <span>Detected At: </span>
                  <span className="text-slate-200">{selectedProblem.detectedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL LOCALIZATION & INCIDENTS TABLE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search detected problems, targets, teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-750 bg-slate-950 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Showing {filteredProblems.length} Localized Items</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Detected Problem</th>
                <th className="py-3.5 px-4">Localization Target & Area</th>
                <th className="py-3.5 px-4">Target Type</th>
                <th className="py-3.5 px-4">Assigned Team</th>
                <th className="py-3.5 px-4">Disease Risk Correlation</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblem?.id === prob.id;

                return (
                  <tr 
                    key={prob.id}
                    onClick={() => setSelectedProblem(prob)}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${isSelected ? 'bg-cyan-950/25 border-l-4 border-l-cyan-400' : ''}`}
                  >
                    {/* Detected Problem */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{prob.icon}</span>
                        <div>
                          <strong className="text-slate-100 font-bold block">{prob.detectedProblem}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">#{prob.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Localization Target */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-200 block text-xs">{prob.localizationTarget}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{prob.linkedZoneName}</span>
                    </td>

                    {/* Target Type */}
                    <td className="py-3.5 px-4 font-mono text-cyan-300 text-[11px]">
                      {prob.targetType}
                    </td>

                    {/* Assigned Team */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-slate-200 font-semibold block max-w-fit">
                        👷 {prob.assignedTeam}
                      </span>
                    </td>

                    {/* Disease Risk */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-purple-300 font-semibold block text-[11px] truncate">
                        {prob.diseaseRiskCorrelation.diseaseVector}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        +{prob.diseaseRiskCorrelation.riskElevationScore}% risk impact
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4">
                      <RiskBadge level={prob.severity} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={prob.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        <button
                          onClick={() => setSelectedProblem(prob)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          Inspect
                        </button>
                        {prob.status !== 'RESOLVED' && (
                          <button
                            onClick={() => resolveLocalizedProblem(prob.id)}
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD LOCALIZED PROBLEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Log Localized City Problem</h3>
                  <p className="text-[11px] text-slate-400">Select problem type, exact target, and assigned specialized unit</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs font-sans">
              {/* Problem Type Selector */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-mono">Detected Problem Type</label>
                <select
                  value={formType}
                  onChange={(e) => handleTypeSelectInModal(e.target.value as LocalizationProblemType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  {Object.entries(problemTypeConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.icon} {cfg.name} (Target: {cfg.targetType} → {cfg.team})
                    </option>
                  ))}
                </select>
              </div>

              {/* Exact Localization Target */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-mono">Exact Localization Target</label>
                <input
                  type="text"
                  required
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  placeholder="e.g. Junction #14, Drain Culvert D-04, Water Point WP-07"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Assigned Team & Zone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">Assigned Team</label>
                  <input
                    type="text"
                    value={formTeam}
                    onChange={(e) => setFormTeam(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-mono">City Zone</label>
                  <select
                    value={formZoneId}
                    onChange={(e) => setFormZoneId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Disease Vector */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-mono">Correlated Disease / Health Vector</label>
                <input
                  type="text"
                  value={formDiseaseVector}
                  onChange={(e) => setFormDiseaseVector(e.target.value)}
                  placeholder="e.g. Vector-Borne Dengue/Malaria, Cholera Influx"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-mono">Severity Priority</label>
                <select
                  value={formSeverity}
                  onChange={(e) => setFormSeverity(e.target.value as IssueSeverity)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="CRITICAL">Critical (Immediate Dispatch & Alert)</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/25 transition-all font-mono"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log & Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
