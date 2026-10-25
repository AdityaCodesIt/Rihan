import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  PhoneCall,
  User,
  ArrowRight
} from 'lucide-react';
import { Complaint } from '../../types';
import { useStore } from '../../store/useStore';
import { getDepartmentById } from '../../data/departments';
import { getWardById } from '../../data/wards';
import { DepartmentChip } from '../common/DepartmentChip';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { useToast } from '../common/Toast';

interface EscalationsTabProps {
  onSelectComplaint: (c: Complaint) => void;
}

export const EscalationsTab: React.FC<EscalationsTabProps> = ({ onSelectComplaint }) => {
  const { showToast } = useToast();
  const complaints = useStore((state) => state.complaints);
  const escalateComplaint = useStore((state) => state.escalateComplaint);
  const nudgeOfficer = useStore((state) => state.nudgeOfficer);

  // SLA breached tickets (either marked escalated or past deadline and not resolved)
  const escalatedList = complaints.filter((c) => {
    if (c.status === 'fixed' || c.status === 'verified') return false;
    const isPastDeadline = new Date(c.slaDeadline).getTime() < Date.now();
    return c.isEscalated || isPastDeadline;
  });

  const getOverdueText = (deadlineIso: string) => {
    const diffMs = Date.now() - new Date(deadlineIso).getTime();
    if (diffMs <= 0) return 'At SLA boundary';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `Overdue by ${hours}h ${mins}m`;
  };

  const escalationHierarchy = [
    { level: 'officer', label: 'Ward Junior Officer' },
    { level: 'assistant_engineer', label: 'Assistant Engineer (AE)' },
    { level: 'executive_engineer', label: 'Executive Engineer (EE)' },
    { level: 'commissioner', label: 'Additional Commissioner' }
  ];

  const handleNudge = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    nudgeOfficer(id);
    showToast(`Urgent nudge ping dispatched to field officer for ${id}.`, 'info');
  };

  const handleEscalate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    escalateComplaint(id);
    showToast(`Ticket ${id} escalated to next administrative tier.`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Escalation Warning Header */}
      <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200 text-xs shadow-xl">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
          <span>
            <strong>Statutory SLA Breach Protocol Active:</strong> Complaints exceeding civic service guarantee windows are auto-escalated with SMS notices to supervisory leadership.
          </span>
        </div>
        <span className="font-mono text-rose-300 font-bold px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 shrink-0">
          {escalatedList.length} Breached Cases
        </span>
      </div>

      {/* Escalations Grid */}
      {escalatedList.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Zero SLA Breaches</h3>
          <p className="text-xs text-slate-400 mt-1">
            All active municipal grievances are currently progressing within guaranteed SLA timeframes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {escalatedList.map((comp) => {
              const ward = getWardById(comp.wardId);
              const dept = getDepartmentById(comp.departmentId);
              const overdue = getOverdueText(comp.slaDeadline);

              const currentLevel = comp.escalationLevel || 'executive_engineer';

              return (
                <motion.div
                  key={comp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => onSelectComplaint(comp)}
                  className="p-5 rounded-3xl bg-[#120a13] border border-rose-500/30 hover:border-rose-500/60 transition cursor-pointer shadow-2xl flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-white group-hover:text-rose-400 transition">
                        {comp.id}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{overdue}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {comp.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {comp.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <DepartmentChip departmentId={comp.departmentId} size="sm" />
                      <UrgencyBadge urgency={comp.urgency} />
                      <span className="text-[11px] font-mono text-slate-400">
                        {ward.name}
                      </span>
                    </div>

                    {/* Escalation Level Progression Ribbon */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                        Current Administrative Tier
                      </span>
                      <div className="flex items-center gap-1.5">
                        {escalationHierarchy.map((h, idx) => {
                          const isPassed =
                            escalationHierarchy.findIndex((x) => x.level === currentLevel) >= idx;
                          return (
                            <React.Fragment key={h.level}>
                              <div
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold truncate ${
                                  h.level === currentLevel
                                    ? 'bg-rose-500 text-white font-bold'
                                    : isPassed
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-white/5 text-slate-500'
                                }`}
                                title={h.label}
                              >
                                {h.level === 'officer'
                                  ? 'Officer'
                                  : h.level === 'assistant_engineer'
                                  ? 'AE'
                                  : h.level === 'executive_engineer'
                                  ? 'EE'
                                  : 'Comm.'}
                              </div>
                              {idx < escalationHierarchy.length - 1 && (
                                <span className="text-slate-600 text-xs">→</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-rose-300 font-mono mt-1">
                        Active Escalation Lead: {comp.escalatedTo || dept.headOfficer}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] text-slate-400">
                      Officer: <strong className="text-white">{comp.assignedOfficer.name}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleNudge(e, comp.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition active:scale-95"
                      >
                        <BellRing className="w-3.5 h-3.5 text-amber-400" />
                        <span>Nudge Officer</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleEscalate(e, comp.id)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition shadow-lg shadow-rose-500/20 active:scale-95"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Escalate Higher</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
