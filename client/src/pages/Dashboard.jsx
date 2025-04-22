import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
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

const socket = io('http://localhost:5000');

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, statRes] = await Promise.all([
          axios.get('http://localhost:5000/api/transactions'),
          axios.get('http://localhost:5000/api/stations'),
        ]);
        setTransactions(transRes.data);
        setStations(statRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
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
      <h1 className="text-3xl font-bold mb-6 text-green-400">Revenue Authority Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg card-hover">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-2xl text-green-400">${totalRevenue}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg card-hover">
          <h2 className="text-xl font-semibold mb-2">Stations Monitored</h2>
          <p className="text-2xl text-green-400">{stations.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg card-hover">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <p className="text-2xl text-green-400">{transactions.length}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg card-hover">
          <h2 className="text-xl font-semibold mb-2">Revenue by Station</h2>
          <Bar
            data={chartData}
            options={{
              plugins: {
                legend: { labels: { color: 'white' } },
                tooltip: { backgroundColor: '#1f2937', titleColor: 'white', bodyColor: 'white' },
              },
              scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } },
              },
            }}
          />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg card-hover">
          <h2 className="text-xl font-semibold mb-2">Live Transactions</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map((t, index) => (
              <li
                key={index}
                className="bg-gray-700 p-2 rounded flex justify-between items-center"
              >
                <span>
                  {t.stationId} sold {t.volume}L of {t.fuelType}
                </span>
                <span className="text-green-400">${t.taxAmount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;