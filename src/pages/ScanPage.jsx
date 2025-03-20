import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaSearch, FaSpinner, FaCog, FaServer } from 'react-icons/fa';
import { getDnsInfo } from '../api/dnsApi';

const ScanPage = () => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanOptions, setScanOptions] = useState({
    dns: true,
    whois: true,
    ssl: true,
    headers: true,
    ports: false,
    malware: false,
    deepScan: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

  const toggleOption = (option) => {
    setScanOptions({
      ...scanOptions,
      [option]: !scanOptions[option]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate domain
    if (!domain) {
      setError('Please enter a domain name');
      return;
    }

    // Remove http:// or https:// if present
    let cleanDomain = domain;
    if (domain.startsWith('http://')) {
      cleanDomain = domain.slice(7);
    } else if (domain.startsWith('https://')) {
      cleanDomain = domain.slice(8);
    }

    // Remove path if present
    if (cleanDomain.includes('/')) {
      cleanDomain = cleanDomain.split('/')[0];
    }

    if (!domainRegex.test(cleanDomain)) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    // Start scanning
    setLoading(true);

    try {
      // Make a test DNS lookup to see if we can connect to the API
      await getDnsInfo(cleanDomain);
      
      // If successful, navigate to results page where full scanning will happen
      navigate(`/results/${cleanDomain}`);
    } catch (err) {
      console.error('Scanning error:', err);
      if (err.response) {
        // If we got a server response with an error
        setError(`Error: ${err.response.data?.error || 'Server error'}`);
      } else if (err.request) {
        // If the request was made but no response was received
        setError('Could not connect to the scanning server. Please check if the backend is running.');
      } else {
        // Something else went wrong
        setError('Failed to scan domain. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Enter a domain to scan
              </h1>
              <p className="mt-2 text-sm text-gray-500 text-center">
                NetScan360 will analyze the domain's DNS records, security certificates, and
                network topology.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 sm:text-lg border-gray-300 rounded-md"
                    placeholder="example.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="submit"
                      className="h-full py-2 px-4 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin h-5 w-5" />
                      ) : (
                        <FaSearch className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {error}
                  </p>
                )}

                <div className="mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <FaCog className="mr-1" />
                    {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
                  </button>
                </div>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Scan Options</h3>
                    <div className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
                      <div className="flex items-center">
                        <input
                          id="dns"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.dns}
                          onChange={() => toggleOption('dns')}
                        />
                        <label htmlFor="dns" className="ml-2 block text-sm text-gray-700">
                          DNS Records
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="whois"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.whois}
                          onChange={() => toggleOption('whois')}
                        />
                        <label htmlFor="whois" className="ml-2 block text-sm text-gray-700">
                          WHOIS Information
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="ssl"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.ssl}
                          onChange={() => toggleOption('ssl')}
                        />
                        <label htmlFor="ssl" className="ml-2 block text-sm text-gray-700">
                          SSL Certificate
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="headers"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.headers}
                          onChange={() => toggleOption('headers')}
                        />
                        <label htmlFor="headers" className="ml-2 block text-sm text-gray-700">
                          HTTP Headers
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="ports"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.ports}
                          onChange={() => toggleOption('ports')}
                        />
                        <label htmlFor="ports" className="ml-2 block text-sm text-gray-700">
                          Port Scan
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="malware"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.malware}
                          onChange={() => toggleOption('malware')}
                        />
                        <label htmlFor="malware" className="ml-2 block text-sm text-gray-700">
                          Malware Check
                        </label>
                      </div>
                      <div className="flex items-center col-span-2 sm:col-span-3 mt-2">
                        <input
                          id="deepScan"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={scanOptions.deepScan}
                          onChange={() => toggleOption('deepScan')}
                        />
                        <label htmlFor="deepScan" className="ml-2 block text-sm text-gray-700">
                          Deep Scan (Includes subdomain enumeration - takes longer)
                        </label>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Note: Some scan options may take longer to complete
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Scanning...
                      </>
                    ) : (
                      'Scan Website'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Popular Domains to Scan
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Try scanning these popular domains:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['google.com', 'facebook.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com'].map((site) => (
                  <button
                    key={site}
                    type="button"
                    onClick={() => setDomain(site)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {site}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                About DNS Scanning
              </h2>
              <p className="text-sm text-gray-600">
                DNS scanning provides valuable information about a domain's infrastructure, including:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>IP addresses associated with the domain</li>
                <li>Mail servers (MX records) configuration</li>
                <li>Name servers (NS records) responsible for the domain</li>
                <li>TXT records that may include SPF, DKIM, and DMARC policies</li>
                <li>WHOIS information including registration and expiration details</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                Our scanner automatically checks for common security misconfigurations and provides recommendations 
                to improve your domain's security posture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage; 