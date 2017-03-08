const express  = require('express');
const router = express.Router();

router.get('/:id', function(req, res) {
  var blockNumberOrHash = req.params.id;
  var block = web3.eth.getBlock(blockNumberOrHash);
  console.log(block);
  res.json(block);
});

router.get('/:id/transactions', function(req, res) {
  var blockNumberOrHash = req.params.id;
  var block = web3.eth.getBlock(blockNumberOrHash, true);
  console.log(block);
  res.json(block);
})

module.exports = router;
