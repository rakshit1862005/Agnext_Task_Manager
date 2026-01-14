import React, { useState, useEffect } from "react";
import { CheckCircle2, LogOut, Menu } from "lucide-react";
import AuthPage from "./components/auth/AuthPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import TasksPage from "./components/task/TasksPage";
import { apiFetch } from "./services/api";

import "./styles/global.css";
import "./components/auth/AuthPage.css";
import "./styles/header.css";
import "./components/dashboard/DashboardPage.css";
import "./components/task/TasksPage.css";
import "./components/task/TaskFormModal.css";


const normalizeTask = (task) => ({
  id: task.id || task._id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  category: task.category,
  createdAt: task.createdAt,   // ✅ REQUIRED
  updatedAt: task.updatedAt,   // ✅ SAFE
});


const TaskManagementApp = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Restore session from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "user" }); // minimal restore
    }
  }, []);

  // Fetch tasks after login (NORMALIZED)
  useEffect(() => {
    if (!user) return;

    apiFetch("/tasks")
      .then((data) => setTasks(data.map(normalizeTask)))
      .catch(console.error);
  }, [user]);

  // Add task (NORMALIZED)
  const handleAddTask = async (taskData) => {
    const createdRaw = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });

    const created = normalizeTask(createdRaw);
    setTasks((prev) => [...prev, created]);
  };

  // Update task (INSTANT UI UPDATE)
  const handleUpdateTask = async (task) => {
    const id = task.id || task._id;
    if (!id) return;

    const updatedRaw = await apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category,
      }),
    });

    const updated = normalizeTask(updatedRaw);

    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  // 🗑 Delete task (INSTANT UI UPDATE)
  const handleDeleteTask = async (id) => {
    if (!id) return;

    await apiFetch(`/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Mark task complete (INSTANT UI UPDATE)
  const handleMarkComplete = async (id) => {
    if (!id) return;

    const updatedRaw = await apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Completed" }),
    });

    const updated = normalizeTask(updatedRaw);

    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
    setCurrentPage("dashboard");
  };

  // Auth gate
  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-container">
          <div className="header-brand">
            <div className="header-logo">
              <CheckCircle2 size={24} color="white" />
            </div>
            <h1 className="header-title">TaskFlow Pro</h1>
          </div>

          <nav
            className="header-nav"
            style={{ display: showMobileMenu ? "none" : undefined }}
          >
            <button
              onClick={() => setCurrentPage("dashboard")}
              className={`nav-btn ${
                currentPage === "dashboard" ? "active" : ""
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage("tasks")}
              className={`nav-btn ${
                currentPage === "tasks" ? "active" : ""
              }`}
            >
              Tasks
            </button>
          </nav>

          <div
            className="header-user"
            style={{ display: showMobileMenu ? "none" : undefined }}
          >
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-btn"
          >
            <Menu size={24} />
          </button>
        </div>

        {showMobileMenu && (
          <div className="mobile-menu">
            <button
              onClick={() => {
                setCurrentPage("dashboard");
                setShowMobileMenu(false);
              }}
              className="nav-btn"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentPage("tasks");
                setShowMobileMenu(false);
              }}
              className="nav-btn"
            >
              Tasks
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="main-content">
        {currentPage === "dashboard" && <DashboardPage tasks={tasks} />}
        {currentPage === "tasks" && (
          <TasksPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onMarkComplete={handleMarkComplete}
          />
        )}
      </main>
    </div>
  );
};

export default TaskManagementApp;
