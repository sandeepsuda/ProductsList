import React, { useState } from 'react';
import { PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import Product from './Product';
import type { ProductData } from './AllProductsPage';
import '../styles/ProductsList.css';

interface ProductsListProps {
  products: ProductData[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 5;

const ProductsList: React.FC<ProductsListProps> = ({ products, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 if products list changes and we are out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [products.length, currentPage, totalPages]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  if (isLoading) {
    return (
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className="text-right">Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="skeleton-row">
                <td><div className="skeleton-text" style={{width: '30px'}}/></td>
                <td>
                  <div className="flex-cell">
                    <div className="skeleton-avatar" />
                    <div className="skeleton-text" style={{width: '120px'}}/>
                  </div>
                </td>
                <td><div className="skeleton-text" style={{width: '80px'}}/></td>
                <td><div className="skeleton-text" style={{width: '40px'}}/></td>
                <td><div className="skeleton-badge" /></td>
                <td align="right"><div className="skeleton-text" style={{width: '60px', marginLeft: 'auto'}}/></td>
                <td align="right">
                  <div className="flex-cell" style={{justifyContent: 'flex-end', gap: '8px'}}>
                    <div className="skeleton-icon-btn" />
                    <div className="skeleton-icon-btn" />
                    <div className="skeleton-icon-btn" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <PackageX size={48} />
        </div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="products-wrapper">
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className="text-right">Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                quantity={product.quantity}
                price={product.price}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-info">
          Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}</strong> of <strong>{products.length}</strong> products
        </span>
        <div className="pagination-controls">
          <button 
            className="pagination-btn" 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            Prev
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            className="pagination-btn" 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
