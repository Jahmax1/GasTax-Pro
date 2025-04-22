import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StationPortal from './pages/StationPortal';
import ConsumerPage from './pages/ConsumerPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/station" element={<StationPortal />} />
        <Route path="/consumer" element={<ConsumerPage />} />
      </Routes>
    </div>
  );
}

export default App;