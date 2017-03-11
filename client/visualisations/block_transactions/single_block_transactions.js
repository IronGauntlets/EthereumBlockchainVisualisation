var blockUrl = "http://127.0.0.1:3000/api/block";

// var blockNumberOrHash = 3320744;
// var blockNumberOrHash = 3312599;
var blockNumberOrHash = 3320787;
// var blockNumberOrHash = 3327346;
// var blockNumberOrHash = 3329340;
// var blockNumberOrHash = 2740710;
// var blockNumberOrHash = 3330615;

var url = blockUrl + '/' + blockNumberOrHash + '/WithTransactionsAndAccounts';

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
  var g = new TransactionGraph(transactions);

  var s = new sigma({
    graph: g,
    container: 'container',
    settings: {
    minNodeSize: 1,
    maxNodeSize: 1.5,
    minEdgeSize: 1,
    maxEdgeSize: 3,
    scalingMode: "inside",
    sideMargin: 20
  }
  })
  //Start Force Atlas algorithm
  s.startForceAtlas2({worker: true, barnesHutOptimize: false});
}
