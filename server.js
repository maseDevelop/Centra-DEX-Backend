const io = require('socket.io')(3000);
const Contract = require('./Contracts');
const Provider = require('./Provider');
const {changeUserBalance} = require('./queries');
const fs = require('fs');
require('dotenv').config();



//Contract setup
const ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/MatchingEngine.json', 'utf8')).abi;
const ADDRESS = process.env.EXCHANGECONTRACT;//Exchange contract address
const contract = new Contract(ABI,ADDRESS).initContract();//Exchange contract



//Adding contract event listeners
contract.events.Deposit()
.on('data', (event) => {
  console.log('data11',event.returnValues);
  changeUserBalance(event.returnValues.user,
    event.returnValues.token,
    event.returnValues.balance);
})
.on('connected', (subscriptionId) =>{
  console.log("Subscribed to event Deposit: ",subscriptionId);
})
.on('changed', (event) => {
  // remove event from local database
})
.on('error', (error) =>{
  console.log(error);
});



//Websocket connections
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

