export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "not started":
      return "bg-gray-400 text-white dark:bg-gray-600";
    case "in progress":
      return "bg-yellow-500 text-white dark:bg-yellow-600";
    case "completed":
      return "bg-green-600 text-white dark:bg-green-700";
    case "blocked":
      return "bg-red-600 text-white dark:bg-red-700";
    default:
      return "bg-gray-500 text-white dark:bg-gray-700";
  }
};

export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "bg-green-500 text-white dark:bg-green-600";
    case "medium":
      return "bg-yellow-500 text-white dark:bg-yellow-600";
    case "high":
      return "bg-orange-500 text-white dark:bg-orange-600";
    case "critical":
      return "bg-red-700 text-white dark:bg-red-800";
    default:
      return "bg-gray-500 text-white dark:bg-gray-700";
  }
};
