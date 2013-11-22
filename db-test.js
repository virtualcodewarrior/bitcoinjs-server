var leveldown = require('leveldown'); // database
var Settings = require('./lib/settings').Settings;

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
	hMain.get('chainHeight', function (err, value) {
	  console.log('err:', JSON.stringify(err));
	  console.log('value:', JSON.stringify(value));
	});
});