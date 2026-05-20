import React, { forwardRef } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import type { LinkProps as RouterLinkProps } from 'react-router-dom'
import {
  Inventory2 as Inventory2Icon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { logout as logoutAction } from '../store/authSlice'
import Footer from './Footer'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { to: string }>(
  (props, ref) => <RouterLink ref={ref} {...props} />
)

const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      dispatch(logoutAction())
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component={LinkBehavior} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Inventory2Icon />
              <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                StockMate
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Hello, {user?.username}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={LinkBehavior} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>

      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  )
}

export default AppShell;
