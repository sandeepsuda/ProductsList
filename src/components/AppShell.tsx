import React, { useState, forwardRef } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Badge,
  Avatar,
  Divider,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { LinkProps as RouterLinkProps } from 'react-router-dom'
import {
  Inventory2 as Inventory2Icon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import Footer from './Footer'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { to: string }>(
  (props, ref) => <RouterLink ref={ref} {...props} />
)

const drawerWidth = 240

const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(true)}
              aria-label="open navigation"
              size="large"
            >
              <MenuIcon />
            </IconButton>

            <Box component={LinkBehavior} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Inventory2Icon />
              <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                Products Catalog
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" aria-label="view notifications">
              <Badge color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton color="inherit" aria-label="open user profile">
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: drawerWidth }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={LinkBehavior} to="/">
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={LinkBehavior} to="/about">
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Container component="main" maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>

      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  )
}

export default AppShell
