import React from 'react';

interface AicteLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const AicteLogo: React.FC<AicteLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {/* Official AICTE Emblem Insignia */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-[1.5px] shadow-sm flex items-center justify-center`}
      >
        <div className="w-full h-full bg-[#111111] rounded-[7px] flex items-center justify-center p-1 relative overflow-hidden">
          {/* Subtle national tricolor glow inside */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-500/20 rounded-full blur-xs pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500/20 rounded-full blur-xs pointer-events-none" />
          
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white"
          >
            {/* AICTE stylized emblem: Sun/Flame + Open Book / Wings of Progress + Pillar */}
            {/* Pillar / Central flame */}
            <path
              d="M16 4L18.5 10H13.5L16 4Z"
              fill="#F59E0B"
            />
            <circle cx="16" cy="11.5" r="1.5" fill="#FFFFFF" />
            {/* Gear / Wheel of Technology */}
            <circle
              cx="16"
              cy="18"
              r="7"
              stroke="#E2E8F0"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            {/* Open Book / Wings of Learning */}
            <path
              d="M16 18C13.5 15.5 9.5 16 8 16.5V23C10 22.5 13.5 22.5 16 24.5C18.5 22.5 22 22.5 24 23V16.5C22.5 16 18.5 15.5 16 18Z"
              fill="#FFFFFF"
              fillOpacity="0.95"
            />
            {/* Central spine */}
            <line x1="16" y1="18" x2="16" y2="25" stroke="#111111" strokeWidth="1.2" />
            {/* Base foundation */}
            <path
              d="M10 26.5H22"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="leading-tight overflow-hidden text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white tracking-wide truncate">
              Saksham
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase shrink-0">
              AICTE
            </span>
          </div>
          <span className="text-[10px] text-[#888888] truncate block font-medium">
            National Approval Portal
          </span>
        </div>
      )}
    </div>
  );
};

