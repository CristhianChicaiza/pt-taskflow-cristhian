import { Todo, TodosResponse } from '../types/todos'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getTodos(
  limit: number,
  skip: number
): Promise<TodosResponse> {
  const res = await fetch(`${BASE_URL}/todos?limit=${limit}&skip=${skip}`)

  if (!res.ok) {
    throw new Error('Error fetching todos')
  }

  return res.json()
}
export async function createTodo(text: string): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      todo: text,
      completed: false,
      userId: 1,
    }),
  })

  if (!res.ok) {
    throw new Error('Error creating todo')
  }

  return res.json()
}

export async function updateTodo(
  id: number,
  completed: boolean
): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })

  if (!res.ok) {
    throw new Error('Error updating todo')
  }

  return res.json()
}

export async function deleteTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Error deleting todo')
  }

  return res.json()
}
