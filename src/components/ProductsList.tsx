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
} from '@mui/material';

interface ProductsListProps {
  products: ProductData[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

const ProductsList: React.FC<ProductsListProps> = ({ products, isLoading, onDelete, onEdit }) => {
  const [page, setPage] = useState(0);

  const rowsPerPage = ITEMS_PER_PAGE;
  const totalCount = products.length;

  // Calculate the maximum allowed page based on the current product list size.
  const maxPage = Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1);
  
  // Use the safe page for slicing the data and for the pagination component.
  // This ensures the UI is always correct even if the 'page' state is temporarily out of bounds
  // (e.g., after filtering or deletion).
  const displayPage = Math.min(page, maxPage);
  const paginatedProducts = products.slice(displayPage * rowsPerPage, displayPage * rowsPerPage + rowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  if (isLoading && products.length === 0) {
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
                onEdit={onEdit}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={displayPage}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Paper>
  );
};

export default ProductsList;
