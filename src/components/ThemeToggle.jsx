import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full focus:outline-none transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="text-yellow-400 text-xl" />
      ) : (
        <FaMoon className="text-indigo-600 text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle; 