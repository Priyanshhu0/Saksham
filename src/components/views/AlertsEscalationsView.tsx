import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Zap,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { Modal } from '../common/Modal';
import type { NotificationItem } from '../../types';

interface AlertsEscalationsViewProps {
  onSelectApplication: (appId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const AlertsEscalationsView: React.FC<AlertsEscalationsViewProps> = ({
  onSelectApplication,
}) => {
  const { store, notifications, activeUser } = useSakshamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedAlertForResolve, setSelectedAlertForResolve] = useState<NotificationItem | null>(null);
  const [resolveReason, setResolveReason] = useState('');

  const filteredNotifications = notifications.filter((notif) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!notif.title.toLowerCase().includes(q) && !notif.message.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (severityFilter !== 'ALL' && notif.severity !== severityFilter) return false;
    return true;
  });

  const handleResolveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForResolve || !resolveReason.trim()) return;

    store.markNotificationAsRead(selectedAlertForResolve.id);
    setSelectedAlertForResolve(null);
    setResolveReason('');
  };

  const handleTriggerSimulatedAlert = () => {
    store.simulateDeadlineTrigger();
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            Alerts &amp; Escalations
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Deadline reminders, overdue applications, inspection warnings, and statutory escalations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTriggerSimulatedAlert}
            className="h-8 px-3 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Demonstration Trigger"
          >
            <Zap className="w-3.5 h-3.5 text-[#111111]" />
            <span>Simulate T-1 Day Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#E5E5E5] flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-56">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title, description..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical (Overdue)</option>
          <option value="WARNING">Warning (Due Soon)</option>
          <option value="INFO">Informational</option>
        </select>

        <button
          onClick={() => store.markAllNotificationsAsRead()}
          className="h-8 px-2.5 text-xs text-[#777777] hover:text-[#111111] font-medium cursor-pointer ml-auto"
        >
          Acknowledge All
        </button>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                <th className="py-2.5 px-4">Alert Title</th>
                <th className="py-2.5 px-4">Related Record</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#777777]">
                    No active alerts matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 px-4 max-w-72">
                      <div className="font-semibold text-[#111111] flex items-center gap-1.5">
                        {notif.severity === 'CRITICAL' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                        )}
                        <span className="truncate">{notif.title}</span>
                      </div>
                      <div className="text-[11px] text-[#777777] line-clamp-1 mt-0.5">
                        {notif.message}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">
                      {notif.relatedApplicationId ? (
                        <button
                          onClick={() => onSelectApplication(notif.relatedApplicationId!)}
                          className="font-medium text-[#111111] hover:underline cursor-pointer"
                        >
                          {notif.relatedApplicationId}
                        </button>
                      ) : (
                        'System Wide'
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#777777] whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          notif.severity === 'CRITICAL'
                            ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                            : notif.severity === 'WARNING'
                            ? 'bg-[#EEEEEC] text-[#111111] border-[#E5E5E5]'
                            : 'bg-[#F7F7F5] text-[#777777] border-[#E5E5E5]'
                        }`}
                      >
                        {notif.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] text-[#777777]">
                        {notif.isRead ? 'Acknowledged' : 'New'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {!notif.isRead ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => store.markNotificationAsRead(notif.id)}
                            className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium cursor-pointer"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => setSelectedAlertForResolve(notif)}
                            className="px-2.5 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                          >
                            Resolve
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#777777]">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Alert Modal */}
      {selectedAlertForResolve && (
        <Modal
          isOpen={!!selectedAlertForResolve}
          onClose={() => setSelectedAlertForResolve(null)}
          title="Resolve Statutory Alert"
          subtitle={selectedAlertForResolve.title}
        >
          <form onSubmit={handleResolveAlert} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">
                Resolution Remarks &amp; Justification *
              </label>
              <textarea
                required
                rows={3}
                value={resolveReason}
                onChange={(e) => setResolveReason(e.target.value)}
                placeholder="State the resolution action taken, officer confirmation, or compliance filing references..."
                className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setSelectedAlertForResolve(null)}
                className="px-3 py-1.5 text-xs text-[#777777] hover:text-[#111111] rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!resolveReason.trim()}
                className="px-4 py-1.5 rounded bg-[#111111] hover:bg-[#222222] disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
