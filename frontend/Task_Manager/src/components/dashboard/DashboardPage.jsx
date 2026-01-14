import React from 'react';
import { BarChart3, CheckCircle2, Clock, AlertCircle, Target, CalendarDays, PieChart, Calendar, Award } from 'lucide-react';

const DashboardPage = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    highPriority: tasks.filter(t => t.priority === 'High').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === 'Completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length
  };

  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

  const priorityBreakdown = {
    high: tasks.filter(t => t.priority === 'High').length,
    medium: tasks.filter(t => t.priority === 'Medium').length,
    low: tasks.filter(t => t.priority === 'Low').length
  };

  // --- Category Logic for Pie Chart ---
  const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
  
  const categoryData = Object.entries(tasks.reduce((acc, task) => {
    if (task.category) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {})).map(([name, count], index) => ({
    name,
    count,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }));

  const totalCategorized = categoryData.reduce((sum, item) => sum + item.count, 0);
  
  // Generate Conic Gradient for Pie Chart
  let currentAngle = 0;
  const pieGradient = categoryData.length > 0 
    ? `conic-gradient(${categoryData.map(item => {
        const percentage = (item.count / totalCategorized) * 100;
        const start = currentAngle;
        currentAngle += percentage;
        return `${item.color} ${start}% ${currentAngle}%`;
      }).join(', ')})`
    : 'conic-gradient(#e2e8f0 0% 100%)';


  // --- Heatmap Logic ---
  // Generate last 150 days (approx 5 months)
  const heatmapDays = [...Array(150)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (149 - i));
    return date.toISOString().split('T')[0];
  });

  // Group completed tasks by date for intensity
  const completedByDate = tasks
    .filter(t => t.status === 'Completed' && t.updatedAt)
    .reduce((acc, t) => {
      const date = t.updatedAt.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const maxDailyTasks = Math.max(...Object.values(completedByDate), 1);

  const getIntensityClass = (count) => {
    if (!count) return 'level-0';
    const ratio = count / maxDailyTasks;
    if (ratio <= 0.25) return 'level-1';
    if (ratio <= 0.50) return 'level-2';
    if (ratio <= 0.75) return 'level-3';
    return 'level-4';
  };

  // Group days into weeks for the grid layout
  const heatmapWeeks = [];
  let currentWeek = [];
  
  heatmapDays.forEach((dateString) => {
    const dateObj = new Date(dateString);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday
    
    // Start a new column if it's Sunday or first iteration
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      heatmapWeeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push({
      date: dateString,
      count: completedByDate[dateString] || 0
    });
  });
  if (currentWeek.length > 0) heatmapWeeks.push(currentWeek);


  // --- Upcoming Tasks Logic ---
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);
  
  const upcomingTasks = tasks
    .filter(t => {
      if (!t.dueDate || t.status === 'Completed') return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate <= next7Days;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Track your productivity and task completion</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Tasks</span>
            <BarChart3 size={20} color="#2563eb" />
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-footer">All tasks</div>
        </div>

        <div className="stat-card gradient-green">
          <div className="stat-header">
            <span className="stat-label green">Completed</span>
            <CheckCircle2 size={20} color="#16a34a" />
          </div>
          <div className="stat-value green">{stats.completed}</div>
          <div className="stat-footer green">{completionRate}% completion rate</div>
        </div>

        <div className="stat-card gradient-blue">
          <div className="stat-header">
            <span className="stat-label blue">In Progress</span>
            <Clock size={20} color="#2563eb" />
          </div>
          <div className="stat-value blue">{stats.inProgress}</div>
          <div className="stat-footer blue">Active tasks</div>
        </div>

        <div className="stat-card gradient-red">
          <div className="stat-header">
            <span className="stat-label red">Overdue</span>
            <AlertCircle size={20} color="#dc2626" />
          </div>
          <div className="stat-value red">{stats.overdue}</div>
          <div className="stat-footer red">Need attention</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <Target size={20} color="#334155" />
            <h2 className="chart-title">Priority Breakdown</h2>
          </div>
          <div>
            {/* Priority Bars (Unchanged) */}
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">High Priority</span>
                <span className="progress-value red">{priorityBreakdown.high}</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar red"
                  style={{ width: `${stats.total > 0 ? (priorityBreakdown.high / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Medium Priority</span>
                <span className="progress-value yellow">{priorityBreakdown.medium}</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar yellow"
                  style={{ width: `${stats.total > 0 ? (priorityBreakdown.medium / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Low Priority</span>
                <span className="progress-value green">{priorityBreakdown.low}</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar green"
                  style={{ width: `${stats.total > 0 ? (priorityBreakdown.low / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <CalendarDays size={20} color="#334155" />
            <h2 className="chart-title">Activity Heatmap</h2>
          </div>
          <div className="heatmap-container">
            <div className="heatmap-grid">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="heatmap-week">
                  {week.map((day, dIdx) => (
                    <div 
                      key={dIdx}
                      className={`heatmap-day ${getIntensityClass(day.count)}`}
                      title={`${day.date}: ${day.count} tasks completed`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="heatmap-day level-0"></div>
              <div className="heatmap-day level-2"></div>
              <div className="heatmap-day level-4"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <PieChart size={20} color="#334155" />
            <h2 className="chart-title">Tasks by Category</h2>
          </div>
          
          <div className="pie-chart-container">
            {/* The Pie Chart Visual */}
            <div 
              className="pie-chart"
              style={{ background: pieGradient }}
            >
              <div className="pie-hole">
                <span className="pie-total">{totalCategorized}</span>
                <span className="pie-label">Tasks</span>
              </div>
            </div>

            {/* The Legend List */}
            <div className="category-list">
              {categoryData.length > 0 ? (
                categoryData.map((cat, idx) => (
                  <div key={idx} className="category-item">
                    <div className="category-left">
                      <div 
                        className="category-dot" 
                        style={{ background: cat.color }}
                      />
                      <span className="category-name">{cat.name}</span>
                    </div>
                    <span className="category-count">{cat.count}</span>
                  </div>
                ))
              ) : (
                <p className="empty-text">No categories yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <Calendar size={20} color="#334155" />
            <h2 className="chart-title">Upcoming This Week</h2>
          </div>
          <div className="upcoming-list">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => {
                const daysRemaining = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={task.id} className="upcoming-item">
                    <div className="upcoming-info">
                      <p className="upcoming-title">{task.title}</p>
                      <p className="upcoming-category">{task.category}</p>
                    </div>
                    <span className={`upcoming-days ${
                      daysRemaining <= 1 ? 'red' : 
                      daysRemaining <= 3 ? 'yellow' : 'green'
                    }`}>
                      {daysRemaining === 0 ? 'Today' : 
                       daysRemaining === 1 ? 'Tomorrow' : 
                       `${daysRemaining} days`}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="empty-text">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>

      <div className="performance-banner">
        <div className="performance-header">
          <Award size={24} />
          <h2 className="performance-title">Performance Summary</h2>
        </div>
        <div className="performance-stats">
          <div>
            <p className="performance-stat-label">Completion Rate</p>
            <p className="performance-stat-value">{completionRate}%</p>
          </div>
          <div>
            <p className="performance-stat-label">Active Tasks</p>
            <p className="performance-stat-value">{stats.inProgress + stats.pending}</p>
          </div>
          <div>
            <p className="performance-stat-label">Tasks This Month</p>
            <p className="performance-stat-value">{tasks.filter(t => {
              const created = new Date(t.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;