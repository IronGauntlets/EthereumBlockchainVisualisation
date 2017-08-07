const express  = require('express');
const router = express.Router();
const fs = require("fs");

const ToGraphML = require('./graphml_creator.js');
const TwoNodeTransactionGraph = require('../models/transaction_graph/two_node_transaction_graph.js');
const ThreeNodeTransactionGraph = require('../models/transaction_graph/three_node_transaction_graph.js');

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
  console.log('Sending response for ' + request.method +' for URI: ' + request.url + ' at ' + new Date().toUTCString());
  response.json(graph);
}

function graphMLCallback(graph, response, request, directed) {
  graph.deleteProperties();
  var toGraphMl = new ToGraphML(graph, directed, request.params.id, request.params.count);
  toGraphMl.create((filePath) => {
    var fileName = '' + request.params.id + '_' + request.params.count + '.graphml';
    response.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    response.setHeader('Content-Transfer-Encoding', 'binary');
    response.setHeader('Content-Type', 'application/octet-stream');
    console.log('Sending response for ' + request.method +' for URI: ' + request.url + ' at ' + new Date().toUTCString());
    response.sendFile(filePath , (err) => {
      if (err) {console.error('Send error' + err);}
      else {
        fs.unlink(filePath, function(err) {
          if (err) {return console.error('Delete error' + err);}
          console.log(fileName + " deleted successfully!");
        });
      }
    });
  });
}

module.exports = router;
