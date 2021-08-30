const web3 = require("web3");
require('dotenv').config();
const fs = require('fs');
const Contract = require('./Contracts');
const Provider = require('./Provider');
const {GetPrice, checkOrderSignature, signOrder} = require('./helpers');
const {changeUserBalance,takeOffer, makeOffer,updateOffer, getOffers, getOfferForHash} = require('./queries');
const {matchOffers} = require('./matchingEngine');
const { match } = require("assert");
const ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/MatchingEngine.json', 'utf8')).abi;
const ADDRESS = process.env.EXCHANGECONTRACT;//Exchange contract address
const token1ABI = JSON.parse(fs.readFileSync('../on_chain_exchange/build/contracts/Testtoken1.json', 'utf8')).abi;
const token1Address = process.env.TESTTOKEN1;
const provider = new Provider();
const testtoken1 = new Contract(token1ABI,token1Address).initContract();
const contract = new Contract(ABI,ADDRESS).initContract();


const init = async () =>{
    const accounts = await provider.web3.eth.getAccounts();

    //START
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

    //Creating a message to sign
    const order = {
      sell_amt : 10,
      sell_token : process.env.TESTTOKEN1,
      buy_amt : 10,
      buy_token : process.env.TESTTOKEN2,
      owner : accounts[0]
    }    

    //Sign the order
    const data = await provider.web3.utils.soliditySha3(
        {t: 'uint256', v: order.sell_amt},
        {t: 'address', v: order.sell_token},
        {t: 'uint256', v: order.buy_amt},
        {t:'address',v: order.buy_token},                
        {t:'address',v: order.owner}
    );
    const account1Signature = await provider.web3.eth.accounts.sign(data, process.env.ACCOUNT1PRIVATEKEY);
    const signedOrder = {...order, ...{signature : account1Signature.signature}};

    //console.log("Signed Data: ", signedOrder);

    const trade = {
      taker_address : accounts[4],
      taker_token : process.env.TESTTOKEN1,
      taker_sell_amt : 10,
      maker_address : accounts[1],
      maker_token : process.env.TESTTOKEN1,
      maker_buy_amt : 10
    }

    const finalOrder = {...{orderData : signedOrder}, ...{tradeData : trade}};
    //console.log("Final Order: ", finalOrder);

    const finalOrderSigned = await signOrder(finalOrder);
    //console.log("Final Order Signed: ", finalOrderSigned);

    //Calling contract function
    const tx = await contract.methods.offChainTrade(
      /*finalOrderSigned.sell_amt,
      finalOrderSigned.sell_token,
      finalOrderSigned.buy_amt,
      finalOrderSigned.buy_token,
      finalOrderSigned.owner,
      finalOrderSigned.signature,
      finalOrderSigned.tradeData.takerToken,
      finalOrderSigned.tradeData.takerSellAmt,
      finalOrderSigned.tradeData.makerAddress,
      finalOrderSigned.tradeData.makerToken,
      finalOrderSigned.tradeData.makerBuyAmt,
      finalOrderSigned.CENTRA_signature*/
      finalOrder.orderData,
      finalOrder.tradeData,
      finalOrderSigned.CENTRA_signature
    ).send({from: accounts[4]})
     .catch(err => console.log(err));

    console.log("tx recipt: ", tx);
    
    //END


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
      owner : '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E',
      timestamp : Date.now(),
      signature : '0x1111',
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
      signature : '0x1111',
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
      signature : '0x1111',
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
      order1.signature,
      order1.price,
      order1.lowest_sell_price
      );*/

    //console.log(out);

    //const out1 = await getoffers('0x3333','0x4444',1);
    //const out1 = await getoffers(order1.buy_token,order1.sell_token,1);
    //console.log("orders: ", out1);
    
    //const output_orders = await matchOffers(order2);
    //console.log("ORDERS: ", output_orders[0]);



    
    
    //const order = await getOfferForHash(3);
    //console.log(order);
    //const o = await matchOffers(order3);
    //console.log("ORDERS: ",o);

    //const sig = await provider.web3.eth.personal.sign("Hello", process.env.CENTRADEXPUBLICKEY, process.env.CENTRAPRIVATEKEY);
    //console.log(sig);

    /*const dataOrder1 = {
      sell_amt : order1.sell_amt,
      sell_token : order1.sell_token,
      buy_amt : order1.buy_amt,
      buy_token : order1.buy_token,
      owner : order1.owner
      };

    console.log(dataOrder1);*/

    
    //const data = String(dataOrder1.sell_amt + dataOrder1.sell_token + dataOrder1.buy_amt + dataOrder1.buy_token + dataOrder1.owner);
    //const sigObj = await provider.web3.eth.accounts.sign(String(dataOrder1), process.env.CENTRADEXPRIVATEKEY);
    //console.log(sigObj);

    //const output = await signOrder(dataOrder1);
    
    //const signerAddress = await provider.web3.eth.accounts.recover(sigObj);
    //console.log("SIGNER:" , signerAddress);

    //const boolout = await checkOrderSignature(dataOrder1,output.signature,String(process.env.CENTRADEXPUBLICKEY));
    //console.log(boolout);
    
    //const signerAddress = await provider.web3.eth.accounts.recover();
    //console.log("Signer Address: ", signerAddress);

  }
  
init();