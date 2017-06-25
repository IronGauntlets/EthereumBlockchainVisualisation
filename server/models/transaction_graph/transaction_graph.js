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

  this.numberOfTransactions = 0;

  this.eoas = 0;
  this.contracts = 0;

  this.minGas = 0;
  this.maxGas = 0;
  this.totalGas = 0;
  this.averageGas = 0;

  this.minEther = 0;
  this.maxEther = 0;
  this.totalEther = 0;
  this.averageEther = 0;

  this.minedAt;

}

TransactionGraph.prototype.processBlocks = function(blockId, count, info, callback, request, response, directed) {
  Block.getBlocks(blockId, count, (blocks) => {
    for (var i = 0; i < blocks.length; i++) {
      if( (i+1) % 100 == 0) {console.log('i: ' + (i+1))};
      this.numberOfTransactions = this.numberOfTransactions + blocks[i].transactions.length;
      if (blocks[i].number == blockId) {
        var date = new Date(blocks[i].timestamp*1000);
        this.minedAt = date.toLocaleString();
      }
      this.processTransactionsToGraph(blocks[i].transactions, info);
    }
    if (this.numberOfTransactions == 0){
      this.averageGas = 0;
      this.averageEther = 0;
    } else {
      this.averageGas = this.totalGas/this.numberOfTransactions;
      this.averageEther = this.totalEther/this.numberOfTransactions;
    }

    callback(this, request, response, directed);
  })
}

// Methods to be overridden in subclasses
TransactionGraph.prototype.processTransaction = function(sender, reciever) {
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
    this.contracts++;
    return new Node(senderOrReciever.address, contractNodeColor, defaultSize);
  } else {
    this.eoas++;
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
