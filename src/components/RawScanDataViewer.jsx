import React, { useState } from 'react';
import { FaTerminal, FaCopy, FaDownload, FaExpand, FaCompress, FaEye, FaCode } from 'react-icons/fa';

const RawScanDataViewer = ({ rawData, darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'raw'

  if (!rawData) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <FaTerminal className="mx-auto mb-2 text-2xl opacity-50" />
        <p>Raw scan data will appear here when available</p>
        <p className="text-xs mt-1">This shows the unprocessed output from scanning tools</p>
      </div>
    );
  }

  const copyToClipboard = () => {
    const textToCopy = typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2);
    navigator.clipboard.writeText(textToCopy);
  };

  const downloadData = () => {
    const textToDownload = typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2);
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-data-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatScanData = (data) => {
    if (typeof data === 'string') {
      // Try to detect if it's nmap output and format it nicely
      if (data.includes('Nmap scan report') || data.includes('PORT') || data.includes('STATE')) {
        return data.split('\n').map((line, idx) => {
          if (line.includes('Nmap scan report')) {
            return <div key={idx} className="font-bold text-blue-600 dark:text-blue-400 mb-2">{line}</div>;
          }
          if (line.includes('PORT') && line.includes('STATE')) {
            return <div key={idx} className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-1 mb-1">{line}</div>;
          }
          if (line.match(/^\d+\/\w+/)) {
            const parts = line.split(/\s+/);
            return (
              <div key={idx} className="font-mono text-sm">
                <span className="text-red-600 dark:text-red-400 font-bold">{parts[0]}</span>
                <span className="ml-4 text-green-600 dark:text-green-400">{parts[1]}</span>
                <span className="ml-4 text-blue-600 dark:text-blue-400">{parts.slice(2).join(' ')}</span>
              </div>
            );
          }
          return <div key={idx} className="text-gray-600 dark:text-gray-400 text-sm">{line}</div>;
        });
      }
      return <pre className="whitespace-pre-wrap text-sm">{data}</pre>;
    }
    
    // For JSON data
    return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded transition-colors`}>
      {/* Header with controls */}
      <div className={`flex items-center justify-between p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <FaTerminal className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Raw Scan Output</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'formatted' ? 'raw' : 'formatted')}
            className={`p-1 rounded text-xs ${darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            title={viewMode === 'formatted' ? 'Show raw data' : 'Show formatted data'}
          >
            {viewMode === 'formatted' ? <FaCode /> : <FaEye />}
          </button>
          
          <button
            onClick={copyToClipboard}
            className={`p-1 rounded text-xs ${darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            title="Copy to clipboard"
          >
            <FaCopy />
          </button>
          
          <button
            onClick={downloadData}
            className={`p-1 rounded text-xs ${darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            title="Download data"
          >
            <FaDownload />
          </button>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 rounded text-xs ${darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 ${expanded ? 'max-h-none' : 'max-h-64'} overflow-auto font-mono text-xs`}>
        {viewMode === 'formatted' ? formatScanData(rawData) : (
          <pre className="whitespace-pre-wrap">
            {typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default RawScanDataViewer; 