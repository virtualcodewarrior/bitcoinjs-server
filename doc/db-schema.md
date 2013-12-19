
## Proposed key/value schema

```
block~[blockHash]~prevHash => [blockHash]
block~[blockHash]~merkleRoot => [hash]
block~[blockHash]~timestamp => [INT]
block~[blockHash]~target => [INT]
block~[blockHash]~nonce => [INT]
block~[blockHash]~version => [INT]
block~[blockHash]~height => [INT]
block~[blockHash]~txs => [txHash],[txHash],[txHash] ...

txn~[txHash]~version => [INT]
txn~[txHash]~in => [count(in) INT]
txn~[txHash]~out => [count(out) INT]
txn~[txHash]~lockTime => [INT]

txn~[txHash]~in~[index]~spends => [txHash]~[outIndex]
txn~[txHash]~in~[index]~signature => [BIN string]
txn~[txHash]~in~[index]~sequence => [INT]

txn~[txHash]~out~[index]~value => [INT]
txn~[txHash]~out~[index]~script => [BIN]
txn~[txHash]~out~[index]~address => [base58 string]
txn~[txHash]~out~[index]~spent => [txHash]~[inIndex]

address~[base58 string]~first => [txHash]
address~[base58 string]~pubKey => [BIN string]
address~[base58 string]~utxo~[txHash]~[outIndex] => [value INT]

height~[chainHeight] => [blockHash],[blockHash],[blockHash] ...

meta~chainHeight => [INT]
```

