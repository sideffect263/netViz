import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaTerminal, FaLightbulb, FaServer, FaPlayCircle, FaSearch, FaNetworkWired } from 'react-icons/fa';

const AutoHackerInfoPage = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center">
              <FaRobot className="h-10 w-10 text-indigo-600 mr-3 animate-bounce" />
              AI Network Agent Explained
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              Dive into the mechanics behind NetViz's <span className="font-semibold text-gray-700">AI Network Agent</span>
              – an intelligent assistant that helps you explore and understand your network.
            </p>
            <Link
              to="/ai-agent"
              className="inline-flex items-center bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-base font-medium text-white hover:bg-indigo-700 shadow-lg transition-colors"
            >
              <FaPlayCircle className="mr-2" /> Try It Now
            </Link>
          </div>
          {/* simple floating animation */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-70 animate-ping"></div>
              <FaRobot className="relative h-64 w-64 text-indigo-600 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">How the AI Agent Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Chat Interface Card */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaTerminal className="h-8 w-8 text-indigo-500 mr-3 animate-spin-slow" />
              <h3 className="text-2xl font-semibold text-gray-900">Intelligent Chat Interface</h3>
            </div>
            <p className="text-gray-600 mb-3">
              The AI Network Agent provides a <span className="font-medium">natural language interface</span> where you can ask questions and request network scans.
            </p>
            <ul className="list-disc ml-6 text-gray-500 space-y-2">
              <li>Type commands like <code className="bg-gray-200 px-1 rounded text-xs">"scan example.com"</code> in plain English.</li>
              <li>Get suggestions for common commands with autocomplete.</li>
              <li>The agent interprets your request and executes the appropriate action.</li>
              <li>Results are presented in a clear, visual format.</li>
            </ul>
          </div>

          {/* Thinking Process Card */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaLightbulb className="h-8 w-8 text-yellow-500 mr-3 animate-pulse" />
              <h3 className="text-2xl font-semibold text-gray-900">Transparent Thinking Process</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Watch the agent's <span className="font-medium">thought process in real-time</span> as it works on your request.
            </p>
            <ul className="list-disc ml-6 text-gray-500 space-y-2">
              <li>See the agent's reasoning and decision-making steps.</li>
              <li>Monitor tool usage and actions as they happen.</li>
              <li>Track progress updates during longer tasks like network scans.</li>
              <li>Learn how the agent interprets and responds to your commands.</li>
            </ul>
          </div>
        </div>

        {/* Real-time WebSocket Section */}
        <div className="mt-20 bg-indigo-50 rounded-lg p-10">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Behind the Scenes – Real-time Communication</h3>
          <ol className="space-y-4 text-gray-700 list-decimal ml-6">
            <li>
              <span className="font-medium">React UI</span> establishes a WebSocket connection for real-time updates.
            </li>
            <li>
              When you submit a command, it's sent to the backend API via a POST request.
            </li>
            <li>
              The backend processes your request and sends events about the agent's actions through the WebSocket.
            </li>
            <li>
              Different event types (tool usage, thinking steps, progress updates) are streamed back to the UI.
            </li>
            <li>
              Results are visualized in real-time, with scan data presented in an interactive format.
            </li>
          </ol>
        </div>

        {/* Network Scanning Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Powerful Network Scanning Capabilities</h2>
          <div className="bg-white shadow-md rounded-lg p-10 space-y-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              The AI Agent can perform various network scans and interpret the results for you. It uses natural language understanding to configure and execute scans based on your requests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                  <FaNetworkWired className="mr-2" /> Scan Types
                </h3>
                <ul className="list-decimal ml-6 space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Quick scans</span> for rapid reconnaissance of targets.
                  </li>
                  <li>
                    <span className="font-medium">Service detection</span> to identify what's running on open ports.
                  </li>
                  <li>
                    <span className="font-medium">Comprehensive port scans</span> to check all possible ports on a target.
                  </li>
                  <li>
                    <span className="font-medium">Vulnerability checks</span> to identify potential security issues.
                  </li>
                  <li>
                    <span className="font-medium">Custom scans</span> with specific parameters as needed.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                  <FaSearch className="mr-2" /> Result Visualization
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>Scan results presented in an organized, tabular format.</li>
                  <li>Summary view with counts of open ports, services, and hosts.</li>
                  <li>Detailed view showing individual port states and services.</li>
                  <li>Raw data access for technical users who need the complete information.</li>
                  <li>Visual indicators to highlight important findings like open ports.</li>
                </ul>
              </div>
            </div>

            {/* Example command flow */}
            <div className="mt-10">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Example Interaction</h4>
              <pre className="bg-gray-900 text-green-400 text-sm rounded-lg p-6 overflow-x-auto">
{`User: "scan example.com for open ports"

AI Agent: Processing your request...
[Thinking Process: Determining scan type, configuring parameters]
[Tool Usage: Executing port scan against example.com]
[Progress: 20% - Discovering hosts...]
[Progress: 40% - Port scanning...]
[Progress: 70% - Service detection...]
[Progress: 100% - Scan complete!]

AI Agent: I've completed the scan of example.com. 
Found 3 open ports: 80 (http), 443 (https), 22 (ssh).
[Displays interactive visualization of scan results]`}
              </pre>
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-700 text-lg mb-6">Ready to explore your network with AI assistance? Try the AI Network Agent now!</p>
          <Link
            to="/ai-agent"
            className="inline-flex items-center bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-base font-medium text-white hover:bg-indigo-700 shadow-lg transition-colors"
          >
            <FaPlayCircle className="mr-2" /> Chat with the Agent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AutoHackerInfoPage; 