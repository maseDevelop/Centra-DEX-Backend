const io = require('socket.io')(3000);
const Contract = require('./Contracts');
const Provider = require('./Provider');
const fs = require('fs');
require('dotenv').config();


const ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/MatchingEngine.json', 'utf8')).abi;
const ADDRESS = process.env.EXCHANGECONTRACT;//Exchange contract address

console.log(ADDRESS);

const contract = new Contract(ABI,ADDRESS);
const instance = contract.initContract()



//Adding event listeners
instance.events.Deposit()
.on('data', (event) => {
    console.log('data11',event);
})
.on('connected', (event) =>{
  console.log("Subscribed to event Deposit: ")
})
.on('error', console.error);

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