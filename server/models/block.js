const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.46.159:8545"));
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const Account = require('./account.js');
const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/ethereum_blockchain';

function getBlock(id, callback) {
  mongoClient.connect(mongoURL, function(err, db) {
    if (err) {
      console.log('Unable to connet to MongoDB', err);
    }
    else {
      console.log();
      console.log('Connected successfully to the server');
      var blocksCollection = db.collection('blocks');
      blocksCollection.findOne({hash: id}, (err, resultBlock) => {
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
              else {
                console.log('Successfully inserted the Block ' + block.number + ' in MongoDB');
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
  for (var i = 0; i < block.transactions.length; i++) {
    updateTransaction(block.transactions[i], block.number);
  }
}

function updateTransaction(transaction, blockNumber) {
  var transactionReceipt = web3.eth.getTransactionReceipt(transaction.hash);
  var newSender = new Account(transaction.from);
  var newReciever;

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
  getBlock: getBlock
}
