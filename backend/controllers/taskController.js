const Task = require("../models/Task");

/* -------------------- Get all tasks for user -------------------- */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* -------------------- Create task -------------------- */
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, status, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      priority: priority || "Low",
      status: status || "Pending",
      category: category || "",
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

/* -------------------- Update task -------------------- */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

/* -------------------- Delete task -------------------- */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

/* -------------------- Get task statistics (BONUS Task) -------------------- */
exports.getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "Completed").length,
      inProgress: tasks.filter(t => t.status === "In Progress").length,
      pending: tasks.filter(t => t.status === "Pending").length,
      highPriority: tasks.filter(t => t.priority === "High").length,
      overdue: tasks.filter(t => {
        if (!t.dueDate || t.status === "Completed") return false;
        return new Date(t.dueDate) < new Date();
      }).length
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch task statistics" });
  }
};
