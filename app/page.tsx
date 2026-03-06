'use client'

import { useState, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import { addTodoDB, updateTodoDB, getTodosDB, deleteTodoDB } from './services/indexedDB.service'

export default function Home() {
  const {
    todos,
    loading,
    error,
    page,
    totalPages,
    setPage,
    addTodo,
    toggleTodo,
    removeTodoHandler,
    fetchTodos,
  } = useTodos()

  const [newTodo, setNewTodo] = useState('')
  const [message, setMessage] = useState('')
const [localTodos, setLocalTodos] = useState<any[]>([])

async function loadLocalTodos() {
  const data = await getTodosDB()
  setLocalTodos(data)
}
useEffect(() => {
  loadLocalTodos()
}, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const todoData = {
        todo: newTodo,
        completed: false
      }

      await addTodoDB(todoData) 
      await addTodo(newTodo)  

      loadLocalTodos()
      setMessage('Tarea creada correctamente')
      setNewTodo('')
    } catch {
      setMessage('Error al crear la tarea')
    }
  }

  const handleEdit = async(todo: any) => {
    const newText = prompt('Editar tarea', todo.todo)

    if (!newText) return

    const updatedTodo = {
      id: todo.id,
    ...todo,
    todo: newText
  }

  await updateTodoDB(updatedTodo)

  // fetchTodos()
  loadLocalTodos()
}

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">activities</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Nueva tarea..."
        />

        <button
          type="submit"
          className="bg-black text-white px-4 rounded border border-white hover:bg-white hover:text-black transition"
        >
          Agregar
        </button>
      </form>

      {message && (
        <p className="mb-4 text-green-600 font-medium">{message}</p>
      )}

      {loading && <p>Cargando tareas...</p>}

      {error && (
        <div className="mb-4">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchTodos} className="underline text-sm">
            Reintentar
          </button>
        </div>
      )}
      <div>
<h1>Actividades por realizar</h1>

 {/* <ul className="space-y-2">
        {localTodos.filter(todo => !todo.completed).map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, !todo.completed)}
              />

              <span
                className={
                  todo.completed
                    ? 'line-through text-gray-500'
                    : ''
                }
              >
                {todo.todo}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(todo)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar tarea?')) {
                    removeTodoHandler(todo.id)
                  }
                }}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul> */}

      <ul className="space-y-2">
        {todos.filter(todo => !todo.completed).map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, !todo.completed)}
              />

              <span
                className={
                  todo.completed
                    ? 'line-through text-gray-500'
                    : ''
                }
              >
                {todo.todo}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(todo)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar tarea?')) {
                    removeTodoHandler(todo.id)
                  }
                }}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
</div>

      <h1>Actividades realizadas</h1>
<div>
    <ul className="space-y-2">
        {todos.filter(todo => todo.completed).map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, !todo.completed)}
              />

              <span
                className={
                  todo.completed
                    ? 'line-through text-gray-500'
                    : ''
                }
              >
                {todo.todo}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(todo)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar tarea?')) {
                    removeTodo(todo.id)

                  }
                }}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página {page + 1} de {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
</div>
    </main>
  )
}
