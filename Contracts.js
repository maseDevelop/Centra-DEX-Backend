const Provider = require('./Provider')

const provider = new Provider()

class Contract {
  constructor(abi,address) {
    this.abi = abi
    this.address = address
    this.web3 = provider.web3
  }
  // create contract instance
  initContract() {
    const instance = new this.web3.eth.Contract(this.abi, this.address);
    return instance
  }
}
module.exports = Contract;