var restify = require('restify');
var assert = require('assert');
var http = require('http');
var Watershed = require('watershed').Watershed;
var db = require('monk')('localhost/boplishEmuMediator');

function Host(ip, port, cb) {
	this.ip = ip;
	this.port = port;
	this.peers = [];
	var url = 'http://' + this.ip + ':' + this.port;
	this.id = url.hashCode();
	this.endpoint = restify.createJsonClient({
		url: url,
		version: '*'
	});
	this.refresh(cb);
	this.connectLogHandler();
}

Host.prototype = {
	connectLogHandler: function(filter) {
		//todo: implement filter
		this._setupLogDatabase(function(err, collection) {
			this._setupWebSocket(function(err, socket) {
				socket.on('text', function(msg) {
					try {
						var item = JSON.parse(msg);
						collection.insert(item);
					} catch(e) {
						console.log(e);
					}
				});
			});	
		}.bind(this));
	},
	_setupWebSocket: function(cb) {
		if (this.websocket) {
			this.websocket.end();
		}
		var shed = new Watershed();
		var wskey = shed.generateKey();
		var req = http.request({
			port: this.port,
			hostname: this.ip,
			path: '/registerLogHandler',
			headers: {
				'connection': 'upgrade',
				'upgrade': 'websocket',
				'Sec-WebSocket-Key': wskey
			}
		});
		req.end();
		req.on('upgrade', function(res, socket, head) {
			var wsc = shed.connect(res, socket, head, wskey);
			cb(null, wsc);
		});
	},
	_setupLogDatabase: function(cb) {
		var collection = db.get('messages');
		collection.insert({test: 'test'});
		cb(null, collection);
	},
	refresh: function(cb) {
		this.getPeers(function(err, peers) {
			if (err) {
				return cb(err);
			}
			this.peers = peers;
			cb(null, this.getConfig());
		}.bind(this));
	},
	getConfig: function() {
		return {ip: this.ip, port: this.port, id: this.id, peers: this.peers};
	},
	getStatus: function(cb) {
		this.endpoint.get('/status', function(err, req, res, obj) {
			if (err) {
				return cb(err);
			}
			cb(null, obj);
		});
	},
	getPeers: function(cb) {
		this.endpoint.get('/peers', function(err, req, res, obj) {
			if (err) {
				return cb(err);
			}
			cb(null, obj);
		});
	},
	startPeer: function(cb) {
		this.endpoint.post('/peer', function(err, req, res, obj) {
			if (err) {
				return cb(err);
			}
			this.peers.push(obj.id);
			cb(null, obj);
		}.bind(this));
	},
	abortPeer: function(id, cb) {
		this.endpoint.del('/peer' + '/' + id, function(err, req, res, obj) {
			if (err) {
				return cb(err);
			}
			var index = this.peers.indexOf(id);
			this.peers.splice(index, 1);
			cb(null, obj);
		}.bind(this));
	}
};

module.exports = Host;
