import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useT();

  return (
    <footer className="border-t border-white/10 bg-[#070B16] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white text-base">CivicRoute</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#2DE2C4]/10 text-[#2DE2C4] border border-[#2DE2C4]/25">
              <Sparkles className="w-3 h-3" />
              {t('prototypeNotice')}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            {t('mottoSub')}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-300/90 pt-1 font-mono">
            <PhoneCall className="w-3.5 h-3.5 shrink-0" />
            <span>{t('emergencyHelpline')}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <Link to="/" className="hover:text-[#2DE2C4] transition">
            {t('roleCitizen')}
          </Link>
          <Link to="/report" className="hover:text-[#2DE2C4] transition font-semibold text-[#2DE2C4]">
            {t('reportCta')}
          </Link>
          <Link to="/track/CR-2026-004812" className="hover:text-[#2DE2C4] transition">
            Demo Ticket (In-Progress)
          </Link>
          <Link to="/track/CR-2026-003190" className="hover:text-[#2DE2C4] transition">
            Demo Ticket (Breached)
          </Link>
          <Link to="/track/CR-2026-001045" className="hover:text-[#2DE2C4] transition">
            Demo Ticket (Fixed)
          </Link>
          <Link to="/officer" className="hover:text-amber-300 transition">
            {t('roleOfficer')}
          </Link>
          <Link to="/public" className="hover:text-violet-300 transition">
            {t('rolePublic')}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2DE2C4]" />
          <span>{t('copyright')}</span>
        </div>
        <p className="font-mono text-slate-400">
          Designed for Urban Local Bodies (ULBs) & Municipal Corporations
        </p>
      </div>
    </footer>
  );
};
