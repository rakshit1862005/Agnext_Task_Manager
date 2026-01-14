import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, Clock, AlertCircle, Calendar, Tag, Edit2, Trash2 } from 'lucide-react';
import TaskFormModal from './TaskFormModal';
import { apiFetch } from "../../services/api";

const TasksPage = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, onMarkComplete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getPriorityScore = (priority) => {
    return { High: 3, Medium: 2, Low: 1 }[priority] || 0;
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const aDays = getDaysRemaining(a.dueDate);
      const bDays = getDaysRemaining(b.dueDate);
      const aPriority = getPriorityScore(a.priority);
      const bPriority = getPriorityScore(b.priority);

      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;

      if (aPriority !== bPriority) return bPriority - aPriority;

      if (aDays !== null && bDays !== null) return aDays - bDays;
      if (aDays !== null) return -1;
      if (bDays !== null) return 1;

      return 0;
    });

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and track all your tasks</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowTaskForm(true);
          }}
          className="btn-new-task"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.map(task => {
          const daysRemaining = getDaysRemaining(task.dueDate);
          const isOverdue = daysRemaining !== null && daysRemaining < 0 && task.status !== 'Completed';
          
          return (
            <div
              key={task.id}
              className={`task-item ${
                task.status === 'Completed' ? 'completed' : 
                isOverdue ? 'overdue' : ''
              }`}
            >
              <div className="task-content">
                <div 
                  className={`task-checkbox ${task.status === 'Completed' ? 'completed' : ''}`}
                  onClick={() => task.status !== 'Completed' && onMarkComplete(task.id)}
                >
                  {task.status === 'Completed' && <CheckCircle2 size={16} color="white" />}
                </div>

                <div className="task-body">
                  <div className="task-header">
                    <div style={{ flex: 1 }}>
                      <h3 className={`task-title ${task.status === 'Completed' ? 'completed' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="task-badges">
                    <span className={`badge priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`badge status-${task.status.toLowerCase().replace(' ', '')}`}>
                      {task.status === 'Completed' && <CheckCircle2 size={12} />}
                      {task.status === 'In Progress' && <Clock size={12} />}
                      {task.status === 'Pending' && <AlertCircle size={12} />}
                      {task.status}
                    </span>
                    {task.category && (
                      <span className="badge category">
                        <Tag size={12} />
                        {task.category}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={`badge due-date ${
                        isOverdue ? 'overdue' : 
                        daysRemaining !== null && daysRemaining <= 3 ? 'urgent' : ''
                      }`}>
                        <Calendar size={12} />
                        {isOverdue ? `Overdue ${Math.abs(daysRemaining)} days` :
                         daysRemaining === 0 ? 'Due today' :
                         daysRemaining === 1 ? 'Due tomorrow' :
                         daysRemaining !== null ? `${daysRemaining} days left` :
                         new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setShowTaskForm(true);
                      }}
                      className="btn-edit"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <AlertCircle className="empty-icon" size={48} />
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-description">Create your first task to get started</p>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="btn-new-task"
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>
        )}
      </div>

      {showTaskForm && (
        <TaskFormModal
          task={editingTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSubmit={(taskData) => {
            if (editingTask) {
              onUpdateTask({ ...taskData, id: editingTask.id });
            } else {
              onAddTask(taskData);
            }
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TasksPage;