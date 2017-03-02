function Transaction() {
  this.hash;                //: String, 32 Bytes - hash of the transaction.
  this.nonce;               //: Number - the number of transactions made by the sender prior to this one.
  this.blockHash;           //: String, 32 Bytes - hash of the block where this transaction was in. null when its pending.
  this.blockNumber;         //: Number - block number where this transaction was in. null when its pending.
  this.transactionIndex;    //: Number - integer of the transactions index position in the block. null when its pending.
  this.from;                //: String, 20 Bytes - address of the sender.
  this.to;                  //: String, 20 Bytes - address of the receiver. null when its a contract creation transaction.
  this.value;               //: BigNumber value transferred in Wei.
  this.gasPrice;            //: BigNumber - gas price provided by the sender in Wei.
  this.gas;                 //: Number - gas provided by the sender.
  this.input;               //: String - the data sent along with the transaction.
  this.s;                   //
  this.r;                   //Values corresponding to the signature of the transaction and used to determine the sender of the transaction
  this.v;                   //
}

//TODO: Use prototype to add functions to Account
//TODO: Create and call methods at intialisation, these methods will be private

module.exports = Transaction;
