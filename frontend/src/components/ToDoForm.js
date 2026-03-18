import React, { useState } from 'react';
import axios from 'axios';

function ToDoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activity, setActivity] = useState('');
  const [startTime, setStartTime] = useState('6:00');
  const [endTime, setEndTime] = useState('7:00');
  const [done, setDone] = useState(false);

  const activities = [
    { id: 'push-ups', name: 'Push-ups', icon: '💪' },
    { id: 'running', name: 'Running', icon: '🏃' },
    { id: 'squats', name: 'Squats', icon: '🧘' },
    { id: 'other', name: 'Other', icon: '📝' }
  ];

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
      const response = await axios.post('http://localhost:8000/todo/', todoData);
      onAdd(response.data);
      // Reset form
      setTitle('');
      setDescription('');
      setActivity('');
      setStartTime('6:00');
      setEndTime('7:00');
      setDone(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className="form-section">
      <h2 className="card-title">➕ Add New Activity</h2>
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

        <button type="submit" className="btn-primary">
          🚀 Add to Schedule
        </button>
      </form>
    </div>
  );
}

export default ToDoForm;