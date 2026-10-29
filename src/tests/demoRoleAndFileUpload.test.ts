import { describe, it, expect, beforeEach } from 'vitest';
import { sakshamStore } from '../services/storage';
import { DEMO_USERS } from '../services/seedData';

describe('Demo Role Persona and PC File Upload Workflow', () => {
  beforeEach(() => {
    sakshamStore.resetToDefaults();
  });

  it('allows switching to each demo role and retains active user details', () => {
    for (const demoUser of DEMO_USERS) {
      sakshamStore.setActiveUser(demoUser);
      const current = sakshamStore.getActiveUser();
      expect(current.role).toBe(demoUser.role);
      expect(current.name).toBe(demoUser.name);
      expect(current.email).toBe(demoUser.email);
    }
  });

  it('uploads a statutory document from PC to the vault with audit trail', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    sakshamStore.setActiveUser(instUser);

    const initialDocsCount = sakshamStore.getDocuments().length;

    sakshamStore.uploadDocument(
      {
        applicationId: 'app_01',
        institutionId: instUser.institutionId!,
        documentType: 'Fire NOC',
        title: 'State Fire Service NOC Certificate 2026-2027',
        fileName: 'Fire_NOC_Authenticated_2026.pdf',
        fileSize: '3.4 MB',
        uploadedBy: instUser.name,
        expiryDate: '2028-06-30',
        verificationStatus: 'PENDING',
        renewalStatus: 'VALID',
        fileUrl: '#',
      },
      instUser
    );

    const updatedDocs = sakshamStore.getDocuments();
    expect(updatedDocs.length).toBe(initialDocsCount + 1);

    const uploaded = updatedDocs[0];
    expect(uploaded.title).toBe('State Fire Service NOC Certificate 2026-2027');
    expect(uploaded.fileName).toBe('Fire_NOC_Authenticated_2026.pdf');
    expect(uploaded.fileSize).toBe('3.4 MB');

    // Audit event recorded
    const latestAudit = sakshamStore.getAuditEvents()[0];
    expect(latestAudit.action).toBe('UPLOAD_DOCUMENT');
    expect(latestAudit.actorName).toBe(instUser.name);
  });

  it('submits statutory compliance evidence with PC file attachment', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    sakshamStore.setActiveUser(instUser);

    const undertakings = sakshamStore.getUndertakings();
    const targetUtk = undertakings[0];

    sakshamStore.submitUndertakingEvidence(
      targetUtk.id,
      'RTGS_Faculty_Salary_Oct2026.pdf',
      'Affidavit affirmed by Chairman with bank statement attached.',
      instUser
    );

    const updatedUtk = sakshamStore.getUndertakings().find((u) => u.id === targetUtk.id)!;
    expect(updatedUtk.evidenceSubmitted).toBeDefined();
    expect(updatedUtk.evidenceSubmitted?.documentName).toBe('RTGS_Faculty_Salary_Oct2026.pdf');
    expect(updatedUtk.status).toBe('SUBMITTED');
  });
});

