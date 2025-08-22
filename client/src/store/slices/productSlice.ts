import axiosInstance from '@/lib/axiosInstance';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minCountLevel: number; // Minimum count level for stock
  status: 'Active' | 'Inactive' | 'Low Stock';
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: string;
  };
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    status: '',
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/products');
      return response.data.data.map((product: Omit<Product, 'id'> & { _id: string }) => ({
        ...product,
        id: product._id,
      })); // Map _id to id
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return { ...response.data, id: response.data._id }; // Map _id to id
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create product');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...productData }: Partial<Product> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return { ...response.data, id: response.data._id }; // Map _id to id
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update product');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      const deletedProduct = { ...response.data.data, id: response.data.data._id }; // Map _id to id
      return deletedProduct;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to delete product'
        );
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const addStock = createAsyncThunk(
  'products/addStock',
  async ({ id, quantity, reason }: { id: string; quantity: number,reason:string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/products/${id}/add-stock`, { quantity,reason });
      return { ...response.data.data, id: response.data.data._id }; // Map _id to id
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add stock');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const withdrawStock = createAsyncThunk(
  'products/withdrawStock',
  async ({ id, quantity,reason }: { id: string; quantity: number,reason:string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/products/${id}/withdraw-stock`, { quantity,reason });
      return { ...response.data.data, id: response.data.data._id }; // Map _id to id
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to withdraw stock');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload.id);
      });
  },
});

export const { setFilters, clearError } = productSlice.actions;
export default productSlice.reducer;