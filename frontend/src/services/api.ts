import axios, { AxiosResponse } from 'axios';
import { AuthTokens, LoginCredentials, RegisterData, User, University, Application } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ tokens: AuthTokens; user: User }> => {
    const response = await apiClient.post('/token/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/register/', data);
    return response.data;
  },

  refreshToken: async (refresh: string): Promise<AuthTokens> => {
    const response = await apiClient.post('/token/refresh/', { refresh });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/user/profile/');
    return response.data;
  },
};

// Universities API
export const universitiesAPI = {
  getAll: async (): Promise<University[]> => {
    const response = await apiClient.get('/universities/');
    return response.data;
  },

  getById: async (id: number): Promise<University> => {
    const response = await apiClient.get(`/universities/${id}/`);
    return response.data;
  },

  create: async (data: Omit<University, 'id' | 'created_at' | 'updated_at'>): Promise<University> => {
    const response = await apiClient.post('/universities/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<University>): Promise<University> => {
    const response = await apiClient.put(`/universities/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/universities/${id}/`);
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async (): Promise<Application[]> => {
    const response = await apiClient.get('/applications/');
    return response.data;
  },

  getById: async (id: number): Promise<Application> => {
    const response = await apiClient.get(`/applications/${id}/`);
    return response.data;
  },

  create: async (data: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'university_name'>): Promise<Application> => {
    const response = await apiClient.post('/applications/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Application>): Promise<Application> => {
    const response = await apiClient.put(`/applications/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/applications/${id}/`);
  },
};

export default apiClient;