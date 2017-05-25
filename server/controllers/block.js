const express  = require('express');
const router = express.Router();

const Block = require('../models/block.js');
const ToGraphML = require('./graphml_creator.js');
const TwoNodeTransactionGraph = require('../models/transaction_graph/two_node_transaction_graph.js');
const ThreeNodeTransactionGraph = require('../models/transaction_graph/three_node_transaction_graph.js');

//Return block as acquired from web3js with transaction objects for two node
router.get('/:id/two_node', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processSingleBlock(req.params.id, twoNodeGraph, () => {
    twoNodeGraph.deleteProperties();
    res.json(twoNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return block as acquired from web3js with transaction objects for two node in graphml
router.get('/:id/two_node/graphml', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processSingleBlock(req.params.id, twoNodeGraph, () => {
    twoNodeGraph.deleteProperties();
    var toGraphMl = new ToGraphML(twoNodeGraph, true);
    toGraphMl.create();
    res.header('Content-Type','text/xml').send(toGraphMl.graphml);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return block as acquired from web3js with transaction objects for three node
router.get('/:id/three_node', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processSingleBlock(req.params.id, threeNodeGraph, () => {
    threeNodeGraph.deleteProperties();
    res.json(threeNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  })
})

//Return block as acquired from web3js with transaction objects for three node in graphml
router.get('/:id/three_node/graphml', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processSingleBlock(req.params.id, threeNodeGraph, () => {
    threeNodeGraph.deleteProperties();
    var toGraphMl = new ToGraphML(threeNodeGraph, true);
    toGraphMl.create();
    res.header('Content-Type','text/xml').send(toGraphMl.graphml);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  })
})

//Return multiple block according to the count requested for two node
router.get('/:id/two_node/:count', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, twoNodeGraph, () => {
    twoNodeGraph.deleteProperties();
    res.json(twoNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return multiple block according to the count requested for two node in graphml
router.get('/:id/two_node/:count/graphml', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, twoNodeGraph, () => {
    twoNodeGraph.deleteProperties();
    var toGraphMl = new ToGraphML(twoNodeGraph, true);
    toGraphMl.create();
    res.header('Content-Type','text/xml').send(toGraphMl.graphml);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return multiple block according to the count requested for three node
router.get('/:id/three_node/:count', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, threeNodeGraph, () => {
    threeNodeGraph.deleteProperties();
    res.json(threeNodeGraph);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

//Return multiple block according to the count requested for three node in graphml
router.get('/:id/three_node/:count/graphml', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  processMultipleBlocks(req.params.id, req.params.count, threeNodeGraph, () => {
    threeNodeGraph.deleteProperties();
    var toGraphMl = new ToGraphML(threeNodeGraph, true);
    toGraphMl.create();
    res.header('Content-Type','text/xml').send(toGraphMl.graphml);
    console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
  });
})

function processSingleBlock(blockId, graph, callback) {
  //Get the relevant block
  Block.getBlock(blockId, (r) => {
    processTransactionsToGraph(r.transactions, graph);
    callback();
  })
}

function processMultipleBlocks(blockId, count, graph, callback) {
  if (count > 0) {
    Block.getBlock(blockId, (block) => {
      console.log('Block number: ' + block.number + ' and count: ' + count);
      processTransactionsToGraph(block.transactions, graph);
      processMultipleBlocks(block.parentHash, count-1, graph, callback);
    })
  } else {
    callback();
  }
}

function processTransactionsToGraph(transactions, graph) {
  console.log("Processing transactions");
  for (var i = 0; i < transactions.length; i++) {
    graph.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew);
  }
}

module.exports = router;
