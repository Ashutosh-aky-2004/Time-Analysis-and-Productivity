import express from "express";
import {
  getUserTasks,
  createUserTask,
  updateUserTask,
  updateTaskProgress,
  getTaskAnalytics,
} from "../../controllers/personal/userTask.js";

const router = express.Router();

router.route("/").get(getUserTasks).post(createUserTask);

router.route("/:taskId").put(updateUserTask);

router.route("/:taskId/progress").put(updateTaskProgress);

router.route("/:taskId/analytics").get(getTaskAnalytics);

export default router;
