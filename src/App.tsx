import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FitnessForm } from './components/FitnessForm';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { NutritionTipView } from './components/NutritionTipView';
import { FeedbackSection } from './components/FeedbackSection';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { PythonProjectModal } from './components/PythonProjectModal';
import { SafetyModal } from './components/SafetyModal';
import { PresentationModal } from './components/PresentationModal';
import { UserProfile, WorkoutPlanRecord, NutritionTipRecord } from './types/fitness';
import { Dumbbell, ShieldCheck, Heart, Sparkles, Code } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'plan' | 'dashboard' | 'admin' | 'python-code'>('generator');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [planRecord, setPlanRecord] = useState<WorkoutPlanRecord | null>(null);
  const [nutritionTip, setNutritionTip] = useState<NutritionTipRecord | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingFeedback, setIsUpdatingFeedback] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [pythonModalOpen, setPythonModalOpen] = useState(false);
  const [presentationModalOpen, setPresentationModalOpen] = useState(false);

  // Load initial demo user Alex Chen on first mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/dashboard/alex.chen');
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
          if (data.plan) setPlanRecord(data.plan);
          if (data.nutritionTip) setNutritionTip(data.nutritionTip);
        }
      } catch (err) {
        console.warn('Initial dashboard load:', err);
      }
    }
    loadInitialData();
  }, []);

  // Form submission handler
  const handleGeneratePlan = async (formData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate workout plan');
      }

      setUser(data.user);
      setPlanRecord(data.plan);
      setNutritionTip(data.nutritionTip);
      setActiveTab('plan');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#34d399', '#f59e0b'],
        });
      } catch (e) {
        // Confetti fallback
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error creating plan:', err);
      alert(err.message || 'Error communicating with AI server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback plan refinement handler
  const handleSubmitFeedback = async (feedbackText: string) => {
    if (!user || !planRecord) return;
    setIsUpdatingFeedback(true);
    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          feedback: feedbackText,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update plan');
      }

      setPlanRecord(data.plan);

      // Light confetti for update
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#10b981'],
        });
      } catch (e) {
        // Fallback
      }
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      alert(err.message || 'Error updating workout plan with feedback.');
    } finally {
      setIsUpdatingFeedback(false);
    }
  };

  const handleLoadUserFromAdmin = async (userId: string) => {
    try {
      const res = await fetch(`/api/dashboard/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
        if (data.plan) setPlanRecord(data.plan);
        if (data.nutritionTip) setNutritionTip(data.nutritionTip);
        setActiveTab('dashboard');
      }
    } catch (e) {
      console.error('Error switching user:', e);
    }
  };

  const scrollToFeedback = () => {
    const el = document.getElementById('feedback-refinement-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToForm = () => {
    setActiveTab('generator');
    setTimeout(() => {
      const el = document.getElementById('fitness-form-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'python-code') {
            setPythonModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        activeUserName={user?.name}
        hasActivePlan={Boolean(planRecord)}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
        onOpenPresentationModal={() => setPresentationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'generator' && (
          <div>
            <Hero
              onStartClick={scrollToForm}
              onExploreDemo={() => {
                if (planRecord) {
                  setActiveTab('plan');
                } else {
                  scrollToForm();
                }
              }}
            />
            <FitnessForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>
        )}

        {activeTab === 'plan' && user && planRecord && (
          <div>
            <WorkoutPlanView
              user={user}
              planRecord={planRecord}
              onGenerateNew={() => setActiveTab('generator')}
              onGoToDashboard={() => setActiveTab('dashboard')}
              onScrollToFeedback={scrollToFeedback}
            />

            {nutritionTip && <NutritionTipView nutritionTip={nutritionTip} />}

            <FeedbackSection
              userId={user.userId}
              hasUpdatedPlan={Boolean(planRecord.updatedPlan)}
              onSubmitFeedback={handleSubmitFeedback}
              isUpdating={isUpdatingFeedback}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            planRecord={planRecord}
            nutritionTip={nutritionTip}
            onSelectPlanTab={() => setActiveTab('plan')}
            onCreateNewPlan={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView onLoadUserIntoDashboard={handleLoadUserFromAdmin} />
        )}
      </main>

      {/* Modals */}
      <SafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />

      <PythonProjectModal
        isOpen={pythonModalOpen}
        onClose={() => setPythonModalOpen(false)}
      />

      <PresentationModal
        isOpen={presentationModalOpen}
        onClose={() => setPresentationModalOpen(false)}
      />

      {/* Modern Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/90 py-8 px-4 sm:px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="font-bold text-slate-300 font-['Outfit']">FitBuddy</span>
            <span>&bull; AI Fitness Plan Generator & Recovery Coach</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setPresentationModalOpen(true)}
              className="hover:text-emerald-400 text-emerald-400/90 font-bold transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>PPT Slide Deck</span>
            </button>
            <button
              onClick={() => setSafetyModalOpen(true)}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              Safety Guidelines
            </button>
            <button
              onClick={() => setPythonModalOpen(true)}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Python FastAPI Architecture
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-white transition cursor-pointer"
            >
              Coach Dashboard
            </button>
          </div>

          <div>
            Powered by Google Gemini 3.8 Flash &bull; SQLite Persistence
          </div>
        </div>
      </footer>
    </div>
  );
}
