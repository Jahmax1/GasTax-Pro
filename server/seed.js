require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Station = require('./models/Station');
const Transaction = require('./models/Transaction');
const Receipt = require('./models/Receipt');
const User = require('./models/User');
const Report = require('./models/Report');
const Advertisement = require('./models/Advertisement');

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    await Station.deleteMany({});
    await Transaction.deleteMany({});
    await Receipt.deleteMany({});
    await User.deleteMany({});
    await Report.deleteMany({});
    await Advertisement.deleteMany({});

    const stations = [
      { stationId: 'station-1', name: 'City Fuel', location: 'Downtown', complianceScore: 80 },
      { stationId: 'station-2', name: 'Highway Stop', location: 'Suburbs', complianceScore: 90 },
    ];
    await Station.insertMany(stations);

    const transactions = [];
    for (let i = 1; i <= 100; i++) {
      transactions.push({
        stationId: `station-${(i % 2) + 1}`,
        fuelType: ['petrol', 'diesel', 'cng'][i % 3],
        volume: Number((Math.random() * 100).toFixed(2)),
        taxAmount: Number((Math.random() * 20).toFixed(2)),
        receiptId: `receipt-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
    const savedTransactions = await Transaction.insertMany(transactions);

    const receipts = savedTransactions.map((t, i) => ({
      receiptId: `receipt-${i + 1}`,
      transactionId: t._id,
      consumerId: `consumer-${i % 2 === 0 ? 1 : 2}`,
      taxDetails: { vat: t.taxAmount / 2, excise: t.taxAmount / 2 },
    }));
    await Receipt.insertMany(receipts);

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
    const savedUsers = await User.insertMany(users);

    const reports = [
      {
        customerId: savedUsers[0]._id.toString(),
        stationId: 'station-1',
        description: 'Suspected underreporting of sales.',
        receiptId: 'receipt-1',
      },
    ];
    await Report.insertMany(reports);

    const ads = [
      {
        stationId: 'station-1',
        title: 'Special Offer!',
        description: 'Get petrol at $1.20/L this week!',
        price: 1.2,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        stationId: 'station-2',
        title: 'New Service',
        description: 'Free car wash with every fill-up!',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
    await Advertisement.insertMany(ads);

    console.log('Database seeded');
    mongoose.connection.close();
  })
  .catch((err) => console.error('Error:', err));