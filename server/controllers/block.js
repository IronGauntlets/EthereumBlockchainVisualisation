const express  = require('express');
const router = express.Router();

// var Account = require('../models/account.js');

//Return block as acquired from web3js with only transaction hashes
router.get('/:id', function(req, res) {
  var block = web3.eth.getBlock(req.params.id);
  res.json(block);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
});

//Return block as acquired from web3js with transaction objects
router.get('/:id/WithTransactionsAndAccounts', function(req, res) {
  var block = web3.eth.getBlock(req.params.id, true);
  block = updateBlock(block);
  res.json(block);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

//Return multiple block according to the count requested.
router.get('/:id/WithTransactionsAndAccounts/:count', function(req, res) {
  var count = req.params.count;
  var block = web3.eth.getBlock(req.params.id, true);

  var totalTransactions = 0;

  var blocks = [];
  var allTransactions = [];

  for (var i = count; i > 0; i--) {
    console.log();
    console.log('Block number: ' + block.number + ' and i: ' + i);
    console.log();

    block = updateBlock(block);
    blocks.push(block);

    totalTransactions = totalTransactions + (block.transactions).length;
    allTransactions.push(block.transactions);
    block = web3.eth.getBlock(block.parentHash, true);
  }

  allTransactions = [].concat.apply([], allTransactions);

  console.log("totalTransactions: " + totalTransactions);
  console.log("allTransactions: "+ allTransactions.length);

  res.json({blocks: blocks, allTransactions:allTransactions});
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

function updateBlock(block) {
  for (var i = 0; i < block.transactions.length; i++) {
    console.log("Block Transaction: " + i);
    block.transactions[i] = updateTransaction(block.transactions[i]);
  }
  return block;
}

function updateTransaction(transaction) {
  var newSender = {};
  var newReciever = {};

  newSender.address = transaction.from;
  newSender.isContract = isContract(newSender.address);

  //When a transaction is a contract creation
  if (transaction.to == null) {
    newReciever.address = web3.eth.getTransactionReceipt(transaction.hash).contractAddress;
    newReciever.isContract = true;
    newReciever.new = true;
  } else {
    newReciever.address = transaction.to;

    var contract = isContract(newReciever.address);
    if (contract) {
      newReciever.new = false;
    }
    newReciever.isContract = contract;
  }

  transaction.from = newSender;
  transaction.to = newReciever;

  return transaction;
}

function isContract(address) {
  if (web3.eth.getCode(address) === "0x") {
    return false;
  } else {
    return true;
  }
}

// //The following code is too slow for large number of transactions since 53 transactions took 127 seconds
// function updateTransaction(transaction) {
//   //Get transaction receipt
//   var transactionReceipt = web3.eth.getTransactionReceipt(transaction.hash);
//   //Add cumalative gas used for the whole transaction to transaction object
//   transaction.cumulativeGasUsed = transactionReceipt.cumulativeGasUsed;
//   //If transaction was contract creation
//   transaction.contractAddress = transactionReceipt.contractAddress;
//   //Array of log objects that the transactions generated
//   transaction.logs = transactionReceipt.logs;
//
//   //Set sender and recievers as Account Objects
//   transaction.from = new Account(transaction.from);
//   transaction.to = new Account(transaction.to);
//
//   return transaction
// }

module.exports = router;
