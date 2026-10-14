import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'white' | 'badge' | 'official-card' | 'image';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showPillars?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Acquire SURGERY Official Emblem Mark
 * Stylized brand monogram with organic green leaf accent
 */
export const LogoEmblem: React.FC<{
  className?: string;
  isWhite?: boolean;
}> = ({ className = 'w-10 h-10', isWhite = false }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 select-none`}
      aria-label="Acquire Emblem"
    >
      <defs>
        <linearGradient id="emblemLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill={isWhite ? 'rgba(255,255,255,0.1)' : '#F0F7FF'} />
      <rect
        x="1"
        y="1"
        width="118"
        height="118"
        rx="27"
        stroke={isWhite ? 'rgba(255,255,255,0.2)' : '#BAE6FD'}
        strokeWidth="2"
      />
      <text
        x="24"
        y="86"
        fill={isWhite ? '#FFFFFF' : '#062B61'}
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: '76px',
        }}
      >
        A
      </text>
      <g transform="translate(86, 36) scale(1.15)">
        <path
          d="M -9,11 C -10,5 -4,-3 8,-18 C 9,-19 10,-19 10,-17 C 11,-4 6,6 -5,12 C -7,14 -9,13 -9,11 Z"
          fill="url(#emblemLeafGrad)"
        />
      </g>
    </svg>
  );
};

/**
 * Acquire SURGERY Vector Lockup
 * - Top: "Acquire" in deep navy (#062B61) with vibrant green leaf over 'i'
 * - Bottom: "SURGERY" in cyan/teal (#0097B2) with wide letter spacing
 */
export const AcquireSurgeryVector: React.FC<{
  isWhite?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ isWhite = false, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const leafGradId = isWhite ? 'acquireLeafGradWhite' : 'acquireLeafGrad';

  return (
    <svg
      viewBox="0 0 640 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto max-w-full select-none shrink-0 ${className}`}
      aria-label="Acquire SURGERY"
    >
      <defs>
        <linearGradient id={leafGradId} x1="0%" y1="100%" x2="100%" y2="0%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#059669" />
              <stop offset="45%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </>
          )}
        </linearGradient>
      </defs>

      <g transform="translate(32, 12)">
        {/* "Acqu" */}
        <text
          x="0"
          y="132"
          fill={isWhite ? '#FFFFFF' : '#062B61'}
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 800,
            fontSize: '124px',
            letterSpacing: '-2px',
          }}
        >
          Acqu
        </text>

        {/* 'i' stem without dot */}
        <rect
          x="318"
          y="52"
          width="22"
          height="80"
          rx="3"
          fill={isWhite ? '#FFFFFF' : '#062B61'}
        />

        {/* Emerald green leaf replacing dot of 'i' */}
        <g transform="translate(329, 28) scale(1.15)">
          <path
            d="M -10,13 C -12,6 -5,-4 9,-21 C 10,-22 12,-22 12,-20 C 13,-4 7,8 -5,16 C -7,17.5 -9.5,16 -10,13 Z"
            fill={`url(#${leafGradId})`}
          />
        </g>

        {/* "re" */}
        <text
          x="345"
          y="132"
          fill={isWhite ? '#FFFFFF' : '#062B61'}
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 800,
            fontSize: '124px',
            letterSpacing: '-2px',
          }}
        >
          re
        </text>

        {/* "SURGERY" */}
        <text
          x="50"
          y="195"
          fill={isWhite ? '#38BDF8' : '#0097B2'}
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 700,
            fontSize: '38px',
            letterSpacing: '14px',
          }}
        >
          SURGERY
        </text>
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = false,
  showPillars = false,
  className = '',
  onClick,
}) => {
  const isWhite = variant === 'white';

  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  // Pure Image Variant
  if (variant === 'image') {
    return (
      <div
        id="acquire-surgery-logo-image"
        onClick={onClick}
        className={`inline-block select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img
          src="/logo.svg"
          alt="Acquire SURGERY"
          className="w-full h-auto max-w-[280px] sm:max-w-xs object-contain"
        />
      </div>
    );
  }

  // If badge only
  if (variant === 'badge') {
    return (
      <div
        id="acquire-surgery-logo-badge"
        onClick={onClick}
        className={`inline-block select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <LogoEmblem className={emblemSizes[size]} isWhite={isWhite} />
      </div>
    );
  }

  // Official Card Variant
  if (variant === 'official-card') {
    return (
      <div
        id="acquire-surgery-official-card-logo"
        onClick={onClick}
        className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col items-center text-center select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <AcquireSurgeryVector size="lg" isWhite={false} />
      </div>
    );
  }

  // Compact variant (Emblem + Wordmark)
  if (variant === 'compact') {
    return (
      <div
        id="acquire-surgery-compact-logo"
        onClick={onClick}
        className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <LogoEmblem className={emblemSizes[size]} isWhite={isWhite} />
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight leading-none ${isWhite ? 'text-white' : 'text-[#062B61]'} text-lg`}>
            Acquire
          </span>
          <span className={`font-bold tracking-widest text-[10px] ${isWhite ? 'text-[#38BDF8]' : 'text-[#0097B2]'}`}>
            SURGERY
          </span>
        </div>
      </div>
    );
  }

  // Standard / Header / Footer Logo (Acquire SURGERY)
  return (
    <div
      id="acquire-surgery-brand-logo"
      onClick={onClick}
      className={`inline-flex flex-col select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <AcquireSurgeryVector isWhite={isWhite} size={size} />

      {showTagline && (
        <span
          className={`text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5 text-center sm:text-left ${
            isWhite ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Find the Right Care for a Healthier Tomorrow
        </span>
      )}

      {showPillars && (
        <div className="hidden sm:flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-500 divide-x divide-slate-200">
          <span className="flex items-center gap-1 text-slate-700">
            Search Hospitals
          </span>
          <span className="flex items-center gap-1 pl-3 text-slate-700">
            Compare Options
          </span>
          <span className="flex items-center gap-1 pl-3 text-slate-700">
            Choose with Confidence
          </span>
        </div>
      )}
    </div>
  );
};
