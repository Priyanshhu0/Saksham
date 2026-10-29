import React, { useState, useMemo } from 'react';
import {
  Building2,
  FileText,
  ShieldCheck,
  FolderArchive,
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Plus,
  ChevronRight,
  MapPin,
  Send,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { StatusBadge, StageBadge } from '../common/Badge';
import { SubmitEvidenceModal } from '../modals/SubmitEvidenceModal';
import { RenewDocumentModal } from '../modals/RenewDocumentModal';
import { ResubmitModal } from '../modals/ResubmitModal';
import { UploadDocumentModal } from '../modals/UploadDocumentModal';
import type { Application, ApplicationDocument, ComplianceUndertaking } from '../../types';

interface InstitutionPortalViewProps {
  onSelectApplication: (appId: string) => void;
  onOpenCreateApp: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const InstitutionPortalView: React.FC<InstitutionPortalViewProps> = ({
  onSelectApplication,
  onOpenCreateApp,
}) => {
  const { activeUser, institutions, applications, documents, undertakings, notifications } = useSakshamStore();
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'applications' | 'compliance' | 'documents' | 'notifications'>('overview');

  // Modals
  const [selectedUndertaking, setSelectedUndertaking] = useState<ComplianceUndertaking | null>(null);
  const [selectedRenewDoc, setSelectedRenewDoc] = useState<ApplicationDocument | null>(null);
  const [selectedDeficientApp, setSelectedDeficientApp] = useState<Application | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Institution scoping: Only show records belonging to active user's institution
  const currentInstId = activeUser.institutionId || 'inst_01';
  const matchedInst = institutions.find((i) => i.id === currentInstId) || institutions[0];
  const currentInstName = activeUser.institutionName || matchedInst?.name || 'Delhi Institute of Technology & Management';
  const principalName = activeUser.role === 'INSTITUTION_USER' ? activeUser.name : (matchedInst?.headOfInstitution || 'Dr. Arvinder Sharma');

  const myApplications = useMemo(
    () => applications.filter((a) => a.institutionId === currentInstId),
    [applications, currentInstId]
  );

  const myDocuments = useMemo(
    () => documents.filter((d) => d.institutionId === currentInstId),
    [documents, currentInstId]
  );

  const myUndertakings = useMemo(
    () => undertakings.filter((u) => u.institutionId === currentInstId),
    [undertakings, currentInstId]
  );

  const myNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => n.targetRole === 'INSTITUTION_USER' || n.targetRole === 'ALL'
      ),
    [notifications]
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* 1. Institution Header Banner */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded border border-[#E5E5E5] bg-[#F7F7F5] flex items-center justify-center text-[#111111] shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F7F5] text-[#111111] border border-[#E5E5E5] uppercase font-bold">
                  Permanent Institute ID: {matchedInst?.code || '1-33290141'}
                </span>
                <span className="text-[10px] text-[#777777] font-mono">
                  Cycle 2026-27 Active
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight truncate">
                {currentInstName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#777777]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                  {matchedInst?.region || 'North-Western'} Region ({matchedInst?.state || 'Haryana'})
                </span>
                <span>&bull;</span>
                <span>Principal: {principalName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="h-8 px-3 rounded bg-white hover:bg-[#F7F7F5] text-[#111111] border border-[#E5E5E5] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </button>
            <button
              onClick={onOpenCreateApp}
              className="h-8 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar inside Portal */}
        <div className="flex items-center gap-1 border-t border-[#E5E5E5] pt-4 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'applications', label: `My Applications (${myApplications.length})`, icon: FileText },
            { id: 'compliance', label: `Compliance (${myUndertakings.length})`, icon: ShieldCheck },
            { id: 'documents', label: `Documents (${myDocuments.length})`, icon: FolderArchive },
            { id: 'notifications', label: `Notices (${myNotifications.length})`, icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePortalTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white font-semibold'
                    : 'text-[#777777] hover:text-[#111111] hover:bg-[#F7F7F5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. OVERVIEW TAB */}
      {activePortalTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E5E5E5]">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#777777] uppercase block">My Applications</span>
              <div className="text-xl sm:text-2xl font-bold text-[#111111] mt-1 tabular-nums">{myApplications.length}</div>
              <span className="text-[10px] sm:text-[11px] text-[#777777]">Active cases in pipeline</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E5E5E5]">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#777777] uppercase block">Deficiency Notices</span>
              <div className="text-xl sm:text-2xl font-bold text-[#111111] mt-1 tabular-nums">
                {myApplications.filter((a) => a.status === 'DEFICIENCY_REPORTED').length}
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#777777]">Rectification required</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E5E5E5]">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#777777] uppercase block">Compliance Tasks</span>
              <div className="text-xl sm:text-2xl font-bold text-[#111111] mt-1 tabular-nums">{myUndertakings.length}</div>
              <span className="text-[10px] sm:text-[11px] text-[#777777]">Statutory undertakings</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E5E5E5]">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#777777] uppercase block">Document Vault</span>
              <div className="text-xl sm:text-2xl font-bold text-[#111111] mt-1 tabular-nums">{myDocuments.length}</div>
              <span className="text-[10px] sm:text-[11px] text-[#777777]">Uploaded certificates</span>
            </div>
          </div>

          {/* Applications list */}
          <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Applications Filed by {currentInstName}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase">
                    <th className="py-2.5 px-4">Application ID</th>
                    <th className="py-2.5 px-4">Approval Type</th>
                    <th className="py-2.5 px-4">Current Stage</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {myApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium">{app.applicationNumber}</td>
                      <td className="py-3 px-4">{app.approvalType}</td>
                      <td className="py-3 px-4"><StageBadge stage={app.currentStage} /></td>
                      <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="text-xs font-semibold text-[#111111] hover:underline cursor-pointer"
                        >
                          View Dossier →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. APPLICATIONS TAB */}
      {activePortalTab === 'applications' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5]">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              My Institutional Applications
            </h3>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {myApplications.map((app) => (
              <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#111111]">{app.applicationNumber}</span>
                    <StatusBadge status={app.status} />
                    <StageBadge stage={app.currentStage} />
                  </div>
                  <div className="text-xs text-[#777777]">
                    {app.approvalType} &bull; Academic Year {app.academicYear} &bull; {app.intakeProposed} Proposed Seats
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'DEFICIENCY_REPORTED' && (
                    <button
                      onClick={() => setSelectedDeficientApp(app)}
                      className="px-3 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                    >
                      Submit Rectification
                    </button>
                  )}
                  <button
                    onClick={() => onSelectApplication(app.id)}
                    className="px-3 py-1 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium cursor-pointer"
                  >
                    Open Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPLIANCE TAB */}
      {activePortalTab === 'compliance' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5]">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Statutory Compliance Undertakings
            </h3>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {myUndertakings.map((u) => (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-[#111111]">{u.title}</div>
                  <div className="text-[11px] text-[#777777]">
                    Due Date: {u.dueDate} &bull; Status: {u.status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setSelectedUndertaking(u)}
                    className="px-3 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                  >
                    Upload Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DOCUMENTS TAB */}
      {activePortalTab === 'documents' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Institutional Document Vault
              </h3>
              <p className="text-[10px] text-[#777777] mt-0.5">
                Active statutory approvals, land titles, and building clearance records
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="h-8 px-3 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document from PC</span>
            </button>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {myDocuments.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-[#111111]">{doc.title}</div>
                  <div className="text-[11px] text-[#777777] font-mono">
                    {doc.fileName} &bull; Validity: {doc.expiryDate || 'Perpetual'} &bull; Status: {doc.verificationStatus}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setSelectedRenewDoc(doc)}
                    className="px-3 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                  >
                    Renew Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. NOTICES TAB */}
      {activePortalTab === 'notifications' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5]">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Notices from AICTE Regulators
            </h3>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {myNotifications.map((n) => (
              <div key={n.id} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#111111]">{n.title}</span>
                  <span className="text-[10px] text-[#777777] font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Modals */}
      {selectedUndertaking && (
        <SubmitEvidenceModal
          isOpen={!!selectedUndertaking}
          onClose={() => setSelectedUndertaking(null)}
          undertaking={selectedUndertaking}
        />
      )}

      {selectedRenewDoc && (
        <RenewDocumentModal
          isOpen={!!selectedRenewDoc}
          onClose={() => setSelectedRenewDoc(null)}
          document={selectedRenewDoc}
        />
      )}

      {selectedDeficientApp && (
        <ResubmitModal
          isOpen={!!selectedDeficientApp}
          onClose={() => setSelectedDeficientApp(null)}
          application={selectedDeficientApp}
        />
      )}

      {/* Upload Document from PC Modal */}
      {isUploadOpen && (
        <UploadDocumentModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          defaultInstitutionId={currentInstId}
        />
      )}
    </div>
  );
};
