import { createSlice } from '@reduxjs/toolkit';
import { postUserCredentials, requestPasswordReset, resetPasswordConfirm } from '../Services/AuthService';

interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUserCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUserCredentials.fulfilled, (state, action) => {
        console.log('AuthSlice: postUserCredentials.fulfilled called with payload:', {
          hasUser: !!action.payload.user,
          hasAccess: !!action.payload.access,
          hasRefresh: !!action.payload.refresh
        });
        
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;
        
        console.log('AuthSlice: Authentication state updated, isAuthenticated:', state.isAuthenticated);
      })
      .addCase(postUserCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
        state.isAuthenticated = false;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      })
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;