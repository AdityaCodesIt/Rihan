import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import {
  Download,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Layers,
  ArrowUpDown,
  Radio,
  FileSpreadsheet,
  MapPin,
  Sparkles
} from 'lucide-react';
import { DEPARTMENTS, getDepartmentById } from '../data/departments';
import { WARDS } from '../data/wards';
import { useStore } from '../store/useStore';
import { DepartmentChip } from '../components/common/DepartmentChip';
import { BeforeAfterSlider } from '../components/tracker/BeforeAfterSlider';
import { useToast } from '../components/common/Toast';

export const PublicDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const complaints = useStore((state) => state.complaints);
  const theme = useStore((state) => state.theme);

  // Sorting state for leaderboard
  const [leaderboardSort, setLeaderboardSort] = useState<'sla' | 'time' | 'rating'>('sla');
  const [selectedWardForInspect, setSelectedWardForInspect] = useState<string | null>(null);

  // Overall Statistics
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'fixed' || c.status === 'verified'
  ).length;
  const resolvedPct = Math.round((resolvedCount / Math.max(1, totalComplaints)) * 100);
  const slaMetPct = 94.2;
  const avgResolutionHours = 14.2;

  // Ward open count calculation
  const wardStats = useMemo(() => {
    return WARDS.map((ward) => {
      const wardComplaints = complaints.filter((c) => c.wardId === ward.id);
      const open = wardComplaints.filter(
        (c) => c.status !== 'fixed' && c.status !== 'verified'
      ).length;
      const closed = wardComplaints.length - open;
      const compliance = wardComplaints.length > 0 ? Math.round((closed / wardComplaints.length) * 100) : 100;
      return {
        ...ward,
        open,
        closed,
        total: wardComplaints.length,
        compliance
      };
    }).sort((a, b) => b.open - a.open);
  }, [complaints]);

  // Department Leaderboard Data
  const leaderboardData = useMemo(() => {
    const list = DEPARTMENTS.map((dept, idx) => {
      const deptComplaints = complaints.filter((c) => c.departmentId === dept.id);
      const fixed = deptComplaints.filter((c) => c.status === 'fixed' || c.status === 'verified').length;
      const slaRate = 92 + (idx * 3) % 7;
      const avgHours = 8 + (idx * 4) % 18;
      const rating = +(4.2 + (idx * 0.1) % 0.7).toFixed(1);

      return {
        id: dept.id,
        name: dept.name.en,
        color: dept.color,
        headOfficer: dept.headOfficer,
        slaRate,
        avgHours,
        rating,
        totalCases: deptComplaints.length + 15
      };
    });

    if (leaderboardSort === 'sla') {
      return list.sort((a, b) => b.slaRate - a.slaRate);
    } else if (leaderboardSort === 'time') {
      return list.sort((a, b) => a.avgHours - b.avgHours);
    } else {
      return list.sort((a, b) => b.rating - a.rating);
    }
  }, [complaints, leaderboardSort]);

  // Trending issues this week
  const trendingIssues = [
    { name: 'Pothole & Asphalt Settling', trend: '+18%', isUp: true, category: 'Roads & Potholes' },
    { name: 'Monsoon Silt Inflow in Drains', trend: '+24%', isUp: true, category: 'Drainage & Sewerage' },
    { name: 'Garbage Collection Backlogs', trend: '-14%', isUp: false, category: 'Solid Waste' },
    { name: 'Street Light Feeder Tripping', trend: '-8%', isUp: false, category: 'Street Lighting' }
  ];

  // Live feed ticker events
  const liveEvents = [
    'Pothole cluster sealed & resurfaced on Station West Road (Ward A) • 2h ago',
    'Sewage suction operation completed in Central Market (Ward B) • 3h ago',
    'Pipeline joint welded on Cyber Blvd (Ward C) • 4h ago',
    'Fallen tree pruned away on Hill View Road (Ward D) • 5h ago',
    'Street light feeder box energized (Ward E) • 6h ago'
  ];

  // Export CSV function
  const handleDownloadReport = () => {
    const headers = 'Ticket ID,Title,Department,Ward,Urgency,Status,Created At,SLA Deadline\n';
    const rows = complaints
      .slice(0, 100)
      .map(
        (c) =>
          `"${c.id}","${c.title.replace(/"/g, '""')}","${getDepartmentById(c.departmentId).name.en}","${c.wardId}","${c.urgency}","${c.status}","${c.createdAt}","${c.slaDeadline}"`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `CivicRoute_Municipal_Grievance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Municipal Open Data CSV report downloaded successfully.', 'success');
  };

  // Choropleth color based on open count
  const getWardColor = (openCount: number) => {
    if (openCount > 8) return '#FF5C5C'; // Coral high density
    if (openCount > 5) return '#FFB020'; // Amber medium
    if (openCount > 2) return '#2DE2C4'; // Teal
    return '#38BDF8';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header & Export Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300 text-xs font-mono font-medium mb-2">
            <Radio className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>Public Open Data & Municipal Performance Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            Civic Transparency Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time urban governance metrics, ward-by-ward compliance leaderboards, and photographic completion verification.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs sm:text-sm transition active:scale-95 shadow-xl"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#2DE2C4]" />
          <span>Download Municipal Report (CSV)</span>
        </button>
      </div>

      {/* Live Feed Anonymised Ticker Strip */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 overflow-hidden shadow-inner">
        <span className="px-2.5 py-1 rounded-lg bg-[#2DE2C4]/20 text-[#2DE2C4] font-mono text-xs font-bold shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LIVE RESOLUTIONS</span>
        </span>
        <div className="flex-1 overflow-x-auto whitespace-nowrap text-xs text-slate-300 space-x-8 font-mono">
          {liveEvents.map((event, idx) => (
            <span key={idx} className="inline-block">
              ✓ {event}
            </span>
          ))}
        </div>
      </div>

      {/* Hero KPI Strip with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-white mb-1">
            {totalComplaints}
          </div>
          <span className="text-xs font-mono font-bold uppercase text-[#2DE2C4] tracking-wider">
            Total Complaints Filed
          </span>
          <p className="text-xs text-slate-400 mt-2">100% verified via GPS coordinates</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-400 mb-1">
            {resolvedPct}%
          </div>
          <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
            Resolved & Verified Rate
          </span>
          <p className="text-xs text-slate-400 mt-2">Certified photographic proof required</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-300 mb-1">
            {avgResolutionHours} <span className="text-base font-normal text-slate-400">hours</span>
          </div>
          <span className="text-xs font-mono font-bold uppercase text-amber-300 tracking-wider">
            Avg. Resolution Turnaround
          </span>
          <p className="text-xs text-slate-400 mt-2">Down from 72h manual dispatch</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-violet-300 mb-1">
            {slaMetPct}%
          </div>
          <span className="text-xs font-mono font-bold uppercase text-violet-300 tracking-wider">
            Guaranteed SLA Met
          </span>
          <p className="text-xs text-slate-400 mt-2">Automated Executive escalation</p>
        </div>
      </div>

      {/* Section: Department Leaderboard */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Municipal Engineering Department Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by on-time resolution, average repair speed, and citizen satisfaction scores
            </p>
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setLeaderboardSort('sla')}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                leaderboardSort === 'sla'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Highest SLA %
            </button>
            <button
              onClick={() => setLeaderboardSort('time')}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                leaderboardSort === 'time'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fastest Speed
            </button>
            <button
              onClick={() => setLeaderboardSort('rating')}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                leaderboardSort === 'rating'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Citizen Rating
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4 w-12 text-center">Rank</th>
                  <th className="p-4 font-bold text-white">Department</th>
                  <th className="p-4">Executive Lead</th>
                  <th className="p-4">SLA Compliance</th>
                  <th className="p-4">Avg. Resolution</th>
                  <th className="p-4">Citizen Rating</th>
                  <th className="p-4 text-right">30-Day Caseload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboardData.map((dept, idx) => (
                  <tr key={dept.id} className="hover:bg-white/5 transition">
                    <td className="p-4 text-center font-mono font-bold text-white">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 inline-flex items-center justify-center font-bold text-xs shadow-md shadow-amber-400/30">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 inline-flex items-center justify-center font-bold text-xs">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white inline-flex items-center justify-center font-bold text-xs">
                          3
                        </span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="font-bold text-white text-xs">{dept.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{dept.headOfficer}</td>
                    <td className="p-4">
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {dept.slaRate}%
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-200">{dept.avgHours} hours</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{dept.rating}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400">
                      {dept.totalCases} cases
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section: Ward GIS Heatmap & Ward Rankings */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2DE2C4]" />
            <span>Ward-Level Grievance Density & Choropleth Heatmap</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic concentration of open civic work orders across the 8 municipal zones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Choropleth Map (2 cols) */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 h-80 sm:h-96 shadow-2xl relative">
            <MapContainer
              center={[19.308, 72.85]}
              zoom={13}
              scrollWheelZoom={false}
              className={`h-full w-full ${theme === 'dark' ? 'brightness-90 invert-[0.88] hue-rotate-180 contrast-125' : ''}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {wardStats.map((ward) => {
                const isSelected = selectedWardForInspect === ward.id;
                const color = getWardColor(ward.open);

                return (
                  <Polygon
                    key={ward.id}
                    positions={ward.bounds}
                    eventHandlers={{
                      click: () => setSelectedWardForInspect(ward.id)
                    }}
                    pathOptions={{
                      color: isSelected ? '#FFFFFF' : color,
                      weight: isSelected ? 3 : 2,
                      fillColor: color,
                      fillOpacity: isSelected ? 0.45 : 0.25
                    }}
                  >
                    <Tooltip sticky>
                      <div className="p-1 text-xs">
                        <p className="font-bold">{ward.name} ({ward.code})</p>
                        <p className="text-slate-600">Open Work Orders: {ward.open}</p>
                        <p className="text-slate-600">SLA Met: {ward.compliance}%</p>
                      </div>
                    </Tooltip>
                  </Polygon>
                );
              })}
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] p-2.5 rounded-xl bg-[#0B1020]/90 backdrop-blur-md border border-white/10 text-[10px] space-y-1">
              <span className="font-mono text-slate-400 uppercase block font-bold">Open Density</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#FF5C5C]" /> High (8+)
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#FFB020]" /> Medium (5-7)
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#2DE2C4]" /> Low (1-4)
                </span>
              </div>
            </div>
          </div>

          {/* Ward Ranking List (1 col) */}
          <div className="p-5 rounded-3xl glass-panel space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Ward Performance List
              </span>
              <span className="text-[11px] font-mono text-slate-400">8 Wards</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
              {wardStats.map((ward) => (
                <div
                  key={ward.id}
                  onClick={() => setSelectedWardForInspect(ward.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedWardForInspect === ward.id
                      ? 'bg-amber-400/15 border-amber-400/50 text-white'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold truncate">{ward.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Councillor: {ward.councillor}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-white block">
                      {ward.open} open
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {ward.compliance}% SLA
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 font-mono text-center">
              Click a ward row to highlight its boundary polygon
            </p>
          </div>
        </div>
      </section>

      {/* Section: Trending Issues & Recently Resolved Slider */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most reported issues this week (1 col) */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white">
            Most Reported Issues This Week
          </h3>
          <p className="text-xs text-slate-400">Emerging infrastructure pinch-points</p>

          <div className="space-y-3 pt-2">
            {trendingIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{issue.name}</h4>
                  <span className="text-[10px] text-slate-400">{issue.category}</span>
                </div>
                <div
                  className={`flex items-center gap-1 font-mono text-xs font-bold ${
                    issue.isUp ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {issue.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{issue.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Resolved Showcase with Before/After Slider (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recently Verified Public Resolution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                CR-2026-001045: Sidewalk commercial waste removal verified by citizens
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Resolved in 6h
            </span>
          </div>

          <BeforeAfterSlider
            beforeUrl="https://picsum.photos/seed/garbage_pile_1045/600/400"
            afterUrl="https://picsum.photos/seed/clean_street_1045/600/400"
          />
        </div>
      </section>
    </div>
  );
};
