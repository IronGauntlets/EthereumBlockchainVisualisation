var paths = window.location.pathname.split('/');
var account = paths[2];
var blockNumberOrHash = paths[3];
var count = paths[4];
var isEther = false;

for (var i = 0; i < paths.length; i++) {
  if (paths[i] === 'ether') {
    isEther = true;
  }
}

// var blockUrl = "http://146.169.46.80:3000/api/account";
var blockUrl = "http://146.169.32.151:3000/api/account";

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
  var r = {
    container: 'container',
    type: 'canvas'
  }

  var graphSettings = {
    scalingMode: "inside",
    hideEdgesOnMove: true,
    labelThreshold: 100000000,
    singleHover: true,
    sideMargin: 3
  }

  var forceConfig = {
    worker: true,
    startingIterations: 75,
    slowDown: 2
  }

  if (isEther) {
    graphSettings.minNodeSize = 1;
    graphSettings.maxNodeSize = 2;
  } else {
    graphSettings.minNodeSize = 1;
    graphSettings.maxNodeSize = 1.7;
  }

  if (g.nodes.length < 1000) {
    forceConfig.strongGravityMode = true;
  } else {
    forceConfig.barnesHutOptimize = true;

    if (g.nodes.length < 5000) {
      forceConfig.gravity = 100;
      forceConfig.scalingRatio = 7.25;
    } else if (g.nodes.length < 15000) {
      forceConfig.gravity = 1000;
      forceConfig.scalingRatio = 110;
    } else if (g.nodes.length < 25000) {
      forceConfig.gravity = 1000;
      forceConfig.scalingRatio = 70;
    } else {
      forceConfig.gravity = 1000;
      forceConfig.scalingRatio = 30;
    }

  }

  var s = new sigma({
    graph: g,
    renderer: r,
    settings: graphSettings
  })

  //Start Force Atlas algorithm
  s.startForceAtlas2(forceConfig);
  setTimeout(function() {
    s.killForceAtlas2();
  }, 300000);
}
