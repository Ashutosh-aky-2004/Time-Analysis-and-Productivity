import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  getStatusColor,
  getPriorityColor,
} from "../../../constants/subTaskConstants";

const TaskModalDetails = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;
  console.log(task)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 hover:text-red-500"
          onClick={onClose}
        >
          <AiOutlineClose size={28} />
        </button>

        {/* Task Header */}
        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">
          {task.title}
        </h2>

        {/* Task Badges */}
        <div className="flex flex-wrap gap-3 mb-5">
          <span
            className={`px-4 py-1 rounded-full font-semibold ${getStatusColor(
              task.status
            )}`}
          >
            Status: {task.status}
          </span>
          <span
            className={`px-4 py-1 rounded-full font-semibold ${getPriorityColor(
              task.priority
            )}`}
          >
            Priority: {task.priority}
          </span>
        </div>

        {/* Task Details */}
        <div className="mb-6 space-y-3 text-gray-800 dark:text-gray-200">
          <p>
            <strong>Description:</strong> {task.description || "No description"}
          </p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {task.assignedTo?.firstName || "Unassigned"}
          </p>
          <p>
            <strong>Estimated Hours:</strong> {task.estimatedHours || 0} |{" "}
            <strong>Logged Hours:</strong> {task.loggedHours || 0}
          </p>
        </div>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Subtasks
            </h3>
            <div className="space-y-3">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-700 hover:scale-105 transition-transform"
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-lg text-gray-900 dark:text-white">
                      {subtask.title}
                    </strong>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        subtask.status
                      )}`}
                    >
                      {subtask.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estimated: {subtask.estimatedHours || 0}h | Logged:{" "}
                    {subtask.loggedHours || 0}h
                  </p>
                  {subtask.workNotes && (
                    <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">
                      {subtask.workNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModalDetails;
