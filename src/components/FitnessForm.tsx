import React, { useState } from 'react';
import {
  FitnessGoal,
  FitnessExperience,
  WorkoutIntensity,
  EquipmentAvailability,
  WorkoutDuration,
} from '../types/fitness';
import {
  User,
  Heart,
  Scale,
  Calendar,
  Clock,
  Dumbbell,
  ShieldAlert,
  Sparkles,
  Zap,
  Target,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface FitnessFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
}

export const FitnessForm: React.FC<FitnessFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [age, setAge] = useState<number | ''>(28);
  const [weight, setWeight] = useState<number | ''>(72);
  const [goal, setGoal] = useState<FitnessGoal>('General wellness');
  const [experience, setExperience] = useState<FitnessExperience>('Beginner');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Moderate / Medium');
  const [workoutDays, setWorkoutDays] = useState<number>(4);
  const [workoutDuration, setWorkoutDuration] = useState<WorkoutDuration>('30-45 mins');
  const [equipment, setEquipment] = useState<EquipmentAvailability>('Home equipment');
  
  // Health & Safety
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(true);

  // Form error state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-generate a clean userId suggestion from name if userId is empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!userId || userId === name.toLowerCase().replace(/\s+/g, '.')) {
      setUserId(val.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').slice(0, 20));
    }
  };

  const calculateBMI = () => {
    if (typeof weight === 'number' && weight > 0) {
      // Assuming avg height baseline 175cm for estimate, or standard display
      return ((weight / (1.75 * 1.75))).toFixed(1);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!userId.trim()) {
      setErrorMsg('Please provide a unique User ID or handle.');
      return;
    }
    if (!age || age < 14 || age > 105) {
      setErrorMsg('Please provide a valid age between 14 and 105.');
      return;
    }
    if (!weight || weight < 30 || weight > 350) {
      setErrorMsg('Please provide a realistic weight in kg (30 - 350 kg).');
      return;
    }

    await onSubmit({
      name: name.trim(),
      userId: userId.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''),
      age: Number(age),
      weight: Number(weight),
      goal,
      experience,
      intensity,
      workoutDays: Number(workoutDays),
      workoutDuration,
      equipment,
      hasMedicalCondition,
      medicalNotes: medicalNotes.trim() || undefined,
    });
  };

  const goalsList: { value: FitnessGoal; label: string; desc: string; icon: string }[] = [
    { value: 'General wellness', label: 'General Wellness', desc: 'Daily vitality, mobility, functional strength & healthy energy', icon: '🌿' },
    { value: 'Weight management', label: 'Weight Management', desc: 'Metabolic conditioning, caloric balance & body recomposition', icon: '⚖️' },
    { value: 'Strength', label: 'Strength', desc: 'Neural drive, compound movement mastery & raw power', icon: '🦾' },
    { value: 'Muscle building', label: 'Muscle Building (Hypertrophy)', desc: 'Progressive tension, muscular volume & athletic shape', icon: '💪' },
    { value: 'Flexibility', label: 'Flexibility & Mobility', desc: 'Joint decompression, posture alignment & deep range of motion', icon: '🧘' },
    { value: 'Endurance', label: 'Cardio & Endurance', desc: 'Aerobic base, stamina & efficient oxygen transport', icon: '🏃' },
  ];

  return (
    <div id="fitness-form-container" className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
                Fitness Profile & Plan Generator
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Provide your baseline info below. FitBuddy uses this to generate a safe, scientifically balanced 7-day routine.
            </p>
          </div>
          {calculateBMI() && (
            <div className="hidden sm:block text-right bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated BMI Indicator</div>
              <div className="text-lg font-black text-emerald-400">{calculateBMI()} <span className="text-xs font-normal text-slate-400">kg/m²</span></div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: IDENTITY & BIOMETRICS */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>1. Personal & Biometric Metrics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  User ID / Handle <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm font-mono">@</span>
                  <input
                    type="text"
                    required
                    placeholder="jordan.fit"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Age (Years) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={14}
                  max={105}
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Current Weight (kg) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min={30}
                  max={350}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: FITNESS GOALS */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>2. Primary Fitness Goal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {goalsList.map((item) => {
                const isSelected = goal === item.value;
                return (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setGoal(item.value)}
                    className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl mb-2">{item.icon}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="font-bold text-sm text-white">{item.label}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-snug">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: EXPERIENCE & INTENSITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                Fitness Experience Level <span className="text-emerald-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as FitnessExperience[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setExperience(lvl)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      experience === lvl
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {experience === 'Beginner' && 'Focuses on foundational biomechanics, injury prevention, and building joint stamina.'}
                {experience === 'Intermediate' && 'Progresses load, introduces multi-planar movement, and expands training density.'}
                {experience === 'Advanced' && 'Higher training volume, intensity thresholds, and refined movement splits.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                Workout Intensity <span className="text-emerald-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    'Beginner / Low',
                    'Moderate / Medium',
                    'Advanced / High',
                  ] as WorkoutIntensity[]
                ).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setIntensity(lvl)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      intensity === lvl
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lvl.split('/')[0].trim()}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Selected: <strong className="text-slate-300">{intensity}</strong>. Affects rest periods and set volume.
              </p>
            </div>
          </div>

          {/* STEP 4: LOGISTICS (DAYS, DURATION, EQUIPMENT) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Available Days / Week
              </label>
              <select
                value={workoutDays}
                onChange={(e) => setWorkoutDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
              >
                <option value={3}>3 Days (4 Active Recovery/Rest)</option>
                <option value={4}>4 Days (Balanced Microcycle)</option>
                <option value={5}>5 Days (Active Lifestyle)</option>
                <option value={6}>6 Days (High Frequency)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Workout Duration
              </label>
              <select
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value as WorkoutDuration)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
              >
                <option value="15-30 mins">15-30 mins (Quick & focused)</option>
                <option value="30-45 mins">30-45 mins (Recommended)</option>
                <option value="45-60 mins">45-60 mins (Comprehensive)</option>
                <option value="60+ mins">60+ mins (Dedicated athlete)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                Equipment
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as EquipmentAvailability)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
              >
                <option value="No equipment">No equipment (Bodyweight only)</option>
                <option value="Home equipment">Home equipment (Dumbbells/Bands)</option>
                <option value="Gym equipment">Gym equipment (Full Gym)</option>
              </select>
            </div>
          </div>

          {/* STEP 5: HEALTH & SAFETY SCREENING */}
          <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-3 w-full">
                <div>
                  <h4 className="font-bold text-sm text-amber-300">Health & Physical Safety Screening</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    FitBuddy is designed for general wellness, functional fitness, and physical education.
                    Do not diagnose medical conditions or engage in extreme exercises if you have contraindications.
                  </p>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasMedicalCondition}
                    onChange={(e) => setHasMedicalCondition(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <span>I currently have an active injury, joint restriction, cardiovascular condition, or pregnancy.</span>
                </label>

                {hasMedicalCondition && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wide mb-1">
                      Specify limitation for AI exercise adaptations:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mild lower back sensitivity; avoid heavy spinal loading"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <div className="mt-2 text-[11px] text-amber-300/90 font-medium">
                      ⚠️ Note: Please consult a qualified physician or physical therapist before starting physical activities if you are managing an injury or medical condition.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Gemini AI is Synthesizing Your 7-Day Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Generate My Personalized 7-Day AI Plan</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
