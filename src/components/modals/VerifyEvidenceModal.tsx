import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { ComplianceUndertaking } from '../../types';

interface VerifyEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  undertaking: ComplianceUndertaking | null;
}

export const VerifyEvidenceModal: React.FC<VerifyEvidenceModalProps> = ({
  isOpen,
  onClose,
  undertaking,
}) => {
  const { store, activeUser } = useSakshamStore();
  const [decision, setDecision] = useState<'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [notes, setNotes] = useState('');

  if (!undertaking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    store.verifyUndertaking(
      undertaking.id,
      decision === 'VERIFIED',
      notes.trim(),
      activeUser
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Institutional Compliance Submission"
      subtitle={`${undertaking.title} • ${undertaking.institutionName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Evidence preview box */}
        <div className="p-3.5 bg-[#F7F7F5] border border-[#E5E5E5] rounded space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#777777] block tracking-wider">Uploaded Evidence:</span>
          <p className="font-bold text-[#111111]">
            {undertaking.evidenceSubmitted?.documentName || 'Document uploaded'}
          </p>
          <p className="text-[11px] text-[#777777] italic">
            "{undertaking.evidenceSubmitted?.submissionNotes || 'No notes provided by institution'}"
          </p>
        </div>

        <div>
          <label className="block font-bold text-[#111111] mb-2">
            Verification Statutory Determination *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`p-3 rounded border flex items-center gap-2.5 cursor-pointer transition-all ${
                decision === 'VERIFIED'
                  ? 'border-[#111111] bg-[#EEEEEC] font-semibold text-[#111111]'
                  : 'border-[#E5E5E5] bg-white text-[#777777] hover:border-[#CCCCCC]'
              }`}
            >
              <input
                type="radio"
                name="decision"
                checked={decision === 'VERIFIED'}
                onChange={() => setDecision('VERIFIED')}
                className="accent-[#111111]"
              />
              <CheckCircle2 className="w-4 h-4 text-[#111111]" />
              <span>Verify & Pass</span>
            </label>

            <label
              className={`p-3 rounded border flex items-center gap-2.5 cursor-pointer transition-all ${
                decision === 'REJECTED'
                  ? 'border-[#DC2626] bg-[#FEF2F2] font-semibold text-[#991B1B]'
                  : 'border-[#E5E5E5] bg-white text-[#777777] hover:border-[#CCCCCC]'
              }`}
            >
              <input
                type="radio"
                name="decision"
                checked={decision === 'REJECTED'}
                onChange={() => setDecision('REJECTED')}
                className="accent-[#DC2626]"
              />
              <XCircle className="w-4 h-4 text-[#DC2626]" />
              <span>Return for Correction</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#111111] mb-1.5">
            Official Regulatory Scrutiny Findings * (Mandatory)
          </label>
          <textarea
            required
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record specific evaluation notes, cross-reference with central database, or specify deficiency reasons..."
            className="w-full p-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 font-medium text-xs text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#EEEEEC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!notes.trim()}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 font-medium text-xs text-white rounded transition-colors cursor-pointer ${
              decision === 'VERIFIED' ? 'bg-[#111111] hover:bg-[#222222]' : 'bg-[#DC2626] hover:bg-[#B91C1C]'
            }`}
          >
            Confirm Verification Decision
          </button>
        </div>
      </form>
    </Modal>
  );
};
