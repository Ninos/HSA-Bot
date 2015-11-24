'use strict';

var HSA_Bot = {
	global: {},
	modules: {},
	init: function () {
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
	load: function () {
		var fs = require( 'fs' );

		var path = './modules/';
		var files = fs.readdirSync( path );

		for ( var i = 0; i < files.length; i ++ ) {
			var filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				var module = require( path + filename ).init( this.global );
				this.modules[module.name] = module;
			}
		}
	},
	start: function () {
		var app = require( './app/irc.js' ).init( this.global );
	}
};
HSA_Bot.init();