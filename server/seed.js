require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');

const categories = ['Electronics', 'Accessories', 'Audio', 'Home Office', 'Gifts', 'Wearables'];
const prefixes = ['Pro', 'Ultra', 'Smart', 'Wireless', 'Mini', 'Eco', 'Super', 'Hyper'];
const nouns = ['Mouse', 'Keyboard', 'Monitor', 'Headphones', 'Laptop', 'Speaker', 'Watch', 'Charger', 'Hub', 'Light'];

const generateProducts = (count) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    products.push({
      name: `${prefix} ${noun} ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      quantity: Math.floor(Math.random() * 150),
      price: Math.floor(Math.random() * 950) + 50
    });
  }
  return products;
};

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    const products = generateProducts(500);
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log(`Inserting ${products.length} products...`);
    // Using insertMany for batch insertion as suggested
    await Product.insertMany(products);
    
    console.log('Successfully seeded 500 documents!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
