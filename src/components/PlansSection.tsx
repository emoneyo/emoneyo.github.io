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
  Users,
  ChevronRight,
  Info,
  DollarSign,
  Plus,
  Minus,
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

  // Realistic transparent calculator states
  const [calculatorPlan, setCalculatorPlan] = useState<string>('fast_100');
  const [level1Count, setLevel1Count] = useState<number>(5); // Direct downlines
  const [level2PerDirect, setLevel2PerDirect] = useState<number>(3); // Each direct refers X
  const [level3PerLevel2, setLevel3PerLevel2] = useState<number>(2); // Each level-2 refers Y

  const normalPlans = services.filter((s) => s.category === 'normal');
  const fastPlans = services.filter((s) => s.category === 'fast');

  // Exact plan lookup and real rate calculations
  const selectedPlanData = services.find((s) => s.id === calculatorPlan) || services[0];
  const isFastPlan = selectedPlanData.category === 'fast';

  // Exact 3-Level Math Breakdown
  // Rates:
  // Normal Plans: Direct only (Level 1)
  //   ₹10: ₹3 / member
  //   ₹50: ₹20 / member
  //   ₹100: ₹55 / member
  // Fast Plans: 3 Levels
  //   ₹100: L1: ₹30, L2: ₹10, L3: ₹5
  //   ₹500: L1: ₹150, L2: ₹75, L3: ₹25
  //   ₹1000: L1: ₹400, L2: ₹150, L3: ₹50

  let rateL1 = 0;
  let rateL2 = 0;
  let rateL3 = 0;

  if (calculatorPlan === 'normal_10') {
    rateL1 = 3;
  } else if (calculatorPlan === 'normal_50') {
    rateL1 = 20;
  } else if (calculatorPlan === 'normal_100') {
    rateL1 = 55;
  } else if (calculatorPlan === 'fast_100') {
    rateL1 = 30;
    rateL2 = 10;
    rateL3 = 5;
  } else if (calculatorPlan === 'fast_500') {
    rateL1 = 150;
    rateL2 = 75;
    rateL3 = 25;
  } else if (calculatorPlan === 'fast_1000') {
    rateL1 = 400;
    rateL2 = 150;
    rateL3 = 50;
  }

  // Exact count of members at each level
  const countL1 = Math.max(0, level1Count);
  const countL2 = isFastPlan ? countL1 * Math.max(0, level2PerDirect) : 0;
  const countL3 = isFastPlan ? countL2 * Math.max(0, level3PerLevel2) : 0;

  // Exact earnings
  const incomeL1 = countL1 * rateL1;
  const incomeL2 = countL2 * rateL2;
  const incomeL3 = countL3 * rateL3;
  const totalIncome = incomeL1 + incomeL2 + incomeL3;
  const totalTeamCount = countL1 + countL2 + countL3;

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
          EmoneyO (EARN MONEY ONLINE) दो अद्वितीय मॉडल्स प्रदान करता है - कम इन्वेस्टमेंट में तुरंत शुरुआत करें!
        </p>

        {/* Category Tabs: Normal vs Fast */}
        <div className="mt-6 inline-flex p-1 bg-slate-200/80 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('normal')}
            className={`flex items-center gap-2 py-2 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all ${
              activeTab === 'normal'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>1️⃣ NORMAL EARNING SERVICE</span>
          </button>
          <button
            onClick={() => setActiveTab('fast')}
            className={`flex items-center gap-2 py-2 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all ${
              activeTab === 'fast'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span>2️⃣ FAST INCOME (3-LEVEL) SERVICE</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {(activeTab === 'normal' ? normalPlans : fastPlans).map((plan) => {
          const isPro = plan.id === 'normal_100';
          const isPlatinum = plan.id === 'fast_1000';

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                isPro || isPlatinum
                  ? 'border-amber-400 shadow-amber-500/10 ring-2 ring-amber-400/30'
                  : 'border-slate-200 shadow-md'
              }`}
            >
              {(isPro || isPlatinum) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  सर्वाधिक लोकप्रिय (TOP RECOMMENDED)
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {plan.category === 'normal' ? 'Normal Plan' : '3-Level Fast Plan'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {plan.category === 'normal' ? 'डायरेक्ट इनकम' : '3-Level Team Income'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                  {plan.title}
                </h3>

                <div className="my-3 flex items-baseline gap-1">
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
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">
                        {plan.price === 10 && 'सिर्फ ₹10 में सीखें और डाउनलाइन पर ₹3 कमाएं!'}
                        {plan.price === 50 && 'शानदार ₹20 मार्जिन (40% सीधा मुनाफा)!'}
                        {plan.price === 100 && 'बंपर ₹55 मार्जिन (55% सीधा भारी रिटर्न)!'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-blue-900 font-bold mb-1.5 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        3 लेवल में सटीक प्रति-सदस्य कमाई:
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

      {/* ========================================================================= */}
      {/* 100% REAL LIVE INCOME CALCULATOR (100% सटीक 3-लेवल गणित एवं विस्तृत विवरण) */}
      {/* ========================================================================= */}
      <div className="mt-10 bg-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-slate-700 relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>100% रियल लाइव इनकम कैलकुलेटर (REAL CALCULATION ENGINE)</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black mt-2 tracking-tight">
                प्लान के अनुसार <span className="rainbow-text">सटीक व पारदर्शी कमाई</span> का हिसाब
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
                यह कोई काल्पनिक अनुमान नहीं, बल्कि EmoneyO के आधिकारिक प्लान नियमों के अनुसार तैयार किया गया 100% सटीक गणित है।
              </p>
            </div>

            {/* Plan Selector Pill */}
            <div className="shrink-0 bg-slate-800/90 p-2 rounded-2xl border border-slate-700">
              <label className="text-[11px] font-black text-amber-300 block mb-1 uppercase tracking-wide">
                प्लान चुनें:
              </label>
              <select
                value={calculatorPlan}
                onChange={(e) => setCalculatorPlan(e.target.value)}
                className="bg-slate-900 text-white font-bold text-xs rounded-xl px-3 py-2 border border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer w-full"
              >
                <optgroup label="⚡ 1️⃣ NORMAL EARNING PLANS (डायरेक्ट डाउनलाइन)">
                  <option value="normal_10">Normal Starter ₹10 (₹3 / डाउनलाइन)</option>
                  <option value="normal_50">Normal Growth ₹50 (₹20 / डाउनलाइन)</option>
                  <option value="normal_100">Normal Pro ₹100 (₹55 / डाउनलाइन - 55% मार्जिन)</option>
                </optgroup>
                <optgroup label="🚀 2️⃣ FAST INCOME PLANS (3-लेवल टीम इनकम)">
                  <option value="fast_100">Fast Silver ₹100 (L1: ₹30 | L2: ₹10 | L3: ₹5)</option>
                  <option value="fast_500">Fast Gold ₹500 (L1: ₹150 | L2: ₹75 | L3: ₹25)</option>
                  <option value="fast_1000">Fast Platinum ₹1000 (L1: ₹400 | L2: ₹150 | L3: ₹50)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Interactive Controls & Team Multiplier */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Controls: Sliders and Level explanation */}
            <div className="lg:col-span-7 space-y-5">
              {/* Level 1 Direct Slider */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">
                        Level-1: आपके सीधे (Direct) जोड़े गए सदस्य
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        जिन्होंने आपके रेफरल कोड से सीधे रजिस्ट्रेशन किया
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-black text-base sm:text-lg">
                      {countL1} सदस्य
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      (₹{rateL1} / सदस्य)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLevel1Count((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={level1Count}
                    onChange={(e) => setLevel1Count(parseInt(e.target.value) || 1)}
                    className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <button
                    onClick={() => setLevel1Count((prev) => Math.min(100, prev + 1))}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fast Plan Level 2 & Level 3 Controls */}
              {isFastPlan ? (
                <>
                  {/* Level 2 Control */}
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center border border-blue-500/40">
                          2
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            Level-2: प्रत्येक डायरेक्ट मेंबर आगे कितने लोगों को जोड़ता है?
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {countL1} direct × {level2PerDirect} = <strong className="text-blue-300">{countL2} सदस्य</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-blue-400 font-black text-base sm:text-lg">
                          {level2PerDirect} प्रति व्यक्ति
                        </span>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          (₹{rateL2} / सदस्य)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setLevel2PerDirect((prev) => Math.max(0, prev - 1))}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={level2PerDirect}
                        onChange={(e) => setLevel2PerDirect(parseInt(e.target.value) || 0)}
                        className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-400"
                      />
                      <button
                        onClick={() => setLevel2PerDirect((prev) => Math.min(30, prev + 1))}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Level 3 Control */}
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40">
                          3
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            Level-3: Level-2 का हर सदस्य आगे कितने लोगों को जोड़ता है?
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {countL2} सदस्य × {level3PerLevel2} = <strong className="text-amber-300">{countL3} सदस्य</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-400 font-black text-base sm:text-lg">
                          {level3PerLevel2} प्रति व्यक्ति
                        </span>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          (₹{rateL3} / सदस्य)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setLevel3PerLevel2((prev) => Math.max(0, prev - 1))}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        value={level3PerLevel2}
                        onChange={(e) => setLevel3PerLevel2(parseInt(e.target.value) || 0)}
                        className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                      <button
                        onClick={() => setLevel3PerLevel2((prev) => Math.min(25, prev + 1))}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
                  <p className="font-bold flex items-center gap-1.5 text-blue-300 mb-1">
                    <Info className="w-4 h-4 text-blue-400" />
                    नॉर्मल सर्विस में केवल डायरेक्ट डाउनलाइन कमाई होती है:
                  </p>
                  <p className="leading-relaxed">
                    इस प्लान में आपको केवल सीधे जोड़े गए सदस्यों से <strong>₹{rateL1}</strong> प्रति व्यक्ति प्राप्त होता है। 3-लेवल पैसिव टीम इनकम कमाने के लिए ऊपर दिए गए <strong>FAST INCOME PLANS</strong> को चुनें!
                  </p>
                </div>
              )}
            </div>

            {/* Right Summary Board: Exact Itemized Calculation */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-950 rounded-3xl p-5 sm:p-6 border-2 border-slate-600 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    प्लान का नाम:
                  </span>
                  <span className="text-xs font-black text-amber-300 text-right">
                    {selectedPlanData.title}
                  </span>
                </div>

                {/* Level-by-Level Breakdown */}
                <div className="my-4 space-y-2.5">
                  {/* Level 1 item */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                        L1
                      </span>
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">
                          Level-1 ({countL1} सदस्य)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {countL1} × ₹{rateL1}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      = ₹{incomeL1.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Level 2 item (Fast plans only) */}
                  {isFastPlan && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                          L2
                        </span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-white block">
                            Level-2 ({countL2} सदस्य)
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {countL2} × ₹{rateL2}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-blue-400 font-mono">
                        = ₹{incomeL2.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {/* Level 3 item (Fast plans only) */}
                  {isFastPlan && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                          L3
                        </span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-white block">
                            Level-3 ({countL3} सदस्य)
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {countL3} × ₹{rateL3}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-amber-400 font-mono">
                        = ₹{incomeL3.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Team stats pill */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 py-2 border-t border-slate-700/60">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    कुल टीम सदस्य संख्या:
                  </span>
                  <span className="font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    {totalTeamCount} सदस्य
                  </span>
                </div>
              </div>

              {/* Total Income Big Display */}
              <div className="mt-4 pt-4 border-t-2 border-slate-700/80 text-center">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  सटीक कुल कमाई (REAL TOTAL EARNINGS)
                </span>
                <div className="text-3xl sm:text-5xl font-black text-white mt-1 font-mono tracking-tight flex items-center justify-center gap-1">
                  <span className="text-amber-400">₹</span>
                  <span className="rainbow-text">{totalIncome.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  {isFastPlan
                    ? `(Level-1: ₹${incomeL1} + Level-2: ₹${incomeL2} + Level-3: ₹${incomeL3})`
                    : `(सीधे ${countL1} डाउनलाइन × ₹${rateL1} = ₹${incomeL1})`}
                </p>

                {/* Direct Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectPlan(calculatorPlan)}
                  className="mt-5 w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  <span>इस प्लान (₹{selectedPlanData.price}) से अभी जुड़ें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
