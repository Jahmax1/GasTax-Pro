require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Station = require('./models/Station');
const Transaction = require('./models/Transaction');
const Receipt = require('./models/Receipt');
const User = require('./models/User');

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await Station.deleteMany({});
    await Transaction.deleteMany({});
    await Receipt.deleteMany({});
    await User.deleteMany({});

    // Seed stations
    const stations = [
      { stationId: 'station-1', name: 'City Fuel', location: 'Downtown', complianceScore: 80 },
      { stationId: 'station-2', name: 'Highway Stop', location: 'Suburbs', complianceScore: 90 },
    ];
    await Station.insertMany(stations);

    // Seed transactions
    const transactions = [
      {
        stationId: 'station-1',
        fuelType: 'petrol',
        volume: 50,
        taxAmount: 10,
        receiptId: 'receipt-1',
      },
      {
        stationId: 'station-2',
        fuelType: 'diesel',
        volume: 75,
        taxAmount: 15,
        receiptId: 'receipt-2',
      },
    ];
    const savedTransactions = await Transaction.insertMany(transactions);

    // Seed receipts
    const receipts = [
      {
        receiptId: 'receipt-1',
        transactionId: savedTransactions[0]._id,
        consumerId: 'consumer-1',
        taxDetails: { vat: 5, excise: 5 },
      },
      {
        receiptId: 'receipt-2',
        transactionId: savedTransactions[1]._id,
        consumerId: 'consumer-2',
        taxDetails: { vat: 7.5, excise: 7.5 },
      },
    ];
    await Receipt.insertMany(receipts);

    // Seed users
    const users = [
      {
        email: 'customer@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'customer',
      },
      {
        email: 'station1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'gasStation',
        stationId: 'station-1',
      },
      {
        email: 'authority@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'revenueAuthority',
      },
    ];
    await User.insertMany(users);

    console.log('Database seeded');
    mongoose.connection.close();
  })
  .catch((err) => console.error('Error:', err));