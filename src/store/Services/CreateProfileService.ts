import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface ProfilePayload {
  subscription_type: 'free' | 'standard' | 'premium';
  first_name?: string;
  last_name?: string;
  bio?: string;
  job_title?: string;
  job_specialization?: string;
  mobile?: string;
  services?: string[];
  experiences?: string[];
  skills?: string[];
  tools?: string[];
  languages?: string[];
  categories?: string[];
  education?: string[];
  certifications?: string[];
  licenses?: string[];
  portfolio?: string[];
  profile_pic?: File;
  video_intro?: File;
}

interface ProfileError {
  message: string;
  status?: number;
  code?: string;
}

interface ProfileStatusResponse {
  has_profile: boolean;
  subscription_type: 'free' | 'standard' | 'premium';
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

// Custom error handler
const handleProfileError = (error: unknown): ProfileError => {
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
          message: data.error || 'Invalid profile data',
          status,
          code: 'BAD_REQUEST'
        };
      case 401:
        return {
          message: 'Please log in to continue',
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: data.error || 'Access denied',
          status,
          code: 'FORBIDDEN'
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

export const createUserProfile = createAsyncThunk(
  'profile/createUserProfile',
  async (payload: ProfilePayload | FormData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const formData = payload instanceof FormData ? payload : new FormData();
      
      // If payload is not FormData, convert it to FormData
      if (!(payload instanceof FormData)) {
        // Add subscription type first
        formData.append('subscription_type', payload.subscription_type);

        // Add all non-file fields to formData
        Object.entries(payload).forEach(([key, value]) => {
          // Skip file fields, undefined values, and subscription_type (already added)
          if (key === 'profile_pic' || key === 'video_intro' || key === 'subscription_type' || value === undefined) {
            return;
          }

          // Handle array fields
          if (Array.isArray(value)) {
            if (value.length > 0) {
              formData.append(key, JSON.stringify(value));
            }
          } else if (value !== null && value !== '') {
            // Only add non-empty string values
            formData.append(key, value);
          }
        });

        // Add file fields only if they exist and are not null
        if (payload.profile_pic instanceof File) {
          formData.append('profile_pic', payload.profile_pic);
        }
        if (payload.video_intro instanceof File) {
          formData.append('video_intro', payload.video_intro);
        }
      }

      const response = await axios.post(`${baseUrl}profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Profile creation error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${baseUrl}profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Debug logging
      console.log('Profile API Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const logout = createAsyncThunk(
  'profile/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const refreshToken = localStorage.getItem('refresh_token');
      
      const response = await axios.post(`${baseUrl}logout/`, 
        { refresh: refreshToken },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const checkProfileStatus = createAsyncThunk(
  'profile/checkProfileStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${baseUrl}profile_status/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data as ProfileStatusResponse;
    } catch (error) {
      console.error('Profile status check error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);
