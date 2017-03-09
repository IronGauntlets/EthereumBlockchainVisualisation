var blockUrl = "http://127.0.0.1:3000/api/block";
var blockNumberOrHash = 3320744;
//var blockNumberOrHash = 3312599;
var url = blockUrl + '/' + blockNumberOrHash + '/transactions';

http.get(url, function(res, err) {
  if (res != null) {
    var block = JSON.parse(res);
    var blockTransactions = block.transactions;

    createGraph(blockTransactions);
  } else {
    console.error('GET ERROR: ' + err);
  }
})

function createGraph(transactions) {
  var transactionGraph = new TransactionGraph(transactions);
  var g = {nodes: transactionGraph.nodes, edges: transactionGraph.edges};
  console.log(g)
  var s = new sigma({
    graph: g,
    container: 'container'
  })
}
