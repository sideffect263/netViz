import React, { useState } from 'react';

const ThinkingEventGroup = ({ title, events, icon, renderEventContent, darkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`mb-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden transition-colors`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full flex items-center justify-between ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} px-4 py-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors`}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
          <span className={`ml-2 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} px-2 py-0.5 text-xs rounded-full transition-colors`}>
            {events.length}
          </span>
        </div>
        {/* Chevron icon */}
        <svg
          className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} space-y-3 transition-colors`}>
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} last:border-0 last:pb-0 transition-colors`}
            >
              {renderEventContent(event, darkMode)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThinkingEventGroup; 