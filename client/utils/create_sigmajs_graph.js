function createGraph(transactions, container) {
  var g = new TransactionGraph(transactions);

  var graphSettings = {
    minNodeSize: 1,
    maxNodeSize: 2,
    // minEdgeSize: 10,
    // maxEdgeSize: 10,
    scalingMode: "inside",
    sideMargin: 10
  }

  var forceConfig = {
    worker: true,
    barnesHutOptimize: true,
    // gravity: 18,
    strongGravityMode:true,
    slowDown: 50
  }

  var s = new sigma({
    graph: g,
    container: container,
    settings: graphSettings
  })
  //Start Force Atlas algorithm
  s.startForceAtlas2(forceConfig);
}
