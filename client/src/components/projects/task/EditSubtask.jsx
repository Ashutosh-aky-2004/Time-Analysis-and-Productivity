import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "../../../context/ThemeContext";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { useUpdateSubtask } from "../../../hooks/projects/task/useUpdateSubtask";
import { useLogSubtaskHours } from "../../../hooks/projects/task/useLogSubtaskHours";
import { FaClock, FaEdit, FaSave, FaSpinner } from "react-icons/fa";

const EditSubtask = ({ isOpen, onClose, subtaskToEdit, parentTaskId }) => {
  const { isDark } = useContext(ThemeContext);
  const { project } = useContext(ProjectContext);
  const { updateSubtask, loading: updating } = useUpdateSubtask();
  const { logSubtaskHours, loading: logging } = useLogSubtaskHours();

  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'time'

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    estimatedHours: 0,
    assignedTo: "",
  });

  const [logData, setLogData] = useState({
    hours: 0,
    notes: "",
  });

  // Initialize form data when subtask changes
  useEffect(() => {
    if (subtaskToEdit) {
      setFormData({
        title: subtaskToEdit.title || "",
        estimatedHours: subtaskToEdit.estimatedHours || 0,
        assignedTo: subtaskToEdit.assignedTo || "",
      });
      // Reset log data
      setLogData({
        hours: 0,
        notes: "",
      });
      setActiveTab("details");
    }
  }, [subtaskToEdit]);

  if (!isOpen || !subtaskToEdit) return null;

  // Get project team members for assignee dropdown
  // Flatten all members (managing users + team members) and remove duplicates if any
  const managers = project?.managingUserId || [];
  const team = project?.teamMembers || [];
  
  // Combine and deduplicate by ID
  const allMembers = [...managers, ...team].filter(
    (member, index, self) =>
      index === self.findIndex((m) => (m._id || m) === (member._id || member))
  );

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubtask(parentTaskId, subtaskToEdit._id, formData);
      onClose();
    } catch (error) {
      // Error is handled in hook (logged)
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await logSubtaskHours(parentTaskId, subtaskToEdit._id, {
        hours: Number(logData.hours),
        notes: logData.notes,
      });
      onClose();
    } catch (error) {
      // Error is handled in hook
    }
  };

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
            Manage Subtask
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

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? `border-b-2 border-blue-500 ${isDark ? "text-blue-400" : "text-blue-600"}`
                : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FaEdit /> Update Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("time")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "time"
                ? `border-b-2 border-blue-500 ${isDark ? "text-blue-400" : "text-blue-600"}`
                : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FaClock /> Log Time
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "details" ? (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleDetailsChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  placeholder="Subtask title"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleDetailsChange}
                  min="0"
                  step="0.5"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleDetailsChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                >
                  <option value="">Unassigned</option>
                  {allMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                       {member.firstName} {member.lastName} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className={`p-3 rounded-lg text-sm mb-4 ${
                isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700"
              }`}>
                <p>Current logged hours: <strong>{subtaskToEdit.loggedHours || 0}h</strong></p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Add Hours
                </label>
                <input
                  type="number"
                  name="hours"
                  value={logData.hours}
                  onChange={handleLogChange}
                  min="0.1"
                  step="0.1"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Work Notes
                </label>
                <textarea
                  name="notes"
                  value={logData.notes}
                  onChange={handleLogChange}
                  rows="3"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none`}
                  placeholder="Describe your work..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logging}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logging ? <FaSpinner className="animate-spin" /> : <FaClock />}
                  Log Time
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSubtask;
