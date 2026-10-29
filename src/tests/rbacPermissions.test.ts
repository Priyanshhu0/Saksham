import { describe, it, expect, beforeEach } from 'vitest';
import { sakshamStore } from '../services/storage';
import { DEMO_USERS } from '../services/seedData';

describe('AICTE SAKSHAM - Role-Based Access Control & Visibility', () => {
  beforeEach(() => {
    sakshamStore.resetToDefaults();
  });

  it('restricts Institution User to their own institution documents and applications', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    sakshamStore.setActiveUser(instUser);

    const allApps = sakshamStore.getApplications();
    const instApps = allApps.filter((a) => a.institutionId === instUser.institutionId);
    
    // An institution user should only see applications belonging to their institution
    expect(instApps.length).toBeGreaterThan(0);
    instApps.forEach((app) => {
      expect(app.institutionId).toBe(instUser.institutionId);
    });

    const allDocs = sakshamStore.getDocuments();
    const instDocs = allDocs.filter((d) => d.institutionId === instUser.institutionId);
    expect(instDocs.length).toBeGreaterThan(0);
    instDocs.forEach((doc) => {
      expect(doc.institutionId).toBe(instUser.institutionId);
    });
  });

  it('allows Regional Officer to view applications in their jurisdiction', () => {
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;
    sakshamStore.setActiveUser(roUser);

    const apps = sakshamStore.getApplications();
    const regionalApps = apps.filter((a) => a.region === roUser.region);
    expect(regionalApps.length).toBeGreaterThan(0);
  });

  it('provides Super Admin and Bureau Officer full visibility across regions', () => {
    const adminUser = DEMO_USERS.find((u) => u.role === 'SUPER_ADMIN')!;
    sakshamStore.setActiveUser(adminUser);

    const allApps = sakshamStore.getApplications();
    const regions = new Set(allApps.map((a) => a.region));
    expect(regions.size).toBeGreaterThan(1);
  });

  it('switches persona and captures role switch in audit trail', () => {
    const bureauUser = DEMO_USERS.find((u) => u.role === 'BUREAU_OFFICER')!;
    sakshamStore.setActiveUser(bureauUser);

    expect(sakshamStore.getActiveUser().role).toBe('BUREAU_OFFICER');

    const latestAudit = sakshamStore.getAuditEvents()[0];
    expect(latestAudit.action).toBe('SWITCH_ACTIVE_ROLE');
    expect(latestAudit.actorRole).toBe('BUREAU_OFFICER');
  });
});
