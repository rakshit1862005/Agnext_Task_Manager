const tasks = require("../data/tasks");

exports.getTasks = (req, res) => {
  const userTasks = tasks.filter(
    task => task.userId === req.user.userId
  );
  res.json(userTasks);
};

exports.createTask = (req, res) => {
  const { title, description, priority, status, category, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    description: description || "",
    priority: priority || "Low",
    status: status || "Pending",
    category: category || "",
    dueDate: dueDate || null,
    userId: req.user.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const task = tasks.find(
    t => t.id === req.params.id && t.userId === req.user.userId
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  Object.assign(task, req.body, {
    updatedAt: new Date().toISOString()
  });

  res.json(task);
};

exports.deleteTask = (req, res) => {
  const index = tasks.findIndex(
    t => t.id === req.params.id && t.userId === req.user.userId
  );

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted" });
};
