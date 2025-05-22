import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { FaServer, FaGlobe, FaEnvelope, FaNetworkWired, FaSearch, FaDownload, FaPlus, FaMinus, FaExpand } from 'react-icons/fa';
import { getShodanHostInfo } from '../api/dnsApi';

const DnsHierarchy = ({ dnsData }) => {
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutType, setLayoutType] = useState('hierarchical');

  useEffect(() => {
    if (!dnsData || !containerRef.current) return;

    // Create the graph elements
    const elements = generateElementsFromDnsData(dnsData);

    // Initialize cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6366f1',
            'label': 'data(label)',
            'color': '#333',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'font-size': '12px',
            'text-wrap': 'wrap',
            'text-max-width': '80px'
          }
        },
        {
          selector: 'node[type="domain"]',
          style: {
            'background-color': '#4f46e5',
            'shape': 'roundrectangle',
            'width': '120px',
            'height': '40px',
            'font-weight': 'bold',
            'text-valign': 'center'
          }
        },
        {
          selector: 'node[type="dns"]',
          style: {
            'background-color': '#333',
            'shape': 'ellipse',
            'width': '60px',
            'height': '60px'
          }
        },
        {
          selector: 'node[type="ns"]',
          style: {
            'background-color': '#8b5cf6',
            'shape': 'ellipse',
            'width': '60px',
            'height': '60px'
          }
        },
        {
          selector: 'node[type="mx"]',
          style: {
            'background-color': '#2563eb',
            'shape': 'ellipse',
            'width': '60px',
            'height': '60px'
          }
        },
        {
          selector: 'node[type="A"]',
          style: {
            'background-color': '#10b981',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type="ip"]',
          style: {
            'background-color': '#f59e0b',
            'shape': 'roundrectangle',
            'width': '150px',
            'height': '40px'
          }
        },
        {
          selector: 'node[type="net"]',
          style: {
            'background-color': '#ef4444',
            'shape': 'roundrectangle',
            'width': '140px',
            'height': '35px',
            'font-size': '10px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#cbd5e1',
            'target-arrow-color': '#cbd5e1',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        },
        // Highlighted styles
        {
          selector: 'node.highlighted',
          style: {
            'border-width': '3px',
            'border-color': '#facc15',
            'border-style': 'solid'
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'width': 3,
            'line-color': '#facc15',
            'target-arrow-color': '#facc15'
          }
        }
      ],
      layout: getLayoutConfig(layoutType)
    });

    // Add event listeners
    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      const type = node.data('type');
      const id = node.data('id');
      
      setSelectedNode(node.data());

      // For IP nodes, fetch Shodan data
      if (type === 'ip') {
        setLoading(true);
        getShodanHostInfo(id)
          .then(data => {
            setNodeInfo({
              type: 'shodan',
              data: data.info
            });
            setLoading(false);
          })
          .catch(err => {
            console.error('Error fetching Shodan data:', err);
            setNodeInfo({
              type: 'error',
              message: 'Failed to fetch Shodan information'
            });
            setLoading(false);
          });
      } else {
        setNodeInfo(null);
      }
      
      // Highlight connected nodes
      highlightConnections(node);
    });
    
    cy.on('tap', function(evt) {
      if (evt.target === cy) {
        // Clicked on the background
        setSelectedNode(null);
        setNodeInfo(null);
        
        // Remove highlighting
        cy.elements().removeClass('highlighted');
      }
    });

    // Save the cytoscape instance
    cyRef.current = cy;

    // Clean up
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [dnsData, layoutType]);
  
  // Get layout configuration based on type
  const getLayoutConfig = (type) => {
    switch(type) {
      case 'hierarchical':
        return {
          name: 'breadthfirst',
          directed: true,
          padding: 30,
          spacingFactor: 1.5,
          animate: true
        };
      case 'concentric':
        return {
          name: 'concentric',
          padding: 50,
          animate: true,
          concentric: function(node) {
            if (node.data('type') === 'domain') return 5;
            if (node.data('type') === 'dns' || node.data('type') === 'ns' || node.data('type') === 'mx') return 4;
            if (node.data('type') === 'A') return 3;
            if (node.data('type') === 'ip') return 2;
            return 1;
          },
          levelWidth: function() { return 1; }
        };
      case 'circle':
        return {
          name: 'circle',
          padding: 50,
          animate: true
        };
      default:
        return {
          name: 'breadthfirst',
          directed: true,
          padding: 30,
          spacingFactor: 1.5,
          animate: true
        };
    }
  };
  
  // Highlight connections for a node
  const highlightConnections = (node) => {
    if (!cyRef.current) return;
    
    // Clear previous highlights
    cyRef.current.elements().removeClass('highlighted');
    
    // Highlight the selected node and its connections
    node.addClass('highlighted');
    node.connectedEdges().addClass('highlighted');
    node.neighborhood('node').addClass('highlighted');
  };
  
  // Search for nodes
  const handleSearch = () => {
    if (!cyRef.current || !searchQuery) return;
    
    // Remove previous highlights
    cyRef.current.elements().removeClass('highlighted');
    
    // Find matching nodes
    const matches = cyRef.current.nodes().filter(node => 
      node.data('label').toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (matches.length > 0) {
      matches.addClass('highlighted');
      cyRef.current.fit(matches, 100);
    }
  };
  
  // Export graph as PNG
  const exportGraph = () => {
    if (!cyRef.current) return;
    
    const png = cyRef.current.png({
      output: 'blob',
      scale: 2,
      bg: '#f9fafb'
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(png);
    link.download = `dns-hierarchy-${dnsData.domain}.png`;
    link.click();
  };

  // Function to generate cytoscape elements from DNS data
  const generateElementsFromDnsData = (dnsData) => {
    const elements = [];
    const domain = dnsData.domain;
    
    // Add domain node
    elements.push({
      data: {
        id: domain,
        label: domain,
        type: 'domain'
      }
    });

    // Add DNS node
    elements.push({
      data: {
        id: 'dns',
        label: 'DNS',
        type: 'dns'
      }
    });

    // Connect domain to DNS
    elements.push({
      data: {
        id: `${domain}-dns`,
        source: domain,
        target: 'dns'
      }
    });

    // Add NS node if there are NS records
    if (dnsData.nsRecords && dnsData.nsRecords.length > 0) {
      elements.push({
        data: {
          id: 'ns',
          label: 'NS',
          type: 'ns'
        }
      });

      // Connect domain to NS
      elements.push({
        data: {
          id: `${domain}-ns`,
          source: domain,
          target: 'ns'
        }
      });

      // Add NS records
      dnsData.nsRecords.forEach((ns, index) => {
        const nsId = `ns-${index}`;
        
        elements.push({
          data: {
            id: nsId,
            label: ns,
            type: 'A'
          }
        });

        // Connect NS to NS record
        elements.push({
          data: {
            id: `ns-${nsId}`,
            source: 'ns',
            target: nsId
          }
        });
      });
    }

    // Add MX node if there are MX records
    if (dnsData.mxRecords && dnsData.mxRecords.length > 0) {
      elements.push({
        data: {
          id: 'mx',
          label: 'MX',
          type: 'mx'
        }
      });

      // Connect domain to MX
      elements.push({
        data: {
          id: `${domain}-mx`,
          source: domain,
          target: 'mx'
        }
      });

      // Add MX records
      dnsData.mxRecords.forEach((mx, index) => {
        const mxId = `mx-${index}`;
        
        elements.push({
          data: {
            id: mxId,
            label: mx.exchange,
            type: 'A',
            priority: mx.priority
          }
        });

        // Connect MX to MX record
        elements.push({
          data: {
            id: `mx-${mxId}`,
            source: 'mx',
            target: mxId
          }
        });
      });
    }

    // Add A record nodes and IP addresses
    if (dnsData.ipAddresses && dnsData.ipAddresses.length > 0) {
      // Add A record node
      elements.push({
        data: {
          id: 'a-record',
          label: 'A',
          type: 'A'
        }
      });

      // Connect DNS to A record
      elements.push({
        data: {
          id: 'dns-a',
          source: 'dns',
          target: 'a-record'
        }
      });

      // Process each IP address
      const processedNetworks = new Set(); // To track unique networks
      
      // Check if we have detailed IP data
      const ipDetails = dnsData.ipDetails || dnsData.ipAddresses.map(ip => ({ 
        ip, 
        network: ip.includes(':') ? `${ip}/128` : `${ip.split('.').slice(0, 2).join('.')}.0.0/16`,
        class: ip.includes(':') ? 'IPv6' : 'B'
      }));
      
      ipDetails.forEach((ipDetail) => {
        const ip = ipDetail.ip;
        const network = ipDetail.network;
        const networkClass = ipDetail.class;
        
        // Add IP node
        elements.push({
          data: {
            id: ip,
            label: ip,
            type: 'ip'
          }
        });

        // Connect A record to IP
        elements.push({
          data: {
            id: `a-${ip}`,
            source: 'a-record',
            target: ip
          }
        });

        // Add network node if not already added
        if (!processedNetworks.has(network)) {
          processedNetworks.add(network);
          
          elements.push({
            data: {
              id: network,
              label: `net: ${network}`,
              type: 'net',
              class: networkClass
            }
          });
        }

        // Connect IP to network
        elements.push({
          data: {
            id: `${ip}-${network}`,
            source: ip,
            target: network
          }
        });
      });
    }

    return elements;
  };

  return (
    <div className="mt-4">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">DNS Hierarchy Visualization</h3>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label htmlFor="layout-select" className="text-sm text-gray-600">Layout:</label>
              <select 
                id="layout-select"
                className="text-sm border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
              >
                <option value="hierarchical">Hierarchical</option>
                <option value="concentric">Circular</option>
                <option value="circle">Ring</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden relative">
            <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
            
            {/* Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="flex space-x-2">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    placeholder="Search nodes..."
                    className="px-3 py-1 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    className="px-2 py-1 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                    onClick={handleSearch}
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 1.2)}
                  title="Zoom In"
                >
                  <FaPlus className="text-gray-700" />
                </button>
                <button
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 0.8)}
                  title="Zoom Out"
                >
                  <FaMinus className="text-gray-700" />
                </button>
                <button
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => cyRef.current && cyRef.current.fit()}
                  title="Fit to View"
                >
                  <FaExpand className="text-gray-700" />
                </button>
                <button
                  className="flex items-center justify-center px-3 py-1 bg-white rounded shadow hover:bg-gray-100 text-sm"
                  onClick={exportGraph}
                  title="Export as PNG"
                >
                  <FaDownload className="mr-1" /> Export
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 mb-3">Node Information</h4>
            
            {selectedNode ? (
              <div>
                <div className="bg-white p-3 rounded shadow-sm mb-3">
                  <p className="text-sm font-semibold">{selectedNode.label}</p>
                  <p className="text-xs text-gray-500">Type: {selectedNode.type}</p>
                  {selectedNode.class && (
                    <p className="text-xs text-gray-500">Class: {selectedNode.class}</p>
                  )}
                  {selectedNode.priority && (
                    <p className="text-xs text-gray-500">Priority: {selectedNode.priority}</p>
                  )}
                </div>
                
                {loading && (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                
                {nodeInfo && nodeInfo.type === 'shodan' && (
                  <div className="bg-white p-3 rounded shadow-sm">
                    <h5 className="text-sm font-medium mb-2">Shodan Information</h5>
                    
                    {nodeInfo.data.os && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold">Operating System</p>
                        <p className="text-xs">{nodeInfo.data.os}</p>
                      </div>
                    )}
                    
                    {nodeInfo.data.country_name && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold">Location</p>
                        <p className="text-xs">{nodeInfo.data.city || 'Unknown'}, {nodeInfo.data.country_name}</p>
                      </div>
                    )}
                    
                    {nodeInfo.data.isp && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold">ISP</p>
                        <p className="text-xs">{nodeInfo.data.isp}</p>
                      </div>
                    )}
                    
                    {nodeInfo.data.ports && nodeInfo.data.ports.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold">Open Ports</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {nodeInfo.data.ports.slice(0, 10).map(port => (
                            <span key={port} className="bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded">
                              {port}
                            </span>
                          ))}
                          {nodeInfo.data.ports.length > 10 && (
                            <span className="text-xs text-gray-500">+{nodeInfo.data.ports.length - 10} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {nodeInfo && nodeInfo.type === 'error' && (
                  <div className="bg-red-50 p-3 rounded shadow-sm">
                    <p className="text-xs text-red-600">{nodeInfo.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500 text-center mb-3">Click on a node to see details</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#4f46e5] mr-2"></div>
                    <span>Domain</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#333333] mr-2"></div>
                    <span>DNS</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></div>
                    <span>NS</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#2563eb] mr-2"></div>
                    <span>MX</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
                    <span>A Record</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
                    <span>IP Address</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
                    <span>Network</span>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 p-3 rounded-md text-xs">
                  <p className="text-blue-700 font-medium">Tips:</p>
                  <ul className="list-disc pl-4 text-blue-700 mt-1 space-y-1">
                    <li>Use the layout dropdown to change visualization style</li>
                    <li>Search for specific nodes using the search box</li>
                    <li>Use zoom controls to navigate the visualization</li>
                    <li>Export visualization as PNG for documentation</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DnsHierarchy; 