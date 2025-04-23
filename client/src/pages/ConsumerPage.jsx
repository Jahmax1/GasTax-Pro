import { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function ConsumerPage() {
  const { user } = useContext(AuthContext);
  const [receiptId, setReceiptId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [volume, setVolume] = useState(50);
  const [fuelType, setFuelType] = useState('petrol');
  const [reportStationId, setReportStationId] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportReceiptId, setReportReceiptId] = useState('');
  const [ads, setAds] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get('/advertisements');
        setAds(res.data);
      } catch (err) {
        console.error('Error fetching ads:', err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const consumerId = `consumer-${user.id.split('').reverse().join('').slice(0, 1) === '1' ? 1 : 2}`;
        const res = await axios.get(`/receipts/consumer/${consumerId}`);
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchAds();
    fetchTransactions();
  }, [user]);

  const handleVerify = async () => {
    try {
      const res = await axios.get(`/receipts/${receiptId}`);
      setReceipt(res.data || null);
    } catch (err) {
      alert(`Receipt not found: ${err.response?.data?.message || err.message}`);
      setReceipt(null);
    }
  };

  const calculateTax = () => {
    const vat = volume * 0.1;
    const excise = volume * 0.15;
    return (vat + excise).toFixed(2);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/reports', {
        stationId: reportStationId,
        description: reportDescription,
        receiptId: reportReceiptId || undefined,
      });
      alert('Report submitted successfully');
      setReportStationId('');
      setReportDescription('');
      setReportReceiptId('');
    } catch (err) {
      alert(`Error submitting report: ${err.response?.data?.message || err.message}`);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Report Revenue Cheating</h2>
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-200">Station ID</label>
            <input
              type="text"
              value={reportStationId}
              onChange={(e) => setReportStationId(e.target.value)}
              placeholder="e.g., station-1"
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Description</label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describe the issue..."
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Receipt ID (Optional)</label>
            <input
              type="text"
              value={reportReceiptId}
              onChange={(e) => setReportReceiptId(e.target.value)}
              placeholder="e.g., receipt-1"
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded transition-colors text-white"
          >
            Submit Report
          </button>
        </form>
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Your Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Fuel Type</th>
                <th>Volume (L)</th>
                <th>Tax ($)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <motion.tr
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td>{t.receiptId}</td>
                  <td>{t.transactionId.fuelType}</td>
                  <td>{t.transactionId.volume}</td>
                  <td className="text-green-400">${(t.taxDetails.vat + t.taxDetails.excise).toFixed(2)}</td>
                  <td>{new Date(t.transactionId.timestamp).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Promotions & Offers</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {ads.map((ad, index) => (
            <motion.div
              key={ad._id}
              className="bg-gray-700 p-3 rounded flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-green-400">{ad.title}</h3>
              <p className="text-gray-200">{ad.description}</p>
              {ad.price && (
                <p className="text-green-400">Price: ${ad.price}/L</p>
              )}
              <p className="text-gray-400 text-sm">
                From: {ad.stationId} | Expires: {new Date(ad.expiresAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ConsumerPage;