import React, { useState, useCallback } from 'react';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  MoveToInbox as InboxIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { getStatus } from '../helpers/productHelpers';
import ConfirmationModal from './ConfirmationModal';
import { useModal } from '../hooks/useModal';
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Collapse,
  Box,
  Typography,
  Stack,
} from '@mui/material';

interface ProductProps {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  onDelete: (id: string) => void;
}

const Product: React.FC<ProductProps> = ({ id, name, category, quantity, price, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen: showDeleteModal, openModal, closeModal } = useModal();
  
  const status = getStatus(quantity);
  const totalValue = quantity * price;

  const handleDelete = useCallback(() => {
    onDelete(id);
    closeModal();
  }, [id, onDelete, closeModal]);

  const statusColor = status.class === 'status-low' ? ('error' as const) : status.class === 'status-med' ? ('warning' as const) : ('success' as const);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 40, height: 40 }}>{name.charAt(0)}</Avatar>
            <Box>
              <Typography variant="subtitle2">{name}</Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary">{category}</Typography>
        </TableCell>

        <TableCell>
          <Typography>{quantity}</Typography>
        </TableCell>

        <TableCell>
          <Chip label={status.label} color={statusColor} size="small" />
        </TableCell>

        <TableCell align="right">
          <Typography>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </TableCell>

        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Product">
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Product">
              <IconButton size="small" color="error" onClick={openModal}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InboxIcon fontSize="small" />
                    <Typography variant="caption">Product ID</Typography>
                  </Stack>
                  <Typography sx={{ mt: 0.5 }}>{id}</Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoneyIcon fontSize="small" />
                    <Typography variant="caption">Total Inventory Value</Typography>
                  </Stack>
                  <Typography sx={{ mt: 0.5 }}>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">Stock Status</Typography>
                  </Stack>
                  <Typography sx={{ mt: 0.5 }}>{quantity > 0 ? `Currently ${status.label.toLowerCase()} with ${quantity} units available.` : 'This product is currently out of stock.'}</Typography>
                </Box>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Product"
        confirmButtonText="Delete Product"
        variant="danger"
      >
        <p>
          Are you sure you want to delete <strong>"{name}"</strong>?
          This action cannot be undone and will permanently remove the item from your inventory.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default Product;
