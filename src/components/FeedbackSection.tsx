import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, CheckCircle, MessageSquare } from 'lucide-react';

interface FeedbackSectionProps {
  userId: string;
  hasUpdatedPlan: boolean;
  onSubmitFeedback: (feedback: string) => Promise<void>;
  isUpdating: boolean;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  userId,
  hasUpdatedPlan,
  onSubmitFeedback,
  isUpdating,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const quickChips = [
    'Add more cardio intervals',
    'Make the workouts easier on joints',
    'Include more rest days / recovery',
    'I have less time on weekdays (shorten sessions)',
    'Add flexibility & mobility cool-downs',
    'Focus more on core and lower back posture',
  ];

  const handleChipClick = (chip: string) => {
    setFeedbackText(chip);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isUpdating) return;

    await onSubmitFeedback(feedbackText.trim());
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
  };

  return (
    <div id="feedback-refinement-section" className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              Improve Your Plan (AI Plan Refinement)
            </h3>
            <span className="text-xs text-slate-400">
              Personalized adaptations powered by Gemini 3.8 Flash
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Need adjustments for your schedule, energy level, or equipment? Type your feedback
          below or pick a quick suggestion. FitBuddy safely archives your original baseline plan and
          re-synthesizes an updated 7-day program matching your exact instructions.
        </p>

        {successToast && (
          <div className="my-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2.5 font-bold animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Your fitness plan has been updated successfully. You can toggle between original and updated plans anytime!</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="mt-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Feedback Shortcuts:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-blue-300 hover:bg-slate-900 transition cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="relative">
            <textarea
              required
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. Please add 10 minutes of low-impact cardio to Day 2 and make Wednesday a dedicated rest day..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Original plan will remain safely preserved in the database.</span>
            </div>

            <button
              type="submit"
              disabled={isUpdating || !feedbackText.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini is Updating Your Plan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Update Plan with Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
