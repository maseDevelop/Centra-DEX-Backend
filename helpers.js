//Helper Functions
const Decimal = require('decimal.js');
const Provider = require('./Provider');
const BigNumber = require('bignumber.js');

//web3 provider
const provider = new Provider();

/**
 * Converts from decimal number to fixed point number
 * @param {*} number 
 * @returns Fixed point bigNumber
 */
const ToBigNum = (number) => {
    return new BigNumber(new Decimal(number) * 1e18);
}

/**
 * Converts from fixed point number to a decimal number
 * @param {Fixed Point Number} bigNumber 
 * @returns Decimal Number
 */
const ToDecimalNum = (bigNumber) =>{
    return bigNumber/1e18;
}

/**
 * Gets the price of an specified sell
 * @param {*} sell_amt 
 * @param {*} buy_amt 
 * @returns price of asset
 */
const GetPrice = (sell_amt,buy_amt) => {
    return sell_amt/buy_amt;
}

/**
 * 
 * @param {*} dataThatWasSigned data to hash 
 * @param {*} signature the signtature of the data that was hashed 
 * @param {*} owner the owner of the data 
 * @returns 
 */
const checkOrderSigniture = async (dataThatWasSigned, signature, owner) =>{

    //Recovering the accoun to verify that you 
    const signerAddress = await provider.web3.eth.accounts.recover((dataThatWasSigned.sell_amt + dataThatWasSigned.sell_token + dataThatWasSigned.buy_amt + dataThatWasSigned.buy_token + dataThatWasSigned.owner), signature);

    return (owner === signerAddress ? true : false);
}

/**
 * Signs order with the CENTRA DEX key 
 * @param {} dataThatWasSigned data to sign 
 * @returns 
 */
const signOrder = async (dataThatWasSigned) => {
   
   //Sign order with CENTRA DEX key
   const signedOrder = await provider.web3.eth.accounts.sign(String(dataThatWasSigned.sell_amt + dataThatWasSigned.sell_token + dataThatWasSigned.buy_amt + dataThatWasSigned.buy_token + dataThatWasSigned.owner), String(process.env.CENTRADEXPRIVATEKEY));

   return signedOrder; 
}

module.exports = {
    ToBigNum,
    ToDecimalNum,
    GetPrice,
    checkOrderSigniture,
    signOrder, 
};

