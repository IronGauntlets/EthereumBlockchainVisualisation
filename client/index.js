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
  console.log();
  console.log(req.method + ' request recieved for URI: ' + req.url + ' at ' + new Date().toUTCString());
  next();
})

app.use("/utils", express.static(path.join(__dirname + '/utils')));
app.use("/test_visualisations", express.static(path.join(__dirname + '/test_visualisations')));

app.get('/test_multiple_blocks', function (req, res) {
  res.sendFile(path.join(__dirname+'/test_visualisations/test_multiple_blocks.html'));
});

app.get('/two_node_single_block_transactions/:id', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node_single_block_transactions.html'))
})

app.get('/two_node_multiple_block_transactions/:id/:count', function (req, res) {
  res.sendFile(path.join(__dirname+'/visualisations/block_transactions/two_node_multiple_block_transactions.html'))
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
