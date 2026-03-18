import React from 'react';

function TodoList({ todos, onDelete, onUpdate, onEdit, searchTerm }) {
  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleUpdate = (id, updatedTodo) => {
    onUpdate(id, updatedTodo);
  };

  const handleEdit = (todo) => {
    if (onEdit) onEdit(todo);
  };

  return (
    <div className="container mt-4">
      <h2>📋 Todo List</h2>
      {todos.length === 0 ? (
        <div className="text-center py-5">
          <div className="empty-state-icon">📝</div>
          <h4 className="text-muted mt-3">
            {searchTerm ? 'No todos match your search' : 'No todos yet'}
          </h4>
          <p className="text-muted">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first todo above to get started!'}
          </p>
        </div>
      ) : (
        <ul className="list-group">
          {todos.map(todo => (
            <li key={todo.id} className={`list-group-item d-flex justify-content-between align-items-center ${todo.done ? 'done-todo' : ''}`}>
              <div className="todo-content">
                <h5 className={todo.done ? 'text-decoration-line-through text-muted' : ''}>{todo.title}</h5>
                <p className={todo.done ? 'text-decoration-line-through text-muted' : ''}>{todo.description}</p>
                <small className={`status-badge ${todo.done ? 'status-done' : 'status-pending'}`}>
                  {todo.done ? '✓ Done' : '⏳ Pending'}
                </small>
              </div>
              <div className="todo-actions">
                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(todo)}>
                  ✏️ Edit
                </button>
                <button className={`btn btn-sm me-2 ${todo.done ? 'btn-outline-success' : 'btn-warning'}`} onClick={() => handleUpdate(todo.id, { ...todo, done: !todo.done })}>
                  {todo.done ? '↩️ Undo' : '✅ Mark Done'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(todo.id)}>
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;