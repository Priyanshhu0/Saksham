import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { StageId } from '../../types';

interface AdvanceStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export const AdvanceStageModal: React.FC<AdvanceStageModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const { store, applications, activeUser } = useSakshamStore();
  const app = applications.find((a) => a.id === applicationId);

  const [nextStage, setNextStage] = useState<StageId>('COMPETENT_AUTHORITY_DECISION');
  const [comments, setComments] = useState('');

  if (!app) return null;

  // Determine logical next stages based on current stage and route
  const getPermittedNextStages = (): { id: StageId; label: string }[] => {
    switch (app.currentStage) {
      case 'APPLICATION_SUBMITTED':
        return [{ id: 'PRELIMINARY_SCRUTINY', label: 'Preliminary Scrutiny' }];
      case 'PRELIMINARY_SCRUTINY':
      case 'RE_SCRUTINY':
        if (app.workflowRoute.includes('EVC')) {
          return [
            { id: 'EVC_SCHEDULED', label: 'Constitute EVC & Fix Visit Date' },
            { id: 'COMPETENT_AUTHORITY_DECISION', label: 'Forward Directly to Competent Authority' },
          ];
        }
        return [
          { id: 'COMPETENT_AUTHORITY_DECISION', label: 'Forward to Competent Authority (Council)' },
        ];
      case 'EVC_SCHEDULED':
        return [{ id: 'EVC_VISIT_CONDUCTED', label: 'EVC Visit Conducted & Report Submitted' }];
      case 'EVC_VISIT_CONDUCTED':
        if (app.workflowRoute.includes('SAC')) {
          return [{ id: 'SAC_SHC_REVIEW', label: 'Standing Appellate Committee (SAC) Review' }];
        }
        return [{ id: 'COMPETENT_AUTHORITY_DECISION', label: 'Forward to Competent Authority' }];
      case 'SAC_SHC_REVIEW':
        return [{ id: 'COMPETENT_AUTHORITY_DECISION', label: 'Competent Authority Final Decision' }];
      case 'COMPETENT_AUTHORITY_DECISION':
        return [
          { id: 'APPROVAL_ISSUED', label: 'Issue Formal Extension of Approval (EoA)' },
          { id: 'REJECTED_CLOSED', label: 'Reject & Issue Closure Order' },
        ];
      default:
        return [{ id: 'COMPETENT_AUTHORITY_DECISION', label: 'Advance Stage' }];
    }
  };

  const permitted = getPermittedNextStages();

  const handleAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    store.advanceApplicationStage(
      app.id,
      nextStage,
      comments || `Advanced to ${nextStage.replace(/_/g, ' ')} by ${activeUser.name}`,
      activeUser
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advance Application Workflow Stage"
      subtitle={`${app.applicationNumber} • Current: ${app.currentStage.replace(/_/g, ' ')}`}
      maxWidth="md"
    >
      <form onSubmit={handleAdvance} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#111111] mb-2">
            Target Workflow Stage *
          </label>
          <div className="space-y-2">
            {permitted.map((stg) => (
              <label
                key={stg.id}
                className={`flex items-center gap-3 p-3 rounded border text-xs cursor-pointer transition-all ${
                  nextStage === stg.id
                    ? 'border-[#111111] bg-[#EEEEEC] font-semibold text-[#111111]'
                    : 'border-[#E5E5E5] bg-white text-[#777777] hover:border-[#CCCCCC]'
                }`}
              >
                <input
                  type="radio"
                  name="nextStage"
                  value={stg.id}
                  checked={nextStage === stg.id}
                  onChange={() => setNextStage(stg.id)}
                  className="accent-[#111111]"
                />
                <span className="text-xs">{stg.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1.5">
            Administrative Rationale & Remarks *
          </label>
          <textarea
            required
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Document prerequisites satisfied, committee resolutions, or scrutiny clearance rationale..."
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Transition
          </button>
        </div>
      </form>
    </Modal>
  );
};
