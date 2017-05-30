// Base class for Edges
function Edge(id, source, target, color, size, type) {
  this.id = id;
  this.source = source;
  this.target = target;
  this.color = color;
  this.type = type;
  this.size = size;
}

module.exports = Edge;
