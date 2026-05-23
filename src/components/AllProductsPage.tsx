import React, { useState, useCallback, useDeferredValue } from 'react';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import ProductsList from './ProductsList';
import ProductModal from './ProductModal';
import useProducts from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';

import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Button,
  Drawer,
} from '@mui/material';
import ProductDetailsDrawer from './ProductDetailsDrawer';
import ConfirmationModal from './ConfirmationModal';

export interface ProductData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

const AllProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filterOption, setFilterOption] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductData | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [sort, order] = sortOption.split('-');
  const apiSort = sort === 'qty' ? 'quantity' : sort;

  const { 
    products, 
    isLoading, 
    error, 
    deleteProduct, 
    addProduct, 
    updateProduct,
    selectedProductDetail,
    detailsStatus,
    fetchProductById,
    clearProductDetail,
    setProductDetail
  } = useProducts({
    search: debouncedSearchQuery,
    status: filterOption,
    sort: apiSort,
    order: order as 'asc' | 'desc'
  });

  const deferredProducts = useDeferredValue(products);
  const isStale = products !== deferredProducts;

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = useCallback((id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  }, [products]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenDetails = useCallback((product: ProductData) => {
    setProductDetail(product); // immediate optimistic load
    setIsDrawerOpen(true);
    fetchProductById(product.id); // background update
  }, [setProductDetail, fetchProductById]);

  const handleCloseDetails = useCallback(() => {
    setIsDrawerOpen(false);
    clearProductDetail();
  }, [clearProductDetail]);

  const handleConfirmDeleteDrawer = useCallback(async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  }, [productToDelete, deleteProduct]);

  const handleSubmit = async (productData: Omit<ProductData, 'id'>) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, productData);
    } else {
      await addProduct(productData);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Inventory
          </Typography>
          <Typography color="text.secondary">Manage your products, pricing, and stock levels.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ mt: { xs: 1, sm: 0 } }}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Box>
      )}

      <Stack spacing={2}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <TextField
              size="small"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { xs: '100%', sm: 300 } }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="filter-label">Filter</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filterOption}
                  label="Filter"
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="in-stock">In Stock (≥30)</MenuItem>
                  <MenuItem value="low-stock">Low Stock (&lt;15)</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortOption}
                  label="Sort"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="price-asc">Price (Low-High)</MenuItem>
                  <MenuItem value="price-desc">Price (High-Low)</MenuItem>
                  <MenuItem value="qty-asc">Quantity (Low-High)</MenuItem>
                  <MenuItem value="qty-desc">Quantity (High-Low)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        <Paper 
          sx={{ 
            p: 1, 
            opacity: isStale ? 0.6 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }} 
          elevation={0}
        >
          <ProductsList 
            products={deferredProducts} 
            isLoading={isLoading} 
            onDelete={deleteProduct}
            onEdit={handleOpenEditModal}
            onView={handleOpenDetails}
          />
        </Paper>
      </Stack>

      <ProductModal
        key={selectedProduct?.id || 'new'}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        product={selectedProduct}
      />

      {/* Product Details side Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDetails}
        PaperProps={{
          sx: {
            boxShadow: '-8px 0 30px rgba(0,0,0,0.08)',
            borderLeft: '1px solid',
            borderColor: 'divider',
          }
        }}
      >
        <ProductDetailsDrawer
          product={selectedProductDetail}
          onClose={handleCloseDetails}
          onEdit={(id) => {
            handleOpenEditModal(id);
            handleCloseDetails();
          }}
          onDelete={(id) => {
            const product = products.find(p => p.id === id);
            if (product) {
              setProductToDelete(product);
              handleCloseDetails();
            }
          }}
          isLoading={detailsStatus === 'loading'}
        />
      </Drawer>

      {/* Drawer Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDeleteDrawer}
        title="Delete Product"
        confirmButtonText="Delete Product"
        variant="danger"
      >
        <p>
          Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>?
          This action cannot be undone and will permanently remove the item from your inventory.
        </p>
      </ConfirmationModal>
    </Box>
  );
};

export default AllProductsPage;
