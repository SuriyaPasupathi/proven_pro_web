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
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  verificationSent: false,
  verified: false,
  email: null,
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
    },
    setEmail: (state, action) => {
      state.email = action.payload;
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
        state.loading = false;
        state.verificationSent = true;
        state.error = null;
        state.email = action.payload.email;
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
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      });
  },
});

export const { clearError, resetState, setEmail } = registerSlice.actions;
export default registerSlice.reducer;
