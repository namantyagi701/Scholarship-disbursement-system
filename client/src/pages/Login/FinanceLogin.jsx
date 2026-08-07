import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Shared SVG line-art motif — abstract topographic contour lines     */
/* ------------------------------------------------------------------ */
const ContourLines = () => (
  <motion.svg
    className="absolute bottom-0 left-0 w-full"
    style={{ height: '38%' }}
    viewBox="0 0 1440 400"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, ease: 'easeOut' }}
  >
    <path d="M0 320 C120 280, 240 340, 360 300 S600 240, 720 280 S960 340, 1080 290 S1320 240, 1440 270" stroke="#B8860B" strokeWidth="0.8" opacity="0.13" />
    <path d="M0 340 C160 310, 280 370, 420 330 S640 270, 780 310 S1000 360, 1140 310 S1340 260, 1440 300" stroke="#B8860B" strokeWidth="0.8" opacity="0.10" />
    <path d="M0 360 C200 340, 320 380, 480 350 S680 300, 840 340 S1040 370, 1200 330 S1380 290, 1440 330" stroke="#B8860B" strokeWidth="0.8" opacity="0.08" />
    <path d="M0 380 C180 360, 360 400, 540 370 S720 320, 900 360 S1080 390, 1260 350 S1400 310, 1440 355" stroke="#B8860B" strokeWidth="0.6" opacity="0.06" />
    <path d="M0 395 C240 385, 400 400, 600 390 S800 370, 1000 390 S1200 400, 1440 390" stroke="#B8860B" strokeWidth="0.5" opacity="0.05" />
  </motion.svg>
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

  const bindFocus = {
    onFocus: (e) => { e.target.style.borderBottomColor = inputFocusColor; },
    onBlur: (e) => { e.target.style.borderBottomColor = '#D1D5DB'; },
  };

  if (redirecting) return <LoadingScreen message="Welcome! Redirecting..." />;

  return (
    <div style={{ minHeight: '100vh', background: INK, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <ContourLines />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '48px' }}>

        {/* Left: Headline */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ flex: '1 1 400px', minWidth: 0 }}
        >
          <p
            onClick={() => navigate('/landing')}
            style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: '24px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}
          >
            ← SSP
          </p>
          <h1 className="font-serif-display" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 400, lineHeight: 1.05, color: PAPER, marginBottom: '20px', maxWidth: '520px' }}>
            Disbursements,<br />streamlined.
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,254,251,0.45)', maxWidth: '400px', lineHeight: 1.65, fontFamily: '"Outfit", sans-serif' }}>
            Access the Finance Bureau portal to verify bank details and process scholarship payments.
          </p>
        </motion.div>

        {/* Right: Form Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          style={{
          flex: '0 1 420px',
          background: PAPER,
          borderTop: `2.5px solid ${GOLD}`,
          borderRadius: '3px',
          padding: '40px 36px 36px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: INK_TEXT, marginBottom: '2px', fontFamily: '"Outfit", sans-serif' }}>
            Finance Bureau
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px', fontFamily: '"Outfit", sans-serif' }}>
            Sign in to the finance portal
          </p>

          <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="finance@example.com"
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
                  autoComplete="current-password"
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
            </div>

            <p
              onClick={() => navigate('/reset-password')}
              style={{ fontSize: '13px', color: GOLD, cursor: 'pointer', fontWeight: 500, fontFamily: '"Outfit", sans-serif', margin: '-4px 0 0' }}
            >
              Forgot password?
            </p>

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
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '24px', fontFamily: '"Outfit", sans-serif' }}>
            Finance Bureau accounts are provisioned by the administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FinanceLogin;
