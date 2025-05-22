import axios from 'axios';

// Set base URL from environment variable or use default
const API_URL ='http://localhost:5000/api';

// Configure axios instance
const api = axios.create({
  baseURL: `${API_URL}/auto-hacker`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Start a new autonomous scan
 * @param {Object} scanParams - Scan parameters
 * @param {string} scanParams.target - Target domain or IP
 * @param {string} scanParams.scanDepth - Scan depth (basic, medium, deep)
 * @param {string} scanParams.aiMode - AI mode (defensive, offensive, comprehensive)
 * @returns {Promise} - Promise with scan ID and initial status
 */
export const startScan = async (scanParams) => {
  try {
    const response = await api.post('/scan', scanParams);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get scan status by ID
 * @param {string} scanId - Scan ID
 * @returns {Promise} - Promise with scan status
 */
export const getScanStatus = async (scanId) => {
  try {
    const response = await api.get(`/status/${scanId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get scan results by ID
 * @param {string} scanId - Scan ID
 * @returns {Promise} - Promise with scan results
 */
export const getScanResults = async (scanId) => {
  try {
    const response = await api.get(`/results/${scanId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get scan history
 * @returns {Promise} - Promise with scan history
 */
export const getScanHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Cancel a running scan
 * @param {string} scanId - Scan ID
 * @returns {Promise} - Promise with cancel status
 */
export const cancelScan = async (scanId) => {
  try {
    const response = await api.post(`/cancel/${scanId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Handle API errors with better error messages
 */
function handleApiError(error) {
  let errorMessage = 'An unknown error occurred';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorMessage = error.response.data.error || `Server error: ${error.response.status}`;
    console.error('API Error Response:', error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response received from server. Check your network connection.';
    console.error('API No Response:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
    console.error('API Request Error:', error.message);
  }
  
  // You could also dispatch to a global error state here
  return errorMessage;
}

export default {
  startScan,
  getScanStatus,
  getScanResults,
  getScanHistory,
  cancelScan
}; 