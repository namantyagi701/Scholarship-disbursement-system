import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, GraduationCap, Mail, ArrowLeft } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState('Login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP verification state
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const otpRefs = useRef([]);

  const handleOtpInput = (e, index) => {
    if (e.target.value.length > 0 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text');
    paste.split('').forEach((char, index) => {
      if (otpRefs.current[index]) {
        otpRefs.current[index].value = char;
      }
    });
  };

  const sendOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const otp = otpRefs.current.map((el) => el.value).join('');
      if (otp.length !== 6) {
        toast.error('Please enter all 6 digits');
        setOtpLoading(false);
        return;
      }
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp });
      if (data.success) {
        toast.success(data.message);
        getUserData();
        setRedirecting(true);
        setTimeout(() => navigate('/home'), 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    await sendOtp();
    setResendLoading(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          fullName,
          email,
          mobile,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          // Send verification OTP and show OTP screen
          await sendOtp();
          setShowOtpScreen(true);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          setRedirecting(true);
          setTimeout(() => navigate('/home'), 3000);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) return <LoadingScreen message="Welcome! Redirecting..." />;

  // ---------- OTP Verification Screen ----------
  if (showOtpScreen) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-10 tracking-tight select-none">
          <span className="text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            VERIFY
          </span>{' '}
          <span className="italic text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            EMAIL
          </span>
        </h1>

        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* OTP Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/landing')}>
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-blue-600">SSP</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-8">
              We've sent a 6-digit verification code to <span className="font-semibold text-gray-700">{email}</span>
            </p>

            <form onSubmit={verifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Enter verification code</label>
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {Array(6).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      required
                      ref={(el) => (otpRefs.current[index] = el)}
                      onInput={(e) => handleOtpInput(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {otpLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={resendOtp}
                disabled={resendLoading}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
              <button
                onClick={() => { setShowOtpScreen(false); setState('Login'); }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </div>
          </div>

          {/* Decorative Right Panel */}
          <div className="hidden md:block w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-pink-400 to-orange-300 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-300/30 rounded-full blur-2xl" />
            <div className="absolute top-10 right-10 w-36 h-36 bg-indigo-400/30 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white p-8">
                <Mail className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-2xl font-bold mb-2">Almost There!</h3>
                <p className="text-white/80 text-sm">Verify your email to complete registration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Login / Sign Up Screen ----------
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-10 tracking-tight select-none">
        <span className="text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
          {state === 'Sign Up' ? 'SIGN UP' : 'LOGIN'}
        </span>{' '}
        <span className="italic text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
          PAGE
        </span>
      </h1>

      {/* Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/landing')}>
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-blue-600">SSP</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            {state === 'Sign Up' ? 'Create Account' : 'Hey,'}
          </h2>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {state === 'Sign Up' ? '' : 'Welcome Back!'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {state === 'Sign Up'
              ? 'Register as a student to get started'
              : 'We are very happy to see you back!'}
          </p>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            {state === 'Sign Up' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
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

            {state === 'Login' && (
              <p
                onClick={() => navigate('/reset-password')}
                className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
              >
                Forgot password?
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : state === 'Sign Up' ? 'Create Account' : 'Login'}
            </button>
          </form>

          <p className="text-gray-500 text-center text-sm mt-6">
            {state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setState('Login')}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have account?{' '}
                <span
                  onClick={() => setState('Sign Up')}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Sign Up here!
                </span>
              </>
            )}
          </p>
        </div>

        {/* Decorative Right Panel */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-pink-400 to-orange-300 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-300/30 rounded-full blur-2xl" />
          <div className="absolute top-10 right-10 w-36 h-36 bg-indigo-400/30 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-2">Student Portal</h3>
              <p className="text-white/80 text-sm">Apply and track your PMSSS scholarship application</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
