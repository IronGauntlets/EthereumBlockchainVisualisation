const TransactionGraph = require('./transaction_graph.js');
const Edges = require('./edge.js');
const Nodes = require('./node.js');

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
    this.edges.push(new Edges.ContractCreationEdge(id, source.address, target.address));
  } else {
    if (!source.isContract) {
      this.edges.push(new Edges.AccountEdge(id, source.address, target.address));
    } else {
      this.edges.push(new Edges.ContractEdge(id, source.address, target.address));
    }
  }
}

module.exports = TwoNodeTransactionGraph;
