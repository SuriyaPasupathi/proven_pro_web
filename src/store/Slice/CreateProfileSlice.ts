import { createSlice } from '@reduxjs/toolkit';
import { createUserProfile, getProfile, logout, checkProfileStatus, updateProfile, uploadVerificationDocument, requestMobileVerification, verifyMobileOTP, getVerificationStatus, shareProfile } from '../Services/CreateProfileService';

interface ProfileError {
  message: string;
  status?: number;
  code?: string;
}

interface VerificationDetails {
  government_id: {
    uploaded: boolean;
    verified: boolean;
    percentage: number;
  };
  address_proof: {
    uploaded: boolean;
    verified: boolean;
    percentage: number;
  };
  mobile: {
    provided: boolean;
    verified: boolean;
    percentage: number;
  };
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
  categories?: {
    id?: number;
    services_categories: string;
    services_description: string;
    rate_range: string;
    availability: string;
  }[];
  services_categories?: string[];
  services_description?: string;
  rate_range?: string;
  availability?: string;

  // Portfolio
  projects?: {
    id?: number;
    project_title: string;
    project_description: string;
    project_url: string;
    project_image?: string;
    project_image_url?: string;
  }[];
  portfolio?: {
    project_title: string;
    project_description: string;
    project_url: string;
    project_image: string;
    project_image_url: string;
  }[];

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

  // Verification
  verification_status?: string;
  gov_id_verified?: boolean;
  address_verified?: boolean;
  mobile_verified?: boolean;
  has_gov_id_document?: boolean;
  has_address_document?: boolean;
  verification_details?: VerificationDetails;
}

interface CreateProfileState {
  loading: boolean;
  error: ProfileError | null;
  success: boolean;
  profileData: ProfileData | null;
  hasProfile: boolean;
  profileStatusLoading: boolean;
  verificationDetails: {
    government_id: {
      uploaded: boolean;
      verified: boolean;
      percentage: number;
    };
    address_proof: {
      uploaded: boolean;
      verified: boolean;
      percentage: number;
    };
    mobile: {
      provided: boolean;
      verified: boolean;
      percentage: number;
    };
  } | null;
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
  verificationDetails: null,
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
        state.error = null;
        state.profileData = action.payload;
        state.verificationDetails = action.payload.verification_details || null;
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
      })
      .addCase(uploadVerificationDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVerificationDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.profileData) {
          state.profileData = {
            ...state.profileData,
            verification_status: action.payload.verification_status
          };
        }
      })
      .addCase(uploadVerificationDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(requestMobileVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestMobileVerification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(requestMobileVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(verifyMobileOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMobileOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.profileData) {
          state.profileData = {
            ...state.profileData,
            verification_status: action.payload.verification_status,
            mobile_verified: true
          };
        }
      })
      .addCase(verifyMobileOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(getVerificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.profileData) {
          state.profileData = {
            ...state.profileData,
            ...action.payload
          };
        }
      })
      .addCase(getVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(shareProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareProfile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(shareProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ProfileError;
      });
  },
});

export const { clearError, resetState, updateProfileData } = createProfileSlice.actions;
export default createProfileSlice.reducer;
