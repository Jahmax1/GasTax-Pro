import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function StationPortal() {
  const { user } = useContext(AuthContext);
  const [station, setStation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const stationId = user?.stationId || 'station-1'; // Use user's stationId

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

  if (!station) return <div className="container mx-auto p-4 text-center text-gray-200">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-400">{station.name} Portal</h1>
      <div className="bg-gray-800 p-4 rounded-lg mb-6 card-hover">
        <h2 className="text-xl font-semibold mb-2 text-gray-200">
          Compliance Score: <span className="text-green-400">{station.complianceScore}%</span>
        </h2>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${station.complianceScore}%` }}
          ></div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg card-hover">
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
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.fuelType}</td>
                  <td>{t.volume}</td>
                  <td className="text-green-400">${t.taxAmount}</td>
                  <td>{new Date(t.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StationPortal;