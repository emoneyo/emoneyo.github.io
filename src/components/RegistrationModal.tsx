import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  ShieldCheck,
  Upload,
  UserCheck,
  AlertCircle,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PlanService, User } from '../types';
import { AvatarCropper } from './AvatarCropper';
import { EmoLogo } from './EmoLogo';
import { api } from '../services/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: PlanService[];
  preSelectedPlanId?: string;
  preFilledSponsorId?: string;
  onRegisterSuccess: (newUser: User) => void;
  upiId: string;
  upiName: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  services,
  preSelectedPlanId,
  preFilledSponsorId,
  onRegisterSuccess,
  upiId,
  upiName,
}) => {
  // Form fields
  const [sponsorId, setSponsorId] = useState<string>(preFilledSponsorId || 'EMO10ADMIN01');
  const [sponsorVerifiedName, setSponsorVerifiedName] = useState<string>('EMO Official Head Office');
  const [isVerifyingSponsor, setIsVerifyingSponsor] = useState<boolean>(false);
  const [sponsorError, setSponsorError] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [accountHolderType, setAccountHolderType] = useState<'self' | 'parent'>('self');
  const [planId, setPlanId] = useState<string>(preSelectedPlanId || services[0]?.id || 'normal_10');
  const [securityQuestion, setSecurityQuestion] = useState<string>('पसंदीदा शहर या स्कूल का नाम');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  
  // Profile pic & Avatar cropper
  const [profilePic, setProfilePic] = useState<string>('');
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [avatarFrame, setAvatarFrame] = useState<'fire' | 'water' | 'gold' | 'classic'>('fire');
  const [personalQrLink, setPersonalQrLink] = useState<string>('');

  // Payment screenshot upload
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic payment QR code
  const [paymentQrDataUrl, setPaymentQrDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Selected plan object
  const selectedPlan = services.find((s) => s.id === planId) || services[0];

  // Update plan if prop changes
  useEffect(() => {
    if (preSelectedPlanId) setPlanId(preSelectedPlanId);
  }, [preSelectedPlanId]);

  // Update sponsor if prop changes
  useEffect(() => {
    if (preFilledSponsorId) {
      setSponsorId(preFilledSponsorId);
      checkSponsor(preFilledSponsorId);
    }
  }, [preFilledSponsorId]);

  // Generate UPI Payment QR Code when plan changes
  useEffect(() => {
    if (!selectedPlan) return;
    const amount = selectedPlan.price;
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=EMO%20Activation%20Plan%20${amount}`;

    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setPaymentQrDataUrl(url))
      .catch((err) => console.error('Error generating payment QR:', err));
  }, [selectedPlan, upiId, upiName]);

  // Check sponsor ID validity with backend
  const checkSponsor = async (idToCheck: string) => {
    const trimmed = idToCheck.trim().toUpperCase();
    if (!trimmed) {
      setSponsorVerifiedName('');
      setSponsorError('कृपया स्पॉन्सर आईडी दर्ज करें।');
      return;
    }
    setIsVerifyingSponsor(true);
    setSponsorError('');
    try {
      const data = await api.checkSponsor(trimmed);
      if (data.success && data.sponsor) {
        setSponsorVerifiedName(data.sponsor.name);
        setSponsorError('');
      } else {
        setSponsorVerifiedName('');
        setSponsorError(data.message || 'यह स्पॉन्सर आईडी मान्य नहीं है।');
      }
    } catch (err) {
      setSponsorError('स्पॉन्सर सत्यापन में समस्या आई।');
    } finally {
      setIsVerifyingSponsor(false);
    }
  };

  // Handle Payment Screenshot File Upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('फ़ाइल का आकार 8MB से कम होना चाहिए।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPaymentScreenshot(result);
        setScreenshotPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (sponsorError) {
      setErrorMessage('कृपया मान्य स्पॉन्सर आईडी का उपयोग करें।');
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !paymentAddress.trim()) {
      setErrorMessage('कृपया सभी आवश्यक फ़ील्ड (*) ध्यानपूर्वक भरें।');
      return;
    }
    if (!securityAnswer.trim()) {
      setErrorMessage('कृपया पासवर्ड रिकवरी के लिए सुरक्षा उत्तर (पसंदीदा शहर या स्कूल का नाम) अवश्य भरें।');
      return;
    }
    if (!paymentScreenshot) {
      setErrorMessage('पेमेंट स्क्रीनशॉट अपलोड करना अनिवार्य है। बिना पेमेंट स्क्रीनशॉट रजिस्ट्रेशन स्वीकार नहीं किया जाएगा।');
      return;
    }

    setIsSubmitting(true);
    try {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
      const isMac = /Macintosh/i.test(userAgent);
      const isWindows = /Windows/i.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      const osName = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMac ? 'macOS' : 'Linux/Other';
      const devType = isMobile ? 'mobile' : 'desktop';
      const devName = isMobile ? `${osName} Phone` : `${osName} Desktop`;

      let devId = localStorage.getItem('emo_device_id');
      if (!devId) {
        devId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem('emo_device_id', devId);
      }

      const deviceInfo = {
        deviceId: devId,
        deviceName: devName,
        deviceType: devType,
        browser: userAgent.includes('Chrome') ? 'Chrome Browser' : 'Mobile WebKit',
        os: osName,
        isCurrent: true,
      };

      const data = await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password.trim(),
        paymentAddress: paymentAddress.trim(),
        accountHolderType,
        planId,
        sponsorId: sponsorId.trim().toUpperCase(),
        securityQuestion,
        securityAnswer: securityAnswer.trim().toLowerCase(),
        profilePic,
        personalQrLink,
        avatarFrame,
        paymentScreenshot,
        deviceInfo,
      });

      if (data.success && data.user) {
        onRegisterSuccess(data.user);
        onClose();
      } else {
        setErrorMessage(data.message || 'रजिस्ट्रेशन असफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setErrorMessage('नेटवर्क त्रुटि: कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full my-auto overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <EmoLogo variant="badge" size={38} />
            <div>
              <h2 className="font-black text-base sm:text-lg leading-tight">
                EMO रजिस्ट्रेशन एवं सर्विस एक्टिवेशन
              </h2>
              <p className="text-[11px] text-blue-100 font-medium">
                सुरक्षित व आधिकारिक रजिस्ट्रेशन फॉर्म
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

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Sponsor Details Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                SUBMIT HERE YOUR SPONSOR DETAILS *
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                (बिना स्पॉन्सर के EMO10ADMIN01 मान्य)
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={sponsorId}
                onChange={(e) => {
                  setSponsorId(e.target.value.toUpperCase());
                  checkSponsor(e.target.value);
                }}
                placeholder="स्पॉन्सर आईडी दर्ज करें"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => checkSponsor(sponsorId)}
                className="px-3.5 py-2 bg-blue-100 text-blue-800 text-xs font-bold rounded-xl hover:bg-blue-200 transition-colors shrink-0"
              >
                {isVerifyingSponsor ? 'जांच रहे...' : 'वेरिफाई'}
              </button>
            </div>

            {sponsorVerifiedName && !sponsorError && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>सत्यापित स्पॉन्सर: {sponsorVerifiedName}</span>
              </div>
            )}
            {sponsorError && (
              <p className="text-xs text-rose-600 font-bold">{sponsorError}</p>
            )}
          </div>

          {/* 2. Personal Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              व्यक्तिगत विवरण (YOUR DETAILS)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पूरा नाम (YOUR NAME) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ईमेल पता (EMAIL ADDRESS) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="उदा. rahul@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाइल नंबर (MOBILE NUMBER) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  लॉगिन पासवर्ड (CREATE PASSWORD) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="मजबूत पासवर्ड बनाएं"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 3. WhatsApp Style Profile Photo & 3D Frame Selection */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                डिजिटल आईडी कार्ड प्रोफ़ाइल फोटो (WHATSAPP स्टाइल क्रॉप)
              </label>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md">
                ऐच्छिक (Optional)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                onClick={() => setShowCropper(true)}
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 cursor-pointer bg-white flex items-center justify-center shrink-0 shadow-md ${
                  avatarFrame === 'fire'
                    ? 'ring-2 ring-red-500'
                    : avatarFrame === 'gold'
                    ? 'ring-2 ring-amber-400'
                    : 'ring-2 ring-blue-500'
                }`}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
                  बदलें
                </div>
              </div>

              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => setShowCropper(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  {profilePic ? 'फोटो पुनः क्रॉप / एडजस्ट करें' : 'फोटो अपलोड करें (WhatsApp क्रॉप)'}
                </button>
                <p className="text-[11px] text-slate-500 mt-1">
                  यह फोटो आपके 3D डिजिटल आईडी कार्ड और डैशबोर्ड पर प्रदर्शित होगी।
                </p>
              </div>
            </div>

            {/* Frame Choice */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-700">3D फ्रेम:</span>
              <button
                type="button"
                onClick={() => setAvatarFrame('fire')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                  avatarFrame === 'fire' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-slate-700'
                }`}
              >
                🔥 Fire Ring
              </button>
              <button
                type="button"
                onClick={() => setAvatarFrame('gold')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                  avatarFrame === 'gold' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-700'
                }`}
              >
                👑 Gold Herd
              </button>
              <button
                type="button"
                onClick={() => setAvatarFrame('water')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                  avatarFrame === 'water' ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-white text-slate-700'
                }`}
              >
                💧 Water Ripple
              </button>
            </div>
          </div>

          {/* 4. Payment Address (Earnings Receipt Destination) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                YOUR PAYMENT ADDRESS (कमाई प्राप्त करने का पता) *
              </label>
            </div>

            {/* Parent account toggle */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="accType"
                  checked={accountHolderType === 'self'}
                  onChange={() => setAccountHolderType('self')}
                  className="accent-blue-600"
                />
                <span>मेरा स्वयं का UPI / खाता</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="accType"
                  checked={accountHolderType === 'parent'}
                  onChange={() => setAccountHolderType('parent')}
                  className="accent-blue-600"
                />
                <span>माता/पिता का UPI / बैंक खाता (विद्यार्थियों के लिए)</span>
              </label>
            </div>

            <input
              type="text"
              required
              placeholder="उदा. 8877490845@paytm, PHONEPE, GPAY या बैंक खाता विवरण"
              value={paymentAddress}
              onChange={(e) => setPaymentAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500">
              {accountHolderType === 'parent'
                ? 'यदि आपके पास अपना UPI नहीं है तो माता-पिता का UPI/बैंक दर्ज कर सकते हैं।'
                : 'आपकी डाउनलाइन आय इसी पते पर भेजी जाएगी।'}
            </p>
          </div>

          {/* 5. Service Activation Plan Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide">
              CHOOSE YOUR SERVICE ACTIVATION JOINING CHARGE *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setPlanId(s.id)}
                  className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    planId === s.id
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase">
                      {s.category === 'normal' ? 'Normal' : 'Fast 3-Lvl'}
                    </span>
                    <p className="text-xs font-black text-slate-900 leading-snug line-clamp-1">
                      {s.title}
                    </p>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-base font-black text-blue-700">₹{s.price}</span>
                    {s.perDownline && (
                      <span className="text-[10px] font-bold text-emerald-600">
                        +₹{s.perDownline}/DL
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Scan & Pay Selected Amount (Live UPI QR Code) */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-4 sm:p-5 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-300" />
                SCAN & PAY HERE YOUR SERVICE CHARGE
              </span>
              <span className="text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                राशि: ₹{selectedPlan?.price}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
              {paymentQrDataUrl && (
                <div className="bg-white p-2 rounded-2xl shrink-0 shadow-lg">
                  <img
                    src={paymentQrDataUrl}
                    alt="Payment QR"
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                  />
                  <p className="text-[10px] text-slate-800 font-extrabold text-center mt-1">
                    GPay / PhonePe / Paytm
                  </p>
                </div>
              )}

              <div className="flex-1 text-left space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">UPI आईडी:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                      title="UPI आईडी कॉपी करें"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase">प्राप्तकर्ता (Payee Name):</span>
                  <p className="font-bold text-white text-xs">{upiName}</p>
                </div>

                <div className="pt-1 text-[11px] text-amber-200 leading-tight">
                  ⚡ किसी भी UPI ऐप (PhonePe, Google Pay, Paytm, Bhim) से इस QR पर स्कैन करके ₹{selectedPlan?.price} का भुगतान करें और स्क्रीनशॉट नीचे अपलोड करें।
                </div>
              </div>
            </div>

            {/* 7. Upload Payment Screenshot */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                UPLOAD ACTIVATION CHARGE PAYMENT SCREENSHOT *
              </label>

              <div
                onClick={() => screenshotInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all ${
                  paymentScreenshot
                    ? 'border-emerald-400 bg-emerald-950/30'
                    : 'border-slate-500 hover:border-amber-400 bg-white/5'
                }`}
              >
                {screenshotPreview ? (
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={screenshotPreview}
                      alt="Payment Screenshot Preview"
                      className="h-16 w-16 object-cover rounded-xl border border-white/20"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        स्क्रीनशॉट अपलोड हो गया!
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        दूसरा स्क्रीनशॉट चुनने के लिए क्लिक करें
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Upload className="w-6 h-6 text-amber-300 mb-1" />
                    <p className="text-xs font-bold text-white">
                      भुगतान का स्क्रीनशॉट यहाँ अपलोड करें
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG (अधिकतम 8MB) - एडमिन वेरिफिकेशन हेतु अनिवार्य
                    </p>
                  </div>
                )}
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotChange}
                />
              </div>
            </div>
          </div>

          {/* 8. Security Question for Password & ID Recovery */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <label className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                सुरक्षा प्रश्न (आईडी व पासवर्ड रिकवरी के लिए) *
              </label>
            </div>
            <p className="text-[11px] text-amber-800">
              यदि आप कभी अपना पासवर्ड या मेंबर आईडी भूल जाएं, तो इस सुरक्षा उत्तर से तुरंत रिकवर कर सकेंगे:
            </p>
            <div>
              <span className="text-[11px] font-bold text-slate-600">प्रश्न: पसंदीदा शहर या स्कूल का नाम?</span>
              <input
                type="text"
                required
                placeholder="उदा. Patna, Delhi, DAV Public School..."
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl shadow-blue-500/25 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>रजिस्ट्रेशन एवं स्क्रीनशॉट सबमिट हो रहा है...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>SUBMIT YOUR REGISTRATION FORM NOW</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Avatar Cropper Modal Overlay */}
      {showCropper && (
        <AvatarCropper
          initialImage={profilePic}
          onCropComplete={(dataUrl) => {
            setProfilePic(dataUrl);
            setShowCropper(false);
          }}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};
