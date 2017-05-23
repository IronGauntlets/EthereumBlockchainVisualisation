const Block = require('../models/block.js');

var blockNumber = 3000000;
var startBlock = '0xee396a86beaade9d6057b72a92b7bf5b40be4997745b437857469557b562a7c3' //Number = 3000000

function populateMongoDB(startBlockId, n) {
  if (n > 0) {
    Block.getBlock(startBlockId, (block) => {
      if (block != null) {
        console.log('Block number: ' + block.number + ' and count: ' + n);
        populateMongoDB(block.parentHash, n-1);
      }
    })
  }
}

populateMongoDB(startBlock, blockNumber);
