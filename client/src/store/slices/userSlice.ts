import axiosInstance from '@/lib/axiosInstance';
import { getConfig } from '@/lib/config';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios'; // Add missing import for axios

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  password:string;
  _id?:string;
}

export interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getConfig().serverBaseUrl+'/users');
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch users');
      }
      return rejectWithValue('Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users', userData); // Replace axios with axiosInstance in all API calls
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to create user');
      }
      return rejectWithValue('Failed to create user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/user/${userId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete user');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const editUser = createAsyncThunk(
  'user/editUser',
  async ({ userId, updatedData }: { userId: string; updatedData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/${userId}`, updatedData);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to edit user');
      }
      return rejectWithValue('An unexpected error occurred');
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
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.meta.arg);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.meta.arg.userId);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;