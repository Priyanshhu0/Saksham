import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FileUploadZone, formatFileSize } from '../common/FileUploadZone';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { ApplicationDocument } from '../../types';

interface RenewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ApplicationDocument | null;
  onSuccess?: () => void;
}

export const RenewDocumentModal: React.FC<RenewDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  onSuccess,
}) => {
  const { store, activeUser } = useSakshamStore();
  const [newExpiry, setNewExpiry] = useState('2028-03-31');
  const [newFileName, setNewFileName] = useState(
    document ? `Renewed_${document.fileName}` : 'Renewed_Document.pdf'
  );
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: string;
  } | null>(null);

  if (!document) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile({
      file,
      name: file.name,
      size: formatFileSize(file.size),
    });
    setNewFileName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.renewDocument(
      document.id,
      newExpiry,
      selectedFile ? selectedFile.name : newFileName,
      activeUser
    );
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Renewed Statutory Document"
      subtitle={`${document.title} • Current Expiry: ${document.expiryDate || 'N/A'}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-[#EEEEEC] border border-[#E5E5E5] rounded text-[#111111]">
          <p className="font-bold text-[#111111]">Statutory Renewal Workflow:</p>
          <p className="mt-0.5 text-[11px] text-[#777777]">
            Uploading an authenticated renewal updates the expiry radar and queues the certificate for Regional Scrutiny verification.
          </p>
        </div>

        <div>
          <label className="block font-bold text-[#111111] mb-1.5">
            Renewed File Document Name *
          </label>
          <input
            type="text"
            required
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded font-mono text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* Upload from PC */}
        <FileUploadZone
          label="Select Renewed File from PC *"
          hint="Attach latest signed clearance copy from your PC (PDF, DOC, or scan)"
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileRemove={() => {
            setSelectedFile(null);
            setNewFileName(`Renewed_${document.fileName}`);
          }}
        />

        <div>
          <label className="block font-bold text-[#111111] mb-1.5">
            New Prescribed Validity Expiry Date *
          </label>
          <input
            type="date"
            required
            value={newExpiry}
            onChange={(e) => setNewExpiry(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
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
            <RefreshCw className="w-3.5 h-3.5" /> Submit Renewal
          </button>
        </div>
      </form>
    </Modal>
  );
};
