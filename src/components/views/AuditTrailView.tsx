import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, RotateCcw, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { Modal } from '../common/Modal';
import type { AuditEvent } from '../../types';

export const AuditTrailView: React.FC = () => {
  const { auditEvents } = useSakshamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [inspectEvent, setInspectEvent] = useState<AuditEvent | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredEvents = useMemo(() => {
    return auditEvents.filter((evt) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !evt.targetTitle.toLowerCase().includes(q) &&
          !evt.details.toLowerCase().includes(q) &&
          !evt.actorName.toLowerCase().includes(q) &&
          !evt.id.toLowerCase().includes(q) &&
          !evt.action.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (roleFilter !== 'ALL' && evt.actorRole !== roleFilter) return false;
      if (actionFilter !== 'ALL' && evt.action !== actionFilter) return false;
      return true;
    });
  }, [auditEvents, searchQuery, roleFilter, actionFilter]);

  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportAudit = () => {
    const headers = [
      'Event ID',
      'Timestamp (IST)',
      'Actor Name',
      'Actor Role',
      'Action Category',
      'Target Entity',
      'Previous State',
      'New State',
      'Details',
      'Origin IP',
    ];

    const rows = filteredEvents.map((e) => [
      `"${e.id}"`,
      `"${e.timestamp}"`,
      `"${e.actorName}"`,
      `"${e.actorRole}"`,
      `"${e.action}"`,
      `"${e.targetTitle}"`,
      `"${e.previousState || 'N/A'}"`,
      `"${e.newState || 'N/A'}"`,
      `"${e.details.replace(/"/g, '""')}"`,
      `"${e.ipAddress}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saksham_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111111] tracking-tight">Immutable Audit Trail</h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#111111]" /> Hash-Chained Verification
            </span>
          </div>
          <p className="text-xs text-[#777777] mt-1">
            Tamper-evident chronological journal of administrative statutory actions, stage transitions, and executive decisions
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="h-9 px-3.5 rounded bg-white border border-[#E5E5E5] hover:bg-[#EEEEEC] text-[#111111] text-xs font-medium inline-flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-[#777777]" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded border border-[#E5E5E5] flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-56">
          <Search className="w-4 h-4 text-[#777777] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by event ID, actor, action, or details..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111] transition-all placeholder:text-[#777777]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="INSTITUTION_USER">Institution User</option>
          <option value="REGIONAL_OFFICER">Regional Officer</option>
          <option value="BUREAU_OFFICER">Bureau Officer</option>
          <option value="EVC_MEMBER">EVC Member</option>
          <option value="COMPETENT_AUTHORITY">Competent Authority</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] font-medium focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Actions</option>
          <option value="STAGE_TRANSITION">Stage Transitions</option>
          <option value="DEFICIENCY_COMMUNICATED">Deficiency Communicated</option>
          <option value="EVC_SCHEDULED">EVC Scheduled</option>
          <option value="EVC_REPORT_SUBMITTED">EVC Report Submitted</option>
          <option value="COMPLIANCE_VERIFIED">Compliance Verified</option>
          <option value="APPROVAL_ISSUED">Approval Issued</option>
          <option value="OFFICER_REASSIGNED">Officer Reassigned</option>
        </select>

        {(searchQuery || roleFilter !== 'ALL' || actionFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('ALL');
              setActionFilter('ALL');
              setCurrentPage(1);
            }}
            className="h-9 px-3 text-[#777777] hover:text-[#111111] bg-white border border-[#E5E5E5] hover:bg-[#EEEEEC] rounded text-xs inline-flex items-center gap-1.5 font-medium transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Main Immutable Audit Table */}
      <div className="bg-white rounded border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold uppercase tracking-wider text-[10px] select-none">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Authorised Actor</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Details</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777] font-medium">
                    No audit records match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#F7F7F5] transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-xs text-[#111111] font-semibold whitespace-nowrap">
                      {evt.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#777777] whitespace-nowrap font-medium">
                      {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#111111]">{evt.actorName}</div>
                      <div className="text-[10px] text-[#777777] font-medium">
                        {evt.actorRole.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-[#111111] bg-[#EEEEEC] border border-[#E5E5E5] px-2.5 py-0.5 rounded text-[11px]">
                        {evt.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-48 truncate">
                      <div className="font-semibold text-[#111111] truncate">{evt.targetTitle}</div>
                      <div className="text-[10px] text-[#777777] font-mono mt-0.5">{evt.targetId}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-72 truncate text-[#777777] font-medium">
                      {evt.details}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectEvent(evt)}
                        className="px-2.5 py-1.5 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] text-xs font-medium inline-flex items-center gap-1 transition-colors border border-[#E5E5E5]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#777777]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="px-5 py-3.5 bg-[#F7F7F5] border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#777777] font-medium">
          <div>
            Showing <span className="font-bold text-[#111111]">{(currentPage - 1) * pageSize + 1}</span>–
            <span className="font-bold text-[#111111]">{Math.min(currentPage * pageSize, filteredEvents.length)}</span> of{' '}
            <span className="font-bold text-[#111111]">{filteredEvents.length}</span> events
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-2.5 rounded border border-[#E5E5E5] bg-white text-[#111111] flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EEEEEC] transition-colors font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-3 py-1 bg-white border border-[#E5E5E5] rounded font-mono text-xs font-semibold text-[#111111]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 px-2.5 rounded border border-[#E5E5E5] bg-white text-[#111111] flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EEEEEC] transition-colors font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Event Inspection Modal */}
      {inspectEvent && (
        <Modal
          isOpen={!!inspectEvent}
          onClose={() => setInspectEvent(null)}
          title={`Cryptographic Audit Event: ${inspectEvent.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-[#F7F7F5] p-4 rounded border border-[#E5E5E5]">
              <div>
                <span className="text-[10px] text-[#777777] block font-bold uppercase tracking-wider">Timestamp (IST)</span>
                <span className="font-mono text-[#111111] font-semibold text-xs mt-0.5 block">{inspectEvent.timestamp}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#777777] block font-bold uppercase tracking-wider">Origin IP Address</span>
                <span className="font-mono text-[#111111] font-semibold text-xs mt-0.5 block">{inspectEvent.ipAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#777777] block font-bold uppercase tracking-wider">Authorised Actor</span>
                <span className="text-[#111111] font-semibold text-xs mt-0.5 block">
                  {inspectEvent.actorName} ({inspectEvent.actorRole})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#777777] block font-bold uppercase tracking-wider">Target Entity</span>
                <span className="text-[#111111] font-semibold text-xs mt-0.5 block">{inspectEvent.targetTitle}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">
                Transaction Narrative
              </span>
              <p className="p-3.5 bg-[#F7F7F5] rounded border border-[#E5E5E5] text-[#111111] leading-relaxed font-sans font-medium">
                {inspectEvent.details}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">
                State Transition Payload
              </span>
              <pre className="p-3.5 bg-[#F7F7F5] text-[#111111] border border-[#E5E5E5] rounded font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(
                  {
                    eventId: inspectEvent.id,
                    timestamp: inspectEvent.timestamp,
                    action: inspectEvent.action,
                    targetType: inspectEvent.targetType,
                    targetId: inspectEvent.targetId,
                    previousState: inspectEvent.previousState || null,
                    newState: inspectEvent.newState || null,
                    ipAddress: inspectEvent.ipAddress,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5E5E5]">
              <button
                onClick={() => setInspectEvent(null)}
                className="px-4 py-2 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] text-xs font-medium border border-[#E5E5E5] transition-colors"
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
