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
  const [currentDate, setCurrentDate] = useState(new Date());
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
      title: 'Activity Added',
      message: `"${newTodo.title}" has been scheduled successfully!`
    });
  };

  const handleDelete = async (id) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    try {
      await axios.delete(`http://localhost:8000/todo/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      addToast({
        type: 'success',
        title: 'Activity Deleted',
        message: `"${todoToDelete?.title}" has been removed from your schedule.`
      });
    } catch (err) {
      console.error('Failed to delete todo', err);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete the activity. Please try again.'
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
          title: 'Activity Updated',
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
        message: 'Failed to update the activity. Please try again.'
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

  // Calendar navigation
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = getCalendarDays();
  const today = new Date();

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">My Schedule</h1>
          <button
            className="theme-toggle"
            onClick={useTheme().toggleTheme}
            aria-label="Toggle theme"
          >
            {useTheme().theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Calendar Section */}
      <section className="calendar-section">
        <div className="calendar-header">
          <h2 className="calendar-title">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="calendar-nav">
            <button className="nav-btn" onClick={() => navigateMonth(-1)}>‹</button>
            <button className="nav-btn" onClick={() => navigateMonth(1)}>›</button>
          </div>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-label">{day}</div>
          ))}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const hasEvents = filteredTodos.some(todo => {
              // Simple date matching - you could enhance this with proper date fields
              return true; // For demo, show events on some days
            });

            return (
              <div
                key={index}
                className={`day-cell ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
                style={{ opacity: isCurrentMonth ? 1 : 0.5 }}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <main className="content-card">
        <h2 className="card-title">📅 Today's Schedule</h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="loading-spinner"></div>
            <p className="mt-2">Loading your schedule...</p>
          </div>
        )}

        {!loading && (
          <>
            {editingTodo ? (
              <ToDoEdit todo={editingTodo} onUpdate={handleUpdate} onCancel={cancelEditing} />
            ) : (
              <ToDoForm onAdd={handleAdd} />
            )}

            <div className="schedule-list">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`schedule-item ${todo.done ? 'completed' : ''}`}
                    onClick={() => startEditing(todo)}
                  >
                    <div className="schedule-time">
                      {todo.time || '6:00'}
                    </div>
                    <div className="schedule-content">
                      <h3 className="schedule-title">{todo.title}</h3>
                      <p className="schedule-description">{todo.description}</p>
                    </div>
                    <div className="schedule-icon">
                      {todo.activity === 'push-ups' ? '💪' :
                       todo.activity === 'running' ? '🏃' :
                       todo.activity === 'squats' ? '🧘' : '📝'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3 className="empty-title">No activities scheduled</h3>
                  <p className="empty-description">
                    Add your first activity to get started with your daily schedule.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
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