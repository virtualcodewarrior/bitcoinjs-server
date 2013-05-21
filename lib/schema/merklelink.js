var Util = require('../util');

var MerkleLink = exports.MerkleLink =
function MerkleLink (data)
{
  if ("object" !== typeof data) {
    data = {};
  }

  this.block_hash = data.block_hash || Util.NULL_HASH;
  this.branches = data.branches || [];
  this.index = data.index || 0;
}