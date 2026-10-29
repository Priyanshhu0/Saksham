import React, { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useSakshamStore } from '../../hooks/useSakshamStore';

interface DeficiencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export const DeficiencyModal: React.FC<DeficiencyModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const { store, applications, activeUser } = useSakshamStore();
  const [observationText, setObservationText] = useState('');
  const [deficiencyCategory, setDeficiencyCategory] = useState('INFRASTRUCTURE');

  const app = applications.find((a) => a.id === applicationId);
  if (!app) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;

    store.returnForDeficiency(
      app.id,
      `[${deficiencyCategory}] ${observationText.trim()}`,
      activeUser
    );
    setObservationText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Return Application for Deficiencies"
      subtitle={`Statutory notice to ${app.institutionName} (${app.applicationNumber})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded flex items-start gap-3 text-xs text-[#991B1B]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
          <div>
            <p className="font-bold text-[#991B1B]">Mandatory Statutory Observation Required</p>
            <p className="mt-0.5 text-[11px] text-[#7F1D1D]">
              Returning the application pauses the standard approval pipeline and activates an official 15-day rectification window for the institution.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1.5">
            Deficiency Category *
          </label>
          <select
            value={deficiencyCategory}
            onChange={(e) => setDeficiencyCategory(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
          >
            <option value="INFRASTRUCTURE">Physical Infrastructure / Built-Up Area Shortfall</option>
            <option value="FACULTY_CADRE">Faculty Cadre Ratio & Cadre Qualification Deficit</option>
            <option value="FIRE_SAFETY">Expired Fire Safety NOC or PWD Structural Stability Certificate</option>
            <option value="LAND_TITLE">Land Lease / Title Demarcation Discrepancy</option>
            <option value="LAB_EQUIPMENT">Laboratory Equipment / Software License Deficit</option>
            <option value="STATUTORY_FEE">Corpus Fund / Regulatory Processing Fee Discrepancy</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1.5">
            Detailed Deficiency Observations & Rectification Instructions *
          </label>
          <textarea
            required
            rows={4}
            value={observationText}
            onChange={(e) => setObservationText(e.target.value)}
            placeholder="Specify precise clauses of AICTE Approval Process Handbook violated and documentation required for compliance..."
            className="w-full text-xs p-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-[#111111] bg-white border border-[#E5E5E5] rounded hover:bg-[#EEEEEC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!observationText.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 rounded transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Issue Statutory Notice
          </button>
        </div>
      </form>
    </Modal>
  );
};
