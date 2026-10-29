import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
  highlight = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-5 border transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-[#111111] hover:bg-[#FAFAFA]' : ''
      } ${
        highlight
          ? 'border-[#DC2626] bg-[#FFFBFB]'
          : 'border-[#E5E5E5]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight tabular-nums">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="w-8 h-8 rounded border border-[#E5E5E5] bg-[#F7F7F5] flex items-center justify-center text-[#111111] shrink-0">
            <Icon className="w-4 h-4 stroke-[1.75]" />
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-3 pt-2.5 border-t border-[#E5E5E5] text-xs text-[#777777] truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
