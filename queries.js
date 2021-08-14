const { createAdapter } = require("@socket.io/postgres-adapter");
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



module.exports = {
    changeUserBalance,
};