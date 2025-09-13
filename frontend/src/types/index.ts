// API Response Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  profile?: {
    bio: string;
    avatar?: string;
  };
}

export interface University {
  id: number;
  name: string;
  location: string;
  description?: string;
  ranking?: number;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  user: number;
  university: number;
  university_name?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'submitted';
  application_date: string;
  notes?: string;
  documents?: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile: {
    bio: string;
  };
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// API Error Type
export interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}