import type {
  UserProfile,
  Institution,
  Application,
  ApplicationDocument,
  EvcVisit,
  ComplianceUndertaking,
  AuditEvent,
  NotificationItem,
  WorkflowRule,
  NotificationSettings,
  StageId,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_INSTITUTIONS,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_EVC_VISITS,
  INITIAL_UNDERTAKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_EVENTS,
  WORKFLOW_RULES,
  INITIAL_SETTINGS,
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'aicte_saksham_users',
  ACTIVE_USER: 'aicte_saksham_active_user',
  INSTITUTIONS: 'aicte_saksham_institutions',
  APPLICATIONS: 'aicte_saksham_applications',
  DOCUMENTS: 'aicte_saksham_documents',
  EVC_VISITS: 'aicte_saksham_evc_visits',
  UNDERTAKINGS: 'aicte_saksham_undertakings',
  NOTIFICATIONS: 'aicte_saksham_notifications',
  AUDIT_EVENTS: 'aicte_saksham_audit_events',
  WORKFLOW_RULES: 'aicte_saksham_workflow_rules',
  SETTINGS: 'aicte_saksham_settings',
};

class SakshamDataStore {
  private listeners: Set<() => void> = new Set();

  private activeUser: UserProfile = { ...DEMO_USERS[0] };
  private users: UserProfile[] = JSON.parse(JSON.stringify(DEMO_USERS));
  private institutions: Institution[] = JSON.parse(JSON.stringify(INITIAL_INSTITUTIONS));
  private applications: Application[] = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
  private documents: ApplicationDocument[] = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
  private evcVisits: EvcVisit[] = JSON.parse(JSON.stringify(INITIAL_EVC_VISITS));
  private undertakings: ComplianceUndertaking[] = JSON.parse(JSON.stringify(INITIAL_UNDERTAKINGS));
  private notifications: NotificationItem[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  private auditEvents: AuditEvent[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_EVENTS));
  private workflowRules: WorkflowRule[] = JSON.parse(JSON.stringify(WORKFLOW_RULES));
  private settings: NotificationSettings = { ...INITIAL_SETTINGS };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const storedActiveUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (storedActiveUser) this.activeUser = JSON.parse(storedActiveUser);

      const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (storedApps) this.applications = JSON.parse(storedApps);

      const storedInsts = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
      if (storedInsts) this.institutions = JSON.parse(storedInsts);

      const storedDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (storedDocs) this.documents = JSON.parse(storedDocs);

      const storedEvc = localStorage.getItem(STORAGE_KEYS.EVC_VISITS);
      if (storedEvc) this.evcVisits = JSON.parse(storedEvc);

      const storedUtk = localStorage.getItem(STORAGE_KEYS.UNDERTAKINGS);
      if (storedUtk) this.undertakings = JSON.parse(storedUtk);

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) this.notifications = JSON.parse(storedNotifs);

      const storedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT_EVENTS);
      if (storedAudit) this.auditEvents = JSON.parse(storedAudit);

      const storedRules = localStorage.getItem(STORAGE_KEYS.WORKFLOW_RULES);
      if (storedRules) this.workflowRules = JSON.parse(storedRules);

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) this.settings = JSON.parse(storedSettings);
    } catch (e) {
      console.warn('Storage parse error, resetting state:', e);
    }
  }

  private persist() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(this.activeUser));
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
        localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(this.institutions));
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(this.documents));
        localStorage.setItem(STORAGE_KEYS.EVC_VISITS, JSON.stringify(this.evcVisits));
        localStorage.setItem(STORAGE_KEYS.UNDERTAKINGS, JSON.stringify(this.undertakings));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
        localStorage.setItem(STORAGE_KEYS.AUDIT_EVENTS, JSON.stringify(this.auditEvents));
        localStorage.setItem(STORAGE_KEYS.WORKFLOW_RULES, JSON.stringify(this.workflowRules));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      } catch (e) {
        console.error('Storage write error:', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getActiveUser() { return this.activeUser; }
  public getUsers() { return this.users; }
  public getInstitutions() { return this.institutions; }
  public getApplications() { return this.applications; }
  public getDocuments() { return this.documents; }
  public getEvcVisits() { return this.evcVisits; }
  public getUndertakings() { return this.undertakings; }
  public getNotifications() { return this.notifications; }
  public getAuditEvents() { return this.auditEvents; }
  public getWorkflowRules() { return this.workflowRules; }
  public getSettings() { return this.settings; }

  // Persona switching
  public setActiveUser(user: UserProfile) {
    this.activeUser = user;
    this.appendAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'SWITCH_ACTIVE_ROLE',
      targetType: 'USER_ROLE',
      targetId: user.id,
      targetTitle: `${user.name} (${user.role})`,
      details: `Switched active dashboard session to ${user.designation}`,
    });
    this.persist();
  }

  // Audit event helper
  public appendAudit(event: Omit<AuditEvent, 'id' | 'timestamp' | 'ipAddress'>) {
    const newEvent: AuditEvent = {
      ...event,
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '164.100.58.' + Math.floor(Math.random() * 200 + 10),
    };
    this.auditEvents = [newEvent, ...this.auditEvents];
  }

  // Application Stage Transitions
  public advanceApplicationStage(
    appId: string,
    nextStage: StageId,
    comments: string,
    actor: UserProfile
  ) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    const previousStage = app.currentStage;
    app.currentStage = nextStage;
    app.lastUpdated = new Date().toISOString();

    if (nextStage === 'APPROVAL_ISSUED') {
      app.status = 'APPROVED';
    } else if (nextStage === 'REJECTED_CLOSED') {
      app.status = 'REJECTED';
    } else if (nextStage === 'DEFICIENCY_COMMUNICATION') {
      app.status = 'DEFICIENCY_REPORTED';
      app.deficiencyCount += 1;
    } else if (nextStage === 'EVC_SCHEDULED') {
      app.status = 'EVC_SCHEDULED';
    } else if (nextStage === 'PRELIMINARY_SCRUTINY') {
      app.status = 'UNDER_SCRUTINY';
    }

    app.stageHistory.push({
      stage: nextStage,
      enteredAt: new Date().toISOString(),
      actorName: actor.name,
      actorRole: actor.role,
      actionTaken: `Advanced to ${nextStage}`,
      comments,
      slaDays: 14,
      elapsedDays: 0,
      slaBreached: false,
    });

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'STAGE_TRANSITION',
      targetType: 'APPLICATION',
      targetId: app.id,
      targetTitle: `${app.applicationNumber} (${app.institutionName})`,
      previousState: previousStage,
      newState: nextStage,
      details: comments,
    });

    // Notify institution
    this.createNotification({
      title: `Application Stage Updated: ${nextStage}`,
      message: `Application ${app.applicationNumber} was moved to stage ${nextStage}. Remarks: ${comments}`,
      type: 'SYSTEM_UPDATE',
      severity: 'INFO',
      targetRole: 'INSTITUTION_USER',
      relatedApplicationId: app.id,
      relatedRecordType: 'APPLICATION',
    });

    this.persist();
  }

  public returnForDeficiency(appId: string, observationText: string, actor: UserProfile) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    const previousStage = app.currentStage;
    app.currentStage = 'DEFICIENCY_COMMUNICATION';
    app.status = 'DEFICIENCY_REPORTED';
    app.deficiencyCount += 1;
    app.pendingObservations += 1;
    app.lastUpdated = new Date().toISOString();

    app.stageHistory.push({
      stage: 'DEFICIENCY_COMMUNICATION',
      enteredAt: new Date().toISOString(),
      actorName: actor.name,
      actorRole: actor.role,
      actionTaken: 'Deficiency Communicated to Institution',
      comments: observationText,
      slaDays: 15,
      elapsedDays: 0,
      slaBreached: false,
    });

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'RETURN_FOR_DEFICIENCY',
      targetType: 'APPLICATION',
      targetId: app.id,
      targetTitle: `${app.applicationNumber} (${app.institutionName})`,
      previousState: previousStage,
      newState: 'DEFICIENCY_COMMUNICATION',
      details: `Deficiencies flagged: ${observationText}`,
    });

    this.createNotification({
      title: `Action Required: Deficiency Flagged in Application`,
      message: `AICTE has flagged deficiencies in ${app.applicationNumber}: "${observationText}". Provide rectification evidence within 15 days.`,
      type: 'DEFICIENCY_FLAG',
      severity: 'WARNING',
      targetRole: 'INSTITUTION_USER',
      relatedApplicationId: app.id,
      relatedRecordType: 'APPLICATION',
    });

    this.persist();
  }

  public resubmitApplication(appId: string, remarks: string, actor: UserProfile) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    const previousStage = app.currentStage;
    app.currentStage = 'RE_SCRUTINY';
    app.status = 'UNDER_SCRUTINY';
    app.pendingObservations = 0;
    app.lastUpdated = new Date().toISOString();

    app.stageHistory.push({
      stage: 'RE_SCRUTINY',
      enteredAt: new Date().toISOString(),
      actorName: actor.name,
      actorRole: actor.role,
      actionTaken: 'Institution Resubmission for Re-Scrutiny',
      comments: remarks,
      slaDays: 7,
      elapsedDays: 0,
      slaBreached: false,
    });

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'RESUBMIT_APPLICATION',
      targetType: 'APPLICATION',
      targetId: app.id,
      targetTitle: `${app.applicationNumber} (${app.institutionName})`,
      previousState: previousStage,
      newState: 'RE_SCRUTINY',
      details: remarks,
    });

    this.createNotification({
      title: `Application Resubmitted by Institution`,
      message: `${app.institutionName} has submitted rectification for ${app.applicationNumber}. Assigned for Re-Scrutiny.`,
      type: 'SYSTEM_UPDATE',
      severity: 'INFO',
      targetRole: 'REGIONAL_OFFICER',
      relatedApplicationId: app.id,
      relatedRecordType: 'APPLICATION',
    });

    this.persist();
  }

  public assignOfficer(appId: string, officerId: string, officerName: string, actor: UserProfile) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    const previousOfficer = app.assignedOfficerName;
    app.assignedOfficerId = officerId;
    app.assignedOfficerName = officerName;
    app.lastUpdated = new Date().toISOString();

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'ASSIGN_OFFICER',
      targetType: 'APPLICATION',
      targetId: app.id,
      targetTitle: app.applicationNumber,
      previousState: previousOfficer,
      newState: officerName,
      details: `Reassigned application review responsibility to ${officerName}`,
    });

    this.persist();
  }

  // EVC Operations
  public scheduleEvcVisit(visitData: Partial<EvcVisit>, actor: UserProfile) {
    const newVisit: EvcVisit = {
      id: `evc_${Date.now()}`,
      applicationId: visitData.applicationId || 'app_01',
      institutionId: visitData.institutionId || 'inst_01',
      institutionName: visitData.institutionName || 'Sample Institution',
      institutionCode: visitData.institutionCode || '1-000000',
      region: visitData.region || 'North-Western',
      scheduledDate: visitData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: visitData.scheduledTime || '10:00 AM IST',
      status: 'SCHEDULED',
      committeeMembers: visitData.committeeMembers || [
        {
          name: 'Prof. (Dr.) Rajesh K. Verma',
          designation: 'Professor, IIT Roorkee',
          organization: 'IIT Roorkee',
          roleInCommittee: 'Chairman',
        },
      ],
      checklist: visitData.checklist || [
        { id: 'chk_1', item: 'Verification of Carpet Area per APH norms', checked: false },
        { id: 'chk_2', item: 'Laboratory equipment physical inspection', checked: false },
        { id: 'chk_3', item: 'Faculty biometric attendance & cadre ratio', checked: false },
        { id: 'chk_4', item: 'Divyangjan accessibility & fire safety check', checked: false },
      ],
      reportSummary: visitData.reportSummary || '',
      followUpTasks: visitData.followUpTasks || ['Submit geo-tagged photographic report within 24 hours of visit'],
    };

    this.evcVisits = [newVisit, ...this.evcVisits];

    // Update application stage if pending EVC
    const app = this.applications.find((a) => a.id === newVisit.applicationId);
    if (app) {
      app.currentStage = 'EVC_SCHEDULED';
      app.status = 'EVC_SCHEDULED';
      app.lastUpdated = new Date().toISOString();
    }

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'SCHEDULE_EVC',
      targetType: 'EVC_VISIT',
      targetId: newVisit.id,
      targetTitle: `${newVisit.institutionName} EVC Visit`,
      previousState: 'PENDING_SCHEDULING',
      newState: 'SCHEDULED',
      details: `Scheduled visit for ${newVisit.scheduledDate} with ${newVisit.committeeMembers.length} committee members.`,
    });

    this.createNotification({
      title: 'EVC Visit Scheduled',
      message: `Physical EVC visit for ${newVisit.institutionName} is fixed for ${newVisit.scheduledDate}.`,
      type: 'EVC_UPDATE',
      severity: 'WARNING',
      targetRole: 'ALL',
      relatedApplicationId: newVisit.applicationId,
      relatedRecordType: 'EVC',
    });

    this.persist();
  }

  public completeEvcVisit(
    visitId: string,
    outcome: EvcVisit['visitOutcome'],
    reportSummary: string,
    actor: UserProfile
  ) {
    const visit = this.evcVisits.find((v) => v.id === visitId);
    if (!visit) return;

    visit.status = 'REPORT_SUBMITTED';
    visit.visitOutcome = outcome;
    visit.reportSummary = reportSummary;
    visit.conductedAt = new Date().toISOString();
    visit.reportUploadedAt = new Date().toISOString();

    const app = this.applications.find((a) => a.id === visit.applicationId);
    if (app) {
      app.currentStage = 'EVC_VISIT_CONDUCTED';
      app.status = 'EVC_COMPLETED';
      app.lastUpdated = new Date().toISOString();
    }

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'COMPLETE_EVC_VISIT',
      targetType: 'EVC_VISIT',
      targetId: visit.id,
      targetTitle: visit.institutionName,
      previousState: 'SCHEDULED',
      newState: 'REPORT_SUBMITTED',
      details: `Visit completed with outcome: ${outcome}. Summary: ${reportSummary}`,
    });

    this.persist();
  }

  public submitEvcReport(
    visitId: string,
    outcome: EvcVisit['visitOutcome'],
    reportSummary: string,
    actor: UserProfile
  ) {
    return this.completeEvcVisit(visitId, outcome, reportSummary, actor);
  }

  // Compliance Undertakings
  public submitUndertakingEvidence(
    utkId: string,
    docName: string,
    notes: string,
    actor: UserProfile
  ) {
    const utk = this.undertakings.find((u) => u.id === utkId);
    if (!utk) return;

    utk.status = 'SUBMITTED';
    utk.evidenceSubmitted = {
      documentName: docName,
      submittedAt: new Date().toISOString(),
      submissionNotes: notes,
      fileUrl: `/mock/docs/${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    };

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'SUBMIT_COMPLIANCE_EVIDENCE',
      targetType: 'UNDERTAKING',
      targetId: utk.id,
      targetTitle: utk.title,
      previousState: 'PENDING',
      newState: 'SUBMITTED',
      details: `Institution uploaded evidence: ${docName}. Remarks: ${notes}`,
    });

    this.createNotification({
      title: 'Compliance Evidence Submitted',
      message: `${utk.institutionName} has submitted evidence for "${utk.title}". Ready for Regional Officer review.`,
      type: 'COMPLIANCE_REMINDER',
      severity: 'INFO',
      targetRole: 'REGIONAL_OFFICER',
      relatedApplicationId: utk.applicationId,
      relatedRecordType: 'UNDERTAKING',
    });

    this.persist();
  }

  public verifyUndertaking(
    utkId: string,
    isApproved: boolean,
    notes: string,
    actor: UserProfile
  ) {
    const utk = this.undertakings.find((u) => u.id === utkId);
    if (!utk) return;

    const previousStatus = utk.status;
    utk.status = isApproved ? 'VERIFIED' : 'REJECTED_FOR_CORRECTION';
    utk.assignedVerifierId = actor.id;
    utk.assignedVerifierName = actor.name;
    utk.verificationNotes = notes;
    utk.verifiedAt = new Date().toISOString();

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: isApproved ? 'VERIFY_UNDERTAKING' : 'REJECT_UNDERTAKING_EVIDENCE',
      targetType: 'UNDERTAKING',
      targetId: utk.id,
      targetTitle: utk.title,
      previousState: previousStatus,
      newState: utk.status,
      details: `Official observation: ${notes}`,
    });

    this.createNotification({
      title: isApproved ? 'Compliance Undertaking Verified' : 'Compliance Evidence Returned for Correction',
      message: `Undertaking "${utk.title}" for ${utk.institutionName} marked ${utk.status}. Notes: ${notes}`,
      type: isApproved ? 'SYSTEM_UPDATE' : 'DEFICIENCY_FLAG',
      severity: isApproved ? 'SUCCESS' : 'WARNING',
      targetRole: 'INSTITUTION_USER',
      relatedApplicationId: utk.applicationId,
      relatedRecordType: 'UNDERTAKING',
    });

    this.persist();
  }

  // Document Registry
  public uploadDocument(
    doc: Omit<ApplicationDocument, 'id' | 'uploadedAt'>,
    actor: UserProfile
  ) {
    const newDoc: ApplicationDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    this.documents = [newDoc, ...this.documents];

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'UPLOAD_DOCUMENT',
      targetType: 'DOCUMENT',
      targetId: newDoc.id,
      targetTitle: newDoc.title,
      previousState: 'N/A',
      newState: 'PENDING',
      details: `Document type: ${newDoc.documentType}. File: ${newDoc.fileName} (${newDoc.fileSize})`,
    });

    this.persist();
  }

  public verifyDocument(
    docId: string,
    isVerified: boolean,
    notes: string,
    actor: UserProfile
  ) {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;

    doc.verificationStatus = isVerified ? 'VERIFIED' : 'REJECTED';
    doc.verifiedBy = actor.name;
    doc.verifiedAt = new Date().toISOString();
    doc.verificationNotes = notes;

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: isVerified ? 'VERIFY_DOCUMENT' : 'REJECT_DOCUMENT',
      targetType: 'DOCUMENT',
      targetId: doc.id,
      targetTitle: doc.title,
      previousState: 'PENDING',
      newState: doc.verificationStatus,
      details: notes,
    });

    this.persist();
  }

  public renewDocument(
    docId: string,
    newExpiryDate: string,
    newFileName: string,
    actor: UserProfile
  ) {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;

    const prevExpiry = doc.expiryDate;
    doc.expiryDate = newExpiryDate;
    doc.fileName = newFileName;
    doc.verificationStatus = 'PENDING';
    doc.daysToExpiry = Math.ceil((new Date(newExpiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'RENEW_DOCUMENT',
      targetType: 'DOCUMENT',
      targetId: doc.id,
      targetTitle: doc.title,
      previousState: `Expiry: ${prevExpiry}`,
      newState: `New Expiry: ${newExpiryDate}`,
      details: `Renewed certificate uploaded by ${actor.name}`,
    });

    this.persist();
  }

  // Create Application
  public createApplication(appData: Partial<Application>, actor: UserProfile): Application {
    const newApp: Application = {
      id: `app_${Date.now()}`,
      applicationNumber: `AICTE-2026-${(appData.region || 'NWRO').substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      institutionId: appData.institutionId || 'inst_01',
      institutionName: appData.institutionName || 'Delhi Institute of Technology & Management',
      institutionCode: appData.institutionCode || '1-33290141',
      category: appData.category || 'Engineering & Technology',
      academicYear: appData.academicYear || '2026-2027',
      region: appData.region || 'North-Western',
      state: appData.state || 'Haryana',
      approvalType: appData.approvalType || 'Extension of Approval (EoA)',
      workflowRoute: appData.workflowRoute || 'SCRUTINY_ONLY',
      currentStage: 'APPLICATION_SUBMITTED',
      status: 'SUBMITTED',
      riskLevel: appData.riskLevel || 'LOW',
      assignedOfficerId: 'usr_ro_01',
      assignedOfficerName: 'Er. Vikram Malhotra',
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      daysToDeadline: 14,
      isOverdue: false,
      intakeProposed: appData.intakeProposed || 300,
      intakeApprovedPrevious: appData.intakeApprovedPrevious || 300,
      programmesProposed: appData.programmesProposed || ['B.Tech Computer Science', 'B.Tech Information Technology'],
      deficiencyCount: 0,
      pendingObservations: 0,
      stageHistory: [
        {
          stage: 'APPLICATION_SUBMITTED',
          enteredAt: new Date().toISOString(),
          actorName: actor.name,
          actorRole: actor.role,
          actionTaken: 'Application Registered via AICTE SAKSHAM Portal',
          comments: 'Initial submission with uploaded statutory undertakings.',
          slaDays: 2,
          elapsedDays: 0,
          slaBreached: false,
        },
      ],
    };

    this.applications = [newApp, ...this.applications];

    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'SUBMIT_APPLICATION',
      targetType: 'APPLICATION',
      targetId: newApp.id,
      targetTitle: `${newApp.applicationNumber} (${newApp.institutionName})`,
      previousState: 'DRAFT',
      newState: 'SUBMITTED',
      details: `Submitted for AY ${newApp.academicYear} under route ${newApp.workflowRoute}`,
    });

    this.createNotification({
      title: 'New Application Submitted',
      message: `${newApp.institutionName} submitted ${newApp.applicationNumber} for approval route ${newApp.workflowRoute}.`,
      type: 'SYSTEM_UPDATE',
      severity: 'INFO',
      targetRole: 'REGIONAL_OFFICER',
      relatedApplicationId: newApp.id,
      relatedRecordType: 'APPLICATION',
    });

    this.persist();
    return newApp;
  }

  // Notifications
  public createNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.notifications = [newNotif, ...this.notifications];
    this.persist();
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
    }
  }

  public markNotificationRead(id: string) {
    this.markNotificationAsRead(id);
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.persist();
  }

  public markAllNotificationsRead() {
    this.markAllNotificationsAsRead();
  }

  // Settings & Rules
  public updateSettings(newSettings: Partial<NotificationSettings>, actor: UserProfile) {
    this.settings = { ...this.settings, ...newSettings };
    this.appendAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_SETTINGS',
      targetType: 'WORKFLOW_CONFIG',
      targetId: 'cfg_settings',
      targetTitle: 'AICTE SAKSHAM Notification Rules',
      details: 'Updated reminder intervals and automated escalation parameters.',
    });
    this.persist();
  }

  // Demonstration Alert Simulation for Hackathon Judges
  public simulateDeadlineTrigger(appId?: string) {
    const targetApp = appId
      ? this.applications.find((a) => a.id === appId)
      : this.applications.find((a) => a.isOverdue) || this.applications[0];

    if (!targetApp) return;

    this.createNotification({
      title: `⚡ DEMO ALERT: T-1 Day Deadline Critical Warning`,
      message: `Application ${targetApp.applicationNumber} (${targetApp.institutionName}) is within 24 hours of statutory SLA deadline. Escalated to Bureau Officer & RO.`,
      type: 'DEADLINE_ALERT',
      severity: 'CRITICAL',
      targetRole: 'ALL',
      relatedApplicationId: targetApp.id,
      relatedRecordType: 'APPLICATION',
      escalationLevel: 2,
    });

    this.appendAudit({
      actorId: this.activeUser.id,
      actorName: this.activeUser.name,
      actorRole: this.activeUser.role,
      action: 'TRIGGER_SIMULATED_ALERT',
      targetType: 'APPLICATION',
      targetId: targetApp.id,
      targetTitle: targetApp.applicationNumber,
      details: `Triggered automated SLA deadline alert simulator for live hackathon jury demonstration.`,
    });

    this.persist();
  }

  // Reset to seed data
  public resetToDefaults() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.activeUser = { ...DEMO_USERS[0] };
    this.users = JSON.parse(JSON.stringify(DEMO_USERS));
    this.institutions = JSON.parse(JSON.stringify(INITIAL_INSTITUTIONS));
    this.applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
    this.documents = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
    this.evcVisits = JSON.parse(JSON.stringify(INITIAL_EVC_VISITS));
    this.undertakings = JSON.parse(JSON.stringify(INITIAL_UNDERTAKINGS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.auditEvents = JSON.parse(JSON.stringify(INITIAL_AUDIT_EVENTS));
    this.workflowRules = JSON.parse(JSON.stringify(WORKFLOW_RULES));
    this.settings = { ...INITIAL_SETTINGS };
    this.persist();
  }
}

export const sakshamStore = new SakshamDataStore();
