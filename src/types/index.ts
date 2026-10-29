export type Role =
  | 'INSTITUTION_USER'
  | 'REGIONAL_OFFICER'
  | 'BUREAU_OFFICER'
  | 'EVC_MEMBER'
  | 'COMPETENT_AUTHORITY'
  | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  institutionId?: string;
  institutionName?: string;
  region: string;
  designation: string;
  avatar: string;
  phone: string;
}

export type User = UserProfile;

export type ApprovalType =
  | 'Extension of Approval (EoA)'
  | 'New Institution Approval'
  | 'Introduction of New Course'
  | 'Increase in Intake'
  | 'Change of Site/Location'
  | 'Conversion to Co-Ed';

export type WorkflowRoute =
  | 'SCRUTINY_ONLY'
  | 'SCRUTINY_EVC'
  | 'EVC_SAC'
  | 'SCRUTINY_EVC_SAC'
  | 'EVC_ONLY';

export type StageId =
  | 'APPLICATION_SUBMITTED'
  | 'PRELIMINARY_SCRUTINY'
  | 'DEFICIENCY_COMMUNICATION'
  | 'RE_SCRUTINY'
  | 'PENDING_EVC'
  | 'EVC_SCHEDULED'
  | 'EVC_VISIT_CONDUCTED'
  | 'SAC_SHC_REVIEW'
  | 'COMPETENT_AUTHORITY_DECISION'
  | 'APPROVAL_ISSUED'
  | 'REJECTED_CLOSED';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'DEFICIENCY_REPORTED'
  | 'PENDING_EVC'
  | 'EVC_SCHEDULED'
  | 'EVC_COMPLETED'
  | 'PENDING_SAC'
  | 'APPROVED'
  | 'REJECTED'
  | 'ON_HOLD';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Institution {
  id: string;
  code: string;
  name: string;
  category: 'Engineering & Technology' | 'Management' | 'Pharmacy' | 'Architecture' | 'Applied Arts';
  type: 'Government' | 'Govt-Aided' | 'Private-Unaided' | 'Deemed University';
  region: 'Northern' | 'North-Western' | 'Western' | 'Central' | 'Eastern' | 'Southern' | 'South-Western';
  state: string;
  city: string;
  address: string;
  establishedYear: number;
  contactEmail: string;
  contactPhone: string;
  headOfInstitution: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  institutionId: string;
  documentType:
    | 'Land Lease / Ownership Deed'
    | 'Building Safety Certificate'
    | 'Fire NOC'
    | 'Occupancy Certificate'
    | 'Society Registration & MoA'
    | 'AICTE Prior EoA'
    | 'Faculty AICTE-Pay Scale Undertaking'
    | 'Corpus Fund FD Certificate';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  expiryDate?: string;
  daysToExpiry?: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  fileUrl: string;
  renewalStatus?: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWAL_SUBMITTED' | 'VERIFIED';
  isExpired?: boolean;
}

export interface ObservationRecord {
  id: string;
  applicationId: string;
  stage: StageId;
  officerName: string;
  officerRole: Role;
  type: 'DEFICIENCY' | 'QUERY' | 'CLARIFICATION' | 'NOTE';
  observation: string;
  mandatoryResolution: boolean;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolutionRemarks?: string;
}

export interface EvcVisit {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  institutionCode: string;
  region: string;
  scheduledDate: string;
  scheduledTime: string;
  status:
    | 'PENDING_SCHEDULING'
    | 'PROPOSED'
    | 'SCHEDULED'
    | 'CONDUCTED'
    | 'POSTPONED'
    | 'REPORT_SUBMITTED'
    | 'CONFIRMED'
    | 'COMPLETED';
  committeeMembers: Array<{
    name: string;
    designation: string;
    organization: string;
    roleInCommittee: 'Chairman' | 'Member Expert' | 'AICTE Representative';
  }>;
  checklist: Array<{
    id: string;
    item: string;
    checked: boolean;
    remarks?: string;
  }>;
  visitOutcome?: 'RECOMMENDED' | 'DEFICIENCIES_FOUND' | 'REJECTED' | 'REVISIT_REQUIRED';
  reportSummary?: string;
  conductedAt?: string;
  reportUploadedAt?: string;
  followUpTasks?: string[];
}

export interface ComplianceUndertaking {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  institutionCode: string;
  title: string;
  description: string;
  issuedDate: string;
  dueDate: string;
  daysRemaining: number;
  status:
    | 'PENDING'
    | 'DUE_SOON'
    | 'SUBMITTED'
    | 'UNDER_VERIFICATION'
    | 'VERIFIED'
    | 'REJECTED_FOR_CORRECTION'
    | 'OVERDUE';
  evidenceRequired: string;
  evidenceSubmitted?: {
    documentName: string;
    submittedAt: string;
    submissionNotes: string;
    fileUrl: string;
  };
  assignedVerifierId?: string;
  assignedVerifierName?: string;
  verificationNotes?: string;
  verifiedAt?: string;
  remindersSent: number;
  lastReminderDate?: string;
  escalationLevel: 0 | 1 | 2 | 3;
  undertakingType?: string;
  submissionStatus?: 'PENDING' | 'SUBMITTED' | 'OVERDUE';
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface StageHistoryItem {
  stage: StageId;
  enteredAt: string;
  exitedAt?: string;
  actorName: string;
  actorRole: Role;
  actionTaken: string;
  comments: string;
  slaDays: number;
  elapsedDays: number;
  slaBreached: boolean;
}

export interface Application {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  institutionCode: string;
  category: Institution['category'];
  academicYear: string;
  region: Institution['region'];
  state: string;
  approvalType: ApprovalType;
  workflowRoute: WorkflowRoute;
  currentStage: StageId;
  status: ApplicationStatus;
  riskLevel: RiskLevel;
  assignedOfficerId: string;
  assignedOfficerName: string;
  submittedAt: string;
  lastUpdated: string;
  deadlineDate: string;
  daysToDeadline: number;
  isOverdue: boolean;
  intakeProposed: number;
  intakeApprovedPrevious: number;
  programmesProposed: string[];
  stageHistory: StageHistoryItem[];
  deficiencyCount: number;
  pendingObservations: number;
  submittedDate?: string;
  deficiencyObservations?: Array<{
    id?: string;
    category?: string;
    details?: string;
    date?: string;
    status?: string;
    [key: string]: any;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'DEADLINE_ALERT' | 'OVERDUE_ESCALATION' | 'EVC_UPDATE' | 'COMPLIANCE_REMINDER' | 'DEFICIENCY_FLAG' | 'SYSTEM_UPDATE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  targetRole: Role | 'ALL';
  targetUserId?: string;
  relatedApplicationId?: string;
  relatedRecordType?: 'APPLICATION' | 'EVC' | 'UNDERTAKING' | 'DOCUMENT';
  isRead: boolean;
  createdAt: string;
  escalationLevel?: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  targetType: 'APPLICATION' | 'EVC_VISIT' | 'UNDERTAKING' | 'DOCUMENT' | 'WORKFLOW_CONFIG' | 'USER_ROLE';
  targetId: string;
  targetTitle: string;
  previousState?: string;
  newState?: string;
  details: string;
  ipAddress: string;
}

export interface WorkflowRule {
  id: string;
  route: WorkflowRoute;
  name: string;
  description: string;
  stages: StageId[];
  slaDaysPerStage: Record<StageId, number>;
  isActive: boolean;
}

export interface NotificationSettings {
  reminderDaysBeforeDeadline: number[];
  escalationGracePeriodDays: number;
  autoEscalateOverdue: boolean;
  emailNotificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  allowManualTrigger: boolean;
}
