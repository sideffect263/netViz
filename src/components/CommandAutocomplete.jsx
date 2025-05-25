import React, { useState, useEffect, useRef } from 'react';

const CommandAutocomplete = ({ command, setCommand, disabled, darkMode }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  // Common commands and their templates
  const commonCommands = [
    { text: 'scan ', description: 'Basic scan' },
    { text: 'scan for open ports on ', description: 'Port scan' },
    { text: 'run a quick scan on ', description: 'Fast scan with default options' },
    { text: 'scan for services on ', description: 'Service detection' },
    { text: 'scan for vulnerabilities on ', description: 'Vulnerability scan' },
    { text: 'run a comprehensive scan on ', description: 'Full detailed scan' },
    { text: 'check if port 80 is open on ', description: 'Check specific port' },
    { text: 'scan network range ', description: 'Scan IP range' },
    { text: 'what can you do', description: 'Get capabilities' },
    { text: 'help', description: 'Show help' }
  ];

  // Common targets to suggest
  const commonTargets = [
    'localhost',
    'example.com',
    '192.168.1.1',
    '10.0.0.1',
    '127.0.0.1',
    'google.com'
  ];

  // Update suggestions based on current command
  useEffect(() => {
    if (!command || disabled) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let filteredSuggestions = [];

    // If the command contains a domain/IP already, don't suggest commands
    if (command.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b|\b[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b/)) {
      setShowSuggestions(false);
      return;
    }

    // If command ends with a space, suggest targets
    if (command.endsWith(' ')) {
      const needsTarget = commonCommands.some(
        (cmd) => command.startsWith(cmd.text) && command.length === cmd.text.length
      );

      if (needsTarget) {
        filteredSuggestions = commonTargets.map((target) => ({
          text: command + target,
          description: `Target: ${target}`
        }));
      }
    } else {
      // Suggest commands that match the current input
      filteredSuggestions = commonCommands.filter((cmd) =>
        cmd.text.toLowerCase().startsWith(command.toLowerCase())
      );
    }

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [command, disabled]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion.text);
    setShowSuggestions(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard navigation of suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const suggestionElements = document.querySelectorAll('.suggestion-item');
      if (suggestionElements.length > 0) {
        suggestionElements[0].focus();
      }
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }

    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setCommand(suggestions[0].text);
    }
  };

  // Handle suggestion item keyboard navigation
  const handleSuggestionKeyDown = (e, index, suggestion) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const suggestionElements = document.querySelectorAll('.suggestion-item');
      const currentIndex = index;
      const nextIndex =
        e.key === 'ArrowDown'
          ? (currentIndex + 1) % suggestionElements.length
          : (currentIndex - 1 + suggestionElements.length) % suggestionElements.length;

      if (suggestionElements[nextIndex]) {
        suggestionElements[nextIndex].focus();
      }
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <input
          id="command-input"
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={(e) => {
            if (!e.relatedTarget?.classList.contains('suggestion-item')) {
              setTimeout(() => setShowSuggestions(false), 150);
            }
          }}
          disabled={disabled}
          className={`flex-grow px-4 py-2 border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          placeholder="Enter a command..."
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !command.trim()}
          className={`bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
        >
          Send
        </button>
      </div>

      {showSuggestions && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`suggestion-item w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition-colors flex items-center justify-between ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, index, suggestion)}
              tabIndex={0}
            >
              <span className={`text-${darkMode ? 'gray-200' : 'gray-800'} font-medium`}>{suggestion.text}</span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandAutocomplete; 