import React, { useState } from 'react';
import { OfficerSidebar, OfficerTab } from '../components/officer/OfficerSidebar';
import { OfficerTopBar } from '../components/officer/OfficerTopBar';
import { InboxTab } from '../components/officer/InboxTab';
import { TriageTab } from '../components/officer/TriageTab';
import { OfficerMapView } from '../components/officer/OfficerMapView';
import { EscalationsTab } from '../components/officer/EscalationsTab';
import { AnalyticsTab } from '../components/officer/AnalyticsTab';
import { OfficerDrawer } from '../components/officer/OfficerDrawer';
import { Complaint } from '../types';
import { useStore } from '../store/useStore';

export const OfficerConsolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OfficerTab>('inbox');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const getComplaint = useStore((state) => state.getComplaint);

  const handleSelectTicketById = (ticketId: string) => {
    const comp = getComplaint(ticketId);
    if (comp) {
      setSelectedComplaint(comp);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B16] text-slate-100">
      <div className="flex flex-1">
        {/* Collapsible Left Sidebar */}
        <OfficerSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Department Selector, Search, Notifications */}
          <OfficerTopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectTicket={handleSelectTicketById}
          />

          {/* Active Tab View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'inbox' && (
              <InboxTab
                onSelectComplaint={(c) => setSelectedComplaint(c)}
                externalSearch={searchQuery}
              />
            )}

            {activeTab === 'triage' && <TriageTab />}

            {activeTab === 'map' && (
              <OfficerMapView
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'escalations' && (
              <EscalationsTab
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsTab />}
          </main>
        </div>
      </div>

      {/* Right Slide-over Complaint Details Drawer */}
      <OfficerDrawer
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
};
