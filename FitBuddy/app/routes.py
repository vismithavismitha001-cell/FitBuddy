import json
from fastapi import APIRouter, Depends, Request, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import os

from .database import get_db
from .models import User, WorkoutPlan, NutritionTip
from .schemas import UserCreate, FeedbackSubmit
from .gemini_generator import generate_workout_plan, generate_nutrition_tip
from .updated_plan import update_workout_plan

router = APIRouter()

templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
templates = Jinja2Templates(directory=templates_dir)

@router.get("/", response_class=HTMLResponse)
async def landing_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/generate-workout")
async def handle_generate_workout(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    user_id: str = Form(...),
    age: int = Form(...),
    weight: float = Form(...),
    goal: str = Form(...),
    experience: str = Form(...),
    intensity: str = Form(...),
    workout_days: int = Form(4),
    workout_duration: str = Form("30-45 mins"),
    equipment: str = Form("Home equipment"),
    has_medical_condition: bool = Form(False),
    medical_notes: str = Form(None)
):
    clean_uid = user_id.strip().lower()

    # Check or create user
    user = db.query(User).filter(User.user_id == clean_uid).first()
    if not user:
        user = User(
            user_id=clean_uid,
            name=name.strip(),
            age=age,
            weight=weight,
            goal=goal,
            experience=experience,
            intensity=intensity,
            workout_days=workout_days,
            workout_duration=workout_duration,
            equipment=equipment,
            has_medical_condition=has_medical_condition,
            medical_notes=medical_notes
        )
        db.add(user)
    else:
        user.name = name.strip()
        user.age = age
        user.weight = weight
        user.goal = goal
        user.experience = experience
        user.intensity = intensity
        user.workout_days = workout_days
        user.workout_duration = workout_duration
        user.equipment = equipment
        user.has_medical_condition = has_medical_condition
        user.medical_notes = medical_notes

    db.commit()
    db.refresh(user)

    user_dict = {
        "name": user.name,
        "age": user.age,
        "weight": user.weight,
        "goal": user.goal,
        "experience": user.experience,
        "intensity": user.intensity,
        "workout_days": user.workout_days,
        "workout_duration": user.workout_duration,
        "equipment": user.equipment,
    }

    # Generate 7-Day Plan with Gemini
    plan_dict = generate_workout_plan(user_dict)
    nutrition_dict = generate_nutrition_tip(user_dict)

    # Save to database
    existing_plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == clean_uid).first()
    if existing_plan:
        existing_plan.original_plan = json.dumps(plan_dict)
        existing_plan.updated_plan = None
        existing_plan.feedback = None
    else:
        new_plan = WorkoutPlan(
            user_id=clean_uid,
            original_plan=json.dumps(plan_dict),
            updated_plan=None,
            feedback=None
        )
        db.add(new_plan)

    # Save Nutrition Tip
    existing_tip = db.query(NutritionTip).filter(NutritionTip.user_id == clean_uid).first()
    if existing_tip:
        existing_tip.title = nutrition_dict.get("title", "Daily Tip")
        existing_tip.category = nutrition_dict.get("category", "General")
        existing_tip.tip = nutrition_dict.get("tip", "")
    else:
        new_tip = NutritionTip(
            user_id=clean_uid,
            title=nutrition_dict.get("title", "Daily Tip"),
            category=nutrition_dict.get("category", "General"),
            tip=nutrition_dict.get("tip", "")
        )
        db.add(new_tip)

    db.commit()

    # If JSON requested
    if "application/json" in request.headers.get("accept", ""):
        return JSONResponse({
            "success": True,
            "user": user_dict,
            "plan": plan_dict,
            "nutritionTip": nutrition_dict
        })

    return templates.TemplateResponse("result.html", {
        "request": request,
        "user": user,
        "plan": plan_dict,
        "nutrition_tip": nutrition_dict,
        "is_updated": False
    })

@router.post("/submit-feedback")
async def handle_submit_feedback(
    request: Request,
    user_id: str = Form(...),
    feedback: str = Form(...),
    db: Session = Depends(get_db)
):
    clean_uid = user_id.strip().lower()
    user = db.query(User).filter(User.user_id == clean_uid).first()
    plan_record = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == clean_uid).first()

    if not user or not plan_record:
        raise HTTPException(status_code=404, detail="User or Workout Plan not found")

    original_plan = json.loads(plan_record.original_plan)
    user_dict = {
        "name": user.name,
        "goal": user.goal,
        "experience": user.experience,
        "intensity": user.intensity,
        "equipment": user.equipment,
    }

    updated_plan_dict = update_workout_plan(original_plan, feedback, user_dict)

    # Store updated plan and feedback separately, keeping original plan intact
    plan_record.updated_plan = json.dumps(updated_plan_dict)
    plan_record.feedback = feedback
    db.commit()

    if "application/json" in request.headers.get("accept", ""):
        return JSONResponse({
            "success": True,
            "message": "Your fitness plan has been updated successfully.",
            "original_plan": original_plan,
            "updated_plan": updated_plan_dict
        })

    nutrition_record = db.query(NutritionTip).filter(NutritionTip.user_id == clean_uid).first()
    return templates.TemplateResponse("result.html", {
        "request": request,
        "user": user,
        "plan": updated_plan_dict,
        "original_plan": original_plan,
        "nutrition_tip": nutrition_record,
        "is_updated": True,
        "message": "Your fitness plan has been updated successfully."
    })

@router.get("/dashboard", response_class=HTMLResponse)
@router.get("/dashboard/{user_id}", response_class=HTMLResponse)
async def view_dashboard(request: Request, user_id: str = "alex.chen", db: Session = Depends(get_db)):
    clean_uid = user_id.strip().lower()
    user = db.query(User).filter(User.user_id == clean_uid).first()
    if not user:
        # Fallback to first user
        user = db.query(User).first()

    plan_record = None
    original_plan = None
    updated_plan = None
    nutrition_tip = None

    if user:
        plan_record = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user.user_id).first()
        nutrition_tip = db.query(NutritionTip).filter(NutritionTip.user_id == user.user_id).first()
        if plan_record:
            original_plan = json.loads(plan_record.original_plan)
            if plan_record.updated_plan:
                updated_plan = json.loads(plan_record.updated_plan)

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user": user,
        "plan_record": plan_record,
        "original_plan": original_plan,
        "updated_plan": updated_plan,
        "current_plan": updated_plan if updated_plan else original_plan,
        "nutrition_tip": nutrition_tip
    })

@router.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    user_rows = []
    for u in users:
        plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == u.user_id).first()
        status_label = "No Plan"
        if plan:
            status_label = "Refined & Updated" if plan.updated_plan else "Original Active"
        user_rows.append({
            "user": u,
            "plan": plan,
            "status": status_label,
            "has_feedback": bool(plan and plan.feedback)
        })

    return templates.TemplateResponse("admin.html", {
        "request": request,
        "users": user_rows,
        "total_users": len(users)
    })

@router.get("/user/{user_id}")
async def get_user_details(user_id: str, db: Session = Depends(get_db)):
    clean_uid = user_id.strip().lower()
    user = db.query(User).filter(User.user_id == clean_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == clean_uid).first()
    tip = db.query(NutritionTip).filter(NutritionTip.user_id == clean_uid).first()

    return {
        "user": {
            "id": user.id,
            "user_id": user.user_id,
            "name": user.name,
            "age": user.age,
            "weight": user.weight,
            "goal": user.goal,
            "experience": user.experience,
            "intensity": user.intensity,
            "workout_days": user.workout_days,
            "workout_duration": user.workout_duration,
            "equipment": user.equipment,
            "created_at": user.created_at.isoformat() if user.created_at else None
        },
        "plan": {
            "original": json.loads(plan.original_plan) if plan and plan.original_plan else None,
            "updated": json.loads(plan.updated_plan) if plan and plan.updated_plan else None,
            "feedback": plan.feedback if plan else None
        } if plan else None,
        "nutrition_tip": {
            "title": tip.title if tip else None,
            "category": tip.category if tip else None,
            "tip": tip.tip if tip else None
        } if tip else None
    }

@router.delete("/user/{user_id}")
async def delete_user(user_id: str, db: Session = Depends(get_db)):
    clean_uid = user_id.strip().lower()
    user = db.query(User).filter(User.user_id == clean_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"success": True, "message": f"User {user_id} deleted"}
