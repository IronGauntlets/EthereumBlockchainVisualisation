const express = require('express');
const path = require('path');
const app  = express();
const vmAddr = '146.169.46.159';

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
app.use("/test_visualisations", express.static(path.join(__dirname + '/test_visualisations')));

// Test two node visualisation that has been stored locally
app.get('/test_three_node_multiple_blocks', function (req, res) {
  res.sendFile(path.join(__dirname+'/test_visualisations/test_three_node_multiple_blocks.html'));
});

// Test three node visualisation that has been stored locally
app.get('/test_two_node_multiple_blocks', function (req, res) {
  res.sendFile(path.join(__dirname+'/test_visualisations/test_two_node_multiple_blocks.html'));
});

// Resquest for 2 node single block transactions
app.get('/two_node_single_block_transactions/:id', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node_single_block_transactions.html'))
})

// Resquest for 3 node single block transactions
app.get('/three_node_single_block_transactions/:id', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/three_node_single_block_transactions.html'))
})

// Resquest for 2 node multiple single block transactions
app.get('/two_node_multiple_block_transactions/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node_multiple_block_transactions.html'))
})

// Resquest for 3 node multiple single block transactions
app.get('/three_node_multiple_block_transactions/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/three_node_multiple_block_transactions.html'))
})

//Start listening when running on local node
// var server = app.listen(8000, 'localhost', function(){
//   var host = server.address().address;
//   var port = server.address().port;
//
//   console.log('Example app listening at http://%s:%s', host, port);
// });

//Start listening when running on VM
var server = app.listen(8000, vmAddr, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
