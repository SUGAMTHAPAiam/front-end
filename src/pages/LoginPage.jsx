import React, { useState } from 'react'
import api from '../api'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", { username, password })
      const res = await api.post("/auth/login", { username, password })
      console.log("Login response:", res.data)
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        onLogin()
      } else {
        setError("No token received from server")
      }
    } catch (err) {
      console.error("Login error:", err)
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status
        const message = err.response.data?.message || err.response.data?.error || "Login failed"
        
        if (status === 401) {
          setError("Invalid username or password")
        } else if (status === 404) {
          setError("Login endpoint not found. Please check if the backend server is running.")
        } else if (status >= 500) {
          setError("Server error. Please try again later.")
        } else {
          setError(`Login failed: ${message}`)
        }
      } else if (err.request) {
        // Network error - no response received
        setError("Cannot connect to server. Please check if the backend is running on http://localhost:4000")
      } else {
        // Other error
        setError("Login failed: " + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <input 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>
      
      <button 
        onClick={handleLogin} 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: loading ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      
      <div style={{ 
        marginTop: '15px', 
        fontSize: '12px', 
        color: '#666', 
        textAlign: 'center' 
      }}>
        Backend URL: http://localhost:4000/api
      </div>
    </div>
  )
}