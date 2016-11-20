"use strict";

var rides = require('../controllers/ride.controller.server.js');

module.exports = function(app) {
	app.post('/api/ride', rides.post);
	app.get('/api/ride', rides.list);
};
