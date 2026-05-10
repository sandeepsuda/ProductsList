import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductData } from '../components/AllProductsPage';

interface ProductsState {
  items: ProductData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

const BASE_URL = import.meta.env.VITE_API_URL;

// --- Thunks ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { search?: string; status?: string; sort?: string; order?: string } = {}, { signal }) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    return (await response.json()) as ProductData[];
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProductData: Omit<ProductData, 'id'>) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductData),
    });
    if (!response.ok) throw new Error('Failed to add product');
    return (await response.json()) as ProductData;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedData }: { id: string; updatedData: Omit<ProductData, 'id'> }) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return (await response.json()) as ProductData;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete product');
    return id;
  }
);

// --- Slice ---

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return;
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch products';
      })
      // Add Product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state, action) => {
        // Optimistic update
        state.items = state.items.filter(p => p.id !== action.meta.arg);
      })
      .addCase(deleteProduct.rejected, () => {
        console.error('Delete failed');
      });
  },
});

export default productsSlice.reducer;
