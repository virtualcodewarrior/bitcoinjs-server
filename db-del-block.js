var leveldown = require('leveldown'); // database
var Settings = require('./lib/settings').Settings;

if (process.argv.length <= 2 || process.argv[2] == '-h' || process.argv[2] == '-?' || process.argv[2] == 'help') {
	console.log('This script deletes a block header from the levelDB database, forcing it to be re-synced from the network.');
	console.log('Useful if your process got halted mid-block-save, so not all block metadata (transactions, etc.) are in the database.');
	console.log('Call this script with one argument, the full block hash in hex format, zeroes at the beginning');
	process.exit(1);
}
var blockHash = new Buffer(process.argv[2], 'ascii').fromHex().reverse();

cfg = new Settings();
var dataDir = cfg.getDataDir();
storageUri = dataDir + '/leveldb/';

hMain = leveldown(storageUri+'main.db');

var defaultCreateOpts = {
	createIfMissing: true,
	cacheSize: 100 * 1024 * 1024,
	keyEncoding: 'json',
	valueEncoding: 'json'
};

hMain.open(defaultCreateOpts, function (err, value) {
	if (err !== undefined) {
		console.log('err:', err);
		process.exit(1);
	}
	
	hMain.del(blockHash, function(err) {
		if (err === undefined) {
			console.log('Success!');
		} else {
			console.log('err:', err);
		}
	});
});