import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ToDoEdit({ todo, onUpdate, onCancel }) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [activity, setActivity] = useState(todo.activity || '');
  const [startTime, setStartTime] = useState(todo.time ? todo.time.split(' - ')[0] : '6:00');
  const [endTime, setEndTime] = useState(todo.time ? todo.time.split(' - ')[1] : '7:00');
  const [done, setDone] = useState(todo.done);

  const activities = [
    { id: 'push-ups', name: 'Push-ups', icon: '💪' },
    { id: 'running', name: 'Running', icon: '🏃' },
    { id: 'squats', name: 'Squats', icon: '🧘' },
    { id: 'other', name: 'Other', icon: '📝' }
  ];

  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description);
    setActivity(todo.activity || '');
    setStartTime(todo.time ? todo.time.split(' - ')[0] : '6:00');
    setEndTime(todo.time ? todo.time.split(' - ')[1] : '7:00');
    setDone(todo.done);
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const todoData = {
        title,
        description,
        done,
        activity,
        time: `${startTime} - ${endTime}`
      };
      const response = await axios.put(`http://localhost:8000/todo/${todo.id}`, todoData);
      onUpdate(todo.id, response.data);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="form-section">
      <h2 className="card-title">✏️ Edit Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Activity Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter activity title..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter activity description..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Activity Type</label>
          <div className="activity-grid">
            {activities.map((act) => (
              <button
                key={act.id}
                type="button"
                className={`activity-option ${activity === act.id ? 'selected' : ''}`}
                onClick={() => setActivity(act.id)}
              >
                <div className="activity-icon">{act.icon}</div>
                {act.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Time Slot</label>
          <div className="time-selector">
            <input
              type="time"
              className="time-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <span style={{ alignSelf: 'center', color: '#666', fontWeight: '600' }}>to</span>
            <input
              type="time"
              className="time-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            id="done"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
          <label htmlFor="done" style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>
            Mark as completed
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            💾 Update Activity
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ToDoEdit;