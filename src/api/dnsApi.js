import axios from 'axios';

// Define the API base URL - Using direct URL instead of proxy
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to extract cache status from response
const extractCacheInfo = (response) => {
  const cacheStatus = response.headers['x-cache'] || 'MISS';
  const data = response.data;
  
  // Add cache information to the response data
  return {
    ...data,
    _cache: {
      status: cacheStatus,
      fromCache: cacheStatus === 'HIT',
      timestamp: data.timestamp || new Date().toISOString()
    }
  };
};

export const scanDomain = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/scan/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error scanning domain:', error);
    throw error;
  }
};

export const getDnsInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dns/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching DNS info:', error);
    if (error.response && error.response.status === 429) {
      throw {
        message: 'Rate limit exceeded. Please wait a few minutes before trying again.',
        status: 429,
        isRateLimit: true,
        ...error
      };
    }
    throw error;
  }
};

export const getReverseDns = async (ip) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dns/ptr/${ip}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching reverse DNS info:', error);
    throw error;
  }
};

export const getSslInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/ssl/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching SSL info:', error);
    throw error;
  }
};

export const getSecurityHeaders = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/headers/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching security headers:', error);
    throw error;
  }
};

export const analyzeNetwork = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/network/analyze`, { url });
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error analyzing network:', error);
    throw error;
  }
};

export const detectTechnologies = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tech/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error detecting technologies:', error);
    throw error;
  }
};

export const getWhoisInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/whois/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching WHOIS info:', error);
    throw error;
  }
};

export const getSecurityInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching security info:', error);
    throw error;
  }
};

export const getNetworkInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/network/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching network info:', error);
    throw error;
  }
};

// SHODAN API endpoints
export const getShodanHostInfo = async (ip) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shodan/host/${ip}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching Shodan host info:', error);
    throw error;
  }
};

export const getShodanDomainInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shodan/domain/${domain}`);
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error fetching Shodan domain info:', error);
    throw error;
  }
};

export const searchShodan = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shodan/search`, {
      params: { query }
    });
    return extractCacheInfo(response);
  } catch (error) {
    console.error('Error searching Shodan:', error);
    throw error;
  }
};

// New function to get cache statistics
export const getCacheStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dns/cache/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    throw error;
  }
};

// Function to clear cache
export const clearCache = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/dns/cache/clear`);
    return response.data;
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
}; 