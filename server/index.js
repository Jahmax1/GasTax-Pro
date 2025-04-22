require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const transactionRoutes = require('./routes/transactions');
const stationRoutes = require('./routes/stations');
const receiptRoutes = require('./routes/receipts');
const Transaction = require('./models/Transaction');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

let isMongoConnected = false;

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    isMongoConnected = true;
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    isMongoConnected = false;
  });

app.use('/api/transactions', transactionRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/receipts', receiptRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GasTax Pro API' });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const simulateTransaction = async () => {
    if (!isMongoConnected) {
      console.log('MongoDB not connected, skipping transaction simulation');
      return;
    }

    const mockTransaction = {
      stationId: `station-${Math.floor(Math.random() * 5) + 1}`,
      fuelType: ['petrol', 'diesel', 'cng'][Math.floor(Math.random() * 3)],
      volume: Number((Math.random() * 100).toFixed(2)),
      taxAmount: Number((Math.random() * 20).toFixed(2)),
      receiptId: `receipt-${Date.now()}`,
      timestamp: new Date(),
    };

    try {
      const transaction = new Transaction(mockTransaction);
      await transaction.save();
      io.emit('newTransaction', mockTransaction);
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  const interval = setInterval(simulateTransaction, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));