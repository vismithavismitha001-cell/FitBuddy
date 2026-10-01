# FitBuddy – AI Fitness Plan Generator

FitBuddy is an intelligent, beginner-friendly, and safe AI fitness application that generates personalized 7-day workout plans, custom nutrition & recovery tips, and iterative plan refinement based on user feedback.

---

## 🌟 Key Features

1. **Personalized 7-Day Workout Plans**: Tailored to age, weight, goal, experience, intensity, workout duration, and available equipment.
2. **Day 1 to Day 7 Breakdown**:
   - Focus & target outcome
   - Warm-up exercises & duration
   - Exercise list with sets, repetitions or duration, rest periods, coaching cues, and equipment
   - Cool-down routines
   - Integrated active recovery/rest days
3. **Daily Nutrition & Recovery Tips**: Safe, evidence-based wellness tips (hydration, balanced meals, sleep hygiene, protein timing).
4. **Plan Improvement via AI Feedback**:
   - Enter feedback (e.g., *"Add more cardio"*, *"Make workouts easier"*, *"Add flexibility"*).
   - Gemini updates the 7-day plan while keeping the original baseline safely archived in the database.
5. **Interactive User Dashboard**: View active plans, review weekly splits, and compare Original vs. Updated plans.
6. **Coach / Admin Dashboard (`/admin`)**:
   - Comprehensive user table with search and filtering
   - Plan status indicators
   - Delete users and inspect workout evolution history
7. **Important Health & Safety Protocol**: Safety banners and guidelines preventing unsafe extremes or medical diagnoses.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10+ & FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Templates**: Jinja2 & Modern CSS3
- **Validation**: Pydantic v2
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) via `google-genai`

---

## 🚀 Quickstart Guide

### 1. Clone & Set Up Virtual Environment

```bash
cd FitBuddy
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and supply your Google Gemini API Key:

```env
GOOGLE_API_KEY="your-google-gemini-api-key"
DATABASE_URL="sqlite:///./fitbuddy.db"
```

### 4. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open your browser at:
- **Web App**: [http://localhost:8000](http://localhost:8000)
- **Coach / Admin Dashboard**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Project Architecture

```
FitBuddy/
│
├── app/
│   ├── main.py                  # FastAPI app entry point & DB startup
│   ├── routes.py                # All HTTP & HTML endpoints
│   ├── database.py              # SQLite & SQLAlchemy engine setup
│   ├── models.py                # User, WorkoutPlan, NutritionTip models
│   ├── schemas.py               # Pydantic schemas for data validation
│   ├── gemini_generator.py      # Core Gemini API 7-day generator & nutrition service
│   ├── gemini_flash_generator.py# Specialized Gemini Flash generator
│   └── updated_plan.py          # Plan updater incorporating feedback
│
├── templates/
│   ├── index.html               # Landing page & user fitness intake form
│   ├── result.html              # 7-day plan display, printable view & feedback form
│   ├── dashboard.html           # User dashboard, weekly view & comparison
│   ├── feedback.html            # Feedback submission modal/page
│   └── admin.html               # Coach & Admin table with search & filter
│
├── static/
│   ├── css/
│   │   └── style.css            # Dark mode modern fitness dashboard styling
│   └── js/
│       └── script.js            # Client-side interactions
│
├── .env.example
├── requirements.txt
└── README.md
```

---

## 🛡️ Safety Disclaimer
FitBuddy provides general fitness guidance and wellness education. It does not diagnose medical conditions, prescribe treatment, or advise extreme calorie restriction. Users with injuries, medical conditions, or pregnancy are advised to consult a qualified healthcare provider.
