import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Send,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Users,
  Briefcase,
  Lock,
  Globe,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Award,
} from 'lucide-react';
import { SystemSettings, PlanService } from '../types';
import { EmoLogo } from './EmoLogo';

export type PolicyTabType = 'about' | 'services' | 'contact' | 'faq' | 'privacy' | 'terms' | 'disclaimer';

interface LegalCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTabType;
  systemSettings: SystemSettings;
  onSelectPlan?: (planId: string) => void;
}

export const LegalCompanyModal: React.FC<LegalCompanyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
  systemSettings,
  onSelectPlan,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTabType>(initialTab);

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('प्लान व जॉइनिंग संबंधित प्रश्न');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Sync initial tab when reopened
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      setTimeout(() => setSendSuccess(false), 4000);
    }, 600);
  };

  const tabs: Array<{ id: PolicyTabType; label: string; icon: React.ReactNode }> = [
    { id: 'about', label: 'हमारे बारे में (About Us)', icon: <Building2 className="w-4 h-4" /> },
    { id: 'services', label: 'उत्पाद व सेवाएं (Services)', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'contact', label: 'संपर्क करें (Contact Us)', icon: <Mail className="w-4 h-4" /> },
    { id: 'privacy', label: 'गोपनीयता नीति (Privacy Policy)', icon: <Lock className="w-4 h-4" /> },
    { id: 'terms', label: 'नियम व शर्तें (Terms & Conditions)', icon: <FileText className="w-4 h-4" /> },
    { id: 'disclaimer', label: 'अस्वीकरण (Disclaimer)', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col border border-slate-200 max-h-[92vh]">
        {/* Modal Top Header with EmoneyO Rainbow Logo */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <EmoLogo variant="badge" size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg rainbow-text">EmoneyO</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  आधिकारिक कंपनी व कानूनी पोर्टल
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                EARN MONEY ONLINE • Official Company & Policy Information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 bg-slate-100 border-b border-slate-200 shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-950'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* ========================================================================= */}
          {/* TAB 1: हमारे बारे में (ABOUT US) */}
          {/* ========================================================================= */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Mission Banner */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>हमारा मिशन एवं परिचय (Our Vision & Mission)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  भारत के प्रत्येक नागरिक और युवा को डिजिटल व सोशल मीडिया द्वारा आर्थिक रूप से सक्षम बनाना
                </h3>
                <p className="mt-2 text-slate-700 font-medium leading-relaxed">
                  आज के आधुनिक दौर में हर व्यक्ति के पास स्मार्टफोन और इंटरनेट कनेक्शन मौजूद है। ज्यादातर लोग इसका उपयोग केवल मनोरंजन, सोशल मीडिया स्क्रॉल करने और गपशप में करते हैं। हमने देखा कि जब गिने-चुने लोग इंटरनेट से लाखों कमा सकते हैं, तो आम छात्र, गृहिणियां और युवा क्यों नहीं?
                </p>
                <p className="mt-2 text-slate-700 font-medium leading-relaxed">
                  इसी सोच के साथ हमने <strong>EmoneyO (EARN MONEY ONLINE)</strong> की नींव रखी। यह एक पारदर्शी, तकनीक-संचालित और <strong>AI सोशल नेटवर्किंग प्लेटफॉर्म</strong> है जो न्यूनतम ₹10 से शुरू होकर हर किसी को वास्तविक और प्रमाणित आय कमाने का अवसर देता है।
                </p>
              </div>

              {/* Founder Profile & Team Section */}
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>संस्थापक एवं नेतृत्व टीम (Founder & Management Team)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Founder Profile Card with Photo */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-start gap-4 hover:border-blue-300 transition-all">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-blue-600 to-indigo-600 p-0.5 shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80"
                          alt="Vikas Kumar"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-black text-slate-900 text-sm sm:text-base">विकास कुमार (Vikas Kumar)</h5>
                      </div>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                        संस्थापक एवं मुख्य कार्यकारी (Founder & CEO)
                      </p>
                      <p className="text-xs text-slate-600 leading-snug">
                        डिजिटल नेटवर्किंग, फिनटेक समाधान एवं कम्यूनिटी बिल्डिंग में 5+ वर्षों का अनुभव।
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <Mail className="w-3 h-3 text-blue-600" />
                        <span>newuserhelpline@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Support & Technical Team */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-start gap-4 hover:border-blue-300 transition-all">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-blue-600 p-0.5 shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80"
                          alt="EmoneyO Support Desk"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-black text-slate-900 text-sm sm:text-base">EmoneyO ऑपरेशंस व सपोर्ट टीम</h5>
                      <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                        24x7 वेरिफिकेशन व तकनीकी सुरक्षा डेस्क
                      </p>
                      <p className="text-xs text-slate-600 leading-snug">
                        सदस्यों के पेमेंट स्क्रीनशॉट की पुष्टि, मल्टी-डिवाइस सुरक्षा तथा टेलीग्राम सपोर्ट का निर्वहन।
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <Send className="w-3 h-3 text-sky-500" />
                        <span>@NEWUSERHELPLINE (Telegram)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
                  <h6 className="font-bold text-slate-900 text-xs">100% पारदर्शिता</h6>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    हर रुपये का हिसाब पारदर्शी लाइव कैलकुलेटर व डैशबोर्ड में दर्ज रहता है।
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Award className="w-5 h-5 text-amber-500 mb-1.5" />
                  <h6 className="font-bold text-slate-900 text-xs">विद्यार्थी-हितैषी</h6>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    माता-पिता के UPI से भुगतान प्राप्त करने की पूर्ण संवैधानिक व तकनीकी सुविधा।
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Lock className="w-5 h-5 text-indigo-600 mb-1.5" />
                  <h6 className="font-bold text-slate-900 text-xs">डेटा व गोपनीयता सुरक्षा</h6>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    मोबाइल नंबर और UPI हाइड करने का प्राइवेसी टॉगल फीचर आपके नियंत्रण में है।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: उत्पाद या सेवाएं (PRODUCTS & SERVICES) */}
          {/* ========================================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                  सर्विस कैटलॉग एवं मूल्य सूची (OFFICIAL PRICE LIST)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  EmoneyO की 2 प्रमुख सेवाएं और उनकी पूरी जानकारी
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  उपयोगकर्ताओं की विभिन्न क्षमताओं को ध्यान में रखते हुए दो अलग-अलग मॉडल्स तैयार किए गए हैं:
                </p>
              </div>

              {/* Service 1: Normal Earning */}
              <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-xl">
                      SERVICE 1
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      EmoneyO Normal Earning Service (डायरेक्ट डाउनलाइन कमाई)
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    प्रारंभिक स्तर
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  इस सेवा का मुख्य उद्देश्य कम से कम लागत में डिजिटल मार्केटिंग व रेफरल नेटवर्क सीखना है। इसमें आपके द्वारा सीधे जोड़े गए हर एक सदस्य पर निश्चित कमीशन तुरंत मिलता है।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Starter Plan</span>
                      <h5 className="font-black text-slate-900 text-sm">₹10 एकमुश्त</h5>
                      <div className="mt-2 text-xs space-y-1 text-slate-600 font-medium">
                        <p className="text-emerald-700 font-bold">• प्रति डाउनलाइन: ₹3</p>
                        <p>• 3D डिजिटल आईडी कार्ड</p>
                        <p>• प्रमोशन रेफरल लिंक</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('normal_10');
                      }}
                      className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ₹10 से चुनें
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Growth Plan</span>
                      <h5 className="font-black text-slate-900 text-sm">₹50 एकमुश्त</h5>
                      <div className="mt-2 text-xs space-y-1 text-slate-600 font-medium">
                        <p className="text-emerald-700 font-bold">• प्रति डाउनलाइन: ₹20 (40%)</p>
                        <p>• फास्ट वेरिफिकेशन</p>
                        <p>• लाइव चैट सपोर्ट</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('normal_50');
                      }}
                      className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ₹50 से चुनें
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between ring-1 ring-amber-400">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Super Pro (55% Return)</span>
                      <h5 className="font-black text-slate-900 text-sm">₹100 एकमुश्त</h5>
                      <div className="mt-2 text-xs space-y-1 text-slate-600 font-medium">
                        <p className="text-emerald-700 font-bold">• प्रति डाउनलाइन: ₹55</p>
                        <p>• सर्वाधिक मार्जिन रिटर्न</p>
                        <p>• वीआईपी अर्निंग किट</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('normal_100');
                      }}
                      className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ₹100 से चुनें
                    </button>
                  </div>
                </div>
              </div>

              {/* Service 2: Fast 3-Level Income */}
              <div className="bg-blue-50/70 rounded-3xl p-5 border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white font-black text-xs px-2.5 py-1 rounded-xl">
                      SERVICE 2
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      EmoneyO Fast Income Service (3-लेवल पैसिव टीम इनकम)
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
                    उच्च पैसिव आय
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  इस सेवा में केवल आपके डायरेक्ट रेफरल से ही नहीं, बल्कि उनकी टीम और आगे की टीम (3 स्तरों तक) से स्वतः निरंतर पैसिव आय प्राप्त होती है।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Silver Plan</span>
                      <h5 className="font-black text-slate-900 text-sm">₹100 एकमुश्त</h5>
                      <div className="mt-2 text-xs space-y-1 text-slate-600 font-medium">
                        <p className="text-emerald-700 font-bold">• Level-1: ₹30</p>
                        <p className="text-blue-700 font-bold">• Level-2: ₹10</p>
                        <p className="text-amber-700 font-bold">• Level-3: ₹5</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('fast_100');
                      }}
                      className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ₹100 Fast चुनें
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Gold Plan</span>
                      <h5 className="font-black text-slate-900 text-sm">₹500 एकमुश्त</h5>
                      <div className="mt-2 text-xs space-y-1 text-slate-600 font-medium">
                        <p className="text-emerald-700 font-bold">• Level-1: ₹150</p>
                        <p className="text-blue-700 font-bold">• Level-2: ₹75</p>
                        <p className="text-amber-700 font-bold">• Level-3: ₹25</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('fast_500');
                      }}
                      className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ₹500 Fast चुनें
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-blue-300 shadow-xs flex flex-col justify-between ring-1 ring-blue-500">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Platinum VIP</span>
                      <h5 className="font-black text-slate-900 text-sm">₹1000 एकमुश्त</h5>
                      <div className="mt-2 text-xs space-y-1 text-slate-600 font-medium">
                        <p className="text-emerald-700 font-bold">• Level-1: ₹400</p>
                        <p className="text-blue-700 font-bold">• Level-2: ₹150</p>
                        <p className="text-amber-700 font-bold">• Level-3: ₹50</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('fast_1000');
                      }}
                      className="mt-3 w-full py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ₹1000 Fast चुनें
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: संपर्क पेज (CONTACT US) */}
          {/* ========================================================================= */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                  आधिकारिक सहायता डेस्क (OFFICIAL HELPDESK)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  हमसे सीधे संपर्क करें (Contact Us)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  किसी भी तकनीकी समस्या, पेमेंट वेरिफिकेशन या जॉइनिंग सहायता हेतु हमारी सपोर्ट टीम 24 घंटे उपलब्ध है।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Official Contact Cards */}
                <div className="md:col-span-5 space-y-3">
                  {/* Telegram Card */}
                  <a
                    href={systemSettings.telegramChannel}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-2xl flex items-center gap-3.5 transition-all text-left block"
                  >
                    <div className="p-3 bg-sky-500 text-white rounded-xl shrink-0 shadow-sm">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">
                        ऑफिशियल टेलीग्राम लिंक
                      </span>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        @NEWUSERHELPLINE
                      </p>
                      <p className="text-[11px] text-sky-700 flex items-center gap-1 mt-0.5 font-medium">
                        <span>चैनल से जुड़ने हेतु टैप करें</span>
                        <ExternalLink className="w-3 h-3" />
                      </p>
                    </div>
                  </a>

                  {/* Email Card */}
                  <a
                    href={`mailto:${systemSettings.helplineEmail}`}
                    className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-3.5 transition-all text-left block"
                  >
                    <div className="p-3 bg-blue-600 text-white rounded-xl shrink-0 shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        ईमेल सहायता डेस्क
                      </span>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {systemSettings.helplineEmail}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        जवाब का समय: 2 से 4 घंटे
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp Support (if enabled) */}
                  {systemSettings.showWhatsApp && systemSettings.whatsAppNumber && (
                    <a
                      href={`https://wa.me/${systemSettings.whatsAppNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl flex items-center gap-3.5 transition-all text-left block"
                    >
                      <div className="p-3 bg-emerald-600 text-white rounded-xl shrink-0 shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                          WhatsApp सपोर्ट
                        </span>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">
                          +91 {systemSettings.whatsAppNumber}
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          डायरेक्ट चैट सहायता
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Office Address Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5">
                    <div className="p-3 bg-slate-700 text-white rounded-xl shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        पंजीकृत कार्यालय पता (Registered Office)
                      </span>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">
                        EmoneyO Technologies Network
                      </p>
                      <p className="text-[11px] text-slate-600 leading-snug mt-1">
                        प्लॉट सं. 42, डिजिटल हब टावर, गांधी मैदान रोड, पटना, बिहार - 800001 (भारत)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Message Form */}
                <div className="md:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <h4 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>सीधा मैसेज भेजें (Send Direct Message)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    फॉर्म भरें, हमारी सपोर्ट टीम आपसे तत्काल संपर्क करेगी।
                  </p>

                  {sendSuccess ? (
                    <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="font-bold text-sm">आपका संदेश सफलतापूर्वक प्राप्त हो गया है!</p>
                      <p className="text-xs">हमारी एडमिन टीम जल्द ही आपके ईमेल/टेलीग्राम पर उत्तर भेजेगी।</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">आपका नाम *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="जैसे: राहुल कुमार"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">ईमेल आईडी</label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">मोबाइल या WhatsApp नंबर</label>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="10 अंकों का नंबर"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">विषय (Subject)</label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        >
                          <option value="प्लान व जॉइनिंग संबंधित प्रश्न">प्लान व जॉइनिंग संबंधित प्रश्न</option>
                          <option value="पेमेंट स्क्रीनशॉट वेरिफिकेशन में देरी">पेमेंट स्क्रीनशॉट वेरिफिकेशन में देरी</option>
                          <option value="आईडी कार्ड डाउनलोड या पासवर्ड रिकवरी">आईडी कार्ड डाउनलोड या पासवर्ड रिकवरी</option>
                          <option value="अन्य सामान्य सहायता">अन्य सामान्य सहायता</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">संदेश (Message) *</label>
                        <textarea
                          required
                          rows={3}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="अपनी समस्या या प्रश्न यहाँ लिखें..."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSending}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSending ? 'संदेश भेजा जा रहा है...' : 'संदेश भेजें (Submit Message)'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: गोपनीयता नीति (PRIVACY POLICY & GOOGLE ADSENSE COMPLIANCE) */}
          {/* ========================================================================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                  कानूनी अनुपालन एवं सुरक्षा (LEGAL COMPLIANCE)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  गोपनीयता नीति (Privacy Policy)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  अंतिम नवीनीकरण तिथि: 2026-11-08 | EmoneyO सुरक्षा मानक
                </p>
              </div>

              <div className="space-y-3.5 leading-relaxed text-slate-700 text-xs sm:text-[13px]">
                <p>
                  <strong>EmoneyO (EARN MONEY ONLINE)</strong> ("हम", "हमारी वेबसाइट") पर अपने उपयोगकर्ताओं की गोपनीयता की रक्षा करना हमारी सर्वोच्च प्राथमिकता है। यह नीति स्पष्ट करती है कि जब आप हमारी वेबसाइट और सेवाओं का उपयोग करते हैं, तो आपकी कौन सी जानकारी एकत्रित, संसाधित और सुरक्षित की जाती है।
                </p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    1. हम कौन सा डेटा एकत्रित करते हैं (Information We Collect):
                  </h5>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li><strong>व्यक्तिगत विवरण:</strong> आपका नाम, ईमेल आईडी, मोबाइल नंबर तथा सुरक्षा प्रश्न का उत्तर (खाता रिकवरी हेतु)।</li>
                    <li><strong>भुगतान पहचान:</strong> आपकी UPI आईडी अथवा बैंक विवरण, ताकि आपके डाउनलाइन कमीशन का भुगतान सीधे आपके खाते में क्रेडिट किया जा सके।</li>
                    <li><strong>तकनीकी डेटा व कुकीज़:</strong> ब्राउज़र का प्रकार, ऑपरेटिंग सिस्टम (OS), डिवाइस मॉडल, लॉगिन समय तथा सुरक्षा टोकन (Multi-Device Login सुरक्षा के लिए)।</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    2. उपयोगकर्ता प्राइवेसी कंट्रोल (User Privacy Toggles):
                  </h5>
                  <p className="text-xs text-slate-600">
                    EmoneyO में प्रत्येक सदस्य को अपनी व्यक्तिगत जानकारी छुपाने का पूर्ण अधिकार दिया गया है। आप अपने डैशबोर्ड के 'Privacy Settings' में जाकर किसी भी समय अपना मोबाइल नंबर, ईमेल या UPI पता सार्वजनिक डिजिटल आईडी कार्ड से छुपा (Hide) सकते हैं।
                  </p>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2 text-amber-950">
                  <h5 className="font-bold text-amber-900 text-xs sm:text-sm">
                    3. गूगल एडसेंस व विज्ञापन कुकीज़ नीति (Google AdSense & Cookies Compliance):
                  </h5>
                  <p className="text-xs leading-relaxed">
                    हमारी वेबसाइट भविष्य में विज्ञापन प्रदर्शित करने हेतु <strong>Google AdSense</strong> तथा अन्य तृतीय-पक्ष (Third-party) विज्ञापनदाताओं का उपयोग कर सकती है:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Google, एक तृतीय-पक्ष विक्रेता के रूप में, हमारी साइट पर विज्ञापन दिखाने के लिए कुकीज़ (Cookies) का उपयोग करता है।</li>
                    <li>Google की <strong>DoubleClick DART कुकी</strong> का उपयोग उसे और उसके भागीदारों को हमारे उपयोगकर्ताओं को उनकी पिछली इंटरनेट गतिविधियों और वेबसाइट विज़िट के आधार पर प्रासंगिक विज्ञापन दिखाने में सक्षम बनाता है।</li>
                    <li>उपयोगकर्ता Google विज्ञापन और सामग्री नेटवर्क गोपनीयता नीति पर जाकर DART कुकी के उपयोग से ऑप्ट-आउट कर सकते हैं।</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    4. डेटा सुरक्षा एवं सुरक्षा प्रोटोकॉल (Data Security):
                  </h5>
                  <p className="text-xs text-slate-600">
                    हम आपके पासवर्ड को कभी भी किसी अन्य के सामने उजागर नहीं करते हैं। आपके पासवर्ड और सेशन को क्रिप्टोग्राफिक एल्गोरिद्म और मल्टी-डिवाइस ऑथेंटिकेशन द्वारा सुरक्षित रखा जाता है। हम आपका व्यक्तिगत डेटा किसी भी तृतीय-पक्ष को विपणन हेतु बेचते नहीं हैं।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: नियम और शर्तें (TERMS & CONDITIONS) */}
          {/* ========================================================================= */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                  वेबसाइट उपयोग की कानूनी शर्तें (TERMS OF SERVICE)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  नियम और शर्तें (Terms and Conditions)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  EmoneyO प्लेटफॉर्म के उपयोग हेतु बाध्यकारी नियम
                </p>
              </div>

              <div className="space-y-3.5 leading-relaxed text-slate-700 text-xs sm:text-[13px]">
                <p>
                  EmoneyO में पंजीकरण करने अथवा इसका उपयोग करने पर आप निम्नलिखित नियमों व शर्तों से पूर्णतया सहमत होते हैं:
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">1. खाता पंजीकरण एवं सत्यापन (Account Registration & Verification)</h5>
                  <p className="text-xs text-slate-600">
                    उपयोगकर्ता द्वारा दी गई सभी जानकारी (नाम, मोबाइल, ईमेल, और पेमेंट स्क्रीनशॉट) वास्तविक होनी चाहिए। फर्जी स्क्रीनशॉट या जाली भुगतान प्रमाण प्रस्तुत करने पर खाता तत्काल प्रभाव से हमेशा के लिए निलंबित (Ban) कर दिया जाएगा।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2. सेवा शुल्क व वापसी नीति (Non-Refundable Policy)</h5>
                  <p className="text-xs text-slate-600">
                    EmoneyO की Normal अथवा Fast Income सेवा में शामिल होने के लिए लिया जाने वाला शुल्क डिजिटल आईडी कार्ड निर्माण, AI नेटवर्किंग इंफ्रास्ट्रक्चर तथा रेफरल किट आवंटन के लिए है। एक बार खाता सत्यापित हो जाने के बाद यह शुल्क किसी भी परिस्थिति में वापस (Non-refundable) नहीं होगा।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3. आचार संहिता (Code of Conduct & Multi-Device Rules)</h5>
                  <p className="text-xs text-slate-600">
                    किसी भी सदस्य को अन्य सदस्यों के साथ अभद्र भाषा, स्पैमिंग अथवा भ्रामक प्रचार करने की अनुमति नहीं है। प्रत्येक सदस्य अपने एक्टिव डिवाइस सेशंस को अपने डैशबोर्ड से नियंत्रित कर सकता है। अनधिकृत उपकरण पाए जाने पर तुरंत 'अन्य सभी डिवाइस से लॉगआउट' विकल्प का प्रयोग करें।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">4. बौद्धिक संपदा अधिकार (Intellectual Property)</h5>
                  <p className="text-xs text-slate-600">
                    EmoneyO, इसके लोगो, 3D डिजिटल आईडी कार्ड डिज़ाइन, रेनबो टेक्स्ट एनिमेशन और प्लेटफॉर्म कोड का सर्वाधिकार सुरक्षित है। बिना अनुमति के इसकी नकल या पुनर्विक्रय अवैध माना जाएगा।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: अस्वीकरण (DISCLAIMER) */}
          {/* ========================================================================= */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
                  कानूनी अस्वीकरण (LEGAL DISCLAIMER)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  अस्वीकरण (Disclaimer)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  वित्तीय और तकनीकी पारदर्शिता हेतु महत्वपूर्ण सूचना
                </p>
              </div>

              <div className="space-y-3.5 leading-relaxed text-slate-700 text-xs sm:text-[13px]">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>कमाई का कोई निश्चित दावा नहीं (No Fixed Income Guarantee):</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    EmoneyO (EARN MONEY ONLINE) एक सोशल नेटवर्किंग और एफिलिएट/रेफरल आधारित डिजिटल प्लेटफॉर्म है। यह कोई "Get Rich Quick" (रातों-रात अमीर बनने वाली) या बैंक/सावधि जमा योजना नहीं है। आपकी वास्तविक आय आपकी अपनी मेहनत, सोशल मीडिया प्रचार, सही टीम निर्माण और डाउनलाइन सदस्यों की सक्रियता पर निर्भर करती है।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">स्वतंत्र निर्णय एवं जागरूकता</h5>
                  <p className="text-xs text-slate-600">
                    प्लेटफॉर्म में सम्मिलित होने से पूर्व अपनी आर्थिक क्षमता का स्वयं आकलन करें। न्यूनतम ₹10 से ₹1000 तक की सेवाएं स्वेच्छा से डिजिटल कौशल सीखने व अर्निंग करने हेतु हैं।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">तृतीय-पक्ष लिंक व विज्ञापन</h5>
                  <p className="text-xs text-slate-600">
                    हमारी वेबसाइट पर दिखने वाले बाहरी लिंक (जैसे टेलीग्राम या संभावित विज्ञापन) स्वतंत्र संस्थाओं द्वारा संचालित होते हैं। उनके उपयोग पर उनकी अपनी शर्तें लागू होती हैं।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar with Quick Switch */}
        <div className="p-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>EmoneyO Official Portal • सर्वाधिकार सुरक्षित</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 rounded-xl transition-all"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
