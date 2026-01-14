const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user.userId,
  });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { ...req.body },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
};
