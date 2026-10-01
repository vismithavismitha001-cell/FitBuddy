from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    user_id: str = Field(..., description="Unique alphanumeric identifier")
    name: str = Field(..., min_length=2, max_length=150)
    age: int = Field(..., ge=12, le=110)
    weight: float = Field(..., ge=20.0, le=350.0)
    goal: str
    experience: str
    intensity: str
    workout_days: int = Field(default=4, ge=1, le=7)
    workout_duration: str = Field(default="30-45 mins")
    equipment: str = Field(default="Home equipment")
    has_medical_condition: Optional[bool] = False
    medical_notes: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackSubmit(BaseModel):
    user_id: str
    feedback: str = Field(..., min_length=3, max_length=1000)

class ExerciseSchema(BaseModel):
    name: str
    targetMuscle: str
    sets: str
    repsOrDuration: str
    restTime: str
    coachingCue: str
    equipmentNeeded: str

class DayWarmUpCoolDown(BaseModel):
    duration: str
    activities: List[str]

class DayPlanSchema(BaseModel):
    dayNumber: int
    dayName: str
    focus: str
    isRestDay: bool
    estimatedTime: str
    warmUp: DayWarmUpCoolDown
    exercises: List[ExerciseSchema]
    coolDown: DayWarmUpCoolDown
    intensityLevel: Optional[str] = None
    recoveryNote: Optional[str] = None

class PlanOverviewSchema(BaseModel):
    summary: str
    targetOutcome: str
    weeklySplitDescription: str
    safetyGuidance: str
    changelogNote: Optional[str] = None

class FullPlanSchema(BaseModel):
    overview: PlanOverviewSchema
    days: List[DayPlanSchema]

class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: str
    original_plan: Dict[str, Any]
    updated_plan: Optional[Dict[str, Any]] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NutritionTipResponse(BaseModel):
    id: int
    user_id: str
    title: str
    category: str
    tip: str
    created_at: datetime

    class Config:
        from_attributes = True
