import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-400">GasTax Pro</h1>
        <div className="space-x-6 flex items-center">
          {user?.role === 'revenueAuthority' && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-green-400 font-semibold border-b-2 border-green-400'
                    : 'text-gray-300 hover:text-green-400 transition-colors'
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/impact"
                className={({ isActive }) =>
                  isActive
                    ? 'text-green-400 font-semibold border-b-2 border-green-400'
                    : 'text-gray-300 hover:text-green-400 transition-colors'
                }
              >
                Tax Impact
              </NavLink>
            </>
          )}
          {user?.role === 'gasStation' && (
            <NavLink
              to="/station"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-400 font-semibold border-b-2 border-green-400'
                  : 'text-gray-300 hover:text-green-400 transition-colors'
              }
            >
              Station Portal
            </NavLink>
          )}
          {user?.role === 'customer' && (
            <>
              <NavLink
                to="/consumer"
                className={({ isActive }) =>
                  isActive
                    ? 'text-green-400 font-semibold border-b-2 border-green-400'
                    : 'text-gray-300 hover:text-green-400 transition-colors'
                }
              >
                Consumer
              </NavLink>
              <NavLink
                to="/impact"
                className={({ isActive }) =>
                  isActive
                    ? 'text-green-400 font-semibold border-b-2 border-green-400'
                    : 'text-gray-300 hover:text-green-400 transition-colors'
                }
              >
                Tax Impact
              </NavLink>
            </>
          )}
          {children}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;