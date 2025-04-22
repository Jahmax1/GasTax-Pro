import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function StationPortal() {
  const { user } = useContext(AuthContext);
  const [station, setStation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const stationId = user?.stationId || 'station-1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationRes = await axios.get(`http://localhost:5000/api/stations/${stationId}`);
        const transRes = await axios.get('http://localhost:5000/api/transactions');
        setStation(stationRes.data || null);
        setTransactions(transRes.data.filter((t) => t.stationId === stationId) || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setStation(null);
        setTransactions([]);
      }
    };

    fetchData();
  }, [stationId]);

  const getBadge = (score) => {
    if (score >= 90) return { text: 'Gold', color: 'text-yellow-400' };
    if (score >= 70) return { text: 'Silver', color: 'text-gray-400' };
    return { text: 'Bronze', color: 'text-orange-400' };
  };

  if (!station) return <div className="container mx-auto p-4 text-center text-gray-200">Loading...</div>;

  const badge = getBadge(station.complianceScore);

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {station.name} Portal
      </motion.h1>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg mb-6 card-hover card-glow"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">
          Compliance Score: <span className="text-green-400">{station.complianceScore}%</span>
        </h2>
        <div className="flex items-center space-x-2 mb-2">
          <span className={`text-lg font-bold ${badge.color}`}>{badge.text} Badge</span>
          <motion.span
            className={`inline-block w-6 h-6 rounded-full ${badge.color === 'text-yellow-400' ? 'bg-yellow-400' : badge.color === 'text-gray-400' ? 'bg-gray-400' : 'bg-orange-400'}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <motion.div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${station.complianceScore}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${station.complianceScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Recent Sales</h2>
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
      </motion.div>
    </div>
  );
}

export default StationPortal;