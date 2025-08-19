import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/api/auth/signup', { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const googleLogin = async (idToken: string) => {
  const response = await api.post('/api/auth/google', { idToken });
  return response.data;
};

export default api;