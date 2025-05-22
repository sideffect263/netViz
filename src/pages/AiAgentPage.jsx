import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaTerminal, FaLightbulb, FaSpinner, FaCode, FaExclamationTriangle, FaInfoCircle, FaCloudDownloadAlt, FaHistory, FaChevronUp, FaServer, FaNetworkWired, FaLock, FaLockOpen, FaDownload, FaSearch, FaMoon, FaSun, FaQuestion, FaBook } from 'react-icons/fa';
import axios from 'axios';
import HelpModal from '../components/HelpModal';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'
  : 'https://netviz-dashboard.ofektechnology.com/api';

// Custom hook for WebSocket connection
const useAgentWebSocket = (sessionId) => {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    // Create WebSocket connection
    const wsURL = process.env.NODE_ENV === 'development' 
      ? 'ws://localhost:5000'
      : 'wss://netviz-dashboard.ofektechnology.com';
    const ws = new WebSocket(wsURL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnected(true);
      
      // Register this session
      ws.send(JSON.stringify({
        type: 'register',
        sessionId: sessionId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Only process events for our session
        if (data.sessionId === sessionId) {
          setEvents(prevEvents => [...prevEvents, {
            ...data,
            receivedAt: new Date().toISOString()
          }]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [sessionId]);

  return { connected, events };
};

// Collapsible event group component for thinking pane
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
        <svg
          className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {!isCollapsed && (
        <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} space-y-3 transition-colors`}>
          {events.map((event, idx) => (
            <div key={idx} className={`pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} last:border-0 last:pb-0 transition-colors`}>
              {renderEventContent(event, darkMode)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Update ScanResultVisualizer to support dark mode
const ScanResultVisualizer = ({ result, darkMode }) => {
  const [visualData, setVisualData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  
  useEffect(() => {
    if (!result) return;
    
    try {
      // Try to parse the result if it contains JSON data
      let parsedData;
      // Extract JSON from the string if needed
      const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else if (typeof result === 'string' && result.includes('"port":')) {
        // Try to parse the entire string as JSON
        parsedData = JSON.parse(result);
      } else {
        // Couldn't extract JSON, use the raw result
        setVisualData({ type: 'text', data: result });
        return;
      }
      
      // Process the parsed data for visualization
      if (parsedData) {
        setVisualData({ 
          type: 'scan',
          data: parsedData,
          summary: extractScanSummary(parsedData)
        });
      }
    } catch (error) {
      console.error('Error parsing scan result:', error);
      setVisualData({ type: 'text', data: result });
    }
  }, [result]);
  
  // Extract a summary from scan results
  const extractScanSummary = (data) => {
    // This is a simplified example - you would need to adapt this to your actual data structure
    try {
      let openPorts = 0;
      let closedPorts = 0;
      let hosts = 0;
      let services = [];
      
      // Count hosts
      if (data.hosts) {
        hosts = data.hosts.length;
        
        // Count open/closed ports and collect services
        data.hosts.forEach(host => {
          if (host.ports) {
            host.ports.forEach(port => {
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
      
      // Count open ports from an alternative data structure
      if (data.ports) {
        data.ports.forEach(port => {
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
  
  // If no data is available yet
  if (!visualData) return null;
  
  // For raw text results
  if (visualData.type === 'text') {
    return (
      <div className={`mt-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow border transition-colors`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors`}>Scan Results</h3>
        <pre className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-800'} p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap transition-colors`}>
          {visualData.data}
        </pre>
      </div>
    );
  }
  
  // For scan results that we can visualize
  return (
    <div className={`mt-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow border overflow-hidden transition-colors`}>
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
        <div className="flex">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'summary' 
                ? (darkMode 
                  ? 'bg-indigo-900 text-indigo-300 border-b-2 border-indigo-500' 
                  : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500')
                : (darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50')
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'details' 
                ? (darkMode 
                  ? 'bg-indigo-900 text-indigo-300 border-b-2 border-indigo-500' 
                  : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500')
                : (darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50')
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'raw' 
                ? (darkMode 
                  ? 'bg-indigo-900 text-indigo-300 border-b-2 border-indigo-500' 
                  : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500')
                : (darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50')
            }`}
          >
            Raw Data
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'summary' && (
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors`}>Scan Summary</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-3 rounded-lg border ${darkMode ? 'border-blue-800' : 'border-blue-100'} transition-colors`}>
                <div className="flex items-center">
                  <FaNetworkWired className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>Hosts</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'} mt-1 transition-colors`}>
                  {visualData.summary.hosts || 1}
                </p>
              </div>
              
              <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} p-3 rounded-lg border ${darkMode ? 'border-green-800' : 'border-green-100'} transition-colors`}>
                <div className="flex items-center">
                  <FaLockOpen className={`${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>Open Ports</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-700'} mt-1 transition-colors`}>
                  {visualData.summary.openPorts || 0}
                </p>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
                <div className="flex items-center">
                  <FaLock className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>Closed Ports</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1 transition-colors`}>
                  {visualData.summary.closedPorts || 0}
                </p>
              </div>
              
              <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-50'} p-3 rounded-lg border ${darkMode ? 'border-purple-800' : 'border-purple-100'} transition-colors`}>
                <div className="flex items-center">
                  <FaServer className={`${darkMode ? 'text-purple-400' : 'text-purple-500'} mr-2 transition-colors`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>Services</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'} mt-1 transition-colors`}>
                  {visualData.summary.services?.length || 0}
                </p>
              </div>
            </div>
            
            {/* Services List */}
            {visualData.summary.services && visualData.summary.services.length > 0 && (
              <div>
                <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors`}>Detected Services</h4>
                <div className="flex flex-wrap gap-2">
                  {visualData.summary.services.map((service, idx) => (
                    <span key={idx} className={`px-2 py-1 ${darkMode ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-100 text-indigo-800'} text-xs rounded-full transition-colors`}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button className={`flex items-center text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}>
                <FaDownload className="mr-1" />
                Export Results
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors`}>Detailed Results</h3>
            {/* Render a more detailed view of the scan results */}
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
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors`}>
                  {/* This is a simplified example - adapt to your actual data structure */}
                  {(visualData.data.ports || 
                    (visualData.data.hosts && visualData.data.hosts[0]?.ports) || 
                    []).map((port, idx) => (
                    <tr key={idx} className={port.state === 'open' ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} transition-colors`}>
                        {port.portid || port.port || 'N/A'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}>
                        {port.protocol || 'tcp'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                          port.state === 'open' 
                            ? (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') 
                            : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                        }`}>
                          {port.state || 'unknown'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}>
                        {(port.service && port.service.name) || port.service || 'N/A'}
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
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors`}>Raw Data</h3>
            <pre className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'} p-3 rounded text-sm overflow-x-auto max-h-96 whitespace-pre-wrap transition-colors`}>
              {JSON.stringify(visualData.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Command autocomplete component
const CommandAutocomplete = ({ command, setCommand, disabled, darkMode }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  
  // Common commands and their templates
  const commonCommands = [
    { text: "scan ", description: "Basic scan" },
    { text: "scan for open ports on ", description: "Port scan" },
    { text: "run a quick scan on ", description: "Fast scan with default options" },
    { text: "scan for services on ", description: "Service detection" },
    { text: "scan for vulnerabilities on ", description: "Vulnerability scan" },
    { text: "run a comprehensive scan on ", description: "Full detailed scan" },
    { text: "check if port 80 is open on ", description: "Check specific port" },
    { text: "scan network range ", description: "Scan IP range" },
    { text: "what can you do", description: "Get capabilities" },
    { text: "help", description: "Show help" }
  ];
  
  // Common targets to suggest
  const commonTargets = [
    "localhost",
    "example.com",
    "192.168.1.1",
    "10.0.0.1",
    "127.0.0.1",
    "google.com"
  ];
  
  // Update suggestions based on current command
  useEffect(() => {
    if (!command || disabled) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Filter commands that start with the current input
    let filteredSuggestions = [];
    
    // If the command contains a domain/IP already, don't suggest commands
    if (command.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b|\b[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b/)) {
      setShowSuggestions(false);
      return;
    }
    
    // If command ends with a space, suggest targets
    if (command.endsWith(' ')) {
      // Check if the command is asking for a target
      const needsTarget = commonCommands.some(cmd => command.startsWith(cmd.text) && command.length === cmd.text.length);
      
      if (needsTarget) {
        filteredSuggestions = commonTargets.map(target => ({
          text: command + target,
          description: `Target: ${target}`
        }));
      }
    } else {
      // Suggest commands that match the current input
      filteredSuggestions = commonCommands.filter(cmd => 
        cmd.text.toLowerCase().startsWith(command.toLowerCase())
      );
    }
    
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [command, disabled]);
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion.text);
    setShowSuggestions(false);
    
    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle keyboard navigation of suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const suggestionElements = document.querySelectorAll('.suggestion-item');
      if (suggestionElements.length > 0) {
        suggestionElements[0].focus();
      }
    }
    
    // Escape key
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
    
    // Tab key - autocomplete with first suggestion
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setCommand(suggestions[0].text);
    }
  };
  
  // Handle suggestion item keyboard navigation
  const handleSuggestionKeyDown = (e, index, suggestion) => {
    // Arrow navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const suggestionElements = document.querySelectorAll('.suggestion-item');
      const currentIndex = index;
      const nextIndex = e.key === 'ArrowDown' 
        ? (currentIndex + 1) % suggestionElements.length
        : (currentIndex - 1 + suggestionElements.length) % suggestionElements.length;
      
      if (suggestionElements[nextIndex]) {
        suggestionElements[nextIndex].focus();
      }
    }
    
    // Enter or Tab to select
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
    
    // Escape key
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <input
          id="command-input"
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={(e) => {
            // Only hide if we're not clicking a suggestion
            if (!e.relatedTarget?.classList.contains('suggestion-item')) {
              setTimeout(() => setShowSuggestions(false), 150);
            }
          }}
          disabled={disabled}
          className={`flex-grow px-4 py-2 border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          placeholder="Enter a command..."
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !command.trim()}
          className={`bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
        >
          Send
        </button>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`suggestion-item w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition-colors flex items-center justify-between ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, index, suggestion)}
              tabIndex={0}
            >
              <span className={`text-${darkMode ? 'gray-200' : 'gray-800'} font-medium`}>{suggestion.text}</span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Theme toggle button component
const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-full focus:outline-none transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="text-yellow-400 text-xl" />
      ) : (
        <FaMoon className="text-indigo-600 text-xl" />
      )}
    </button>
  );
};

// HelpTool component - displays common capability questions as buttons
const HelpTool = ({ onSelect }) => {
  const helpOptions = [
    { text: "What can you do?", description: "Show general capabilities" },
    { text: "What types of scans can you perform?", description: "List available scan types" },
    { text: "How do I use the scanning features?", description: "Show command examples" }
  ];
  
  return (
    <div className="mt-4 mb-2">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Common questions:</div>
      <div className="flex flex-wrap gap-2">
        {helpOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.text)}
            className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full transition-colors"
            title={option.description}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const AiAgentPage = () => {
  const [sessionId, setSessionId] = useState('');
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanStartTime, setScanStartTime] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHelpTool, setShowHelpTool] = useState(false);
  
  // Connect to WebSocket
  const { connected, events } = useAgentWebSocket(sessionId);

  // References for auto-scrolling
  const chatBoxRef = useRef(null);
  const thinkingBoxRef = useRef(null);

  // Auto-scroll chat and thinking panes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    if (thinkingBoxRef.current) {
      thinkingBoxRef.current.scrollTop = thinkingBoxRef.current.scrollHeight;
    }
  }, [events, finalResult]);

  // Generate a session ID when the component mounts
  useEffect(() => {
    // Generate a random session ID
    const newSessionId = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
  }, []);

  // Watch for the final result in the events
  useEffect(() => {
    // Find the command_result event, which indicates the final result
    const resultEvent = events.find(event => event.type === 'command_result');
    if (resultEvent) {
      setFinalResult(resultEvent.result);
      setIsProcessing(false);
      setScanInProgress(false);
      setProgressMessage(null);
    }
    
    // Check for errors
    const errorEvent = events.find(event => event.type === 'error');
    if (errorEvent) {
      setError(errorEvent.error);
      setIsProcessing(false);
      setScanInProgress(false);
      setProgressMessage(null);
    }
    
    // Check for tool start events for Nmap
    const nmapStartEvent = events.find(event => 
      event.type === 'tool_start' && 
      event.toolName === 'NmapScanner'
    );
    if (nmapStartEvent && !scanInProgress) {
      setScanInProgress(true);
      setScanStartTime(new Date());
    }
    
    // Check for tool end events for Nmap
    const nmapEndEvent = events.find(event => 
      event.type === 'tool_end' && 
      events.some(e => e.type === 'tool_start' && e.toolName === 'NmapScanner')
    );
    if (nmapEndEvent && scanInProgress) {
      setScanInProgress(false);
    }
    
    // Check for progress updates
    const progressEvent = events.find(event => event.type === 'progress_update');
    if (progressEvent) {
      setProgressMessage(progressEvent.message);
    }
  }, [events, scanInProgress]);

  // Timer for scan duration
  const [scanDuration, setScanDuration] = useState(0);
  useEffect(() => {
    let timer;
    if (scanInProgress && scanStartTime) {
      timer = setInterval(() => {
        const seconds = Math.floor((new Date() - scanStartTime) / 1000);
        setScanDuration(seconds);
      }, 1000);
    } else {
      setScanDuration(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [scanInProgress, scanStartTime]);

  // Add a new effect to simulate progress for scans
  useEffect(() => {
    let progressInterval;
    
    if (scanInProgress) {
      // Reset progress when a new scan starts
      setScanProgress(0);
      setScanPhase('Initializing scan...');
      
      // Simulate progress updates
      progressInterval = setInterval(() => {
        setScanProgress(prev => {
          // Slow down progress as it gets closer to 100%
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 90 ? 1 : 0.5;
          const newProgress = Math.min(prev + increment, 99); // Never reach 100% until complete
          
          // Update phase based on progress
          if (prev < 20 && newProgress >= 20) {
            setScanPhase('Discovering hosts...');
          } else if (prev < 40 && newProgress >= 40) {
            setScanPhase('Port scanning...');
          } else if (prev < 70 && newProgress >= 70) {
            setScanPhase('Service detection...');
          } else if (prev < 90 && newProgress >= 90) {
            setScanPhase('Finalizing results...');
          }
          
          return newProgress;
        });
      }, 1000);
    } else if (!scanInProgress && scanProgress > 0) {
      // Set to 100% when scan completes
      setScanProgress(100);
      setScanPhase('Scan complete!');
      
      // Reset progress after a delay
      const resetTimeout = setTimeout(() => {
        setScanProgress(0);
        setScanPhase('');
      }, 3000);
      
      return () => clearTimeout(resetTimeout);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [scanInProgress, scanProgress]);

  // Predefined quick action scan templates
  const quickActions = [
    { name: "Quick Scan", command: "run a quick scan on ", icon: "⚡", tooltip: "Fast scan of common ports" },
    { name: "Service Scan", command: "scan for services on ", icon: "🔍", tooltip: "Identify running services on common ports" },
    { name: "Full Port Scan", command: "run a comprehensive port scan on ", icon: "🔐", tooltip: "Scan all ports (takes longer)" },
    { name: "Vulnerability Scan", command: "check for vulnerabilities on ", icon: "🛡️", tooltip: "Scan for common vulnerabilities" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add command to history if not already the most recent entry
    if (commandHistory.length === 0 || commandHistory[0] !== command) {
      setCommandHistory(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
    }
    
    setIsProcessing(true);
    setFinalResult(null);
    setError(null);
    setProgressMessage(null);
    setScanInProgress(false);
    setScanDuration(0);
    
    try {
      // Clear previous events
      events.length = 0;
      
      // Send command to API
      const response = await axios.post(`${API_URL}/agent/command`, {
        command: command,
        sessionId: sessionId
      });
      
      // Response should come back quickly with acknowledgment
      console.log('Command sent, processing started:', response.data);
      
      // Note: The actual result will come via WebSocket
    } catch (error) {
      console.error('Error sending command:', error);
      setError(error.response?.data?.error || 'Error sending command');
      setIsProcessing(false);
    }
  };

  const selectHistoryCommand = (cmd) => {
    setCommand(cmd);
    setShowHistory(false);
  };

  // Format scan duration
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Organize events by type for the thinking pane
  const organizeEvents = (events) => {
    const groups = {
      llm: events.filter(e => e.type.startsWith('llm_')),
      tool: events.filter(e => e.type.startsWith('tool_')),
      agent: events.filter(e => e.type.startsWith('agent_')),
      progress: events.filter(e => e.type === 'progress_update'),
      error: events.filter(e => e.type === 'error'),
      other: events.filter(e => !e.type.startsWith('llm_') && !e.type.startsWith('tool_') && !e.type.startsWith('agent_') && e.type !== 'progress_update' && e.type !== 'error')
    };
    
    return groups;
  };
  
  // Render different event types in the thinking pane
  const renderEventContent = (event, darkMode) => {
    switch (event.type) {
      case 'llm_start':
        return (
          <div className="flex items-start">
            <FaLightbulb className="mr-2 text-yellow-500 mt-1" />
            <div className={`text-${darkMode ? 'gray-300' : 'gray-700'}`}>{event.content}</div>
          </div>
        );
      
      case 'llm_token':
        return (
          <span className={`text-${darkMode ? 'gray-300' : 'gray-700'}`}>{event.content}</span>
        );
      
      case 'tool_start':
        return (
          <div className="flex items-start">
            <FaCode className="mr-2 text-blue-500 mt-1" />
            <div>
              <span className="font-medium text-blue-600">Using tool: {event.toolName}</span>
              <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                {JSON.stringify(event.input, null, 2)}
              </pre>
            </div>
          </div>
        );
      
      case 'tool_end':
        return (
          <div className="flex items-start">
            <FaTerminal className="mr-2 text-green-500 mt-1" />
            <div>
              <span className="font-medium text-green-600">Tool output:</span>
              <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                {typeof event.output === 'string' 
                  ? event.output 
                  : JSON.stringify(event.output, null, 2)}
              </pre>
            </div>
          </div>
        );
      
      case 'progress_update':
        return (
          <div className="flex items-start">
            <FaInfoCircle className="mr-2 text-blue-500 mt-1" />
            <div className={`text-${darkMode ? 'gray-300' : 'gray-700'}`}>{event.message}</div>
          </div>
        );
      
      case 'agent_action':
        return (
          <div className="flex items-start">
            <FaRobot className="mr-2 text-purple-500 mt-1" />
            <div>
              <span className="font-medium text-purple-600">Agent action: {event.tool}</span>
              <div className="mt-1 text-gray-700">{event.log}</div>
              <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                {typeof event.toolInput === 'string' 
                  ? event.toolInput 
                  : JSON.stringify(event.toolInput, null, 2)}
              </pre>
            </div>
          </div>
        );
      
      case 'agent_end':
        return (
          <div className="flex items-start">
            <FaRobot className="mr-2 text-indigo-500 mt-1" />
            <div>
              <span className="font-medium text-indigo-600">Agent finished</span>
              <div className="mt-1 text-gray-700">{event.log}</div>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-start">
            <FaExclamationTriangle className="mr-2 text-red-500 mt-1" />
            <div className={`text-${darkMode ? 'gray-300' : 'gray-700'}`}>{event.error}</div>
          </div>
        );
      
      default:
        return (
          <div className={`text-${darkMode ? 'gray-300' : 'gray-700'}`}>
            {event.type}: {JSON.stringify(event)}
          </div>
        );
    }
  };

  const applyQuickAction = (actionCommand) => {
    setCommand(actionCommand);
    // Focus the input field
    const inputElement = document.getElementById('command-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  // Initialize dark mode from local storage or system preference
  useEffect(() => {
    // Check for saved preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);
  
  // Apply dark mode class to the document when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Handle selecting a help option
  const handleHelpOptionSelect = (question) => {
    setCommand(question);
    // Optionally auto-submit the command
    handleSubmit({ preventDefault: () => {} });
    setShowHelpTool(false);
  };
  
  // Show help tool when "Need help?" is clicked
  const toggleHelpTool = () => {
    setShowHelpTool(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaRobot className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-3`} />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Network Agent</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                {connected ? (
                  <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center`}>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Connected
                  </span>
                ) : (
                  <span className={`${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center`}>
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Disconnected
                  </span>
                )}
              </div>
              <Link
                to="/documentation"
                className={`p-2 rounded-full ${darkMode ? 'text-indigo-400 hover:bg-gray-800' : 'text-indigo-600 hover:bg-indigo-50'} focus:outline-none transition-colors flex items-center`}
                aria-label="Documentation"
                title="Full Documentation"
              >
                <FaBook className="mr-1" />
                <span className="text-sm">Docs</span>
              </Link>
              <button
                onClick={() => setShowHelpModal(true)}
                className={`p-2 rounded-full ${darkMode ? 'text-indigo-400 hover:bg-gray-800' : 'text-indigo-600 hover:bg-indigo-50'} focus:outline-none transition-colors`}
                aria-label="Help"
                title="Help & Documentation"
              >
                <FaQuestion />
              </button>
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>

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

          {/* Quick Actions Panel */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-md overflow-hidden mb-6 transition-colors`}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center">
              <FaRobot className="mr-2" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <div key={index} className="relative group">
                  <button
                    onClick={() => applyQuickAction(action.command)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 ${darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' 
                      : 'bg-gray-50 hover:bg-indigo-50 border-gray-200 text-gray-700'
                    } border rounded-lg text-left transition-colors`}
                  >
                    <span className="text-xl mr-2">{action.icon}</span>
                    <span className="text-sm font-medium">{action.name}</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {action.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chat Pane */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors`}>
              <div className="bg-indigo-600 text-white px-4 py-3 flex items-center">
                <FaTerminal className="mr-2" />
                <h2 className="text-lg font-semibold">Chat</h2>
              </div>
              
              <div 
                ref={chatBoxRef}
                className={`h-96 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
              >
                {/* User command */}
                {command && (
                  <div className="flex justify-end">
                    <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-lg p-3 max-w-md transition-colors`}>
                      <p className={`${darkMode ? 'text-indigo-100' : 'text-gray-800'}`}>{command}</p>
                    </div>
                  </div>
                )}
                
                {/* Agent response */}
                {(isProcessing || finalResult) && (
                  <div className="flex justify-start">
                    <div className={`${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white'} rounded-lg p-3 max-w-md shadow-sm transition-colors`}>
                      {isProcessing ? (
                        <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <FaSpinner className="animate-spin mr-2" />
                          <p>Processing your request...</p>
                        </div>
                      ) : finalResult ? (
                        <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-line`}>{finalResult}</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Adjust ScanResultVisualizer for dark mode in a separate edit */}
              {finalResult && !isProcessing && (
                <ScanResultVisualizer result={finalResult} darkMode={darkMode} />
              )}
              
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4 transition-colors`}>
                {/* Command History Dropdown */}
                {commandHistory.length > 0 && (
                  <div className="mb-2 relative">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className={`text-xs flex items-center ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors mb-1`}
                    >
                      <FaHistory className="mr-1" />
                      <span>Command History</span>
                      <FaChevronUp className={`ml-1 transform ${showHistory ? '' : 'rotate-180'}`} />
                    </button>
                    
                    {showHistory && (
                      <div className={`absolute z-10 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg py-1 max-h-40 overflow-y-auto transition-colors`}>
                        {commandHistory.map((cmd, index) => (
                          <button
                            key={index}
                            onClick={() => selectHistoryCommand(cmd)}
                            className={`block w-full text-left px-3 py-1 text-sm ${darkMode 
                              ? 'hover:bg-gray-700 text-gray-200' 
                              : 'hover:bg-indigo-50 text-gray-800'
                            } truncate transition-colors`}
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Help Tool */}
                {showHelpTool && (
                  <HelpTool onSelect={handleHelpOptionSelect} />
                )}
                
                <form onSubmit={handleSubmit} className="flex">
                  <CommandAutocomplete 
                    command={command}
                    setCommand={setCommand}
                    disabled={isProcessing}
                    darkMode={darkMode}
                  />
                </form>
                
                <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between transition-colors`}>
                  <div className="flex items-center">
                    <FaSearch className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-1`} />
                    <p>Try commands like: "scan example.com for open ports" or "run a quick scan on 8.8.8.8"</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleHelpTool}
                      className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-xs underline transition-colors flex items-center`}
                    >
                      <FaQuestion className="mr-1" size={10} />
                      Quick Help
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-xs underline transition-colors`}
                    >
                      Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Thinking Pane */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors`}>
              <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FaLightbulb className="mr-2" />
                  <h2 className="text-lg font-semibold">Thinking Process</h2>
                </div>
                
                {events.length > 0 && (
                  <div className="text-xs bg-purple-700 rounded-full px-2 py-1">
                    {events.length} events
                  </div>
                )}
              </div>
              
              <div 
                ref={thinkingBoxRef}
                className={`h-96 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} font-mono text-sm transition-colors`}
              >
                {events.length === 0 ? (
                  <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-10 transition-colors`}>
                    <p>The agent's thought process will appear here</p>
                  </div>
                ) : (
                  <>
                    {/* Group events by type */}
                    {(() => {
                      const groups = organizeEvents(events);
                      return (
                        <>
                          {groups.llm.length > 0 && (
                            <ThinkingEventGroup 
                              title="AI Thinking" 
                              events={groups.llm}
                              icon={<FaLightbulb className="text-yellow-500" />}
                              renderEventContent={renderEventContent}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {groups.tool.length > 0 && (
                            <ThinkingEventGroup 
                              title="Tool Usage" 
                              events={groups.tool}
                              icon={<FaCode className="text-blue-500" />}
                              renderEventContent={renderEventContent}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {groups.agent.length > 0 && (
                            <ThinkingEventGroup 
                              title="Agent Actions" 
                              events={groups.agent}
                              icon={<FaRobot className="text-purple-500" />}
                              renderEventContent={renderEventContent}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {groups.progress.length > 0 && (
                            <ThinkingEventGroup 
                              title="Progress Updates" 
                              events={groups.progress}
                              icon={<FaInfoCircle className="text-blue-500" />}
                              renderEventContent={renderEventContent}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {groups.error.length > 0 && (
                            <ThinkingEventGroup 
                              title="Errors" 
                              events={groups.error}
                              icon={<FaExclamationTriangle className="text-red-500" />}
                              renderEventContent={renderEventContent}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {groups.other.length > 0 && (
                            <ThinkingEventGroup 
                              title="Other Events" 
                              events={groups.other}
                              icon={<FaTerminal className="text-gray-500" />}
                              renderEventContent={renderEventContent}
                              darkMode={darkMode}
                            />
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default AiAgentPage; 