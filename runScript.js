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


const init = async () =>{
    const accounts = await provider.web3.eth.getAccounts();

    //START
    /*
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
      taker_order_id : 1,
      taker_address : accounts[4],
      taker_token : process.env.TESTTOKEN1,
      taker_sell_amt : 10,
      maker_order_id : 2,
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
      finalOrder.orderData,
      finalOrder.tradeData,
      finalOrderSigned.CENTRA_signature
    ).send({from: accounts[4]})
     .catch(err => console.log(err));

    console.log("tx recipt: ", tx);
    */
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

    /*const order1 = {
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
    }*/
    
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