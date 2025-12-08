import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
  },
});
