import { useState, useEffect } from 'react';
import axios from 'axios';
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

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Fetch transactions
    axios
      .get('http://localhost:5000/api/transactions')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));

    // Fetch stations
    axios
      .get('http://localhost:5000/api/stations')
      .then((res) => setStations(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Chart data
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
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Revenue Authority Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Revenue by Station</h2>
          <Bar data={chartData} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Recent Transactions</h2>
          <ul className="space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <li key={t._id} className="bg-gray-700 p-2 rounded">
                {t.stationId} sold {t.volume}L of {t.fuelType} for ${t.taxAmount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;