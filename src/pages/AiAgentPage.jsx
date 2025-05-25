import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaTerminal, FaLightbulb, FaSpinner, FaCode, FaExclamationTriangle, FaInfoCircle, FaCloudDownloadAlt, FaHistory, FaChevronUp, FaServer, FaNetworkWired, FaLock, FaLockOpen, FaDownload, FaSearch, FaMoon, FaSun, FaQuestion, FaBook, FaBars } from 'react-icons/fa';
import axios from 'axios';
import HelpModal from '../components/HelpModal';
import ConversationSidebar from '../components/ConversationSidebar';
import useConversations from '../hooks/useConversations';
import ChatMessage from '../components/ChatMessage';
import { useAuth } from '../context/AuthContext';
import useAgentWebSocket from '../hooks/useAgentWebSocket';
import ThinkingEventGroup from '../components/ThinkingEventGroup';
import ScanResultVisualizer from '../components/ScanResultVisualizer';
import CommandAutocomplete from '../components/CommandAutocomplete';
import ThemeToggle from '../components/ThemeToggle';
import HelpTool from '../components/HelpTool';
import RawScanDataViewer from '../components/RawScanDataViewer';
import AIAnalysisViewer from '../components/AIAnalysisViewer';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'
  : 'https://netviz-dashboard.ofektechnology.com/api';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // Auth and conversations
  const { isAuthenticated } = useAuth();
  const {
    conversations,
    selectedConversation,
    loading: conversationsLoading,
    error: conversationsError,
    fetchConversations,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    setSelectedConversation
  } = useConversations();

  // Local message state for the active conversation (or unauthenticated session)
  const [messages, setMessages] = useState([]);
  
  // Separate state for different types of data
  const [rawScanData, setRawScanData] = useState(null);

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
    const newSessionId = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
  }, []);

  // Watch for the final result in the events
  useEffect(() => {
    console.log('Events updated:', events); // Debug log
    
    // Find the command_result event, which indicates the final result
    const resultEvent = events.find(event => event.type === 'command_result');
    if (resultEvent) {
      setFinalResult(resultEvent.result);
      setIsProcessing(false);
      setScanInProgress(false);
      setProgressMessage(null);

      // Append assistant message to chat
      setMessages(prev => [...prev, { role: 'assistant', content: resultEvent.result, timestamp: new Date().toISOString() }]);
    }
    
    // Extract raw scan data from the LATEST tool_end event that has output
    const toolEndWithOutput = [...events].reverse().find(event => event.type === 'tool_end' && event.output);
    console.log('Tool end with output:', toolEndWithOutput); // Debug log
    
    if (toolEndWithOutput) {
      // Update rawScanData only if it's different to avoid unnecessary re-renders
      // For complex objects, a deep comparison might be needed, but for now, checking reference or basic value change.
      setRawScanData(prevData => {
        const newData = toolEndWithOutput.output;
        console.log('Setting raw scan data:', newData); // Debug log
        if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevData;
      });
    }
    
    // Check for errors
    const errorEvent = events.find(event => event.type === 'error');
    if (errorEvent) {
      setError(errorEvent.error);
      setIsProcessing(false);
      setScanInProgress(false);
      setProgressMessage(null);

      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorEvent.error}`, timestamp: new Date().toISOString() }]);
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
  }, [events, scanInProgress, rawScanData]);

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

  // Load messages when a conversation is selected/changed
  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages || []);
    } else if (!isAuthenticated) {
      // For unauthenticated users, keep existing messages
      setMessages([]);
    }
  }, [selectedConversation, isAuthenticated]);

  // Predefined quick action scan templates
  const quickActions = [
    { name: "Quick Scan", command: "run a quick scan on ", icon: "⚡", tooltip: "Fast scan of common ports" },
    { name: "Service Scan", command: "scan for services on ", icon: "🔍", tooltip: "Identify running services on common ports" },
    { name: "Full Port Scan", command: "run a comprehensive port scan on ", icon: "🔐", tooltip: "Scan all ports (takes longer)" },
    { name: "Vulnerability Scan", command: "check for vulnerabilities on ", icon: "🛡️", tooltip: "Scan for common vulnerabilities" },
    { name: "WHOIS Lookup", command: "get WHOIS information for ", icon: "📋", tooltip: "Domain registration and ownership info" },
    { name: "DNS Analysis", command: "perform DNS reconnaissance on ", icon: "🌐", tooltip: "Comprehensive DNS record analysis" },
    { name: "OSINT Overview", command: "perform comprehensive OSINT analysis on ", icon: "🕵️", tooltip: "Complete intelligence gathering with all tools" },
    { name: "Typosquatting Check", command: "check for typosquatting domains similar to ", icon: "🎯", tooltip: "Find potential phishing domains" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add command to history if not already the most recent entry
    if (commandHistory.length === 0 || commandHistory[0] !== command) {
      setCommandHistory(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
    }
    
    // Optimistically add the user message
    const userMessage = { role: 'user', content: command, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    setFinalResult(null);
    setError(null);
    setProgressMessage(null);
    setScanInProgress(false);
    setScanDuration(0);
    
    // Clear previous data for new command
    setRawScanData(null);
    
    try {
      // Clear previous events
      events.length = 0;
      
      // Determine conversationId (use existing if one is selected)
      const conversationId = selectedConversation ? selectedConversation._id : null;

      // Send command to API (the server will create a new conversation if needed)
      const response = await axios.post(`${API_URL}/agent/command`, {
        command,
        sessionId,
        conversationId
      });
      
      // If the server created or returned a conversation ID and the user is authenticated,
      // load that conversation so the sidebar reflects it immediately.
      if (isAuthenticated && response.data.conversationId) {
        await loadConversation(response.data.conversationId);
      }
      
      // Clear the input field after sending
      setCommand('');
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
          {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {/* Sidebar toggle button - always visible */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded text-indigo-600 dark:text-indigo-400 focus:outline-none hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
                aria-label={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
                title={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
              >
                <FaBars />
              </button>
              <FaRobot className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Network Agent</h1>
          </div>
            <div className="flex items-center space-x-4 flex-wrap">
          <div className="text-sm">
            {connected ? (
                  <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center`}>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="font-medium">Connected</span>
              </span>
            ) : (
                  <span className={`${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center`}>
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="font-medium">Disconnected</span>
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

          {/* Main Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Overlay for small screens when sidebar is open */}
            {!sidebarCollapsed && (
              <div
                className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
                onClick={() => setSidebarCollapsed(true)}
              ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed z-30 inset-y-0 left-0 w-72 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:relative md:flex-shrink-0 transition-all duration-300 ease-in-out ${
              sidebarCollapsed 
                ? '-translate-x-full opacity-0 pointer-events-none md:w-0 md:border-0' 
                : 'translate-x-0 md:translate-x-0 md:w-72'
            }`}>
              <ConversationSidebar
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={(id) => {
                  loadConversation(id);
                  // Only close sidebar on mobile
                  if (window.innerWidth < 768) {
                    setSidebarCollapsed(true);
                  }
                }}
                onNewConversation={() => {
                  setSelectedConversation(null);
                  setMessages([]);
                  setCommand('');
                  // Only close sidebar on mobile
                  if (window.innerWidth < 768) {
                    setSidebarCollapsed(true);
                  }
                }}
                onDeleteConversation={deleteConversation}
                onUpdateTitle={updateConversationTitle}
                loading={conversationsLoading}
                darkMode={darkMode}
              />
            </div>
            
            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-6'}`}>
              {/* Quick Actions Panel */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-md overflow-hidden mb-6 transition-colors`}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center">
                  <FaRobot className="mr-3 text-xl" />
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <span className="ml-auto text-blue-100 text-sm">Choose your reconnaissance method</span>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <div key={index} className="relative group">
                      <button
                        onClick={() => applyQuickAction(action.command)}
                        disabled={isProcessing}
                        className={`w-full py-4 px-5 ${darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 hover:shadow-lg' 
                          : 'bg-gray-50 hover:bg-indigo-50 border-gray-200 text-gray-700 hover:shadow-md hover:border-indigo-300'
                        } border rounded-lg text-left transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{action.icon}</span>
                          <span className="text-sm font-medium">{action.name}</span>
                        </div>
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {action.tooltip}
                      </div>
                  </div>
                  ))}
                </div>
              </div>

              {/* Three Panes Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agent Chat Pane */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors`}>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTerminal className="mr-3 text-xl" />
                      <h2 className="text-xl font-semibold">Agent Chat</h2>
                    </div>
                    {messages.length > 0 && (
                      <div className="text-xs bg-indigo-700 rounded-full px-3 py-1">
                        {messages.length} messages
                      </div>
                    )}
                  </div>
                  
                  <div 
                    ref={chatBoxRef}
                    className={`h-96 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                  >
                    {messages.map((msg, idx) => (
                      <ChatMessage key={idx} message={msg} darkMode={darkMode} />
                    ))}

                    {isProcessing && (
                      <ChatMessage 
                        message={{ role: 'assistant', content: 'Processing...' }} 
                        darkMode={darkMode}
                        isProcessing={true}
                      />
                    )}
                  </div>
                  
                  {finalResult && !isProcessing && (
                    <ScanResultVisualizer result={finalResult} darkMode={darkMode} />
                  )}
                  
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 transition-colors`}>
                    {/* Command History Dropdown */}
                    {commandHistory.length > 0 && (
                      <div className="mb-3 relative">
                        <button
                          onClick={() => setShowHistory(!showHistory)}
                          className={`text-xs flex items-center ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors mb-2 font-medium`}
                        >
                          <FaHistory className="mr-2" />
                          <span>Recent Commands</span>
                          <FaChevronUp className={`ml-2 transform transition-transform ${showHistory ? '' : 'rotate-180'}`} />
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
                    
                    <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between transition-colors`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FaSearch className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`} />
                          <p>Try: "scan example.com" or "vulnerability check on 192.168.1.1"</p>
                        </div>
                        <div className="hidden sm:flex items-center text-xs">
                          <kbd className={`px-2 py-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded`}>Ctrl</kbd>
                          <span className="mx-1">+</span>
                          <kbd className={`px-2 py-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded`}>Enter</kbd>
                          <span className="ml-2">to send</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                <button
                          onClick={toggleHelpTool}
                          className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-xs underline transition-colors flex items-center font-medium`}
                >
                          <FaQuestion className="mr-1" size={10} />
                          Quick Help
                </button>
                        <span className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
                        <Link
                          to="/documentation"
                          className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-xs underline transition-colors font-medium`}
                        >
                          Full Docs
                        </Link>
                      </div>
              </div>
            </div>
          </div>
          
                {/* AI Analysis Pane */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors`}>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaLightbulb className="mr-3 text-xl" />
                      <h2 className="text-xl font-semibold">AI Security Analysis</h2>
                    </div>
                    
                    {events.length > 0 && (
                      <div className="text-xs bg-purple-700 rounded-full px-3 py-1">
                        {events.length} events
                      </div>
                    )}
            </div>
            
                  <div className={`h-96 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <AIAnalysisViewer events={events} darkMode={darkMode} />
                  </div>
                </div>
                
                {/* Raw Scan Results Pane */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors xl:col-span-1 lg:col-span-2 xl:col-span-1`}>
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTerminal className="mr-3 text-xl" />
                      <h2 className="text-xl font-semibold">Raw Scan Data</h2>
                    </div>
                    
                    {rawScanData && (
                      <div className="text-xs bg-green-700 rounded-full px-3 py-1">
                        Data available
                      </div>
                    )}
                  </div>
                  
                  <div className={`h-96 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <RawScanDataViewer rawData={rawScanData} darkMode={darkMode} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help Modal */}
          <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default AiAgentPage; 