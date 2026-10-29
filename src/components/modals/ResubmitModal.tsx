import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FileUploadZone, formatFileSize } from '../common/FileUploadZone';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { Application } from '../../types';

interface ResubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  application?: Application;
  onSuccess?: () => void;
}

export const ResubmitModal: React.FC<ResubmitModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  application,
  onSuccess,
}) => {
  const { store, applications, activeUser } = useSakshamStore();
  const targetId = applicationId || application?.id || '';
  const app = applications.find((a) => a.id === targetId) || application;

  const [rectificationRemarks, setRectificationRemarks] = useState('');
  const [uploadedEvidenceName, setUploadedEvidenceName] = useState('Rectification_Evidence_Signed.pdf');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: string;
  } | null>(null);

  if (!app) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile({
      file,
      name: file.name,
      size: formatFileSize(file.size),
    });
    setUploadedEvidenceName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = selectedFile ? selectedFile.name : uploadedEvidenceName;
    store.resubmitApplication(
      app.id,
      `Rectification file uploaded: ${finalName}. Remarks: ${rectificationRemarks}`,
      activeUser
    );
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resubmit Application for Re-Scrutiny"
      subtitle={`${app.applicationNumber} • Deficiency Compliance Filing`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-[#EEEEEC] border border-[#E5E5E5] rounded text-[#111111]">
          <p className="font-bold text-[#111111]">Compliance Submission by Head of Institution</p>
          <p className="mt-0.5 text-[11px] text-[#777777]">
            Uploading satisfactory rectifications clears the deficiency hold and automatically initiates re-scrutiny by the regional officer.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1.5">
            Rectification Document Label *
          </label>
          <input
            type="text"
            value={uploadedEvidenceName}
            onChange={(e) => setUploadedEvidenceName(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* Upload file from PC */}
        <FileUploadZone
          label="Attach Rectification Document from PC *"
          hint="Select rectified compliance document, affidavit, or plan from your PC (PDF, DOC)"
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileRemove={() => {
            setSelectedFile(null);
            setUploadedEvidenceName('Rectification_Evidence_Signed.pdf');
          }}
        />

        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1.5">
            Point-by-Point Rectification Remarks *
          </label>
          <textarea
            required
            rows={4}
            value={rectificationRemarks}
            onChange={(e) => setRectificationRemarks(e.target.value)}
            placeholder="Address each observation item in detail with references to attached documents..."
            className="w-full text-xs p-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#EEEEEC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Submit for Re-Scrutiny
          </button>
        </div>
      </form>
    </Modal>
  );
};
