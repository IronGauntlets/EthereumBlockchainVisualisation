const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.47.31:8545"));

const TransactionGraph = require('./transaction_graph.js');
const Edge = require('./edge.js');
const Node = require('./node.js');

const etherDenomination = 'finney';

const defaultSize = Math.log(1);
const arrow = 'arrow';
const contractColour = '#e3b93c';
const accountColour = '#04c975';
const contractCreationColour = '#80b6ad';
const inputColour = '#104957';
const outputColour = '#015430';

function AccountTransactionGraph(account) {
  TransactionGraph.call(this);
  this.edgeCount = 0;
  this.account = account.toLowerCase();
  this.colourHashMap = {};
  this.blockNodesHashMap = {};
}

AccountTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
AccountTransactionGraph.prototype.constructor = AccountTransactionGraph;

AccountTransactionGraph.prototype.processTransactionsToGraph = function(transactions, info) {
  for (var i = 0; i < transactions.length; i++) {
    if (this.account == transactions[i].from.address || this.account == transactions[i].to.address) {
      var blockColour = randomColour();
      while (colourUsed(blockColour, this.colourHashMap)) {
        blockColour = randomColour();
      }
      if (!this.blockNodesHashMap.hasOwnProperty(transactions[i].blockHash)){
        this.nodes.push(new Node(transactions[i].blockHash, blockColour, defaultSize));
        this.blockNodesHashMap[transactions[i].blockHash] = true;
      }
      if (info == 'value') {
        if (parseFloat(web3.fromWei(transactions[i].value, etherDenomination)/75) < 1) {
          transactions[i].value = Math.log(1);
        } else {
          transactions[i].value = Math.log(parseFloat(web3.fromWei(transactions[i].value, etherDenomination)/75));
        }
        this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].blockHash, transactions[i].isNew, transactions[i].value);
      }
      else  {
        this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].blockHash, transactions[i].isNew, Math.log(transactions[i].gasUsed/10000));
      }
    }
  }
}

AccountTransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash, blockHash, isNew, value){
  if (this.account == reciever.address) {
    if (reciever.isContract && isNew) {
      if (sender.isContract) {this.nodes.push(new Node(transactionHash, contractColour, value));}
      else {this.nodes.push(new Node(transactionHash, accountColour, value));}
      this.edges.push(new Edge(this.edgeCount++, transactionHash, blockHash, contractCreationColour, defaultSize, arrow));
    } else {
      if (!sender.isContract) {
        this.nodes.push(new Node(transactionHash, accountColour, value));
        this.edges.push(new Edge(this.edgeCount++, transactionHash, blockHash, inputColour, defaultSize, arrow));
      } else {
        this.nodes.push(new Node(transactionHash, contractColour, value));
        this.edges.push(new Edge(this.edgeCount++, transactionHash, blockHash, inputColour, defaultSize, arrow));
      }
    }

  } else if (this.account == sender.address) {
    if (reciever.isContract && isNew) {
      if (sender.isContract) {this.nodes.push(new Node(transactionHash, contractColour, value));}
      else {this.nodes.push(new Node(transactionHash, accountColour, value));}
      this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, contractCreationColour, defaultSize, arrow));
    } else {
      if (!reciever.isContract) {
        this.nodes.push(new Node(transactionHash, accountColour, value));
        this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, outputColour, defaultSize, arrow));
      } else {
        this.nodes.push(new Node(transactionHash, contractColour, value));
        this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, outputColour, defaultSize, arrow));
      }
    }

  }
}

AccountTransactionGraph.prototype.deleteProperties = function() {
  TransactionGraph.prototype.deleteProperties.call(this);
  delete this.edgeCount;
  delete this.colourHashMap;
  delete this.blockNodesHashMap;
}

function randomColour() {
  return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}

function colourUsed(colour, colours) {
  if (colours.hasOwnProperty(colour)) {
    return true
  } else {
    colours[colour] = true;
    return false
  }
}

module.exports = AccountTransactionGraph;
