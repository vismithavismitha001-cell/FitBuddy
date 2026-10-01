import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Dumbbell,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  CheckCircle2,
  TrendingUp,
  Flame,
  Award,
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  theme: 'emerald' | 'cyan' | 'purple' | 'amber' | 'blue';
  content: React.ReactNode;
  speakerNotes: string;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  if (!isOpen) return null;

  const slides: Slide[] = [
    {
      id: 1,
      badge: 'PROJECT OVERVIEW',
      title: 'FitBuddy: AI Fitness Plan Generator',
      subtitle: 'Your AI-Powered Personal Fitness Companion',
      theme: 'emerald',
      speakerNotes: 'Introduce FitBuddy: an intelligent, safe, beginner-friendly fitness web application built with Google Gemini 3.8 Flash, FastAPI/Express, and SQLite.',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Dumbbell className="w-10 h-10 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight">
              FITBUDDY
            </h1>
            <p className="text-lg sm:text-2xl text-emerald-400 font-semibold font-['Outfit']">
              AI-Powered Personalized 7-Day Workout Plans & Recovery Engine
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Transforming individual biometric data, goals, and equipment constraints into safe, progressive, and medically conscious 7-day fitness microcycles with real-time feedback adaptation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              ⚡ Google Gemini 3.8 Flash
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              🚀 Python FastAPI & Express
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              🗄️ SQLite & SQLAlchemy ORM
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              🛡️ Evidence-Based Safety
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: 'PROBLEM & OBJECTIVE',
      title: 'The Challenge & The Solution',
      subtitle: 'Why Generic Workouts Fail and How FitBuddy Fixes It',
      theme: 'cyan',
      speakerNotes: 'Address the core problem: generic fitness routines ignore personal constraints, leading to injury, burnout, or lack of progress.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider mb-3">
                <span>The Industry Problem</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">&times;</span>
                  <span><strong>One-size-fits-all templates:</strong> Don't account for home vs. gym equipment or available days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">&times;</span>
                  <span><strong>Injury risks & burnout:</strong> Aggressive regimens prescribe extreme volume without proper recovery days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">&times;</span>
                  <span><strong>Rigid and inflexible:</strong> When life gets busy or joints hurt, users have no easy way to adjust the plan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">&times;</span>
                  <span><strong>Unsafe diet advice:</strong> Dangerous fad diets and starvation calories promoted online.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-red-500/20 text-xs text-red-300 font-medium">
              Result: 73% of beginners quit within the first 30 days due to fatigue or injury.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>The FitBuddy Solution</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&#10003;</span>
                  <span><strong>100% Tailored 7-Day Microcycles:</strong> Matches age, weight, goal, frequency, and equipment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&#10003;</span>
                  <span><strong>Beginner-Safe Architecture:</strong> Dedicated dynamic warm-ups, coaching cues, rest times, and cool-downs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&#10003;</span>
                  <span><strong>Iterative Plan Evolution:</strong> Refine with feedback ("add cardio", "make easier") without losing baseline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&#10003;</span>
                  <span><strong>Daily Wellness & Recovery Tips:</strong> Sustainable whole foods, hydration, and sleep hygiene.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/30 text-xs text-emerald-300 font-medium">
              Outcome: Sustainable habit adherence, safe joint progression, and customized coaching.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: 'SYSTEM ARCHITECTURE',
      title: 'Full-Stack Technical Architecture',
      subtitle: 'Modular Clean Architecture: Frontend, Backend, AI Engine, and Database',
      theme: 'purple',
      speakerNotes: 'Walk through the clean modular architecture: Pydantic schemas, FastAPI routes, SQLAlchemy ORM, SQLite database, and Gemini 3.8 Flash with structured JSON schemas.',
      content: (
        <div className="py-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2 font-mono font-bold">
                UI
              </div>
              <div className="font-bold text-white mb-1">Presentation Layer</div>
              <div className="text-slate-400 text-[11px]">
                Responsive HTML5/Tailwind/React with interactive rest timers, printable CSS, & admin tables.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 font-mono font-bold">
                API
              </div>
              <div className="font-bold text-white mb-1">FastAPI / Express</div>
              <div className="text-slate-400 text-[11px]">
                REST endpoints, Pydantic validation, secure environment handling, and Jinja2 templates.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2 font-mono font-bold">
                AI
              </div>
              <div className="font-bold text-white mb-1">Gemini 3.8 Flash</div>
              <div className="text-slate-400 text-[11px]">
                Google GenAI SDK, strict JSON Schema enforcement, zero hallucinations, fast synthesis.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2 font-mono font-bold">
                DB
              </div>
              <div className="font-bold text-white mb-1">SQLite & SQLAlchemy</div>
              <div className="text-slate-400 text-[11px]">
                Users, WorkoutPlans (original + updated plans separately preserved), and NutritionTips.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
            <div className="text-slate-500 text-[11px] mb-2 font-sans font-bold uppercase tracking-wider">
              Project Structure Breakdown:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-emerald-400">FitBuddy/app/main.py</span>: FastAPI app & DB boot<br />
                <span className="text-emerald-400">FitBuddy/app/routes.py</span>: REST & HTML routes<br />
                <span className="text-emerald-400">FitBuddy/app/database.py</span>: SQLite engine & session<br />
                <span className="text-emerald-400">FitBuddy/app/models.py</span>: User, Plan, Tip ORM
              </div>
              <div>
                <span className="text-cyan-400">FitBuddy/app/gemini_generator.py</span>: 7-Day & Tip AI<br />
                <span className="text-cyan-400">FitBuddy/app/updated_plan.py</span>: Plan feedback logic<br />
                <span className="text-purple-400">FitBuddy/templates/</span>: Jinja2 responsive views<br />
                <span className="text-amber-400">FitBuddy/requirements.txt</span>: Python dependencies
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      badge: 'CORE WORKFLOW & FEATURES',
      title: 'End-to-End User Experience',
      subtitle: 'From Biometric Intake to Refined 7-Day Microcycles',
      theme: 'blue',
      speakerNotes: 'Detail the 4 main stages: Profile Intake, AI Generation, Interactive Workout Execution with Rest Timer, and Plan Refinement via feedback.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center font-mono">1</span>
              <span>Intake & Biometrics</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              User enters Name, Age, Weight, Goal (Wellness, Strength, Recomp, etc.), Experience, Intensity, Available Days (3-6), Duration, and Equipment (No equip, Home, Gym). Includes medical disclaimer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center font-mono">2</span>
              <span>AI 7-Day Synthesis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini 3.8 Flash constructs Day 1 through Day 7. Each active day includes specific Warm-up, Target Exercises (sets, reps, rest, coaching cues), and Cool-downs, plus designated Recovery days.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-1">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center font-mono">3</span>
              <span>Interactive Training & Tips</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Users review day-by-day routines with rest timers, clean print stylesheets, and daily nutrition/recovery tips with an interactive action checklist (hydration, sleep, protein timing).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center font-mono">4</span>
              <span>AI Plan Evolution</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Submit feedback ("Add more cardio", "Make workouts easier"). Gemini updates the plan while preserving the original baseline for version comparison in the user dashboard.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      badge: 'ADMIN & AUDIT',
      title: 'Coach & Admin Console (/admin)',
      subtitle: 'Full Visibility, Athlete Management, and Historical Audit',
      theme: 'amber',
      speakerNotes: 'Showcase the admin dashboard: filtering athletes, auditing original vs. refined plans, viewing user feedback history, and managing athlete accounts.',
      content: (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Athletes</div>
              <div className="text-2xl font-black text-white mt-1">Multi-User</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Plan Statuses</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">Original & Refined</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Search & Filter</div>
              <div className="text-2xl font-black text-blue-400 mt-1">Instant Realtime</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Historical Audit</div>
              <div className="text-2xl font-black text-purple-400 mt-1">Full Inspector</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white text-sm">Key Coach Capabilities:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">&bull;</span>
                <span><strong>Athlete Directory:</strong> Complete table of registered users with age, weight, goal, and experience.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">&bull;</span>
                <span><strong>Plan Inspector Modal:</strong> Audit both Original (v1) and Updated (v2) plans side-by-side.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">&bull;</span>
                <span><strong>Feedback History Log:</strong> Review exact athlete adjustment requests and timestamps.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">&bull;</span>
                <span><strong>Athlete Management:</strong> Switch active profile into dashboard or delete user records.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      badge: 'SAFETY & ETHICS',
      title: 'Health & Medical Safety Protocol',
      subtitle: 'Guardrails Preventing Unsafe Regimens & False Medical Claims',
      theme: 'emerald',
      speakerNotes: 'Emphasize safety: FitBuddy explicitly avoids medical diagnosis, screens for injuries, provides safe fallback heuristics, and promotes moderate, sustainable wellness.',
      content: (
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-4 my-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Built-in Medical & Physiological Guardrails
              </h3>
              <span className="text-xs text-amber-400">Zero Extreme Regimens &bull; Joint Protection &bull; Clear Disclaimers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-amber-300 mb-1">No Medical Diagnosis</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                App provides general wellness guidance only. Contraindicated users (injuries, pregnancy, heart conditions) are advised to consult certified physicians.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-amber-300 mb-1">Injury Screening</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Interactive checkbox captures limitations (e.g. lower back sensitivity), prompting the AI model to substitute high-impact spinal loading movements.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-amber-300 mb-1">Safe Nutrition</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Strictly prohibits extreme caloric deficits or unverified supplements; focuses purely on whole-food fueling, hydration, and sleep hygiene.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      badge: 'SUMMARY & IMPACT',
      title: 'Conclusion & Key Takeaways',
      subtitle: 'Production-Grade Architecture Ready for Deployment',
      theme: 'emerald',
      speakerNotes: 'Conclude with summary: FitBuddy is a fully functioning, production-ready AI application that bridges certified fitness principles with cutting-edge LLMs.',
      content: (
        <div className="py-4 space-y-6 text-center max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-emerald-400 font-black text-2xl">100%</div>
              <div className="text-xs font-bold text-white mt-1">Functional Full-Stack</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Frontend, API & SQLite DB</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-cyan-400 font-black text-2xl">7-Day</div>
              <div className="text-xs font-bold text-white mt-1">Custom Microcycles</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Warm-up, sets, cues, cool-down</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-purple-400 font-black text-2xl">v1 &rarr; v2</div>
              <div className="text-xs font-bold text-white mt-1">Plan Evolution</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Feedback adaptation history</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30">
            <h4 className="text-base font-bold text-white mb-1">Ready to Run Locally or in the Cloud</h4>
            <p className="text-xs text-slate-300 font-mono mt-1">
              pip install -r requirements.txt && uvicorn app.main:app --reload
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Thank you for exploring <strong>FitBuddy</strong>! Your AI-powered personal fitness companion.
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const downloadPptOutline = () => {
    const textContent = slides
      .map(
        (s) =>
          `SLIDE ${s.id}: ${s.title.toUpperCase()}\n` +
          `Subtitle: ${s.subtitle}\n` +
          `Badge: ${s.badge}\n` +
          `Speaker Notes: ${s.speakerNotes}\n` +
          `--------------------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FitBuddy_AI_Fitness_Presentation_Slides.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMarkdownSlides = () => {
    const md = slides
      .map(
        (s) =>
          `# Slide ${s.id}: ${s.title}\n` +
          `**${s.subtitle}**\n\n` +
          `> ${s.speakerNotes}\n\n` +
          `---\n`
      )
      .join('\n');

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'max-w-5xl w-full h-[88vh]'
        }`}
      >
        {/* Top Presentation Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Slide Deck / Presentation Mode
              </span>
              <span className="text-sm font-black text-white font-['Outfit']">
                FitBuddy – AI Fitness Plan Generator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                showNotes
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle speaker notes"
            >
              Notes
            </button>

            <button
              onClick={copyMarkdownSlides}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              title="Copy slides as Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={downloadPptOutline}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              title="Download presentation outline"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Stage */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between relative bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
          <div>
            {/* Slide Header */}
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {current.badge} &bull; Slide {current.id} of {slides.length}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
                {current.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {current.subtitle}
              </p>
            </div>

            {/* Slide Body */}
            <div className="py-2">{current.content}</div>
          </div>

          {/* Speaker Notes Drawer (Optional) */}
          {showNotes && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                🎙️ Speaker Notes:
              </span>
              <p className="leading-relaxed">{current.speakerNotes}</p>
            </div>
          )}
        </div>

        {/* Slide Bottom Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  currentSlide === idx ? 'bg-emerald-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to slide ${s.id}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
