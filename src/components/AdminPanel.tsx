import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  MessageSquare,
  Send,
  ExternalLink,
  Users,
  CreditCard,
  QrCode,
  Image as ImageIcon,
  Lock,
  Plus,
  Trash2,
  Save,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
import { User, SystemSettings } from '../types';
import { EmoLogo } from './EmoLogo';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  systemSettings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  systemSettings,
  onUpdateSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState<boolean>(false);

  // Users list & filters
  const [users, setUsers] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // 360 User Inspector Modal
  const [selectedUserAudit, setSelectedUserAudit] = useState<{
    user: User;
    sponsor: any;
    referralsCount: number;
    approvedReferralsCount: number;
  } | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);

  // Screenshot viewer modal
  const [viewScreenshotUrl, setViewScreenshotUrl] = useState<string | null>(null);

  // Admin CMS Settings Tab
  const [adminActiveTab, setAdminActiveTab] = useState<'users' | 'settings' | 'broadcast'>('users');
  const [settingsForm, setSettingsForm] = useState<SystemSettings>(systemSettings);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string>('');

  // Admin Direct Message
  const [targetMemberId, setTargetMemberId] = useState<string>('');
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [broadcastLink, setBroadcastLink] = useState<string>('');
  const [isSendingMsg, setIsSendingMsg] = useState<boolean>(false);
  const [msgSuccess, setMsgSuccess] = useState<string>('');

  // Rejection modal
  const [rejectingUser, setRejectingUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  if (!isOpen) return null;

  // Handle Admin Password Verification
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsVerifyingPassword(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setAdminPasswordInput('');
        fetchAdminUsers();
      } else {
        // Strict security: Never expose password in error!
        setLoginError('गलत पासवर्ड! कृपया सही एडमिन सुरक्षा पासवर्ड दर्ज करें।');
      }
    } catch (err) {
      setLoginError('सर्वर से संपर्क करने में समस्या आई।');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // Fetch Users
  const fetchAdminUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Approve or Reject User
  const handleVerifyUser = async (memberId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const res = await fetch(`/api/admin/user/${memberId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.memberId === memberId ? data.user : u))
        );
        if (selectedUserAudit && selectedUserAudit.user.memberId === memberId) {
          setSelectedUserAudit((prev) => prev ? { ...prev, user: data.user } : null);
        }
        setRejectingUser(null);
        setRejectReason('');
      }
    } catch (err) {
      alert('स्टेटस अपडेट करने में समस्या आई।');
    }
  };

  // Open 360 User Audit
  const handleOpen360Audit = async (memberId: string) => {
    setIsLoadingAudit(true);
    setInspectModalOpen(true);
    try {
      const res = await fetch(`/api/admin/user-audit/${memberId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedUserAudit(data);
      }
    } catch (err) {
      console.error('Error fetching audit:', err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  // Save System Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        onUpdateSettings(data.settings);
        setSettingsSuccess('सभी सेटिंग्स सफलतापूर्वक अपडेट हो गईं!');
        setTimeout(() => setSettingsSuccess(''), 2500);
      }
    } catch (err) {
      alert('सेटिंग्स सहेजने में समस्या आई।');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Send Direct Message from Admin to User
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMemberId.trim() || !broadcastText.trim()) return;

    setIsSendingMsg(true);
    setMsgSuccess('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: targetMemberId.trim().toUpperCase(),
          sender: 'admin',
          text: broadcastText.trim(),
          linkUrl: broadcastLink.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsgSuccess(`संदेश सदस्य ${targetMemberId.toUpperCase()} के डैशबोर्ड पर सफलतापूर्वक भेजा गया!`);
        setBroadcastText('');
        setBroadcastLink('');
        setTimeout(() => setMsgSuccess(''), 3000);
      }
    } catch (err) {
      alert('संदेश भेजने में त्रुटि आई।');
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesStatus = filterStatus === 'all' || u.verificationStatus === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.memberId.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.sponsorId.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden flex flex-col border border-slate-300 max-h-[94vh] animate-in fade-in">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <EmoLogo variant="badge" size={36} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg leading-tight text-white">
                  EMO एडमिन कंट्रोल सेंटर (Admin Panel)
                </h2>
                <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MASTER SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                सदस्य सत्यापन, 360° ऑडिट एवं प्लेटफॉर्म प्रबंधन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In View - Masked Security Password Prompt */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full my-auto text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-700 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900">सुरक्षित एडमिन प्रमाणीकरण</h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              एडमिन पैनल में प्रवेश करने के लिए सुरक्षा पासवर्ड दर्ज करें।
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  एडमिन सुरक्षा पासवर्ड (Masked)
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold tracking-widest focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingPassword}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
              >
                {isVerifyingPassword ? 'जांच की जा रही है...' : 'एडमिन लॉगिन करें'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setAdminActiveTab('users')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    adminActiveTab === 'users'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  सदस्य सत्यापन व सूची ({users.length})
                </button>
                <button
                  onClick={() => setAdminActiveTab('settings')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    adminActiveTab === 'settings'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  प्लेटफॉर्म सेटिंग्स व हेल्प CMS
                </button>
                <button
                  onClick={() => setAdminActiveTab('broadcast')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    adminActiveTab === 'broadcast'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  डायरेक्ट यूजर मेसेजिंग
                </button>
              </div>

              <button
                onClick={fetchAdminUsers}
                title="रिफ्रेश"
                className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* TAB 1: USERS LIST & VERIFICATION */}
            {adminActiveTab === 'users' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 shrink-0">
                  {/* Status Filter Badges */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        filterStatus === 'all'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      सभी ({users.length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('pending')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        filterStatus === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      पेंडिंग (
                      {users.filter((u) => u.verificationStatus === 'pending').length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('approved')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        filterStatus === 'approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      वेरिफाइड (
                      {users.filter((u) => u.verificationStatus === 'approved').length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('rejected')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        filterStatus === 'rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      रिजेक्टेड (
                      {users.filter((u) => u.verificationStatus === 'rejected').length})
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="आईडी, नाम या मोबाइल खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
                  {isLoadingUsers ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-semibold">
                      यूजर डेटा लोड हो रहा है...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-semibold">
                      कोई यूजर नहीं मिला।
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 uppercase font-black text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">यूजर व आईडी</th>
                          <th className="py-2.5 px-3">प्लान / राशि</th>
                          <th className="py-2.5 px-3">स्पॉन्सर विवरण</th>
                          <th className="py-2.5 px-3">पेमेंट पता</th>
                          <th className="py-2.5 px-3">स्क्रीनशॉट</th>
                          <th className="py-2.5 px-3">स्टेटस</th>
                          <th className="py-2.5 px-3 text-center">एक्शन / 360°</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredUsers.map((u) => (
                          <tr key={u.memberId} className="hover:bg-blue-50/40 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                                  {u.profilePic ? (
                                    <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    u.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                                  <p className="font-mono text-[10px] text-blue-700 font-black">{u.memberId}</p>
                                  <p className="text-[10px] text-slate-400">{u.phone}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3">
                              <p className="font-bold text-slate-800">₹{u.planAmount}</p>
                              <p className="text-[10px] text-slate-500 leading-none">{u.planName}</p>
                            </td>

                            <td className="py-2.5 px-3">
                              <p className="font-mono font-bold text-slate-900">{u.sponsorId}</p>
                              <p className="text-[10px] text-slate-500 leading-none">{u.sponsorName}</p>
                            </td>

                            <td className="py-2.5 px-3">
                              <p className="font-mono text-xs font-semibold text-slate-700 truncate max-w-[130px]">
                                {u.paymentAddress}
                              </p>
                              <p className="text-[9px] text-slate-400">
                                {u.accountHolderType === 'parent' ? 'माता-पिता' : 'स्वयं'}
                              </p>
                            </td>

                            <td className="py-2.5 px-3">
                              {u.paymentScreenshot ? (
                                <button
                                  type="button"
                                  onClick={() => setViewScreenshotUrl(u.paymentScreenshot!)}
                                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200"
                                >
                                  <ImageIcon className="w-3 h-3" />
                                  देखें
                                </button>
                              ) : (
                                <span className="text-[10px] text-rose-500 font-bold">अनुपलब्ध</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              {u.verificationStatus === 'approved' ? (
                                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  VERIFIED
                                </span>
                              ) : u.verificationStatus === 'rejected' ? (
                                <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <X className="w-3 h-3" />
                                  REJECTED
                                </span>
                              ) : (
                                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  PENDING
                                </span>
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {u.verificationStatus !== 'approved' && (
                                  <button
                                    onClick={() => handleVerifyUser(u.memberId, 'approve')}
                                    title="वेरीफाई व अप्रूव करें"
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {u.verificationStatus !== 'rejected' && (
                                  <button
                                    onClick={() => setRejectingUser(u)}
                                    title="रिजेक्ट करें"
                                    className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all shadow-xs"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpen360Audit(u.memberId)}
                                  title="360° यूजर प्रोफाइल और इतिहास"
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-all"
                                >
                                  360° ऑडिट
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SYSTEM CMS & HELPLINE SETTINGS */}
            {adminActiveTab === 'settings' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {settingsSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{settingsSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  {/* Helpline & Social Controls */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      हेल्पलाइन एवं संपर्क बटन सेटिंग्स (HELPLINE & SUPPORT CMS)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          आधिकारिक हेल्पलाइन ईमेल:
                        </label>
                        <input
                          type="email"
                          required
                          value={settingsForm.helplineEmail}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, helplineEmail: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          टेलीग्राम सपोर्ट चैनल / लिंक:
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.telegramChannel}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, telegramChannel: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Toggle Control as user requested */}
                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.showWhatsApp}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, showWhatsApp: e.target.checked })
                            }
                            className="w-4 h-4 accent-emerald-600 rounded"
                          />
                          <span>वेबसाइट पर WhatsApp बटन सक्रिय करें (Toggle WhatsApp Button)</span>
                        </label>
                        <p className="text-[11px] text-slate-500">
                          (यूजर निर्देश: डिफ़ॉल्ट रूप से बंद रखें, केवल एडमिन अनुमति पर ही सक्रिय करें)
                        </p>
                      </div>

                      {settingsForm.showWhatsApp && (
                        <div className="sm:w-60">
                          <input
                            type="tel"
                            placeholder="WhatsApp नंबर (उदा. 8877490845)"
                            value={settingsForm.whatsAppNumber}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, whatsAppNumber: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment UPI Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      भुगतान प्राप्तकर्ता UPI विवरण (PAYMENT UPI SETTINGS)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ऑफिशियल UPI आईडी:
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.upiId}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, upiId: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          प्राप्तकर्ता नाम (Account Name):
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.upiName}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, upiName: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Announcement Marquee Setting */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      लाइव अनाउंसमेंट टेक्स्ट (ANNOUNCEMENT TICKER)
                    </h4>
                    <textarea
                      rows={2}
                      value={settingsForm.announcementText}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500">
                      यह टेक्स्ट मुख्य पेज के शीर्ष पर धीमी गति से स्क्रॉल होता रहेगा।
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSettings ? 'सहेज रहे हैं...' : 'सेटिंग्स सहेजें'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: DIRECT USER MESSAGING */}
            {adminActiveTab === 'broadcast' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-w-xl">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    डायरेक्ट प्राइवेट संदेश भेजें (Direct Messaging)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    किसी भी पंजीकृत सदस्य के डैशबोर्ड में आधिकारिक संदेश, लिंक अथवा सूचना भेजें।
                  </p>
                </div>

                {msgSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{msgSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSendAdminMessage} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      टारगेट मेंबर आईडी (जैसे EMO10RK01):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="मेंबर आईडी दर्ज करें"
                      value={targetMemberId}
                      onChange={(e) => setTargetMemberId(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      संदेश टेक्स्ट:
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="सदस्य को भेजा जाने वाला संदेश लिखें..."
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      लिंक URL (ऐच्छिक):
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={broadcastLink}
                      onChange={(e) => setBroadcastLink(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingMsg}
                    className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingMsg ? 'भेज रहे हैं...' : 'संदेश भेजें'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 360° USER AUDIT INSPECTOR MODAL */}
      {inspectModalOpen && selectedUserAudit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-300 max-h-[90vh] animate-in zoom-in-95">
            <div className="bg-slate-900 px-5 py-3.5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">
                  360° पूर्ण विवरण: {selectedUserAudit.user.name} ({selectedUserAudit.user.memberId})
                </h3>
              </div>
              <button
                onClick={() => setInspectModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Profile Card Summary */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-base font-black text-slate-900">{selectedUserAudit.user.name}</p>
                  <p className="font-mono text-xs font-bold text-blue-700">{selectedUserAudit.user.memberId}</p>
                  <p className="text-slate-600 mt-1">
                    ईमेल: {selectedUserAudit.user.email} | मोबाइल: {selectedUserAudit.user.phone}
                  </p>
                  <p className="text-slate-600">
                    पेमेंट पता: <span className="font-mono font-bold">{selectedUserAudit.user.paymentAddress}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      selectedUserAudit.user.verificationStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedUserAudit.user.verificationStatus === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedUserAudit.user.verificationStatus}
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    डाउनलाइन: {selectedUserAudit.referralsCount} सदस्य (वेरिफाइड: {selectedUserAudit.approvedReferralsCount})
                  </p>
                </div>
              </div>

              {/* Side-by-side: Original Registration vs Current Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase mb-2">
                    मूल रजिस्ट्रेशन विवरण (ORIGINAL FORM DATA)
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong>नाम:</strong> {selectedUserAudit.user.originalRegistration?.name || selectedUserAudit.user.name}
                    </p>
                    <p>
                      <strong>ईमेल:</strong> {selectedUserAudit.user.originalRegistration?.email || selectedUserAudit.user.email}
                    </p>
                    <p>
                      <strong>मोबाइल:</strong> {selectedUserAudit.user.originalRegistration?.phone || selectedUserAudit.user.phone}
                    </p>
                    <p>
                      <strong>पेमेंट पता:</strong> {selectedUserAudit.user.originalRegistration?.paymentAddress || selectedUserAudit.user.paymentAddress}
                    </p>
                    <p>
                      <strong>रजिस्ट्रेशन तारीख:</strong>{' '}
                      {new Date(selectedUserAudit.user.registrationDate).toLocaleString('hi-IN')}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase mb-2">
                    वर्तमान अपडेटेड डेटा (CURRENT ACTIVE DATA)
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong>नाम:</strong> {selectedUserAudit.user.name}
                    </p>
                    <p>
                      <strong>ईमेल:</strong> {selectedUserAudit.user.email}
                    </p>
                    <p>
                      <strong>मोबाइल:</strong> {selectedUserAudit.user.phone}
                    </p>
                    <p>
                      <strong>पेमेंट पता:</strong> {selectedUserAudit.user.paymentAddress}
                    </p>
                    <p>
                      <strong>फ्रेम:</strong> {selectedUserAudit.user.avatarFrame || 'fire'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit Edit History */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <h4 className="text-[11px] font-black text-slate-700 uppercase mb-2">
                  बदलाव इतिहास (USER EDIT AUDIT LOGS)
                </h4>
                {selectedUserAudit.user.editHistory && selectedUserAudit.user.editHistory.length > 0 ? (
                  <div className="space-y-1.5 divide-y divide-slate-200">
                    {selectedUserAudit.user.editHistory.map((h, i) => (
                      <div key={i} className="pt-1.5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-800 uppercase">{h.field}:</span>{' '}
                          <span className="text-slate-500 line-through">{String(h.oldValue)}</span> ➔{' '}
                          <span className="font-bold text-emerald-700">{String(h.newValue)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px]">
                    रजिस्ट्रेशन के बाद यूजर ने कोई जानकारी एडिट नहीं की है।
                  </p>
                )}
              </div>

              {/* Payment Screenshot if exists */}
              {selectedUserAudit.user.paymentScreenshot && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase mb-2">
                    अपलोड किया गया पेमेंट स्क्रीनशॉट
                  </h4>
                  <img
                    src={selectedUserAudit.user.paymentScreenshot}
                    alt="Payment Screenshot"
                    className="max-h-60 rounded-xl border border-slate-300 object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT SCREENSHOT VIEWER MODAL */}
      {viewScreenshotUrl && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-xl w-full bg-slate-900 rounded-2xl p-4 flex flex-col items-center">
            <button
              onClick={() => setViewScreenshotUrl(null)}
              className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-white text-xs font-bold uppercase mb-3">पेमेंट स्क्रीनशॉट सत्यापन</h4>
            <img
              src={viewScreenshotUrl}
              alt="Verification Screenshot"
              className="max-h-[75vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {rejectingUser && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/80">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h4 className="font-bold text-sm text-slate-900">
              {rejectingUser.name} का सत्यापन अस्वीकार करें
            </h4>
            <p className="text-xs text-slate-600">
              अस्वीकृति का कारण दर्ज करें ताकि यूजर को स्पष्ट सूचना मिल सके:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="उदा. अधूरा पेमेंट स्क्रीनशॉट या गलत UTR..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() =>
                  handleVerifyUser(rejectingUser.memberId, 'reject', rejectReason)
                }
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                रिजेक्ट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
