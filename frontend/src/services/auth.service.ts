import apiClient from './api';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

// Observable pattern to notify components about auth state changes
type AuthStateListener = (isAuthenticated: boolean) => void;

class AuthServiceClass {
  private listeners: AuthStateListener[] = [];

  // Method to subscribe to auth state changes
  subscribe(listener: AuthStateListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Method to notify all listeners
  private notifyListeners() {
    const isAuthenticated = this.isAuthenticated();
    this.listeners.forEach(listener => listener(isAuthenticated));
  }

  register = async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/users/register/', data);
    return response.data;
  };

  login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/users/token/', data);
    // Store the tokens in localStorage
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    this.notifyListeners(); // Notify about auth state change
    return response.data;
  };

  logout = (): void => {
    // Remove tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.notifyListeners(); // Notify about auth state change
  };

  getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get('/users/me/');
    return response.data;
  };

  refreshToken = async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post('/users/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('token', response.data.access);
    return response.data;
  };

  isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };
}

const AuthService = new AuthServiceClass();
export default AuthService;