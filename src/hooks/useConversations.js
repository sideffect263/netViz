import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth();
  
  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/conversations');
      setConversations(response.data.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.response?.data?.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  // Load a specific conversation
  const loadConversation = useCallback(async (id) => {
    if (!isAuthenticated) {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/conversations/${id}`);
      setSelectedConversation(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error(`Error loading conversation ${id}:`, err);
      setError(err.response?.data?.message || 'Failed to load conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  // Create a new conversation
  const createConversation = useCallback(async (message, sessionId) => {
    if (!isAuthenticated) {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/conversations', {
        message,
        sessionId
      });
      
      // Add the new conversation to the list
      setConversations(prev => [response.data.data, ...prev]);
      setSelectedConversation(response.data.data);
      
      return response.data.data;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.response?.data?.message || 'Failed to create conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  // Delete a conversation
  const deleteConversation = useCallback(async (id) => {
    if (!isAuthenticated) {
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`/api/conversations/${id}`);
      
      // Remove from the list
      setConversations(prev => prev.filter(conv => conv._id !== id));
      
      // Reset selected conversation if it was deleted
      if (selectedConversation && selectedConversation._id === id) {
        setSelectedConversation(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting conversation ${id}:`, err);
      setError(err.response?.data?.message || 'Failed to delete conversation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedConversation]);
  
  // Update conversation title
  const updateConversationTitle = useCallback(async (id, title) => {
    if (!isAuthenticated) {
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/api/conversations/${id}`, { title });
      
      // Update the conversation in the list
      setConversations(prev => 
        prev.map(conv => conv._id === id ? response.data.data : conv)
      );
      
      // Update selected conversation if it was the one updated
      if (selectedConversation && selectedConversation._id === id) {
        setSelectedConversation(response.data.data);
      }
      
      return true;
    } catch (err) {
      console.error(`Error updating conversation ${id}:`, err);
      setError(err.response?.data?.message || 'Failed to update conversation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedConversation]);
  
  // Fetch conversations on mount and authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      // Clear conversations when logged out
      setConversations([]);
      setSelectedConversation(null);
    }
  }, [isAuthenticated, fetchConversations]);
  
  return {
    conversations,
    selectedConversation,
    loading,
    error,
    fetchConversations,
    loadConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    setSelectedConversation
  };
};

export default useConversations; 