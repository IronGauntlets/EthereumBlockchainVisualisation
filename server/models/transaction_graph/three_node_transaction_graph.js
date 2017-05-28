const TransactionGraph = require('./transaction_graph.js');
const Edge = require('./edge.js');
const Node = require('./node.js');

const defaultSize = 1;
const contractCreationEdgeColor = '#80b6ad';
const transactionNodeColor = '#1b7a91';
const accountEdgeColor = '#015430';
const contractEdgeColor = '#e3b93c';
const transactionEdgeColor = '#104957';

// Subclass for transaction graph
function ThreeNodeTransactionGraph() {
  this.edgeCount = 0;
  TransactionGraph.call(this);
}

ThreeNodeTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
ThreeNodeTransactionGraph.prototype.constructor = ThreeNodeTransactionGraph;

ThreeNodeTransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash, isNew) {
  TransactionGraph.prototype.processTransaction.call(this, sender, reciever, transactionHash);
  this.nodes.push(new Node(transactionHash, transactionNodeColor, defaultSize));
  this.createEdges(transactionHash, sender, reciever, isNew);
}

ThreeNodeTransactionGraph.prototype.createEdges = function(hash, source, target, isTransactionNew) {
  if (target.isContract && isTransactionNew) {
    this.edges.push(new Edge(this.edgeCount, source.address, hash, contractCreationEdgeColor, defaultSize, null)); this.edgeCount++;
    this.edges.push(new Edge(this.edgeCount, hash, target.address, transactionEdgeColor, defaultSize, null)); this.edgeCount++;
  } else {
    if (!source.isContract) {
      this.edges.push(new Edge(this.edgeCount, source.address, hash, accountEdgeColor, defaultSize, null)); this.edgeCount++;
      this.edges.push(new Edge(this.edgeCount, hash, target.address, transactionEdgeColor, defaultSize, null)); this.edgeCount++;
    } else {
      this.edges.push(new Edge(this.edgeCount, source.address, hash, contractEdgeColor, defaultSize, null)); this.edgeCount++;
      this.edges.push(new Edge(this.edgeCount, hash, target.address, transactionEdgeColor, defaultSize, null)); this.edgeCount++;
    }
  }
}

ThreeNodeTransactionGraph.prototype.deleteProperties = function() {
  TransactionGraph.prototype.deleteProperties.call(this);
  delete this.edgeCount;
}

module.exports = ThreeNodeTransactionGraph;
