const Provider = require('./Provider')

const provider = new Provider()




class Contract {
  constructor(abi,address) {
    //console.log("ABI:", ABI);
    //console.log("ADDRESS: ", ADDRESS);
    this.abi = abi
    this.address = address
    this.web3 = provider.web3
  }
  // create contract instance
  initContract() {
    //const networkId = await this.web3.eth.getID(); 
    //console.log("log: ", networks[networkId].address)
    //console.log(ABI)
    const instance = new this.web3.eth.Contract(this.abi, this.address);

    return instance
  }
}
module.exports = Contract;