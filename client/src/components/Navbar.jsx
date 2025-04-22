import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">GasTax Pro</h1>
        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-green-400' : 'hover:text-green-400'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/station"
            className={({ isActive }) =>
              isActive ? 'text-green-400' : 'hover:text-green-400'
            }
          >
            Station Portal
          </NavLink>
          <NavLink
            to="/consumer"
            className={({ isActive }) =>
              isActive ? 'text-green-400' : 'hover:text-green-400'
            }
          >
            Consumer
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;