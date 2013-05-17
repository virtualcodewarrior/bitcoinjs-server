var net = require('net');
var Binary = require('./binary');
var logger = require('./logger');

var Peer = function (host, port, services) {
  if ("string" === typeof host) {
    if (host.indexOf(':') && !port) {
      var parts = host.split(':');
      host = parts[0];
      port = parts[1];
    }
    this.host = host;
    this.port = +port || 8333;
    this.hostType = 'IPv4';
  } else if (host instanceof Peer) {
    this.host = host.host;
    this.port = host.port;
    this.hostType = (host.indexOf(':'))? 'IPv6' : 'IPv4';
  } else if (Buffer.isBuffer(host)) {
    if (host.slice(0, 12).compare(Peer.IPV6_IPV4_PADDING) != 0) {
      // IPv6 address
      this.host = host.toString('hex').match(/(.{1,4})/g).join(':').replace(/\:(0{2,4})/g, ':0').replace(/^(0{2,4})/g, ':0');
      this.port = +port || 8333;
      this.hostType = 'IPv6';
    } else {
      // IPv4 address
      this.host = Array.prototype.slice.apply(host.slice(12)).join('.');
      this.port = +port || 8333;
      this.hostType = 'IPv4';
    }
  } else {
    throw new Error('Could not instantiate peer, invalid parameter type: ' +
                    typeof host);
  }

  this.services = (services) ? services : null;
  this.lastSeen = 0;
};

Peer.IPV6_IPV4_PADDING = new Buffer([0,0,0,0,0,0,0,0,0,0,255,255]);

Peer.prototype.createConnection = function () {
  var c = net.createConnection(this.port, this.host);
  return c;
};

Peer.prototype.getHostAsBuffer = function () {
  return new Buffer(this.host.split('.'));
};

Peer.prototype.toString = function () {
  switch(this.hostType) {
    case 'IPv6':
      return '['+this.host+']:'+this.port;
    default:
      return this.host + ":" + this.port;
  }
};

Peer.prototype.toBuffer = function () {
  var put = Binary.put();
  put.word32le(this.lastSeen);
  put.word64le(this.services);
  put.put(this.getHostAsBuffer());
  put.word16be(this.port);
  return put.buffer();
};

exports.Peer = Peer;
