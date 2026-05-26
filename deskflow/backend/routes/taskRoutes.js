import express from 'express';
import {
  createTask,
  deleteTask,
  getTaskStats,
  getTasks,
  updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
