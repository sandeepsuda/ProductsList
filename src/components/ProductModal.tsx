import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import type { ProductData } from './AllProductsPage';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<ProductData, 'id'>) => Promise<void>;
  product?: ProductData | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, onSubmit, product }) => {
  // Initialize state directly from props. 
  // We use a 'key' in the parent to reset this component when the product changes.
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    quantity: product?.quantity || 0,
    price: product?.price || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const isEdit = !!product;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              name="name"
              label="Product Name"
              required
              fullWidth
              variant="outlined"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              name="category"
              label="Category"
              required
              fullWidth
              variant="outlined"
              value={formData.category}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                required
                fullWidth
                variant="outlined"
                inputProps={{ min: 0 }}
                value={formData.quantity}
                onChange={handleChange}
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                required
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, step: "0.01" }}
                value={formData.price}
                onChange={handleChange}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;
