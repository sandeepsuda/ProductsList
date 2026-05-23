import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductData } from '../components/AllProductsPage';
import { authenticatedFetch } from '../api/authenticatedFetch';
import { logout } from './authSlice';
import type { AppDispatch } from './index';

interface ProductsState {
  items: ProductData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedProductDetail: ProductData | null;
  detailsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailsError: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedProductDetail: null,
  detailsStatus: 'idle',
  detailsError: null,
};

const BASE_URL = '/api/products';

const handleUnauthorized = (dispatch: AppDispatch) => {
  dispatch(logout());

  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

const getErrorMessage = async (response: Response, fallback: string) => {
  const errorPayload = await response.json().catch(() => null);

  if (
    errorPayload &&
    typeof errorPayload === 'object' &&
    'error' in errorPayload &&
    typeof errorPayload.error === 'string'
  ) {
    return errorPayload.error;
  }

  return fallback;
};

// --- Thunks ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    params: { search?: string; status?: string; sort?: string; order?: string } = {},
    { signal, dispatch },
  ) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const response = await authenticatedFetch(url, {
      signal,
      onUnauthorized: () => handleUnauthorized(dispatch as AppDispatch),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, `Server responded with status ${response.status}`));
    }
    return (await response.json()) as ProductData[];
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProductData: Omit<ProductData, 'id'>, { dispatch }) => {
    const response = await authenticatedFetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductData),
      onUnauthorized: () => handleUnauthorized(dispatch as AppDispatch),
    });
    if (!response.ok) throw new Error(await getErrorMessage(response, 'Failed to add product'));
    return (await response.json()) as ProductData;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedData }: { id: string; updatedData: Omit<ProductData, 'id'> }, { dispatch }) => {
    const response = await authenticatedFetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
      onUnauthorized: () => handleUnauthorized(dispatch as AppDispatch),
    });
    if (!response.ok) throw new Error(await getErrorMessage(response, 'Failed to update product'));
    return (await response.json()) as ProductData;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { dispatch }) => {
    const response = await authenticatedFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      onUnauthorized: () => handleUnauthorized(dispatch as AppDispatch),
    });
    if (!response.ok) throw new Error(await getErrorMessage(response, 'Failed to delete product'));
    return id;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { dispatch }) => {
    const response = await authenticatedFetch(`${BASE_URL}/${id}`, {
      onUnauthorized: () => handleUnauthorized(dispatch as AppDispatch),
    });
    if (!response.ok) throw new Error(await getErrorMessage(response, 'Failed to fetch product details'));
    return (await response.json()) as ProductData;
  }
);

// --- Slice ---

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProductDetail: (state) => {
      state.selectedProductDetail = null;
      state.detailsStatus = 'idle';
      state.detailsError = null;
    },
    setSelectedProductDetail: (state, action) => {
      state.selectedProductDetail = action.payload;
    }
  },
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
      // Fetch Single Product Details
      .addCase(fetchProductById.pending, (state) => {
        state.detailsStatus = 'loading';
        state.detailsError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.selectedProductDetail = action.payload;
        // Keep main list updated too if this item changed
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.detailsError = action.error.message ?? 'Failed to fetch product details';
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
        if (state.selectedProductDetail?.id === action.payload.id) {
          state.selectedProductDetail = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state, action) => {
        // Optimistic update
        state.items = state.items.filter(p => p.id !== action.meta.arg);
        if (state.selectedProductDetail?.id === action.meta.arg) {
          state.selectedProductDetail = null;
        }
      })
      .addCase(deleteProduct.rejected, () => {
        console.error('Delete failed');
      });
  },
});

export const { clearSelectedProductDetail, setSelectedProductDetail } = productsSlice.actions;

export default productsSlice.reducer;
