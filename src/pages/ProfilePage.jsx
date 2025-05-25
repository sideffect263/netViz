import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, getCurrentUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    // If we already have user details or have attempted a fetch, don't fetch again
    if (userDetails || fetchAttempted || !user) return;

    const fetchUserDetails = async () => {
      setLoading(true);
      setFetchAttempted(true);
      try {
        // Use the user data we already have if available
        if (user && user.user) {
          setUserDetails(user.user);
        } else {
          const result = await getCurrentUser();
          if (result && result.data) {
            setUserDetails(result.data);
          }
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load user details'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user, fetchAttempted]); // Remove getCurrentUser from dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const userData = userDetails || (user && user.user);

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="text-sm text-red-700">
              Unable to load profile information
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        {message.text && (
          <div className={`${message.type === 'error' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'} border-l-4 p-4 mb-6`}>
            <div className="flex items-center">
              {message.type === 'error' ? (
                <FaExclamationTriangle className="text-red-500 mr-2" />
              ) : (
                <FaCheckCircle className="text-green-500 mr-2" />
              )}
              <p className={`text-sm ${message.type === 'error' ? 'text-red-700' : 'text-green-700'}`}>
                {message.text}
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 mr-4">
                <FaUser className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
                <p className="text-indigo-200">
                  {isAdmin ? 'Administrator' : 'Regular User'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-base text-gray-900">{userData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="text-base text-gray-900">{userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaShieldAlt className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                  <p className="text-base text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userData.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userData.role === 'admin' ? 'Administrator' : 'Regular User'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Password
                </button>
                <button
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 