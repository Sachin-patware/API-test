import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-test-59jy.onrender.com/bfhl';

const api = axios.create({
  baseURL: `${API_URL}/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTickets = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.breached) params.append('breached', filters.breached);

  const response = await api.get(`/?${params.toString()}`);
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await api.post('/', ticketData);
  return response.data;
};

export const updateTicketStatus = async (id, status) => {
  const response = await api.patch(`/${id}`, { status });
  return response.data;
};

export const getTicketStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};
