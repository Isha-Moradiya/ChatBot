import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth.types';
import * as authService from '../api/auth.service';
import { getAuthToken, clearAuthStorage } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ requiresOtp?: boolean }>;
  register: (username: string, email: string, password: string) => Promise<{ requiresOtp: boolean; email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        const response = await authService.getCurrentUser();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });

    if (response.data.requiresOtp) {
      return { requiresOtp: true };
    }

    authService.setAuthToken(response.data.token);
    setUser(response.data.user);
    return { requiresOtp: false };
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await authService.register({ username, email, password });
    return {
      requiresOtp: response.data.requiresOtp,
      email: response.data.email,
    };
  };

  const verifyOtp = async (email: string, otp: string) => {
    const response = await authService.verifyOtp({ email, otp });
    authService.setAuthToken(response.data.token);
    setUser(response.data.user);
  };

  const resendOtp = async (email: string) => {
    await authService.resendOtp({ email });
  };

  const logout = async () => {
    await authService.logout();
    clearAuthStorage();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword({ email });
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    await authService.resetPassword({ email, otp, newPassword });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
