var nodes = [];
var edges = [];

var edgeCount = 0;

function ThreeNodeTransactionGraph(transactions) {
  threeNodeTransactionGraph(transactions);
  console.log('Edges length: ' + edges.length);
  console.log('Nodes length: ' + nodes.length);
  this.nodes = nodes;
  this.edges = edges;
}

function threeNodeTransactionGraph(transactions) {
  for (var i = 0; i < transactions.length; i++) {
    processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash)
  }
}

function processTransaction(sender, reciever, transactionHash) {
  // Determine whether the sender and reciever are already in nodes
  var senderInNodes = contains(nodes, sender);
  var recieverInNodes = contains(nodes, reciever);
  // When both the sender and reciever are same
  if (sender.address === reciever.address) {
    if (!senderInNodes) nodes.push(createNode(sender));
  }  else {
    //When both sender and reciever are not in nodes
    if (!senderInNodes && !recieverInNodes) {
      //Add both sender and reciever to nodes
      nodes.push(createNode(sender));
      nodes.push(createNode(reciever));
    }
    //Either sender or reciever is in nodes
    else {
      //If sender is not in nodes then add sender and vise versa
      if (!senderInNodes && recieverInNodes) nodes.push(createNode(sender));
      if (!recieverInNodes && senderInNodes) nodes.push(createNode(reciever));
    }
  }
  //Always create the transaction node and edges between the transaction and sender and reciever
  nodes.push(new TransactionNode(transactionHash));
  createEdges(transactionHash, sender, reciever);
}

function createEdges(transactionHash, sender, reciever) {
  if (reciever.isContract && reciever.new) {
    edges.push(new ContractCreationEdge(edgeCount, sender.address, transactionHash));
    edgeCount++;
    edges.push(new ContractCreationEdge(edgeCount, transactionHash, reciever.address));
    edgeCount++;
  } else {
    edges.push(new Edge(edgeCount, sender.address, transactionHash));
    edgeCount++;
    edges.push(new Edge(edgeCount, transactionHash, reciever.address));
    edgeCount++;
  }
}

function createNode(senderOrReciever) {
  if (senderOrReciever.isContract) {
    return new ContractNode(senderOrReciever.address);
  } else {
    return new AccountNode(senderOrReciever.address);
  }
}

function TransactionNode(hash) {
  this.id = hash;
  this.x = Math.random();
  this.y = Math.random();
  this.size = 1;
  this.color = '#1b7a91';
}

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
