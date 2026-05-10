import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ProductData } from '../components/AllProductsPage';
import type { AppDispatch, RootState } from '../store';
import { 
  fetchProducts as fetchProductsThunk, 
  addProduct as addProductThunk, 
  updateProduct as updateProductThunk, 
  deleteProduct as deleteProductThunk 
} from '../store/productsSlice';

interface UseProductsParams {
  search?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface UseProductsResult {
  products: ProductData[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (signal?: AbortSignal) => Promise<void>;
  deleteProduct: (id: string) => void;
  addProduct: (product: Omit<ProductData, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<ProductData, 'id'>) => Promise<void>;
}

const useProducts = (params: UseProductsParams = {}): UseProductsResult => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);
  const isLoading = status === 'loading';

  const { search, status: filterStatus, sort, order } = params;

  const fetchProducts = useCallback(async () => {
    try {
      await dispatch(fetchProductsThunk({ search, status: filterStatus, sort, order })).unwrap();
    } catch {
      // Errors are handled in the slice
    }
  }, [dispatch, search, filterStatus, sort, order]);

  const deleteProduct = useCallback((id: string) => {
    dispatch(deleteProductThunk(id));
  }, [dispatch]);

  const addProduct = useCallback(async (newProductData: Omit<ProductData, 'id'>) => {
    await dispatch(addProductThunk(newProductData)).unwrap();
  }, [dispatch]);

  const updateProduct = useCallback(async (id: string, updatedData: Omit<ProductData, 'id'>) => {
    await dispatch(updateProductThunk({ id, updatedData })).unwrap();
  }, [dispatch]);

  useEffect(() => {
    const promise = dispatch(fetchProductsThunk({ search, status: filterStatus, sort, order }));
    return () => {
      promise.abort();
    };
  }, [dispatch, search, filterStatus, sort, order]);

  return { 
    products, 
    isLoading, 
    error, 
    fetchProducts, 
    deleteProduct, 
    addProduct, 
    updateProduct 
  };
};

export default useProducts;
