import { useEffect, useState } from 'react';
import axios from 'axios';
const URL_API = 'http://127.0.0.1:8000'

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    axios.get(URL_API + '/tasks/?json=1')
      .then(res => setTodos(res.data));
  }, []);

  const addTodo = () => {
    if (!newTitle.trim()) return;
    axios.post(URL_API + '/tasks/', { title: newTitle, completed: false })
      .then(res => setTodos([...todos, res.data]));
    setNewTitle('');
  };

  const toggleCompleted = (todo) => {
    axios.patch(URL_API + `/tasks/${todo.id}/`, { completed: !todo.completed })
      .then(() => {
        setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
      });
  };

  const deleteTodo = (id) => {
    axios.delete(URL_API + `/tasks/${id}/`)
      .then(() => setTodos(todos.filter(t => t.id !== id)));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gerenciador de Tarefas</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTodo}>Adicionar</button>
      </div>
      <ul className="list-group">
        {todos.map(todo => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="me-auto" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <div className="btn-group">
              <button className="btn btn-sm btn-success" onClick={() => toggleCompleted(todo)}>
                {todo.completed ? 'Desfazer' : 'Concluir'}
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteTodo(todo.id)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
