export const calculatePriorityScore = ({ importance, dueDate }) => {
  // Higher importance should always sort above lower importance.
  // For ties, tasks with the earlier due date should sort first.
  const importanceWeight = 10_000_000_000_000;
  return (Number(importance) * importanceWeight) - new Date(dueDate).getTime();
};

export const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const isFutureOrToday = (value) => {
  const date = new Date(value);
  return isValidDate(value) && date.getTime() >= Date.now();
};

export const normalizeTaskResponse = (task) => task.toObject();
