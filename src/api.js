import axios from 'axios'

const api = axios.create({ 
  baseURL: 'http://localhost:4000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
  return config
}, (error) => {
  console.error('API Request Error:', error)
  return Promise.reject(error)
})

// Response interceptor
api.interceptors.response.use((response) => {
  console.log(`API Response: ${response.status} ${response.config.url}`, response.data)
  return response
}, (error) => {
  console.error('API Response Error:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    data: error.response?.data
  })
  return Promise.reject(error)
})

export default api