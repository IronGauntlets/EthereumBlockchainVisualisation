function TransactionGraph(transactions) {
  this.nodes = [];
  this.edges = [];

  for (var i = 0; i < transactions.length; i++) {
    var sender = transactions[i].from;
    var reciever = transactions[i].to;
    var transactionHash = transactions[i].hash;

    //When both sender and reciever are already in this.nodes
    if (contains(this.nodes, sender) && contains(this.nodes, reciever)){
      //Only add a directed edge between the nodes
      this.edges.push(new Edge(transactionHash, sender, reciever));
    }
    //When sender is not in this.nodes but reciever is
    else if (!contains(this.nodes, sender) && contains(this.nodes, reciever)) {
      //Add sender to this.nodes
      this.nodes.push(new Node(sender));
      //Create a new edge between sender and reciever
      this.edges.push(new Edge(transactionHash, sender, reciever));
    }
    //When reciever is not in this.nodes but sender is
    else if (contains(this.nodes, sender) && !contains(this.nodes, reciever)) {
      //Check if transaction is contract creation, since reciever == null
      if (reciever == null) {
        reciever = web3.eth.getTransactionReceipt(transactionHash).contractAddress;
      }
      //Add reciever to this.nodes
      this.nodes.push(new Node(reciever));
      //Create a new edge between sender and reciever
      this.edges.push(new Edge(transactionHash, sender, reciever));
    }
    //When both sender and reciever are not in this.nodes
    else {
      //Add both sender and reciever to this.nodes
      this.nodes.push(new Node(sender));
      //But first check if transaction is contract creation, since reciever == null
      if (reciever == null) {
        reciever = web3.eth.getTransactionReceipt(transactionHash).contractAddress;
      }
      this.nodes.push(new Node(reciever));
      //Create a new edge between sender and reciever
      this.edges.push(new Edge(transactionHash, sender, reciever));
    }
  }
}

function Node(id) {
  //Main attributes
  this.id = id;
  // this.label = id;
  //Display attributes
  this.x = Math.random();
  this.y = Math.random();
  this.size = 1;
  this.color = '#f00';
}

function Edge(id, source, target){
  //Main attributes
  this.id = id;
  // Reference extremities
  this.source = source;
  this.target = target;
  //Display attributes
  this.size = Math.random();
  this.color = '#ccc';
  this.type = 'arrow';
}

function contains(list, item) {
  for (var i=0; i < list.length; i++) {
    if (list[i].id == item){
      return true;
    }
  }
  return false;
}
