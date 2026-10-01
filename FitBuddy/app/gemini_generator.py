import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY", "")

def get_gemini_client():
    if not API_KEY:
        return None
    return genai.Client(api_key=API_KEY)

def generate_workout_plan(user_data: dict) -> dict:
    """
    Generates a personalized, beginner-friendly and safe 7-day workout plan using Gemini.
    """
    client = get_gemini_client()
    if not client:
        return get_fallback_workout_plan(user_data)

    prompt = f"""
You are a responsible AI fitness assistant.
Create a safe, beginner-friendly and personalized 7-day fitness plan.

User information:
Name: {user_data.get('name')}
Age: {user_data.get('age')}
Weight: {user_data.get('weight')} kg
Goal: {user_data.get('goal')}
Experience: {user_data.get('experience')}
Intensity: {user_data.get('intensity')}
Workout days: {user_data.get('workout_days')}
Duration: {user_data.get('workout_duration')}
Equipment: {user_data.get('equipment')}

Create a structured 7-day plan (Day 1 through Day 7).

For every day provide:
- Focus
- Warm-up (duration, list of activities)
- Exercises (name, targetMuscle, sets, repetitions/duration, rest time, coachingCue, equipmentNeeded)
- Cool-down (duration, list of activities)

Include appropriate recovery/rest days matching their available workout days.
Keep recommendations practical and suitable for the user's experience.
Avoid unsafe or extreme recommendations.
Return the result strictly in valid JSON format matching this schema:
{{
  "overview": {{
    "summary": "string",
    "targetOutcome": "string",
    "weeklySplitDescription": "string",
    "safetyGuidance": "string"
  }},
  "days": [
    {{
      "dayNumber": 1,
      "dayName": "Day 1",
      "focus": "string",
      "isRestDay": false,
      "estimatedTime": "string",
      "warmUp": {{ "duration": "string", "activities": ["string"] }},
      "exercises": [
        {{
          "name": "string",
          "targetMuscle": "string",
          "sets": "string",
          "repsOrDuration": "string",
          "restTime": "string",
          "coachingCue": "string",
          "equipmentNeeded": "string"
        }}
      ],
      "coolDown": {{ "duration": "string", "activities": ["string"] }},
      "recoveryNote": "string"
    }}
  ]
}}
"""
    try:
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.7
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}. Using safe fallback plan.")
        return get_fallback_workout_plan(user_data)

def generate_nutrition_tip(user_data: dict) -> dict:
    """
    Generates a practical, general wellness nutrition and recovery tip based on user goal.
    """
    client = get_gemini_client()
    if not client:
        return get_fallback_nutrition_tip(user_data)

    prompt = f"""
Generate "Today's Nutrition & Recovery Tip" for a fitness user.
User Name: {user_data.get('name')}
Goal: {user_data.get('goal')}
Experience: {user_data.get('experience')}
Intensity: {user_data.get('intensity')}

Requirements:
- Emphasize practical general wellness (hydration, balanced meals, protein sources, sleep, rest, healthy food choices).
- Do not prescribe extreme calorie restriction or unsafe dieting.
- Return structured JSON:
{{
  "title": "string",
  "category": "Hydration | Balanced meals | Protein sources | Sleep | Recovery | Healthy food choices",
  "tip": "string (practical 2-3 paragraph advice)",
  "actionablePoints": ["point 1", "point 2", "point 3"]
}}
"""
    try:
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.6
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini nutrition API: {e}")
        return get_fallback_nutrition_tip(user_data)

def get_fallback_workout_plan(user_data: dict) -> dict:
    days = []
    active_days_count = int(user_data.get('workout_days', 4))
    equip = user_data.get('equipment', 'Home equipment')
    goal = user_data.get('goal', 'General wellness')

    for i in range(1, 8):
        is_rest = i > active_days_count
        if is_rest:
            days.append({
                "dayNumber": i,
                "dayName": f"Day {i}",
                "focus": "Active Recovery & Mobility",
                "isRestDay": True,
                "estimatedTime": "25 mins",
                "warmUp": {"duration": "5 mins", "activities": ["Gentle neck and shoulder rolls", "Cat-cow spinal stretches"]},
                "exercises": [
                    {
                        "name": "Zone 1 Gentle Recovery Walk",
                        "targetMuscle": "Cardiovascular flush & circulation",
                        "sets": "1",
                        "repsOrDuration": "20 mins",
                        "restTime": "None",
                        "coachingCue": "Breathe naturally through your nose and enjoy relaxed movement.",
                        "equipmentNeeded": "Walking shoes"
                    }
                ],
                "coolDown": {"duration": "5 mins", "activities": ["Hamstring and calf gentle stretch", "Mindful deep breathing"]},
                "recoveryNote": "Prioritize hydration and restful sleep today."
            })
        else:
            focus_title = "Upper Body & Posture" if i % 2 == 1 else "Lower Body & Core Stability"
            days.append({
                "dayNumber": i,
                "dayName": f"Day {i}",
                "focus": focus_title,
                "isRestDay": False,
                "estimatedTime": user_data.get('workout_duration', '30-45 mins'),
                "warmUp": {"duration": "5 mins", "activities": ["Arm circles", "Bodyweight squats (10 reps)", "Inchworms"]},
                "exercises": [
                    {
                        "name": "Push-Ups (or Incline Modification)",
                        "targetMuscle": "Chest, Shoulders & Triceps",
                        "sets": "3",
                        "repsOrDuration": "8 - 12 reps",
                        "restTime": "60 secs",
                        "coachingCue": "Keep your core braced and lower smoothly with control.",
                        "equipmentNeeded": equip
                    },
                    {
                        "name": "Bodyweight or Loaded Squats",
                        "targetMuscle": "Quadriceps & Glutes",
                        "sets": "3",
                        "repsOrDuration": "10 - 12 reps",
                        "restTime": "60 secs",
                        "coachingCue": "Chest upright, push through whole foot, knees tracking toes.",
                        "equipmentNeeded": equip
                    },
                    {
                        "name": "Dead Bug Core Stabilization",
                        "targetMuscle": "Transverse Abdominis",
                        "sets": "3",
                        "repsOrDuration": "8 reps per side",
                        "restTime": "45 secs",
                        "coachingCue": "Press lower back firmly into the floor throughout.",
                        "equipmentNeeded": "Mat"
                    }
                ],
                "coolDown": {"duration": "5 mins", "activities": ["Cross-body shoulder stretch", "Lying spinal twist", "Diaphragmatic breathing"]}
            })

    return {
        "overview": {
            "summary": f"Personalized 7-Day fitness program targeting {goal}.",
            "targetOutcome": f"Build consistent functional strength and cardiovascular health safely.",
            "weeklySplitDescription": f"{active_days_count} active workout days with {7 - active_days_count} recovery days.",
            "safetyGuidance": "Listen to your body. Warm up thoroughly and halt any exercise causing sharp discomfort."
        },
        "days": days
    }

def get_fallback_nutrition_tip(user_data: dict) -> dict:
    return {
        "title": f"Nutritional Foundations for {user_data.get('goal', 'Wellness')}",
        "category": "Balanced meals",
        "tip": f"To best support your {user_data.get('goal', 'wellness')} goals, structure your meals around whole foods: adequate lean protein for muscular repair, complex carbs for steady energy, and fiber-rich vegetables. Stay hydrated with water throughout the day.",
        "actionablePoints": [
            "Drink a tall glass of water first thing in the morning",
            "Include a palm-sized portion of protein with lunch and dinner",
            "Aim for 7-8 hours of restful sleep to optimize muscle recovery"
        ]
    }
