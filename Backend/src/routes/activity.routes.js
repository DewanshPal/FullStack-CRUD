import express from 'express';
import { getAllActivities, clearActivities } from '../controllers/activity.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/gaa", authMiddleware, getAllActivities);
router.delete("/ca", authMiddleware, clearActivities);

export default router;

