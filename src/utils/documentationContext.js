// Documentation context provider for AI Agent
// This file loads and provides documentation content to enhance AI responses

// Core capabilities documentation - this would be extracted from README, docs, etc.
const coreCapabilities = {
  purpose: `NetViz AI Agent is an intelligent assistant that helps with network scanning, analysis, and security tasks. It combines the power of AI with network tools like Nmap to provide useful insights in a conversational interface.`,
  
  scanTypes: [
    {
      name: "Quick Scan",
      description: "Fast scan of common ports using optimized parameters",
      details: "Uses -T4 -F flags to quickly identify the most common open ports on a target",
      example: "run a quick scan on example.com"
    },
    {
      name: "Service Scan",
      description: "Detailed scan that identifies running services on open ports",
      details: "Uses -sV flag to detect service versions running on the target system",
      example: "scan for services on 192.168.1.1"
    },
    {
      name: "Full Port Scan",
      description: "Comprehensive scan of all 65535 ports",
      details: "May take longer but provides complete coverage of all possible ports",
      example: "run a comprehensive port scan on example.com"
    },
    {
      name: "Vulnerability Scan",
      description: "Identifies potential security vulnerabilities on the target",
      details: "Combines service detection with vulnerability checks",
      example: "check for vulnerabilities on example.com"
    }
  ],
  
  generalCapabilities: [
    "Network scanning and enumeration of hosts, ports, and services",
    "Service identification and version detection",
    "OS detection and fingerprinting",
    "Security vulnerability assessment",
    "Intelligent analysis of scan results",
    "Conversational interface for network security tasks",
    "Explanation of technical findings in plain language"
  ],
  
  limitations: [
    "Cannot perform intrusive scans without proper authorization",
    "Network scan capabilities are limited to what Nmap provides",
    "Requires proper network connectivity to scan targets",
    "Large scans may take significant time to complete"
  ]
};

// Technical documentation - more detailed information about how things work
const technicalDetails = {
  architecture: `NetViz uses a client-server architecture where the React frontend communicates with a Node.js backend. The backend integrates with Nmap through a custom MCP (Model Context Protocol) client that securely manages scan operations. LangChain orchestrates the AI agent's reasoning and tool usage.`,
  
  components: [
    {
      name: "AI Agent",
      description: "Powered by Anthropic's Claude model through LangChain, providing natural language understanding and generation"
    },
    {
      name: "WebSocket Connection",
      description: "Real-time communication channel that streams thinking process and results to the UI"
    },
    {
      name: "Nmap Integration",
      description: "Security scanner utility accessed through a Model Context Protocol (MCP) client"
    },
    {
      name: "Visualization Components",
      description: "React-based UI components that render scan results in a user-friendly format"
    }
  ],
  
  // Extract from transition doc
  implementation: `The AI Agent uses LangChain.js for orchestration, Anthropic Claude for AI capabilities, and a WebSocket-based real-time communication system. It features a dual-pane interface showing both the chat and the agent's thinking process for transparency.`
};

// Format the documentation as a comprehensive system prompt enhancement
export function getSystemPromptEnhancement() {
  return `
# NetViz AI Agent Documentation

## Purpose and Overview
${coreCapabilities.purpose}

## Scan Capabilities
${coreCapabilities.scanTypes.map(scan => 
  `- **${scan.name}**: ${scan.description}
   Details: ${scan.details}
   Example: "${scan.example}"`
).join('\n\n')}

## General Capabilities
${coreCapabilities.generalCapabilities.map(cap => `- ${cap}`).join('\n')}

## Technical Architecture
${technicalDetails.architecture}

## Key Components
${technicalDetails.components.map(comp => `- **${comp.name}**: ${comp.description}`).join('\n')}

## Implementation Details
${technicalDetails.implementation}

## Limitations
${coreCapabilities.limitations.map(limit => `- ${limit}`).join('\n')}

When answering questions about capabilities, features, or functionality, use this documentation to provide accurate, specific information about the NetViz AI Agent.
`;
}

// Helper function to determine if a query is about system capabilities
export function isCapabilityQuery(query) {
  const capabilityKeywords = [
    'what can you do', 
    'capabilities', 
    'features', 
    'scan types', 
    'help',
    'how do you work',
    'what type of scan',
    'what kind of scan',
    'how do i use',
    'functions',
    'abilities'
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return capabilityKeywords.some(keyword => lowercaseQuery.includes(keyword));
}

// Get specific information about scan types for queries about scanning
export function getScanTypeInformation() {
  return coreCapabilities.scanTypes.map(scan => ({
    name: scan.name,
    description: scan.description,
    example: scan.example
  }));
}

export default {
  getSystemPromptEnhancement,
  isCapabilityQuery,
  getScanTypeInformation,
  coreCapabilities,
  technicalDetails
}; 