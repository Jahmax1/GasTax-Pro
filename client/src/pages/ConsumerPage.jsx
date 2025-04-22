import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function ConsumerPage() {
  const [receiptId, setReceiptId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [volume, setVolume] = useState(50);
  const [fuelType, setFuelType] = useState('petrol');

  const handleVerify = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/receipts/${receiptId}`);
      setReceipt(res.data || null);
    } catch (err) {
      console.error('Error fetching receipt:', err);
      alert('Receipt not found');
      setReceipt(null);
    }
  };

  const calculateTax = () => {
    const vat = volume * 0.1; // 10% VAT
    const excise = volume * 0.15; // 15% excise
    return (vat + excise).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Consumer Interface
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Verify Receipt</h2>
          <input
            type="text"
            value={receiptId}
            onChange={(e) => setReceiptId(e.target.value)}
            placeholder="Enter Receipt ID (e.g., receipt-1)"
            className="w-full p-2 bg-gray-700 rounded mb-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600"
          />
          <button
            onClick={handleVerify}
            className="bg-green-600 hover:bg-green-700 p-2 rounded w-full transition-colors text-white"
          >
            Verify
          </button>
          {receipt && (
            <motion.div
              className="mt-4 p-4 bg-gray-700 rounded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-200">Transaction ID: {receipt.transactionId}</p>
              <p className="text-green-400">VAT: ${receipt.taxDetails.vat}</p>
              <p className="text-green-400">Excise: ${receipt.taxDetails.excise}</p>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Tax Calculator</h2>
          <div className="mb-4">
            <label className="block mb-1 text-gray-200">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-200">Volume (Liters)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <p className="mt-1 text-gray-200">{volume} L</p>
          </div>
          <p className="text-lg text-gray-200">
            Total Tax: <span className="text-green-400">${calculateTax()}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default ConsumerPage;