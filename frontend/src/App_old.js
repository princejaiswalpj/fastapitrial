import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ToDoForm from './components/ToDoForm';
import TodoList from './components/TodoList';
import ToDoEdit from './components/ToDoEdit';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { ToastProvider, useToast } from './components/ToastContext';

function AppContent() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/todo/');
      setTodos(response.data);
    } catch (err) {
      console.error('Failed to load todos', err);
      setError('Failed to load todos. Make sure the backend is running.');
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to load todos. Please check your backend connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newTodo) => {
    setTodos((prev) => [...prev, newTodo]);
    addToast({
      type: 'success',
      title: 'Todo Added',
      message: `"${newTodo.title}" has been added successfully!`
    });
  };

  const handleDelete = async (id) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    try {
      await axios.delete(`http://localhost:8000/todo/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      addToast({
        type: 'success',
        title: 'Todo Deleted',
        message: `"${todoToDelete?.title}" has been deleted.`
      });
    } catch (err) {
      console.error('Failed to delete todo', err);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete the todo. Please try again.'
      });
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`http://localhost:8000/todo/${id}`, updatedTodo);
      setTodos((prev) => prev.map((todo) => (todo.id === id ? response.data : todo)));

      if (editingTodo && editingTodo.id === id) {
        setEditingTodo(null);
        addToast({
          type: 'success',
          title: 'Todo Updated',
          message: `"${updatedTodo.title}" has been updated successfully!`
        });
      } else {
        addToast({
          type: 'success',
          title: 'Status Changed',
          message: `"${updatedTodo.title}" status updated.`
        });
      }
    } catch (err) {
      console.error('Failed to update todo', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update the todo. Please try again.'
      });
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
  };

  // Filter todos based on search and status
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'completed' && todo.done) ||
                         (filterStatus === 'active' && !todo.done);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="App">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="container">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your todos...</p>
          </div>
        )}

        {!loading && (
          <>
            {editingTodo ? (
              <ToDoEdit todo={editingTodo} onUpdate={handleUpdate} onCancel={cancelEditing} />
            ) : (
              <ToDoForm onAdd={handleAdd} />
            )}

            <div className="mt-4">
              <TodoList
                todos={filteredTodos}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onEdit={startEditing}
                searchTerm={searchTerm}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Header({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center py-3">
          <h1 className="mb-0">🚀 FastAPI + React Todo App</h1>
          <div className="d-flex align-items-center gap-3">
            <div className="search-filter-container">
              <input
                type="text"
                className="form-control search-input"
                placeholder="🔍 Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">📋 All</option>
                <option value="active">⏳ Active</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <button
              className="btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
