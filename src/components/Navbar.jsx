import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaNetworkWired, FaBars, FaTimes, FaRobot, FaInfoCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600';
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
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
                to="/auto-hacker"
                className={`${isActive('/auto-hacker')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/auto-hacker' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                <FaRobot className="h-4 w-4 mr-1" />
                Auto Hacker
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
          <div className="flex items-center sm:hidden">
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
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
            to="/auto-hacker"
            className={`${
              location.pathname === '/auto-hacker' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaRobot className="h-5 w-5 mr-2" />
            Auto Hacker
          </Link>
          <Link
            to="/auto-hacker-info"
            className={`$${
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 