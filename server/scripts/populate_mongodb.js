const Block = require('../models/block.js');

var count = 1000;

var startBlock = '0xc6470e45371f32fb889442dc8f90cea618be575670f65e97f2097bd88ae0a765' //Number = 3,500,000

function populateMongoDB(startBlockId, n) {
  try {
    if (n > 0) {
      Block.getBlock(startBlockId, (block) => {
        if (block != null) {
          console.log('Block number: ' + block.number + ' and count: ' + n);
          populateMongoDB(block.parentHash, n-1);
        }
      })
    }
  } catch (e) {
    console.log(e);
    populateMongoDB(startBlockId, n);
  }
}

populateMongoDB(startBlock, count);
