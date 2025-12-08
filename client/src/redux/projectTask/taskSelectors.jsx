import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
const selectTasksState = (state) => state.tasks;

export const selectAllTasks = createSelector(
  selectTasksState,
  (tasksState) => tasksState.tasks
);

export const selectCurrentProjectId = createSelector(
  selectTasksState,
  (tasksState) => tasksState.currentProjectId
);

export const selectLoadingStates = createSelector(
  selectTasksState,
  (tasksState) => tasksState.loading
);

export const selectModalStates = createSelector(
  selectTasksState,
  (tasksState) => tasksState.modals
);

// Filtered tasks selector
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectTasksState],
  (tasks, tasksState) => {
    const { filters, sortBy, sortOrder } = tasksState;
    let filtered = [...tasks];
    
    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.assignee !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === filters.assignee);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'dueDate') {
        aValue = aValue ? new Date(aValue) : new Date(8640000000000000);
        bValue = bValue ? new Date(bValue) : new Date(8640000000000000);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }
);

// Task statistics
export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks) => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    
    const now = new Date();
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;
    
    return { total, todo, inProgress, completed, overdue };
  }
);

// Get task by ID
export const selectTaskById = (taskId) => 
  createSelector(
    selectAllTasks,
    (tasks) => tasks.find(task => task._id === taskId)
  );

// Get subtask by IDs
export const selectSubtaskByIds = (taskId, subtaskId) => 
  createSelector(
    selectTaskById(taskId),
    (task) => {
      if (!task || !task.subtasks) return null;
      return task.subtasks.find(st => st._id === subtaskId);
    }
  );

// Comments for subtask
export const selectCommentsForSubtask = (taskId, subtaskId) => 
  createSelector(
    selectSubtaskByIds(taskId, subtaskId),
    (subtask) => subtask?.comments || []
  );

// Completion percentage for task
export const selectTaskCompletion = (taskId) => 
  createSelector(
    selectTaskById(taskId),
    (task) => {
      if (!task) return 0;
      if (!task.subtasks || task.subtasks.length === 0) {
        return task.status === 'completed' ? 100 : 0;
      }
      const completed = task.subtasks.filter(st => st.status === 'completed').length;
      return Math.round((completed / task.subtasks.length) * 100);
    }
  );