import { useState, useEffect } from 'react';

const useAnalysisProcessor = (events) => {
  const [analysisEntries, setAnalysisEntries] = useState([]);

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
      insights.push('Overall assessment of the target indicates its security posture and potential areas of interest.');
    }

    return insights;
  };

  useEffect(() => {
    // Process events to extract meaningful AI analysis
    const processAnalysis = () => {
      console.log('Processing AI analysis, events:', events);
      const analysis = [];
      let currentThought = '';
      let analysisType = 'general';

      events.forEach(event => {
        console.log('Processing event:', event);
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
              console.log('Processing tool_end event with output');
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
              timestamp: new Date().toISOString(),
              type: 'insight',
              content: insight,
              icon: 'insight'
            });
          });
        } else if (currentThought.trim()) {
          analysis.push({
            timestamp: new Date().toISOString(),
            type: 'summary',
            content: currentThought.replace('```json', '').replace(/\{\s*"action":\s*"Final Answer",\s*"action_input":\s*"(.*?)"\s*\}\s*```/s, '$1').trim(),
            icon: 'summary'
          });
        }
      }

      setAnalysisEntries(analysis);
      console.log('Analysis entries set:', analysis);
    };

    if (events.length > 0) {
      processAnalysis();
    }
  }, [events]);

  return analysisEntries;
};

export default useAnalysisProcessor; 