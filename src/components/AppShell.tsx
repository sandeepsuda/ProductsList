import React, { forwardRef } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  Avatar,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { LinkProps as RouterLinkProps } from 'react-router-dom'
import {
  Inventory2 as Inventory2Icon,
  Person as PersonIcon,
} from '@mui/icons-material'
import Footer from './Footer'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { to: string }>(
  (props, ref) => <RouterLink ref={ref} {...props} />
)

const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component={LinkBehavior} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Inventory2Icon />
              <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                Products Catalog
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" aria-label="open user profile">
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
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
