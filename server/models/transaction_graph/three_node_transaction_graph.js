var TransactionGraph = require('./transaction_graph.js');
var Edges = require('./edge.js');
var Nodes = require('./node.js');

// Subclass for transaction graph
function ThreeNodeTransactionGraph() {
  this.edgeCount = 0;
  TransactionGraph.call(this);
}

ThreeNodeTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
ThreeNodeTransactionGraph.prototype.constructor = ThreeNodeTransactionGraph;

ThreeNodeTransactionGraph.prototype.processTrasaction = function(sender, reciever, transactionHash, isNew) {
  TransactionGraph.prototype.processTrasaction.call(this, sender, reciever, transactionHash);
  this.nodes.push(new Nodes.TransactionNode(transactionHash));
  this.createEdges(transactionHash, sender, reciever, isNew);
}

ThreeNodeTransactionGraph.prototype.createEdges = function(hash, source, target, isTransactionNew) {
  if (target.isContract && isTransactionNew) {
    this.edges.push(new Edges.ContractCreationEdge(this.edgeCount, source.address, hash)); this.edgeCount++;
    this.edges.push(new Edges.ContractCreationEdge(this.edgeCount, hash, target.address)); this.edgeCount++;
  } else {
    if (!source.isContract) {
      this.edges.push(new Edges.AccountEdge(this.edgeCount, source.address, hash)); this.edgeCount++;
      this.edges.push(new Edges.AccountEdge(this.edgeCount, hash, target.address)); this.edgeCount++;
    } else {
      this.edges.push(new Edges.ContractEdge(this.edgeCount, source.address, hash)); this.edgeCount++;
      this.edges.push(new Edges.ContractEdge(this.edgeCount, hash, target.address)); this.edgeCount++;
    }
  }
}

module.exports = ThreeNodeTransactionGraph;
