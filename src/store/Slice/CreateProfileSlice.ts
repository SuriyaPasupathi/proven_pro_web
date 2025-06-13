import { createSlice } from '@reduxjs/toolkit';
import { createUserProfile, getProfile, logout, checkProfileStatus, updateProfile, uploadVerificationDocument, requestMobileVerification, verifyMobileOTP, getVerificationStatus, shareProfile, requestEmailChange, verifyEmailOTP, changePassword, submitProfileReview, getProfileReviews, deleteItem } from '../Services/CreateProfileService';
import { ProfileData } from '../../types/profile';

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

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  company?: string;
}

interface CreateProfileState {
  loading: boolean;
  error: ProfileError | null;
  success: boolean;
  profileData: ProfileData | null;
  hasProfile: boolean;
  profileStatusLoading: boolean;
  emailChangeLoading: boolean;
  otpVerificationLoading: boolean;
  passwordChangeLoading: boolean;
  reviewSubmissionLoading: boolean;
  reviewSubmissionSuccess: boolean;
  reviewsLoading: boolean;
  reviews: Review[];
  verificationDetails: VerificationDetails | null;
  deleteLoading: boolean;
  deleteSuccess: boolean;
}

const initialState: CreateProfileState = {
  loading: false,
  error: null,
  success: false,
  profileData: {
    id: '',
    subscription_type: 'premium',
  },
  hasProfile: false,
  profileStatusLoading: false,
  emailChangeLoading: false,
  otpVerificationLoading: false,
  passwordChangeLoading: false,
  reviewSubmissionLoading: false,
  reviewSubmissionSuccess: false,
  reviewsLoading: false,
  reviews: [],
  verificationDetails: null,
  deleteLoading: false,
  deleteSuccess: false,
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
    resetReviewState: (state) => {
      state.reviewSubmissionLoading = false;
      state.reviewSubmissionSuccess = false;
      state.error = null;
    },
    resetReviewsState: (state) => {
      state.reviewsLoading = false;
      state.reviews = [];
      state.error = null;
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
          ...action.payload,
          categories: action.payload.categories || state.profileData?.categories
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
      })
      .addCase(requestEmailChange.pending, (state) => {
        state.emailChangeLoading = true;
        state.error = null;
      })
      .addCase(requestEmailChange.fulfilled, (state) => {
        state.emailChangeLoading = false;
        state.error = null;
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.emailChangeLoading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(verifyEmailOTP.pending, (state) => {
        state.otpVerificationLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOTP.fulfilled, (state, action) => {
        state.otpVerificationLoading = false;
        state.error = null;
        if (state.profileData) {
          state.profileData = {
            ...state.profileData,
            profile_mail: action.payload.email
          };
        }
      })
      .addCase(verifyEmailOTP.rejected, (state, action) => {
        state.otpVerificationLoading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(changePassword.pending, (state) => {
        state.passwordChangeLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordChangeLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChangeLoading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(submitProfileReview.pending, (state) => {
        state.reviewSubmissionLoading = true;
        state.error = null;
        state.reviewSubmissionSuccess = false;
      })
      .addCase(submitProfileReview.fulfilled, (state) => {
        state.reviewSubmissionLoading = false;
        state.reviewSubmissionSuccess = true;
        state.error = null;
      })
      .addCase(submitProfileReview.rejected, (state, action) => {
        state.reviewSubmissionLoading = false;
        state.reviewSubmissionSuccess = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(getProfileReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.error = null;
      })
      .addCase(getProfileReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(getProfileReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.error = action.payload as ProfileError;
      })
      .addCase(deleteItem.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteItem.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.error = action.payload as ProfileError;
      });
  },
});

export const { clearError, resetState, updateProfileData, resetReviewState, resetReviewsState } = createProfileSlice.actions;
export default createProfileSlice.reducer;
