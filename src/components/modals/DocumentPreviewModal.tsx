import React from 'react';
import { Download, ShieldCheck, Landmark } from 'lucide-react';
import { Modal } from '../common/Modal';
import { ApplicationDocument } from '../../types';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ApplicationDocument | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Digital Document Repository"
      subtitle={`${document.title} • Saksham Document Registry`}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Certificate Mock Header */}
        <div className="border border-[#E5E5E5] rounded p-6 bg-[#F7F7F5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white border border-[#E5E5E5] text-[#111111] flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#111111] text-sm tracking-tight">STATUTORY REGULATORY ARCHIVE</h4>
                <p className="text-[10px] text-[#777777] uppercase tracking-wider font-semibold">
                  Saksham • AICTE Compliance Document Vault
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded font-semibold text-[10px] bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
              {document.verificationStatus}
            </span>
          </div>

          <div className="space-y-1.5 text-[#111111]">
            <p className="font-bold text-sm text-[#111111]">{document.title}</p>
            <p className="text-[11px] text-[#777777]">
              Document Category: <strong className="text-[#111111]">{document.documentType}</strong>
            </p>
            <p className="text-[11px] text-[#777777]">
              Registered File: <strong className="text-[#111111]">{document.fileName}</strong> ({document.fileSize})
            </p>
            {document.expiryDate && (
              <p className="text-[11px] text-[#777777]">
                Prescribed Validity / Expiry Date: <strong className="text-[#111111]">{document.expiryDate}</strong>
              </p>
            )}
          </div>

          {/* Simulated digital signature seal */}
          <div className="p-3.5 bg-white border border-[#E5E5E5] rounded flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
              <div>
                <span className="font-bold text-[#111111] text-xs block">
                  Saksham Authenticated Digital Seal
                </span>
                <span className="text-[10px] text-[#777777] font-mono">
                  SHA256: 8f4b238a9e7c10b542e7182939c0fa4...
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#111111] font-semibold">Encrypted & Verified</span>
          </div>

          {document.verificationNotes && (
            <div className="p-3.5 bg-white border border-[#E5E5E5] rounded text-[#111111]">
              <span className="font-bold text-xs text-[#111111] block">Verification Remarks:</span>
              <p className="text-xs text-[#777777] mt-1">{document.verificationNotes}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 font-medium text-xs text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#EEEEEC] transition-colors"
          >
            Close Viewer
          </button>
          <button
            onClick={() => alert(`Downloaded verified copy of ${document.fileName}`)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 font-medium text-xs text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Watermarked Copy
          </button>
        </div>
      </div>
    </Modal>
  );
};
