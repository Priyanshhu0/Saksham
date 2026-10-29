import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Save, User, Sliders, BellRing, FileText } from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';

export const SettingsView: React.FC = () => {
  const { store, settings, activeUser } = useSakshamStore();

  const [reminderDays, setReminderDays] = useState(
    settings.reminderDaysBeforeDeadline.join(', ')
  );
  const [gracePeriod, setGracePeriod] = useState(settings.escalationGracePeriodDays);
  const [autoEscalate, setAutoEscalate] = useState(settings.autoEscalateOverdue);
  const [emailAlerts, setEmailAlerts] = useState(settings.emailNotificationsEnabled);
  const [smsAlerts, setSmsAlerts] = useState(settings.smsAlertsEnabled);
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDays = reminderDays
      .split(',')
      .map((d) => parseInt(d.trim(), 10))
      .filter((n) => !isNaN(n));

    store.updateSettings(
      {
        reminderDaysBeforeDeadline: parsedDays,
        escalationGracePeriodDays: Number(gracePeriod),
        autoEscalateOverdue: autoEscalate,
        emailNotificationsEnabled: emailAlerts,
        smsAlertsEnabled: smsAlerts,
      },
      activeUser
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Reset demo applications, EVC visits, and compliance records to baseline state?')) {
      store.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12 font-sans text-[#111111]">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
          Settings
        </h1>
        <p className="text-xs text-[#777777] mt-0.5">
          User profile, SLA deadline reminder thresholds, workflow parameters, and demonstration dataset controls.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded text-xs text-[#111111] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
          <span>Settings successfully saved and recorded to audit journal.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
        {/* User Profile */}
        <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5]">
            <User className="w-4 h-4 text-[#111111]" />
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">User Profile &amp; Role</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#777777] block mb-1">Active Name</span>
              <div className="font-semibold text-[#111111] text-xs">{activeUser.name}</div>
            </div>
            <div>
              <span className="text-[#777777] block mb-1">Assigned Role</span>
              <div className="font-semibold text-[#111111] text-xs">{activeUser.role.replace(/_/g, ' ')}</div>
            </div>
            <div>
              <span className="text-[#777777] block mb-1">Jurisdiction / Region</span>
              <div className="font-semibold text-[#111111] text-xs">{activeUser.region} Region</div>
            </div>
            <div>
              <span className="text-[#777777] block mb-1">Official Email</span>
              <div className="font-mono text-[#777777] text-[11px]">{activeUser.email}</div>
            </div>
          </div>
        </div>

        {/* Workflow Configuration */}
        <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5]">
            <FileText className="w-4 h-4 text-[#111111]" />
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Workflow Configuration</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">
                Active Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full h-8 px-2.5 bg-[#F7F7F5] border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#111111] mb-1">
                Handbook Reference
              </label>
              <input
                type="text"
                disabled
                value="AICTE/APH/2026-27"
                className="w-full h-8 px-2.5 bg-[#F7F7F5] border border-[#E5E5E5] rounded text-xs text-[#777777] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Deadline Reminder Thresholds */}
        <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5]">
            <Sliders className="w-4 h-4 text-[#111111]" />
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Deadline Reminder Configuration</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">
                Reminder Notice Days (T-Minus)
              </label>
              <input
                type="text"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                placeholder="30, 15, 7, 1"
                className="w-full h-8 px-2.5 bg-[#F7F7F5] border border-[#E5E5E5] rounded font-mono text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
              <span className="text-[10px] text-[#777777] mt-1 block">
                Comma-separated days before SLA to dispatch notices
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">
                Grace Period Buffer (Days)
              </label>
              <input
                type="number"
                min={0}
                max={15}
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-[#F7F7F5] border border-[#E5E5E5] rounded font-mono text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
              <span className="text-[10px] text-[#777777] mt-1 block">
                Buffer days before auto-escalation triggers
              </span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5]">
            <BellRing className="w-4 h-4 text-[#111111]" />
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Notification Preferences</h2>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="mt-0.5 accent-[#111111] rounded cursor-pointer"
              />
              <div>
                <span className="font-semibold text-[#111111] block">
                  Automatic SLA Escalation to Bureau
                </span>
                <span className="text-[11px] text-[#777777]">
                  Automatically elevate stalled scrutiny files and overdue EVC visits to Regional Officer and Member Secretary.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-0.5 accent-[#111111] rounded cursor-pointer"
              />
              <div>
                <span className="font-semibold text-[#111111] block">NIC Email Dispatch Gateway</span>
                <span className="text-[11px] text-[#777777]">
                  Transmit statutory deficiency notices and approval letters via NIC gateway.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-0.5 accent-[#111111] rounded cursor-pointer"
              />
              <div>
                <span className="font-semibold text-[#111111] block">SMS Alert Gateway</span>
                <span className="text-[11px] text-[#777777]">
                  Issue urgent T-1 day deadline warnings to Heads of Institutions.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Actions & Baseline Reset */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="h-8 px-3 rounded bg-white border border-[#DC2626]/40 hover:bg-[#FEE2E2]/30 text-[#DC2626] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>

          <button
            type="submit"
            className="h-8 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
