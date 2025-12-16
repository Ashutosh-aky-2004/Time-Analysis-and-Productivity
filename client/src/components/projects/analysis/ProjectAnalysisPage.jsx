import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useProjectAnalysis } from "../../../hooks/analysis/useProjectAnalysis";

const ProjectAnalysisPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { loading, error, analysisData } = useProjectAnalysis(projectId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft /> Back to Project
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Project Analysis
        </h1>

        {loading ? (
             <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading analysis...</p>
             </div>
        ) : error ? (
            <div className="text-center py-12 text-red-500">
                Error: {error}
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
                <p className="text-gray-700 dark:text-gray-300">
                    Analysis for Project ID: {projectId}
                </p>
                {/* Charts will go here */}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectAnalysisPage;
