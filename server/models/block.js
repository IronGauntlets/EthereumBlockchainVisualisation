function Block(block) {
  this.number = block.number;                      //: Number - the block number. null when its pending block.
  this.hash = block.hash;                          //: String 32 Bytes - hash of the block. null when its pending block.
  this.parentHash = block.parentHash;              //: String 32 Bytes - hash of the parent block.
  this.nonce = block.nonce;                        //: String 8 Bytes - hash of the generated proof-of-work. null when its pending block.
  this.sha3Uncles = block.sha3Uncles;              //: String, 32 Bytes - SHA3 of the uncles data in the block.
  this.logsBloom = block.logsBloom;                //: String, 256 Bytes - the bloom filter for the logs of the block. null when its pending block.
  this.transactionsRoot = block.transactionsRoot;  //: String, 32 Bytes - the root of the transaction trie of the block
  this.stateRoot = block.stateRoot;                //: String, 32 Bytes - the root of the final state trie of the block.
  this.miner = block.miner;                        //: String, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  this.difficulty = block.difficulty;              //: BigNumber - integer of the difficulty for this block.
  this.totalDifficulty = block.totalDifficulty;    //: BigNumber - integer of the total difficulty of the chain until this block.
  this.extraData = block.extraData;                //: String - the "extra data" field of this block.
  this.size = block.size;                          //: Number - integer the size of this block in bytes.
  this.gasLimit = block.gasLimit;                  //: Number - the maximum gas allowed in this block.
  this.gasUsed = block.gasUsed;                    //: Number - the total used gas by all transactions in this block.
  this.timestamp = block.timestamp;                //: Number - the unix timestamp for when the block was collated.
  this.transactions = block.transactions;          //: Array - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  this.uncles = block.uncles;                      //: Array - Array of uncle hashes
  this.mixHash = block.mixHash;                    //: String 32 Bytes - hash of the transactionsRoot, stateRoot and receiptsRoot.
  this.receiptsRoot = block.receiptsRoot;          //: String, 32 Bytes - the root of the transaction receipt trie of the block
}

//TODO: Use prototype to add functions to Account
//TODO: Create and call methods at intialisation, these methods will be private

module.exports = Block;
