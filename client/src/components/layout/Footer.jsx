import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 text-center bg-white dark:bg-[#321764] text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700 shadow-inner transition-colors duration-200">
      <p className="text-sm opacity-80">
        &copy; {new Date().getFullYear()} Time Analysis. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
