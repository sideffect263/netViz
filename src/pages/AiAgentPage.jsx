import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTerminal, FaLightbulb, FaSpinner, FaCode, FaExclamationTriangle, FaInfoCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Custom hook for WebSocket connection
const useAgentWebSocket = (sessionId) => {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:5000`);
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

const AiAgentPage = () => {
  const [sessionId, setSessionId] = useState('');
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanStartTime, setScanStartTime] = useState(null);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
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

  // Format scan duration
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Render different event types in the thinking pane
  const renderEventContent = (event) => {
    switch (event.type) {
      case 'llm_start':
        return (
          <div className="flex items-start">
            <FaLightbulb className="mr-2 text-yellow-500 mt-1" />
            <div className="text-gray-700">{event.content}</div>
          </div>
        );
      
      case 'llm_token':
        return (
          <span className="text-gray-700">{event.content}</span>
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
            <div className="text-blue-700">{event.message}</div>
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
            <div className="text-red-600">{event.error}</div>
          </div>
        );
      
      default:
        return (
          <div className="text-gray-500">
            {event.type}: {JSON.stringify(event)}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaRobot className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">AI Network Agent</h1>
          </div>
          <div className="text-sm">
            {connected ? (
              <span className="text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Disconnected
              </span>
            )}
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

        {scanInProgress && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
            <div className="flex">
              <FaCloudDownloadAlt className="text-indigo-500 mr-3 animate-pulse" />
              <div>
                <p className="text-sm text-indigo-700">
                  Network scan in progress... 
                  <span className="ml-2 font-semibold">Elapsed time: {formatDuration(scanDuration)}</span>
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  Comprehensive scans may take several minutes. The system will automatically simplify parameters if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chat Pane */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-600 text-white px-4 py-3 flex items-center">
              <FaTerminal className="mr-2" />
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            
            <div 
              ref={chatBoxRef}
              className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {/* User command */}
              {command && (
                <div className="flex justify-end">
                  <div className="bg-indigo-100 rounded-lg p-3 max-w-md">
                    <p className="text-gray-800">{command}</p>
                  </div>
                </div>
              )}
              
              {/* Agent response */}
              {(isProcessing || finalResult) && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 max-w-md shadow-sm">
                    {isProcessing ? (
                      <div className="flex items-center text-gray-600">
                        <FaSpinner className="animate-spin mr-2" />
                        <p>Processing your request...</p>
                      </div>
                    ) : finalResult ? (
                      <p className="text-gray-800 whitespace-pre-line">{finalResult}</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  disabled={isProcessing}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter a command..."
                />
                <button
                  type="submit"
                  disabled={isProcessing || !command.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                >
                  Send
                </button>
              </form>
              <div className="mt-2 text-xs text-gray-500">
                <p>Try commands like: "scan example.com for open ports" or "run a quick scan on 8.8.8.8"</p>
              </div>
            </div>
          </div>
          
          {/* Thinking Pane */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-600 text-white px-4 py-3 flex items-center">
              <FaLightbulb className="mr-2" />
              <h2 className="text-lg font-semibold">Thinking Process</h2>
            </div>
            
            <div 
              ref={thinkingBoxRef}
              className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 font-mono text-sm"
            >
              {events.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>The agent's thought process will appear here</p>
                </div>
              ) : (
                events.map((event, index) => (
                  <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                    {renderEventContent(event)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAgentPage; 