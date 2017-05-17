const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.46.159:8545"));

const Account = require('./account.js');
const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/ethereum_blockchain';

function getBlock(numberOrHash) {
  var block;
  // Or Query MongoDB
  if (false) {

  } else {
    block = web3.eth.getBlock(numberOrHash, true);
    console.log();
    console.log('Updating Block: ' + block.number);
    updateBlock(block);
    // Add the new block to MongoDB
  }
  return block;
}

function insertBlock(db, callback) {
  var blocksCollection = db.collection('blocks');

}

function findBlock(id, db, callback) {
  var blocksCollection = db.collection('blocks');
}

function updateBlock(block) {
  for (var i = 0; i < block.transactions.length; i++) {
    console.log('updating Transaction: ' + i );
    updateTransaction(block.transactions[i], block.number);
  }
}

function updateTransaction(transaction, blockNumber) {
  transaction.isNew = false;
  var newSender = new Account(transaction.from);
  var newReciever;

  //When a transaction is a contract creation
  if (transaction.to == null) {
    var address = web3.eth.getTransactionReceipt(transaction.hash).contractAddress;
    newReciever = new Account(address);
    transaction.isNew = true;
  } else {
    newReciever = new Account(transaction.to);
  }

  newSender.getCode(blockNumber);
  newReciever.getCode(blockNumber);

  transaction.from = newSender;
  transaction.to = newReciever;
}

module.exports = {
  getBlock: getBlock
}
