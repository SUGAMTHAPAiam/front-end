import React, { useState } from 'react';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

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
      setIsLoggedIn(true);
      onLogin?.();
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
      alert('Registered successfully! Please login.');
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
      await fakeApiCall('reset sent');
      alert('Password reset link sent!');
      setMode('login');
    } catch {
      setError('Reset failed');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginUsername('');
    setLoginPassword('');
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: 20,
      color: '#eee',
    },
    box: {
      maxWidth: 400,
      width: '100%',
      backgroundColor: '#222',
      padding: 30,
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
    },
    header: {
      textAlign: 'center',
      marginBottom: 24,
      fontSize: 22,
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: 12,
      marginBottom: 16,
      borderRadius: 6,
      border: '1px solid #444',
      backgroundColor: '#333',
      color: '#eee',
      fontSize: 16,
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: 14,
      borderRadius: 6,
      border: 'none',
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      marginTop: 20,
    },
    error: {
      backgroundColor: '#ff4d4d',
      color: '#fff',
      padding: 10,
      borderRadius: 6,
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
    },
    linkGroup: {
      marginTop: 16,
      fontSize: 14,
      textAlign: 'center',
      color: '#aaa',
    },
    linkBtn: {
      background: 'none',
      border: 'none',
      color: '#00b0ff',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: 0,
      marginLeft: 6,
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        {isLoggedIn ? (
          <>
            <div style={styles.header}>Welcome!</div>
            <button onClick={handleLogout} style={{ ...styles.button, ...styles.logoutButton }}>
              Logout
            </button>
          </>
        ) : (
          <>
            {mode === 'login' && (
              <>
                <div style={styles.header}>Login</div>
                {error && <div style={styles.error}>{error}</div>}
                <input
                  type="text"
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  style={styles.input}
                  spellCheck="false"
                  autoComplete="username"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={styles.input}
                  autoComplete="current-password"
                />
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <div style={styles.linkGroup}>
                  <button onClick={() => { setMode('forgot'); setError(''); }} style={styles.linkBtn}>
                    Forgot Password?
                  </button>
                  <br />
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('register'); setError(''); }} style={styles.linkBtn}>
                    Register
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div style={styles.header}>Register</div>
                {error && <div style={styles.error}>{error}</div>}
                <input
                  type="text"
                  placeholder="Username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  style={styles.input}
                  spellCheck="false"
                  autoComplete="username"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <div style={styles.linkGroup}>
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError(''); }} style={styles.linkBtn}>
                    Login
                  </button>
                </div>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <div style={styles.header}>Reset Password</div>
                {error && <div style={styles.error}>{error}</div>}
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={styles.input}
                  autoComplete="email"
                />
                <button
                  onClick={handleForgot}
                  disabled={loading}
                  style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div style={styles.linkGroup}>
                  Remembered password?{' '}
                  <button onClick={() => { setMode('login'); setError(''); }} style={styles.linkBtn}>
                    Login
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
