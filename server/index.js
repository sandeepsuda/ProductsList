import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { Types, connect } from 'mongoose';
import Product, { find, findByIdAndDelete, findByIdAndUpdate } from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const requiredAuthEnvVars = ['JWT_SECRET', 'REFRESH_SECRET', 'AUTH_USERNAME', 'AUTH_PASSWORD'];
const missingAuthEnvVars = requiredAuthEnvVars.filter((name) => !process.env[name]);

if (missingAuthEnvVars.length > 0) {
  console.error(
    `Missing required auth environment variables: ${missingAuthEnvVars.join(', ')}`,
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(json());
app.use(cookieParser());

// Helper to set cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  };

  if (accessToken) {
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  }

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};

const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

// Auth Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    setAuthCookies(res, accessToken, refreshToken);

    return res.json({ message: 'Login successful', user: { username } });
  }

  res.status(401).json({ error: 'Invalid username or password' });
});

app.post('/api/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ username: decoded.username }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ username: decoded.username }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    setAuthCookies(res, accessToken, newRefreshToken);

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    clearAuthCookies(res);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

app.post('/api/logout', (req, res) => {
  clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/status', (req, res) => {
  const accessToken = req.cookies.accessToken;
  
  if (!accessToken) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    res.json({ authenticated: true, user: { username: decoded.username } });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// Middleware to protect API routes
const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API Routes
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const { search, status, sort, order } = req.query;
    
    let query = {};

    // 1. Search (Name or Category)
    if (search) {
      // Escape user input to prevent ReDoS and malformed regex errors
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex }
      ];
    }

    // 2. Filter Status
    if (status === 'low-stock') {
      query.quantity = { $lt: 15 };
    } else if (status === 'in-stock') {
      query.quantity = { $gte: 30 };
    }

    // 3. Sort & Execute
    let productQuery = find(query);
    
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      productQuery = productQuery.sort({ [sort]: sortOrder });
    }

    const products = await productQuery;
    res.json(products);
  } catch (error) {
    console.error('API Server Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Added DELETE route for completeness
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId before attempting to delete
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const result = await findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('API Server Error:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const updatedProduct = await findByIdAndUpdate(
      id,
      { name, category, quantity, price },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('API Server Error:', error.message);
    if (error?.name === 'ValidationError' || error?.name === 'CastError') {
      return res.status(400).json({ error: 'Failed to update product. Ensure all fields are valid.' });
    }
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    const newProduct = new Product({ name, category, quantity, price });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('API Server Error:', error.message);
    if (error?.name === 'ValidationError' || error?.name === 'CastError') {
      return res.status(400).json({ error: 'Failed to create product. Ensure all fields are valid.' });
    }
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`API Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Fail startup when MongoDB is unavailable
  });
