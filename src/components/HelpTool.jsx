import React from 'react';

const HelpTool = ({ onSelect }) => {
  const helpOptions = [
    { text: 'What can you do?', description: 'Show general capabilities' },
    { text: 'What types of scans can you perform?', description: 'List available scan types' },
    { text: 'What OSINT capabilities do you have?', description: 'Show intelligence gathering tools' },
    { text: 'How do I check domain information?', description: 'WHOIS and DNS analysis examples' },
    { text: 'Can you find typosquatting domains?', description: 'Brand protection features' },
    { text: 'How do I use the scanning features?', description: 'Show command examples' }
  ];

  return (
    <div className="mt-4 mb-2">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Common questions:</div>
      <div className="flex flex-wrap gap-2">
        {helpOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.text)}
            className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full transition-colors"
            title={option.description}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HelpTool; 