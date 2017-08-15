// Base class for Nodes
function Node(id, color, size, blockNumber) {
  this.id = id;
  this.color = color;
  this.x = -0.5 + Math.random();
  this.y = -0.5 + Math.random();
  this.size = size;
  this.label = id;
  this.blockNumber = blockNumber;
}

// Colours:
// light green:#89c149
// musk yellow: #e3b93c
// #E5C04F
//#E7C660
// bright green: #04c975
// aqua blue: #1b7a91
// aqua:#80b6ad
// light grey: #3f5e4d
// #0A343E
// #125565
// #028C51
// #015430


module.exports = Node;
