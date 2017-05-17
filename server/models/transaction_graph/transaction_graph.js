const Edges = require('./edge.js');
const Nodes = require('./node.js');

// Base class for creating different graphs
function TransactionGraph() {
  this.nodes = [];
  this.edges = [];
}
// Methods to be overridden in subclasses
TransactionGraph.prototype.processTransaction = function(sender, reciever, transactionHash) {
  // Determine whether the sender and reciever are already in nodes
  var senderInNodes = this.contains(this.nodes, sender);
  var recieverInNodes = this.contains(this.nodes, reciever);
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
    return new Nodes.ContractNode(senderOrReciever.address);
  } else {
    return new Nodes.AccountNode(senderOrReciever.address);
  }
}

// Required to test for duplicates
TransactionGraph.prototype.contains = function(list, senderOrReciever) {
  for (var i=0; i < list.length; i++) {
    var listId = list[i].id;
    if (listId === senderOrReciever.address){
      return true;
    }
  }
  return false;
}

module.exports = TransactionGraph;
