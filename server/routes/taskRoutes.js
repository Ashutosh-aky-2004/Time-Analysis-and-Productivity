import express from "express";
import {
  createQuickTask,
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
  getTasks,
} from "../controllers/taskController.js";
import {
  addSubtask,
  deleteSubtask,
  logSubtaskHours,
  updateSubtask,
} from "../controllers/subTaskControllers.js";
import {
  addComment,
  addCommentReaction,
  addReply,
  addReplyReaction,
  getSubtaskComments,
} from "../controllers/commentControllers.js";

const router = express.Router();

// task creation API
router.post("/", createTask);
router.post("/quick", createQuickTask);
router.put("/:taskId", updateTask);
router.put("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", deleteTask);

// Sub Task API
router.get("/", getTasks);
router.post("/:taskId/subtasks", addSubtask);
router.put("/:taskId/subtasks/:subtaskId", updateSubtask);
router.delete("/:taskId/subtasks/:subtaskId", deleteSubtask);
router.post("/:taskId/subtasks/:subtaskId/time", logSubtaskHours);

// task comment API
router.post("/:taskId/subtasks/:subtaskId/comments", addComment);
router.post(
  "/:taskId/subtasks/:subtaskId/comments/:commentId/replies",
  addReply
);
router.get("/:taskId/subtasks/:subtaskId/comments", getSubtaskComments);
router.post(
  "/:taskId/subtasks/:subtaskId/comments/:commentId/reactions",
  addCommentReaction
);
router.post(
  "/:taskId/subtasks/:subtaskId/comments/:commentId/replies/:replyId/reactions",
  addReplyReaction
);

// pending works
// ⬜ GET /api/tasks           - Get all tasks (with filters)
// ⬜ GET /api/tasks/:id       - Get single task with subtasks/comments

export default router;
