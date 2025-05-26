import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaBook, FaQuestion, FaBars } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const PageHeader = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  connected, 
  darkMode, 
  toggleDarkMode, 
  setShowHelpModal 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        {/* Sidebar toggle button - always visible */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded text-indigo-600 dark:text-indigo-400 focus:outline-none hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
          aria-label={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
          title={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
        >
          <FaBars />
        </button>
        <FaRobot className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Network Agent</h1>
      </div>
      <div className="flex items-center space-x-4 flex-wrap">
        <div className="text-sm">
          {connected ? (
            <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center`}>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-medium">Connected</span>
            </span>
          ) : (
            <span className={`${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center`}>
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-medium">Disconnected</span>
            </span>
          )}
        </div>
        <Link
          to="/documentation"
          className={`p-2 rounded-full ${darkMode ? 'text-indigo-400 hover:bg-gray-800' : 'text-indigo-600 hover:bg-indigo-50'} focus:outline-none transition-colors flex items-center`}
          aria-label="Documentation"
          title="Full Documentation"
        >
          <FaBook className="mr-1" />
          <span className="text-sm">Docs</span>
        </Link>
        <button
          onClick={() => setShowHelpModal(true)}
          className={`p-2 rounded-full ${darkMode ? 'text-indigo-400 hover:bg-gray-800' : 'text-indigo-600 hover:bg-indigo-50'} focus:outline-none transition-colors`}
          aria-label="Help"
          title="Help & Documentation"
        >
          <FaQuestion />
        </button>
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    </div>
  );
};

export default PageHeader; 