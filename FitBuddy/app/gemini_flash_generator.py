"""
Gemini Flash Specialized Fitness Generator for FitBuddy
Leverages Gemini 3.8 Flash for ultra-fast, structured plan creation.
"""
from .gemini_generator import generate_workout_plan, generate_nutrition_tip

# Re-export functions for modular use
__all__ = ["generate_workout_plan", "generate_nutrition_tip"]
