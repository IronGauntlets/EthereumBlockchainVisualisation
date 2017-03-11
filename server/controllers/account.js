const express  = require('express');
const router = express.Router();

var Account = require('../models/account.js');

router.get('/:id', function(req, res) {
  var accountAddress = req.params.id;
  var account = new Account(accountAddress);
  res.json(account);
  console.log('Sending response for ' + req.method +' for URI: ' + req.url + ' at ' + new Date().toUTCString());
});

module.exports = router;
