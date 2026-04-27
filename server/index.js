require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const { search, status, sort, order } = req.query;
    
    let query = {};

    // 1. Search (Name or Category)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
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
    let productQuery = Product.find(query);
    
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
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('API Server Error:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
