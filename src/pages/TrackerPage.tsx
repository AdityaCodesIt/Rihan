import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  Users,
  Camera,
  RefreshCw,
  Sparkles,
  Share2,
  Copy,
  Check,
  Star,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { useStore } from '../store/useStore';
import { DepartmentChip } from '../components/common/DepartmentChip';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { SLARing } from '../components/common/SLARing';
import { BeforeAfterSlider } from '../components/tracker/BeforeAfterSlider';
import { WhatsAppPreview } from '../components/tracker/WhatsAppPreview';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { getWardById } from '../data/wards';

export const TrackerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useT();
  const { showToast } = useToast();

  const getComplaint = useStore((state) => state.getComplaint);
  const incrementAffected = useStore((state) => state.incrementAffected);
  const confirmResolved = useStore((state) => state.confirmResolved);
  const reopenComplaint = useStore((state) => state.reopenComplaint);
  const addPhotoToComplaint = useStore((state) => state.addPhotoToComplaint);

  const [searchInput, setSearchInput] = useState(id || 'CR-2026-004812');
  const [copied, setCopied] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [verifyRating, setVerifyRating] = useState(5);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const activeId = id || 'CR-2026-004812';
  const complaint = getComplaint(activeId);
  const ward = complaint ? getWardById(complaint.wardId) : null;

  useEffect(() => {
    if (id) {
      setSearchInput(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim()}`);
    }
  };

  const handleCopyId = () => {
    if (!complaint) return;
    navigator.clipboard.writeText(complaint.id);
    setCopied(true);
    showToast(t('copiedTicket'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffectedClick = () => {
    if (!complaint) return;
    incrementAffected(complaint.id);
    showToast(t('affectedToast'), 'success');
  };

  const handleAddPhoto = () => {
    if (!complaint) return;
    const randomSeed = Math.floor(Math.random() * 9000);
    const newPhoto = `https://picsum.photos/seed/civic_suppl_${randomSeed}/600/400`;
    addPhotoToComplaint(complaint.id, newPhoto);
    showToast('Supplementary evidence photo uploaded to case file', 'success');
  };

  const handleConfirmVerification = () => {
    if (!complaint) return;
    confirmResolved(complaint.id, verifyRating);
    setShowVerifyModal(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(t('resolvedSuccessToast'), 'success');
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint || !reopenReason.trim()) return;
    reopenComplaint(complaint.id, reopenReason);
    setReopenModalOpen(false);
    setReopenReason('');
    showToast(t('reopenSuccessToast'), 'warning');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Search & Demo Shortcuts */}
      <div className="mb-10 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2">
          {t('trackerTitle')}
        </h1>
        <p className="text-sm text-slate-400 mb-6">{t('trackerSubtitle')}</p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-2xl focus-within:border-[#2DE2C4]/60 transition"
        >
          <div className="pl-3.5 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('quickTrackPlaceholder')}
            className="w-full py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#2DE2C4] text-[#0B1020] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition whitespace-nowrap shadow-md shadow-[#2DE2C4]/20"
          >
            {t('searchBtn')}
          </button>
        </form>

        {/* Demo shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-slate-400 font-mono">{t('demoShortcuts')}</span>
          <button
            type="button"
            onClick={() => navigate('/track/CR-2026-004812')}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition border ${
              activeId === 'CR-2026-004812'
                ? 'bg-[#2DE2C4]/20 border-[#2DE2C4]/50 text-[#2DE2C4] font-bold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            CR-2026-004812 ({t('demoPotholes')})
          </button>
          <button
            type="button"
            onClick={() => navigate('/track/CR-2026-003190')}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition border ${
              activeId === 'CR-2026-003190'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            CR-2026-003190 ({t('demoBreached')})
          </button>
          <button
            type="button"
            onClick={() => navigate('/track/CR-2026-001045')}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition border ${
              activeId === 'CR-2026-001045'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            CR-2026-001045 ({t('demoFixed')})
          </button>
        </div>
      </div>

      {/* Ticket Details or Not Found State */}
      {!complaint ? (
        <EmptyState
          title={t('ticketNotFound')}
          description="We couldn't locate this grievance ID in our municipal records. Double check the 14-character alphanumeric token or pick one of our live demo tickets above."
          actionLabel="Report a New Issue"
          actionHref="/report"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Timeline, SLA Ring, Details, Photos, Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Escalation Banner if Breached */}
            {complaint.isEscalated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-start gap-3 text-rose-200 shadow-xl"
              >
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">
                    {t('slaBreachedBanner')}
                  </h4>
                  <p className="text-xs text-rose-300/90 mt-1">
                    Supervisory Officer: <span className="font-semibold text-white">{complaint.escalatedTo || 'Executive Engineer'}</span>. High-priority suction & repair team tasked.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Ticket Header Card */}
            <div className="p-6 rounded-3xl glass-panel relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {complaint.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition"
                    title={t('copyTicketId')}
                  >
                    {copied ? <Check className="w-4 h-4 text-[#2DE2C4]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <UrgencyBadge urgency={complaint.urgency} />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-white/10 text-slate-200">
                    Ward: {ward ? ward.code : 'WRD'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white leading-snug">
                  {complaint.title}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {complaint.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                  <DepartmentChip departmentId={complaint.departmentId} size="sm" />
                  <span>•</span>
                  <span>{complaint.locationName}</span>
                </div>
              </div>

              {/* SLA Ring Timer */}
              <div className="shrink-0 flex flex-col items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                <SLARing
                  deadlineIso={complaint.slaDeadline}
                  createdAtIso={complaint.createdAt}
                  size={96}
                  strokeWidth={8}
                />
              </div>
            </div>

            {/* Before / After Slider (When fixed/verified) */}
            {(complaint.status === 'fixed' || complaint.status === 'verified') && complaint.afterPhotoUrl && (
              <div className="p-6 rounded-3xl glass-panel space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2DE2C4]" />
                    <span>Mandatory On-Site Photographic Evidence</span>
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono font-semibold">
                    Work Completed
                  </span>
                </div>
                <BeforeAfterSlider
                  beforeUrl={complaint.photoUrl}
                  afterUrl={complaint.afterPhotoUrl}
                />
              </div>
            )}

            {/* If not fixed, show reported photo */}
            {complaint.status !== 'fixed' && complaint.status !== 'verified' && (
              <div className="p-6 rounded-3xl glass-panel space-y-3">
                <h3 className="text-sm font-bold text-white">Reported Photographic Evidence</h3>
                <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={complaint.photoUrl}
                    alt="Reported"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://picsum.photos/seed/civic_rep_fallback/600/400';
                    }}
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs text-slate-200 font-medium">
                    Initial Site Photo
                  </span>
                </div>
              </div>
            )}

            {/* Interactive Citizen Action Controls */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <h3 className="text-sm font-bold text-white">Citizen Verification & Actions</h3>
              <div className="flex flex-wrap items-center gap-3">
                {/* I'm affected too button */}
                <button
                  type="button"
                  onClick={handleAffectedClick}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs sm:text-sm active:scale-95 transition border border-white/10"
                >
                  <Users className="w-4 h-4 text-[#2DE2C4]" />
                  <span>{t('imAffectedToo')}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#2DE2C4]/20 text-[#2DE2C4] font-mono text-xs font-bold">
                    {complaint.affectedCount}
                  </span>
                </button>

                {/* Add Photo Button */}
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs sm:text-sm active:scale-95 transition border border-white/10"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>{t('addPhoto')}</span>
                </button>

                {/* Confirm Resolved & Close (When Fixed) */}
                {complaint.status === 'fixed' && (
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm active:scale-95 transition shadow-lg shadow-emerald-500/25 ml-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('confirmResolvedBtn')}</span>
                  </button>
                )}

                {/* Reopen / Dispute (When Fixed or Verified) */}
                {(complaint.status === 'fixed' || complaint.status === 'verified') && (
                  <button
                    type="button"
                    onClick={() => setReopenModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs sm:text-sm active:scale-95 transition border border-rose-500/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('reopenBtn')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Vertical Lifecycle Timeline */}
            <div className="p-6 rounded-3xl glass-panel space-y-6">
              <h3 className="text-base font-bold text-white">Official Municipal Audit Trail</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {complaint.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#0B1020] border-2 border-[#2DE2C4] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2DE2C4]" />
                    </div>

                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/15 transition">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                      {step.actor && (
                        <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                          Actor: {step.actor}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Assigned Officer Card & WhatsApp Live Chat Simulation */}
          <div className="space-y-6">
            {/* Officer Card */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                {t('assignedEngineer')}
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={complaint.assignedOfficer.avatar}
                  alt={complaint.assignedOfficer.name}
                  className="w-14 h-14 rounded-2xl border-2 border-[#2DE2C4] bg-slate-800"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <h4 className="text-base font-bold text-white">
                    {complaint.assignedOfficer.name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {complaint.assignedOfficer.designation}
                  </p>
                  <p className="text-xs font-mono text-[#2DE2C4] mt-1">
                    {complaint.assignedOfficer.phone}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${complaint.assignedOfficer.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition border border-white/10"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#2DE2C4]" />
                  <span>{t('callOfficer')}</span>
                </a>
              </div>
            </div>

            {/* Ward Office Details */}
            {ward && (
              <div className="p-6 rounded-3xl glass-panel space-y-3">
                <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                  Ward Jurisdiction
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{ward.name}</h4>
                  <span className="text-xs font-mono text-[#2DE2C4] font-bold">{ward.code}</span>
                </div>
                <p className="text-xs text-slate-300">{ward.officeAddress}</p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5 space-y-1">
                  <p>Councillor: <span className="text-slate-200">{ward.councillor}</span></p>
                  <p>Ward Population: <span className="text-slate-200">{ward.population}</span></p>
                </div>
              </div>
            )}

            {/* WhatsApp Chat Simulation */}
            <WhatsAppPreview complaint={complaint} />
          </div>
        </div>
      )}

      {/* Citizen Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B16]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0B1020] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Rate the Resolution</h3>
                <p className="text-xs text-slate-400">Confirm work on-site meets civic standards</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setVerifyRating(star)}
                  className="p-1 transition hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= verifyRating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
              >
                Confirm & Close Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reopen / Dispute Modal */}
      {reopenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B16]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0B1020] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('reopenModalTitle')}</h3>
                <p className="text-xs text-slate-400">Dispute is escalated directly to the Ward Supervisor</p>
              </div>
            </div>

            <form onSubmit={handleReopenSubmit} className="space-y-4">
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                rows={3}
                required
                placeholder={t('reopenModalPlaceholder')}
                className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 transition resize-none"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition"
                >
                  {t('reopenConfirm')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
