import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../redux/projects/projectSlice";

const FilterBar = () => {
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
          All Members
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="duration">Duration</option>
              <option value="name">Name</option>
            </select>
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700"
          >
            {showAdvancedFilters ? "Hide Filters" : "More Filters"}
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {showAdvancedFilters && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status:
            </span>
            <div className="flex flex-wrap gap-2">
              {["all", "in-progress", "completed"].map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    filters.status === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => handleStatusChange(status)}
                >
                  {status === "in-progress"
                    ? "In Progress"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
