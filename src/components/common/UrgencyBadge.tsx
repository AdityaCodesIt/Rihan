import React from 'react';
import { Urgency } from '../../types';
import { AlertCircle, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: Urgency;
  showIcon?: boolean;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, showIcon = true, className = '' }) => {
  const config = {
    critical: {
      label: 'Critical SLA (4h)',
      bgColor: 'bg-[#FF5C5C]/15',
      borderColor: 'border-[#FF5C5C]/40',
      textColor: 'text-[#FF5C5C]',
      dotColor: 'bg-[#FF5C5C]',
      icon: ShieldAlert
    },
    high: {
      label: 'High Urgency (24h)',
      bgColor: 'bg-[#FFB020]/15',
      borderColor: 'border-[#FFB020]/40',
      textColor: 'text-[#FFB020]',
      dotColor: 'bg-[#FFB020]',
      icon: AlertTriangle
    },
    medium: {
      label: 'Medium Urgency (72h)',
      bgColor: 'bg-[#2DE2C4]/15',
      borderColor: 'border-[#2DE2C4]/40',
      textColor: 'text-[#2DE2C4]',
      dotColor: 'bg-[#2DE2C4]',
      icon: Clock
    },
    low: {
      label: 'Routine Queue',
      bgColor: 'bg-slate-500/15',
      borderColor: 'border-slate-500/40',
      textColor: 'text-slate-300',
      dotColor: 'bg-slate-400',
      icon: AlertCircle
    }
  }[urgency];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all ${config.bgColor} ${config.borderColor} ${config.textColor} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
