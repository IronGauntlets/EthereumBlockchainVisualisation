function Blockchain(blockHashes) {
  this.blockHashes = blockHashes; //An array of block hashes not the whole block object
  this.blocks;                    //An array of blocks representing the desired blockchain
  //TODO: Exclude any unlces that point to the blocks not present in the this.blockHashes
  //TODO: Create tree struture for blocks with uncles
  //TODO: Initialise the blocks array by getting information about blocks using blockHashes
}

function Block(){
  this.isUncle; //Used to determine whether it is a mined or stale block
  this.hash;    //Hash of the block
  this.prev;    //parent of the block. If uncle then the parent can be a stale block or mined block
  this.next;    //Next block in the blocchain. If block is uncle, the next is null
  this.Uncles;  //Array of unlces
}

module.exports = Blockchain;
