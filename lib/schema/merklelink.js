var Util = require('../util');
var Binary = require('binary');
var Block = require('./block.js').Block;
var VerificationError = require('../error').VerificationError;

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

MerkleLink.prototype.checkLink = function checkLink() {
  if (this.branches.length > 30) {
    throw new VerificationError('AuxPOW Merkle branch is too long');
  }
  var coinbaseHash = this.super_block.coinbase.calcHash();
  var parentMerkle = this.super_block.aux_parent.merkle_root;
  var merkleLink = this.calcBranch(coinbaseHash, this.branches, this.index);
  if (merkleLink.compare(parentMerkle) != 0) {
    throw new VerificationError('AuxPOW Merkle Link verification failed; coinbase transaction is not in the parent block');
  }
};

MerkleLink.prototype.calcBranch = function calcBranch(inputHash, branch, index) {
  //             merkleRoot (0)
  //              /        \
  //             /          \
  //            1            2
  //           / \          / \
  //          /   \        /   \
  //         3     4      5     6
  //        / \   / \    / \   / \
  //       7   8 9  10  11 12 13 14
  //
  // In order to prove #10 is part of the tree represented by #0,
  //   I need to also provide #9, #3, and #2.
  //   Then, if f(f(#3, f(#9, #10)), #2) == #0, I'm telling the truth.
  // Providing just those three items is less data to transmit than providing
  //   the seven other transactions, so is preferable
  //
  // "index" is a bitmask of which side of the hash function the provided hash needs to be applied to
  //   (0 means inputHash is on the left, 1 means it's on the right)
  // "branch" is an array of hashes to be applied in order
  // So, for the example of verifying #10:
  //   inputHash = #10
  //   branch = [9, 3, 2]
  //   index = 0b011 = 3
  //     then the output should equal #0
  var mask = index;
  var workingHash = inputHash;
  branch.forEach(function (val) {
    workingHash = (mask & 1)? Util.twoSha256(val.concat(workingHash)) : Util.twoSha256(workingHash.concat(val));
    mask = mask >> 1;
  });
  return workingHash;
 };
