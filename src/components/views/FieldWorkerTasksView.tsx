import React, { useState } from 'react';
import { useApp } from '../../services/appState';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Camera, 
  Clock, 
  Upload, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  FileText,
  WifiOff,
  Radio
} from 'lucide-react';

export const FieldWorkerTasksView: React.FC = () => {
  const { issues, currentUser, updateIssueStatus, submitFieldEvidence, addToast } = useApp();

  // Find issues assigned to Field Worker or Field Team 03
  const assignedIssues = issues.filter(i => 
    i.assignedTeamName?.includes('Team 03') || 
    i.assignedTeamName?.includes('Vikram') || 
    i.id === 'ENV-104' ||
    i.id === 'ENV-105'
  );

  const [activeTask, setActiveTask] = useState(assignedIssues[0] || issues[0]);
  const [inGeofence, setInGeofence] = useState(true);
  const [workerNotes, setWorkerNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleProgressWorkflow = (nextStatus: any) => {
    updateIssueStatus(activeTask.id, nextStatus, `Field worker advanced workflow to ${nextStatus}`);
    setActiveTask(prev => ({ ...prev, status: nextStatus }));
  };

  const handleSimulatePhotoUpload = (type: 'BEFORE' | 'AFTER') => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const mockImg = type === 'AFTER'
        ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80';

      submitFieldEvidence(activeTask.id, {
        type,
        imageUrl: mockImg,
        caption: `${type} remediation: Inspection photo taken on site with geo-tag verified.`,
        uploadedBy: currentUser.name,
        lat: activeTask.coordinates[0],
        lng: activeTask.coordinates[1],
      });

      addToast({
        type: 'success',
        title: `${type} Evidence Recorded`,
        message: 'High-res image and GPS coordinates appended to incident chain-of-custody.',
      });
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Mobile-Friendly App Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-0.5">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>FIELD WORKER COMPANION HUD</span>
          </div>
          <h1 className="text-xl font-bold text-white font-mono">My Assigned Field Incidents</h1>
          <p className="text-xs text-slate-400">Worker: {currentUser.name} ({currentUser.role})</p>
        </div>

        {/* Offline sync badge */}
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>Online / Synced</span>
        </div>
      </div>

      {/* 1. GEOFENCE ALERT BANNER (Prompt Requirement 20) */}
      {inGeofence ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wide">
                Geofence Verified • GPS Lock Active
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                You are within 45 meters of incident <strong>{activeTask.id}</strong> ({activeTask.locationDetails}).
              </p>
            </div>
          </div>
          <span className="hidden sm:inline text-xs font-mono font-bold text-emerald-400">±3m Accuracy</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-3">
            <Navigation className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-mono">En route: 1.8 km to target coordinates.</span>
          </div>
          <button onClick={() => setInGeofence(true)} className="text-xs underline font-mono">
            Simulate Arrival
          </button>
        </div>
      )}

      {/* 2. TASK SELECTOR TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {assignedIssues.map((task) => (
          <button
            key={task.id}
            onClick={() => setActiveTask(task)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all shrink-0 ${
              activeTask.id === task.id
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{task.id}</span>
            <RiskBadge level={task.severity} size="sm" />
          </button>
        ))}
      </div>

      {/* 3. ACTIVE TASK WORKFLOW HUD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md space-y-6">
        {/* Incident Summary */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400">TASK #{activeTask.id}</span>
            <StatusBadge status={activeTask.status} size="md" />
          </div>
          <h2 className="text-base font-bold text-white">{activeTask.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{activeTask.triggerDetails}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1 rounded bg-slate-950 px-2.5 py-1 border border-slate-800">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              {activeTask.locationDetails}
            </span>
            <span className="flex items-center gap-1 rounded bg-slate-950 px-2.5 py-1 border border-slate-800">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              Deadline: 45 min
            </span>
          </div>
        </div>

        {/* WORKFLOW STEP CHECKLIST: Accept -> Start -> Upload Evidence -> Complete (Prompt Requirement 20) */}
        <div>
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide block mb-3">
            Intervention Execution Sequence:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
            {/* Step 1: Accept */}
            <button
              onClick={() => handleProgressWorkflow('ACCEPTED')}
              disabled={activeTask.status !== 'ASSIGNED' && activeTask.status !== 'PENDING'}
              className={`p-3 rounded-xl border text-center transition-all ${
                activeTask.status === 'ACCEPTED' || activeTask.status === 'IN_PROGRESS' || activeTask.status === 'RESOLUTION_SUBMITTED' || activeTask.status === 'RESOLVED'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : activeTask.status === 'ASSIGNED'
                  ? 'border-cyan-500/60 bg-cyan-600 text-white font-bold animate-pulse'
                  : 'border-slate-800 bg-slate-950 text-slate-500 opacity-60'
              }`}
            >
              <div className="font-bold text-xs mb-0.5">1. Accept Task</div>
              <span className="text-[10px]">Acknowledge dispatch</span>
            </button>

            {/* Step 2: Start */}
            <button
              onClick={() => handleProgressWorkflow('IN_PROGRESS')}
              disabled={activeTask.status !== 'ACCEPTED'}
              className={`p-3 rounded-xl border text-center transition-all ${
                activeTask.status === 'IN_PROGRESS' || activeTask.status === 'RESOLUTION_SUBMITTED' || activeTask.status === 'RESOLVED'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : activeTask.status === 'ACCEPTED'
                  ? 'border-cyan-500/60 bg-cyan-600 text-white font-bold animate-pulse'
                  : 'border-slate-800 bg-slate-950 text-slate-500 opacity-60'
              }`}
            >
              <div className="font-bold text-xs mb-0.5">2. Start Work</div>
              <span className="text-[10px]">Begin containment</span>
            </button>

            {/* Step 3: Evidence Upload */}
            <div
              className={`p-3 rounded-xl border text-center ${
                activeTask.evidence.length > 0
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : activeTask.status === 'IN_PROGRESS'
                  ? 'border-cyan-500/40 bg-slate-950 text-cyan-300'
                  : 'border-slate-800 bg-slate-950 text-slate-500 opacity-60'
              }`}
            >
              <div className="font-bold text-xs mb-0.5">3. Upload Photos</div>
              <span className="text-[10px]">{activeTask.evidence.length} photos locked</span>
            </div>

            {/* Step 4: Submit for Verification */}
            <button
              onClick={() => handleProgressWorkflow('RESOLUTION_SUBMITTED')}
              disabled={activeTask.status !== 'IN_PROGRESS' || activeTask.evidence.length === 0}
              className={`p-3 rounded-xl border text-center transition-all ${
                activeTask.status === 'RESOLUTION_SUBMITTED' || activeTask.status === 'RESOLVED'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : activeTask.status === 'IN_PROGRESS' && activeTask.evidence.length > 0
                  ? 'border-purple-500/60 bg-purple-600 text-white font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-500 opacity-60'
              }`}
            >
              <div className="font-bold text-xs mb-0.5">4. Complete</div>
              <span className="text-[10px]">Submit for verification</span>
            </button>
          </div>
        </div>

        {/* Evidence Photo Upload Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide block mb-3">
            Photographic Verification Evidence:
          </span>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSimulatePhotoUpload('BEFORE')}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
            >
              <Camera className="h-4 w-4 text-cyan-400" />
              <span>Capture "Before" Photo</span>
            </button>

            <button
              onClick={() => handleSimulatePhotoUpload('AFTER')}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/40 px-3 py-2 text-xs font-bold text-emerald-300 transition-colors"
            >
              <Upload className="h-4 w-4 text-emerald-400" />
              <span>Capture "After" Resolution Photo</span>
            </button>
          </div>

          {/* Photo Gallery */}
          {activeTask.evidence.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {activeTask.evidence.map((ev) => (
                <div key={ev.id} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
                  <img src={ev.imageUrl} alt={ev.caption} className="h-28 w-full object-cover" />
                  <div className="p-2 text-xs">
                    <span className="font-mono text-[9px] font-bold text-cyan-400 uppercase">{ev.type} EVIDENCE</span>
                    <p className="text-[10px] text-slate-300 line-clamp-1">{ev.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worker Notes Field */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">
            Remediation Protocol Notes:
          </label>
          <textarea
            rows={3}
            placeholder="Document chemical neutralization, water suction, misting cannon deployment, or containment actions..."
            value={workerNotes}
            onChange={(e) => setWorkerNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-750 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};
