const express = require('express');
const cors = require('cors');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const PORT = 3001;
const BACKEND_URL = 'http://localhost:3000/products';

app.use(cors());
app.use(express.json());

// Category Logic (Moved from frontend)
const CATEGORIES = ['Electronics', 'Accessories', 'Audio', 'Office'];
const getCategory = (id, name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('laptop') || lowerName.includes('monitor') || lowerName.includes('smartphone')) return 'Electronics';
  if (lowerName.includes('headphones') || lowerName.includes('speaker')) return 'Audio';
  if (lowerName.includes('keyboard') || lowerName.includes('mouse')) return 'Accessories';
  return CATEGORIES[id % CATEGORIES.length];
};

app.get('/api/products', async (req, res) => {
  try {
    const { search, status, sort, order } = req.query;
    
    // 1. Fetch raw data from backend
    const response = await axios.get(BACKEND_URL);
    let products = response.data;

    // 2. Map and Enrich data
    products = products.map(p => ({
      ...p,
      category: getCategory(p.id, p.name)
    }));

    // 3. Filter
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    if (status === 'low-stock') {
      products = products.filter(p => p.quantity < 15);
    } else if (status === 'in-stock') {
      products = products.filter(p => p.quantity >= 30);
    }

    // 4. Sort
    if (sort) {
      const sortOrder = order === 'desc' ? 'desc' : 'asc';
      products = _.orderBy(products, [sort], [sortOrder]);
    }

    res.json(products);
  } catch (error) {
    console.error('API Server Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products from backend' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
