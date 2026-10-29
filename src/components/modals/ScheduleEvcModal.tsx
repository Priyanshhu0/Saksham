import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useSakshamStore } from '../../hooks/useSakshamStore';

interface ScheduleEvcModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAppId?: string;
}

export const ScheduleEvcModal: React.FC<ScheduleEvcModalProps> = ({
  isOpen,
  onClose,
  targetAppId,
}) => {
  const { store, applications, activeUser } = useSakshamStore();

  const eligibleApps = applications.filter(
    (a) => a.workflowRoute.includes('EVC') && (a.currentStage === 'PENDING_EVC' || a.currentStage === 'PRELIMINARY_SCRUTINY' || a.currentStage === 'EVC_SCHEDULED')
  );

  const [selectedAppId, setSelectedAppId] = useState(targetAppId || eligibleApps[0]?.id || applications[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState('2026-11-04');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM IST');

  // Committee members state
  const [chairmanName, setChairmanName] = useState('Prof. (Dr.) Rajesh K. Verma');
  const [chairmanOrg, setChairmanOrg] = useState('IIT Roorkee');
  const [memberExpertName, setMemberExpertName] = useState('Prof. Sneha Kulkarni');
  const [memberExpertOrg, setMemberExpertOrg] = useState('COEP Pune');

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    store.scheduleEvcVisit(
      {
        applicationId: selectedApp.id,
        institutionId: selectedApp.institutionId,
        institutionName: selectedApp.institutionName,
        institutionCode: selectedApp.institutionCode,
        region: selectedApp.region,
        scheduledDate,
        scheduledTime,
        committeeMembers: [
          {
            name: chairmanName,
            designation: `Professor, ${chairmanOrg}`,
            organization: chairmanOrg,
            roleInCommittee: 'Chairman',
          },
          {
            name: memberExpertName,
            designation: `Professor, ${memberExpertOrg}`,
            organization: memberExpertOrg,
            roleInCommittee: 'Member Expert',
          },
          {
            name: activeUser.name,
            designation: activeUser.designation,
            organization: 'AICTE Regional Office',
            roleInCommittee: 'AICTE Representative',
          },
        ],
        checklist: [
          { id: 'c1', item: 'Verification of Carpet Area & Approved Blueprints', checked: true },
          { id: 'c2', item: 'Inspection of New Engineering/Tech Laboratories', checked: false },
          { id: 'c3', item: 'Faculty cadre ratio and biometric attendance logs', checked: false },
          { id: 'c4', item: 'Fire safety equipment & barrier-free accessibility', checked: false },
        ],
      },
      activeUser
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Constitute & Schedule Expert Visiting Committee (EVC)"
      subtitle="Statutory physical site inspection per AICTE Regulations"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#111111] mb-1.5">
            Target Institutional Application *
          </label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
          >
            {eligibleApps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.applicationNumber} — {a.institutionName} ({a.region})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#111111] mb-1.5">
              Inspection Date *
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#111111] mb-1.5">
              Visit Assembly Time *
            </label>
            <input
              type="text"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>

        {/* Committee Setup */}
        <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
          <label className="block font-bold text-[#111111]">
            Designated EVC Committee Composition (3 Members)
          </label>

          <div className="p-3.5 bg-[#F7F7F5] border border-[#E5E5E5] rounded space-y-3">
            <div>
              <span className="text-[#777777] font-bold block text-[10px] uppercase tracking-wider">
                1. Committee Chairman (External Senior Academician)
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <input
                  type="text"
                  placeholder="Chairman Name"
                  value={chairmanName}
                  onChange={(e) => setChairmanName(e.target.value)}
                  className="p-2 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
                <input
                  type="text"
                  placeholder="Institution / IIT / NIT"
                  value={chairmanOrg}
                  onChange={(e) => setChairmanOrg(e.target.value)}
                  className="p-2 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <span className="text-[#777777] font-bold block text-[10px] uppercase tracking-wider">
                2. Subject Expert Member
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <input
                  type="text"
                  placeholder="Expert Name"
                  value={memberExpertName}
                  onChange={(e) => setMemberExpertName(e.target.value)}
                  className="p-2 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
                <input
                  type="text"
                  placeholder="University / Organization"
                  value={memberExpertOrg}
                  onChange={(e) => setMemberExpertOrg(e.target.value)}
                  className="p-2 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="text-[11px] text-[#777777] pt-1 border-t border-[#E5E5E5]">
              3. AICTE Representative: <strong className="text-[#111111]">{activeUser.name}</strong> ({activeUser.designation})
            </div>
          </div>
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
            className="px-4 py-1.5 font-medium text-xs text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors cursor-pointer"
          >
            Confirm & Dispatch EVC Orders
          </button>
        </div>
      </form>
    </Modal>
  );
};
