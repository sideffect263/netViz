import React, { useState } from 'react';
import { FaServer, FaExclamationTriangle, FaInfoCircle, FaCopy } from 'react-icons/fa';

const DnsResults = ({ dnsData }) => {
  const [copiedText, setCopiedText] = useState('');
  
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
  
  const remainingDays = dnsData.whois?.expirationDate ? 
    calculateRemainingDays(dnsData.whois.expirationDate) : null;
  
  return (
    <div className="space-y-6">
      {/* IP Addresses with geolocation */}
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
                    <button 
                      onClick={() => copyToClipboard(ip)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {copiedText === ip ? 'Copied!' : <FaCopy />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                      {dnsData.whois.status && dnsData.whois.status.length > 0 
                        ? dnsData.whois.status.join(', ') 
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
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">Country</td>
                      <td className="px-4 py-2 text-sm">{dnsData.whois.registrant.country || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">Registrant information not available</p>
              )}
              
              {remainingDays && remainingDays < 30 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Domain Expiring Soon</p>
                      <p className="text-xs text-red-700 mt-1">
                        This domain is set to expire in {remainingDays} days. Consider renewing it soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DnsResults; 