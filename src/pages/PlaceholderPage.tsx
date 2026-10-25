import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Shield, BarChart3, Users, Map } from 'lucide-react';
import { useT } from '../i18n/useT';

interface PlaceholderPageProps {
  role: 'officer' | 'public';
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ role }) => {
  const { t } = useT();

  const isOfficer = role === 'officer';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
      <div className="p-8 sm:p-12 rounded-3xl glass-panel relative overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center">
        {/* Glow */}
        <div
          className={`absolute top-0 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
            isOfficer ? 'bg-amber-400/15' : 'bg-violet-400/15'
          }`}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 mb-6">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('comingSoon')} (Phase 2)</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white mb-4">
          {isOfficer ? t('roleOfficer') : t('rolePublic')}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mb-10 leading-relaxed">
          {isOfficer
            ? 'The municipal officer command console provides field inspection dispatch queues, SLA breach monitors, photo verification tools, and real-time GIS ward routing.'
            : 'The public municipal transparency portal features ward-by-ward SLA compliance leaderboards, heatmaps of resolved civic grievances, and Open Data APIs for citizens.'}
        </p>

        {/* Phase 2 Architecture Teaser Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10 text-left">
          {isOfficer ? (
            <>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Shield className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Automated Triage</h4>
                <p className="text-[11px] text-slate-400">
                  Bulk assign and re-route with AI validation
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">SLA Escalation Engine</h4>
                <p className="text-[11px] text-slate-400">
                  Sub-4h critical alerts to Executive Engineers
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Map className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Ward GIS Heatmap</h4>
                <p className="text-[11px] text-slate-400">
                  Live cluster density across 8 municipal wards
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <BarChart3 className="w-5 h-5 text-violet-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Ward Leaderboards</h4>
                <p className="text-[11px] text-slate-400">
                  Live SLA resolution rates by ward councillor
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Users className="w-5 h-5 text-violet-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Citizen Endorsements</h4>
                <p className="text-[11px] text-slate-400">
                  Aggregated crowd validation of public works
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Sparkles className="w-5 h-5 text-violet-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Open Data Feeds</h4>
                <p className="text-[11px] text-slate-400">
                  Real-time municipal performance transparency
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Citizen Portal</span>
        </Link>
      </div>
    </div>
  );
};
