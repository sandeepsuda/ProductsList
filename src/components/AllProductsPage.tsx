import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductsList from './ProductsList';
import useProducts from '../hooks/useProducts';
import '../styles/AllProductsPage.css';

export interface ProductData {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

const AllProductsPage: React.FC = () => {
  // Controls state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filterOption, setFilterOption] = useState('all');

  // Derive BFF-compatible params
  const [sort, order] = sortOption.split('-');
  const bffSort = sort === 'qty' ? 'quantity' : sort;

  const { products, isLoading } = useProducts({
    search: searchQuery,
    status: filterOption,
    sort: bffSort,
    order: order as 'asc' | 'desc'
  });

  return (
    <div className="all-products-page animate-fade-in">
      
      <div className="page-header">
        <h1>Inventory Overview</h1>
        <p className="text-muted">Manage your products, pricing, and stock levels.</p>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content animate-slide-up" style={{ animationDelay: '0.5s' }}>
        
        {/* Controls Above Table */}
        <div className="table-controls">
          <div className="control-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="control-filters">
            <div className="filter-group">
              <SlidersHorizontal size={16} className="filter-icon" />
              <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                <option value="all">All Status</option>
                <option value="in-stock">In Stock (&ge;30)</option>
                <option value="low-stock">Low Stock (&lt;15)</option>
              </select>
              <ChevronDown size={16} className="dropdown-icon" />
            </div>

            <div className="filter-group">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="name-asc">Sort by Name (A-Z)</option>
                <option value="name-desc">Sort by Name (Z-A)</option>
                <option value="price-asc">Sort by Price (Low-High)</option>
                <option value="price-desc">Sort by Price (High-Low)</option>
                <option value="qty-asc">Sort by Quantity (Low-High)</option>
                <option value="qty-desc">Sort by Quantity (High-Low)</option>
              </select>
              <ChevronDown size={16} className="dropdown-icon" />
            </div>
          </div>
        </div>

        {/* Products Table Area */}
        <div className="products-section">
          <ProductsList products={products} isLoading={isLoading} />
        </div>
        
      </div>
    </div>
  );
};

export default AllProductsPage;
