import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { FaServer, FaGlobe, FaEnvelope, FaNetworkWired, FaSearch, FaDownload, FaPlus, FaMinus } from 'react-icons/fa';
import { getShodanHostInfo } from '../api/dnsApi';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { forceLink, forceManyBody, forceCollide, forceCenter, forceRadial } from 'd3-force';

const Dns3DVisualization = ({ dnsData }) => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDistance, setViewDistance] = useState(300);

  useEffect(() => {
    if (!dnsData || !containerRef.current) return;

    // Clear container in case of re-render
    containerRef.current.innerHTML = '';

    // Generate graph data from DNS data
    const { nodes, links } = generateGraphDataFromDnsData(dnsData);

    // Initialize 3D force graph
    const graph = ForceGraph3D({ controlType: 'orbit' })
      .backgroundColor('#f8fafc')
      .width(containerRef.current.clientWidth)
      .height(500)
      .nodeLabel('label')
      .nodeColor(node => getNodeColor(node.type))
      .nodeVal(node => getNodeSize(node.type))
      .nodeThreeObject(node => {
        // Custom node appearance
        const group = new THREE.Group();
        
        // Node sphere
        const geometry = new THREE.SphereGeometry(getNodeSize(node.type) / 2, 16, 16);
        const material = new THREE.MeshLambertMaterial({ 
          color: getNodeColor(node.type),
          transparent: true,
          opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
        
        // Add text label for important nodes
        if (['domain', 'dns', 'ns', 'mx', 'A'].includes(node.type)) {
          const sprite = new SpriteText(node.label);
          sprite.color = '#333333';
          sprite.textHeight = 5;
          sprite.position.y = getNodeSize(node.type) / 2 + 2;
          group.add(sprite);
        }
        
        return group;
      })
      .linkWidth(1)
      .linkColor(() => '#94a3b8')
      .linkDirectionalArrowLength(3.5)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(link => link.source.type === 'domain' ? 1.5 : 0.5)
      .onNodeClick(handleNodeClick)
      .d3Force('charge', forceManyBody().strength(-120))
      .d3Force('collision', forceCollide(node => getNodeSize(node.type) * 1.2))
      .d3Force('link', forceLink().distance(link => getLinkDistance(link)))
      // Add some reasonable global forces
      .d3Force('center', forceCenter())
      .d3Force('radial', forceRadial(100).strength(0.05))
      .graphData({ nodes, links });

    // Set initial camera position
    graph.cameraPosition({ z: viewDistance });

    // Set graph to container
    graph(containerRef.current);
    
    // Keep a reference to the graph
    graphRef.current = graph;

    // Handle window resize
    const handleResize = () => {
      if (graphRef.current) {
        graphRef.current.width(containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dnsData]);

  // Update camera distance when viewDistance changes
  useEffect(() => {
    if (graphRef.current) {
      const { x, y } = graphRef.current.cameraPosition();
      graphRef.current.cameraPosition({ x, y, z: viewDistance });
    }
  }, [viewDistance]);
  
  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    
    // If IP node, fetch Shodan data
    if (node.type === 'ip') {
      setLoading(true);
      getShodanHostInfo(node.id)
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
    
    // Center view on the selected node
    if (graphRef.current) {
      const distance = viewDistance * 0.8; // Slightly closer than the current view
      graphRef.current.cameraPosition(
        { x: node.x, y: node.y, z: node.z + distance },
        node,
        1000 // transition duration in ms
      );
    }
  };
  
  // Search for a node by label
  const handleSearch = () => {
    if (!graphRef.current || !searchQuery.trim()) return;
    
    const graphData = graphRef.current.graphData();
    const foundNode = graphData.nodes.find(node => 
      node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (foundNode) {
      handleNodeClick(foundNode);
    }
  };
  
  // Export the graph as an image
  const exportAsImage = () => {
    if (!graphRef.current) return;
    
    // Using the snapshot method to get a PNG
    const imageUrl = graphRef.current.renderer().domElement.toDataURL("image/png");
    
    // Create and click an invisible download link
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `dns-3d-hierarchy-${dnsData.domain}.png`;
    downloadLink.click();
  };
  
  // Get node color based on type
  const getNodeColor = (type) => {
    const colors = {
      'domain': '#4f46e5', // indigo
      'dns': '#333333', // dark gray
      'ns': '#8b5cf6', // purple
      'mx': '#2563eb', // blue
      'A': '#10b981', // green
      'ip': '#f59e0b', // amber
      'net': '#ef4444'  // red
    };
    return colors[type] || '#9ca3af';
  };
  
  // Get node size based on type
  const getNodeSize = (type) => {
    const sizes = {
      'domain': 12,
      'dns': 10,
      'ns': 10,
      'mx': 10,
      'A': 8,
      'ip': 6,
      'net': 5
    };
    return sizes[type] || 5;
  };
  
  // Get link distance based on source and target node types
  const getLinkDistance = (link) => {
    // Base distance
    let distance = 50;
    
    // Adjust based on node types
    if (link.source.type === 'domain' && (link.target.type === 'dns' || link.target.type === 'ns' || link.target.type === 'mx')) {
      distance = 70;
    } else if ((link.source.type === 'dns' || link.source.type === 'ns' || link.source.type === 'mx') && link.target.type === 'A') {
      distance = 60;
    } else if (link.source.type === 'A' && link.target.type === 'ip') {
      distance = 50;
    } else if (link.source.type === 'ip' && link.target.type === 'net') {
      distance = 40;
    }
    
    return distance;
  };

  // Convert DNS data to graph format
  const generateGraphDataFromDnsData = (dnsData) => {
    const nodes = [];
    const links = [];
    const domain = dnsData.domain;
    
    // Add domain node
    nodes.push({
      id: domain,
      label: domain,
      type: 'domain'
    });

    // Add DNS node
    nodes.push({
      id: 'dns',
      label: 'DNS',
      type: 'dns'
    });

    // Connect domain to DNS
    links.push({
      source: domain,
      target: 'dns',
      id: `${domain}-dns`
    });

    // Add NS node if there are NS records
    if (dnsData.nsRecords && dnsData.nsRecords.length > 0) {
      nodes.push({
        id: 'ns',
        label: 'NS',
        type: 'ns'
      });

      // Connect domain to NS
      links.push({
        source: domain,
        target: 'ns',
        id: `${domain}-ns`
      });

      // Add NS records
      dnsData.nsRecords.forEach((ns, index) => {
        const nsId = `ns-${index}`;
        
        nodes.push({
          id: nsId,
          label: ns,
          type: 'A'
        });

        // Connect NS to NS record
        links.push({
          source: 'ns',
          target: nsId,
          id: `ns-${nsId}`
        });
      });
    }

    // Add MX node if there are MX records
    if (dnsData.mxRecords && dnsData.mxRecords.length > 0) {
      nodes.push({
        id: 'mx',
        label: 'MX',
        type: 'mx'
      });

      // Connect domain to MX
      links.push({
        source: domain,
        target: 'mx',
        id: `${domain}-mx`
      });

      // Add MX records
      dnsData.mxRecords.forEach((mx, index) => {
        const mxId = `mx-${index}`;
        
        nodes.push({
          id: mxId,
          label: mx.exchange,
          type: 'A',
          priority: mx.priority
        });

        // Connect MX to MX record
        links.push({
          source: 'mx',
          target: mxId,
          id: `mx-${mxId}`
        });
      });
    }

    // Add A record nodes and IP addresses
    if (dnsData.ipAddresses && dnsData.ipAddresses.length > 0) {
      // Add A record node
      nodes.push({
        id: 'a-record',
        label: 'A',
        type: 'A'
      });

      // Connect DNS to A record
      links.push({
        source: 'dns',
        target: 'a-record',
        id: 'dns-a'
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
        nodes.push({
          id: ip,
          label: ip,
          type: 'ip'
        });

        // Connect A record to IP
        links.push({
          source: 'a-record',
          target: ip,
          id: `a-${ip}`
        });

        // Add network node if not already added
        if (!processedNetworks.has(network)) {
          processedNetworks.add(network);
          
          nodes.push({
            id: network,
            label: `net: ${network}`,
            type: 'net',
            class: networkClass
          });
        }

        // Connect IP to network
        links.push({
          source: ip,
          target: network,
          id: `${ip}-${network}`
        });
      });
    }

    return { nodes, links };
  };

  return (
    <div className="mt-4">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">3D DNS Hierarchy</h3>
          
          <div className="flex space-x-2">
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Search nodes..."
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="px-2 py-1.5 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                onClick={handleSearch}
              >
                <FaSearch />
              </button>
            </div>
            
            <button 
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              onClick={exportAsImage}
            >
              <FaDownload className="inline-block mr-1" /> Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden relative">
            <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
            
            {/* Camera controls */}
            <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
              <button 
                className="w-8 h-8 bg-white rounded-full shadow hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setViewDistance(prev => Math.max(100, prev - 50))}
                title="Zoom In"
              >
                <FaPlus />
              </button>
              <button 
                className="w-8 h-8 bg-white rounded-full shadow hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setViewDistance(prev => prev + 50)}
                title="Zoom Out"
              >
                <FaMinus />
              </button>
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded text-xs text-gray-600">
              <p>Drag to rotate • Scroll to zoom • Drag nodes to reposition</p>
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
                  <p className="text-blue-700 font-medium">3D Navigation:</p>
                  <ul className="list-disc pl-4 text-blue-700 mt-1 space-y-1">
                    <li>Left-click + drag to rotate</li>
                    <li>Scroll to zoom in/out</li>
                    <li>Right-click + drag to pan</li>
                    <li>Click on nodes to focus and see details</li>
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

export default Dns3DVisualization; 