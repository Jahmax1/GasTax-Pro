import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
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

const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transRes = await axios.get('http://localhost:5000/api/transactions');
        const statRes = await axios.get('http://localhost:5000/api/stations');
        setTransactions(transRes.data || []);
        setStations(statRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setTransactions([]);
        setStations([]);
      }
    };

    fetchData();

    socket.on('newTransaction', (transaction) => {
      setTransactions((prev) => [transaction, ...prev].slice(0, 100));
    });

    return () => socket.off('newTransaction');
  }, []);

  const chartData = {
    labels: stations.map((s) => s.name),
    datasets: [
      {
        label: 'Revenue ($)',
        data: stations.map((s) =>
          transactions
            .filter((t) => t.stationId === s.stationId)
            .reduce((sum, t) => sum + t.taxAmount, 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + t.taxAmount, 0).toFixed(2);

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Revenue Authority Dashboard
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Total Revenue</h2>
          <p className="text-2xl text-green-400">${totalRevenue}</p>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Stations Monitored</h2>
          <p className="text-2xl text-green-400">{stations.length}</p>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Transactions</h2>
          <p className="text-2xl text-green-400">{transactions.length}</p>
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Revenue by Station</h2>
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
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Live Transactions</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map((t, index) => (
              <motion.li
                key={index}
                className="bg-gray-700 p-2 rounded flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span>
                  {t.stationId} sold {t.volume}L of {t.fuelType}
                </span>
                <motion.span
                  className="text-green-400"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ${t.taxAmount}
                </motion.span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;