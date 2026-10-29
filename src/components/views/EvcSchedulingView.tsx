import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  CalendarDays,
  List,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { ScheduleEvcModal } from '../modals/ScheduleEvcModal';
import { Modal } from '../common/Modal';

export const EvcSchedulingView: React.FC = () => {
  const { store, evcVisits, applications, activeUser } = useSakshamStore();
  const [filterMode, setFilterMode] = useState<'UPCOMING' | 'UNSCHEDULED' | 'COMPLETED'>('UPCOMING');
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedVisitForReport, setSelectedVisitForReport] = useState<string | null>(null);
  const [reportOutcome, setReportOutcome] = useState<'RECOMMENDED' | 'DEFICIENT'>('RECOMMENDED');
  const [reportNotes, setReportNotes] = useState('');

  // Unscheduled applications eligible for EVC
  const unscheduledApps = applications.filter(
    (a) =>
      a.workflowRoute.includes('EVC') &&
      (a.currentStage === 'PENDING_EVC' || a.currentStage === 'PRELIMINARY_SCRUTINY') &&
      !evcVisits.some((v) => v.applicationId === a.id)
  );

  const upcomingVisits = evcVisits.filter(
    (v) => v.status === 'SCHEDULED' || v.status === 'PROPOSED' || v.status === 'CONFIRMED'
  );

  const completedVisits = evcVisits.filter(
    (v) => v.status === 'REPORT_SUBMITTED' || v.status === 'CONDUCTED' || v.status === 'COMPLETED'
  );

  const displayedVisits =
    filterMode === 'UPCOMING'
      ? upcomingVisits
      : filterMode === 'COMPLETED'
      ? completedVisits
      : [];

  const handleCompleteVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitForReport) return;

    store.submitEvcReport(
      selectedVisitForReport,
      reportOutcome as any,
      reportNotes,
      activeUser
    );

    setSelectedVisitForReport(null);
    setReportNotes('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            EVC Management
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Expert Visiting Committee on-site inspection calendar, committee assignments, and visit reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Calendar / List Toggle */}
          <div className="flex items-center border border-[#E5E5E5] rounded bg-white p-0.5">
            <button
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded text-xs inline-flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'LIST' ? 'bg-[#111111] text-white font-medium' : 'text-[#777777] hover:text-[#111111]'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`p-1.5 rounded text-xs inline-flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'CALENDAR' ? 'bg-[#111111] text-white font-medium' : 'text-[#777777] hover:text-[#111111]'
              }`}
              title="Calendar View"
            >
              <CalendarDays className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="h-8 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule EVC</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: Upcoming Visits, Unscheduled, Completed */}
      <div className="flex items-center gap-1 border-b border-[#E5E5E5] text-xs">
        <button
          onClick={() => setFilterMode('UPCOMING')}
          className={`px-3 py-2 font-medium border-b-2 cursor-pointer transition-colors ${
            filterMode === 'UPCOMING'
              ? 'border-[#111111] text-[#111111] font-bold'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          Upcoming Visits ({upcomingVisits.length})
        </button>
        <button
          onClick={() => setFilterMode('UNSCHEDULED')}
          className={`px-3 py-2 font-medium border-b-2 cursor-pointer transition-colors ${
            filterMode === 'UNSCHEDULED'
              ? 'border-[#111111] text-[#111111] font-bold'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          Unscheduled Eligible ({unscheduledApps.length})
        </button>
        <button
          onClick={() => setFilterMode('COMPLETED')}
          className={`px-3 py-2 font-medium border-b-2 cursor-pointer transition-colors ${
            filterMode === 'COMPLETED'
              ? 'border-[#111111] text-[#111111] font-bold'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          Completed Visits ({completedVisits.length})
        </button>
      </div>

      {/* Calendar View Mode */}
      {viewMode === 'CALENDAR' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              November 2026 EVC Visit Schedule
            </h3>
            <span className="text-xs text-[#777777] font-mono">Month View</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="font-semibold text-[#777777] py-1 text-[11px]">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDate = `2026-11-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
              const visitsOnDay = evcVisits.filter((v) => v.scheduledDate === formattedDate);

              return (
                <div
                  key={i}
                  className={`min-h-16 p-1.5 rounded border text-left text-xs ${
                    visitsOnDay.length > 0
                      ? 'border-[#111111] bg-[#FAFAFA]'
                      : 'border-[#E5E5E5] bg-[#F7F7F5]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#777777] font-semibold">{dayNum}</span>
                  {visitsOnDay.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVisitForReport(v.id)}
                      className="mt-1 p-1 rounded bg-white border border-[#E5E5E5] hover:border-[#111111] text-[10px] font-semibold text-[#111111] truncate cursor-pointer"
                      title={`${v.institutionName} (${v.status})`}
                    >
                      {v.institutionName.split(' ')[0]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List / Table View Mode */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          {filterMode === 'UNSCHEDULED' ? (
            /* Unscheduled Applications Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                    <th className="py-2.5 px-4">Application ID</th>
                    <th className="py-2.5 px-4">Institution</th>
                    <th className="py-2.5 px-4">Region</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Current Stage</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {unscheduledApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#777777]">
                        No unscheduled EVC applications. All eligible files are rostered.
                      </td>
                    </tr>
                  ) : (
                    unscheduledApps.map((app) => (
                      <tr key={app.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3 px-4 font-mono font-medium">{app.applicationNumber}</td>
                        <td className="py-3 px-4 font-semibold text-[#111111]">{app.institutionName}</td>
                        <td className="py-3 px-4 text-[#777777]">{app.region}</td>
                        <td className="py-3 px-4 text-[#555555]">{app.approvalType}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                            {app.currentStage.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setIsScheduleOpen(true)}
                            className="px-3 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                          >
                            Schedule Now
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Upcoming / Completed Visits Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                    <th className="py-2.5 px-4">Institution</th>
                    <th className="py-2.5 px-4">Application ID</th>
                    <th className="py-2.5 px-4">Visit Date</th>
                    <th className="py-2.5 px-4">Committee Chairman</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                  {displayedVisits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#777777]">
                        No visits recorded for this view.
                      </td>
                    </tr>
                  ) : (
                    displayedVisits.map((visit) => {
                      const chairman = visit.committeeMembers?.find((m) => m.roleInCommittee === 'Chairman');
                      const isCompleted =
                        visit.status === 'REPORT_SUBMITTED' ||
                        visit.status === 'CONDUCTED' ||
                        visit.status === 'COMPLETED';

                      return (
                        <tr key={visit.id} className="hover:bg-[#FAFAFA] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#111111]">{visit.institutionName}</div>
                            <div className="text-[10px] text-[#777777] font-mono">{visit.institutionCode}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">
                            {visit.applicationId}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-mono text-xs font-semibold text-[#111111]">
                              {visit.scheduledDate}
                            </div>
                            <div className="text-[10px] text-[#777777]">{visit.scheduledTime}</div>
                          </td>
                          <td className="py-3 px-4 text-[#777777]">
                            <div className="text-[#111111] font-medium">{chairman?.name || 'Committee Appointed'}</div>
                            <div className="text-[10px] text-[#777777]">{chairman?.organization || 'AICTE Panel'}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                              {visit.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {!isCompleted ? (
                              <button
                                onClick={() => setSelectedVisitForReport(visit.id)}
                                className="px-3 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                              >
                                Record Report
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-[#777777]">
                                Report Filed ✓
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Schedule EVC Modal */}
      {isScheduleOpen && (
        <ScheduleEvcModal
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
        />
      )}

      {/* Record Visit Report Modal */}
      {selectedVisitForReport && (
        <Modal
          isOpen={!!selectedVisitForReport}
          onClose={() => setSelectedVisitForReport(null)}
          title="Submit Expert Visiting Committee (EVC) Report"
          subtitle="Record physical on-site inspection findings and recommendations"
        >
          <form onSubmit={handleCompleteVisitSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#111111] mb-1.5">
                Committee Recommendation Outcome *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded border flex items-center gap-2 cursor-pointer transition-all ${
                    reportOutcome === 'RECOMMENDED'
                      ? 'border-[#111111] bg-[#FAFAFA] font-bold text-[#111111]'
                      : 'border-[#E5E5E5] hover:bg-[#F7F7F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportOutcome"
                    checked={reportOutcome === 'RECOMMENDED'}
                    onChange={() => setReportOutcome('RECOMMENDED')}
                    className="accent-[#111111]"
                  />
                  <span>Recommend for Approval</span>
                </label>

                <label
                  className={`p-3 rounded border flex items-center gap-2 cursor-pointer transition-all ${
                    reportOutcome === 'DEFICIENT'
                      ? 'border-[#DC2626] bg-[#FFFBFB] font-bold text-[#DC2626]'
                      : 'border-[#E5E5E5] hover:bg-[#F7F7F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportOutcome"
                    checked={reportOutcome === 'DEFICIENT'}
                    onChange={() => setReportOutcome('DEFICIENT')}
                    className="accent-[#DC2626]"
                  />
                  <span>Flag Deficiencies</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">
                Detailed Inspection Observations &amp; Verification Remarks *
              </label>
              <textarea
                required
                rows={4}
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Record faculty cadre headcount, lab equipment verification, carpet area measurements, and compliance with AICTE norms..."
                className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setSelectedVisitForReport(null)}
                className="px-3 py-1.5 text-xs text-[#777777] hover:text-[#111111] rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reportNotes.trim()}
                className="px-4 py-1.5 rounded bg-[#111111] hover:bg-[#222222] disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
              >
                Submit Inspection Report
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
