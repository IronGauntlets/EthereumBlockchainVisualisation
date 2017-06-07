const express = require('express');
const path = require('path');
const app  = express();

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

// Middleware for logging requests
app.use(function(req, res, next){
  console.log(req.method + ' request recieved for URI: ' + req.url + ' at ' + new Date().toUTCString());
  console.log();
  next();
})

// Send files for these requests and for testing visualisations
app.use("/block/utils", express.static(path.join(__dirname + '/utils')));
app.use("/account/utils", express.static(path.join(__dirname + '/utils')));
app.use("/live/utils", express.static(path.join(__dirname + '/utils')));

// Send favicon
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname+'/favicon.ico'));
});

// Resquest for 2 node multiple single block transactions using gas
app.get('/block/two_node/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node.html'))
})

// Resquest for 2 node multiple single block transactions using ether
app.get('/block/two_node/:id/:count/ether', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node_ether.html'))
})

// Resquest for 3 node multiple single block transactions using gas
app.get('/block/three_node/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/three_node.html'))
})

// Resquest for 3 node multiple single block transactions using ether
app.get('/block/three_node/:id/:count/ether', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/three_node_ether.html'))
})

// Resquest for 3 node multiple single block transactions using gas
app.get('/account/:id/:block/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/account_transactions/account.html'))
})

// Resquest for 3 node multiple single block transactions using ether
app.get('/account/:id/:block/:count/ether', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/account_transactions/account_ether.html'))
})

// Resquest for 3 node multiple single block transactions using ether
app.get('/live/pending_transactions', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/live/pending_transactions.html'))
})

// Start listening when running on local node
var server = app.listen(8000, '0.0.0.0', function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
