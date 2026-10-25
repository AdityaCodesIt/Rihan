import React from 'react';
import {
  Inbox,
  HelpCircle,
  Map as MapIcon,
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  Radio
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export type OfficerTab = 'inbox' | 'triage' | 'map' | 'escalations' | 'analytics';

interface OfficerSidebarProps {
  activeTab: OfficerTab;
  onTabChange: (tab: OfficerTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const OfficerSidebar: React.FC<OfficerSidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse
}) => {
  const complaints = useStore((state) => state.complaints);

  // Badge counts
  const triageCount = complaints.filter((c) => c.isLowConfidence && c.status !== 'fixed' && c.status !== 'verified').length;
  const escalationCount = complaints.filter((c) => c.isEscalated && c.status !== 'fixed' && c.status !== 'verified').length;
  const activeCount = complaints.filter((c) => c.status !== 'fixed' && c.status !== 'verified').length;

  const navItems = [
    {
      id: 'inbox' as OfficerTab,
      label: 'Inbox',
      icon: Inbox,
      count: activeCount,
      countColor: 'bg-white/10 text-slate-300'
    },
    {
      id: 'triage' as OfficerTab,
      label: 'Triage Queue',
      icon: HelpCircle,
      count: triageCount,
      countColor: triageCount > 0 ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30' : 'bg-white/10 text-slate-400'
    },
    {
      id: 'map' as OfficerTab,
      label: 'Map View',
      icon: MapIcon
    },
    {
      id: 'escalations' as OfficerTab,
      label: 'Escalations',
      icon: AlertTriangle,
      count: escalationCount,
      countColor: escalationCount > 0 ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 animate-pulse' : 'bg-white/10 text-slate-400'
    },
    {
      id: 'analytics' as OfficerTab,
      label: 'Analytics',
      icon: BarChart3
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] sticky top-16 border-r border-white/10 bg-[#070B16] flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="p-3 flex flex-col gap-2">
        {/* Sidebar Header & Collapse Toggle */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-2 py-2 mb-2`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                Console V2
              </span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'justify-between'
                } px-3 py-2.5 rounded-xl transition text-xs font-medium group ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30 shadow-md shadow-amber-400/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.count !== undefined && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${item.countColor}`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>ULB DISPATCH NODE</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Connected to 8 Wards
          </p>
        </div>
      )}
    </aside>
  );
};
