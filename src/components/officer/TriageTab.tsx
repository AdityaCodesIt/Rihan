import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { Complaint } from '../../types';
import { useStore } from '../../store/useStore';
import { DEPARTMENTS, getDepartmentById } from '../../data/departments';
import { getWardById } from '../../data/wards';
import { DepartmentChip } from '../common/DepartmentChip';
import { useToast } from '../common/Toast';

export const TriageTab: React.FC = () => {
  const { showToast } = useToast();
  const complaints = useStore((state) => state.complaints);
  const triageAssign = useStore((state) => state.triageAssign);
  const triageReassign = useStore((state) => state.triageReassign);
  const triageMarkSpam = useStore((state) => state.triageMarkSpam);

  // Reassign modal state
  const [reassignTicket, setReassignTicket] = useState<Complaint | null>(null);
  const [targetDeptId, setTargetDeptId] = useState(DEPARTMENTS[0].id);
  const [reassignReason, setReassignReason] = useState('');

  // Triage complaints list
  const triageList = complaints.filter(
    (c) => c.isLowConfidence && c.status !== 'fixed' && c.status !== 'verified'
  );

  const handleQuickAssign = (id: string, deptId: string) => {
    triageAssign(id, deptId);
    showToast('Thanks! AI will learn from this correction', 'success');
  };

  const handleMarkSpam = (id: string) => {
    triageMarkSpam(id);
    showToast('Marked as non-civic / spam and purged.', 'info');
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignTicket || !reassignReason.trim()) return;
    triageReassign(reassignTicket.id, targetDeptId, reassignReason.trim());
    setReassignTicket(null);
    setReassignReason('');
    showToast('Thanks! AI will learn from this correction', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Triage Banner */}
      <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Human-in-the-Loop Triage Desk:</strong> Grievances with AI confidence &lt; 60% or multi-lingual ambiguities flagged for 15-min supervisor sign-off.
          </span>
        </div>
        <span className="font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/30 shrink-0">
          {triageList.length} Pending
        </span>
      </div>

      {/* Cards Stream */}
      {triageList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-3xl glass-panel text-center max-w-lg mx-auto flex flex-col items-center justify-center gap-4 my-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white">
            Triage Inbox Zero
          </h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            All ambiguous grievances have been resolved and dispatched to field teams. AI weights are updated.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {triageList.map((comp) => {
              const ward = getWardById(comp.wardId);
              const topSuggestions = comp.aiSuggestions || [
                { departmentId: comp.departmentId, confidence: 54 },
                { departmentId: 'solid-waste', confidence: 26 },
                { departmentId: 'drainage', confidence: 20 }
              ];

              return (
                <motion.div
                  key={comp.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 40 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-400/30 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        {comp.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                        Confidence &lt; 60%
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 p-3 rounded-xl bg-white/5 border border-white/5 leading-relaxed font-mono">
                      &quot;{comp.description}&quot;
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{ward.code}: {ward.name}</span>
                      <span className="font-mono">{comp.locationName}</span>
                    </div>

                    {/* AI's Top 3 Suggested Departments */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                        AI Department Predictions
                      </span>
                      <div className="space-y-1.5">
                        {topSuggestions.map((sug, idx) => {
                          const dept = getDepartmentById(sug.departmentId);
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl bg-white/5 border border-white/5"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: dept.color }}
                                />
                                <span className="text-slate-200 font-medium truncate">
                                  {dept.name.en}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-[11px] text-slate-400">
                                  {sug.confidence}%
                                </span>
                                {idx === 0 && (
                                  <button
                                    onClick={() => handleQuickAssign(comp.id, sug.departmentId)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[10px] border border-emerald-500/40 transition active:scale-95"
                                  >
                                    Accept
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleMarkSpam(comp.id)}
                      className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Mark Spam</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReassignTicket(comp);
                          setTargetDeptId(DEPARTMENTS[0].id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reassign</span>
                      </button>

                      <button
                        onClick={() => handleQuickAssign(comp.id, topSuggestions[0].departmentId)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition shadow-md shadow-amber-400/20 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Top ({topSuggestions[0].confidence}%)</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Manual Reassign Reason Modal */}
      {reassignTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0B1020] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Manual Triage Reassignment</span>
              </h3>
              <button
                onClick={() => setReassignTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Select Correct Department
                </label>
                <select
                  value={targetDeptId}
                  onChange={(e) => setTargetDeptId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#0F172A]">
                      {d.name.en} ({d.headOfficer})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Human Correction Notes (AI Training)
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="Explain why this grievance belongs to the selected department..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignTicket(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
                >
                  Apply & Train AI
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
