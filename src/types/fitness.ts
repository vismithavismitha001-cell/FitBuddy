export type FitnessGoal =
  | 'General wellness'
  | 'Weight management'
  | 'Strength'
  | 'Muscle building'
  | 'Flexibility'
  | 'Endurance';

export type FitnessExperience = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutIntensity =
  | 'Beginner / Low'
  | 'Moderate / Medium'
  | 'Advanced / High';

export type EquipmentAvailability =
  | 'No equipment'
  | 'Home equipment'
  | 'Gym equipment';

export type WorkoutDuration =
  | '15-30 mins'
  | '30-45 mins'
  | '45-60 mins'
  | '60+ mins';

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  weight: number;
  goal: FitnessGoal;
  experience: FitnessExperience;
  intensity: WorkoutIntensity;
  workoutDays: number;
  workoutDuration: WorkoutDuration;
  equipment: EquipmentAvailability;
  hasMedicalCondition?: boolean;
  medicalNotes?: string;
  createdAt: string;
}

export interface Exercise {
  name: string;
  targetMuscle: string;
  sets: string | number;
  repsOrDuration: string;
  restTime: string;
  coachingCue: string;
  equipmentNeeded: string;
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  focus: string;
  isRestDay: boolean;
  estimatedTime: string;
  warmUp: {
    duration: string;
    activities: string[];
  };
  exercises: Exercise[];
  coolDown: {
    duration: string;
    activities: string[];
  };
  intensityLevel?: string;
  recoveryNote?: string;
}

export interface PlanOverview {
  summary: string;
  targetOutcome: string;
  weeklySplitDescription: string;
  safetyGuidance: string;
  changelogNote?: string;
}

export interface PlanData {
  overview: PlanOverview;
  days: DayPlan[];
}

export interface FeedbackRecord {
  id: string;
  feedback: string;
  submittedAt: string;
  changesApplied?: string[];
}

export interface WorkoutPlanRecord {
  id: string;
  userId: string;
  originalPlan: PlanData;
  updatedPlan?: PlanData;
  feedbackHistory: FeedbackRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface NutritionTipRecord {
  id: string;
  userId: string;
  title: string;
  category: string;
  tip: string;
  actionablePoints: string[];
  createdAt: string;
}

export interface PlanGenerationResponse {
  success: boolean;
  message?: string;
  user: UserProfile;
  plan: WorkoutPlanRecord;
  nutritionTip: NutritionTipRecord;
}
