'use strict';

var api = require( './lib/api.js' ),
	modules = require( './lib/modules.js' ),
	apps = require( './lib/apps.js' );

module.exports = {
	init: function () {
		this.load();
		this.start();

		return this;
	},
	load: function () {
		api.init();
		modules.init();
	},
	start: function () {
		apps.init();
	}
};