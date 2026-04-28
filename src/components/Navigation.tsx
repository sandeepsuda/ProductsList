import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover,
  '&:hover': { backgroundColor: theme.palette.action.selected },
  marginLeft: 0,
  width: '100%',
  maxWidth: 420,
}))

const Navigation: React.FC = () => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ width: 36, height: 36, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: '#fff', borderRadius: 1, mr: 1 }}>
            <Inventory2Icon fontSize="small" />
          </Box>
          <Typography variant="h6">Products Catalog</Typography>
        </Box>

        <SearchBox>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
            <SearchIcon fontSize="small" />
            <InputBase placeholder="Search products..." sx={{ ml: 1, width: '100%' }} />
          </Box>
        </SearchBox>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <Badge variant="dot" color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ width: 1, height: 28, bgcolor: 'divider', mx: 1 }} />

          <IconButton>
            <Avatar sx={{ width: 36, height: 36 }}>
              <PersonIcon />
            </Avatar>
          </IconButton>

          <Box sx={{ textAlign: 'left', ml: 0.5 }}>
            <Typography variant="subtitle2">Admin User</Typography>
            <Typography variant="caption" color="text.secondary">Manager</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
