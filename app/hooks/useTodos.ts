import { useEffect, useState } from 'react'
import { Todo } from '../types/todos'
import { deleteTodoDB } from '../services/indexedDB.service'
import { deleteTodo } from '../services/api.service'
import {
  getTodos,
  createTodo as apiCreateTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
} from '../services/api.service'

const LIMIT = 10

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [completedpage, setCompletedPage] = useState(0)

  const [total, setTotal] = useState(0)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getTodos(LIMIT, page * LIMIT)

      setTodos(data.todos)
      setTotal(data.total)
    } catch {
      setError('Error loading todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [page])
    useEffect(() => {
    fetchTodos()
  }, [completedpage])

  const addTodo = async (text: string) => {
    try {
      const newTodo = await apiCreateTodo(text)

      setTodos((prev) => [newTodo, ...prev])
    } catch {
      setError('Error creating todo')
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const updated = await apiUpdateTodo(id, completed)

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: updated.completed } : todo
        )
      )
    } catch {
      setError('Error updating todo')
    }
  }

 async function removeTodoHandler(id: number) {
  try {
  
    await deleteTodo(id)
    
    await deleteTodoDB(id)

    setTodos(prev => prev.filter(todo => todo.id !== id))
  } catch (error) {
    console.error('Error eliminando la tarea', error)
  }
}

  const totalPages = Math.ceil(total / LIMIT)

  return {
    todos,
    loading,
    error,
    page,
    setPage,
    totalPages,
    completedpage,
    setCompletedPage,
    fetchTodos,
    addTodo,
    toggleTodo,
    removeTodoHandler,
  }
}