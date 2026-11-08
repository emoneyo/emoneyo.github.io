import React from 'react';
import { Megaphone, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  text: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ text }) => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-b border-blue-800/80 shadow-inner select-none overflow-hidden h-9 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 flex items-center overflow-hidden">
        {/* Static badge on left so user always sees the label */}
        <div className="flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shrink-0 shadow-xs z-10 mr-2">
          <Megaphone className="w-3 h-3 text-slate-950 shrink-0" />
          <span className="uppercase tracking-wider">लाइव अलर्ट</span>
        </div>

        {/* Slow marquee container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee-slow whitespace-nowrap text-[11px] sm:text-xs font-bold text-amber-200 tracking-wide">
            {text} &nbsp;&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;&nbsp; {text}
          </div>
        </div>
      </div>
    </div>
  );
};
