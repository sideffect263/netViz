import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaNetworkWired, FaServer, FaGlobe, FaLock, FaCode, FaSpinner,
  FaExclamationTriangle, FaCheck, FaTimes, FaProjectDiagram
} from 'react-icons/fa';
import { 
  getDnsInfo, 
  getSslInfo, 
  getSecurityHeaders, 
  analyzeNetwork, 
  detectTechnologies 
} from '../api/dnsApi';
import DnsResults from '../components/DnsResults';

const ResultsPage = () => {
  const { domain } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    dns: null,
    network: null,
    security: null,
    technology: null,
  });
  const [activeTab, setActiveTab] = useState('dns');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Make parallel API requests for each type of data
        const [dnsResponse, sslResponse, headersResponse, techResponse] = await Promise.allSettled([
          getDnsInfo(domain),
          getSslInfo(domain),
          getSecurityHeaders(domain),
          detectTechnologies(domain)
        ]);

        // Prepare data object with API responses
        const newData = {
          dns: dnsResponse.status === 'fulfilled' ? dnsResponse.value : null,
          security: {
            ssl: sslResponse.status === 'fulfilled' ? sslResponse.value : null,
            headers: headersResponse.status === 'fulfilled' ? headersResponse.value : null
          }
        };

        // Network analysis requires a full URL
        try {
          const urlToAnalyze = `https://${domain}`;
          const networkResponse = await analyzeNetwork(urlToAnalyze);
          newData.network = networkResponse;
          
          // If tech detection failed, try to extract from network analysis
          if (techResponse.status === 'rejected' && networkResponse?.technologies) {
            newData.technology = {
              domain,
              technologies: networkResponse.technologies
            };
          } else if (techResponse.status === 'fulfilled') {
            newData.technology = techResponse.value;
          }
        } catch (networkError) {
          console.error('Network analysis error:', networkError);
          newData.network = null;
        }

        // Check if we have any data
        if (!newData.dns && !newData.security.ssl && !newData.network && !newData.technology) {
          throw new Error('Failed to retrieve data from all available endpoints');
        }

        setData(newData);
        setLoading(false);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err.message || 'Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [domain]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Scanning {domain}...</h2>
        <p className="mt-2 text-gray-500">This may take a few moments</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FaExclamationTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Error</h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <Link
          to="/scan"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isDemoMode && (
        <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Demo Mode: This application is showing simulated data. For some popular domains like google.com, 
                facebook.com, and github.com, you'll see domain-specific mock data. For other domains, generic
                example data is displayed.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Scan Results for {domain}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Comprehensive network topology and security analysis
              </p>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('dns')}
                  className={`${
                    activeTab === 'dns'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  disabled={!data.dns}
                >
                  <FaGlobe className="inline-block mr-2" />
                  DNS & IP
                </button>
                <button
                  onClick={() => setActiveTab('network')}
                  className={`${
                    activeTab === 'network'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  disabled={!data.network}
                >
                  <FaProjectDiagram className="inline-block mr-2" />
                  Network
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`${
                    activeTab === 'security'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  disabled={!data.security?.ssl && !data.security?.headers}
                >
                  <FaLock className="inline-block mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('technology')}
                  className={`${
                    activeTab === 'technology'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  disabled={!data.technology}
                >
                  <FaCode className="inline-block mr-2" />
                  Technology
                </button>
              </nav>
            </div>
            
            {/* Content based on active tab */}
            <div className="p-4">
              {activeTab === 'dns' && data.dns && (
                <DnsResults dnsData={data.dns} />
              )}
              
              {activeTab === 'network' && data.network && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Network Information</h4>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Resource Summary</h5>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Total Resources</p>
                        <p className="text-xl font-semibold text-indigo-600">
                          {data.network.stats?.totalResources || 0}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-gray-500">External Domains</p>
                        <p className="text-xl font-semibold text-indigo-600">
                          {data.network.stats?.externalDomainsCount || 0}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-gray-500">CDN</p>
                        <p className="text-xl font-semibold text-indigo-600">
                          {data.network.cdn?.name || 'None detected'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {data.network.stats?.externalDomains && data.network.stats.externalDomains.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">External Domains</h5>
                      <ul className="list-disc pl-5">
                        {data.network.stats.externalDomains.map((domain, index) => (
                          <li key={index} className="text-gray-600">{domain}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Resource Breakdown</h5>
                    <div className="mt-2 space-y-4">
                      {data.network.resources?.scripts && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Scripts ({data.network.resources.scripts.length})
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            {data.network.resources.scripts.map((script, index) => (
                              <li key={index} className="text-xs text-gray-600 truncate">
                                {typeof script === 'string' ? script : script.src}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {data.network.resources?.styles && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Stylesheets ({data.network.resources.styles.length})
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            {data.network.resources.styles.map((style, index) => (
                              <li key={index} className="text-xs text-gray-600 truncate">
                                {typeof style === 'string' ? style : style.href}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {data.network.resources?.images && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Images ({data.network.resources.images.length})
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            {data.network.resources.images.map((image, index) => (
                              <li key={index} className="text-xs text-gray-600 truncate">
                                {typeof image === 'string' ? image : image.src}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {data.network.resources?.iframes && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Iframes ({data.network.resources.iframes.length})
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            {data.network.resources.iframes.map((iframe, index) => (
                              <li key={index} className="text-xs text-gray-600 truncate">
                                {typeof iframe === 'string' ? iframe : iframe.src}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {data.network.resources?.fonts && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Fonts ({data.network.resources.fonts.length})
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            {data.network.resources.fonts.map((font, index) => (
                              <li key={index} className="text-xs text-gray-600 truncate">
                                {typeof font === 'string' ? font : font.href}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {data.network.connectionInfo && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Connection Information</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Protocol</p>
                          <p className="text-gray-600">{data.network.connectionInfo.protocol}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Response Time</p>
                          <p className="text-gray-600">{data.network.connectionInfo.responseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Content Type</p>
                          <p className="text-gray-600">{data.network.connectionInfo.contentType || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status Code</p>
                          <p className="text-gray-600">{data.network.connectionInfo.statusCode}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Server</p>
                          <p className="text-gray-600">{data.network.connectionInfo.server || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {data.network.resourceByDomain && Object.keys(data.network.resourceByDomain).length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">External Resources by Domain</h5>
                      <div className="space-y-3">
                        {Object.entries(data.network.resourceByDomain).map(([domain, resources]) => (
                          <div key={domain} className="bg-white p-3 rounded shadow-sm">
                            <p className="text-sm font-medium text-indigo-600 mb-1">{domain}</p>
                            <p className="text-xs text-gray-500 mb-2">Resources: {resources.length}</p>
                            <div className="flex flex-wrap gap-1">
                              {resources.map((resource, idx) => (
                                <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
                                  resource.type === 'script' ? 'bg-red-100 text-red-800' :
                                  resource.type === 'style' ? 'bg-blue-100 text-blue-800' :
                                  resource.type === 'image' ? 'bg-green-100 text-green-800' :
                                  resource.type === 'font' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {resource.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {data.network.performance && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Performance Metrics</h5>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Page Load Time</p>
                          <p className="text-xl font-semibold text-indigo-600">
                            {data.network.performance.mainPageLoadTime}ms
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Resource Size</p>
                          <p className="text-xl font-semibold text-indigo-600">
                            {Math.round(data.network.performance.totalResourceSize / 1024)} KB
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Performance Score</p>
                          <p className={`text-xl font-semibold ${
                            data.network.performance.score >= 80 ? 'text-green-600' :
                            data.network.performance.score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {data.network.performance.score}/100
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {data.network.recommendations && data.network.recommendations.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
                      <div className="space-y-3">
                        {data.network.recommendations.map((rec, index) => (
                          <div key={index} className={`p-3 rounded ${
                            rec.type === 'critical' ? 'bg-red-50 border-l-4 border-red-500' :
                            rec.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                            'bg-blue-50 border-l-4 border-blue-500'
                          }`}>
                            <h6 className="font-medium text-gray-800">{rec.title}</h6>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            {rec.items && rec.items.length > 0 && (
                              <ul className="mt-2 text-xs text-gray-600 space-y-1">
                                {rec.items.map((item, i) => (
                                  <li key={i} className="truncate">
                                    {item.url || item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Security Information</h4>
                  
                  {data.security?.ssl && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">SSL Certificate</h5>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Issuer</p>
                          <p className="text-gray-600">{data.security.ssl.issuer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Valid Until</p>
                          <p className="text-gray-600">
                            {data.security.ssl.validTo && new Date(data.security.ssl.validTo).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Days Remaining</p>
                          <p className={`${
                            data.security.ssl.daysRemaining > 30 ? 'text-green-600' : 'text-red-600'
                          } font-semibold`}>
                            {data.security.ssl.daysRemaining} days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Protocol</p>
                          <p className="text-gray-600">{data.security.ssl.protocol}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cipher</p>
                          <p className="text-gray-600">{data.security.ssl.cipher}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <p className={`${
                            data.security.ssl.isValid ? 'text-green-600' : 'text-red-600'
                          } font-semibold flex items-center`}>
                            {data.security.ssl.isValid ? (
                              <>
                                <FaCheck className="mr-1" /> Valid
                              </>
                            ) : (
                              <>
                                <FaTimes className="mr-1" /> Invalid
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {data.security?.headers && data.security.headers.score && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Security Headers</h5>
                      <div className="flex items-center mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              data.security.headers.score.score >= 8 ? 'bg-green-600' :
                              data.security.headers.score.score >= 5 ? 'bg-yellow-500' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${(data.security.headers.score.score / data.security.headers.score.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {data.security.headers.score.score}/{data.security.headers.score.total}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {data.security.headers.score.details && Object.entries(data.security.headers.score.details).map(([header, status]) => (
                          <div key={header} className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">{header}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!data.security?.ssl && !data.security?.headers && (
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-gray-500">No security information available</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'technology' && data.technology && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Technology Stack</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.technology.categories?.server && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaServer className="mr-2 text-indigo-500" /> Server
                        </h5>
                        {data.technology.categories.server.length > 0 ? (
                          <ul className="space-y-1">
                            {data.technology.categories.server.map((tech, index) => (
                              <li key={index} className="text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                {tech}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No server technologies detected</p>
                        )}
                      </div>
                    )}
                    
                    {data.technology.categories?.frontend && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaCode className="mr-2 text-indigo-500" /> Frontend
                        </h5>
                        {data.technology.categories.frontend.length > 0 ? (
                          <ul className="space-y-1">
                            {data.technology.categories.frontend.map((tech, index) => (
                              <li key={index} className="text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                {tech}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No frontend frameworks detected</p>
                        )}
                      </div>
                    )}
                    
                    {data.technology.categories?.cms && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaGlobe className="mr-2 text-indigo-500" /> CMS
                        </h5>
                        {data.technology.categories.cms.length > 0 ? (
                          <ul className="space-y-1">
                            {data.technology.categories.cms.map((tech, index) => (
                              <li key={index} className="text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                {tech}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No CMS detected</p>
                        )}
                      </div>
                    )}
                    
                    {/* Display other technology categories if available */}
                  </div>
                </div>
              )}

              {/* Show message if the selected tab has no data */}
              {((activeTab === 'dns' && !data.dns) ||
                (activeTab === 'network' && !data.network) ||
                (activeTab === 'security' && !data.security?.ssl && !data.security?.headers) ||
                (activeTab === 'technology' && !data.technology)) && (
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                  <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                  <p className="text-gray-500">
                    We couldn't retrieve the {activeTab} information for this domain.
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Link
                to="/scan"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Scan Another Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 