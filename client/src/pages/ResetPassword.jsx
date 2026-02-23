import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, GraduationCap, Mail, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpValue = otpRefs.current.map((el) => el.value).join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    setOtp(otpValue);
    setStep(3);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        // Clear OTP inputs
        otpRefs.current.forEach((ref) => {
          if (ref) ref.value = '';
        });
        otpRefs.current[0]?.focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => navigate('/student'), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Step 1: Email Input ----------
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-10 tracking-tight select-none">
          <span className="text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            RESET
          </span>{' '}
          <span className="italic text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            PASSWORD
          </span>
        </h1>

        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/landing')}>
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-blue-600">SSP</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">
              No worries! Enter your registered email and we'll send you a verification code to reset your password.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-medium cursor-pointer mt-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </div>

          <div className="hidden md:block w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white p-8">
                <Lock className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-2xl font-bold mb-2">Secure Reset</h3>
                <p className="text-white/80 text-sm">Your account security is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Step 2: OTP Verification ----------
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-10 tracking-tight select-none">
          <span className="text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            VERIFY
          </span>{' '}
          <span className="italic text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            OTP
          </span>
        </h1>

        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/landing')}>
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-blue-600">SSP</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">
              We've sent a 6-digit verification code to <span className="font-semibold text-gray-700">{email}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Verify Code
              </button>
            </form>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Code'}
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Change Email
              </button>
            </div>
          </div>

          <div className="hidden md:block w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-pink-400 to-orange-300 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white p-8">
                <Mail className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-2xl font-bold mb-2">Check Your Inbox</h3>
                <p className="text-white/80 text-sm">Enter the code we sent to verify your identity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Step 3: New Password ----------
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-10 tracking-tight select-none">
        <span className="text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
          NEW
        </span>{' '}
        <span className="italic text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
          PASSWORD
        </span>
      </h1>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/landing')}>
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-blue-600">SSP</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            Choose a strong password to secure your account
          </p>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-2">Almost Done!</h3>
              <p className="text-white/80 text-sm">Create a strong password to protect your account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
