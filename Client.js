const WebSocket = require('ws');

const INTERVAL = 1000;

class Client {
  constructor(host = 'ws://localhost:8080') {
    this.host = host;
    this.ws = null;
    process.stdin.on('data', this.sendMessage.bind(this));
  }

  connect() {
    console.log('attempting connection');
    this.ws = new WebSocket(this.host);
    this.ws.on('message', this.handleMessage.bind(this));
    this.ws.on('error', this.handleError.bind(this));
    this.ws.on('close', this.handleClose.bind(this));
    this.ws.on('open', this.handleConnect.bind(this));
  }

  handleMessage(message) {
    console.log(message);
  }

  handleError(e) {
    // Don't flood logs
    // console.log(e);
  }

  handleClose(e) {
    console.log('Connection Close');
    this.ws = null;
    setTimeout(this.connect.bind(this), INTERVAL);
  }

  handleConnect() {
    console.log('connected');
    process.stdout.write('> ');
  }

  sendMessage(message) {
    if (!this.ws) {
      console.log('No server connection');
      return;
    }
    this.ws.send(message.toString().trim(), (e) => {
      if (e) console.log('Error sending message');
    });
    process.stdout.write('> ');
  }
}

if (require.main === module) {
  const client = new Client();
  client.connect();
}
