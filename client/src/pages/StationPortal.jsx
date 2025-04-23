import { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StationPortal() {
  const { user } = useContext(AuthContext);
  const [station, setStation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, transactionsRes, adsRes] = await Promise.all([
          axios.get(`/stations/${user.stationId}`),
          axios.get(`/transactions?stationId=${user.stationId}&page=${page}`),
          axios.get(`/advertisements/station/${user.stationId}`),
        ]);
        setStation(stationRes.data);
        setTransactions(transactionsRes.data.transactions || []);
        setMeta({
          total: transactionsRes.data.total,
          pages: transactionsRes.data.pages,
        });
        setAds(adsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [user.stationId, page]);

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/advertisements', {
        stationId: user.stationId,
        title,
        description,
        price: price ? Number(price) : undefined,
        expiresAt: new Date(expiresAt),
      });
      alert('Advertisement created successfully');
      setTitle('');
      setDescription('');
      setPrice('');
      setExpiresAt('');
      const res = await axios.get(`/advertisements/station/${user.stationId}`);
      setAds(res.data || []);
    } catch (err) {
      alert(`Error creating ad: ${err.response?.data?.message || err.message}`);
    }
  };

  const chartData = {
    labels: ['Petrol', 'Diesel', 'CNG'],
    datasets: [
      {
        label: 'Volume Sold (L)',
        data: [
          transactions
            .filter((t) => t.fuelType === 'petrol')
            .reduce((sum, t) => sum + t.volume, 0),
          transactions
            .filter((t) => t.fuelType === 'diesel')
            .reduce((sum, t) => sum + t.volume, 0),
          transactions
            .filter((t) => t.fuelType === 'cng')
            .reduce((sum, t) => sum + t.volume, 0),
        ],
        backgroundColor: 'rgba(74, 222, 128, 0.6)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gas Station Portal - {station?.name || user.stationId}
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Station Details</h2>
          {station ? (
            <>
              <p className="text-gray-200">Name: {station.name}</p>
              <p className="text-gray-200">Location: {station.location}</p>
              <p className="text-gray-200">Compliance Score: {station.complianceScore}</p>
              <p className="text-gray-200">
                Total Tax Collected: $
                {transactions.reduce((sum, t) => sum + t.taxAmount, 0).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-gray-200">Loading station details...</p>
          )}
        </motion.div>
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Fuel Sales</h2>
          <Bar
            data={chartData}
            options={{
              plugins: {
                legend: { labels: { color: 'white' } },
                tooltip: { backgroundColor: '#1f2937', titleColor: 'white', bodyColor: 'white' },
              },
              scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
              },
            }}
          />
        </motion.div>
      </div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
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
                  <td>{t.fuelType}</td>
                  <td>{t.volume}</td>
                  <td className="text-green-400">${t.taxAmount}</td>
                  <td>{new Date(t.timestamp).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-green-600 hover:bg-green-700 p-2 rounded text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-200">
            Page {page} of {meta.pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, meta.pages))}
            disabled={page === meta.pages}
            className="bg-green-600 hover:bg-green-700 p-2 rounded text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Create Advertisement</h2>
        <form onSubmit={handleAdSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-200">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Price per Liter (Optional)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Expires At</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded transition-colors text-white"
          >
            Create Ad
          </button>
        </form>
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Your Advertisements</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {ads.map((ad, index) => (
            <motion.div
              key={ad._id}
              className="bg-gray-700 p-3 rounded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-green-400">{ad.title}</h3>
              <p className="text-gray-200">{ad.description}</p>
              {ad.price && <p className="text-green-400">Price: ${ad.price}/L</p>}
              <p className="text-gray-400 text-sm">
                Expires: {new Date(ad.expiresAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default StationPortal;