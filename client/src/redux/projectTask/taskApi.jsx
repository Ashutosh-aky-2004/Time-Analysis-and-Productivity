import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL + "/api";

// helper for auth header
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const taskApi = {
  // Task operations
  getProjectTasks: (projectId) =>
    axios.get(`${API_BASE}/projects/${projectId}/tasks`, authHeader()),

  getTask: (taskId) => axios.get(`${API_BASE}/tasks/${taskId}`, authHeader()),

  createTask: (taskData) =>
    axios.post(`${API_BASE}/tasks`, taskData, authHeader()),

  createQuickTask: (title, projectId) =>
    axios.post(`${API_BASE}/tasks/quick`, { title, projectId }, authHeader()),

  updateTask: (taskId, updates) =>
    axios.put(`${API_BASE}/tasks/${taskId}`, updates, authHeader()),

  updateTaskStatus: (taskId, status) =>
    axios.put(`${API_BASE}/tasks/${taskId}/status`, { status }, authHeader()),

  deleteTask: (taskId) =>
    axios.delete(`${API_BASE}/tasks/${taskId}`, authHeader()),

  // Subtask operations
  addSubtask: (taskId, subtaskData) =>
    axios.post(
      `${API_BASE}/tasks/${taskId}/subtasks`,
      subtaskData,
      authHeader()
    ),

  updateSubtask: (taskId, subtaskId, updates) =>
    axios.put(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`,
      updates,
      authHeader()
    ),

  deleteSubtask: (taskId, subtaskId) =>
    axios.delete(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`,
      authHeader()
    ),

  // Time logging
  logHours: (taskId, subtaskId, hoursData) =>
    axios.post(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/time`,
      hoursData,
      authHeader()
    ),

  // Comments & Reactions
  addComment: (taskId, subtaskId, commentData) =>
    axios.post(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/comments`,
      commentData,
      authHeader()
    ),

  addReply: (taskId, subtaskId, commentId, replyData) =>
    axios.post(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/comments/${commentId}/replies`,
      replyData,
      authHeader()
    ),

  addCommentReaction: (taskId, subtaskId, commentId, reactionType) =>
    axios.post(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/comments/${commentId}/reactions`,
      { type: reactionType },
      authHeader()
    ),

  addReplyReaction: (taskId, subtaskId, commentId, replyId, reactionType) =>
    axios.post(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/comments/${commentId}/replies/${replyId}/reactions`,
      { type: reactionType },
      authHeader()
    ),

  getComments: (taskId, subtaskId) =>
    axios.get(
      `${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/comments`,
      authHeader()
    ),
};

export { taskApi };
