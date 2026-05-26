export const calculateAgeMinutes = (createdAt, resolvedAt, status) => {
  const start = new Date(createdAt).getTime();
  const end = status === 'resolved' || status === 'closed' 
    ? new Date(resolvedAt).getTime() 
    : Date.now();
  
  // Calculate difference in milliseconds and convert to minutes
  return Math.max(0, Math.floor((end - start) / (1000 * 60)));
};

export const checkSLABreach = (priority, ageMinutes, status) => {
  const slaTargets = {
    urgent: 60,
    high: 240,
    medium: 1440,
    low: 4320
  };

  const targetMinutes = slaTargets[priority];
  
  if (!targetMinutes) return false;

  return ageMinutes > targetMinutes;
};

export const isValidTransition = (oldStatus, newStatus) => {
  if (oldStatus === newStatus) return true;

  const validTransitions = {
    'open': ['in_progress'],
    'in_progress': ['open', 'resolved'],
    'resolved': ['in_progress', 'closed'],
    'closed': ['resolved']
  };

  const allowedForOld = validTransitions[oldStatus] || [];
  return allowedForOld.includes(newStatus);
};
