import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  WorkoutPlanRecord,
  NutritionTipRecord,
  PlanData,
} from '../types/fitness';

interface FitBuddyDatabase {
  users: UserProfile[];
  workoutPlans: WorkoutPlanRecord[];
  nutritionTips: NutritionTipRecord[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'fitbuddy_db.json');

const INITIAL_SEED_PLAN: PlanData = {
  overview: {
    summary: 'Personalized 7-Day Hybrid Routine tailored for balanced functional strength, posture improvement, and gradual cardiovascular conditioning.',
    targetOutcome: 'Progressive strength endurance and improved body composition without joint burnout.',
    weeklySplitDescription: '4 Active Strength & Mobility Days, 1 Aerobic Capacity Day, and 2 Strategic Active Recovery/Rest Days.',
    safetyGuidance: 'Perform dynamic warm-ups prior to loaded movements. Maintain steady breathing and stop immediately if sharp joint pain occurs.',
  },
  days: [
    {
      dayNumber: 1,
      dayName: 'Day 1',
      focus: 'Upper Body Fundamentals & Posture',
      isRestDay: false,
      estimatedTime: '35 mins',
      warmUp: {
        duration: '5 mins',
        activities: ['Arm circles & shoulder dislocates', 'Cat-cow stretches (10 reps)', 'Band or bodyweight pull-aparts (15 reps)']
      },
      exercises: [
        {
          name: 'Push-Ups (or Incline Push-Ups)',
          targetMuscle: 'Chest, Shoulders & Triceps',
          sets: 3,
          repsOrDuration: '8 - 12 reps',
          restTime: '60 secs',
          coachingCue: 'Keep core braced and elbows tucked at roughly 45 degrees.',
          equipmentNeeded: 'Bodyweight or elevated surface'
        },
        {
          name: 'Dumbbell or Towel Rows',
          targetMuscle: 'Upper Back & Lats',
          sets: 3,
          repsOrDuration: '10 - 12 reps',
          restTime: '60 secs',
          coachingCue: 'Pull your elbows toward your hips and squeeze scapulae for 1 second.',
          equipmentNeeded: 'Light dumbbells or resistance band'
        },
        {
          name: 'Overhead Dumbbell Press',
          targetMuscle: 'Deltoids & Core',
          sets: 3,
          repsOrDuration: '10 reps',
          restTime: '60 secs',
          coachingCue: 'Avoid arching your lower back; brace your glutes.',
          equipmentNeeded: 'Dumbbells or water bottles'
        },
        {
          name: 'Dead Bug Holds',
          targetMuscle: 'Deep Core (Transverse Abdominis)',
          sets: 3,
          repsOrDuration: '8 reps per side',
          restTime: '45 secs',
          coachingCue: 'Press lower back flat into the ground throughout each rep.',
          equipmentNeeded: 'Mat'
        }
      ],
      coolDown: {
        duration: '5 mins',
        activities: ['Cross-body shoulder stretch', 'Doorway chest stretch', 'Deep diaphragmatic box breathing']
      }
    },
    {
      dayNumber: 2,
      dayName: 'Day 2',
      focus: 'Lower Body Strength & Knee Stability',
      isRestDay: false,
      estimatedTime: '40 mins',
      warmUp: {
        duration: '6 mins',
        activities: ['Leg swings (front & lateral)', 'Glute bridges (15 reps)', 'Bodyweight calf raises']
      },
      exercises: [
        {
          name: 'Goblet Squat (or Bodyweight Squat)',
          targetMuscle: 'Quadriceps, Glutes & Core',
          sets: 3,
          repsOrDuration: '10 - 12 reps',
          restTime: '75 secs',
          coachingCue: 'Drive knees outward in line with your toes, hips back and chest upright.',
          equipmentNeeded: 'Dumbbell or bodyweight'
        },
        {
          name: 'Romanian Deadlift (RDL)',
          targetMuscle: 'Hamstrings & Posterior Chain',
          sets: 3,
          repsOrDuration: '10 reps',
          restTime: '75 secs',
          coachingCue: 'Hinge hips backwards as if tapping a wall behind you with a soft knee bend.',
          equipmentNeeded: 'Dumbbells or resistance band'
        },
        {
          name: 'Reverse Lunges',
          targetMuscle: 'Glutes, Quads & Balance',
          sets: 3,
          repsOrDuration: '8 reps per leg',
          restTime: '60 secs',
          coachingCue: 'Step back softly and maintain a vertical shin on the front leg.',
          equipmentNeeded: 'Bodyweight'
        },
        {
          name: 'Standing Calf Raises',
          targetMuscle: 'Calves & Ankle Stability',
          sets: 3,
          repsOrDuration: '15 reps',
          restTime: '45 secs',
          coachingCue: 'Pause at the top for 1 full second and descend under control.',
          equipmentNeeded: 'Stair ledge or flat ground'
        }
      ],
      coolDown: {
        duration: '5 mins',
        activities: ['Quad couch stretch (30s each)', 'Seated hamstring stretch', 'Child pose with deep breaths']
      }
    },
    {
      dayNumber: 3,
      dayName: 'Day 3',
      focus: 'Active Recovery & Mobility Flow',
      isRestDay: true,
      estimatedTime: '25 mins',
      warmUp: {
        duration: '5 mins',
        activities: ['Neck rolls & gentle torso twists', 'Cat-cow pelvic tilts']
      },
      exercises: [
        {
          name: 'Zone 1 Brisk Recovery Walk',
          targetMuscle: 'Cardiovascular Flush & Lymphatic Flow',
          sets: 1,
          repsOrDuration: '20 mins',
          restTime: 'Continuous',
          coachingCue: 'Breathe through the nose at a conversational, effortless cadence.',
          equipmentNeeded: 'None / Walking shoes'
        },
        {
          name: 'World\'s Greatest Stretch Flow',
          targetMuscle: 'Hip Flexors, Thoracic Spine & Hamstrings',
          sets: 2,
          repsOrDuration: '5 reps per side',
          restTime: '30 secs',
          coachingCue: 'Take your time through each rotation; inhale as you reach up.',
          equipmentNeeded: 'Exercise mat'
        }
      ],
      coolDown: {
        duration: '5 mins',
        activities: ['Pigeon pose stretch (45s each)', 'Legs up the wall relaxation']
      },
      recoveryNote: 'Replenish electrolytes and drink an extra glass of water today to flush cellular waste.'
    },
    {
      dayNumber: 4,
      dayName: 'Day 4',
      focus: 'Core Integration & Dynamic Conditioning',
      isRestDay: false,
      estimatedTime: '35 mins',
      warmUp: {
        duration: '5 mins',
        activities: ['Jumping jacks or low-impact step jacks', 'Hip circles', 'Inchworms (5 reps)']
      },
      exercises: [
        {
          name: 'Kettlebell or Dumbbell Swings',
          targetMuscle: 'Glutes, Hamstrings & Cardio',
          sets: 4,
          repsOrDuration: '12 - 15 reps',
          restTime: '60 secs',
          coachingCue: 'Snap your hips violently at top; don\'t lift with your arms.',
          equipmentNeeded: 'Kettlebell or single dumbbell'
        },
        {
          name: 'Forearm Plank to Downdog Flow',
          targetMuscle: 'Core & Scapular Stability',
          sets: 3,
          repsOrDuration: '30 - 45 secs',
          restTime: '45 secs',
          coachingCue: 'Keep your belly button pulled up into your spine; no sagging hips.',
          equipmentNeeded: 'Mat'
        },
        {
          name: 'Lateral Speed Skaters',
          targetMuscle: 'Lateral Glutes & Coordination',
          sets: 3,
          repsOrDuration: '10 reps per side',
          restTime: '45 secs',
          coachingCue: 'Land softly on the midfoot with knee bent to absorb impact.',
          equipmentNeeded: 'Bodyweight'
        },
        {
          name: 'Bird-Dog Iso Holds',
          targetMuscle: 'Erector Spinae & Contralateral Core',
          sets: 3,
          repsOrDuration: '6 reps per side (3s hold)',
          restTime: '30 secs',
          coachingCue: 'Reach long through your heel and fingertips without rotating your hips.',
          equipmentNeeded: 'Mat'
        }
      ],
      coolDown: {
        duration: '5 mins',
        activities: ['Cobra / Sphinx stretch', 'Butterfly groin stretch', 'Deep breathing relaxation']
      }
    },
    {
      dayNumber: 5,
      dayName: 'Day 5',
      focus: 'Total Body Push-Pull Circuit',
      isRestDay: false,
      estimatedTime: '40 mins',
      warmUp: {
        duration: '5 mins',
        activities: ['Shoulder rolls', 'High knees in place', 'Bodyweight good mornings']
      },
      exercises: [
        {
          name: 'Step-Ups or Box Steps',
          targetMuscle: 'Quads, Glutes & Unilateral Balance',
          sets: 3,
          repsOrDuration: '10 reps per leg',
          restTime: '60 secs',
          coachingCue: 'Drive through the lead heel rather than pushing off the trailing toe.',
          equipmentNeeded: 'Stable bench, chair, or step'
        },
        {
          name: 'Single Arm Dumbbell Floor Press',
          targetMuscle: 'Chest, Triceps & Anti-Rotation Core',
          sets: 3,
          repsOrDuration: '10 reps per arm',
          restTime: '60 secs',
          coachingCue: 'Keep ribs pinned down and control the descent slowly.',
          equipmentNeeded: 'One dumbbell'
        },
        {
          name: 'Bent-Over Rear Delt Flyes',
          targetMuscle: 'Rear Delts & Rhomboids',
          sets: 3,
          repsOrDuration: '12 reps',
          restTime: '45 secs',
          coachingCue: 'Lead with elbows slightly bent; avoid shrugging into your neck.',
          equipmentNeeded: 'Light dumbbells or water bottles'
        },
        {
          name: 'Farmer\'s Carry (Brisk Pace)',
          targetMuscle: 'Grip Strength, Traps & Core Bracing',
          sets: 3,
          repsOrDuration: '45 secs continuous',
          restTime: '60 secs',
          coachingCue: 'Stand tall with proud posture, shoulders down and back.',
          equipmentNeeded: 'Two equal weights/dumbbells'
        }
      ],
      coolDown: {
        duration: '5 mins',
        activities: ['Lying spinal twist (45s each)', 'Seated side reach', 'Mindful recovery breathwork']
      }
    },
    {
      dayNumber: 6,
      dayName: 'Day 6',
      focus: 'Aerobic Flush & Joint Decompression',
      isRestDay: false,
      estimatedTime: '30 mins',
      warmUp: {
        duration: '4 mins',
        activities: ['Ankle circles', 'Knee circles', 'Light arm swinging']
      },
      exercises: [
        {
          name: 'Zone 2 Steady Cardio (Cycling, Jogging, or Rower)',
          targetMuscle: 'Aerobic Base & Mitochondrial Health',
          sets: 1,
          repsOrDuration: '25 mins',
          restTime: 'Continuous',
          coachingCue: 'Maintain pace where you could speak in sentences without gasping.',
          equipmentNeeded: 'Stationary bike, treadmill, or outdoor trail'
        }
      ],
      coolDown: {
        duration: '5 mins',
        activities: ['Hamstring foam roll or gentle static stretch', 'Standing calf wall stretch']
      }
    },
    {
      dayNumber: 7,
      dayName: 'Day 7',
      focus: 'Complete Rest & Neural Recovery',
      isRestDay: true,
      estimatedTime: 'Rest Day',
      warmUp: {
        duration: '0 mins',
        activities: []
      },
      exercises: [
        {
          name: 'Rest, Regenerate & Sleep Extension',
          targetMuscle: 'Central Nervous System & Muscle Fiber Repair',
          sets: 1,
          repsOrDuration: 'Full Day',
          restTime: 'N/A',
          coachingCue: 'Take a relaxing bath, spend time in nature, and aim for 8+ hours of quality sleep.',
          equipmentNeeded: 'None'
        }
      ],
      coolDown: {
        duration: '0 mins',
        activities: ['Gentle evening mindfulness or restorative yoga before bed']
      },
      recoveryNote: 'Growth and fat adaptation happen during deep rest, not while training!'
    }
  ]
};

const SEED_DATA: FitBuddyDatabase = {
  users: [
    {
      id: 'usr_seed_101',
      userId: 'alex.chen',
      name: 'Alex Chen',
      age: 29,
      weight: 74,
      goal: 'General wellness',
      experience: 'Beginner',
      intensity: 'Moderate / Medium',
      workoutDays: 4,
      workoutDuration: '30-45 mins',
      equipment: 'Home equipment',
      hasMedicalCondition: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'usr_seed_102',
      userId: 'sarah.j',
      name: 'Sarah Jenkins',
      age: 34,
      weight: 66,
      goal: 'Weight management',
      experience: 'Intermediate',
      intensity: 'Moderate / Medium',
      workoutDays: 5,
      workoutDuration: '45-60 mins',
      equipment: 'Gym equipment',
      hasMedicalCondition: false,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'usr_seed_103',
      userId: 'marcus.fit',
      name: 'Marcus Brody',
      age: 42,
      weight: 88,
      goal: 'Strength',
      experience: 'Advanced',
      intensity: 'Advanced / High',
      workoutDays: 5,
      workoutDuration: '45-60 mins',
      equipment: 'Gym equipment',
      hasMedicalCondition: false,
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
    }
  ],
  workoutPlans: [
    {
      id: 'plan_seed_101',
      userId: 'alex.chen',
      originalPlan: INITIAL_SEED_PLAN,
      updatedPlan: undefined,
      feedbackHistory: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  nutritionTips: [
    {
      id: 'tip_seed_101',
      userId: 'alex.chen',
      title: 'Hydration and Electrolyte Timing for Morning Energy',
      category: 'Hydration',
      tip: 'Start your morning with 400-500ml of room temperature water and a tiny pinch of Himalayan salt to quickly rehydrate after 8 hours of sleep. Keep hydration consistent throughout the day rather than chugging water right before your training session.',
      actionablePoints: [
        'Drink 1 glass of water immediately upon waking before caffeine',
        'Consume 300ml 30 minutes before your workout session',
        'Incorporate mineral-rich foods like leafy greens, cucumber, and bananas'
      ],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]
};

class DatabaseManager {
  private data: FitBuddyDatabase = { users: [], workoutPlans: [], nutritionTips: [] };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.users || this.data.users.length === 0) {
          this.data = SEED_DATA;
          this.save();
        }
      } else {
        this.data = SEED_DATA;
        this.save();
      }
    } catch (e) {
      console.error('Error initializing database, using seed data:', e);
      this.data = SEED_DATA;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // Users
  getAllUsers(): UserProfile[] {
    return [...this.data.users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUser(userId: string): UserProfile | undefined {
    return this.data.users.find(u => u.userId.toLowerCase() === userId.toLowerCase());
  }

  saveUser(user: UserProfile): UserProfile {
    const existingIndex = this.data.users.findIndex(u => u.userId.toLowerCase() === user.userId.toLowerCase());
    if (existingIndex >= 0) {
      this.data.users[existingIndex] = { ...this.data.users[existingIndex], ...user };
    } else {
      this.data.users.push(user);
    }
    this.save();
    return user;
  }

  deleteUser(userId: string): boolean {
    const initialCount = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.userId.toLowerCase() !== userId.toLowerCase());
    this.data.workoutPlans = this.data.workoutPlans.filter(p => p.userId.toLowerCase() !== userId.toLowerCase());
    this.data.nutritionTips = this.data.nutritionTips.filter(t => t.userId.toLowerCase() !== userId.toLowerCase());
    this.save();
    return this.data.users.length < initialCount;
  }

  // Workout Plans
  getPlanForUser(userId: string): WorkoutPlanRecord | undefined {
    return this.data.workoutPlans.find(p => p.userId.toLowerCase() === userId.toLowerCase());
  }

  getAllPlans(): WorkoutPlanRecord[] {
    return this.data.workoutPlans;
  }

  savePlan(plan: WorkoutPlanRecord): WorkoutPlanRecord {
    const existingIndex = this.data.workoutPlans.findIndex(p => p.userId.toLowerCase() === plan.userId.toLowerCase());
    if (existingIndex >= 0) {
      this.data.workoutPlans[existingIndex] = plan;
    } else {
      this.data.workoutPlans.push(plan);
    }
    this.save();
    return plan;
  }

  // Nutrition Tips
  getNutritionTipForUser(userId: string): NutritionTipRecord | undefined {
    return this.data.nutritionTips.find(t => t.userId.toLowerCase() === userId.toLowerCase());
  }

  saveNutritionTip(tip: NutritionTipRecord): NutritionTipRecord {
    const existingIndex = this.data.nutritionTips.findIndex(t => t.userId.toLowerCase() === tip.userId.toLowerCase());
    if (existingIndex >= 0) {
      this.data.nutritionTips[existingIndex] = tip;
    } else {
      this.data.nutritionTips.push(tip);
    }
    this.save();
    return tip;
  }
}

export const db = new DatabaseManager();
