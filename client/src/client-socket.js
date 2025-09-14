// client-socket.js
let socket = null;

export function connectWebSocket(onMessageCallback) {
  if (socket) return socket; // reuse existing connection

  socket = new WebSocket("ws://localhost:3000");

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
