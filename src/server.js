/*const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("User Connected");
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});*/

/*const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => {

  console.log("hello");

});
server.listen(3000);*/

const io = require('socket.io')(3000);

io.on('connection', (socket) => {

  console.log('client connected:', socket.client.id);

  socket.on('MakeOffer', (data) => {
    console.log('new message - MakeOffer:', data);
  });

  socket.on('TakeOffer', (data) => {
    console.log('new message - TakeOffer:', data);
  });

  socket.on('CancelOffer', (data) => {
    console.log('new message - CancelOffer:', data);
  });

  socket.on('DepositToken', (data) => {
    console.log('new message - DepositToken:', data);
  });

  socket.on('WithdrawToken', (data) => {
    console.log('new message - WithdrawToken:', data);
  });

});