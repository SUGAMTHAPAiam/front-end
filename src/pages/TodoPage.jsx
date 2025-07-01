import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaTrash, FaCheckCircle, FaCircle, FaTasks, FaSignOutAlt
} from 'react-icons/fa';
import dayjs from 'dayjs';
import api from '../api'; // backend connection

// Global styles for black & white theme
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: #000;
    color: #fff;
    transition: background 0.3s, color 0.3s;
  }
`;

// Black & white theme colors
const theme = { 
  bg: '#000', 
  fg: '#fff', 
  panel: '#111', 
  inputBg: '#222', 
  inputBd: '#555' 
};

// Styled Components
const Container = styled.div`
  display: flex; 
  justify-content: center; 
  padding: 60px 20px;
  background: ${theme.bg};
  min-height: 100vh;
`;
const Panel = styled(motion.div)`
  background: ${theme.panel};
  padding: 30px;
  border-radius: 14px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 8px 20px rgba(255,255,255,0.1);
`;
const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.fg};
`;
const IconBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.fg};
  cursor: pointer;
  font-size: 1.5rem;
  margin-left: 10px;
  transition: color 0.2s;
  &:hover {
    color: #aaa;
  }
`;
const Row = styled.div`
  display: flex; 
  align-items: center; 
  gap: 10px;
`;
const TaskForm = styled(motion.form)`
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
  grid-template-columns: 1fr 1fr 2fr auto;
`;
const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${theme.inputBd};
  background: ${theme.inputBg};
  color: ${theme.fg};
  font-size: 1rem;
  &:focus {
    outline: 2px solid #fff;
  }
`;
const AddBtn = styled(motion.button)`
  background: #fff;
  border: none;
  border-radius: 8px;
  color: ${theme.bg};
  padding: 0 16px;
  font-size: 1.2rem;
  cursor: pointer;
  height: 48px;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
  &:hover {
    background: #ccc;
    color: ${theme.bg};
  }
`;
const TaskList = styled.ul`
  list-style: none; 
  padding: 0;
`;
const TaskItem = styled(motion.li)`
  background: ${theme.bg};
  border-left: 4px solid ${({ completed }) => completed ? '#fff' : '#aaa'};
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(255,255,255,0.1);
`;
const TaskHeader = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center;
`;
const Content = styled.div`
  margin: 8px 0;
  color: ${({ completed }) => completed ? '#555' : theme.fg};
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
  font-weight: 600;
`;
const Description = styled.div`
  color: ${({ completed }) => completed ? '#333' : '#ccc'};
  font-style: italic;
  margin-bottom: 8px;
  white-space: pre-wrap;
`;
const DueText = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  font-style: italic;
  color: #bbb;
`;

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    api.get('/todos').then(res => setTodos(res.data)).catch(console.error);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || !due) return;

    const temp = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate: due,
      completed: false,
    };

    setTodos(prev => [...prev, temp]);
    setTitle('');
    setDue('');
    setDescription('');

    try {
      const res = await api.post('/todos', temp);
      setTodos(prev => prev.map(t => t.id === temp.id ? res.data : t));
    } catch {
      setTodos(prev => prev.filter(t => t.id !== temp.id));
    }
  };

  const toggle = async (id) => {
    const todo = todos.find(t => t.id === id);
    const updated = { ...todo, completed: !todo.completed };
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
    try {
      await api.patch(`/todos/${id}`, { completed: updated.completed });
    } catch {
      setTodos(prev => prev.map(t => t.id === id ? todo : t));
    }
  };

  const remove = async (id) => {
    const backup = [...todos];
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await api.delete(`/todos/${id}`);
    } catch {
      setTodos(backup);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Panel initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Header>
            <Row>
              <FaTasks /> Task Manager
            </Row>
            <Row>
              <IconBtn onClick={logout} title="Logout">
                <FaSignOutAlt />
              </IconBtn>
            </Row>
          </Header>

          <TaskForm onSubmit={addTodo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Task title" 
              required 
            />
            <Input 
              type="date" 
              value={due} 
              onChange={e => setDue(e.target.value)} 
              required 
            />
            <Input 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Description (optional)" 
            />
            <AddBtn type="submit" whileTap={{ scale: 0.9 }}>
              <FaPlus />
            </AddBtn>
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
                >
                  <TaskHeader>
                    <motion.div onClick={() => toggle(todo.id)} whileTap={{ scale: 0.9 }} style={{ cursor: 'pointer' }}>
                      {todo.completed ? <FaCheckCircle color="#fff" /> : <FaCircle color="#aaa" />}
                    </motion.div>
                    <IconBtn onClick={() => remove(todo.id)}>
                      <FaTrash />
                    </IconBtn>
                  </TaskHeader>
                  <Content completed={todo.completed}>{todo.title}</Content>
                  {todo.description && <Description completed={todo.completed}>{todo.description}</Description>}
                  <DueText>
                    Due: {dayjs(todo.dueDate).format('MMM D, YYYY')}
                  </DueText>
                </TaskItem>
              ))}
            </AnimatePresence>
          </TaskList>
        </Panel>
      </Container>
    </>
  );
}
