import { useState, useEffect } from 'react';
import type { ProductData } from '../components/AllProductsPage';
import { getMockCategory } from '../components/Product';

interface ProductFromBackend {
  ID: number;
  'Product Name': string;
  Quantity: number;
  Price: number;
}

const CATEGORIES = ['Electronics', 'Accessories', 'Audio', 'Office'];

// Helper function moved outside component for purity
export const getMockCategory = (id: number, name: string): string => {
  if (
    name.toLowerCase().includes('laptop') ||
    name.toLowerCase().includes('monitor') ||
    name.toLowerCase().includes('smartphone')
  )
    return 'Electronics';
  if (
    name.toLowerCase().includes('headphones') ||
    name.toLowerCase().includes('speaker')
  )
    return 'Audio';
  if (
    name.toLowerCase().includes('keyboard') ||
    name.toLowerCase().includes('mouse')
  )
    return 'Accessories';
  return CATEGORIES[id % CATEGORIES.length];
};

interface UseProductsResult {
  products: ProductData[];
  isLoading: boolean;
  error: string | null;
}

const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Simulate network delay for skeleton loading demo
    const isDev = import.meta.env.MODE === 'development';
    const timer = isDev ? setTimeout(() => {
      fetch(import.meta.env.VITE_API_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          return response.json();
        })
        .then((data: ProductFromBackend[]) => {
          if (cancelled) return;
          const formattedProducts = data.map((product) => ({
            id: product.ID,
            name: product['Product Name'],
            category: getMockCategory(product.ID, product['Product Name']),
            quantity: product.Quantity,
            price: product.Price,
          }));
          setProducts(formattedProducts);
          setIsLoading(false);
        })
        .catch((err: Error) => {
          if (cancelled) return;
          console.error('Failed to fetch products', err);
          setError(err.message ?? 'Unknown error');
          setIsLoading(false);
        });
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { products, isLoading, error };
};

export default useProducts;
