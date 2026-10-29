import React from 'react';
import type { ApplicationStatus, StageId } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'orange';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  // Clean minimal monochrome styles with subtle grey backgrounds and black/dark text
  // Red is restrained for danger/overdue only
  const variantStyles = {
    default: 'bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]',
    success: 'bg-[#EEEEEC] text-[#111111] border border-[#DCDCDA]',
    warning: 'bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]',
    danger: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
    info: 'bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]',
    purple: 'bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]',
    orange: 'bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]',
    neutral: 'bg-[#F7F7F5] text-[#555555] border border-[#E5E5E5]',
  };

  const dotColors = {
    default: 'bg-[#111111]',
    success: 'bg-[#111111]',
    warning: 'bg-[#777777]',
    danger: 'bg-[#DC2626]',
    info: 'bg-[#111111]',
    purple: 'bg-[#777777]',
    orange: 'bg-[#111111]',
    neutral: 'bg-[#999999]',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 rounded font-mono',
    sm: 'text-[11px] px-2.5 py-0.5 rounded font-medium',
    md: 'text-xs px-3 py-1 rounded font-medium',
  };

  return (
    <span
      className={`inline-flex items-center transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return <Badge variant="success" dot>Approved</Badge>;
    case 'UNDER_SCRUTINY':
      return <Badge variant="default" dot>In Progress</Badge>;
    case 'DEFICIENCY_REPORTED':
      return <Badge variant="danger" dot>Deficiency</Badge>;
    case 'EVC_SCHEDULED':
      return <Badge variant="default" dot>EVC Scheduled</Badge>;
    case 'PENDING_EVC':
      return <Badge variant="neutral" dot>Pending EVC</Badge>;
    case 'EVC_COMPLETED':
      return <Badge variant="success" dot>EVC Completed</Badge>;
    case 'PENDING_SAC':
      return <Badge variant="neutral" dot>Pending SAC</Badge>;
    case 'REJECTED':
      return <Badge variant="danger" dot>Rejected</Badge>;
    case 'ON_HOLD':
      return <Badge variant="neutral" dot>On Hold</Badge>;
    case 'SUBMITTED':
    default:
      return <Badge variant="neutral" dot>Pending</Badge>;
  }
};

export const StageBadge: React.FC<{ stage: StageId }> = ({ stage }) => {
  const formatStage = (s: StageId) => {
    switch (s) {
      case 'APPLICATION_SUBMITTED':
        return 'Submitted';
      case 'PRELIMINARY_SCRUTINY':
        return 'Prelim Scrutiny';
      case 'DEFICIENCY_COMMUNICATION':
        return 'Deficiency Hold';
      case 'RE_SCRUTINY':
        return 'Re-Scrutiny';
      case 'PENDING_EVC':
        return 'EVC Eligible';
      case 'EVC_SCHEDULED':
        return 'EVC Scheduled';
      case 'EVC_VISIT_CONDUCTED':
        return 'EVC Conducted';
      case 'SAC_SHC_REVIEW':
        return 'SAC Review';
      case 'COMPETENT_AUTHORITY_DECISION':
        return 'Council Review';
      case 'APPROVAL_ISSUED':
        return 'Approved';
      case 'REJECTED_CLOSED':
        return 'Closed';
      default: {
        const stageStr: string = s;
        return stageStr.replace(/_/g, ' ');
      }
    }
  };

  return (
    <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] font-medium">
      {formatStage(stage)}
    </span>
  );
};
