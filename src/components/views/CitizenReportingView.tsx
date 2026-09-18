import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { EnvironmentalCategory } from '../../types';
import { 
  Camera, 
  MapPin, 
  Send, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Eye, 
  FileText,
  Upload
} from 'lucide-react';

export const CitizenReportingView: React.FC = () => {
  const { areas, submitCitizenReport, issues, addToast } = useApp();

  const [category, setCategory] = useState<EnvironmentalCategory>('STAGNANT_WATER');
  const [areaId, setAreaId] = useState<string>('zone-07');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  // AI Classification Preview state
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: string;
    priority: string;
    confidence: number;
  } | null>(null);

  // Quick auto-classify on description typing
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    const lower = text.toLowerCase();
    if (lower.includes('water') || lower.includes('drain') || lower.includes('puddle') || lower.includes('mosquito')) {
      setAiSuggestion({
        category: 'Stagnant Water / Vector Breeding Threat',
        priority: 'High Priority (Near Residential)',
        confidence: 94,
      });
      setCategory('STAGNANT_WATER');
    } else if (lower.includes('smoke') || lower.includes('burn') || lower.includes('fire')) {
      setAiSuggestion({
        category: 'Illegal Open Biomass/Waste Burning',
        priority: 'Critical Priority (Active Particulate Spike)',
        confidence: 91,
      });
      setCategory('OPEN_BURNING');
    } else if (lower.includes('smell') || lower.includes('chemical') || lower.includes('stench')) {
      setAiSuggestion({
        category: 'Hazardous Chemical / Sewage Effluent Odor',
        priority: 'High Priority',
        confidence: 88,
      });
      setCategory('CHEMICAL_ODOR');
    } else {
      setAiSuggestion(null);
    }
  };

  const handleSimulatePhotoSelect = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setPhotoPreview(picked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !locationDetails) {
      addToast({
        type: 'warning',
        title: 'Missing Details',
        message: 'Please provide incident location and a brief description.',
      });
      return;
    }

    const targetArea = areas.find(a => a.id === areaId);
    const coords: [number, number] = targetArea ? targetArea.coordinates : [28.6139, 77.2090];

    const newIssueId = submitCitizenReport({
      category,
      areaId,
      address: locationDetails,
      description,
      photoUrl: photoPreview || undefined,
      citizenName: isAnonymous ? 'Anonymous Citizen' : 'Public Reporter',
      contactPhone: isAnonymous ? undefined : contactInfo,
      coordinates: coords,
    });

    setTrackingId(newIssueId);
    addToast({
      type: 'success',
      title: 'Citizen Report Filed & Triaged',
      message: `Report assigned tracking ID #${newIssueId}. Municipal field triage initiated.`,
    });
  };

  // Tracking query state
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const trackedIssue = issues.find(i => i.id.toUpperCase() === searchTrackingId.trim().toUpperCase());

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>COMMUNITY PARTICIPATORY SENSING & MUNICIPAL ACTION</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
          Citizen Environmental Report & Public Incident Intake
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Report localized water stagnation, illegal waste burning, industrial emissions, or chemical spills directly to the Command Center
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
          {trackingId ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-bold text-white font-mono">Incident Report Submitted Successfully</h2>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 max-w-sm mx-auto">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Your Tracking Token ID:</span>
                <span className="text-2xl font-mono font-bold text-cyan-400">{trackingId}</span>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Our automated priority engine has classified your submission and queued field team dispatch. You can track progress below with this token.
              </p>
              <button
                onClick={() => {
                  setTrackingId(null);
                  setDescription('');
                  setLocationDetails('');
                  setPhotoPreview(null);
                }}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                1. Incident Classification & Details
              </h3>

              {/* Category Select (Prompt: Stagnant water, Waste, Smoke, Chemical smell, Industrial dust, Water contamination, Noise, Drain blockage) */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Issue Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-750 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="STAGNANT_WATER">Stagnant Water / Mosquito Breeding Vector</option>
                  <option value="OPEN_BURNING">Smoke / Open Biomass or Plastic Burning</option>
                  <option value="CHEMICAL_ODOR">Chemical Effluent or Sewage Odor</option>
                  <option value="INDUSTRIAL_DUST">Industrial Dust / Construction Excavation</option>
                  <option value="WATER_CONTAMINATION">Turbid or Discolored Water Influx</option>
                  <option value="WASTE_ACCUMULATION">Solid Waste Dumping</option>
                  <option value="NOISE_POLLUTION">Excessive Acoustic / Industrial Noise</option>
                  <option value="DRAIN_BLOCKAGE">Stormwater Drain Blockage / Inundation</option>
                </select>
              </div>

              {/* Area & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Catchment Area:</label>
                  <select
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className="w-full rounded-xl border border-slate-750 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Street / Landmark Address:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Community Center, Road 4B"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    className="w-full rounded-xl border border-slate-750 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Description & Observations:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe smell, color, water depth, smoke intensity, or duration..."
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-750 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* AI Auto-Classification Preview (Prompt Requirement 23) */}
              {aiSuggestion && (
                <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/30 p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Classification Suggestion ({aiSuggestion.confidence}% confidence)</span>
                  </div>
                  <div className="mt-1 text-slate-300">
                    Category: <strong>{aiSuggestion.category}</strong>
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono">
                    Priority Rating: {aiSuggestion.priority}
                  </div>
                </div>
              )}

              {/* Photo Upload Section */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Upload Photographic Evidence:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSimulatePhotoSelect}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-cyan-400" />
                    <span>Attach Photo</span>
                  </button>
                  {photoPreview && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Photo Attached
                    </span>
                  )}
                </div>

                {photoPreview && (
                  <div className="mt-2.5 h-28 w-40 rounded-xl overflow-hidden border border-slate-700">
                    <img src={photoPreview} alt="Upload preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="anon" className="text-xs text-slate-300 cursor-pointer">
                  Submit anonymously (protect reporter identity)
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Contact Phone / Email (Optional for updates):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full rounded-xl border border-slate-750 bg-slate-950 p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition-all font-mono uppercase tracking-wider"
              >
                <Send className="h-4 w-4" />
                <span>Submit Citizen Report</span>
              </button>
            </form>
          )}
        </div>

        {/* Tracking Query Column (Prompt Requirement 23) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide mb-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-400" />
              <span>Track Existing Report</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Enter your incident token (e.g. <strong>ENV-104</strong> or <strong>ENV-106</strong>) to view live remediation progress.
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Token ID (e.g. ENV-104)"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="flex-1 rounded-xl border border-slate-750 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase font-mono"
              />
              <button
                onClick={() => setSearchTrackingId(searchTrackingId || 'ENV-104')}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-white"
              >
                Track
              </button>
            </div>

            {trackedIssue ? (
              <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">#{trackedIssue.id}</span>
                  <span className="rounded bg-cyan-950 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300 font-mono">
                    {trackedIssue.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{trackedIssue.title}</h4>
                <p className="text-[11px] text-slate-400">{trackedIssue.locationDetails}</p>

                <div className="border-t border-slate-800 pt-2 text-[11px] font-mono space-y-1 text-slate-300">
                  <div>Assigned Team: <span className="text-cyan-300">{trackedIssue.assignedTeamName || 'Under Dispatch Triage'}</span></div>
                  <div>Detected: <span className="text-slate-400">{trackedIssue.detectedAt}</span></div>
                </div>
              </div>
            ) : searchTrackingId ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center text-xs text-slate-400">
                No incident found with token #{searchTrackingId}.
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl text-xs space-y-3">
            <h4 className="font-mono font-bold text-slate-300 uppercase text-[11px]">Municipal Response SLA</h4>
            <div className="space-y-2 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Critical Spills / High PM2.5:</span>
                <strong className="text-rose-400 font-mono">&lt; 30 Minutes</strong>
              </div>
              <div className="flex justify-between">
                <span>Stagnant Water / Vector Hazard:</span>
                <strong className="text-amber-400 font-mono">&lt; 2 Hours</strong>
              </div>
              <div className="flex justify-between">
                <span>Municipal Waste Remediation:</span>
                <strong className="text-emerald-400 font-mono">&lt; 12 Hours</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
