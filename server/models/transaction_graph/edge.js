// Base class for Edges
function Edge(id, source, target) {
  this.id = id;
  this.source = source;
  this.target = target;
  this.type = 'arrow';
}

function AccountEdge(id, source, target) {
  Edge.call(this, id, source, target)
  this.color = '#3f5e4d';
  // this.color = '#04c975';
}

function ContractEdge(id, source, target) {
  Edge.call(this, id, source, target)
  this.color = '#e3b93c';
}

function ContractCreationEdge(id, source, target) {
  Edge.call(this, id, source, target);
  this.color = '#80b6ad';
}

AccountEdge.prototype = Object.create(Edge.prototype);
AccountEdge.prototype.constructor = AccountEdge;

ContractEdge.prototype = Object.create(Edge.prototype);
ContractEdge.prototype.constructor = ContractEdge;

ContractCreationEdge.prototype = Object.create(Edge.prototype);
ContractCreationEdge.prototype.constructor = ContractCreationEdge;

module.exports = {
  AccountEdge: AccountEdge,
  ContractEdge: ContractEdge,
  ContractCreationEdge: ContractCreationEdge
}
