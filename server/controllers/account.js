const express  = require('express');
const router = express.Router();

const AccountTransactionGraph = require('../models/transaction_graph/account_transaction_graph.js');

router.get('/:id/:block/:count', function(req, res) {
  var accountGraph = new AccountTransactionGraph(req.params.id);
  accountGraph.processBlocks(req.params.block, req.params.count, null, jsonCallback, res, req);
});

router.get('/:id/:block/:count/ether', function(req, res) {
  var accountGraph = new AccountTransactionGraph(req.params.id);
  accountGraph.processBlocks(req.params.block, req.params.count, 'value', jsonCallback, res, req);
});

function jsonCallback(graph, response, request) {
  graph.deleteProperties();
  response.json(graph);
  console.log('Sending response for ' + request.method +' for URI: ' + request.url + ' at ' + new Date().toUTCString());
}

module.exports = router;
