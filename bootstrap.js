'use strict';

module.exports = {
	init: function () {
		this.load();
		this.start();

		return this;
	},
	load: function () {
		var api = require( './lib/api.js' ).init(),
			modules = require( './lib/modules.js' ).init();
	},
	start: function () {
		var app = require( './app/irc.js' ).init();
	}
};