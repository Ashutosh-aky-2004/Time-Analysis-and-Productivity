import { createSlice } from "@reduxjs/toolkit";
import { getProjects, addProject, deleteProject } from "./projectThunks";

const initialState = {
  projects: [],
  loading: false,
  error: null,
  filters: {
    sortBy: "newest",
    status: "all",
    search: "",
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateProject: (state, action) => {
      const { id, data } = action.payload;
      const index = state.projects.findIndex((p) => p._id === id); // assuming _id is used
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...data };
      }
    },
  },

  extraReducers: (builder) => {
    // GET PROJECTS
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch projects";
      });

    // ADD PROJECT
    builder
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(addProject.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add project";
      });

    // DELETE PROJECT
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to delete project";
      });
  },
});

export const { setFilters, updateProject } = projectSlice.actions;
export default projectSlice.reducer;
