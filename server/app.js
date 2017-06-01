const express = require('express');
const app  = express();

//Command for starting the server, however need to think abour corsdomain
//geth --nodiscover --rpc --rpccorsdomain="http://localhost:8545"
//geth --rpc --rpcaddr "146.169.46.159"  --rpcapi "eth,web3" --rpcport 8545 --networkid 4631

const apiPrefix = 'api';

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

// Middleware for logging requests
app.use(function(req, res, next){
  console.log();
  console.log(req.method + ' request recieved for URI: ' + req.url + ' at ' + new Date().toUTCString());
  next();
})

// Information about the api
app.get('/' + apiPrefix, function(req, res) {
  res.send("API for accessing Ethereum blockchain data.");
})

// Define and set routes
const account = require('./controllers/account.js');
app.use('/' + apiPrefix + '/account', account);

const block = require('./controllers/block.js');
app.use('/' + apiPrefix + '/block', block);

const blockchain = require('./controllers/blockchain.js');
app.use('/' + apiPrefix + '/blockchain', blockchain);

//Start listening when running on local node
var server = app.listen(3000, '0.0.0.0', function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
