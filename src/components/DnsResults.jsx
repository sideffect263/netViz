import React, { useState } from 'react';
import { FaServer, FaExclamationTriangle, FaInfoCircle, FaCopy, FaGlobe, FaSearch, FaNetworkWired, FaCube } from 'react-icons/fa';
import { getShodanHostInfo, getDnsInfo } from '../api/dnsApi';
import CacheIndicator from './CacheIndicator';
import DnsHierarchy from './DnsHierarchy';
import Dns3DVisualizationWrapper from './Dns3DVisualizationWrapper';

const DnsResults = ({ dnsData }) => {
  const [copiedText, setCopiedText] = useState('');
  const [shodanData, setShodanData] = useState(null);
  const [shodanLoading, setShodanLoading] = useState(false);
  const [shodanError, setShodanError] = useState(null);
  const [shodanNote, setShodanNote] = useState(null);
  const [selectedIp, setSelectedIp] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [visualizationType, setVisualizationType] = useState('2d'); // '2d' or '3d'
  
  if (!dnsData) return null;
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Calculate remaining days until expiration
  const calculateRemainingDays = (expirationDateString) => {
    try {
      const expDate = new Date(expirationDateString);
      const today = new Date();
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  };
  
  // Function to fetch Shodan data for a specific IP
  const fetchShodanData = async (ip) => {
    try {
      setShodanLoading(true);
      setShodanError(null);
      setShodanNote(null);
      setSelectedIp(ip);
      
      const data = await getShodanHostInfo(ip);
      setShodanData(data.info);
      
      // Check if there's a note about limited data
      if (data.note) {
        setShodanNote(data.note);
      }
      
      setShodanLoading(false);
    } catch (error) {
      console.error('Error fetching Shodan data:', error);
      
      // Extract the error message
      let errorMessage = error.message || 'Failed to retrieve Shodan data';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
      }
      
      setShodanError(errorMessage);
      setShodanLoading(false);
    }
  };
  
  // Function to refresh DNS data
  const handleRefreshDnsData = async () => {
    try {
      if (refreshing || !dnsData.domain) return;
      
      setRefreshing(true);
      
      // Force a fresh fetch by adding a cache-busting parameter
      const freshData = await getDnsInfo(dnsData.domain);
      
      // Reload the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing DNS data:', error);
      setRefreshing(false);
    }
  };
  
  const remainingDays = dnsData.whois?.expirationDate ? 
    calculateRemainingDays(dnsData.whois.expirationDate) : null;
  
  return (
    <div className="space-y-6">
      {/* Cache Status Indicator */}
      {dnsData._cache && (
        <div className="flex justify-end">
          <CacheIndicator 
            cacheInfo={dnsData._cache} 
            onRefresh={handleRefreshDnsData} 
            label="DNS Data"
          />
        </div>
      )}
      
      {/* Visualization Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">DNS Visualization</h3>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1.5 rounded text-sm flex items-center ${
                visualizationType === '2d' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setVisualizationType('2d')}
            >
              <FaNetworkWired className="mr-1" /> 2D View
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm flex items-center ${
                visualizationType === '3d' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setVisualizationType('3d')}
            >
              <FaCube className="mr-1" /> 3D View
            </button>
          </div>
        </div>
      </div>
      
      {/* DNS Hierarchy Visualization */}
      {visualizationType === '2d' ? (
        <DnsHierarchy dnsData={dnsData} />
      ) : (
        <Dns3DVisualizationWrapper dnsData={dnsData} />
      )}
      
      {/* IP Addresses */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          <FaServer className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">IP Addresses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dnsData.ipAddresses && dnsData.ipAddresses.map((ip, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ip.includes(':') ? 'IPv6' : 'IPv4'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => copyToClipboard(ip)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Copy IP"
                      >
                        {copiedText === ip ? 'Copied!' : <FaCopy />}
                      </button>
                      <button 
                        onClick={() => fetchShodanData(ip)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Lookup in Shodan"
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Shodan Data Section */}
        {shodanLoading && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-700">Loading Shodan data for {selectedIp}...</p>
          </div>
        )}
        
        {shodanError && (
          <div className="mt-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <FaExclamationTriangle className="text-red-500 mt-1 mr-2" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">Error loading Shodan data</h4>
                <p className="text-sm text-red-600">{shodanError}</p>
              </div>
            </div>
          </div>
        )}
        
        {shodanData && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
              <img src="https://static.shodan.io/shodan/img/favicon.png" alt="Shodan" className="w-5 h-5 mr-2" />
              Shodan Information for {selectedIp}
            </h4>
            
            {shodanNote && (
              <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-100">
                <div className="flex">
                  <FaInfoCircle className="text-blue-500 mt-0.5 mr-2" />
                  <p className="text-sm text-blue-700">{shodanNote}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">General Information</h5>
                <div className="bg-white p-3 rounded shadow-sm">
                  {shodanData.country_name && (
                    <p className="text-sm mb-1">
                      <FaGlobe className="inline-block mr-1 text-blue-500" /> 
                      Location: {shodanData.city || 'Unknown'}, {shodanData.country_name}
                    </p>
                  )}
                  {shodanData.isp && (
                    <p className="text-sm mb-1">ISP: {shodanData.isp}</p>
                  )}
                  {shodanData.org && (
                    <p className="text-sm mb-1">Organization: {shodanData.org}</p>
                  )}
                  {shodanData.os && (
                    <p className="text-sm mb-1">Operating System: {shodanData.os}</p>
                  )}
                  {shodanData.last_update && (
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(shodanData.last_update).toLocaleString()}
                    </p>
                  )}
                  {!shodanData.country_name && !shodanData.isp && !shodanData.org && !shodanData.os && (
                    <p className="text-sm text-gray-500">Limited information available</p>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Open Ports & Services</h5>
                {shodanData.ports && shodanData.ports.length > 0 ? (
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      {shodanData.ports.map(port => (
                        <span key={port} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          {port}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No open ports detected or limited by free API</p>
                )}
              </div>
            </div>
            
            {/* More Shodan data can be displayed here */}
            {shodanData.vulns && shodanData.vulns.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Vulnerabilities</h5>
                <div className="bg-red-50 p-3 rounded shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {shodanData.vulns.map(vuln => (
                      <span key={vuln} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded flex items-center">
                        <FaExclamationTriangle className="mr-1" /> {vuln}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* DNS Records section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MX Records */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">MX Records</h3>
          {dnsData.mxRecords && dnsData.mxRecords.length > 0 ? (
            <ul className="space-y-2">
              {dnsData.mxRecords.map((record, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <span className="font-medium">{record.exchange}</span>
                    <span className="ml-2 text-sm text-gray-500">Priority: {record.priority}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(record.exchange)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedText === record.exchange ? 'Copied!' : <FaCopy />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No MX records found</p>
          )}
        </div>
        
        {/* NS Records */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">NS Records</h3>
          {dnsData.nsRecords && dnsData.nsRecords.length > 0 ? (
            <ul className="space-y-2">
              {dnsData.nsRecords.map((record, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <span>{record}</span>
                  <button 
                    onClick={() => copyToClipboard(record)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedText === record ? 'Copied!' : <FaCopy />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No NS records found</p>
          )}
        </div>
        
        {/* TXT Records */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">TXT Records</h3>
          {dnsData.txtRecords && dnsData.txtRecords.length > 0 ? (
            <ul className="space-y-2">
              {dnsData.txtRecords.map((record, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded text-sm break-all">
                  <div className="flex justify-between items-start mb-1">
                    <div className="max-w-4/5">{record}</div>
                    <button 
                      onClick={() => copyToClipboard(record)}
                      className="text-indigo-600 hover:text-indigo-800 ml-2 flex-shrink-0"
                    >
                      {copiedText === record ? 'Copied!' : <FaCopy />}
                    </button>
                  </div>
                  {record.includes('v=spf1') && (
                    <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-100">
                      <FaInfoCircle className="inline-block mr-1 text-blue-500" />
                      SPF record detected - defines authorized mail servers for the domain
                    </div>
                  )}
                  {record.includes('v=DMARC1') && (
                    <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-100">
                      <FaInfoCircle className="inline-block mr-1 text-blue-500" />
                      DMARC record detected - provides email authentication policy
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No TXT records found</p>
          )}
        </div>
        
        {/* CNAME Records */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">CNAME Records</h3>
          {dnsData.cnameRecords && dnsData.cnameRecords.length > 0 ? (
            <ul className="space-y-2">
              {dnsData.cnameRecords.map((record, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <span>{record}</span>
                  <button 
                    onClick={() => copyToClipboard(record)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedText === record ? 'Copied!' : <FaCopy />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No CNAME records found</p>
          )}
        </div>
      </div>
      
      {/* WHOIS Information */}
      {dnsData.whois && (
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">WHOIS Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Registration Details</h4>
              <table className="min-w-full">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-500">Registrar</td>
                    <td className="px-4 py-2 text-sm">{dnsData.whois.registrar || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-500">Creation Date</td>
                    <td className="px-4 py-2 text-sm">{formatDate(dnsData.whois.creationDate) || 'N/A'}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-500">Expiration Date</td>
                    <td className="px-4 py-2 text-sm">
                      {formatDate(dnsData.whois.expirationDate) || 'N/A'}
                      {remainingDays && (
                        <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                          remainingDays < 30 ? 'bg-red-100 text-red-800' : 
                          remainingDays < 90 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {remainingDays} days left
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-500">Status</td>
                    <td className="px-4 py-2 text-sm">
                      {dnsData.whois.status && Array.isArray(dnsData.whois.status) && dnsData.whois.status.length > 0 
                        ? dnsData.whois.status.join(', ') 
                        : typeof dnsData.whois.status === 'string'
                          ? dnsData.whois.status
                          : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Registrant Information</h4>
              {dnsData.whois.registrant ? (
                <table className="min-w-full">
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">Organization</td>
                      <td className="px-4 py-2 text-sm">{dnsData.whois.registrant.organization || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">Name</td>
                      <td className="px-4 py-2 text-sm">{dnsData.whois.registrant.name || 'N/A'}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">Email</td>
                      <td className="px-4 py-2 text-sm">{dnsData.whois.registrant.email || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">Country</td>
                      <td className="px-4 py-2 text-sm">{dnsData.whois.registrant.country || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">No registrant information available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DnsResults; 