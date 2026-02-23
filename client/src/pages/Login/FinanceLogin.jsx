import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

const FinanceLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/login', {
        email,
        password,
      });

      if (data.success) {
        if (data.role !== 'finance') {
          toast.error('Access denied. This portal is for Finance Bureau only.');
          await axios.post(backendUrl + '/api/auth/logout');
          return;
        }
        setIsLoggedin(true);
        getUserData();
        setRedirecting(true);
        setTimeout(() => navigate('/finance/approved'), 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) return <LoadingScreen message="Welcome! Redirecting..." />;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-10 tracking-tight select-none">
        <span className="text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
          FINANCE
        </span>{' '}
        <span className="italic text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
          LOGIN
        </span>
      </h1>

      {/* Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/landing')}>
            <Building2 className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-emerald-600">SSP</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Hey,</h2>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Sign in to the Finance Bureau portal
          </p>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="finance@example.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p
              onClick={() => navigate('/reset-password')}
              className="text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium"
            >
              Forgot password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>

          <p className="text-gray-400 text-center text-xs mt-6">
            Finance Bureau accounts are provisioned by the administrator.
          </p>
        </div>

        {/* Decorative Right Panel */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-300 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-300/30 rounded-full blur-2xl" />
          <div className="absolute top-10 right-10 w-36 h-36 bg-emerald-400/30 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <Building2 className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-2">Finance Bureau</h3>
              <p className="text-white/80 text-sm">Verify bank details and process scholarship disbursements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLogin;
