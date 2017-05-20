const express  = require('express');
const router = express.Router();

const Block = require('../models/block.js');
const TwoNodeTransactionGraph = require('../models/transaction_graph/two_node_transaction_graph.js');
const ThreeNodeTransactionGraph = require('../models/transaction_graph/three_node_transaction_graph.js');

//Return block as acquired from web3js with transaction objects for two node
router.get('/:id/two_node', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processSingleBlock(req.params.id, twoNodeGraph, () => {
    res.json(twoNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return block as acquired from web3js with transaction objects for three node
router.get('/:id/three_node', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processSingleBlock(req.params.id, threeNodeGraph, () => {
    //Delete the edgeCount property
    delete threeNodeGraph.edgeCount;
    res.json(threeNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  })
})

//Return multiple block according to the count requested for two node
router.get('/:id/two_node/:count', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, twoNodeGraph, () => {
    res.json(twoNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return multiple block according to the count requested for three node
router.get('/:id/three_node/:count', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, threeNodeGraph, () => {
    //Delete the edgeCount property
    delete threeNodeGraph.edgeCount;
    res.json(threeNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

function processSingleBlock(blockID, graph, callback) {
  //Get the relevant block
  Block.getBlock(blockID, (r) => {
    processTransactionsToGraph(r.transactions, graph);
    callback();
  })
}

function processMultipleBlocks(blockID, count, graph, callback) {
  if (count > 0) {
    Block.getBlock(blockID, (block) => {
      console.log();
      console.log('Block number: ' + block.number + ' and count: ' + count);
      processTransactionsToGraph(block.transactions, graph);
      processMultipleBlocks(block.parentHash, count-1, graph, callback);
    })
  } else {
    callback();
  }
}

function processTransactionsToGraph(transactions, graph) {
  for (var i = 0; i < transactions.length; i++) {
    console.log("Block Transaction: " + i);
    graph.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew);
  }
}

module.exports = router;
