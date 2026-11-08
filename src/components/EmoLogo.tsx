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
  // Standalone circular high-res 3D badge emblem for EmoneyO with Rainbow & Luxury Gold Effects
  const renderBadge = (dim = 48) => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md select-none overflow-visible transition-transform duration-300 hover:scale-105"
    >
      <defs>
        {/* Luxury Gold Rim Gradient */}
        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="75%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Vibrant Rainbow Spectrum Gradient */}
        <linearGradient id="rainbowSpectrum" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF1361" />
          <stop offset="20%" stopColor="#FFF800" />
          <stop offset="40%" stopColor="#00E676" />
          <stop offset="60%" stopColor="#00E5FF" />
          <stop offset="80%" stopColor="#7C4DFF" />
          <stop offset="100%" stopColor="#FF007F" />
        </linearGradient>

        {/* Deep Royal Luxury Midnight Core */}
        <radialGradient id="royalDarkCore" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>

        {/* Shimmer Gold for "E" and Text */}
        <linearGradient id="letterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Outer Dynamic Shadow */}
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.35" />
        </filter>

        {/* Neon Glow Filter for Rainbow Halo */}
        <filter id="rainbowGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Outer 3D Gold Rim */}
      <circle cx="50" cy="50" r="48" fill="url(#goldRim)" filter="url(#badgeShadow)" />

      {/* Premium Rainbow Outer Halo Ring */}
      <circle
        cx="50"
        cy="50"
        r="44.5"
        stroke="url(#rainbowSpectrum)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#rainbowGlow)"
      />

      {/* Precision Micro Dotted Inset */}
      <circle
        cx="50"
        cy="50"
        r="41.5"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeDasharray="2.5 2"
        fill="none"
        opacity="0.85"
      />

      {/* Deep Royal Midnight Blue/Black Center Core */}
      <circle cx="50" cy="50" r="39" fill="url(#royalDarkCore)" />

      {/* Subtle Futuristic Tech Geometric Nodes */}
      <circle cx="50" cy="50" r="28" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" fill="none" />
      <circle cx="50" cy="50" r="18" stroke="#A855F7" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.25" fill="none" />

      {/* Ascending Rainbow Financial Growth Bars */}
      <rect x="25" y="55" width="5.5" height="13" rx="2" fill="#FF1361" opacity="0.9" />
      <rect x="34" y="47" width="5.5" height="21" rx="2" fill="#F59E0B" opacity="0.95" />
      <rect x="43" y="39" width="5.5" height="29" rx="2" fill="#10B981" opacity="0.95" />
      <rect x="52" y="31" width="5.5" height="37" rx="2" fill="#00E5FF" opacity="0.95" />
      <rect x="61" y="23" width="5.5" height="45" rx="2" fill="#7C4DFF" />
      <rect x="70" y="16" width="5.5" height="52" rx="2" fill="#FF007F" />

      {/* Smooth Ascending Growth Trajectory Line */}
      <path
        d="M 23 58 Q 45 42 73 17"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />
      <polygon points="76,14 69,17 73,23" fill="#FFFFFF" />

      {/* Center Stylized "EmoneyO" Monogram / Brandmark */}
      <g filter="url(#badgeShadow)">
        {/* Main "E" Monogram with Coin Core */}
        <text
          x="44"
          y="74"
          textAnchor="middle"
          fill="url(#letterGrad)"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="1"
          stroke="#0F172A"
          strokeWidth="0.8"
        >
          E
        </text>

        {/* Small "₹" Symbol beside E */}
        <text
          x="57"
          y="65"
          textAnchor="middle"
          fill="#38BDF8"
          fontFamily="sans-serif"
          fontWeight="800"
          fontSize="10"
        >
          ₹
        </text>

        {/* The Golden Orbiting "O" Ring of EmoneyO */}
        <circle
          cx="68"
          cy="71"
          r="6.5"
          stroke="url(#rainbowSpectrum)"
          strokeWidth="2.5"
          fill="#1E1B4B"
          filter="url(#rainbowGlow)"
        />
        <circle cx="68" cy="71" r="2.5" fill="#FDE047" />
      </g>

      {/* Top Floating Golden Crown of Financial Freedom */}
      <path
        d="M 43 24 L 46 17 L 50 20 L 54 17 L 57 24 Z"
        fill="url(#goldRim)"
        stroke="#FFFFFF"
        strokeWidth="0.5"
      />

      {/* Dynamic Sparkle Accents */}
      <path d="M 17 48 L 19 44 L 23 46 L 20 49 L 21 53 L 18 50 L 14 51 L 16 48 Z" fill="#FDE047" opacity="0.9" />
      <path d="M 83 44 L 81 40 L 77 42 L 80 45 L 79 49 L 82 46 L 86 47 L 84 44 Z" fill="#38BDF8" opacity="0.9" />
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
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        {renderBadge(40)}
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl tracking-tight rainbow-text">
              EmoneyO
            </span>
            <span className="text-[9px] bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              OFFICIAL
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-200 tracking-tight mt-0.5 flex items-center gap-1">
            <span>EARN MONEY ONLINE</span>
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-400"></span>
            <span className="text-[9px] text-blue-200">AI NETWORK</span>
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
        <span className="mt-3 font-black text-2xl tracking-widest text-slate-600 rainbow-text">
          EmoneyO
        </span>
        <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          EARN MONEY ONLINE • AI Social Network
        </span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="relative p-1 rounded-full rainbow-border shadow-xl">
          <div className="bg-slate-950 p-1.5 rounded-full">
            {renderBadge(size || 88)}
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight rainbow-text">
              EmoneyO
            </h1>
            <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              AI NETWORK
            </span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wide mt-1">
            EARN MONEY ONLINE (EmoneyO)
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            AI Powered Social Networking & Income Platform
          </p>
        </div>
      </div>
    );
  }

  // Default navbar variant - horizontal, premium rainbow text, sleek badges
  return (
    <div className={`flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      {renderBadge(size || 42)}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-xl sm:text-2xl tracking-tight rainbow-text flex items-center">
            EmoneyO
          </span>
          <span className="hidden xs:inline-block bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full tracking-wider shadow-xs uppercase">
            EARN ONLINE
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 tracking-tight line-clamp-1">
          EARN MONEY ONLINE • AI Network
        </span>
      </div>
    </div>
  );
};
