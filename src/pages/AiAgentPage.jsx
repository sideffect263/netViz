import React from 'react';
import { FaLightbulb, FaTerminal } from 'react-icons/fa';
import HelpModal from '../components/HelpModal';
import ConversationSidebar from '../components/ConversationSidebar';
import AIAnalysisViewer from '../components/AIAnalysisViewer';
import RawScanDataViewer from '../components/RawScanDataViewer';
import PageHeader from '../components/PageHeader';
import StatusIndicators from '../components/StatusIndicators';
import TargetIntelligenceDashboard from '../components/TargetIntelligenceDashboard';
import AgentChatPane from '../components/AgentChatPane';
import useAiAgentState from '../hooks/useAiAgentState';

const AiAgentPage = () => {
  const {
    // State
    command,
    setCommand,
    commandHistory,
    showHistory,
    setShowHistory,
    isProcessing,
    finalResult,
    error,
    progressMessage,
    scanInProgress,
    scanProgress,
    scanPhase,
    scanDuration,
    darkMode,
    showHelpModal,
    setShowHelpModal,
    showHelpTool,
    setShowHelpTool,
    sidebarCollapsed,
    setSidebarCollapsed,
    messages,
    rawScanData,
    
    // Auth and conversations
    conversations,
    selectedConversation,
    conversationsLoading,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    setSelectedConversation,
    
    // WebSocket
    connected,
    events,
    
    // References
    chatBoxRef,
    
    // Data
    quickActions,
    
    // Handlers
    handleSubmit,
    selectHistoryCommand,
    applyQuickAction,
    toggleDarkMode,
    handleHelpOptionSelect,
    toggleHelpTool
  } = useAiAgentState();

  const allowedTargetsMessage = "Please note: This system is configured for educational and bug bounty purposes. Scanning and investigation are restricted to a predefined list of intentionally vulnerable hosts and bug bounty program scope domains. Unauthorized scanning is prohibited.";

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <PageHeader
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            connected={connected}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            setShowHelpModal={setShowHelpModal}
          />

          {/* Static Information Banner */}
          <div className={`p-3 mb-4 rounded-md text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'} border ${darkMode ? 'border-blue-700' : 'border-blue-300'}`}>
            <p className="font-semibold">Important Notice:</p>
            <p>{allowedTargetsMessage}</p>
          </div>

          {/* Status Indicators */}
          <StatusIndicators
            error={error}
            progressMessage={progressMessage}
            scanInProgress={scanInProgress}
            scanPhase={scanPhase}
            scanDuration={scanDuration}
            scanProgress={scanProgress}
            command={command}
            darkMode={darkMode}
          />

          {/* Main Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Overlay for small screens when sidebar is open */}
            {!sidebarCollapsed && (
              <div
                className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
                onClick={() => setSidebarCollapsed(true)}
              ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed z-30 inset-y-0 left-0 w-72 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:relative md:flex-shrink-0 transition-all duration-300 ease-in-out ${
              sidebarCollapsed 
                ? '-translate-x-full opacity-0 pointer-events-none md:w-0 md:border-0' 
                : 'translate-x-0 md:translate-x-0 md:w-72'
            }`}>
              <ConversationSidebar
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={(id) => {
                  loadConversation(id);
                  if (window.innerWidth < 768) {
                    setSidebarCollapsed(true);
                  }
                }}
                onNewConversation={() => {
                  setSelectedConversation(null);
                  if (window.innerWidth < 768) {
                    setSidebarCollapsed(true);
                  }
                }}
                onDeleteConversation={deleteConversation}
                onUpdateTitle={updateConversationTitle}
                loading={conversationsLoading}
                darkMode={darkMode}
              />
            </div>
            
            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-6'}`}>
              {/* Target Intelligence Dashboard */}
              <TargetIntelligenceDashboard
                messages={messages}
                events={events}
                darkMode={darkMode}
                isProcessing={isProcessing}
              />

              {/* Three Panes Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agent Chat Pane */}
                <AgentChatPane
                  messages={messages}
                  isProcessing={isProcessing}
                  finalResult={finalResult}
                  commandHistory={commandHistory}
                  showHistory={showHistory}
                  setShowHistory={setShowHistory}
                  command={command}
                  setCommand={setCommand}
                  handleSubmit={handleSubmit}
                  selectHistoryCommand={selectHistoryCommand}
                  showHelpTool={showHelpTool}
                  setShowHelpTool={setShowHelpTool}
                  handleHelpOptionSelect={handleHelpOptionSelect}
                  toggleHelpTool={toggleHelpTool}
                  darkMode={darkMode}
                  chatBoxRef={chatBoxRef}
                />
                
                {/* AI Analysis Pane */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors`}>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaLightbulb className="mr-3 text-xl" />
                      <h2 className="text-xl font-semibold">AI Security Analysis</h2>
                    </div>
                    
                    {events.length > 0 && (
                      <div className="text-xs bg-purple-700 rounded-full px-3 py-1">
                        {events.length} events
                      </div>
                    )}
                  </div>
                  
                  <div className={`h-96 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <AIAnalysisViewer events={events} darkMode={darkMode} />
                  </div>
                </div>
                
                {/* Raw Scan Results Pane */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors xl:col-span-1 lg:col-span-2 xl:col-span-1`}>
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTerminal className="mr-3 text-xl" />
                      <h2 className="text-xl font-semibold">Raw Scan Data</h2>
                    </div>
                    
                    {rawScanData && (
                      <div className="text-xs bg-green-700 rounded-full px-3 py-1">
                        Data available
                      </div>
                    )}
                  </div>
                  
                  <div className={`h-96 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <RawScanDataViewer rawData={rawScanData} darkMode={darkMode} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help Modal */}
          <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default AiAgentPage; 