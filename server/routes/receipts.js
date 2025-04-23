const express = require('express');
const Receipt = require('../models/Receipt');
const router = express.Router();

router.get('/:receiptId', async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ receiptId: req.params.receiptId });
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/consumer/:consumerId', async (req, res) => {
  try {
    const receipts = await Receipt.find({ consumerId: req.params.consumerId })
      .populate('transactionId');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;