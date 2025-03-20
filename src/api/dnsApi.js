import axios from 'axios';

// Define the API base URL - Using proxy from vite.config.js
const API_BASE_URL = '/api';

export const scanDomain = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/scan/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error scanning domain:', error);
    throw error;
  }
};

export const getDnsInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dns/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DNS info:', error);
    throw error;
  }
};

export const getReverseDns = async (ip) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dns/ptr/${ip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reverse DNS info:', error);
    throw error;
  }
};

export const getSslInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/ssl/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SSL info:', error);
    throw error;
  }
};

export const getSecurityHeaders = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/headers/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching security headers:', error);
    throw error;
  }
};

export const analyzeNetwork = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/network/analyze`, { url });
    return response.data;
  } catch (error) {
    console.error('Error analyzing network:', error);
    throw error;
  }
};

export const detectTechnologies = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tech/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error detecting technologies:', error);
    throw error;
  }
};

export const getWhoisInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/whois/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching WHOIS info:', error);
    throw error;
  }
};

export const getSecurityInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching security info:', error);
    throw error;
  }
};

export const getNetworkInfo = async (domain) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/network/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching network info:', error);
    throw error;
  }
}; 