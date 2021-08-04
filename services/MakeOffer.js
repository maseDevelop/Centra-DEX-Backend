//Make Offer

const MakeOffer = (id, sell_amt, sell_token, buy_amt, buy_token, owner, expires, timestamp, orderFilled) => {

const currentOrder = {
    id: id,
    sell_amt: sell_amt,
    sell_token: sell_token,
    buy_amt: buy_amt,
    buy_token: buy_token,
    owner: owner,
    expires: expires,
    timestamp: timestamp,
    orderFilled: orderFilled
}

//Check Requirements
//Create the order
//Add it to the database
//

}

exports.MakeOffer = MakeOffer;
