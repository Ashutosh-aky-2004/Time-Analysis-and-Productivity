import React from "react";
import {
  X,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  Code,
  Activity,
  Eye,
  Edit2,
} from "lucide-react";
import useActivityHistory from "../../../hooks/personalAnalysis/useActivityHistory";

const ActivityHistoryModal = ({ isOpen, onClose, onEdit, onView }) => {
  const { activities, loading, hasMore, loadMore, filters, updateFilter } =
    useActivityHistory(10);

  if (!isOpen) return null;

  // Helpers (duplicated from RecentActivity for consistency, could be extracted to utils)
  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getIconAndStyle = (category, focusScore) => {
    if (category?.includes("academic") || category?.includes("study")) {
      return {
        icon: <Clock className="w-5 h-5 text-blue-500" />,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        pill: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
      };
    }
    if (category?.includes("development") || category?.includes("coding")) {
      return {
        icon: <Code className="w-5 h-5 text-indigo-500" />,
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        pill: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200",
      };
    }
    if (category?.includes("other") || focusScore < 3) {
      return {
        icon: <Activity className="w-5 h-5 text-orange-500" />,
        bg: "bg-orange-100 dark:bg-orange-900/30",
        pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
      };
    }
    return {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    };
  };

  const categories = [
    "studies",
    "personal",
    "health",
    "work",
    "social",
    "other",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1e1e1e] rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Activity History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage your time logs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 dark:bg-black/10 border-b border-gray-100 dark:border-white/5 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
          />

          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 capitalize"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && activities.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No activities found matching your filters.
            </div>
          ) : (
            <>
              {activities.map((item) => {
                const style = getIconAndStyle(item.category, item.focusScore);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5 group"
                  >
                    <div
                      className={`p-3 rounded-xl ${style.bg} self-start sm:self-center`}
                    >
                      {style.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {item.taskTitle || "Untitled Task"}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-medium ${style.pill}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.startTimestamp).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.startTimestamp).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}{" "}
                          -
                          {item.endTimestamp
                            ? new Date(item.endTimestamp).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : " Ongoing"}
                        </span>
                        <span>
                          Duration:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {formatDuration(item.durationInMinutes)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onView && onView(item)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        title="Edit Log"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Loading more..." : "Load more activities"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryModal;
