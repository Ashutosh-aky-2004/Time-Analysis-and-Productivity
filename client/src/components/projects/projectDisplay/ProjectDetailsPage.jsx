import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../../context/projects/ProjectContext';
import { useTheme } from '../../../context/ThemeContext';

const ProjectDetailsPage = () => {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjectContext();
  const { isDark } = useTheme();
  
  const project = projects.find(p => p.id === parseInt(projectID));
  
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      role: "Project Manager",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff",
      content: "Great progress on the redesign! The new layout looks fantastic.",
      timestamp: "2 hours ago",
      likes: 3,
      liked: false
    },
    {
      id: 2,
      author: "Alice Johnson",
      role: "Frontend Developer",
      avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=10b981&color=fff",
      content: "I've completed the responsive design for mobile. Need feedback on tablet view.",
      timestamp: "1 day ago",
      likes: 5,
      liked: true
    },
    {
      id: 3,
      author: "Bob Smith",
      role: "Backend Developer",
      avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=8b5cf6&color=fff",
      content: "API integration is complete. Ready for testing phase.",
      timestamp: "2 days ago",
      likes: 2,
      liked: false
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    manager: '',
    activeMembers: 0,
    startDate: '',
    endDate: ''
  });
  
  const [reactions, setReactions] = useState({
    like: 12,
    love: 4,
    celebrate: 2,
    insightful: 3
  });
  
  const [userReaction, setUserReaction] = useState(null);
  
  useEffect(() => {
    if (!project) {
      navigate('/');
      return;
    }
    
    setEditedProject({
      title: project.title,
      description: project.description,
      manager: project.manager,
      activeMembers: project.activeMembers,
      startDate: project.startDate,
      endDate: project.endDate
    });
  }, [project, navigate]);
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Project not found</p>
        </div>
      </div>
    );
  }
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: comments.length + 1,
      author: "You",
      role: "Viewer",
      avatar: "https://ui-avatars.com/api/?name=You&background=6366f1&color=fff",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      liked: false
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };
  
  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const newLiked = !comment.liked;
        return {
          ...comment,
          liked: newLiked,
          likes: newLiked ? comment.likes + 1 : comment.likes - 1
        };
      }
      return comment;
    }));
  };
  
  const handleReaction = (reaction) => {
    const previousReaction = userReaction;
    const newReactions = { ...reactions };
    
    if (previousReaction === reaction) {
      setUserReaction(null);
      newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
    } else {
      if (previousReaction) {
        newReactions[previousReaction] = Math.max(0, newReactions[previousReaction] - 1);
      }
      setUserReaction(reaction);
      newReactions[reaction] += 1;
    }
    
    setReactions(newReactions);
  };
  
  const handleSaveChanges = () => {
    updateProject(project.id, editedProject);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject({
      title: project.title,
      description: project.description,
      manager: project.manager,
      activeMembers: project.activeMembers,
      startDate: project.startDate,
      endDate: project.endDate
    });
  };
  
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateProgress = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    const total = end - start;
    const passed = now - start;
    return Math.min(100, Math.max(0, (passed / total) * 100));
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject.title}
                      onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                      className="w-full text-2xl font-bold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h1>
                  )}
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      project.progress === 'in-progress'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    }`}>
                      {project.progress === 'in-progress' ? 'In Progress' : 'Completed'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Created {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Edit
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Project
                    </>
                  )}
                </button>
              </div>
              
              {/* Project Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
                {isEditing ? (
                  <textarea
                    value={editedProject.description}
                    onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                    rows="4"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Progress</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Save/Cancel Buttons for Edit Mode */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            {/* Reactions Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reactions</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleReaction('like')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    userReaction === 'like'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="font-medium">Like ({reactions.like})</span>
                </button>
                
                <button
                  onClick={() => handleReaction('love')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    userReaction === 'love'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Love ({reactions.love})</span>
                </button>
                
                <button
                  onClick={() => handleReaction('celebrate')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    userReaction === 'celebrate'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Celebrate ({reactions.celebrate})</span>
                </button>
                
                <button
                  onClick={() => handleReaction('insightful')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    userReaction === 'insightful'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Insightful ({reactions.insightful})</span>
                </button>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comments ({comments.length})</h2>
              
              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=You&background=6366f1&color=fff"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows="3"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          newComment.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-t border-gray-200 dark:border-gray-800 pt-6 first:border-t-0 first:pt-0">
                    <div className="flex gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {comment.author}
                              {comment.role && (
                                <span className="ml-2 text-xs font-normal text-gray-600 dark:text-gray-400">
                                  • {comment.role}
                                </span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          {comment.author === "You" && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`inline-flex items-center gap-1 text-sm transition-colors ${
                              comment.liked
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                          >
                            {comment.liked ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                            )}
                            {comment.likes > 0 && comment.likes}
                          </button>
                          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Project Info & Team */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Details</h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Project Manager</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject.manager}
                      onChange={(e) => setEditedProject({...editedProject, manager: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mt-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{project.manager}</p>
                  )}
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Start Date</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject.startDate}
                      onChange={(e) => setEditedProject({...editedProject, startDate: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mt-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{project.startDate}</p>
                  )}
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">End Date</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProject.endDate}
                      onChange={(e) => setEditedProject({...editedProject, endDate: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mt-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{project.endDate}</p>
                  )}
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                  <p className="font-medium text-gray-900 dark:text-white">{project.duration}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active Members</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProject.activeMembers}
                      onChange={(e) => setEditedProject({...editedProject, activeMembers: parseInt(e.target.value) || 0})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mt-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project.activeMembers} active, {project.suspendedMembers} suspended
                    </p>
                  )}
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Project ID</span>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{project.id}</p>
                </div>
              </div>
            </div>
            
            {/* Team Members Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff"
                    alt="John Doe"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Project Manager</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Alice+Johnson&background=10b981&color=fff"
                    alt="Alice Johnson"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Alice Johnson</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Frontend Developer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Bob+Smith&background=8b5cf6&color=fff"
                    alt="Bob Smith"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Bob Smith</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Backend Developer</p>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  + Add Team Member
                </button>
              </div>
            </div>
            
            {/* Actions Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Meeting
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;