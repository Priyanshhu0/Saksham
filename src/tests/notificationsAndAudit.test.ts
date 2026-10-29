import { describe, it, expect, beforeEach } from 'vitest';
import { sakshamStore } from '../services/storage';
import { DEMO_USERS } from '../services/seedData';

describe('AICTE SAKSHAM - Notifications, Escalation Simulator & Audit Logging', () => {
  beforeEach(() => {
    sakshamStore.resetToDefaults();
  });

  it('records immutable append-only audit events for stage transitions', () => {
    const initialCount = sakshamStore.getAuditEvents().length;
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;
    const apps = sakshamStore.getApplications();

    sakshamStore.advanceApplicationStage(
      apps[0].id,
      'PRELIMINARY_SCRUTINY',
      'Test audit event generation',
      roUser
    );

    const afterEvents = sakshamStore.getAuditEvents();
    expect(afterEvents.length).toBe(initialCount + 1);

    const latest = afterEvents[0];
    expect(latest.action).toBe('STAGE_TRANSITION');
    expect(latest.actorId).toBe(roUser.id);
    expect(latest.actorRole).toBe('REGIONAL_OFFICER');
    expect(latest.targetType).toBe('APPLICATION');
    expect(latest.details).toBe('Test audit event generation');
    expect(latest.timestamp).toBeDefined();
    expect(latest.ipAddress).toBeDefined();
  });

  it('generates notification for target role and marks as read', () => {
    const initialNotifs = sakshamStore.getNotifications().length;
    sakshamStore.createNotification({
      title: 'Hearing Scheduled Before SAC',
      message: 'Standing Appeals Committee review fixed for Friday 11:00 AM.',
      type: 'DEADLINE_ALERT',
      severity: 'WARNING',
      targetRole: 'REGIONAL_OFFICER',
    });

    const notifs = sakshamStore.getNotifications();
    expect(notifs.length).toBe(initialNotifs + 1);

    const created = notifs[0];
    expect(created.isRead).toBe(false);

    sakshamStore.markNotificationAsRead(created.id);
    const updated = sakshamStore.getNotifications().find((n) => n.id === created.id)!;
    expect(updated.isRead).toBe(true);
  });

  it('triggers simulated hackathon deadline alert with escalation level 2', () => {
    const initialNotifs = sakshamStore.getNotifications().length;
    const initialAudits = sakshamStore.getAuditEvents().length;

    sakshamStore.simulateDeadlineTrigger();

    const notifs = sakshamStore.getNotifications();
    expect(notifs.length).toBe(initialNotifs + 1);
    expect(notifs[0].title).toContain('DEMO ALERT: T-1 Day Deadline Critical Warning');
    expect(notifs[0].escalationLevel).toBe(2);

    const audits = sakshamStore.getAuditEvents();
    expect(audits.length).toBe(initialAudits + 1);
    expect(audits[0].action).toBe('TRIGGER_SIMULATED_ALERT');
  });

  it('resets all data back to seed state on demand', () => {
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;
    const apps = sakshamStore.getApplications();

    sakshamStore.advanceApplicationStage(apps[0].id, 'APPROVAL_ISSUED', 'Demo approval', roUser);
    expect(sakshamStore.getApplications().find((a) => a.id === apps[0].id)?.status).toBe('APPROVED');

    sakshamStore.resetToDefaults();
    const freshApps = sakshamStore.getApplications();
    // After reset, state should be restored to initial seed
    expect(freshApps.find((a) => a.id === apps[0].id)?.status).toBe('UNDER_SCRUTINY');
  });
});
