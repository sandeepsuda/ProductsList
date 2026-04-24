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
  const { products, isLoading } = useProducts();

  // Controls state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filterOption, setFilterOption] = useState('all');

  // Filter and Sort Data
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (filterOption === 'low-stock') {
      result = result.filter(p => p.quantity < 15);
    } else if (filterOption === 'in-stock') {
      result = result.filter(p => p.quantity >= 30);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'qty-asc': return a.quantity - b.quantity;
        case 'qty-desc': return b.quantity - a.quantity;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

    return result;
  }, [products, searchQuery, sortOption, filterOption]);

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
          <ProductsList products={filteredAndSortedProducts} isLoading={isLoading} />
        </div>
        
      </div>
    </div>
  );
};

export default AllProductsPage;
