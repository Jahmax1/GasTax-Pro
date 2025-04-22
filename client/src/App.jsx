import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StationPortal from './pages/StationPortal.jsx';
import ConsumerPage from './pages/ConsumerPage.jsx';
import TaxImpact from './pages/TaxImpact.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {user && (
        <Navbar>
          <button
            onClick={logout}
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Logout
          </button>
        </Navbar>
      )}
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['revenueAuthority']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/station"
          element={
            <ProtectedRoute allowedRoles={['gasStation']}>
              <StationPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ConsumerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/impact"
          element={
            <ProtectedRoute allowedRoles={['revenueAuthority', 'customer']}>
              <TaxImpact />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}