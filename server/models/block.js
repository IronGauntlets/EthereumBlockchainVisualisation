const Web3 = require('web3');
const fs = require("fs");

const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.32.151:8545"));
const mongoDetails = JSON.parse(fs.readFileSync("mongoconfig.json"));

const Account = require('./account.js');
const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://' + mongoDetails.username + ':' + mongoDetails.password + '@146.169.33.32:27020/Ethereum';
const mongodbCollection = 'blocks';

function getBlocks(id, count, callback) {
  var newId = parseInt(id);
  mongoClient.connect(mongoURL, (err, db) => {
    if (err) {console.log('Unable to connet to MongoDB', err);}
    else {console.log(); console.log('getBlocks: Connected successfully to the server');
      var blocksCollection = db.collection(mongodbCollection);
      var query = {number: {$lte: newId, $gt: (newId - count)}};
      blocksCollection.find(query).toArray((err, docs) => {
        if (err) {console.log(err);}
        else {
          if (count - docs.length == 0) {
            db.close();
            console.log('getBlocks: Closed MongoDB connection');
            callback(docs);
          } else {
            getBlocksRecursively(newId, count, [], (docs) => {
              console.log();
              console.log('length of block array: '+docs.length);
              db.close();
              console.log();
              console.log('getBlocks: Closed MongoDB connection');
              callback(docs);
            });
          }
        }
      });
    }
  })
}

function getBlocksRecursively(id, count, blocksArr, callback) {
  if (count > 0) {
    getBlock(id, (block) => {console.log('Block number: ' + block.number + ' and count: ' + count);
      blocksArr.push(block);
      getBlocksRecursively(block.parentHash, count-1, blocksArr, callback);
    })
  }
  else {
    callback(blocksArr)
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

module.exports = {
  getBlocks: getBlocks
}
