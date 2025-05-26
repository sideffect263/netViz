import React from 'react';
import { Link } from 'react-router-dom';
import { FaTerminal, FaHistory, FaChevronUp, FaSearch, FaQuestion } from 'react-icons/fa';
import ChatMessage from './ChatMessage';
import ScanResultVisualizer from './ScanResultVisualizer';
import CommandAutocomplete from './CommandAutocomplete';
import HelpTool from './HelpTool';

const AgentChatPane = ({
  messages,
  isProcessing,
  finalResult,
  commandHistory,
  showHistory,
  setShowHistory,
  command,
  setCommand,
  handleSubmit,
  selectHistoryCommand,
  showHelpTool,
  setShowHelpTool,
  handleHelpOptionSelect,
  toggleHelpTool,
  darkMode,
  chatBoxRef
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors`}>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaTerminal className="mr-3 text-xl" />
          <h2 className="text-xl font-semibold">Agent Chat</h2>
        </div>
        {messages.length > 0 && (
          <div className="text-xs bg-indigo-700 rounded-full px-3 py-1">
            {messages.length} messages
          </div>
        )}
      </div>
      
      <div 
        ref={chatBoxRef}
        className={`h-96 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
      >
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} darkMode={darkMode} />
        ))}

        {isProcessing && (
          <ChatMessage 
            message={{ role: 'assistant', content: 'Processing...' }} 
            darkMode={darkMode}
            isProcessing={true}
          />
        )}
      </div>
      
      {finalResult && !isProcessing && (
        <ScanResultVisualizer result={finalResult} darkMode={darkMode} />
      )}
      
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 transition-colors`}>
        {/* Command History Dropdown */}
        {commandHistory.length > 0 && (
          <div className="mb-3 relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`text-xs flex items-center ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors mb-2 font-medium`}
            >
              <FaHistory className="mr-2" />
              <span>Recent Commands</span>
              <FaChevronUp className={`ml-2 transform transition-transform ${showHistory ? '' : 'rotate-180'}`} />
            </button>
            
            {showHistory && (
              <div className={`absolute z-10 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg py-1 max-h-40 overflow-y-auto transition-colors`}>
                {commandHistory.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => selectHistoryCommand(cmd)}
                    className={`block w-full text-left px-3 py-1 text-sm ${darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-indigo-50 text-gray-800'
                    } truncate transition-colors`}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Help Tool */}
        {showHelpTool && (
          <HelpTool onSelect={handleHelpOptionSelect} />
        )}
        
        <form onSubmit={handleSubmit} className="flex">
          <CommandAutocomplete 
            command={command}
            setCommand={setCommand}
            disabled={isProcessing}
            darkMode={darkMode}
          />
        </form>
        
        <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between transition-colors`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaSearch className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`} />
              <p>Try: "scan example.com" or "vulnerability check on 192.168.1.1"</p>
            </div>
            <div className="hidden sm:flex items-center text-xs">
              <kbd className={`px-2 py-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded`}>Ctrl</kbd>
              <span className="mx-1">+</span>
              <kbd className={`px-2 py-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded`}>Enter</kbd>
              <span className="ml-2">to send</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleHelpTool}
              className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-xs underline transition-colors flex items-center font-medium`}
            >
              <FaQuestion className="mr-1" size={10} />
              Quick Help
            </button>
            <span className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
            <Link
              to="/documentation"
              className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-xs underline transition-colors font-medium`}
            >
              Full Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChatPane; 