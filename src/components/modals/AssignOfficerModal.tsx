import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useSakshamStore } from '../../hooks/useSakshamStore';

interface AssignOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export const AssignOfficerModal: React.FC<AssignOfficerModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const { store, applications, users, activeUser } = useSakshamStore();
  const app = applications.find((a) => a.id === applicationId);

  const eligibleOfficers = users.filter(
    (u) => u.role === 'REGIONAL_OFFICER' || u.role === 'BUREAU_OFFICER' || u.role === 'SUPER_ADMIN'
  );

  const [selectedOfficerId, setSelectedOfficerId] = useState(
    app?.assignedOfficerId || eligibleOfficers[0]?.id || ''
  );

  if (!app) return null;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const officer = users.find((u) => u.id === selectedOfficerId);
    if (!officer) return;

    store.assignOfficer(app.id, officer.id, officer.name, activeUser);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reassign Scrutiny Officer"
      subtitle={`${app.applicationNumber} • Current: ${app.assignedOfficerName}`}
      maxWidth="sm"
    >
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1.5">
            Designated Scrutiny Officer *
          </label>
          <select
            value={selectedOfficerId}
            onChange={(e) => setSelectedOfficerId(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
          >
            {eligibleOfficers.map((off) => (
              <option key={off.id} value={off.id}>
                {off.name} ({off.designation} - {off.region})
              </option>
            ))}
          </select>
        </div>

        <p className="text-[11px] text-[#777777] leading-relaxed">
          The assigned officer receives statutory responsibility for preliminary verification, deficiency reporting, and processing timeline monitoring.
        </p>

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
            <UserCheck className="w-3.5 h-3.5" /> Reassign
          </button>
        </div>
      </form>
    </Modal>
  );
};
