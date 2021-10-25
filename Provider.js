const Web3 = require('web3');

class Provider {
  constructor() {
    //setup web3 provider
    this.web3 = new Web3(
      //Websocket connection to the development blockchain network
      new Web3("ws://127.0.0.1:8545"),
    )
  }
}

module.exports = Provider