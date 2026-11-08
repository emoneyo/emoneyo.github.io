import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'EMO (Earn Money Online) क्या है और यह कैसे काम करता है?',
      a: 'EMO एक आधुनिक सोशल नेटवर्किंग और अर्निंग प्लेटफॉर्म है जो आर्टिफिशल इंटेलिजेंस (AI) और सोशल मीडिया के जरिए आम लोगों व छात्रों को घर बैठे पैसा कमाने में सहायता करता है। इसमें Normal Earning और Fast Income 3-Level सेवाएं उपलब्ध हैं।',
    },
    {
      q: 'EMO Normal Earning Service में कितनी कमाई होती है?',
      a: 'EMO Normal Earning Service में आप ₹10, ₹50 या ₹100 से जुड़ सकते हैं। ₹10 वाले प्लान में प्रत्येक डाउनलाइन पर ₹3, ₹50 वाले प्लान में ₹20, और ₹100 वाले प्लान में प्रत्येक डाउनलाइन पर ₹55 (55% सीधा मार्जिन) प्राप्त होता है।',
    },
    {
      q: 'EMO Fast Income Service में 3-Level इनकम कैसे मिलती है?',
      a: 'Fast Income सर्विस में आपको 3 लेवल तक पैसिव इनकम मिलती है:\n• ₹100 प्लान: Level-1 से ₹30, Level-2 से ₹10, Level-3 से ₹5\n• ₹500 प्लान: Level-1 से ₹150, Level-2 से ₹75, Level-3 से ₹25\n• ₹1000 प्लान: Level-1 से ₹400, Level-2 से ₹150, Level-3 से ₹50',
    },
    {
      q: 'क्या विद्यार्थी अपने माता-पिता के UPI या बैंक खाते का उपयोग कर सकते हैं?',
      a: 'हाँ, बिल्कुल! यदि आपके पास स्वयं का बैंक खाता या UPI नहीं है, तो रजिस्ट्रेशन करते समय "माता/पिता का UPI / बैंक खाता" विकल्प चुनकर उनके खाते में अपनी कमाई प्राप्त कर सकते हैं।',
    },
    {
      q: 'रजिस्ट्रेशन के बाद रेफरल लिंक कब एक्टिवेट होता है?',
      a: 'सुरक्षा और पारदर्शिता बनाए रखने के लिए, जब आप अपना पेमेंट स्क्रीनशॉट अपलोड करते हैं, तो एडमिन द्वारा उसे वेरीफाई करने के बाद आपका व्यक्तिगत रेफरल लिंक तुरंत एक्टिवेट हो जाता है।',
    },
    {
      q: 'यदि मैं अपनी यूजर आईडी या पासवर्ड भूल जाऊं तो क्या करूं?',
      a: 'आप लॉगिन पेज पर "पासवर्ड भूल गए?" पर क्लिक करें और रजिस्ट्रेशन के समय दिया गया सुरक्षा उत्तर (पसंदीदा शहर या स्कूल का नाम) दर्ज करें। आपका पासवर्ड और मेंबर आईडी तुरंत स्क्रीन पर प्रदर्शित हो जाएगी।',
    },
    {
      q: '3D डिजिटल आईडी कार्ड कैसे डाउनलोड करें?',
      a: 'आप डैशबोर्ड या आईडी कार्ड सेक्शन में जाकर "प्रीमियम आईडी कार्ड डाउनलोड करें (PNG)" बटन पर क्लिक करके अपना 3D डिजिटल पहचान पत्र (Fire, Water या Gold फ्रेम के साथ) उच्च गुणवत्ता में डाउनलोड कर सकते हैं। सुरक्षा कारणों से केवल अपना व्यक्तिगत कार्ड ही डाउनलोड किया जा सकता है।',
    },
  ];

  return (
    <section id="faq" className="w-full py-8 sm:py-12 px-3 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <span className="bg-blue-100 text-blue-700 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          सामान्य प्रश्नोत्तरी (FAQ)
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          अक्सर पूछे जाने वाले सवाल (Frequently Asked Questions)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
          EMO प्लेटफॉर्म से संबंधित आपके सभी प्रश्नों के स्पष्ट और आधिकारिक उत्तर
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 whitespace-pre-line font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
