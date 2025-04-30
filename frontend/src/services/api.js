import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Update to your Laravel API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Removing withCredentials: true to work with wildcard CORS policy
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User Accounts
export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// User Info
export const getUserInfo = async () => {
    const response = await api.get('/user');
    return response.data;
};

export const updateUserInfo = async (userData) => {
    const response = await api.put('/user', userData);
    return response.data;
};

// Content
export const fetchContent = async () => {
    const response = await api.get('/content');
    return response.data;
};

export const likeContent = async (contentId) => {
    const response = await api.post(`/content/${contentId}/like`);
    return response.data;
};

export const addComment = async (contentId, commentData) => {
    const response = await api.post(`/content/${contentId}/comments`, commentData);
    return response.data;
};

export default api;