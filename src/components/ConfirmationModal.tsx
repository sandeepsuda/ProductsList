import React, { useCallback, useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import {
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

type ConfirmationVariant = 'danger' | 'warning' | 'info' | 'success'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  children: React.ReactNode
  confirmButtonText?: string
  variant?: ConfirmationVariant
  cancelButtonText?: string
  errorMessage?: string
}

const variantConfig = {
  danger: { icon: ErrorOutlineIcon, color: 'error' },
  warning: { icon: WarningAmberIcon, color: 'warning' },
  info: { icon: InfoIcon, color: 'info' },
  success: { icon: CheckCircleIcon, color: 'success' },
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmButtonText = 'Confirm',
  variant = 'danger',
  cancelButtonText = 'Cancel',
  errorMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  const displayError = errorMessage || internalError
  const Icon = variantConfig[variant].icon
  const color = variantConfig[variant].color as 'error' | 'warning' | 'info' | 'success'

  const handleConfirm = useCallback(async () => {
    setIsLoading(true)
    setInternalError(null)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      setInternalError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [onConfirm, onClose])

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setInternalError(null), 200)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onClose={!isLoading ? onClose : undefined}
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 1, bgcolor: `${color}.light`, color: `${color}.main` }}>
            <Icon fontSize="small" />
          </Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ minWidth: 360 }}>
          <Box sx={{ mb: 1 }}>{children}</Box>
          {displayError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {displayError}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {cancelButtonText}
        </Button>
        <Button onClick={handleConfirm} variant="contained" color={color} disabled={isLoading} startIcon={isLoading ? <CircularProgress color="inherit" size={16} /> : undefined}>
          {isLoading ? 'Processing...' : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationModal
