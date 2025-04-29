import axios from 'axios';
import { API_URL } from './AuthService';

export const fetchJobs = async (token) => {
  return axios.get(`${API_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchJobDetail = async (id, token) => {
  return axios.get(`${API_URL}/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const postJob = async (job, token) => {
  return axios.post(`${API_URL}/jobs`, job, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const applyToJob = async (application, token) => {
  if (!application.location || application.location.length < 2) {
    throw new Error('Please enter your location.');
  }
  return axios.post(`${API_URL}/applications`, application, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchMyApplications = async (token) => {
  return axios.get(`${API_URL}/applications/mine`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchApplicationsForJobs = async (token) => {
  return axios.get(`${API_URL}/applications/for-jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
