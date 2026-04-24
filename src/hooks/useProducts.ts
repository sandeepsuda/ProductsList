import { useState, useEffect } from 'react';
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
}

const useProducts = (params: UseProductsParams = {}): UseProductsResult => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { search, status, sort, order } = params;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (status && status !== 'all') queryParams.append('status', status);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);

    const url = `${import.meta.env.VITE_API_URL}?${queryParams.toString()}`;

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

  return { products, isLoading, error };
};

export default useProducts;
