const express = require('express');
const Advertisement = require('../models/Advertisement');
const router = express.Router();
const jwt = require('jsonwebtoken');

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
  if (req.user.role !== 'gasStation') return res.status(403).json({ message: 'Access denied' });

  const { stationId, title, description, price, expiresAt } = req.body;
  if (req.user.stationId !== stationId) return res.status(403).json({ message: 'Unauthorized station' });

  try {
    const ad = new Advertisement({ stationId, title, description, price, expiresAt });
    await ad.save();
    res.status(201).json({ message: 'Advertisement created successfully' });
  } catch (err) {
    console.error('Error saving ad:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const ads = await Advertisement.find({ expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/station/:stationId', async (req, res) => {
  try {
    const ads = await Advertisement.find({ stationId: req.params.stationId }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.error('Error fetching ads by station:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;