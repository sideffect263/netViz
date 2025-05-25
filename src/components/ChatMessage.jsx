import React from 'react';
import { FaUser, FaRobot, FaCopy, FaCheck } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message, darkMode, isProcessing = false }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  
  const isUser = message.role === 'user';
  
  // Format message text with code highlighting
  const formatMessage = (content) => {
    if (!content) return '';
    
    // Regular expression to match code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    // Split the message by code blocks
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      
      // Add code block
      const language = match[1] || 'javascript';
      parts.push({
        type: 'code',
        language,
        content: match[2]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }
    
    // Return the formatted parts
    return (
      <>
        {parts.map((part, index) => {
          if (part.type === 'text') {
            // Process text for line breaks and links
            const textWithBreaks = part.content
              .split('\n')
              .map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < part.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ));
            
            return <span key={index}>{textWithBreaks}</span>;
          } else if (part.type === 'code') {
            return (
              <div key={index} className="my-2 relative group">
                <div className={`absolute top-2 right-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} z-10 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(part.content);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="p-1 rounded hover:bg-opacity-20 hover:bg-white"
                    title="Copy code"
                  >
                    {isCopied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
                <div className={`rounded-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className={`px-3 py-1 text-xs uppercase ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {part.language}
                  </div>
                  <SyntaxHighlighter
                    language={part.language}
                    style={darkMode ? tomorrow : prism}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      fontSize: '0.875rem',
                      backgroundColor: darkMode ? '#1f2937' : '#f3f4f6'
                    }}
                  >
                    {part.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          }
          return null;
        })}
      </>
    );
  };
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'} mt-1`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? (darkMode ? 'bg-indigo-700' : 'bg-indigo-100')
              : (darkMode ? 'bg-purple-700' : 'bg-purple-100')
          }`}>
            {isUser ? (
              <FaUser className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
            ) : (
              <FaRobot className={darkMode ? 'text-purple-300' : 'text-purple-600'} />
            )}
          </div>
        </div>
        
        <div>
          <div className={`rounded-lg px-4 py-2 ${
            isUser
              ? (darkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-500 text-white')
              : (darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800 border border-gray-200')
          } shadow-sm`}>
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                {formatMessage(message.content)}
              </div>
            )}
          </div>
          
          <div className={`text-xs mt-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          } ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 