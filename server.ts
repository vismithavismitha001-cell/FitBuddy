import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.ts';
import {
  generateWorkoutPlanAI,
  generateNutritionTipAI,
  updateWorkoutPlanAI,
} from './src/server/geminiService.ts';
import {
  UserProfile,
  WorkoutPlanRecord,
  NutritionTipRecord,
  FeedbackRecord,
} from './src/types/fitness.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'FitBuddy AI Engine',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/generate-workout
  app.post('/api/generate-workout', async (req: Request, res: Response) => {
    try {
      const {
        name,
        userId,
        age,
        weight,
        goal,
        experience,
        intensity,
        workoutDays,
        workoutDuration,
        equipment,
        hasMedicalCondition,
        medicalNotes,
      } = req.body;

      if (!name || !userId || !age || !weight || !goal || !experience || !intensity) {
        return res.status(400).json({
          success: false,
          error: 'Please fill in all required profile fields.',
        });
      }

      const cleanUserId = String(userId).trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
      const userProfile: UserProfile = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: cleanUserId,
        name: String(name).trim(),
        age: Number(age),
        weight: Number(weight),
        goal,
        experience,
        intensity,
        workoutDays: Number(workoutDays) || 4,
        workoutDuration: workoutDuration || '30-45 mins',
        equipment: equipment || 'Home equipment',
        hasMedicalCondition: Boolean(hasMedicalCondition),
        medicalNotes: medicalNotes ? String(medicalNotes).trim() : undefined,
        createdAt: new Date().toISOString(),
      };

      // Save user to DB
      db.saveUser(userProfile);

      // Generate 7-Day Plan via Gemini
      const planData = await generateWorkoutPlanAI(userProfile);

      // Generate Nutrition & Recovery Tip via Gemini
      const nutritionRaw = await generateNutritionTipAI(userProfile);
      const nutritionRecord: NutritionTipRecord = {
        id: `tip_${Date.now()}`,
        userId: cleanUserId,
        title: nutritionRaw.title,
        category: nutritionRaw.category,
        tip: nutritionRaw.tip,
        actionablePoints: nutritionRaw.actionablePoints,
        createdAt: new Date().toISOString(),
      };
      db.saveNutritionTip(nutritionRecord);

      // Save Workout Plan
      const planRecord: WorkoutPlanRecord = {
        id: `plan_${Date.now()}`,
        userId: cleanUserId,
        originalPlan: planData,
        updatedPlan: undefined,
        feedbackHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.savePlan(planRecord);

      return res.json({
        success: true,
        message: 'Plan successfully generated!',
        user: userProfile,
        plan: planRecord,
        nutritionTip: nutritionRecord,
      });
    } catch (err) {
      console.error('Error generating workout plan:', err);
      return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while generating your plan. Please try again.',
      });
    }
  });

  // POST /api/submit-feedback (Plan Update)
  app.post('/api/submit-feedback', async (req: Request, res: Response) => {
    try {
      const { userId, feedback } = req.body;

      if (!userId || !feedback || !String(feedback).trim()) {
        return res.status(400).json({
          success: false,
          error: 'Feedback message cannot be empty.',
        });
      }

      const cleanUserId = String(userId).trim().toLowerCase();
      const user = db.getUser(cleanUserId);
      const existingPlan = db.getPlanForUser(cleanUserId);

      if (!user || !existingPlan) {
        return res.status(404).json({
          success: false,
          error: 'User or active workout plan was not found.',
        });
      }

      // Generate updated plan using Gemini, passing original plan + feedback
      const updatedPlanData = await updateWorkoutPlanAI(
        existingPlan.originalPlan,
        String(feedback).trim(),
        user
      );

      const feedbackEntry: FeedbackRecord = {
        id: `fb_${Date.now()}`,
        feedback: String(feedback).trim(),
        submittedAt: new Date().toISOString(),
        changesApplied: [
          'Updated exercise selections and duration parameters',
          'Recalibrated intensity to match user request',
        ],
      };

      existingPlan.updatedPlan = updatedPlanData;
      existingPlan.feedbackHistory.push(feedbackEntry);
      existingPlan.updatedAt = new Date().toISOString();

      db.savePlan(existingPlan);

      return res.json({
        success: true,
        message: 'Your fitness plan has been updated successfully.',
        plan: existingPlan,
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to update plan based on feedback. Please retry.',
      });
    }
  });

  // GET /api/user/:userId
  app.get('/api/user/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const cleanUserId = String(userId).trim().toLowerCase();
    const user = db.getUser(cleanUserId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const plan = db.getPlanForUser(cleanUserId);
    const nutritionTip = db.getNutritionTipForUser(cleanUserId);

    return res.json({
      success: true,
      user,
      plan,
      nutritionTip,
    });
  });

  // GET /api/dashboard/:userId?
  app.get('/api/dashboard/:userId?', (req: Request, res: Response) => {
    const userId = req.params.userId || 'alex.chen';
    const cleanUserId = String(userId).trim().toLowerCase();
    const user = db.getUser(cleanUserId);
    const plan = db.getPlanForUser(cleanUserId);
    const nutritionTip = db.getNutritionTipForUser(cleanUserId);

    return res.json({
      success: true,
      user: user || null,
      plan: plan || null,
      nutritionTip: nutritionTip || null,
    });
  });

  // GET /api/admin/users
  app.get('/api/admin/users', (req: Request, res: Response) => {
    const users = db.getAllUsers();
    const plans = db.getAllPlans();

    const formatted = users.map((u) => {
      const plan = plans.find((p) => p.userId.toLowerCase() === u.userId.toLowerCase());
      let planStatus = 'No Plan';
      if (plan) {
        planStatus = plan.updatedPlan ? 'Refined & Updated' : 'Original Active';
      }
      return {
        id: u.id,
        userId: u.userId,
        name: u.name,
        age: u.age,
        weight: u.weight,
        goal: u.goal,
        experience: u.experience,
        intensity: u.intensity,
        workoutDays: u.workoutDays,
        workoutDuration: u.workoutDuration,
        equipment: u.equipment,
        createdAt: u.createdAt,
        planStatus,
        feedbackCount: plan ? plan.feedbackHistory.length : 0,
        hasUpdatedPlan: Boolean(plan && plan.updatedPlan),
      };
    });

    res.json({
      success: true,
      users: formatted,
    });
  });

  // GET /api/admin/stats
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const users = db.getAllUsers();
    const plans = db.getAllPlans();
    const totalUsers = users.length;
    const totalPlans = plans.length;
    const totalRefinedPlans = plans.filter((p) => p.updatedPlan).length;
    const totalFeedbacks = plans.reduce((acc, p) => acc + p.feedbackHistory.length, 0);

    res.json({
      totalUsers,
      totalPlans,
      totalRefinedPlans,
      totalFeedbacks,
    });
  });

  // DELETE /api/user/:userId
  app.delete('/api/user/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const cleanUserId = String(userId).trim().toLowerCase();
    const success = db.deleteUser(cleanUserId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'User could not be found' });
    }
    return res.json({ success: true, message: `User ${userId} deleted successfully` });
  });

  // In development, hook up Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitBuddy server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting FitBuddy server:', err);
  process.exit(1);
});
