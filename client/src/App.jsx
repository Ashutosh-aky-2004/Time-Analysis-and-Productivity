import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProjectProvider } from "./context/projects/ProjectContext";

const App = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <AppRoutes /> {/* router paths are present inside this folder*/}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
