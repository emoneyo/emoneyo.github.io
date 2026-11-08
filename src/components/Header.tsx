import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  HelpCircle,
  BookOpen,
  QrCode,
  Share2,
  Phone,
  Mail,
  Send,
  Sparkles,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { User, SystemSettings } from '../types';
import { EmoLogo } from './EmoLogo';

interface HeaderProps {
  user: User | null;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenIdCard: () => void;
  onOpenGuidelines: () => void;
  onOpenFaq: () => void;
  onOpenLegalCompany?: (tab: 'about' | 'services' | 'contact' | 'privacy' | 'terms' | 'disclaimer') => void;
  onLogout: () => void;
  settings: SystemSettings;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenRegister,
  onOpenLogin,
  onOpenDashboard,
  onOpenAdmin,
  onOpenIdCard,
  onOpenGuidelines,
  onOpenFaq,
  onOpenLegalCompany,
  onLogout,
  settings,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs select-none">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 h-14 sm:h-15 flex items-center justify-between gap-2">
        {/* Left: Official EMO Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer shrink-0"
        >
          <EmoLogo variant="navbar" size={38} />
        </div>

        {/* Center / Right: Dynamic Action Buttons with 3D Symbolic Logos */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick ID Card Button */}
          <button
            onClick={onOpenIdCard}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
            title="डिजिटल आईडी कार्ड"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden xs:inline">आईडी कार्ड</span>
          </button>

          {!user ? (
            /* Guest / Non-logged in buttons */
            <>
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>लॉगिन</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>रजिस्टर</span>
              </button>
            </>
          ) : (
            /* Logged in User button: Never show Register/Login anymore */
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/25 transition-all active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate max-w-[85px] sm:max-w-[120px]">{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={onLogout}
                title="लॉगआउट"
                className="p-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* "More" Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                isMoreMenuOpen
                  ? 'bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Menu className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline text-[11px]">More</span>
            </button>

            {/* Dropdown Menu Modal */}
            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 space-y-1 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenGuidelines();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>उपयोगकर्ता गाइड (Guidelines)</span>
                  </button>

                  {onOpenLegalCompany && (
                    <>
                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onOpenLegalCompany('about');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>हमारे बारे में (About Us)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onOpenLegalCompany('contact');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                      >
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>संपर्क करें (Contact Us)</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenFaq();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>सामान्य सवाल (FAQ)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenIdCard();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>डिजिटल आईडी कार्ड खोजें</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  {onOpenLegalCompany && (
                    <>
                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onOpenLegalCompany('privacy');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span>गोपनीयता नीति (Privacy Policy)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onOpenLegalCompany('terms');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span>नियम व शर्तें (Terms of Service)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onOpenLegalCompany('disclaimer');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span>अस्वीकरण (Disclaimer)</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />
                    </>
                  )}

                  {/* Telegram Helpline */}
                  {settings.telegramChannel && (
                    <a
                      href={settings.telegramChannel}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-sky-700 hover:bg-sky-50 transition-colors text-left"
                    >
                      <Send className="w-4 h-4 text-sky-600" />
                      <span>टेलीग्राम सपोर्ट चैनल</span>
                    </a>
                  )}

                  {/* WhatsApp Helpline (only if enabled by admin) */}
                  {settings.showWhatsApp && settings.whatsAppNumber && (
                    <a
                      href={`https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors text-left"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp हेल्पलाइन</span>
                    </a>
                  )}

                  {/* Helpline Email */}
                  <a
                    href={`mailto:${settings.helplineEmail}`}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                  >
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{settings.helplineEmail}</span>
                  </a>

                  <div className="border-t border-slate-100 my-1" />

                  {/* Admin Panel button */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-rose-700 hover:bg-rose-50 transition-colors text-left"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>एडमिन पैनल (Admin Panel)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
