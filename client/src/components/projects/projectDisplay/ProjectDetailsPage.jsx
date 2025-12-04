import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProject } from "../../../redux/projects/projectSlice";
import { useTheme } from "../../../context/ThemeContext";
import {
  FaArrowLeft,
  FaEdit,
  FaTimes,
  FaCheck,
  FaTrash,
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegHeart,
  FaHeart,
  FaRegSmile,
  FaSmile,
  FaRegLightbulb,
} from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";
import { formatDateTime } from "../../../constants";

const ProjectDetailsPage = () => {
  const { projectID } = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  // Selector for projects
  const selectProjects = createSelector(
    (state) => state.project,
    (projectSlice) => projectSlice.projects || []
  );

  const projects = useSelector(selectProjects);
  const loading = useSelector((state) => state.project.loading);

  const project = projects.find((p) => p._id === projectID);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({});
  const [reactions, setReactions] = useState({
    like: 12,
    love: 4,
    celebrate: 2,
    insightful: 3,
  });
  const [userReaction, setUserReaction] = useState(null);

  // Initialize edited project & comments
  useEffect(() => {
    if (!project) return;

    setEditedProject({
      title: project.title || "",
      description: project.description || "",
      manager: project.manager || "N/A",
      activeMembers: project.activeMembers || 0,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
    });

    setComments(project.comments || []);
  }, [project]);

  // Shimmer while loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!project) {
  return <Navigate to="/projects" replace />;
}


  const handleSaveChanges = () => {
    dispatch(updateProject({ id: project._id, data: editedProject }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject({ ...project });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: comments.length + 1,
      author: "You",
      role: "Viewer",
      avatar:
        "https://ui-avatars.com/api/?name=You&background=6366f1&color=fff",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      liked: false,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLikeComment = (id) => {
    setComments(
      comments.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleReaction = (reaction) => {
    const prev = userReaction;
    const newReactions = { ...reactions };
    if (prev === reaction) {
      setUserReaction(null);
      newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
    } else {
      if (prev) newReactions[prev] = Math.max(0, newReactions[prev] - 1);
      setUserReaction(reaction);
      newReactions[reaction] += 1;
    }
    setReactions(newReactions);
  };

  const progress =
    project.startDate && project.endDate
      ? Math.min(
          100,
          Math.max(
            0,
            ((new Date() - new Date(project.startDate)) /
              (new Date(project.endDate) - new Date(project.startDate))) *
              100
          )
        )
      : 0;

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"} transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft />
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject.title}
                      onChange={(e) =>
                        setEditedProject({ ...editedProject, title: e.target.value })
                      }
                      className="w-full text-2xl font-bold bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-2 mb-3"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-3">{project.name}</h1>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        project.status === "in-progress"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      }`}
                    >
                      {project.progress === "in-progress" ? "In Progress" : "Completed"}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Created {formatDateTime(project.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {isEditing ? (
                    <>
                      <FaTimes /> Cancel Edit
                    </>
                  ) : (
                    <>
                      <FaEdit /> Edit Project
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                {isEditing ? (
                  <textarea
                    value={editedProject.description}
                    onChange={(e) =>
                      setEditedProject({ ...editedProject, description: e.target.value })
                    }
                    rows="4"
                    className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-3"
                  />
                ) : (
                  <p>{project.description}</p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Project Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <FaCheck /> Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Reactions & Comments */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 flex gap-4">
                <button
                  onClick={() => handleReaction("like")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    userReaction === "like"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {userReaction === "like" ? <FaThumbsUp /> : <FaRegThumbsUp />} Like ({reactions.like})
                </button>
                <button
                  onClick={() => handleReaction("love")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    userReaction === "love"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {userReaction === "love" ? <FaHeart /> : <FaRegHeart />} Love ({reactions.love})
                </button>
                <button
                  onClick={() => handleReaction("celebrate")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    userReaction === "celebrate"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {userReaction === "celebrate" ? <FaSmile /> : <FaRegSmile />} Celebrate ({reactions.celebrate})
                </button>
                <button
                  onClick={() => handleReaction("insightful")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    userReaction === "insightful"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <FaRegLightbulb /> Insightful ({reactions.insightful})
                </button>
              </div>

              {/* Add Comment */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-3 mb-2"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className={`px-4 py-2 rounded-lg text-white ${
                      newComment.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 items-start border-t border-gray-200 pt-4">
                    <img src={c.avatar} alt={c.author} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">
                          {c.author} <span className="text-xs text-gray-500">{c.role}</span>
                        </h4>
                        {c.author === "You" && (
                          <button onClick={() => setComments(comments.filter((x) => x.id !== c.id))} className="text-red-500">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <p>{c.content}</p>
                      <button onClick={() => handleLikeComment(c.id)} className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        {c.liked ? <FaThumbsUp /> : <FaRegThumbsUp />} {c.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Project Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Manager:</span> {editedProject.manager}
                </p>
                <p>
                  <span className="text-gray-500">Start:</span> {editedProject.startDate}
                </p>
                <p>
                  <span className="text-gray-500">End:</span> {editedProject.endDate}
                </p>
                <p>
                  <span className="text-gray-500">Active Members:</span> {editedProject.activeMembers}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
