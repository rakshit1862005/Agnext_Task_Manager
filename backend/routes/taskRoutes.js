const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require("../controllers/taskController");

/* -------------------- Protected routes -------------------- */
router.use(auth);

/* -------------------- BONUS: Task statistics -------------------- */
router.get("/stats", getTaskStats);

/* -------------------- Task CRUD -------------------- */
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
