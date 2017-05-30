const express  = require('express');
const router = express.Router();

const ToGraphML = require('./graphml_creator.js');
const TwoNodeTransactionGraph = require('../models/transaction_graph/two_node_transaction_graph.js');
const ThreeNodeTransactionGraph = require('../models/transaction_graph/three_node_transaction_graph.js');

//Return multiple block according to the count requested for two node using gas
router.get('/two_node/:id/:count', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  twoNodeGraph.processBlocks(req.params.id, req.params.count, null, jsonCallback, res, req);
})

//Return multiple block according to the count requested for two node using gas in graphml
router.get('/two_node/:id/:count/graphml', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  twoNodeGraph.processBlocks(req.params.id, req.params.count, null, graphMLCallback, res, req, true);
})

//Return multiple block according to the count requested for two node using ether
router.get('/two_node/:id/:count/ether', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  twoNodeGraph.processBlocks(req.params.id, req.params.count, 'value', jsonCallback, res, req);
})

//Return multiple block according to the count requested for two node using ether in graphml
router.get('/two_node/:id/:count/ether/graphml', function(req, res) {
  var twoNodeGraph = new TwoNodeTransactionGraph();
  twoNodeGraph.processBlocks(req.params.id, req.params.count, 'value', graphMLCallback, res, req, true);
})

//Return multiple block according to the count requested for three node using gas
router.get('/three_node/:id/:count', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, null, jsonCallback, res, req);
})

//Return multiple block according to the count requested for three node using gas in graphml
router.get('/three_node/:id/:count/graphml', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, null, graphMLCallback, res, req, false);
})

//Return multiple block according to the count requested for three node using ether
router.get('/three_node/:id/:count/ether', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, 'value', jsonCallback, res, req);
})

//Return multiple block according to the count requested for three node using ether in graphml
router.get('/three_node/:id/:count/ether/graphml', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, 'value', graphMLCallback, res, req, false);
})

function jsonCallback(graph, response, request) {
  graph.deleteProperties();
  response.json(graph);
  console.log('Sending response for ' + request.method +' for URI: ' + request.url + ' at ' + new Date().toUTCString());
}

function graphMLCallback(graph, response, request, directed) {
  graph.deleteProperties();
  var toGraphMl = new ToGraphML(graph, directed);
  toGraphMl.create();
  response.header('Content-Type','text/xml').send(toGraphMl.graphml);
  console.log('Sending response for ' + request.method +' for URI: ' + request.url + ' at ' + new Date().toUTCString());
}

module.exports = router;
