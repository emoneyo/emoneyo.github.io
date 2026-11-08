import React, { useState } from 'react';

interface EmoLogoProps {
  variant?: 'navbar' | 'badge' | 'idcard' | 'watermark' | 'full';
  className?: string;
  size?: number;
}

// Canonical logo path using the user's uploaded sacred gold & rainbow EmoneyO emblem
const LOGO_SRC = './emoneyo-logo.png';
const FALLBACK_SRC = './assets/aistudio/image_ab765c08.png';

export const EmoLogo: React.FC<EmoLogoProps> = ({
  variant = 'navbar',
  className = '',
  size,
}) => {
  const [imgError, setImgError] = useState(false);

  // High-fidelity image emblem rendering with responsive aspect ratio and fallback
  const renderEmblem = (dim: number, extraClasses = '') => (
    <div
      style={{ width: dim, height: dim }}
      className={`relative shrink-0 select-none inline-flex items-center justify-center rounded-full overflow-hidden shadow-md ring-1 ring-amber-400/50 hover:scale-105 transition-transform duration-300 ${extraClasses}`}
    >
      <img
        src={imgError ? FALLBACK_SRC : LOGO_SRC}
        alt="EmoneyO Official Logo"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover rounded-full"
        loading="eager"
      />
    </div>
  );

  // Standalone circular badge
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem(size || 48)}
      </div>
    );
  }

  // 3D Digital ID Card Logo with Rainbow Brandmark
  if (variant === 'idcard') {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        {renderEmblem(size || 40, 'ring-2 ring-amber-300 shadow-amber-500/30')}
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl tracking-tight rainbow-text">
              EmoneyO
            </span>
            <span className="text-[9px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
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

  // Large background watermark on ID Card
  if (variant === 'watermark') {
    return (
      <div
        className={`pointer-events-none select-none flex flex-col items-center justify-center opacity-12 ${className}`}
      >
        <img
          src={imgError ? FALLBACK_SRC : LOGO_SRC}
          alt="EmoneyO Watermark"
          style={{ width: size || 220, height: size || 220 }}
          className="object-cover rounded-full filter grayscale contrast-125"
        />
        <span className="mt-3 font-black text-2xl tracking-widest text-slate-600 rainbow-text">
          EmoneyO
        </span>
        <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          EARN MONEY ONLINE • AI Social Network
        </span>
      </div>
    );
  }

  // Full Hero / About Us presentation with Rainbow Ring & Subtitles
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="relative p-1.5 rounded-full rainbow-border shadow-2xl">
          <div className="bg-slate-950 p-1 rounded-full">
            {renderEmblem(size || 96, 'ring-2 ring-amber-400')}
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

  // Default navbar variant - ultra-crisp emblem, rainbow brandmark, responsive on mobile & desktop
  return (
    <div className={`flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      {renderEmblem(size || 40, 'ring-1 ring-amber-400/70 shadow-sm')}
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
