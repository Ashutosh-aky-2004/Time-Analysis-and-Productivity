import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 text-center bg-white dark:bg-[#0e1217] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Time Analysis. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
