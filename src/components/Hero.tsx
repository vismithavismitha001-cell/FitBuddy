import React from 'react';
import { Sparkles, Activity, ShieldCheck, Dumbbell, Clock, CalendarDays, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onExploreDemo }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your AI-Powered Personal Fitness Companion</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12] font-['Outfit']">
          Beginner-Friendly, Safe &{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Hyper-Personalized
          </span>{' '}
          7-Day Workout Plans
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          FitBuddy leverages Google Gemini AI to analyze your goals, schedule, experience,
          and equipment — synthesizing a structured 7-day routine complete with warm-ups,
          coaching cues, recovery days, and custom nutrition tips.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dumbbell className="w-5 h-5 text-slate-950" />
            <span>Create My Fitness Plan</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Explore Alex's Active Plan</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2.5">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Full 7-Day Cycle</div>
            <div className="text-xs text-slate-400 mt-0.5">Day 1 to 7 with strategic recovery days.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2.5">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Equipment Adaptive</div>
            <div className="text-xs text-slate-400 mt-0.5">Bodyweight, home dumbbells, or gym.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">Safety Guardrails</div>
            <div className="text-xs text-slate-400 mt-0.5">Zero extreme strain or unsafe diets.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">AI Plan Evolution</div>
            <div className="text-xs text-slate-400 mt-0.5">Tweak cardio or pace with 1 feedback click.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
