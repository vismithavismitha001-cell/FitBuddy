import json
from google.genai import types
from .gemini_generator import get_gemini_client

def update_workout_plan(original_plan: dict, feedback: str, user_data: dict) -> dict:
    """
    Updates an existing 7-day fitness plan based on user feedback.
    Keeps the original plan intact and returns a new updated plan.
    """
    client = get_gemini_client()
    if not client:
        return fallback_update_plan(original_plan, feedback)

    prompt = f"""
You are the FitBuddy AI Coach.
The user wants to update their 7-day fitness plan based on feedback.

User details:
- Name: {user_data.get('name')}
- Goal: {user_data.get('goal')}
- Experience: {user_data.get('experience')}
- Intensity: {user_data.get('intensity')}
- Equipment: {user_data.get('equipment')}

User Feedback:
"{feedback}"

Original Plan Overview:
{json.dumps(original_plan.get('overview', {}))}

Original Plan Days:
{json.dumps(original_plan.get('days', []))}

Instructions:
1. Update the 7-day workout plan to address the user's feedback (e.g. adding more cardio, making workouts easier, adding rest days, shorter sessions, or flexibility).
2. Maintain beginner-friendly, safe exercise practices and respect the user's equipment.
3. In the overview object, add a "changelogNote" describing what was changed in response to the feedback.
4. Return the complete updated plan in structured JSON format matching the original schema.
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
        print(f"Error calling Gemini plan update: {e}")
        return fallback_update_plan(original_plan, feedback)

def fallback_update_plan(original_plan: dict, feedback: str) -> dict:
    updated = json.loads(json.dumps(original_plan))
    updated["overview"]["changelogNote"] = f"Plan updated to incorporate user feedback: '{feedback}'."
    # Tweak exercises or intensity
    for day in updated.get("days", []):
        if not day.get("isRestDay"):
            day["focus"] = f"{day.get('focus')} (Modified: {feedback[:20]})"
    return updated
