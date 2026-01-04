import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:goalId')
  .put(updateGoal)
  .delete(deleteGoal);

export default router;

