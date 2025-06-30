import React, { useState } from 'react';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');

  const fakeApiCall = (msg) => new Promise((res) => setTimeout(() => res(msg), 1000));

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      setError('Please enter username and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fakeApiCall('logged in');
      onLogin();
    } catch {
      setError('Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!regUsername || !regPassword || !regConfirmPassword) {
      setError('Fill all fields');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fakeApiCall('registered');
      alert('Registered! Please login.');
      setMode('login');
    } catch {
      setError('Registration failed');
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fakeApiCall('reset link sent');
      alert('Password reset link sent!');
      setMode('login');
    } catch {
      setError('Failed to send reset link');
    }
    setLoading(false);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: 20,
      color: '#fff',
    },
    box: {
      maxWidth: 400,
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 30,
      boxShadow: '0 10px 25px rgba(255,255,255,0.08)',
      width: '100%',
      textAlign: 'center',
    },
    header: {
      fontSize: 26,
      fontWeight: 700,
      marginBottom: 20,
      color: '#ffffff',
    },
    inputGroup: {
      position: 'relative',
      marginBottom: 16,
      maxWidth: 320,
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'left',
    },
    inputIcon: {
      position: 'absolute',
      top: '50%',
      left: 10,
      transform: 'translateY(-50%)',
      fontSize: 18,
      color: '#999',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '16px 35px 16px 35px',
      borderRadius: 8,
      background: '#333',
      border: '1px solid #555',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
    toggleBtn: {
      position: 'absolute',
      top: '50%',
      right: 10,
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#ccc',
      cursor: 'pointer',
      fontSize: 14,
    },
    submit: {
      width: '70%',
      padding: 10,
      background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
      border: 'none',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      color: 'white',
      marginTop: 12,
    },
    submitDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    error: {
      marginBottom: 16,
      padding: 12,
      borderRadius: 6,
      backgroundColor: '#ff4d4d',
      color: 'white',
      fontSize: 14,
      textAlign: 'center',
    },
    altSection: {
      marginTop: 18,
      fontSize: 14,
      color: '#aaa',
    },
    altBtn: {
      background: 'none',
      border: 'none',
      color: '#00c6ff',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontWeight: 500,
    },
  };

  const renderInput = ({ type, placeholder, value, onChange, icon, showPassword, togglePassword }) => (
    <div style={styles.inputGroup}>
      <span style={styles.inputIcon}>{icon}</span>
      <input
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
      {type === 'password' && (
        <button
          onClick={togglePassword}
          type="button"
          style={styles.toggleBtn}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      )}
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        {mode === 'login' && (
          <>
            <div style={styles.header}>🔐 Login</div>
            {error && <div style={styles.error}>{error}</div>}
            {renderInput({ type: 'text', placeholder: 'Username', value: loginUsername, onChange: (e) => setLoginUsername(e.target.value), icon: '👤' })}
            {renderInput({ type: 'password', placeholder: 'Password', value: loginPassword, onChange: (e) => setLoginPassword(e.target.value), icon: '🔒', showPassword: showLoginPassword, togglePassword: () => setShowLoginPassword(!showLoginPassword) })}
            <button onClick={handleLogin} style={{ ...styles.submit, ...(loading ? styles.submitDisabled : {}) }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div style={styles.altSection}>
              <button onClick={() => { setMode('forgot'); setError(''); }} style={styles.altBtn}>Forgot Password?</button><br />
              Don't have an account? <button onClick={() => { setMode('register'); setError(''); }} style={styles.altBtn}>Register</button>
            </div>
          </>
        )}

        {mode === 'register' && (
          <>
            <div style={styles.header}>📝 Register</div>
            {error && <div style={styles.error}>{error}</div>}
            {renderInput({ type: 'text', placeholder: 'Username', value: regUsername, onChange: (e) => setRegUsername(e.target.value), icon: '👤' })}
            {renderInput({ type: 'password', placeholder: 'Password', value: regPassword, onChange: (e) => setRegPassword(e.target.value), icon: '🔒', showPassword: showRegPassword, togglePassword: () => setShowRegPassword(!showRegPassword) })}
            {renderInput({ type: 'password', placeholder: 'Confirm Password', value: regConfirmPassword, onChange: (e) => setRegConfirmPassword(e.target.value), icon: '🔒', showPassword: showRegConfirmPassword, togglePassword: () => setShowRegConfirmPassword(!showRegConfirmPassword) })}
            <button onClick={handleRegister} style={styles.submit} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <div style={styles.altSection}>
              Already have an account? <button onClick={() => { setMode('login'); setError(''); }} style={styles.altBtn}>Login</button>
            </div>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <div style={styles.header}>🔑 Reset Password</div>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={styles.input}
              />
            </div>
            <button onClick={handleForgot} style={styles.submit} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={styles.altSection}>
              Remembered password? <button onClick={() => { setMode('login'); setError(''); }} style={styles.altBtn}>Login</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}