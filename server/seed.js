require("dotenv").config();
const mongoose = require("mongoose");
const Station = require("./models/Station");
const Transaction = require("./models/Transaction");
const Receipt = require("./models/Receipt");

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Clear existing data
      await Station.deleteMany({});
      await Transaction.deleteMany({});
      await Receipt.deleteMany({});
      console.log("Cleared existing data");

      // Seed stations
      const stations = [
        { stationId: "station-1", name: "City Fuel", location: "Downtown", complianceScore: 80 },
        { stationId: "station-2", name: "Highway Stop", location: "Suburbs", complianceScore: 90 },
      ];
      await Station.insertMany(stations);
      console.log("Seeded stations");

      // Seed transactions
      const transactions = [
        {
          stationId: "station-1",
          fuelType: "petrol",
          volume: 50,
          taxAmount: 10,
          receiptId: "receipt-1",
        },
        {
          stationId: "station-2",
          fuelType: "diesel",
          volume: 75,
          taxAmount: 15,
          receiptId: "receipt-2",
        },
      ];
      const savedTransactions = await Transaction.insertMany(transactions);
      console.log("Seeded transactions");

      // Seed receipts
      const receipts = [
        {
          receiptId: "receipt-1",
          transactionId: savedTransactions[0]._id,
          consumerId: "consumer-1",
          taxDetails: { vat: 5, excise: 5 },
        },
        {
          receiptId: "receipt-2",
          transactionId: savedTransactions[1]._id,
          consumerId: "consumer-2",
          taxDetails: { vat: 7.5, excise: 7.5 },
        },
      ];
      await Receipt.insertMany(receipts);
      console.log("Seeded receipts");

      console.log("Database seeded successfully");
    } catch (err) {
      console.error("Seeding error:", err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
