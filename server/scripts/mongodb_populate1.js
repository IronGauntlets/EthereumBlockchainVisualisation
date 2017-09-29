const Web3 = require('web3');
const fs = require("fs");
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.32.151:8545"));
const mongoDetails = JSON.parse(fs.readFileSync(path.join(__dirname + "/mongoconfig.json")));

const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://' + mongoDetails.username + ':' + mongoDetails.password + '@146.169.33.32:27020/Ethereum';
const mongodbCollection = 'blocks';

var blcNum = 500000;
var count  = 500000;

getBlocksRecursively(blcNum, count, ()=> {
  console.log('done');
});

function getBlocksRecursively(id, count, callback) {
  if (count > 0) {
    getBlock(id, (block) => {console.log('Block number: ' + block.number + ' and count: ' + count);
      getBlocksRecursively(block.parentHash, count-1, callback);
    })
  }
  else {
    callback()
  }
}

function getBlock(id, callback) {
  mongoClient.connect(mongoURL, (err, db) => {
    if (err) {console.log('Unable to connet to MongoDB', err);}
    else {console.log(); console.log('Connected successfully to the server');
      var blocksCollection = db.collection(mongodbCollection);
      blocksCollection.findOne({$or: [{hash: id}, {number: parseInt(id)}]}, (err, resultBlock) => {
        if (err) {console.log(err);}
        else {
          if (resultBlock) {
            db.close();
            console.log('Closed MongoDB connection');
            callback(resultBlock);
          }
          else {
            var block = web3.eth.getBlock(id, true);
            console.log('Updating Block: ' + block.number);
            updateBlock(block);
            // Add the new block to MongoDB
            blocksCollection.insertOne(block, (err, r) => {
              if (err) {console.log('Unable to insert block: ' + err);}
              else {console.log('Successfully inserted the Block ' + block.number + ' in MongoDB');
                db.close();
                console.log('Closed MongoDB connection');
                callback(r.ops[0]);
              }
            })
          }
        }
      })

    }
  })
}

function updateBlock(block) {
  console.log('Updating ' + block.transactions.length +  ' transactions' );
  block.difficulty = block.difficulty.toString(10);
  block.totalDifficulty = block.totalDifficulty.toString(10);
  for (var i = 0; i < block.transactions.length; i++) {
    updateTransaction(block.transactions[i], block.number);
  }
}

function updateTransaction(transaction, blockNumber) {
  var transactionReceipt = web3.eth.getTransactionReceipt(transaction.hash);
  var newSender = new Account(transaction.from);
  var newReciever;

  transaction.value = transaction.value.toString(10);
  transaction.gasPrice = transaction.gasPrice.toString(10);
  transaction.gasUsed = transactionReceipt.gasUsed;
  transaction.cumulativeGasUsed = transactionReceipt.cumulativeGasUsed;
  transaction.isNew = false;

  //When a transaction is a contract creation
  if (transaction.to == null) {
    var address = transactionReceipt.contractAddress;
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
