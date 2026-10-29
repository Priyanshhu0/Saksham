import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  RotateCcw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { StatusBadge, StageBadge } from '../common/Badge';

interface ApplicationsViewProps {
  onSelectApplication: (appId: string) => void;
  onOpenCreateApp: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  onSelectApplication,
  onOpenCreateApp,
}) => {
  const { applications, activeUser } = useSakshamStore();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedApprovalType, setSelectedApprovalType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [sortField, setSortField] = useState<'deadline' | 'id' | 'institution'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        if (activeUser.role === 'INSTITUTION_USER' && activeUser.institutionId) {
          if (app.institutionId !== activeUser.institutionId) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNumber = app.applicationNumber.toLowerCase().includes(q);
          const matchName = app.institutionName.toLowerCase().includes(q);
          const matchCode = app.institutionCode.toLowerCase().includes(q);
          const matchOfficer = app.assignedOfficerName.toLowerCase().includes(q);
          if (!matchNumber && !matchName && !matchCode && !matchOfficer) return false;
        }

        if (selectedRegion !== 'ALL' && app.region !== selectedRegion) return false;
        if (selectedApprovalType !== 'ALL' && app.approvalType !== selectedApprovalType) return false;
        if (selectedStatus !== 'ALL' && app.status !== selectedStatus) return false;
        if (onlyOverdue && !app.isOverdue) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'deadline') {
          const diff = new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
          return sortOrder === 'asc' ? diff : -diff;
        } else if (sortField === 'institution') {
          return sortOrder === 'asc'
            ? a.institutionName.localeCompare(b.institutionName)
            : b.institutionName.localeCompare(a.institutionName);
        } else {
          return sortOrder === 'asc'
            ? a.applicationNumber.localeCompare(b.applicationNumber)
            : b.applicationNumber.localeCompare(a.applicationNumber);
        }
      });
  }, [
    applications,
    activeUser,
    searchQuery,
    selectedRegion,
    selectedApprovalType,
    selectedStatus,
    onlyOverdue,
    sortField,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('ALL');
    setSelectedApprovalType('ALL');
    setSelectedStatus('ALL');
    setOnlyOverdue(false);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Application Number',
      'Institution Name',
      'Institution Code',
      'Region',
      'State',
      'Approval Type',
      'Current Stage',
      'Status',
      'Assigned Officer',
      'Submission Date',
      'Deadline Date',
      'Is Overdue',
    ];

    const rows = filteredApps.map((a) => [
      `"${a.applicationNumber}"`,
      `"${a.institutionName}"`,
      `"${a.institutionCode}"`,
      `"${a.region}"`,
      `"${a.state}"`,
      `"${a.approvalType}"`,
      `"${a.currentStage}"`,
      `"${a.status}"`,
      `"${a.assignedOfficerName}"`,
      `"${a.submittedAt}"`,
      `"${a.deadlineDate}"`,
      `"${a.isOverdue ? 'YES' : 'NO'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saksham_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12 font-sans text-[#111111]">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            Applications
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Track and manage approval applications across their processing stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="h-8 px-3 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#777777]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCreateApp}
            className="h-8 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#E5E5E5] flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, institution, officer..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* Region */}
        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] text-xs focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Regions</option>
          <option value="Central">Central</option>
          <option value="Western">Western</option>
          <option value="Eastern">Eastern</option>
          <option value="Northern">Northern</option>
          <option value="Southern">Southern</option>
        </select>

        {/* Approval Type */}
        <select
          value={selectedApprovalType}
          onChange={(e) => {
            setSelectedApprovalType(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] text-xs focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Types</option>
          <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
          <option value="Increase in Intake">Increase in Intake</option>
          <option value="Introduction of New Course">New Course</option>
          <option value="New Institution Approval">New Institution</option>
        </select>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-[#111111] text-xs focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="UNDER_SCRUTINY">Under Scrutiny</option>
          <option value="DEFICIENCY_REPORTED">Deficiency Reported</option>
          <option value="EVC_SCHEDULED">EVC Scheduled</option>
          <option value="EVC_COMPLETED">EVC Completed</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Overdue checkbox */}
        <label className="flex items-center gap-1.5 text-xs text-[#111111] cursor-pointer">
          <input
            type="checkbox"
            checked={onlyOverdue}
            onChange={(e) => {
              setOnlyOverdue(e.target.checked);
              setCurrentPage(1);
            }}
            className="accent-[#111111] rounded"
          />
          <span>Overdue only</span>
        </label>

        {/* Clear Filters */}
        {(searchQuery || selectedRegion !== 'ALL' || selectedApprovalType !== 'ALL' || selectedStatus !== 'ALL' || onlyOverdue) && (
          <button
            onClick={handleClearFilters}
            className="h-8 px-2.5 text-xs text-[#777777] hover:text-[#111111] inline-flex items-center gap-1 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Applications Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                <th
                  onClick={() => {
                    setSortField('id');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-[#111111]"
                >
                  <div className="flex items-center gap-1">
                    <span>Application ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('institution');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-[#111111]"
                >
                  <div className="flex items-center gap-1">
                    <span>Institution</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th
                  onClick={() => {
                    setSortField('deadline');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-[#111111]"
                >
                  <div className="flex items-center gap-1">
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#777777]">
                    No applications match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app.id)}
                    className="hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-[#111111] whitespace-nowrap">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4 max-w-44 truncate">
                      <div className="font-semibold text-[#111111] truncate">{app.institutionName}</div>
                      <div className="text-[10px] text-[#777777] font-mono">{app.institutionCode}</div>
                    </td>
                    <td className="py-3 px-4 text-[#777777] whitespace-nowrap">{app.region}</td>
                    <td className="py-3 px-4 text-[#555555] max-w-36 truncate">
                      {app.approvalType.replace('Extension of Approval (EoA)', 'EoA')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StageBadge stage={app.currentStage} />
                    </td>
                    <td className="py-3 px-4 text-[#777777] whitespace-nowrap">
                      {app.assignedOfficerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                      <span className={app.isOverdue ? 'text-[#DC2626] font-bold' : 'text-[#777777]'}>
                        {app.deadlineDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-xs font-semibold text-[#111111] group-hover:underline">
                        Open →
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="px-4 py-3 bg-[#F7F7F5] border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#777777]">
          <div>
            Showing <span className="font-semibold text-[#111111]">{(currentPage - 1) * pageSize + 1}</span>–
            <span className="font-semibold text-[#111111]">{Math.min(currentPage * pageSize, filteredApps.length)}</span> of{' '}
            <span className="font-semibold text-[#111111]">{filteredApps.length}</span> applications
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-7 px-2 rounded border border-[#E5E5E5] bg-white flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F7F5] text-xs font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 py-0.5 rounded font-mono text-xs text-[#111111] bg-white border border-[#E5E5E5]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-7 px-2 rounded border border-[#E5E5E5] bg-white flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F7F5] text-xs font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
