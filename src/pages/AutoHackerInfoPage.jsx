import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaNetworkWired, FaBug, FaServer, FaPlayCircle } from 'react-icons/fa';

const AutoHackerInfoPage = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center">
              <FaRobot className="h-10 w-10 text-indigo-600 mr-3 animate-bounce" />
              Autonomous Hacker Explained
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              Dive into the mechanics behind NetScan360's <span className="font-semibold text-gray-700">Autonomous Hacker</span>
              – an AI-powered reconnaissance engine that automatically uncovers vulnerabilities.
            </p>
            <Link
              to="/auto-hacker"
              className="inline-flex items-center bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-base font-medium text-white hover:bg-indigo-700 shadow-lg transition-colors"
            >
              <FaPlayCircle className="mr-2" /> Try It Now
            </Link>
          </div>
          {/* simple floating animation */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-70 animate-ping"></div>
              <FaServer className="relative h-64 w-64 text-indigo-600 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">How the First Two Stages Operate</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Port Scan Card */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaNetworkWired className="h-8 w-8 text-indigo-500 mr-3 animate-spin-slow" />
              <h3 className="text-2xl font-semibold text-gray-900">Stage 1: Port Scan</h3>
            </div>
            <p className="text-gray-600 mb-3">
              The Autonomous Hacker kicks off with a lightning-fast <span className="font-medium">port scan</span> driven by our
              <span className="font-medium"> MCP Nmap server</span>.
            </p>
            <ul className="list-disc ml-6 text-gray-500 space-y-2">
              <li>Scans <span className="font-semibold">up to 65,535</span> TCP/UDP ports depending on the chosen depth.</li>
              <li>Uses <code className="bg-gray-200 px-1 rounded text-xs">nmapScan</code> tool exposed by the MCP server.</li>
              <li>Tailored flag set (e.g. <code className="bg-gray-200 px-1 rounded text-xs">-T4 -p 1-1000</code>) is sent as JSON over HTTP.</li>
              <li>Results stream back in real-time, parsed into structured JSON.</li>
            </ul>
          </div>

          {/* Vulnerability Scan Card */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaBug className="h-8 w-8 text-red-500 mr-3 animate-pulse" />
              <h3 className="text-2xl font-semibold text-gray-900">Stage 2: Vulnerability Scan</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Next, we trigger an <span className="font-medium">Nmap script-based vulnerability scan</span> through the same MCP endpoint.
            </p>
            <ul className="list-disc ml-6 text-gray-500 space-y-2">
              <li>Executes <code className="bg-gray-200 px-1 rounded text-xs">--script vuln</code> across discovered services.</li>
              <li>MCP server returns both the human-readable summary <em>and</em> the full XML output.</li>
              <li>Our backend parses script results, extracting CVE references &amp; severity.</li>
              <li>The AI layer (Anthropic) then ranks and contextualises each finding.</li>
            </ul>
          </div>
        </div>

        {/* MCP Flow Section */}
        <div className="mt-20 bg-indigo-50 rounded-lg p-10">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Behind the Scenes – MCP Nmap Server Flow</h3>
          <ol className="space-y-4 text-gray-700 list-decimal ml-6">
            <li>
              <span className="font-medium">React UI</span> sends your target &amp; selected depth to our Express API.
            </li>
            <li>
              The server calls <code className="bg-gray-200 px-1 rounded text-xs">invokeNmapScan</code> which lazily initialises the
              MCP client and selects the <code className="bg-gray-200 px-1 rounded text-xs">nmapScan</code> tool.
            </li>
            <li>
              Flags are transmitted over a secure, streaming HTTP transport to
              <span className="font-semibold"> server.smithery.ai</span>.
            </li>
            <li>
              The MCP server executes Nmap in an isolated sandbox and streams results back chunk-by-chunk – no CLI or browser extensions needed.
            </li>
            <li>
              Our backend parses &amp; stores the data, updates progress every 2 seconds, and the UI renders live insights.
            </li>
          </ol>
        </div>

        {/* Architecture Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Building the Custom MCP Nmap Server</h2>
          <div className="bg-white shadow-md rounded-lg p-10 space-y-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              To avoid shipping a heavy Nmap binary with our Node.js backend, we created a <span className="font-semibold">dedicated Model-Context-Protocol (MCP) server</span> that exposes
              sandboxed Nmap scans as remote <code className="bg-gray-200 px-1 rounded text-sm">tools</code>. Below is a distilled journey of how it was built and woven into NetScan360.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                  <FaServer className="mr-2" /> Core Steps
                </h3>
                <ul className="list-decimal ml-6 space-y-2 text-gray-700">
                  <li>
                    Provisioned a lightweight Ubuntu container on <span className="font-medium">Fly.io</span> with only Nmap &amp; Lua scripts installed.
                  </li>
                  <li>
                    Implemented a tiny <code className="bg-gray-200 px-1 rounded text-sm">toolServer.ts</code> that wraps Nmap execution behind a <em>streamable</em> HTTP interface defined by MCP.
                  </li>
                  <li>
                    Registered two tools – <code className="bg-gray-200 px-1 rounded text-sm">nmapScan</code> &amp; <code className="bg-gray-200 px-1 rounded text-sm">getInfo</code> – each with a JSON schema for parameters &amp; results.
                  </li>
                  <li>
                    Hardened the container with <span className="font-medium">seccomp</span> &amp; <span className="font-medium">cap-drop</span> to isolate potential shell-escape attempts.
                  </li>
                  <li>
                    Published the endpoint on Smithery (<code className="bg-gray-200 px-1 rounded text-sm">server.smithery.ai/@sideffect263/nmap-mcp-server</code>).
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                  <FaRobot className="mr-2" /> Project Integration
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>Created <code className="bg-gray-200 px-1 rounded text-sm">mcpClientSideEffect.mjs</code> to initialise a client once and reuse it for all scans.</li>
                  <li>Added intelligent reconnection &amp; <em>tool discovery</em> logic to survive server restarts.</li>
                  <li>Wrapped invocation in <code className="bg-gray-200 px-1 rounded text-sm">invokeNmapScan()</code>, converting <code className="text-xs">nmap_args array → flags string</code>.</li>
                  <li>All backend stages call this helper; the UI receives parsed JSON plus live progress via REST polling.</li>
                </ul>
              </div>
            </div>

            {/* simplified sequence diagram */}
            <div className="mt-10">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Sequence Diagram (simplified)</h4>
              <pre className="bg-gray-900 text-green-400 text-sm rounded-lg p-6 overflow-x-auto">
{`browser        →  Express API       →  MCP Client     →  MCP Server
/auto-hacker      POST /scan            invokeNmapScan     run nmap -T4 …
                ← 200 (scanId)      ←  progress JSON   ←  XML & summary
progress bar  ←  GET /status/:id  ←  cached results  ←  streamed chunks`}
              </pre>
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-700 text-lg mb-6">Curious to see it in action? Launch the Autonomous Hacker and watch the magic unfold.</p>
          <Link
            to="/auto-hacker"
            className="inline-flex items-center bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-base font-medium text-white hover:bg-indigo-700 shadow-lg transition-colors"
          >
            <FaPlayCircle className="mr-2" /> Start a Scan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AutoHackerInfoPage; 