//Helper Functions
const Decimal = require('decimal.js');
const BigNumber = require('bignumber.js');

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

module.exports = {
    ToBigNum,
    ToDecimalNum,
    GetPrice,
    
};

