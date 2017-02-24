var express = require('express');
var app  = express();

// Handle all of requests
app.get('/', function(req, res) {
  res.send("Hello World");
})

var server = app.listen(8081, 'localhost', function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
})
