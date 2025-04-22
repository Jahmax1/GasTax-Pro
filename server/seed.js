require('dotenv').config();
const mongoose = require('mongoose');
const Station = require('./models/Station');
const Transaction = require('./models/Transaction');
const Receipt = require('./models/Receipt');

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

    const stations = [
      { stationId: 'station-1', name: 'City Fuel', location: 'Downtown', complianceScore: 80 },
      { stationId: 'station-2', name: 'Highway Stop', location: 'Suburbs', complianceScore: 90 },
    ];
    await Station.insertMany(stations);

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

    console.log('Database seeded');
    mongoose.connection.close();
  })
  .catch((err) => console.error('Error:', err));