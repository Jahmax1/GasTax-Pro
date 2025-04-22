const express = require('express');
const Station = require('../models/Station');
const router = express.Router();

// Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a station
router.post('/', async (req, res) => {
  const station = new Station({
    stationId: req.body.stationId,
    name: req.body.name,
    location: req.body.location,
    complianceScore: req.body.complianceScore || 0,
  });

  try {
    const newStation = await station.save();
    res.status(201).json(newStation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:stationId', async (req, res) => {
    try {
      const station = await Station.findOne({ stationId: req.params.stationId });
      if (!station) return res.status(404).json({ message: 'Station not found' });
      res.json(station);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;