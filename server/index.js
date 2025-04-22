const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const receiptRoutes = require('./routes/receipts');


const transactionRoutes = require('./routes/transactions');
const stationRoutes = require('./routes/stations');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/receipts', receiptRoutes);

// MongoDB connection (replace with your MongoDB Atlas URI later)
mongoose.connect('mongodb+srv://jahmaxsimba:iiuQ6h6Aj0HVl3OJ@cluster0.lcp64zw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'GasTax Pro API' });
});

// Socket.IO for real-time simulation
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  
    // Simulate transactions every 5 seconds
    const simulateTransaction = () => {
      const mockTransaction = {
        stationId: `station-${Math.floor(Math.random() * 5) + 1}`,
        fuelType: ['petrol', 'diesel', 'cng'][Math.floor(Math.random() * 3)],
        volume: Number((Math.random() * 100).toFixed(2)),
        taxAmount: Number((Math.random() * 20).toFixed(2)),
        receiptId: `receipt-${Date.now()}`,
        timestamp: new Date(),
      };
  
      // Save to MongoDB
      const transaction = new Transaction(mockTransaction);
      transaction.save().catch((err) => console.error('Error saving transaction:', err));
  
      // Emit to clients
      io.emit('newTransaction', mockTransaction);
    };
  
    const interval = setInterval(simulateTransaction, 5000);
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clearInterval(interval);
    });
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));