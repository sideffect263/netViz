import React, { useState, useEffect } from 'react';
import { FaBrain, FaLightbulb, FaShieldAlt, FaSearch, FaClipboardList, FaExpand, FaCompress } from 'react-icons/fa';

const AIAnalysisViewer = ({ events, darkMode }) => {
  const [analysisEntries, setAnalysisEntries] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Process events to extract meaningful AI analysis
    const processAnalysis = () => {
      console.log('Processing AI analysis, events:', events); // Debug log
      const analysis = [];
      let currentThought = '';
      let analysisType = 'general';

      events.forEach(event => {
        console.log('Processing event:', event); // Debug log
        switch (event.type) {
          case 'llm_start':
            if (event.content.includes('think') || event.content.includes('analyz')) {
              analysisType = 'thinking';
            }
            break;

          case 'llm_token':
            currentThought += event.content;
            break;

          case 'agent_action':
            if (event.log) {
              // Extract structured reasoning from agent logs
              const thoughts = event.log.split('\n').filter(line => 
                line.toLowerCase().includes('thought:') || 
                line.toLowerCase().includes('observation:') ||
                line.toLowerCase().includes('analysis:')
              );
              
              thoughts.forEach(thought => {
                if (thought.trim()) {
                  analysis.push({
                    timestamp: event.timestamp,
                    type: thought.toLowerCase().includes('observation') ? 'observation' : 'reasoning',
                    content: thought.replace(/^(thought:|observation:|analysis:)/i, '').trim(),
                    icon: thought.toLowerCase().includes('observation') ? 'observation' : 'reasoning'
                  });
                }
              });
            }
            break;

          case 'tool_start':
            analysis.push({
              timestamp: event.timestamp,
              type: 'tool_analysis',
              content: `Initiating ${event.toolName} to gather intelligence...`,
              toolName: event.toolName,
              icon: 'tool'
            });
            break;

          case 'tool_end':
            // Simulate AI analysis of tool results
            if (event.output) {
              console.log('Processing tool_end event with output'); // Debug log
              let analysisContent = '';
              const toolOutput = typeof event.output === 'string' ? event.output : JSON.stringify(event.output);

              if (event.toolName === 'NmapScanner' && toolOutput.includes('PORT')) {
                // Nmap scan analysis
                const openPorts = (toolOutput.match(/\d+\/\w+\s+open/g) || []).length;
                const closedPorts = (toolOutput.match(/\d+\/\w+\s+closed/g) || []).length;
                analysisContent = `Nmap scan completed. Detected ${openPorts} open port(s) and ${closedPorts} closed port(s). `;
                
                if (openPorts > 0) {
                  analysisContent += 'Analyzing services and potential vulnerabilities on open ports...';
                } else {
                  analysisContent += 'No open ports detected; target may be well-secured or filtered.';
                }
              } else if (event.toolName === 'DNSTwist') {
                const lines = toolOutput.split('\n');
                const homoglyphCount = lines.filter(line => line.startsWith('homoglyph')).length;
                const insertionCount = lines.filter(line => line.startsWith('insertion')).length;
                analysisContent = `DNSTwist analysis complete. Found ${homoglyphCount} potential homoglyphs and ${insertionCount} potential insertion-based typos. Reviewing for phishing risks...`;
              } else if (event.toolName === 'WhoisLookup') {
                analysisContent = `WHOIS lookup complete. Reviewing domain registration details for ownership and age...`;
              } else if (event.toolName === 'DNSRecon') {
                analysisContent = `DNSRecon complete. Analyzing DNS records for infrastructure insights...`;
              } else {
                analysisContent = `${event.toolName} execution completed. Analyzing results for security implications...`;
              }

              analysis.push({
                timestamp: event.timestamp,
                type: 'result_analysis',
                content: analysisContent,
                icon: 'analysis'
              });
            }
            break;
        }
      });

      // Add accumulated thoughts if substantial, or if it looks like a final summary
      if (currentThought.length > 50 || (currentThought.includes('Final Answer') && currentThought.length > 20)) {
        // Extract key insights from the thought stream or add the thought directly
        const insights = extractInsights(currentThought);
        if (insights.length > 0) {
          insights.forEach(insight => {
            analysis.push({
              timestamp: new Date().toISOString(), // Or use timestamp of last llm_token event
              type: 'insight',
              content: insight,
              icon: 'insight'
            });
          });
        } else if (currentThought.trim()) { // Add the thought directly if no specific insights extracted
            analysis.push({
                timestamp: new Date().toISOString(),
                type: 'summary', // New type for general LLM summaries
                content: currentThought.replace('```json', '').replace(/\{\s*"action":\s*"Final Answer",\s*"action_input":\s*"(.*?)"\s*\}\s*```/s, '$1').trim(),
                icon: 'summary' // New icon needed
            });
        }
      }

      setAnalysisEntries(analysis);
      console.log('Analysis entries set:', analysis); // Debug log
    };

    if (events.length > 0) {
      processAnalysis();
    }
  }, [events]);

  const extractInsights = (thought) => {
    const insights = [];
    
    // Look for security-related insights
    if (thought.toLowerCase().includes('vulnerabilit')) {
      insights.push('Vulnerability assessment in progress - checking for common security weaknesses.');
    }
    
    if (thought.toLowerCase().includes('port') && thought.toLowerCase().includes('scan')) {
      insights.push('Port scanning reveals network service fingerprint - mapping attack surface.');
    }
    
    if (thought.toLowerCase().includes('service')) {
      insights.push('Service enumeration identifies running applications - evaluating exposure risk.');
    }
    
    if (thought.toLowerCase().includes('target') || thought.toLowerCase().includes('host')) {
      insights.push('Target reconnaissance suggests host configuration and security posture.');
    }
    // Add more general insight if specific keywords are not found but it seems like a summary
    if (insights.length === 0 && thought.length > 150 && (thought.toLowerCase().includes('summary') || thought.toLowerCase().includes('overall'))) {
        insights.push('Overall assessment of the target indicates its security posture and potential areas of interest.')
    }

    return insights;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reasoning': return <FaBrain className="text-purple-500" />;
      case 'observation': return <FaSearch className="text-blue-500" />;
      case 'tool_analysis': return <FaClipboardList className="text-green-500" />;
      case 'result_analysis': return <FaShieldAlt className="text-orange-500" />;
      case 'insight': return <FaLightbulb className="text-yellow-500" />;
      case 'summary': return <FaClipboardList className="text-blue-400" />; // Icon for summary
      default: return <FaBrain className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'reasoning': return 'Strategic Thinking';
      case 'observation': return 'Data Observation';
      case 'tool_analysis': return 'Tool Deployment';
      case 'result_analysis': return 'Result Analysis';
      case 'insight': return 'Security Insight';
      case 'summary': return 'Agent Summary'; // Label for summary
      default: return 'Analysis';
    }
  };

  if (analysisEntries.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <FaBrain className="mx-auto mb-2 text-2xl opacity-50" />
        <p>AI analysis will appear here</p>
        <p className="text-xs mt-1">The agent's reasoning about scan data and security implications</p>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded transition-colors`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <FaBrain className={`${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            AI Security Analysis
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {analysisEntries.length} insights
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 rounded text-xs ${darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Analysis entries */}
      <div className={`${expanded ? 'max-h-none' : 'max-h-64'} overflow-auto`}>
        {analysisEntries.map((entry, index) => (
          <div key={index} className={`p-3 border-b last:border-b-0 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {getIcon(entry.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {getTypeLabel(entry.type)}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  {entry.content}
                </p>
                {entry.toolName && (
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {entry.toolName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAnalysisViewer; 