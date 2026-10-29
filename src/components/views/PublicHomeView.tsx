import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Calendar,
  BellRing,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface PublicHomeViewProps {
  onNavigateLogin: () => void;
  onNavigatePortal: () => void;
  onNavigateTrack: (appId?: string) => void;
  onNavigateRegister: () => void;
}

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  onNavigateLogin,
  onNavigatePortal,
  onNavigateTrack,
  onNavigateRegister,
}) => {
  const [trackQuery, setTrackQuery] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      onNavigateTrack(trackQuery.trim());
    } else {
      onNavigateTrack();
    }
  };

  const capabilities = [
    {
      title: 'Approval Workflow Automation',
      desc: 'Route applications through prescribed stages with recorded actions, scrutiny observations, and authorised transitions.',
      icon: FileText,
    },
    {
      title: 'Application Pendency Monitoring',
      desc: 'Track processing time, aging, responsible scrutiny officers, and regional workload across academic cycles.',
      icon: Clock,
    },
    {
      title: 'EVC Scheduling & Logistics',
      desc: 'Organise committee visits, monitor scheduling timelines, assign independent peer evaluators, and track report completion.',
      icon: Calendar,
    },
    {
      title: 'Institutional Compliance',
      desc: 'Manage time-bound undertakings, 7th CPC faculty salary submissions, fire safety verifications, and renewals.',
      icon: ShieldCheck,
    },
    {
      title: 'Automated Alerts & Escalations',
      desc: 'Notify relevant officers and institutions about upcoming deadlines, overdue scrutinies, and pending decisions.',
      icon: BellRing,
    },
  ];

  const approvalSteps = [
    { num: '01', title: 'Application Submitted', desc: 'Institutional application & processing fee verified' },
    { num: '02', title: 'Preliminary Scrutiny', desc: 'Regional scrutiny committee document verification' },
    { num: '03', title: 'Clarification / Re-Scrutiny', desc: 'Rectification window for flagged deficiencies' },
    { num: '04', title: 'EVC Visit', desc: 'On-site physical inspection where prescribed' },
    { num: '05', title: 'SAC / SHC Review', desc: 'Appellate hearing for contested evaluations' },
    { num: '06', title: 'Final Approval (EoA)', desc: 'Competent Authority decision and digital letter' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      {/* A. Header */}
      <header className="h-16 bg-white border-b border-[#E5E5E5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#111111] block leading-none">
              Saksham
            </span>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-medium mt-0.5">
              Approval &amp; Compliance Management System
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#777777]">
          <a href="#capabilities" className="hover:text-[#111111] transition-colors">Platform Capabilities</a>
          <a href="#process" className="hover:text-[#111111] transition-colors">Approval Process</a>
          <a href="#tracking" className="hover:text-[#111111] transition-colors">Track Application</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="h-8 px-3.5 rounded border border-[#E5E5E5] bg-white hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onNavigatePortal}
            className="h-8 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Access Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* B. Hero Section */}
      <section className="px-4 sm:px-8 pt-12 pb-16 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-[#E5E5E5] text-[11px] font-medium text-[#777777]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
            Unified AICTE Regulatory Administration Platform
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-tight">
            One Platform. Every Approval. Complete Accountability.
          </h1>

          <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
            An integrated digital platform for managing AICTE approval workflows, monitoring institutional compliance, tracking document validity, and ensuring timely administrative action.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigatePortal}
              className="h-9 px-5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="#process"
              className="h-9 px-4 rounded bg-white hover:bg-[#EEEEEC] border border-[#E5E5E5] text-[#111111] text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              Explore Approval Process
            </a>
          </div>

          <p className="text-[11px] text-[#888888]">
            Unified workflow management &bull; Deadline monitoring &bull; Traceable administrative actions
          </p>
        </div>

        {/* Product Preview Card */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
              <span className="text-xs font-bold text-[#111111]">Saksham Operations Overview</span>
            </div>
            <span className="text-[11px] font-mono text-[#777777]">Live System Preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Applications', val: '142', sub: 'Current cycle' },
              { label: 'Pending Scrutiny', val: '37', sub: 'Awaiting review' },
              { label: 'Overdue Cases', val: '6', sub: 'Exceeded SLA' },
              { label: 'Upcoming EVCs', val: '12', sub: 'Visits scheduled' },
            ].map((k, i) => (
              <div key={i} className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5]">
                <span className="text-[10px] text-[#777777] uppercase font-semibold block">{k.label}</span>
                <div className="text-xl font-bold text-[#111111] mt-0.5">{k.val}</div>
                <span className="text-[10px] text-[#888888]">{k.sub}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5] text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#777777]">
              Sample case: <strong>AIC-2026-001</strong> — Shree Engineering College, Nagpur (EoA)
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[11px] font-medium text-[#111111]">
              Stage: Preliminary Scrutiny
            </span>
          </div>
        </div>

        {/* Quick Track Application Bar */}
        <div id="tracking" className="bg-white rounded-lg border border-[#E5E5E5] p-5 max-w-xl mx-auto">
          <div className="text-center space-y-1 mb-3">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Track Approval Application
            </h3>
            <p className="text-[11px] text-[#777777]">
              Enter application identifier for instant stage status &amp; receipt
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5" />
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="e.g. AIC-2026-001 or APP-2026-DEL-0412"
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <button
              type="submit"
              className="h-8 px-4 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold shrink-0 cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>
      </section>

      {/* C. Platform Capabilities */}
      <section id="capabilities" className="px-4 sm:px-8 py-14 bg-white border-y border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-xl font-bold text-[#111111] tracking-tight">Platform Capabilities</h2>
            <p className="text-xs text-[#777777]">
              Engineered specifically for statutory approval operations and institutional compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-lg border border-[#E5E5E5] bg-[#F7F7F5] space-y-2.5"
                >
                  <div className="w-8 h-8 rounded border border-[#E5E5E5] bg-white flex items-center justify-center text-[#111111]">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <h3 className="text-xs font-bold text-[#111111]">{cap.title}</h3>
                  <p className="text-[11px] text-[#777777] leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* D. Approval Process Section */}
      <section id="process" className="px-4 sm:px-8 py-14 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-xl font-bold text-[#111111] tracking-tight">Illustrative Approval Sequence</h2>
          <p className="text-xs text-[#777777]">
            Configurable regulatory stages aligned with the AICTE Approval Process Handbook (APH)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvalSteps.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-lg border border-[#E5E5E5] bg-white space-y-2"
            >
              <div className="text-xs font-mono font-bold text-[#777777]">{step.num}</div>
              <h3 className="text-xs font-bold text-[#111111]">{step.title}</h3>
              <p className="text-[11px] text-[#777777] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* E. Transparency & Accountability Principles */}
      <section className="px-4 sm:px-8 py-14 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-bold text-[#111111] tracking-tight">
              Transparency &amp; Accountability
            </h2>
            <p className="text-xs text-[#777777]">Operational safeguards governing all automated actions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              'Configurable rules aligned with applicable regulations',
              'Role-based access to institutional and administrative data',
              'Document submission and verification tracking',
              'Time-bound reminders and authorised escalation',
              'Complete traceability of application movements and actions',
              'Human oversight of statutory scrutiny and approval decisions',
            ].map((item, i) => (
              <div key={i} className="p-3 bg-[#F7F7F5] rounded border border-[#E5E5E5] flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
                <span className="text-[#333333] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. Minimal Footer */}
      <footer className="px-4 sm:px-8 py-8 border-t border-[#E5E5E5] bg-[#F7F7F5] text-xs text-[#777777]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#111111]">Saksham</span>
            <span className="text-[#777777] ml-2">
              &bull; AICTE Approval &amp; Compliance Management System
            </span>
          </div>
          <div className="text-[11px] text-[#888888]">
            Demonstration prototype for Smart India Hackathon. Not an official government deployment.
          </div>
        </div>
      </footer>
    </div>
  );
};
