'use strict';

var HSA_Bot = {
	global: {},
	modules: [],
	init: function() {
		const config = require( './config.js' );
		const api = require( './lib/api.js' ).init();
		const parse = require( './lib/parse.js' );

		this.global = {
			config: config,
			api: api,
			parse: parse
		};

		this.load();
		this.start();
	},
	load: function() {
		require('./module/help.js' ).init( this.global );
	},
	start: function() {
		var app = require( './app/irc.js' ).init( this.global );
	}
}
HSA_Bot.init();