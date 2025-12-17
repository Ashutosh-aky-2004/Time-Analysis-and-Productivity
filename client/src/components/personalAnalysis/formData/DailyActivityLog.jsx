import React, { useEffect, useState } from "react";
import { Calendar, Plus, Edit2, CheckCircle2 } from "lucide-react";
import useDailyCheckIn from "../../../hooks/personalAnalysis/useDailyCheckIn";

const DailyActivityLog = ({ onOpenCheckIn, onOpenHistory }) => {
  const { fetchCheckInByDate, checkIn, loading } = useDailyCheckIn();
  const [todayLog, setTodayLog] = useState(null);

  useEffect(() => {
    // Initial fetch
    const loadData = async () => {
      const data = await fetchCheckInByDate();
      setTodayLog(data);
    };
    loadData();

    // Listen for custom event or refresh triggers if applicable
    // ideally, if the modal saves, it should trigger a refresh here.
    // For now, we rely on parent re-renders or basic mounting.
  }, [fetchCheckInByDate]);

  // Determine status
  const isComplete = !!todayLog;

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white/20 dark:border-white/5 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100">
              Daily Activity Log
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        {isComplete ? (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Done
          </span>
        ) : (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
            Pending
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
        {isComplete ? (
          <>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {todayLog.energyLevel}/5 Energy
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Priorities: {todayLog.priorities?.length || 0}
              </p>
            </div>

            <button
              onClick={onOpenCheckIn}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Check-in
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">
              You haven’t logged your daily check-in yet. Take a moment to
              reflect.
            </p>
            <button
              onClick={onOpenCheckIn}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all font-medium"
            >
              <Plus className="w-4 h-4" /> Log Today's Activity
            </button>
          </>
        )}
      </div>

      <div className="p-4 bg-gray-50/80 dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={() => {
            // Trigger modal in history mode if possible, or just open modal
            // We'll assume the parent handles passing a "view history" intent if needed,
            // or the modal simply defaults to checkin.
            // For now, let's open the modal, and the user can click "History".
            // Or better, we can pass a prop to open in history mode?
            // The current modal doesn't support "initialView" prop yet, but we can default to opening.
            onOpenCheckIn();
          }}
          className="w-full text-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          View Past Logs via History Tab
        </button>
      </div>
    </div>
  );
};

export default DailyActivityLog;
