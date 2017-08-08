var paths = window.location.pathname.split('/');
var account = paths[2];
var blockNumberOrHash = paths[3];
var count = paths[4];
console.log(paths);

var isEther = false;

for (var i = 0; i < paths.length; i++) {
  console.log('Checking for \'ether\' in paths');
  if (paths[i] === 'ether') {
    isEther = true;
  }
}

var blockUrl = "http://146.169.46.80:3000/api/account";
if (isEther) {
  var url = blockUrl + '/' + account + '/' + blockNumberOrHash  + '/' + count + '/ether';
} else {
  var url = blockUrl + '/' + account + '/' + blockNumberOrHash  + '/' + count;
}

http.get(url, function(res, err) {
  if (res != null) {
    var graph = JSON.parse(res);
    console.log(graph);
    console.log("Nodes: " + graph.nodes.length);
    console.log("Edges: " + graph.edges.length);
    console.log(graph.nodes);
    console.log(graph.edges);
    createGraph(graph, 'container');
  } else {
    console.error('GET ERROR: ' + err);
  }
})

function createGraph(g, container) {
  var graphSettings = {
    minNodeSize: 1.5,
    maxNodeSize: 3.5,
    scalingMode: "inside",
    hideEdgesOnMove: true,
    labelThreshold: 100000000,
    singleHover: true,
    sideMargin: 3
  }

  var forceConfig = {
    worker: true,
    barnesHutOptimize: true,
    strongGravityMode:false,
    gravity: 10,
    scalingRatio: 0.08,
    startingIterations: 200,
    slowDown: 5
  }

  var s = new sigma({
    graph: g,
    container: container,
    settings: graphSettings
  })
  //Start Force Atlas algorithm
  s.startForceAtlas2(forceConfig);
  setTimeout(function() {
    s.killForceAtlas2();
  }, 360000);
}
