import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useConversations from './useConversations';
import useAgentWebSocket from './useAgentWebSocket';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'
  : 'https://netviz-dashboard.ofektechnology.com/api';

const useAiAgentState = () => {
  // Basic state
  const [sessionId, setSessionId] = useState('');
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  
  // Scan state
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanStartTime, setScanStartTime] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [scanDuration, setScanDuration] = useState(0);
  
  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHelpTool, setShowHelpTool] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // Data state
  const [messages, setMessages] = useState([]);
  const [rawScanData, setRawScanData] = useState(null);
  
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
  
  // WebSocket connection
  const { connected, events } = useAgentWebSocket(sessionId);
  
  // References
  const chatBoxRef = useRef(null);
  const thinkingBoxRef = useRef(null);

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
    console.log('Events updated:', events);
    
    const resultEvent = events.find(event => event.type === 'command_result');
    if (resultEvent) {
      setFinalResult(resultEvent.result);
      setIsProcessing(false);
      setScanInProgress(false);
      setProgressMessage(null);
      setMessages(prev => [...prev, { role: 'assistant', content: resultEvent.result, timestamp: new Date().toISOString() }]);
    }
    
    const toolEndWithOutput = [...events].reverse().find(event => event.type === 'tool_end' && event.output);
    if (toolEndWithOutput) {
      setRawScanData(prevData => {
        const newData = toolEndWithOutput.output;
        if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevData;
      });
    }
    
    const errorEvent = events.find(event => event.type === 'error');
    if (errorEvent) {
      setError(errorEvent.error);
      setIsProcessing(false);
      setScanInProgress(false);
      setProgressMessage(null);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorEvent.error}`, timestamp: new Date().toISOString() }]);
    }
    
    const nmapStartEvent = events.find(event => 
      event.type === 'tool_start' && 
      event.toolName === 'NmapScanner'
    );
    if (nmapStartEvent && !scanInProgress) {
      setScanInProgress(true);
      setScanStartTime(new Date());
    }
    
    const nmapEndEvent = events.find(event => 
      event.type === 'tool_end' && 
      events.some(e => e.type === 'tool_start' && e.toolName === 'NmapScanner')
    );
    if (nmapEndEvent && scanInProgress) {
      setScanInProgress(false);
    }
    
    const progressEvent = events.find(event => event.type === 'progress_update');
    if (progressEvent) {
      setProgressMessage(progressEvent.message);
    }
  }, [events, scanInProgress, rawScanData]);

  // Timer for scan duration
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

  // Simulate progress for scans
  useEffect(() => {
    let progressInterval;
    
    if (scanInProgress) {
      setScanProgress(0);
      setScanPhase('Initializing scan...');
      
      progressInterval = setInterval(() => {
        setScanProgress(prev => {
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 90 ? 1 : 0.5;
          const newProgress = Math.min(prev + increment, 99);
          
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
      setScanProgress(100);
      setScanPhase('Scan complete!');
      
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
      setMessages([]);
    }
  }, [selectedConversation, isAuthenticated]);

  // Initialize dark mode from local storage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
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
    
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    if (commandHistory.length === 0 || commandHistory[0] !== command) {
      setCommandHistory(prev => [command, ...prev.slice(0, 9)]);
    }
    
    const userMessage = { role: 'user', content: command, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    setFinalResult(null);
    setError(null);
    setProgressMessage(null);
    setScanInProgress(false);
    setScanDuration(0);
    setRawScanData(null);
    
    try {
      events.length = 0;
      
      const conversationId = selectedConversation ? selectedConversation._id : null;

      const response = await axios.post(`${API_URL}/agent/command`, {
        command,
        sessionId,
        conversationId
      });
      
      if (isAuthenticated && response.data.conversationId) {
        await loadConversation(response.data.conversationId);
      }
      
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

  const applyQuickAction = (actionCommand) => {
    setCommand(actionCommand);
    const inputElement = document.getElementById('command-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleHelpOptionSelect = (question) => {
    setCommand(question);
    handleSubmit({ preventDefault: () => {} });
    setShowHelpTool(false);
  };
  
  const toggleHelpTool = () => {
    setShowHelpTool(prev => !prev);
  };

  return {
    // State
    sessionId,
    command,
    setCommand,
    commandHistory,
    showHistory,
    setShowHistory,
    isProcessing,
    finalResult,
    error,
    progressMessage,
    scanInProgress,
    scanStartTime,
    scanProgress,
    scanPhase,
    scanDuration,
    darkMode,
    showHelpModal,
    setShowHelpModal,
    showHelpTool,
    setShowHelpTool,
    sidebarCollapsed,
    setSidebarCollapsed,
    messages,
    setMessages,
    rawScanData,
    
    // Auth and conversations
    isAuthenticated,
    conversations,
    selectedConversation,
    conversationsLoading,
    conversationsError,
    fetchConversations,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    setSelectedConversation,
    
    // WebSocket
    connected,
    events,
    
    // References
    chatBoxRef,
    thinkingBoxRef,
    
    // Data
    quickActions,
    
    // Handlers
    handleSubmit,
    selectHistoryCommand,
    applyQuickAction,
    toggleDarkMode,
    handleHelpOptionSelect,
    toggleHelpTool
  };
};

export default useAiAgentState; 