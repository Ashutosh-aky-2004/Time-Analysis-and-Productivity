import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { useUpdateProject } from "../../../hooks/projects/useUpdateProject";
import axios from "axios";

const EditProjectModal = ({ project, onClose, isOpen }) => {
  if (!isOpen || !project) return null;

  const { updateProject, loading } = useUpdateProject();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Started",
    priority: "medium",
    startDate: "",
    endDate: "",
    tags: [],
    managingUserId: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "Started",
        priority: project.priority || "medium",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        tags: project.tags || [],
        managingUserId: project.managingUserId ? project.managingUserId.map(u => u._id) : [],
      });
      // Initial fetch of users if needed, or we can fetch on search focus
      fetchAllUsers();
    }
  }, [project]);

  const fetchAllUsers = async () => {
      try {
          const token = localStorage.getItem("token");
          // Re-using the get-all-users endpoint from project routes or creating a new utility
          // Assuming /api/projects/get-all-users-for-task-list-assingment returns list of users
          const API_URL = import.meta.env.VITE_API_URL;
          const res = await axios.get(`${API_URL}/api/projects/get-all-users-for-task-list-assingment`, {
               headers: { Authorization: `Bearer ${token}` }
          });
          if(res.data.success){
              setAllUsers(res.data.data);
          }
      } catch (error) {
          console.error("Failed to fetch users", error);
      }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleManagerSelect = (userId) => {
      if(!formData.managingUserId.includes(userId)){
          setFormData({...formData, managingUserId: [...formData.managingUserId, userId]});
      }
  }

  const handleRemoveManager = (userId) => {
      if(formData.managingUserId.length <= 1){
          alert("Project must have at least one manager.");
          return;
      }
      setFormData({...formData, managingUserId: formData.managingUserId.filter(id => id !== userId)});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(project._id, formData);
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      // Error handled in hook
    }
  };
  
  const getManagersList = () => {
      // populate objects from allUsers based on IDs in formData.managingUserId
      return allUsers.filter(u => formData.managingUserId.includes(u._id));
  }

  const filteredUsers = allUsers.filter(u => 
    !formData.managingUserId.includes(u._id) && 
    (u.firstName.toLowerCase().includes(searchUser.toLowerCase()) || 
     u.email.toLowerCase().includes(searchUser.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                  <option value="Started">Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><FaTimes /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Managers Manager */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Manage Access</h3>
             
             {/* Current Managers */}
             <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Managers</label>
                 <div className="space-y-2">
                     {getManagersList().map(user => (
                         <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                             <div className="flex items-center gap-3">
                                 <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt="" className="w-8 h-8 rounded-full" />
                                 <div>
                                     <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                                     <p className="text-xs text-gray-500">{user.email}</p>
                                 </div>
                             </div>
                             {formData.managingUserId.length > 1 && (
                                <button type="button" onClick={() => handleRemoveManager(user._id)} className="text-red-500 hover:text-red-700 p-2">
                                     <FaTrash />
                                </button>
                             )}
                         </div>
                     ))}
                 </div>
             </div>
             
             {/* Add Manager */}
             <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Manager</label>
                  <input 
                    type="text" 
                    placeholder="Search users to add as manager..." 
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
                  />
                  {searchUser && (
                     <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 divide-y dark:divide-gray-700">
                         {filteredUsers.length > 0 ? filteredUsers.map(user => (
                             <button 
                                key={user._id} 
                                type="button" 
                                onClick={() => { handleManagerSelect(user._id); setSearchUser(""); }}
                                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                             >
                                 <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt="" className="w-8 h-8 rounded-full" />
                                 <div>
                                     <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                                     <p className="text-xs text-gray-500">{user.email}</p>
                                 </div>
                             </button>
                         )) : (
                             <p className="p-3 text-sm text-gray-500 text-center">No users found</p>
                         )}
                     </div>
                  )}
             </div>
          </div>
        </form>

        <div className="p-6 border-t dark:border-gray-800 flex justify-end gap-3 rounded-b-xl bg-gray-50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
