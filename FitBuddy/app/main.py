import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routes import router

# Create SQLite database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitBuddy – AI Fitness Plan Generator",
    description="Personalized, beginner-friendly and safe 7-day workout plans powered by Google Gemini AI.",
    version="1.0.0"
)

# Mount static directory
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include routes
app.include_router(router)

@app.on_event("startup")
def on_startup():
    print("=" * 60)
    print("FitBuddy – AI Fitness Plan Generator has started!")
    print("SQLite database tables verified and loaded successfully.")
    print("=" * 60)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
