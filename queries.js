//const { createAdapter } = require("@socket.io/postgres-adapter");
const { Pool } = require("pg");
require('dotenv').config();

//Database setup
const pool = new Pool({
    user: process.env.POSTGRESUSER,
    host: "localhost",
    database: process.env.POSTGRESDATABASENAME,
    password: process.env.POSTGRESPASSWORD,
    port: 5432,
});


/* SOCKET DB */
const changeUserBalance = (address,token_balance,balance) => {
    return new Promise((resolve) => {
       pool.query(
        'INSERT INTO user_balance(address,token_address,balance) VALUES($1,$2,$3) RETURNING id, address, token_address, balance',
          [address, token_balance, balance],
          (error, results) => {
            if (error) {
                throw error;
            }
            resolve(results.rows);
          }
       );
    });
};

const makeOffer = (sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price) =>{
    return new Promise((resolve) => {
        pool.query(
         'INSERT INTO order_table(sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
           [sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price],
           (error, results) => {
             if (error) {
                 throw error;
             }
             resolve(results.rows);
           }
        );
    });
}

const updateOffer = (id, sell_amt, buy_amt) =>{
    return new Promise((resolve) => {
        pool.query(
         `UPDATE order_table SET sell_amt = ${sell_amt}, buy_amt = ${buy_amt} WHERE id= ${id} RETURNING id`,
           
           (error, results) => {
             if (error) {
                 throw error;
             }
             resolve(results.rows);
           }
        );
    });
}

const takeOffer = (id) =>{
    return new Promise((resolve) => {
        pool.query(
         `DELETE FROM order_table WHERE id= ${id} RETURNING *`,
           (error, results) => {
             if (error) {
                 throw error;
             }
             resolve(results.rows);
           }
        );
    });
}

const getoffers = (sell_token, buy_token) =>{
    return new Promise((resolve) => {

        pool.query(
         `SELECT * FROM order_table WHERE sell_token = '${sell_token}' and buy_token = '${buy_token}'`,
           (error, results) => {
             if (error) {
                 throw error;
             }
             resolve(results.rows);
           }
        );
    });
}


module.exports = {
    changeUserBalance,
    makeOffer,
    updateOffer,
    takeOffer,
    getoffers,
};