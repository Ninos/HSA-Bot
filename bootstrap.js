'use strict';

var HSA_Bot = {
	config: null,
	lib: {},
	modules: {},
	init: function () {
		const config = require( './config.js' ),
			api = require( './lib/api.js' ).init(),
			parse = require( './lib/parse.js' ),
			cache = require( './lib/cache.js' );

		this.config = config;
		this.lib = {
			api: api,
			parse: parse,
			cache: cache
		};

		this.load();
		this.start();
	},
	load: function () {
		var fs = require( 'fs' ),
			path = './modules/',
			files = fs.readdirSync( path );

		for ( var i = 0; i < files.length; i ++ ) {
			var filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				var module = require( path + filename ).init( this );
				this.modules[module.name] = module;
			}
		}
	},
	start: function () {
		var app = require( './app/irc.js' ).init( this );
	}
};
HSA_Bot.init();