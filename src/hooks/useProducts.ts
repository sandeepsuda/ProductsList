import { useState, useEffect, useCallback } from 'react';
import type { ProductData } from '../components/AllProductsPage';

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
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { search, status, sort, order } = params;

  // Track the last used params to detect changes during render.
  // This avoids cascading renders caused by calling setState synchronously in useEffect.
  const [prevParams, setPrevParams] = useState(params);

  if (
    search !== prevParams.search ||
    status !== prevParams.status ||
    sort !== prevParams.sort ||
    order !== prevParams.order
  ) {
    setIsLoading(true);
    setError(null);
    setPrevParams(params);
  }

  const deleteProduct = useCallback((id: string) => {
    // Optimistically update the state
    setProducts((currentProducts) => currentProducts.filter(p => p.id !== id));

    const baseUrl = import.meta.env.VITE_API_URL;
    fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete product');
      })
      .catch(err => {
        console.error('Delete error:', err);
        window.location.reload(); 
      });
  }, []);

  const addProduct = useCallback(async (newProductData: Omit<ProductData, 'id'>) => {
    const baseUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductData),
      });
      
      if (!response.ok) throw new Error('Failed to add product');
      
      const savedProduct = await response.json();
      setProducts((prev) => [savedProduct, ...prev]);
    } catch (err) {
      console.error('Add product error:', err);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updatedData: Omit<ProductData, 'id'>) => {
    const baseUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      const updatedProduct = await response.json();
      setProducts((prev) => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error('Update product error:', err);
      throw err;
    }
  }, []);

  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (status && status !== 'all') queryParams.append('status', status);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${import.meta.env.VITE_API_URL}?${queryString}` 
      : import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data: ProductData[] = await response.json();
      setProducts(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch products', err);
        setError(err.message ?? 'Unknown error');
      } else {
        console.error('An unknown error occurred', err);
        setError('Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, status, sort, order]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      fetchProducts(controller.signal);
    });

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  return { products, isLoading, error, fetchProducts, deleteProduct, addProduct, updateProduct };
};

export default useProducts;
