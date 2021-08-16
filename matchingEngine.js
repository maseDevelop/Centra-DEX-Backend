const { Pool } = require("pg");
const {getoffers} = require('./queries');
require('dotenv').config();

//Database setup
const pool = new Pool({
    user: process.env.POSTGRESUSER,
    host: "localhost",
    database: process.env.POSTGRESDATABASENAME,
    password: process.env.POSTGRESPASSWORD,
    port: 5432,
});

const matchOffers = async (sell_token, buy_token) => {

    //Get current offers stored in the database - that are sorted;
    const currentOffers = await getoffers(sell_token,buy_token,2);

    console.log(currentOffers);

};

module.exports = {
    matchOffers
};