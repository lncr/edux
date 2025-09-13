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
  thumbnail: string;
}

export interface Application {
  id: number;
  user: number;
  university: number;
  cover_letter?: string;
  prior_highest_education: "NO EDUCATION" | "HIGH SCHOOL" | "BACHELORS" | "MASTERS" | "PHD";
  certificate?: string | null;
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