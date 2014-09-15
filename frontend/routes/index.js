var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

/* GET host-overview page. */
router.get('/host-overview', function(req, res) {
	res.render('host-overview', {
		title: 'Host Overview'
	});
});

/* GET host-detail page. */
router.get('/host-detail/:hostid', function(req, res) {
	res.render('host-detail', {
		title: 'Host Detail ' + req.params.hostid,
		hostid: req.params.hostid
	});
});

/* GET host-detail page. */
router.get('/peer-detail/:peerid', function(req, res) {
	res.render('peer-detail', {
		title: 'Peer Detail ' + req.params.peerid,
		peerid: req.params.peerid
	});
});

module.exports = router;
