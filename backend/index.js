const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const Transaction = require('./models/Transaction'); // Import your Transaction model

dotenv.config();

const app = express();
app.use(express.json()); // Built-in JSON parser
app.use(cors()); // Enable CORS for all routes

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not defined in environment variables');
  process.exit(1); // Exit with failure if MONGO_URI is not set
}

// Root route
app.get('/', (req, res) => {
  res.send('MERN Coding Challenge Backend is running');
});

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes);

// Automatic Seeding Function
const seedDatabase = async () => {
  try {
    const transactionCount = await Transaction.countDocuments();
    
    // Seed only if the database is empty
    if (transactionCount === 0) {
      console.log('No transactions found. Seeding database...');
      
      // Fetch data from API
      const { data: transactions } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      
      // Insert transactions into the database
      await Transaction.insertMany(transactions, { ordered: false });
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already contains transactions. Skipping seeding.');
    }
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
};

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Automatically seed the database if it's empty
    await seedDatabase();

    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with failure if DB connection fails
  });

// Centralized error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.stack);
  res.status(statusCode).json({ error: err.message || 'Something went wrong!' });
});

// Graceful shutdown for SIGINT and SIGTERM
const shutdownHandler = async () => {
  await mongoose.connection.close(); // Close MongoDB connection
  console.log('MongoDB connection closed. Exiting...');
  process.exit(0);
};

process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);
