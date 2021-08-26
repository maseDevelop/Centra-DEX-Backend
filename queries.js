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

const makeOffer = (sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price) =>{
  return new Promise((resolve) => {

    // Initiate the Postgres transaction
      pool.query('BEGIN')
      pool.query('INSERT INTO order_table(sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price],
         (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
         }
      );
      pool.query('INSERT INTO update_order_table(sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price],
         (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
         }
      );
      pool.query('COMMIT');
  });
}

/*const makeOffer = (sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price) =>{
    return new Promise((resolve) => {
        pool.query(
         'INSERT INTO order_table(sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
           [sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signiture,price,lowest_sell_price],
           (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
           }
        );
    });
}*/

 

const updateOffer = (id, sell_amt, buy_amt) =>{
    return new Promise((resolve) => {
        pool.query(
         'UPDATE update_order_table SET sell_amt = $1, buy_amt = $2 WHERE id= $3 RETURNING id',
         [sell_amt,buy_amt,id],
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
        pool.query('BEGIN');
        pool.query(
         `DELETE FROM order_table WHERE id= $1 RETURNING *`,
          [id],
           (error, results) => {
             if (error) {
                 throw error;
             }
             resolve(results.rows);
           }
        );
        pool.query(
          `DELETE FROM update_order_table WHERE id= $1 RETURNING *`,
           [id],
            (error, results) => {
              if (error) {
                  throw error;
              }
              resolve(results.rows);
            }
        );
        pool.query('COMMIT');
    });
}

const getOffers = (sell_token, buy_token, lowest_price) =>{
    return new Promise((resolve) => {
        pool.query(
        `SELECT * FROM update_order_table WHERE sell_token = $1 AND buy_token = $2 AND price >= $3  ORDER BY price`,
        [sell_token, buy_token, lowest_price],
           (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
           }
        );
    });
}

const getOffer = (id) =>{
    return new Promise((resolve) => {
        pool.query(
        `SELECT * FROM update_order_table WHERE id = $1`,
        [id],
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
    getOffers,
    getOffer,
};