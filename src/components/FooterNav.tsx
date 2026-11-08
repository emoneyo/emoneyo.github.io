import React from 'react';
import {
  Home,
  TrendingUp,
  QrCode,
  UserPlus,
  LayoutDashboard,
  ShieldAlert,
  Share2,
  Send,
  HelpCircle,
} from 'lucide-react';
import { User } from '../types';

interface FooterNavProps {
  user: User | null;
  onNavigateHome: () => void;
  onNavigatePlans: () => void;
  onOpenIdCard: () => void;
  onOpenRegister: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenPromotionKit: () => void;
  telegramLink: string;
}

export const FooterNav: React.FC<FooterNavProps> = ({
  user,
  onNavigateHome,
  onNavigatePlans,
  onOpenIdCard,
  onOpenRegister,
  onOpenDashboard,
  onOpenAdmin,
  onOpenPromotionKit,
  telegramLink,
}) => {
  return (
    <>
      {/* Floating Telegram Support Quick Action on Right */}
      {telegramLink && (
        <a
          href={telegramLink}
          target="_blank"
          rel="noreferrer"
          title="टेलीग्राम सहायता समूह"
          className="fixed bottom-18 right-3.5 z-40 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full shadow-lg shadow-sky-500/40 flex items-center justify-center transition-all active:scale-90 hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </a>
      )}

      {/* Locked Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl h-15 select-none">
        <div className="max-w-lg mx-auto h-full px-2 flex items-center justify-around">
          {/* 1. Home */}
          <button
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 active:scale-95 transition-all py-1 px-2"
          >
            <Home className="w-5 h-5 text-slate-700" />
            <span className="text-[10px] font-bold mt-0.5">मुख्य पेज</span>
          </button>

          {/* 2. Plans / Services */}
          <button
            onClick={onNavigatePlans}
            className="flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 active:scale-95 transition-all py-1 px-2"
          >
            <TrendingUp className="w-5 h-5 text-slate-700" />
            <span className="text-[10px] font-bold mt-0.5">अर्निंग प्लान्स</span>
          </button>

          {/* 3. Digital ID Card */}
          <button
            onClick={onOpenIdCard}
            className="flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 active:scale-95 transition-all py-1 px-2"
          >
            <QrCode className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black text-blue-700 mt-0.5">आईडी कार्ड</span>
          </button>

          {/* 4. Dynamic (Register if guest, Dashboard or Refer Kit if logged in) */}
          {!user ? (
            <button
              onClick={onOpenRegister}
              className="flex flex-col items-center justify-center text-amber-600 hover:text-amber-700 active:scale-95 transition-all py-1 px-2"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-1 rounded-lg shadow-xs">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-amber-700 mt-0.5">रजिस्टर</span>
            </button>
          ) : (
            <button
              onClick={onOpenPromotionKit}
              className="flex flex-col items-center justify-center text-emerald-600 hover:text-emerald-700 active:scale-95 transition-all py-1 px-2"
            >
              <div className="bg-emerald-600 text-white p-1 rounded-lg shadow-xs">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-emerald-800 mt-0.5">रेफर किट</span>
            </button>
          )}

          {/* 5. Dashboard (or Admin if guest, Admin if logged in) */}
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 active:scale-95 transition-all py-1 px-2"
            >
              <LayoutDashboard className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold mt-0.5">डैशबोर्ड</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="flex flex-col items-center justify-center text-slate-600 hover:text-rose-600 active:scale-95 transition-all py-1 px-2"
            >
              <ShieldAlert className="w-5 h-5 text-slate-600" />
              <span className="text-[10px] font-bold mt-0.5">एडमिन</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
