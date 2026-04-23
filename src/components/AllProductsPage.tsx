import React, { useState, useEffect, useMemo } from 'react';
import { Package, AlertCircle, DollarSign, Tags, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductsList from './ProductsList';
import '../styles/AllProductsPage.css';

export interface ProductData {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

interface ProductFromBackend {
  ID: number;
  "Product Name": string;
  Quantity: number;
  Price: number;
}

const CATEGORIES = ['Electronics', 'Accessories', 'Audio', 'Office'];

// Helper to assign a mock category based on ID
const getMockCategory = (id: number, name: string) => {
  if (name.toLowerCase().includes('laptop') || name.toLowerCase().includes('monitor') || name.toLowerCase().includes('smartphone')) return 'Electronics';
  if (name.toLowerCase().includes('headphones') || name.toLowerCase().includes('speaker')) return 'Audio';
  if (name.toLowerCase().includes('keyboard') || name.toLowerCase().includes('mouse')) return 'Accessories';
  return CATEGORIES[id % CATEGORIES.length];
};

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Controls state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    // Simulate network delay for skeleton loading demo
    setTimeout(() => {
      fetch('http://localhost:3000/products')
        .then((response) => response.json())
        .then((data: ProductFromBackend[]) => {
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
        .catch(err => {
          console.error("Failed to fetch products", err);
          setIsLoading(false);
        });
    }, 800);
  }, []);

  // Compute stats
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity < 15).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const uniqueCategories = new Set(products.map(p => p.category)).size;

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

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-icon-wrapper blue">
            <Package size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Total Products</span>
            {isLoading ? <div className="skeleton-text" /> : <span className="card-value">{totalProducts}</span>}
          </div>
        </div>
        
        <div className="summary-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-icon-wrapper red">
            <AlertCircle size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Low Stock Items</span>
            {isLoading ? <div className="skeleton-text" /> : <span className="card-value">{lowStockItems}</span>}
          </div>
        </div>

        <div className="summary-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-icon-wrapper green">
            <DollarSign size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Total Inventory Value</span>
            {isLoading ? <div className="skeleton-text" /> : <span className="card-value">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>}
          </div>
        </div>

        <div className="summary-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-icon-wrapper purple">
            <Tags size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Categories</span>
            {isLoading ? <div className="skeleton-text" /> : <span className="card-value">{uniqueCategories}</span>}
          </div>
        </div>
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
