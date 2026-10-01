import React, { useState } from 'react';
import { NutritionTipRecord } from '../types/fitness';
import { Apple, Sparkles, CheckCircle2, ShieldCheck, Droplets, Moon, Coffee } from 'lucide-react';

interface NutritionTipViewProps {
  nutritionTip: NutritionTipRecord;
}

export const NutritionTipView: React.FC<NutritionTipViewProps> = ({ nutritionTip }) => {
  const [checkedItems, setCheckedItems] = useState<{ [index: number]: boolean }>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'hydration':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'sleep':
      case 'recovery':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      default:
        return <Apple className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                {getCategoryIcon(nutritionTip.category)}
              </span>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Today's Nutrition & Recovery Tip &bull; {nutritionTip.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                  {nutritionTip.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {nutritionTip.tip}
            </p>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
              <span>Evidence-based general wellness advice. No extreme calorie deficits or unsafe dieting.</span>
            </div>
          </div>

          {/* Actionable Checklist */}
          {nutritionTip.actionablePoints && nutritionTip.actionablePoints.length > 0 && (
            <div className="w-full md:w-80 shrink-0 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Daily Action Checklist</span>
                <span className="text-[10px] text-emerald-400">Click to complete</span>
              </div>
              <div className="space-y-2.5">
                {nutritionTip.actionablePoints.map((point, idx) => {
                  const isDone = !!checkedItems[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCheck(idx)}
                      className={`w-full text-left text-xs p-2.5 rounded-lg border transition flex items-start gap-2.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 line-through'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-md border border-slate-600 bg-slate-800" />
                        )}
                      </div>
                      <span className="leading-snug">{point}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
