const builder = require('xmlbuilder');
const fs = require("fs");
const path = require('path');

var nodeR = 'nr';
var nodeG = 'ng';
var nodeB = 'nb';
var nodeSize = 'size';
var nodeGravityX = 'gravity_x';
var nodeGravityY = 'gravity_y';
var nodePart = 'part';

var edgeR = 'er';
var edgeG = 'eg';
var edgeB = 'eb';
var edgeSize = 'weight';

var sizeWeightAndGravityType = 'double';
var rgbType = 'int';
var partType = 'int';

function ToGraphML(jsonGraph, directed, blockId, count) {
  var blockId = blockId;
  var count = count;
  var lowerBound = blockId - count;

  this.filePath = path.join(__dirname + '/' + blockId + '_' + count + '.graphml');
  this.directed = directed;
  this.jsonGraph = jsonGraph;
  this.graphMLObj = {};

  this.graphMLObj['graphml'] = {
    '@xmlns' : "http://graphml.graphdrawing.org/xmlns",
    '@xmlns:xsi' : "http://www.w3.org/2001/XMLSchema-instance",
    '@xsi:schemaLocation' : "http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"
  }

  this.graphMLObj.graphml['key'] = [
    {'@id': nodeR, '@for': 'node', '@attr.name': 'r', '@attr.type': rgbType},
    {'@id': nodeG, '@for': 'node', '@attr.name': 'g', '@attr.type': rgbType},
    {'@id': nodeB, '@for': 'node', '@attr.name': 'b', '@attr.type': rgbType},
    {'@id': edgeR, '@for': 'edge', '@attr.name': 'r1', '@attr.type': rgbType},
    {'@id': edgeG, '@for': 'edge', '@attr.name': 'g1', '@attr.type': rgbType},
    {'@id': edgeB, '@for': 'edge', '@attr.name': 'b1', '@attr.type': rgbType},
    {'@id': nodePart, '@for': 'node', '@attr.name': 'part', '@attr.type': partType},
    {'@id': nodeGravityX, '@for': 'node', '@attr.name': 'gravity_x', '@attr.type': sizeWeightAndGravityType},
    {'@id': nodeGravityY, '@for': 'node', '@attr.name': 'gravity_y', '@attr.type': sizeWeightAndGravityType},
    {'@id': nodeSize, '@for': 'node', '@attr.name': 'size', '@attr.type': sizeWeightAndGravityType},
    {'@id': edgeSize, '@for': 'edge', '@attr.name': 'weight', '@attr.type': sizeWeightAndGravityType}
  ]
  if (this.directed) {
    this.graphMLObj.graphml['graph'] = {
      '@id' : 'G', '@edgedefault' : 'directed'
    }
  } else {
    this.graphMLObj.graphml['graph'] = {
      '@id' : 'G', '@edgedefault' : 'undirected'
    }
  }

  this.addNode = function(node) {
    var r = hexToR(node.color);
    var g = hexToG(node.color);
    var b = hexToB(node.color);
    var size = node.size;

    if (node.size == 0) {
      size = 1.0;
    }

    return {
      '@id': node.id,
      'data': [
        {'@key': nodeR, '#text': r},
        {'@key': nodeG, '#text': g},
        {'@key': nodeB, '#text': b},
        {'@key': nodeSize, '#text': size},
        {'@key': nodeGravityX, '#text': node.blockNumber - lowerBound},
        {'@key': nodeGravityY, '#text': node.size},
        {'@key': nodePart, '#text': node.blockNumber - lowerBound}
      ]
    };
  }

  this.addEdge = function(edge) {
    var r = hexToR(edge.color);
    var g = hexToG(edge.color);
    var b = hexToB(edge.color);

    if (edge.size <= 0) {
      edge.size = 5.0;
    }

    return {
      '@id': edge.id,
      '@source' : edge.source,
      '@target': edge.target,
      'data': [
        {'@key': edgeR, '#text': r},
        {'@key': edgeG, '#text': g},
        {'@key': edgeB, '#text': b},
        {'@key': edgeSize, '#text': edge.size}
      ]
    };
  }

  this.graphMLObj.graphml.graph['node'] = this.addNode(this.jsonGraph.nodes.shift());
  var initialGraphml = (builder.create(this.graphMLObj, {encoding: 'UTF-8'})).end({pretty: true});

  initialGraphml = initialGraphml.split(/\r?\n/);
  initialGraphml.splice(initialGraphml.length-2, initialGraphml.length);
  initialGraphml = initialGraphml.join('\n');

   fs.appendFileSync(this.filePath, initialGraphml + '\r\n');
}

ToGraphML.prototype.create = function(callback) {
  for (var i = 0; i < this.jsonGraph.nodes.length; i++) {
    if( (i+1) % 1000 == 0) {console.log('Node: ' + (i+1))};
    var tmp = {node: this.addNode(this.jsonGraph.nodes[i])};
    var nodeGraphml = (builder.create(tmp)).end({pretty: true});
    nodeGraphml = nodeGraphml.split(/\r?\n/);
    nodeGraphml.splice(0, 1);
    nodeGraphml = nodeGraphml.join('\n');
    fs.appendFileSync(this.filePath, nodeGraphml + '\r\n');
  }

  for (var i = 0; i < this.jsonGraph.edges.length; i++) {
    if( (i+1) % 1000 == 0) {console.log('Edge: ' + (i+1))};
    var tmp = {edge: this.addEdge(this.jsonGraph.edges[i])};
    var edgeGraphml = (builder.create(tmp)).end({pretty: true});
    edgeGraphml = edgeGraphml.split(/\r?\n/);
    edgeGraphml.splice(0, 1);
    edgeGraphml = edgeGraphml.join('\n');
    fs.appendFileSync(this.filePath, edgeGraphml +'\r\n');
  }

  fs.appendFileSync(this.filePath, '</graph>' + '\r\n' + '</graphml>');
  callback(this.filePath)
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

module.exports = ToGraphML;
