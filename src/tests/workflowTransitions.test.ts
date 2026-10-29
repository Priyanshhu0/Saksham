import { describe, it, expect, beforeEach } from 'vitest';
import { sakshamStore } from '../services/storage';
import { DEMO_USERS } from '../services/seedData';

describe('AICTE SAKSHAM - Workflow State Transitions', () => {
  beforeEach(() => {
    sakshamStore.resetToDefaults();
  });

  it('correctly initializes seed applications with valid routes', () => {
    const apps = sakshamStore.getApplications();
    expect(apps.length).toBeGreaterThan(0);
    const validRoutes = ['SCRUTINY_ONLY', 'SCRUTINY_EVC', 'EVC_SAC', 'SCRUTINY_EVC_SAC', 'EVC_ONLY'];
    apps.forEach((app) => {
      expect(validRoutes).toContain(app.workflowRoute);
      expect(app.stageHistory.length).toBeGreaterThan(0);
    });
  });

  it('advances application stage and updates status and stage history', () => {
    const apps = sakshamStore.getApplications();
    const app = apps[0];
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;

    sakshamStore.advanceApplicationStage(
      app.id,
      'PRELIMINARY_SCRUTINY',
      'Preliminary document scrutiny commenced by Regional Officer',
      roUser
    );

    const updated = sakshamStore.getApplications().find((a) => a.id === app.id)!;
    expect(updated.currentStage).toBe('PRELIMINARY_SCRUTINY');
    expect(updated.status).toBe('UNDER_SCRUTINY');
    
    const lastHistory = updated.stageHistory[updated.stageHistory.length - 1];
    expect(lastHistory.stage).toBe('PRELIMINARY_SCRUTINY');
    expect(lastHistory.actorName).toBe(roUser.name);
    expect(lastHistory.comments).toContain('Preliminary document scrutiny');
  });

  it('records deficiency communication and marks status DEFICIENCY_REPORTED', () => {
    const apps = sakshamStore.getApplications();
    const app = apps[0];
    const initialDeficiencies = app.deficiencyCount;
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;

    sakshamStore.returnForDeficiency(
      app.id,
      'Fire NOC renewal certificate missing registration stamp.',
      roUser
    );

    const updated = sakshamStore.getApplications().find((a) => a.id === app.id)!;
    expect(updated.currentStage).toBe('DEFICIENCY_COMMUNICATION');
    expect(updated.status).toBe('DEFICIENCY_REPORTED');
    expect(updated.deficiencyCount).toBe(initialDeficiencies + 1);
    expect(updated.pendingObservations).toBeGreaterThan(0);
  });

  it('allows institution to resubmit application after deficiency rectification', () => {
    const apps = sakshamStore.getApplications();
    const app = apps[0];
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;

    // Return for deficiency
    sakshamStore.returnForDeficiency(app.id, 'Missing Fire NOC', roUser);

    // Resubmit
    sakshamStore.resubmitApplication(
      app.id,
      'Uploaded renewed Fire NOC with municipal authority stamp.',
      instUser
    );

    const updated = sakshamStore.getApplications().find((a) => a.id === app.id)!;
    expect(updated.currentStage).toBe('RE_SCRUTINY');
    expect(updated.status).toBe('UNDER_SCRUTINY');
    expect(updated.pendingObservations).toBe(0);
  });

  it('creates a new application with proper initial status and audit trail', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    const newApp = sakshamStore.createApplication(
      {
        institutionName: 'Aryabhatta Institute of Applied Science',
        institutionCode: '1-99887766',
        category: 'Engineering & Technology',
        approvalType: 'Extension of Approval (EoA)',
        workflowRoute: 'SCRUTINY_EVC',
        intakeProposed: 420,
      },
      instUser
    );

    expect(newApp.id).toBeDefined();
    expect(newApp.currentStage).toBe('APPLICATION_SUBMITTED');
    expect(newApp.status).toBe('SUBMITTED');
    expect(newApp.stageHistory.length).toBe(1);

    // Verify it is in stored applications
    const found = sakshamStore.getApplications().find((a) => a.id === newApp.id);
    expect(found).toBeDefined();
  });
});
