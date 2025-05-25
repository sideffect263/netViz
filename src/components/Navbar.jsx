import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaNetworkWired, FaBars, FaTimes, FaRobot, FaInfoCircle, FaBrain, FaBook, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600 whitespace-nowrap' ;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaNetworkWired className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">NetScan360</span>
            </Link>
            <div className="hidden xl:ml-6 xl:flex xl:space-x-8">
              <Link
                to="/"
                className={`${isActive('/')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                to="/scan"
                className={`${isActive('/scan')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/scan' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                Scan
              </Link>
          
              <Link
                to="/ai-agent"
                className={`${isActive('/ai-agent')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/ai-agent' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                <FaBrain className="h-4 w-4 mr-1" />
                AI Agent
              </Link>
              <Link
                to="/documentation"
                className={`${isActive('/documentation')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/documentation' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                <FaBook className="h-4 w-4 mr-1" />
                Documentation
              </Link>
              <Link
                to="/auto-hacker-info"
                className={`${isActive('/auto-hacker-info')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/auto-hacker-info' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                <FaInfoCircle className="h-4 w-4 mr-1" />
                Hacker Info
              </Link>
              <Link
                to="/about"
                className={`${isActive('/about')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/about' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                About
              </Link>
            </div>
          </div>
          
          <div className="hidden xl:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`${isActive('/profile')} inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <FaUser className="h-4 w-4 mr-1" />
                  {user?.user?.name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`${isActive('/login')} inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <FaSignInAlt className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${isActive('/register')} inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <FaUserPlus className="h-4 w-4 mr-1" />
                  Register
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} xl:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`${
              location.pathname === '/' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/scan"
            className={`${
              location.pathname === '/scan' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Scan
          </Link>
        
          <Link
            to="/ai-agent"
            className={`${
              location.pathname === '/ai-agent' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaBrain className="h-5 w-5 mr-2" />
            AI Agent
          </Link>
          <Link
            to="/documentation"
            className={`${
              location.pathname === '/documentation' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaBook className="h-5 w-5 mr-2" />
            Documentation
          </Link>
          <Link
            to="/auto-hacker-info"
            className={`${
              location.pathname === '/auto-hacker-info' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaInfoCircle className="h-5 w-5 mr-2" />
            Hacker Info
          </Link>
          <Link
            to="/about"
            className={`${
              location.pathname === '/about' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {/* Authentication Links for Mobile */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`${
                  location.pathname === '/profile' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser className="h-5 w-5 mr-2" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 flex items-center w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                <FaSignOutAlt className="h-5 w-5 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${
                  location.pathname === '/login' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt className="h-5 w-5 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className={`${
                  location.pathname === '/register' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserPlus className="h-5 w-5 mr-2" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;