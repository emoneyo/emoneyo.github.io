import React from 'react';

interface EmoLogoProps {
  variant?: 'navbar' | 'badge' | 'idcard' | 'watermark' | 'full';
  className?: string;
  size?: number;
}

export const EmoLogo: React.FC<EmoLogoProps> = ({
  variant = 'navbar',
  className = '',
  size,
}) => {
  // Standalone circular high-res 3D badge emblem
  const renderBadge = (dim = 44) => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md select-none overflow-visible"
    >
      <defs>
        {/* Outer Gold Gradient */}
        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        {/* Center Flipkart Blue Gradient */}
        <linearGradient id="blueCore" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* EMO Letter Gradient */}
        <linearGradient id="letterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Green Growth Arrow Gradient */}
        <linearGradient id="greenArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Subtle drop shadow */}
        <filter id="badgeShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer 3D Gold Ring */}
      <circle cx="50" cy="50" r="47" fill="url(#goldRim)" filter="url(#badgeShadow)" />
      
      {/* Outer Ring Inset Stroke */}
      <circle cx="50" cy="50" r="44" stroke="#FFF7ED" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.8" />

      {/* Inner Rich Blue Circle */}
      <circle cx="50" cy="50" r="40" fill="url(#blueCore)" />

      {/* Tech Radial Grid Pattern */}
      <circle cx="50" cy="50" r="30" stroke="#60A5FA" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.4" fill="none" />
      <circle cx="50" cy="50" r="20" stroke="#93C5FD" strokeWidth="0.5" opacity="0.3" fill="none" />

      {/* Ascending Financial Graph Bars in background */}
      <rect x="26" y="52" width="6" height="15" rx="1.5" fill="#34D399" opacity="0.85" />
      <rect x="36" y="44" width="6" height="23" rx="1.5" fill="#6EE7B7" opacity="0.9" />
      <rect x="46" y="36" width="6" height="31" rx="1.5" fill="#FBBF24" opacity="0.95" />
      <rect x="56" y="28" width="6" height="39" rx="1.5" fill="#F59E0B" opacity="0.95" />
      <rect x="66" y="20" width="6" height="47" rx="1.5" fill="#10B981" />

      {/* Financial Growth Arrow */}
      <path
        d="M24 55 Q 48 38 72 20"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="76,17 68,20 74,26" fill="#FFFFFF" />

      {/* Stylized "EMO" bold typography */}
      <g filter="url(#badgeShadow)">
        <text
          x="50"
          y="76"
          textAnchor="middle"
          fill="url(#letterGrad)"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="1.5"
          stroke="#1E3A8A"
          strokeWidth="1"
        >
          EMO
        </text>
      </g>

      {/* Top Rupee Emblem */}
      <circle cx="50" cy="22" r="9" fill="url(#goldRim)" stroke="#FFFFFF" strokeWidth="1" />
      <text
        x="50"
        y="26"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="11"
      >
        ₹
      </text>

      {/* Star Accents */}
      <path d="M 17 50 L 19 46 L 23 48 L 20 51 L 21 55 L 18 52 L 14 53 L 16 50 Z" fill="#FDE047" opacity="0.8" />
      <path d="M 83 50 L 81 46 L 77 48 L 80 51 L 79 55 L 82 52 L 86 53 L 84 50 Z" fill="#FDE047" opacity="0.8" />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderBadge(size || 52)}
      </div>
    );
  }

  if (variant === 'idcard') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        {renderBadge(36)}
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1">
            <span className="font-black text-amber-300 text-lg tracking-wider">EMO</span>
            <span className="text-[9px] bg-amber-400 text-slate-900 font-extrabold px-1 py-0.5 rounded uppercase tracking-wider">
              OFFICIAL
            </span>
          </div>
          <span className="text-[10px] font-semibold text-blue-100 tracking-tight">
            EARN MONEY ONLINE
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'watermark') {
    return (
      <div
        className={`pointer-events-none select-none flex flex-col items-center justify-center opacity-8 ${className}`}
      >
        {renderBadge(size || 220)}
        <span className="mt-3 font-black text-2xl tracking-widest text-slate-600">
          EARN MONEY ONLINE
        </span>
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          AI Social Networking
        </span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {renderBadge(size || 88)}
        <div className="mt-2.5">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-700">
              EMO
            </h1>
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              AI NETWORK
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide mt-0.5">
            EARN MONEY ONLINE
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Social Media Networking Platform
          </p>
        </div>
      </div>
    );
  }

  // Default navbar variant - horizontal, perfectly compact, no overflow
  return (
    <div className={`flex items-center gap-2 select-none shrink-0 ${className}`}>
      {renderBadge(size || 40)}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-lg sm:text-xl text-blue-700 tracking-tight flex items-center">
            EMO
          </span>
          <span className="hidden xs:inline-block bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded tracking-wide shadow-xs">
            EARN ONLINE
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-600 tracking-tight line-clamp-1">
          Social Networking AI
        </span>
      </div>
    </div>
  );
};
