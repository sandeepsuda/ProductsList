require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const CATEGORIES = ['Electronics', 'Accessories', 'Audio', 'Office'];
const getCategory = (id, name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('laptop') || lowerName.includes('monitor') || lowerName.includes('smartphone')) return 'Electronics';
  if (lowerName.includes('headphones') || lowerName.includes('speaker')) return 'Audio';
  if (lowerName.includes('keyboard') || lowerName.includes('mouse')) return 'Accessories';
  return CATEGORIES[id % CATEGORIES.length];
};

const loadProductsData = () => {
  const dbPath = path.join(__dirname, '../db.json');
  try {
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Seed data file not found at ${dbPath}`);
    }
    const rawData = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(rawData);
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid seed data format: "products" array missing');
    }
    return data.products;
  } catch (error) {
    console.error('Error loading seed data:', error.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    const products = loadProductsData();

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({}); // Clear existing data
    
    const enrichedProducts = products.map(p => ({
      name: p.name,
      quantity: p.quantity,
      price: p.price,
      category: getCategory(p.id, p.name)
    }));

    await Product.insertMany(enrichedProducts);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
