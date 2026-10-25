import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Share2,
  Building,
  ExternalLink,
  GitBranch,
  PhoneCall,
  QrCode
} from 'lucide-react';
import { RoutingClassification, Complaint } from '../../types';
import { getDepartmentById } from '../../data/departments';
import { getWardFromCoordinates } from '../../data/wards';
import { useT } from '../../i18n/useT';
import { DepartmentChip } from '../common/DepartmentChip';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { SLARing } from '../common/SLARing';
import { useNavigate } from 'react-router-dom';

interface AiRoutingSequenceProps {
  classification: RoutingClassification;
  complaint: Complaint;
  onComplete: () => void;
}

export const AiRoutingSequence: React.FC<AiRoutingSequenceProps> = ({
  classification,
  complaint,
  onComplete
}) => {
  const { t } = useT();
  const navigate = useNavigate();

  // Current active animation step (1 to 5)
  // Step 1: Understanding
  // Step 2: Locating Ward
  // Step 3: Duplicate Check
  // Step 4: Urgency Gauge
  // Step 5: Assignment / Edge Cases
  // Step 6: Final Digital Receipt
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [whatsAppActive, setWhatsAppActive] = useState(complaint.userNotifiedViaWhatsApp);

  const ward = getWardFromCoordinates(complaint.coordinates[0], complaint.coordinates[1]);
  const primaryDept = getDepartmentById(classification.primaryDepartmentId);
  const officer = complaint.assignedOfficer;

  // Stagger sequence progression smoothly
  useEffect(() => {
    const stepIntervals = [1200, 1100, 1100, 1200, 1400];
    let step = 1;

    const timer = setInterval(() => {
      step++;
      if (step <= 6) {
        setCurrentStep(step);
      } else {
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(complaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFinalScreen = currentStep >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B16]/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-2xl bg-[#0B1020] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 relative overflow-hidden"
      >
        {/* Subtle background radial glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#2DE2C4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#8B7CFF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 flex items-center justify-center shadow-lg shadow-[#8B7CFF]/20">
              <Sparkles className="w-5 h-5 text-[#8B7CFF]" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <span>{t('routingModalTitle')}</span>
              </h2>
              <span className="text-xs text-slate-400">
                {isFinalScreen ? 'Dispatch verified & locked' : `Executing neural routing step ${Math.min(currentStep, 5)} of 5`}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
            Phase 1
          </span>
        </div>

        {/* 5 Steps Interactive Progression Bar */}
        <div className="py-6 border-b border-white/10 relative z-10">
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((s) => {
              const isCompleted = currentStep > s;
              const isCurrent = currentStep === s;
              return (
                <div key={s} className="flex flex-col gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-[#2DE2C4]'
                        : isCurrent
                        ? 'bg-[#8B7CFF] animate-pulse'
                        : 'bg-white/10'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono truncate text-center ${
                      isCompleted
                        ? 'text-[#2DE2C4]'
                        : isCurrent
                        ? 'text-white font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    Step {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Animated Steps Content */}
        <div className="py-6 min-h-[300px] flex flex-col justify-center relative z-10">
          <AnimatePresence mode="wait">
            {/* Step 1: Understanding & Confidence */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-4 text-center items-center py-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#2DE2C4] animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {t('stepUnderstanding')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-lingual NLP classification across 10 municipal engineering departments
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {classification.categoryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#2DE2C4]/15 text-[#2DE2C4] border border-[#2DE2C4]/30 font-semibold">
                    Confidence: {classification.confidence}%
                  </span>
                </div>
              </motion.div>
            )}

            {/* Step 2: Locating Ward */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-4 text-center items-center py-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2DE2C4]/10 border border-[#2DE2C4]/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#2DE2C4] animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {t('stepLocating')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Matching incident coordinates to jurisdictional boundary polygons
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left w-full max-w-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-[#2DE2C4] font-semibold">{ward.code}</span>
                    <span className="text-[11px] text-slate-400">Pop: {ward.population}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ward.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{ward.officeAddress}</p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Duplicate Check */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-4 text-center items-center py-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {t('stepDuplicate')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Clustering complaints within 200m radius to eliminate duplicate repair orders
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs w-full max-w-md">
                  {classification.duplicateCount > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0">
                        +{classification.duplicateCount}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-amber-100">
                          {classification.duplicateCount} similar citizen reports merged
                        </p>
                        <p className="text-[11px] text-amber-300/80">
                          Prioritized cluster. Weighting increased for ward emergency queue.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center font-medium">
                      No nearby duplicates found. Fresh primary incident logged for this coordinates.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Urgency Gauge */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-4 text-center items-center py-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#FF5C5C]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {t('stepUrgency')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-factor severity analysis with weather forecast overlay
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <UrgencyBadge urgency={classification.urgency} className="text-sm px-4 py-1.5" />
                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm pt-2">
                    {classification.urgencyReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-300"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Department & Officer Assignment OR Edge Case Cards */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-4 py-2"
              >
                {/* Edge Case 1: Multi-Department Split */}
                {classification.isMultiDepartment ? (
                  <div className="p-4 rounded-2xl bg-[#8B7CFF]/10 border border-[#8B7CFF]/30 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="w-4 h-4 text-[#8B7CFF]" />
                      <h4 className="text-sm font-bold text-white">{t('multiDeptTitle')}</h4>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">{t('multiDeptDesc')}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <DepartmentChip departmentId={classification.primaryDepartmentId} size="sm" />
                        <p className="text-xs text-slate-300 font-semibold mt-2">{t('splitRoadsDesc')}</p>
                        <p className="text-[11px] text-slate-400">Officer: {officer.name}</p>
                      </div>
                      {classification.secondaryDepartmentId && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <DepartmentChip departmentId={classification.secondaryDepartmentId} size="sm" />
                          <p className="text-xs text-slate-300 font-semibold mt-2">{t('splitWaterDesc')}</p>
                          <p className="text-[11px] text-slate-400">Parallel Hydraulic Crew Dispatched</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : classification.isOutOfJurisdiction && classification.jurisdictionAuthority ? (
                  /* Edge Case 2: Out of Jurisdiction */
                  <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-200">{t('outOfJurisdictionTitle')}</h4>
                    </div>
                    <p className="text-xs text-rose-300/90 mb-3">{t('outOfJurisdictionDesc')}</p>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <p className="text-xs font-bold text-white">
                        {classification.jurisdictionAuthority.name}
                      </p>
                      <p className="text-xs text-slate-300 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                        <span>Helpline: {classification.jurisdictionAuthority.helpline}</span>
                      </p>
                      <a
                        href={classification.jurisdictionAuthority.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#2DE2C4] hover:underline inline-flex items-center gap-1 font-mono pt-1"
                      >
                        <span>Visit Central Agency Grievance Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : classification.isLowConfidence ? (
                  /* Edge Case 3: Low Confidence / Human Triage */
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-amber-200">{t('lowConfidenceTitle')}</h4>
                    </div>
                    <p className="text-xs text-amber-300/90 mb-2">{t('lowConfidenceDesc')}</p>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-300">Desk: Central Control Room Review</span>
                      <span className="font-mono text-xs text-amber-400 font-bold">15 Mins SLA</span>
                    </div>
                  </div>
                ) : (
                  /* Normal Assignment Card */
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                    <div className="flex items-center gap-3">
                      <img
                        src={officer.avatar}
                        alt={officer.name}
                        className="w-12 h-12 rounded-full border-2 border-[#2DE2C4] bg-slate-800"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <DepartmentChip departmentId={primaryDept.id} size="sm" />
                        <h4 className="text-sm font-bold text-white mt-1">{officer.name}</h4>
                        <p className="text-xs text-slate-400">{officer.designation}</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{officer.phone}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <SLARing
                        deadlineIso={complaint.slaDeadline}
                        createdAtIso={complaint.createdAt}
                        size={90}
                        strokeWidth={7}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 6: Final Digital Receipt & Action buttons */}
            {isFinalScreen && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-5 py-2"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{t('resultSuccessTitle')}</span>
                </div>

                {/* Digital Receipt Card with SVG QR pattern */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
                  <div className="flex-1 space-y-2 text-left">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {t('receiptTitle')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {complaint.id}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyTicket}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition"
                        title={t('copyTicketId')}
                      >
                        {copied ? <Check className="w-4 h-4 text-[#2DE2C4]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1">
                      {complaint.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <DepartmentChip departmentId={complaint.departmentId} size="sm" />
                      <UrgencyBadge urgency={complaint.urgency} />
                      <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        Ward: {ward.code}
                      </span>
                    </div>
                  </div>

                  {/* Generated QR-style SVG Graphic */}
                  <div className="shrink-0 p-3 rounded-xl bg-white/10 border border-white/10 flex flex-col items-center justify-center">
                    <svg width="72" height="72" viewBox="0 0 72 72" className="text-[#2DE2C4]">
                      <rect width="72" height="72" fill="#0B1020" rx="8" />
                      {/* Top left marker */}
                      <rect x="8" y="8" width="20" height="20" fill="none" stroke="#2DE2C4" strokeWidth="3" rx="2" />
                      <rect x="14" y="14" width="8" height="8" fill="#2DE2C4" />
                      {/* Top right marker */}
                      <rect x="44" y="8" width="20" height="20" fill="none" stroke="#2DE2C4" strokeWidth="3" rx="2" />
                      <rect x="50" y="14" width="8" height="8" fill="#2DE2C4" />
                      {/* Bottom left marker */}
                      <rect x="8" y="44" width="20" height="20" fill="none" stroke="#2DE2C4" strokeWidth="3" rx="2" />
                      <rect x="14" y="50" width="8" height="8" fill="#2DE2C4" />
                      {/* Data bits */}
                      <rect x="34" y="12" width="4" height="4" fill="#2DE2C4" />
                      <rect x="34" y="24" width="4" height="8" fill="#2DE2C4" />
                      <rect x="44" y="34" width="8" height="4" fill="#2DE2C4" />
                      <rect x="56" y="44" width="6" height="6" fill="#2DE2C4" />
                      <rect x="34" y="44" width="4" height="16" fill="#2DE2C4" />
                      <rect x="44" y="54" width="12" height="6" fill="#2DE2C4" />
                    </svg>
                    <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase">MUNI-SECURE</span>
                  </div>
                </div>

                {/* WhatsApp & SMS Alerts Toggle */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-left hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={whatsAppActive}
                    onChange={(e) => setWhatsAppActive(e.target.checked)}
                    className="w-4 h-4 accent-[#2DE2C4] rounded cursor-pointer"
                  />
                  <span className="text-xs text-slate-300">
                    {t('whatsAppOptIn')}
                  </span>
                </label>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onComplete}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-semibold transition"
                  >
                    {t('reportAnotherBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/track/${complaint.id}`)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2DE2C4] text-[#0B1020] text-xs sm:text-sm font-bold hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#2DE2C4]/25"
                  >
                    <span>{t('trackNowBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
