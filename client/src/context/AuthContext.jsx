import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        } else {
          setUser(decoded);
          if (decoded.role === 'customer') navigate('/consumer');
          if (decoded.role === 'gasStation') navigate('/station');
          if (decoded.role === 'revenueAuthority') navigate('/');
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
      }
    }
  }, [navigate]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    if (decoded.role === 'customer') navigate('/consumer');
    if (decoded.role === 'gasStation') navigate('/station');
    if (decoded.role === 'revenueAuthority') navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};