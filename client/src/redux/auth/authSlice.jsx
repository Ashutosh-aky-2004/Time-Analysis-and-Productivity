import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");

const initialState = {
  user: null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;

      state.user = user; // user object from backend
      state.token = token; // JWT
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
