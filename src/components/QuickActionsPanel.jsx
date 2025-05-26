import React from 'react';
import { FaRobot } from 'react-icons/fa';

const QuickActionsPanel = ({ quickActions, applyQuickAction, isProcessing, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-md overflow-hidden mb-6 transition-colors`}>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center">
        <FaRobot className="mr-3 text-xl" />
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <span className="ml-auto text-blue-100 text-sm">Choose your reconnaissance method</span>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => applyQuickAction(action.command)}
              disabled={isProcessing}
              className={`w-full py-4 px-5 ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 hover:shadow-lg' 
                : 'bg-gray-50 hover:bg-indigo-50 border-gray-200 text-gray-700 hover:shadow-md hover:border-indigo-300'
              } border rounded-lg text-left transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{action.icon}</span>
                <span className="text-sm font-medium">{action.name}</span>
              </div>
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {action.tooltip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel; 