# node-ws-messaging-demo
Simple node messaging app using [ws](https://www.npmjs.com/package/ws).
## Server
The server class is a wrapper for the `WebSocket.Server` class. The server class holds the port number to listen on, and will accept incoming messages from any client, and broadcast them back to all other clients, exluding the sender.

The handle message function takes the websocket object when a new connection opens and listens for the message handler, then broadcasts it.
```javascript
 handleConnection(ws) {
    ws.on('message', (message) => {
      console.log(`Broadcasting: ${message}`);
      this.broadcast(ws, message);
    });
  }
  ```
  To broadcast, we simply loop through the client objects, skipping the origin client.
  ```javascript
  broadcast(ws, message) {
    this.wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message, (e) => {
          if (e) console.log(e);
        });
      }
    });
  }
  ```
  
  ## Client
  The client is a little bit more interesting because there is a case to handle when the server goes down. In the handle close function, we use `setTimeout` to attempt to reconnect. Note the new connection will be a new `WebSocket` object.
  ```javascript
  handleClose(e) {
    console.log('Connection Close');
    this.ws = null;
    setTimeout(this.connect.bind(this), INTERVAL);
  }
  ```
        