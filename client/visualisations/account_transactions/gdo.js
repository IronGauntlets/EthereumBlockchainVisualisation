var paths = window.location.pathname.split('/');
var account = paths[2];
var blockNumberOrHash = paths[3];
var count = paths[4];
var isEther = false;
var nodeSizeThreshold = 20000;

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

var graph;

http.get(url, function(res, err) {
  if (res != null) {
    graph = JSON.parse(res);
    console.log(graph);
    console.log("Nodes: " + graph.nodes.length);
    console.log("Edges: " + graph.edges.length);
    console.log(graph.nodes);
    console.log(graph.edges);
    createGraph(graph, 'container');

    document.getElementById('info1').innerHTML = 'Starting Block number or hash = ' + blockNumberOrHash;
    document.getElementById('info2').innerHTML = 'Starting Block Mined @ ' + graph.minedAt;
    document.getElementById('info3').innerHTML  ='Blocks = ' + count;
    document.getElementById('info4').innerHTML  ='Active Blocks = ' + graph.activeBlocks;
    document.getElementById('info5').innerHTML = 'Nodes = ' + graph.nodes.length;
    document.getElementById('info6').innerHTML  ='Edges = ' + graph.edges.length;

    document.getElementById('acc1').innerHTML  ='Account Address = \n' + graph.account;
    document.getElementById('acc2').innerHTML = 'Externally Owned Accounts = ' + graph.eoas;
    document.getElementById('acc3').innerHTML  ='Contract Account = ' + graph.contracts;

    document.getElementById('gas1').innerHTML = 'Maximum = ' + graph.maxGas;
    document.getElementById('gas2').innerHTML  ='Minimum = ' + graph.minGas;
    document.getElementById('gas3').innerHTML = 'Average = ' + graph.averageGas;
    document.getElementById('gas4').innerHTML = 'Total = ' + graph.totalGas;

    document.getElementById('eth1').innerHTML = 'Maximum = ' + graph.maxEther;
    document.getElementById('eth2').innerHTML  ='Minimum = ' + graph.minEther;
    document.getElementById('eth3').innerHTML = 'Average = ' + graph.averageEther;
    document.getElementById('eth4').innerHTML = 'Total = ' + graph.totalEther;

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
      forceConfig.scalingRatio = 90;
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
