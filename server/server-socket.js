const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Handle incoming messages from clients
  ws.on('message', async (message) => {
    console.log('Received:', message.toString());

    // Here, you could call your Python backend via HTTP or spawn a child process
    // Example: get predicted next letters from Python API
    const predicted = await getPredictionsFromPython(message.toString());

    // Send prediction back to this client
    ws.send(JSON.stringify({ predictions: predicted }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Example function to call Python backend
async function getPredictionsFromPython(input) {
  const fetch = (await import('node-fetch')).default; // Node 18+ or use axios
  try {
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    return data.predictions;
  } catch (err) {
    console.error(err);
    return [];
  }
}

