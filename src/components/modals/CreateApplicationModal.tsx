import React, { useState, useRef } from 'react';
import { Check, ChevronRight, ChevronLeft, FileUp, Save, Send, Upload, FileText, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatFileSize } from '../common/FileUploadZone';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { ApprovalType, WorkflowRoute, Institution } from '../../types';

interface CreateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { store, institutions, activeUser } = useSakshamStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedInstId, setSelectedInstId] = useState<string>(
    activeUser.institutionId || institutions[0].id
  );
  const [approvalType, setApprovalType] = useState<ApprovalType>('Extension of Approval (EoA)');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [workflowRoute, setWorkflowRoute] = useState<WorkflowRoute>('SCRUTINY_ONLY');
  const [intakeProposed, setIntakeProposed] = useState<number>(360);
  const [intakeApprovedPrevious, setIntakeApprovedPrevious] = useState<number>(300);
  const [programmesText, setProgrammesText] = useState(
    'B.Tech Computer Science & Engineering (180)\nB.Tech Artificial Intelligence & Machine Learning (120)\nB.Tech Electronics & Communication (60)'
  );
  const [undertakingFireNoc, setUndertakingFireNoc] = useState(true);
  const [undertakingPayScale, setUndertakingPayScale] = useState(true);
  const [undertakingAntiRagging, setUndertakingAntiRagging] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: formatFileSize(f.size),
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const selectedInst: Institution =
    institutions.find((i) => i.id === selectedInstId) || institutions[0];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (asDraft = false) => {
    const programmes = programmesText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const newApp = store.createApplication(
      {
        institutionId: selectedInst.id,
        institutionName: selectedInst.name,
        institutionCode: selectedInst.code,
        category: selectedInst.category,
        region: selectedInst.region,
        state: selectedInst.state,
        approvalType,
        academicYear,
        workflowRoute,
        intakeProposed: Number(intakeProposed),
        intakeApprovedPrevious: Number(intakeApprovedPrevious),
        programmesProposed: programmes,
        status: asDraft ? 'DRAFT' : 'SUBMITTED',
      },
      activeUser
    );

    onSuccess(newApp.id);
    onClose();
  };

  const steps = [
    { num: 1, title: 'Institution' },
    { num: 2, title: 'Category' },
    { num: 3, title: 'Workflow' },
    { num: 4, title: 'Compliance' },
    { num: 5, title: 'Review' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New AICTE Approval Application"
      subtitle="Statutory application wizard for Approval Process Handbook (APH) 2026-27"
      maxWidth="2xl"
    >
      {/* Stepper Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep === s.num
                      ? 'bg-[#111111] text-white'
                      : currentStep > s.num
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#EEEEEC] text-[#777777] border border-[#E5E5E5]'
                  }`}
                >
                  {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:inline ${
                    currentStep === s.num ? 'text-[#111111] font-bold' : 'text-[#777777]'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    currentStep > s.num ? 'bg-[#111111]' : 'bg-[#E5E5E5]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Institution Details */}
      {currentStep === 1 && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1.5">
              Select Institution *
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
            >
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.code} — {i.name} ({i.region} / {i.state})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[#F7F7F5] rounded border border-[#E5E5E5] space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Institution Code:</span>
                <p className="font-bold text-[#111111] mt-0.5">{selectedInst.code}</p>
              </div>
              <div>
                <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Discipline Category:</span>
                <p className="font-bold text-[#111111] mt-0.5">{selectedInst.category}</p>
              </div>
              <div>
                <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">AICTE Regional Office:</span>
                <p className="font-bold text-[#111111] mt-0.5">{selectedInst.region} (RO)</p>
              </div>
              <div>
                <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Head of Institution:</span>
                <p className="font-bold text-[#111111] mt-0.5">{selectedInst.headOfInstitution}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Campus Address:</span>
              <p className="font-medium text-[#111111] mt-0.5">{selectedInst.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Approval Category & Programmes */}
      {currentStep === 2 && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Approval Category *
              </label>
              <select
                value={approvalType}
                onChange={(e) => setApprovalType(e.target.value as ApprovalType)}
                className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
              >
                <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                <option value="Increase in Intake">Increase in Intake</option>
                <option value="Introduction of New Course">Introduction of New Course</option>
                <option value="New Institution Approval">New Institution Approval</option>
                <option value="Change of Site/Location">Change of Site/Location</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Academic Year *
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Previous Approved Intake
              </label>
              <input
                type="number"
                value={intakeApprovedPrevious}
                onChange={(e) => setIntakeApprovedPrevious(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Proposed Intake *
              </label>
              <input
                type="number"
                value={intakeProposed}
                onChange={(e) => setIntakeProposed(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1.5">
              Programmes & Proposed Seats (One per line)
            </label>
            <textarea
              rows={3}
              value={programmesText}
              onChange={(e) => setProgrammesText(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-[#E5E5E5] rounded text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>
      )}

      {/* Step 3: Workflow Route Configuration */}
      {currentStep === 3 && (
        <div className="space-y-3 text-xs">
          <label className="block text-xs font-bold text-[#111111]">
            Applicable Workflow Route & Inspection Mode
          </label>

          <div className="space-y-2">
            {[
              {
                id: 'SCRUTINY_ONLY' as WorkflowRoute,
                title: 'Only Scrutiny Route',
                desc: 'Standard paper scrutiny by Regional Scrutiny Committee. No physical visit required.',
              },
              {
                id: 'SCRUTINY_EVC' as WorkflowRoute,
                title: 'Scrutiny + Physical EVC',
                desc: 'Mandatory scrutiny followed by on-site Expert Visiting Committee physical verification.',
              },
              {
                id: 'SCRUTINY_EVC_SAC' as WorkflowRoute,
                title: 'Scrutiny + EVC + SAC/SHC Review',
                desc: 'Full statutory route with Standing Appellate Committee (SAC) hearing prior to decision.',
              },
            ].map((route) => (
              <label
                key={route.id}
                className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-all ${
                  workflowRoute === route.id
                    ? 'border-[#111111] bg-[#EEEEEC]'
                    : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'
                }`}
              >
                <input
                  type="radio"
                  name="workflowRoute"
                  checked={workflowRoute === route.id}
                  onChange={() => setWorkflowRoute(route.id)}
                  className="mt-0.5 accent-[#111111]"
                />
                <div>
                  <p className="text-xs font-bold text-[#111111]">{route.title}</p>
                  <p className="text-[11px] text-[#777777] mt-0.5">{route.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5] text-[11px] text-[#777777]">
            <strong className="text-[#111111]">Statutory Rule:</strong> Increase in intake or introduction of new engineering programs automatically mandates an on-site physical EVC per AICTE norms.
          </div>
        </div>
      )}

      {/* Step 4: Compliance Undertakings & Documents */}
      {currentStep === 4 && (
        <div className="space-y-3 text-xs">
          <p className="text-xs font-bold text-[#111111]">
            Mandatory Institutional Undertakings (Under Penalty of Law)
          </p>

          <div className="space-y-2">
            <label className="flex items-start gap-2.5 p-3 bg-white rounded border border-[#E5E5E5] text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={undertakingFireNoc}
                onChange={(e) => setUndertakingFireNoc(e.target.checked)}
                className="mt-0.5 accent-[#111111] rounded"
              />
              <div>
                <span className="font-bold text-[#111111]">
                  Valid Fire Safety Clearance / NOC Undertaking
                </span>
                <p className="text-[11px] text-[#777777] mt-0.5">
                  Institution certifies valid Fire NOC from state authority and undertakes renewal before expiry.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 bg-white rounded border border-[#E5E5E5] text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={undertakingPayScale}
                onChange={(e) => setUndertakingPayScale(e.target.checked)}
                className="mt-0.5 accent-[#111111] rounded"
              />
              <div>
                <span className="font-bold text-[#111111]">
                  7th Central Pay Commission (CPC) AICTE Faculty Salary
                </span>
                <p className="text-[11px] text-[#777777] mt-0.5">
                  Undertakes disbursement through RTGS/NEFT with verified bank statements.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 bg-white rounded border border-[#E5E5E5] text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={undertakingAntiRagging}
                onChange={(e) => setUndertakingAntiRagging(e.target.checked)}
                className="mt-0.5 accent-[#111111] rounded"
              />
              <div>
                <span className="font-bold text-[#111111]">
                  Anti-Ragging Committee & Online Affidavits Compliance
                </span>
                <p className="text-[11px] text-[#777777] mt-0.5">
                  Institution affirms complete compliance with Supreme Court & AICTE anti-ragging mandates.
                </p>
              </div>
            </label>
          </div>

          {/* File Upload from PC */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-[#CCCCCC] hover:border-[#111111] rounded-lg text-center bg-[#FAFAFA] hover:bg-[#F5F5F3] cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 text-[#111111] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-[#111111]">
                Select Statutory Documents from PC
              </p>
              <p className="text-[10px] text-[#777777] mt-0.5">
                Click to browse Land Lease Deed, Building Safety NOC, Fire NOC (PDF, DOC up to 25MB each)
              </p>
            </div>

            {attachedFiles.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  Attached Local Files ({attachedFiles.length})
                </span>
                {attachedFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white border border-[#E5E5E5] rounded flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                      <span className="truncate font-medium text-[#111111]">{f.name}</span>
                      <span className="text-[10px] text-[#777777] font-mono shrink-0">({f.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="p-1 text-[#777777] hover:text-[#DC2626] rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Review & Submit */}
      {currentStep === 5 && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#EEEEEC] border border-[#E5E5E5] rounded">
            <h4 className="font-bold text-[#111111]">Application Summary Confirmation</h4>
            <p className="text-[11px] text-[#777777] mt-0.5">
              Review all details before formal statutory registration into the AICTE workflow queue.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded border border-[#E5E5E5]">
            <div>
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Institution</span>
              <p className="font-bold text-[#111111] truncate mt-0.5">{selectedInst.name}</p>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Approval Type</span>
              <p className="font-bold text-[#111111] mt-0.5">{approvalType}</p>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Academic Cycle</span>
              <p className="font-bold text-[#111111] mt-0.5">{academicYear}</p>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Workflow Route</span>
              <p className="font-bold text-[#111111] mt-0.5">{workflowRoute}</p>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Proposed Intake</span>
              <p className="font-bold text-[#111111] mt-0.5">{intakeProposed} Seats</p>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] uppercase font-bold tracking-wider">Submitted By</span>
              <p className="font-bold text-[#111111] mt-0.5">{activeUser.name}</p>
            </div>
          </div>

          <p className="text-[11px] text-[#777777] italic">
            * Note: Submission appends an immutable digital audit record and triggers automated SLA tracking.
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#E5E5E5]">
        <div>
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="h-8 px-3 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] text-xs font-medium inline-flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(true)}
            className="h-8 px-3 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] text-xs font-medium inline-flex items-center gap-1 transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="h-8 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium inline-flex items-center gap-1 transition-colors shadow-xs"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              className="h-8 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium inline-flex items-center gap-1 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Register & Submit
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
