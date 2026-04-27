import React, { useState } from 'react';
import { Inventory2 as Inventory2Icon } from '@mui/icons-material'
import Product from './Product';
import type { ProductData } from './AllProductsPage';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Typography,
  TablePagination,
  Skeleton,
} from '@mui/material';

interface ProductsListProps {
  products: ProductData[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

const ProductsList: React.FC<ProductsListProps> = ({ products, isLoading, onDelete }) => {
  const [page, setPage] = useState(0);

  const rowsPerPage = ITEMS_PER_PAGE;
  const totalCount = products.length;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton variant="circular" width={40} height={40} />
                </TableCell>
                <TableCell>
                  <Skeleton width={120} />
                </TableCell>
                <TableCell>
                  <Skeleton width={60} />
                </TableCell>
                <TableCell>
                  <Skeleton width={80} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width={60} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width={120} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Inventory2Icon sx={{ fontSize: 56 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>No products found</Typography>
        <Typography color="text.secondary">Try adjusting your search or filter criteria.</Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                quantity={product.quantity}
                price={product.price}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Paper>
  );
};

export default ProductsList;
