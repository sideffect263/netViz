import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRobot, 
  FaTerminal, 
  FaInfoCircle, 
  FaTimes, 
  FaSearch, 
  FaBolt, 
  FaMicrochip, 
  FaNetworkWired,
  FaCode,
  FaExclamationTriangle,
  FaBook
} from 'react-icons/fa';

const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center">
            <FaRobot className="text-2xl mr-3" />
            <h2 className="text-xl font-semibold">NetViz AI Agent Help</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'overview' 
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="flex items-center">
              <FaInfoCircle className="mr-2" />
              Overview
            </span>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'scans' 
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('scans')}
          >
            <span className="flex items-center">
              <FaSearch className="mr-2" />
              Scan Types
            </span>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'commands' 
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('commands')}
          >
            <span className="flex items-center">
              <FaTerminal className="mr-2" />
              Commands
            </span>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'tech' 
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('tech')}
          >
            <span className="flex items-center">
              <FaCode className="mr-2" />
              Technical
            </span>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaRobot className="mr-2 text-indigo-500" />
                About NetViz AI Agent
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                NetViz AI Agent is an intelligent assistant that helps with network scanning, analysis, and security tasks. 
                It combines the power of AI with network tools like Nmap to provide useful insights in a conversational interface.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 flex items-center">
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
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 flex items-center">
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
          
          {activeTab === 'scans' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaSearch className="mr-2 text-indigo-500" />
                Scan Types
              </h3>
              
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
          
          {activeTab === 'commands' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaTerminal className="mr-2 text-indigo-500" />
                Command Structure
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can interact with the NetViz AI Agent using natural language commands. 
                While the system understands various formats, here are some example commands:
              </p>
              
              <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Command Pattern</th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">scan [target] for open ports</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">scan google.com for open ports</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">run a quick scan on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">run a quick scan on 192.168.1.1</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">check if port [number] is open on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">check if port 443 is open on example.com</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">scan for services on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">scan for services on 10.0.0.1</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">run a comprehensive port scan on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">run a comprehensive port scan on example.org</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">check for vulnerabilities on [target]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">check for vulnerabilities on 192.168.0.1</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">scan network range [CIDR]</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">scan network range 192.168.1.0/24</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 flex items-center">
                <FaInfoCircle className="mr-2 text-indigo-500" />
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
          
          {activeTab === 'tech' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaMicrochip className="mr-2 text-indigo-500" />
                Technical Architecture
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                NetViz uses a client-server architecture where the React frontend communicates with a Node.js backend. 
                The backend integrates with Nmap through a custom MCP (Model Context Protocol) client that securely manages scan operations. 
                LangChain orchestrates the AI agent's reasoning and tool usage.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 flex items-center">
                <FaNetworkWired className="mr-2 text-indigo-500" />
                Agent Architecture
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                The NetViz AI Agent uses LangChain.js for orchestration, Anthropic Claude for AI capabilities, 
                and a WebSocket-based real-time communication system. It features a dual-pane interface showing 
                both the chat and the agent's thinking process for transparency.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 flex items-center">
                <FaRobot className="mr-2 text-indigo-500" />
                Key Components
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li><span className="font-medium">AI Agent</span>: Powered by Anthropic's Claude model through LangChain, providing natural language understanding and generation</li>
                <li><span className="font-medium">WebSocket Connection</span>: Real-time communication channel that streams thinking process and results to the UI</li>
                <li><span className="font-medium">Nmap Integration</span>: Security scanner utility accessed through a Model Context Protocol (MCP) client</li>
                <li><span className="font-medium">Visualization Components</span>: React-based UI components that render scan results in a user-friendly format</li>
                <li><span className="font-medium">Command History</span>: System that tracks and allows reuse of previous commands</li>
                <li><span className="font-medium">Dark Mode</span>: User interface feature for comfortable viewing in different lighting conditions</li>
                <li><span className="font-medium">Progress Tracking</span>: Visual indicators showing scan progress and estimated completion time</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <FaBook className="mr-1 text-indigo-500" />
            <span>Need more details? Visit our </span>
            <Link 
              to="/documentation" 
              className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              onClick={onClose}
            >
              full documentation page
            </Link>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 