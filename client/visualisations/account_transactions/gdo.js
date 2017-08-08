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
  var renderer = {
    container: container,
    type: 'canvas'
  }

  var graphSettings = {
    minNodeSize: 2,
    maxNodeSize: 4.5,
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
    renderer: renderer,
    settings: graphSettings
  })
  //Start Force Atlas algorithm
  s.startForceAtlas2(forceConfig);
  setTimeout(function() {
    s.killForceAtlas2();
  }, 360000);
}
