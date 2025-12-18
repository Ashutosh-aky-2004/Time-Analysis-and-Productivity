import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
