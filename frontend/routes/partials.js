var express = require('express');
var router = express.Router();

router.get('/getHosts', function(req, res) {
	var appLogic = req.appLogic;
	appLogic.getHosts(function(docs) {
		res.render('getHosts', {layout: false, data: docs});
	});
}

module.exports = router;