import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [stationId, setStationId] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';
      const payload = isLogin
        ? { email, password }
        : { email, password, role, stationId: role === 'gasStation' ? stationId : undefined };
      const res = await axios.post(url, payload);
      login(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-6 rounded-lg card-hover max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block mb-1 text-gray-200">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
                >
                  <option value="customer">Customer</option>
                  <option value="gasStation">Gas Station</option>
                  <option value="revenueAuthority">Revenue Authority</option>
                </select>
              </div>
              {role === 'gasStation' && (
                <div>
                  <label className="block mb-1 text-gray-200">Station ID</label>
                  <input
                    type="text"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    placeholder="e.g., station-1"
                    className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
              )}
            </>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded transition-colors text-white"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-200">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-400 hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;