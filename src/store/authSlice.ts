import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authenticatedFetch } from '../api/authenticatedFetch';

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch('/api/auth/status', {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return rejectWithValue(data.error || 'Not authenticated');
      }
      return data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Not authenticated';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.authenticated;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error =
         (action.payload as string) ??
         action.error.message ??
         'Not authenticated';
      });
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
