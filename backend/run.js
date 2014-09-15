#!/usr/bin/env node

/**
 * Module dependencies
 */
var logger = require('winston');
var program = require('commander');
var restify = require('restify');
var assert = require('assert');
var Host = require('./Host.js');
require('./helper.js');

/** 
 * Module configuration
 */
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {'timestamp': true, 'colorize': true});
program
    .version('0.0.1')
    .option('-d, --databaseURI <URI>', 'MongoDB Database URI', String, 'localhost:27017/boplishEmuMediator')
	.option('-p, --port <port>', 'Listen Port', String, '1336')
    .parse(process.argv);
var listenPort = program.port;

/**
 * Stores Hosts/Peers
 */
var hosts = {};

/** 
 * REST route and server configuration
 */ 
var server = restify.createServer();
server.use(restify.CORS());
server.use(restify.bodyParser());

server.post('/host', rest_addHost);
server.del('/host/:hostId', rest_removeHost);
server.get('/host/:hostId', rest_getHostStatus);

server.post('/peer/:hostId', rest_startPeer);
server.del('/peer/:hostId/:peerId', rest_abortPeer);

server.post('/startPeer/:hostId', rest_startPeer); //temp
server.del('/abortPeer/:hostId/:peerId', rest_abortPeer); //temp

server.get('/listAllHosts', rest_listAllHosts);
server.get('/hosts', rest_listAllHosts);
//server.get('/getLogHandler', rest_registerLogHandler);

/**
 * REST Functionality
 */
function rest_addHost(req, res, next) {
	var config = req.params.host;
	if (!(req.params.host || req.params.host.ip || req.params.host.port)) {
		return next(new restify.InvalidArgumentError("Invalid Arguments"));
	}
	var host = new Host(req.params.host.ip, req.params.host.port, function(err, config) {
		if (err) {
			logger.info('Cannot connect to host ' + JSON.stringify(err));
			return next(new restify.ResourceNotFoundError(err));;
		} else if (hosts[config.id]) {
			logger.info('Trying to add duplicate host ' + hosts[config.id].ip + ':' + hosts[config.id].ip);
			return next(new restify.InvalidArgumentError('Host already exists'));
		}
		hosts[host.id] = host;
		res.send({host: config, message: 'Host added successfully'});
		next();
		logger.info('Host added: ' + host.ip + ':' + host.port);
	});
}

function rest_startPeer(req, res, next) {
	var hostId = req.params.hostId;
	if (!hosts[hostId]) {
		return next(new restify.ResourceNotFoundError('Host does not exist'));
	}
	hosts[hostId].startPeer(function(err, peer) {
		res.send(peer);
		next();
	});
}

function rest_removeHost(req, res, next) {
	var id = req.params.hostId;
	try {
		var config = hosts[id].getConfig();
		delete hosts[id];
		res.send({host: config, message: 'Host removed successfully'});
	} catch(e) {
		return next(new restify.ResourceNotFoundError('Host not found'));
	}
	next();
	logger.info('Host removed: ' + id);
}

function rest_getHostStatus(req, res, next) {
	var host = hosts[req.params.hostId];
	if (!host) {
		return next(new restify.ResourceNotFoundError('Host does not exist'));
	}
	host.refresh(function(err, config) {
		res.send(config);
		next();
	});
}

function rest_listAllHosts(req, res, next) {
	var response = [];
	var counter = Object.keys(hosts).length;
	if (counter === 0) {
		res.send(response);
		return next();
	}
	for (var i=0; i<Object.keys(hosts).length; i++) {
		var host = hosts[Object.keys(hosts)[i]];
		host.refresh(function(err, config){
			response.push(config);
			counter--;
			if (counter <= 0) {
				// all hosts finished
				res.send(response);
				return next();
			}
		});
	}
}

function rest_abortPeer(req, res, next) {
	try {
		var host = hosts[req.params.hostId];
		host.abortPeer(req.params.peerId, function() {
			res.send({id: req.params.peerId, message: 'Successfully aborted peer'});
			return next();
		})
	} catch(e) {
		console.log(e);
		return next(new restify.ResourceNotFoundError('Peer not found'));
	}
}

server.listen(listenPort, function() {
    logger.info('BOPlish Emulation backend listening on port ' + listenPort);
});
