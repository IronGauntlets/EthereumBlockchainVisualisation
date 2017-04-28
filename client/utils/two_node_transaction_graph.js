var nodes = [];
var edges = [];

function TwoNodeTransactionGraph(transactions) {
  twoNodeTransactionGraph(transactions);
  console.log('Edges length: ' + edges.length);
  console.log('Nodes length: ' + nodes.length);
  this.nodes = nodes;
  this.edges = edges;
}

function twoNodeTransactionGraph(transactions) {
  for (var i = 0; i < transactions.length; i++) {
    processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash);
  }
}

function processTransaction(sender, reciever, transactionHash) {
  var senderInNodes = contains(nodes, sender);
  var recieverInNodes = contains(nodes, reciever);

  if (sender.address === reciever.address) {
    if (!senderInNodes) nodes.push(createNode(sender));
  }
  else {
    if (!senderInNodes && !recieverInNodes) {
      nodes.push(createNode(sender));
      nodes.push(createNode(reciever));
    }
    else {
      if (!senderInNodes && recieverInNodes) nodes.push(createNode(sender));
      if (!recieverInNodes && senderInNodes) nodes.push(createNode(reciever));
    }
  }
  edges.push(createEdge(transactionHash, sender, reciever));
}

function createNode(senderOrReciever) {
  if (senderOrReciever.isContract) {
    return new ContractNode(senderOrReciever.address);
  } else {
    return new AccountNode(senderOrReciever.address);
  }
}

function createEdge(transactionHash, sender, reciever) {
  if (reciever.isContract && reciever.new) {
    return new ContractCreationEdge(transactionHash, sender.address, reciever.address);
  } else {
    return new Edge(transactionHash, sender.address, reciever.address);
  }
}

// Colours:
// light green:#89c149
// musk yellow: #e3b93c
// bright green: #04c975
// aqua blue: #1b7a91
// aqua:#80b6ad
// light grey: #3f5e4d
//

function AccountNode(id) {
  this.id = id;
  this.x = Math.random();
  this.y = Math.random();
  this.size = 1;
  this.color = '#04c975';
}

function ContractNode(id) {
  this.id = id;
  this.x = Math.random();
  this.y = Math.random();
  this.size = 1;
  this.color = '#e3b93c';
}

function Edge(id, source, target){
  this.id = id;
  this.source = source;
  this.target = target;

  //Edge colour will be the same as nodes
  // if (source instanceof AccountNode) {
  //   this.color = '#04c975';
  // } else if (source instanceof ContractNode) {
  //   this.color = '#e3b93c';
  // }

  this.color = '#3f5e4d';
  this.type = 'arrow';
}

function ContractCreationEdge(id, source, target) {
  this.id = id;
  this.source = source;
  this.target = target;
  this.color = '#80b6ad';
  this.type = 'arrow';
}

function contains(list, senderOrReciever) {
  for (var i=0; i < list.length; i++) {
    var listId = list[i].id;
    if (listId === senderOrReciever.address){
      return true;
    }
  }
  return false;
}
