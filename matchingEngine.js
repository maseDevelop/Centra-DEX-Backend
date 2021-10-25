const { Pool } = require("pg");
const {getOffers, makeOffer, updateOffer, getOffer, getOfferForHash} = require('./queries');
const {GetPrice, ToBigNum, signOrder } = require('./helpers');
require('dotenv').config();

/**
 * 
 * @param {*} maker the maker object
 * @param {*} taker the taker object
 * @param {*} quantity the amount of the order that is being filled
 * @param {*} paritalFill boolean value stating wheather it is a partail fill
 * @returns 
 */
const trade = async (maker,taker,quantity,paritalFill) =>{

    //Need to set the ID of the maker

    if(paritalFill){

        //Working out trade amount
        const tradeAmount = (quantity * taker.buy_amt)/taker.sell_amt;

        if(tradeAmount >= 0 ){

            const data = {
                taker_order_id : taker.id,
                taker_address : taker.owner, 
                taker_token: taker.sell_token,
                taker_sell_amt: ToBigNum(tradeAmount),
                maker_order_id : maker.id,
                maker_address: maker.owner,
                maker_token : maker.sell_token,
                maker_buy_amt: ToBigNum(maker.buy_amt),
            } 
            
            //Updating order data
            const newSellAmt = taker.sell_amt - quantity;
            const newBuyAmt = taker.buy_amt - tradeAmount;
            
            const one = await updateOffer(maker.id,0,0);//updating maker order
            const two = await updateOffer(taker.id,newSellAmt,newBuyAmt);//updating taker order

            const [order] = await getOfferForHash(maker.id);

            let tradeData = {
                ...{orderData : {
                    sell_amt : order.sell_amt,
                    sell_token : order.sell_token,
                    buy_amt :  order.buy_amt,
                    buy_token : order.buy_token,
                    owner : order.owner
                    }
                },
                signature : order.signature,
                ...{tradeData : data}
            }
            //let tradeData = {...{orderData : order}, ...{tradeData : data}};

            //Sign the data
            tradeData = await signOrder(tradeData);

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

            const data = {
                taker_order_id : taker.id,
                taker_address : taker.owner, 
                taker_token: taker.sell_token,
                taker_sell_amt: ToBigNum(taker.sell_amt),
                maker_order_id : maker.id,
                maker_address: maker.owner,
                maker_token: maker.sell_token,
                maker_buy_amt: ToBigNum(tradeAmount),
            }

            const newSellAmt = maker.sell_amt - quantity;
            const newBuyAmt = maker.buy_amt - tradeAmount;

            //Updating order data
            const one = await updateOffer(maker.id,newSellAmt,newBuyAmt);//updating maker order
            const two = await updateOffer(taker.id,0,0);//updating taker order

            const [order] = await getOfferForHash(maker.id);

            let tradeData = {
                ...{orderData : {
                    sell_amt : order.sell_amt,
                    sell_token : order.sell_token,
                    buy_amt :  order.buy_amt,
                    buy_token : order.buy_token,
                    owner : order.owner
                    }
                },
                signature : order.signature,
                ...{tradeData : data}
            }
            //let tradeData = {...{orderData : order}, ...{tradeData : data}};
            
            //Sign the data
            tradeData = await signOrder(tradeData);

            return tradeData;
        }
        else{
            console.log("Trade amount has to be greater than zero")
        }
    }
}

/**
 * Matches multiple offers
 * @param {*} order the order object 
 * @returns 
 */
const matchOffers = async (order) => {

    //Creating the offer first
    const [currentID] = await makeOffer(order.sell_amt,order.sell_token,order.buy_amt,order.buy_token,order.owner,order.timeStamp,order.signature,order.price,order.lowest_sell_price);
    
    //Get current offers stored in the database - that are sorted;
    const currentOffers = await getOffers(order.buy_token, order.sell_token, order.lowest_sell_price);
    
    //If there is no offers then return
    if(currentOffers.length == 0){
        return {status : "Order Added"};
    }

    //Match as many offers as you can for the taker
    let offerFilled = false;
    let count = 0;
    let orderFillAmount;
    let trade_data_arr = [];
    let currentOrder;


    while(!offerFilled && (count < currentOffers.length)){

        [currentOrder] = await getOffer(currentID.id);

        orderFillAmount = currentOrder.sell_amt - currentOffers[count].buy_amt;
        
        if(orderFillAmount > 0){
            //Trade - Partially filled

            //creating the trade data and adding it to the array
            trade_data_arr.push(await trade(currentOffers[count],currentOrder,currentOffers[count].buy_amt,true));
            
            //Get the next order
            count++;
        }
        else{
            //Trade - Fully Filled

            //Creating the trade data
            trade_data_arr.push(await trade(currentOffers[count],currentOrder,currentOrder.sell_amt,false));

            //Stoping the loop
            offerFilled = true;
        }
    }
    return trade_data_arr;
};

/**
 * Matches one single offer
 * @param {*} order the order object
 * @param {*} id the id of the order
 */
const matchOffer = async (order,id) =>{

    //Creating the offer first
    const [currentOrder] = await makeOffer(order.sell_amt,
        order.sell_token,
        order.buy_amt,
        order.buy_token,
        order.owner,
        order.timeStamp,
        order.signature,
        order.price,
        order.lowest_sell_price
    );

    //Getting the order that they want to take
    const [makerOrder] = await getOffer(id);

    //Calculating the order way 
    orderFillAmount = currentOrder.sell_amt - makerOrder.buy_amt;

    if(orderFillAmount > 0){
        //Partially filled order
        return await trade(makerOrder,currentOrder,makerOrder.buy_amt,true);

    }else{
        //Fully filled order
       return await trade(makerOrder,currentOrder,currentOrder.sell_amt,false);
    }
}

module.exports = {
    matchOffers,
    matchOffer
};