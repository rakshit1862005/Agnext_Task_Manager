import React, { useState } from 'react';
import { X } from 'lucide-react';

const TaskFormModal = ({ task, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'Pending',
    dueDate: task?.dueDate || ''
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Task Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Work, Personal"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-submit">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;