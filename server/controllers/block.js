const express  = require('express');
const router = express.Router();

const Account = require('../models/account.js')
const TwoNodeTransactionGraph = require('../models/transaction_graph/two_node_transaction_graph.js');
const ThreeNodeTransactionGraph = require('../models/transaction_graph/three_node_transaction_graph.js');

//Return block as acquired from web3js with transaction objects for two node
router.get('/:id/two_node', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  proceesSingleBlock(req.params.id, twoNodeGraph);
  res.json(twoNodeGraph);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

//Return block as acquired from web3js with transaction objects for three node
router.get('/:id/three_node', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processSingleBlock(req.params.id, threeNodeGraph);
  //Delete the edgeCount property
  delete threeNodeGraph.edgeCount;
  res.json(threeNodeGraph);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

//Return multiple block according to the count requested.
router.get('/:id/two_node/:count', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, twoNodeGraph);
  res.json(twoNodeGraph);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

router.get('/:id/three_node/:count', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, threeNodeGraph);
  //Delete the edgeCount property
  delete threeNodeGraph.edgeCount;
  res.json(threeNodeGraph);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

function processSingleBlock(blockID, graph) {
  var block = web3.eth.getBlock(blockID, true);
  updateBlock(block, graph);
}

function processMultipleBlocks(blockID, count, graph) {
  var block = web3.eth.getBlock(blockID, true);
  for (var i = count; i > 0; i--) {
    console.log();
    console.log('Block number: ' + block.number + ' and i: ' + i);
    updateBlock(block, graph);
    block = web3.eth.getBlock(block.parentHash, true);
  }
}

function updateBlock(block, graph) {
  for (var i = 0; i < block.transactions.length; i++) {
    console.log("Block Transaction: " + i);
    updateTransaction(block.transactions[i], block.number, graph);
  }
}

function updateTransaction(transaction, blockNumber, graph) {
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

  graph.processTrasaction(transaction.from, transaction.to, transaction.hash, transaction.isNew);
}

module.exports = router;
