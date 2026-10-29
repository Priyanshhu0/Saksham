import { useState, useEffect } from 'react';
import { sakshamStore } from '../services/storage';

export function useSakshamStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = sakshamStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    store: sakshamStore,
    activeUser: sakshamStore.getActiveUser(),
    users: sakshamStore.getUsers(),
    institutions: sakshamStore.getInstitutions(),
    applications: sakshamStore.getApplications(),
    documents: sakshamStore.getDocuments(),
    evcVisits: sakshamStore.getEvcVisits(),
    undertakings: sakshamStore.getUndertakings(),
    notifications: sakshamStore.getNotifications(),
    auditEvents: sakshamStore.getAuditEvents(),
    workflowRules: sakshamStore.getWorkflowRules(),
    settings: sakshamStore.getSettings(),
  };
}
