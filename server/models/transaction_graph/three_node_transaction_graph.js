const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.47.31:8545"));

const TransactionGraph = require('./transaction_graph.js');
const Edge = require('./edge.js');
const Node = require('./node.js');

const etherDenomination = 'finney';

const defaultSize = Math.log(1);
const contractCreationEdgeColor = '#80b6ad';
const transactionNodeColor = '#1b7a91';
const accountEdgeColor = '#015430';
const contractEdgeColor = '#e3b93c';
const transactionEdgeColor = '#104957';

// Subclass for transaction graph
function ThreeNodeTransactionGraph() {
  TransactionGraph.call(this);
  this.edgeCount = 0;
}

ThreeNodeTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
ThreeNodeTransactionGraph.prototype.constructor = ThreeNodeTransactionGraph;

ThreeNodeTransactionGraph.prototype.processTransactionsToGraph = function(transactions, info) {
  for (var i = 0; i < transactions.length; i++) {
    if (info == 'value') {
      if (parseFloat(web3.fromWei(transactions[i].value, etherDenomination)/75) < 1) {
        transactions[i].value = Math.log(1);
      } else {
        transactions[i].value = Math.log(parseFloat(web3.fromWei(transactions[i].value, etherDenomination)/75));
      }
      this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew, transactions[i].value);
    }
    else  {
      this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew, Math.log(transactions[i].gasUsed/10000));
    }
  }
}

ThreeNodeTransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash, isNew, value) {
  TransactionGraph.prototype.processTransaction.call(this, sender, reciever);
  this.nodes.push(new Node(transactionHash, transactionNodeColor, value));
  this.createEdges(transactionHash, sender, reciever, isNew);
}

ThreeNodeTransactionGraph.prototype.createEdges = function(hash, source, target, isTransactionNew) {
  if (target.isContract && isTransactionNew) {
    this.edges.push(new Edge(this.edgeCount, source.address, hash, contractCreationEdgeColor, defaultSize, null)); this.edgeCount++;
    this.edges.push(new Edge(this.edgeCount, hash, target.address, contractCreationEdgeColor, defaultSize, null)); this.edgeCount++;
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
