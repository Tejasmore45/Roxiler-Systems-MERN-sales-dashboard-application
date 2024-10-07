const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Utility function to handle date range queries
const getDateRange = (month, year = '2021') => {
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(`${year}-${month}-31`);
  return { startDate, endDate };
};

// Fetch and seed the database
router.get('/seed', async (req, res) => {
  try {
    const { data: transactions } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(transactions);
    res.status(201).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error.message);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// List all transactions with search and pagination
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  try {
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    };

    // Check if the search term can be interpreted as a number (for price search)
    const searchAsNumber = Number(search);
    if (!isNaN(searchAsNumber)) {
      query.$or.push({ price: searchAsNumber });
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const totalTransactions = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTransactions / perPage),
      totalTransactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get statistics for a selected month
router.get('/statistics', async (req, res) => {
  const { month, year } = req.query;
  const { startDate, endDate } = getDateRange(month, year);

  try {
    const [totalSales, totalSoldItems, totalNotSoldItems] = await Promise.all([
      Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: true }),
      Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false })
    ]);

    res.json({
      totalSales: totalSales.length ? totalSales[0].total : 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get data for bar chart based on price ranges
router.get('/bar-chart', async (req, res) => {
  const { month, year } = req.query;
  const { startDate, endDate } = getDateRange(month, year);

  try {
    const barChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error.message);
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
});

// Get data for pie chart by category
router.get('/pie-chart', async (req, res) => {
  const { month, year } = req.query;
  const { startDate, endDate } = getDateRange(month, year);

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      {
        $group: { _id: "$category", count: { $sum: 1 } }
      }
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error.message);
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
});

// Get combined data from statistics, bar chart, and pie chart
router.get('/combined', async (req, res) => {
  const { month, year } = req.query;
  const { startDate, endDate } = getDateRange(month, year);

  try {
    const [totalSales, totalSoldItems, totalNotSoldItems, barChartData, pieChartData] = await Promise.all([
      Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: true }),
      Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false }),
      Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
            default: "Other",
            output: { count: { $sum: 1 } }
          }
        }
      ]),
      Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      totalSales: totalSales.length ? totalSales[0].total : 0,
      totalSoldItems,
      totalNotSoldItems,
      barChartData,
      pieChartData
    });
  } catch (error) {
    console.error('Error fetching combined data:', error.message);
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
});

// Get a single transaction by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id.trim());
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;
