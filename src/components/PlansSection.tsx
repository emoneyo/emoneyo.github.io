import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Shield,
  Layers,
  ArrowRight,
  Calculator,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PlanService } from '../types';

interface PlansSectionProps {
  services: PlanService[];
  onSelectPlan: (planId: string) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({
  services,
  onSelectPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'normal' | 'fast'>('normal');
  const [calculatorPlan, setCalculatorPlan] = useState<string>('normal_100');
  const [membersCount, setMembersCount] = useState<number>(10);

  const normalPlans = services.filter((s) => s.category === 'normal');
  const fastPlans = services.filter((s) => s.category === 'fast');

  // Calculate projected earnings for calculator
  const calculateEstimatedEarnings = () => {
    if (calculatorPlan === 'normal_10') return membersCount * 3;
    if (calculatorPlan === 'normal_50') return membersCount * 20;
    if (calculatorPlan === 'normal_100') return membersCount * 55;
    if (calculatorPlan === 'fast_100') {
      return membersCount * 30 + membersCount * 2 * 10 + membersCount * 4 * 5;
    }
    if (calculatorPlan === 'fast_500') {
      return membersCount * 150 + membersCount * 2 * 75 + membersCount * 4 * 25;
    }
    if (calculatorPlan === 'fast_1000') {
      return membersCount * 400 + membersCount * 2 * 150 + membersCount * 4 * 50;
    }
    return 0;
  };

  return (
    <section id="plans" className="w-full py-6 sm:py-10 px-3 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <span className="bg-blue-100 text-blue-700 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          ऑफिशियल अर्निंग सर्विसेज
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
          अपनी सुविधानुसार प्लान चुनें और कमाई शुरू करें
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
          EMO (Earn Money Online) दो अद्वितीय मॉडल्स प्रदान करता है - कम इन्वेस्टमेंट में तुरंत शुरुआत करें!
        </p>

        {/* Tab Switcher */}
        <div className="mt-5 inline-flex p-1.5 bg-slate-200/80 rounded-2xl shadow-inner gap-1">
          <button
            onClick={() => setActiveTab('normal')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
              activeTab === 'normal'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            1️⃣ EMO NORMAL SERVICE
          </button>
          <button
            onClick={() => setActiveTab('fast')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
              activeTab === 'fast'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-700 hover:text-amber-600'
            }`}
          >
            <Zap className="w-4 h-4" />
            2️⃣ EMO FAST INCOME (3 LEVELS)
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {(activeTab === 'normal' ? normalPlans : fastPlans).map((plan) => {
          const isPro = plan.price === 100 && plan.category === 'normal';
          const isPlatinum = plan.price === 1000;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 border-2 ${
                isPro || isPlatinum
                  ? 'border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : 'border-slate-200 shadow-md hover:shadow-lg'
              }`}
            >
              {(isPro || isPlatinum) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-yellow-200" />
                  सर्वाधिक लोकप्रिय (TOP CHOICE)
                </div>
              )}

              <div>
                {/* Title & Price */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {plan.category === 'normal' ? 'Normal Plan' : 'Fast 3-Level Plan'}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    इंस्टेंट एक्टिवेशन
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {plan.title}
                </h3>

                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-blue-700">₹{plan.price}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ एकमुश्त सर्विस चार्ज</span>
                </div>

                {/* Earnings Highlight Box */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl mb-4">
                  {plan.category === 'normal' ? (
                    <div>
                      <p className="text-xs text-blue-900 font-bold">प्रत्येक डाउनलाइन पर कमाई:</p>
                      <p className="text-xl font-black text-emerald-600 mt-0.5">
                        ₹{plan.perDownline} <span className="text-xs font-bold text-slate-600">प्रति रेफर</span>
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        {plan.price === 10 && 'सिर्फ ₹10 में सीखें और कमाएं!'}
                        {plan.price === 50 && 'शानदार 40% मार्जिन कमाई!'}
                        {plan.price === 100 && 'बंपर 55% का भारी रिटर्न!'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-blue-900 font-bold mb-1.5 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        3 लेवल में कमाई का विवरण:
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="bg-white p-1.5 rounded-xl border border-blue-100 shadow-xs">
                          <p className="text-[10px] text-slate-500 font-bold">LEVEL-1</p>
                          <p className="text-sm font-black text-emerald-600">
                            ₹{plan.levels?.[0]?.amount}
                          </p>
                        </div>
                        <div className="bg-white p-1.5 rounded-xl border border-blue-100 shadow-xs">
                          <p className="text-[10px] text-slate-500 font-bold">LEVEL-2</p>
                          <p className="text-sm font-black text-blue-600">
                            ₹{plan.levels?.[1]?.amount}
                          </p>
                        </div>
                        <div className="bg-white p-1.5 rounded-xl border border-blue-100 shadow-xs">
                          <p className="text-[10px] text-slate-500 font-bold">LEVEL-3</p>
                          <p className="text-sm font-black text-amber-600">
                            ₹{plan.levels?.[2]?.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Benefits List */}
                <ul className="space-y-2 mb-6">
                  {plan.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Join Button */}
              <button
                type="button"
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                  isPro || isPlatinum
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                <span>अभी ₹{plan.price} से जॉइन करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Income Calculator */}
      <div className="mt-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-blue-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              अनुमानित कमाई कैलकुलेटर (LIVE CALCULATOR)
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              देखें आप कितने सदस्यों को जोड़कर कितना कमा सकते हैं
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              नीचे प्लान और सदस्यों की संख्या चुनकर अपनी संभावित कमाई का अनुमान लगाएं।
            </p>

            {/* Plan selector & members slider */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-blue-200 uppercase">प्लान चुनें:</label>
                <select
                  value={calculatorPlan}
                  onChange={(e) => setCalculatorPlan(e.target.value)}
                  className="w-full mt-1 bg-blue-950/70 border border-blue-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                >
                  <optgroup label="EMO NORMAL PLANS">
                    <option value="normal_10">Normal ₹10 (₹3 / downline)</option>
                    <option value="normal_50">Normal ₹50 (₹20 / downline)</option>
                    <option value="normal_100">Normal ₹100 (₹55 / downline)</option>
                  </optgroup>
                  <optgroup label="EMO FAST PLANS (3 Levels)">
                    <option value="fast_100">Fast ₹100 (₹30 + ₹10 + ₹5)</option>
                    <option value="fast_500">Fast ₹500 (₹150 + ₹75 + ₹25)</option>
                    <option value="fast_1000">Fast ₹1000 (₹400 + ₹150 + ₹50)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] font-bold text-blue-200">
                  <span>रेफर किए गए सदस्य:</span>
                  <span className="text-amber-300 font-black text-sm">{membersCount} सदस्य</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={membersCount}
                  onChange={(e) => setMembersCount(parseInt(e.target.value))}
                  className="w-full mt-2 accent-amber-400 h-2 bg-blue-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Result Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[200px] shrink-0">
            <p className="text-xs text-blue-200 font-bold uppercase">संभावित अनुमानित कमाई</p>
            <p className="text-3xl sm:text-4xl font-black text-amber-300 mt-1">
              ₹{calculateEstimatedEarnings().toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-blue-200 mt-1">
              सीधे आपके UPI/बैंक खाते में
            </p>
            <button
              onClick={() => onSelectPlan(calculatorPlan)}
              className="mt-3 w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              इस प्लान से शुरू करें
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
