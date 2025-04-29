import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Backend API URL

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};
