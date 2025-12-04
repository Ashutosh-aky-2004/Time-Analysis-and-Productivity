import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../redux/projects/projectSlice";

const FilterBar = ({ onCreateProject }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.project.filters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleStatusChange = (status) => {
    dispatch(setFilters({ status }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sortBy: e.target.value }));
  };

  return (
    <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Projects
        </h1>

        {/* Right Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="duration">Duration</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* More Filters */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 text-sm font-medium bg-red-500 rounded-lg text-white"
          >
            {showAdvancedFilters ? "Hide Filters" : "More Filters"}
          </button>

          {/* NEW — Create Button */}
          <button
            onClick={onCreateProject}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Create Project
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      {/* Advanced Filter */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">Status:</span>
            {["all", "in-progress", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filters.status === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {status === "in-progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
