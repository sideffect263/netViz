import React, { useState, useMemo, useEffect } from 'react';
import { 
  FaBullseye as FaTarget,
  FaNetworkWired,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaClock,
  FaEye,
  FaFire,
  FaChevronDown,
  FaChevronRight,
  FaSearchLocation,
  FaCode,
  FaLayerGroup,
  FaChartLine,
  FaBug,
  FaLock,
  FaUnlock,
  FaMousePointer,
  FaExpand,
  FaCompress,
  FaCrosshairs,
  FaArrowRight,
  FaPlay,
  FaSearch
} from 'react-icons/fa';

// Helper functions
const getRiskLevel = (service, port) => {
  const highRiskServices = ['ssh', 'rdp', 'telnet', 'ftp', 'mysql', 'postgresql', 'smb'];
  const mediumRiskServices = ['http', 'https', 'smtp', 'dns', 'snmp'];
  
  if (highRiskServices.includes(service.toLowerCase())) return 'high';
  if (mediumRiskServices.includes(service.toLowerCase())) return 'medium';
  return 'low';
};

const calculateRiskScore = (targetData) => {
  let score = 0;
  
  // Base score for having open services
  score += targetData.services.length * 5;
  
  // Risk multiplier based on service types
  targetData.services.forEach(service => {
    switch (service.riskLevel) {
      case 'high': score += 25; break;
      case 'medium': score += 15; break;
      case 'low': score += 5; break;
    }
  });
  
  // Exploitation attempts increase score
  score += targetData.exploitAttempts.length * 10;
  
  return Math.min(100, score);
};

const getRiskColor = (riskScore) => {
  if (riskScore >= 70) return 'text-red-500';
  if (riskScore >= 40) return 'text-yellow-500';
  return 'text-green-500';
};

const getPhaseIcon = (phase) => {
  const icons = {
    reconnaissance: FaSearchLocation,
    enumeration: FaNetworkWired,
    vulnerability_assessment: FaShieldAlt,
    exploitation: FaFire,
    post_exploitation: FaUnlock
  };
  return icons[phase] || FaEye;
};

const TargetIntelligenceDashboard = ({ messages, events, darkMode, isProcessing }) => {
  const [expandedSections, setExpandedSections] = useState({
    targets: true,
    methodology: true,
    intelligence: false,
    exploits: false
  });

  // **NEW: Focus Management State**
  const [focusedTarget, setFocusedTarget] = useState(null);
  const [focusMode, setFocusMode] = useState('overview'); // 'overview' or 'detailed'
  const [autoFocusEnabled, setAutoFocusEnabled] = useState(true);

  // Extract target intelligence from messages and events
  const targetIntelligence = useMemo(() => {
    const targets = new Map();
    const exploitAttempts = [];
    let currentPhase = 'reconnaissance';
    let currentlyScanning = null; // Track which target is being scanned
    let methodology = {
      reconnaissance: { completed: false, activities: [] },
      enumeration: { completed: false, activities: [] },
      vulnerability_assessment: { completed: false, activities: [] },
      exploitation: { completed: false, activities: [] },
      post_exploitation: { completed: false, activities: [] }
    };

    // Process messages for target identification
    messages.forEach(msg => {
      if (msg.role === 'user' || msg.role === 'assistant') {
        // Extract domains and IPs
        const domainRegex = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/g;
        const ipRegex = /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;
        
        const domains = (msg.content.match(domainRegex) || []);
        const ips = (msg.content.match(ipRegex) || []);
        
        [...domains, ...ips].forEach(target => {
          if (!targets.has(target)) {
            targets.set(target, {
              target,
              type: target.match(ipRegex) ? 'ip' : 'domain',
              status: 'discovered',
              firstSeen: msg.timestamp || new Date().toISOString(),
              lastActivity: msg.timestamp || new Date().toISOString(),
              services: [],
              vulnerabilities: [],
              exploitAttempts: [],
              riskScore: 0,
              phase: 'reconnaissance',
              intelligence: {
                organization: null,
                geolocation: null,
                technologies: [],
                certificates: []
              }
            });
          }
          
          // Update activity timestamp
          const targetData = targets.get(target);
          targetData.lastActivity = msg.timestamp || new Date().toISOString();
          
          // Detect scanning activity
          if (msg.content.toLowerCase().includes('scan') && msg.role === 'user') {
            targetData.status = 'scanning';
            targetData.phase = 'enumeration';
            currentlyScanning = target; // Mark as currently scanning
            methodology.reconnaissance.completed = true;
            methodology.reconnaissance.activities.push('Target identification');
            methodology.enumeration.activities.push(`Port scanning initiated for ${target}`);
          }
          
          // Parse scan results from assistant messages
          if (msg.role === 'assistant' && msg.content.includes('port') && msg.content.includes('open')) {
            targetData.status = 'analyzed';
            const portMatches = msg.content.match(/(\d+)\/tcp\s+open\s+([^\s\n]+)/gi);
            if (portMatches) {
              portMatches.forEach(match => {
                const portServiceMatch = match.match(/(\d+)\/tcp\s+open\s+([^\s\n]+)/i);
                if (portServiceMatch) {
                  const port = portServiceMatch[1];
                  const service = portServiceMatch[2];
                  
                  // Check if service already exists
                  const existingService = targetData.services.find(s => s.port === port);
                  if (!existingService) {
                    targetData.services.push({
                      port,
                      service,
                      status: 'discovered',
                      riskLevel: getRiskLevel(service, port),
                      lastChecked: new Date().toISOString(),
                      exploitAttempts: []
                    });
                  }
                }
              });
              methodology.enumeration.completed = true;
              methodology.vulnerability_assessment.activities.push(`Service enumeration completed for ${target}`);
            }
          }
          
          // Detect exploit attempts
          if (msg.content.toLowerCase().includes('exploit') || msg.content.toLowerCase().includes('metasploit')) {
            targetData.phase = 'exploitation';
            methodology.vulnerability_assessment.completed = true;
            methodology.exploitation.activities.push(`Exploitation attempted on ${target}`);
            
            const attempt = {
              timestamp: msg.timestamp || new Date().toISOString(),
              type: 'exploit',
              description: msg.content.substring(0, 100) + '...',
              status: 'attempted',
              tool: msg.content.toLowerCase().includes('metasploit') ? 'metasploit' : 'custom'
            };
            
            targetData.exploitAttempts.push(attempt);
            exploitAttempts.push({ target, ...attempt });
          }
          
          // Calculate risk score
          targetData.riskScore = calculateRiskScore(targetData);
        });
      }
    });

    // Determine current methodology phase
    if (methodology.exploitation.activities.length > 0) {
      currentPhase = 'exploitation';
    } else if (methodology.vulnerability_assessment.activities.length > 0) {
      currentPhase = 'vulnerability_assessment';
    } else if (methodology.enumeration.activities.length > 0) {
      currentPhase = 'enumeration';
    }

    return {
      targets: Array.from(targets.values()).sort((a, b) => b.riskScore - a.riskScore),
      exploitAttempts,
      currentPhase,
      methodology,
      currentlyScanning, // Include currently scanning target
      stats: {
        totalTargets: targets.size,
        highRiskTargets: Array.from(targets.values()).filter(t => t.riskScore >= 70).length,
        activeExploits: exploitAttempts.filter(e => e.status === 'attempted').length,
        discoveredServices: Array.from(targets.values()).reduce((sum, t) => sum + t.services.length, 0)
      }
    };
  }, [messages, events]);

  // **NEW: Auto-focus on scanning target**
  useEffect(() => {
    if (autoFocusEnabled && targetIntelligence.currentlyScanning && 
        targetIntelligence.currentlyScanning !== focusedTarget) {
      setFocusedTarget(targetIntelligence.currentlyScanning);
      console.log(`Auto-focused on scanning target: ${targetIntelligence.currentlyScanning}`);
    }
  }, [targetIntelligence.currentlyScanning, autoFocusEnabled, focusedTarget]);

  // **NEW: Get focused target data**
  const focusedTargetData = useMemo(() => {
    if (!focusedTarget) return null;
    return targetIntelligence.targets.find(t => t.target === focusedTarget);
  }, [focusedTarget, targetIntelligence.targets]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // **NEW: Focus management functions**
  const handleTargetFocus = (targetId) => {
    setFocusedTarget(targetId);
    console.log(`Manually focused on target: ${targetId}`);
  };

  const clearFocus = () => {
    setFocusedTarget(null);
    setFocusMode('overview');
  };

  const toggleFocusMode = () => {
    setFocusMode(prev => prev === 'overview' ? 'detailed' : 'overview');
  };

  // **NEW: Generate quick actions for focused target**
  const getFocusedTargetActions = (target) => {
    if (!target) return [];
    
    const actions = [];
    
    // Basic scanning actions
    if (target.status === 'discovered') {
      actions.push({
        label: 'Quick Scan',
        command: `run a quick scan on ${target.target}`,
        icon: FaSearchLocation,
        priority: 'high'
      });
    }
    
    // Service-specific actions
    target.services.forEach(service => {
      switch (service.service.toLowerCase()) {
        case 'http':
        case 'https':
          actions.push({
            label: 'Web Vuln Scan',
            command: `check for web vulnerabilities on ${target.target}`,
            icon: FaShieldAlt,
            priority: 'medium'
          });
          break;
        case 'ssh':
          actions.push({
            label: 'SSH Enumeration',
            command: `search for ssh exploits on ${target.target}`,
            icon: FaFire,
            priority: 'high'
          });
          break;
        case 'mysql':
        case 'postgresql':
          actions.push({
            label: 'SQL Injection Test',
            command: `test for SQL injection on ${target.target}`,
            icon: FaBug,
            priority: 'high'
          });
          break;
      }
    });
    
    return actions.slice(0, 4); // Limit to 4 actions
  };

  const getMethodologyProgress = () => {
    const phases = ['reconnaissance', 'enumeration', 'vulnerability_assessment', 'exploitation', 'post_exploitation'];
    const currentIndex = phases.indexOf(targetIntelligence.currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg overflow-hidden mb-6 transition-colors`}>
      {/* Enhanced Header with Focus Context */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaTarget className="mr-3 text-xl" />
              <h2 className="text-xl font-semibold">Target Intelligence HUD</h2>
            </div>
            
            {/* **NEW: Focus Context Display** */}
            {focusedTarget && (
              <div className="flex items-center space-x-2 bg-red-700 rounded-lg px-3 py-1">
                <FaCrosshairs className="text-sm" />
                <span className="text-sm font-medium">Focused: {focusedTarget}</span>
                <button
                  onClick={clearFocus}
                  className="text-red-200 hover:text-white transition-colors"
                  title="Clear focus"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-red-700 rounded-full px-3 py-1">
              {targetIntelligence.stats.totalTargets} Targets
            </div>
            <div className="bg-orange-700 rounded-full px-3 py-1">
              {targetIntelligence.stats.discoveredServices} Services
            </div>
            {isProcessing && <FaClock className="animate-spin" />}
            
            {/* **NEW: Auto-focus toggle** */}
            <button
              onClick={() => setAutoFocusEnabled(!autoFocusEnabled)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                autoFocusEnabled 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title="Toggle auto-focus on scanning"
            >
              Auto-Focus {autoFocusEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* **NEW: Focused Target Detail Panel** */}
        {focusedTargetData && (
          <div className={`border-2 ${darkMode ? 'border-red-500 bg-gray-750' : 'border-red-500 bg-red-50'} rounded-lg transition-colors`}>
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaCrosshairs className="text-lg" />
                  <h3 className="text-lg font-semibold">Focused Target: {focusedTargetData.target}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    focusedTargetData.type === 'ip' 
                      ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {focusedTargetData.type.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={toggleFocusMode}
                  className="text-red-100 hover:text-white transition-colors"
                  title={focusMode === 'overview' ? 'Show detailed view' : 'Show overview'}
                >
                  {focusMode === 'overview' ? <FaExpand /> : <FaCompress />}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Focus Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg text-center transition-colors`}>
                  <div className={`text-xl font-bold ${getRiskColor(focusedTargetData.riskScore)}`}>
                    {focusedTargetData.riskScore}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Risk Score</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg text-center transition-colors`}>
                  <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {focusedTargetData.services.length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Services</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg text-center transition-colors`}>
                  <div className={`text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {focusedTargetData.exploitAttempts.length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Exploits</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg text-center transition-colors`}>
                  <div className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {focusedTargetData.phase.split('_')[0].toUpperCase()}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phase</div>
                </div>
              </div>

              {/* **NEW: Quick Actions for Focused Target** */}
              {getFocusedTargetActions(focusedTargetData).length > 0 && (
                <div className="mb-4">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    🎯 Quick Actions for {focusedTargetData.target}:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {getFocusedTargetActions(focusedTargetData).map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Here you could trigger the action or copy to clipboard
                          navigator.clipboard.writeText(action.command);
                          console.log(`Quick action: ${action.command}`);
                        }}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          action.priority === 'high'
                            ? (darkMode ? 'bg-red-700 hover:bg-red-600 text-red-100' : 'bg-red-100 hover:bg-red-200 text-red-700')
                            : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')
                        }`}
                        title={`Command: ${action.command}`}
                      >
                        <action.icon className="text-xs" />
                        <span className="text-xs font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Focused Target Services */}
              {focusedTargetData.services.length > 0 && focusMode === 'detailed' && (
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Discovered Services:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {focusedTargetData.services.map((service, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-colors ${
                          service.riskLevel === 'high'
                            ? (darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200')
                            : service.riskLevel === 'medium'
                            ? (darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200')
                            : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Port {service.port}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            service.riskLevel === 'high' ? 'bg-red-600 text-white' :
                            service.riskLevel === 'medium' ? 'bg-yellow-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {service.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {service.service}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center transition-colors`}>
            <div className={`text-2xl font-bold ${getRiskColor(targetIntelligence.stats.highRiskTargets * 25)}`}>
              {targetIntelligence.stats.highRiskTargets}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>High Risk</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center transition-colors`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {targetIntelligence.stats.discoveredServices}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Services</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center transition-colors`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {targetIntelligence.stats.activeExploits}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Exploits</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center transition-colors`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {Math.round(getMethodologyProgress())}%
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assessment</div>
          </div>
        </div>

        {/* Target Profiles Section - Enhanced with Click-to-Focus */}
        <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg transition-colors`}>
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
            onClick={() => toggleSection('targets')}
          >
            <div className="flex items-center">
              <FaTarget className={`mr-2 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Target Profiles ({targetIntelligence.targets.length})
              </span>
              {targetIntelligence.currentlyScanning && (
                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded animate-pulse">
                  SCANNING: {targetIntelligence.currentlyScanning}
                </span>
              )}
            </div>
            {expandedSections.targets ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          
          {expandedSections.targets && (
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 space-y-3 transition-colors`} style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {targetIntelligence.targets.length === 0 ? (
                <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaTarget className="mx-auto mb-2 text-2xl opacity-50" />
                  <p>No targets identified yet</p>
                  <p className="text-xs mt-1">Start a scan to begin target intelligence gathering</p>
                </div>
              ) : (
                targetIntelligence.targets.map((target, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-3 transition-all cursor-pointer transform hover:scale-[1.02] ${
                      focusedTarget === target.target
                        ? (darkMode ? 'bg-red-900 border-red-500 shadow-red-500/20 shadow-lg' : 'bg-red-50 border-red-500 shadow-red-500/20 shadow-lg')
                        : (darkMode ? 'bg-gray-700 border-gray-600 hover:border-red-400' : 'bg-gray-50 border-gray-200 hover:border-red-300')
                    }`}
                    onClick={() => handleTargetFocus(target.target)}
                    title="Click to focus on this target"
                  >
                    <div className="flex items-center justify-between mb-2">
                      {/* **NEW: Focus indicator** */}
                      {focusedTarget === target.target && (
                        <FaCrosshairs className="text-red-500 animate-pulse" />
                      )}
                      <div className={`w-3 h-3 rounded-full ${
                        target.status === 'scanning' ? 'bg-yellow-500 animate-pulse' :
                        target.status === 'analyzed' ? 'bg-green-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {target.target}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        target.type === 'ip' 
                          ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                          : (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
                      }`}>
                        {target.type.toUpperCase()}
                      </span>
                    </div>
                    
                    {target.services.length > 0 && (
                      <div className="mt-2">
                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          Discovered Services ({target.services.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {target.services.slice(0, 6).map((service, sIndex) => (
                            <span 
                              key={sIndex}
                              className={`text-xs px-2 py-1 rounded ${
                                service.riskLevel === 'high' 
                                  ? (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700')
                                  : service.riskLevel === 'medium'
                                  ? (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
                                  : (darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700')
                              }`}
                            >
                              {service.port}/{service.service}
                            </span>
                          ))}
                          {target.services.length > 6 && (
                            <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                              +{target.services.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {target.exploitAttempts.length > 0 && (
                      <div className="mt-2">
                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          Exploitation Attempts:
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaFire className="text-orange-500 text-xs" />
                          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {target.exploitAttempts.length} attempts logged
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Methodology Progress Section */}
        <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg transition-colors`}>
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
            onClick={() => toggleSection('methodology')}
          >
            <div className="flex items-center">
              <FaLayerGroup className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Assessment Methodology ({targetIntelligence.currentPhase.replace('_', ' ').toUpperCase()})
              </span>
            </div>
            {expandedSections.methodology ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          
          {expandedSections.methodology && (
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 transition-colors`} >
              <div className="space-y-3">
                {Object.entries(targetIntelligence.methodology).map(([phase, data]) => {
                  const isActive = phase === targetIntelligence.currentPhase;
                  const PhaseIcon = getPhaseIcon(phase);
                  
                  return (
                    <div key={phase} className={`flex items-start space-x-3 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                      <div className={`mt-1 ${
                        data.completed 
                          ? (darkMode ? 'text-green-400' : 'text-green-500')
                          : isActive 
                          ? (darkMode ? 'text-blue-400' : 'text-blue-500')
                          : (darkMode ? 'text-gray-500' : 'text-gray-400')
                      }`}>
                        {data.completed ? <FaCheck /> : isActive ? <PhaseIcon /> : <FaClock />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {phase.replace('_', ' ').toUpperCase()}
                          {isActive && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">ACTIVE</span>}
                        </div>
                        {data.activities.length > 0 && (
                          <div className={`text-xs mt-1 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {data.activities.slice(-2).map((activity, i) => (
                              <div key={i}>• {activity}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${getMethodologyProgress()}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Assessment Progress: {Math.round(getMethodologyProgress())}% Complete
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exploitation Workspace Section */}
        {targetIntelligence.exploitAttempts.length > 0 && (
          <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg transition-colors`}>
            <div 
              className={`flex items-center justify-between p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
              onClick={() => toggleSection('exploits')}
            >
              <div className="flex items-center">
                <FaFire className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Exploitation Workspace ({targetIntelligence.exploitAttempts.length})
                </span>
              </div>
              {expandedSections.exploits ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            
            {expandedSections.exploits && (
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 space-y-3 transition-colors`}>
                {targetIntelligence.exploitAttempts.map((attempt, index) => (
                  <div key={index} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 transition-colors`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          attempt.status === 'success' ? 'bg-green-500' :
                          attempt.status === 'failed' ? 'bg-red-500' :
                          'bg-yellow-500 animate-pulse'
                        }`}></div>
                        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {attempt.target}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          attempt.tool === 'metasploit'
                            ? (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700')
                            : (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700')
                        }`}>
                          {attempt.tool.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          attempt.status === 'success' 
                            ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
                            : attempt.status === 'failed'
                            ? (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700')
                            : (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
                        }`}>
                          {attempt.status.toUpperCase()}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(attempt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {attempt.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Threat Intelligence Feed Section */}
        <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg transition-colors`}>
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
            onClick={() => toggleSection('intelligence')}
          >
            <div className="flex items-center">
              <FaBug className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Threat Intelligence Feed
              </span>
            </div>
            {expandedSections.intelligence ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          
          {expandedSections.intelligence && (
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 transition-colors`}>
              {targetIntelligence.targets.length === 0 ? (
                <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaBug className="mx-auto mb-2 text-2xl opacity-50" />
                  <p>No intelligence data available</p>
                  <p className="text-xs mt-1">Intelligence will appear after scanning targets</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Suggested next steps based on current findings */}
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg transition-colors`}>
                    <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                      🎯 Suggested Next Steps:
                    </div>
                    <div className="space-y-2 text-sm">
                      {targetIntelligence.targets.some(t => t.services.some(s => s.service.toLowerCase().includes('http'))) && (
                        <div className={`${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                          • Web application enumeration and vulnerability scanning
                        </div>
                      )}
                      {targetIntelligence.targets.some(t => t.services.some(s => s.service.toLowerCase().includes('ssh'))) && (
                        <div className={`${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                          • SSH brute force attack or key-based authentication testing
                        </div>
                      )}
                      {targetIntelligence.targets.some(t => t.services.some(s => ['mysql', 'postgresql'].includes(s.service.toLowerCase()))) && (
                        <div className={`${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                          • Database enumeration and SQL injection testing
                        </div>
                      )}
                      {targetIntelligence.stats.discoveredServices === 0 && (
                        <div className={`${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                          • Start with basic port scanning to discover services
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Risk Assessment Summary */}
                  {targetIntelligence.targets.length > 0 && (
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg transition-colors`}>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        🛡️ Risk Assessment:
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Risk Score:</span>
                          <div className={`text-lg font-bold ${getRiskColor(
                            targetIntelligence.targets.reduce((sum, t) => sum + t.riskScore, 0) / targetIntelligence.targets.length
                          )}`}>
                            {Math.round(targetIntelligence.targets.reduce((sum, t) => sum + t.riskScore, 0) / targetIntelligence.targets.length)}
                          </div>
                        </div>
                        <div>
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Critical Services:</span>
                          <div className={`text-lg font-bold ${targetIntelligence.targets.some(t => t.services.some(s => s.riskLevel === 'high')) ? 'text-red-500' : 'text-green-500'}`}>
                            {targetIntelligence.targets.reduce((sum, t) => sum + t.services.filter(s => s.riskLevel === 'high').length, 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetIntelligenceDashboard;     