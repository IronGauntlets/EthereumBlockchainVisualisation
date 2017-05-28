const Edge = require('./edge.js');
const Node = require('./node.js');
const Block = require('../block.js');

const defaultSize = 1;
const contractNodeColor = '#e3b93c';
const accountNodeColor = '#04c975';

// Base class for creating different graphs
function TransactionGraph() {
  this.nodes = [];
  this.edges = [];
  this.nodesHashMap = {};
}

TransactionGraph.prototype.processSingleBlock = function(blockId, callback, request, response) {
  //Get the relevant block
  Block.getBlock(blockId, (r) => {
    this.processTransactionsToGraph(r.transactions);
    callback(this, request, response);
  })
}

TransactionGraph.prototype.processMultipleBlocks = function(blockId, count, callback, request, response) {
  if (count > 0) {
    Block.getBlock(blockId, (block) => {
      console.log('Block number: ' + block.number + ' and count: ' + count);
      this.processTransactionsToGraph(block.transactions);
      this.processMultipleBlocks(block.parentHash, count-1, callback, request, response);
    })
  } else {
    callback(this, request, response);
  }
}

TransactionGraph.prototype.processTransactionsToGraph = function(transactions) {
  console.log("Processing transactions");
  for (var i = 0; i < transactions.length; i++) {
    this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew);
  }
}

// Methods to be overridden in subclasses
TransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash) {
  // Determine whether the sender and reciever are already in nodes
  var senderInNodes = this.contains(sender.address);
  var recieverInNodes = this.contains(reciever.address);
  // When both the sender and reciever are same
  if (sender.address === reciever.address) {
    if (!senderInNodes) this.nodes.push(this.createNode(sender));
  }  else {
    //When both sender and reciever are not in nodes
    if (!senderInNodes && !recieverInNodes) {
      //Add both sender and reciever to nodes
      this.nodes.push(this.createNode(sender));
      this.nodes.push(this.createNode(reciever));
    }
    //Either sender or reciever is in nodes
    else {
      //If sender is not in nodes then add sender and vise versa
      if (!senderInNodes && recieverInNodes) this.nodes.push(this.createNode(sender));
      if (!recieverInNodes && senderInNodes) this.nodes.push(this.createNode(reciever));
    }
  }
}

// Create relative nodes
TransactionGraph.prototype.createNode = function(senderOrReciever) {
  if (senderOrReciever.isContract) {
    return new Node(senderOrReciever.address, contractNodeColor, defaultSize);
  } else {
    return new Node(senderOrReciever.address, accountNodeColor, defaultSize);
  }
}

// Required to test for duplicates
TransactionGraph.prototype.contains = function(senderOrReciever) {
  if (this.nodesHashMap.hasOwnProperty(senderOrReciever)) {
    return true
  } else {
    this.nodesHashMap[senderOrReciever] = true;
    return false
  }
}

// Delete unneccessary properties
TransactionGraph.prototype.deleteProperties = function() {
  delete this.nodesHashMap;
}

module.exports = TransactionGraph;
