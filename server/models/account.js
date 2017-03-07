function Account(address) {
  this.address = address;                                    //address of the account
  this.transactionCount = getTransactionCount(this.address); //nonce required to keep track of transactions from this account
  this.balance = getBalance(this.address);                   //Ether/wei associated with the account
  this.isContract = isContract(this.address);                //Check whether the account is contract or not

  //Populate the below fields as necessary
  this.storageRoot = null;                                   //account's persistent storage
  this.codeHash = null;                                      //account's code
  this.transactionHashes = null;                             //Hashes of transactions sent by this account
}

//TODO: Use prototype to add functions to Account

// Create and call methods at intialisation, these methods will be private

//Get the number for transactions issued by this address
function getTransactionCount(address) {
  return web3.eth.getTransactionCount(address);
}

//Get balance of the account from blockchain for the address
function getBalance(address) {
  //NOTE: Javascript doesn't natively handle big numbers very well, hence a sting is returned
  return web3.eth.getBalance(address).toString(10);
}

//Determin whether the acoount
function isContract(address) {
  if (web3.eth.getCode(address) == '0x') {
    return false;
  } else {
    return true;
  }
}

module.exports = Account;
