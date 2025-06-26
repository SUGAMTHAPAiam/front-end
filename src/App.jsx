import React, { useState } from 'react'
import LoginPage from './pages/LoginPage'
import TodoPage from './pages/TodoPage'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"))
  return loggedIn ? <TodoPage /> : <LoginPage onLogin={() => setLoggedIn(true)} />
}