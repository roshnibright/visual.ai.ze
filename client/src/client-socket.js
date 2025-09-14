// client-socket.js
let socket = null;

// Determine WebSocket URL based on environment
const getWebSocketURL = () => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return "ws://localhost:3000";
  }

  // In production (Render), use the same host as the current page
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}`;
};

export function connectWebSocket(onMessageCallback) {
  if (socket) return socket; // reuse existing connection

  socket = new WebSocket(getWebSocketURL());

  socket.onopen = () => {
    console.log("Connected to WebSocket server");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessageCallback) onMessageCallback(data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  return socket;
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn("WebSocket not connected yet");
  }
}

// Export the socket variable for use in other components
export { socket };
