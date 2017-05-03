// Base class for Nodes
function Node(id) {
  this.id = id;
  this.x = Math.random();
  this.y = Math.random();
  this.size = 1;
}

// Colours:
// light green:#89c149
// musk yellow: #e3b93c
// bright green: #04c975
// aqua blue: #1b7a91
// aqua:#80b6ad
// light grey: #3f5e4d

function AccountNode(id) {
  Node.call(this, id)
  this.color = '#3f5e4d';
  // this.color = '#04c975';
}

function ContractNode(id) {
  Node.call(this, id)
  this.color = '#e3b93c';
}

function TransactionNode(id) {
  Node.call(this, id);
  this.color = '#1b7a91';
}

AccountNode.prototype = Object.create(Node.prototype);
AccountNode.prototype.constructor = AccountNode;

ContractNode.prototype = Object.create(Node.prototype);
ContractNode.prototype.constructor = ContractNode;

TransactionNode.prototype = Object.create(Node.prototype);
TransactionNode.prototype.constructor = TransactionNode;

module.exports = {
  AccountNode: AccountNode,
  ContractNode: ContractNode,
  TransactionNode: TransactionNode
}
