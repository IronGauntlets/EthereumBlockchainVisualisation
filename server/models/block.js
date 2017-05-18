const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.46.159:8545"));

const Account = require('./account.js');
const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/ethereum_blockchain';

function getBlock(numberOrHash, callback) {
  mongoClient.connect(mongoURL, function(err, db) {
    if (err) {
      console.log('Unable to connet to MongoDB', err);
    }
    else {
      console.log('Connected successfully to the server');
      var blocksCollection = db.collection('blocks');
      blocksCollection.findOne({hash: numberOrHash}, (err, resultBlock) => {
        if (err) {console.log(err);}
        else {
          if (resultBlock) {
            db.close();
            callback(resultBlock);
          }
          else {
            var block = web3.eth.getBlock(numberOrHash, true);
            console.log();
            console.log('Updating Block: ' + block.number);
            updateBlock(block);
            // Add the new block to MongoDB
            blocksCollection.insertOne(block, (err, r) => {
              if (err) {console.log('Unable to insert block: ' + err);}
              else {
                console.log('Successfully inserted the Block ' + block.number + ' in MongoDB');
                db.close();
                callback(r.ops);
              }
            })
          }
        }
      })

    }
  })

  var block;
  // Query MongoDB
  if (false) {

  } else {
    block = web3.eth.getBlock(numberOrHash, true);
    console.log();
    console.log('Updating Block: ' + block.number);
    updateBlock(block);
    // Add the new block to MongoDB
    mongoClient.connect(mongoURL, function(err, db) {
      if (err) {
        console.log('Unable to connet to MongoDB', err);
      } else {
        console.log('Connected successfully to the server');
        insertBlock(block, db, funciton() {
          db.close();
        });
      }
    })
    callback(block);
  }
}

function insertBlock(block, db, callback) {
  //Get the blocks collection
  var blocksCollection = db.collection('blocks');
  //Insert the block in the collection
  blocksCollection.insertOne(block, function (err, r) {
    if (!err && 1 == r.insertedCount) {
      console.log('Successfully inserted the Block ' + block.number + ' in MongoDB');
      callback(r);
    } else {
      console.log('Unable to insert block', err);
    }
  })
}

function findBlock(id, callback) {
  var query = {hash: id};
  // options = {} Use for projecting if need be in the future, ie just get back transactions and parenthash
  mongoClient.connect(mongoURL, function(err, db) {
    if (err) {
      console.log('Unable to connet to MongoDB', err);
    } else {
      console.log('Connected successfully to the server');
      //Get the blocks collection
      var blocksCollection = db.collection('blocks');
      //Insert the block in the collection
      blocksCollection.findOne(block, function (err, resultBlock) {
        if (!err) {
          console.log('Successfully found the Block ' + resultBlock.hash + ' in MongoDB');
        } else {
          console.log('Unable to insert block', err);
        }
        // Close the db connection
        db.close();
      })
    }
  })
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
