const { Pool } = require("pg");
const {getoffers} = require('./queries');
const {GetPrice} = require('./helpers');
require('dotenv').config();

//Database setup
const pool = new Pool({
    user: process.env.POSTGRESUSER,
    host: "localhost",
    database: process.env.POSTGRESDATABASENAME,
    password: process.env.POSTGRESPASSWORD,
    port: 5432,
});

const _trade = () =>{

}

const matchOffers = async (order) => {

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


    while(!offerFilled && !(count = currentOffers.length)){

        orderFillAmount = order.sell_amt; - currentOffers[count].buy_amt;

        if(orderFillAmount > 0){

            //Trade - Partially filled
            


            //Get the next order
            count++;
        }
        else{

            //Trade - Fully Filled

            //Order finished
            offerFilled = true;
        }
    }
};

module.exports = {
    matchOffers
};