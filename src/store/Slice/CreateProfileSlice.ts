import { createSlice } from '@reduxjs/toolkit';
import { createUserProfile, getProfile, logout, checkProfileStatus, updateProfile } from '../Services/CreateProfileService';

interface ProfileError {
  message: string;
  status?: number;
  code?: string;
}

interface ProfileData {
  subscription_type: 'free' | 'standard' | 'premium';
  first_name?: string;
  last_name?: string;
  bio?: string;
  job_title?: string;
  job_specialization?: string;
  mobile?: string;
  profile_mail?: string;
  profile_url?: string;
  rating?: number;
  
  // Profile Images
  profile_pic?: string;
  profile_pic_url?: string;
  video_intro?: string;
  video_intro_url?: string;
  video_description?: string;

  // Services
  services_categories?: string[];
  services_description?: string;
  rate_range?: string;
  availability?: string;

  // Experience
  experiences?: {
    company_name: string;
    position: string;
    key_responsibilities: string;
    experience_start_date: string;
    experience_end_date: string;
  }[];

  // Skills & Tools
  primary_tools?: string[];
  technical_skills?: string[];
  soft_skills?: string[];
  skills_description?: string;

  // Portfolio
  portfolio?: {
    project_title: string;
    project_description: string;
    project_url: string;
    project_image: string;
    project_image_url: string;
  }[];

  // Certifications
  certifications?: {
    certifications_name: string;
    certifications_issuer: string;
    certifications_issued_date: string;
    certifications_expiration_date: string;
    certifications_id: string;
    certifications_image: string;
    certifications_image_url: string;
  }[];

  // Reviews
  reviews?: any[];
}

interface CreateProfileState {
  loading: boolean;
  error: ProfileError | null;
  success: boolean;
  profileData: ProfileData | null;
  hasProfile: boolean;
  profileStatusLoading: boolean;
}

const initialState: CreateProfileState = {
  loading: false,
  error: null,
  success: false,
  profileData: {
    subscription_type: 'premium',
  },
  hasProfile: false,
  profileStatusLoading: false,
};

const createProfileSlice = createSlice({
  name: 'createProfile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.profileData = { subscription_type: 'premium' };
    },
    updateProfileData: (state, action) => {
      state.profileData = {
        ...state.profileData,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profileData = action.payload;
        state.error = null;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
        state.success = false;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.profileData = { subscription_type: 'premium' };
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(checkProfileStatus.pending, (state) => {
        state.profileStatusLoading = true;
        state.error = null;
      })
      .addCase(checkProfileStatus.fulfilled, (state, action) => {
        state.profileStatusLoading = false;
        state.hasProfile = action.payload.has_profile;
        state.profileData = {
          ...state.profileData,
          subscription_type: action.payload.subscription_type,
        };
        state.error = null;
      })
      .addCase(checkProfileStatus.rejected, (state, action) => {
        state.profileStatusLoading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = {
          ...state.profileData,
          ...action.payload
        };
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      });
  },
});

export const { clearError, resetState, updateProfileData } = createProfileSlice.actions;
export default createProfileSlice.reducer;
