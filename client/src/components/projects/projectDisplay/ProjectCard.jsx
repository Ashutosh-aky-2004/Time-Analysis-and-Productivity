import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEye, FiTrash2 } from "react-icons/fi"; 
import { BsFolder } from "react-icons/bs";

import { deleteProject } from "../../../redux/projects/projectThunks";

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      dispatch(deleteProject(project._id)); // assuming project._id
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BsFolder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  project.progress === "in-progress"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                }`}
              >
                {project.progress}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Managed by {project.manager}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/project-details/${project._id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {project.description}
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Start Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.startDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              End Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.endDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Duration
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.totalDuration} mins
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Team Members
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.teamMembers?.length || 0} active
            </p>
            {project.suspendedMembers?.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {project.suspendedMembers.length} suspended
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Progress
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  project.progress === "completed"
                    ? "bg-green-500 dark:bg-green-400 w-full"
                    : "bg-blue-500 dark:bg-blue-400 w-3/4"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
