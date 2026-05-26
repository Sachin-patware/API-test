import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-test-59jy.onrender.com/bfhl';

const api = axios.create({
  baseURL: `${API_URL}/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.minImportance) params.append('minImportance', filters.minImportance);

  const query = params.toString();
  const response = await api.get(query ? `/?${query}` : '/');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.patch(`/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
