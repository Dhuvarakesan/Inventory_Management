import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'User';
  createdAt: string;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;