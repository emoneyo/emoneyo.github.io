import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Award,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  Mail,
  Send,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Phone,
  Layers,
  Flame,
} from 'lucide-react';
import { User, SystemSettings } from './types';
import { EmoLogo } from './components/EmoLogo';
import { Header } from './components/Header';
import { AnnouncementBar } from './components/AnnouncementBar';
import { FooterNav } from './components/FooterNav';
import { PlansSection } from './components/PlansSection';
import { DigitalIdCard } from './components/DigitalIdCard';
import { RegistrationModal } from './components/RegistrationModal';
import { LoginModal } from './components/LoginModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { PromotionKitModal } from './components/PromotionKitModal';
import { FAQSection } from './components/FAQSection';
import { UserGuidelineModal } from './components/UserGuidelineModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    helplineEmail: 'newuserhelpline@gmail.com',
    telegramChannel: 'https://t.me/NEWUSERHELPLINE',
    showWhatsApp: false,
    whatsAppNumber: '8877490845',
    upiId: '8877490845@spicepay',
    upiName: 'Vikas Kumar',
    announcementText:
      '🚨🚨🚨 Attention Everybody 🚨🚨🚨 आ गया पैसा कमाने के लिए ऑनलाइन का बेस्ट तरीका! अब कोई भी कमा सकता है कम समय में ज्यादा से ज्यादा पैसा। EMO NORMAL & FAST INCOME SERVICE से अभी जुड़ें!',
    announcementSpeed: 'slow',
    services: [
      {
        id: 'normal_10',
        category: 'normal',
        title: 'EMO Normal Starter (₹10)',
        price: 10,
        perDownline: 3,
        benefits: [
          'प्रत्येक डाउनलाइन पर ₹3 की सीधी कमाई',
          'कम इनवेस्टमेंट में सीखने और कमाने का मौका',
          '3D डिजिटल आईडी कार्ड व अर्निंग किट',
        ],
      },
      {
        id: 'normal_50',
        category: 'normal',
        title: 'EMO Normal Growth (₹50)',
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
        title: 'EMO Normal Pro (₹100)',
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
        title: 'EMO Fast Income Silver (₹100)',
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
        title: 'EMO Fast Income Gold (₹500)',
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
        title: 'EMO Fast Income Platinum (₹1000)',
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
  });

  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState<boolean>(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState<boolean>(false);
  const [promoKitOpen, setPromoKitOpen] = useState<boolean>(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState<boolean>(false);

  // Pre-selected parameters
  const [preSelectedPlanId, setPreSelectedPlanId] = useState<string>('normal_10');
  const [preFilledSponsorId, setPreFilledSponsorId] = useState<string>('EMO10ADMIN01');

  // Load public system settings and check URL referral params on mount
  useEffect(() => {
    // 1. Fetch live system settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSystemSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));

    // 2. Check local session for persistent multi-device login
    const savedMemberId = localStorage.getItem('emo_active_member_id');
    if (savedMemberId) {
      fetch(`/api/user/profile/${savedMemberId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
          } else {
            localStorage.removeItem('emo_active_member_id');
          }
        })
        .catch(() => {});
    }

    // 3. Check for referral query param: ?ref=EMO10RK01
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      const cleanRef = refCode.trim().toUpperCase();
      setPreFilledSponsorId(cleanRef);
      // Auto open registration modal if guest
      if (!savedMemberId) {
        setRegisterModalOpen(true);
      }
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('emo_active_member_id', user.memberId);
  };

  // Handle successful registration
  const handleRegisterSuccess = (newUser: User) => {
    setCurrentUser(newUser);
    localStorage.setItem('emo_active_member_id', newUser.memberId);
    // Show ID card immediately after registration
    setIdCardModalOpen(true);
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('emo_active_member_id');
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-900 flex flex-col antialiased pb-20">
      {/* 1. Locked Compact Header */}
      <Header
        user={currentUser}
        onOpenRegister={() => {
          setPreSelectedPlanId('normal_10');
          setRegisterModalOpen(true);
        }}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenDashboard={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        onOpenIdCard={() => setIdCardModalOpen(true)}
        onOpenGuidelines={() => setGuidelinesOpen(true)}
        onOpenFaq={() => scrollToSection('faq')}
        onLogout={handleLogout}
        settings={systemSettings}
      />

      {/* 2. Slow Readable Marquee Announcement Bar */}
      <AnnouncementBar text={systemSettings.announcementText} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6">
        {/* If user is logged in, show their personal Telegram-style User Dashboard */}
        {currentUser ? (
          <div className="py-4">
            <UserDashboard
              user={currentUser}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              onLogout={handleLogout}
              onOpenIdCard={() => setIdCardModalOpen(true)}
              onOpenPromotionKit={() => setPromoKitOpen(true)}
              telegramLink={systemSettings.telegramChannel}
            />
          </div>
        ) : (
          /* Guest Hero Banner - Flipkart & Student Friendly Theme */
          <section className="pt-6 sm:pt-10 pb-6 sm:pb-8">
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-blue-600">
              {/* Background Watermark Logo */}
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <EmoLogo variant="badge" size={320} />
              </div>

              <div className="relative z-10 max-w-3xl">
                {/* Badge ribbon */}
                <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  आ गया पैसा कमाने के लिए ऑनलाइन का बेस्ट तरीका
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  EARN MONEY ONLINE <span className="text-amber-300">(EMO)</span>
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-blue-100 mt-3 font-medium leading-relaxed">
                  आज के आधुनिक दुनिया में लगभग सबके पास मोबाइल फोन और इंटरनेट उपलब्ध है। इसके जरिए लोग मनोरंजन और बातचीत करते हैं, कुछ लोग पैसा भी कमाते हैं। <strong className="text-white underline">जब गिने चुने लोग पैसा कमा सकते हैं तो आप क्यों नहीं!</strong>
                </p>

                <p className="text-xs sm:text-sm text-amber-200 mt-2 font-bold leading-relaxed">
                  इसी बात से प्रेरित होकर हमने EMO को DESIGN किया है, जो SOCIAL MEDIA PLATFORM के माध्यम से SOCIAL NETWORKING द्वारा पैसा कमाने में सहायता करता है। सबसे बड़ी बात ये है कि ARTIFICIALLY INTELLIGENT (AI) के कारण ये और भी आसान हो गया है।
                </p>

                {/* Call to Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setPreSelectedPlanId('normal_10');
                      setRegisterModalOpen(true);
                    }}
                    className="py-3 px-5 sm:px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>अभी ₹10 से शुरू करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIdCardModalOpen(true)}
                    className="py-3 px-4 sm:px-5 bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm rounded-xl border border-white/25 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>डिजिटल आईडी कार्ड देखें</span>
                  </button>

                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="py-3 px-4 bg-transparent hover:bg-white/10 text-blue-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
                  >
                    आईडी लॉगिन करें
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-semibold text-blue-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% सुरक्षित सिस्टम</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>माता-पिता का UPI मान्य</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>3D फायर आईडी कार्ड</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>3-लेवल पैसिव इनकम</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Services & Plans Section */}
        <PlansSection
          services={systemSettings.services}
          onSelectPlan={(planId) => {
            setPreSelectedPlanId(planId);
            setRegisterModalOpen(true);
          }}
        />

        {/* 4. Digital ID Card Preview / Modal Section */}
        <section id="idcard-preview" className="py-8 max-w-xl mx-auto">
          <div className="text-center mb-5">
            <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-amber-600" />
              आधिकारिक डिजिटल पहचान पत्र
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              3D डिजिटल आईडी कार्ड (Digital ID Card)
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              3D लाइव फायर रिंग, जल और शाही फ्रेम के साथ अपना व्यक्तिगत पहचान पत्र प्राप्त करें
            </p>
          </div>

          <DigitalIdCard
            user={currentUser}
            isOwner={true}
            onOpenRegister={() => setRegisterModalOpen(true)}
            onOpenLogin={() => setLoginModalOpen(true)}
            onSelectSponsor={(sId) => {
              setPreFilledSponsorId(sId);
              setRegisterModalOpen(true);
            }}
            onUpdateUser={(updated) => setCurrentUser(updated)}
          />
        </section>

        {/* 5. Common FAQs Section */}
        <FAQSection />

        {/* 6. Footer Information & Support Desk */}
        <footer className="mt-10 mb-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <EmoLogo variant="badge" size={48} />
              <div>
                <h3 className="text-lg font-black text-blue-700">EMO - EARN MONEY ONLINE</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Social Media Networking Platform • Powered by AI
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href={`mailto:${systemSettings.helplineEmail}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{systemSettings.helplineEmail}</span>
              </a>

              {systemSettings.telegramChannel && (
                <a
                  href={systemSettings.telegramChannel}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 rounded-xl font-bold text-sky-700 border border-sky-200 transition-colors"
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>टेलीग्राम चैनल</span>
                </a>
              )}

              {systemSettings.showWhatsApp && systemSettings.whatsAppNumber && (
                <a
                  href={`https://wa.me/${systemSettings.whatsAppNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-bold text-emerald-700 border border-emerald-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp हेल्प</span>
                </a>
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} EMO Platform. सर्वाधिकार सुरक्षित (All Rights Reserved).</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGuidelinesOpen(true)}
                className="hover:underline text-slate-700 font-semibold"
              >
                उपयोगकर्ता गाइड
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:underline text-slate-700 font-semibold"
              >
                नियम व शर्तें
              </button>
              <button
                onClick={() => setAdminPanelOpen(true)}
                className="hover:underline text-rose-600 font-bold"
              >
                एडमिन लॉगिन
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* 7. Locked Bottom Navigation */}
      <FooterNav
        user={currentUser}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigatePlans={() => scrollToSection('plans')}
        onOpenIdCard={() => setIdCardModalOpen(true)}
        onOpenRegister={() => {
          setPreSelectedPlanId('normal_10');
          setRegisterModalOpen(true);
        }}
        onOpenDashboard={() => {
          if (currentUser) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setLoginModalOpen(true);
          }
        }}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        onOpenPromotionKit={() => setPromoKitOpen(true)}
        telegramLink={systemSettings.telegramChannel}
      />

      {/* MODALS */}
      {/* 1. Registration Modal */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        services={systemSettings.services}
        preSelectedPlanId={preSelectedPlanId}
        preFilledSponsorId={preFilledSponsorId}
        onRegisterSuccess={handleRegisterSuccess}
        upiId={systemSettings.upiId}
        upiName={systemSettings.upiName}
      />

      {/* 2. Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setRegisterModalOpen(true);
        }}
      />

      {/* 3. Digital ID Card Popup Modal */}
      {idCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-4 sm:p-6 relative my-auto border border-slate-200">
            <button
              onClick={() => setIdCardModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 z-10"
            >
              ✕
            </button>
            <div className="pt-2">
              <DigitalIdCard
                user={currentUser}
                isOwner={true}
                onOpenRegister={() => {
                  setIdCardModalOpen(false);
                  setRegisterModalOpen(true);
                }}
                onOpenLogin={() => {
                  setIdCardModalOpen(false);
                  setLoginModalOpen(true);
                }}
                onSelectSponsor={(sId) => {
                  setPreFilledSponsorId(sId);
                  setIdCardModalOpen(false);
                  setRegisterModalOpen(true);
                }}
                onUpdateUser={(updated) => setCurrentUser(updated)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Admin Panel Modal */}
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        systemSettings={systemSettings}
        onUpdateSettings={(newSettings) => setSystemSettings(newSettings)}
      />

      {/* 5. Promotion Kit Modal */}
      <PromotionKitModal
        isOpen={promoKitOpen}
        onClose={() => setPromoKitOpen(false)}
        user={currentUser}
      />

      {/* 6. User Guideline Modal */}
      <UserGuidelineModal
        isOpen={guidelinesOpen}
        onClose={() => setGuidelinesOpen(false)}
        onOpenRegister={() => setRegisterModalOpen(true)}
      />
    </div>
  );
}
