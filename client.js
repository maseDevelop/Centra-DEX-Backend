//Simple Client - Used for testing
var io = require('socket.io-client');
const {GetPrice} = require('./helpers');
var socket = io.connect("http://localhost:3000/", {
    reconnection: true
});

const order1 = {
      sell_amt : 10,
      sell_token : '0x4444',
      buy_amt : 10,
      buy_token : '0x3333',
      owner : '0x1234',
      timestamp : Date.now(),
      signiture : '0x1111',
      price : GetPrice(10,10),
      lowest_sell_price : GetPrice(10,10)
}
    
socket.on('connect', function () {
    console.log('connected to localhost:3000');
    
    socket.emit("MakeOffer", order1);
    
});
    
socket.on('ReturnedMakeOffer', (data) => {

    console.log("Returned data: ", data);

});