import { GoogleGenAI, Type } from '@google/genai';
import { PlanData, UserProfile, NutritionTipRecord } from '../types/fitness';

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: 'Overview and philosophy of this 7-day program' },
        targetOutcome: { type: Type.STRING, description: 'What the user will achieve' },
        weeklySplitDescription: { type: Type.STRING, description: 'Description of the weekly training split' },
        safetyGuidance: { type: Type.STRING, description: 'Safe lifting reminders, injury prevention, and hydration advice' },
        changelogNote: { type: Type.STRING, description: 'Optional explanation if this is a modified plan' },
      },
      required: ['summary', 'targetOutcome', 'weeklySplitDescription', 'safetyGuidance'],
    },
    days: {
      type: Type.ARRAY,
      description: 'Exactly 7 day entries from Day 1 to Day 7',
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          dayName: { type: Type.STRING },
          focus: { type: Type.STRING, description: 'Focus of the day, e.g. Upper Body & Core or Active Recovery' },
          isRestDay: { type: Type.BOOLEAN },
          estimatedTime: { type: Type.STRING, description: 'e.g. 35 mins or Rest' },
          intensityLevel: { type: Type.STRING, description: 'Low, Medium, or High' },
          warmUp: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['duration', 'activities'],
          },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                targetMuscle: { type: Type.STRING },
                sets: { type: Type.STRING, description: 'Number of sets, e.g. 3 or 3-4' },
                repsOrDuration: { type: Type.STRING, description: 'e.g. 10-12 reps or 40 secs' },
                restTime: { type: Type.STRING, description: 'e.g. 60 secs' },
                coachingCue: { type: Type.STRING, description: 'Key form cue for safety and optimal muscle recruitment' },
                equipmentNeeded: { type: Type.STRING, description: 'e.g. Dumbbells, Mat, or Bodyweight' },
              },
              required: ['name', 'targetMuscle', 'sets', 'repsOrDuration', 'restTime', 'coachingCue', 'equipmentNeeded'],
            },
          },
          coolDown: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['duration', 'activities'],
          },
          recoveryNote: { type: Type.STRING, description: 'Specific tip for recovery on this day' },
        },
        required: ['dayNumber', 'dayName', 'focus', 'isRestDay', 'estimatedTime', 'warmUp', 'exercises', 'coolDown'],
      },
    },
  },
  required: ['overview', 'days'],
};

const NUTRITION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Catchy, positive title for the wellness tip' },
    category: {
      type: Type.STRING,
      description: 'One of: Hydration, Balanced meals, Protein sources, Sleep, Active Recovery, Healthy food choices',
    },
    tip: { type: Type.STRING, description: '2 to 3 actionable, uplifting paragraphs of practical wellness advice' },
    actionablePoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 concise daily action points to implement right away',
    },
  },
  required: ['title', 'category', 'tip', 'actionablePoints'],
};

export async function generateWorkoutPlanAI(user: UserProfile): Promise<PlanData> {
  const prompt = `
You are a certified, responsible AI fitness coach for "FitBuddy".
Create a safe, beginner-friendly, and personalized 7-day fitness plan based on the user's details:

User Profile:
- Name: ${user.name}
- Age: ${user.age} years old
- Weight: ${user.weight} kg
- Fitness Goal: ${user.goal}
- Experience Level: ${user.experience}
- Workout Intensity: ${user.intensity}
- Available Workout Days: ${user.workoutDays} days per week
- Target Workout Duration: ${user.workoutDuration}
- Equipment: ${user.equipment}
${user.hasMedicalCondition ? `- Note/Medical info: User mentioned: "${user.medicalNotes || 'general joint caution'}"` : ''}

CRITICAL RULES:
1. Provide a full 7-Day sequence (Day 1 through Day 7).
2. Balance active workout days and rest/recovery days according to the user's available days (${user.workoutDays} active days, remainder should be Active Recovery or Rest).
3. Every exercise must include accurate coaching cues focused on posture, breathing, and safe joint mechanics.
4. Match the user's equipment (${user.equipment}) precisely. If 'No equipment', provide exclusively bodyweight or household-accessible variations.
5. Keep exercises accessible for their experience (${user.experience}) and intensity (${user.intensity}).
6. Do NOT diagnose conditions or prescribe extreme regimens. Keep the tone encouraging and scientifically grounded.
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY missing, using fallback generator.');
      return getFallbackPlan(user);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are FitBuddy AI, a professional strength and conditioning specialist focused on safe, evidence-based, sustainable physical wellness.',
        responseMimeType: 'application/json',
        responseSchema: PLAN_RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text) as PlanData;
    return parsed;
  } catch (error) {
    console.error('Error generating workout plan with Gemini:', error);
    return getFallbackPlan(user);
  }
}

export async function generateNutritionTipAI(user: UserProfile): Promise<Omit<NutritionTipRecord, 'id' | 'userId' | 'createdAt'>> {
  const prompt = `
Generate "Today's Nutrition & Recovery Tip" for FitBuddy user ${user.name}.
User Goal: ${user.goal}
User Experience: ${user.experience}
Workout Intensity: ${user.intensity}

Requirements:
- Emphasize general wellness: hydration, balanced whole foods, protein distribution, mindful eating, sleep hygiene, or muscle recovery.
- Do NOT prescribe extreme calorie restriction, unverified supplements, or unsafe fad diets.
- Provide 3 practical bullet points they can adopt today.
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return getFallbackNutrition(user);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a certified nutrition coach promoting sustainable whole-body health and vitality.',
        responseMimeType: 'application/json',
        responseSchema: NUTRITION_RESPONSE_SCHEMA,
        temperature: 0.6,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response for nutrition');
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating nutrition tip with Gemini:', error);
    return getFallbackNutrition(user);
  }
}

export async function updateWorkoutPlanAI(
  originalPlan: PlanData,
  feedback: string,
  user: UserProfile
): Promise<PlanData> {
  const prompt = `
You are the FitBuddy AI Coach.
The user wants to refine their current 7-Day fitness plan based on their real-world experience and feedback.

User Profile:
- Name: ${user.name}
- Goal: ${user.goal}
- Experience: ${user.experience}
- Intensity: ${user.intensity}
- Equipment: ${user.equipment}

User's Feedback / Requested Adjustments:
"${feedback}"

Current 7-Day Plan Overview:
${JSON.stringify(originalPlan.overview)}

Current Days Summary:
${originalPlan.days.map(d => `${d.dayName} (${d.focus}, Rest: ${d.isRestDay})`).join('; ')}

Instructions:
1. Revise the 7-day program specifically addressing the feedback (e.g. adding more cardio, easing intensity, altering rest days, substituting exercises for time constraints, or targeting specific muscle groups).
2. Ensure Day 1 to Day 7 remain complete with warm-ups, exercises with cues, and cool-downs.
3. In the "overview.changelogNote", write a clear, friendly 1-2 sentence note explaining what modifications were made based on their feedback.
4. Keep the exercises safe and aligned with their equipment (${user.equipment}).
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return getFallbackUpdatedPlan(originalPlan, feedback, user);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are FitBuddy AI coach adapting a workout plan with empathy, precision, and adherence to user feedback.',
        responseMimeType: 'application/json',
        responseSchema: PLAN_RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response for plan update');
    return JSON.parse(text) as PlanData;
  } catch (error) {
    console.error('Error updating workout plan with Gemini:', error);
    return getFallbackUpdatedPlan(originalPlan, feedback, user);
  }
}

function getFallbackPlan(user: UserProfile): PlanData {
  const isGym = user.equipment === 'Gym equipment';
  const isNoEquip = user.equipment === 'No equipment';
  const pressExercise = isGym ? 'Barbell Bench Press or Machine Chest Press' : isNoEquip ? 'Standard Floor Push-Ups' : 'Dumbbell Floor Press';
  const rowExercise = isGym ? 'Seated Cable Row or Lat Pulldown' : isNoEquip ? 'Prone Back Extensions & Towel Rows' : 'Single-Arm Dumbbell Rows';
  const squatExercise = isGym ? 'Barbell Back Squat or Leg Press' : isNoEquip ? 'Bodyweight Air Squats with 2s Pause' : 'Goblet Squats with Dumbbell';

  return {
    overview: {
      summary: `Tailored 7-Day ${user.goal} blueprint calibrated for ${user.experience} level with ${user.intensity} intensity and ${user.equipment}.`,
      targetOutcome: `Enhanced functional capacity, improved movement quality, and consistent habit formation within ${user.workoutDuration} daily sessions.`,
      weeklySplitDescription: `${user.workoutDays} focused training days with strategically placed recovery to optimize recovery and prevent fatigue.`,
      safetyGuidance: 'Always perform the designated warm-up. Control the eccentric tempo (lowering phase) and breathe rhythmically.',
    },
    days: [
      {
        dayNumber: 1,
        dayName: 'Day 1',
        focus: 'Upper Body Strength & Joint Armor',
        isRestDay: false,
        estimatedTime: user.workoutDuration,
        intensityLevel: user.intensity,
        warmUp: {
          duration: '5 mins',
          activities: ['Arm circles (forward & reverse)', 'Scapular push-ups (10 reps)', 'Doorway chest stretch']
        },
        exercises: [
          {
            name: pressExercise,
            targetMuscle: 'Pectorals, Anterior Deltoids & Triceps',
            sets: '3',
            repsOrDuration: user.experience === 'Beginner' ? '8 - 10 reps' : '10 - 12 reps',
            restTime: '60 secs',
            coachingCue: 'Keep shoulders packed down away from ears; maintain active core brace.',
            equipmentNeeded: user.equipment
          },
          {
            name: rowExercise,
            targetMuscle: 'Upper Back, Rhomboids & Lats',
            sets: '3',
            repsOrDuration: '10 - 12 reps',
            restTime: '60 secs',
            coachingCue: 'Squeeze the shoulder blades firmly at peak contraction without arching lower back.',
            equipmentNeeded: user.equipment
          },
          {
            name: isNoEquip ? 'Pike Push-Ups or Bear Crawl Hold' : 'Dumbbell Arnold Press',
            targetMuscle: 'Shoulders & Core',
            sets: '3',
            repsOrDuration: '8 - 10 reps',
            restTime: '60 secs',
            coachingCue: 'Lock out overhead smoothly without thrusting your ribs forward.',
            equipmentNeeded: user.equipment
          }
        ],
        coolDown: {
          duration: '5 mins',
          activities: ['Cross-body shoulder hold', 'Overhead tricep stretch', 'Diaphragmatic box breathing']
        }
      },
      {
        dayNumber: 2,
        dayName: 'Day 2',
        focus: 'Lower Body Power & Kinetic Chain Balance',
        isRestDay: false,
        estimatedTime: user.workoutDuration,
        intensityLevel: user.intensity,
        warmUp: {
          duration: '6 mins',
          activities: ['Leg swings (front & side)', 'Bodyweight glute bridges (12 reps)', 'Ankle mobility rocks']
        },
        exercises: [
          {
            name: squatExercise,
            targetMuscle: 'Quadriceps, Glutes & Adductors',
            sets: '3',
            repsOrDuration: '10 - 12 reps',
            restTime: '75 secs',
            coachingCue: 'Distribute weight evenly across whole foot; track knees over mid-toes.',
            equipmentNeeded: user.equipment
          },
          {
            name: isGym ? 'Lying Leg Curl or RDL' : isNoEquip ? 'Single-Leg Romanian Deadlift (Bodyweight)' : 'Dumbbell Romanian Deadlift',
            targetMuscle: 'Hamstrings & Gluteus Maximus',
            sets: '3',
            repsOrDuration: '10 reps',
            restTime: '75 secs',
            coachingCue: 'Hinge hips backwards while maintaining a flat neutral spine.',
            equipmentNeeded: user.equipment
          },
          {
            name: 'Walking or Reverse Lunges',
            targetMuscle: 'Unilateral Quads & Hip Stabilizers',
            sets: '3',
            repsOrDuration: '8 reps per side',
            restTime: '60 secs',
            coachingCue: 'Land softly, keeping the torso proud and front knee stable.',
            equipmentNeeded: 'Bodyweight or light load'
          }
        ],
        coolDown: {
          duration: '5 mins',
          activities: ['Kneeling hip flexor stretch', 'Standing quad stretch', 'Seated butterfly pose']
        }
      },
      {
        dayNumber: 3,
        dayName: 'Day 3',
        focus: user.workoutDays <= 3 ? 'Active Recovery & Tissue Regeneration' : 'Core Stability & Low-Impact Cardio',
        isRestDay: user.workoutDays <= 3,
        estimatedTime: '25 mins',
        intensityLevel: 'Low',
        warmUp: {
          duration: '5 mins',
          activities: ['Gentle cat-cow spinal flexions', 'Bird-dog reaches (6 each side)']
        },
        exercises: [
          {
            name: 'Zone 1-2 Brisk Walking or Light Cycling',
            targetMuscle: 'Aerobic Base & Metabolic Flush',
            sets: '1',
            repsOrDuration: '20 mins continuous',
            restTime: 'None',
            coachingCue: 'Breathe smoothly through nose; keep relaxed upright posture.',
            equipmentNeeded: 'None / Walking shoes'
          },
          {
            name: 'Dead Bug Core Engagement',
            targetMuscle: 'Transverse Abdominis',
            sets: '3',
            repsOrDuration: '8 reps per side',
            restTime: '45 secs',
            coachingCue: 'Do not allow lower back to lift away from the floor.',
            equipmentNeeded: 'Mat'
          }
        ],
        coolDown: {
          duration: '5 mins',
          activities: ['Child pose with side reach', 'Lying hamstring stretch']
        },
        recoveryNote: 'Sip lemon water and focus on relaxed nasal breathing.'
      },
      {
        dayNumber: 4,
        dayName: 'Day 4',
        focus: 'Total Body Push-Pull Conditioning',
        isRestDay: false,
        estimatedTime: user.workoutDuration,
        intensityLevel: user.intensity,
        warmUp: {
          duration: '5 mins',
          activities: ['Arm swings', 'Torso rotations', 'Inchworms into upward dog (5 reps)']
        },
        exercises: [
          {
            name: isNoEquip ? 'Decline or Tempo Push-Ups' : 'Incline Dumbbell or Machine Press',
            targetMuscle: 'Upper Chest & Front Deltoids',
            sets: '3',
            repsOrDuration: '10 - 12 reps',
            restTime: '60 secs',
            coachingCue: 'Lower under control for 2 seconds before pressing firmly up.',
            equipmentNeeded: user.equipment
          },
          {
            name: isGym ? 'Lat Pulldown or Seated Cable Row' : isNoEquip ? 'Doorway Row or Prone Y-T-W Raises' : 'Dumbbell Bent-Over Row',
            targetMuscle: 'Lats & Mid-Trapezius',
            sets: '3',
            repsOrDuration: '10 - 12 reps',
            restTime: '60 secs',
            coachingCue: 'Drive elbows back toward hips; keep neck relaxed.',
            equipmentNeeded: user.equipment
          },
          {
            name: 'Plank Shoulder Taps',
            targetMuscle: 'Anti-Rotation Core & Delts',
            sets: '3',
            repsOrDuration: '10 taps per arm',
            restTime: '45 secs',
            coachingCue: 'Widen your feet slightly to prevent hips from swaying.',
            equipmentNeeded: 'Mat'
          }
        ],
        coolDown: {
          duration: '5 mins',
          activities: ['Lying spinal twist', 'Doorway chest opener', 'Deep diaphragmatic breathing']
        }
      },
      {
        dayNumber: 5,
        dayName: 'Day 5',
        focus: user.workoutDays >= 5 ? 'Posterior Chain & Functional Glute Drive' : 'Active Mobility & Stretch',
        isRestDay: user.workoutDays < 5,
        estimatedTime: user.workoutDays >= 5 ? user.workoutDuration : '25 mins',
        intensityLevel: user.workoutDays >= 5 ? user.intensity : 'Low',
        warmUp: {
          duration: '5 mins',
          activities: ['Monster walks or side steps', 'Glute bridges (15 reps)', 'Calf raises']
        },
        exercises: [
          {
            name: isNoEquip ? 'Elevated Single-Leg Glute Bridges' : 'Dumbbell Step-Ups onto Sturdy Bench',
            targetMuscle: 'Glutes, Hamstrings & Unilateral Hip Stability',
            sets: '3',
            repsOrDuration: '10 reps each leg',
            restTime: '60 secs',
            coachingCue: 'Push straight through the front heel, avoiding kicking off rear toes.',
            equipmentNeeded: user.equipment
          },
          {
            name: 'Farmer Walk or Suitcase Carry',
            targetMuscle: 'Grip Strength, Obliques & Spinal Posture',
            sets: '3',
            repsOrDuration: '40 secs',
            restTime: '45 secs',
            coachingCue: 'Walk tall with shoulders level; resist any lateral leaning.',
            equipmentNeeded: isNoEquip ? 'Heavy backpacks or water jugs' : 'Dumbbells / Kettlebells'
          }
        ],
        coolDown: {
          duration: '5 mins',
          activities: ['Pigeon pose stretch (40s each)', 'Seated hamstring stretch']
        }
      },
      {
        dayNumber: 6,
        dayName: 'Day 6',
        focus: 'Aerobic Flush & Dynamic Movement Flow',
        isRestDay: false,
        estimatedTime: '30 mins',
        intensityLevel: 'Moderate / Medium',
        warmUp: {
          duration: '4 mins',
          activities: ['Joint rotations', 'Gentle high knees', 'Bodyweight side lunges']
        },
        exercises: [
          {
            name: 'Sustained Aerobic Interval (Run, Cycle, Row or Power Walk)',
            targetMuscle: 'Cardiovascular Efficiency & Mitochondrial Health',
            sets: '1',
            repsOrDuration: '25 mins',
            restTime: 'Continuous',
            coachingCue: 'Maintain an effort level where you could comfortably hold a conversation.',
            equipmentNeeded: 'None / Cardio equipment if accessible'
          }
        ],
        coolDown: {
          duration: '5 mins',
          activities: ['Hamstring stretch', 'Cobra stretch', 'Calf wall stretch']
        }
      },
      {
        dayNumber: 7,
        dayName: 'Day 7',
        focus: 'Full Rest, Neural Reset & Weekly Reflection',
        isRestDay: true,
        estimatedTime: 'Rest Day',
        intensityLevel: 'Rest',
        warmUp: {
          duration: '0 mins',
          activities: []
        },
        exercises: [
          {
            name: 'Restorative Sleep & Passive Muscle Recovery',
            targetMuscle: 'Systemic Nervous System Restoration',
            sets: '1',
            repsOrDuration: 'Full Day',
            restTime: 'N/A',
            coachingCue: 'Spend time outdoors, hydrate with electrolyte water, and target 8+ hours of quality sleep.',
            equipmentNeeded: 'None'
          }
        ],
        coolDown: {
          duration: '0 mins',
          activities: ['Optional evening stretching or foam rolling before sleep']
        },
        recoveryNote: 'Your muscles grow and rebuild during sleep. Prioritize rest today.'
      }
    ]
  };
}

function getFallbackNutrition(user: UserProfile): Omit<NutritionTipRecord, 'id' | 'userId' | 'createdAt'> {
  return {
    title: `Post-Workout Fueling & Hydration for ${user.goal}`,
    category: 'Balanced meals',
    tip: `To fuel your ${user.goal.toLowerCase()} journey effectively, aim to combine quality lean protein (like eggs, lentils, tofu, or poultry) with complex carbohydrates and vibrant colorful vegetables. Carbohydrates replenish muscle glycogen expended during your ${user.workoutDuration} sessions, while amino acids from protein kickstart muscular repair.`,
    actionablePoints: [
      'Consume a balanced meal or snack with 20-30g of protein within 90 minutes post-training',
      'Keep a reusable 750ml water bottle at your desk to sip consistently between meals',
      'Aim for 7 to 8.5 hours of uninterrupted sleep to maximize growth hormone release'
    ]
  };
}

function getFallbackUpdatedPlan(originalPlan: PlanData, feedback: string, user: UserProfile): PlanData {
  const updatedDays = originalPlan.days.map((day, idx) => {
    // If feedback asks for more cardio
    if (feedback.toLowerCase().includes('cardio') && !day.isRestDay) {
      return {
        ...day,
        focus: `${day.focus} + Cardio Finisher`,
        exercises: [
          ...day.exercises,
          {
            name: 'Cardio Intervals (Jumping Jacks / Mountain Climbers)',
            targetMuscle: 'Cardiovascular Conditioning',
            sets: '3',
            repsOrDuration: '45 secs on / 15 secs rest',
            restTime: '45 secs',
            coachingCue: 'Pace yourself with steady breathing and soft landings.',
            equipmentNeeded: 'Bodyweight'
          }
        ]
      };
    }
    // If feedback asks for easier / beginner
    if (feedback.toLowerCase().includes('easier') || feedback.toLowerCase().includes('low') || feedback.toLowerCase().includes('light')) {
      return {
        ...day,
        intensityLevel: 'Low - Moderate',
        exercises: day.exercises.map(ex => ({
          ...ex,
          sets: '2',
          repsOrDuration: '8 - 10 reps',
          restTime: '75 secs',
          coachingCue: `${ex.coachingCue} Focus on smooth, easy range of motion without straining.`
        }))
      };
    }
    // If feedback asks for flexibility / stretching
    if (feedback.toLowerCase().includes('flexibility') || feedback.toLowerCase().includes('stretch')) {
      return {
        ...day,
        coolDown: {
          duration: '10 mins',
          activities: [
            ...day.coolDown.activities,
            'Hamstring dynamic flossing',
            'Pigeon hip opener (45s each)',
            'Torso thread-the-needle stretch'
          ]
        }
      };
    }
    return day;
  });

  return {
    overview: {
      ...originalPlan.overview,
      summary: `Updated 7-Day Plan customized based on your feedback: "${feedback}".`,
      changelogNote: `Plan updated to reflect: "${feedback}". Exercises, volume, and pacing have been adjusted while preserving your core goal.`
    },
    days: updatedDays
  };
}
