const TransactionGraph = require('./transaction_graph.js');
const Edge = require('./edge.js');
const Node = require('./node.js');

const arrow = 'arrow'
const defaultSize = 1;
const contractCreationEdgeColor = '#80b6ad';
const accountEdgeColor = '#015430';
const contractEdgeColor = '#e3b93c';

// Subclass for transaction graph
function TwoNodeTransactionGraph() {
  TransactionGraph.call(this);
}

TwoNodeTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
TwoNodeTransactionGraph.prototype.constructor = TwoNodeTransactionGraph;

TwoNodeTransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash, isNew) {
  TransactionGraph.prototype.processTransaction.call(this, sender, reciever, transactionHash);
  this.createEdge(transactionHash, sender, reciever, isNew);
}

TwoNodeTransactionGraph.prototype.createEdge = function(id, source, target, isTransactionNew) {
  if (target.isContract && isTransactionNew) {
    this.edges.push(new Edge(id, source.address, target.address, contractCreationEdgeColor, defaultSize, arrow));
  } else {
    if (!source.isContract) {
      this.edges.push(new Edge(id, source.address, target.address, accountEdgeColor, defaultSize, arrow));
    } else {
      this.edges.push(new Edge(id, source.address, target.address, contractEdgeColor, defaultSize, arrow));
    }
  }
}

module.exports = TwoNodeTransactionGraph;
