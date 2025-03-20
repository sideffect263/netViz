import React from 'react';
import { Link } from 'react-router-dom';
import { FaNetworkWired, FaServer, FaGlobe, FaShieldAlt, FaTools } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">About NetScan360</h2>
            <p className="mt-4 text-lg text-gray-500">
              NetScan360 was created to provide network topology analysis without requiring browser
              extensions or CLI tools, making web infrastructure analysis accessible to everyone.
            </p>
            <div className="mt-6">
              <Link
                to="/scan"
                className="inline-flex bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-indigo-700"
              >
                Start Scanning
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-2">
            <dl className="space-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <FaNetworkWired className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Why Network Topology Matters
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Understanding a website's network topology is crucial for security assessments,
                    performance optimization, and threat intelligence. It helps identify potential
                    security vulnerabilities, optimize network routes, and understand third-party
                    dependencies.
                  </dd>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <FaGlobe className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">How NetScan360 Works</dt>
                  <dd className="mt-2 text-base text-gray-500">
                    NetScan360 works by analyzing various aspects of a website's infrastructure
                    through HTTP requests, DNS queries, and other network analysis techniques. We use
                    a combination of server-side scripts and APIs to collect data about domains, IP
                    addresses, server technologies, and security configurations.
                  </dd>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <FaShieldAlt className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">Privacy & Security</dt>
                  <dd className="mt-2 text-base text-gray-500">
                    We take privacy and security seriously. NetScan360 only collects publicly
                    available information about websites. We don't store or share your scan results
                    with third parties, and all scans are performed server-side with secure
                    connections.
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-extrabold text-gray-900">Our Technology Stack</h3>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <FaServer className="h-8 w-8 text-indigo-500" />
                <h4 className="ml-4 text-xl font-bold text-gray-900">Backend Technologies</h4>
              </div>
              <ul className="mt-4 ml-12 list-disc text-gray-500">
                <li>Node.js and Express for the API server</li>
                <li>DNS, WHOIS, and network analysis libraries</li>
                <li>TLS/SSL certificate validation</li>
                <li>HTTP request proxying and analysis</li>
                <li>Technology fingerprinting algorithms</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <FaTools className="h-8 w-8 text-indigo-500" />
                <h4 className="ml-4 text-xl font-bold text-gray-900">Frontend Technologies</h4>
              </div>
              <ul className="mt-4 ml-12 list-disc text-gray-500">
                <li>React.js for UI components</li>
                <li>D3.js and Cytoscape.js for network visualization</li>
                <li>Tailwind CSS for responsive design</li>
                <li>Chart.js for data visualization</li>
                <li>React Router for navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 