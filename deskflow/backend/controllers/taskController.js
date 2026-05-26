import Task from '../models/Task.js';
import {
  calculatePriorityScore,
  isFutureOrToday,
  isValidDate,
  normalizeTaskResponse,
} from '../utils/taskHelpers.js';

const allowedUpdateFields = ['title', 'description', 'importance', 'dueDate', 'status'];
const allowedStatuses = ['pending', 'completed'];

const sendDbError = (res, error) => {
  if (error?.name === 'CastError' || error?.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Server error' });
};

const validateTaskInput = (payload, { allowPartial = false } = {}) => {
  const errors = [];

  const hasTitle = payload.title !== undefined;
  const hasDescription = payload.description !== undefined;
  const hasImportance = payload.importance !== undefined;
  const hasDueDate = payload.dueDate !== undefined;

  if (!allowPartial) {
    if (!hasTitle || String(payload.title).trim() === '') errors.push('title is required');
    if (!hasDescription || String(payload.description).trim() === '') errors.push('description is required');
    if (!hasImportance) errors.push('importance is required');
    if (!hasDueDate || payload.dueDate === '') errors.push('dueDate is required');
  }

  if (hasImportance) {
    const importance = Number(payload.importance);
    if (!Number.isInteger(importance) || importance < 1 || importance > 5) {
      errors.push('importance must be an integer between 1 and 5');
    }
  }

  if (hasDueDate) {
    if (!isValidDate(payload.dueDate)) {
      errors.push('dueDate must be a valid date');
    } else if (!isFutureOrToday(payload.dueDate)) {
      errors.push('dueDate should not be in the past');
    }
  }

  if (payload.status !== undefined && !allowedStatuses.includes(String(payload.status))) {
    errors.push('status must be pending or completed');
  }

  return errors;
};

export const createTask = async (req, res) => {
  try {
    const errors = validateTaskInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const task = new Task({
      title: String(req.body.title).trim(),
      description: String(req.body.description).trim(),
      importance: Number(req.body.importance),
      dueDate: new Date(req.body.dueDate),
      status: req.body.status ? String(req.body.status) : 'pending',
    });

    task.priorityScore = calculatePriorityScore(task);

    const savedTask = await task.save();
    return res.status(201).json(normalizeTaskResponse(savedTask));
  } catch (error) {
    return sendDbError(res, error);
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, minImportance } = req.query;
    const query = {};

    if (status) {
      if (!allowedStatuses.includes(String(status))) {
        return res.status(400).json({ message: 'status must be pending or completed' });
      }
      query.status = status;
    }

    if (minImportance !== undefined) {
      const parsedImportance = Number(minImportance);
      if (!Number.isInteger(parsedImportance)) {
        return res.status(400).json({ message: 'minImportance must be a number' });
      }
      query.importance = { $gte: parsedImportance };
    }

    const tasks = await Task.find(query).sort({ priorityScore: -1, createdAt: -1 });
    return res.json(tasks.map(normalizeTaskResponse));
  } catch (error) {
    return sendDbError(res, error);
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    for (const field of allowedUpdateFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const errors = validateTaskInput(updates, { allowPartial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (updates.title !== undefined) task.title = String(updates.title).trim();
    if (updates.description !== undefined) task.description = String(updates.description).trim();
    if (updates.importance !== undefined) task.importance = Number(updates.importance);
    if (updates.dueDate !== undefined) task.dueDate = new Date(updates.dueDate);
    if (updates.status !== undefined) task.status = String(updates.status).trim();

    task.priorityScore = calculatePriorityScore(task);

    const savedTask = await task.save();
    return res.json(normalizeTaskResponse(savedTask));
  } catch (error) {
    return sendDbError(res, error);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return sendDbError(res, error);
  }
};

export const getTaskStats = async (_req, res) => {
  try {
    const [statusCounts, totalTasks, pendingTasks] = await Promise.all([
      Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Task.countDocuments({}),
      Task.countDocuments({ status: 'pending' }),
    ]);

    const formattedStatusCounts = {
      pending: 0,
      completed: 0,
    };

    for (const row of statusCounts) {
      if (row?._id && formattedStatusCounts[row._id] !== undefined) {
        formattedStatusCounts[row._id] = row.count;
      }
    }

    return res.json({
      totalTasks,
      pendingTasks,
      statusCounts: formattedStatusCounts,
    });
  } catch (error) {
    return sendDbError(res, error);
  }
};
