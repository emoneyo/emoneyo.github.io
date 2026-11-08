import React from 'react';
import { X, BookOpen, CheckCircle, Shield, Award, Users, QrCode, Sparkles } from 'lucide-react';

interface UserGuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
}

export const UserGuidelineModal: React.FC<UserGuidelineModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col border border-slate-200 max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h3 className="font-black text-sm sm:text-base">
              EMO उपयोगकर्ता मार्गदर्शिका (User Guidelines)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 font-medium">
          {/* Step 1 */}
          <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 space-y-1">
            <h4 className="font-black text-blue-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
              नए उपयोगकर्ताओं के लिए (New User Guide):
            </h4>
            <p>
              • अपनी आवश्यकतानुसार EMO Normal (₹10/₹50/₹100) या EMO Fast (₹100/₹500/₹1000) प्लान चुनें।<br />
              • फॉर्म में अपना नाम, ईमेल, मोबाइल नंबर, और भुगतान प्राप्ति का UPI आईडी दर्ज करें।<br />
              • दिए गए UPI QR कोड पर फीस का भुगतान करके स्पष्ट स्क्रीनशॉट अपलोड करें।<br />
              • WhatsApp स्टाइल में अपनी प्रोफ़ाइल फोटो को 3D फ्रेम (Fire/Water/Gold) के साथ सेट करें।
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
            <h4 className="font-black text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
              सत्यापन एवं रेफरल शुरुआत (Verification & Earning):
            </h4>
            <p>
              • रजिस्ट्रेशन के उपरांत एडमिन द्वारा आपका पेमेंट स्क्रीनशॉट 10 से 30 मिनट में वेरीफाई किया जाता है।<br />
              • वेरीफाई होते ही आपके डैशबोर्ड में रेफरल लिंक और प्रमोशन किट अनलॉक हो जाती है।<br />
              • अपने दोस्तों को लिंक शेयर करें और प्रत्येक सफल जॉइनिंग पर सीधी कमीशन पाएं।
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-1">
            <h4 className="font-black text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              3D डिजिटल पहचान पत्र (Digital ID Card Rules):
            </h4>
            <p>
              • आईडी कार्ड पर आपका अनूठा मेंबर आईडी (जैसे EMO10RK01) और जॉइनिंग QR कोड उपलब्ध होता है।<br />
              • आप अपना स्वयं का कार्ड उच्च गुणवत्ता वाले PNG फॉर्मेट में डाउनलोड कर सकते हैं।<br />
              • सुरक्षा नीति के अंतर्गत किसी अन्य सदस्य या स्पॉन्सर का कार्ड डाउनलोड नहीं किया जा सकता।
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">4</span>
              आईडी व पासवर्ड सुरक्षा (Account Security):
            </h4>
            <p>
              • अपनी मेंबर आईडी और पासवर्ड को किसी के साथ साझा न करें।<br />
              • पासवर्ड भूल जाने पर रजिस्ट्रेशन के समय दिए गए सुरक्षा उत्तर से तुरंत रीसेट करें।<br />
              • किसी भी तकनीकी सहायता के लिए डैशबोर्ड के "एडमिन हेल्प चैट" या आधिकारिक ईमेल newuserhelpline@gmail.com पर संपर्क करें।
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          {onOpenRegister && (
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              रजिस्ट्रेशन शुरू करें
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl ml-auto"
          >
            समझ गया
          </button>
        </div>
      </div>
    </div>
  );
};
