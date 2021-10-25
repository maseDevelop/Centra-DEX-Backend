const web3 = require("web3");
require('dotenv').config();
const fs = require('fs');
const Contract = require('./Contracts');
const Provider = require('./Provider');
const {GetPrice, checkOrderSignature, signOrder, ToBigNum} = require('./helpers');
const {changeUserBalance,takeOffer, makeOffer,updateOffer, getOffers, getOfferForHash} = require('./queries');
const {matchOffers} = require('./matchingEngine');
const { match } = require("assert");
const ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/MatchingEngine.json', 'utf8')).abi;
const ADDRESS = process.env.EXCHANGECONTRACT;//Exchange contract address
const token1ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/Testtoken1.json', 'utf8')).abi;
const token2ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/Testtoken2.json', 'utf8')).abi;
const provider = new Provider();
const testToken1Contract = new Contract(token1ABI,process.env.TESTTOKEN1).initContract();
const testToken2Contract = new Contract(token2ABI,process.env.TESTTOKEN2).initContract();
const contract = new Contract(ABI,ADDRESS).initContract();

/* TEST SCRIPT */
const init = async () =>{
    const accounts = await provider.web3.eth.getAccounts();

    //START TEST 1 -- Trade between account[0] and account[1]
      
    //Sending tokens to account[1]
    await testToken2Contract.methods
          .transfer(accounts[1],ToBigNum(50))
          .send({
            from: accounts[0]
          });

    //Allow tokens to trade and send tokens to smart contracts
    await testToken1Contract.methods
        .approve(process.env.EXCHANGECONTRACT, ToBigNum(50))
        .send({
          from: accounts[0]
        });

    await testToken2Contract.methods
        .approve(process.env.EXCHANGECONTRACT, ToBigNum(50))
        .send({
          from: accounts[1]
        });
    
    //Depositing into contract
    await contract.methods
      .depositToken(process.env.TESTTOKEN1, ToBigNum(10))
      .send({
        from: accounts[0]
    });

    await contract.methods
      .depositToken(process.env.TESTTOKEN2,ToBigNum(10))
      .send({
        from: accounts[1]
    });

    //Create the order
    const orderData0 = {
      sell_amt : 10,
      sell_token : process.env.TESTTOKEN1,
      buy_amt : 10,
      buy_token : process.env.TESTTOKEN2,
      owner : accounts[0]
    }

    //Sign the order
    const data0 = await provider.web3.utils.soliditySha3(
        {t: 'uint256', v: orderData0.sell_amt},
        {t: 'address', v: orderData0.sell_token},
        {t: 'uint256', v: orderData0.buy_amt},
        {t:'address',v: orderData0.buy_token},                
        {t:'address',v: orderData0.owner}
    );
    
    const account0Signature = await provider.web3.eth.accounts.sign(data0, process.env.ACCOUNT0PRIVATEKEY); 

    console.log("account 0 signature: ", account0Signature.signature);
    const order0 = {
      sell_amt : orderData0.sell_amt,
      sell_token : orderData0.sell_token,
      buy_amt : orderData0.buy_amt,
      buy_token : orderData0.buy_token,
      owner : orderData0.owner,
      timestamp : Date.now(),
      signature : account0Signature.signature,
      price : GetPrice(orderData0.sell_amt, orderData0.buy_amt),
      lowest_sell_price : GetPrice(orderData0.buy_amt, orderData0.sell_amt)
    }

    //Making the order
    await matchOffers(order0);

    //Completing account[1] order 
  
    const orderData1 = {
      sell_amt : 10,
      sell_token : process.env.TESTTOKEN2,
      buy_amt : 10,
      buy_token : process.env.TESTTOKEN1,
      owner : accounts[1]
    }

    //Sign the order
    const data1 = await provider.web3.utils.soliditySha3(
        {t: 'uint256', v: orderData0.sell_amt},
        {t: 'address', v: orderData0.sell_token},
        {t: 'uint256', v: orderData0.buy_amt},
        {t:'address',v: orderData0.buy_token},                
        {t:'address',v: orderData0.owner}
    );
    
    const account1Signature = await provider.web3.eth.accounts.sign(data1, process.env.ACCOUNT1PRIVATEKEY); 

    console.log("account 1 siangure : ",account1Signature.signature);

    const order1 = {
      sell_amt : orderData1.sell_amt,
      sell_token : orderData1.sell_token,
      buy_amt : orderData1.buy_amt,
      buy_token : orderData1.buy_token,
      owner : orderData1.owner,
      timestamp : Date.now(),
      signature : account1Signature.signature,
      price : GetPrice(orderData1.sell_amt, orderData1.buy_amt),
      lowest_sell_price : GetPrice(orderData1.buy_amt, orderData1.sell_amt)
    }

    //matching Order
    const [out] =  await matchOffers(order1);

    console.log(out)
    //Sending order to contract
    const tx = await contract.methods.offChainTrade(
      out.orderData,
      out.signature,
      out.tradeData.taker_order_id,
      out.tradeData.taker_address,      
      out.tradeData.taker_token,
      out.tradeData.taker_sell_amt,
      out.tradeData.maker_order_id,
      out.tradeData.maker_address,
      out.tradeData.maker_token,
      out.tradeData.maker_buy_amt,
      out.CENTRA_signature
      ).send({from: accounts[1]}).on('error', (err) => {
      console.log(err);
    });

    console.log(tx);


    //END TEST 1
  }
  
init();