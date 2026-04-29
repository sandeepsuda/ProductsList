import React, { useState } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import ProductsList from './ProductsList';
import useProducts from '../hooks/useProducts';

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
} from '@mui/material';

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

  const [sort, order] = sortOption.split('-');
  const apiSort = sort === 'qty' ? 'quantity' : sort;

  const { products, isLoading, error, deleteProduct } = useProducts({
    search: searchQuery,
    status: filterOption,
    sort: apiSort,
    order: order as 'asc' | 'desc'
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Overview
        </Typography>
        <Typography color="text.secondary">Manage your products, pricing, and stock levels.</Typography>
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

        <Paper sx={{ p: 1 }} elevation={0}>
          <ProductsList products={products} isLoading={isLoading} onDelete={deleteProduct} />
        </Paper>
      </Stack>
    </Box>
  );
};

export default AllProductsPage;
