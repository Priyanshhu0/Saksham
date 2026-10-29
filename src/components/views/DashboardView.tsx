import React from 'react';
import {
  FileText,
  Clock,
  AlertCircle,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Building2,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { StatusBadge, StageBadge } from '../common/Badge';
import type { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectApplication: (id: string) => void;
  onOpenCreateApp?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onSelectApplication,
  onOpenCreateApp,
}) => {
  const { applications, evcVisits, undertakings, auditEvents, activeUser } = useSakshamStore();

  // 4 Essential KPI metrics computed directly from store data
  const totalAppsCount = applications.length;
  const pendingAppsCount = applications.filter(
    (a) => a.status !== 'APPROVED' && a.status !== 'REJECTED'
  ).length;
  const overdueAppsCount = applications.filter((a) => a.isOverdue).length;
  const upcomingEvcCount = evcVisits.filter(
    (v) => v.status === 'SCHEDULED' || v.status === 'PROPOSED'
  ).length;

  // 4 or 5 recent applications
  const recentApplications = applications.slice(0, 5);

  // Maximum 3 upcoming deadlines (EVC Visit, Compliance Submission, Document Renewal)
  const deadlines = [
    {
      id: 'd1',
      date: '04 Nov 2026',
      title: 'EVC On-Site Inspection',
      institution: 'Shree Engineering College, Nagpur',
      appId: applications[0]?.id,
      type: 'EVC',
    },
    {
      id: 'd2',
      date: '08 Nov 2026',
      title: '7th CPC Salary Compliance Proof',
      institution: 'Central Institute of Technology, Raipur',
      appId: applications[1]?.id,
      type: 'COMPLIANCE',
    },
    {
      id: 'd3',
      date: '15 Nov 2026',
      title: 'Fire Safety NOC Renewal Filing',
      institution: 'National College of Engineering, Bhopal',
      appId: applications[2]?.id,
      type: 'DOCUMENT',
    },
  ];

  // Maximum 3 recent activities
  const recentActivities = auditEvents.slice(0, 3);

  const getGreetingName = (fullName: string) => {
    const clean = fullName.replace(/\(Dr\.\)\s*/, '');
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length > 1 && parts[0].endsWith('.')) {
      return `${parts[0]} ${parts[1]}`;
    }
    return parts[0] || fullName;
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* A. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Welcome back, {getGreetingName(activeUser.name)}.
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            {activeUser.designation} • {activeUser.institutionName || `${activeUser.region} Jurisdiction`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenCreateApp && (
            <button
              onClick={onOpenCreateApp}
              className="h-9 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Application</span>
            </button>
          )}
        </div>
      </div>

      {/* B. Hero Section: Clean monochrome split layout */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2.5 max-w-xl">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#777777] block">
            Integrated Regulatory System
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Approvals, made simpler.
          </h2>
          <p className="text-xs text-[#777777] leading-relaxed">
            Saksham brings approval workflows, institutional compliance, and important deadlines together in one place.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('applications')}
              className="h-8 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('workflow')}
              className="h-8 px-4 rounded bg-white hover:bg-[#F7F7F5] border border-[#E5E5E5] text-[#111111] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore Workflow</span>
            </button>
          </div>
        </div>

        {/* Minimal monochrome architectural geometric graphic */}
        <div className="w-full md:w-64 h-28 bg-[#F7F7F5] rounded border border-[#E5E5E5] p-3 flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between text-[10px] text-[#777777] font-mono">
            <span>REGULATORY CYCLE</span>
            <span>2026–27</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 py-1">
            <div className="h-8 bg-[#111111] rounded-xs flex items-center justify-center text-white text-[10px] font-mono">SCR</div>
            <div className="h-8 bg-[#EEEEEC] rounded-xs flex items-center justify-center text-[#111111] text-[10px] font-mono">EVC</div>
            <div className="h-8 bg-[#EEEEEC] rounded-xs flex items-center justify-center text-[#111111] text-[10px] font-mono">SAC</div>
            <div className="h-8 bg-[#EEEEEC] rounded-xs flex items-center justify-center text-[#111111] text-[10px] font-mono">EOA</div>
          </div>
          <div className="text-[10px] text-[#777777] flex items-center justify-between">
            <span>SLA Compliance Rate</span>
            <span className="font-bold text-[#111111]">94.2%</span>
          </div>
        </div>
      </div>

      {/* C. Minimal KPI Row: Exactly 4 Essential Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Applications */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-lg p-4 sm:p-5 border border-[#E5E5E5] hover:border-[#111111] transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider block">
                Total Applications
              </span>
              <div className="text-2xl font-bold text-[#111111] mt-1 tabular-nums">
                {totalAppsCount}
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-[#E5E5E5] bg-[#F7F7F5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <FileText className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E5E5] text-[11px] text-[#777777] flex items-center justify-between">
            <span>Current academic cycle</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111]" />
          </div>
        </div>

        {/* 2. Pending Applications */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-lg p-5 border border-[#E5E5E5] hover:border-[#111111] transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider block">
                Pending Applications
              </span>
              <div className="text-2xl font-bold text-[#111111] mt-1 tabular-nums">
                {pendingAppsCount}
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-[#E5E5E5] bg-[#F7F7F5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <Clock className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E5E5] text-[11px] text-[#777777] flex items-center justify-between">
            <span>Awaiting scrutiny &amp; review</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111]" />
          </div>
        </div>

        {/* 3. Overdue Cases */}
        <div
          onClick={() => onNavigateTab('applications')}
          className={`bg-white rounded-lg p-5 border transition-all cursor-pointer group ${
            overdueAppsCount > 0 ? 'border-[#DC2626]/50 bg-[#FFFBFB]' : 'border-[#E5E5E5] hover:border-[#111111]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider block">
                Overdue Cases
              </span>
              <div className={`text-2xl font-bold mt-1 tabular-nums ${overdueAppsCount > 0 ? 'text-[#DC2626]' : 'text-[#111111]'}`}>
                {overdueAppsCount}
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-[#E5E5E5] bg-[#F7F7F5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <AlertCircle className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E5E5] text-[11px] text-[#777777] flex items-center justify-between">
            <span>Exceeded prescribed SLA</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111]" />
          </div>
        </div>

        {/* 4. Upcoming EVCs */}
        <div
          onClick={() => onNavigateTab('evc')}
          className="bg-white rounded-lg p-5 border border-[#E5E5E5] hover:border-[#111111] transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider block">
                Upcoming EVCs
              </span>
              <div className="text-2xl font-bold text-[#111111] mt-1 tabular-nums">
                {upcomingEvcCount}
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-[#E5E5E5] bg-[#F7F7F5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E5E5E5] text-[11px] text-[#777777] flex items-center justify-between">
            <span>Visits scheduled this month</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111]" />
          </div>
        </div>
      </div>

      {/* D & E. Desktop 2-Column: Recent Applications (Left) + Upcoming Deadlines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* D. Recent Applications Table (Col 8 / ~67%) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#111111]">Recent Applications</h3>
              <p className="text-[11px] text-[#777777]">
                Active cases moving through verification stages (Demonstration Records)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-semibold text-[#111111] hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                  <th className="py-2.5 px-4">Application ID</th>
                  <th className="py-2.5 px-4">Institution</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Current Stage</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                {recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app.id)}
                    className="hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-[#111111] whitespace-nowrap">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4 max-w-44 truncate font-medium text-[#111111]">
                      {app.institutionName}
                    </td>
                    <td className="py-3 px-4 text-[#777777] whitespace-nowrap">
                      {app.approvalType.replace('Extension of Approval (EoA)', 'EoA')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StageBadge stage={app.currentStage} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-[#111111] group-hover:underline">
                        Open →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E. Upcoming Deadlines Panel (Col 4 / ~33%) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <h3 className="text-sm font-bold text-[#111111]">Upcoming Deadlines</h3>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-[#111111] hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {deadlines.map((dl) => (
              <div
                key={dl.id}
                onClick={() => dl.appId && onSelectApplication(dl.appId)}
                className="p-3 rounded border border-[#E5E5E5] bg-[#F7F7F5] hover:bg-[#EEEEEC] transition-colors cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-mono text-[#777777] font-semibold">
                    {dl.date}
                  </div>
                  <div className="text-xs font-bold text-[#111111] leading-snug">
                    {dl.title}
                  </div>
                  <div className="text-[11px] text-[#777777] truncate">
                    {dl.institution}
                  </div>
                </div>

                <div className="text-[#777777] group-hover:text-[#111111] shrink-0 mt-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-[#777777] leading-relaxed border-t border-[#E5E5E5]">
            Timelines monitored against statutory AICTE Approval Process Handbook SLA limits.
          </div>
        </div>
      </div>

      {/* F. Recent Activity: Clean and concise (max 3 events) */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
          <h3 className="text-sm font-bold text-[#111111]">Recent Activity</h3>
          <span className="text-[11px] text-[#777777]">Chronological log</span>
        </div>

        <div className="divide-y divide-[#E5E5E5]">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-2.5 flex items-center justify-between text-xs gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-[#111111]">{act.actorName}</span>
                  <span className="text-[#777777] mx-1.5">—</span>
                  <span className="text-[#555555]">{act.details}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#777777] font-mono shrink-0 whitespace-nowrap">
                {new Date(act.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
