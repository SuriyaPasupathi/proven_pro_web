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
  categories?: {
    id?: number;
    services_categories: string;
    services_description: string;
    rate_range: string;
    availability: string;
  }[];
  projects?: {
    id?: number;
    project_title: string;
    project_description: string;
    project_url: string;
    project_image?: File;
  }[];
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
  return token; // Return null if no token exists instead of throwing error
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
  async (profileId: string | undefined, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      // Use the same endpoint for both current user and specific profile
      // The backend will handle the profileId parameter in the query
      const url = `${baseUrl}profile/`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: profileId ? { profile_id: profileId } : undefined
      });

      // Debug logging
      console.log('Profile API Response:', response.data);
      console.log('Categories:', response.data.categories);
      console.log('Projects:', response.data.projects);
      console.log('Services Categories:', response.data.services_categories);
      console.log('Services Description:', response.data.services_description);
      console.log('Rate Range:', response.data.rate_range);
      console.log('Availability:', response.data.availability);
      console.log('Portfolio:', response.data.portfolio);
      
      // Transform the data if needed
      const transformedData = {
        ...response.data,
        categories: response.data.categories || [],
        projects: response.data.projects || [],
        portfolio: response.data.portfolio || [],
        services_categories: response.data.services_categories || [],
        services_description: response.data.services_description || '',
        rate_range: response.data.rate_range || '',
        availability: response.data.availability || ''
      };
      
      console.log('Transformed Data:', transformedData);
      
      return transformedData;
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
      
      // If we have a refresh token, attempt to call the logout API
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseUrl}logout/`, 
            { refresh: refreshToken },
            {
              headers: {
                'Authorization': token ? `Bearer ${token}` : undefined
              }
            }
          );
          return response.data;
        } catch (apiError) {
          console.warn('Logout API call failed:', apiError);
          // Continue with local logout even if API call fails
        }
      }

      // Always return success to ensure local logout completes
      return { success: true };
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

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
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

      // Debug logging
      console.log('Update Profile Payload:', payload);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.put(`${baseUrl}profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Debug logging
      console.log('Update Profile Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const uploadVerificationDocument = createAsyncThunk(
  'profile/uploadVerificationDocument',
  async (payload: { document: File; document_type: 'gov_id' | 'address' }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('document', payload.document);
      formData.append('document_type', payload.document_type);

      const response = await axios.post(`${baseUrl}upload-verification-document/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Document upload error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const requestMobileVerification = createAsyncThunk(
  'profile/requestMobileVerification',
  async (mobile: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${baseUrl}request-mobile-verification/`,
        { mobile },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Mobile verification request error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const verifyMobileOTP = createAsyncThunk(
  'profile/verifyMobileOTP',
  async (otp: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${baseUrl}verify-mobile-otp/`,
        { otp },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Mobile OTP verification error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const getVerificationStatus = createAsyncThunk(
  'profile/getVerificationStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${baseUrl}verification-status/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Verification status fetch error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);

export const shareProfile = createAsyncThunk(
  'profile/shareProfile',
  async (email: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${baseUrl}request-profile-share/`,
        { 
          action: 'generate',
          email 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Profile share error:', error);
      const profileError = handleProfileError(error);
      return rejectWithValue(profileError);
    }
  }
);
