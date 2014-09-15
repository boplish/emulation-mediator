var assert = require('assert');
/*var monk = require('monk');
var db = monk('localhost:27017/boplishEmuMediator');

var db_hostsActive = db.get('hostsActive');
var db_hostsToRegister = db.get('hostsToRegister');
var db_hostsToRemove = db.get('hostsToRemove');

describe('Host', function() {
	var test_host = {ip:'127.0.0.1', port:8080};
	it('should add host to registration collection', function(done) {
		db_hostsToRegister.insert(test_host, function(err, entry) {
			test_host._id = entry._id;
			assert.equal(entry.ip, test_host.ip);
			assert.equal(entry.port, test_host.port);
			done();
		});
	});
	it('should move host to active collection', function(done) {
		setTimeout(function(){
			db_hostsActive.findOne(test_host._id, function(err, entry) {
				assert.notEqual(entry, null);
				assert.notEqual(entry, undefined);
				assert.equal(entry.ip, test_host.ip);
				assert.equal(entry.port, test_host.port);
				done();
			});
		}, 150);
	});
});
*/