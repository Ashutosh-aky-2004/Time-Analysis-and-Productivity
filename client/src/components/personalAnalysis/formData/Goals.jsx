import React from 'react';
import { Target, Calendar } from 'lucide-react';

const Goals = () => {
    const goals = [
        {
            id: 1,
            title: 'Improve Math Study Efficiency',
            description: 'Focus score ≥ 4.0',
            tag: 'focus improvement',
            progress: 75,
            dueDate: 'Apr 20',
            barColor: 'bg-indigo-600',
            tagColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        },
        {
            id: 2,
            title: 'Complete 10 Coding Projects',
            description: '10/10 projects',
            tag: 'task completion',
            progress: 40,
            dueDate: 'Jun 30',
            barColor: 'bg-indigo-600',
            tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        },
        {
            id: 3,
            title: 'Reduce Interruptions by 50%',
            description: '≤ 3 interruptions/day',
            tag: 'habit formation',
            progress: 60,
            dueDate: 'Apr 15',
            barColor: 'bg-indigo-600',
            tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Goals</h2>
                <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-1">
                    + New Goal
                </button>
            </div>

            <div className="space-y-6">
                {goals.map((goal) => (
                    <div key={goal.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg leading-tight mb-1">{goal.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${goal.tagColor}`}>
                                {goal.tag}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm mb-1.5 mt-4">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{goal.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                            <div 
                                className={`h-full ${goal.barColor} rounded-full transition-all duration-500`} 
                                style={{ width: `${goal.progress}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Due {goal.dueDate}</span>
                            </div>
                            <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                                Update Progress
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Goals;
