import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wand2,
  PlusCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useToast } from './Toast';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const simulateNewComplaint = useStore((state) => state.simulateNewComplaint);
  const simulateSlaBreach = useStore((state) => state.simulateSlaBreach);
  const resetDemoData = useStore((state) => state.resetDemoData);

  const handleSimulateNew = () => {
    const comp = simulateNewComplaint();
    showToast(`Simulated Live Grievance: ${comp.id} added! Check Officer Inbox.`, 'success');
  };

  const handleSimulateBreach = () => {
    simulateSlaBreach();
    showToast('Emergency SLA breach simulated! Check Officer Escalations.', 'warning');
  };

  const handleResetData = () => {
    resetDemoData();
    showToast('Demo municipal dataset reset to pristine defaults.', 'info');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 p-4 rounded-3xl bg-[#0F172A] border border-amber-400/40 shadow-2xl backdrop-blur-2xl w-64 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Presenter Deck</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-0.5"
                aria-label="Close demo controls"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSimulateNew}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-[#2DE2C4]" />
                <span>Simulate New Grievance</span>
              </button>

              <button
                onClick={handleSimulateBreach}
                className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left text-xs font-semibold text-rose-300 hover:text-rose-200 flex items-center gap-2 transition active:scale-95"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Simulate SLA Breach</span>
              </button>

              <button
                onClick={handleResetData}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-medium text-slate-400 hover:text-white flex items-center gap-2 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset Demo Datasets</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-mono text-center">
              Quickly demonstrate live municipal dispatch loops
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono font-bold text-xs shadow-xl shadow-amber-400/20 hover:brightness-110 active:scale-95 transition"
      >
        <Wand2 className="w-4 h-4" />
        <span>Demo Controls</span>
      </button>
    </div>
  );
};
