import React, { useState } from 'react';
import {
  X,
  LogIn,
  KeyRound,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../types';
import { EmoLogo } from './EmoLogo';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Forgot password & ID recovery mode
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [recoverIdentifier, setRecoverIdentifier] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [recoveredInfo, setRecoveredInfo] = useState<any>(null);
  const [recoverError, setRecoverError] = useState<string>('');
  const [isRecoverLoading, setIsRecoverLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('कृपया यूजर आईडी/ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoading(true);
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

      const data = await api.login({
        identifier: identifier.trim(),
        password: password.trim(),
        deviceInfo,
      });
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMessage(data.message || 'यूजर आईडी या पासवर्ड गलत है।');
      }
    } catch (err) {
      setErrorMessage('लॉगिन करने में समस्या आई। नेटवर्क जांचें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError('');
    setRecoveredInfo(null);
    if (!recoverIdentifier.trim() || !securityAnswer.trim()) {
      setRecoverError('कृपया ईमेल/मोबाइल और सुरक्षा उत्तर दर्ज करें।');
      return;
    }

    setIsRecoverLoading(true);
    try {
      const data = await api.recover({
        identifier: recoverIdentifier.trim(),
        securityAnswer: securityAnswer.trim().toLowerCase(),
      });
      if (data.success && data.recoveredInfo) {
        setRecoveredInfo(data.recoveredInfo);
      } else {
        setRecoverError(data.message || 'अकाउंट सत्यापन असफल रहा।');
      }
    } catch (err) {
      setRecoverError('रिकवरी में तकनीकी समस्या आई।');
    } finally {
      setIsRecoverLoading(false);
    }
  };

  const copyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <EmoLogo variant="badge" size={36} />
            <div>
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isRecovering ? 'आईडी व पासवर्ड रिकवरी' : 'EMO सदस्य लॉगिन'}
              </h2>
              <p className="text-[11px] text-blue-100 font-medium">
                {isRecovering ? 'डेटाबेस मिलान द्वारा खाता पुनर्प्राप्ति' : 'अपने व्यक्तिगत डैशबोर्ड में प्रवेश करें'}
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

        {/* Form Body */}
        <div className="p-5 sm:p-6">
          {!isRecovering ? (
            /* Standard Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  यूजर आईडी / रजिस्टर्ड ईमेल / मोबाइल नंबर
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. EMO10RK01 या 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    पासवर्ड
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecovering(true);
                      setErrorMessage('');
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="अपना पासवर्ड दर्ज करें"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'सत्यापित किया जा रहा है...' : 'डैशबोर्ड लॉगिन करें'}</span>
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-600">
                  क्या आपका अभी तक अकाउंट नहीं है?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToRegister();
                    }}
                    className="text-blue-600 font-extrabold hover:underline"
                  >
                    नया रजिस्ट्रेशन करें
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Forgot Password / ID Recovery Flow */
            <form onSubmit={handleRecover} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-amber-900 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  सुरक्षा सत्यापन: रजिस्ट्रेशन के समय दर्ज किया गया ईमेल/मोबाइल और सुरक्षा उत्तर दर्ज करें।
                </span>
              </div>

              {recoverError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{recoverError}</span>
                </div>
              )}

              {recoveredInfo ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>अकाउंट सफलतापूर्वक बरामद हुआ!</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-emerald-200">
                      <span className="text-slate-600 font-medium">मेंबर आईडी:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                        <span>{recoveredInfo.memberId}</span>
                        <button
                          type="button"
                          onClick={() => copyText(recoveredInfo.memberId)}
                          className="p-1 hover:bg-emerald-200 rounded text-emerald-800"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-emerald-200">
                      <span className="text-slate-600 font-medium">नाम:</span>
                      <span className="font-bold text-slate-900">{recoveredInfo.name}</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">पासवर्ड:</span>
                      <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        {recoveredInfo.password}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier(recoveredInfo.memberId);
                      setPassword(recoveredInfo.password);
                      setIsRecovering(false);
                      setRecoveredInfo(null);
                    }}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    इस जानकारी से लॉगिन करें
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      रजिस्टर्ड ईमेल या मोबाइल नंबर
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. rahul@gmail.com या 9876543210"
                      value={recoverIdentifier}
                      onChange={(e) => setRecoverIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      सुरक्षा उत्तर (पसंदीदा शहर या स्कूल का नाम)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="रजिस्ट्रेशन में दिया गया उत्तर"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRecovering(false)}
                      className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      वापस जाएं
                    </button>
                    <button
                      type="submit"
                      disabled={isRecoverLoading}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isRecoverLoading ? 'खोज रहे...' : 'आईडी/पासवर्ड खोजें'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
