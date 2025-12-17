import React from 'react';
import { MoreVertical, Clock, Calendar } from 'lucide-react';

const ActiveTasks = () => {
    const tasks = [
        {
            id: 1,
            title: 'Complete Calculus Assignment - Chapter 3',
            priority: 'High',
            category: 'academic studies',
            progress: 60,
            timeSpent: '2h 15m',
            totalTime: '3h',
            dueDate: 'Mar 20',
            priorityColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
            barColor: 'bg-blue-600'
        },
        {
            id: 2,
            title: 'Prepare for Physics Midterm',
            priority: 'Critical',
            category: 'exam preparation',
            progress: 30,
            timeSpent: '1h 30m',
            totalTime: '5h',
            dueDate: 'Mar 25',
            priorityColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
            barColor: 'bg-blue-600'
        },
        {
            id: 3,
            title: 'Update Resume for Internship',
            priority: 'Medium',
            category: 'personal development',
            progress: 20,
            timeSpent: '0h 24m',
            totalTime: '2h',
            dueDate: 'Mar 30',
            priorityColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
            barColor: 'bg-blue-600'
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Active Tasks</h2>
                <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-1">
                    + Add New
                </button>
            </div>

            <div className="space-y-6">
                {tasks.map((task) => (
                    <div key={task.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-blue-100 dark:hover:border-blue-900/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg leading-tight">{task.title}</h3>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${task.priorityColor}`}>
                                {task.priority}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                {task.category}
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">{task.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${task.barColor} rounded-full transition-all duration-500`} 
                                    style={{ width: `${task.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500 mb-5">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{task.timeSpent} / {task.totalTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{task.dueDate}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                Start Tracking
                            </button>
                            <button className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                                Mark Complete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveTasks;
