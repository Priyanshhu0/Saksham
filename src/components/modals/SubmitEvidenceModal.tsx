import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FileUploadZone, formatFileSize } from '../common/FileUploadZone';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { ComplianceUndertaking } from '../../types';

interface SubmitEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  undertaking: ComplianceUndertaking | null;
  onSuccess?: () => void;
}

export const SubmitEvidenceModal: React.FC<SubmitEvidenceModalProps> = ({
  isOpen,
  onClose,
  undertaking,
  onSuccess,
}) => {
  const { store, activeUser } = useSakshamStore();
  const [docName, setDocName] = useState('Compliance_Certificate_Signed.pdf');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: string;
  } | null>(null);

  if (!undertaking) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile({
      file,
      name: file.name,
      size: formatFileSize(file.size),
    });
    setDocName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitUndertakingEvidence(
      undertaking.id,
      selectedFile ? selectedFile.name : docName,
      notes,
      activeUser
    );
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Statutory Compliance Proof"
      subtitle={`${undertaking.title} • Institution: ${undertaking.institutionName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-[#EEEEEC] border border-[#E5E5E5] rounded text-[#111111]">
          <p className="font-bold text-[#111111]">Required Evidence Documentation:</p>
          <p className="mt-0.5 text-[11px] text-[#777777]">{undertaking.evidenceRequired}</p>
        </div>

        <div>
          <label className="block font-bold text-[#111111] mb-1.5">
            Proof Document File Name *
          </label>
          <input
            type="text"
            required
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded font-mono text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* Upload proof file from PC */}
        <FileUploadZone
          label="Select Proof Document from PC *"
          hint="Upload signed compliance certificate, affidavit, or bank statement (PDF, PNG, JPG)"
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileRemove={() => {
            setSelectedFile(null);
            setDocName('Compliance_Certificate_Signed.pdf');
          }}
        />

        <div>
          <label className="block font-bold text-[#111111] mb-1.5">
            Institutional Submission Remarks *
          </label>
          <textarea
            required
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Affirm correctness of uploaded records, registration numbers, and dates of compliance..."
            className="w-full p-3 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 font-medium text-xs text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Submit for Verification
          </button>
        </div>
      </form>
    </Modal>
  );
};
