"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/todos")
      .then((response) => response.json())
      .then(setTodos);
  }, []);

  async function addTodo() {
    if (!title.trim()) return;

    const response = await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 0, title, done: false }),
    });

    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
    setTitle("");
  }

  return (
    <main>
      <h1>My To-Do List</h1>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a task"
      />
      <button onClick={addTodo}>Add</button>

      {todos.map((todo) => (
        <p key={todo.id}>
          <input
          type="checkbox"
          checked={todo.done}
          onChange={async () => {
            const response = await fetch(
              `http://localhost:8000/todos/${todo.id}`,
              { method: "PATCH" }
            );
            const updatedTodo = await response.json();
            setTodos(todos.map((item) => (item.id === todo.id ? updatedTodo : item)));
          }}
        />
        {todo.title}
          
        <button
          onClick={async () => {
            await fetch(`http://localhost:8000/todos/${todo.id}`, {
              method: "DELETE",
          });
          setTodos(todos.filter((item) => item.id !== todo.id));
        }}
      >
        Delete

      </button>
      </p>
      ))}
    </main>
  );
}