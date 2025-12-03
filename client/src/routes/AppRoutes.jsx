import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Profile from "../components/profile/Profile";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import LandingPageProject from "../components/projects/LandingPageProject";
import ProjectDetailsPage from "../components/projects/projectDisplay/ProjectDetailsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route
          path="/u"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <LandingPageProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-details/:projectID"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
