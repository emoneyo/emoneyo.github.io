import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  Download,
  RotateCw,
  Flame,
  Droplets,
  Crown,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Share2,
  Lock,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sliders,
  X,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { User } from '../types';
import { EmoLogo } from './EmoLogo';

interface DigitalIdCardProps {
  user: User | null;
  isOwner?: boolean;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
  onSelectSponsor?: (sponsorId: string) => void;
  onUpdateUser?: (updated: User) => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  user,
  isOwner = true,
  onOpenRegister,
  onOpenLogin,
  onSelectSponsor,
  onUpdateUser,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedFrame, setSelectedFrame] = useState<'fire' | 'water' | 'gold' | 'classic'>(
    user?.avatarFrame || 'fire'
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [searchSponsorInput, setSearchSponsorInput] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [guestSponsor, setGuestSponsor] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Privacy Settings Panel State
  const [showPrivacyPanel, setShowPrivacyPanel] = useState<boolean>(false);
  const [privacyToggles, setPrivacyToggles] = useState({
    hidePhone: user?.privacySettings?.hidePhone ?? false,
    hidePayment: user?.privacySettings?.hidePayment ?? false,
    hideEmail: user?.privacySettings?.hideEmail ?? false,
    hideSponsor: user?.privacySettings?.hideSponsor ?? false,
  });
  const [isSavingPrivacy, setIsSavingPrivacy] = useState<boolean>(false);
  const [privacySuccessMsg, setPrivacySuccessMsg] = useState<string>('');

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Active user data (either logged in user or searched guest sponsor)
  const displayUser = user || guestSponsor;
  const isActualOwner = !!user && isOwner;

  // Sync privacy state with user object
  useEffect(() => {
    if (user?.privacySettings) {
      setPrivacyToggles({
        hidePhone: user.privacySettings.hidePhone ?? false,
        hidePayment: user.privacySettings.hidePayment ?? false,
        hideEmail: user.privacySettings.hideEmail ?? false,
        hideSponsor: user.privacySettings.hideSponsor ?? false,
      });
    }
  }, [user]);

  // Generate QR Code
  useEffect(() => {
    if (!displayUser) return;
    const refUrl = displayUser.personalQrLink || `${window.location.origin}?ref=${displayUser.memberId}`;
    QRCode.toDataURL(refUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [displayUser]);

  // Sync frame with user setting if user changes
  useEffect(() => {
    if (user?.avatarFrame) {
      setSelectedFrame(user.avatarFrame);
    }
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Masking helpers
  const getMaskedPhone = (phone?: string) => {
    if (!phone) return '********';
    if (!privacyToggles.hidePhone) return phone;
    return phone.length > 4 ? `******${phone.slice(-4)}` : '******';
  };

  const getMaskedPayment = (payment?: string) => {
    if (!payment) return '******';
    if (!privacyToggles.hidePayment) return payment;
    const parts = payment.split('@');
    if (parts.length === 2) {
      return `****@${parts[1]}`;
    }
    return `****${payment.slice(-4)}`;
  };

  const getMaskedEmail = (email?: string) => {
    if (!email) return '***@emo.online';
    if (!privacyToggles.hideEmail) return email;
    const [name, domain] = email.split('@');
    return `${name.charAt(0)}***@${domain || 'mail.com'}`;
  };

  const getMaskedSponsor = (sponsorId?: string) => {
    if (!sponsorId) return 'EMOADMIN';
    if (!privacyToggles.hideSponsor) return sponsorId;
    return `EMO***${sponsorId.slice(-2)}`;
  };

  // Search sponsor if not logged in
  const handleSearchSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchSponsorInput.trim()) {
      setSearchError('कृपया स्पॉन्सर आईडी दर्ज करें।');
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/sponsor/check/${encodeURIComponent(searchSponsorInput.trim())}`);
      const data = await res.json();
      if (data.success && data.sponsor) {
        setGuestSponsor({
          memberId: data.sponsor.memberId,
          name: data.sponsor.name,
          planName: data.sponsor.planName || 'EMO Standard',
          phone: data.sponsor.phone || '********',
          paymentAddress: '8877490845@spicepay',
          email: 'official@emo.online',
          verificationStatus: data.sponsor.status || 'approved',
          registrationDate: new Date().toISOString(),
          privacySettings: { hidePhone: false, hidePayment: true, hideEmail: true },
          avatarFrame: 'gold',
        });
        if (onSelectSponsor) {
          onSelectSponsor(data.sponsor.memberId);
        }
      } else {
        setSearchError(data.message || 'स्पॉन्सर आईडी मान्य नहीं है।');
      }
    } catch (err: any) {
      setSearchError('स्पॉन्सर सर्च करने में समस्या आई।');
    } finally {
      setIsSearching(false);
    }
  };

  // Save Privacy Settings
  const handleSavePrivacySettings = async () => {
    if (!user) return;
    setIsSavingPrivacy(true);
    setPrivacySuccessMsg('');

    try {
      const res = await fetch(`/api/user/profile/${user.memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacySettings: privacyToggles,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (onUpdateUser) {
          onUpdateUser(data.user);
        }
        setPrivacySuccessMsg('गोपनीयता सेटिंग्स सुरक्षित रूप से सहेजी गईं!');
        setTimeout(() => {
          setShowPrivacyPanel(false);
          setPrivacySuccessMsg('');
        }, 1200);
      }
    } catch (err) {
      console.error('Error saving privacy:', err);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  // High-Resolution Card Download (Respects Privacy Toggles!)
  const handleDownloadCard = async () => {
    if (!isActualOwner || !displayUser) return;
    setIsDownloading(true);

    try {
      // Create high-res canvas (1000 x 620)
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 620;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1000, 620);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#1E3A8A');
      bgGrad.addColorStop(1, '#0B2149');
      ctx.fillStyle = bgGrad;
      ctx.roundRect(0, 0, 1000, 620, [32]);
      ctx.fill();

      // Border with gold accent
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#F59E0B';
      ctx.roundRect(4, 4, 992, 612, [30]);
      ctx.stroke();

      // Header Banner
      const headerGrad = ctx.createLinearGradient(0, 0, 1000, 0);
      headerGrad.addColorStop(0, '#1D4ED8');
      headerGrad.addColorStop(1, '#2563EB');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(4, 4, 992, 110);

      // Gold bottom trim on header
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(4, 110, 992, 6);

      // Header Texts
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('EMO - EARN MONEY ONLINE', 140, 60);

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('OFFICIAL DIGITAL IDENTITY CARD • AI SOCIAL NETWORKING', 140, 92);

      // Status pill
      ctx.fillStyle = displayUser.verificationStatus === 'approved' ? '#10B981' : '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(790, 42, 170, 40, [20]);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        displayUser.verificationStatus === 'approved' ? 'VERIFIED ACTIVE' : 'PENDING APPROVAL',
        875,
        68
      );
      ctx.textAlign = 'left';

      // Avatar circle
      const avatarX = 140;
      const avatarY = 250;
      const avatarR = 85;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = selectedFrame === 'fire' ? '#EF4444' : selectedFrame === 'gold' ? '#F59E0B' : '#38BDF8';
      ctx.stroke();
      ctx.clip();

      if (displayUser.profilePic) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = displayUser.profilePic!;
        });
        ctx.drawImage(img, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
      } else {
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(displayUser.name?.charAt(0) || 'U', avatarX, avatarY + 22);
        ctx.textAlign = 'left';
      }
      ctx.restore();

      // User details (Respecting privacy settings!)
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('MEMBER NAME', 280, 180);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(displayUser.name || 'Member', 280, 220);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('OFFICIAL MEMBER ID', 280, 275);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 30px monospace';
      ctx.fillText(displayUser.memberId, 280, 312);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('JOINED PLAN', 280, 365);

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(displayUser.planName || 'Standard Service', 280, 395);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('SPONSOR ID', 280, 445);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(getMaskedSponsor(displayUser.sponsorId), 280, 475);

      // Contact Line with Masking
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      const phoneText = `Mobile: ${getMaskedPhone(displayUser.phone)}`;
      const upiText = `UPI: ${getMaskedPayment(displayUser.paymentAddress)}`;
      ctx.fillText(`${phoneText}  |  ${upiText}`, 280, 515);

      // QR Code on right
      if (qrDataUrl) {
        const qrImg = new Image();
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.onerror = resolve;
          qrImg.src = qrDataUrl;
        });
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(750, 170, 190, 230, [16]);
        ctx.fill();
        ctx.drawImage(qrImg, 765, 185, 160, 160);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN FOR REFERRAL', 845, 370);
        ctx.fillText('OR JOIN NOW', 845, 390);
        ctx.textAlign = 'left';
      }

      // Footer bar
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 540, 992, 76);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Helpline: newuserhelpline@gmail.com  •  Website: emo-platform.online  •  Authorized Digital ID', 60, 585);

      // Download trigger
      const link = document.createElement('a');
      link.download = `EMO_ID_CARD_${displayUser.memberId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download card error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // If user not logged in and no searched sponsor, render prompt & search box
  if (!displayUser) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-5 sm:p-7 text-center animate-in fade-in">
        <div className="flex justify-center mb-4">
          <EmoLogo variant="badge" size={64} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          डिजिटल पहचान पत्र (Digital ID Card)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          EMO डिजिटल आईडी कार्ड प्राप्त करने के लिए रजिस्ट्रेशन करें या अपने स्पॉन्सर का आईडी कार्ड देखने के लिए स्पॉन्सर आईडी दर्ज करें।
        </p>

        {/* Sponsor Search Form */}
        <form onSubmit={handleSearchSponsor} className="mt-5 text-left">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            स्पॉन्सर आईडी खोजें (जैसे EMO10ADMIN01)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="स्पॉन्सर आईडी डालें..."
              value={searchSponsorInput}
              onChange={(e) => setSearchSponsorInput(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95"
            >
              {isSearching ? 'खोज रहे...' : 'सर्च करें'}
            </button>
          </div>
          {searchError && (
            <p className="text-xs text-rose-600 font-semibold mt-1.5">{searchError}</p>
          )}
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-500 font-bold">या सीधे जुड़ें</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenRegister}
            className="py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            नया रजिस्ट्रेशन करें
          </button>
          <button
            onClick={onOpenLogin}
            className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            आईडी लॉगिन करें
          </button>
        </div>
      </div>
    );
  }

  // Helper for Frame CSS
  const getFrameEffectClass = () => {
    switch (selectedFrame) {
      case 'fire':
        return 'anim-fire-ring ring-4 ring-orange-500 shadow-[0_0_25px_rgba(239,68,68,0.8)]';
      case 'water':
        return 'anim-water-ripple ring-4 ring-cyan-400';
      case 'gold':
        return 'anim-gold-herd ring-4 ring-amber-400';
      case 'classic':
      default:
        return 'ring-4 ring-slate-300';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Top Banner Notice for Sponsor Card */}
      {!isActualOwner && (
        <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-3 mb-3 text-left flex items-start gap-2.5 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-900">
              यह आपके स्पॉन्सर <span className="underline">{displayUser.name}</span> का डिजिटल पहचान पत्र है।
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              सुरक्षा कारणों से केवल अपना व्यक्तिगत आईडी कार्ड ही डाउनलोड किया जा सकता है। आप इनके साथ अभी जुड़ सकते हैं।
            </p>
          </div>
        </div>
      )}

      {/* Frame Selector & Privacy Settings Toolbar (Only for Card Owner) */}
      {isActualOwner && (
        <div className="w-full bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-slate-200 mb-3 flex items-center justify-between gap-1 overflow-x-auto">
          {/* Frame selection */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setSelectedFrame('fire')}
              title="फायर रिंग फ्रेम"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                selectedFrame === 'fire'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              फायर
            </button>
            <button
              onClick={() => setSelectedFrame('water')}
              title="जल तरंग फ्रेम"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                selectedFrame === 'water'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-200" />
              जल
            </button>
            <button
              onClick={() => setSelectedFrame('gold')}
              title="गोल्डन हर्ड फ्रेम"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                selectedFrame === 'gold'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-200" />
              शाही
            </button>
          </div>

          {/* Privacy Settings Trigger Button */}
          <button
            onClick={() => setShowPrivacyPanel(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-xs active:scale-95 transition-all shrink-0 ml-auto"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>गोपनीयता सेटिंग्स</span>
            {(privacyToggles.hidePhone || privacyToggles.hidePayment || privacyToggles.hideEmail) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* 3D Flip Card Container */}
      <div
        className="w-full perspective-1000 select-none cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          ref={cardRef}
          className={`relative w-full aspect-[1.58/1] min-h-[265px] transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ==================== FRONT OF ID CARD ==================== */}
          <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 sm:p-5 flex flex-col justify-between">
            {/* Background Watermark Logo */}
            <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-10">
              <EmoLogo variant="badge" size={240} />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2.5">
              <EmoLogo variant="idcard" />
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    displayUser.verificationStatus === 'approved'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {displayUser.verificationStatus === 'approved' ? 'VERIFIED' : 'PENDING'}
                </span>
                {(privacyToggles.hidePhone || privacyToggles.hidePayment) && (
                  <span className="text-[9px] bg-slate-800 border border-emerald-400/50 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    PROTECTED
                  </span>
                )}
              </div>
            </div>

            {/* Middle Section: Avatar + Details */}
            <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 my-auto pt-1">
              {/* Profile Avatar with Dynamic 3D Frame */}
              <div className="relative shrink-0">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-800 transition-all duration-300 flex items-center justify-center ${getFrameEffectClass()}`}
                >
                  {displayUser.profilePic ? (
                    <img
                      src={displayUser.profilePic}
                      alt={displayUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl">
                      {displayUser.name?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                  )}
                </div>
                {/* Micro badge */}
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* User Identity Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                  {displayUser.name}
                </h3>

                {/* Member ID with Copy Button */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider font-mono">
                    {displayUser.memberId}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(displayUser.memberId);
                    }}
                    title="आईडी कॉपी करें"
                    className="p-1 rounded-md bg-white/10 hover:bg-white/25 active:scale-90 transition-all text-amber-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="mt-1 space-y-0.5 text-[11px] font-medium text-slate-300">
                  <p className="truncate">
                    <span className="text-slate-400">प्लान:</span>{' '}
                    <span className="font-bold text-emerald-400">{displayUser.planName || 'EMO Standard'}</span>
                  </p>
                  <p className="truncate">
                    <span className="text-slate-400">स्पॉन्सर:</span>{' '}
                    <span className="font-semibold text-white">{getMaskedSponsor(displayUser.sponsorId)}</span>
                  </p>
                  {/* Contact / UPI Info with Privacy Masking */}
                  <p className="truncate text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-2.5 h-2.5 text-slate-400 inline" />
                    <span>{getMaskedPhone(displayUser.phone)}</span>
                    <span className="mx-1">|</span>
                    <CreditCard className="w-2.5 h-2.5 text-slate-400 inline" />
                    <span>{getMaskedPayment(displayUser.paymentAddress)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Personal / Referral QR Code + Instructions */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2">
              <div className="flex items-center gap-2">
                {qrDataUrl && (
                  <div className="bg-white p-1 rounded-lg shrink-0 shadow-md">
                    <img src={qrDataUrl} alt="QR Code" className="w-11 h-11 object-contain" />
                  </div>
                )}
                <div className="leading-tight">
                  <p className="text-[10px] font-black text-amber-300 tracking-wide">
                    {isActualOwner ? 'रेफरल व अर्निंग QR' : 'स्पॉन्सर जॉइनिंग QR'}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    स्कैन करके सीधे जुड़ें
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-300 bg-white/10 px-2 py-1 rounded-lg">
                <RotateCw className="w-3 h-3 text-amber-300" />
                <span>पलटने के लिए टैप करें</span>
              </div>
            </div>
          </div>

          {/* ==================== BACK OF ID CARD ==================== */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-3.5 sm:p-5 flex flex-col justify-between">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                नियम व शर्तें एवं हेल्पलाइन (RULES & SUPPORT)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                EMO-OFFICIAL-AUTH
              </span>
            </div>

            {/* Rules and Information */}
            <div className="text-[10px] sm:text-[11px] text-slate-300 space-y-1.5 my-auto leading-relaxed">
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>यह डिजिटल कार्ड EMO सोशल नेटवर्किंग प्लेटफॉर्म के अधिकृत सदस्य की पहचान है।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>एडमिन वेरिफिकेशन के बाद ही रेफरल लिंक और डाउनलाइन अर्निंग एक्टिव होती है।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>गोपनीयता नीति: सदस्य के संपर्क व भुगतान विवरण इच्छानुसार सुरक्षित किए गए हैं।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>हेल्पलाइन: <span className="font-semibold text-white">newuserhelpline@gmail.com</span></span>
              </div>
            </div>

            {/* Bottom Bar: Barcode Mock & Back Tap */}
            <div className="border-t border-white/15 pt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5 h-6">
                  {[...Array(34)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full ${i % 3 === 0 ? 'w-1 bg-white' : i % 2 === 0 ? 'w-0.5 bg-slate-300' : 'w-1.5 bg-white'}`}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-slate-400 tracking-widest mt-0.5">
                  {displayUser.memberId}-VALID
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-300 bg-white/10 px-2 py-1 rounded-lg">
                <RotateCw className="w-3 h-3 text-blue-300" />
                <span>सामने देखें</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="w-full mt-4 flex flex-col gap-2.5">
        {isActualOwner ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'कार्ड डाउनलोड हो रहा है...' : 'प्रीमियम आईडी कार्ड डाउनलोड करें (PNG)'}
            </button>
            <button
              onClick={() => copyToClipboard(displayUser.memberId)}
              className="px-3.5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
              title="मेंबर आईडी कॉपी करें"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              कॉपी
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* If viewing sponsor card, show WhatsApp Contact Request and Register */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`नमस्ते, मैं EMO प्लेटफॉर्म में आपकी स्पॉन्सर आईडी ${displayUser.memberId} से जुड़ना चाहता हूँ।`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                व्हाट्सप्प रिक्वेस्ट भेजें
              </a>
              <button
                onClick={onOpenRegister}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                इनके साथ रजिस्टर करें
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center font-medium">
              🔒 सुरक्षा नीति: स्पॉन्सर का आईडी कार्ड डाउनलोड नहीं किया जा सकता।
            </p>
          </div>
        )}
      </div>

      {/* ==================== PRIVACY SETTINGS PANEL MODAL ==================== */}
      {showPrivacyPanel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col border border-slate-200">
            {/* Panel Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-4 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-300" />
                <h3 className="font-black text-sm">आईडी कार्ड गोपनीयता सेटिंग्स</h3>
              </div>
              <button
                onClick={() => setShowPrivacyPanel(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-4 sm:p-5 space-y-3.5">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                चुनें कि आपके सार्वजनिक डिजिटल आईडी कार्ड और डाउनलोड कॉपी पर कौन सी जानकारी दिखेगी और कौन सी छुपाई जाएगी:
              </p>

              {privacySuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{privacySuccessMsg}</span>
                </div>
              )}

              {/* Toggle 1: Mobile Number */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">मोबाइल नंबर छुपाएं</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {privacyToggles.hidePhone
                        ? `कार्ड पर दिखेगा: ${getMaskedPhone(displayUser.phone)}`
                        : `कार्ड पर पूरा नंबर दिखेगा: ${displayUser.phone}`}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacyToggles.hidePhone}
                  onChange={(e) =>
                    setPrivacyToggles((prev) => ({ ...prev, hidePhone: e.target.checked }))
                  }
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 2: UPI / Payment Address */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">UPI / पेमेंट पता छुपाएं</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {privacyToggles.hidePayment
                        ? `कार्ड पर दिखेगा: ${getMaskedPayment(displayUser.paymentAddress)}`
                        : `कार्ड पर पूरा UPI पता दिखेगा: ${displayUser.paymentAddress}`}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacyToggles.hidePayment}
                  onChange={(e) =>
                    setPrivacyToggles((prev) => ({ ...prev, hidePayment: e.target.checked }))
                  }
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 3: Email Address */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">ईमेल पता मास्क करें</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {privacyToggles.hideEmail
                        ? `मास्क दिखेगा: ${getMaskedEmail(displayUser.email)}`
                        : `पूरा ईमेल दिखेगा: ${displayUser.email}`}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacyToggles.hideEmail}
                  onChange={(e) =>
                    setPrivacyToggles((prev) => ({ ...prev, hideEmail: e.target.checked }))
                  }
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 4: Sponsor ID */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">स्पॉन्सर विवरण मास्क करें</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {privacyToggles.hideSponsor
                        ? `मास्क दिखेगा: ${getMaskedSponsor(displayUser.sponsorId)}`
                        : `पूरा स्पॉन्सर आईडी दिखेगा: ${displayUser.sponsorId}`}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacyToggles.hideSponsor}
                  onChange={(e) =>
                    setPrivacyToggles((prev) => ({ ...prev, hideSponsor: e.target.checked }))
                  }
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPrivacyPanel(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                रद्द करें
              </button>
              <button
                type="button"
                disabled={isSavingPrivacy}
                onClick={handleSavePrivacySettings}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSavingPrivacy ? 'सहेज रहे हैं...' : 'सेटिंग्स लागू करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
