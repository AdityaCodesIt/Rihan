export type Urgency = 'critical' | 'high' | 'medium' | 'low';

export type ComplaintStatus = 
  | 'received'
  | 'routed'
  | 'assigned'
  | 'in_progress'
  | 'fixed'
  | 'verified'
  | 'escalated';

export interface Officer {
  id: string;
  name: string;
  designation: string;
  phone: string;
  avatar: string;
  departmentId: string;
  wardId: string;
}

export interface Department {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  icon: string;
  color: string;
  slaHours: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  headOfficer: string;
  officers: Officer[];
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  population: string;
  councillor: string;
  officeAddress: string;
  bounds: [number, number][]; // [lat, lng] polygon vertices
  center: [number, number];
}

export interface ChildTicket {
  id: string;
  departmentId: string;
  departmentName: string;
  scope: string;
  officer: Officer;
  slaDeadline: string;
}

export interface RoutingClassification {
  primaryDepartmentId: string;
  confidence: number;
  categoryTags: string[];
  isMultiDepartment: boolean;
  secondaryDepartmentId?: string;
  isOutOfJurisdiction: boolean;
  jurisdictionAuthority?: {
    name: string;
    type: string;
    helpline: string;
    portalUrl: string;
  };
  isLowConfidence: boolean;
  urgency: Urgency;
  urgencyReasons: string[];
  duplicateCount: number;
  mergedDuplicates: string[];
  estimatedSlaHours: number;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  wardId: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  urgency: Urgency;
  status: ComplaintStatus;
  createdAt: string;
  slaDeadline: string;
  photoUrl: string;
  afterPhotoUrl?: string;
  assignedOfficer: Officer;
  affectedCount: number;
  userNotifiedViaWhatsApp: boolean;
  timeline: {
    stage: ComplaintStatus;
    title: string;
    timestamp: string;
    description: string;
    actor?: string;
  }[];
  childTickets?: ChildTicket[];
  isEscalated?: boolean;
  escalatedTo?: string;
  escalationLevel?: 'officer' | 'assistant_engineer' | 'executive_engineer' | 'commissioner';
  isLowConfidence?: boolean;
  aiSuggestions?: { departmentId: string; confidence: number }[];
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
  reopenHistory?: {
    reason: string;
    reopenedAt: string;
  }[];
  reassignHistory?: {
    fromDept: string;
    toDept: string;
    reason: string;
    timestamp: string;
  }[];
}

export interface OfficerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  ticketId?: string;
  type?: 'escalation' | 'assignment' | 'triage' | 'verification';
}

export type SupportedLanguage = 'en' | 'hi' | 'mr';
export type AppTheme = 'dark' | 'light';
export type UserRole = 'citizen' | 'officer' | 'public';

