import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Download,
  Printer,
  Layers,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { StatusBadge, StageBadge } from '../common/Badge';
import type { Application, StageId } from '../../types';

interface TrackApplicationViewProps {
  initialAppId?: string;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const TrackApplicationView: React.FC<TrackApplicationViewProps> = ({
  initialAppId,
  onNavigateHome,
  onNavigateLogin,
}) => {
  const { applications, documents } = useSakshamStore();
  const [searchQuery, setSearchQuery] = useState(initialAppId || 'AICTE/2026/NW/00492');
  const [selectedApp, setSelectedApp] = useState<Application | null>(() => {
    if (initialAppId) {
      return (
        applications.find(
          (a) =>
            a.applicationNumber.toLowerCase() === initialAppId.toLowerCase() ||
            a.id === initialAppId
        ) || applications[0]
      );
    }
    return applications[0];
  });
  const [showSlipModal, setShowSlipModal] = useState(false);

  const sampleTrackIds = [
    'AICTE/2026/NW/00492',
    'AICTE/2026/W/00812',
    'AICTE/2026/CRO/00194',
    'AICTE/2026/SW/00932',
  ];

  const handleSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    const found = applications.find(
      (a) =>
        a.applicationNumber.toLowerCase().includes(q) ||
        a.institutionCode.toLowerCase().includes(q) ||
        a.institutionName.toLowerCase().includes(q)
    );
    if (found) {
      setSelectedApp(found);
    } else {
      setSelectedApp(null);
    }
  };

  const relatedDocs = selectedApp
    ? documents.filter((d) => d.applicationId === selectedApp.id)
    : [];

  const stageOrder: StageId[] = [
    'APPLICATION_SUBMITTED',
    'PRELIMINARY_SCRUTINY',
    'DEFICIENCY_COMMUNICATION',
    'PENDING_EVC',
    'SAC_SHC_REVIEW',
    'COMPETENT_AUTHORITY_DECISION',
    'APPROVAL_ISSUED',
  ];

  const currentStageIndex = selectedApp
    ? stageOrder.indexOf(selectedApp.currentStage)
    : -1;

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-[#E5E5E5] bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-medium text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="font-bold text-sm tracking-tight text-[#111111]">Saksham</span>
          <span className="text-[11px] text-[#777777] border-l border-[#E5E5E5] pl-2.5 hidden sm:inline">
            Public Tracking Engine
          </span>
        </div>

        <button
          onClick={onNavigateLogin}
          className="text-xs font-semibold px-3 py-1.5 rounded bg-[#111111] hover:bg-[#222222] text-white transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Search Bar Card */}
        <div className="bg-white border border-[#E5E5E5] rounded p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
              Public Verification
            </span>
            <h2 className="text-lg font-bold text-[#111111]">
              Track Technical Institute Approval Status
            </h2>
            <p className="text-xs text-[#777777]">
              Enter AICTE Application Number, Permanent Institute ID, or College Name to check live statutory workflow milestones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="e.g. AICTE/2026/NW/00492 or Shree Engineering College"
                className="w-full h-10 pl-9 pr-3 rounded bg-white border border-[#E5E5E5] text-[#111111] placeholder-[#777777] text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              className="h-10 px-5 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium text-xs shrink-0 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#777777]">
            <span className="text-[11px]">Quick Samples:</span>
            {sampleTrackIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSearchQuery(id);
                  handleSearch(id);
                }}
                className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${
                  selectedApp?.applicationNumber === id
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-[#EEEEEC] text-[#111111] border-[#E5E5E5] hover:bg-[#E5E5E5]'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Search Result */}
        {selectedApp ? (
          <div className="space-y-6">
            {/* Top Application Card */}
            <div className="bg-white border border-[#E5E5E5] rounded p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#111111]">
                      {selectedApp.applicationNumber}
                    </span>
                    <StatusBadge status={selectedApp.status} />
                    <StageBadge stage={selectedApp.currentStage} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#111111]">
                    {selectedApp.institutionName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#777777]">
                    <span className="font-mono">PID: {selectedApp.institutionCode}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                      {selectedApp.region} Region, {selectedApp.state}
                    </span>
                    <span>•</span>
                    <span>Academic Cycle: {selectedApp.academicYear}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowSlipModal(true)}
                    className="px-3.5 py-2 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#111111]" />
                    <span>Download Slip</span>
                  </button>
                </div>
              </div>

              {/* Grid of Key Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase font-bold tracking-wider">
                    Approval Category
                  </span>
                  <span className="font-medium text-[#111111] mt-0.5 block">
                    {selectedApp.approvalType}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase font-bold tracking-wider">
                    Submission Date
                  </span>
                  <span className="font-medium text-[#111111] mt-0.5 block font-mono">
                    {selectedApp.submittedAt.split('T')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase font-bold tracking-wider">
                    Assigned Desk
                  </span>
                  <span className="font-medium text-[#111111] mt-0.5 block">
                    {selectedApp.assignedOfficerName}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase font-bold tracking-wider">
                    Statutory SLA Target
                  </span>
                  <span className="font-medium text-[#111111] mt-0.5 block font-mono">
                    {selectedApp.deadlineDate.split('T')[0]} ({selectedApp.daysToDeadline}d)
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Lifecycle Progress Timeline */}
            <div className="bg-white border border-[#E5E5E5] rounded p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#111111]" />
                  <span>Statutory Clearance Progress Tracker</span>
                </h4>
                <span className="text-[11px] font-mono text-[#777777]">Live System Feed</span>
              </div>

              <div className="space-y-3">
                {stageOrder.map((stageKey, idx) => {
                  const isDone = currentStageIndex > idx || selectedApp.status === 'APPROVED';
                  const isCurrent = currentStageIndex === idx && selectedApp.status !== 'APPROVED';

                  const stageNames: Record<StageId, string> = {
                    APPLICATION_SUBMITTED: 'Online Submission & Verification of Fee',
                    PRELIMINARY_SCRUTINY: 'Statutory Document Scrutiny Desk',
                    DEFICIENCY_COMMUNICATION: 'Deficiency Reporting & Clarification',
                    PENDING_EVC: 'Expert Visit Committee (EVC) Physical Audit',
                    SAC_SHC_REVIEW: 'Standing Hearing / Appellate Committee',
                    COMPETENT_AUTHORITY_DECISION: 'Competent Authority Sanction',
                    APPROVAL_ISSUED: 'Letter of Approval (LoA) / EoA Dispatched',
                    RE_SCRUTINY: 'Re-Scrutiny',
                    EVC_SCHEDULED: 'EVC Scheduled',
                    EVC_VISIT_CONDUCTED: 'EVC Conducted',
                    REJECTED_CLOSED: 'Application Rejected',
                  };

                  return (
                    <div
                      key={stageKey}
                      className={`flex items-start gap-4 p-3 rounded border transition-colors ${
                        isCurrent
                          ? 'bg-[#F7F7F5] border-[#111111]'
                          : isDone
                          ? 'bg-white border-[#E5E5E5]'
                          : 'bg-white border-[#E5E5E5]/60 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                          isDone
                            ? 'bg-[#111111] text-white'
                            : isCurrent
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#EEEEEC] text-[#777777] border border-[#E5E5E5]'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`font-semibold ${
                              isCurrent ? 'text-[#111111]' : isDone ? 'text-[#111111]' : 'text-[#777777]'
                            }`}
                          >
                            {stageNames[stageKey]}
                          </span>
                          <span className="text-[10px] font-mono text-[#777777]">
                            {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'UPCOMING'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#777777]">
                          {isCurrent
                            ? `Active at desk since ${selectedApp.stageHistory[selectedApp.stageHistory.length - 1]?.enteredAt.split('T')[0] || 'recent'}. Processing under prescribed APH guidelines.`
                            : isDone
                            ? 'Verified and cleared by authorized statutory officer.'
                            : 'Will initiate upon clearance of preceding milestones.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Verification Checklist */}
            <div className="bg-white border border-[#E5E5E5] rounded p-5 sm:p-6 space-y-4">
              <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                <FileText className="w-4 h-4 text-[#111111]" />
                <span>Statutory Compliance Documents Submitted</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {relatedDocs.length > 0 ? (
                  relatedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded bg-[#F7F7F5] border border-[#E5E5E5] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#111111] block">
                          {doc.documentType}
                        </span>
                        <span className="text-[10px] font-mono text-[#777777] block">
                          File: {doc.fileName} ({doc.fileSize})
                        </span>
                        {doc.expiryDate && (
                          <span className="text-[10px] text-[#777777] block font-mono">
                            Valid till: {doc.expiryDate}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium shrink-0 bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                        {doc.verificationStatus}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#777777] col-span-2">
                    Standard institutional documents are under scrutiny vault.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-[#E5E5E5] rounded space-y-3">
            <AlertCircle className="w-8 h-8 text-[#777777] mx-auto" />
            <h3 className="text-sm font-bold text-[#111111]">No Application Record Found</h3>
            <p className="text-xs text-[#777777] max-w-sm mx-auto">
              Please double check the Application Number or choose from one of the active sample cases above.
            </p>
          </div>
        )}
      </main>

      {/* Slip Print Modal */}
      {showSlipModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E5E5] rounded-lg max-w-lg w-full p-6 text-xs text-[#111111] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-[#111111]">Saksham</span>
                <p className="text-[11px] text-[#777777]">Official Application Acknowledgment Slip</p>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="text-[#777777] hover:text-[#111111] p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded bg-[#F7F7F5] border border-[#E5E5E5] space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#777777]">Application ID:</span>
                <span className="font-mono font-bold text-[#111111]">
                  {selectedApp.applicationNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Institution:</span>
                <span className="font-medium text-right text-[#111111]">{selectedApp.institutionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">PID:</span>
                <span className="font-mono text-[#111111]">{selectedApp.institutionCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Approval Type:</span>
                <span className="text-[#111111]">{selectedApp.approvalType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Current Stage:</span>
                <span className="font-medium text-[#111111]">{selectedApp.currentStage.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Generated Timestamp:</span>
                <span className="font-mono text-[#777777]">{new Date().toISOString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 rounded bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#EEEEEC] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
