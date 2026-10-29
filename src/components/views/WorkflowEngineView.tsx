import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Sliders, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { WorkflowRoute, StageId } from '../../types';

export const WorkflowEngineView: React.FC = () => {
  const { workflowRules } = useSakshamStore();
  const [selectedRoute, setSelectedRoute] = useState<WorkflowRoute>('SCRUTINY_EVC');

  // Interactive Simulator State
  const [simStage, setSimStage] = useState<StageId>('APPLICATION_SUBMITTED');
  const [simHasDeficiency, setSimHasDeficiency] = useState(false);
  const [simEvcPassed, setSimEvcPassed] = useState(true);
  const [simLog, setSimLog] = useState<string[]>([
    'Initialized route: Scrutiny + Physical EVC',
  ]);

  const activeRule = workflowRules.find((r) => r.route === selectedRoute) || workflowRules[0];

  const handleSimulateStep = () => {
    let next: StageId = simStage;
    let message = '';

    if (simStage === 'APPLICATION_SUBMITTED') {
      next = 'PRELIMINARY_SCRUTINY';
      message = 'Stage 1 Completed: Registration parameters verified. Moved to Preliminary Scrutiny.';
    } else if (simStage === 'PRELIMINARY_SCRUTINY') {
      if (simHasDeficiency) {
        next = 'DEFICIENCY_COMMUNICATION';
        message = 'Deficiency flagged by scrutiny officer. Shifted to Deficiency Notice hold.';
      } else if (selectedRoute.includes('EVC')) {
        next = 'EVC_SCHEDULED';
        message = 'Paper scrutiny cleared. Advancing to EVC Visit Scheduling.';
      } else {
        next = 'COMPETENT_AUTHORITY_DECISION';
        message = 'Scrutiny passed. Forwarded to Competent Authority.';
      }
    } else if (simStage === 'DEFICIENCY_COMMUNICATION') {
      next = 'RE_SCRUTINY';
      message = 'Institution submitted rectification. Reassigned for Re-Scrutiny.';
      setSimHasDeficiency(false);
    } else if (simStage === 'RE_SCRUTINY') {
      if (selectedRoute.includes('EVC')) {
        next = 'EVC_SCHEDULED';
        message = 'Re-scrutiny satisfied. Forwarded to EVC Operations.';
      } else {
        next = 'COMPETENT_AUTHORITY_DECISION';
        message = 'Re-scrutiny cleared. Forwarded to Competent Authority.';
      }
    } else if (simStage === 'EVC_SCHEDULED') {
      next = 'EVC_VISIT_CONDUCTED';
      message = `EVC visit conducted. Outcome: ${simEvcPassed ? 'Recommended' : 'Deficiencies Noted'}. Report submitted.`;
    } else if (simStage === 'EVC_VISIT_CONDUCTED') {
      if (selectedRoute.includes('SAC')) {
        next = 'SAC_SHC_REVIEW';
        message = 'Appellate review required. Assigned to Standing Appellate Committee (SAC).';
      } else {
        next = 'COMPETENT_AUTHORITY_DECISION';
        message = 'EVC Report endorsed. Forwarded for Executive Decision.';
      }
    } else if (simStage === 'SAC_SHC_REVIEW') {
      next = 'COMPETENT_AUTHORITY_DECISION';
      message = 'SAC hearing concluded. Decision forwarded to Competent Authority.';
    } else if (simStage === 'COMPETENT_AUTHORITY_DECISION') {
      next = 'APPROVAL_ISSUED';
      message = 'Executive decision finalized. Digital EoA letter issued.';
    }

    setSimStage(next);
    setSimLog((prev) => [message, ...prev]);
  };

  const handleResetSim = () => {
    setSimStage('APPLICATION_SUBMITTED');
    setSimHasDeficiency(false);
    setSimEvcPassed(true);
    setSimLog(['Simulator reset to initial stage.']);
  };

  const stageRoles: Record<string, string> = {
    APPLICATION_SUBMITTED: 'Institution User',
    PRELIMINARY_SCRUTINY: 'Regional Scrutiny Committee',
    DEFICIENCY_COMMUNICATION: 'Institution (Rectification Window)',
    RE_SCRUTINY: 'Bureau Scrutiny Officer',
    EVC_SCHEDULED: 'EVC Regional Coordinator',
    EVC_VISIT_CONDUCTED: 'Expert Visiting Committee',
    SAC_SHC_REVIEW: 'Standing Appellate Committee',
    COMPETENT_AUTHORITY_DECISION: 'Executive Council / Chairman',
    APPROVAL_ISSUED: 'System Automated Dispatch',
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            Approval Workflows
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Configurable regulatory approval stages, transition logic, and SLA turnaround limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#777777]">Pathway:</span>
          <select
            value={selectedRoute}
            onChange={(e) => {
              setSelectedRoute(e.target.value as WorkflowRoute);
              setSimStage('APPLICATION_SUBMITTED');
            }}
            className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
          >
            <option value="SCRUTINY_ONLY">Routine Scrutiny Only</option>
            <option value="SCRUTINY_EVC">Scrutiny + Physical EVC</option>
            <option value="SCRUTINY_EVC_SAC">Full Statutory (Scrutiny + EVC + SAC)</option>
          </select>
        </div>
      </div>

      {/* Route Description Banner */}
      <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111111]">{activeRule.name}</h2>
          <span className="font-mono text-[11px] text-[#777777]">{activeRule.route}</span>
        </div>
        <p className="text-xs text-[#777777] leading-relaxed">{activeRule.description}</p>
      </div>

      {/* Horizontal Timeline on Desktop / Vertical on Mobile */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
            Configured Processing Sequence
          </h3>
          <span className="text-[11px] text-[#777777]">APH 2026-27 Prescribed Pipeline</span>
        </div>

        {/* Timeline Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {activeRule.stages.map((stg, idx) => {
            const sla = activeRule.slaDaysPerStage[stg] || 14;
            const isSimCurrent = simStage === stg;
            const role = stageRoles[stg] || 'Designated Official';

            return (
              <div
                key={stg}
                className={`p-3.5 rounded border transition-all ${
                  isSimCurrent
                    ? 'border-[#111111] bg-[#FAFAFA]'
                    : 'border-[#E5E5E5] bg-[#F7F7F5]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-[#777777]">Stage 0{idx + 1}</span>
                  <span className="font-semibold text-[#111111]">SLA: {sla}d</span>
                </div>

                <div className="text-xs font-bold text-[#111111] mb-1">
                  {stg.replace(/_/g, ' ')}
                </div>

                <div className="text-[11px] text-[#777777] flex items-center gap-1 mb-2">
                  <UserCheck className="w-3 h-3 text-[#777777] shrink-0" />
                  <span className="truncate">{role}</span>
                </div>

                {isSimCurrent && (
                  <div className="text-[10px] font-bold text-[#111111] pt-1.5 border-t border-[#E5E5E5] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" /> Active Simulated Stage
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Workflow Simulator */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              State-Transition Simulator
            </h3>
            <p className="text-[11px] text-[#777777]">
              Simulate statutory transitions, deficiency branches, and approvals interactively
            </p>
          </div>

          <button
            onClick={handleResetSim}
            className="text-xs text-[#777777] hover:text-[#111111] inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Simulator
          </button>
        </div>

        {/* Current State Bar */}
        <div className="p-3.5 bg-[#F7F7F5] rounded border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block">
              Current Simulated Stage
            </span>
            <div className="text-xs font-bold text-[#111111] mt-0.5">
              {simStage.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#111111]">
              <input
                type="checkbox"
                checked={simHasDeficiency}
                onChange={(e) => setSimHasDeficiency(e.target.checked)}
                className="accent-[#111111] rounded cursor-pointer"
              />
              <span>Flag Deficiency</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-[#111111]">
              <input
                type="checkbox"
                checked={simEvcPassed}
                onChange={(e) => setSimEvcPassed(e.target.checked)}
                className="accent-[#111111] rounded cursor-pointer"
              />
              <span>EVC Recommended</span>
            </label>

            <button
              onClick={handleSimulateStep}
              disabled={simStage === 'APPROVAL_ISSUED'}
              className="h-8 px-3.5 bg-[#111111] hover:bg-[#222222] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{simStage === 'APPROVAL_ISSUED' ? 'Concluded' : 'Step Forward'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Execution Log */}
        <div>
          <span className="text-xs font-semibold text-[#111111] block mb-1.5">
            Simulator Trace Log:
          </span>
          <div className="bg-[#F7F7F5] rounded p-3 border border-[#E5E5E5] font-mono text-xs space-y-1.5 max-h-36 overflow-y-auto">
            {simLog.map((log, idx) => (
              <div key={idx} className="text-[#333333] flex items-start gap-2">
                <span className="text-[#888888]">#{simLog.length - idx}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
