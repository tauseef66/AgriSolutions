import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (name, email, password) => {
  const response = await api.post('/api/auth/signup', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const googleLogin = async (idToken) => {
  const response = await api.post('/api/auth/google', { idToken });
  return response.data;
};

export const updateProfile = async (updates) => {
  const response = await api.put('/api/user/update', updates);
  return response.data;
};

export const deleteProfile = async (userId) => {
  const response = await api.delete(`/api/user/delete/${userId}`);
  return response.data;
};

export default api;