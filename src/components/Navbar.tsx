import React from 'react';
import { Dumbbell, LayoutDashboard, ShieldCheck, Users, Code, Sparkles, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'plan' | 'dashboard' | 'admin' | 'python-code';
  setActiveTab: (tab: 'generator' | 'plan' | 'dashboard' | 'admin' | 'python-code') => void;
  activeUserName?: string;
  hasActivePlan: boolean;
  onOpenSafetyModal: () => void;
  onOpenPresentationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeUserName,
  hasActivePlan,
  onOpenSafetyModal,
  onOpenPresentationModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 text-left group transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                FitBuddy
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                AI Coach
              </span>
            </div>
            <span className="text-xs text-slate-400 block -mt-1 hidden sm:block">
              Personalized 7-Day Microcycles
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">Create Plan</span>
          </button>

          {hasActivePlan && (
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'plan'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>7-Day Plan</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Coach Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('python-code')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'python-code'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="View Python FastAPI Architecture"
          >
            <Code className="w-4 h-4" />
            <span className="hidden lg:inline">FastAPI Code</span>
          </button>
        </nav>

        {/* Right side status / safety */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresentationModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/30 transition cursor-pointer text-xs font-bold flex items-center gap-1.5"
            title="Open Interactive PPT Presentation"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">PPT Deck</span>
          </button>

          <button
            onClick={onOpenSafetyModal}
            className="p-2 rounded-lg text-amber-400 hover:bg-amber-400/10 border border-amber-500/20 transition cursor-pointer text-xs font-semibold flex items-center gap-1"
            title="Safety Guidelines & Disclaimers"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden xl:inline">Safety</span>
          </button>

          {activeUserName && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                {activeUserName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-300 max-w-[100px] truncate">
                {activeUserName}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
