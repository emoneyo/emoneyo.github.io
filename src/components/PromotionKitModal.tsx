import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  MessageCircle,
  Download,
} from 'lucide-react';
import { User } from '../types';
import { EmoLogo } from './EmoLogo';

interface PromotionKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const PromotionKitModal: React.FC<PromotionKitModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const memberId = user?.memberId || 'EMO10ADMIN01';
  const referralLink = `${window.location.origin}?ref=${memberId}`;

  const copyTemplate = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const templates = [
    {
      title: 'व्हाट्सप्प स्टेटस व शॉर्ट मेसेज (हिंदी)',
      category: 'WhatsApp Status',
      text: `🚨🚨🚨 Attention Everybody 🚨🚨🚨
आ गया पैसा कमाने के लिए ऑनलाइन का बेस्ट तरीका!
अब कोई भी कमा सकता है घर बैठे कम समय में ज्यादा से ज्यादा पैसा।
जब गिने चुने लोग कमा सकते हैं तो आप क्यों नहीं!

⭐ 1️⃣ EMO NORMAL EARNING SERVICE:
• ₹10 से जॉइनिंग ➔ प्रत्येक डाउनलाइन पर ₹3!
• ₹50 से जॉइनिंग ➔ प्रत्येक डाउनलाइन पर ₹20!
• ₹100 से जॉइनिंग ➔ प्रत्येक डाउनलाइन पर ₹55 (55% रिटर्न)!

⭐ 2️⃣ EMO FAST INCOME SERVICE (3 LEVEL तक कमाई):
• ₹100 प्लान ➔ Level-1: ₹30 | Level-2: ₹10 | Level-3: ₹5
• ₹500 प्लान ➔ Level-1: ₹150 | Level-2: ₹75 | Level-3: ₹25
• ₹1000 प्लान ➔ Level-1: ₹400 | Level-2: ₹150 | Level-3: ₹50

👉 मेरे साथ अभी जुड़ें:
स्पॉन्सर आईडी: ${memberId}
जॉइनिंग लिंक: ${referralLink}
तुरंत रजिस्टर करें और अपनी कमाई की यात्रा शुरू करें! 🚀`,
    },
    {
      title: 'विद्यार्थियों के लिए स्पेशल मैसेज (Student Friendly)',
      category: 'Students / College',
      text: `🎓 क्या आप भी पढ़ाई के साथ-साथ ऑनलाइन पॉकेट मनी कमाना चाहते हैं?
आज सबके पास मोबाइल और इंटरनेट है, तो इसका सही इस्तेमाल करके पैसे कमाएं!

EMO (Earn Money Online) लाया है केवल ₹10 से शुरू होने वाली कमाई:
✅ कोई भारी इनवेस्टमेंट नहीं
✅ माता-पिता का UPI खाता भी मान्य
✅ 3D डिजिटल आईडी कार्ड तुरंत
✅ 100% सुरक्षित और डायरेक्ट पेआउट

जॉइनिंग लिंक: ${referralLink}
स्पॉन्सर आईडी: ${memberId}
अभी जुड़ें और आज ही अर्न करें! 💸`,
    },
    {
      title: 'टेलीग्राम व सोशल मीडिया डिटेल पोस्ट',
      category: 'Telegram Channel',
      text: `🔥 EMO SOCIAL NETWORKING AI - EARN MONEY ONLINE 🔥

AI और सोशल मीडिया के माध्यम से नेटवर्क बनाकर कमाई करने का नंबर-1 प्लेटफॉर्म!
EMO NORMAL और FAST 3-LEVEL सेवाओं के साथ अपनी पैसिव इनकम बनाएं।

डायरेक्ट रजिस्ट्रेशन लिंक:
${referralLink}

सत्यापित स्पॉन्सर: ${memberId}
हेल्पलाइन: newuserhelpline@gmail.com
आज ही टीम का हिस्सा बनें! ✨`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col border border-slate-200 max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                EMO प्रमोशन किट व सोशल मीडिया पोस्टर
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                1-क्लिक शेयर और कॉपी-पेस्ट रेडी संदेश
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Shareable Banner Mock */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-5 border-2 border-amber-400 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <EmoLogo variant="idcard" />
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                OFFICIAL PROMO
              </span>
            </div>

            <div className="my-4 text-center">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                कम इनवेस्टमेंट में ज्यादा कमाई का अवसर
              </p>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                घर बैठे सोशल मीडिया से पैसा कमाएं
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                <span className="text-xs text-slate-300">स्पॉन्सर आईडी:</span>
                <span className="font-mono font-black text-amber-300 text-sm">{memberId}</span>
              </div>
            </div>

            <div className="border-t border-white/15 pt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>EMO NORMAL & FAST 3-LEVEL INCOME</span>
              <span>100% VERIFIED PLATFORM</span>
            </div>
          </div>

          {/* Promotional Text Templates */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              कॉपी करने हेतु रेडी-टू-शेयर संदेश (Click to Copy):
            </h4>

            {templates.map((tpl, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                    {tpl.title}
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                    {tpl.category}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                  {tpl.text}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(tpl.text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <button
                    onClick={() => copyTemplate(tpl.text, i)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
                  >
                    {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === i ? 'कॉपी हो गया!' : 'टेक्स्ट कॉपी करें'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
