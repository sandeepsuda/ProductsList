import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material'

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </CardContent>
  </Card>
)

const About: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>Inventory Management Platform</Typography>
        <Typography variant="h3" component="h1" sx={{ my: 2 }}>Products Catalog</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>Browse, track and manage your entire product catalog in one clean, fast, and intuitive interface.</Typography>
        <Button variant="contained" component={RouterLink} to="/">View Products →</Button>
      </Box>

      <Box sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body2">Real-time Data</Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <Typography variant="body2">React Powered</Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <Typography variant="body2">Fully Responsive</Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard title="Product Catalog" description="Browse a comprehensive product database with real-time availability at a glance." />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard title="Stock Management" description="Track inventory levels with clear low-stock indicators and status badges." />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard title="Price Display" description="Clear, formatted pricing for every item — no hidden fees, no confusion." />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Ready to explore?</Typography>
        <Button variant="outlined" component={RouterLink} to="/">View Products →</Button>
      </Box>
    </Container>
  )
}

export default About
