import React, { useState } from 'react';
import { 
  FaRobot, 
  FaTerminal, 
  FaInfoCircle, 
  FaSearch, 
  FaBolt, 
  FaMicrochip, 
  FaNetworkWired,
  FaCode,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronRight,
  FaBook,
  FaQuestionCircle,
  FaHandPaper,
  FaCogs,
  FaBrain,
  FaPuzzlePiece,
  FaTasks
} from 'react-icons/fa';

const DocumentationPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    scans: false,
    commands: false,
    tech: false,
    langchain: false,
    toolChoice: false,
    agentMind: false,
    faq: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <FaBook className="text-indigo-600 dark:text-indigo-400 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">NetViz AI Agent Documentation</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete guide to using the NetViz AI Agent for network scanning, analysis, and security tasks.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-8 bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#overview" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaInfoCircle className="mr-2" />
              Overview & Capabilities
            </a>
            <a href="#scans" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaSearch className="mr-2" />
              Scan Types
            </a>
            <a href="#commands" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaTerminal className="mr-2" />
              Command Reference
            </a>
            <a href="#tech" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaCode className="mr-2" />
              Technical Information
            </a>
            <a href="#langchain" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaPuzzlePiece className="mr-2" />
              The Langchain Framework
            </a>
            <a href="#toolChoice" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaTasks className="mr-2" />
              How the Agent Chooses Tools
            </a>
            <a href="#agentMind" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaBrain className="mr-2" />
              Visualizing the Agent's Mind
            </a>
            <a href="#faq" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <FaQuestionCircle className="mr-2" />
              Frequently Asked Questions
            </a>
          </div>
        </div>

        {/* Overview Section */}
        <div id="overview" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('overview')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaInfoCircle className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Overview & Capabilities
            </h2>
            {expandedSections.overview ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.overview && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <FaRobot className="mr-2 text-indigo-500" />
                About NetViz AI Agent
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                NetViz AI Agent is an intelligent assistant that helps with network scanning, analysis, and security tasks. 
                It combines the power of AI with network tools like Nmap to provide useful insights in a conversational interface.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaBolt className="mr-2 text-indigo-500" />
                General Capabilities
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Network scanning and enumeration of hosts, ports, and services</li>
                <li>Service identification and version detection</li>
                <li>OS detection and fingerprinting</li>
                <li>Security vulnerability assessment</li>
                <li>Intelligent analysis of scan results</li>
                <li>Conversational interface for network security tasks</li>
                <li>Explanation of technical findings in plain language</li>
                <li>Results visualization with summary, detailed views, and raw data access</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaExclamationTriangle className="mr-2 text-yellow-500" />
                Limitations
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Cannot perform intrusive scans without proper authorization</li>
                <li>Network scan capabilities are limited to what Nmap provides</li>
                <li>Requires proper network connectivity to scan targets</li>
                <li>Large scans may take significant time to complete</li>
                <li>Must have proper permissions to scan target hosts</li>
                <li>Always follow responsible security practices and legal requirements when scanning</li>
              </ul>
            </div>
          )}
        </div>

        {/* Scan Types Section */}
        <div id="scans" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('scans')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaSearch className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Scan Types
            </h2>
            {expandedSections.scans ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.scans && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                NetViz AI Agent can perform different types of network scans, each optimized for specific purposes.
                Choose the right scan type based on your needs and time constraints.
              </p>
              
              <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center">
                  <span className="mr-2">⚡</span> Quick Scan
                </h4>
                <p className="text-indigo-800 dark:text-indigo-200 mt-1">Fast scan of common ports using optimized parameters</p>
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Technical Details</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Uses Nmap with -T4 -F flags to quickly identify the most common open ports on a target</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Best For</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Initial reconnaissance or when time is limited</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Example Command</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">"run a quick scan on example.com"</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="mr-2">🔍</span> Service Scan
                </h4>
                <p className="text-blue-800 dark:text-blue-200 mt-1">Detailed scan that identifies running services on open ports</p>
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Technical Details</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Uses Nmap with -sV flag to detect service versions running on the target system</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Best For</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Understanding what services are running on a target system</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Example Command</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">"scan for services on 192.168.1.1"</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                <h4 className="text-lg font-semibold text-amber-700 dark:text-amber-300 flex items-center">
                  <span className="mr-2">🔐</span> Full Port Scan
                </h4>
                <p className="text-amber-800 dark:text-amber-200 mt-1">Comprehensive scan of all 65535 ports</p>
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Technical Details</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Scans the entire port range for complete coverage</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Best For</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Thorough security audits and comprehensive host analysis</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Example Command</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">"run a comprehensive port scan on example.com"</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Note</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Takes significantly longer than a Quick Scan</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-100 dark:border-red-800">
                <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 flex items-center">
                  <span className="mr-2">🛡️</span> Vulnerability Scan
                </h4>
                <p className="text-red-800 dark:text-red-200 mt-1">Identifies potential security vulnerabilities on the target</p>
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-red-600 dark:text-red-400">Technical Details</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Combines service detection with vulnerability assessment</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-red-600 dark:text-red-400">Best For</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">Security audits and penetration testing preparations</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-semibold text-red-600 dark:text-red-400">Example Command</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 col-span-2">"check for vulnerabilities on example.com"</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Command Reference Section */}
        <div id="commands" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('commands')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaTerminal className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Command Reference
            </h2>
            {expandedSections.commands ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.commands && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You can interact with the NetViz AI Agent using natural language commands. 
                While the system understands various formats, here are some example commands and patterns:
              </p>
              
              <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Command Pattern</th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Example</th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">scan [target] for open ports</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">scan google.com for open ports</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Basic port scan of the specified target</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">run a quick scan on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">run a quick scan on 192.168.1.1</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Fast scan of common ports</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">check if port [number] is open on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">check if port 443 is open on example.com</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Scan for a specific port only</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">scan for services on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">scan for services on 10.0.0.1</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Service detection scan</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">run a comprehensive port scan on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">run a comprehensive port scan on example.org</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Full port range scan</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">check for vulnerabilities on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">check for vulnerabilities on 192.168.0.1</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Vulnerability assessment scan</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">scan network range [CIDR]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">scan network range 192.168.1.0/24</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Scan multiple hosts in a range</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaHandPaper className="mr-2 text-indigo-500" />
                Best Practices
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Always ensure you have permission to scan target systems</li>
                <li>Start with quick scans before running more intensive scans</li>
                <li>Use specific scan types for specific needs to optimize time and resources</li>
                <li>Interpret results carefully, as open ports don't automatically indicate vulnerabilities</li>
                <li>Consider network conditions when interpreting scan results</li>
              </ul>
            </div>
          )}
        </div>

        {/* Technical Information Section */}
        <div id="tech" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('tech')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaCode className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Technical Information
            </h2>
            {expandedSections.tech ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.tech && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <FaMicrochip className="mr-2 text-indigo-500" />
                System Architecture
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                NetViz uses a client-server architecture where the React frontend communicates with a Node.js backend. 
                The backend integrates with Nmap through a custom MCP (Model Context Protocol) client that securely manages scan operations. 
                LangChain orchestrates the AI agent's reasoning and tool usage.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaNetworkWired className="mr-2 text-indigo-500" />
                Agent Architecture
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The NetViz AI Agent uses LangChain.js for orchestration, Anthropic Claude for AI capabilities, 
                and a WebSocket-based real-time communication system. It features a dual-pane interface showing 
                both the chat and the agent's thinking process for transparency.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaCogs className="mr-2 text-indigo-500" />
                Key Components
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li><span className="font-medium">AI Agent</span>: Powered by Anthropic's Claude model through LangChain, providing natural language understanding and generation</li>
                <li><span className="font-medium">WebSocket Connection</span>: Real-time communication channel that streams thinking process and results to the UI</li>
                <li><span className="font-medium">Nmap Integration</span>: Security scanner utility accessed through a Model Context Protocol (MCP) client for Nmap, and a separate MCP client for OSINT tools.</li>
                <li><span className="font-medium">Visualization Components</span>: React-based UI components that render scan results and AI analysis in a user-friendly format</li>
                <li><span className="font-medium">Command History</span>: System that tracks and allows reuse of previous commands</li>
                <li><span className="font-medium">Dark Mode</span>: User interface feature for comfortable viewing in different lighting conditions</li>
                <li><span className="font-medium">Progress Tracking</span>: Visual indicators showing scan progress and estimated completion time</li>
              </ul>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">System Requirements</h5>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 text-sm">
                  <li>Modern web browser with WebSocket support</li>
                  <li>Network connectivity to scan targets</li>
                  <li>Proper permissions for performing scans</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Langchain Framework Section */}
        <div id="langchain" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('langchain')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaPuzzlePiece className="mr-2 text-indigo-600 dark:text-indigo-400" />
              The Langchain Framework
            </h2>
            {expandedSections.langchain ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.langchain && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Langchain.js plays a pivotal role in the NetViz AI Agent, acting as the central nervous system that orchestrates its operations. 
                It provides a robust framework for building applications powered by Large Language Models (LLMs), like Anthropic's Claude.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaCogs className="mr-2 text-indigo-500" />
                Key Roles of Langchain:
              </h4>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                <li>
                  <span className="font-medium">LLM Abstraction:</span> Simplifies interaction with the Claude LLM, handling API calls and responses.
                </li>
                <li>
                  <span className="font-medium">Tool Management:</span> Allows defining and managing custom tools (e.g., NmapScanner, WhoisLookup). The agent can decide which tool to use based on the user's command and the tool's description.
                </li>
                <li>
                  <span className="font-medium">Agent Framework:</span> Provides the "AgentExecutor," a core loop that facilitates the agent's reasoning process:
                  <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm">
                    <li>Receives user input.</li>
                    <li>LLM analyzes input and decides on an action (respond or use a tool).</li>
                    <li>If a tool is chosen, Langchain executes it.</li>
                    <li>Tool output is fed back to the LLM for further processing or generating a final answer.</li>
                  </ol>
                </li>
                <li>
                  <span className="font-medium">Callback System:</span> Enables real-time streaming of the agent's internal processes (thoughts, tool usage) to the frontend via WebSockets, enhancing transparency.
                </li>
                <li>
                  <span className="font-medium">Conversation Memory:</span> Helps maintain context by managing conversation history, allowing for more coherent and informed interactions over time.
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Essentially, Langchain provides the essential building blocks and runtime environment that connect the LLM, our custom tools, and user interactions, enabling the sophisticated capabilities of the NetViz AI Agent.
              </p>
            </div>
          )}
        </div>

        {/* How Agent Chooses Tools Section */}
        <div id="toolChoice" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('toolChoice')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaTasks className="mr-2 text-indigo-600 dark:text-indigo-400" />
              How the Agent Chooses Tools
            </h2>
            {expandedSections.toolChoice ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.toolChoice && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The NetViz AI Agent's ability to select the appropriate tool for a given task is a critical aspect of its intelligence. 
                This process is not hardcoded but relies on the LLM's understanding and reasoning capabilities, guided by information we provide.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaSearch className="mr-2 text-indigo-500" />
                The Selection Process:
              </h4>
              <ol className="list-decimal pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                <li>
                  <span className="font-medium">User Command Analysis:</span> The LLM first analyzes the user's natural language command to understand the intent and the desired outcome.
                </li>
                <li>
                  <span className="font-medium">Tool Descriptions are Key:</span> Each tool available to the agent (e.g., `NmapScanner`, `WhoisLookup`, `DNSRecon`) is defined with a detailed description. These descriptions explain what the tool does, its typical use cases, and sometimes even example inputs. 
                  The LLM matches the user's intent against these descriptions.
                </li>
                <li>
                  <span className="font-medium">System Prompt Guidance:</span> A carefully crafted system prompt provides overall instructions to the agent, including a list of available tools and general advice on how to behave. The documentation loaded into `agent_documentation.md` further enriches this context.
                </li>
                <li>
                  <span className="font-medium">Reasoning and Decision:</span> Based on the command, tool descriptions, and system prompt, the LLM reasons about which tool (if any) is best suited to achieve the user's goal. It might also determine necessary parameters for the tool.
                </li>
                <li>
                  <span className="font-medium">Tool Invocation via Langchain:</span> Once a tool is selected, Langchain facilitates its execution. The actual interaction with external services (like Nmap or OSINT utilities via MCP clients) happens within the tool's specific function.
                </li>
              </ol>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaBolt className="mr-2 text-yellow-500" />
                Improving Tool Selection:
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                The accuracy of tool selection can be enhanced by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>Writing clear, concise, and highly descriptive tool descriptions.</li>
                <li>Ensuring distinct differences between tools are highlighted in their descriptions.</li>
                <li>Continuously refining the system prompt for better contextual understanding.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                The LLM doesn't "know" about MCP servers directly. It selects a Langchain tool object, and the code implementing that tool handles the communication with the respective MCP client and underlying service.
              </p>
            </div>
          )}
        </div>

        {/* Visualizing the Agent's Mind Section */}
        <div id="agentMind" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('agentMind')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaBrain className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Visualizing the Agent's Mind
            </h2>
            {expandedSections.agentMind ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.agentMind && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To provide transparency into the AI Agent's operations, NetViz offers a unique "AI Security Analysis" pane. 
                This pane visualizes the agent's thinking process, tool interactions, and intermediate analysis steps in real-time.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 flex items-center">
                <FaNetworkWired className="mr-2 text-indigo-500" />
                How it Works:
              </h4>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                <li>
                  <span className="font-medium">WebSocket Streaming:</span> The backend (`aiAgentService.js`) uses a `WebSocketCallbackHandler` integrated with Langchain. This handler captures various events during the agent's execution.
                </li>
                <li>
                  <span className="font-medium">Event Types:</span> Key events streamed include:
                    <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                      <li>`llm_start` / `llm_end`: Marks the beginning and end of the LLM's thinking phases.</li>
                      <li>`llm_token`: Streams individual pieces (tokens) of the LLM's generated text as it thinks or forms a response.</li>
                      <li>`tool_start` / `tool_end`: Indicates when a tool (e.g., NmapScanner) is invoked and when it completes, including its output.</li>
                      <li>`agent_action`: Shows the specific action the agent decides to take, like which tool to use and with what input.</li>
                    </ul>
                </li>
                <li>
                  <span className="font-medium">Frontend Processing:</span> The `AiAgentPage.jsx` receives these events via a WebSocket connection managed by the `useAgentWebSocket` hook.
                </li>
                <li>
                  <span className="font-medium">AI Analysis Viewer:</span> The `AIAnalysisViewer.jsx` component processes these raw events, translating them into a more human-readable format. It identifies:
                    <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                      <li>Reasoning steps and thoughts extracted from agent logs.</li>
                      <li>Observations made from tool outputs.</li>
                      <li>Specific tools being deployed.</li>
                      <li>Summaries and insights generated by the LLM.</li>
                    </ul>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                This "behind-the-scenes" view helps users understand how the agent arrives at its conclusions, builds trust, and can aid in debugging or refining agent behavior. 
                It transforms the agent from a "black box" into a more interpretable system.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-10">
          <div 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('faq')}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaQuestionCircle className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Frequently Asked Questions
            </h2>
            {expandedSections.faq ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
          </div>
          
          {expandedSections.faq && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  What is the difference between a Quick Scan and a Full Port Scan?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  A Quick Scan examines only the most common ports (typically around 1000) and uses 
                  faster timing settings, making it complete in seconds or minutes. A Full Port Scan 
                  examines all 65,535 TCP ports, which is much more thorough but can take significantly longer.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Is it legal to scan any IP address or domain?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  No. You should only scan systems that you own or have explicit permission to scan. 
                  Unauthorized scanning can be illegal in many jurisdictions and may violate terms of service 
                  for network providers. Always ensure you have proper authorization before scanning any target.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Why is my scan taking so long to complete?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Scan duration depends on several factors including scan type, target size, network conditions, 
                  and target responsiveness. Full port scans or scans of multiple hosts will take longer. 
                  If a scan is taking too long, consider using a Quick Scan or limiting the port range.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Can I scan multiple hosts at once?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can scan a network range using CIDR notation (e.g., "scan network range 192.168.1.0/24") 
                  or a list of targets. However, scanning multiple hosts will take proportionally longer and 
                  may have resource implications.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  What does "open", "closed", and "filtered" mean in scan results?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Open</span>: The port is accepting connections.<br />
                  <span className="font-medium">Closed</span>: The port is accessible but no application is listening on it.<br />
                  <span className="font-medium">Filtered</span>: Something (like a firewall) is blocking access to the port, preventing Nmap from determining if it's open.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage; 