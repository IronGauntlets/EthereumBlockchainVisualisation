const express  = require('express');
const router = express.Router();

//Return block as acquired from web3js with only transaction hashes
router.get('/:id', function(req, res) {
  var blockNumberOrHash = req.params.id;
  var block = web3.eth.getBlock(blockNumberOrHash);
  res.json(block);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
});

//Return block as acquired from web3js with transaction objects
router.get('/:id/WithTransactions', function(req, res) {
  var blockNumberOrHash = req.params.id;
  var block = web3.eth.getBlock(blockNumberOrHash, true);
  res.json(block);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

//Return multiple block according to the count requested.
router.get('/:id/WithTransactionsAndTccounts', function(req, res) {
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
})

module.exports = router;
