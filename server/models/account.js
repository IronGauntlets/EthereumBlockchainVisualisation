function Account(address, nonce, balance, storageRoot, codeHash) {
  this.address = address;                    //address of the account
  this.nonce = nonce;                        //nonce required to keep track of transactions from this account
  this.balance = balance;                    //Ether/wei associated with the account
  this.storageRoot = storageRoot || null;    //account's persistent storage
  this.codeHash = codeHash || null;          //account's code
}

//TODO: Use prototype to add functions to Account
//TODO: Create and call methods at intialisation, these methods will be private

module.exports = Account;
