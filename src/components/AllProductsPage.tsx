import React, { useState, useEffect } from 'react';
import ProductsList from './ProductsList';
import '../styles/AllProductsPage.css';

interface ProductData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface ProductFromBackend {
  ID: number;
  "Product Name": string;
  Quantity: number;
  Price: number;
}

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => response.json())
      .then((data: ProductFromBackend[]) => {
        const formattedProducts = data.map((product) => ({
          id: product.ID,
          name: product['Product Name'],
          quantity: product.Quantity,
          price: product.Price,
        }));
        setProducts(formattedProducts);
      });
  }, []);

  return (
    <div className="all-products-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Product Catalog</h1>
          <p className="header-subtitle">Browse our collection of premium products</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</span>
            <span className="stat-label">Total Value</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{products.reduce((sum, p) => sum + p.quantity, 0)}</span>
            <span className="stat-label">Items in Stock</span>
          </div>
        </div>
      </div>
      <div className="products-section">
        <ProductsList products={products} />
      </div>
    </div>
  );
};

export default AllProductsPage;
