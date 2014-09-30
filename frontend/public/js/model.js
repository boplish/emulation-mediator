
function Host(config, endpoint) {
	this.id = config.id;
	this.ip = config.ip;
	this.port = config.port;
	this.peers = config.peers;
	this.endpoint = endpoint;
}

Host.prototype = {
	startPeer: function(cb) {
		jQuery.ajax({
			type: "POST",
			url: this.endpoint + '/startPeer' + '/' + this.id,
			success: function() {
				cb();
			},
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	},
	abortPeer: function(peerId, cb) {
		jQuery.ajax({
			type: "DELETE",
			url: this.endpoint + '/abortPeer' + '/' + this.id + '/' + peerId,
			success: function() {
				cb();
			},
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	},
	getHostStatus: function(cb) {
		jQuery.ajax({
			type: "GET",
			url: this.endpoint + '/host' + '/' + this.id,
			success: function(status) {
				if (cb) {
					cb(null, status);
				}
			}.bind(this),
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	},
	getPeerStatus: function(cb) {
		jQuery.ajax({
			type: "GET",
			url: this.endpoint + '/host' + '/' + this.id,
			success: function(status) {
				if (cb) {
					cb(null, status);
				}
			}.bind(this),
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	}
};

function Emulation(endpoint) {
	this.hosts = {};
	this.endpoint = endpoint;
}

Emulation.prototype = {
	getHosts: function(cb) {
		jQuery.ajax({
			type: "GET",
			url: this.endpoint + '/hosts',
			success: function(hostList) {
				var i;
				for (i=0; i<hostList.length; i++) {
					var config = hostList[i];
					this.hosts[config.id] = new Host(config, this.endpoint);
				}
				if (cb) {
					cb(null, this.hosts);
				}
			}.bind(this),
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	},
	addHost: function(config, cb) {
		jQuery.ajax({
			type: "POST",
			url: this.endpoint + '/host',
			dataType: 'json',
			data: {'host': config},
			success: function(config) {
				this.getHosts(cb);
			}.bind(this),
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	},
	removeHost: function(host, cb) {
		jQuery.ajax({
			type: "DELETE",
			url: this.endpoint + '/host' + '/' + host.id,
			success: function(hosts) {
				this.getHosts(cb);
			},
			error: function(req, status, err) {
				console.log(req.responseText);
				cb(req.responseText);
			}
		});
	},
	startPeer: function(hostId, cb) {
		var host = this.hosts[hostId];
		if (host) {
			host.startPeer(function() {
				this.getHosts(cb);
			}.bind(this));
		} else {
			cb('Host not found');
		}
	},
	abortPeer: function(hostId, peerId, cb) {
		var host = this.hosts[hostId];
		if (host) {
			host.abortPeer(peerId, function(){
				this.getHosts(cb);
			}.bind(this));
		} else {
			cb('Peer not found');
		}
	}
};
