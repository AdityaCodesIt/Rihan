import React, { useState, useMemo } from 'react';
import {
  Table,
  Kanban,
  Filter,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Complaint, ComplaintStatus, Urgency } from '../../types';
import { useStore } from '../../store/useStore';
import { DEPARTMENTS, getDepartmentById } from '../../data/departments';
import { WARDS } from '../../data/wards';
import { DepartmentChip } from '../common/DepartmentChip';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { BulkActionBar } from './BulkActionBar';

interface InboxTabProps {
  onSelectComplaint: (c: Complaint) => void;
  externalSearch?: string;
}

export const InboxTab: React.FC<InboxTabProps> = ({ onSelectComplaint, externalSearch = '' }) => {
  const complaints = useStore((state) => state.complaints);
  const selectedOfficerDept = useStore((state) => state.selectedOfficerDepartment);

  // View Mode: Table vs Kanban
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Filters
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('all');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(externalSearch);

  // Sorting
  const [sortBy, setSortBy] = useState<'createdAt' | 'urgency' | 'slaDeadline'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Sync external search
  React.useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Exclude triage low-confidence tickets from main inbox
      if (c.isLowConfidence && c.status === 'routed') return false;

      if (selectedDeptFilter !== 'all' && c.departmentId !== selectedDeptFilter) return false;
      if (selectedWardFilter !== 'all' && c.wardId !== selectedWardFilter) return false;
      if (selectedUrgencyFilter !== 'all' && c.urgency !== selectedUrgencyFilter) return false;
      if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchLoc = c.locationName.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchDesc && !matchLoc) return false;
      }

      return true;
    });
  }, [
    complaints,
    selectedDeptFilter,
    selectedWardFilter,
    selectedUrgencyFilter,
    selectedStatusFilter,
    searchQuery
  ]);

  // Sort complaints
  const sortedComplaints = useMemo(() => {
    const urgencyWeight: Record<Urgency, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    return [...filteredComplaints].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'urgency') {
        comparison = urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
      } else if (sortBy === 'slaDeadline') {
        comparison = new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filteredComplaints, sortBy, sortOrder]);

  // Paginated
  const totalPages = Math.ceil(sortedComplaints.length / pageSize) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedComplaints.slice(start, start + pageSize);
  }, [sortedComplaints, currentPage, pageSize]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedComplaints.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper for SLA bar percentage calculation
  const getSlaProgress = (created: string, deadline: string) => {
    const start = new Date(created).getTime();
    const end = new Date(deadline).getTime();
    const now = Date.now();
    const total = Math.max(1, end - start);
    const elapsed = now - start;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const isBreached = now > end;
    return { pct, isBreached };
  };

  const kanbanColumns: { id: ComplaintStatus; title: string; color: string }[] = [
    { id: 'received', title: 'New / Received', color: 'border-slate-500/40 text-slate-300' },
    { id: 'assigned', title: 'Assigned', color: 'border-sky-500/40 text-sky-400' },
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-400/40 text-amber-300' },
    { id: 'fixed', title: 'Fixed / Verification', color: 'border-emerald-500/40 text-emerald-400' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter and View Switcher Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Toggle & Counts */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Showing <strong className="text-white">{sortedComplaints.length}</strong> complaints
          </span>
        </div>

        {/* Right: Select dropdowns for filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={(e) => {
              setSelectedDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all" className="bg-[#0F172A]">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id} className="bg-[#0F172A]">
                {dept.name.en}
              </option>
            ))}
          </select>

          {/* Ward Filter */}
          <select
            value={selectedWardFilter}
            onChange={(e) => {
              setSelectedWardFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all" className="bg-[#0F172A]">All Wards</option>
            {WARDS.map((ward) => (
              <option key={ward.id} value={ward.id} className="bg-[#0F172A]">
                {ward.code}: {ward.name.split('-')[1] || ward.name}
              </option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgencyFilter}
            onChange={(e) => {
              setSelectedUrgencyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all" className="bg-[#0F172A]">All Urgencies</option>
            <option value="critical" className="bg-[#0F172A]">Critical</option>
            <option value="high" className="bg-[#0F172A]">High</option>
            <option value="medium" className="bg-[#0F172A]">Medium</option>
            <option value="low" className="bg-[#0F172A]">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all" className="bg-[#0F172A]">All Statuses</option>
            <option value="assigned" className="bg-[#0F172A]">Assigned</option>
            <option value="in_progress" className="bg-[#0F172A]">In Progress</option>
            <option value="fixed" className="bg-[#0F172A]">Fixed</option>
            <option value="escalated" className="bg-[#0F172A]">Escalated</option>
          </select>
        </div>
      </div>

      {/* Main View: Table vs Kanban */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedComplaints.length > 0 &&
                        selectedIds.length === paginatedComplaints.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Ticket ID</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Ward / Location</th>
                  <th className="p-3.5">
                    <button
                      onClick={() => {
                        setSortBy('urgency');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <span>Urgency</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="p-3.5">SLA Timeline Progress</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">
                    <button
                      onClick={() => {
                        setSortBy('createdAt');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <span>Age</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No complaints match the specified filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedComplaints.map((comp) => {
                    const isSelected = selectedIds.includes(comp.id);
                    const sla = getSlaProgress(comp.createdAt, comp.slaDeadline);
                    const hoursAgo = Math.floor(
                      (Date.now() - new Date(comp.createdAt).getTime()) / (1000 * 3600)
                    );

                    let barColor = 'bg-[#2DE2C4]'; // Teal
                    if (sla.isBreached) {
                      barColor = 'bg-[#FF5C5C]'; // Coral
                    } else if (sla.pct > 70) {
                      barColor = 'bg-[#FFB020]'; // Amber
                    }

                    return (
                      <tr
                        key={comp.id}
                        onClick={() => onSelectComplaint(comp)}
                        className={`hover:bg-white/5 cursor-pointer transition ${
                          isSelected ? 'bg-amber-400/5' : ''
                        }`}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelectRow(comp.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(comp.id)}
                            className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-mono font-bold text-white whitespace-nowrap">
                          {comp.id}
                        </td>
                        <td className="p-3.5">
                          <DepartmentChip departmentId={comp.departmentId} size="sm" />
                        </td>
                        <td className="p-3.5 max-w-[200px]">
                          <p className="font-semibold text-white truncate">{comp.locationName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Ward {comp.wardId.toUpperCase().replace('WARD-', '')}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <UrgencyBadge urgency={comp.urgency} />
                        </td>
                        <td className="p-3.5 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className={sla.isBreached ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                                {sla.isBreached ? 'EXPIRED' : `${Math.round(sla.pct)}% used`}
                              </span>
                              <span className="text-slate-400">
                                {new Date(comp.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${barColor}`}
                                style={{ width: `${Math.min(100, sla.pct)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                              comp.status === 'fixed' || comp.status === 'verified'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : comp.status === 'in_progress'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : comp.status === 'escalated'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {comp.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                          {hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page <strong className="text-white">{currentPage}</strong> of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colComplaints = sortedComplaints.filter((c) => {
              if (col.id === 'received') return c.status === 'received' || c.status === 'routed';
              if (col.id === 'assigned') return c.status === 'assigned';
              if (col.id === 'in_progress') return c.status === 'in_progress' || c.status === 'escalated';
              if (col.id === 'fixed') return c.status === 'fixed' || c.status === 'verified';
              return false;
            });

            return (
              <div
                key={col.id}
                className="p-3 rounded-2xl glass-panel flex flex-col gap-3 min-h-[500px]"
              >
                <div className={`flex items-center justify-between pb-2 border-b ${col.color}`}>
                  <span className="font-bold text-xs uppercase font-mono tracking-wider">
                    {col.title}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    {colComplaints.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[700px] pr-1">
                  {colComplaints.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Empty column
                    </div>
                  ) : (
                    colComplaints.map((comp) => (
                      <div
                        key={comp.id}
                        onClick={() => onSelectComplaint(comp)}
                        className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 cursor-pointer transition space-y-2 shadow-md group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white group-hover:text-amber-400 transition">
                            {comp.id}
                          </span>
                          <UrgencyBadge urgency={comp.urgency} showIcon={false} />
                        </div>

                        <p className="text-xs font-medium text-slate-200 line-clamp-2">
                          {comp.title}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <DepartmentChip departmentId={comp.departmentId} size="sm" />
                          <span className="text-[10px] font-mono text-slate-400">
                            Ward {comp.wardId.toUpperCase().replace('WARD-', '')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
      />
    </div>
  );
};
