import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_FILE = path.resolve(__dirname, 'server-data.json');

export interface DeviceSession {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  lastActive: string;
  ipAddress?: string;
  isCurrent?: boolean;
}

// Initial seed data if file doesn't exist
interface UserRecord {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  paymentAddress: string;
  accountHolderType?: 'self' | 'parent';
  planId: string;
  planName: string;
  planAmount: number;
  sponsorId: string;
  sponsorName: string;
  profilePic?: string;
  personalQrLink?: string;
  avatarFrame?: 'fire' | 'water' | 'gold' | 'classic';
  privacySettings: {
    hidePhone: boolean;
    hidePayment: boolean;
    hideEmail: boolean;
    hideSponsor?: boolean;
  };
  activeDevices?: DeviceSession[];
  paymentScreenshot?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  canShareReferral: boolean;
  registrationDate: string;
  securityQuestion: string;
  securityAnswer: string;
  editHistory: Array<{
    timestamp: string;
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  originalRegistration: {
    name: string;
    email: string;
    phone: string;
    paymentAddress: string;
    planId: string;
    sponsorId: string;
    date: string;
  };
}

interface ChatMessage {
  id: string;
  memberId: string;
  sender: 'user' | 'admin';
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  timestamp: string;
  read: boolean;
}

interface SystemSettings {
  adminPassword: string;
  helplineEmail: string;
  telegramChannel: string;
  showWhatsApp: boolean;
  whatsAppNumber: string;
  upiId: string;
  upiName: string;
  announcementText: string;
  announcementSpeed: 'slow' | 'normal' | 'fast';
  services: Array<{
    id: string;
    category: 'normal' | 'fast';
    title: string;
    price: number;
    benefits: string[];
    levels?: Array<{ level: number; amount: number }>;
    perDownline?: number;
  }>;
}

interface DatabaseSchema {
  users: UserRecord[];
  messages: ChatMessage[];
  settings: SystemSettings;
}

// Default system settings
const defaultSettings: SystemSettings = {
  adminPassword: 'EMOADMIN',
  helplineEmail: 'newuserhelpline@gmail.com',
  telegramChannel: 'https://t.me/NEWUSERHELPLINE',
  showWhatsApp: false,
  whatsAppNumber: '8877490845',
  upiId: '8877490845@spicepay',
  upiName: 'Vikas Kumar',
  announcementText: '🚨🚨🚨 Attention Everybody 🚨🚨🚨 आ गया पैसा कमाने के लिए ऑनलाइन का बेस्ट तरीका! अब कोई भी कमा सकता है कम समय में ज्यादा से ज्यादा पैसा। EmoneyO NORMAL & FAST INCOME SERVICE से अभी जुड़ें!',
  announcementSpeed: 'slow',
  services: [
    {
      id: 'normal_10',
      category: 'normal',
      title: 'EmoneyO Normal Starter (₹10)',
      price: 10,
      perDownline: 3,
      benefits: ['प्रत्येक डाउनलाइन पर ₹3 की सीधी कमाई', 'कम इनवेस्टमेंट में सीखने और कमाने का मौका', 'डिजिटल आईडी कार्ड व प्रमोशन किट'],
    },
    {
      id: 'normal_50',
      category: 'normal',
      title: 'EmoneyO Normal Growth (₹50)',
      price: 50,
      perDownline: 20,
      benefits: ['प्रत्येक डाउनलाइन पर ₹20 की सीधी कमाई', 'फास्ट रेफरल लिंक एक्टिवेशन', 'लाइव सपोर्ट व अर्निंग किट'],
    },
    {
      id: 'normal_100',
      category: 'normal',
      title: 'EmoneyO Normal Pro (₹100)',
      price: 100,
      perDownline: 55,
      benefits: ['प्रत्येक डाउनलाइन पर ₹55 की बंपर कमाई (55% रिटर्न)', 'हाई अर्निंग पोटेंशियल', 'प्रीमियम डिजिटल आईडी कार्ड'],
    },
    {
      id: 'fast_100',
      category: 'fast',
      title: 'EmoneyO Fast Income Silver (₹100)',
      price: 100,
      benefits: ['3 लेवल तक कमाई का मौका', 'लेवल 1: ₹30 | लेवल 2: ₹10 | लेवल 3: ₹5', 'ऑटोमेटेड टीम इनकम सिस्टम'],
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
      benefits: ['3 लेवल सुपरफास्ट कमाई', 'लेवल 1: ₹150 | लेवल 2: ₹75 | लेवल 3: ₹25', 'वीआईपी ट्रेनिंग और सोशल मीडिया पोस्टर'],
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
      benefits: ['3 लेवल मैक्सिमम पैसिव इनकम', 'लेवल 1: ₹400 | लेवल 2: ₹150 | लेवल 3: ₹50', 'फुल एडमिन प्रायोरिटी सपोर्ट'],
      levels: [
        { level: 1, amount: 400 },
        { level: 2, amount: 150 },
        { level: 3, amount: 50 },
      ],
    },
  ],
};

// Seed default admin and sample verified sponsor
const defaultAdminUser: UserRecord = {
  memberId: 'EMO10ADMIN01',
  name: 'Vikas Kumar (Founder)',
  email: 'newuserhelpline@gmail.com',
  phone: '8877490845',
  password: 'Password@123',
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
  privacySettings: { hidePhone: false, hidePayment: false, hideEmail: false },
  verificationStatus: 'approved',
  canShareReferral: true,
  registrationDate: '2025-01-01T10:00:00.000Z',
  securityQuestion: 'पसंदीदा शहर या स्कूल का नाम',
  securityAnswer: 'delhi',
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

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initData: DatabaseSchema = {
        users: [defaultAdminUser],
        messages: [],
        settings: defaultSettings,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initData, null, 2), 'utf-8');
      return initData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.settings) parsed.settings = defaultSettings;
    if (!parsed.users) parsed.users = [defaultAdminUser];
    if (!parsed.messages) parsed.messages = [];
    return parsed;
  } catch (err) {
    console.error('Error reading DB, using default schema:', err);
    return {
      users: [defaultAdminUser],
      messages: [],
      settings: defaultSettings,
    };
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Helper to generate unique Member ID: EMO[PlanAmount][Initials][Counter]
// E.g. EMO10RK01 (Rahul Kumar joining 10 rupees)
function generateMemberId(users: UserRecord[], name: string, planAmount: number): string {
  const cleanName = name.trim().toUpperCase().replace(/[^A-Z]/g, '');
  const parts = name.trim().split(/\s+/);
  let initials = 'XX';
  if (parts.length >= 2) {
    initials = (parts[0][0] || 'X') + (parts[parts.length - 1][0] || 'X');
  } else if (cleanName.length >= 2) {
    initials = cleanName.slice(0, 2);
  } else if (cleanName.length === 1) {
    initials = cleanName + 'X';
  }
  initials = initials.toUpperCase();

  const prefix = `EMO${planAmount}${initials}`;
  const existingMatches = users.filter((u) => u.memberId.startsWith(prefix));
  const seq = String(existingMatches.length + 1).padStart(2, '0');
  let candidate = `${prefix}${seq}`;
  
  // Guard against any collision
  let counter = existingMatches.length + 1;
  while (users.some((u) => u.memberId === candidate)) {
    counter++;
    candidate = `${prefix}${String(counter).padStart(2, '0')}`;
  }
  return candidate;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // --- API ROUTES ---

  // Public system settings
  app.get('/api/settings', (req: Request, res: Response) => {
    const db = readDb();
    const { adminPassword, ...safeSettings } = db.settings;
    res.json({ success: true, settings: safeSettings });
  });

  // Admin login - strictly verify password EMOADMIN
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    const db = readDb();
    if (password === db.settings.adminPassword || password === 'EMOADMIN') {
      res.json({ success: true, token: 'emo-admin-session-token' });
    } else {
      res.status(401).json({
        success: false,
        message: 'गलत पासवर्ड! कृपया सही एडमिन सुरक्षा पासवर्ड दर्ज करें।',
      });
    }
  });

  // Check sponsor ID validity
  app.get('/api/sponsor/check/:sponsorId', (req: Request, res: Response) => {
    const { sponsorId } = req.params;
    const db = readDb();
    const trimmed = sponsorId.trim().toUpperCase();

    if (trimmed === 'SYSTEM' || trimmed === 'EMO' || trimmed === 'EMOADMIN' || trimmed === 'EMO10ADMIN01') {
      return res.json({
        success: true,
        sponsor: {
          memberId: 'EMO10ADMIN01',
          name: 'EMO Official Head Office',
          status: 'approved',
          planName: 'Platform Official',
        },
      });
    }

    const found = db.users.find((u) => u.memberId.toUpperCase() === trimmed);
    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'यह स्पॉन्सर आईडी मान्य नहीं है। कृपया सही स्पॉन्सर आईडी दर्ज करें या हेड ऑफिस आईडी का उपयोग करें।',
      });
    }

    res.json({
      success: true,
      sponsor: {
        memberId: found.memberId,
        name: found.name,
        status: found.verificationStatus,
        planName: found.planName,
        phone: found.privacySettings?.hidePhone ? '********' : found.phone,
      },
    });
  });

  // Register user
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        paymentAddress,
        accountHolderType,
        planId,
        sponsorId,
        securityQuestion,
        securityAnswer,
        profilePic,
        personalQrLink,
        avatarFrame,
        paymentScreenshot,
      } = req.body;

      if (!name || !email || !phone || !password || !paymentAddress || !planId) {
        return res.status(400).json({ success: false, message: 'कृपया सभी आवश्यक फ़ील्ड भरें।' });
      }

      if (!paymentScreenshot) {
        return res.status(400).json({
          success: false,
          message: 'पेमेंट स्क्रीनशॉट अपलोड करना अनिवार्य है। बिना स्क्रीनशॉट रजिस्ट्रेशन अधूरा है।',
        });
      }

      const db = readDb();

      // Check unique email & phone
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = phone.trim();

      const emailExists = db.users.some((u) => u.email.trim().toLowerCase() === normalizedEmail);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'यह ईमेल पहले से रजिस्टर्ड है। कृपया दूसरा ईमेल उपयोग करें या लॉगिन करें।',
        });
      }

      const phoneExists = db.users.some((u) => u.phone.trim() === normalizedPhone);
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: 'यह मोबाइल नंबर पहले से रजिस्टर्ड है। कृपया दूसरा नंबर उपयोग करें या लॉगिन करें।',
        });
      }

      // Check and find sponsor
      let resolvedSponsorId = 'EMO10ADMIN01';
      let resolvedSponsorName = 'EMO Official Head Office';
      if (sponsorId) {
        const trimmedSponsor = sponsorId.trim().toUpperCase();
        if (trimmedSponsor !== 'SYSTEM' && trimmedSponsor !== 'EMO' && trimmedSponsor !== 'EMOADMIN') {
          const sponsorUser = db.users.find((u) => u.memberId.toUpperCase() === trimmedSponsor);
          if (sponsorUser) {
            resolvedSponsorId = sponsorUser.memberId;
            resolvedSponsorName = sponsorUser.name;
          }
        }
      }

      // Find plan details
      const plan = db.settings.services.find((s) => s.id === planId) || db.settings.services[0];
      const memberId = generateMemberId(db.users, name, plan.price);

      const newUser: UserRecord = {
        memberId,
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: password.trim(),
        paymentAddress: paymentAddress.trim(),
        accountHolderType: accountHolderType || 'self',
        planId: plan.id,
        planName: plan.title,
        planAmount: plan.price,
        sponsorId: resolvedSponsorId,
        sponsorName: resolvedSponsorName,
        profilePic: profilePic || '',
        personalQrLink: personalQrLink || '',
        avatarFrame: avatarFrame || 'fire',
        privacySettings: {
          hidePhone: false,
          hidePayment: false,
          hideEmail: false,
          hideSponsor: false,
        },
        activeDevices: [
          req.body.deviceInfo || {
            deviceId: `dev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            deviceName: 'Primary Mobile Device',
            deviceType: 'mobile',
            browser: 'Chrome Mobile',
            os: 'Android / iOS',
            lastActive: new Date().toISOString(),
            isCurrent: true,
          },
        ],
        paymentScreenshot,
        verificationStatus: 'pending',
        canShareReferral: false, // strictly false until admin approves
        registrationDate: new Date().toISOString(),
        securityQuestion: securityQuestion || 'पसंदीदा शहर या स्कूल का नाम',
        securityAnswer: (securityAnswer || '').trim().toLowerCase(),
        editHistory: [],
        originalRegistration: {
          name: name.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          paymentAddress: paymentAddress.trim(),
          planId: plan.id,
          sponsorId: resolvedSponsorId,
          date: new Date().toISOString(),
        },
      };

      db.users.push(newUser);

      // Create welcome notification in chat
      db.messages.push({
        id: `msg-${Date.now()}`,
        memberId: newUser.memberId,
        sender: 'admin',
        text: `नमस्ते ${newUser.name}! EmoneyO (EARN MONEY ONLINE) में आपका स्वागत है। आपका मेंबर आईडी है: ${newUser.memberId}। आपका पेमेंट स्क्रीनशॉट एडमिन वेरिफिकेशन के लिए सबमिट हो गया है। एडमिन द्वारा वेरिफिकेशन के बाद आपका रेफरल लिंक एक्टिवेट हो जाएगा।`,
        timestamp: new Date().toISOString(),
        read: false,
      });

      writeDb(db);

      res.json({
        success: true,
        message: 'रजिस्ट्रेशन सफलतापूर्वक पूरा हुआ!',
        user: {
          memberId: newUser.memberId,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          planName: newUser.planName,
          planAmount: newUser.planAmount,
          sponsorId: newUser.sponsorId,
          sponsorName: newUser.sponsorName,
          verificationStatus: newUser.verificationStatus,
          canShareReferral: newUser.canShareReferral,
          registrationDate: newUser.registrationDate,
          avatarFrame: newUser.avatarFrame,
          profilePic: newUser.profilePic,
          activeDevices: newUser.activeDevices,
          privacySettings: newUser.privacySettings,
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ success: false, message: 'रजिस्ट्रेशन में त्रुटि आई: ' + err.message });
    }
  });

  // Login user (Multi-device support with device session sync)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { identifier, password, deviceInfo } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'कृपया यूजर आईडी/ईमेल और पासवर्ड दर्ज करें।' });
      }

      const db = readDb();
      const cleanIdent = identifier.trim().toLowerCase();

      const user = db.users.find(
        (u) =>
          u.memberId.toLowerCase() === cleanIdent ||
          u.email.toLowerCase() === cleanIdent ||
          u.phone === identifier.trim()
      );

      if (!user) {
        return res.status(404).json({ success: false, message: 'यूजर आईडी या पासवर्ड गलत है।' });
      }

      if (user.password !== password.trim()) {
        return res.status(401).json({ success: false, message: 'पासवर्ड अमान्य है। कृपया पुनः प्रयास करें।' });
      }

      // Multi-device sync: track active device session
      const incomingDev: DeviceSession = deviceInfo || {
        deviceId: `dev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        deviceName: 'Mobile Web Browser',
        deviceType: 'mobile',
        browser: 'Chrome Mobile',
        os: 'Android / iOS',
        lastActive: new Date().toISOString(),
      };

      if (!user.activeDevices) user.activeDevices = [];
      const devIndex = user.activeDevices.findIndex((d) => d.deviceId === incomingDev.deviceId);
      if (devIndex !== -1) {
        user.activeDevices[devIndex].lastActive = new Date().toISOString();
        if (incomingDev.deviceName) user.activeDevices[devIndex].deviceName = incomingDev.deviceName;
      } else {
        user.activeDevices.unshift({ ...incomingDev, lastActive: new Date().toISOString() });
        if (user.activeDevices.length > 8) {
          user.activeDevices = user.activeDevices.slice(0, 8);
        }
      }

      writeDb(db);

      // Return sanitized user object
      const { password: _, securityAnswer: __, ...safeUser } = user;
      res.json({
        success: true,
        message: 'लॉगिन सफल रहा!',
        user: safeUser,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'लॉगिन में त्रुटि: ' + err.message });
    }
  });

  // Multi-device session revocation endpoint
  app.post('/api/user/devices/revoke', (req: Request, res: Response) => {
    try {
      const { memberId, deviceId, revokeAllOthers } = req.body;
      if (!memberId) return res.status(400).json({ success: false, message: 'मेंबर आईडी आवश्यक है।' });
      const db = readDb();
      const user = db.users.find((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (!user) return res.status(404).json({ success: false, message: 'यूजर नहीं मिला।' });

      if (revokeAllOthers && deviceId) {
        user.activeDevices = (user.activeDevices || []).filter((d) => d.deviceId === deviceId);
      } else if (deviceId) {
        user.activeDevices = (user.activeDevices || []).filter((d) => d.deviceId !== deviceId);
      }

      writeDb(db);
      res.json({
        success: true,
        message: 'डिवाइस सेशन सफलतापूर्वक समाप्त किया गया।',
        activeDevices: user.activeDevices,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'डिवाइस प्रबंधन में त्रुटि: ' + err.message });
    }
  });

  // Forgot password & ID recovery
  app.post('/api/auth/recover', (req: Request, res: Response) => {
    try {
      const { identifier, securityAnswer } = req.body;
      if (!identifier || !securityAnswer) {
        return res.status(400).json({ success: false, message: 'कृपया ईमेल/मोबाइल और सुरक्षा उत्तर दर्ज करें।' });
      }

      const db = readDb();
      const cleanIdent = identifier.trim().toLowerCase();
      const cleanAnswer = securityAnswer.trim().toLowerCase();

      const user = db.users.find(
        (u) =>
          u.email.toLowerCase() === cleanIdent ||
          u.phone === identifier.trim() ||
          u.memberId.toLowerCase() === cleanIdent
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'इस जानकारी से कोई अकाउंट नहीं मिला।',
        });
      }

      if (!user.securityAnswer || user.securityAnswer.toLowerCase() !== cleanAnswer) {
        return res.status(400).json({
          success: false,
          message: 'सुरक्षा उत्तर मेल नहीं खाया। कृपया सही उत्तर दर्ज करें।',
        });
      }

      res.json({
        success: true,
        message: 'अकाउंट सत्यापन सफल!',
        recoveredInfo: {
          memberId: user.memberId,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'रिकवरी में त्रुटि: ' + err.message });
    }
  });

  // Get user profile (multi-device sync)
  app.get('/api/user/profile/:memberId', (req: Request, res: Response) => {
    const { memberId } = req.params;
    const db = readDb();
    const user = db.users.find((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'यूजर नहीं मिला।' });
    }
    const { password: _, securityAnswer: __, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  });

  // Edit user profile (strictly keep memberId and sponsorId immutable)
  app.put('/api/user/profile/:memberId', (req: Request, res: Response) => {
    try {
      const { memberId } = req.params;
      const {
        name,
        email,
        phone,
        paymentAddress,
        profilePic,
        personalQrLink,
        avatarFrame,
        privacySettings,
        password,
      } = req.body;

      const db = readDb();
      const userIndex = db.users.findIndex((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'यूजर नहीं मिला।' });
      }

      const user = db.users[userIndex];
      const editHistory = user.editHistory || [];

      // Audit changes
      const recordEdit = (field: string, oldVal: any, newVal: any) => {
        if (newVal !== undefined && newVal !== oldVal) {
          editHistory.push({
            timestamp: new Date().toISOString(),
            field,
            oldValue: oldVal,
            newValue: newVal,
          });
        }
      };

      if (name && name.trim() !== user.name) {
        recordEdit('name', user.name, name.trim());
        user.name = name.trim();
      }
      if (email && email.trim().toLowerCase() !== user.email) {
        recordEdit('email', user.email, email.trim().toLowerCase());
        user.email = email.trim().toLowerCase();
      }
      if (phone && phone.trim() !== user.phone) {
        recordEdit('phone', user.phone, phone.trim());
        user.phone = phone.trim();
      }
      if (paymentAddress && paymentAddress.trim() !== user.paymentAddress) {
        recordEdit('paymentAddress', user.paymentAddress, paymentAddress.trim());
        user.paymentAddress = paymentAddress.trim();
      }
      if (profilePic !== undefined && profilePic !== user.profilePic) {
        recordEdit('profilePic', 'Old Image', 'Updated Image');
        user.profilePic = profilePic;
      }
      if (personalQrLink !== undefined && personalQrLink !== user.personalQrLink) {
        recordEdit('personalQrLink', user.personalQrLink, personalQrLink);
        user.personalQrLink = personalQrLink;
      }
      if (avatarFrame && avatarFrame !== user.avatarFrame) {
        recordEdit('avatarFrame', user.avatarFrame, avatarFrame);
        user.avatarFrame = avatarFrame;
      }
      if (privacySettings) {
        user.privacySettings = { ...user.privacySettings, ...privacySettings };
      }
      if (password && password.trim() && password.trim() !== user.password) {
        recordEdit('password', '***', 'Updated Password');
        user.password = password.trim();
      }

      user.editHistory = editHistory;
      db.users[userIndex] = user;
      writeDb(db);

      const { password: _, securityAnswer: __, ...safeUser } = user;
      res.json({
        success: true,
        message: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
        user: safeUser,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'प्रोफ़ाइल अपडेट त्रुटि: ' + err.message });
    }
  });

  // Get user's referral team (masked privacy: only User ID, Name, Joining Date, Plan Name, Status)
  app.get('/api/user/referrals/:memberId', (req: Request, res: Response) => {
    const { memberId } = req.params;
    const db = readDb();
    const cleanId = memberId.trim().toUpperCase();

    // Direct referrals (Level 1)
    const directTeam = db.users
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

    // Level 2 referrals (downline of direct team)
    const directIds = directTeam.map((t) => t.memberId.toUpperCase());
    const level2Team = db.users
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

    // Level 3 referrals
    const level2Ids = level2Team.map((t) => t.memberId.toUpperCase());
    const level3Team = db.users
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

    // Calculate approximate earnings based on approved users
    let calculatedEarnings = 0;
    const currentUser = db.users.find((u) => u.memberId.toUpperCase() === cleanId);
    const isFastPlan = currentUser?.planId.startsWith('fast_');

    if (!isFastPlan) {
      // Normal plan: direct downlines
      const approvedDirects = directTeam.filter((d) => d.status === 'approved');
      approvedDirects.forEach((d) => {
        if (d.planAmount === 10) calculatedEarnings += 3;
        else if (d.planAmount === 50) calculatedEarnings += 20;
        else if (d.planAmount === 100) calculatedEarnings += 55;
      });
    } else {
      // Fast plan: 3 levels
      directTeam.filter((d) => d.status === 'approved').forEach((d) => {
        if (d.planAmount === 100) calculatedEarnings += 30;
        else if (d.planAmount === 500) calculatedEarnings += 150;
        else if (d.planAmount === 1000) calculatedEarnings += 400;
      });
      level2Team.filter((d) => d.status === 'approved').forEach((d) => {
        if (d.planAmount === 100) calculatedEarnings += 10;
        else if (d.planAmount === 500) calculatedEarnings += 75;
        else if (d.planAmount === 1000) calculatedEarnings += 150;
      });
      level3Team.filter((d) => d.status === 'approved').forEach((d) => {
        if (d.planAmount === 100) calculatedEarnings += 5;
        else if (d.planAmount === 500) calculatedEarnings += 25;
        else if (d.planAmount === 1000) calculatedEarnings += 50;
      });
    }

    res.json({
      success: true,
      stats: {
        totalTeam: directTeam.length + level2Team.length + level3Team.length,
        directCount: directTeam.length,
        level2Count: level2Team.length,
        level3Count: level3Team.length,
        approvedDirectCount: directTeam.filter((d) => d.status === 'approved').length,
        earningsEstimate: calculatedEarnings,
      },
      directMembers: directTeam,
      level2Members: level2Team,
      level3Members: level3Team,
    });
  });

  // Admin: Get all users with filters and newest on top
  app.get('/api/admin/users', (req: Request, res: Response) => {
    const db = readDb();
    // Sort by registrationDate descending (newest on top)
    const sorted = [...db.users].sort(
      (a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    );
    res.json({ success: true, users: sorted });
  });

  // Admin: Approve or Reject user registration
  app.post('/api/admin/user/:memberId/verify', (req: Request, res: Response) => {
    try {
      const { memberId } = req.params;
      const { action, reason } = req.body; // action: 'approve' | 'reject'
      const db = readDb();

      const userIndex = db.users.findIndex((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'यूजर नहीं मिला।' });
      }

      const user = db.users[userIndex];
      if (action === 'approve') {
        user.verificationStatus = 'approved';
        user.canShareReferral = true; // referral link is unlocked!
        user.rejectionReason = undefined;

        // Send confirmation chat message
        db.messages.push({
          id: `msg-${Date.now()}`,
          memberId: user.memberId,
          sender: 'admin',
          text: `🎉 बधाई हो ${user.name}! आपका अकाउंट एडमिन द्वारा VERIFY व APPROVE कर दिया गया है। आपका डिजिटल आईडी कार्ड और रेफरल लिंक एक्टिवेट हो चुके हैं। अब आप इनवाइट और अर्न शुरू कर सकते हैं!`,
          timestamp: new Date().toISOString(),
          read: false,
        });
      } else if (action === 'reject') {
        user.verificationStatus = 'rejected';
        user.canShareReferral = false;
        user.rejectionReason = reason || 'पेमेंट सत्यापन में विसंगति या अधूरा स्क्रीनशॉट।';

        db.messages.push({
          id: `msg-${Date.now()}`,
          memberId: user.memberId,
          sender: 'admin',
          text: `⚠️ सूचना: आपका वेरिफिकेशन अस्वीकार किया गया है। कारण: ${user.rejectionReason}। कृपया हेल्प डेस्क पर सही पेमेंट स्क्रीनशॉट भेजें।`,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }

      db.users[userIndex] = user;
      writeDb(db);

      res.json({ success: true, message: `यूजर स्टेटस को ${action} किया गया।`, user });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'सत्यापन में त्रुटि: ' + err.message });
    }
  });

  // Admin: 360° User audit details
  app.get('/api/admin/user-audit/:memberId', (req: Request, res: Response) => {
    const { memberId } = req.params;
    const db = readDb();
    const user = db.users.find((u) => u.memberId.toUpperCase() === memberId.trim().toUpperCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'यूजर नहीं मिला।' });
    }

    // Direct referrals of this user
    const userReferrals = db.users.filter((u) => u.sponsorId.toUpperCase() === user.memberId.toUpperCase());

    // Sponsor of this user
    const userSponsor = db.users.find((u) => u.memberId.toUpperCase() === user.sponsorId.toUpperCase());

    res.json({
      success: true,
      user,
      sponsor: userSponsor
        ? {
            memberId: userSponsor.memberId,
            name: userSponsor.name,
            phone: userSponsor.phone,
            email: userSponsor.email,
          }
        : null,
      referralsCount: userReferrals.length,
      approvedReferralsCount: userReferrals.filter((r) => r.verificationStatus === 'approved').length,
    });
  });

  // Admin: Update system settings (helpline, announcement, toggle WhatsApp, etc.)
  app.put('/api/admin/settings', (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const db = readDb();

      db.settings = {
        ...db.settings,
        ...updates,
      };

      writeDb(db);
      res.json({ success: true, message: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!', settings: db.settings });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'सेटिंग्स अपडेट में त्रुटि: ' + err.message });
    }
  });

  // Chat / Messages API: Get chat between user & admin
  app.get('/api/chat/:memberId', (req: Request, res: Response) => {
    const { memberId } = req.params;
    const db = readDb();
    const chat = db.messages.filter((m) => m.memberId.toUpperCase() === memberId.trim().toUpperCase());
    res.json({ success: true, messages: chat });
  });

  // Chat / Messages API: Send message
  app.post('/api/chat', (req: Request, res: Response) => {
    try {
      const { memberId, sender, text, imageUrl, linkUrl } = req.body;
      if (!memberId || !text) {
        return res.status(400).json({ success: false, message: 'मेसेज टेक्स्ट अनिवार्य है।' });
      }
      const db = readDb();
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        memberId: memberId.trim().toUpperCase(),
        sender: sender === 'admin' ? 'admin' : 'user',
        text: text.trim(),
        imageUrl: imageUrl || undefined,
        linkUrl: linkUrl || undefined,
        timestamp: new Date().toISOString(),
        read: false,
      };
      db.messages.push(newMessage);
      writeDb(db);
      res.json({ success: true, message: newMessage });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'मेसेज भेजने में त्रुटि: ' + err.message });
    }
  });

  // Vite development middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EMO Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
