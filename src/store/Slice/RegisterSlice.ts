import { createSlice } from '@reduxjs/toolkit';
import { registerUser, verifyOTP, resendOTP } from '../Services/RegisterService';

interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

interface RegisterState {
  loading: boolean;
  error: AuthError | null;
  verificationSent: boolean;
  verified: boolean;
  email: string | null;
  otpTimer: number; // Countdown timer in seconds
  otpExpired: boolean; // Whether OTP has expired
  resendCooldown: number; // Cooldown for resend in seconds
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  verificationSent: false,
  verified: false,
  email: null,
  otpTimer: 300, // 5 minutes = 300 seconds
  otpExpired: false,
  resendCooldown: 0,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.verificationSent = false;
      state.verified = false;
      state.email = null;
      state.otpTimer = 300;
      state.otpExpired = false;
      state.resendCooldown = 0;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    decrementTimer: (state) => {
      if (state.otpTimer > 0) {
        state.otpTimer -= 1;
        if (state.otpTimer === 0) {
          state.otpExpired = true;
        }
      }
    },
    resetTimer: (state) => {
      state.otpTimer = 300; // Reset to 5 minutes
      state.otpExpired = false;
    },
    setResendCooldown: (state, action) => {
      state.resendCooldown = action.payload;
    },
    decrementResendCooldown: (state) => {
      if (state.resendCooldown > 0) {
        state.resendCooldown -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('RegisterUser fulfilled - action.payload:', action.payload);
        state.loading = false;
        state.verificationSent = true;
        state.error = null;
        state.email = action.payload.email;
        state.otpTimer = 300; // Start 5-minute timer
        state.otpExpired = false;
        // Store email in localStorage as backup
        if (action.payload.email) {
          localStorage.setItem('registrationEmail', action.payload.email);
        }
        console.log('RegisterUser fulfilled - state after update:', state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.verified = true;
        state.error = null;
        state.otpTimer = 0;
        state.otpExpired = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      })
      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.otpTimer = 300; // Reset timer to 5 minutes
        state.otpExpired = false;
        state.resendCooldown = 30; // Set 30-second cooldown for resend
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as AuthError & { cooldown_remaining?: number };
        state.error = error;
        
        // Set cooldown from backend response if available
        if (error.code === 'COOLDOWN' && error.cooldown_remaining) {
          state.resendCooldown = error.cooldown_remaining;
        }
      });
  },
});

export const { 
  clearError, 
  resetState, 
  setEmail, 
  decrementTimer, 
  resetTimer, 
  setResendCooldown, 
  decrementResendCooldown 
} = registerSlice.actions;
export default registerSlice.reducer;
