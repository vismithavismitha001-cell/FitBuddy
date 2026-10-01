import React, { useState } from 'react';
import {
  UserProfile,
  WorkoutPlanRecord,
  PlanData,
  DayPlan,
  Exercise,
} from '../types/fitness';
import {
  Printer,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  Flame,
  Snowflake,
  Timer,
  Play,
  Pause,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle,
  HelpCircle,
  Clock,
  Dumbbell,
  Compass,
} from 'lucide-react';

interface WorkoutPlanViewProps {
  user: UserProfile;
  planRecord: WorkoutPlanRecord;
  onGenerateNew: () => void;
  onGoToDashboard: () => void;
  onScrollToFeedback: () => void;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  user,
  planRecord,
  onGenerateNew,
  onGoToDashboard,
  onScrollToFeedback,
}) => {
  const [viewVersion, setViewVersion] = useState<'current' | 'original'>('current');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Rest Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(60);
  const [timerInitial, setTimerInitial] = useState(60);

  React.useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSecondsLeft]);

  const startRestTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSecondsLeft(seconds);
    setTimerActive(true);
  };

  const hasUpdated = Boolean(planRecord.updatedPlan);
  const activePlan: PlanData =
    viewVersion === 'original' || !planRecord.updatedPlan
      ? planRecord.originalPlan
      : planRecord.updatedPlan;

  const currentDay = activePlan.days[selectedDayIndex] || activePlan.days[0];

  const handleSave = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 printable-area">
      {/* Save Toast Notification */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <BookmarkCheck className="w-5 h-5" />
          <span>Plan saved to your FitBuddy profile!</span>
        </div>
      )}

      {/* Floating Rest Timer Bar if active */}
      {timerActive && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
            {timerSecondsLeft}s
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rest Interval</div>
            <div className="text-sm font-semibold text-white">Breathe deep and sip water</div>
          </div>
          <button
            onClick={() => setTimerActive(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* USER PROFILE HEADER SUMMARY */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl print-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit'] print-text-dark">
                {user.name}'s 7-Day AI Fitness Plan
              </h1>
              {hasUpdated && viewVersion === 'current' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Refined Version (v2)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Original Blueprint (v1)
                </span>
              )}
            </div>

            {/* Profile badges row */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/80">
                🎯 Goal: <strong className="text-emerald-400">{user.goal}</strong>
              </span>
              <span className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/80">
                ⚡ Experience: <strong className="text-white">{user.experience}</strong>
              </span>
              <span className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/80">
                🔥 Intensity: <strong className="text-white">{user.intensity}</strong>
              </span>
              <span className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/80">
                ⏱️ Duration: <strong className="text-white">{user.workoutDuration}</strong>
              </span>
              <span className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/80">
                🏋️ Equipment: <strong className="text-white">{user.equipment}</strong>
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="action-toolbar flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Plan</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Plan</span>
            </button>

            <button
              onClick={onScrollToFeedback}
              className="px-4 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 font-bold text-xs sm:text-sm border border-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Update My Plan</span>
            </button>

            <button
              onClick={onGoToDashboard}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
            >
              Dashboard
            </button>

            <button
              onClick={onGenerateNew}
              className="px-3 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
              title="Start over with a new form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Plan</span>
            </button>
          </div>
        </div>

        {/* VERSION TOGGLE (If plan has an updated version) */}
        {hasUpdated && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Plan Version:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setViewVersion('current')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    viewVersion === 'current'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Refined Plan (Gemini Updated)
                </button>
                <button
                  onClick={() => setViewVersion('original')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    viewVersion === 'original'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Original Plan
                </button>
              </div>
            </div>

            {planRecord.updatedPlan?.overview.changelogNote && viewVersion === 'current' && (
              <div className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                💡 <strong>Gemini Refinement:</strong> {planRecord.updatedPlan.overview.changelogNote}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PROGRAM PHILOSOPHY / OVERVIEW CARD */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 print-card">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit'] print-text-dark">
              Program Philosophy & Weekly Split
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed print-text-muted">
              {activePlan.overview.summary}
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-slate-400 block mb-0.5">TARGET OUTCOME:</span>
                <span className="text-slate-200">{activePlan.overview.targetOutcome}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-slate-400 block mb-0.5">SAFETY & JOINT GUIDANCE:</span>
                <span className="text-slate-200">{activePlan.overview.safetyGuidance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-DAY NAVIGATION TABS (DESKTOP & MOBILE) */}
      <div className="no-print mb-6">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>7-Day Microcycle Schedule (Select Day to Inspect)</span>
          <span className="text-emerald-400 font-semibold text-xs">Day {selectedDayIndex + 1} of 7</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {activePlan.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? day.isRestDay
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="text-xs font-bold font-mono">D{day.dayNumber}</div>
                <div className="text-[11px] font-semibold truncate mt-0.5 hidden md:block">
                  {day.isRestDay ? 'Recovery' : day.focus.split('&')[0].trim()}
                </div>
                <div className="text-[10px] mt-0.5">
                  {day.isRestDay ? (
                    <span className="text-amber-400 font-bold">Rest</span>
                  ) : (
                    <span className="text-emerald-400">{day.exercises.length} ex</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SELECTED DAY DETAILS CARD */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                {currentDay.dayName}
              </span>
              {currentDay.isRestDay ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  🛌 Active Recovery / Rest Day
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ⚡ {currentDay.estimatedTime} Session
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
              {currentDay.focus}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : 6))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              &larr; Prev Day
            </button>
            <button
              onClick={() => setSelectedDayIndex((prev) => (prev < 6 ? prev + 1 : 0))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Next Day &rarr;
            </button>
          </div>
        </div>

        {/* WARM UP SECTION */}
        {currentDay.warmUp && currentDay.warmUp.activities.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              <span>Dynamic Warm-Up ({currentDay.warmUp.duration})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentDay.warmUp.activities.map((act, i) => (
                <span
                  key={i}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg"
                >
                  &bull; {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EXERCISES BREAKDOWN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>Exercise Sequence & Coaching Directives</span>
            </h3>
            <span className="text-xs text-slate-500">
              Click rest interval to launch countdown timer
            </span>
          </div>

          {currentDay.exercises.map((ex, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <h4 className="font-extrabold text-base text-white">{ex.name}</h4>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 pl-8">
                    Target: <span className="text-emerald-400 font-medium">{ex.targetMuscle}</span> &bull; Equip: {ex.equipmentNeeded}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-8 sm:pl-0 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20">
                    {ex.sets} Sets &times; {ex.repsOrDuration}
                  </span>

                  <button
                    onClick={() => {
                      const num = parseInt(ex.restTime) || 60;
                      startRestTimer(num);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                    title="Start timer for this rest period"
                  >
                    <Timer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Rest: {ex.restTime}</span>
                  </button>
                </div>
              </div>

              {/* Coaching Cue */}
              <div className="mt-3 pl-8 text-xs text-slate-300/90 bg-slate-900/60 rounded-lg p-2.5 border-l-2 border-emerald-500">
                <span className="font-bold text-emerald-400">Coach Form Cue:</span> "{ex.coachingCue}"
              </div>
            </div>
          ))}
        </div>

        {/* COOL DOWN SECTION */}
        {currentDay.coolDown && currentDay.coolDown.activities.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Snowflake className="w-4 h-4" />
              <span>Cool-Down & Parasympathetic Recovery ({currentDay.coolDown.duration})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentDay.coolDown.activities.map((act, i) => (
                <span
                  key={i}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg"
                >
                  &bull; {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RECOVERY NOTE */}
        {currentDay.recoveryNote && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            💡 <strong>Recovery Recommendation:</strong> {currentDay.recoveryNote}
          </div>
        )}
      </div>

      {/* PRINT-ONLY FULL 7-DAY EXPANDED LIST */}
      <div className="hidden print:block space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Full 7-Day Microcycle Schedule</h2>
        {activePlan.days.map((day) => (
          <div key={day.dayNumber} className="border border-slate-300 rounded-lg p-4 mb-4 print-card">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-base text-slate-900">
                {day.dayName}: {day.focus}
              </h3>
              <span className="text-xs font-semibold text-slate-600">
                {day.isRestDay ? 'Rest / Active Recovery' : day.estimatedTime}
              </span>
            </div>
            {day.warmUp && day.warmUp.activities.length > 0 && (
              <div className="text-xs text-slate-600 mb-2">
                <strong>Warm-up:</strong> {day.warmUp.activities.join(', ')}
              </div>
            )}
            <div className="space-y-2">
              {day.exercises.map((ex, i) => (
                <div key={i} className="text-xs border-b border-slate-200 pb-1.5">
                  <div className="font-semibold text-slate-900">
                    {ex.name} — {ex.sets} sets &times; {ex.repsOrDuration} (Rest: {ex.restTime})
                  </div>
                  <div className="text-slate-600 italic">Cue: {ex.coachingCue}</div>
                </div>
              ))}
            </div>
            {day.coolDown && day.coolDown.activities.length > 0 && (
              <div className="text-xs text-slate-600 mt-2">
                <strong>Cool-down:</strong> {day.coolDown.activities.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
