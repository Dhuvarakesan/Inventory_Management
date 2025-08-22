import { getConfig } from '@/lib/config';
import { logger } from '@/lib/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  _id?: string; // Optional for compatibility with existing user objects
  password?: string
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  expiryTime: number | null; // Add expiryTime to track token expiration
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  expiryTime: null, // Initialize expiryTime
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      logger.info('User login attempt', { email: credentials.email });
      const response = await axios.post(getConfig().serverBaseUrl + '/authenticate', credentials);
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('userId', response.data.data.user._id);
      localStorage.setItem('userName', response.data.data.user.name);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      logger.info('User login successful', {
        email: credentials.email,
        role: response.data.data.role
      });
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        logger.error('User login failed', {
          email: credentials.email,
          error: error.response.data?.message || 'Login failed'
        });
        return rejectWithValue(error.response.data?.message || 'Login failed');
      } else {
        logger.error('User login failed', {
          email: credentials.email,
          error: 'An unexpected error occurred'
        });
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  logger.info('User logout');
  localStorage.clear(); // Clear all data in local storage
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(getConfig().serverBaseUrl + '/refresh-token', { refreshToken: token });
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      return {
        accessToken: response.data.accessToken,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = { id: action.payload.user._id, ...action.payload.user };
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.expiryTime = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      });
  },
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;