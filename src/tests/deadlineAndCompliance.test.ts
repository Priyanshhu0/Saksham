import { describe, it, expect, beforeEach } from 'vitest';
import { sakshamStore } from '../services/storage';
import { DEMO_USERS } from '../services/seedData';

describe('AICTE SAKSHAM - Deadlines, Lease Expiry & Compliance Monitoring', () => {
  beforeEach(() => {
    sakshamStore.resetToDefaults();
  });

  it('correctly categorizes documents approaching expiry into 30, 60, and 90 day bands', () => {
    const docs = sakshamStore.getDocuments();
    
    const expired = docs.filter((d) => (d.daysToExpiry !== undefined && d.daysToExpiry <= 0) || d.verificationStatus === 'EXPIRED');
    const within30 = docs.filter((d) => d.daysToExpiry !== undefined && d.daysToExpiry > 0 && d.daysToExpiry <= 30);
    const within60 = docs.filter((d) => d.daysToExpiry !== undefined && d.daysToExpiry > 30 && d.daysToExpiry <= 60);
    const within90 = docs.filter((d) => d.daysToExpiry !== undefined && d.daysToExpiry > 60 && d.daysToExpiry <= 90);

    expect(docs.length).toBeGreaterThan(0);
    expect(expired.length).toBeGreaterThan(0);
    expect(within30.length).toBeGreaterThan(0);
    expect(within60.length).toBeGreaterThan(0);
    expect(within90.length).toBeGreaterThan(0);
  });

  it('allows institution to submit compliance evidence for time-bound undertaking', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    const undertakings = sakshamStore.getUndertakings();
    const targetUtk = undertakings.find((u) => u.status === 'PENDING' || u.status === 'DUE_SOON')!;

    sakshamStore.submitUndertakingEvidence(
      targetUtk.id,
      'Geo_Tagged_Fire_Sensors_Proof.pdf',
      'Completed physical installation of fire alarm and sensor nodes across block C.',
      instUser
    );

    const updated = sakshamStore.getUndertakings().find((u) => u.id === targetUtk.id)!;
    expect(updated.status).toBe('SUBMITTED');
    expect(updated.evidenceSubmitted).toBeDefined();
    expect(updated.evidenceSubmitted?.documentName).toBe('Geo_Tagged_Fire_Sensors_Proof.pdf');
  });

  it('requires human official verification and does not verify automatically on upload', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    const roUser = DEMO_USERS.find((u) => u.role === 'REGIONAL_OFFICER')!;
    const undertakings = sakshamStore.getUndertakings();
    const targetUtk = undertakings[0];

    // Upload evidence
    sakshamStore.submitUndertakingEvidence(
      targetUtk.id,
      'Laboratory_Equipment_Invoices.pdf',
      'Uploaded stamped GST invoices and installation reports.',
      instUser
    );

    let current = sakshamStore.getUndertakings().find((u) => u.id === targetUtk.id)!;
    // Must remain SUBMITTED and NOT automatically verified
    expect(current.status).toBe('SUBMITTED');
    expect(current.verifiedAt).toBeUndefined();

    // Regional Officer conducts manual verification
    sakshamStore.verifyUndertaking(
      targetUtk.id,
      true,
      'Physical serial numbers verified matching AICTE portal declarations.',
      roUser
    );

    current = sakshamStore.getUndertakings().find((u) => u.id === targetUtk.id)!;
    expect(current.status).toBe('VERIFIED');
    expect(current.assignedVerifierName).toBe(roUser.name);
    expect(current.verificationNotes).toContain('Physical serial numbers');
  });

  it('allows document renewal with updated expiry date and resets status to PENDING', () => {
    const instUser = DEMO_USERS.find((u) => u.role === 'INSTITUTION_USER')!;
    const docs = sakshamStore.getDocuments();
    const expiredDoc = docs.find((d) => d.verificationStatus === 'EXPIRED' || (d.daysToExpiry !== undefined && d.daysToExpiry <= 0))!;

    const newExpiry = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
    sakshamStore.renewDocument(
      expiredDoc.id,
      newExpiry,
      'Renewed_Land_Lease_2026_2056.pdf',
      instUser
    );

    const renewed = sakshamStore.getDocuments().find((d) => d.id === expiredDoc.id)!;
    expect(renewed.expiryDate).toBe(newExpiry);
    expect(renewed.verificationStatus).toBe('PENDING');
    expect(renewed.fileName).toBe('Renewed_Land_Lease_2026_2056.pdf');
  });
});
