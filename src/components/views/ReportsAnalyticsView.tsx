import React, { useState } from 'react';
import { Download, BarChart2, Calendar, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSakshamStore } from '../../hooks/useSakshamStore';

export const ReportsAnalyticsView: React.FC = () => {
  const { applications, evcVisits, undertakings, documents } = useSakshamStore();

  // 1. Application Pendency by Region
  const regions = ['Central', 'Western', 'Eastern', 'Northern', 'Southern'];
  const regionalData = regions.map((reg) => {
    const regApps = applications.filter((a) => a.region === reg);
    const pending = regApps.filter((a) => a.status !== 'APPROVED' && a.status !== 'REJECTED').length;
    const overdue = regApps.filter((a) => a.isOverdue).length;
    return {
      region: reg,
      total: regApps.length,
      pending,
      overdue,
    };
  });

  // 2. EVC Status Counts
  const evcScheduled = evcVisits.filter((v) => v.status === 'SCHEDULED' || v.status === 'CONFIRMED' || v.status === 'PROPOSED').length;
  const evcCompleted = evcVisits.filter((v) => v.status === 'CONDUCTED' || v.status === 'REPORT_SUBMITTED' || v.status === 'COMPLETED').length;
  const evcEligible = applications.filter(
    (a) => a.workflowRoute.includes('EVC') && a.currentStage === 'PENDING_EVC'
  ).length;

  // 3. Compliance and Document Validity
  const verifiedUndertakings = undertakings.filter((u) => u.status === 'VERIFIED' || u.verificationStatus === 'VERIFIED').length;
  const pendingUndertakings = undertakings.filter((u) => u.status !== 'VERIFIED' && u.verificationStatus !== 'VERIFIED').length;
  const validDocs = documents.filter((d) => d.verificationStatus === 'VERIFIED' || (!d.isExpired && d.verificationStatus !== 'EXPIRED')).length;
  const expiredDocs = documents.filter((d) => d.isExpired || d.verificationStatus === 'EXPIRED').length;

  const handleExportReport = () => {
    const headers = ['Region', 'Total Applications', 'Pending Review', 'Overdue Cases'];
    const rows = regionalData.map((r) => [
      `"${r.region}"`,
      `"${r.total}"`,
      `"${r.pending}"`,
      `"${r.overdue}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saksham_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Operational summaries for application pendency, EVC inspection pipeline, and statutory compliance.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="h-8 px-3.5 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#777777]" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* Section 1: Application Pendency */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#111111]" />
            <h2 className="text-sm font-bold text-[#111111]">1. Application Pendency by Region</h2>
          </div>
          <span className="text-xs text-[#777777]">Active Operational Workload</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Chart */}
          <div className="md:col-span-7 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="region" stroke="#777777" fontSize={11} tickLine={false} />
                <YAxis stroke="#777777" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#111111',
                  }}
                />
                <Bar dataKey="total" fill="#111111" radius={[2, 2, 0, 0]} name="Total Apps" />
                <Bar dataKey="pending" fill="#888888" radius={[2, 2, 0, 0]} name="Pending Review" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Breakdown */}
          <div className="md:col-span-5 border border-[#E5E5E5] rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase">
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3 text-right">Pending</th>
                  <th className="py-2 px-3 text-right">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
                {regionalData.map((r) => (
                  <tr key={r.region}>
                    <td className="py-2 px-3 font-medium">{r.region}</td>
                    <td className="py-2 px-3 text-right font-mono">{r.total}</td>
                    <td className="py-2 px-3 text-right font-mono">{r.pending}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#DC2626]">
                      {r.overdue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grid: 2. EVC Status + 3. Compliance and Document Validity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 2: EVC Status */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <Calendar className="w-4 h-4 text-[#111111]" />
            <h2 className="text-sm font-bold text-[#111111]">2. EVC Inspection Status</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5] text-center">
              <span className="text-[10px] font-semibold uppercase text-[#777777] block">Scheduled</span>
              <div className="text-xl font-bold text-[#111111] mt-1 font-mono">{evcScheduled}</div>
            </div>
            <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5] text-center">
              <span className="text-[10px] font-semibold uppercase text-[#777777] block">Completed</span>
              <div className="text-xl font-bold text-[#111111] mt-1 font-mono">{evcCompleted}</div>
            </div>
            <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5] text-center">
              <span className="text-[10px] font-semibold uppercase text-[#777777] block">Eligible</span>
              <div className="text-xl font-bold text-[#111111] mt-1 font-mono">{evcEligible}</div>
            </div>
          </div>

          <div className="p-3 rounded border border-[#E5E5E5] text-xs text-[#777777] space-y-1">
            <div className="flex justify-between">
              <span>On-Site Inspection Reports Filed:</span>
              <span className="font-semibold text-[#111111]">{evcCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Turnaround Time:</span>
              <span className="font-semibold text-[#111111]">11.4 Days</span>
            </div>
          </div>
        </div>

        {/* Section 3: Compliance & Document Validity */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <ShieldCheck className="w-4 h-4 text-[#111111]" />
            <h2 className="text-sm font-bold text-[#111111]">3. Compliance &amp; Document Validity</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5]">
              <span className="text-[10px] font-semibold uppercase text-[#777777] block">Undertakings</span>
              <div className="text-sm font-semibold text-[#111111] mt-1">
                {verifiedUndertakings} Verified &bull; {pendingUndertakings} Pending
              </div>
            </div>
            <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5]">
              <span className="text-[10px] font-semibold uppercase text-[#777777] block">Documents</span>
              <div className="text-sm font-semibold text-[#111111] mt-1">
                {validDocs} Valid &bull; {expiredDocs} Expired
              </div>
            </div>
          </div>

          <div className="p-3 rounded border border-[#E5E5E5] text-xs text-[#777777] space-y-1">
            <div className="flex justify-between">
              <span>7th CPC Salary Affidavits Reconciled:</span>
              <span className="font-semibold text-[#111111]">100%</span>
            </div>
            <div className="flex justify-between">
              <span>Statutory Document Expiry Tracking:</span>
              <span className="font-semibold text-[#111111]">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
