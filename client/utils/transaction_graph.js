function TransactionGraph(transactions) {
  this.nodes = [];
  this.edges = [];

  for (var i = 0; i < transactions.length; i++) {
    var sender = transactions[i].from;
    var reciever = transactions[i].to;
    var transactionHash = transactions[i].hash;

    //When the sender and reciever are same
    if (sender === reciever) {
      if (!contains(this.nodes, sender)) {
        //TODO: determine first whether the address is account or contract
        this.nodes.push(new AccountNode(sender));
      }
      //Add the nre transaction as an edge in this.edges
      this.edges.push(new Edge(transactionHash, sender, reciever));
    } else {
      //When both sender and reciever are already in this.nodes
      if (contains(this.nodes, sender) && contains(this.nodes, reciever)){
        //Only add a directed edge between the nodes
        this.edges.push(new Edge(transactionHash, sender, reciever));
      }
      //When sender is not in this.nodes but reciever is
      else if (!contains(this.nodes, sender) && contains(this.nodes, reciever)) {
        //Add sender to this.nodes
        this.nodes.push(new AccountNode(sender));
        //Create a new edge between sender and reciever
        this.edges.push(new Edge(transactionHash, sender, reciever));
      }
      //When reciever is not in this.nodes but sender is
      else if (!contains(this.nodes, reciever) && contains(this.nodes, sender)) {
        //Check if transaction is contract creation, since reciever == null
        if (reciever == null) {
          reciever = web3.eth.getTransactionReceipt(transactionHash).contractAddress;
          //Creation contract transaction
          this.edges.push(new ContractCreationEdge(transactionHash, sender, reciever));
          //Add reciever to this.nodes
          this.nodes.push(new ContractNode(reciever));
        } else {
          //Create a new edge between sender and reciever
          this.edges.push(new Edge(transactionHash, sender, reciever));
          //Add reciever to this.nodes
          this.nodes.push(new ContractNode(reciever));
        }
      }
      //When both sender and reciever are not in this.nodes
      else if (!contains(this.nodes, reciever) && !contains(this.nodes, sender)) {
        //Add both sender and reciever to this.nodes
        this.nodes.push(new AccountNode(sender));
        //But first check if transaction is contract creation, since reciever == null
        if (reciever == null) {
          reciever = web3.eth.getTransactionReceipt(transactionHash).contractAddress;
          //Creation contract transaction
          this.edges.push(new ContractCreationEdge(transactionHash, sender, reciever));
          //Add reciever to this.nodes
          this.nodes.push(new ContractNode(reciever));
        } else {
          //Create a new edge between sender and reciever
          this.edges.push(new Edge(transactionHash, sender, reciever));
          //Add reciever to this.nodes
          this.nodes.push(new ContractNode(reciever));
        }
      }
    }
  }
}

// Colours:
// light green:#89c149
// musk yellow: #e3b93c
// bright green: #04c975
// aqua blue: #1b7a91
// aqua:#80b6ad
// light grey: #3f5e4d
//

function AccountNode(id) {
  this.id = id;
  this.x = Math.random();
  this.y = Math.random();
  this.size = 3;
  this.color = '#04c975';
}

function ContractNode(id) {
  this.id = id;
  this.x = Math.random();
  this.y = Math.random();
  this.size = 3;
  this.color = '#e3b93c';
}

function Edge(id, source, target){
  this.id = id;
  this.source = source;
  this.target = target;
  this.size = Math.random();
  this.color = '#3f5e4d';
  this.type = 'arrow';
}

function ContractCreationEdge(id, source, target) {
  this.id = id;
  this.source = source;
  this.target = target;
  this.size = Math.random();
  this.color = '#80b6ad';
  this.type = 'arrow';
}

function contains(list, item) {
  for (var i=0; i < list.length; i++) {
    var listId = list[i].id;
    if (listId === item){
      return true;
    }
  }
  return false;
}
