const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000/api";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && this.token) {
      // Token might be expired, try to refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the original request with new token
        headers.Authorization = `Bearer ${this.token}`;
        return fetch(url, { ...options, headers });
      } else {
        // Refresh failed, clear tokens and redirect to login
        this.clearToken();
        throw new Error("Authentication failed");
      }
    }

    return response;
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;

    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/v1/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return false;
  }
  async getUserProfile() {
    const response = await this.get("/v1/user/profile/");
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return response.json(); // returns { id, email, first_name, last_name, profile: { bio, avatar } }
  }

  async get(endpoint: string) {
    const response = await this.request(endpoint);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await this.request(endpoint, {
      method: "DELETE",
    });
    return response.ok;
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/v1/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      this.setToken(data.access);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", data.refresh);
      }
      return data;
    } else {
      throw new Error("Login failed");
    }
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const response = await fetch(`${this.baseURL}/v1/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        profile: {},
      }),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Registration failed");
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
