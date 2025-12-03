// components/ProjectModal.jsx
import React, { useState, useEffect } from 'react';

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project, 
  users = [], 
  onSave,
  currentUser // The logged-in user
}) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    teamMembers: [],
    suspendedMembers: [],
    removedMembers: [],
    invitedMembers: [],
    completed: false
  });

  const [searchTeam, setSearchTeam] = useState('');
  const [searchInvited, setSearchInvited] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('team');

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      // For existing projects, use the project data
      setFormData({
        name: project.name || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        teamMembers: project.teamMembers || [],
        suspendedMembers: project.suspendedMembers || [],
        removedMembers: project.removedMembers || [],
        invitedMembers: project.invitedMembers || [],
        completed: project.completed || false
      });
    } else {
      // For new projects, set current user as team member
      resetForm();
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          teamMembers: [currentUser._id || currentUser.id]
        }));
      }
    }
  }, [project, currentUser]);

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      teamMembers: [],
      suspendedMembers: [],
      removedMembers: [],
      invitedMembers: [],
      completed: false
    });
    setSelectedUsers([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserSelect = (userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
      setSearchTeam('');
    }
  };

  const handleRemoveUser = (userId, from = 'teamMembers') => {
    // Don't allow removing the current user (manager) from team
    if (currentUser && (userId === currentUser._id || userId === currentUser.id) && from === 'teamMembers') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [from]: prev[from].filter(id => id !== userId)
    }));
  };

  const handleAddToTeam = (userId) => {
    if (!formData.teamMembers.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, userId]
      }));
    }
  };

  const handleAddToInvited = (userId) => {
    if (!formData.invitedMembers.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        invitedMembers: [...prev.invitedMembers, userId]
      }));
    }
  };

  const handleMoveToSuspended = (userId) => {
    handleRemoveUser(userId, 'teamMembers');
    if (!formData.suspendedMembers.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        suspendedMembers: [...prev.suspendedMembers, userId]
      }));
    }
  };

  const handleMoveToRemoved = (userId) => {
    // Remove from all other lists
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(id => id !== userId),
      suspendedMembers: prev.suspendedMembers.filter(id => id !== userId),
      invitedMembers: prev.invitedMembers.filter(id => id !== userId),
      removedMembers: [...prev.removedMembers.filter(id => id !== userId), userId]
    }));
  };

  const handleRestoreUser = (userId, to = 'teamMembers') => {
    // Remove from all current lists
    const updatedData = {
      teamMembers: formData.teamMembers.filter(id => id !== userId),
      suspendedMembers: formData.suspendedMembers.filter(id => id !== userId),
      invitedMembers: formData.invitedMembers.filter(id => id !== userId),
      removedMembers: formData.removedMembers.filter(id => id !== userId),
      [to]: [...formData[to].filter(id => id !== userId), userId]
    };
    
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate duration in minutes if dates are provided
    let totalDuration = 0;
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = end - start;
      totalDuration = Math.round(duration / (1000 * 60));
    }

    // Auto-set the manager and project starter to current user
    const projectData = {
      ...formData,
      totalDuration,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : null,
      managingUserId: currentUser?._id || currentUser?.id || '',
      projectStartedBy: currentUser?._id || currentUser?.id || ''
    };

    onSave(projectData);
    onClose();
  };

  const getUserName = (userId) => {
    if (currentUser && (userId === currentUser._id || userId === currentUser.id)) {
      return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email || 'You';
    }
    
    const user = users.find(u => u._id === userId || u.id === userId);
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown User';
  };

  const getUserAvatar = (userId) => {
    if (currentUser && (userId === currentUser._id || userId === currentUser.id)) {
      const name = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email || 'You';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
    }
    
    const user = users.find(u => u._id === userId || u.id === userId);
    if (user) {
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff`;
    }
    return 'https://ui-avatars.com/api/?name=User&background=9ca3af&color=fff';
  };

  const filteredUsers = users.filter(user => {
    const userId = user._id || user.id;
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchTeam.toLowerCase();
    
    return (fullName.includes(search) || email.includes(search)) &&
           !formData.teamMembers.includes(userId) &&
           !formData.suspendedMembers.includes(userId) &&
           !formData.removedMembers.includes(userId) &&
           !formData.invitedMembers.includes(userId);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassy Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Project Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate}
                      className="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Manager Info */}
              {currentUser && (
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getUserAvatar(currentUser._id || currentUser.id)}
                        alt="Manager"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getUserName(currentUser._id || currentUser.id)}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Project Manager & Creator
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      You
                    </span>
                  </div>
                </div>
              )}

              {/* Member Management Tabs */}
              <div>
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <nav className="flex space-x-4">
                    {['team', 'invited', 'suspended', 'removed'].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                          activeTab === tab
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} Members
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-800">
                          {formData[`${tab}Members`]?.length || 0}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Team Members Tab */}
                {activeTab === 'team' && (
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add Team Members
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTeam}
                          onChange={(e) => setSearchTeam(e.target.value)}
                          placeholder="Search users to add..."
                          className="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                        />
                        <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Search Results */}
                    {searchTeam && filteredUsers.length > 0 && (
                      <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Search Results:</p>
                        <div className="space-y-2">
                          {filteredUsers.map(user => (
                            <div key={user._id || user.id} className="flex items-center justify-between p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={getUserAvatar(user._id || user.id)}
                                  alt={getUserName(user._id || user.id)}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {getUserName(user._id || user.id)}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddToTeam(user._id || user.id)}
                                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Add to Team
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Current Team Members */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Team Members ({formData.teamMembers.length})
                      </p>
                      <div className="space-y-3">
                        {formData.teamMembers.map(userId => (
                          <div key={userId} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                              <img
                                src={getUserAvatar(userId)}
                                alt={getUserName(userId)}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {getUserName(userId)}
                                  {currentUser && (userId === currentUser._id || userId === currentUser.id) && (
                                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Manager)</span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Team Member</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {!(currentUser && (userId === currentUser._id || userId === currentUser.id)) && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveToSuspended(userId)}
                                    className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                                  >
                                    Suspend
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveToRemoved(userId)}
                                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Tabs */}
                {['invited', 'suspended', 'removed'].map(tab => (
                  activeTab === tab && (
                    <div key={tab} className="space-y-4 mt-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          {tab.charAt(0).toUpperCase() + tab.slice(1)} Members ({formData[`${tab}Members`].length})
                        </p>
                        {formData[`${tab}Members`].length === 0 ? (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <p>No {tab} members</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {formData[`${tab}Members`].map(userId => (
                              <div key={userId} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={getUserAvatar(userId)}
                                    alt={getUserName(userId)}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {getUserName(userId)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {tab === 'invited' ? 'Invited - Pending Acceptance' : 
                                       tab === 'suspended' ? 'Suspended from Project' : 
                                       'Removed from Project'}
                                    </p>
                                  </div>
                                </div>
                                {tab !== 'removed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleRestoreUser(userId, 'teamMembers')}
                                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                  >
                                    Restore to Team
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="completed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark project as completed
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              >
                {project ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;