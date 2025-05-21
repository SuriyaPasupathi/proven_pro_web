import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface GoogleLoginPayload {
  login_type: string;
  email: string;
  username: string;
  name: string;
  token: string;
}

interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

interface ResetPasswordPayload {
  uid: string;
  token: string;
  password: string;
}

interface ResetPasswordConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';


// Custom error handler
const handleAuthError = (error: unknown): AuthError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle network errors
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data as any;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return {
          message: data.error || 'Invalid request data',
          status,
          code: 'BAD_REQUEST'
        };
      case 401:
        return {
          message: data.error || 'Authentication failed',
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: data.error || 'Access denied',
          status,
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: data.error || 'Resource not found',
          status,
          code: 'NOT_FOUND'
        };
      case 500:
        return {
          message: data.error || 'Server error. Please try again later.',
          status,
          code: 'SERVER_ERROR'
        };
      default:
        return {
          message: data.error || 'An unexpected error occurred',
          status,
          code: 'UNKNOWN_ERROR'
        };
    }
  }

  // Handle non-Axios errors
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

export const postUserCredentials = createAsyncThunk(
  'auth/postUserCredentials',
  async (payload: GoogleLoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}google-auth/`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}request-reset-password/`, { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}reset-password/`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  'auth/resetPasswordConfirm',
  async (payload: ResetPasswordConfirmPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}reset-password-confirm/`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);
