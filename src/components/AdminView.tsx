import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';
import { UserProfile, WorkoutPlanRecord } from '../types/fitness';

interface AdminUserRow {
  id: string;
  userId: string;
  name: string;
  age: number;
  weight: number;
  goal: string;
  experience: string;
  intensity: string;
  workoutDays: number;
  workoutDuration: string;
  equipment: string;
  createdAt: string;
  planStatus: string;
  feedbackCount: number;
  hasUpdatedPlan: boolean;
}

interface AdminViewProps {
  onLoadUserIntoDashboard: (userId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onLoadUserIntoDashboard }) => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState('ALL');
  const [experienceFilter, setExperienceFilter] = useState('ALL');

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlans: 0,
    totalRefinedPlans: 0,
    totalFeedbacks: 0,
  });

  // Plan Inspector Modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectingUser, setInspectingUser] = useState<any | null>(null);
  const [inspectingPlan, setInspectingPlan] = useState<any | null>(null);
  const [inspectModalTab, setInspectModalTab] = useState<'original' | 'updated' | 'feedback'>('original');
  const [inspectLoading, setInspectLoading] = useState(false);

  // Fetch users & stats
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete athlete ${userName} (@${userId}) and their stored workout plans?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
        fetchAdminData();
      } else {
        alert('Failed to delete user.');
      }
    } catch (e) {
      alert('Network error while deleting user.');
    }
  };

  const handleInspectUser = async (userId: string) => {
    setInspectLoading(true);
    setInspectModalOpen(true);
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setInspectingUser(data.user);
        setInspectingPlan(data.plan);
        if (data.plan && data.plan.updatedPlan) {
          setInspectModalTab('updated');
        } else {
          setInspectModalTab('original');
        }
      }
    } catch (e) {
      console.error('Error fetching user details:', e);
    } finally {
      setInspectLoading(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.goal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGoal = goalFilter === 'ALL' || u.goal === goalFilter;
    const matchesExp = experienceFilter === 'ALL' || u.experience === experienceFilter;

    return matchesSearch && matchesGoal && matchesExp;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Coach & Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Registered Athletes & Workout Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit registered users, inspect original vs. refined 7-day plans, review athlete feedback, and manage records.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Athletes</div>
          <div className="text-2xl font-black text-white mt-1">{stats.totalUsers}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Registered in SQLite store</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plans Generated</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.totalPlans}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Full 7-day microcycles</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Refined Plans (v2)</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{stats.totalRefinedPlans}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Updated with AI feedback</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feedback Logs</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{stats.totalFeedbacks}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Custom athlete requests</div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, handle, or goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Goals</option>
            <option value="General wellness">General wellness</option>
            <option value="Weight management">Weight management</option>
            <option value="Strength">Strength</option>
            <option value="Muscle building">Muscle building</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Endurance">Endurance</option>
          </select>

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Experience Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Athlete / ID</th>
                <th className="px-5 py-3.5">Biometrics</th>
                <th className="px-5 py-3.5">Fitness Goal</th>
                <th className="px-5 py-3.5">Experience & Intensity</th>
                <th className="px-5 py-3.5">Plan Status</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No athletes found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      <div className="font-mono text-slate-400 text-[11px]">@{u.userId}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {u.age} yrs &bull; {u.weight} kg
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {u.goal}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div>{u.experience}</div>
                      <div className="text-slate-500 text-[11px]">{u.intensity}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {u.hasUpdatedPlan ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          Refined & Updated (v2)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Original Active (v1)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleInspectUser(u.userId)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer inline-flex items-center gap-1 font-semibold"
                        title="Inspect full plans and feedback"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onLoadUserIntoDashboard(u.userId)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition cursor-pointer inline-flex items-center gap-1 font-semibold"
                        title="Load as current active user in Dashboard"
                      >
                        <span>Load</span>
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.userId, u.name)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                        title="Delete user and all stored plans"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLAN INSPECTION MODAL */}
      {inspectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  Athlete Audit: {inspectingUser?.name} (@{inspectingUser?.userId})
                </h3>
                <p className="text-xs text-slate-400">
                  Goal: {inspectingUser?.goal} &bull; {inspectingUser?.age}y &bull; {inspectingUser?.weight}kg &bull; {inspectingUser?.equipment}
                </p>
              </div>

              <button
                onClick={() => setInspectModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-5 pt-3 border-b border-slate-800 flex gap-2">
              <button
                onClick={() => setInspectModalTab('original')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                  inspectModalTab === 'original'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Original Plan (v1)
              </button>

              {inspectingPlan?.updatedPlan && (
                <button
                  onClick={() => setInspectModalTab('updated')}
                  className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                    inspectModalTab === 'updated'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Refined Plan (v2)
                </button>
              )}

              <button
                onClick={() => setInspectModalTab('feedback')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                  inspectModalTab === 'feedback'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Feedback History ({inspectingPlan?.feedbackHistory?.length || 0})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {inspectLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Loading plan details from database...
                </div>
              ) : inspectModalTab === 'feedback' ? (
                <div className="space-y-3">
                  {inspectingPlan?.feedbackHistory?.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No feedback submitted yet for this athlete.
                    </div>
                  ) : (
                    inspectingPlan?.feedbackHistory?.map((fb: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span className="font-bold text-purple-400">Feedback #{idx + 1}</span>
                          <span>{new Date(fb.submittedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-200">"{fb.feedback}"</p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                (() => {
                  const targetPlan =
                    inspectModalTab === 'updated'
                      ? inspectingPlan?.updatedPlan
                      : inspectingPlan?.originalPlan;

                  if (!targetPlan) {
                    return (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        Plan data not found.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <h4 className="font-bold text-sm text-white mb-1">Philosophy & Split</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2">
                          {targetPlan.overview.summary}
                        </p>
                        <div className="text-[11px] text-slate-400">
                          <strong>Split:</strong> {targetPlan.overview.weeklySplitDescription}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {targetPlan.days.map((day: any) => (
                          <div
                            key={day.dayNumber}
                            className={`p-3.5 rounded-xl border text-xs ${
                              day.isRestDay
                                ? 'bg-amber-500/5 border-amber-500/20'
                                : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between font-bold mb-1">
                              <span className="text-slate-300">{day.dayName}: {day.focus}</span>
                              <span className={day.isRestDay ? 'text-amber-400' : 'text-emerald-400'}>
                                {day.isRestDay ? 'Rest' : day.estimatedTime}
                              </span>
                            </div>
                            <div className="text-slate-400 space-y-1 mt-2">
                              {day.exercises.map((ex: any, i: number) => (
                                <div key={i} className="truncate">
                                  &bull; {ex.name} ({ex.sets} &times; {ex.repsOrDuration})
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
