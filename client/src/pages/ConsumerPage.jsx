import { useState } from 'react';
import axios from 'axios';

function ConsumerPage() {
  const [receiptId, setReceiptId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [volume, setVolume] = useState(50);
  const [fuelType, setFuelType] = useState('petrol');

  const handleVerify = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/receipts/${receiptId}`);
      setReceipt(res.data);
    } catch (err) {
      alert('Receipt not found');
    }
  };

  const calculateTax = () => {
    const vat = volume * 0.1; // 10% VAT
    const excise = volume * 0.15; // 15% excise
    return (vat + excise).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Consumer Interface</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Verify Receipt</h2>
          <input
            type="text"
            value={receiptId}
            onChange={(e) => setReceiptId(e.target.value)}
            placeholder="Enter Receipt ID"
            className="w-full p-2 bg-gray-700 rounded mb-2"
          />
          <button
            onClick={handleVerify}
            className="bg-green-600 hover:bg-green-700 p-2 rounded"
          >
            Verify
          </button>
          {receipt && (
            <div className="mt-4">
              <p>Transaction ID: {receipt.transactionId}</p>
              <p>VAT: ${receipt.taxDetails.vat}</p>
              <p>Excise: ${receipt.taxDetails.excise}</p>
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Tax Calculator</h2>
          <div className="mb-4">
            <label className="block mb-1">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Volume (Liters)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full"
            />
            <p>{volume} L</p>
          </div>
          <p>Total Tax: ${calculateTax()}</p>
        </div>
      </div>
    </div>
  );
}

export default ConsumerPage;