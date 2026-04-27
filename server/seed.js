require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const dbPath = path.join(__dirname, '../db.json');
const rawData = fs.readFileSync(dbPath);
const { products } = JSON.parse(rawData);

const CATEGORIES = ['Electronics', 'Accessories', 'Audio', 'Office'];
const getCategory = (id, name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('laptop') || lowerName.includes('monitor') || lowerName.includes('smartphone')) return 'Electronics';
  if (lowerName.includes('headphones') || lowerName.includes('speaker')) return 'Audio';
  if (lowerName.includes('keyboard') || lowerName.includes('mouse')) return 'Accessories';
  return CATEGORIES[id % CATEGORIES.length];
};

const seed = async () => {
  try {
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
