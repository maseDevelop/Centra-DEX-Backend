const Web3 = require("web3");
require('dotenv').config();
const fs = require('fs');
const Contract = require('./Contracts');
const Provider = require('./Provider');
const {GetPrice} = require('./helpers');
const {changeUserBalance, makeOffer,updateOffer} = require('./queries');
const {matchOffers} = require('./matchingEngine');
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

    //console.log("make offer:", Date.now());
    makeOffer(10,'0x3344534544',20,'0x33434343','0x35345345',Date.now(),'0x543543534',GetPrice(30,10), GetPrice(30,20));
    //updateOffer(2,3,3,);

    const order1 = {
      sell_token : '0x3344534544',
      buy_token : '0x33434343',
      lowest_price :4,
    }

    matchOffers(order1);
    

  }
  
init();