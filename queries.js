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
const changeUserBalance = (address, token_balance, balance) => {
  return new Promise((resolve) => {
    pool.query(
      `INSERT INTO user_balance(address,token_address,balance) VALUES($1,$2,$3)
      ON CONFLICT (address,token_address) DO UPDATE SET balance = $3`,
      [address, token_balance, balance],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows); }
    );
  });
};

const incrementUserBalance = (address, token_balance, value) => {
  return new Promise((resolve) => {
    pool.query(
      `INSERT INTO user_balance(address,token_address,balance) VALUES($1,$2,$3)
      ON CONFLICT (address,token_address) DO user_balance UPDATE SET balance = user_balance.balance + $3`,
      [address, token_balance, value],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows); }
    );
  });
};

const decrementUserBalance = (address, token_balance, value) => {
  return new Promise((resolve) => {
    pool.query(
      `INSERT INTO user_balance(address,token_address,balance) VALUES($1,$2,$3)
      ON CONFLICT (address,token_address) DO user_balance UPDATE SET balance = user_balance.balance - $3`,
      [address, token_balance, value],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows); }
    );
  });
};

const makeOffer = (sell_amt, sell_token, buy_amt, buy_token, owner, timeStamp, signature, price, lowest_sell_price) => {
  return new Promise((resolve) => {

    // Initiate the Postgres transaction
    pool.query('BEGIN')
    pool.query('INSERT INTO order_table(sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signature,price,lowest_sell_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [sell_amt, sell_token, buy_amt, buy_token, owner, timeStamp, signature, price, lowest_sell_price],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );
    pool.query('INSERT INTO update_order_table(sell_amt,sell_token,buy_amt,buy_token,owner,timeStamp,signature,price,lowest_sell_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [sell_amt, sell_token, buy_amt, buy_token, owner, timeStamp, signature, price, lowest_sell_price],
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
                
const tradeBalances = (taker_order_id, taker_address, taker_token, taker_sell_amt, maker_order_id, maker_address, maker_token, maker_buy_amt) => {
  return new Promise((resolve) => {
    pool.query('BEGIN');
    //Removing token from taker
    pool.query(
      `UPDATE user_balance SET balance = user_balance.balance - $1 WHERE address = $2 AND token_address = $3`,
      [taker_sell_amt, taker_address, taker_token],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );

    //Removing token from maker
    pool.query(
      `UPDATE user_balance SET balance = user_balance.balance - $1 WHERE address = $2 AND token_address = $3`,
      [maker_buy_amt, maker_address, maker_token],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );
    
    //Add token to the makers balance
      pool.query(
      `INSERT INTO user_balance(address,token_address,balance) VALUES($1,$2,$3) ON CONFLICT (address,token_address) DO UPDATE SET balance = user_balance.balance + $3`,
      [taker_address, maker_token, maker_buy_amt],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );

    //Add token to the takers balance
    pool.query(
      `INSERT INTO user_balance(address,token_address,balance) VALUES($1,$2,$3) ON CONFLICT (address,token_address) DO UPDATE SET balance = user_balance.balance + $3`,
      [maker_address, taker_token, taker_sell_amt],
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

const getOfferForHash = (id) => {
  return new Promise((resolve) => {
    pool.query(
      'SELECT sell_amt, sell_token, buy_amt, buy_token, owner, signature FROM order_table WHERE id = $1',
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

const updateOffer = (id, sell_amt, buy_amt) => {
  return new Promise((resolve) => {
    pool.query(
      'UPDATE update_order_table SET sell_amt = $1, buy_amt = $2 WHERE id= $3 RETURNING id',
      [sell_amt, buy_amt, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );
  });
}

const deleteOffer = (id) => {
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

const getOffers = (sell_token, buy_token, lowest_price) => {
  return new Promise((resolve) => {
    pool.query(
      `SELECT * FROM update_order_table WHERE sell_token = $1 AND sell_amt > 0 AND buy_token = $2 AND buy_amt > 0 AND price >= $3  ORDER BY price`,
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

const getOffer = (id) => {
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
  deleteOffer,
  getOffers,
  getOffer,
  getOfferForHash,
  tradeBalances,
  decrementUserBalance,
  incrementUserBalance,
}

