const io = require('socket.io')(3000);
const Contract = require('./Contracts');
const {changeUserBalance, makeOffer, deleteOffer, tradeBalances, incrementUserBalance, decrementUserBalance} = require('./queries');
const {GetPrice,ToDecimalNum} = require('./helpers');
const fs = require('fs');
const { matchOffer, matchOffers } = require('./matchingEngine');
require('dotenv').config();

//Matching Engine Exchange - Contract setup
const ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/MatchingEngine.json', 'utf8')).abi;
const ADDRESS = process.env.EXCHANGECONTRACT;//Exchange contract address
const contract = new Contract(ABI,ADDRESS).initContract();//Exchange contract


//Adding contract event listeners
contract.events.Deposit()
.on('data', (event) => {
  console.log('data1',event.returnValues);
  //Adding value to the database
  changeUserBalance(event.returnValues.user,
    event.returnValues.token,
    event.returnValues.balance
    );
})
.on('connected', (subscriptionId) =>{
  console.log("Subscribed to event Deposit: ",subscriptionId);
})
.on('error', (error) =>{
  console.log(error);
});

contract.events.Withdraw()
.on('data', (event) => {
  console.log('data1',event.returnValues);
  //Removing values from the database
  changeUserBalance(
    event.returnValues.user,
    event.returnValues.token,
    event.returnValues.balance
  );
})
.on('connected', (subscriptionId) =>{
  console.log("Subscribed to event Withdraw: ",subscriptionId);
})
.on('error', (error) =>{
  console.log(error);
});

contract.events.TradeSettled()
.on('data', (event) => {
  console.log("Trade Settled: ", event.returnValues);  
  tradeBalances(
    event.returnValues.taker_order_id,
    event.returnValues.taker_address,
    event.returnValues.taker_token,
    event.returnValues.taker_sell_amt,
    event.returnValues.maker_order_id,
    event.returnValues.maker_address,
    event.returnValues.maker_token,
    event.returnValues.maker_buy_amt
    );
})
.on('connected', (subscriptionId) =>{
  console.log("Subscribed to event Trade Settled: ",subscriptionId);
})
.on('error', (error) => {
  console.log(error);
});

//Websocket connections
io.on('connection', (socket) => {
  console.log('client connected:', socket.client.id);

  socket.on('MakeOffer', async (order) => {
    console.log('new message - MakeOffer:', order);

    //Try and match orders
    const out = await matchOffers(order); 
    
    socket.emit("ReturnedMakeOffer",out);
  });

  socket.on('TakeOffer', async (data) => {
    console.log('new message - TakeOffer:', data);

    //Try and take an order
    const out = await matchOffer(data);

    socket.emit("ReturnedTakeOffer",out);
  });

  socket.on('CancelOffer', async (data) => {
    console.log('new message - CancelOffer:', data);

    //Canel the order
    const out = await deleteOffer(data);

    socket.emit("ReturnedCancelOffer",out);
  });

  socket.on('DepositToken', (data) => {
    //Return data to make a transaction - what address and function to call 
    console.log('new message - DepositToken:', data);
  });

  socket.on('WithdrawToken', (data) => {
    //Return data to make a transaction - what address and function to call
    console.log('new message - WithdrawToken:', data);
  });

  socket.on('GetOrders', (data) =>{
    //Gets orders for the tokens

  });

});

