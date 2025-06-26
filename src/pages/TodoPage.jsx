import React, { useEffect, useState } from 'react'
import api from '../api'
import dayjs from 'dayjs'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" })

  const loadTodos = async () => {
    const res = await api.get("/todos")
    setTodos(res.data)
  }

  const submit = async () => {
    await api.post("/todos", form)
    setForm({ title: "", description: "", dueDate: "" })
    loadTodos()
  }

  const remove = async (id) => {
    await api.delete(`/todos/${id}`)
    loadTodos()
  }

  useEffect(() => {
    loadTodos()
  }, [])

  return (
    <div>
      <h2>My Todos</h2>
      <input value={form.title} placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input value={form.description} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
      <button onClick={submit}>Add</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> - {t.description} - {dayjs(t.dueDate).format("YYYY-MM-DD")}
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}