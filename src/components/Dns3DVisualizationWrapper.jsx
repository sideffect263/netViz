import React, { Suspense, lazy, useState, useEffect } from 'react';
import { FaNetworkWired, FaCube } from 'react-icons/fa';

// Dynamically import the 3D visualization with error handling
const Dns3DLazy = lazy(() => 
  import('./Dns3DVisualization')
    .catch(() => {
      console.error('Failed to load 3D visualization component');
      return { default: () => <FallbackVisualization /> };
    })
);

// Fallback component in case 3D rendering fails
const FallbackVisualization = () => (
  <div className="bg-white p-5 rounded-lg shadow-md mt-4">
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <FaCube size={48} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">3D Visualization Unavailable</h3>
      <p className="text-gray-500">
        The 3D visualization could not be loaded. This might be due to browser compatibility issues or resource limitations.
      </p>
      <div className="mt-6">
        <a
          href="https://threejs.org/docs/#manual/en/introduction/WebGL-compatibility-check"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
);

// Loading indicator
const LoadingVisualization = () => (
  <div className="bg-white p-5 rounded-lg shadow-md mt-4">
    <div className="flex justify-center items-center" style={{ height: '500px' }}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  </div>
);

const Dns3DVisualizationWrapper = ({ dnsData }) => {
  const [hasError, setHasError] = useState(false);

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setHasError(true);
        console.warn('WebGL is not supported in this browser');
      }
    } catch (e) {
      setHasError(true);
      console.error('Error checking WebGL support:', e);
    }
  }, []);

  if (hasError) {
    return <FallbackVisualization />;
  }

  return (
    <Suspense fallback={<LoadingVisualization />}>
      <Dns3DLazy dnsData={dnsData} />
    </Suspense>
  );
};

export default Dns3DVisualizationWrapper; 