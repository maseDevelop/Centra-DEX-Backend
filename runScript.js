const Web3 = require("web3");
require('dotenv').config();
const fs = require('fs');
const Contract = require('./Contracts');
const Provider = require('./Provider');
const {GetPrice} = require('./helpers');
const {changeUserBalance,takeOffer, makeOffer,updateOffer, getOffers} = require('./queries');
const {matchOffers} = require('./matchingEngine');
const { match } = require("assert");
const ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/MatchingEngine.json', 'utf8')).abi;
const ADDRESS = process.env.EXCHANGECONTRACT;//Exchange contract address
const token1ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/Testtoken1.json', 'utf8')).abi;
const token1Address = process.env.TESTTOKEN1;
const provdier = new Provider();
const testtoken1 = new Contract(token1ABI,token1Address).initContract();
const contract = new Contract(ABI,ADDRESS).initContract();


const init = async () =>{
    const accounts = await provdier.web3.eth.getAccounts();
  
    console.log(accounts[0])
    console.log(ADDRESS);

    //EC20 making sure that the contract can be accepted
    /*await testtoken1.methods
        .approve(ADDRESS, 50)
        .send({
          from: accounts[0]
        });
  
    await contract.methods
      .depositToken("0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B", 5)
      .send({
        from: accounts[0]
    });*/

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

  const order2 = {
      sell_amt : 100,
      sell_token : '0x3333',
      buy_amt : 100,
      buy_token : '0x4444',
      owner : '0x1234',
      timestamp : Date.now(),
      signiture : '0x1111',
      price : GetPrice(10,10),
      lowest_sell_price : GetPrice(10,10)
    }
   
  const order3 = {
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
    
    /*const out = await makeOffer(
      order1.sell_amt,
      order1.sell_token,
      order1.buy_amt,
      order1.buy_token,
      order1.owner,
      order1.timestamp,
      order1.signiture,
      order1.price,
      order1.lowest_sell_price
      );*/

    //console.log(out);

    //const out1 = await getoffers('0x3333','0x4444',1);
    //const out1 = await getoffers(order1.buy_token,order1.sell_token,1);
    //console.log("orders: ", out1);
    
    //const output_orders = await matchOffers(order2);
    //console.log("ORDERS: ", output_orders);
    
    const o = await matchOffers(order3);
    console.log("ORDERS: ",o);
  }
  
init();