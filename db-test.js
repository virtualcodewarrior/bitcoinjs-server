var leveldown = require('leveldown'); // database
var Settings = require('./lib/settings').Settings;

if (process.argv.length <= 2) {
	console.log('No key given');
	process.exit(1);
}
var rawKey = process.argv[2];

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

var dataLoop = function dataLoop(i, limit) {
	//console.log('loop', limit);
	if (limit > 10000) return false; // runaway process trap
	i.next(function(err, key, value) {
		if (err !== null) {
			console.log('err:', err);
			return false;
		}
		console.log('key:', key, 'value:', value);
		if (key == 'undefined') return false;
		dataLoop(i, limit+1);
	});
}

// From lib/storage.js
var formatHeightKey = function formatHeightKey(height) {
    var tempHeightBuffer = new Buffer(4);
    height = Math.floor(+height);
    tempHeightBuffer[0] = height >> 24 & 0xff;
    tempHeightBuffer[1] = height >> 16 & 0xff;
    tempHeightBuffer[2] = height >>  8 & 0xff;
    tempHeightBuffer[3] = height       & 0xff;
    return tempHeightBuffer;
};

hMain.open(defaultCreateOpts, function (err, value) {
	if (err !== undefined) {
		console.log('err:', err);
		process.exit(1);
	}
	if (rawKey.length > 20) {
		// Full hash
		var key = new Buffer(rawKey, 'ascii').fromHex().reverse();
		console.log('key:', key);
		hMain.get(key, function (err, value) {
		  console.log('err:', JSON.stringify(err));
		  console.log('value:', JSON.stringify(value));
		});
	} else if (parseInt(rawKey) > 0) {
		// Block height
		var i = hMain.iterator({
			'limit': 50,
			'start': formatHeightKey(rawKey)
		});
		dataLoop(i, 0);
	} else {
		// String key
		var key = rawKey;
		console.log('key:', key);
		hMain.get(key, function (err, value) {
		  console.log('err:', JSON.stringify(err));
		  console.log('value:', JSON.stringify(value));
		});
	}
});