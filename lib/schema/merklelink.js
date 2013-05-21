var Util = require('../util');
var Block = require('./block.js').Block;

var MerkleLink = exports.MerkleLink =
function MerkleLink (data, block)
{
  if ("object" !== typeof data) {
    data = {};
  }
  this.super_block = block || new Block();

  this.block_hash = data.block_hash || Util.NULL_HASH;
  this.branches = data.branches || [];
  this.index = data.index || 0;
}