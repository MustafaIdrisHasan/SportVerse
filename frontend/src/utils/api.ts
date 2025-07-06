import axios, { AxiosResponse } from 'axios';
import { ApiResponse, LoginCredentials, RegisterCredentials, User, Race } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await apiClient.post('/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await apiClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user',
      };
    }
  },
};

// Races API functions
export const racesAPI = {
  getAllRaces: async (): Promise<ApiResponse<Race[]>> => {
    try {
      const response: AxiosResponse<ApiResponse<Race[]>> = await apiClient.get('/races');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch races',
      };
    }
  },

  getRaceById: async (id: string): Promise<ApiResponse<Race>> => {
    try {
      const response: AxiosResponse<ApiResponse<Race>> = await apiClient.get(`/races/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch race',
      };
    }
  },

  getUpcomingRaces: async (): Promise<ApiResponse<Race[]>> => {
    try {
      const response: AxiosResponse<ApiResponse<Race[]>> = await apiClient.get('/races/upcoming');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch upcoming races',
      };
    }
  },
};

// User preferences API functions
export const userAPI = {
  addFavorite: async (raceId: string): Promise<ApiResponse<void>> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/user/favorites', { raceId });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add favorite',
      };
    }
  },

  removeFavorite: async (raceId: string): Promise<ApiResponse<void>> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/user/favorites/${raceId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to remove favorite',
      };
    }
  },

  addReminder: async (raceId: string): Promise<ApiResponse<void>> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/user/reminders', { raceId });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add reminder',
      };
    }
  },

  removeReminder: async (raceId: string): Promise<ApiResponse<void>> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/user/reminders/${raceId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to remove reminder',
      };
    }
  },
}; 