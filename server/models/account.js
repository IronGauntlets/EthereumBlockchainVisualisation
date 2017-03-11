function Account(address) {
  this.address = address;                                                          //address of the account
  this.transactionCount = web3.eth.getTransactionCount(this.address);              //nonce required to keep track of transactions from this account

  //NOTE: Javascript doesn't natively handle big numbers very well, hence a sting is returned
  this.balance = web3.eth.getBalance(this.address).toString(10);                   //Ether/wei associated with the account

  //Get Contract code and set whether the account is contract or not
  this.code = web3.eth.getCode(this.address);

  this.isContract = true;                                                         //Check whether the account is contract or not
  if (this.code === '0x') {
    this.isContract = false;
  }

  //Populate the below fields as necessary
  this.storageRoot = null;                                                         //account's persistent storage (may not be feasible)
  this.transactions = null;                                                        //transactions sent by this account
}

// TODO: Use prototype to add functions to Account if needed

module.exports = Account;
