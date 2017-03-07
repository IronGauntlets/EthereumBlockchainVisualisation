const express  = require('express');
const router = express.Router();

var Account = require('../models/account.js');

router.get('/:id', function(req, res) {
  var accountAddress = req.params.id;
  var account = new Account(accountAddress);
  console.log(account);
  res.json(account);
});

module.exports = router;
