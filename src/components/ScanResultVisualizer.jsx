import React, { useState, useEffect } from 'react';
import { FaNetworkWired, FaLockOpen, FaLock, FaServer, FaDownload } from 'react-icons/fa';

const ScanResultVisualizer = ({ result, darkMode }) => {
  const [visualData, setVisualData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (!result) return;

    try {
      // Try to parse the result if it contains JSON data
      let parsedData;
      let rawString = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      // Extract JSON from the string if needed
      const jsonMatch =
        result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*}/);

      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else if (typeof result === 'string' && result.includes('"port":')) {
        // Try to parse the entire string as JSON
        parsedData = JSON.parse(result);
      } else if (typeof result === 'object') {
        parsedData = result;
        rawString = JSON.stringify(result, null, 2);
      } else {
        // Couldn't extract JSON, use the raw result
        setVisualData({ type: 'text', data: result, raw: rawString });
        return;
      }

      // Process the parsed data for visualization
      if (parsedData) {
        setVisualData({
          type: 'scan',
          data: parsedData,
          summary: extractScanSummary(parsedData),
          raw: rawString
        });
      }
    } catch (error) {
      console.error('Error parsing scan result:', error);
      setVisualData({ type: 'text', data: result, raw: typeof result === 'string' ? result : JSON.stringify(result, null, 2) });
    }
  }, [result]);

  // Extract a summary from scan results
  const extractScanSummary = (data) => {
    try {
      let openPorts = 0;
      let closedPorts = 0;
      let hosts = 0;
      let services = [];

      // Count hosts
      if (data.hosts) {
        hosts = data.hosts.length;

        // Count open/closed ports and collect services
        data.hosts.forEach((host) => {
          if (host.ports) {
            host.ports.forEach((port) => {
              if (port.state === 'open') {
                openPorts++;
                if (port.service && port.service.name) {
                  services.push(port.service.name);
                }
              } else {
                closedPorts++;
              }
            });
          }
        });
      }

      // Alternative data structure
      if (data.ports) {
        data.ports.forEach((port) => {
          if (port.state === 'open') {
            openPorts++;
            if (port.service) services.push(port.service);
          } else {
            closedPorts++;
          }
        });
      }

      // De-duplicate services
      services = [...new Set(services)];

      return {
        hosts,
        openPorts,
        closedPorts,
        services
      };
    } catch (error) {
      console.error('Error extracting scan summary:', error);
      return { hosts: 0, openPorts: 0, closedPorts: 0, services: [] };
    }
  };

  if (!visualData) return null;

  // Raw text results
  if (visualData.type === 'text') {
    return (
      
      <div></div>
    );
  }

  // Visualized scan results
  return (
    <div
      className={`mt-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow border overflow-hidden transition-colors`}
    >
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
        <div className="flex">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? darkMode
                  ? 'bg-indigo-900 text-indigo-300 border-b-2 border-indigo-500'
                  : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? darkMode
                  ? 'bg-indigo-900 text-indigo-300 border-b-2 border-indigo-500'
                  : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'raw'
                ? darkMode
                  ? 'bg-indigo-900 text-indigo-300 border-b-2 border-indigo-500'
                  : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Raw Data
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'summary' && (
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors`}>
              Scan Summary
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div
                className={`${
                  darkMode ? 'bg-blue-900' : 'bg-blue-50'
                } p-3 rounded-lg border ${darkMode ? 'border-blue-800' : 'border-blue-100'} transition-colors`}
              >
                <div className="flex items-center">
                  <FaNetworkWired className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>
                    Hosts
                  </span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'} mt-1 transition-colors`}>
                  {visualData.summary.hosts || 1}
                </p>
              </div>

              <div
                className={`${
                  darkMode ? 'bg-green-900' : 'bg-green-50'
                } p-3 rounded-lg border ${darkMode ? 'border-green-800' : 'border-green-100'} transition-colors`}
              >
                <div className="flex items-center">
                  <FaLockOpen className={`${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>
                    Open Ports
                  </span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-700'} mt-1 transition-colors`}>
                  {visualData.summary.openPorts || 0}
                </p>
              </div>

              <div
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-gray-50'
                } p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}
              >
                <div className="flex items-center">
                  <FaLock className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>
                    Closed Ports
                  </span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1 transition-colors`}>
                  {visualData.summary.closedPorts || 0}
                </p>
              </div>

              <div
                className={`${
                  darkMode ? 'bg-purple-900' : 'bg-purple-50'
                } p-3 rounded-lg border ${darkMode ? 'border-purple-800' : 'border-purple-100'} transition-colors`}
              >
                <div className="flex items-center">
                  <FaServer className={`${darkMode ? 'text-purple-400' : 'text-purple-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>
                    Services
                  </span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'} mt-1 transition-colors`}>
                  {visualData.summary.services?.length || 0}
                </p>
              </div>
            </div>

            {visualData.summary.services && visualData.summary.services.length > 0 && (
              <div>
                <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors`}>
                  Detected Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {visualData.summary.services.map((service, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 ${
                        darkMode ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                      } text-xs rounded-full transition-colors`}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className={`flex items-center text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}
              >
                <FaDownload className="mr-1" />
                Export Results
              </button>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors`}>
              Detailed Results
            </h3>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors`}>
                <thead className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Port
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Protocol
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      State
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Service
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Service Version
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors`}>
                  {(visualData.data.ports ||
                    (visualData.data.hosts && visualData.data.hosts[0]?.ports) ||
                    []).map((port, idx) => (
                    <tr
                      key={idx}
                      className={
                        port.state === 'open' ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''
                      }
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} transition-colors`}
                      >
                        {port.portid || port.port || 'N/A'}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}
                      >
                        {port.protocol || 'tcp'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                            port.state === 'open'
                              ? darkMode
                                ? 'bg-green-800 text-green-200'
                                : 'bg-green-100 text-green-800'
                              : darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {port.state || 'unknown'}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}
                      >
                        {(port.service && port.service.name) || port.service || 'N/A'}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}
                      >
                        {(port.service && (port.service.version || port.service.product)) || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors`}>
              Raw Data
            </h3>
            <pre
              className={`${
                darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
              } p-3 rounded text-sm overflow-x-auto max-h-96 whitespace-pre-wrap transition-colors`}
            >
              {/* Show full raw MCP output for maximum detail */}
              {visualData.raw}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanResultVisualizer; 