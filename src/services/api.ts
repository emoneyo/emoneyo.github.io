import { User, SystemSettings, ReferralMember, ChatMessage, DeviceSession } from '../types';

// Default EmoneyO Settings
const defaultSettings: SystemSettings = {
  helplineEmail: 'newuserhelpline@gmail.com',
  telegramChannel: 'https://t.me/NEWUSERHELPLINE',
  showWhatsApp: false,
  whatsAppNumber: '8877490845',
  upiId: '8877490845@spicepay',
  upiName: 'Vikas Kumar',
  announcementText:
    '🚨🚨🚨 Attention Everybody 🚨🚨🚨 आ गया पैसा कमाने के लिए ऑनलाइन का बेस्ट तरीका! अब कोई भी कमा सकता है कम समय में ज्यादा से ज्यादा पैसा। EmoneyO NORMAL & FAST INCOME SERVICE से अभी जुड़ें!',
  announcementSpeed: 'slow',
  services: [
    {
      id: 'normal_10',
      category: 'normal',
      title: 'EmoneyO Normal Starter (₹10)',
      price: 10,
      perDownline: 3,
      benefits: [
        'प्रत्येक डाउनलाइन पर ₹3 की सीधी कमाई',
        'कम इनवेस्टमेंट में सीखने और कमाने का मौका',
        'डिजिटल आईडी कार्ड व प्रमोशन किट',
      ],
    },
    {
      id: 'normal_50',
      category: 'normal',
      title: 'EmoneyO Normal Growth (₹50)',
      price: 50,
      perDownline: 20,
      benefits: [
        'प्रत्येक डाउनलाइन पर ₹20 की सीधी कमाई',
        'फास्ट रेफरल लिंक एक्टिवेशन',
        'लाइव सपोर्ट व अर्निंग किट',
      ],
    },
    {
      id: 'normal_100',
      category: 'normal',
      title: 'EmoneyO Normal Pro (₹100)',
      price: 100,
      perDownline: 55,
      benefits: [
        'प्रत्येक डाउनलाइन पर ₹55 की बंपर कमाई (55% रिटर्न)',
        'हाई अर्निंग पोटेंशियल',
        'प्रीमियम डिजिटल आईडी कार्ड',
      ],
    },
    {
      id: 'fast_100',
      category: 'fast',
      title: 'EmoneyO Fast Income Silver (₹100)',
      price: 100,
      benefits: [
        '3 लेवल तक कमाई का मौका',
        'लेवल 1: ₹30 | लेवल 2: ₹10 | लेवल 3: ₹5',
        'ऑटोमेटेड टीम इनकम सिस्टम',
      ],
      levels: [
        { level: 1, amount: 30 },
        { level: 2, amount: 10 },
        { level: 3, amount: 5 },
      ],
    },
    {
      id: 'fast_500',
      category: 'fast',
      title: 'EmoneyO Fast Income Gold (₹500)',
      price: 500,
      benefits: [
        '3 लेवल सुपरफास्ट कमाई',
        'लेवल 1: ₹150 | लेवल 2: ₹75 | लेवल 3: ₹25',
        'वीआईपी ट्रेनिंग और सोशल मीडिया पोस्टर',
      ],
      levels: [
        { level: 1, amount: 150 },
        { level: 2, amount: 75 },
        { level: 3, amount: 25 },
      ],
    },
    {
      id: 'fast_1000',
      category: 'fast',
      title: 'EmoneyO Fast Income Platinum (₹1000)',
      price: 1000,
      benefits: [
        '3 लेवल मैक्सिमम पैसिव इनकम',
        'लेवल 1: ₹400 | लेवल 2: ₹150 | लेवल 3: ₹50',
        'फुल एडमिन प्रायोरिटी सपोर्ट',
      ],
      levels: [
        { level: 1, amount: 400 },
        { level: 2, amount: 150 },
        { level: 3, amount: 50 },
      ],
    },
  ],
};

const defaultAdminUser: User = {
  memberId: 'EMO10ADMIN01',
  name: 'Vikas Kumar (Founder)',
  email: 'newuserhelpline@gmail.com',
  phone: '8877490845',
  paymentAddress: '8877490845@spicepay',
  accountHolderType: 'self',
  planId: 'fast_1000',
  planName: 'EmoneyO Fast Income Platinum (₹1000)',
  planAmount: 1000,
  sponsorId: 'SYSTEM',
  sponsorName: 'EmoneyO Official Head Office',
  profilePic: '',
  personalQrLink: 'upi://pay?pa=8877490845@spicepay&pn=Vikas%20Kumar',
  avatarFrame: 'fire',
  privacySettings: { hidePhone: false, hidePayment: false, hideEmail: false, hideSponsor: false },
  verificationStatus: 'approved',
  canShareReferral: true,
  registrationDate: '2025-01-01T10:00:00.000Z',
  activeDevices: [
    {
      deviceId: 'admin-dev-01',
      deviceName: 'Master Device',
      deviceType: 'desktop',
      browser: 'Chrome Desktop',
      os: 'Admin OS',
      lastActive: new Date().toISOString(),
      isCurrent: true,
    },
  ],
  editHistory: [],
  originalRegistration: {
    name: 'Vikas Kumar (Founder)',
    email: 'newuserhelpline@gmail.com',
    phone: '8877490845',
    paymentAddress: '8877490845@spicepay',
    planId: 'fast_1000',
    sponsorId: 'SYSTEM',
    date: '2025-01-01T10:00:00.000Z',
  },
};

// Client-side LocalStorage DB for GitHub Pages / Static Hosting
const STORAGE_KEYS = {
  USERS: 'emo_db_users_v2',
  SETTINGS: 'emo_db_settings_v2',
  MESSAGES: 'emo_db_messages_v2',
};

function getLocalUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      const init = [defaultAdminUser];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  } catch {
    return [defaultAdminUser];
  }
}

function saveLocalUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Local save error', e);
  }
}

function getLocalSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(raw);
  } catch {
    return defaultSettings;
  }
}

function saveLocalSettings(settings: SystemSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Local save error', e);
  }
}

function getLocalMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
  } catch (e) {
    console.error('Local save error', e);
  }
}

// Generate unique ID
function generateMemberIdLocal(users: User[], name: string, planAmount: number): string {
  const parts = name.trim().split(/\s+/);
  let initials = 'XX';
  if (parts.length >= 2) {
    initials = (parts[0][0] || 'X') + (parts[parts.length - 1][0] || 'X');
  } else if (name.length >= 2) {
    initials = name.slice(0, 2);
  }
  initials = initials.toUpperCase();
  const prefix = `EMO${planAmount}${initials}`;
  const existingMatches = users.filter((u) => u.memberId.startsWith(prefix));
  let counter = existingMatches.length + 1;
  let candidate = `${prefix}${String(counter).padStart(2, '0')}`;
  while (users.some((u) => u.memberId === candidate)) {
    counter++;
    candidate = `${prefix}${String(counter).padStart(2, '0')}`;
  }
  return candidate;
}

// Check if we are running on a static host (GitHub Pages, etc.)
export const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('github.io') ||
    window.location.hostname === 'localhost' && window.location.port !== '3000');

// Safe fetch wrapper that falls back to static mode if /api returns 404 or fails
async function safeFetch(url: string, options?: RequestInit): Promise<any> {
  try {
    const res = await fetch(url, options);
    // If response is HTML (like GitHub 404 page) or 404, throw to trigger fallback
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error(`Endpoint returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

// Unified API Service
export const api = {
  // 1. Get System Settings
  async getSettings(): Promise<{ success: boolean; settings: SystemSettings }> {
    try {
      return await safeFetch('/api/settings');
    } catch {
      return { success: true, settings: getLocalSettings() };
    }
  },

  // 2. Check Sponsor ID
  async checkSponsor(sponsorId: string): Promise<{ success: boolean; sponsor?: any; message?: string }> {
    const trimmed = sponsorId.trim().toUpperCase();
    try {
      return await safeFetch(`/api/sponsor/check/${encodeURIComponent(trimmed)}`);
    } catch {
      // Fallback in static / GitHub Pages environment
      if (
        trimmed === 'SYSTEM' ||
        trimmed === 'EMO' ||
        trimmed === 'EMOADMIN' ||
        trimmed === 'EMO10ADMIN01'
      ) {
        return {
          success: true,
          sponsor: {
            memberId: 'EMO10ADMIN01',
            name: 'EMO Official Head Office',
            status: 'approved',
            planName: 'Platform Official',
          },
        };
      }
      const users = getLocalUsers();
      const found = users.find((u) => u.memberId.toUpperCase() === trimmed);
      if (!found) {
        return {
          success: false,
          message: 'यह स्पॉन्सर आईडी मान्य नहीं है। कृपया सही स्पॉन्सर आईडी दर्ज करें या हेड ऑफिस आईडी का उपयोग करें।',
        };
      }
      return {
        success: true,
        sponsor: {
          memberId: found.memberId,
          name: found.name,
          status: found.verificationStatus,
          planName: found.planName,
          phone: found.privacySettings?.hidePhone ? '********' : found.phone,
        },
      };
    }
  },

  // 3. Register User
  async register(payload: any): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      return await safeFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Static fallback
      const users = getLocalUsers();
      const normEmail = payload.email.trim().toLowerCase();
      const normPhone = payload.phone.trim();

      if (users.some((u) => u.email.toLowerCase() === normEmail)) {
        return { success: false, message: 'यह ईमेल पहले से रजिस्टर्ड है। कृपया दूसरा ईमेल उपयोग करें।' };
      }
      if (users.some((u) => u.phone === normPhone)) {
        return { success: false, message: 'यह मोबाइल नंबर पहले से रजिस्टर्ड है।' };
      }

      const settings = getLocalSettings();
      const plan = settings.services.find((s) => s.id === payload.planId) || settings.services[0];
      const memberId = generateMemberIdLocal(users, payload.name, plan.price);

      const newUser: User = {
        memberId,
        name: payload.name.trim(),
        email: normEmail,
        phone: normPhone,
        paymentAddress: payload.paymentAddress.trim(),
        accountHolderType: payload.accountHolderType || 'self',
        planId: plan.id,
        planName: plan.title,
        planAmount: plan.price,
        sponsorId: payload.sponsorId ? payload.sponsorId.trim().toUpperCase() : 'EMO10ADMIN01',
        sponsorName: 'EMO Sponsor',
        profilePic: payload.profilePic || '',
        personalQrLink: payload.personalQrLink || '',
        avatarFrame: payload.avatarFrame || 'fire',
        privacySettings: { hidePhone: false, hidePayment: false, hideEmail: false, hideSponsor: false },
        activeDevices: [payload.deviceInfo || {
          deviceId: `dev-${Date.now()}`,
          deviceName: 'Mobile Web Device',
          deviceType: 'mobile',
          browser: 'Chrome Mobile',
          os: 'Mobile OS',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        }],
        paymentScreenshot: payload.paymentScreenshot,
        verificationStatus: 'pending',
        canShareReferral: false,
        registrationDate: new Date().toISOString(),
        securityQuestion: payload.securityQuestion || 'पसंदीदा शहर या स्कूल का नाम',
        editHistory: [],
        originalRegistration: {
          name: payload.name.trim(),
          email: normEmail,
          phone: normPhone,
          paymentAddress: payload.paymentAddress.trim(),
          planId: plan.id,
          sponsorId: payload.sponsorId || 'EMO10ADMIN01',
          date: new Date().toISOString(),
        },
      };

      // Also store password & securityAnswer internally in localStorage record
      (newUser as any).password = payload.password;
      (newUser as any).securityAnswer = (payload.securityAnswer || '').trim().toLowerCase();

      users.push(newUser);
      saveLocalUsers(users);

      // Add welcome chat
      const msgs = getLocalMessages();
      msgs.push({
        id: `msg-${Date.now()}`,
        memberId: newUser.memberId,
        sender: 'admin',
        text: `नमस्ते ${newUser.name}! EmoneyO (EARN MONEY ONLINE) में आपका स्वागत है। आपका मेंबर आईडी है: ${newUser.memberId}। आपका पेमेंट स्क्रीनशॉट एडमिन वेरिफिकेशन के लिए सबमिट हो गया है।`,
        timestamp: new Date().toISOString(),
        read: false,
      });
      saveLocalMessages(msgs);

      return { success: true, message: 'रजिस्ट्रेशन सफलतापूर्वक पूरा हुआ!', user: newUser };
    }
  },

  // 4. Login User
  async login(payload: { identifier: string; password: string; deviceInfo?: any }): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      return await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const users = getLocalUsers();
      const cleanIdent = payload.identifier.trim().toLowerCase();
      const user = users.find(
        (u) =>
          u.memberId.toLowerCase() === cleanIdent ||
          u.email.toLowerCase() === cleanIdent ||
          u.phone === payload.identifier.trim()
      );

      if (!user) {
        return { success: false, message: 'यूजर आईडी या पासवर्ड गलत है।' };
      }

      if ((user as any).password && (user as any).password !== payload.password.trim()) {
        return { success: false, message: 'पासवर्ड अमान्य है। कृपया पुनः प्रयास करें।' };
      }

      // Record device
      if (payload.deviceInfo) {
        if (!user.activeDevices) user.activeDevices = [];
        const idx = user.activeDevices.findIndex((d) => d.deviceId === payload.deviceInfo.deviceId);
        if (idx !== -1) {
          user.activeDevices[idx].lastActive = new Date().toISOString();
        } else {
          user.activeDevices.unshift({ ...payload.deviceInfo, lastActive: new Date().toISOString() });
        }
        saveLocalUsers(users);
      }

      return { success: true, message: 'लॉगिन सफल रहा!', user };
    }
  },

  // 5. Recover Account
  async recover(payload: { identifier: string; securityAnswer: string }): Promise<{ success: boolean; recoveredInfo?: any; message?: string }> {
    try {
      return await safeFetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const users = getLocalUsers();
      const cleanIdent = payload.identifier.trim().toLowerCase();
      const cleanAns = payload.securityAnswer.trim().toLowerCase();
      const user = users.find(
        (u) =>
          u.memberId.toLowerCase() === cleanIdent ||
          u.email.toLowerCase() === cleanIdent ||
          u.phone === payload.identifier.trim()
      );

      if (!user) {
        return { success: false, message: 'इस जानकारी से कोई अकाउंट नहीं मिला।' };
      }

      const storedAns = (user as any).securityAnswer || 'delhi';
      if (storedAns.toLowerCase() !== cleanAns) {
        return { success: false, message: 'सुरक्षा उत्तर मेल नहीं खाया। कृपया सही उत्तर दर्ज करें।' };
      }

      return {
        success: true,
        message: 'अकाउंट सत्यापन सफल!',
        recoveredInfo: {
          memberId: user.memberId,
          name: user.name,
          email: user.email,
          password: (user as any).password || 'Password@123',
        },
      };
    }
  },

  // 6. Get Profile
  async getProfile(memberId: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      return await safeFetch(`/api/user/profile/${memberId}`);
    } catch {
      const users = getLocalUsers();
      const user = users.find((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (!user) return { success: false, message: 'यूजर नहीं मिला।' };
      return { success: true, user };
    }
  },

  // 7. Update Profile (Privacy, Name, DP, etc.)
  async updateProfile(memberId: string, updates: any): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      return await safeFetch(`/api/user/profile/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      const users = getLocalUsers();
      const idx = users.findIndex((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (idx === -1) return { success: false, message: 'यूजर नहीं मिला।' };

      const user = users[idx];
      if (updates.name) user.name = updates.name.trim();
      if (updates.email) user.email = updates.email.trim();
      if (updates.phone) user.phone = updates.phone.trim();
      if (updates.paymentAddress) user.paymentAddress = updates.paymentAddress.trim();
      if (updates.profilePic !== undefined) user.profilePic = updates.profilePic;
      if (updates.personalQrLink !== undefined) user.personalQrLink = updates.personalQrLink;
      if (updates.avatarFrame) user.avatarFrame = updates.avatarFrame;
      if (updates.privacySettings) {
        user.privacySettings = { ...user.privacySettings, ...updates.privacySettings };
      }

      users[idx] = user;
      saveLocalUsers(users);
      return { success: true, message: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!', user };
    }
  },

  // 8. Get Referrals
  async getReferrals(memberId: string): Promise<any> {
    try {
      return await safeFetch(`/api/user/referrals/${memberId}`);
    } catch {
      const users = getLocalUsers();
      const cleanId = memberId.trim().toUpperCase();

      const direct = users
        .filter((u) => u.sponsorId.toUpperCase() === cleanId)
        .map((u) => ({
          memberId: u.memberId,
          name: u.name,
          planName: u.planName,
          planAmount: u.planAmount,
          joiningDate: u.registrationDate,
          status: u.verificationStatus,
          level: 1,
        }));

      const directIds = direct.map((d) => d.memberId.toUpperCase());
      const level2 = users
        .filter((u) => directIds.includes(u.sponsorId.toUpperCase()))
        .map((u) => ({
          memberId: u.memberId,
          name: u.name,
          planName: u.planName,
          planAmount: u.planAmount,
          joiningDate: u.registrationDate,
          status: u.verificationStatus,
          level: 2,
        }));

      const level2Ids = level2.map((d) => d.memberId.toUpperCase());
      const level3 = users
        .filter((u) => level2Ids.includes(u.sponsorId.toUpperCase()))
        .map((u) => ({
          memberId: u.memberId,
          name: u.name,
          planName: u.planName,
          planAmount: u.planAmount,
          joiningDate: u.registrationDate,
          status: u.verificationStatus,
          level: 3,
        }));

      let calculatedEarnings = 0;
      direct.filter((d) => d.status === 'approved').forEach((d) => {
        if (d.planAmount === 10) calculatedEarnings += 3;
        else if (d.planAmount === 50) calculatedEarnings += 20;
        else if (d.planAmount === 100) calculatedEarnings += 55;
        else if (d.planAmount === 500) calculatedEarnings += 150;
        else if (d.planAmount === 1000) calculatedEarnings += 400;
      });

      return {
        success: true,
        stats: {
          totalTeam: direct.length + level2.length + level3.length,
          directCount: direct.length,
          level2Count: level2.length,
          level3Count: level3.length,
          approvedDirectCount: direct.filter((d) => d.status === 'approved').length,
          earningsEstimate: calculatedEarnings,
        },
        directMembers: direct,
        level2Members: level2,
        level3Members: level3,
      };
    }
  },

  // 9. Revoke Device
  async revokeDevice(
    param: string | { memberId: string; deviceId?: string; revokeAllOthers?: boolean },
    deviceId?: string,
    revokeAllOthers = false
  ): Promise<any> {
    const payload = typeof param === 'string'
      ? { memberId: param, deviceId, revokeAllOthers }
      : { memberId: param.memberId, deviceId: param.deviceId, revokeAllOthers: param.revokeAllOthers || false };

    try {
      return await safeFetch('/api/user/devices/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const users = getLocalUsers();
      const user = users.find((u) => u.memberId.toUpperCase() === payload.memberId.trim().toUpperCase());
      if (!user) return { success: false, message: 'यूजर नहीं मिला।' };

      if (payload.revokeAllOthers && payload.deviceId) {
        user.activeDevices = (user.activeDevices || []).filter((d) => d.deviceId === payload.deviceId);
      } else if (payload.deviceId) {
        user.activeDevices = (user.activeDevices || []).filter((d) => d.deviceId !== payload.deviceId);
      }
      saveLocalUsers(users);
      return { success: true, activeDevices: user.activeDevices };
    }
  },

  // 10. Admin Login
  async adminLogin(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      return await safeFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
    } catch {
      const settings = getLocalSettings();
      if (password === 'EMOADMIN' || password === (settings as any).adminPassword) {
        return { success: true, token: 'emo-admin-session-token' };
      }
      return { success: false, message: 'गलत पासवर्ड! कृपया सही एडमिन सुरक्षा पासवर्ड दर्ज करें।' };
    }
  },

  // 11. Admin Get Users
  async getAdminUsers(): Promise<{ success: boolean; users?: User[] }> {
    try {
      return await safeFetch('/api/admin/users');
    } catch {
      const users = getLocalUsers();
      return { success: true, users };
    }
  },

  // 12. Admin Verify User
  async verifyUser(memberId: string, action: 'approve' | 'reject', reason?: string): Promise<any> {
    try {
      return await safeFetch(`/api/admin/user/${memberId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
    } catch {
      const users = getLocalUsers();
      const user = users.find((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (!user) return { success: false, message: 'यूजर नहीं मिला।' };

      if (action === 'approve') {
        user.verificationStatus = 'approved';
        user.canShareReferral = true;
        user.rejectionReason = undefined;
      } else {
        user.verificationStatus = 'rejected';
        user.canShareReferral = false;
        user.rejectionReason = reason || 'पेमेंट सत्यापन में विसंगति।';
      }
      saveLocalUsers(users);
      return { success: true, user };
    }
  },

  // 13. Admin 360 User Audit
  async getUserAudit(memberId: string): Promise<any> {
    try {
      return await safeFetch(`/api/admin/user-audit/${memberId}`);
    } catch {
      const users = getLocalUsers();
      const user = users.find((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (!user) return { success: false, message: 'यूजर नहीं मिला।' };
      const sponsor = users.find((u) => u.memberId.toUpperCase() === user.sponsorId.toUpperCase());
      const referrals = users.filter((u) => u.sponsorId.toUpperCase() === user.memberId.toUpperCase());
      return {
        success: true,
        user,
        sponsor: sponsor ? { memberId: sponsor.memberId, name: sponsor.name, phone: sponsor.phone, email: sponsor.email } : null,
        referralsCount: referrals.length,
        approvedReferralsCount: referrals.filter((r) => r.verificationStatus === 'approved').length,
      };
    }
  },

  // 14. Admin Update Settings
  async updateSettings(settings: Partial<SystemSettings>): Promise<any> {
    try {
      return await safeFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {
      const current = getLocalSettings();
      const updated = { ...current, ...settings };
      saveLocalSettings(updated);
      return { success: true, settings: updated };
    }
  },

  // 15. Chat Messages
  async getChat(memberId: string): Promise<{ success: boolean; messages: ChatMessage[] }> {
    try {
      return await safeFetch(`/api/chat/${memberId}`);
    } catch {
      const msgs = getLocalMessages();
      const filtered = msgs.filter((m) => m.memberId.toUpperCase() === memberId.trim().toUpperCase());
      return { success: true, messages: filtered };
    }
  },

  // 16. Send Chat Message
  async sendChat(payload: { memberId: string; sender: 'user' | 'admin'; text: string; linkUrl?: string; imageUrl?: string }): Promise<any> {
    try {
      return await safeFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const msgs = getLocalMessages();
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        memberId: payload.memberId.trim().toUpperCase(),
        sender: payload.sender,
        text: payload.text.trim(),
        linkUrl: payload.linkUrl,
        imageUrl: payload.imageUrl,
        timestamp: new Date().toISOString(),
        read: false,
      };
      msgs.push(newMsg);
      saveLocalMessages(msgs);
      return { success: true, message: newMsg };
    }
  },
};
