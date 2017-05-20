const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.46.159:8545"));
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function Account(address) {
  this.address = address;

  //Populate the below fields as necessary
  this.code;
  this.isContract;
  this.transactionCount;
  this.balance;
  this.transactions;
}

//Number of trasactions in the given block
Account.prototype.getTransactionCount = function(blockNumber) {
  this.transactionCount = {
    transactionCount: web3.eth.getTransactionCount(this.address, blockNumber),
    blockNumber: blockNumber
  }
  return this.transactionCount;
}

// Account's balance in a given block
Account.prototype.getBalance = function(blockNumber) {
  //Javascript doesn't natively handle big numbers very well, hence a sting is returned
  this.balance = {
    balance: web3.eth.getBalance(this.address, blockNumber).toString(10),
    blockNumber: blockNumber
  }
  return this.balance;
}

// Account' code given a block
Account.prototype.getCode = function(blockNumber) {
  this.code = {
    code: web3.eth.getCode(this.address, blockNumber),
    blockNumber: blockNumber
  }
  this.isContract = true;

  if (this.code.code === '0x') {
    this.isContract = false;
  }

  return this.code;
}

module.exports = Account;
