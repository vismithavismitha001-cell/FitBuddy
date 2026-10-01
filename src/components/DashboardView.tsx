import React, { useState } from 'react';
import {
  UserProfile,
  WorkoutPlanRecord,
  NutritionTipRecord,
  PlanData,
} from '../types/fitness';
import {
  User,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Bookmark,
  CheckCircle,
  Clock,
  Dumbbell,
  Shield,
  Apple,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile | null;
  planRecord: WorkoutPlanRecord | null;
  nutritionTip: NutritionTipRecord | null;
  onSelectPlanTab: () => void;
  onCreateNewPlan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  planRecord,
  nutritionTip,
  onSelectPlanTab,
  onCreateNewPlan,
}) => {
  const [historyComparisonTab, setHistoryComparisonTab] = useState<'current' | 'original' | 'diff'>('current');

  if (!user || !planRecord) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <Dumbbell className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
          No Active Workout Plan
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 mb-6">
          You haven't generated a personalized 7-day plan yet. Complete the quick fitness profile to generate one with Gemini AI.
        </p>
        <button
          onClick={onCreateNewPlan}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition cursor-pointer"
        >
          Create My First Plan
        </button>
      </div>
    );
  }

  const hasUpdated = Boolean(planRecord.updatedPlan);
  const activePlan: PlanData =
    hasUpdated && historyComparisonTab === 'current'
      ? planRecord.updatedPlan!
      : planRecord.originalPlan;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* WELCOME BANNER */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>Athlete Dashboard &bull; ID: @{user.userId}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Here is your active 7-day fitness regimen. Your current goal is set to{' '}
              <strong className="text-emerald-400">{user.goal}</strong> with a target frequency of{' '}
              <strong className="text-white">{user.workoutDays} days/week</strong> ({user.workoutDuration} sessions).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSelectPlanTab}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <span>View Full 7-Day Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* METRICS & OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Goal</div>
          <div className="text-lg font-black text-emerald-400 mt-1">{user.goal}</div>
          <div className="text-xs text-slate-500 mt-1">{user.experience} Level &bull; {user.intensity}</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Plan Status</div>
          <div className="text-lg font-black text-white mt-1">
            {hasUpdated ? (
              <span className="text-blue-400">Refined (v2)</span>
            ) : (
              <span className="text-emerald-400">Original (v1)</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {hasUpdated ? `${planRecord.feedbackHistory.length} refinement applied` : 'Baseline blueprint'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Split</div>
          <div className="text-lg font-black text-white mt-1">{user.workoutDays} Active Days</div>
          <div className="text-xs text-slate-500 mt-1">{7 - user.workoutDays} Dedicated Recovery Days</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Equipment Setup</div>
          <div className="text-lg font-black text-amber-400 mt-1 truncate">{user.equipment}</div>
          <div className="text-xs text-slate-500 mt-1">{user.workoutDuration} sessions</div>
        </div>
      </div>

      {/* 7-DAY AT A GLANCE TIMELINE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              7-Day Microcycle Schedule
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {activePlan.overview.summary}
            </p>
          </div>

          <button
            onClick={onSelectPlanTab}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Routine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {activePlan.days.map((day) => (
            <div
              key={day.dayNumber}
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                day.isRestDay
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-slate-400">{day.dayName}</span>
                  {day.isRestDay ? (
                    <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10">
                      Rest
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {day.estimatedTime}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white leading-snug line-clamp-2">
                  {day.focus}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                {day.isRestDay ? (
                  <span>Hydration & Sleep</span>
                ) : (
                  <span>{day.exercises.length} Exercises scheduled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PLAN HISTORY & COMPARISON SECTION */}
      {hasUpdated && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  Plan Evolution & Comparison History
                </h3>
                <span className="text-xs text-slate-400">
                  Compare your original Gemini plan against your updated version
                </span>
              </div>
            </div>

            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setHistoryComparisonTab('current')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  historyComparisonTab === 'current'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Refined Plan (Active)
              </button>
              <button
                onClick={() => setHistoryComparisonTab('original')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  historyComparisonTab === 'original'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Original Baseline
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className={`p-5 rounded-xl border transition ${historyComparisonTab === 'original' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/60'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Version 1: Original Blueprint
                </span>
                <span className="text-xs text-slate-500">
                  Created {new Date(planRecord.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {planRecord.originalPlan.overview.summary}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                <strong>Weekly Split:</strong> {planRecord.originalPlan.overview.weeklySplitDescription}
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                {planRecord.originalPlan.days.slice(0, 3).map((d) => (
                  <div key={d.dayNumber} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-slate-200">{d.dayName}: {d.focus}</span>
                    <span className="text-slate-400">{d.isRestDay ? 'Rest' : `${d.exercises.length} ex`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refined Card */}
            <div className={`p-5 rounded-xl border transition ${historyComparisonTab === 'current' ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-slate-950/60'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Version 2: Refined via User Feedback
                </span>
                <span className="text-xs text-slate-500">
                  Updated {new Date(planRecord.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {planRecord.updatedPlan?.overview.summary}
              </h4>
              {planRecord.updatedPlan?.overview.changelogNote && (
                <div className="mb-4 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                  💡 <strong>Changelog:</strong> {planRecord.updatedPlan.overview.changelogNote}
                </div>
              )}
              <div className="space-y-1.5 text-xs text-slate-300">
                {planRecord.updatedPlan?.days.slice(0, 3).map((d) => (
                  <div key={d.dayNumber} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-slate-200">{d.dayName}: {d.focus}</span>
                    <span className="text-slate-400">{d.isRestDay ? 'Rest' : `${d.exercises.length} ex`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODAY'S NUTRITION SNIPPET */}
      {nutritionTip && (
        <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                Daily Nutrition Spotlight &bull; {nutritionTip.category}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white">{nutritionTip.title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl line-clamp-2">
                {nutritionTip.tip}
              </p>
            </div>
          </div>

          <button
            onClick={onSelectPlanTab}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 transition cursor-pointer"
          >
            Checklist & Details &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
