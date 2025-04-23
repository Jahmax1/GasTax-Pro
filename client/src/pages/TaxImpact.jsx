import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function TaxImpact() {
  const [taxAnalytics, setTaxAnalytics] = useState({ taxOverTime: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/transactions/analytics');
        setTaxAnalytics(res.data);
      } catch (err) {
        console.error('Error fetching tax analytics:', err);
        setTaxAnalytics({ taxOverTime: [] });
      }
    };

    fetchData();
  }, []);

  const chartDataTaxOverTime = {
    labels: taxAnalytics.taxOverTime.map((d) => d.date),
    datasets: [
      {
        label: 'Tax Collected ($)',
        data: taxAnalytics.taxOverTime.map((d) => d.tax),
        borderColor: 'rgba(74, 222, 128, 1)',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        fill: true,
      },
    ],
  };

  const totalTax = taxAnalytics.taxOverTime.reduce((sum, d) => sum + d.tax, 0).toFixed(2);

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tax Impact Analysis
      </motion.h1>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Total Tax Collected (Last 30 Days)</h2>
        <p className="text-2xl text-green-400">${totalTax}</p>
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Tax Collected Over Time</h2>
        <Line
          data={chartDataTaxOverTime}
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
  );
}

export default TaxImpact;