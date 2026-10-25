import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  Play,
  Camera,
  RefreshCw,
  Users,
  AlertTriangle,
  PhoneCall,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Complaint } from '../../types';
import { useStore } from '../../store/useStore';
import { DEPARTMENTS, getDepartmentById } from '../../data/departments';
import { getWardById } from '../../data/wards';
import { DepartmentChip } from '../common/DepartmentChip';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { SLARing } from '../common/SLARing';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

interface OfficerDrawerProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const OfficerDrawer: React.FC<OfficerDrawerProps> = ({ complaint, onClose }) => {
  const { showToast } = useToast();
  const startWork = useStore((state) => state.startWork);
  const uploadProofPhoto = useStore((state) => state.uploadProofPhoto);
  const reassignComplaint = useStore((state) => state.reassignComplaint);
  const markResolvedByOfficer = useStore((state) => state.markResolvedByOfficer);

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState('drainage');
  const [reassignReason, setReassignReason] = useState('');
  const [proofPhotoPreview, setProofPhotoPreview] = useState<string | null>(null);

  if (!complaint) return null;

  const ward = getWardById(complaint.wardId);
  const department = getDepartmentById(complaint.departmentId);

  const handleStartWork = () => {
    startWork(complaint.id);
    showToast(`Work started on ${complaint.id}. Field team dispatched.`, 'info');
  };

  const handleProofPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setProofPhotoPreview(url);
        uploadProofPhoto(complaint.id, url);
        showToast('Certified proof photo attached.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateProof = () => {
    const simulatedPhoto = `https://picsum.photos/seed/civic_proof_${Date.now()}/600/400`;
    setProofPhotoPreview(simulatedPhoto);
    uploadProofPhoto(complaint.id, simulatedPhoto);
    showToast('Certified site proof photo generated & saved.', 'success');
  };

  const handleMarkResolved = () => {
    markResolvedByOfficer(complaint.id, proofPhotoPreview || undefined);
    showToast(`Ticket ${complaint.id} marked as Fixed. Awaiting citizen verification.`, 'success');
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignReason.trim()) {
      showToast('Please specify a reassignment reason', 'warning');
      return;
    }
    reassignComplaint(complaint.id, targetDeptId, reassignReason.trim());
    setReassignModalOpen(false);
    setReassignReason('');
    showToast(`Grievance reassigned to ${getDepartmentById(targetDeptId).name.en}.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-screen max-w-xl bg-[#0B1020] border-l border-white/15 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#070B16]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-white tracking-tight">
                  {complaint.id}
                </span>
                <UrgencyBadge urgency={complaint.urgency} />
              </div>
              <div className="flex items-center gap-2">
                <DepartmentChip departmentId={complaint.departmentId} size="sm" />
                <span className="text-xs text-slate-400 font-mono">
                  {ward.code}: {ward.name}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* SLA Ring and Status Summary */}
            <div className="p-4 rounded-2xl glass-panel flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Current Status
                </span>
                <p className="text-sm font-bold text-white capitalize mt-0.5">
                  {complaint.status.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Assigned Officer: <span className="text-slate-200">{complaint.assignedOfficer.name}</span>
                </p>
              </div>

              <div className="shrink-0">
                <SLARing
                  deadlineIso={complaint.slaDeadline}
                  createdAtIso={complaint.createdAt}
                  size={84}
                  strokeWidth={7}
                />
              </div>
            </div>

            {/* Grievance Text */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Citizen Grievance Description
              </span>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {complaint.description}
              </div>
            </div>

            {/* Photos Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Photo Evidence
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {complaint.afterPhotoUrl || proofPhotoPreview ? '2 photos' : '1 photo'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Reported Photo */}
                <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                  <img
                    src={complaint.photoUrl}
                    alt="Reported"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://picsum.photos/seed/civic_drawer_def/600/400';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-300 font-mono">
                    Before
                  </span>
                </div>

                {/* Proof / After Photo */}
                <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                  {complaint.afterPhotoUrl || proofPhotoPreview ? (
                    <>
                      <img
                        src={proofPhotoPreview || complaint.afterPhotoUrl}
                        alt="Proof"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono font-bold">
                        Proof (Resolved)
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center gap-2">
                      <Camera className="w-6 h-6 text-slate-500" />
                      <span className="text-[11px] text-slate-400">
                        No completion proof attached yet
                      </span>
                      <button
                        type="button"
                        onClick={handleSimulateProof}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] text-[#2DE2C4] font-semibold"
                      >
                        + Generate Proof
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Ward Coordinates */}
            <div className="p-4 rounded-2xl glass-panel space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 uppercase">Location & Ward</span>
                <span className="font-mono text-[#2DE2C4] font-semibold">
                  {complaint.coordinates[0].toFixed(4)}, {complaint.coordinates[1].toFixed(4)}
                </span>
              </div>
              <p className="text-xs text-white font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2DE2C4] shrink-0" />
                <span>{complaint.locationName}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Ward Office: {ward.officeAddress} (Councillor: {ward.councillor})
              </p>
            </div>

            {/* Merged Duplicates & Endorsement */}
            <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">
                  Citizen Endorsements / Duplicates:
                </span>
              </div>
              <span className="font-mono font-bold text-amber-400 bg-amber-400/15 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                {complaint.affectedCount} affected
              </span>
            </div>

            {/* Official Audit Trail Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                Official Municipal Audit Trail
              </span>
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {complaint.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 text-xs">
                    <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-[#0B1020] border-2 border-[#2DE2C4] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#2DE2C4]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{step.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{step.description}</p>
                      {step.actor && (
                        <span className="text-[10px] font-mono text-slate-400">By: {step.actor}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-white/10 bg-[#070B16] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Start work */}
              {complaint.status !== 'in_progress' && complaint.status !== 'fixed' && complaint.status !== 'verified' && (
                <button
                  type="button"
                  onClick={handleStartWork}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Work</span>
                </button>
              )}

              {/* Upload proof photo */}
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-semibold cursor-pointer transition">
                <Camera className="w-3.5 h-3.5 text-[#2DE2C4]" />
                <span>Upload Proof</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofPhotoSelect}
                  className="hidden"
                />
              </label>

              {/* Reassign */}
              <button
                type="button"
                onClick={() => setReassignModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reassign</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* View citizen tracker link */}
              <Link
                to={`/track/${complaint.id}`}
                target="_blank"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="Open in Citizen Tracker"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>

              {/* Mark resolved */}
              {complaint.status !== 'fixed' && complaint.status !== 'verified' && (
                <button
                  type="button"
                  onClick={handleMarkResolved}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reassign Department Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0B1020] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Reassign Department</span>
              </h3>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Target Engineering Department
                </label>
                <select
                  value={targetDeptId}
                  onChange={(e) => setTargetDeptId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {DEPARTMENTS.filter((d) => d.id !== complaint.departmentId).map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#0F172A] text-white">
                      {d.name.en} ({d.headOfficer})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Mandatory Reassignment Reason
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g., Underground pipeline rupture causing sinkhole; requires Hydraulic division excavation team."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
