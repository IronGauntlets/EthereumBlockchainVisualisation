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
app.use("/utils", express.static(path.join(__dirname + '/utils')));

// Send favicon
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname+'/favicon.ico'));
});

// Resquest for 2 node multiple single block transactions
app.get('/block/two_node/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node_multiple_block_transactions.html'))
})

// Resquest for 3 node multiple single block transactions
app.get('/block/three_node/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/three_node_multiple_block_transactions.html'))
})

// Start listening when running on local node
var server = app.listen(8000, '0.0.0.0', function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
