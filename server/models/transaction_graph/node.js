// Base class for Nodes
function Node(id, color, size) {
  this.id = id;
  this.color = color;
  this.x = Math.random();
  this.y = Math.random();
  this.size = size;
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
