import axios from 'axios';
import { env } from '../config/env';
import { encrypt, decrypt } from './encryption-utils';

const TOKEN_KEY = 'token';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, encrypt(token));
};

export const getAuthToken = (): string | null => {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  if (!encrypted) return null;
  try {
    return decrypt(encrypted);
  } catch (error) {
    removeAuthToken();
    return null;
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearAuthStorage = () => {
  removeAuthToken();
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  localStorage.removeItem('role');

  window.dispatchEvent(new CustomEvent('auth:logout'));
};

export const api = axios.create({
  baseURL: env.API_URL,
});

const PUBLIC_ENDPOINTS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/resend-otp',
  '/chat/public',
];

const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublic = isPublicEndpoint(error.config?.url || '');

    if (error.response?.status === 401) {
      const errorMessage = error.response.data?.message?.toLowerCase() || '';
      const errorStatus = error.response.data?.status?.toLowerCase() || '';
      const isInvalidToken = errorMessage.includes('invalid token') || errorStatus.includes('unauthorized');

      if (isInvalidToken && !isPublic) {
        clearAuthStorage();

        if (window.location.pathname !== '/') {
          setTimeout(() => {
            window.location.href = '/';
          }, 0);
        }
      }
    }

    return Promise.reject(error);
  }
);
