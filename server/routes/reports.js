const express = require('express');
const jwt = require('jsonwebtoken');
const Report = require('../models/Report');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ message: 'Access denied' });

  const { stationId, description, receiptId } = req.body;
  try {
    const report = new Report({
      customerId: req.user.id,
      stationId,
      description,
      receiptId,
      status: 'pending',
    });
    await report.save();
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'revenueAuthority') return res.status(403).json({ message: 'Access denied' });

  const { page = 1, limit = 10 } = req.query;

  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Report.countDocuments();
    res.json({
      reports,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'revenueAuthority') return res.status(403).json({ message: 'Access denied' });

  const { status } = req.body;
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;