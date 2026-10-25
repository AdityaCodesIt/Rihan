import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { DEPARTMENTS, getDepartmentById } from '../../data/departments';
import {
  Bell,
  Search,
  Check,
  AlertTriangle,
  UserCheck,
  ChevronDown,
  X
} from 'lucide-react';

interface OfficerTopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTicket?: (ticketId: string) => void;
}

export const OfficerTopBar: React.FC<OfficerTopBarProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTicket
}) => {
  const selectedDeptId = useStore((state) => state.selectedOfficerDepartment);
  const selectedOfficerName = useStore((state) => state.selectedOfficerName);
  const setOfficerDepartment = useStore((state) => state.setOfficerDepartment);
  const notifications = useStore((state) => state.notifications);
  const markNotificationRead = useStore((state) => state.markNotificationRead);

  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);

  const currentDept = getDepartmentById(selectedDeptId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-16 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-16 z-20">
      {/* Left: Department & Officer Switcher */}
      <div className="relative">
        <button
          onClick={() => setDeptMenuOpen(!deptMenuOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left"
          aria-label="Select officer role"
        >
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: currentDept.color }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              Viewing console as
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentDept.name.en}</span>
              <span className="text-slate-400 font-normal">({selectedOfficerName})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </span>
          </div>
        </button>

        {/* Dropdown Menu */}
        {deptMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDeptMenuOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-72 max-h-96 overflow-y-auto py-1.5 rounded-2xl bg-[#0F172A] border border-white/15 shadow-2xl z-50 backdrop-blur-2xl">
              <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-400 border-b border-white/5">
                Switch Department Role
              </div>
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setOfficerDepartment(dept.id, dept.headOfficer);
                    setDeptMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition border-b border-white/5 last:border-0 ${
                    selectedDeptId === dept.id
                      ? 'bg-amber-400/10 text-amber-300 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <div>
                      <p className="font-semibold">{dept.name.en}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{dept.headOfficer}</p>
                    </div>
                  </div>
                  {selectedDeptId === dept.id && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Middle: Quick Search Input */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets by ID, ward, keywords, officer..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/60 font-mono transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Notification Bell Dropdown */}
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setNotifMenuOpen(!notifMenuOpen)}
          className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center border-2 border-[#0B1020] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Popover */}
        {notifMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setNotifMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 top-full w-80 sm:w-96 rounded-2xl bg-[#0F172A] border border-white/15 shadow-2xl z-50 overflow-hidden backdrop-blur-2xl">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Dispatch Notifications
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {unreadCount} unread
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">
                    No new dispatch notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.ticketId && onSelectTicket) {
                          onSelectTicket(n.ticketId);
                          setNotifMenuOpen(false);
                        }
                      }}
                      className={`p-3.5 text-left text-xs transition cursor-pointer hover:bg-white/5 ${
                        !n.read ? 'bg-amber-400/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          {n.type === 'escalation' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="line-clamp-1">{n.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
