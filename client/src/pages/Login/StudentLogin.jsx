import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

/* ------------------------------------------------------------------ */
/*  Shared SVG line-art motif — abstract topographic contour lines     */
/* ------------------------------------------------------------------ */
const ContourLines = () => (
  <svg
    className="absolute bottom-0 left-0 w-full"
    style={{ height: '38%' }}
    viewBox="0 0 1440 400"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M0 320 C120 280, 240 340, 360 300 S600 240, 720 280 S960 340, 1080 290 S1320 240, 1440 270" stroke="#B8860B" strokeWidth="0.8" opacity="0.13" />
    <path d="M0 340 C160 310, 280 370, 420 330 S640 270, 780 310 S1000 360, 1140 310 S1340 260, 1440 300" stroke="#B8860B" strokeWidth="0.8" opacity="0.10" />
    <path d="M0 360 C200 340, 320 380, 480 350 S680 300, 840 340 S1040 370, 1200 330 S1380 290, 1440 330" stroke="#B8860B" strokeWidth="0.8" opacity="0.08" />
    <path d="M0 380 C180 360, 360 400, 540 370 S720 320, 900 360 S1080 390, 1260 350 S1400 310, 1440 355" stroke="#B8860B" strokeWidth="0.6" opacity="0.06" />
    <path d="M0 395 C240 385, 400 400, 600 390 S800 370, 1000 390 S1200 400, 1440 390" stroke="#B8860B" strokeWidth="0.5" opacity="0.05" />
  </svg>
);

/* Shared inline styles */
const INK = '#0F1729';
const INK_BTN = '#16213E';
const GOLD = '#B8860B';
const PAPER = '#FFFEFB';
const INK_TEXT = '#1A1F2E';

const inputStyle = {
  width: '100%',
  padding: '10px 0',
  border: 'none',
  borderBottom: '1.5px solid #D1D5DB',
  background: 'transparent',
  fontSize: '14px',
  color: INK_TEXT,
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: '"Outfit", sans-serif',
};

const inputFocusColor = GOLD;

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#6B7280',
  marginBottom: '2px',
  fontFamily: '"Outfit", sans-serif',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const StudentLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState('Login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Client-side validations for Sign Up
    if (state === 'Sign Up') {
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        toast.error('Mobile number must be 10 digits starting with 6-9');
        return;
      }
      if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        toast.error('Password must contain at least one letter and one number');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

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
          setTimeout(() => navigate('/home'), 800);
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

  /* helper: make underline inputs glow gold on focus */
  const bindFocus = {
    onFocus: (e) => { e.target.style.borderBottomColor = inputFocusColor; },
    onBlur: (e) => { e.target.style.borderBottomColor = '#D1D5DB'; },
  };

  if (redirecting) return <LoadingScreen message="Welcome! Redirecting..." />;

  /* ================================================================ */
  /*  OTP Verification Screen                                          */
  /* ================================================================ */
  if (showOtpScreen) {
    return (
      <div style={{ minHeight: '100vh', background: INK, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <ContourLines />

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '48px' }}>
          <div style={{ flex: '1 1 400px', minWidth: 0 }}>
            <p
              onClick={() => navigate('/landing')}
              style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: '24px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}
            >
              ← SSP
            </p>
            <h1 className="font-serif-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', fontWeight: 400, lineHeight: 1.08, color: PAPER, marginBottom: '16px', maxWidth: '500px' }}>
              One last<br />step.
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,254,251,0.5)', maxWidth: '380px', lineHeight: 1.6, fontFamily: '"Outfit", sans-serif' }}>
              We've sent a verification code to your email to confirm your identity.
            </p>
          </div>

          {/* Card */}
          <div style={{
            flex: '0 1 420px',
            background: PAPER,
            borderTop: `2.5px solid ${GOLD}`,
            borderRadius: '3px',
            padding: '40px 36px 36px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: INK_TEXT, marginBottom: '4px', fontFamily: '"Outfit", sans-serif' }}>
              Check your email
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px', fontFamily: '"Outfit", sans-serif' }}>
              Enter the 6-digit code sent to <span style={{ fontWeight: 600, color: INK_TEXT }}>{email}</span>
            </p>

            <form onSubmit={verifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={labelStyle}>Verification code</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }} onPaste={handleOtpPaste}>
                  {Array(6).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      required
                      ref={(el) => (otpRefs.current[index] = el)}
                      onInput={(e) => handleOtpInput(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      style={{
                        width: '44px',
                        height: '52px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 700,
                        border: `1.5px solid #D1D5DB`,
                        borderRadius: '3px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        fontFamily: '"IBM Plex Mono", monospace',
                        color: INK_TEXT,
                        background: 'transparent',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = GOLD; }}
                      onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  background: INK_BTN,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: otpLoading ? 'not-allowed' : 'pointer',
                  opacity: otpLoading ? 0.6 : 1,
                  transition: 'background 0.25s',
                  fontFamily: '"Outfit", sans-serif',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => { if (!otpLoading) e.target.style.background = GOLD; }}
                onMouseLeave={(e) => { e.target.style.background = INK_BTN; }}
              >
                {otpLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                onClick={resendOtp}
                disabled={resendLoading}
                style={{ fontSize: '13px', color: GOLD, fontWeight: 500, cursor: resendLoading ? 'not-allowed' : 'pointer', opacity: resendLoading ? 0.5 : 1, background: 'none', border: 'none', fontFamily: '"Outfit", sans-serif' }}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
              <button
                onClick={() => { setShowOtpScreen(false); setState('Login'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', fontFamily: '"Outfit", sans-serif' }}
              >
                <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Login / Sign Up Screen                                           */
  /* ================================================================ */
  return (
    <div style={{ minHeight: '100vh', background: INK, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <ContourLines />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '48px' }}>

        {/* Left: Headline */}
        <div style={{ flex: '1 1 400px', minWidth: 0 }}>
          <p
            onClick={() => navigate('/landing')}
            style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: '24px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}
          >
            ← SSP
          </p>
          <h1 className="font-serif-display" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 400, lineHeight: 1.05, color: PAPER, marginBottom: '20px', maxWidth: '520px' }}>
            {state === 'Sign Up'
              ? <>Your scholarship,<br />in motion.</>
              : <>Welcome<br />back.</>
            }
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,254,251,0.45)', maxWidth: '400px', lineHeight: 1.65, fontFamily: '"Outfit", sans-serif' }}>
            {state === 'Sign Up'
              ? 'Create your student account to apply for and track your PMSSS scholarship application.'
              : 'Sign in to continue managing your scholarship journey.'}
          </p>
        </div>

        {/* Right: Form Card */}
        <div style={{
          flex: '0 1 420px',
          background: PAPER,
          borderTop: `2.5px solid ${GOLD}`,
          borderRadius: '3px',
          padding: '40px 36px 36px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: INK_TEXT, marginBottom: '2px', fontFamily: '"Outfit", sans-serif' }}>
            {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px', fontFamily: '"Outfit", sans-serif' }}>
            {state === 'Sign Up' ? 'Register as a student to get started' : 'Enter your credentials to continue'}
          </p>

          <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {state === 'Sign Up' && (
              <>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                    style={inputStyle}
                    {...bindFocus}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Mobile</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    required
                    pattern="[6-9]\d{9}"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    style={inputStyle}
                    {...bindFocus}
                  />
                </div>
              </>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                autoComplete="email"
                style={inputStyle}
                {...bindFocus}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete={state === 'Sign Up' ? 'new-password' : 'current-password'}
                  style={{ ...inputStyle, paddingRight: '36px' }}
                  {...bindFocus}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
              {state === 'Sign Up' && (
                <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontFamily: '"Outfit", sans-serif' }}>At least 6 characters, including a letter and a number.</p>
              )}
            </div>

            {state === 'Sign Up' && (
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight: '36px' }}
                    {...bindFocus}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                  >
                    {showConfirmPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>
            )}

            {state === 'Login' && (
              <p
                onClick={() => navigate('/reset-password')}
                style={{ fontSize: '13px', color: GOLD, cursor: 'pointer', fontWeight: 500, fontFamily: '"Outfit", sans-serif', margin: '-4px 0 0' }}
              >
                Forgot password?
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 0',
                marginTop: '4px',
                background: INK_BTN,
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'background 0.25s',
                fontFamily: '"Outfit", sans-serif',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = GOLD; }}
              onMouseLeave={(e) => { e.target.style.background = INK_BTN; }}
            >
              {loading ? 'Please wait...' : state === 'Sign Up' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '24px', fontFamily: '"Outfit", sans-serif' }}>
            {state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setState('Login')}
                  style={{ color: GOLD, fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => setState('Sign Up')}
                  style={{ color: GOLD, fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
