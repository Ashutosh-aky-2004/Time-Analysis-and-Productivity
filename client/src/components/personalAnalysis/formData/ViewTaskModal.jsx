import React from "react";
import {
  X,
  Calendar,
  Clock,
  Tag,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ViewTaskModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-white/10 p-8 transform transition-all animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                task.priority === "critical"
                  ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                  : task.priority === "high"
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                  : task.priority === "medium"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
              }`}
            >
              {task.priority}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">
              {task.category?.replace("_", " ")}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {task.title}
          </h2>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                task.status === "completed" ? "bg-green-500" : "bg-blue-500"
              }`}
            ></div>
            <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
              {task.status?.replace("_", " ")}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created on {formatDate(task.createdAt)}
          </div>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-white dark:bg-black/20 p-4 rounded-lg border border-gray-100 dark:border-white/5">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Time Tracking</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {task.actualDuration || 0}
                </span>
                <span className="text-sm text-gray-500 mb-1">
                  / {task.estimatedDuration} min
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-black/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      ((task.actualDuration || 0) / task.estimatedDuration) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Deadline</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-semibold ${
                    task.isOverdue
                      ? "text-red-500"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {task.deadline ? formatDate(task.deadline) : "No Deadline"}
                </span>
                {task.isOverdue && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Completion Stats (if completed) */}
          {task.status === "completed" && (
            <div className="border-t border-gray-100 dark:border-white/10 pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" /> Completion Review
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-500/20">
                  <span className="text-sm text-green-600 dark:text-green-400 block mb-1">
                    Productivity Score
                  </span>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {task.productivityScore || "N/A"}
                  </span>
                </div>
                {/* Could add more stats here from analytics if available */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
