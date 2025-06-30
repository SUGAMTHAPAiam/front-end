import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlus, FaTrash, FaCheckCircle, FaCircle, FaTasks,
  FaUser, FaShoppingCart, FaHeartbeat, FaLaptopCode, FaSun, FaMoon
} from 'react-icons/fa'
import dayjs from 'dayjs'
import api from '../api'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.fg};
    transition: background 0.3s, color 0.3s;
  }
`

const light = { bg: '#f0f4f8', fg: '#333', panel: '#fff', inputBg: '#fff', inputBd: '#ccc' }
const dark = { bg: '#0f172a', fg: '#f1f5f9', panel: '#1e293b', inputBg: '#0f172a', inputBd: '#334155' }

const categories = [
  { name: 'Personal', icon: <FaUser /> },
  { name: 'Shopping', icon: <FaShoppingCart /> },
  { name: 'Health', icon: <FaHeartbeat /> },
  { name: 'Coding', icon: <FaLaptopCode /> },
]

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 20px;
`

const Panel = styled(motion.div)`
  background: ${({ theme }) => theme.panel};
  padding: 30px;
  border-radius: 14px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
`

const Header = styled.h1`
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const IconBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.fg};
  cursor: pointer;
  font-size: 1.6rem;
`

const TaskForm = styled(motion.form)`
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) auto;
`

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.inputBd};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
`

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.inputBd};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  max-height: 80px;
  resize: vertical;
`

const AddBtn = styled(motion.button)`
  background: #14b8a6;
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 0 16px;
  font-size: 1.3rem;
  cursor: pointer;
  height: 48px;
`

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`

const CategorySelector = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.inputBd};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
`

const TaskItem = styled(motion.li)`
  background: ${({ theme }) => theme.panel};
  border-left: 4px solid ${({ completed }) => completed ? '#22c55e' : '#38bdf8'};
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Content = styled.div`
  margin: 8px 0;
  color: ${({ completed, theme }) => completed ? '#94a3b8' : theme.fg};
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
`

const DueText = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  font-style: italic;
`

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')
  const [category, setCategory] = useState('Personal')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => api.get('/todos').then(res => setTodos(res.data)).catch(console.error), [])

  useEffect(() => localStorage.setItem('darkMode', darkMode), [darkMode])

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  const notify = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Reminder: ${task.title}`, {
        body: `Due ${dayjs(task.dueDate).format('MMM D, YYYY')}`,
      })
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim() || !due) return

    const temp = {
      id: Date.now(),
      title: title.trim(),
      description: desc.trim(),
      dueDate: due,
      completed: false,
      category,
    }
    setTodos(prev => [...prev, temp])
    setTitle(''); setDesc(''); setDue(''); setCategory('Personal')

    if (dayjs(due).isSame(dayjs(), 'day')) notify(temp)

    try {
      const res = await api.post('/todos', temp)
      setTodos(prev => prev.map(t => t.id === temp.id ? res.data : t))
    } catch {
      setTodos(prev => prev.filter(t => t.id !== temp.id))
    }
  }

  const toggle = async (id) => {
    const todo = todos.find(t => t.id === id)
    const updated = { ...todo, completed: !todo.completed }
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
    try {
      await api.patch(`/todos/${id}`, { completed: updated.completed })
    } catch {
      setTodos(prev => prev.map(t => t.id === id ? todo : t))
    }
  }

  const remove = async (id) => {
    const backup = [...todos]
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await api.delete(`/todos/${id}`)
    } catch {
      setTodos(backup)
    }
  }

  return (
    <>
      <GlobalStyle theme={darkMode ? dark : light} />
      <Container>
        <Panel initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Header theme={darkMode ? dark : light}>
            <div><FaTasks /> Task Manager</div>
            <IconBtn onClick={() => setDarkMode(!darkMode)} theme={darkMode ? dark : light}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </IconBtn>
          </Header>

          <TaskForm
            onSubmit={addTodo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (required)" required theme={darkMode ? dark : light} />
            <TextArea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)" rows={1} theme={darkMode ? dark : light} />
            <Input type="date" value={due} onChange={e => setDue(e.target.value)} required theme={darkMode ? dark : light} />
            <CategorySelector value={category} onChange={e => setCategory(e.target.value)} theme={darkMode ? dark : light}>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </CategorySelector>
            <AddBtn type="submit" whileTap={{ scale: 0.9 }}><FaPlus /></AddBtn>
          </TaskForm>

          <TaskList>
            <AnimatePresence>
              {todos.map(todo => (
                <TaskItem
                  key={todo.id}
                  completed={todo.completed}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  theme={darkMode ? dark : light}
                >
                  <TaskHeader>
                    <motion.div onClick={() => toggle(todo.id)} whileTap={{ scale: 0.9 }}>
                      {todo.completed ? <FaCheckCircle color="#22c55e" /> : <FaCircle />}
                    </motion.div>
                    <IconBtn onClick={() => remove(todo.id)} theme={darkMode ? dark : light}>
                      <FaTrash />
                    </IconBtn>
                  </TaskHeader>
                  <Content completed={todo.completed} theme={darkMode ? dark : light}>
                    <strong>[{todo.category}]</strong> {todo.title}
                    {todo.description && <div>{todo.description}</div>}
                  </Content>
                  <DueText theme={darkMode ? dark : light}>
                    Due: {dayjs(todo.dueDate).format('MMM D, YYYY')}
                  </DueText>
                </TaskItem>
              ))}
            </AnimatePresence>
          </TaskList>
        </Panel>
      </Container>
    </>
  )
}
