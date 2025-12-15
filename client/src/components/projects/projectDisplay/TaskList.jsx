import React, { useState, useContext } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaComment,
  FaTasks,
  FaCheckCircle,
  FaPlayCircle,
  FaPauseCircle,
} from "react-icons/fa";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { ThemeContext } from "../../../context/ThemeContext";

const TaskList = () => {
  const { project, setProject } = useContext(ProjectContext);
  const { isDark } = useContext(ThemeContext); 
  const tasks = project?.tasks || [];
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "todo":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "in-progress":
        return <FaPlayCircle className="text-blue-500" />;
      case "todo":
        return <FaPauseCircle className="text-yellow-500" />;
      default:
        return <FaTasks className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const calculateProgress = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.status === "completed" ? 100 : 0;
    }
    const completed = task.subtasks.filter(
      (st) => st.status === "completed"
    ).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark
              ? "bg-gray-700/20"
              : "bg-gradient-to-r from-blue-100 to-cyan-100"
          }`}
        >
          <FaTasks
            className={`w-10 h-10 ${isDark ? "text-white" : "text-blue-500"}`}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first task to get started
        </p>
        <button
          onClick={() => {
            /* open create task modal here */
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium"
        >
          <FaPlus /> Create First Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const progress = calculateProgress(task);
        const isExpanded = expandedTasks[task._id];

        return (
          <div
            key={task._id}
            className={`rounded-xl border transition-all duration-300 hover:shadow-md ${
              isDark
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Task Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => toggleTaskExpansion(task._id)}
                      className={`p-1 rounded transition-colors ${
                        isDark
                          ? "hover:bg-gray-700 text-gray-400"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isExpanded ? (
                        <FaChevronUp className="w-4 h-4" />
                      ) : (
                        <FaChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <FaExclamationCircle className="inline mr-1" />
                      {task.priority}
                    </span>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status?.replace("-", " ") || "Todo"}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 ml-9">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      /* open edit modal */
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-blue-400 hover:text-blue-300"
                        : "hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                    }`}
                    title="Edit Task"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      /* delete task */
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-white hover:text-red-400"
                        : "hover:bg-gray-100 text-red-600 hover:text-red-800"
                    }`}
                    title="Delete Task"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div
                className={`px-4 pb-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {/* Subtasks, tags, etc. can go here */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
