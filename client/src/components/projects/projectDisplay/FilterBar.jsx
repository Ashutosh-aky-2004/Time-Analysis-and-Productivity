import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../redux/projects/projectSlice";
import { FiFilter, FiPlus, FiSearch } from "react-icons/fi";
import { getPriorityButtonStyle } from "../../../constants/projectConstants";

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

  const handlePriorityChange = (priority) => {
    dispatch(setFilters({ priority }));
  };

  const handleTagFilter = (tag) => {
    dispatch(setFilters({ tag }));
  };

  const handleClearFilters = () => {
    dispatch(
      setFilters({
        status: "all",
        priority: "all",
        tag: "",
        search: "",
      })
    );
  };

  // Status options based on your project model
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Started", label: "Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  // Priority options
  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "duration", label: "Longest Duration" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "priority", label: "Priority" },
  ];

  return (
    <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-all duration-200">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            All Projects
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage and filter your projects
          </p>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort"
              className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-40"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-900 dark:text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <FiFilter className="w-4 h-4" />
            {showAdvancedFilters ? "Hide Filters" : "More Filters"}
          </button>

          {/* Create Project Button */}
          <button
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by name, description, or manager..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Advanced Filters
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear all filters
            </button>
          </div>

          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filters.status === status.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </p>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => handlePriorityChange(priority.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filters.priority === priority.value
                        ? getPriorityButtonStyle(priority.value, true)
                        : getPriorityButtonStyle(priority.value, false)
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {filters.status === "all" || !filters.status
                      ? "All"
                      : filters.status}
                  </p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sorted by
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {filters.sortBy?.replace("-", " ") || "newest"}
                  </p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {filters.search || "No search term"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Indicator */}
      {(filters.status !== "all" ||
        filters.priority !== "all" ||
        filters.search) && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Active filters:</span>
          {filters.status !== "all" && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
              Status: {filters.status}
            </span>
          )}
          {filters.priority !== "all" && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs">
              Priority: {filters.priority}
            </span>
          )}
          {filters.search && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs">
              Search: "{filters.search}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

