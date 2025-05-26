import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCloudDownloadAlt } from 'react-icons/fa';

const StatusIndicators = ({ 
  error, 
  progressMessage, 
  scanInProgress, 
  scanPhase, 
  scanDuration, 
  scanProgress, 
  command, 
  darkMode 
}) => {
  // Format scan duration
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <>
      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Messages */}
      {progressMessage && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <FaInfoCircle className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-blue-700">{progressMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Scan Progress Indicator */}
      {scanInProgress && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
          <div className="flex flex-col">
            <div className="flex items-start mb-2">
              <FaCloudDownloadAlt className="text-indigo-500 mr-3 animate-pulse text-xl" />
              <div className="flex-grow">
                <p className="text-sm text-indigo-700 font-medium flex justify-between">
                  <span>{scanPhase || 'Network scan in progress...'}</span>
                  <span className="font-semibold">Elapsed time: {formatDuration(scanDuration)}</span>
                </p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="ml-8">
              <p className="text-xs text-indigo-600 mt-1">
                <span className="text-indigo-800 font-medium">Target:</span> {command.replace(/^scan\s+|^run a .* scan on\s+/i, '')}
              </p>
              <p className="text-xs text-indigo-600">
                Comprehensive scans may take several minutes. The system will automatically simplify parameters if needed.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusIndicators; 