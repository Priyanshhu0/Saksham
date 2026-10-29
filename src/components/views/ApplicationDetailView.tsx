import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Send,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Calendar,
  Building2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { StatusBadge, StageBadge } from '../common/Badge';
import { DeficiencyModal } from '../modals/DeficiencyModal';
import { AdvanceStageModal } from '../modals/AdvanceStageModal';
import { AssignOfficerModal } from '../modals/AssignOfficerModal';
import { ResubmitModal } from '../modals/ResubmitModal';
import type { StageId } from '../../types';

interface ApplicationDetailViewProps {
  applicationId: string;
  onBack: () => void;
  onNavigateTab: (tab: any) => void;
}

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  applicationId,
  onBack,
  onNavigateTab,
}) => {
  const { applications, documents, undertakings, evcVisits, auditEvents, activeUser } = useSakshamStore();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'workflow' | 'documents' | 'compliance' | 'observations' | 'audit'
  >('overview');

  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);

  const app = applications.find((a) => a.id === applicationId);
  if (!app) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-[#E5E5E5]">
        <p className="text-[#777777] text-xs font-semibold">Application record not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#111111] text-white rounded text-xs font-semibold hover:bg-[#222222] transition-colors"
        >
          Return to Applications
        </button>
      </div>
    );
  }

  const appDocs = documents.filter((d) => d.applicationId === app.id);
  const appUndertakings = undertakings.filter((u) => u.applicationId === app.id);
  const appEvc = evcVisits.find((v) => v.applicationId === app.id);
  const appAudit = auditEvents.filter((a) => a.targetId === app.id);

  // Workflow steps based on route
  const getWorkflowSteps = () => {
    const baseSteps: { stage: StageId; label: string }[] = [
      { stage: 'APPLICATION_SUBMITTED', label: 'Submitted' },
      { stage: 'PRELIMINARY_SCRUTINY', label: 'Scrutiny' },
    ];

    if (app.workflowRoute.includes('EVC')) {
      baseSteps.push({ stage: 'EVC_SCHEDULED', label: 'EVC Visit' });
    }
    if (app.workflowRoute.includes('SAC')) {
      baseSteps.push({ stage: 'SAC_SHC_REVIEW', label: 'SAC Hearing' });
    }

    baseSteps.push({ stage: 'COMPETENT_AUTHORITY_DECISION', label: 'Authority Decision' });
    baseSteps.push({ stage: 'APPROVAL_ISSUED', label: 'Approval Issued' });

    return baseSteps;
  };

  const workflowSteps = getWorkflowSteps();
  const currentStepIndex = workflowSteps.findIndex((s) => s.stage === app.currentStage);

  const isOfficerOrAdmin =
    activeUser.role === 'REGIONAL_OFFICER' ||
    activeUser.role === 'BUREAU_OFFICER' ||
    activeUser.role === 'COMPETENT_AUTHORITY' ||
    activeUser.role === 'SUPER_ADMIN';

  const isInstitution = activeUser.role === 'INSTITUTION_USER';

  return (
    <div className="space-y-6 pb-16 font-sans text-[#111111]">
      {/* Top Bar: Back & Contextual Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#111111] font-semibold transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Applications
        </button>

        {/* Primary Contextual Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isInstitution && app.status === 'DEFICIENCY_REPORTED' && (
            <button
              onClick={() => setShowResubmitModal(true)}
              className="h-8 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Submit Rectification
            </button>
          )}

          {isOfficerOrAdmin && (
            <>
              <button
                onClick={() => setShowAssignModal(true)}
                className="h-8 px-3 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#777777]" /> Reassign
              </button>

              <button
                onClick={() => setShowDeficiencyModal(true)}
                className="h-8 px-3 rounded bg-white border border-[#E5E5E5] hover:bg-[#FEE2E2]/30 text-[#DC2626] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" /> Flag Deficiency
              </button>

              <button
                onClick={() => setShowAdvanceModal(true)}
                className="h-8 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Advance Stage
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Case Summary Block */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E5E5]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-lg font-bold text-[#111111]">
                {app.applicationNumber}
              </span>
              <StatusBadge status={app.status} />
              <StageBadge stage={app.currentStage} />
            </div>
            <h1 className="text-base font-bold text-[#111111] mt-1.5">
              {app.institutionName}{' '}
              <span className="text-[#777777] font-mono text-xs font-normal">({app.institutionCode})</span>
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              {app.approvalType} &bull; Academic Year {app.academicYear} &bull; {app.region} Region ({app.state})
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs bg-[#F7F7F5] p-3.5 rounded border border-[#E5E5E5]">
            <div>
              <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block">Assigned Officer</span>
              <span className="font-semibold text-[#111111] text-xs mt-0.5 block">{app.assignedOfficerName}</span>
            </div>
            <div className="h-7 w-px bg-[#E5E5E5]" />
            <div>
              <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block">SLA Deadline</span>
              <span className={`font-mono font-semibold text-xs mt-0.5 block ${app.isOverdue ? 'text-[#DC2626]' : 'text-[#111111]'}`}>
                {app.deadlineDate.split('T')[0]}
              </span>
            </div>
            <div className="h-7 w-px bg-[#E5E5E5]" />
            <div>
              <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block">Proposed Intake</span>
              <span className="font-bold text-[#111111] text-xs mt-0.5 block">{app.intakeProposed} Seats</span>
            </div>
          </div>
        </div>

        {/* Visual Stepper */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Statutory Route: {app.workflowRoute.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-[#777777] font-mono">
              Stage {currentStepIndex + 1} of {workflowSteps.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {workflowSteps.map((step, idx) => {
              const isPassed = currentStepIndex > idx || app.status === 'APPROVED';
              const isCurrent = workflowSteps[idx]?.stage === app.currentStage;

              return (
                <div
                  key={step.stage}
                  className={`p-2.5 rounded text-xs border transition-all ${
                    isCurrent
                      ? 'bg-[#111111] border-[#111111] text-white font-semibold'
                      : isPassed
                      ? 'bg-[#F7F7F5] border-[#E5E5E5] text-[#111111]'
                      : 'bg-white border-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span>0{idx + 1}</span>
                    {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />}
                  </div>
                  <div className="truncate mt-1 font-medium">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E5E5E5] text-xs overflow-x-auto">
        {[
          { id: 'overview', label: 'Dossier Overview' },
          { id: 'workflow', label: `Stage History (${app.stageHistory.length})` },
          { id: 'documents', label: `Documents (${appDocs.length})` },
          { id: 'compliance', label: `Undertakings (${appUndertakings.length})` },
          { id: 'observations', label: `Observations (${app.deficiencyCount})` },
          { id: 'audit', label: `Audit Log (${appAudit.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-2 font-medium transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === t.id
                ? 'border-[#111111] text-[#111111] font-bold'
                : 'border-transparent text-[#777777] hover:text-[#111111]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content Card */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 shadow-sm">
        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs pb-2 border-b border-[#E5E5E5]">
                Institutional Registration
              </h3>
              <div className="divide-y divide-[#E5E5E5] space-y-2">
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Full Legal Name</span>
                  <span className="font-semibold text-[#111111] text-right max-w-xs">{app.institutionName}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">AICTE Institute Code</span>
                  <span className="font-mono font-bold text-[#111111]">{app.institutionCode}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Discipline Category</span>
                  <span className="font-semibold text-[#111111]">{app.category}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Jurisdiction</span>
                  <span className="font-semibold text-[#111111]">
                    {app.region} ({app.state})
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Initial Submission</span>
                  <span className="font-mono text-[#111111]">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs pb-2 border-b border-[#E5E5E5]">
                Approval Scope &amp; Intake
              </h3>
              <div className="divide-y divide-[#E5E5E5] space-y-2">
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Approval Category</span>
                  <span className="font-semibold text-[#111111]">{app.approvalType}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Proposed Student Intake</span>
                  <span className="font-bold text-[#111111] font-mono">{app.intakeProposed} Seats</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#777777]">Prior Year Approved Intake</span>
                  <span className="font-mono text-[#111111]">{app.intakeApprovedPrevious} Seats</span>
                </div>
                <div className="pt-2">
                  <span className="text-[#777777] block mb-2">Declared Academic Programmes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.programmesProposed.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#F7F7F5] text-[#111111] text-[11px] font-medium border border-[#E5E5E5]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Workflow History */}
        {activeTab === 'workflow' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Stage History &amp; SLA Turnaround
            </h3>
            <div className="border border-[#E5E5E5] rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Stage</th>
                    <th className="py-2.5 px-4">Entered Date</th>
                    <th className="py-2.5 px-4">Action Taken</th>
                    <th className="py-2.5 px-4">Official</th>
                    <th className="py-2.5 px-4">Elapsed</th>
                    <th className="py-2.5 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {app.stageHistory.map((sh, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StageBadge stage={sh.stage} />
                      </td>
                      <td className="py-3 px-4 font-mono text-[#777777] whitespace-nowrap">
                        {sh.enteredAt.split('T')[0]}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#111111]">{sh.actionTaken}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#111111]">{sh.actorName}</div>
                        <div className="text-[10px] text-[#777777]">{sh.actorRole.replace(/_/g, ' ')}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="font-bold text-[#111111]">{sh.elapsedDays}d</span> /{' '}
                        <span className="text-[#777777]">{sh.slaDays}d SLA</span>
                      </td>
                      <td className="py-3 px-4 text-[#777777] text-xs max-w-xs">{sh.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Prescribed Regulatory Documents
            </h3>
            <div className="border border-[#E5E5E5] rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Document Type</th>
                    <th className="py-2.5 px-4">File Name</th>
                    <th className="py-2.5 px-4">Expiry Date</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {appDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#777777]">
                        No documents recorded.
                      </td>
                    </tr>
                  ) : (
                    appDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#111111]">{doc.title}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">{doc.fileName}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">
                          {doc.expiryDate || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                            {doc.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#777777] text-xs">{doc.verificationNotes || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Compliance */}
        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Statutory Undertakings &amp; Affidavits
            </h3>
            <div className="border border-[#E5E5E5] rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Requirement</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4">Submission</th>
                    <th className="py-2.5 px-4">Verification</th>
                    <th className="py-2.5 px-4">Evidence Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {appUndertakings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#777777]">
                        No compliance obligations linked to this record.
                      </td>
                    </tr>
                  ) : (
                    appUndertakings.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#111111]">{u.title}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">{u.dueDate}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                            {u.submissionStatus || (u.evidenceSubmitted ? 'SUBMITTED' : 'PENDING')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                            {u.verificationStatus || u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#777777] text-xs">{u.evidenceRequired}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Observations */}
        {activeTab === 'observations' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Deficiency &amp; Scrutiny Observations
            </h3>
            {(!app.deficiencyObservations || app.deficiencyObservations.length === 0) ? (
              <div className="p-8 text-center text-[#777777] border border-[#E5E5E5] rounded">
                No deficiencies or adverse observations flagged against this application.
              </div>
            ) : (
              <div className="space-y-3">
                {app.deficiencyObservations.map((obs: any, idx: number) => (
                  <div key={idx} className="p-4 bg-[#F7F7F5] rounded border border-[#E5E5E5] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#DC2626]">Observation #{idx + 1}</span>
                      <span className="text-[11px] text-[#777777]">Status: Pending Rectification</span>
                    </div>
                    <p className="text-xs text-[#111111] leading-relaxed">
                      {typeof obs === 'string' ? obs : obs?.details || obs?.observation || JSON.stringify(obs)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Case Audit Trail
            </h3>
            <div className="border border-[#E5E5E5] rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Event ID</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Actor</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {appAudit.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#777777]">
                        No specific audit events recorded.
                      </td>
                    </tr>
                  ) : (
                    appAudit.map((evt) => (
                      <tr key={evt.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] font-semibold text-[#111111]">{evt.id}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#777777] whitespace-nowrap">
                          {new Date(evt.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#111111]">{evt.actorName}</div>
                          <div className="text-[10px] text-[#777777]">{evt.actorRole}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#111111]">{evt.action.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4 text-[#777777] text-xs max-w-sm">{evt.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Action Modals */}
      {showDeficiencyModal && (
        <DeficiencyModal
          isOpen={showDeficiencyModal}
          onClose={() => setShowDeficiencyModal(false)}
          applicationId={app.id}
        />
      )}

      {showAdvanceModal && (
        <AdvanceStageModal
          isOpen={showAdvanceModal}
          onClose={() => setShowAdvanceModal(false)}
          applicationId={app.id}
        />
      )}

      {showAssignModal && (
        <AssignOfficerModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          applicationId={app.id}
        />
      )}

      {showResubmitModal && (
        <ResubmitModal
          isOpen={showResubmitModal}
          onClose={() => setShowResubmitModal(false)}
          applicationId={app.id}
        />
      )}
    </div>
  );
};
