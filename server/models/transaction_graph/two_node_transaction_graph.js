const TransactionGraph = require('./transaction_graph.js');
const Block = require('../block.js');
const Edge = require('./edge.js');
const Node = require('./node.js');

const arrow = 'arrow';
const contractCreationEdgeColor = '#80b6ad';
const accountEdgeColor = '#015430';
const contractEdgeColor = '#e3b93c';

// Subclass for transaction graph
function TwoNodeTransactionGraph() {
  this.edgeCount = 0;
  this.allTransactions = [];
  this.transactionHashMap = {};
  TransactionGraph.call(this);
}

TwoNodeTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
TwoNodeTransactionGraph.prototype.constructor = TwoNodeTransactionGraph;

TwoNodeTransactionGraph.prototype.processBlocks = function(blockId, count, info, callback, request, response) {
  if (count > 0) {
    Block.getBlock(blockId, (block) => {
      console.log('Block number: ' + block.number + ' and count: ' + count);
      this.processTransactionsToGraph(block.transactions, info);
      this.processBlocks(block.parentHash, count-1, info, callback, request, response);
    })
  } else {
    for (var i = 0; i < this.allTransactions.length; i++) {
      var property = this.allTransactions[i].from.address + this.allTransactions[i].to.address;
      var totalGas = this.transactionHashMap[property];
      this.processTransaction(this.allTransactions[i].from, this.allTransactions[i].to, totalGas);
    }
    console.log(this.nodesHashMap);
    callback(this, request, response);
  }
}

TwoNodeTransactionGraph.prototype.processTransactionsToGraph = function(transactions, info) {
  console.log("Processing transactions");
  if (info == 'value') {
    //Remeber to do calculations according to bignumber
  }
  else {
    for (var i = 0; i < transactions.length; i++) {
      var check = transactions[i].from.address + transactions[i].to.address;
      if (this.transactionHashMap.hasOwnProperty(check)) {
        this.transactionHashMap[check] = this.transactionHashMap[check] + transactions[i].gasUsed;
      } else {
        this.allTransactions.push({
          from : transactions[i].from,
          to : transactions[i].to
        })
        this.transactionHashMap[check] = transactions[i].gasUsed;
      }
    }
  }
}

TwoNodeTransactionGraph.prototype.processTransaction = function(sender, reciever, size) {
  TransactionGraph.prototype.processTransaction.call(this, sender, reciever);
  this.createEdge(sender, reciever, size);
}

TwoNodeTransactionGraph.prototype.createEdge = function(source, target, isTransactionNew, size) {
  if (target.isContract && isTransactionNew) {
    this.edges.push(new Edge(this.edgeCount, source.address, target.address, contractCreationEdgeColor, size, arrow)); this.edgeCount++;
  } else {
    if (!source.isContract) {
      this.edges.push(new Edge(this.edgeCount, source.address, target.address, accountEdgeColor, size, arrow)); this.edgeCount;
    } else {
      this.edges.push(new Edge(this.edgeCount, source.address, target.address, contractEdgeColor, size, arrow)); this.edgeCount;
    }
  }
}

TwoNodeTransactionGraph.prototype.deleteProperties = function() {
  TransactionGraph.prototype.deleteProperties.call(this);
  delete this.edgeCount;
}

module.exports = TwoNodeTransactionGraph;
