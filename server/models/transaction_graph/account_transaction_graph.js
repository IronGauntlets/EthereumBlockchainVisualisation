const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://146.169.44.234:8545"));

const TransactionGraph = require('./transaction_graph.js');
const Edge = require('./edge.js');
const Node = require('./node.js');
const Block = require('../block.js');

const etherDenomination = 'finney';

const defaultSize = Math.log(1);
const contractColour = '#e3b93c';
const accountColour = '#04c975';
const contractCreationColour = '#80b6ad';
const transactionNodeColor = '#00FFFF';
const blockColour = '#ff0000';
const inputColour = '#104957';
const outputColour = '#015430';

function AccountTransactionGraph(account) {
  TransactionGraph.call(this);
  this.edgeCount = 0;
  this.account = account.toLowerCase();
  this.activeBlocksHashMap = {};

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
  this.activeBlocks = 0;
}

AccountTransactionGraph.prototype = Object.create(TransactionGraph.prototype);
AccountTransactionGraph.prototype.constructor = AccountTransactionGraph;

AccountTransactionGraph.prototype.processBlocks = function(blockId, count, info, callback, request, response, directed) {
  Block.getBlocks(blockId, count, (blocks) => {
    for (var i = 0; i < blocks.length; i++) {
      if( (i+1) % 100 == 0) {console.log('i: ' + (i+1))};
      if (blocks[i].number == blockId) {
        var date = new Date(blocks[i].timestamp*1000);
        this.minedAt = date.toLocaleString();
      }
      this.nodes.push(new Node(blocks[i].hash, blockColour, defaultSize));
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

AccountTransactionGraph.prototype.processTransactionsToGraph = function(transactions, info) {
  for (var i = 0; i < transactions.length; i++) {
    if (this.account == transactions[i].from.address || this.account == transactions[i].to.address) {
      if (!this.activeBlocksHashMap.hasOwnProperty(transactions[i].blockHash)) {
        this.activeBlocks++;
        this.activeBlocksHashMap[transactions[i].blockHash] = true;
      }
      this.numberOfTransactions++;

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
        this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].blockHash, transactions[i].isNew, transactions[i].value);
      }
      else  {
        this.processTransaction(transactions[i].from, transactions[i].to, transactions[i].hash, transactions[i].blockHash, transactions[i].isNew, Math.log(transactions[i].gasUsed/10000));
      }
    }
  }
}

AccountTransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash, blockHash, isNew, value){
  var senderInNodes = this.contains(sender.address);
  var recieverInNodes = this.contains(reciever.address);

  this.nodes.push(new Node(transactionHash, transactionNodeColor, value));
  //this.account == sender
  if (this.account == sender.address) {
    if (!recieverInNodes){reciever.isContract ? this.contracts++ : this.eoas++;}
    if (reciever.isContract && isNew) {
      if (!recieverInNodes) {this.nodes.push(new Node(reciever.address, contractColour, defaultSize));}
      this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, contractCreationColour, defaultSize, null));
    } else {
      if (reciever.isContract) {
        if (!recieverInNodes) {this.nodes.push(new Node(reciever.address, contractColour, defaultSize));}
      } else {
        if (!recieverInNodes) {this.nodes.push(new Node(reciever.address, accountColour, defaultSize));}
      }
      this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, outputColour, defaultSize, null));
    }
    this.edges.push(new Edge(this.edgeCount++, transactionHash, reciever.address, outputColour, defaultSize, null));
  }
  //this.account == reciever
  else if (this.account == reciever.address) {
    if (!senderInNodes) {sender.isContract ? this.contracts++ : this.eoas++;}
    if (reciever.isContract && isNew) {
      if (!senderInNodes) {this.nodes.push(new Node(sender.address, accountColour, defaultSize));}
      this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, contractCreationColour, defaultSize, null));
    } else {
      if (sender.isContract) {
        if(!senderInNodes) {this.nodes.push(new Node(sender.address, contractColour, defaultSize));}
      } else {
        if(!senderInNodes) {this.nodes.push(new Node(sender.address, accountColour, defaultSize));}
      }
      this.edges.push(new Edge(this.edgeCount++, blockHash, transactionHash, inputColour, defaultSize, null));
    }
    this.edges.push(new Edge(this.edgeCount++, transactionHash, sender.address, inputColour, defaultSize, null));
  }
}

AccountTransactionGraph.prototype.deleteProperties = function() {
  TransactionGraph.prototype.deleteProperties.call(this);
  delete this.edgeCount;
  delete this.activeBlocksHashMap;
}

module.exports = AccountTransactionGraph;
