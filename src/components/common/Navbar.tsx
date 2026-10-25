import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n/useT';
import { fetchLiveWeather } from '../../services/weatherApi';
import { SupportedLanguage } from '../../types';
import {
  ShieldAlert,
  CloudRain,
  Sun,
  Moon,
  PlusCircle,
  Globe,
  Radio,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, language } = useT();
  const location = useLocation();
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const setLanguage = useStore((state) => state.setLanguage);
  const liveWeather = useStore((state) => state.liveWeather);
  const setLiveWeather = useStore((state) => state.setLiveWeather);

  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchLiveWeather().then((weather) => {
      if (isMounted) {
        setLiveWeather(weather);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [setLiveWeather]);

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' }
  ];

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1020]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2DE2C4] to-[#0D9488] flex items-center justify-center shadow-lg shadow-[#2DE2C4]/25 transition group-hover:scale-105">
            <Radio className="w-5 h-5 text-[#0B1020] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-[#2DE2C4] transition">
                CivicRoute
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#2DE2C4]/20 text-[#2DE2C4] font-semibold">
                AI 2.4
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block">
              Municipal AI Routing Core
            </span>
          </div>
        </Link>

        {/* Navigation Roles (Responsive) */}
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-medium">
          <Link
            to="/"
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition ${
              isCurrent('/') || isCurrent('/report') || isCurrent('/track')
                ? 'bg-[#2DE2C4]/20 text-[#2DE2C4] font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t('roleCitizen')}
          </Link>
          <Link
            to="/officer"
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition ${
              isCurrent('/officer')
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="hidden sm:inline">{t('roleOfficer')}</span>
            <span className="sm:hidden">Officer</span>
          </Link>
          <Link
            to="/public"
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition ${
              isCurrent('/public')
                ? 'bg-violet-400/20 text-violet-300 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="hidden sm:inline">{t('rolePublic')}</span>
            <span className="sm:hidden">Public</span>
          </Link>
        </nav>

        {/* Right Controls: Weather chip + Language + Theme + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Open-Meteo Weather Chip */}
          <div
            title={`Live Open-Meteo Feed: ${liveWeather.conditionText}`}
            className={`hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition ${
              liveWeather.isRaining
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            {liveWeather.isRaining ? (
              <CloudRain className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span>{liveWeather.conditionText}</span>
            {liveWeather.isRaining && (
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/20 px-1 rounded">
                MONSOON SLA+
              </span>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#2DE2C4]" />
              <span className="font-semibold uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 py-1.5 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl z-40 backdrop-blur-2xl">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                        language === item.code
                          ? 'text-[#2DE2C4] bg-[#2DE2C4]/10 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{item.native}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{item.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            aria-label="Toggle Theme"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Report Button CTA */}
          <Link
            to="/report"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#2DE2C4] text-[#0B1020] font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#2DE2C4]/20"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t('reportCta')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
