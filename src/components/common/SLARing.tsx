import React, { useEffect, useState } from 'react';

interface SLARingProps {
  deadlineIso: string;
  createdAtIso: string;
  size?: number;
  strokeWidth?: number;
}

export const SLARing: React.FC<SLARingProps> = ({
  deadlineIso,
  createdAtIso,
  size = 110,
  strokeWidth = 8
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    isBreached: boolean;
    percentage: number;
  }>({ hours: 0, minutes: 0, isBreached: false, percentage: 100 });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(createdAtIso).getTime();
      const end = new Date(deadlineIso).getTime();
      const now = Date.now();

      const totalDuration = Math.max(1, end - start);
      const remainingMs = end - now;

      if (remainingMs <= 0) {
        const breachedHours = Math.floor(Math.abs(remainingMs) / (1000 * 60 * 60));
        const breachedMins = Math.floor((Math.abs(remainingMs) % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({
          hours: breachedHours,
          minutes: breachedMins,
          isBreached: true,
          percentage: 0
        });
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const pct = Math.max(0, Math.min(100, (remainingMs / totalDuration) * 100));
        setTimeLeft({
          hours,
          minutes,
          isBreached: false,
          percentage: pct
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 30000); // refresh every 30s
    return () => clearInterval(timer);
  }, [deadlineIso, createdAtIso]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft.percentage / 100) * circumference;

  let ringColor = '#2DE2C4'; // Teal
  if (timeLeft.isBreached) {
    ringColor = '#FF5C5C'; // Coral
  } else if (timeLeft.percentage < 25) {
    ringColor = '#FFB020'; // Amber warning
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        {timeLeft.isBreached ? (
          <>
            <span className="font-mono text-[11px] font-bold text-[#FF5C5C] uppercase tracking-wider animate-pulse">
              BREACHED
            </span>
            <span className="font-mono text-xs font-semibold text-rose-300">
              +{timeLeft.hours}h {timeLeft.minutes}m
            </span>
          </>
        ) : (
          <>
            <span className="font-mono text-base font-bold text-white tracking-tight">
              {timeLeft.hours}h {timeLeft.minutes}m
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              SLA Remainder
            </span>
          </>
        )}
      </div>
    </div>
  );
};
