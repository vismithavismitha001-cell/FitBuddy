import React from 'react';
import { ShieldCheck, AlertTriangle, HeartPulse, Activity, X } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              Important Health & Physical Safety Notice
            </h3>
            <span className="text-xs text-amber-400 font-semibold">
              FitBuddy General Wellness & Fitness Protocol
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
            <strong>Core Medical Notice:</strong> FitBuddy is an educational AI fitness assistant built to support general wellness, posture, cardiovascular endurance, and habit consistency.
          </div>

          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong>No Medical Diagnosis or Prescription:</strong> FitBuddy does not diagnose musculoskeletal conditions, prescribe clinical therapy, or recommend extreme caloric deficits.
            </li>
            <li>
              <strong>Special Populations & Conditions:</strong> If you are pregnant, postpartum, nursing an orthopedic injury, recovering from surgery, or managing a cardiovascular or metabolic condition, you should obtain clearance from a licensed physician or physical therapist prior to starting any exercise program.
            </li>
            <li>
              <strong>Discomfort & Pain Signals:</strong> Muscle fatigue and a mild "burn" during effort are normal; sharp joint pain, dizziness, shortness of breath, numbness, or acute discomfort are not. Discontinue exercise immediately if sharp pain occurs.
            </li>
            <li>
              <strong>Warm-up & Cool-down Adherence:</strong> Always perform the programmed dynamic warm-ups to lubricate joints and elevate core temperature, and conclude with the cool-down to promote parasympathetic recovery.
            </li>
            <li>
              <strong>Hydration & Electrolytes:</strong> Maintain balanced fluid intake throughout the day to avoid dehydration or cramping.
            </li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
