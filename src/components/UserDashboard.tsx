import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Users,
  Edit3,
  MessageSquare,
  QrCode,
  Flame,
  Droplets,
  Crown,
  LogOut,
  Send,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  X,
  CreditCard,
  Smartphone,
  Laptop,
  Monitor,
  ShieldAlert,
  ArrowUpRight,
  Gift,
  Zap,
  ChevronRight,
  BadgeCheck,
  SmartphoneNfc,
  RefreshCw,
} from 'lucide-react';
import { User, ReferralMember, ChatMessage, DeviceSession } from '../types';
import { AvatarCropper } from './AvatarCropper';
import { EmoLogo } from './EmoLogo';

interface UserDashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onOpenIdCard: () => void;
  onOpenPromotionKit: () => void;
  telegramLink: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenIdCard,
  onOpenPromotionKit,
  telegramLink,
}) => {
  const [activeTab, setActiveTab] = useState<'pay_overview' | 'team' | 'devices' | 'chat'>('pay_overview');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Team data from backend
  const [referralsData, setReferralsData] = useState<{
    stats: {
      totalTeam: number;
      directCount: number;
      level2Count: number;
      level3Count: number;
      approvedDirectCount: number;
      earningsEstimate: number;
    };
    directMembers: ReferralMember[];
    level2Members: ReferralMember[];
    level3Members: ReferralMember[];
  } | null>(null);

  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false);

  // Chat with admin
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Multi-Device Security State
  const [isRevokingDevice, setIsRevokingDevice] = useState<boolean>(false);
  const [deviceSuccessMsg, setDeviceSuccessMsg] = useState<string>('');

  // Profile Edit modal
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user.name);
  const [editEmail, setEditEmail] = useState<string>(user.email);
  const [editPhone, setEditPhone] = useState<string>(user.phone);
  const [editPayment, setEditPayment] = useState<string>(user.paymentAddress);
  const [editFrame, setEditFrame] = useState<'fire' | 'water' | 'gold' | 'classic'>(
    user.avatarFrame || 'fire'
  );
  const [editPrivacy, setEditPrivacy] = useState(
    user.privacySettings || { hidePhone: false, hidePayment: false, hideEmail: false, hideSponsor: false }
  );
  const [showAvatarCropper, setShowAvatarCropper] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string>('');

  const referralUrl = `${window.location.origin}?ref=${user.memberId}`;

  // Fetch Referral Team data
  const fetchTeam = async () => {
    setIsLoadingTeam(true);
    try {
      const res = await fetch(`/api/user/referrals/${user.memberId}`);
      const data = await res.json();
      if (data.success) {
        setReferralsData(data);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  // Fetch Chat messages
  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/chat/${user.memberId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        setChatMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  useEffect(() => {
    fetchTeam();
    fetchChat();
  }, [user.memberId]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyMemberId = () => {
    navigator.clipboard.writeText(user.memberId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Send message in private admin chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsSendingChat(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: user.memberId,
          sender: 'user',
          text: chatInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages((prev) => [...prev, data.message]);
        setChatInput('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Revoke device session (Multi-device logout)
  const handleRevokeDevice = async (deviceId?: string, revokeAllOthers = false) => {
    setIsRevokingDevice(true);
    setDeviceSuccessMsg('');
    try {
      const res = await fetch('/api/user/devices/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: user.memberId,
          deviceId,
          revokeAllOthers,
        }),
      });
      const data = await res.json();
      if (data.success && data.activeDevices) {
        onUpdateUser({ ...user, activeDevices: data.activeDevices });
        setDeviceSuccessMsg(
          revokeAllOthers
            ? 'अन्य सभी डिवाइस से सफलतापूर्वक लॉगआउट कर दिया गया!'
            : 'डिवाइस सेशन समाप्त कर दिया गया।'
        );
        setTimeout(() => setDeviceSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error('Error revoking device:', err);
    } finally {
      setIsRevokingDevice(false);
    }
  };

  // Save profile edits (immutable Member ID and Sponsor ID)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');

    try {
      const res = await fetch(`/api/user/profile/${user.memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          paymentAddress: editPayment.trim(),
          avatarFrame: editFrame,
          privacySettings: editPrivacy,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onUpdateUser(data.user);
        setProfileSuccessMsg('प्रोफ़ाइल और गोपनीयता सेटिंग्स सफलतापूर्वक अपडेट हो गईं!');
        setTimeout(() => {
          setIsEditingProfile(false);
          setProfileSuccessMsg('');
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Helper for 3D Frame
  const getFrameCss = () => {
    switch (user.avatarFrame || 'fire') {
      case 'fire':
        return 'anim-fire-ring ring-4 ring-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]';
      case 'water':
        return 'anim-water-ripple ring-4 ring-cyan-400';
      case 'gold':
        return 'anim-gold-herd ring-4 ring-amber-400';
      default:
        return 'ring-4 ring-slate-300';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-3 sm:py-6 px-2.5 sm:px-6">
      {/* ==================== AMAZON PAY STYLE FINTECH HEADER ==================== */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden border border-blue-900/60">
        {/* Subtle Watermark */}
        <div className="absolute -right-6 -bottom-6 opacity-8 pointer-events-none">
          <EmoLogo variant="badge" size={220} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User info */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center transition-all ${getFrameCss()}`}
              >
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 font-black text-2xl text-white">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarCropper(true)}
                title="फोटो बदलें"
                className="absolute bottom-0 right-0 p-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full shadow-md active:scale-90 transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Amazon Pay Style
                </span>
                {user.verificationStatus === 'approved' ? (
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <BadgeCheck className="w-3 h-3" />
                    VERIFIED KYC
                  </span>
                ) : (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3" />
                    KYC UNDER REVIEW
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {user.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {user.memberId}
                  </span>
                  <button
                    onClick={copyMemberId}
                    className="p-0.5 text-amber-200 hover:text-white"
                    title="आईडी कॉपी करें"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-xs text-blue-200">
                  {user.planName} (₹{user.planAmount})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
            <button
              onClick={onOpenIdCard}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-xs font-black shadow-md active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>3D डिजिटल आईडी</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-300" />
              <span>एडिट</span>
            </button>
            <button
              onClick={onLogout}
              title="लॉगआउट"
              className="p-2 bg-rose-500/80 hover:bg-rose-600 rounded-xl text-white transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================== AMAZON PAY EARNINGS WALLET CARD ==================== */}
        <div className="mt-5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-2xl p-4 sm:p-5 text-slate-950 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-300">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                EMO PAY WALLET
              </span>
              <span className="text-xs font-bold text-slate-900">
                कुल अनुमानित अर्निंग्स (Total Rewards)
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                ₹{referralsData?.stats.earningsEstimate || 0}
              </span>
              <span className="text-xs font-bold text-slate-800">
                ({referralsData?.stats.approvedDirectCount || 0} सत्यापित डाउनलाइन)
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-900 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
              <span>
                डायरेक्ट पेआउट पता: <strong className="font-mono">{user.paymentAddress}</strong>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenPromotionKit}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>इनवाइट & रिवार्ड्स</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== AMAZON PAY STYLE 8 QUICK ACTION TILES ==================== */}
      <div className="mt-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          क्विक सर्विसेज व अर्निंग डैशबोर्ड (Quick Actions)
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 text-center">
          {/* Tile 1: 3D ID Card */}
          <button
            onClick={onOpenIdCard}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6 text-amber-300" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              आईडी कार्ड
            </span>
          </button>

          {/* Tile 2: Refer & Earn */}
          <button
            onClick={onOpenPromotionKit}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-amber-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              रेफरल किट
            </span>
          </button>

          {/* Tile 3: Team Downlines */}
          <button
            onClick={() => setActiveTab('team')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-emerald-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              मेरी टीम ({referralsData?.stats.totalTeam || 0})
            </span>
          </button>

          {/* Tile 4: Multi-Device Security */}
          <button
            onClick={() => setActiveTab('devices')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-sky-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform relative">
              <SmartphoneNfc className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-emerald-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {user.activeDevices?.length || 1}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              मल्टी-डिवाइस
            </span>
          </button>

          {/* Tile 5: Live Help Chat */}
          <button
            onClick={() => setActiveTab('chat')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-violet-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              हेल्प चैट
            </span>
          </button>

          {/* Tile 6: Edit Profile */}
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-100 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              प्रोफाइल
            </span>
          </button>

          {/* Tile 7: Telegram Group */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-sky-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Send className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              टेलीग्राम
            </span>
          </a>

          {/* Tile 8: Copy Referral */}
          <button
            onClick={copyReferralLink}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-emerald-50/70 transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              {copiedLink ? <Check className="w-6 h-6 text-amber-300" /> : <Share2 className="w-6 h-6 text-white" />}
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              {copiedLink ? 'कॉपी हो गया' : 'शेयर लिंक'}
            </span>
          </button>
        </div>
      </div>

      {/* Verification Notice Banner */}
      {!user.canShareReferral && (
        <div className="mt-4 bg-amber-50 border border-amber-300 rounded-2xl p-4 text-left flex items-start gap-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-900">
              पेमेंट सत्यापन प्रक्रियाधीन (Verification Under Process)
            </p>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              एडमिन द्वारा आपके पेमेंट स्क्रीनशॉट की जांच की जा रही है।{' '}
              <strong className="text-amber-950">
                एडमिन द्वारा वेरीफाई व अप्रूव होने के बाद ही आपका रेफरल लिंक एक्टिवेट होगा
              </strong>{' '}
              और आप डाउनलाइन कमीशन प्राप्त कर सकेंगे।
            </p>
          </div>
        </div>
      )}

      {/* ==================== SUB-TABS (Overview, Team, Multi-Device, Chat) ==================== */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pay_overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'pay_overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          अर्निंग व रेफरल सिस्टम
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'team'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          मेरी टीम (टीम लिस्ट)
          {referralsData?.stats.totalTeam ? (
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {referralsData.stats.totalTeam}
            </span>
          ) : null}
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'devices'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          मल्टी-डिवाइस सुरक्षा
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
            {user.activeDevices?.length || 1}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          सपोर्ट चैट
          {chatMessages.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {chatMessages.length}
            </span>
          )}
        </button>
      </div>

      {/* ==================== TAB 1: PAY OVERVIEW & REFERRAL ==================== */}
      {activeTab === 'pay_overview' && (
        <div className="mt-4 space-y-4">
          {/* Earnings Breakdown Ledger Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">कुल टीम सदस्य</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {referralsData?.stats.totalTeam || 0}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                सत्यापित: {referralsData?.stats.approvedDirectCount || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">लेवल 1 डायरेक्ट</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {referralsData?.stats.directCount || 0}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">प्रत्यक्ष रेफरल</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">लेवल 2 व 3 टीम</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">
                {(referralsData?.stats.level2Count || 0) + (referralsData?.stats.level3Count || 0)}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">फास्ट इनकम डाउनलाइन</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">भुगतान गंतव्य</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1 truncate">
                {user.paymentAddress}
              </p>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                सक्रिय UPI खाता
              </p>
            </div>
          </div>

          {/* Referral Link & Social Sharing */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  आपका व्यक्तिगत रेफरल लिंक (INVITE & EARN)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  दोस्तों को अपने लिंक से जॉइन करवाएं और प्रत्येक मेंबर पर सीधी कमाई पाएं।
                </p>
              </div>

              <button
                onClick={onOpenPromotionKit}
                className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                प्रमोशन किट व पोस्टर
              </button>
            </div>

            {user.canShareReferral ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm font-bold text-slate-800 select-all focus:outline-hidden"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🚨🚨 आ गया घर बैठे ऑनलाइन कमाई करने का सबसे आसान तरीका (EMO)! EMO NORMAL & FAST INCOME SERVICE से अभी जुड़ें। मेरा स्पॉन्सर आईडी है: ${user.memberId}। इस लिंक से अभी रजिस्टर करें: ${referralUrl}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    व्हाट्सप्प पर शेयर करें
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(
                      `EMO Earn Money Online! जॉइनिंग हेतु स्पॉन्सर आईडी: ${user.memberId}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    टेलीग्राम पर भेजें
                  </a>

                  <button
                    onClick={onOpenIdCard}
                    className="col-span-2 sm:col-span-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    कार्ड QR शेयर करें
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 text-center">
                <Lock className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-800">
                  रेफरल लिंक अभी लॉक है (Locked)
                </p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-md mx-auto">
                  जैसे ही एडमिन आपके पेमेंट स्क्रीनशॉट को वेरीफाई करेंगे, आपका रेफरल लिंक एक्टिव हो जाएगा और आप असीमित कमाई कर सकेंगे।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: TEAM MEMBERS (PRIVACY MASKED) ==================== */}
      {activeTab === 'team' && (
        <div className="mt-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                मेरी डाउनलाइन टीम (रेफरल सदस्य)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                🔒 पूर्ण गोपनीयता: केवल आईडी, नाम, जॉइनिंग तारीख व प्लान प्रदर्शित (संपर्क जानकारी सुरक्षित)
              </p>
            </div>
            <button
              onClick={fetchTeam}
              className="text-xs font-bold text-blue-600 hover:underline px-2 py-1"
            >
              रिफ्रेश करें
            </button>
          </div>

          {isLoadingTeam ? (
            <div className="py-8 text-center text-xs text-slate-500 font-semibold">
              टीम जानकारी लोड हो रही है...
            </div>
          ) : !referralsData || referralsData.directMembers.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">अभी तक कोई डाउनलाइन सदस्य नहीं जुड़ा है</p>
              <p className="text-xs text-slate-500 mt-1">
                अपना रेफरल लिंक दोस्तों के साथ साझा करें और कमाई की शुरुआत करें!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">लेवल</th>
                    <th className="py-2.5 px-3">मेंबर आईडी</th>
                    <th className="py-2.5 px-3">सदस्य का नाम</th>
                    <th className="py-2.5 px-3">प्लान</th>
                    <th className="py-2.5 px-3">जॉइनिंग तारीख</th>
                    <th className="py-2.5 px-3">स्टेटस</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    ...referralsData.directMembers,
                    ...(referralsData.level2Members || []),
                    ...(referralsData.level3Members || []),
                  ].map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                          L{m.level}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {m.memberId}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {m.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {m.planName}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {new Date(m.joiningDate).toLocaleDateString('hi-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3">
                        {m.status === 'approved' ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            VERIFIED
                          </span>
                        ) : (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            PENDING
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: MULTI-DEVICE LOGIN SECURITY ==================== */}
      {activeTab === 'devices' && (
        <div className="mt-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                मल्टी-डिवाइस सुरक्षित लॉगिन (Multi-Device Security)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                आप एक ही अकाउंट से अपने मोबाइल, लैपटॉप या टैबलेट में एक साथ सुरक्षित लॉगिन कर सकते हैं।
              </p>
            </div>

            <button
              onClick={() => handleRevokeDevice(undefined, true)}
              disabled={isRevokingDevice || (user.activeDevices?.length || 0) <= 1}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>अन्य सभी डिवाइस से लॉगआउट करें</span>
            </button>
          </div>

          {deviceSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{deviceSuccessMsg}</span>
            </div>
          )}

          {/* Device Sessions List */}
          <div className="space-y-3">
            {(user.activeDevices && user.activeDevices.length > 0
              ? user.activeDevices
              : [
                  {
                    deviceId: 'dev-curr',
                    deviceName: 'वर्तमान मोबाइल डिवाइस (Current Phone)',
                    deviceType: 'mobile',
                    browser: 'Chrome Mobile',
                    os: 'Android / iOS',
                    lastActive: new Date().toISOString(),
                    isCurrent: true,
                  },
                ]
            ).map((dev, i) => {
              const isCurrent = i === 0 || dev.isCurrent;
              return (
                <div
                  key={dev.deviceId || i}
                  className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {dev.deviceType === 'desktop' ? (
                        <Laptop className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {dev.deviceName || 'Authorized Device'}
                        </p>
                        {isCurrent && (
                          <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            यह डिवाइस (ACTIVE NOW)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {dev.browser} • {dev.os} • अंतिम सक्रिय:{' '}
                        {new Date(dev.lastActive).toLocaleDateString('hi-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => handleRevokeDevice(dev.deviceId)}
                      disabled={isRevokingDevice}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-rose-600 hover:border-rose-300 text-xs font-bold rounded-xl transition-all"
                    >
                      लॉगआउट
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            🔒 <strong>क्लाउड मल्टी-डिवाइस सुरक्षा:</strong> आपका डेटा किसी भी डिवाइस पर सुरक्षित रहता है। यदि आपने किसी अन्य फोन या कंप्यूटर पर अपना अकाउंट खोला था, तो आप यहां से एक क्लिक में उसे समाप्त कर सकते हैं।
          </div>
        </div>
      )}

      {/* ==================== TAB 4: CHAT WITH ADMIN / SUPPORT DESK ==================== */}
      {activeTab === 'chat' && (
        <div className="mt-4 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[480px]">
          <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-black text-xs sm:text-sm">
                EMO आधिकारिक सपोर्ट डेस्क (Official Support)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              newuserhelpline@gmail.com
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-semibold">एडमिन को कोई भी प्रश्न या समस्या पूछें</p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isAdmin
                          ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                          : 'bg-blue-600 text-white rounded-tr-xs'
                      }`}
                    >
                      {isAdmin && (
                        <p className="text-[10px] font-black text-blue-600 mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          EMO एडमिन (Official)
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="mt-2 rounded-xl max-h-48 object-cover border border-slate-200"
                        />
                      )}
                      {msg.linkUrl && (
                        <a
                          href={msg.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] underline font-bold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {msg.linkUrl}
                        </a>
                      )}
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          isAdmin ? 'text-slate-400' : 'text-blue-200'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="सपोर्ट के लिए संदेश लिखें..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isSendingChat || !chatInput.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>भेजें</span>
            </button>
          </form>
        </div>
      )}

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200 animate-in fade-in">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">प्रोफ़ाइल जानकारी व गोपनीयता एडिट करें</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 overflow-y-auto max-h-[80vh] space-y-3.5">
              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {/* Locked Member ID & Sponsor ID Notice */}
              <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    मेंबर आईडी (स्थायी / लॉक):
                  </span>
                  <span className="font-mono font-black text-blue-700">{user.memberId}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    स्पॉन्सर आईडी (स्थायी / लॉक):
                  </span>
                  <span className="font-mono font-bold text-slate-800">{user.sponsorId}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ईमेल</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कमाई प्राप्त करने का UPI / बैंक पता
                </label>
                <input
                  type="text"
                  required
                  value={editPayment}
                  onChange={(e) => setEditPayment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* 3D Frame Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आईडी कार्ड 3D फ्रेम चुनें
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditFrame('fire')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      editFrame === 'fire'
                        ? 'bg-red-500 text-white border-red-600 shadow-md'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Fire Ring
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFrame('water')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      editFrame === 'water'
                        ? 'bg-cyan-500 text-white border-cyan-600 shadow-md'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    Water
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFrame('gold')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      editFrame === 'gold'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Gold
                  </button>
                </div>
              </div>

              {/* Privacy Toggles */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  गोपनीयता सेटिंग्स (Privacy Controls)
                </span>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                  <span>स्पॉन्सर / सार्वजनिक कार्ड पर मोबाइल नंबर छुपाएं</span>
                  <input
                    type="checkbox"
                    checked={editPrivacy.hidePhone}
                    onChange={(e) =>
                      setEditPrivacy((p) => ({ ...p, hidePhone: e.target.checked }))
                    }
                    className="accent-blue-600 w-4 h-4 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                  <span>मेरा पेमेंट / UPI पता सार्वजनिक न करें</span>
                  <input
                    type="checkbox"
                    checked={editPrivacy.hidePayment}
                    onChange={(e) =>
                      setEditPrivacy((p) => ({ ...p, hidePayment: e.target.checked }))
                    }
                    className="accent-blue-600 w-4 h-4 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                  <span>ईमेल पता सार्वजनिक न करें</span>
                  <input
                    type="checkbox"
                    checked={editPrivacy.hideEmail}
                    onChange={(e) =>
                      setEditPrivacy((p) => ({ ...p, hideEmail: e.target.checked }))
                    }
                    className="accent-blue-600 w-4 h-4 rounded"
                  />
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {isSavingProfile ? 'सहेज रहे हैं...' : 'बदलाव सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Photo Cropper Modal Overlay */}
      {showAvatarCropper && (
        <AvatarCropper
          initialImage={user.profilePic}
          onCropComplete={async (dataUrl) => {
            try {
              const res = await fetch(`/api/user/profile/${user.memberId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profilePic: dataUrl }),
              });
              const data = await res.json();
              if (data.success && data.user) {
                onUpdateUser(data.user);
              }
            } catch (err) {
              console.error('Error saving avatar:', err);
            } finally {
              setShowAvatarCropper(false);
            }
          }}
          onCancel={() => setShowAvatarCropper(false)}
        />
      )}
    </div>
  );
};
