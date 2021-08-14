const Web3 = require("web3");
require('dotenv').config();
const fs = require('fs');
const Contract = require('./Contracts');
const Provider = require('./Provider');
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
    await testtoken1.methods
        .approve(ADDRESS, 50)
        .send({
          from: accounts[0]
        });
  
    await contract.methods
      .depositToken("0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B", 5)
      .send({
        from: accounts[0]
    });

    //await console.log(receipt.events);
    //await console.log(out.events);
    //process.exit();
  }
  
init();