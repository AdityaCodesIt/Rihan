import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, ArrowRight, X } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { useStore } from '../../store/useStore';
import { useToast } from '../common/Toast';

interface BulkActionBarProps {
  selectedIds: string[];
  onClear: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedIds, onClear }) => {
  const { showToast } = useToast();
  const bulkAssign = useStore((state) => state.bulkAssign);
  const [targetDeptId, setTargetDeptId] = useState(DEPARTMENTS[0].id);

  if (selectedIds.length === 0) return null;

  const handleBulkAssign = () => {
    bulkAssign(selectedIds, targetDeptId);
    showToast(`Bulk assigned ${selectedIds.length} tickets to ${DEPARTMENTS.find(d => d.id === targetDeptId)?.name.en}.`, 'success');
    onClear();
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl bg-[#0F172A] border border-amber-400/40 shadow-2xl backdrop-blur-2xl flex items-center gap-4 text-xs"
    >
      <div className="flex items-center gap-2 text-white font-mono font-bold">
        <CheckSquare className="w-4 h-4 text-amber-400" />
        <span>{selectedIds.length} selected</span>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <div className="flex items-center gap-2">
        <span className="text-slate-400">Assign to:</span>
        <select
          value={targetDeptId}
          onChange={(e) => setTargetDeptId(e.target.value)}
          className="p-1.5 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.id} className="bg-[#0F172A] text-white">
              {dept.name.en}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleBulkAssign}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition active:scale-95 shadow-md shadow-amber-400/20"
      >
        <span>Execute Batch</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onClear}
        className="p-1 rounded-lg text-slate-400 hover:text-white transition"
        title="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
