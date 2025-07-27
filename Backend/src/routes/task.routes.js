import express from 'express'
import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTaskById,
    getTaskStats,
    getUpcomingTasks
  } from '../controllers/task.controller.js';
  import { authMiddleware } from '../middleware/auth.middleware.js';

  const router = express.Router();

  router.post("/ct",authMiddleware,createTask)
  router.get('/gat', authMiddleware, getAllTasks);
  router.get('/gtbi/:id', authMiddleware, getTaskById);
  router.put('/ut/:id', authMiddleware, updateTask);
  router.delete('/dt/:id', authMiddleware, deleteTask);
  router.get('/gts',authMiddleware,getTaskStats);
  router.get('/gut',authMiddleware,getUpcomingTasks);

  export default router;