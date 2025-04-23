const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.get('/', async (req, res) => {
  const { stationId, fuelType, startDate, endDate, page = 1, limit = 10 } = req.query;
  let query = {};

  if (stationId) query.stationId = stationId;
  if (fuelType) query.fuelType = fuelType;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  try {
    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Transaction.countDocuments(query);
    res.json({
      transactions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const taxByStation = transactions.reduce((acc, t) => {
      acc[t.stationId] = (acc[t.stationId] || 0) + t.taxAmount;
      return acc;
    }, {});

    const taxOverTime = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const tax = transactions
        .filter(t => {
          const tDate = new Date(t.timestamp);
          return tDate.toDateString() === date.toDateString();
        })
        .reduce((sum, t) => sum + t.taxAmount, 0);
      taxOverTime.push({ date: date.toISOString().split('T')[0], tax });
    }

    res.json({ taxByStation, taxOverTime });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/suspicious', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const stations = [...new Set(transactions.map(t => t.stationId))];
    const suspicious = [];

    for (const station of stations) {
      const stationTransactions = transactions.filter(t => t.stationId === station);
      const recentTransactions = stationTransactions.filter(t => {
        const date = new Date(t.timestamp);
        const now = new Date();
        return now - date < 7 * 24 * 60 * 60 * 1000;
      });
      const previousTransactions = stationTransactions.filter(t => {
        const date = new Date(t.timestamp);
        const now = new Date();
        return now - date >= 7 * 24 * 60 * 60 * 1000 && now - date < 14 * 24 * 60 * 60 * 1000;
      });

      const recentTax = recentTransactions.reduce((sum, t) => sum + t.taxAmount, 0);
      const previousTax = previousTransactions.reduce((sum, t) => sum + t.taxAmount, 0);

      if (previousTax > 0 && recentTax < previousTax * 0.5) {
        suspicious.push({ stationId: station, recentTax, previousTax });
      }
    }

    res.json(suspicious);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;