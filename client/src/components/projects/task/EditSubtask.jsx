import React, { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "../../../context/ThemeContext";

const EditSubtask = ({ isOpen, onClose, subtaskToEdit }) => {
  const { isDark } = useContext(ThemeContext);

  if (!isOpen || !subtaskToEdit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Edit Subtask
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div
            className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
              isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-500"
            }`}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Editing: {subtaskToEdit.title}
          </h3>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            This feature is currently under construction.
            <br />
            API integration coming soon.
          </p>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 flex justify-end gap-3 ${
            isDark ? "bg-gray-900/50" : "bg-gray-50"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubtask;
