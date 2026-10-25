import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  PlusCircle,
  Clock,
  Shield,
  BarChart3,
  Home,
  FileText,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const complaints = useStore((state) => state.complaints);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navActions = [
    { label: 'Citizen Home', path: '/', icon: Home, category: 'Navigation' },
    { label: 'Report a Grievance', path: '/report', icon: PlusCircle, category: 'Citizen Flow' },
    { label: 'Track Complaint (CR-2026-004812)', path: '/track/CR-2026-004812', icon: Clock, category: 'Citizen Flow' },
    { label: 'Officer Command Console', path: '/officer', icon: Shield, category: 'Officer Flow' },
    { label: 'Public Transparency Dashboard', path: '/public', icon: BarChart3, category: 'Public Flow' }
  ];

  const filteredNav = navActions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchingTickets = query.trim()
    ? complaints
        .filter(
          (c) =>
            c.id.toLowerCase().includes(query.toLowerCase()) ||
            c.title.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectPath = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Floating Keyboard Shortcut Pill (Bottom Center-Right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 z-30 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#0F172A] border border-white/15 text-slate-400 hover:text-white text-xs font-mono backdrop-blur-xl shadow-xl transition active:scale-95"
        title="Quick Command Palette (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5 text-[#2DE2C4]" />
        <span>Quick Jump</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 border border-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-lg rounded-3xl bg-[#0B1020] border border-white/15 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Input header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#2DE2C4]" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a screen name, ticket ID, or keyword..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {/* Navigation items */}
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500">
                  Screens & Destinations
                </div>
                {filteredNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectPath(item.path)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between text-xs text-slate-200 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[#2DE2C4] group-hover:scale-110 transition" />
                        <span className="font-medium group-hover:text-white">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
                    </button>
                  );
                })}

                {/* Ticket matches */}
                {matchingTickets.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500 border-t border-white/5 mt-2">
                      Matching Grievance Tickets
                    </div>
                    {matchingTickets.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectPath(`/track/${t.id}`)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-xs text-slate-300 transition group"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-mono font-bold text-white block group-hover:text-[#2DE2C4]">
                            {t.id}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {t.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
