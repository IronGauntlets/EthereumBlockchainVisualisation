const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.44.234:8545"));

const TransactionGraph = require('./transaction_graph.js');
const Edge = require('./edge.js');
const Node = require('./node.js');
const Block = require('../block.js');

const etherDenomination = 'finney';

const defaultSize = Math.log(1);
const contractCreationEdgeColor = '#80b6ad';
const transactionNodeColor = '#1b7a91';
const accountEdgeColor = '#015430';
const contractEdgeColor = '#e3b93c';
const transactionEdgeColor = '#104957';
const contractNodeColor = '#FFFF00';
const accountNodeColor = '#04c975';
const blockEdgeColor = '#A93F7F';

// Subclass for transaction graph
function TimeThreeNodeTransactionGraph() {
  TransactionGraph.call(this);
  this.edgeCount = 0;
  this.accountsHashMap = {};
}

TimeThreeNodeTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
TimeThreeNodeTransactionGraph.prototype.constructor = TimeThreeNodeTransactionGraph;

TimeThreeNodeTransactionGraph.prototype.processBlocks = function(blockId, count, info, callback, request, response, directed) {
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

    for (var b in this.accountsHashMap) {
      if (this.accountsHashMap.hasOwnProperty(b)) {
        var bList = Object.keys(this.accountsHashMap[b]).sort();
        if (bList.length > 1) {
          for (var i = 0; i < bList.length - 1; i++) {
            this.edges.push(new Edge(this.edgeCount++, b + '(' + bList[i] + ')', b + '(' + bList[i+1] + ')', blockEdgeColor, defaultSize, null));
          }
        }
      }
    }
    callback(this, request, response, directed);
  })
}

TimeThreeNodeTransactionGraph.prototype.processTransactionsToGraph = function(transactions, info) {
  for (var i = 0; i < transactions.length; i++) {
    if (this.minGas == 0 && this.maxGas == 0 && this.minEther == 0 && this.maxEther == 0) {
      this.minGas = transactions[i].gasUsed;
      this.maxGas = transactions[i].gasUsed;
      this.minEther = parseFloat(web3.fromWei(transactions[i].value, 'ether'));
      this.maxEther = parseFloat(web3.fromWei(transactions[i].value, 'ether'));
    }

    var gas = transactions[i].gasUsed;
    var ether = parseFloat(web3.fromWei(transactions[i].value, 'ether'));

    gas < this.minGas? this.minGas = gas : this.minGas;
    gas > this.maxGas? this.maxGas = gas : this.maxGas;
    this.totalGas = this.totalGas + gas;

    ether < this.minEther? this.minEther = ether : this.minEther;
    ether > this.maxEther? this.maxEther = ether : this.maxEther;
    this.totalEther = this.totalEther + ether;


    if (info == 'value') {
      if (parseFloat(web3.fromWei(transactions[i].value, etherDenomination)/75) < 1) {
        transactions[i].value = Math.log(1);
      } else {
        transactions[i].value = Math.log(parseFloat(web3.fromWei(transactions[i].value, etherDenomination)/75));
      }
      this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew, transactions[i].value, transactions[i].blockNumber);
    }
    else  {
      this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].isNew, Math.log(transactions[i].gasUsed/10000), transactions[i].blockNumber);
    }
  }
}

TimeThreeNodeTransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash, isNew, value, blockNumber) {
  var senderAddr = sender.address;
  var recieverAddr = reciever.address;

  sender.address = sender.address + '(' + blockNumber + ')';
  reciever.address = reciever.address + '(' + blockNumber + ')';

  if (!this.accountsHashMap.hasOwnProperty(senderAddr)) {
    this.accountsHashMap[senderAddr] = {};
    this.accountsHashMap[senderAddr][blockNumber] = 1;

    if (sender.isContract) {
      this.nodes.push(new Node(sender.address, contractNodeColor, defaultSize, blockNumber))
    } else {
      this.nodes.push(new Node(sender.address, accountNodeColor, defaultSize, blockNumber));
    }
  } else {
    if (!this.accountsHashMap[senderAddr].hasOwnProperty(blockNumber)) {
      this.accountsHashMap[senderAddr][blockNumber] = 1;
      if (sender.isContract) {
        this.nodes.push(new Node(sender.address, contractNodeColor, defaultSize, blockNumber))
      } else {
        this.nodes.push(new Node(sender.address, accountNodeColor, defaultSize, blockNumber));
      }
    } else {
      this.accountsHashMap[senderAddr][blockNumber]++;
    }
  }

  if (!this.accountsHashMap.hasOwnProperty(recieverAddr)) {
    this.accountsHashMap[recieverAddr] = {};
    this.accountsHashMap[recieverAddr][blockNumber] = 1;

    if (reciever.isContract) {
      this.nodes.push(new Node(reciever.address, contractNodeColor, defaultSize, blockNumber))
    } else {
      this.nodes.push(new Node(reciever.address, accountNodeColor, defaultSize, blockNumber));
    }
  } else {
    if (!this.accountsHashMap[recieverAddr].hasOwnProperty(blockNumber)) {
      this.accountsHashMap[recieverAddr][blockNumber] = 1;
      if (reciever.isContract) {
        this.nodes.push(new Node(reciever.address, contractNodeColor, defaultSize, blockNumber))
      } else {
        this.nodes.push(new Node(reciever.address, accountNodeColor, defaultSize, blockNumber));
      }
    } else {
      this.accountsHashMap[recieverAddr][blockNumber]++;
    }
  }

  this.nodes.push(new Node(transactionHash, transactionNodeColor, value, blockNumber));
  this.createEdges(transactionHash, sender, reciever, isNew);
}

TimeThreeNodeTransactionGraph.prototype.createEdges = function(hash, source, target, isTransactionNew) {
  if (target.isContract && isTransactionNew) {
    this.edges.push(new Edge(this.edgeCount++, source.address, hash, contractCreationEdgeColor, defaultSize, null));
    this.edges.push(new Edge(this.edgeCount++, hash, target.address, contractCreationEdgeColor, defaultSize, null));
  } else {
    if (!source.isContract) {
      this.edges.push(new Edge(this.edgeCount++, source.address, hash, accountEdgeColor, defaultSize, null));
      this.edges.push(new Edge(this.edgeCount++, hash, target.address, transactionEdgeColor, defaultSize, null));
    } else {
      this.edges.push(new Edge(this.edgeCount++, source.address, hash, contractEdgeColor, defaultSize, null));
      this.edges.push(new Edge(this.edgeCount++, hash, target.address, transactionEdgeColor, defaultSize, null));
    }
  }
}

TimeThreeNodeTransactionGraph.prototype.deleteProperties = function() {
  TransactionGraph.prototype.deleteProperties.call(this);
  delete this.edgeCount;
  delete this.accountsHashMap;
}

module.exports = TimeThreeNodeTransactionGraph;
