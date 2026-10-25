import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  MapPin,
  Mic,
  Camera,
  Layers,
  Award
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { DEPARTMENTS } from '../data/departments';
import { DEMO_TICKETS } from '../data/complaints';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { DepartmentChip } from '../components/common/DepartmentChip';

export const LandingPage: React.FC = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const [trackInput, setTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/track/${trackInput.trim()}`);
    } else {
      navigate('/track/CR-2026-004812');
    }
  };

  // Flying complaint items simulation into department nodes
  const liveRoutingStream = [
    { text: 'Water pipe leak in Sector 4', dept: 'water-supply', ward: 'Ward C' },
    { text: 'Deep crater on Station Road', dept: 'roads', ward: 'Ward A' },
    { text: 'Garbage dump near marketplace', dept: 'solid-waste', ward: 'Ward B' },
    { text: 'Exposed street lamp wiring', dept: 'electrical', ward: 'Ward E' }
  ];

  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2DE2C4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#8B7CFF]/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#2DE2C4] animate-ping" />
            <span className="text-[#2DE2C4] font-semibold">CivicRoute Engine</span>
            <span className="text-slate-400">•</span>
            <span>Indian Municipal Corporation AI Dispatch</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Report once. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DE2C4] via-teal-200 to-[#8B7CFF]">
              We route it right.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
            {t('mottoSub')}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
            <Link
              to="/report"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#2DE2C4] text-[#0B1020] font-bold text-base hover:brightness-110 active:scale-95 transition shadow-2xl shadow-[#2DE2C4]/30"
            >
              <span>{t('reportCta')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/track/CR-2026-004812"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>{t('trackCta')}</span>
            </Link>
          </div>

          {/* Quick Track Input Bar */}
          <form
            onSubmit={handleTrackSubmit}
            className="w-full max-w-lg p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-2xl focus-within:border-[#2DE2C4]/60 transition"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder={t('quickTrackPlaceholder')}
              className="w-full py-2 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold text-slate-100 transition whitespace-nowrap"
            >
              {t('quickTrackSubmit')}
            </button>
          </form>
        </motion.div>

        {/* Animated Flying Complaint Stream Banner */}
        <div className="mt-14 max-w-5xl mx-auto p-4 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DE2C4]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE AUTONOMOUS STREAM</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Sub-second Ward Dispatch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {liveRoutingStream.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-left flex flex-col justify-between gap-2 hover:border-[#2DE2C4]/40 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{item.ward}</span>
                  <div className="w-2 h-2 rounded-full bg-[#2DE2C4] group-hover:scale-125 transition" />
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-1">{item.text}</p>
                <DepartmentChip departmentId={item.dept} size="sm" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Live Counters Strip */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel text-center relative overflow-hidden">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white mb-1">
              1,428
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#2DE2C4] mb-1">
              {t('routedToday')}
            </div>
            <p className="text-xs text-slate-400">Across 8 municipal wards & 10 divisions</p>
          </div>

          <div className="p-6 rounded-2xl glass-panel text-center relative overflow-hidden">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white mb-1">
              1.8 <span className="text-lg font-normal text-slate-400">min</span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#FFB020] mb-1">
              {t('avgAssignTime')}
            </div>
            <p className="text-xs text-slate-400">Reduced from 72 hours manual paper triage</p>
          </div>

          <div className="p-6 rounded-2xl glass-panel text-center relative overflow-hidden">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white mb-1">
              94.2%
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              {t('slaMetRate')}
            </div>
            <p className="text-xs text-slate-400">Strict SLA clock with auto-escalation</p>
          </div>
        </div>
      </section>

      {/* 4-Step "How it works" timeline */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl glass-panel relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2DE2C4]/10 border border-[#2DE2C4]/30 flex items-center justify-center text-[#2DE2C4] mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step1Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step1Desc')}</p>
            </div>
            <span className="text-[10px] font-mono text-[#2DE2C4] mt-4 block">STEP 01</span>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl glass-panel relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#8B7CFF]/10 border border-[#8B7CFF]/30 flex items-center justify-center text-[#8B7CFF] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step2Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step2Desc')}</p>
            </div>
            <span className="text-[10px] font-mono text-[#8B7CFF] mt-4 block">STEP 02</span>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl glass-panel relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step3Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step3Desc')}</p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-4 block">STEP 03</span>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl glass-panel relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step4Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step4Desc')}</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 mt-4 block">STEP 04</span>
          </div>
        </div>
      </section>

      {/* "Recently Resolved Near You" Strip with before/after Picsum images */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">
              {t('recentlyResolvedTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('recentlyResolvedSubtitle')}
            </p>
          </div>
          <Link
            to="/track/CR-2026-001045"
            className="text-xs font-semibold text-[#2DE2C4] hover:underline flex items-center gap-1 font-mono"
          >
            <span>View Verified Fixed Ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl glass-panel flex flex-col gap-3 group">
            <div className="grid grid-cols-2 gap-2 h-40 rounded-xl overflow-hidden relative">
              <div className="relative h-full">
                <img
                  src="https://picsum.photos/seed/civic_fixed_1/400/300"
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-slate-200">
                  Before
                </span>
              </div>
              <div className="relative h-full">
                <img
                  src="https://picsum.photos/seed/clean_street_1045/400/300"
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Fixed
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <DepartmentChip departmentId="solid-waste" size="sm" />
              <span className="text-[11px] font-mono text-emerald-400">Resolved in 6h</span>
            </div>
            <h4 className="text-xs font-bold text-white line-clamp-1">
              Pavement garbage accumulation cleared
            </h4>
            <p className="text-[11px] text-slate-400">Ward C • Verified by resident</p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl glass-panel flex flex-col gap-3 group">
            <div className="grid grid-cols-2 gap-2 h-40 rounded-xl overflow-hidden relative">
              <div className="relative h-full">
                <img
                  src="https://picsum.photos/seed/pothole_crater_4812/400/300"
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-slate-200">
                  Before
                </span>
              </div>
              <div className="relative h-full">
                <img
                  src="https://picsum.photos/seed/asphalt_patched_2/400/300"
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Fixed
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <DepartmentChip departmentId="roads" size="sm" />
              <span className="text-[11px] font-mono text-emerald-400">Resolved in 14h</span>
            </div>
            <h4 className="text-xs font-bold text-white line-clamp-1">
              Jet-patcher hot mix pothole repair
            </h4>
            <p className="text-[11px] text-slate-400">Ward A • Station West Road</p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl glass-panel flex flex-col gap-3 group">
            <div className="grid grid-cols-2 gap-2 h-40 rounded-xl overflow-hidden relative">
              <div className="relative h-full">
                <img
                  src="https://picsum.photos/seed/civic_issue_4/400/300"
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-slate-200">
                  Before
                </span>
              </div>
              <div className="relative h-full">
                <img
                  src="https://picsum.photos/seed/light_fixed_3/400/300"
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Fixed
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <DepartmentChip departmentId="electrical" size="sm" />
              <span className="text-[11px] font-mono text-emerald-400">Resolved in 4h</span>
            </div>
            <h4 className="text-xs font-bold text-white line-clamp-1">
              Feeder pillar cable replaced & energized
            </h4>
            <p className="text-[11px] text-slate-400">Ward E • Kotwali Gate</p>
          </div>
        </div>
      </section>
    </div>
  );
};
