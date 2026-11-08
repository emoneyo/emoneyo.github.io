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

export interface User {
  memberId: string;
  name: string;
  email: string;
  phone: string;
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
  securityQuestion?: string;
  editHistory?: Array<{
    timestamp: string;
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  originalRegistration?: {
    name: string;
    email: string;
    phone: string;
    paymentAddress: string;
    planId: string;
    sponsorId: string;
    date: string;
  };
}

export interface PlanService {
  id: string;
  category: 'normal' | 'fast';
  title: string;
  price: number;
  benefits: string[];
  perDownline?: number;
  levels?: Array<{ level: number; amount: number }>;
}

export interface SystemSettings {
  helplineEmail: string;
  telegramChannel: string;
  showWhatsApp: boolean;
  whatsAppNumber: string;
  upiId: string;
  upiName: string;
  announcementText: string;
  announcementSpeed: 'slow' | 'normal' | 'fast';
  services: PlanService[];
}

export interface ChatMessage {
  id: string;
  memberId: string;
  sender: 'user' | 'admin';
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface ReferralMember {
  memberId: string;
  name: string;
  planName: string;
  planAmount: number;
  joiningDate: string;
  status: 'pending' | 'approved' | 'rejected';
  level: number;
}
