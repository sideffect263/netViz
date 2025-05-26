import React, { useState } from 'react';
import { FaBrain, FaExpand, FaCompress } from 'react-icons/fa';
import AnalysisEntry from './analysis/AnalysisEntry';
import useAnalysisProcessor from '../hooks/useAnalysisProcessor';

const AIAnalysisViewer = ({ events, darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const analysisEntries = useAnalysisProcessor(events);

  if (analysisEntries.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <FaBrain className="mx-auto mb-2 text-2xl opacity-50" />
        <p>AI analysis will appear here</p>
        <p className="text-xs mt-1">The agent's reasoning about scan data and security implications</p>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded transition-colors`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <FaBrain className={`${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            AI Security Analysis
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {analysisEntries.length} insights
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 rounded text-xs ${darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Analysis entries */}
      <div className={`${expanded ? 'max-h-none' : 'max-h-64'} overflow-auto`}>
        {analysisEntries.map((entry, index) => (
          <AnalysisEntry key={index} entry={entry} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default AIAnalysisViewer; 