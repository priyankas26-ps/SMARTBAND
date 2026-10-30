
import React, { useEffect, useRef, useState } from 'react';
import {
  NavLink, Navigate, Route, Routes, useNavigate
} from 'react-router-dom';

import {
  Bell, HeartPulse, Home, LogOut, MapPin,
  Settings, ShieldCheck, Watch, History, Menu, X
} from 'lucide-react';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

import { auth } from './firebase';
import { api } from './api';

import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import Location from './pages/Location';
import HistoryPage from './pages/History';
import SettingsPage from './pages/Settings';

import './app.css';

function Login() {
  const [mode, setMode] = useState('login');
  const [method, setMethod] = useState('phone');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const recaptchaRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const switchMethod = (newMethod) => {
    setMethod(newMethod);
    setMessage('');
    setOtp('');
    setConfirmation(null);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setBusy(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await sendPasswordResetEmail(auth, email);
        setMessage(
          'Password reset email sent! Check your inbox and spam folder.'
        );
      }
    } catch (error) {
      console.error('Email Authentication Error:', error);
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const sendOTP = async () => {
    setMessage('');

    let formattedPhone = phone.trim().replace(/[\s()-]/g, '');

    if (/^\d{10}$/.test(formattedPhone)) {
      formattedPhone = '+91' + formattedPhone;
    }

    if (!/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
      setMessage(
        'Enter a valid phone number. Example: +919876543210'
      );
      return;
    }

    setBusy(true);

    try {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }

      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible' }
      );

      await recaptchaRef.current.render();

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaRef.current
      );

      setConfirmation(result);
      setMessage(
        `OTP sent successfully to ${formattedPhone}. Check your phone.`
      );

    } catch (error) {
      console.error('Firebase OTP Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      setMessage(`${error.code || 'Error'}: ${error.message}`);

      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }

    } finally {
      setBusy(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (!confirmation) {
      setMessage('Please request an OTP first.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('Enter the 6-digit OTP.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      await confirmation.confirm(otp);
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setMessage(`${error.code || 'Error'}: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = async () => {
    setMessage('');
    setBusy(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Login Error:', error);
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form
        className="auth-card"
        onSubmit={
          method === 'email'
            ? handleEmailSubmit
            : confirmation
              ? verifyOTP
              : (e) => e.preventDefault()
        }
      >
        <div className="brand-mark">
          <Watch size={28} />
        </div>

        <h1>
          {mode === 'login' && 'Welcome to KidBand'}
          {mode === 'register' && 'Create parent account'}
          {mode === 'forgot' && 'Forgot password?'}
        </h1>

        <p>Stay connected to your child's wellbeing.</p>

        {mode === 'login' && (
          <div className="auth-methods">
            <button
              type="button"
              className={method === 'phone' ? 'method-active' : ''}
              onClick={() => switchMethod('phone')}
            >
              Phone OTP
            </button>

            <button
              type="button"
              className={method === 'email' ? 'method-active' : ''}
              onClick={() => switchMethod('email')}
            >
              Email
            </button>
          </div>
        )}

        {method === 'phone' && mode === 'login' && (
          <>
            {!confirmation ? (
              <>
                <label>Phone number</label>

                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  autoComplete="tel"
                  required
                />

                <button
                  type="button"
                  className="primary full"
                  onClick={sendOTP}
                  disabled={busy}
                >
                  {busy ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <label>Enter OTP</label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e =>
                    setOtp(e.target.value.replace(/\D/g, ''))
                  }
                  placeholder="Enter 6-digit OTP"
                  required
                />

                <button
                  className="primary full"
                  disabled={busy}
                >
                  {busy ? 'Verifying...' : 'Verify OTP & Sign in'}
                </button>

                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setConfirmation(null);
                    setOtp('');
                    setMessage('');
                  }}
                >
                  Change number / Resend OTP
                </button>
              </>
            )}

            <div id="recaptcha-container"></div>
          </>
        )}

        {method === 'email' && (
          <>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            {mode !== 'forgot' && (
              <>
                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  minLength={6}
                  required
                />
              </>
            )}

            {mode === 'login' && (
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setMode('forgot');
                  setMessage('');
                }}
              >
                Forgot password?
              </button>
            )}

            <button className="primary full" disabled={busy}>
              {busy
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign in'
                  : mode === 'register'
                    ? 'Create account'
                    : 'Send reset email'}
            </button>
          </>
        )}

        {mode === 'login' && (
          <>
            <div className="auth-divider">OR</div>

            <button
              type="button"
              className="google-button"
              onClick={googleLogin}
              disabled={busy}
            >
              <b>G</b> Continue with Google
            </button>
          </>
        )}

        {message && (
          <p className="auth-message">{message}</p>
        )}

        <div className="auth-links">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setMethod('email');
                  setMessage('');
                }}
              >
                Sign up?
              </button>
            </p>
          )}

          {mode !== 'login' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMethod('email');
                setMessage('');
              }}
            >
              Back to sign in
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ConnectBand({ onConnect }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand-mark">
          <Watch size={28} />
        </div>

        <h1>Connect your band</h1>
        <p>Enter the device ID printed on your KidBand.</p>

        <label>Band ID</label>
        <input value="KB1024" readOnly />

        <button className="primary full" onClick={onConnect}>
          Connect KidBand
        </button>
      </div>
    </div>
  );
}

const nav = [
  { to: '/', label: 'Overview', icon: Home },
  { to: '/health', label: 'Health', icon: HeartPulse },
  { to: '/location', label: 'Location', icon: MapPin },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function App() {
  const [logged, setLogged] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [connected, setConnected] = useState(
    localStorage.getItem('kidband-connected') === 'yes'
  );

  const [mobile, setMobile] = useState(false);
  const [sos, setSos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLogged(!!user);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    api('/api/sos').then(setSos).catch(() => {});

    const timer = setInterval(() => {
      api('/api/sos').then(setSos).catch(() => {});
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const connect = () => {
    localStorage.setItem('kidband-connected', 'yes');
    setConnected(true);
    navigate('/');
  };

  if (!authReady) {
    return <div className="auth-wrap">Loading KidBand...</div>;
  }

  if (!logged) return <Login />;

  if (!connected) {
    return <ConnectBand onConnect={connect} />;
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${mobile ? 'show' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Watch /></div>

          <div>
            <b>KidBand</b>
            <small>Parent companion</small>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobile(false)}
          >
            <X />
          </button>
        </div>

        <div className="child-mini">
          <div className="avatar">A</div>

          <div>
            <b>Arnav</b>
            <small><span className="dot" /> Band connected</small>
          </div>
        </div>

        <nav>
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              onClick={() => setMobile(false)}
            >
              <n.icon size={19} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="safety-note">
            <ShieldCheck />
            <b>Care at a glance</b>
            <small>
              Monitor health and location from one place.
            </small>
          </div>

          <button
            className="logout"
            onClick={async () => {
              await signOut(auth);
              localStorage.removeItem('kidband-connected');
              setConnected(false);
            }}
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>

          <div>
            <b>Parent Dashboard</b>
            <small>KidBand monitoring</small>
          </div>

          <div className="top-actions">
            <span className="status-pill">
              <span className="dot" /> Band online
            </span>

            <button className="icon-btn" title="Notifications">
              <Bell size={19} />
              {sos.some(x => x.status === 'ACTIVE') && <i />}
            </button>
          </div>
        </header>

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/health" element={<Health />} />
            <Route path="/location" element={<Location />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <footer>
          KidBand · Child wellness monitoring prototype · Demo sensor data
        </footer>
      </main>
    </div>
  );
}
