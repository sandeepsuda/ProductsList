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
  deleteProduct: (id: number) => void;
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

  const deleteProduct = useCallback((id: number) => {
    // Optimistically update the state
    setProducts((currentProducts) => currentProducts.filter(p => p.id !== id));
    
    // In a real app, you would also make a DELETE request to your API here
    // fetch(`${import.meta.env.VITE_API_URL}/${id}`, { method: 'DELETE' }).catch(console.error);
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (status && status !== 'all') queryParams.append('status', status);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${import.meta.env.VITE_API_URL}?${queryString}` 
      : import.meta.env.VITE_API_URL;

    // Simulate network delay for skeleton loading demo
    const isDev = import.meta.env.MODE === 'development';
    const delay = isDev ? 800 : 0;
    
    const timer = setTimeout(() => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          return response.json();
        })
        .then((data: ProductData[]) => {
          if (cancelled) return;
          setProducts(data);
          setIsLoading(false);
        })
        .catch((err: Error) => {
          if (cancelled) return;
          console.error('Failed to fetch products', err);
          setError(err.message ?? 'Unknown error');
          setIsLoading(false);
        });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, status, sort, order]);

  return { products, isLoading, error, deleteProduct };
};

export default useProducts;
