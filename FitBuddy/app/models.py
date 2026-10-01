from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    age = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    goal = Column(String(100), nullable=False)
    experience = Column(String(50), nullable=False)
    intensity = Column(String(50), nullable=False)
    workout_days = Column(Integer, default=4)
    workout_duration = Column(String(50), default="30-45 mins")
    equipment = Column(String(100), default="Home equipment")
    has_medical_condition = Column(Boolean, default=False)
    medical_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    plans = relationship("WorkoutPlan", back_populates="user", cascade="all, delete-orphan")
    nutrition_tips = relationship("NutritionTip", back_populates="user", cascade="all, delete-orphan")


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.user_id"), nullable=False)
    original_plan = Column(Text, nullable=False)  # JSON-encoded string
    updated_plan = Column(Text, nullable=True)   # JSON-encoded string
    feedback = Column(Text, nullable=True)       # User feedback that caused update
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="plans")


class NutritionTip(Base):
    __tablename__ = "nutrition_tips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.user_id"), nullable=False)
    title = Column(String(200), default="Daily Wellness & Recovery Tip")
    category = Column(String(100), default="Balanced meals")
    tip = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="nutrition_tips")
