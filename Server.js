const WebSocket = require('ws');

class Server {
  constructor(port = 8080) {
    this.wss = null;
    this.port = port;
  }

  connect() {
    this.wss = new WebSocket.Server({ port: this.port });
    this.wss.on('connection', this.handleMessage.bind(this));
  }

  handleMessage(ws) {
    ws.on('message', (message) => {
      console.log(`Broadcasting: ${message}`);
      this.broadcast(ws, message);
    });
  }

  broadcast(ws, message) {
    this.wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message, (e) => {
          if (e) console.log(e);
        });
      }
    });
  }
}

if (require.main === module) {
  const server = new Server();
  server.connect();
}
