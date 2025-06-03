import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaComment, FaTimes, FaUser, FaRobot } from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const ConversationSidebar = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onUpdateTitle,
  loading,
  darkMode
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  const handleEditClick = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = (id) => {
    if (editTitle.trim()) {
      onUpdateTitle(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`h-full ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-r p-4 transition-colors`}>
        <div className="text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Sign in to save your conversations</p>
          <button
            onClick={onNewConversation}
            className={`w-full flex items-center justify-center p-2 ${
              darkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            } rounded transition-colors`}
          >
            <FaPlus className="mr-2" />
            New Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-r transition-colors`}>
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center justify-center p-2 ${
            darkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          } rounded transition-colors`}
          disabled={loading}
        >
          <FaPlus className="mr-2" />
          New Chat
        </button>

        {/* Search input */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded ${
              darkMode ? 'bg-gray-800 text-gray-200 placeholder-gray-500 border-gray-600' : 'bg-white text-gray-800 placeholder-gray-400 border-gray-300'
            } border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto max-h-[700px]">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className={`text-center p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaComment className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <ul className="space-y-1 px-2">
            {conversations
              .filter(conv => {
                if (!searchTerm.trim()) return true;
                const term = searchTerm.toLowerCase();
                const inTitle = conv.title.toLowerCase().includes(term);
                const lastMsg = conv.messages[conv.messages.length - 1]?.content || '';
                const inLast = lastMsg.toLowerCase().includes(term);
                return inTitle || inLast;
              })
              .map(conversation => (
                <li key={conversation._id}>
                  {editingId === conversation._id ? (
                    <div className={`p-2 rounded ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm flex items-center transition-colors`}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={`flex-grow mr-2 px-2 py-1 rounded text-sm ${
                          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
                        } border ${
                          darkMode ? 'border-gray-600' : 'border-gray-300'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSaveTitle(conversation._id)}
                        className={`p-1 rounded-full ${
                          darkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <FaCheck size={14} />
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className={`p-1 rounded-full ${
                          darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                        } ml-1 transition-colors`}
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`p-2 rounded cursor-pointer ${
                        selectedConversation?._id === conversation._id 
                          ? (darkMode ? 'bg-indigo-900' : 'bg-indigo-100') 
                          : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200')
                      } transition-colors`}
                      onClick={() => onSelectConversation(conversation._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="truncate flex-grow">
                          <span className={`font-medium ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          } transition-colors`}>
                            {conversation.title}
                          </span>
                        </div>
                        <div className="flex space-x-1 ml-2 flex-shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(conversation._id, conversation.title);
                            }}
                            className={`p-1 rounded-full ${
                              darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-300'
                            } transition-colors`}
                          >
                            <FaEdit size={12} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation._id);
                            }}
                            className={`p-1 rounded-full ${
                              darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-red-400' : 'text-gray-500 hover:bg-gray-300 hover:text-red-600'
                            } transition-colors`}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <span className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        } transition-colors`}>
                          {formatDate(conversation.updatedAt)}
                        </span>
                        <span className={`ml-2 ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        } transition-colors`}>
                          {conversation.messages.length} messages
                        </span>
                      </div>
                      
                      {/* Preview of last message */}
                      {conversation.messages.length > 0 && (
                        <div className={`mt-2 text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        } flex items-start transition-colors`}>
                          {conversation.messages[conversation.messages.length - 1].role === 'assistant' ? (
                            <FaRobot className="mr-1 mt-0.5 flex-shrink-0" size={10} />
                          ) : (
                            <FaUser className="mr-1 mt-0.5 flex-shrink-0" size={10} />
                          )}
                          <span className="truncate">
                            {conversation.messages[conversation.messages.length - 1].content.substring(0, 60)}
                            {conversation.messages[conversation.messages.length - 1].content.length > 60 && '...'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar; 