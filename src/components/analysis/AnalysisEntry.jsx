import React from 'react';
import { FaBrain, FaLightbulb, FaShieldAlt, FaSearch, FaClipboardList } from 'react-icons/fa';

const AnalysisEntry = ({ entry, darkMode }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'reasoning': return <FaBrain className="text-purple-500" />;
      case 'observation': return <FaSearch className="text-blue-500" />;
      case 'tool_analysis': return <FaClipboardList className="text-green-500" />;
      case 'result_analysis': return <FaShieldAlt className="text-orange-500" />;
      case 'insight': return <FaLightbulb className="text-yellow-500" />;
      case 'summary': return <FaClipboardList className="text-blue-400" />;
      default: return <FaBrain className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'reasoning': return 'Strategic Thinking';
      case 'observation': return 'Data Observation';
      case 'tool_analysis': return 'Tool Deployment';
      case 'result_analysis': return 'Result Analysis';
      case 'insight': return 'Security Insight';
      case 'summary': return 'Agent Summary';
      default: return 'Analysis';
    }
  };

  return (
    <div className={`p-3 border-b last:border-b-0 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
      <div className="flex items-start space-x-3">
        <div className="mt-1">
          {getIcon(entry.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {getTypeLabel(entry.type)}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            {entry.content}
          </p>
          {entry.toolName && (
            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
              darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
            }`}>
              {entry.toolName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisEntry; 