import React, { useState, useEffect, useCallback } from 'react';
import { FaRobot, FaNetworkWired, FaLock, FaSearch, FaStop, FaHistory, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import autoHackerApi from '../api/autoHackerApi';

const AutoHackerPage = () => {
  const [target, setTarget] = useState('');
  const [scanDepth, setScanDepth] = useState('medium');
  const [aiMode, setAiMode] = useState('defensive');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [error, setError] = useState(null);
  const [currentStage, setCurrentStage] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [stageResults, setStageResults] = useState({});
  const [aiInsights, setAiInsights] = useState({});

  // Fetch scan status periodically when a scan is running
  const fetchScanStatus = useCallback(async () => {
    if (!scanId || !isScanning) return;

    try {
      const statusData = await autoHackerApi.getScanStatus(scanId);
      setScanProgress(statusData.progress);
      setCurrentStage(statusData.currentStage);

      // Update stage results if available
      if (statusData.stageResults) {
        setStageResults(prev => ({
          ...prev,
          [statusData.currentStage]: statusData.stageResults
        }));
      }

      // Update AI insights if available
      if (statusData.aiInsights) {
        setAiInsights(prev => ({
          ...prev,
          [statusData.currentStage]: statusData.aiInsights
        }));
      }

      if (statusData.status === 'completed' || statusData.status === 'failed') {
        setIsScanning(false);
        fetchScanResults();
      }
    } catch (error) {
      console.error('Error fetching scan status:', error);
      setError('Failed to update scan status. Please try again.');
      setIsScanning(false);
    }
  }, [scanId, isScanning]);

  // Fetch scan results once scan is complete
  const fetchScanResults = async () => {
    if (!scanId) return;

    try {
      const resultsData = await autoHackerApi.getScanResults(scanId);
      setScanResults(resultsData.results?.summary || null);
    } catch (error) {
      console.error('Error fetching scan results:', error);
      setError('Failed to retrieve scan results. Please try again.');
    }
  };

  // Load scan history
  const loadScanHistory = async () => {
    try {
      const historyData = await autoHackerApi.getScanHistory();
      setScanHistory(historyData);
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  // Setup polling for scan status
  useEffect(() => {
    let interval;
    
    if (isScanning && scanId) {
      interval = setInterval(fetchScanStatus, 2000); // Poll every 2 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanId, fetchScanStatus]);

  // Handle form submission to start a scan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setScanResults(null);
    setStageResults({});
    setAiInsights({});
    
    try {
      setIsScanning(true);
      setScanProgress(0);
      
      const response = await autoHackerApi.startScan({
        target,
        scanDepth,
        aiMode
      });
      
      setScanId(response.scanId);
    } catch (error) {
      console.error('Error starting scan:', error);
      setError('Failed to start scan. Please try again.');
      setIsScanning(false);
    }
  };

  // Cancel a running scan
  const handleCancelScan = async () => {
    if (!scanId || !isScanning) return;
    
    try {
      await autoHackerApi.cancelScan(scanId);
      setIsScanning(false);
      setError('Scan was cancelled');
    } catch (error) {
      console.error('Error cancelling scan:', error);
      setError('Failed to cancel scan');
    }
  };

  // Load a historical scan result
  const loadHistoricalScan = async (historicalScanId) => {
    setScanId(historicalScanId);
    setIsScanning(false);
    setError(null);
    
    try {
      const resultsData = await autoHackerApi.getScanResults(historicalScanId);
      setScanResults(resultsData.results?.summary || null);
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading historical scan:', error);
      setError('Failed to load scan results');
    }
  };

  // Format stage name for display
  const formatStageName = (stageName) => {
    if (!stageName) return '';
    return stageName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Render stage status icon
  const renderStageStatus = (stage) => {
    if (currentStage === stage) {
      return <FaSpinner className="animate-spin text-indigo-500" />;
    }
    if (stageResults[stage]) {
      return <FaCheck className="text-green-500" />;
    }
    return <FaTimes className="text-gray-400" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaRobot className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Autonomous Hacker</h1>
          </div>
          <button 
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadScanHistory(); }}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <FaHistory className="mr-1" /> {showHistory ? 'Hide History' : 'View History'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {showHistory ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan History</h2>
            {scanHistory.length === 0 ? (
              <p className="text-gray-500">No previous scans found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scanHistory.map(scan => (
                      <tr key={scan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scan.target}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            scan.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            scan.status === 'failed' ? 'bg-red-100 text-red-800' :
                            scan.status === 'cancelled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {scan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(scan.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => loadHistoricalScan(scan.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Results
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-4">
                The autonomous hacker uses AI to automatically discover and analyze network vulnerabilities 
                without manual intervention. Simply enter your target and let the AI handle the rest.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Domain or IP
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaNetworkWired className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="target"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="example.com or 192.168.1.1"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      disabled={isScanning}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scanDepth" className="block text-sm font-medium text-gray-700 mb-1">
                      Scan Depth
                    </label>
                    <select
                      id="scanDepth"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={scanDepth}
                      onChange={(e) => setScanDepth(e.target.value)}
                      disabled={isScanning}
                    >
                      <option value="basic">Basic - Fast but limited coverage</option>
                      <option value="medium">Medium - Balanced speed and depth</option>
                      <option value="deep">Deep - Thorough but slow scan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="aiMode" className="block text-sm font-medium text-gray-700 mb-1">
                      AI Mode
                    </label>
                    <select
                      id="aiMode"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={aiMode}
                      onChange={(e) => setAiMode(e.target.value)}
                      disabled={isScanning}
                    >
                      <option value="defensive">Defensive - Focus on hardening</option>
                      <option value="offensive">Offensive - Find exploitable vulnerabilities</option>
                      <option value="comprehensive">Comprehensive - Full analysis</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-2 flex space-x-4">
                  <button
                    type="submit"
                    disabled={isScanning}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {isScanning ? 'Scanning...' : 'Begin Autonomous Scan'}
                  </button>
                  
                  {isScanning && (
                    <button
                      type="button"
                      onClick={handleCancelScan}
                      className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaStop className="mr-2" /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {isScanning && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan Progress</h2>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-right mb-4">{scanProgress}% complete</p>
                
                <div className="space-y-4">
                  {['port_scan', 'service_detection', 'vulnerability_scan', 'web_analysis', 'ssl_scan'].map((stage) => (
                    <div key={stage} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {renderStageStatus(stage)}
                        <span className="ml-3 text-gray-700">{formatStageName(stage)}</span>
                      </div>
                      {stageResults[stage] && (
                        <div className="text-sm text-gray-500">
                          {Object.keys(stageResults[stage]).length} results
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {currentStage && (
                  <div className="mt-4 text-gray-700 bg-indigo-50 p-3 rounded">
                    <p className="font-medium">Currently Processing:</p>
                    <p>{formatStageName(currentStage)}</p>
                  </div>
                )}
              </div>
            )}

            {Object.keys(stageResults).length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Scan Results</h2>
                <div className="space-y-6">
                  {Object.entries(stageResults).map(([stage, results]) => (
                    <div key={stage} className="border-b border-gray-200 pb-4 last:border-0">
                      <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <FaNetworkWired className="mr-2 text-indigo-500" />
                        {formatStageName(stage)} - Output Details
                      </h3>
                      <div className="bg-gray-50 rounded-md p-4">
                        <pre className="text-sm overflow-x-auto">
                          {typeof results === 'string' ? results : JSON.stringify(results, null, 2)}
                        </pre>
                      </div>
                      {aiInsights[stage] && (
                        <div className="mt-3 bg-indigo-50 rounded-md p-4">
                          <h4 className="text-sm font-medium text-indigo-700 mb-2">AI Insights</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{aiInsights[stage]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {scanResults && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Final Analysis</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <FaLock className="mr-2 text-red-500" /> Vulnerabilities Detected
                  </h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    {scanResults.vulnerabilities && scanResults.vulnerabilities.length > 0 ? (
                      scanResults.vulnerabilities.map(vuln => (
                        <div key={vuln.id} className={`mb-3 p-3 rounded-md border-l-4 ${
                          vuln.severity === 'high' ? 'border-red-500 bg-red-50' : 
                          vuln.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 
                          'border-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex justify-between">
                            <h4 className="font-medium">{vuln.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              vuln.severity === 'high' ? 'bg-red-100 text-red-800' : 
                              vuln.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {vuln.severity}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{vuln.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No vulnerabilities detected.</p>
                    )}
                  </div>
                </div>

                {scanResults.aiInsights && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                      <FaRobot className="mr-2 text-indigo-500" /> AI Analysis
                    </h3>
                    <div className="bg-indigo-50 rounded-md p-4">
                      <p className="whitespace-pre-line">{scanResults.aiInsights}</p>
                    </div>
                  </div>
                )}

                {scanResults.final_analysis && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                      <FaSearch className="mr-2 text-indigo-500" /> Final Recommendations
                    </h3>
                    <div className="bg-indigo-50 rounded-md p-4">
                      <p className="whitespace-pre-line">{scanResults.final_analysis}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AutoHackerPage; 