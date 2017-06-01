// Base class for Edges
function Edge(id, source, target, color, size, type) {
  this.id = id;
  this.source = source;
  this.target = target;
  this.color = color;
  this.size = size;
  this.type = type;
}

module.exports = Edge;
