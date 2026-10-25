import { Complaint } from '../types';
import { getDepartmentById } from './departments';
import { WARDS } from './wards';

// 3 Highlighted Demo Tickets for Tracker and Walkthrough
export const DEMO_TICKETS: Complaint[] = [
  {
    id: 'CR-2026-004812',
    title: 'Multiple deep potholes near Station West exit',
    description: 'Dangerous craters formed near the auto-rickshaw stand outside Station West. Several two-wheelers have skidded during evening rush hour. Water has accumulated inside making depth deceiving.',
    departmentId: 'roads',
    wardId: 'ward-a',
    locationName: 'Station West Exit Road, Opp. Platform 1 Gate, Ward A',
    coordinates: [19.3082, 72.8425],
    urgency: 'high',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // 14 hours ago
    slaDeadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(), // 10 hours left out of 24h
    photoUrl: 'https://picsum.photos/seed/pothole_crater_4812/600/400',
    assignedOfficer: {
      id: 'off-roads-2',
      name: 'Suresh Patil',
      designation: 'Assistant Road Inspector',
      phone: '+91 98202 89312',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SureshPatil',
      departmentId: 'roads',
      wardId: 'ward-b'
    },
    affectedCount: 14,
    userNotifiedViaWhatsApp: true,
    timeline: [
      {
        stage: 'received',
        title: 'Complaint Registered',
        timestamp: '14 hours ago',
        description: 'Captured via Citizen Mobile Web. Geolocation verified in Ward A.',
        actor: 'CivicRoute Citizen Portal'
      },
      {
        stage: 'routed',
        title: 'AI Classification & Duplicate Check',
        timestamp: '14 hours ago',
        description: 'Classified under "Roads & Potholes" with 96% confidence. Merged with 2 nearby citizen pings.',
        actor: 'CivicRoute AI Classifier v2.4'
      },
      {
        stage: 'assigned',
        title: 'Dispatched to Ward Field Officer',
        timestamp: '13 hours ago',
        description: 'Assigned to Assistant Road Inspector Suresh Patil. High Urgency SLA (24h) triggered.',
        actor: 'Automated Dispatcher'
      },
      {
        stage: 'in_progress',
        title: 'Cold-Mix Asphalt Team Deployed',
        timestamp: '3 hours ago',
        description: 'Work crew en route with jet-patcher equipment. Barricades positioned at auto stand.',
        actor: 'Suresh Patil'
      }
    ]
  },
  {
    id: 'CR-2026-003190',
    title: 'Severe storm drain overflow flooding market pedestrian lane',
    description: 'Black sludge water backed up from main manhole cover outside Vegetable Mandi. Entire footpath is submerged, creating unbearable stench and severe slipping hazard for pedestrians.',
    departmentId: 'drainage',
    wardId: 'ward-b',
    locationName: 'Ganesh Mandir Lane, Central Market, Ward B',
    coordinates: [19.3091, 72.8593],
    urgency: 'critical',
    status: 'escalated',
    isEscalated: true,
    escalationLevel: 'executive_engineer',
    escalatedTo: 'Er. Nitin More (Executive Engineer - Storm Water Drainage)',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 3.2 * 3600 * 1000).toISOString(), // Breached by 3h 12m
    photoUrl: 'https://picsum.photos/seed/drain_sludge_3190/600/400',
    assignedOfficer: {
      id: 'off-drain-1',
      name: 'Er. Nitin More',
      designation: 'Storm Water Drainage Lead',
      phone: '+91 98210 12890',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=NitinMore',
      departmentId: 'drainage',
      wardId: 'ward-b'
    },
    affectedCount: 29,
    userNotifiedViaWhatsApp: true,
    timeline: [
      {
        stage: 'received',
        title: 'Critical Alert Filed',
        timestamp: '8 hours ago',
        description: 'Citizen tagged heavy sewage outflow in commercial zone.',
        actor: 'Citizen Portal'
      },
      {
        stage: 'routed',
        title: 'Priority AI Boost (Monsoon Protocol)',
        timestamp: '8 hours ago',
        description: 'Urgency elevated to Critical (4h SLA) due to market density and standing blackwater.',
        actor: 'CivicRoute AI Engine'
      },
      {
        stage: 'assigned',
        title: 'Assigned to Ward B Drainage Unit',
        timestamp: '7.5 hours ago',
        description: 'Primary dispatch to de-silting suction truck crew #4.',
        actor: 'Dispatched'
      },
      {
        stage: 'escalated',
        title: 'SLA Breached - Auto-Escalated to Executive Engineer',
        timestamp: '2 hours ago',
        description: 'Critical 4h window expired without on-site resolution. Auto-escalated to Er. Nitin More with SMS alert.',
        actor: 'CivicRoute SLA Watchdog'
      }
    ]
  },
  {
    id: 'CR-2026-001045',
    title: 'Unattended municipal garbage dump on Cyber Road pavement',
    description: 'Commercial dry and wet waste dumped on pedestrian footpath. Stray dogs scattering bags into roadway. Completely blocking walking lane for morning commuters.',
    departmentId: 'solid-waste',
    wardId: 'ward-c',
    locationName: 'Pavement opposite Tech Point Tower, Sector 3, Ward C',
    coordinates: [19.3245, 72.8430],
    urgency: 'medium',
    status: 'fixed',
    createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    photoUrl: 'https://picsum.photos/seed/garbage_pile_1045/600/400',
    afterPhotoUrl: 'https://picsum.photos/seed/clean_street_1045/600/400',
    assignedOfficer: {
      id: 'off-waste-2',
      name: 'Sunita Gaikwad',
      designation: 'Ward Hygiene Officer',
      phone: '+91 98333 44872',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SunitaGaikwad',
      departmentId: 'solid-waste',
      wardId: 'ward-d'
    },
    affectedCount: 8,
    userNotifiedViaWhatsApp: true,
    timeline: [
      {
        stage: 'received',
        title: 'Waste Report Logged',
        timestamp: '32 hours ago',
        description: 'Photo submitted showing illegal sidewalk waste dumping.',
        actor: 'Citizen Portal'
      },
      {
        stage: 'routed',
        title: 'Auto-Routed to Solid Waste Unit',
        timestamp: '32 hours ago',
        description: 'Identified as Solid Waste with 98% confidence. Medium urgency assigned.',
        actor: 'CivicRoute AI'
      },
      {
        stage: 'assigned',
        title: 'Ward Hygiene Officer Assigned',
        timestamp: '30 hours ago',
        description: 'Assigned to Sunita Gaikwad. Scheduled for night compactor route.',
        actor: 'CivicRoute Dispatch'
      },
      {
        stage: 'in_progress',
        title: 'Compactor & Disinfection Team at Site',
        timestamp: '6 hours ago',
        description: 'Waste cleared with hydraulic compactor. Bleaching powder sprayed.',
        actor: 'Sunita Gaikwad'
      },
      {
        stage: 'fixed',
        title: 'Work Completed & After-Photo Uploaded',
        timestamp: '2 hours ago',
        description: 'Sidewalk fully cleared and sanitized. Awaiting citizen confirmation.',
        actor: 'Sunita Gaikwad'
      }
    ]
  }
];

// Generate 67 realistic additional complaints to reach 70 complaints
const REALISTIC_COMPLAINT_TEMPLATES = [
  {
    title: 'Damaged storm water drain cover posing danger',
    desc: 'Heavy iron grating is dislodged and cracked. Children and cyclists could fall inside.',
    dept: 'drainage',
    urgency: 'high'
  },
  {
    title: 'Street lights flickering and failing for 4 consecutive nights',
    desc: 'Entire block of 12 LED street lights is dark from 8 PM onwards, unsafe for evening walkers.',
    dept: 'electrical',
    urgency: 'medium'
  },
  {
    title: 'High pressure drinking water pipeline leaking on main road',
    desc: 'Treated drinking water gushing onto asphalt for past 8 hours, causing massive water wastage.',
    dept: 'water-supply',
    urgency: 'high'
  },
  {
    title: 'Illegal hawker encroachment blocking pedestrian crosswalk',
    desc: 'Temporary tarpaulin stalls erected directly over tactile tiles and pedestrian crossing zone.',
    dept: 'encroachment',
    urgency: 'medium'
  },
  {
    title: 'Fallen heavy tree branch obstructing half carriageway',
    desc: 'Gulmohar tree limb snapped during afternoon gusts and is blocking traffic heading towards highway.',
    dept: 'parks',
    urgency: 'high'
  },
  {
    title: 'Pack of aggressive stray dogs near public kindergarten',
    desc: 'Group of 6-7 unsterilized stray dogs barking and chasing two-wheelers and children near school gate.',
    dept: 'animals',
    urgency: 'medium'
  },
  {
    title: 'Missing traffic regulatory sign at blind turn intersection',
    desc: 'Stop and No Right Turn sign was knocked down by a truck last week and has not been replaced.',
    dept: 'traffic',
    urgency: 'medium'
  },
  {
    title: 'Open garbage burning producing toxic fumes in residential pocket',
    desc: 'Commercial dry leaf and plastic garbage set on fire in empty plot next to residential apartments.',
    dept: 'health',
    urgency: 'critical'
  },
  {
    title: 'Sparking transformer junction box near bus shelter',
    desc: 'Continuous audible sparking and smoke from exposed electrical distributor box next to bus stop.',
    dept: 'electrical',
    urgency: 'critical'
  },
  {
    title: 'Contaminated muddy tap water supply in housing colony',
    desc: 'Brownish, foul-smelling tap water supplied during morning 6 AM - 8 AM distribution window.',
    dept: 'water-supply',
    urgency: 'high'
  },
  {
    title: 'Large crater in road asphalt causing traffic crawl',
    desc: 'Sharp edges on asphalt pothole puncturing commuter tyres during morning peak commute.',
    dept: 'roads',
    urgency: 'high'
  },
  {
    title: 'Overflowing community dustbin attracting rodents',
    desc: 'Secondary collection bin has not been lifted for 4 days. Waste spilled over a 15-meter radius.',
    dept: 'solid-waste',
    urgency: 'medium'
  }
];

const generateAllComplaints = (): Complaint[] => {
  const list: Complaint[] = [...DEMO_TICKETS];
  const statuses: Complaint['status'][] = ['received', 'routed', 'assigned', 'in_progress', 'fixed', 'verified'];

  for (let i = 1; i <= 67; i++) {
    const template = REALISTIC_COMPLAINT_TEMPLATES[i % REALISTIC_COMPLAINT_TEMPLATES.length];
    const ward = WARDS[i % WARDS.length];
    const dept = getDepartmentById(template.dept);
    const officer = dept.officers[i % dept.officers.length];
    const status = statuses[i % statuses.length];
    const urgency = (i % 7 === 0 ? 'critical' : template.urgency) as Complaint['urgency'];
    const hoursAgo = (i * 3) % 120 + 1;
    const createdAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
    const slaTotalHours = dept.slaHours[urgency];
    const slaDeadline = new Date(Date.now() - hoursAgo * 3600 * 1000 + slaTotalHours * 3600 * 1000).toISOString();
    const isBreached = new Date(slaDeadline) < new Date() && status !== 'fixed' && status !== 'verified';

    // Jitter around ward center
    const latOffset = ((i % 10) - 5) * 0.0022;
    const lngOffset = (((i * 3) % 10) - 5) * 0.0022;
    const lat = ward.center[0] + latOffset;
    const lng = ward.center[1] + lngOffset;

    const isLowConfidence = i % 9 === 0;
    const escalationLevels: Complaint['escalationLevel'][] = ['officer', 'assistant_engineer', 'executive_engineer', 'commissioner'];
    const escLevel = isBreached ? escalationLevels[i % escalationLevels.length] : undefined;
    const ticketNumber = (1000 + i).toString().padStart(6, '0');
    const id = `CR-2026-${ticketNumber}`;

    list.push({
      id,
      title: `${template.title} (#${i})`,
      description: `${template.desc} Reported near ${ward.name}. Immediate inspection and action requested by area residents.`,
      departmentId: dept.id,
      wardId: ward.id,
      locationName: `Near Landmark ${i + 12}, ${ward.name}`,
      coordinates: [lat, lng],
      urgency,
      status: isBreached ? 'escalated' : isLowConfidence ? 'routed' : status,
      isEscalated: isBreached,
      escalatedTo: isBreached ? dept.headOfficer : undefined,
      escalationLevel: escLevel,
      isLowConfidence,
      aiSuggestions: [
        { departmentId: dept.id, confidence: isLowConfidence ? 48 + (i % 10) : 88 + (i % 10) },
        { departmentId: (i % 2 === 0 ? 'drainage' : 'water-supply'), confidence: isLowConfidence ? 32 : 12 },
        { departmentId: 'solid-waste', confidence: isLowConfidence ? 20 : 6 }
      ],
      createdAt,
      slaDeadline,
      photoUrl: `https://picsum.photos/seed/civic_issue_${i}/600/400`,
      afterPhotoUrl: status === 'fixed' || status === 'verified' ? `https://picsum.photos/seed/civic_fixed_${i}/600/400` : undefined,
      assignedOfficer: officer,
      affectedCount: (i % 11) + 1,
      userNotifiedViaWhatsApp: i % 2 === 0,
      timeline: [
        {
          stage: 'received',
          title: 'Registered by Citizen',
          timestamp: `${hoursAgo}h ago`,
          description: 'Logged through CivicRoute portal with GPS coordinates.',
          actor: 'Citizen Portal'
        },
        {
          stage: 'routed',
          title: `Routed to ${dept.name.en}`,
          timestamp: `${Math.max(1, hoursAgo - 1)}h ago`,
          description: `AI confidence 94%. Matched Ward ${ward.code}.`,
          actor: 'AI Routing Engine'
        },
        {
          stage: 'assigned',
          title: 'Assigned to Field Inspector',
          timestamp: `${Math.max(1, hoursAgo - 2)}h ago`,
          description: `Dispatched to ${officer.name}.`,
          actor: officer.name
        }
      ]
    });
  }

  return list;
};

export const INITIAL_COMPLAINTS: Complaint[] = generateAllComplaints();
