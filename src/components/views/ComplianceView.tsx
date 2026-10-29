import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { SubmitEvidenceModal } from '../modals/SubmitEvidenceModal';
import { VerifyEvidenceModal } from '../modals/VerifyEvidenceModal';
import type { ComplianceUndertaking } from '../../types';

export const ComplianceView: React.FC = () => {
  const { undertakings, activeUser } = useSakshamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedForSubmit, setSelectedForSubmit] = useState<ComplianceUndertaking | null>(null);
  const [selectedForVerify, setSelectedForVerify] = useState<ComplianceUndertaking | null>(null);

  const isOfficerOrAdmin =
    activeUser.role === 'REGIONAL_OFFICER' ||
    activeUser.role === 'BUREAU_OFFICER' ||
    activeUser.role === 'SUPER_ADMIN';

  const filteredUndertakings = undertakings.filter((u) => {
    if (activeUser.role === 'INSTITUTION_USER' && activeUser.institutionId) {
      if (u.institutionId !== activeUser.institutionId) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !u.institutionName.toLowerCase().includes(q) &&
        !u.title.toLowerCase().includes(q) &&
        !u.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    if (statusFilter !== 'ALL') {
      const isSub = u.submissionStatus === 'SUBMITTED' || !!u.evidenceSubmitted || u.status === 'SUBMITTED' || u.status === 'UNDER_VERIFICATION' || u.status === 'VERIFIED';
      const isVer = u.verificationStatus === 'VERIFIED' || u.status === 'VERIFIED';
      const isRej = u.verificationStatus === 'REJECTED' || u.status === 'REJECTED_FOR_CORRECTION';
      if (statusFilter === 'VERIFIED' && !isVer) return false;
      if (statusFilter === 'PENDING_VERIFY' && (!isSub || isVer)) return false;
      if (statusFilter === 'DEFICIENT' && !isRej) return false;
      if (statusFilter === 'PENDING_SUBMIT' && isSub) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            Institutional Compliance
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Compliance register for institutional undertakings, 7th CPC affidavits, and statutory verifications.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#E5E5E5] flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-56">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by institution, requirement, type..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Compliance States</option>
          <option value="PENDING_SUBMIT">Awaiting Submission</option>
          <option value="PENDING_VERIFY">Awaiting Verification</option>
          <option value="VERIFIED">Verified &amp; Compliant</option>
          <option value="DEFICIENT">Deficient / Rejected</option>
        </select>

        {(searchQuery || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="h-8 px-2.5 text-xs text-[#777777] hover:text-[#111111] inline-flex items-center gap-1 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Compliance Register Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                <th className="py-2.5 px-4">Institution</th>
                <th className="py-2.5 px-4">Requirement</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4">Submission Status</th>
                <th className="py-2.5 px-4">Verification Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {filteredUndertakings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#777777]">
                    No compliance records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredUndertakings.map((u) => {
                  const isSubmitted = u.submissionStatus === 'SUBMITTED' || !!u.evidenceSubmitted || u.status === 'SUBMITTED' || u.status === 'UNDER_VERIFICATION' || u.status === 'VERIFIED';
                  const isVerified = u.verificationStatus === 'VERIFIED' || u.status === 'VERIFIED';
                  const isRejected = u.verificationStatus === 'REJECTED' || u.status === 'REJECTED_FOR_CORRECTION';
                  const submissionDisplay = isSubmitted ? 'SUBMITTED' : (u.daysRemaining < 0 ? 'OVERDUE' : 'PENDING');
                  const verificationDisplay = isVerified ? 'VERIFIED' : (isRejected ? 'REJECTED' : (isSubmitted ? 'UNDER_VERIFICATION' : 'PENDING'));

                  return (
                    <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#111111]">{u.institutionName}</div>
                        <div className="text-[10px] text-[#777777] font-mono">{u.institutionCode}</div>
                      </td>
                      <td className="py-3 px-4 max-w-56">
                        <div className="font-semibold text-[#111111]">{u.title}</div>
                        <div className="text-[11px] text-[#777777] truncate">{u.evidenceRequired}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#777777] whitespace-nowrap">
                        {u.dueDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                          {submissionDisplay}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            isVerified
                              ? 'bg-[#EEEEEC] text-[#111111] border-[#E5E5E5]'
                              : isRejected
                              ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                              : 'bg-[#F7F7F5] text-[#777777] border-[#E5E5E5]'
                          }`}
                        >
                          {verificationDisplay}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {/* Two separate actions: Upload Evidence vs Verify */}
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedForSubmit(u)}
                            className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium cursor-pointer"
                            title="Submit Proof"
                          >
                            <Upload className="w-3 h-3 inline mr-1 text-[#777777]" />
                            <span>Submit</span>
                          </button>

                          {isOfficerOrAdmin && isSubmitted && !isVerified && (
                            <button
                              onClick={() => setSelectedForVerify(u)}
                              className="px-2.5 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                              title="Verify Evidence"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Evidence Modal */}
      {selectedForSubmit && (
        <SubmitEvidenceModal
          isOpen={!!selectedForSubmit}
          onClose={() => setSelectedForSubmit(null)}
          undertaking={selectedForSubmit}
        />
      )}

      {/* Verify Evidence Modal */}
      {selectedForVerify && (
        <VerifyEvidenceModal
          isOpen={!!selectedForVerify}
          onClose={() => setSelectedForVerify(null)}
          undertaking={selectedForVerify}
        />
      )}
    </div>
  );
};
