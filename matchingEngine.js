const { Pool } = require("pg");
const {getoffers, makeOffer} = require('./queries');
const {GetPrice} = require('./helpers');
require('dotenv').config();

const trade = (maker,taker,quantity,paritalFill) =>{

    if(paritalFill){

        //working out trade amount
        const tradeAmount = (quantity * taker.buy_amt)/taker.sell_amt;

        if(tradeAmount >= 0 ){

            const tradeData = {
                takerToken: taker.sell_token,
                takerSellAmt: tradeAmount,
                makerAddress: maker.owner,
                makerToken: maker.buy_token,
                makerBuyAmt: maker.buy_amt,
            } 

            return tradeData;

        }
        else{
            console.log("Trade amount has to be greater than zero")
        }

    }
    else{

        //working out trade amount
        const tradeAmount = (quantity * maker.buy_amt)/maker.sell_amt;

        if(tradeAmount >= 0 ){

            const tradeData = {
                takerToken: taker.sell_token,
                takerSellAmt: taker.sell_amt,
                makerAddress: maker.owner,
                makerToken: maker.buy_token,
                makerBuyAmt: tradeAmount,
            } 

            return tradeData;

        }
        else{
            console.log("Trade amount has to be greater than zero")
        }
    }
}

const matchOffers = async (order) => {

    //Creating the offer first
    makeOffer(order.sell_amt,order.sell_token,order.buy_amt,order.buy_token,order.owner,order.timeStamp,order.signiture,order.price,order.lowest_sell_price);

    //Get current offers stored in the database - that are sorted;
    const currentOffers = await getoffers(order.sell_token, order.buy_token, order.lowest_price);

    console.log(currentOffers[0]);

    //If there is no offers then return
    if(currentOffers.length == 0){
        console.log("No Offers");
        return;
    }

    //Match as many offers as you can for the taker
    const offerFilled = false;
    const count = 0;
    let orderFillAmount;
    let trade_data_arr = [];


    while(!offerFilled && !(count = currentOffers.length)){

        orderFillAmount = order.sell_amt; - currentOffers[count].buy_amt;

        if(orderFillAmount > 0){

            //Trade - Partially filled

            //creating the trade data and adding it to the array
            trade_data_arr.push(trade(order,currentOffers[count],currentOffers[count].buy_amt,true));
            
            //Get the next order
            count++;
        }
        else{
            //Trade - Fully Filled

            //Creating the trade data
            trade_data_arr.push(trade(order,currentOffers[count],order.sell_amt,false));

            //Stoping the loop
            offerFilled = true;
        }
    }

    return trade_data_arr;
};

module.exports = {
    matchOffers
};