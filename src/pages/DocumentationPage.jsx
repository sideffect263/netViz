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
  FaCogs
} from 'react-icons/fa';

const DocumentationPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    scans: false,
    commands: false,
    tech: false,
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
                <li><span className="font-medium">Nmap Integration</span>: Security scanner utility accessed through a Model Context Protocol (MCP) client</li>
                <li><span className="font-medium">Visualization Components</span>: React-based UI components that render scan results in a user-friendly format</li>
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