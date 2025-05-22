import React, { useState, useEffect } from 'react';
import { FaDatabase, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { getCacheStats, clearCache } from '../api/dnsApi';
import { CacheStats } from '../components/CacheIndicator';

const AdminPage = () => {
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const fetchCacheStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await getCacheStats();
      setCacheStats(stats);
      setLastUpdated(new Date());
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cache stats:', err);
      setError('Failed to load cache statistics. ' + err.message);
      setLoading(false);
    }
  };
  
  const handleClearCache = async () => {
    try {
      await clearCache();
      await fetchCacheStats();
    } catch (err) {
      console.error('Error clearing cache:', err);
      setError('Failed to clear cache. ' + err.message);
    }
  };
  
  useEffect(() => {
    fetchCacheStats();
    
    // Set up a polling interval to refresh stats every 30 seconds
    const interval = setInterval(fetchCacheStats, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Server statistics and configuration
              </p>
            </div>
            <button
              onClick={fetchCacheStats}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? (
                <FaSync className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <FaSync className="mr-2 h-4 w-4" />
              )}
              Refresh
            </button>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaDatabase className="mr-2 text-indigo-500" />
              Cache Management
            </h2>
            
            {lastUpdated && (
              <p className="text-xs text-gray-500 mb-4">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            
            {error && (
              <div className="mb-4 bg-red-50 p-4 rounded-md">
                <div className="flex">
                  <FaExclamationTriangle className="text-red-400 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {loading && !cacheStats ? (
              <div className="text-center py-12">
                <FaSync className="animate-spin h-8 w-8 text-indigo-500 mx-auto" />
                <p className="mt-2 text-gray-500">Loading cache statistics...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <CacheStats 
                  stats={cacheStats} 
                  onClearCache={handleClearCache} 
                />
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Cache Information</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      The cache system stores recent scan results to improve performance and reduce
                      load on external services.
                    </p>
                    <p>
                      Cached data expires after 30 minutes, or when manually cleared.
                    </p>
                    <p>
                      When a request is served from cache, the response will be faster,
                      and you'll see a "Cached" indicator on the results page.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 