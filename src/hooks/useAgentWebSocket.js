import { useState, useEffect, useRef } from 'react';

// Custom hook for WebSocket connection used by the AI Agent page
const useAgentWebSocket = (sessionId) => {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    // Create WebSocket connection
    const wsURL = process.env.NODE_ENV === 'development'
      ? 'ws://localhost:5000'
      : 'wss://netviz-dashboard.ofektechnology.com';
    const ws = new WebSocket(wsURL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnected(true);

      // Register this session
      ws.send(JSON.stringify({
        type: 'register',
        sessionId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Only process events for our session
        if (data.sessionId === sessionId) {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              ...data,
              receivedAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [sessionId]);

  return { connected, events };
};

export default useAgentWebSocket; 