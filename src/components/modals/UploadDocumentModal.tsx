import React, { useState } from 'react';
import { Upload, FileCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FileUploadZone, formatFileSize } from '../common/FileUploadZone';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { ApplicationDocument } from '../../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInstitutionId?: string;
  onSuccess?: () => void;
}

const DOCUMENT_TYPES: ApplicationDocument['documentType'][] = [
  'Land Lease / Ownership Deed',
  'Building Safety Certificate',
  'Fire NOC',
  'Occupancy Certificate',
  'Society Registration & MoA',
  'AICTE Prior EoA',
  'Faculty AICTE-Pay Scale Undertaking',
  'Corpus Fund FD Certificate',
];

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  defaultInstitutionId,
  onSuccess,
}) => {
  const { store, institutions, applications, activeUser } = useSakshamStore();

  const currentInstId =
    defaultInstitutionId ||
    activeUser.institutionId ||
    (institutions.length > 0 ? institutions[0].id : 'inst_01');

  const [institutionId, setInstitutionId] = useState(currentInstId);
  const [documentType, setDocumentType] =
    useState<ApplicationDocument['documentType']>('Fire NOC');
  const [title, setTitle] = useState('Fire Safety Clearance Certificate 2026-27');
  const [expiryDate, setExpiryDate] = useState('2028-03-31');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: string;
  } | null>(null);

  const matchedInst =
    institutions.find((i) => i.id === institutionId) || institutions[0];
  const matchingApp =
    applications.find((a) => a.institutionId === institutionId) ||
    applications[0];

  const handleFileSelect = (file: File) => {
    setSelectedFile({
      file,
      name: file.name,
      size: formatFileSize(file.size),
    });
    // Auto-populate title if empty or default
    if (!title || title.includes('2026-27')) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fileName = selectedFile
      ? selectedFile.name
      : `${documentType.replace(/\s+/g, '_')}_Signed.pdf`;
    const fileSize = selectedFile ? selectedFile.size : '1.8 MB';

    store.uploadDocument(
      {
        applicationId: matchingApp ? matchingApp.id : 'app_01',
        institutionId: matchedInst ? matchedInst.id : 'inst_01',
        documentType,
        title: title || `${documentType} - ${matchedInst?.name || 'Institution'}`,
        fileName,
        fileSize,
        uploadedBy: activeUser.name,
        expiryDate: expiryDate || undefined,
        verificationStatus: 'PENDING',
        renewalStatus: 'VALID',
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile.file) : '#',
      },
      activeUser
    );

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Statutory Document from PC"
      subtitle="Add verified compliance records, certificates, or NOCs into the Document Vault"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Scope info */}
        <div className="p-3 bg-[#F7F7F5] border border-[#E5E5E5] rounded-md text-[11px] text-[#666666]">
          <span className="font-bold text-[#111111]">Target Institution: </span>
          <span>{matchedInst?.name || 'Delhi Institute of Technology & Management'}</span>
          <span className="text-[10px] text-[#888888] font-mono block mt-0.5">
            PID: {matchedInst?.code || '1-33290141'} • Region: {matchedInst?.region || 'North-Western'}
          </span>
        </div>

        {/* Institution Selector for Admins */}
        {activeUser.role === 'SUPER_ADMIN' && (
          <div>
            <label className="block font-bold text-[#111111] mb-1">Select Institution</label>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full p-2 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Document Type Selector */}
        <div>
          <label className="block font-bold text-[#111111] mb-1">
            Prescribed Document Category *
          </label>
          <select
            value={documentType}
            onChange={(e) => {
              const val = e.target.value as ApplicationDocument['documentType'];
              setDocumentType(val);
              setTitle(`${val} - ${matchedInst?.name || 'Institution'}`);
            }}
            className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
          >
            {DOCUMENT_TYPES.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block font-bold text-[#111111] mb-1">Document Record Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Valid State Fire Safety Clearance NOC"
            className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block font-bold text-[#111111] mb-1">
            Validity Expiry Date (Leave empty if perpetual)
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* PC File Upload Zone */}
        <FileUploadZone
          label="Choose File from PC *"
          hint="Select PDF, scan copy, or certificate from your local machine (up to 25 MB)"
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileRemove={() => setSelectedFile(null)}
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 font-medium text-xs text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#EEEEEC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-xs text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

