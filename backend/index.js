const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

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

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

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
