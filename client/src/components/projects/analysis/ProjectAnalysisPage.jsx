import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useProjectAnalysisContext } from "../../../context/analysis/ProjectAnalysisContext";
import { ThemeContext } from "../../../context/ThemeContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ProjectAnalysisPage = () => {
  const { projectID: projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const { loading, error, analysisData } = useProjectAnalysisContext();

  // State for Efficiency Chart (must be before any conditional returns)
  const [filterMember, setFilterMember] = React.useState("all");
  const [sortOption, setSortOption] = React.useState("logged-desc");

  // Derived Data for Efficiency Chart
  const filteredEfficiencyData = React.useMemo(() => {
    const taskEfficiency = analysisData?.taskEfficiency;
    if (!taskEfficiency) return [];

    let data = [...taskEfficiency];

    // Filter
    if (filterMember !== "all") {
        data = data.filter(t => t.assignee === filterMember);
    }

    // Sort
    data.sort((a, b) => {
        const loggedA = a["Logged Hours"] || 0;
        const loggedB = b["Logged Hours"] || 0;
        const estA = a["Estimated Hours"] || 0;
        const estB = b["Estimated Hours"] || 0;

        switch (sortOption) {
            case "logged-asc": return loggedA - loggedB;
            case "estimated-desc": return estB - estA;
            case "efficiency-worst": return (loggedB - estB) - (loggedA - estA);
            case "logged-desc": default: return loggedB - loggedA;
        }
    });

    // Limit to top 15 to avoid overcrowding if showing all, unless filtered specific member
    return filterMember === "all" ? data.slice(0, 15) : data;
  }, [analysisData?.taskEfficiency, filterMember, sortOption]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="text-center">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline"
                >
                    Go Back
                </button>
            </div>
        </div>
     );
  }
  
  const { statusDistribution, priorityDistribution, memberWorkload, taskEfficiency } = analysisData || {};

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <button
          onClick={() => navigate(`/project-details/${projectId}`)}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft /> Back to Project
        </button>

        <header>
          <h1 className="text-3xl font-bold mb-2">Project Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400">Insights and visualization of project performance.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className={`p-6 rounded-xl shadow-sm border min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                {statusDistribution?.length > 0 && (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' }}
                                itemStyle={{ color: isDark ? '#e5e7eb' : '#374151' }}
                                labelStyle={{ color: isDark ? '#f3f4f6' : '#1f2937' }}
                            />
                            <Legend wrapperStyle={{ color: isDark ? '#e5e7eb' : '#374151' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            {/* Priority Distribution */}
            <div className={`p-6 rounded-xl shadow-sm border min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Task Priority Breakdown</h3>
                {priorityDistribution?.length > 0 && (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityDistribution} layout="vertical">
                             <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} horizontal={false} />
                             <XAxis type="number" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                             <YAxis dataKey="name" type="category" stroke={isDark ? "#9ca3af" : "#4b5563"} width={80} />
                             <Tooltip 
                                cursor={{fill: isDark ? '#374151' : '#e5e7eb', opacity: 0.1}}
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' }}
                                itemStyle={{ color: isDark ? '#e5e7eb' : '#374151' }}
                                labelStyle={{ color: isDark ? '#f3f4f6' : '#1f2937' }}
                             />
                             <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {priorityDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            {/* Member Workload */}
            <div className={`p-6 rounded-xl shadow-sm border md:col-span-2 min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <h3 className="text-lg font-semibold mb-4">Team Workload (Tasks Assigned)</h3>
                {memberWorkload?.length > 0 ? (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={memberWorkload}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
                            <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <Tooltip 
                                cursor={{fill: isDark ? '#374151' : '#e5e7eb', opacity: 0.1}}
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' }}
                                itemStyle={{ color: isDark ? '#e5e7eb' : '#374151' }}
                                labelStyle={{ color: isDark ? '#f3f4f6' : '#1f2937' }}
                            />
                            <Legend wrapperStyle={{ color: isDark ? '#e5e7eb' : '#374151' }} />
                            <Bar dataKey="Tasks" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                ) : <p className="text-gray-500">No member activity recorded.</p>}
            </div>

            {/* Task Efficiency */}
            <div className={`p-6 rounded-xl shadow-sm border md:col-span-2 min-w-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Time Efficiency</h3>
                    
                    {/* Filters & Sort */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                         {/* Filter by Member */}
                         <select
                            className={`px-3 py-1.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-700"}`}
                            value={filterMember}
                            onChange={(e) => setFilterMember(e.target.value)}
                        >
                            <option value="all">All Members</option>
                            {[...new Set(analysisData?.taskEfficiency?.map(t => t.assignee).filter(Boolean))].map(member => (
                                <option key={member} value={member}>{member}</option>
                            ))}
                        </select>

                        {/* Sort By */}
                        <select
                            className={`px-3 py-1.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-700"}`}
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="logged-desc">Most Logged Hours</option>
                            <option value="logged-asc">Least Logged Hours</option>
                            <option value="estimated-desc">Most Estimated Hours</option>
                            <option value="efficiency-worst">Least Efficient (Over Budget)</option>
                        </select>
                    </div>
                </div>

                {filteredEfficiencyData?.length > 0 ? (
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredEfficiencyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
                            <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} />
                            <Tooltip 
                                cursor={{fill: isDark ? '#374151' : '#e5e7eb', opacity: 0.1}}
                                contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' }}
                                itemStyle={{ color: isDark ? '#e5e7eb' : '#374151' }}
                                labelStyle={{ color: isDark ? '#f3f4f6' : '#1f2937' }}
                            />
                            <Legend wrapperStyle={{ color: isDark ? '#e5e7eb' : '#374151' }} />
                            <Bar dataKey="Estimated Hours" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Logged Hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                ) : <p className="text-gray-500">Not enough data for efficiency analysis.</p>}
            </div>
        </div>

        {/* Improved Advanced Insights Section */}
        {analysisData?.advanced && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Advanced Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Inefficiency Card */}
                    <div className={`p-5 rounded-xl border ${isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">⚠️</span>
                            <h3 className="font-semibold text-red-700 dark:text-red-300">Inefficiency Detected</h3>
                        </div>
                        {analysisData.advanced.inefficientTasks?.length > 0 ? (
                            <ul className="space-y-3">
                                {analysisData.advanced.inefficientTasks.map(t => (
                                    <li key={t.id} className="text-sm">
                                        <div className="font-medium text-red-800 dark:text-red-200">{t.title}</div>
                                        <div className="text-xs text-red-600 dark:text-red-400">
                                            Exceeded by {t.exceededBy} • {t.sso}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No major inefficiencies found.</p>
                        )}
                    </div>

                    {/* Delays Card */}
                    <div className={`p-5 rounded-xl border ${isDark ? "bg-orange-900/20 border-orange-800" : "bg-orange-50 border-orange-200"}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">⏰</span>
                            <h3 className="font-semibold text-orange-700 dark:text-orange-300">Project Delays</h3>
                        </div>
                         {analysisData.advanced.overdueTasks?.length > 0 ? (
                            <ul className="space-y-3">
                                {analysisData.advanced.overdueTasks.map(t => (
                                    <li key={t.id} className="text-sm">
                                        <div className="font-medium text-orange-800 dark:text-orange-200">{t.title}</div>
                                        <div className="text-xs text-orange-600 dark:text-orange-400">
                                            Overdue by {t.daysOverdue} days
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No overdue tasks.</p>
                        )}
                    </div>

                    {/* Fake Productivity Card */}
                    <div className={`p-5 rounded-xl border ${isDark ? "bg-yellow-900/20 border-yellow-800" : "bg-yellow-50 border-yellow-200"}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🕵️</span>
                            <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">Suspicious Activity</h3>
                        </div>
                         {analysisData.advanced.suspicionTasks?.length > 0 ? (
                            <ul className="space-y-3">
                                {analysisData.advanced.suspicionTasks.map(t => (
                                    <li key={t.id} className="text-sm">
                                        <div className="font-medium text-yellow-800 dark:text-yellow-200">{t.title}</div>
                                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                                            {t.loggedHours} hrs logged but {t.reason}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No suspicious logging patterns.</p>
                        )}
                    </div>

                    {/* Burnout Risk Card */}
                    <div className={`p-5 rounded-xl border ${isDark ? "bg-purple-900/20 border-purple-800" : "bg-purple-50 border-purple-200"}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🔥</span>
                            <h3 className="font-semibold text-purple-700 dark:text-purple-300">Workload Balance</h3>
                        </div>
                         {analysisData.advanced.burnoutRisk?.length > 0 ? (
                            <ul className="space-y-3">
                                {analysisData.advanced.burnoutRisk.map((m, idx) => (
                                    <li key={idx} className="text-sm">
                                        <div className="font-medium text-purple-800 dark:text-purple-200">{m.name}</div>
                                        <div className="text-xs text-purple-600 dark:text-purple-400">
                                            {m.totalHours} hrs estimated load
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Workload appears balanced.</p>
                        )}
                    </div>

                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectAnalysisPage;
