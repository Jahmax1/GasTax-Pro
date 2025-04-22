import { useState, useEffect } from 'react';
import axios from 'axios';

function StationPortal() {
  const [station, setStation] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Mock station ID for demo
    const stationId = 'station-1';
    axios
      .get(`http://localhost:5000/api/stations/${stationId}`)
      .then((res) => setStation(res.data))
      .catch((err) => console.error(err));

    axios
      .get('http://localhost:5000/api/transactions')
      .then((res) => setTransactions(res.data.filter((t) => t.stationId === stationId)))
      .catch((err) => console.error(err));
  }, []);

  if (!station) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{station.name} Portal</h1>
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h2 className="text-xl mb-2">Compliance Score: {station.complianceScore}%</h2>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${station.complianceScore}%` }}
          ></div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Recent Sales</h2>
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
                <td>{t.taxAmount}</td>
                <td>{new Date(t.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StationPortal;