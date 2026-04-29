import React from 'react'
import {
  Container,
  Box,
  Grid,
  Typography,
  Link,
  Chip,
} from '@mui/material'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', mt: 6, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>ProductsList</Typography>
            <Typography color="text.secondary">Your premium destination for managing and browsing products with ease.</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" gutterBottom>Quick Links</Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              <li><Link href="/">Products</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" gutterBottom>Features</Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              <li><Link href="/">Browse Products</Link></li>
              <li><Link href="/">Real-time Updates</Link></li>
              <li><Link href="/">Stock Management</Link></li>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2">© {currentYear} ProductsList. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="Built with React" variant="outlined" size="small" />
            <Chip label="Powered by Vite" variant="outlined" size="small" />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
