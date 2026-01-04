import express from 'express';
import { getCompletions, toggleCompletion, deleteCompletion } from '../controllers/completionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCompletions);

router.post('/toggle', toggleCompletion);

router.route('/:completionId')
  .delete(deleteCompletion);

export default router;

