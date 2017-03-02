function Transaction(transaction) {
  this.hash = transaction.hash;                            //: String, 32 Bytes - hash of the transaction.
  this.nonce = transaction.nonce;                          //: Number - the number of transactions made by the sender prior to this one.
  this.blockHash = transaction.blockHash;                  //: String, 32 Bytes - hash of the block where this transaction was in. null when its pending.
  this.blockNumber = transaction.blockNumber;              //: Number - block number where this transaction was in. null when its pending.
  this.transactionIndex = transaction.transactionIndex;    //: Number - integer of the transactions index position in the block. null when its pending.
  this.from = transaction.from;                            //: String, 20 Bytes - address of the sender.
  this.to = transaction.to;                                //: String, 20 Bytes - address of the receiver. null when its a contract creation transaction.
  this.value = transaction.value;                          //: BigNumber value transferred in Wei.
  this.gasPrice = transaction.gasPrice;                    //: BigNumber - gas price provided by the sender in Wei.
  this.gas = transaction.gas;                              //: Number - gas provided by the sender.
  this.input = transaction.input;                          //: String - the data sent along with the transaction.
  this.s = transaction.s;                                  // s, r and v values corresponding to the signature  
  this.r = transaction.r;                                  // of the transaction and used to determine
  this.v = transaction.v;                                  // the sender of the transaction
}

//TODO: Use prototype to add functions to Account
//TODO: Create and call methods at intialisation, these methods will be private

module.exports = Transaction;
