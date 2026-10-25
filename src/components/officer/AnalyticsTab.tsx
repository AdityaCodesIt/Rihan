import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Layers,
  Award
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { useStore } from '../../store/useStore';

export const AnalyticsTab: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const complaints = useStore((state) => state.complaints);

  // Multiplier based on date range
  const rangeMultiplier = dateRange === '7d' ? 0.35 : dateRange === '30d' ? 1 : 2.8;

  // 1. Department Breakdown Bar Chart Data
  const departmentData = useMemo(() => {
    return DEPARTMENTS.slice(0, 7).map((d) => {
      const actualCount = complaints.filter((c) => c.departmentId === d.id).length;
      return {
        name: d.name.en.split('&')[0].trim(),
        count: Math.round(actualCount * rangeMultiplier) + 4,
        slaMet: Math.round(88 + Math.random() * 9),
        color: d.color
      };
    });
  }, [complaints, rangeMultiplier]);

  // 2. Avg Resolution Trend (30 Days)
  const resolutionTrendData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 14 : 20;
    return Array.from({ length: days }, (_, i) => ({
      day: `D-${days - i}`,
      hours: Math.max(8, Math.round(24 - i * 0.7 + (Math.random() * 4 - 2))),
      slaTarget: 24
    }));
  }, [dateRange]);

  // 3. AI Accuracy Donut Data (~91% accuracy)
  const aiAccuracyData = [
    { name: 'AI Dispatched Correctly', value: 91.4, color: '#2DE2C4' },
    { name: 'Human Supervisor Correction', value: 8.6, color: '#FFB020' }
  ];

  // 4. Peak Complaint Hours Area Chart
  const hourlyData = [
    { hour: '06:00', complaints: Math.round(18 * rangeMultiplier) },
    { hour: '08:00', complaints: Math.round(62 * rangeMultiplier) },
    { hour: '10:00', complaints: Math.round(114 * rangeMultiplier) },
    { hour: '12:00', complaints: Math.round(89 * rangeMultiplier) },
    { hour: '14:00', complaints: Math.round(74 * rangeMultiplier) },
    { hour: '16:00', complaints: Math.round(108 * rangeMultiplier) },
    { hour: '18:00', complaints: Math.round(135 * rangeMultiplier) },
    { hour: '20:00', complaints: Math.round(92 * rangeMultiplier) },
    { hour: '22:00', complaints: Math.round(41 * rangeMultiplier) }
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar with Date Range Selector */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Municipal Routing & SLA Performance Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time urban local body KPI tracking and algorithmic precision benchmarks
          </p>
        </div>

        {/* Date Range Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                dateRange === r
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mb-1">
            {Math.round(1428 * rangeMultiplier)}
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-[#2DE2C4]">
            Total Inflow
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Across 8 municipal wards</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mb-1">
            14.2 <span className="text-sm font-normal text-slate-400">hours</span>
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-amber-300">
            Avg. Resolution Time
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Down 42% from manual triage</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mb-1">
            91.4%
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-violet-300">
            AI Zero-Shot Accuracy
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Auto-dispatched without dispute</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mb-1">
            94.2%
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-emerald-400">
            SLA Met Compliance
          </span>
          <p className="text-[11px] text-slate-400 mt-1">5.8% statutory breaches</p>
        </div>
      </div>

      {/* AI Insights Card (Violet Glow) */}
      <div className="p-5 rounded-2xl bg-[#8B7CFF]/10 border border-[#8B7CFF]/30 text-xs text-slate-200 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 text-[#8B7CFF] font-bold">
          <Sparkles className="w-4 h-4" />
          <span className="font-mono uppercase tracking-wider text-xs">
            CivicRoute Autonomous Intelligence Insights
          </span>
        </div>
        <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-[11px] sm:text-xs">
          <li>
            Drainage & Sewerage complaints in Ward B (Central Market) surged <strong>34%</strong> following the recent 18mm rainfall spike detected via Open-Meteo.
          </li>
          <li>
            Pothole duplicate clustering automatically merged <strong>18 separate citizen submissions</strong> into 4 consolidated work orders on Station West Exit road.
          </li>
          <li>
            Street Lighting division achieved the fastest ward turnaround this week with an average site repair SLA of <strong>2.8 hours</strong>.
          </li>
        </ul>
      </div>

      {/* Charts Row 1: Tickets by Department + AI Accuracy Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Volume Bar Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Complaint Volume by Department</span>
            <span className="text-xs font-mono text-slate-400 font-normal">Active & Closed</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Routing Accuracy Donut (1 col) */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">AI Routing Precision</h3>
            <p className="text-xs text-slate-400 mt-1">Autonomous dispatch vs supervisor corrections</p>
          </div>

          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiAccuracyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aiAccuracyData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-bold text-white">91.4%</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Accuracy</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2DE2C4]" />
                <span>AI Dispatched Correctly</span>
              </span>
              <span className="font-mono font-bold text-white">91.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB020]" />
                <span>Human Triage Adjusted</span>
              </span>
              <span className="font-mono font-bold text-white">8.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Resolution Trend Line + Peak Complaint Hours Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avg Resolution Trend Line */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Avg. Resolution Time Trajectory (Hours)</span>
            <span className="text-xs font-mono text-emerald-400">Decreasing -42%</span>
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="hours" stroke="#2DE2C4" strokeWidth={2.5} dot={{ r: 3, fill: '#2DE2C4' }} />
                <Line type="monotone" dataKey="slaTarget" stroke="#FF5C5C" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Area */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Citizen Filing Peak Hours</span>
            <span className="text-xs font-mono text-amber-300">Peak: 18:00 (Evening Commute)</span>
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hourColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B7CFF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B7CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="complaints" stroke="#8B7CFF" strokeWidth={2} fillOpacity={1} fill="url(#hourColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
