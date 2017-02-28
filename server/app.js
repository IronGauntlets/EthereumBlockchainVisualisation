const express = require('express');
const app  = express();

// For working locally, will need to disable once running on dedicated server
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.get('/', function(req, res) {
  res.send("API for accessing Ethereum blockchain data.");
})

// Define and set routes
const account = require('./controllers/account.js');
app.use('/account', account);

const block = require('./controllers/block.js');
app.use('/block', block);

const transaction = require('./controllers/transaction.js');
app.use('/transaction', transaction);

const blockchain = require('./controllers/blockchain.js');
app.use('/blockchain', blockchain);

var server = app.listen(3000, 'localhost', function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
