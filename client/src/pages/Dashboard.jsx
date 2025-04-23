import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import io from 'socket.io-client';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stations, setStations] = useState([]);
  const [taxAnalytics, setTaxAnalytics] = useState({ taxByStation: {}, taxOverTime: [] });
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [reports, setReports] = useState([]);
  const [transactionPage, setTransactionPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [transactionMeta, setTransactionMeta] = useState({ total: 0, pages: 1 });
  const [reportMeta, setReportMeta] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, statRes, analyticsRes, suspiciousRes, reportsRes] = await Promise.all([
          axios.get(`/transactions?page=${transactionPage}`),
          axios.get('/stations'),
          axios.get('/transactions/analytics'),
          axios.get('/transactions/suspicious'),
          axios.get(`/reports?page=${reportPage}`),
        ]);
        setTransactions(transRes.data.transactions || []);
        setTransactionMeta({
          total: transRes.data.total,
          pages: transRes.data.pages,
        });
        setStations(statRes.data || []);
        setTaxAnalytics(analyticsRes.data);
        setSuspiciousActivity(suspiciousRes.data);
        setReports(reportsRes.data.reports || []);
        setReportMeta({
          total: reportsRes.data.total,
          pages: reportsRes.data.pages,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setTransactions([]);
        setStations([]);
        setTaxAnalytics({ taxByStation: {}, taxOverTime: [] });
        setSuspiciousActivity([]);
        setReports([]);
      }
    };

    fetchData();

    socket.on('newTransaction', (transaction) => {
      setTransactions((prev) => [transaction, ...prev].slice(0, 100));
    });

    return () => socket.off('newTransaction');
  }, [transactionPage, reportPage]);

  const chartDataRevenue = {
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

  const chartDataTaxByStation = {
    labels: Object.keys(taxAnalytics.taxByStation),
    datasets: [
      {
        label: 'Tax Collected ($)',
        data: Object.values(taxAnalytics.taxByStation),
        backgroundColor: 'rgba(74, 222, 128, 0.6)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 1,
      },
    ],
  };

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

  const totalRevenue = transactions.reduce((sum, t) => sum + t.taxAmount, 0).toFixed(2);

  const handleUpdateReportStatus = async (reportId, status) => {
    try {
      const res = await axios.patch(`/reports/${reportId}`, { status });
      setReports((prev) =>
        prev.map((report) => (report._id === reportId ? res.data : report))
      );
    } catch (err) {
      alert('Error updating report status');
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Revenue by Station</h2>
          <Bar
            data={chartDataRevenue}
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
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setTransactionPage((prev) => Math.max(prev - 1, 1))}
              disabled={transactionPage === 1}
              className="bg-green-600 hover:bg-green-700 p-2 rounded text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-200">
              Page {transactionPage} of {transactionMeta.pages}
            </span>
            <button
              onClick={() => setTransactionPage((prev) => Math.min(prev + 1, transactionMeta.pages))}
              disabled={transactionPage === transactionMeta.pages}
              className="bg-green-600 hover:bg-green-700 p-2 rounded text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Tax Collected by Station</h2>
        <Bar
          data={chartDataTaxByStation}
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
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Tax Collected Over Time (Last 30 Days)</h2>
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
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Suspicious Activity Alerts</h2>
        {suspiciousActivity.length > 0 ? (
          <ul className="space-y-2">
            {suspiciousActivity.map((activity, index) => (
              <motion.li
                key={index}
                className="bg-red-900 p-2 rounded flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span>
                  {activity.stationId}: Recent tax (${activity.recentTax.toFixed(2)}) is less than 50% of previous week (${activity.previousTax.toFixed(2)})
                </span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-200">No suspicious activity detected.</p>
        )}
      </motion.div>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg card-hover card-glow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Customer Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Station ID</th>
                <th>Description</th>
                <th>Receipt ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <motion.tr
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td>{report.customerId}</td>
                  <td>{report.stationId}</td>
                  <td>{report.description}</td>
                  <td>{report.receiptId || 'N/A'}</td>
                  <td>{report.status}</td>
                  <td>
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateReportStatus(report._id, 'reviewed')}
                          className="bg-green-600 hover:bg-green-700 p-1 rounded mr-2 text-white"
                        >
                          Mark as Reviewed
                        </button>
                        <button
                          onClick={() => handleUpdateReportStatus(report._id, 'resolved')}
                          className="bg-blue-600 hover:bg-blue-700 p-1 rounded text-white"
                        >
                          Mark as Resolved
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setReportPage((prev) => Math.max(prev - 1, 1))}
            disabled={reportPage === 1}
            className="bg-green-600 hover:bg-green-700 p-2 rounded text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-200">
            Page {reportPage} of {reportMeta.pages}
          </span>
          <button
            onClick={() => setReportPage((prev) => Math.min(prev + 1, reportMeta.pages))}
            disabled={reportPage === reportMeta.pages}
            className="bg-green-600 hover:bg-green-700 p-2 rounded text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;