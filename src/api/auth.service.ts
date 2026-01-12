import { api, setAuthToken as storeToken, getAuthToken, removeAuthToken } from '../lib/api-client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  GetUserResponse,
} from '../types/auth.types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

export const resendOtp = async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
  const response = await api.post('/auth/resend-otp', data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<GetUserResponse> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
  }
};

export const setAuthToken = (token: string) => {
  storeToken(token);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
