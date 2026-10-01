import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, FileCode, Server, Database, ShieldAlert, X } from 'lucide-react';

interface PythonProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonProjectModal: React.FC<PythonProjectModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<'main' | 'routes' | 'models' | 'gemini' | 'requirements'>('main');

  if (!isOpen) return null;

  const fileContents = {
    main: `# FitBuddy/app/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routes import router

# Automatically create all SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitBuddy – AI Fitness Plan Generator",
    description="Personalized 7-day workout plans powered by Google Gemini AI.",
    version="1.0.0"
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)`,

    routes: `# FitBuddy/app/routes.py
from fastapi import APIRouter, Depends, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from .database import get_db
from .models import User, WorkoutPlan, NutritionTip
from .gemini_generator import generate_workout_plan, generate_nutrition_tip
from .updated_plan import update_workout_plan

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def landing_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/generate-workout")
async def handle_generate_workout(...):
    # Generates 7-Day Plan with Gemini API and persists to SQLite...

@router.post("/submit-feedback")
async def handle_submit_feedback(...):
    # Sends original plan + feedback to Gemini, keeping original safe...`,

    models: `# FitBuddy/app/models.py
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
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.user_id"), nullable=False)
    original_plan = Column(Text, nullable=False) # JSON
    updated_plan = Column(Text, nullable=True)  # JSON
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)`,

    gemini: `# FitBuddy/app/gemini_generator.py
import os, json
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_workout_plan(user_data: dict) -> dict:
    prompt = f"""
You are a responsible AI fitness assistant.
Create a safe, beginner-friendly and personalized 7-day fitness plan.
User info: Name: {user_data.get('name')}, Age: {user_data.get('age')}, Goal: {user_data.get('goal')}
Provide structured JSON with Day 1 to Day 7 (warm-up, exercises, sets, reps, rest, cool-down).
"""
    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    return json.loads(response.text)`,

    requirements: `# FitBuddy/requirements.txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
pydantic==2.10.4
jinja2==3.1.5
python-dotenv==1.0.1
google-genai==2.4.0
requests==2.32.3
aiofiles==24.1.0`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                FitBuddy Python FastAPI Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Full modular project code available in the repository at <code className="text-cyan-300">/FitBuddy/</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick run command instructions */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>pip install -r requirements.txt && uvicorn app.main:app --reload</span>
          </div>
          <span className="text-[11px] text-slate-500">FastAPI &bull; SQLite &bull; SQLAlchemy &bull; Gemini 3.8 Flash</span>
        </div>

        {/* Tabs for files */}
        <div className="px-5 pt-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'main', label: 'app/main.py' },
            { id: 'routes', label: 'app/routes.py' },
            { id: 'models', label: 'app/models.py' },
            { id: 'gemini', label: 'app/gemini_generator.py' },
            { id: 'requirements', label: 'requirements.txt' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFile(f.id as any)}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
                activeFile === f.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-950/70 relative font-mono text-xs text-slate-300">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <pre className="whitespace-pre-wrap">{fileContents[activeFile]}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Both Node.js/Express & Python FastAPI backends are fully implemented.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
