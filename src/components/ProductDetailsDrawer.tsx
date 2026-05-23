import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Paper,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Inventory as QtyIcon,
} from '@mui/icons-material';
import { getStatus } from '../helpers/productHelpers';
import type { ProductData } from './AllProductsPage';

interface ProductDetailsDrawerProps {
  product: ProductData | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading: boolean;
}

const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
  product,
  onClose,
  isLoading,
}) => {
  if (!product) return null;

  const status = getStatus(product.quantity);
  const statusColor =
    status.class === 'status-low'
      ? ('error' as const)
      : status.class === 'status-med'
      ? ('warning' as const)
      : ('success' as const);

  // Dynamic CSS Gradients based on stock level for a premium dashboard feeling
  const bannerGradients = {
    'status-low': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)', // Vibrant Red-Coral
    'status-med': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)', // Warm Gold-Amber
    'status-high': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)', // Emerald Green-Teal
  };

  const bannerGradient = bannerGradients[status.class as keyof typeof bannerGradients] || bannerGradients['status-high'];

  // Calculated stock ratio for health bar (e.g. target 50 units is full health)
  const maxTargetQty = 50;
  const stockRatio = Math.min((product.quantity / maxTargetQty) * 100, 100);

  return (
    <Box sx={{ width: { xs: '100vw', sm: 420 }, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Dynamic Gradient Hero Header */}
      <Box
        sx={{
          background: bannerGradient,
          p: 3,
          pt: 4,
          color: '#fff',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.15)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85, fontWeight: 700 }}>
          Product Details
        </Typography>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mt: 1, textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>
          {product.name}
        </Typography>

        <Chip
          label={status.label}
          sx={{
            mt: 2,
            bgcolor: 'rgba(255,255,255,0.25)',
            color: '#fff',
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        />
      </Box>

      {/* Main Drawer Scrollable Container */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Dynamic Background Fetch Indicator */}
        {isLoading && (
          <Box sx={{ width: '100%', mt: -3 }}>
            <LinearProgress color="info" sx={{ height: 3 }} />
          </Box>
        )}

        {/* Metrics Cards Grid */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                <PriceIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Price
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" color={`${statusColor}.main`}>
                <QtyIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Quantity
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {product.quantity}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Details & Attributes */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
            Product Properties
          </Typography>
          
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                <CategoryIcon fontSize="small" />
                <Typography variant="body2">Category</Typography>
              </Stack>
              <Chip label={product.category} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            </Stack>


          </Stack>
        </Paper>
        {/* Stock Level Health Meter */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
            Stock Health Capacity
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Current quantity relative to warning and optimal stock thresholds (target: 50 units).
          </Typography>

          <Box sx={{ width: '100%', mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={stockRatio}
              color={statusColor}
              sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover' }}
            />
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ px: 0.5 }}>
            <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>0 (Critical)</Typography>
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>15 (Low)</Typography>
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>30+ (Optimal)</Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductDetailsDrawer;
