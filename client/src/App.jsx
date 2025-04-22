import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StationPortal from './pages/StationPortal.jsx';
import ConsumerPage from './pages/ConsumerPage.jsx';
import TaxImpact from './pages/TaxImpact.jsx';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/station" element={<StationPortal />} />
        <Route path="/consumer" element={<ConsumerPage />} />
        <Route path="/impact" element={<TaxImpact />} />
      </Routes>
    </div>
  );
}

export default App;