const express  = require('express');
const router = express.Router();
const fs = require("fs");

const ToGraphML = require('./graphml_creator.js');
const ThreeNodeTransactionGraph = require('../models/transaction_graph/three_node_transaction_graph.js');
const TimeThreeNodeTransactionGraph = require('../models/transaction_graph/time_three_node_transaction_graph.js');

router.get('/three_node/:id/:count', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, null, jsonCallback, res, req);
})

router.get('/three_node/:id/:count/graphml', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, null, graphMLCallback, res, req, false);
})

router.get('/three_node/:id/:count/ether', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, 'value', jsonCallback, res, req);
})

router.get('/three_node/:id/:count/ether/graphml', function(req, res) {
  var threeNodeGraph = new ThreeNodeTransactionGraph();
  threeNodeGraph.processBlocks(req.params.id, req.params.count, 'value', graphMLCallback, res, req, false);
})

router.get('/time_three_node/:id/:count', function(req, res) {
  var timeThreeNodeGraph = new TimeThreeNodeTransactionGraph();
  timeThreeNodeGraph.processBlocks(req.params.id, req.params.count, null, jsonCallback, res, req);
})

router.get('/time_three_node/:id/:count/graphml', function(req, res) {
  var timeThreeNodeGraph = new TimeThreeNodeTransactionGraph();
  timeThreeNodeGraph.processBlocks(req.params.id, req.params.count, null, graphMLCallback, res, req, false);
})

router.get('/time_three_node/:id/:count/ether', function(req, res) {
  var timeThreeNodeGraph = new TimeThreeNodeTransactionGraph();
  timeThreeNodeGraph.processBlocks(req.params.id, req.params.count, 'value', jsonCallback, res, req);
})

router.get('/time_three_node/:id/:count/ether/graphml', function(req, res) {
  var timeThreeNodeGraph = new TimeThreeNodeTransactionGraph();
  timeThreeNodeGraph.processBlocks(req.params.id, req.params.count, 'value', graphMLCallback, res, req, false);
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
