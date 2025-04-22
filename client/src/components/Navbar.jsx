import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-400">GasTax Pro</h1>
        <div className="space-x-6">
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
            to="/station"
            className={({ isActive }) =>
              isActive
                ? 'text-green-400 font-semibold border-b-2 border-green-400'
                : 'text-gray-300 hover:text-green-400 transition-colors'
            }
          >
            Station Portal
          </NavLink>
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;