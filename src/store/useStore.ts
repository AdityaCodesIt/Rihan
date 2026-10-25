import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppTheme, Complaint, OfficerNotification, SupportedLanguage, UserRole } from '../types';
import { INITIAL_COMPLAINTS } from '../data/complaints';
import { getDepartmentById, getRandomOfficer } from '../data/departments';
import { WARDS } from '../data/wards';

export interface WeatherState {
  temperature: number;
  precipitation: number;
  isRaining: boolean;
  conditionText: string;
  loaded: boolean;
}

const INITIAL_OFFICER_NOTIFICATIONS: OfficerNotification[] = [
  {
    id: 'notif-1',
    title: 'SLA Warning: 45m Remaining',
    message: 'CR-2026-004812 (Station West potholes) has reached 80% SLA threshold.',
    timestamp: '12m ago',
    read: false,
    ticketId: 'CR-2026-004812',
    type: 'escalation'
  },
  {
    id: 'notif-2',
    title: 'Triage Queue: 3 New Low-Confidence Cases',
    message: 'Unclear citizen input requires human dispatch verification.',
    timestamp: '35m ago',
    read: false,
    type: 'triage'
  },
  {
    id: 'notif-3',
    title: 'SLA Breached & Escalated',
    message: 'CR-2026-003190 auto-escalated to Executive Engineer Er. Nitin More.',
    timestamp: '2h ago',
    read: true,
    ticketId: 'CR-2026-003190',
    type: 'escalation'
  }
];

interface CivicStore {
  language: SupportedLanguage;
  theme: AppTheme;
  activeRole: UserRole;
  liveWeather: WeatherState;
  complaints: Complaint[];
  
  // Officer Console State
  selectedOfficerDepartment: string;
  selectedOfficerName: string;
  notifications: OfficerNotification[];

  // Actions
  setLanguage: (lang: SupportedLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setActiveRole: (role: UserRole) => void;
  setLiveWeather: (weather: WeatherState) => void;
  setOfficerDepartment: (deptId: string, officerName?: string) => void;
  markNotificationRead: (id: string) => void;
  
  // Complaint Actions
  addComplaint: (complaint: Complaint) => void;
  getComplaint: (id: string) => Complaint | undefined;
  incrementAffected: (id: string) => void;
  confirmResolved: (id: string, rating?: number, comment?: string) => void;
  reopenComplaint: (id: string, reason: string) => void;
  toggleWhatsAppNotification: (id: string) => void;
  addPhotoToComplaint: (id: string, photoUrl: string) => void;

  // Officer Console Actions
  startWork: (id: string) => void;
  uploadProofPhoto: (id: string, photoUrl: string) => void;
  reassignComplaint: (id: string, newDeptId: string, reason: string) => void;
  markResolvedByOfficer: (id: string, proofPhotoUrl?: string) => void;
  bulkAssign: (ids: string[], departmentId: string) => void;
  triageAssign: (id: string, departmentId: string) => void;
  triageReassign: (id: string, departmentId: string, reason: string) => void;
  triageMarkSpam: (id: string) => void;
  escalateComplaint: (id: string) => void;
  nudgeOfficer: (id: string) => void;

  // Simulator / Demo Controls
  simulateNewComplaint: () => Complaint;
  simulateSlaBreach: () => void;
  resetDemoData: () => void;
}

export const useStore = create<CivicStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'dark',
      activeRole: 'citizen',
      liveWeather: {
        temperature: 31,
        precipitation: 0,
        isRaining: false,
        conditionText: '31°C Fair',
        loaded: false
      },
      complaints: INITIAL_COMPLAINTS,
      selectedOfficerDepartment: 'roads',
      selectedOfficerName: 'Er. Rajesh Deshmukh',
      notifications: INITIAL_OFFICER_NOTIFICATIONS,

      setLanguage: (lang) => set({ language: lang }),
      
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
      },

      setActiveRole: (role) => set({ activeRole: role }),

      setLiveWeather: (weather) => set({ liveWeather: weather }),

      setOfficerDepartment: (deptId, officerName) => {
        const dept = getDepartmentById(deptId);
        set({
          selectedOfficerDepartment: deptId,
          selectedOfficerName: officerName || dept.headOfficer
        });
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      addComplaint: (complaint) => {
        set((state) => ({
          complaints: [complaint, ...state.complaints],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `New Grievance: ${complaint.id}`,
              message: `${complaint.title.slice(0, 45)}... assigned to ${complaint.assignedOfficer.name}.`,
              timestamp: 'Just now',
              read: false,
              ticketId: complaint.id,
              type: 'assignment'
            },
            ...state.notifications
          ]
        }));
      },

      getComplaint: (id) => {
        const list = get().complaints;
        const normalized = id.trim().toUpperCase();
        return list.find(
          (c) =>
            c.id.toUpperCase() === normalized ||
            c.id.replace(/-/g, '').toUpperCase() === normalized.replace(/-/g, '')
        );
      },

      incrementAffected: (id) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return { ...c, affectedCount: c.affectedCount + 1 };
            }
            return c;
          })
        }));
      },

      confirmResolved: (id, rating = 5, comment = 'Verified by citizen') => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                status: 'verified',
                feedback: {
                  rating,
                  comment,
                  submittedAt: new Date().toISOString()
                },
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'verified',
                    title: 'Citizen Verified & Closed',
                    timestamp: 'Just now',
                    description: `Citizen verified on-site completion. Rating: ${rating}/5.`,
                    actor: 'Citizen'
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      reopenComplaint: (id, reason) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                status: 'in_progress',
                reopenHistory: [
                  ...(c.reopenHistory || []),
                  { reason, reopenedAt: new Date().toISOString() }
                ],
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'in_progress',
                    title: 'Citizen Disputed Resolution - Reopened',
                    timestamp: 'Just now',
                    description: `Reopened reason: ${reason}. Escalated to Ward Supervisor.`,
                    actor: 'Citizen Dispute'
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      toggleWhatsAppNotification: (id) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return { ...c, userNotifiedViaWhatsApp: !c.userNotifiedViaWhatsApp };
            }
            return c;
          })
        }));
      },

      addPhotoToComplaint: (id, photoUrl) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                timeline: [
                  ...c.timeline,
                  {
                    stage: c.status,
                    title: 'Supplementary Citizen Photo Added',
                    timestamp: 'Just now',
                    description: 'Citizen attached recent site photo evidence.',
                    actor: 'Citizen'
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      // Officer Console actions
      startWork: (id) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                status: 'in_progress',
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'in_progress',
                    title: 'Field Team Deployed on Site',
                    timestamp: 'Just now',
                    description: 'Inspection team arrived with repair equipment and material.',
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      uploadProofPhoto: (id, photoUrl) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                afterPhotoUrl: photoUrl,
                timeline: [
                  ...c.timeline,
                  {
                    stage: c.status,
                    title: 'Certified Completion Photo Uploaded',
                    timestamp: 'Just now',
                    description: 'Field engineer uploaded on-site verification photo proof.',
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      reassignComplaint: (id, newDeptId, reason) => {
        const newDept = getDepartmentById(newDeptId);
        const newOfficer = getRandomOfficer(newDeptId);
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                departmentId: newDeptId,
                assignedOfficer: newOfficer,
                isLowConfidence: false,
                status: 'assigned',
                reassignHistory: [
                  ...(c.reassignHistory || []),
                  {
                    fromDept: c.departmentId,
                    toDept: newDeptId,
                    reason,
                    timestamp: new Date().toISOString()
                  }
                ],
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'assigned',
                    title: `Reassigned to ${newDept.name.en}`,
                    timestamp: 'Just now',
                    description: `Reason: ${reason}. Dispatched to ${newOfficer.name}.`,
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      markResolvedByOfficer: (id, proofPhotoUrl) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              const after =
                proofPhotoUrl ||
                c.afterPhotoUrl ||
                `https://picsum.photos/seed/civic_fixed_${id.replace(/[^0-9]/g, '') || '999'}/600/400`;
              return {
                ...c,
                status: 'fixed',
                afterPhotoUrl: after,
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'fixed',
                    title: 'Work Completed by Field Crew',
                    timestamp: 'Just now',
                    description: 'Action verified and after-photo submitted. Ticket awaiting citizen confirmation.',
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      bulkAssign: (ids, departmentId) => {
        const dept = getDepartmentById(departmentId);
        const officer = getRandomOfficer(departmentId);
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (ids.includes(c.id)) {
              return {
                ...c,
                departmentId,
                assignedOfficer: officer,
                isLowConfidence: false,
                status: 'assigned',
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'assigned',
                    title: `Bulk Dispatched to ${dept.name.en}`,
                    timestamp: 'Just now',
                    description: `Batch assigned by supervisory console to ${officer.name}.`,
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      triageAssign: (id, departmentId) => {
        const dept = getDepartmentById(departmentId);
        const officer = getRandomOfficer(departmentId);
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                departmentId,
                assignedOfficer: officer,
                isLowConfidence: false,
                status: 'assigned',
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'assigned',
                    title: `Human Triage Approved -> ${dept.name.en}`,
                    timestamp: 'Just now',
                    description: `Triage officer confirmed classification. Assigned to ${officer.name}.`,
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      triageReassign: (id, departmentId, reason) => {
        get().reassignComplaint(id, departmentId, reason);
      },

      triageMarkSpam: (id) => {
        set((state) => ({
          complaints: state.complaints.filter((c) => c.id !== id)
        }));
      },

      escalateComplaint: (id) => {
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              const levels: NonNullable<Complaint['escalationLevel']>[] = [
                'officer',
                'assistant_engineer',
                'executive_engineer',
                'commissioner'
              ];
              const curIdx = levels.indexOf(c.escalationLevel || 'officer');
              const nextLevel = levels[Math.min(levels.length - 1, curIdx + 1)] || 'commissioner';
              const levelNames: Record<NonNullable<Complaint['escalationLevel']>, string> = {
                officer: 'Ward Junior Officer',
                assistant_engineer: 'Assistant Engineer (AE)',
                executive_engineer: 'Executive Engineer (EE)',
                commissioner: 'Municipal Additional Commissioner'
              };

              return {
                ...c,
                isEscalated: true,
                status: 'escalated',
                escalationLevel: nextLevel,
                escalatedTo: levelNames[nextLevel],
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'escalated',
                    title: `Escalated to ${levelNames[nextLevel]}`,
                    timestamp: 'Just now',
                    description: `Urgent priority escalation triggered. Department head alerted.`,
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          })
        }));
      },

      nudgeOfficer: (id) => {
        const comp = get().getComplaint(id);
        if (!comp) return;
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                timeline: [
                  ...c.timeline,
                  {
                    stage: c.status,
                    title: 'Official Nudge Issued',
                    timestamp: 'Just now',
                    description: `Automated ping sent to field officer ${c.assignedOfficer.name} via SMS.`,
                    actor: state.selectedOfficerName
                  }
                ]
              };
            }
            return c;
          }),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `Officer Nudged for ${comp.id}`,
              message: `High urgency ping dispatched to ${comp.assignedOfficer.name}.`,
              timestamp: 'Just now',
              read: false,
              ticketId: comp.id,
              type: 'escalation'
            },
            ...state.notifications
          ]
        }));
      },

      // Simulator Methods
      simulateNewComplaint: () => {
        const ticketNum = Math.floor(100000 + Math.random() * 900000);
        const id = `CR-2026-${ticketNum}`;
        const ward = WARDS[Math.floor(Math.random() * WARDS.length)];
        const depts = ['roads', 'drainage', 'solid-waste', 'electrical', 'water-supply'];
        const chosenDeptId = depts[Math.floor(Math.random() * depts.length)];
        const dept = getDepartmentById(chosenDeptId);
        const officer = getRandomOfficer(chosenDeptId);

        const newComp: Complaint = {
          id,
          title: `Simulated: Urgent civic grievance in ${ward.name}`,
          description: `Live simulated citizen report logged via mobile web near ${ward.officeAddress}. Fast-tracked by AI routing.`,
          departmentId: chosenDeptId,
          wardId: ward.id,
          locationName: `${ward.name}, Sector ${Math.floor(Math.random() * 6) + 1}`,
          coordinates: [
            ward.center[0] + (Math.random() - 0.5) * 0.005,
            ward.center[1] + (Math.random() - 0.5) * 0.005
          ],
          urgency: 'high',
          status: 'assigned',
          createdAt: new Date().toISOString(),
          slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          photoUrl: `https://picsum.photos/seed/civic_sim_${ticketNum}/600/400`,
          assignedOfficer: officer,
          affectedCount: 3,
          userNotifiedViaWhatsApp: true,
          timeline: [
            {
              stage: 'received',
              title: 'Live Grievance Submitted',
              timestamp: 'Just now',
              description: 'Captured via CivicRoute citizen interface.',
              actor: 'Citizen Live Sim'
            },
            {
              stage: 'routed',
              title: `AI Routed to ${dept.name.en}`,
              timestamp: 'Just now',
              description: 'Confidence 95%. Automated dispatch executed.',
              actor: 'Autonomous Router'
            }
          ]
        };

        get().addComplaint(newComp);
        return newComp;
      },

      simulateSlaBreach: () => {
        const open = get().complaints.find(
          (c) => c.status !== 'fixed' && c.status !== 'verified' && !c.isEscalated
        );
        if (open) {
          set((state) => ({
            complaints: state.complaints.map((c) => {
              if (c.id === open.id) {
                return {
                  ...c,
                  isEscalated: true,
                  status: 'escalated',
                  escalationLevel: 'executive_engineer',
                  escalatedTo: 'Executive Engineer',
                  slaDeadline: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
                  timeline: [
                    ...c.timeline,
                    {
                      stage: 'escalated',
                      title: 'Simulated SLA Breached -> Escalated',
                      timestamp: 'Just now',
                      description: 'Overdue by 3h 30m. Transferred to Executive Engineer emergency queue.',
                      actor: 'SLA Watchdog'
                    }
                  ]
                };
              }
              return c;
            }),
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: `EMERGENCY SLA BREACH: ${open.id}`,
                message: `Ticket ${open.id} passed SLA threshold. Auto-escalated to Executive Engineer.`,
                timestamp: 'Just now',
                read: false,
                ticketId: open.id,
                type: 'escalation'
              },
              ...state.notifications
            ]
          }));
        }
      },

      resetDemoData: () => {
        set({
          complaints: INITIAL_COMPLAINTS,
          notifications: INITIAL_OFFICER_NOTIFICATIONS
        });
      }
    }),
    {
      name: 'civicroute_storage_v1',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        complaints: state.complaints,
        selectedOfficerDepartment: state.selectedOfficerDepartment,
        selectedOfficerName: state.selectedOfficerName
      })
    }
  )
);
