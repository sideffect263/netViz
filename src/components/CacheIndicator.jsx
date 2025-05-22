import React from 'react';
import { FaDatabase, FaClock, FaSync } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { clearCache } from '../api/dnsApi';

/**
 * A component that displays cache status information
 * @param {Object} props - Component props
 * @param {Object} props.cacheInfo - Cache information object
 * @param {Function} props.onRefresh - Function to call when refresh button is clicked
 * @param {String} props.label - Optional label to display
 */
const CacheIndicator = ({ cacheInfo, onRefresh, label }) => {
  if (!cacheInfo) return null;

  const { status, fromCache, timestamp } = cacheInfo;
  
  // Format the time since the data was cached
  let timeAgo = 'Just now';
  try {
    if (timestamp) {
      timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }
  } catch (error) {
    console.error('Error formatting timestamp:', error);
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };

  return (
    <div className={`flex items-center text-xs rounded-md px-2 py-1 ${fromCache ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
      {fromCache ? (
        <FaDatabase className="mr-1" title="Data loaded from cache" />
      ) : (
        <FaSync className="mr-1" title="Fresh data" />
      )}
      
      <span className="mr-1">
        {label && `${label}: `}
        {fromCache ? 'Cached' : 'Live'}
      </span>
      
      <FaClock className="mx-1" title="When data was retrieved" />
      <span>{timeAgo}</span>
      
      {fromCache && onRefresh && (
        <button 
          onClick={handleRefresh}
          className="ml-2 text-blue-700 hover:text-blue-900"
          title="Refresh data"
        >
          <FaSync />
        </button>
      )}
    </div>
  );
};

/**
 * A component that displays cache statistics and provides controls
 * to manage the cache
 * @param {Object} props - Component props
 * @param {Object} props.stats - Cache statistics
 * @param {Function} props.onClearCache - Function to call when cache is cleared
 */
export const CacheStats = ({ stats, onClearCache }) => {
  if (!stats) return null;

  const handleClearCache = async () => {
    try {
      await clearCache();
      if (typeof onClearCache === 'function') {
        onClearCache();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Cache Statistics</h3>
      <div className="text-sm text-gray-600">
        <p>Items in cache: <span className="font-medium">{stats.size}</span></p>
        {stats.keys && stats.keys.length > 0 && (
          <div className="mt-2">
            <p className="font-medium mb-1">Cached items:</p>
            <div className="max-h-32 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
              <ul className="list-disc pl-5">
                {stats.keys.map((key, index) => (
                  <li key={index}>{key}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <button
          onClick={handleClearCache}
          className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
};

export default CacheIndicator; 