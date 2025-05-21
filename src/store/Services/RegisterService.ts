import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface OTPVerifyPayload {
  email: string;
  otp: string;
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
          message: data.error || 'Invalid registration data',
          status,
          code: 'BAD_REQUEST'
        };
      case 404:
        return {
          message: data.error || 'User not found',
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

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      // Format the payload to match backend expectations
      const formattedPayload = {
        email: payload.email,
        username: payload.username,
        password: payload.password,
        
      };

      console.log('Sending registration payload:', formattedPayload);

      const response = await axios.post(`${baseUrl}register/`, formattedPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Registration error details:', error.response.data);
      }
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'register/verifyOTP',
  async (payload: OTPVerifyPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}register/verify/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('OTP verification error details:', error.response.data);
      }
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'register/resendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}register/resend/`, { email }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('OTP resend error details:', error.response.data);
      }
      const authError = handleAuthError(error);
      return rejectWithValue(authError);
    }
  }
);




