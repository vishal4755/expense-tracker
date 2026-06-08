import axios from 'axios';

const API = axios.create({
  baseURL: 'https://expense-tracker-fc1h.onrender.com/api'
});

// Every request मध्ये token automatically add होईल
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addExpense = (data) => API.post('/expenses', data);
export const getExpenses = () => API.get('/expenses');
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

export const getBudget = () => API.get('/budget');
export const setBudget = (amount) => API.post('/budget', { amount });