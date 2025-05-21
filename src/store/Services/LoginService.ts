import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Custom error handler
const handleAuthError = (error: unknown): AuthError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data as any;

    switch (status) {
      case 400:
        return {
          message: data.detail || 'Invalid credentials',
          status,
          code: 'BAD_REQUEST'
        };
      case 401:
        return {
          message: data.detail || 'Invalid credentials',
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: data.detail || 'Account not verified. Please confirm registration from your email.',
          status,
          code: 'FORBIDDEN'
        };
      case 500:
        return {
          message: data.detail || 'Server error. Please try again later.',
          status,
          code: 'SERVER_ERROR'
        };
      default:
        return {
          message: data.detail || 'An unexpected error occurred',
          status,
          code: 'UNKNOWN_ERROR'
        };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      console.log('Sending login payload:', payload);
      
      const response = await axios.post<LoginResponse>(`${baseUrl}login/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Login error details:', error.response.data);
      }
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);
