import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from './taskApi';
import { websocketService } from './websocket';

const initialState = {
  // Data
  tasks: [],                    // All tasks with subtasks/comments
  currentTask: null,            // Task being viewed/edited
  
  // WebSocket connection
  socketConnected: false,
  
  // Loading states
  loading: {
    tasks: false,
    task: false,
    creating: false,
    updating: false,
    deleting: false
  },
  
  // Errors
  errors: {
    tasks: null,
    task: null,
    create: null,
    update: null,
    delete: null
  },
  
  // UI states
  modals: {
    createTask: false,
    viewTask: false,
    comments: false,
    logHours: false,
    subtask: false
  },
  
  // Current context
  currentProjectId: null,
  currentSubtaskId: null,
  currentCommentId: null,
  
  // Filters & sorting
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    search: ''
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  
  // Real-time updates queue
  pendingUpdates: []
};

// Async Thunks
export const fetchProjectTasks = createAsyncThunk(
  'tasks/fetchProjectTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      return await taskApi.getProjectTasks(projectId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTaskDetails = createAsyncThunk(
  'tasks/fetchTaskDetails',
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskApi.getTask(taskId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue, dispatch }) => {
    try {
      const response = await taskApi.createTask(taskData);
      
      // Send WebSocket notification
      websocketService.emit('task:created', {
        task: response.data.task,
        projectId: taskData.projectId
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createQuickTask = createAsyncThunk(
  'tasks/createQuickTask',
  async ({ title, projectId }, { rejectWithValue }) => {
    try {
      const response = await taskApi.createQuickTask(title, projectId);
      websocketService.emit('task:created', {
        task: response.data.task,
        projectId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await taskApi.updateTask(taskId, updates);
      websocketService.emit('task:updated', {
        taskId,
        updates: response.data.task,
        projectId: updates.projectId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await taskApi.updateTaskStatus(taskId, status);
      websocketService.emit('task:status-changed', {
        taskId,
        status,
        projectId: response.data.task.projectId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const task = state.tasks.tasks.find(t => t._id === taskId);
      
      const response = await taskApi.deleteTask(taskId);
      
      websocketService.emit('task:deleted', {
        taskId,
        projectId: task?.projectId
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Subtask operations
export const addSubtask = createAsyncThunk(
  'tasks/addSubtask',
  async ({ taskId, subtaskData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addSubtask(taskId, subtaskData);
      websocketService.emit('subtask:added', {
        taskId,
        subtask: response.data.subtask
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSubtask = createAsyncThunk(
  'tasks/updateSubtask',
  async ({ taskId, subtaskId, updates }, { rejectWithValue }) => {
    try {
      const response = await taskApi.updateSubtask(taskId, subtaskId, updates);
      websocketService.emit('subtask:updated', {
        taskId,
        subtaskId,
        updates: response.data.subtask
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSubtask = createAsyncThunk(
  'tasks/deleteSubtask',
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const response = await taskApi.deleteSubtask(taskId, subtaskId);
      websocketService.emit('subtask:deleted', {
        taskId,
        subtaskId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Time logging
export const logSubtaskHours = createAsyncThunk(
  'tasks/logSubtaskHours',
  async ({ taskId, subtaskId, hoursData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.logHours(taskId, subtaskId, hoursData);
      websocketService.emit('hours:logged', {
        taskId,
        subtaskId,
        hours: response.data.timeEntry
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Comments & Reactions
export const addComment = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, subtaskId, commentData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addComment(taskId, subtaskId, commentData);
      websocketService.emit('comment:added', {
        taskId,
        subtaskId,
        comment: response.data.comment
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addReply = createAsyncThunk(
  'tasks/addReply',
  async ({ taskId, subtaskId, commentId, replyData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addReply(taskId, subtaskId, commentId, replyData);
      websocketService.emit('reply:added', {
        taskId,
        subtaskId,
        commentId,
        reply: response.data.reply
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCommentReaction = createAsyncThunk(
  'tasks/addCommentReaction',
  async ({ taskId, subtaskId, commentId, reactionType }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addCommentReaction(taskId, subtaskId, commentId, reactionType);
      websocketService.emit('reaction:added', {
        taskId,
        subtaskId,
        commentId,
        reaction: response.data.reaction
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addReplyReaction = createAsyncThunk(
  'tasks/addReplyReaction',
  async ({ taskId, subtaskId, commentId, replyId, reactionType }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addReplyReaction(taskId, subtaskId, commentId, replyId, reactionType);
      websocketService.emit('reply:reaction-added', {
        taskId,
        subtaskId,
        commentId,
        replyId,
        reaction: response.data.reaction
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // WebSocket connection
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    
    // Modal controls
    openModal: (state, action) => {
      const { modal, data } = action.payload;
      state.modals[modal] = true;
      if (data) {
        if (data.projectId) state.currentProjectId = data.projectId;
        if (data.taskId) state.currentTaskId = data.taskId;
        if (data.subtaskId) state.currentSubtaskId = data.subtaskId;
        if (data.commentId) state.currentCommentId = data.commentId;
      }
    },
    
    closeModal: (state, action) => {
      const modal = action.payload;
      state.modals[modal] = false;
      if (modal === 'comments') {
        state.currentSubtaskId = null;
        state.currentCommentId = null;
      }
    },
    
    // Set current context
    setCurrentProject: (state, action) => {
      state.currentProjectId = action.payload;
    },
    
    // Real-time updates (from WebSocket)
    realTimeTaskUpdate: (state, action) => {
      const { type, data } = action.payload;
      
      switch (type) {
        case 'task:created':
          state.tasks.push(data.task);
          break;
          
        case 'task:updated':
          state.tasks = state.tasks.map(task => 
            task._id === data.taskId ? { ...task, ...data.updates } : task
          );
          break;
          
        case 'task:deleted':
          state.tasks = state.tasks.filter(task => task._id !== data.taskId);
          break;
          
        case 'subtask:added':
          state.tasks = state.tasks.map(task => {
            if (task._id === data.taskId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), data.subtask]
              };
            }
            return task;
          });
          break;
          
        case 'comment:added':
          state.tasks = state.tasks.map(task => {
            if (task._id === data.taskId) {
              const subtaskIndex = task.subtasks?.findIndex(st => st._id === data.subtaskId);
              if (subtaskIndex > -1) {
                const updatedSubtasks = [...task.subtasks];
                updatedSubtasks[subtaskIndex] = {
                  ...updatedSubtasks[subtaskIndex],
                  comments: [...(updatedSubtasks[subtaskIndex].comments || []), data.comment]
                };
                return { ...task, subtasks: updatedSubtasks };
              }
            }
            return task;
          });
          break;
      }
    },
    
    // Optimistic updates (for immediate UI response)
    optimisticAddComment: (state, action) => {
      const { taskId, subtaskId, comment } = action.payload;
      const taskIndex = state.tasks.findIndex(t => t._id === taskId);
      
      if (taskIndex > -1) {
        const task = { ...state.tasks[taskIndex] };
        const subtaskIndex = task.subtasks?.findIndex(st => st._id === subtaskId);
        
        if (subtaskIndex > -1) {
          const updatedSubtasks = [...task.subtasks];
          updatedSubtasks[subtaskIndex] = {
            ...updatedSubtasks[subtaskIndex],
            comments: [...(updatedSubtasks[subtaskIndex].comments || []), {
              ...comment,
              _id: `temp_${Date.now()}`,
              isOptimistic: true
            }]
          };
          state.tasks[taskIndex] = { ...task, subtasks: updatedSubtasks };
        }
      }
    },
    
    // Filters & sorting
    setFilter: (state, action) => {
      const { filter, value } = action.payload;
      state.filters[filter] = value;
    },
    
    setSort: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload;
      state.errors[errorType] = null;
    },
    
    // Reset state
    resetTasks: () => initialState
  },
  
  extraReducers: (builder) => {
    // Fetch project tasks
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading.tasks = true;
        state.errors.tasks = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading.tasks = false;
        state.tasks = action.payload.data.tasks;
        state.currentProjectId = action.meta.arg;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading.tasks = false;
        state.errors.tasks = action.payload;
      });
    
    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading.creating = true;
        state.errors.create = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.tasks.push(action.payload.data.task);
        state.modals.createTask = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.create = action.payload;
      });
    
    // Add comment
    builder
      .addCase(addComment.pending, (state) => {
        state.loading.updating = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading.updating = false;
        // Remove optimistic comment and add real one
        const { taskId, subtaskId } = action.meta.arg;
        const taskIndex = state.tasks.findIndex(t => t._id === taskId);
        
        if (taskIndex > -1) {
          const task = { ...state.tasks[taskIndex] };
          const subtaskIndex = task.subtasks?.findIndex(st => st._id === subtaskId);
          
          if (subtaskIndex > -1) {
            const updatedSubtasks = [...task.subtasks];
            // Remove optimistic comment
            updatedSubtasks[subtaskIndex] = {
              ...updatedSubtasks[subtaskIndex],
              comments: updatedSubtasks[subtaskIndex].comments
                ?.filter(c => !c.isOptimistic) || []
            };
            // Add real comment
            updatedSubtasks[subtaskIndex].comments.push(action.payload.data.comment);
            state.tasks[taskIndex] = { ...task, subtasks: updatedSubtasks };
          }
        }
      })
      .addCase(addComment.rejected, (state) => {
        state.loading.updating = false;
        // Keep optimistic comment for retry or show error
      });
    
    // Similar patterns for other async thunks...
  }
});

export const {
  setSocketConnected,
  openModal,
  closeModal,
  setCurrentProject,
  realTimeTaskUpdate,
  optimisticAddComment,
  setFilter,
  setSort,
  clearError,
  resetTasks
} = taskSlice.actions;

export default taskSlice.reducer;